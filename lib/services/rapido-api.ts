import type { RideEstimateRequest, RideEstimate, RapidoAPIResponse } from '@/types/ride';
import { calculateDistance, generateMockEstimate } from './mock-data';

const RAPIDO_API_BASE_URL = 'https://api.rapido.bike'; // Partner API endpoint (may vary)

/**
 * Fetch price estimate from Rapido API
 * Note: Rapido API is partner-only, not publicly available
 * This will use mock data if partner credentials are not configured
 */
export async function getRapidoPriceEstimate(
  request: RideEstimateRequest
): Promise<RideEstimate> {
  const bearerToken = process.env.RAPIDO_BEARER_TOKEN;
  const csrfToken = process.env.RAPIDO_CSRF_TOKEN;
  const userId = process.env.RAPIDO_PARTNER_USER_ID;

  // If no partner access, use mock data
  if (!bearerToken || !userId) {
    console.warn('Rapido API credentials not configured, using mock data');
    return getMockRapidoEstimate(request);
  }

  try {
    const { pickup, destination } = request;

    const requestBody = {
      pickup_lat: pickup.coordinates.latitude,
      pickup_lng: pickup.coordinates.longitude,
      drop_lat: destination.coordinates.latitude,
      drop_lng: destination.coordinates.longitude,
      user_id: userId,
    };

    const headers: HeadersInit = {
      'Authorization': `Bearer ${bearerToken}`,
      'Content-Type': 'application/json',
    };

    // Add CSRF token if available
    if (csrfToken) {
      headers['X-CSRF-TOKEN'] = csrfToken;
    }

    const response = await fetch(
      `${RAPIDO_API_BASE_URL}/v1/estimate`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody),
        next: { revalidate: 300 }, // Cache for 5 minutes
      }
    );

    if (!response.ok) {
      throw new Error(`Rapido API error: ${response.status} ${response.statusText}`);
    }

    const data: RapidoAPIResponse = await response.json();

    if (!data.success || !data.estimate) {
      return {
        service: 'rapido',
        price: 0,
        currency: 'INR',
        available: false,
        error: data.message || 'No rides available',
      };
    }

    return {
      service: 'rapido',
      price: data.estimate.fare,
      currency: 'INR',
      estimatedDuration: data.estimate.duration,
      distance: data.estimate.distance,
      carType: data.estimate.vehicle_type,
      available: true,
    };
  } catch (error) {
    console.error('Error fetching Rapido price:', error);
    // Fallback to mock data on error
    return getMockRapidoEstimate(request);
  }
}

/**
 * Mock Rapido estimate for testing/demo purposes
 * Rapido is typically cheaper than Ola/Uber, especially for bikes
 */
function getMockRapidoEstimate(request: RideEstimateRequest): RideEstimate {
  const distance = calculateDistance(
    request.pickup.coordinates,
    request.destination.coordinates
  );

  const mockData = generateMockEstimate('rapido', distance);

  return {
    service: 'rapido',
    ...mockData,
    available: true,
  };
}
