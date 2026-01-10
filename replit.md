# Ride Price Aggregator - Movement Network

## Overview

A decentralized ride-sharing price comparison platform built on Movement Network. The application aggregates real-time pricing from multiple ride-sharing services (Uber, Ola, Rapido, BlaBlaCar) and displays them in a unified interface. Users connect via Web3 wallets to access the platform, maintaining their blockchain identity throughout the experience.

The core value proposition is allowing users to compare ride prices across multiple providers simultaneously, with smart highlighting of the cheapest and fastest options.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Framework
- **Next.js 15 with App Router**: Modern React framework providing server-side rendering, file-based routing, and optimized builds
- **React 19**: Latest React version with improved performance
- **TypeScript**: Full type safety across the codebase with strict mode enabled

### UI Component Strategy
- **shadcn/ui**: Pre-built, customizable components using Radix UI primitives
- **Tailwind CSS 4**: Utility-first styling with CSS variables for theming
- **Lucide React**: Icon library for consistent iconography
- **Sonner**: Toast notifications for user feedback

### Blockchain Integration
- **Movement Network**: Aptos-compatible blockchain (supports both mainnet chainId 126 and testnet chainId 250)
- **Wallet Adapter**: `@aptos-labs/wallet-adapter-react` for wallet connections
- **Supported Wallets**: Nightly (primary, with network switching), Martian, and other Aptos-compatible wallets
- **Wallet Features**: Connect/disconnect, message signing, transaction submission, network switching (Nightly only)

### Price Aggregation Architecture
- **Parallel API Calls**: All ride service APIs are called simultaneously using `Promise.allSettled()` for optimal performance
- **Graceful Degradation**: If API keys aren't configured, the system falls back to realistic mock data
- **Service Adapters**: Individual API modules for each provider (Uber, Ola, Rapido, BlaBlaCar) with consistent interfaces
- **Mock Data System**: Comprehensive mock data generator with realistic pricing models based on distance calculations (Haversine formula)

### Location/Geocoding System
- **Local Location Database**: Pre-populated database covering major cities in India (Mumbai, Delhi, Bangalore), USA (New York, San Francisco, LA), and Europe (London, Paris, Berlin)
- **Suggestion System**: Real-time location suggestions as users type
- **Popular Routes**: Pre-configured routes for quick selection

### State Management
- **React Hooks**: useState for local component state
- **Wallet Context**: Provided by Aptos wallet adapter for global wallet state
- **No External State Library**: Simple enough architecture that React's built-in state management suffices

### Theme System
- **next-themes**: Provides light/dark mode with system preference detection
- **CSS Variables**: Theme colors defined in globals.css using OKLCH color space

## External Dependencies

### Ride-Sharing APIs (Optional - Falls Back to Mock Data)
- **Uber API**: `/v1.2/estimates/price` endpoint for price estimates (requires `NEXT_PUBLIC_UBER_SERVER_TOKEN`)
- **Ola API**: Krutrim Cloud API for Indian market (requires `NEXT_PUBLIC_OLA_API_KEY`)
- **BlaBlaCar API**: European carpooling service (requires `NEXT_PUBLIC_BLABLACAR_API_KEY`)
- **Rapido API**: Partner-only API for bikes/autos in India (requires `RAPIDO_BEARER_TOKEN`, `RAPIDO_CSRF_TOKEN`, `RAPIDO_PARTNER_USER_ID`)

### Blockchain Infrastructure
- **Movement Mainnet**: `https://full.mainnet.movementinfra.xyz/v1`
- **Movement Testnet**: `https://full.testnet.movementinfra.xyz/v1`

### No Database
- Currently no persistent data storage
- All price comparisons are ephemeral and fetched on-demand
- Wallet connections use browser-based wallet extensions

### Key NPM Packages
- `@aptos-labs/ts-sdk`: Aptos/Movement blockchain interaction
- `@aptos-labs/wallet-adapter-react`: Wallet connection management
- `got`: HTTP client (server-side, excluded from client bundle via webpack config)
- `uuid`: Unique ID generation