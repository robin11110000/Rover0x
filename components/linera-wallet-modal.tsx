"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { lineraService, type Location } from "@/lib/services/linera";
import { toast } from "sonner";
import { Wallet, Loader2, CheckCircle } from "lucide-react";

interface LineraWalletModalProps {
  isOpen: boolean;
  onConnect: () => void;
  onClose: () => void;
  children: React.ReactNode;
}

export function LineraWalletModal({ isOpen, onConnect, onClose, children }: LineraWalletModalProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    
    try {
      toast.info("Connecting to Linera wallet...");
      await lineraService.initialize();
      
      const address = await lineraService.getAddress();
      setIsConnected(true);
      toast.success(`Connected to Linera: ${address.slice(0, 6)}...${address.slice(-4)}`);
      
      onConnect();
    } catch (error) {
      console.error("Failed to connect to Linera:", error);
      toast.error("Failed to connect to Linera wallet. Please try again.");
    } finally {
      setIsConnecting(false);
    }
  };

  if (isConnected) {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <Wallet className="w-8 h-8 text-blue-600" />
          </div>
          <CardTitle>Connect to Linera</CardTitle>
          <CardDescription>
            Connect your Linera wallet to start comparing ride prices across multiple providers
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div className="text-sm">
                <div className="font-medium text-green-900">Secure Connection</div>
                <div className="text-green-700">Your keys never leave your device</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
              <Wallet className="w-5 h-5 text-blue-600" />
              <div className="text-sm">
                <div className="font-medium text-blue-900">Multi-Chain Support</div>
                <div className="text-blue-700">Built on Linera microchains</div>
              </div>
            </div>
          </div>

          <Button 
            onClick={handleConnect}
            disabled={isConnecting}
            className="w-full"
            size="lg"
          >
            {isConnecting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Wallet className="mr-2 h-4 w-4" />
                Connect Linera Wallet
              </>
            )}
          </Button>

          <div className="text-xs text-muted-foreground text-center">
            By connecting, you agree to the Terms of Service and Privacy Policy
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Hook for managing Linera wallet state
export function useLineraWallet() {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const connect = async () => {
    setIsLoading(true);
    try {
      await lineraService.initialize();
      const addr = await lineraService.getAddress();
      setAddress(addr);
      setIsConnected(true);
    } catch (error) {
      console.error('Connection failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = () => {
    lineraService.disconnect();
    setIsConnected(false);
    setAddress('');
  };

  return {
    isConnected,
    address,
    isLoading,
    connect,
    disconnect,
  };
}