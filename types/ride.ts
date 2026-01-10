// Ride service types and interfaces

export type RideService = 'uber' | 'ola' | 'blablacar' | 'rapido';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface RideLocation {
  coordinates: Coordinates;
  address?: string;
}

export interface RideEstimateRequest {
  pickup: RideLocation;
  destination: RideLocation;
  seats?: number;
  carType?: string;
  scheduledTime?: Date;
}

export interface RideEstimate {
  service: RideService;
  price: number;
  currency: string;
  estimatedDuration?: number; // in minutes
  distance?: number; // in kilometers
  carType?: string;
  priceRange?: {
    low: number;
    high: number;
  };
  available: boolean;
  error?: string;
}

export interface UberPriceEstimate {
  localized_display_name: string;
  distance: number;
  display_name: string;
  product_id: string;
  high_estimate: number;
  low_estimate: number;
  duration: number;
  estimate: string;
  currency_code: string;
}

export interface UberAPIResponse {
  prices: UberPriceEstimate[];
}

export interface OlaEstimate {
  distance: number;
  duration: number;
  fare: number;
  currency: string;
  vehicle_type: string;
}

export interface OlaAPIResponse {
  estimates: OlaEstimate[];
  status: string;
}

export interface BlaBlaCarTrip {
  id: string;
  price: {
    amount: string;
    currency: string;
  };
  distance: {
    value: number;
    unit: string;
  };
  duration: {
    value: number;
    unit: string;
  };
  seats_left: number;
  departure_date: string;
}

export interface BlaBlaCarAPIResponse {
  trips: BlaBlaCarTrip[];
  total: number;
}

export interface RapidoEstimate {
  fare: number;
  distance: number;
  duration: number;
  vehicle_type: string;
}

export interface RapidoAPIResponse {
  estimate: RapidoEstimate;
  success: boolean;
  message?: string;
}

export interface PriceComparisonResult {
  estimates: RideEstimate[];
  cheapest?: RideEstimate;
  fastest?: RideEstimate;
  timestamp: Date;
}
