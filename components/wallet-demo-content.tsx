"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLineraClient } from "@/lib/services/linera-client";
import { LINERA_NETWORKS } from "@/lib/services/linera-client";

export function WalletDemoContent() {
  const { walletState, getBalance, switchNetwork, getClient } = useLineraClient();
  const [balance, setBalance] = useState<string>("0");
  const [currentNetwork, setCurrentNetwork] = useState(LINERA_NETWORKS.testnetConway);
  
  const address = walletState.accounts?.[0]?.owner || "";

  useEffect(() => {
    // Fetch balance when wallet connects
    if (walletState.isConnected) {
      getBalance().then(bal => setBalance(bal.toString()));
    }
  }, [walletState.isConnected, getBalance]);

  const handleNetworkSwitch = async (networkKey: string) => {
    const success = await switchNetwork(networkKey);
    if (success) {
      const newNetwork = LINERA_NETWORKS[networkKey];
      if (newNetwork) {
        setCurrentNetwork(newNetwork);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-foreground">Linera Wallet Connected</h1>
        <Button variant="outline" onClick={() => getClient().disconnect()}>
          Disconnect Wallet
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Wallet Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Connected Address</p>
              <p className="font-mono text-sm break-all">{address}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Balance</p>
              <p className="text-sm">{balance} LIN</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => getBalance().then(bal => setBalance(bal.toString()))}
              >
                Refresh
              </Button>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Current Network</p>
              <p className="text-sm">
                {currentNetwork.name} ({walletState.selectedChain})
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Network Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Switch Network</p>
              <div className="grid grid-cols-1 gap-2">
                {Object.entries(LINERA_NETWORKS).map(([key, network]) => (
                  <Button
                    key={key}
                    variant={currentNetwork.chainId === network.chainId ? "default" : "outline"}
                    className="w-full"
                    onClick={() => handleNetworkSwitch(key)}
                  >
                    {network.name}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rover Features</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">Multi-Provider Aggregation</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">Real-time Price Comparison</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">User Microchains</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">Native API Integration</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">Sub-second Response</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">Transparent Pricing</span>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Supported Providers</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-yellow-50 border border-yellow-200 rounded p-2 text-center">
                  Ola Cabs
                </div>
                <div className="bg-black text-white rounded p-2 text-center">
                  Uber
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded p-2 text-center">
                  Rapido
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded p-2 text-center">
                  BlaBlaCar
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}