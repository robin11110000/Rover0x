import type { RideEstimateRequest, RideEstimate, UberAPIResponse } from '@/types/ride';
import { calculateDistance, generateMockEstimate } from './mock-data';

const UBER_API_BASE_URL = 'https://api.uber.com/v1.2';

/**
 * Fetch price estimate from Uber API
 * Endpoint: GET /v1.2/estimates/price
 * Docs: https://developer.uber.com/docs/riders/references/api/v1.2/estimates-price-get
 */
export async function getUberPriceEstimate(
  request: RideEstimateRequest
): Promise<RideEstimate> {
  const serverToken = process.env.NEXT_PUBLIC_UBER_SERVER_TOKEN;

  if (!serverToken) {
    console.warn('Uber API token not configured, using mock data');
    return getMockUberEstimate(request);
  }

  try {
    const { pickup, destination } = request;

    const params = new URLSearchParams({
      start_latitude: pickup.coordinates.latitude.toString(),
      start_longitude: pickup.coordinates.longitude.toString(),
      end_latitude: destination.coordinates.latitude.toString(),
      end_longitude: destination.coordinates.longitude.toString(),
    });

    const response = await fetch(
      `${UBER_API_BASE_URL}/estimates/price?${params.toString()}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Token ${serverToken}`,
          'Accept-Language': 'en_US',
          'Content-Type': 'application/json',
        },
        next: { revalidate: 300 }, // Cache for 5 minutes
      }
    );

    if (!response.ok) {
      throw new Error(`Uber API error: ${response.status} ${response.statusText}`);
    }

    const data: UberAPIResponse = await response.json();

    if (!data.prices || data.prices.length === 0) {
      return {
        service: 'uber',
        price: 0,
        currency: 'USD',
        available: false,
        error: 'No rides available',
      };
    }

    // Get the first estimate (usually UberX or most common option)
    const estimate = data.prices[0];

    return {
      service: 'uber',
      price: (estimate.low_estimate + estimate.high_estimate) / 2, // Average price
      currency: estimate.currency_code,
      estimatedDuration: estimate.duration,
      distance: estimate.distance,
      carType: estimate.display_name,
      priceRange: {
        low: estimate.low_estimate,
        high: estimate.high_estimate,
      },
      available: true,
    };
  } catch (error) {
    console.error('Error fetching Uber price:', error);
    return {
      service: 'uber',
      price: 0,
      currency: 'USD',
      available: false,
      error: error instanceof Error ? error.message : 'Failed to fetch Uber price',
    };
  }
}

/**
 * Mock Uber estimate for testing/demo purposes
 */
function getMockUberEstimate(request: RideEstimateRequest): RideEstimate {
  const distance = calculateDistance(
    request.pickup.coordinates,
    request.destination.coordinates
  );

  const mockData = generateMockEstimate('uber', distance);

  return {
    service: 'uber',
    ...mockData,
    available: true,
  };
}
