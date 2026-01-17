"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import { RideSearch } from "@/components/ride-search";
import { PriceComparisonCards } from "@/components/price-comparison-cards";
import { LineraWalletModal, useLineraWallet } from "@/components/linera-wallet-modal";
import { lineraService } from "@/lib/services/linera";
import type { RideEstimateRequest, PriceComparisonResult } from "@/types/ride";
import { toast } from "sonner";

export default function Home() {
  const { isConnected, address, connect, isLoading } = useLineraWallet();

  const [isSearching, setIsSearching] = useState(false);
  const [comparison, setComparison] = useState<PriceComparisonResult | null>(null);

  const handleSearch = async (request: RideEstimateRequest) => {
    setIsSearching(true);
    setComparison(null);

    try {
      toast.info("Fetching prices from Linera contract...");
      
      const result = await lineraService.queryPrices(
        {
          lat: request.pickup.coordinates.latitude,
          lng: request.pickup.coordinates.longitude,
          address: request.pickup.address || "",
        },
        {
          lat: request.destination.coordinates.latitude,
          lng: request.destination.coordinates.longitude,
          address: request.destination.address || "",
        }
      );
      
      if (result) {
        setComparison(result);
        const availableCount = result.estimates.filter((e) => e.available).length;
        toast.success(`Found ${availableCount} available ride options!`);
      }
    } catch (error) {
      console.error("Error fetching ride prices:", error);
      toast.error("Failed to fetch ride prices. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <Header />

      <main
        className={`container mx-auto flex-1 px-4 ${isConnected ? "py-8" : "flex items-center justify-center"}`}
      >
        {isConnected && address ? (
          <div className="space-y-8">
            {/* Welcome Message */}
            <div className="space-y-2 text-center">
              <h1 className="text-foreground text-4xl font-bold tracking-tight">
                Ride Price Aggregator
              </h1>
              <p className="text-muted-foreground text-xl">
                Compare prices from Uber, Ola, Rapido, and BlaBlaCar on Linera
              </p>
              <p className="text-muted-foreground text-sm">
                Connected: {address.slice(0, 6)}...{address.slice(-4)}
              </p>
            </div>

            {/* Ride Search */}
            <RideSearch onSearch={handleSearch} isLoading={isSearching} />

            {/* Price Comparison Results */}
            {comparison && <PriceComparisonCards comparison={comparison} />}

            {/* Loading State */}
            {isSearching && (
              <div className="py-12 text-center">
                <div className="border-foreground inline-block h-12 w-12 animate-spin rounded-full border-b-2"></div>
                <p className="text-muted-foreground mt-4">
                  Querying Linera contract for prices...
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="mx-auto max-w-2xl space-y-8 text-center">
            <div className="space-y-4">
              <h1 className="text-foreground text-4xl font-bold tracking-tight sm:text-5xl">
                Ride Price Aggregator
              </h1>
              <p className="text-muted-foreground text-xl">
                Compare Uber, Ola, Rapido, and BlaBlaCar prices
              </p>
              <p className="text-muted-foreground text-lg">
                Connect your Linera wallet to start comparing ride prices
              </p>
            </div>

            <LineraWalletModal
              isOpen={!isConnected}
              onConnect={connect}
              onClose={() => {}}
            >
              <Button size="lg" className="px-8 py-6 text-lg">
                Connect Linera Wallet
              </Button>
            </LineraWalletModal>
          </div>
        )}
      </main>

      <footer className="border-border mt-auto border-t">
        <div className="text-muted-foreground container mx-auto px-4 py-6 text-center text-sm">
          <p>Ride Price Aggregator - Powered by Linera</p>
        </div>
      </footer>
    </div>
  );
}