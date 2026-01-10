# Ride Price Aggregator - Movement Network

A decentralized ride-sharing price comparison platform built on Movement Network. Compare prices from Uber, Ola, Rapido, and BlaBlaCar in real-time, all while maintaining your Web3 identity through wallet integration.

## Features

- **Multi-Service Price Comparison**: Compare prices from 4 major ride-sharing platforms
  - Uber (Global)
  - Ola (India)
  - Rapido (India - Bikes & Autos)
  - BlaBlaCar (Europe - Carpooling)

- **Real-time Price Aggregation**: Parallel API calls for instant price comparison
- **Smart Highlighting**: Automatically identifies cheapest and fastest options
- **Popular Routes**: Quick-select from pre-configured popular routes
- **Movement Network Integration**: Connect with Web3 wallets (Petra, Nightly, Martian)
- **Modern UI**: Built with Next.js 15, React 19, and Tailwind CSS
- **Theme Support**: Light/dark mode with system preference detection
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Blockchain**: Movement Network (Aptos-compatible)
- **Wallet Integration**: Aptos Wallet Adapter
- **APIs**: Uber, Ola, BlaBlaCar, Rapido

## Quick Start

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm
- Movement Network compatible wallet (optional, for full features)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd movement-ride-aggregator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API Keys** (Optional - uses mock data if not configured)

   Add your API keys to Replit Secrets or create a `.env.local` file:
   ```env
   NEXT_PUBLIC_UBER_SERVER_TOKEN=your_uber_token
   NEXT_PUBLIC_OLA_API_KEY=your_ola_key
   NEXT_PUBLIC_BLABLACAR_API_KEY=your_blablacar_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### Basic Flow

1. **Connect Wallet** (Optional)
   - Click "Connect Wallet" on the homepage
   - Select your preferred wallet (Petra, Nightly, Martian, etc.)
   - Approve the connection

2. **Search for Rides**
   - Option A: Select a popular route from quick-select buttons
   - Option B: Enter custom coordinates for pickup and destination
   - Click "Compare Prices"

3. **View Results**
   - See prices from all 4 services side-by-side
   - Green badge = Cheapest option
   - Blue badge = Fastest option
   - View detailed price ranges, distances, and estimated durations

### Popular Routes

Pre-configured routes include:
- Mumbai Airport → Gateway of India
- Delhi Airport → India Gate
- Bangalore Airport → MG Road
- Paris CDG → Eiffel Tower
- JFK → Times Square

## Project Structure

```
├── app/                      # Next.js App Router
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Main page
├── components/              # React components
│   ├── ui/                 # shadcn/ui components
│   ├── ride-search.tsx     # Location search form
│   ├── service-card.tsx    # Individual service card
│   └── price-comparison-cards.tsx  # Price comparison grid
├── lib/                    # Utilities
│   └── services/          # API services
│       ├── uber-api.ts
│       ├── ola-api.ts
│       ├── blablacar-api.ts
│       ├── rapido-api.ts
│       ├── mock-data.ts    # Mock pricing generator
│       └── price-aggregator.ts
└── types/                  # TypeScript types
    └── ride.ts            # Ride-related types
```

## API Integration

### Uber API
- **Endpoint**: `/v1.2/estimates/price`
- **Authentication**: Server Token
- **Documentation**: [Uber Developers](https://developer.uber.com/)

### Ola API (Krutrim Cloud)
- **Platform**: Krutrim Cloud
- **Authentication**: API Key + OAuth 2.0
- **Documentation**: [Ola Krutrim](https://cloud.olakrutrim.com/)

### BlaBlaCar API
- **Endpoint**: Public API
- **Authentication**: API Key (query parameter)
- **Documentation**: [BlaBlaCar Dev](https://dev.blablacar.com/)

### Rapido API
- **Note**: Partner-only API (not publicly available)
- **Fallback**: Enhanced mock data with realistic pricing

## Mock Data

If API keys are not configured, the app uses intelligent mock data that:
- Calculates distance using Haversine formula
- Applies realistic pricing models for each service
- Adds variance to simulate real-world price fluctuations
- Generates appropriate car types and durations

## Movement Network Integration

### Why Movement Network?

This project leverages Movement Network to demonstrate:
- **Decentralized Identity**: Users maintain ownership of their data
- **Web3 Authentication**: Wallet-based login instead of traditional auth
- **Future Extensions**: Potential for on-chain ride receipts, loyalty tokens, or decentralized payments

### Current Integration

- Wallet connection via Aptos Wallet Adapter
- Support for all AIP-62 compatible wallets
- Network switching (Mainnet/Testnet)

## Hackathon Submission

**Event**: Movement x Replit Hackathon

**Category**: DeFi / Consumer Apps

**Innovation**:
- First decentralized ride-sharing price aggregator
- Web3 identity meets real-world utility
- Multi-service API aggregation in a single platform
- Potential for blockchain-based payment rails

**Future Roadmap**:
- On-chain ride history and receipts
- MOVE token incentives for frequent users
- Decentralized dispute resolution
- Driver-passenger smart contract escrow

## Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run format       # Format with Prettier
```

### Adding New Services

To add a new ride-sharing service:

1. Create API service file in `lib/services/`
2. Add mock pricing model to `lib/services/mock-data.ts`
3. Update the aggregator in `lib/services/price-aggregator.ts`
4. Add service colors/branding in `components/service-card.tsx`

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - See [LICENSE](LICENSE) file for details

## Acknowledgments

- [Movement Network](https://movementnetwork.xyz/) - Blockchain infrastructure
- [Aptos Labs](https://aptoslabs.com/) - Wallet adapter and SDK
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Next.js](https://nextjs.org/) - React framework
- [Replit](https://replit.com/) - Development platform

## Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/movement-ride-aggregator/issues)
- **Documentation**: [Movement Network Docs](https://docs.movementnetwork.xyz/)
- **Community**: [Movement Discord](https://discord.gg/movementnetwork)

---

Built with ❤️ for the Movement x Replit Hackathon
