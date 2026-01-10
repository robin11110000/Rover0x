"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { WalletSelectionModal } from "@/components/wallet-selection-modal";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { account, connected, disconnect } = useWallet();

  const truncateAddress = (address: string | { toString(): string }) => {
    const addressStr = typeof address === 'string' ? address : address.toString();
    return `${addressStr.slice(0, 6)}...${addressStr.slice(-4)}`;
  };

  return (
    <header className="border-b border-border relative z-50">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-2xl font-bold text-foreground hover:text-primary transition-colors z-10 relative">
          Rover
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 z-10 relative">
          <Link href="/" className="text-foreground hover:text-primary transition-colors">
            Home
          </Link>
          <ThemeToggle />

          {/* Wallet Connection */}
          {connected && account?.address ? (
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2 px-3 py-2 bg-muted rounded-md">
                <Wallet className="h-4 w-4" />
                <span className="text-sm font-mono">{truncateAddress(account.address)}</span>
              </div>
              <Button variant="outline" size="sm" onClick={disconnect}>
                Disconnect
              </Button>
            </div>
          ) : (
            <WalletSelectionModal>
              <Button variant="default" size="sm">
                <Wallet className="h-4 w-4 mr-2" />
                Connect Wallet
              </Button>
            </WalletSelectionModal>
          )}
        </nav>

        {/* Mobile Navigation Toggle */}
        <div className="md:hidden flex items-center space-x-2 z-10 relative">
          <ThemeToggle />
          <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-background border-b border-border shadow-lg z-40">
          <nav className="container mx-auto px-4 py-4 space-y-3">
            <Link
              href="/"
              className="block text-foreground hover:text-primary transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}