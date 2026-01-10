import type { 
  RideEstimateRequest, 
  RideEstimate, 
  BlaBlaCarAPIResponse 
} from '@/types/ride';
import { calculateDistance, generateMockEstimate } from './mock-data';

const BLABLACAR_API_BASE_URL = 'https://public-api.blablacar.com';

/**
 * Fetch price estimate from BlaBlaCar API
 * Documentation: https://dev.blablacar.com/
 * Note: BlaBlaCar is a carpooling service, prices may vary based on driver
 */
export async function getBlaBlaCarPriceEstimate(
  request: RideEstimateRequest
): Promise<RideEstimate> {
  const apiKey = process.env.NEXT_PUBLIC_BLABLACAR_API_KEY;

  if (!apiKey) {
    console.warn('BlaBlaCar API key not configured, using mock data');
    return getMockBlaBlaCarEstimate(request);
  }

  try {
    const { pickup, destination, scheduledTime, seats } = request;

    // Format coordinates as "lat,lng" string
    const fromCoordinate = `${pickup.coordinates.latitude},${pickup.coordinates.longitude}`;
    const toCoordinate = `${destination.coordinates.latitude},${destination.coordinates.longitude}`;

    const params = new URLSearchParams({
      key: apiKey,
      from_coordinate: fromCoordinate,
      to_coordinate: toCoordinate,
      requested_seats: (seats || 1).toString(),
    });

    // Add optional scheduled time
    if (scheduledTime) {
      params.append('start_date_local', scheduledTime.toISOString());
    }

    const response = await fetch(
      `${BLABLACAR_API_BASE_URL}/api/v3/trips?${params.toString()}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        next: { revalidate: 300 }, // Cache for 5 minutes
      }
    );

    if (!response.ok) {
      throw new Error(`BlaBlaCarAPI error: ${response.status} ${response.statusText}`);
    }

    const data: BlaBlaCarAPIResponse = await response.json();

    if (!data.trips || data.trips.length === 0) {
      return {
        service: 'blablacar',
        price: 0,
        currency: 'EUR',
        available: false,
        error: 'No carpools available',
      };
    }

    // Get the cheapest trip
    const cheapestTrip = data.trips.reduce((prev, current) =>
      parseFloat(current.price.amount) < parseFloat(prev.price.amount) ? current : prev
    );

    return {
      service: 'blablacar',
      price: parseFloat(cheapestTrip.price.amount),
      currency: cheapestTrip.price.currency,
      estimatedDuration: cheapestTrip.duration.value,
      distance: cheapestTrip.distance.value,
      carType: `Carpool (${cheapestTrip.seats_left} seats left)`,
      available: true,
    };
  } catch (error) {
    console.error('Error fetching BlaBlaCar price:', error);
    return {
      service: 'blablacar',
      price: 0,
      currency: 'EUR',
      available: false,
      error: error instanceof Error ? error.message : 'Failed to fetch BlaBlaCar price',
    };
  }
}

/**
 * Mock BlaBlaCar estimate for testing/demo purposes
 * Note: BlaBlaCar is typically cheaper than taxis/ride-sharing
 */
function getMockBlaBlaCarEstimate(request: RideEstimateRequest): RideEstimate {
  const distance = calculateDistance(
    request.pickup.coordinates,
    request.destination.coordinates
  );

  const mockData = generateMockEstimate('blablacar', distance);

  return {
    service: 'blablacar',
    ...mockData,
    available: true,
  };
}
