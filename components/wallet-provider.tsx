"use client";

import { ReactNode } from "react";
import { LINERA_NETWORKS, LineraNetworkConfig } from "@/lib/services/linera-client";

interface WalletProviderProps {
  children: ReactNode;
}

export function WalletProvider({ children }: WalletProviderProps) {
  const networkConfig = LINERA_NETWORKS.testnetConway;
  
  return (
    <>{children}</>
  );
}
