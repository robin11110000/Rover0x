"use client";

import { ServiceCard } from "@/components/service-card";
import type { PriceComparisonResult } from "@/types/ride";

interface PriceComparisonCardsProps {
  comparison: PriceComparisonResult;
}

export function PriceComparisonCards({
  comparison,
}: PriceComparisonCardsProps) {
  const { estimates, cheapest, fastest } = comparison;

  // Currency symbols map
  const currencySymbols: Record<string, string> = {
    USD: "$",
    INR: "₹",
    EUR: "€",
    GBP: "£",
  };

  const getCurrencySymbol = (currency: string): string => {
    return currencySymbols[currency] || currency;
  };

  // Sort estimates: available first, then by price
  const sortedEstimates = [...estimates].sort((a, b) => {
    if (a.available && !b.available) return -1;
    if (!a.available && b.available) return 1;
    if (a.available && b.available) {
      return a.price - b.price;
    }
    return 0;
  });

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-foreground">Price Comparison</h2>
        <p className="text-muted-foreground">
          Comparing prices from {estimates.length} ride-sharing services
        </p>
        {cheapest && (
          <p className="text-sm text-green-600 dark:text-green-400">
            Save up to{" "}
            {(() => {
              const maxPrice = Math.max(...estimates.filter(e => e.available).map(e => e.price));
              const savings = maxPrice - cheapest.price;
              return `${getCurrencySymbol(cheapest.currency)}${savings.toFixed(2)}`;
            })()}{" "}
            by choosing {cheapest.service.charAt(0).toUpperCase() + cheapest.service.slice(1)}!
          </p>
        )}
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {sortedEstimates.map((estimate) => (
          <ServiceCard
            key={estimate.service}
            estimate={estimate}
            isCheapest={cheapest?.service === estimate.service}
            isFastest={fastest?.service === estimate.service}
          />
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
        <div className="text-center">
          <div className="text-2xl font-bold text-foreground">
            {estimates.filter(e => e.available).length}
          </div>
          <div className="text-sm text-muted-foreground">Available Services</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {cheapest ? getCurrencySymbol(cheapest.currency) : '-'}{cheapest?.price.toFixed(2) || '-'}
          </div>
          <div className="text-sm text-muted-foreground">Lowest Price</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {fastest?.estimatedDuration || '-'} {fastest ? 'min' : ''}
          </div>
          <div className="text-sm text-muted-foreground">Fastest Ride</div>
        </div>
      </div>

      {/* Timestamp */}
      <p className="text-xs text-center text-muted-foreground">
        Prices updated at {comparison.timestamp.toLocaleTimeString()}
      </p>
    </div>
  );
}
