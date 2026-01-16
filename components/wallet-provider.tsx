"use client";

import { ReactNode } from "react";
import { LineraProvider as BaseLineraProvider } from "@linera/client";
import { LINERA_NETWORKS, LineraNetworkConfig } from "@/lib/services/linera-client";

interface WalletProviderProps {
  children: ReactNode;
}

export function WalletProvider({ children }: WalletProviderProps) {
  // Linera Testnet Conway configuration based on actual protocol analysis
  const networkConfig = LINERA_NETWORKS.testnetConway;
  
  return (
    <BaseLineraProvider
      network={networkConfig.chainId}
      rpcUrl={networkConfig.rpcUrl}
      graphqlUrl={networkConfig.graphqlUrl}
      autoConnect={true}
      onError={(error) => {
        console.error("Linera wallet error:", JSON.stringify(error, null, 2));
      }}
    >
      {children}
    </BaseLineraProvider>
  );
}