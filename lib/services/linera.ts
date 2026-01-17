import { LineraClient, PrivateKeySigner } from '@linera/client';

// Linera network configuration
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

// Application ID for the Rover contract (will be set after deployment)
export const ROVER_APPLICATION_ID = process.env.NEXT_PUBLIC_LINERA_APPLICATION_ID || '';

export class LineraService {
  private client: LineraClient | null = null;
  private signer: PrivateKeySigner | null = null;
  private isInitialized = false;
  private network: 'local' | 'testnet' = 'local';

  constructor() {
    this.network = process.env.NEXT_PUBLIC_LINERA_NETWORK === 'testnet' ? 'testnet' : 'local';
  }

  // Initialize the Linera client with a signer
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Create a new private key signer (in production, this would come from wallet)
      this.signer = new PrivateKeySigner();
      
      const config = LINERA_CONFIG[this.network];
      
      this.client = new LineraClient({
        graphqlEndpoint: config.graphqlEndpoint,
        signer: this.signer,
      });

      // Initialize with faucet if on local network
      if (this.network === 'local' && this.signer) {
        await this.fundFromFaucet();
      }

      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize Linera client:', error);
      throw error;
    }
  }

  // Fund account from faucet (local network only)
  private async fundFromFaucet(): Promise<void> {
    if (!this.signer) return;

    try {
      const response = await fetch(LINERA_CONFIG.local.faucetAddress, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address: await this.signer.getAddress(),
        }),
      });

      if (!response.ok) {
        throw new Error('Faucet request failed');
      }
    } catch (error) {
      console.error('Faucet funding failed:', error);
      // Don't throw - account might already have funds
    }
  }

  // Get current account address
  async getAddress(): Promise<string> {
    if (!this.signer) {
      await this.initialize();
    }
    return this.signer?.getAddress() || '';
  }

  // Check if wallet is connected
  isConnected(): boolean {
    return this.isInitialized && this.signer !== null;
  }

  // Query prices from Rover contract
  async queryPrices(pickup: Location, dropoff: Location): Promise<PriceComparisonResult | null> {
    if (!this.client || !ROVER_APPLICATION_ID) {
      throw new Error('Linera client not initialized or application ID not set');
    }

    try {
      const query = `
        query GetPrices($pickup: LocationInput!, $dropoff: LocationInput!) {
          queryPrices(
            applicationId: "${ROVER_APPLICATION_ID}"
            argument: {
              query: {
                pickup: $pickup
                dropoff: $dropoff
              }
            }
          ) {
            cheapest {
              provider
              amount
              currency
              etaMinutes
              vehicleType
              surgeMultiplier
            }
            allOptions {
              provider
              amount
              currency
              etaMinutes
              vehicleType
              surgeMultiplier
            }
            timestamp
            pickup {
              lat
              lng
              address
            }
            dropoff {
              lat
              lng
              address
            }
          }
        }
      `;

      const variables = {
        pickup: {
          lat: pickup.lat,
          lng: pickup.lng,
          address: pickup.address,
        },
        dropoff: {
          lat: dropoff.lat,
          lng: dropoff.lng,
          address: dropoff.address,
        },
      };

      const result = await this.client.query({ query, variables });
      return this.transformQueryResult(result.data?.queryPrices);
    } catch (error) {
      console.error('Failed to query prices:', error);
      throw error;
    }
  }

  // Store price comparison result
  async storePriceResult(result: PriceComparisonResult): Promise<void> {
    if (!this.client || !ROVER_APPLICATION_ID) {
      throw new Error('Linera client not initialized or application ID not set');
    }

    try {
      const mutation = `
        mutation StorePriceResult($result: PriceComparisonInput!) {
          storePriceResult(
            applicationId: "${ROVER_APPLICATION_ID}"
            argument: $result
          )
        }
      `;

      await this.client.mutation({ 
        mutation, 
        variables: { result: this.transformResultForStorage(result) } 
      });
    } catch (error) {
      console.error('Failed to store price result:', error);
      throw error;
    }
  }

  // Transform query result to match frontend types
  private transformQueryResult(data: any): PriceComparisonResult | null {
    if (!data) return null;

    return {
      timestamp: data.timestamp,
      pickup: data.pickup,
      dropoff: data.dropoff,
      estimates: data.allOptions.map((option: any) => ({
        provider: option.provider,
        price: option.amount.toString(),
        currency: option.currency,
        etaMinutes: option.etaMinutes,
        vehicleType: option.vehicleType,
        surgeMultiplier: option.surgeMultiplier,
        available: true, // Assume available unless API says otherwise
        distance: 'N/A', // Would come from API
        discount: null,
      })),
      cheapest: data.cheapest,
    };
  }

  // Transform result for contract storage
  private transformResultForStorage(result: PriceComparisonResult): any {
    return {
      cheapest: result.cheapest,
      allOptions: result.estimates.map((estimate: any) => ({
        provider: estimate.provider,
        amount: parseInt(estimate.price),
        currency: estimate.currency,
        etaMinutes: estimate.etaMinutes,
        vehicleType: estimate.vehicleType,
        surgeMultiplier: estimate.surgeMultiplier,
      })),
      timestamp: result.timestamp,
      pickup: result.pickup,
      dropoff: result.dropoff,
    };
  }

  // Disconnect wallet
  disconnect(): void {
    this.client = null;
    this.signer = null;
    this.isInitialized = false;
  }
}

// Types for Linera integration
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

// Singleton instance
export const lineraService = new LineraService();