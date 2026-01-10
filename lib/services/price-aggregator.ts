import type { RideEstimateRequest, RideEstimate, PriceComparisonResult } from '@/types/ride';
import { getUberPriceEstimate } from './uber-api';
import { getOlaPriceEstimate } from './ola-api';
import { getBlaBlaCarPriceEstimate } from './blablacar-api';
import { getRapidoPriceEstimate } from './rapido-api';

/**
 * Aggregates prices from all ride-sharing services
 * Calls all APIs in parallel for optimal performance
 */
export async function getAllRidePrices(
  request: RideEstimateRequest
): Promise<PriceComparisonResult> {
  console.log('Fetching prices from all services...');

  try {
    // Fetch all prices in parallel
    const [uber, ola, blablacar, rapido] = await Promise.allSettled([
      getUberPriceEstimate(request),
      getOlaPriceEstimate(request),
      getBlaBlaCarPriceEstimate(request),
      getRapidoPriceEstimate(request),
    ]);

    // Extract results, filtering out rejected promises
    const estimates: RideEstimate[] = [];

    if (uber.status === 'fulfilled') estimates.push(uber.value);
    if (ola.status === 'fulfilled') estimates.push(ola.value);
    if (blablacar.status === 'fulfilled') estimates.push(blablacar.value);
    if (rapido.status === 'fulfilled') estimates.push(rapido.value);

    // Filter only available rides
    const availableEstimates = estimates.filter(e => e.available);

    // Find cheapest and fastest options
    const cheapest = findCheapest(availableEstimates);
    const fastest = findFastest(availableEstimates);

    return {
      estimates,
      cheapest,
      fastest,
      timestamp: new Date(),
    };
  } catch (error) {
    console.error('Error aggregating ride prices:', error);
    throw error;
  }
}

/**
 * Find the cheapest ride option
 * Normalizes all prices to USD for comparison
 */
function findCheapest(estimates: RideEstimate[]): RideEstimate | undefined {
  if (estimates.length === 0) return undefined;

  return estimates.reduce((prev, current) => {
    const prevPriceUSD = convertToUSD(prev.price, prev.currency);
    const currentPriceUSD = convertToUSD(current.price, current.currency);
    return currentPriceUSD < prevPriceUSD ? current : prev;
  });
}

/**
 * Find the fastest ride option
 */
function findFastest(estimates: RideEstimate[]): RideEstimate | undefined {
  if (estimates.length === 0) return undefined;

  return estimates.reduce((prev, current) => {
    const prevDuration = prev.estimatedDuration || Infinity;
    const currentDuration = current.estimatedDuration || Infinity;
    return currentDuration < prevDuration ? current : prev;
  });
}

/**
 * Convert price to USD for comparison
 * Uses approximate exchange rates (can be replaced with live rates)
 */
function convertToUSD(price: number, currency: string): number {
  const rates: Record<string, number> = {
    'USD': 1.0,
    'INR': 0.012,  // 1 INR ≈ $0.012
    'EUR': 1.10,   // 1 EUR ≈ $1.10
    'GBP': 1.27,   // 1 GBP ≈ $1.27
  };

  const rate = rates[currency] || 1.0;
  return price * rate;
}

/**
 * Sort estimates by price (lowest to highest)
 */
export function sortByPrice(estimates: RideEstimate[]): RideEstimate[] {
  return [...estimates].sort((a, b) => {
    const priceA = convertToUSD(a.price, a.currency);
    const priceB = convertToUSD(b.price, b.currency);
    return priceA - priceB;
  });
}

/**
 * Sort estimates by duration (fastest to slowest)
 */
export function sortByDuration(estimates: RideEstimate[]): RideEstimate[] {
  return [...estimates].sort((a, b) => {
    const durationA = a.estimatedDuration || Infinity;
    const durationB = b.estimatedDuration || Infinity;
    return durationA - durationB;
  });
}

/**
 * Filter estimates by availability
 */
export function filterAvailable(estimates: RideEstimate[]): RideEstimate[] {
  return estimates.filter(e => e.available);
}

/**
 * Calculate savings compared to the most expensive option
 */
export function calculateSavings(estimates: RideEstimate[]): Map<string, number> {
  const available = filterAvailable(estimates);
  if (available.length === 0) return new Map();

  const pricesUSD = available.map(e => convertToUSD(e.price, e.currency));
  const maxPrice = Math.max(...pricesUSD);

  const savings = new Map<string, number>();
  available.forEach((estimate, index) => {
    const saving = maxPrice - pricesUSD[index];
    savings.set(estimate.service, saving);
  });

  return savings;
}
