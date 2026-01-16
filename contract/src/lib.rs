// Copyright (c) Rover Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

/*! ABI of Rover Price Aggregation Application */

use async_graphql::{Request, Response};
use linera_sdk::abi::{ContractAbi, ServiceAbi};
use serde::{Deserialize, Serialize};

/// The marker type that connects types used to interface with the application.
pub struct Abi;

impl ContractAbi for Abi {
    type Operation = Operation;
    type Response = PriceComparison;
}

impl ServiceAbi for Abi {
    type Query = Request;
    type QueryResponse = Response;
}

/// Location data structure for pickup/dropoff
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Location {
    pub lat: f64,
    pub lng: f64,
    pub address: String,
}

/// Price information from a provider
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Price {
    pub provider: String,
    pub amount: u64,
    pub currency: String,
    pub eta_minutes: u32,
    pub vehicle_type: String,
    pub surge_multiplier: Option<f64>,
}

/// Complete price comparison result
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PriceComparison {
    pub cheapest: Price,
    pub all_options: Vec<Price>,
    pub timestamp: u64,
    pub pickup: Location,
    pub dropoff: Location,
}

/// Price query request parameters
#[derive(Debug, Serialize, Deserialize)]
pub struct PriceQuery {
    pub pickup: Location,
    pub dropoff: Location,
    pub timestamp: Option<u64>,
}

/// Operations that contract can handle.
#[derive(Debug, Deserialize, Eq, PartialEq, Serialize)]
pub enum Operation {
    /// Query prices from all providers for given route
    QueryPrices(PriceQuery),
    /// Store price query result
    StorePriceResult(PriceComparison),
    /// Subscribe to price updates for a route
    SubscribeToUpdates(PriceQuery),
}

/// Supported ride providers
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum Provider {
    Ola,
    Uber,
    Rapido,
    BlaBlaCar,
}

impl Provider {
    /// Get API endpoint for this provider
    pub fn api_endpoint(&self) -> &'static str {
        match self {
            Provider::Ola => "https://api.olacabs.com/v1/products",
            Provider::Uber => "https://api.uber.com/v1.2/estimates/price",
            Provider::Rapido => "https://api.rapido.bike/booking/estimate",
            Provider::BlaBlaCar => "https://api.blablacar.com/api/v3/trips",
        }
    }

    /// Get provider name as string
    pub fn as_str(&self) -> &'static str {
        match self {
            Provider::Ola => "Ola",
            Provider::Uber => "Uber",
            Provider::Rapido => "Rapido",
            Provider::BlaBlaCar => "BlaBlaCar",
        }
    }
}