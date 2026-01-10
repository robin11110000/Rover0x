import type { Coordinates } from '@/types/ride';

/**
 * Enhanced mock data generator with realistic pricing
 */

// Base pricing structures for different services (per km rates) - All in INR for Indian market
const PRICING_MODELS = {
  uber: {
    baseFare: 50,
    perKmRate: 13,
    currency: 'INR',
    carTypes: ['UberX', 'UberXL', 'Uber Comfort'],
    speedFactor: 0.5, // km per minute
    variability: 0.15, // 15% price variance
  },
  ola: {
    baseFare: 25,
    perKmRate: 12,
    currency: 'INR',
    carTypes: ['Mini', 'Prime Sedan', 'Prime SUV'],
    speedFactor: 0.45,
    variability: 0.12,
  },
  rapido: {
    baseFare: 15,
    perKmRate: 7,
    currency: 'INR',
    carTypes: ['Bike', 'Auto', 'Rapido Lite'],
    speedFactor: 0.6, // Bikes are faster in traffic
    variability: 0.10,
  },
  blablacar: {
    baseFare: 20,
    perKmRate: 9,
    currency: 'INR',
    carTypes: ['Carpool', 'Long Distance'],
    speedFactor: 0.55,
    variability: 0.20, // Higher variance due to driver pricing
  },
};

/**
 * Calculate distance between two coordinates using Haversine formula
 */
export function calculateDistance(
  coord1: Coordinates,
  coord2: Coordinates
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(coord2.latitude - coord1.latitude);
  const dLon = toRad(coord2.longitude - coord1.longitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(coord1.latitude)) *
    Math.cos(toRad(coord2.latitude)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Add realistic variance to pricing
 */
function addVariance(price: number, variability: number): number {
  const variance = (Math.random() - 0.5) * 2 * variability;
  return price * (1 + variance);
}

/**
 * Generate mock price estimate for a service
 */
export function generateMockEstimate(
  service: 'uber' | 'ola' | 'rapido' | 'blablacar',
  distance: number
) {
  const model = PRICING_MODELS[service];

  // Calculate base price
  const basePrice = model.baseFare + (distance * model.perKmRate);

  // Add realistic variance
  const price = addVariance(basePrice, model.variability);

  // Calculate duration based on distance and speed factor
  const duration = Math.ceil(distance / model.speedFactor);

  // Select random car type
  const carType = model.carTypes[Math.floor(Math.random() * model.carTypes.length)];

  // Calculate price range (±10%)
  const lowEstimate = price * 0.9;
  const highEstimate = price * 1.1;

  return {
    price: parseFloat(price.toFixed(2)),
    currency: model.currency,
    duration,
    distance: parseFloat(distance.toFixed(2)),
    carType,
    priceRange: {
      low: parseFloat(lowEstimate.toFixed(2)),
      high: parseFloat(highEstimate.toFixed(2)),
    },
  };
}

/**
 * Common sample locations for quick testing - Indian locations only
 */
export const SAMPLE_LOCATIONS = {
  // Mumbai, India
  mumbaiAirport: { latitude: 19.0896, longitude: 72.8656, name: 'Mumbai Airport' },
  gatewayOfIndia: { latitude: 18.9220, longitude: 72.8347, name: 'Gateway of India' },
  bandraKurla: { latitude: 19.0606, longitude: 72.8688, name: 'Bandra Kurla Complex' },
  andheri: { latitude: 19.1136, longitude: 72.8697, name: 'Andheri' },

  // Delhi, India
  delhiAirport: { latitude: 28.5562, longitude: 77.1000, name: 'Delhi Airport' },
  indiaGate: { latitude: 28.6129, longitude: 77.2295, name: 'India Gate' },
  connaught: { latitude: 28.6315, longitude: 77.2167, name: 'Connaught Place' },
  saket: { latitude: 28.5244, longitude: 77.2066, name: 'Saket' },

  // Bangalore, India
  bangaloreAirport: { latitude: 13.1979, longitude: 77.7063, name: 'Bangalore Airport' },
  mgRoad: { latitude: 12.9716, longitude: 77.5946, name: 'MG Road' },
  koramangala: { latitude: 12.9352, longitude: 77.6245, name: 'Koramangala' },
  whitefield: { latitude: 12.9698, longitude: 77.7499, name: 'Whitefield' },
};

/**
 * Popular route presets - Indian locations only
 */
export const POPULAR_ROUTES = [
  {
    name: 'Mumbai Airport to Gateway',
    pickup: SAMPLE_LOCATIONS.mumbaiAirport,
    destination: SAMPLE_LOCATIONS.gatewayOfIndia,
  },
  {
    name: 'Delhi Airport to India Gate',
    pickup: SAMPLE_LOCATIONS.delhiAirport,
    destination: SAMPLE_LOCATIONS.indiaGate,
  },
  {
    name: 'Bangalore Airport to MG Road',
    pickup: SAMPLE_LOCATIONS.bangaloreAirport,
    destination: SAMPLE_LOCATIONS.mgRoad,
  },
  {
    name: 'Mumbai BKC to Andheri',
    pickup: SAMPLE_LOCATIONS.bandraKurla,
    destination: SAMPLE_LOCATIONS.andheri,
  },
  {
    name: 'Delhi Connaught to Saket',
    pickup: SAMPLE_LOCATIONS.connaught,
    destination: SAMPLE_LOCATIONS.saket,
  },
  {
    name: 'Bangalore Koramangala to Whitefield',
    pickup: SAMPLE_LOCATIONS.koramangala,
    destination: SAMPLE_LOCATIONS.whitefield,
  },
];
