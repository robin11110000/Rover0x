"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { RideEstimate } from "@/types/ride";

interface ServiceCardProps {
  estimate: RideEstimate;
  isCheapest?: boolean;
  isFastest?: boolean;
}

export function ServiceCard({
  estimate,
  isCheapest = false,
  isFastest = false,
}: ServiceCardProps) {
  const serviceNames: Record<string, string> = {
    uber: "Uber",
    ola: "Ola",
    rapido: "Rapido",
    blablacar: "BlaBlaCar",
  };

  const serviceColors: Record<string, string> = {
    uber: "from-black to-gray-800",
    ola: "from-green-500 to-green-600",
    rapido: "from-yellow-400 to-yellow-500",
    blablacar: "from-blue-500 to-blue-600",
  };

  const serviceName = serviceNames[estimate.service] || estimate.service;
  const serviceColor = serviceColors[estimate.service] || "from-gray-500 to-gray-600";

  // Format price with currency symbol
  const formatPrice = (price: number, currency: string): string => {
    const symbols: Record<string, string> = {
      USD: "$",
      INR: "₹",
      EUR: "€",
      GBP: "£",
    };
    const symbol = symbols[currency] || currency;
    return `${symbol}${price.toFixed(2)}`;
  };

  return (
    <Card
      className={`relative overflow-hidden transition-all hover:shadow-lg ${
        isCheapest ? "ring-2 ring-green-500 shadow-green-500/20" : ""
      } ${
        isFastest ? "ring-2 ring-blue-500 shadow-blue-500/20" : ""
      }`}
    >
      {/* Service Header with Gradient */}
      <div className={`h-2 bg-gradient-to-r ${serviceColor}`} />

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-2xl">{serviceName}</CardTitle>
            <CardDescription>{estimate.carType || "Standard"}</CardDescription>
          </div>
          {isCheapest && (
            <span className="inline-flex items-center px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full dark:bg-green-900 dark:text-green-100">
              Cheapest
            </span>
          )}
          {isFastest && !isCheapest && (
            <span className="inline-flex items-center px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-100">
              Fastest
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {estimate.available ? (
          <>
            {/* Price */}
            <div>
              <div className="text-3xl font-bold text-foreground">
                {formatPrice(estimate.price, estimate.currency)}
              </div>
              {estimate.priceRange && (
                <div className="text-sm text-muted-foreground">
                  Range: {formatPrice(estimate.priceRange.low, estimate.currency)} - {formatPrice(estimate.priceRange.high, estimate.currency)}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              {estimate.distance && (
                <div>
                  <div className="text-muted-foreground">Distance</div>
                  <div className="font-medium">{estimate.distance.toFixed(1)} km</div>
                </div>
              )}
              {estimate.estimatedDuration && (
                <div>
                  <div className="text-muted-foreground">Duration</div>
                  <div className="font-medium">{estimate.estimatedDuration} min</div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="py-4 text-center">
            <p className="text-muted-foreground">
              {estimate.error || "Not available"}
            </p>
          </div>
        )}
      </CardContent>

    </Card>
  );
}
