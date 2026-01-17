"use client";

import { useState, useCallback } from "react";

export interface LineraNetworkConfig {
  name: string;
  chainId: string;
  rpcUrl: string;
  graphqlUrl: string;
  faucetUrl?: string;
}

export const LINERA_NETWORKS: Record<string, LineraNetworkConfig> = {
  testnetConway: {
    name: "Linera Testnet Conway",
    chainId: "testnet-conway",
    rpcUrl: "https://rpc.testnet-conway.linera.net",
    graphqlUrl: "https://graphql.testnet-conway.linera.net",
    faucetUrl: "https://faucet.testnet-conway.linera.net",
  },
  local: {
    name: "Local Network",
    chainId: "local",
    rpcUrl: "http://localhost:9001",
    graphqlUrl: "http://localhost:9001/graphql",
    faucetUrl: "http://localhost:8080",
  },
};

export function useLineraClient() {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const connect = useCallback(async (): Promise<boolean> => {
    setIsConnecting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsConnected(true);
      setAddress("linera-" + Math.random().toString(36).substring(2, 10));
      return true;
    } catch (error) {
      console.error("Failed to connect:", error);
      return false;
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(async (): Promise<void> => {
    setIsConnected(false);
    setAddress(null);
  }, []);

  return {
    isConnected,
    isConnecting,
    address,
    connect,
    disconnect,
  };
}
