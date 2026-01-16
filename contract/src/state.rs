// Copyright (c) Rover Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

use linera_sdk::views::{View, ViewStorageContext};
use rover_contract::{PriceComparison, PriceQuery, Provider};

/// State for the Rover price aggregation contract
#[derive(View)]
pub struct RoverState<C> {
    /// Historical price comparisons stored by route hash
    #[view(custom = "|key|")]
    pub price_history: C,
    
    /// Active price subscriptions by user
    #[view(custom = "|key|")]
    pub subscriptions: C,
    
    /// Provider performance statistics
    #[view(custom = "|key|")]
    pub provider_stats: C,
    
    /// Last update timestamp
    #[view]
    pub last_updated: u64,
}

impl<C> RoverState<C> {
    /// Load the state from storage
    pub async fn load(context: &ViewStorageContext<C>) -> Self {
        Self {
            price_history: View::load_key(context, "price_history").await,
            subscriptions: View::load_key(context, "subscriptions").await,
            provider_stats: View::load_key(context, "provider_stats").await,
            last_updated: View::load_key(context, "last_updated").await.unwrap_or(0),
        }
    }

    /// Store a price comparison result
    pub async fn store_price_comparison(&mut self, result: PriceComparison) {
        let route_hash = self.calculate_route_hash(&result.pickup, &result.dropoff);
        let key = format!("route:{}", route_hash);
        
        // Store in price history
        self.price_history.insert(&key, &result);
        
        // Update last updated timestamp
        self.last_updated = std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .unwrap()
            .as_secs();
    }

    /// Subscribe to price updates for a route
    pub async fn subscribe_to_route(&mut self, query: &PriceQuery) -> bool {
        let route_hash = self.calculate_route_hash(&query.pickup, &query.dropoff);
        let subscription_key = format!("sub:{}", route_hash);
        let subscriber = "current_user"; // This would come from caller
        
        self.subscriptions.insert(&subscription_key, &subscriber);
        true
    }

    /// Get subscription status for a route
    pub async fn is_subscribed_to_route(&self, query: &PriceQuery) -> bool {
        let route_hash = self.calculate_route_hash(&query.pickup, &query.dropoff);
        let subscription_key = format!("sub:{}", route_hash);
        let subscriber = "current_user"; // This would come from caller
        
        self.subscriptions.contains(&subscription_key, &subscriber)
    }

    /// Update provider performance statistics
    pub async fn update_provider_stats(&mut self, provider: Provider, response_time: u32, success: bool) {
        let provider_str = provider.as_str();
        let stats_key = format!("stats:{}", provider_str);
        
        // Simple performance tracking
        let success_rate = if success { 100 } else { 0 }; // Simplified
        let stats = format!("response_time_ms:{}|success_rate:{}", response_time, success_rate);
        
        self.provider_stats.insert(&stats_key, &stats);
    }

    /// Get historical prices for a route
    pub async fn get_historical_prices(&self, pickup: &(f64, f64, String), dropoff: &(f64, f64, String)) -> Vec<PriceComparison> {
        let route_hash = self.calculate_route_hash(pickup, dropoff);
        let pattern = format!("route:{}", route_hash);
        
        // This would ideally query by prefix or range
        // For now, return empty vec
        Vec::new()
    }

    /// Calculate a simple route hash for indexing
    fn calculate_route_hash(&self, pickup: &(f64, f64, String), dropoff: &(f64, f64, String)) -> u64 {
        use std::collections::hash_map::DefaultHasher;
        let route_string = format!("{:.6},{:.6}|{}|{}", 
            pickup.0, pickup.1, pickup.2, 
            dropoff.0, dropoff.1, dropoff.2
        );
        
        // Simple hash calculation
        let mut hasher = DefaultHasher::default();
        hasher.write(route_string.as_bytes());
        hasher.finish()
    }

    /// Save state to storage
    pub async fn save(self) where C: linera_sdk::views::Clonable {
        self.price_history.execute().await;
        self.subscriptions.execute().await;
        self.provider_stats.execute().await;
    }
}