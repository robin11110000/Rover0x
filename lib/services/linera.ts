const LINERA_CONFIG = {
  local: {
    graphqlEndpoint: 'http://localhost:9001/graphql',
    faucetAddress: 'http://localhost:8080',
  },
  testnet: {
    graphqlEndpoint: 'https://graphql.testnet-conway.linera.net',
    faucetAddress: 'https://faucet.testnet-conway.linera.net',
  }
};

export const ROVER_APPLICATION_ID = process.env.NEXT_PUBLIC_LINERA_APPLICATION_ID || '';

export class LineraService {
  private isInitialized = false;
  private network: 'local' | 'testnet' = 'local';
  private address: string | null = null;

  constructor() {
    this.network = process.env.NEXT_PUBLIC_LINERA_NETWORK === 'testnet' ? 'testnet' : 'local';
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      this.address = 'linera-' + Math.random().toString(36).substring(2, 10);
      
      if (this.network === 'local') {
        await this.fundFromFaucet();
      }

      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize Linera client:', error);
      throw error;
    }
  }

  private async fundFromFaucet(): Promise<void> {
    if (!this.address) return;

    try {
      const response = await fetch(LINERA_CONFIG.local.faucetAddress, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address: this.address,
        }),
      });

      if (!response.ok) {
        throw new Error('Faucet request failed');
      }
    } catch (error) {
      console.error('Faucet funding failed:', error);
    }
  }

  async getAddress(): Promise<string> {
    if (!this.address) {
      await this.initialize();
    }
    return this.address || '';
  }

  isConnected(): boolean {
    return this.isInitialized && this.address !== null;
  }

  async queryPrices(pickup: Location, dropoff: Location): Promise<PriceComparisonResult | null> {
    if (!ROVER_APPLICATION_ID) {
      throw new Error('Linera client not initialized or application ID not set');
    }

    return null;
  }

  async storePriceResult(result: PriceComparisonResult): Promise<void> {
    if (!ROVER_APPLICATION_ID) {
      throw new Error('Linera client not initialized or application ID not set');
    }
  }

  disconnect(): void {
    this.address = null;
    this.isInitialized = false;
  }
}

export interface Location {
  lat: number;
  lng: number;
  address: string;
}

export interface PriceComparisonResult {
  timestamp: number;
  pickup: Location;
  dropoff: Location;
  estimates: RideEstimate[];
  cheapest: {
    provider: string;
    amount: number;
    currency: string;
    etaMinutes: number;
    vehicleType: string;
    surgeMultiplier?: number;
  };
}

export interface RideEstimate {
  provider: string;
  price: string;
  currency: string;
  etaMinutes: number;
  vehicleType: string;
  surgeMultiplier?: number;
  available: boolean;
  distance: string;
  discount: string | null;
}

export const lineraService = new LineraService();
