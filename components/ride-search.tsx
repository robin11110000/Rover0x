"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { RideEstimateRequest } from "@/types/ride";
import { POPULAR_ROUTES } from "@/lib/services/mock-data";
import { geocodeLocation, getLocationSuggestions, type Location } from "@/lib/services/geocoding";

interface RideSearchProps {
  onSearch: (request: RideEstimateRequest) => void;
  isLoading?: boolean;
}

export function RideSearch({ onSearch, onResults, isLoading = false }: RideSearchProps) {
  const [pickupLocation, setPickupLocation] = useState("");
  const [destinationLocation, setDestinationLocation] = useState("");
  const [pickupSuggestions, setPickupSuggestions] = useState<Location[]>([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState<Location[]>([]);
  const [showPickupSuggestions, setShowPickupSuggestions] = useState(false);
  const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false);

  const handlePickupChange = (value: string) => {
    setPickupLocation(value);
    if (value.length >= 2) {
      const suggestions = getLocationSuggestions(value, 5);
      setPickupSuggestions(suggestions);
      setShowPickupSuggestions(true);
    } else {
      setShowPickupSuggestions(false);
    }
  };

  const handleDestinationChange = (value: string) => {
    setDestinationLocation(value);
    if (value.length >= 2) {
      const suggestions = getLocationSuggestions(value, 5);
      setDestinationSuggestions(suggestions);
      setShowDestinationSuggestions(true);
    } else {
      setShowDestinationSuggestions(false);
    }
  };

  const selectPickupSuggestion = (location: Location) => {
    setPickupLocation(location.name);
    setShowPickupSuggestions(false);
  };

  const selectDestinationSuggestion = (Location) => {
    setDestinationLocation(location.name);
    setShowDestinationSuggestions(false);
  };

  const handleLineraSearch = async () => {
    // Geocode both locations
    const pickupCoords = await geocodeLocation(pickupLocation);
    const destCoords = await geocodeLocation(destinationLocation);

    if (!pickupCoords || !destCoords) {
      alert(`Please select valid pickup and destination locations.`);
      return;
    }

    if (walletState.isConnected) {
      setIsLineraSearch(true);
      
      try {
        // Query Linera smart contract for prices
        const query = `
          query GetPrices($pickup: Location!, $dropoff: Location!) {
            getPrices(pickup: $pickup, dropoff: $dropoff, timestamp: ${Date.now()}) {
              cheapest { provider amount currency etaMinutes vehicleType surgeMultiplier }
              allOptions { provider amount currency etaMinutes vehicleType surgeMultiplier }
              timestamp
              pickup { lat lng address }
              dropoff { lat lng address }
            }
          }
        `;
        
        const variables = {
          pickup: {
            lat: pickupCoords.lat,
            lng: pickupCoords.lng,
            address: pickupLocation,
          },
          dropoff: {
            lat: destCoords.lat,
            lng: destCoords.lng,
            address: destinationLocation,
          },
        };
        
        const result = await queryContract('app_123', query, variables);
        
        if (result?.data?.getPrices && onResults) {
          onResults(result.data.getPrices);
        }
        
        setIsLineraSearch(false);
      } catch (error) {
        console.error('Linera search failed:', error);
        alert('Failed to query Linera contract. Using fallback search.');
        setIsLineraSearch(false);
      }
    }
  };

  const handleSearch = async () => {
    if (walletState.isConnected) {
      await handleLineraSearch();
    } else {
      // Fallback to traditional search
      const pickupCoords = await geocodeLocation(pickupLocation);
      const destCoords = await geocodeLocation(destinationLocation);

      if (!pickupCoords) {
        alert(`Could not find location: "${pickupLocation}". Please select from suggestions or try another location.`);
        return;
      }

      if (!destCoords) {
        alert(`Could not find location: "${destinationLocation}". Please select from suggestions or try another location.`);
        return;
      }

      const request: RideEstimateRequest = {
        pickup: {
          coordinates: pickupCoords,
          address: pickupLocation,
        },
        destination: {
          coordinates: destCoords,
          address: destinationLocation,
        },
      };

      onSearch(request);
    }
  };

  const loadRoute = (routeIndex: number) => {
    const route = POPULAR_ROUTES[routeIndex];
    if (route) {
      setPickupLocation(route.pickup.name);
      setDestinationLocation(route.destination.name);
      setShowPickupSuggestions(false);
      setShowDestinationSuggestions(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Compare Ride Prices on Linera Microchains</CardTitle>
        <CardDescription>
          {walletState.isConnected 
            ? "Query prices from Linera smart contract with native API integration"
            : "Enter locations to connect Linera wallet for decentralized price comparison"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Pickup Location */}
        <div className="space-y-2 relative">
          <label className="text-sm font-medium text-foreground">
            Pickup Location
          </label>
          <Input
            type="text"
            placeholder="e.g., Mumbai Airport, Koramangala, HITEC City"
            value={pickupLocation}
            onChange={(e) => handlePickupChange(e.target.value)}
            onFocus={() => {
              if (pickupSuggestions.length > 0) {
                setShowPickupSuggestions(true);
              }
            }}
            disabled={isLoading}
          />
          {showPickupSuggestions && pickupSuggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-background border border-border rounded-md shadow-lg max-h-60 overflow-auto">
              {pickupSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => selectPickupSuggestion(suggestion)}
                  className="w-full px-4 py-2 text-left hover:bg-muted transition-colors"
                >
                  <div className="font-medium">{suggestion.name}</div>
                  {suggestion.city && (
                    <div className="text-sm text-muted-foreground">
                      {suggestion.city}, {suggestion.country}
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Destination Location */}
        <div className="space-y-2 relative">
          <label className="text-sm font-medium text-foreground">
            Destination
          </label>
          <Input
            type="text"
            placeholder="e.g., Gateway of India, Connaught Place, Marina Beach"
            value={destinationLocation}
            onChange={(e) => handleDestinationChange(e.target.value)}
            onFocus={() => {
              if (destinationSuggestions.length > 0) {
                setShowDestinationSuggestions(true);
              }
            }}
            disabled={isLoading}
          />
          {showDestinationSuggestions && destinationSuggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-background border border-border rounded-md shadow-lg max-h-60 overflow-auto">
              {destinationSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => selectDestinationSuggestion(suggestion)}
                  className="w-full px-4 py-2 text-left hover:bg-muted transition-colors"
                >
                  <div className="font-medium">{suggestion.name}</div>
                  {suggestion.city && (
                    <div className="text-sm text-muted-foreground">
                      {suggestion.city}, {suggestion.country}
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Popular Routes */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Quick Select Popular Routes
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {POPULAR_ROUTES.map((route, index) => (
              <Button
                key={index}
                onClick={() => loadRoute(index)}
                variant="outline"
                disabled={isLoading}
                className="text-sm"
              >
                {route.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={walletState.isConnected ? handleLineraSearch : handleSearch}
            disabled={isLoading || isLineraSearch || !pickupLocation || !destinationLocation || !walletState.isConnected}
            className="flex-1"
            size="lg"
          >
            {isLineraSearch ? "Querying Linera..." : isLoading ? "Searching..." : walletState.isConnected ? "Compare Prices (Linera)" : "Compare Prices (Connect Wallet)"}
          </Button>
        </div>

        {/* Helper Text */}
        <p className="text-xs text-muted-foreground">
          Tip: Start typing a location name and select from suggestions. Supports airports, landmarks, and major areas across Indian cities.
        </p>
      </CardContent>
    </Card>
  );
}
