import type { RideEstimateRequest, RideEstimate, OlaAPIResponse } from '@/types/ride';
import { calculateDistance, generateMockEstimate } from './mock-data';

const OLA_API_BASE_URL = 'https://cloud.olakrutrim.com/api'; // Update with actual Ola API endpoint

/**
 * Fetch price estimate from Ola API (Krutrim Cloud)
 * Requires API Key and OAuth credentials
 */
export async function getOlaPriceEstimate(
  request: RideEstimateRequest
): Promise<RideEstimate> {
  const apiKey = process.env.NEXT_PUBLIC_OLA_API_KEY;

  if (!apiKey) {
    console.warn('Ola API key not configured, using mock data');
    return getMockOlaEstimate(request);
  }

  try {
    const { pickup, destination } = request;

    // Format coordinates as "lat,lng" string
    const origin = `${pickup.coordinates.latitude},${pickup.coordinates.longitude}`;
    const destinationCoord = `${destination.coordinates.latitude},${destination.coordinates.longitude}`;

    const params = new URLSearchParams({
      origin,
      destination: destinationCoord,
      mode: request.carType || 'cab', // Options: two-wheeler, auto, cab
    });

    const response = await fetch(
      `${OLA_API_BASE_URL}/ride/estimate?${params.toString()}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        next: { revalidate: 300 }, // Cache for 5 minutes
      }
    );

    if (!response.ok) {
      throw new Error(`Ola API error: ${response.status} ${response.statusText}`);
    }

    const data: OlaAPIResponse = await response.json();

    if (!data.estimates || data.estimates.length === 0) {
      return {
        service: 'ola',
        price: 0,
        currency: 'INR',
        available: false,
        error: 'No rides available',
      };
    }

    // Get the first estimate
    const estimate = data.estimates[0];

    return {
      service: 'ola',
      price: estimate.fare,
      currency: estimate.currency,
      estimatedDuration: estimate.duration,
      distance: estimate.distance,
      carType: estimate.vehicle_type,
      available: true,
    };
  } catch (error) {
    console.error('Error fetching Ola price:', error);
    return {
      service: 'ola',
      price: 0,
      currency: 'INR',
      available: false,
      error: error instanceof Error ? error.message : 'Failed to fetch Ola price',
    };
  }
}

/**
 * Mock Ola estimate for testing/demo purposes
 */
function getMockOlaEstimate(request: RideEstimateRequest): RideEstimate {
  const distance = calculateDistance(
    request.pickup.coordinates,
    request.destination.coordinates
  );

  const mockData = generateMockEstimate('ola', distance);

  return {
    service: 'ola',
    ...mockData,
    available: true,
  };
}
