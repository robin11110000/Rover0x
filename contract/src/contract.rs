// Copyright (c) Rover Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

#![cfg_attr(target_arch = "wasm32", no_main)]

use rover_contract::{Abi, Operation, PriceComparison, PriceQuery, Provider};
use linera_sdk::{
    http, linera_base_types::WithContractAbi, Contract as _, ContractRuntime,
};
use serde_json;

pub struct Contract {
    runtime: ContractRuntime<Self>,
}

linera_sdk::contract!(Contract);

impl WithContractAbi for Contract {
    type Abi = Abi;
}

impl linera_sdk::Contract for Contract {
    type Message = PriceQuery;
    type InstantiationArgument = String;
    type Parameters = String;
    type EventValue = PriceComparison;

    async fn load(runtime: ContractRuntime<Self>) -> Self {
        Contract { runtime }
    }

    async fn instantiate(&mut self, api_parameters: String) {
        // Store API configuration parameters
        self.runtime.application_parameters().set(&api_parameters);
    }

    async fn execute_operation(&mut self, operation: Self::Operation) -> Self::Response {
        match operation {
            Operation::QueryPrices(query) => self.query_prices(query).await,
            Operation::StorePriceResult(result) => self.store_price_result(result).await,
            Operation::SubscribeToUpdates(query) => self.subscribe_to_updates(query).await,
        }
    }

    async fn execute_message(&mut self, query: PriceQuery) {
        // Handle cross-chain price queries from other chains
        let result = self.query_prices(query).await;
        self.runtime.store_event(result);
    }

    async fn store(self) {
        // State is automatically persisted by Linera SDK
    }
}

impl Contract {
    /// Query prices from all providers using native HTTP calls
    async fn query_prices(&mut self, query: PriceQuery) -> PriceComparison {
        let timestamp = query.timestamp.unwrap_or_else(|| {
            std::time::SystemTime::now()
                .duration_since(std::time::UNIX_EPOCH)
                .unwrap()
                .as_secs() as u64
        });

        // Parallel API calls using Linera's native HTTP integration
        let (ola_result, uber_result, rapido_result, blablacar_result) = tokio::join!(
            self.fetch_ola_prices(&query),
            self.fetch_uber_prices(&query),
            self.fetch_rapido_prices(&query),
            self.fetch_blablacar_prices(&query),
        );

        let mut all_prices = Vec::new();
        
        if let Ok(price) = ola_result {
            all_prices.push(price);
        }
        if let Ok(price) = uber_result {
            all_prices.push(price);
        }
        if let Ok(price) = rapido_result {
            all_prices.push(price);
        }
        if let Ok(price) = blablacar_result {
            all_prices.push(price);
        }

        // Sort by price (cheapest first)
        all_prices.sort_by(|a, b| a.amount.cmp(&b.amount));

        let cheapest = all_prices.first().cloned().unwrap_or_else(|| {
            Price {
                provider: "None".to_string(),
                amount: 0,
                currency: "INR".to_string(),
                eta_minutes: 0,
                vehicle_type: "Unknown".to_string(),
                surge_multiplier: None,
            }
        });

        let result = PriceComparison {
            cheapest,
            all_options: all_prices,
            timestamp,
            pickup: query.pickup.clone(),
            dropoff: query.dropoff.clone(),
        };

        // Store result for history
        self.runtime.store_event(result.clone());
        result
    }

    async fn fetch_ola_prices(&self, query: &PriceQuery) -> Result<Price, String> {
        let url = self.runtime.application_parameters();
        let api_endpoint = format!("{}/products", url);
        
        let request_body = serde_json::json!({
            "pickup_lat": query.pickup.lat,
            "pickup_lng": query.pickup.lng,
            "drop_lat": query.dropoff.lat,
            "drop_lng": query.dropoff.lng,
        });

        let response = self.runtime.http_request(http::Request::post(&api_endpoint)
            .with_header("Content-Type", "application/json")
            .with_body(request_body.to_string().into_bytes()));

        self.parse_ola_response(response.body).await
    }

    async fn fetch_uber_prices(&self, query: &PriceQuery) -> Result<Price, String> {
        let url = self.runtime.application_parameters();
        let api_endpoint = format!("{}/estimates/price", url);
        
        let request_body = serde_json::json!({
            "start_latitude": query.pickup.lat,
            "start_longitude": query.pickup.lng,
            "end_latitude": query.dropoff.lat,
            "end_longitude": query.dropoff.lng,
        });

        let response = self.runtime.http_request(http::Request::post(&api_endpoint)
            .with_header("Content-Type", "application/json")
            .with_body(request_body.to_string().into_bytes()));

        self.parse_uber_response(response.body).await
    }

    async fn fetch_rapido_prices(&self, query: &PriceQuery) -> Result<Price, String> {
        let url = self.runtime.application_parameters();
        let api_endpoint = format!("{}/estimate", url);
        
        let request_body = serde_json::json!({
            "pickup_latitude": query.pickup.lat,
            "pickup_longitude": query.pickup.lng,
            "drop_latitude": query.dropoff.lat,
            "drop_longitude": query.dropoff.lng,
        });

        let response = self.runtime.http_request(http::Request::post(&api_endpoint)
            .with_header("Content-Type", "application/json")
            .with_body(request_body.to_string().into_bytes()));

        self.parse_rapido_response(response.body).await
    }

    async fn fetch_blablacar_prices(&self, query: &PriceQuery) -> Result<Price, String> {
        let url = self.runtime.application_parameters();
        let api_endpoint = format!("{}/trips", url);
        
        let request_body = serde_json::json!({
            "fn": "search_trips",
            "departure_lat": query.pickup.lat,
            "departure_lng": query.pickup.lng,
            "arrival_lat": query.dropoff.lat,
            "arrival_lng": query.dropoff.lng,
        });

        let response = self.runtime.http_request(http::Request::post(&api_endpoint)
            .with_header("Content-Type", "application/json")
            .with_body(request_body.to_string().into_bytes()));

        self.parse_blablacar_response(response.body).await
    }

    async fn parse_ola_response(&self, body: Vec<u8>) -> Result<Price, String> {
        // Parse Ola API response
        let response_str = String::from_utf8(body)
            .map_err(|e| format!("Invalid UTF-8: {}", e))?;
        
        let json: serde_json::Value = serde_json::from_str(&response_str)
            .map_err(|e| format!("Invalid JSON: {}", e))?;
        
        // Extract pricing information from response
        let products = json["products"].as_array()
            .ok_or("No products array".to_string())?;
        
        let product = products.get(0)
            .and_then(|p| p.as_object())
            .ok_or("No product data".to_string())?;
        
        let pricing = product["pricing"]
            .and_then(|p| p.as_object())
            .ok_or("No pricing data".to_string())?;
        
        let amount = pricing["minimum_amount"]
            .and_then(|v| v.as_u64())
            .ok_or("No amount".to_string())?;
        
        let eta = pricing["eta_minutes"]
            .and_then(|v| v.as_u64())
            .unwrap_or(0) as u32;

        Ok(Price {
            provider: Provider::Ola.as_str().to_string(),
            amount,
            currency: "INR".to_string(),
            eta_minutes: eta,
            vehicle_type: product["category"]
                .and_then(|v| v.as_str())
                .unwrap_or("Auto")
                .to_string(),
            surge_multiplier: pricing["surge_multiplier"]
                .and_then(|v| v.as_f64()),
        })
    }

    async fn parse_uber_response(&self, body: Vec<u8>) -> Result<Price, String> {
        // Parse Uber API response
        let response_str = String::from_utf8(body)
            .map_err(|e| format!("Invalid UTF-8: {}", e))?;
        
        let json: serde_json::Value = serde_json::from_str(&response_str)
            .map_err(|e| format!("Invalid JSON: {}", e))?;
        
        let prices = json["prices"].as_array()
            .ok_or("No prices array".to_string())?;
        
        let price_entry = prices.get(0)
            .and_then(|p| p.as_object())
            .ok_or("No price data".to_string())?;
        
        let amount = price_entry["high_estimate"]
            .and_then(|v| v.as_u64())
            .ok_or("No amount".to_string())?;
        
        let eta = price_entry["duration"]
            .and_then(|v| v.as_u64())
            .unwrap_or(0) as u32;

        Ok(Price {
            provider: Provider::Uber.as_str().to_string(),
            amount,
            currency: "INR".to_string(),
            eta_minutes: eta / 60, // Convert seconds to minutes
            vehicle_type: price_entry["display_name"]
                .and_then(|v| v.as_str())
                .unwrap_or("UberX")
                .to_string(),
            surge_multiplier: price_entry["surge_multiplier"]
                .and_then(|v| v.as_f64()),
        })
    }

    async fn parse_rapido_response(&self, body: Vec<u8>) -> Result<Price, String> {
        // Parse Rapido API response
        let response_str = String::from_utf8(body)
            .map_err(|e| format!("Invalid UTF-8: {}", e))?;
        
        let json: serde_json::Value = serde_json::from_str(&response_str)
            .map_err(|e| format!("Invalid JSON: {}", e))?;
        
        let estimate = json["estimate"]
            .and_then(|v| v.as_object())
            .ok_or("No estimate data".to_string())?;
        
        let amount = estimate["fare"]
            .and_then(|v| v.as_u64())
            .ok_or("No amount".to_string())?;
        
        let eta = estimate["eta_minutes"]
            .and_then(|v| v.as_u64())
            .unwrap_or(0) as u32;

        Ok(Price {
            provider: Provider::Rapido.as_str().to_string(),
            amount,
            currency: "INR".to_string(),
            eta_minutes: eta,
            vehicle_type: estimate["vehicle_type"]
                .and_then(|v| v.as_str())
                .unwrap_or("Bike")
                .to_string(),
            surge_multiplier: estimate["surge_multiplier"]
                .and_then(|v| v.as_f64()),
        })
    }

    async fn parse_blablacar_response(&self, body: Vec<u8>) -> Result<Price, String> {
        // Parse BlaBlaCar API response
        let response_str = String::from_utf8(body)
            .map_err(|e| format!("Invalid UTF-8: {}", e))?;
        
        let json: serde_json::Value = serde_json::from_str(&response_str)
            .map_err(|e| format!("Invalid JSON: {}", e))?;
        
        let trips = json["trips"].as_array()
            .ok_or("No trips array".to_string())?;
        
        let trip = trips.get(0)
            .and_then(|p| p.as_object())
            .ok_or("No trip data".to_string())?;
        
        let price = trip["price_per_seat"]
            .and_then(|v| v.as_u64())
            .ok_or("No price".to_string())?;
        
        let eta = trip["duration_minutes"]
            .and_then(|v| v.as_u64())
            .unwrap_or(0) as u32;

        Ok(Price {
            provider: Provider::BlaBlaCar.as_str().to_string(),
            amount: price,
            currency: "INR".to_string(),
            eta_minutes: eta,
            vehicle_type: trip["vehicle_type"]
                .and_then(|v| v.as_str())
                .unwrap_or("Car")
                .to_string(),
            surge_multiplier: None, // BlaBlaCar typically doesn't have surge
        })
    }

    async fn store_price_result(&mut self, result: PriceComparison) -> PriceComparison {
        // Store price comparison result
        self.runtime.store_event(result.clone());
        result
    }

    async fn subscribe_to_updates(&mut self, query: PriceQuery) -> PriceComparison {
        // Subscribe to price updates for a route
        // This would set up cross-chain messaging for real-time updates
        let result = self.query_prices(query).await;
        self.runtime.store_event(result.clone());
        result
    }
}

#[path = "unit_tests/contract.rs"]
mod unit_tests;