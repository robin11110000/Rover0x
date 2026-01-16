// Copyright (c) Rover Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

use rover_contract::{Abi, PriceComparison, PriceQuery};
use linera_sdk::{linera_base_types::WithServiceAbi, Service, ServiceRuntime};
use async_graphql::{Request, Response, SimpleObject};

pub struct RoverService {
    runtime: ServiceRuntime<Self>,
}

linera_sdk::service!(RoverService);

impl WithServiceAbi for RoverService {
    type Abi = Abi;
}

impl Service for RoverService {
    type Parameters = String;
    type InstantiationArgument = ();

    async fn load(runtime: ServiceRuntime<Self>) -> Self {
        Self { runtime }
    }

    async fn instantiate(&mut self, _argument: Self::InstantiationArgument) {
        // Initialize service
        self.runtime.application_parameters();
    }

    async fn handle_query(&mut self, _request: Request) -> Response {
        // Handle GraphQL queries for the Rover contract
        let query = _request.query.trim();
        
        if query.contains("getCommutePrices") {
            return self.handle_get_commute_prices(_request).await;
        }
        
        if query.contains("getHistoricalPrices") {
            return self.handle_get_historical_prices(_request).await;
        }
        
        if query.contains("subscribeToPriceUpdates") {
            return self.handle_subscribe_to_updates(_request).await;
        }
        
        if query.contains("getProviderStats") {
            return self.handle_get_provider_stats(_request).await;
        }
        
        Response::from_json(serde_json::json!({
            "errors": vec![format!("Unknown query: {}", query)]
        }))
    }

    async fn store(self) {
        // Service state is read-only, no storage operations needed
    }
}

impl RoverService {
    /// Handle price comparison queries
    async fn handle_get_commute_prices(&mut self, request: &Request) -> Response {
        // Extract parameters from GraphQL request
        let pickup = self.extract_location_from_request(request, "pickup");
        let dropoff = self.extract_location_from_request(request, "dropoff");
        let timestamp = self.extract_timestamp_from_request(request);
        
        if let (Some(pickup), Some(dropoff)) = (pickup, dropoff) {
            let query = PriceQuery { pickup, dropoff, timestamp };
            
            // Query the contract for prices
            let application_id = self.runtime.application_id();
            let contract_query = Request::new(format!(
                r#"
                query GetPrices($pickup: Location!, $dropoff: Location!, $timestamp: Int) {{
                    getPrices(pickup: $pickup, dropoff: $dropoff, timestamp: $timestamp) {{
                        cheapest {{
                            provider
                            amount
                            currency
                            etaMinutes
                            vehicleType
                            surgeMultiplier
                        }}
                        allOptions {{
                            provider
                            amount
                            currency
                            etaMinutes
                            vehicleType
                            surgeMultiplier
                        }}
                        timestamp
                        pickup {{
                            lat
                            lng
                            address
                        }}
                        dropoff {{
                            lat
                            lng
                            address
                        }}
                    }}
                }}
                "#,
            ))
            .variables(json!({
                "pickup": pickup,
                "dropoff": dropoff,
                "timestamp": timestamp,
            }));
            
            let result = self.runtime.query_application(application_id, &contract_query);
            
            return Response::from_json(result);
        }
        
        Response::from_json(serde_json::json!({
            "errors": vec!["Invalid parameters for getCommutePrices"]
        }))
    }

    /// Handle historical price queries
    async fn handle_get_historical_prices(&mut self, request: &Request) -> Response {
        let pickup = self.extract_location_from_request(request, "pickup");
        let dropoff = self.extract_location_from_request(request, "dropoff");
        let time_range = self.extract_string_from_request(request, "timeRange").unwrap_or("day");
        
        if let (Some(pickup), Some(dropoff)) = (pickup, dropoff) {
            let application_id = self.runtime.application_id();
            let contract_query = Request::new(format!(
                r#"
                query GetHistory($pickup: Location!, $dropoff: Location!, $timeRange: String!) {{
                    getHistoricalPrices(pickup: $pickup, dropoff: $dropoff, timeRange: $timeRange) {{
                        cheapest {{
                            provider
                            amount
                            currency
                            etaMinutes
                            vehicleType
                        }}
                        allOptions {{
                            provider
                            amount
                            currency
                            etaMinutes
                            vehicleType
                        }}
                        timestamp
                        routeHash
                    }}
                }}
                "#,
            ))
            .variables(json!({
                "pickup": pickup,
                "dropoff": dropoff,
                "timeRange": time_range,
            }));
            
            let result = self.runtime.query_application(application_id, &contract_query);
            
            return Response::from_json(result);
        }
        
        Response::from_json(serde_json::json!({
            "errors": vec!["Invalid parameters for getHistoricalPrices"]
        }))
    }

    /// Handle price update subscriptions
    async fn handle_subscribe_to_updates(&mut self, request: &Request) -> Response {
        let pickup = self.extract_location_from_request(request, "pickup");
        let dropoff = self.extract_location_from_request(request, "dropoff");
        
        if let (Some(pickup), Some(dropoff)) = (pickup, dropoff) {
            let query = PriceQuery { 
                pickup, 
                dropoff, 
                timestamp: Some(std::time::SystemTime::now()
                    .duration_since(std::time::UNIX_EPOCH)
                    .unwrap()
                    .as_secs() as u64)
            };
            
            let application_id = self.runtime.application_id();
            let contract_query = Request::new(format!(
                r#"
                mutation SubscribeToUpdates($pickup: Location!, $dropoff: Location!, $timestamp: Int) {{
                    subscribeToUpdates(pickup: $pickup, dropoff: $dropoff, timestamp: $timestamp) {{
                        success
                        subscriptionId
                    }}
                }}
                "#,
            ))
            .variables(json!({
                "pickup": pickup,
                "dropoff": dropoff,
                "timestamp": query.timestamp.unwrap(),
            }));
            
            let result = self.runtime.query_application(application_id, &contract_query);
            
            return Response::from_json(result);
        }
        
        Response::from_json(serde_json::json!({
            "errors": vec!["Invalid parameters for subscribeToPriceUpdates"]
        }))
    }

    /// Handle provider statistics queries
    async fn handle_get_provider_stats(&mut self, _request: &Request) -> Response {
        let application_id = self.runtime.application_id();
        let contract_query = Request::new(format!(
            r#"
                query GetProviderStats {{
                    getProviderStats {{
                        ola {{
                            averageResponseTime
                            successRate
                            totalQueries
                        }}
                        uber {{
                            averageResponseTime
                            successRate
                            totalQueries
                        }}
                        rapido {{
                            averageResponseTime
                            successRate
                            totalQueries
                        }}
                        blablacar {{
                            averageResponseTime
                            successRate
                            totalQueries
                        }}
                    }}
                }}
                "#,
            ));
            
            let result = self.runtime.query_application(application_id, &contract_query);
            
            return Response::from_json(result);
        }
    }

    /// Helper function to extract Location from GraphQL request
    fn extract_location_from_request(&self, request: &Request, var_name: &str) -> Option<rover_contract::Location> {
        let variables = request.variables();
        let location = variables.get(var_name)?;
        
        Some(rover_contract::Location {
            lat: location.get("lat")?.as_f64()?,
            lng: location.get("lng")?.as_f64()?,
            address: location.get("address")?.as_str()?.to_string(),
        })
    }

    /// Helper function to extract timestamp from GraphQL request
    fn extract_timestamp_from_request(&self, request: &Request) -> Option<u64> {
        let variables = request.variables();
        let timestamp = variables.get("timestamp")?;
        
        timestamp.as_u64()
    }

    /// Helper function to extract string from GraphQL request
    fn extract_string_from_request(&self, request: &Request, var_name: &str) -> Option<String> {
        let variables = request.variables();
        let value = variables.get(var_name)?;
        
        value.as_str().map(|s| s.to_string())
    }
}