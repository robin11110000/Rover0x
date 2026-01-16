"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface WalletSelectionModalProps {
  children: React.ReactNode;
}

export function WalletSelectionModal({ children }: WalletSelectionModalProps) {
  const [open, setOpen] = useState(false);
  const { connect, disconnect, isConnected } = useLineraClient();

  const handleConnect = async () => {
    try {
      const success = await connect();
      if (success) {
        setOpen(false);
      }
    } catch (error) {
      console.error("Failed to connect Linera wallet:", error);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
      setOpen(false);
    } catch (error) {
      console.error("Failed to disconnect wallet:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isConnected ? "Linera Wallet Connected" : "Connect Linera Wallet"}
          </DialogTitle>
          <DialogDescription>
            {isConnected 
              ? "Your Linera wallet is connected to the Rover dApp"
              : "Connect your Linera wallet to access decentralized price aggregation"
            }
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {isConnected ? (
            <div className="space-y-3">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 font-medium text-center">
                  ✓ Wallet Connected Successfully
                </p>
                <p className="text-green-700 text-sm text-center mt-2">
                  You can now use Rover's microchain features
                </p>
              </div>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleDisconnect}
              >
                Disconnect Wallet
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 font-medium text-center">
                  Linera Web Client
                </p>
                <p className="text-blue-700 text-sm text-center mt-2">
                  Connect using the Linera browser extension or web client
                </p>
              </div>
              <Button
                className="w-full"
                onClick={handleConnect}
              >
                Connect Linera Wallet
              </Button>
              <div className="text-xs text-muted-foreground text-center">
                <p>Don't have a Linera wallet?</p>
                <a 
                  href="https://linera.dev" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Get started with Linera
                </a>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Import Linera client hook
import { useLineraClient } from "@/lib/services/linera-client";