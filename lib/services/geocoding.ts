import type { Coordinates } from '@/types/ride';

export interface Location {
  name: string;
  coordinates: Coordinates;
  city?: string;
  country?: string;
  aliases?: string[];
}

/**
 * Comprehensive location database for geocoding
 * Organized by country and city for easy lookup
 */
export const LOCATION_DATABASE: Location[] = [
  // India - Mumbai
  { name: 'Mumbai Airport', coordinates: { latitude: 19.0896, longitude: 72.8656 }, city: 'Mumbai', country: 'India', aliases: ['Chhatrapati Shivaji', 'BOM'] },
  { name: 'Gateway of India', coordinates: { latitude: 18.9220, longitude: 72.8347 }, city: 'Mumbai', country: 'India' },
  { name: 'Bandra Kurla Complex', coordinates: { latitude: 19.0606, longitude: 72.8688 }, city: 'Mumbai', country: 'India', aliases: ['BKC'] },
  { name: 'Colaba', coordinates: { latitude: 18.9067, longitude: 72.8147 }, city: 'Mumbai', country: 'India' },
  { name: 'Andheri', coordinates: { latitude: 19.1136, longitude: 72.8697 }, city: 'Mumbai', country: 'India' },
  { name: 'Juhu Beach', coordinates: { latitude: 19.0990, longitude: 72.8265 }, city: 'Mumbai', country: 'India' },
  { name: 'Worli', coordinates: { latitude: 19.0176, longitude: 72.8169 }, city: 'Mumbai', country: 'India' },
  { name: 'Lower Parel', coordinates: { latitude: 18.9989, longitude: 72.8278 }, city: 'Mumbai', country: 'India' },
  { name: 'Churchgate', coordinates: { latitude: 18.9324, longitude: 72.8266 }, city: 'Mumbai', country: 'India' },
  { name: 'Marine Drive', coordinates: { latitude: 18.9432, longitude: 72.8236 }, city: 'Mumbai', country: 'India' },

  // India - Delhi
  { name: 'Delhi Airport', coordinates: { latitude: 28.5562, longitude: 77.1000 }, city: 'Delhi', country: 'India', aliases: ['IGI Airport', 'DEL'] },
  { name: 'India Gate', coordinates: { latitude: 28.6129, longitude: 77.2295 }, city: 'Delhi', country: 'India' },
  { name: 'Connaught Place', coordinates: { latitude: 28.6315, longitude: 77.2167 }, city: 'Delhi', country: 'India', aliases: ['CP'] },
  { name: 'Red Fort', coordinates: { latitude: 28.6562, longitude: 77.2410 }, city: 'Delhi', country: 'India' },
  { name: 'Qutub Minar', coordinates: { latitude: 28.5245, longitude: 77.1855 }, city: 'Delhi', country: 'India' },
  { name: 'Chandni Chowk', coordinates: { latitude: 28.6506, longitude: 77.2303 }, city: 'Delhi', country: 'India' },
  { name: 'Karol Bagh', coordinates: { latitude: 28.6519, longitude: 77.1906 }, city: 'Delhi', country: 'India' },
  { name: 'Saket', coordinates: { latitude: 28.5244, longitude: 77.2066 }, city: 'Delhi', country: 'India' },
  { name: 'Dwarka', coordinates: { latitude: 28.5921, longitude: 77.0460 }, city: 'Delhi', country: 'India' },
  { name: 'Nehru Place', coordinates: { latitude: 28.5494, longitude: 77.2501 }, city: 'Delhi', country: 'India' },

  // India - Bangalore
  { name: 'Bangalore Airport', coordinates: { latitude: 13.1979, longitude: 77.7063 }, city: 'Bangalore', country: 'India', aliases: ['Kempegowda', 'BLR'] },
  { name: 'MG Road', coordinates: { latitude: 12.9716, longitude: 77.5946 }, city: 'Bangalore', country: 'India' },
  { name: 'Koramangala', coordinates: { latitude: 12.9352, longitude: 77.6245 }, city: 'Bangalore', country: 'India' },
  { name: 'Indiranagar', coordinates: { latitude: 12.9719, longitude: 77.6412 }, city: 'Bangalore', country: 'India' },
  { name: 'Whitefield', coordinates: { latitude: 12.9698, longitude: 77.7499 }, city: 'Bangalore', country: 'India' },
  { name: 'Electronic City', coordinates: { latitude: 12.8399, longitude: 77.6770 }, city: 'Bangalore', country: 'India' },
  { name: 'HSR Layout', coordinates: { latitude: 12.9082, longitude: 77.6476 }, city: 'Bangalore', country: 'India' },
  { name: 'Jayanagar', coordinates: { latitude: 12.9250, longitude: 77.5838 }, city: 'Bangalore', country: 'India' },
  { name: 'Malleshwaram', coordinates: { latitude: 13.0039, longitude: 77.5727 }, city: 'Bangalore', country: 'India' },

  // India - Pune
  { name: 'Pune Airport', coordinates: { latitude: 18.5822, longitude: 73.9197 }, city: 'Pune', country: 'India', aliases: ['PNQ'] },
  { name: 'Koregaon Park', coordinates: { latitude: 18.5362, longitude: 73.8958 }, city: 'Pune', country: 'India' },
  { name: 'Hinjewadi', coordinates: { latitude: 18.5912, longitude: 73.7394 }, city: 'Pune', country: 'India' },
  { name: 'Shivaji Nagar', coordinates: { latitude: 18.5304, longitude: 73.8467 }, city: 'Pune', country: 'India' },
  { name: 'Viman Nagar', coordinates: { latitude: 18.5679, longitude: 73.9143 }, city: 'Pune', country: 'India' },
  { name: 'Baner', coordinates: { latitude: 18.5590, longitude: 73.7868 }, city: 'Pune', country: 'India' },
  { name: 'Kothrud', coordinates: { latitude: 18.5074, longitude: 73.8077 }, city: 'Pune', country: 'India' },

  // India - Hyderabad
  { name: 'Hyderabad Airport', coordinates: { latitude: 17.2403, longitude: 78.4294 }, city: 'Hyderabad', country: 'India', aliases: ['HYD', 'Shamshabad'] },
  { name: 'HITEC City', coordinates: { latitude: 17.4435, longitude: 78.3772 }, city: 'Hyderabad', country: 'India' },
  { name: 'Gachibowli', coordinates: { latitude: 17.4399, longitude: 78.3489 }, city: 'Hyderabad', country: 'India' },
  { name: 'Banjara Hills', coordinates: { latitude: 17.4239, longitude: 78.4482 }, city: 'Hyderabad', country: 'India' },
  { name: 'Charminar', coordinates: { latitude: 17.3616, longitude: 78.4747 }, city: 'Hyderabad', country: 'India' },
  { name: 'Jubilee Hills', coordinates: { latitude: 17.4326, longitude: 78.4071 }, city: 'Hyderabad', country: 'India' },
  { name: 'Secunderabad', coordinates: { latitude: 17.4399, longitude: 78.4983 }, city: 'Hyderabad', country: 'India' },

  // India - Chennai
  { name: 'Chennai Airport', coordinates: { latitude: 12.9941, longitude: 80.1709 }, city: 'Chennai', country: 'India', aliases: ['MAA'] },
  { name: 'Marina Beach', coordinates: { latitude: 13.0499, longitude: 80.2824 }, city: 'Chennai', country: 'India' },
  { name: 'T Nagar', coordinates: { latitude: 13.0418, longitude: 80.2341 }, city: 'Chennai', country: 'India' },
  { name: 'Velachery', coordinates: { latitude: 12.9759, longitude: 80.2208 }, city: 'Chennai', country: 'India' },
  { name: 'Adyar', coordinates: { latitude: 13.0067, longitude: 80.2571 }, city: 'Chennai', country: 'India' },
  { name: 'Anna Nagar', coordinates: { latitude: 13.0850, longitude: 80.2101 }, city: 'Chennai', country: 'India' },
  { name: 'OMR', coordinates: { latitude: 12.8996, longitude: 80.2209 }, city: 'Chennai', country: 'India', aliases: ['Old Mahabalipuram Road'] },

  // India - Kolkata
  { name: 'Kolkata Airport', coordinates: { latitude: 22.6520, longitude: 88.4463 }, city: 'Kolkata', country: 'India', aliases: ['CCU', 'Netaji Subhas'] },
  { name: 'Park Street', coordinates: { latitude: 22.5535, longitude: 88.3525 }, city: 'Kolkata', country: 'India' },
  { name: 'Salt Lake', coordinates: { latitude: 22.5804, longitude: 88.4161 }, city: 'Kolkata', country: 'India' },
  { name: 'Howrah', coordinates: { latitude: 22.5958, longitude: 88.2636 }, city: 'Kolkata', country: 'India' },
  { name: 'New Town', coordinates: { latitude: 22.5893, longitude: 88.4780 }, city: 'Kolkata', country: 'India' },
  { name: 'Esplanade', coordinates: { latitude: 22.5626, longitude: 88.3475 }, city: 'Kolkata', country: 'India' },

  // India - Ahmedabad
  { name: 'Ahmedabad Airport', coordinates: { latitude: 23.0771, longitude: 72.6347 }, city: 'Ahmedabad', country: 'India', aliases: ['AMD'] },
  { name: 'SG Highway', coordinates: { latitude: 23.0359, longitude: 72.5088 }, city: 'Ahmedabad', country: 'India' },
  { name: 'Satellite', coordinates: { latitude: 23.0258, longitude: 72.5051 }, city: 'Ahmedabad', country: 'India' },
  { name: 'Navrangpura', coordinates: { latitude: 23.0369, longitude: 72.5647 }, city: 'Ahmedabad', country: 'India' },
  { name: 'Vastrapur', coordinates: { latitude: 23.0393, longitude: 72.5273 }, city: 'Ahmedabad', country: 'India' },

  // India - Jaipur
  { name: 'Jaipur Airport', coordinates: { latitude: 26.8242, longitude: 75.8122 }, city: 'Jaipur', country: 'India', aliases: ['JAI'] },
  { name: 'Jaipur Junction', coordinates: { latitude: 26.9186, longitude: 75.7878 }, city: 'Jaipur', country: 'India', aliases: ['Railway Station'] },
  { name: 'Pink City', coordinates: { latitude: 26.9239, longitude: 75.8267 }, city: 'Jaipur', country: 'India' },
  { name: 'MI Road', coordinates: { latitude: 26.9176, longitude: 75.8087 }, city: 'Jaipur', country: 'India' },
  { name: 'Malviya Nagar', coordinates: { latitude: 26.8523, longitude: 75.8154 }, city: 'Jaipur', country: 'India' },

  // France - Paris
  { name: 'Paris Airport', coordinates: { latitude: 49.0097, longitude: 2.5479 }, city: 'Paris', country: 'France', aliases: ['CDG', 'Charles de Gaulle'] },
  { name: 'Eiffel Tower', coordinates: { latitude: 48.8584, longitude: 2.2945 }, city: 'Paris', country: 'France' },
  { name: 'Louvre Museum', coordinates: { latitude: 48.8606, longitude: 2.3376 }, city: 'Paris', country: 'France' },
  { name: 'Arc de Triomphe', coordinates: { latitude: 48.8738, longitude: 2.2950 }, city: 'Paris', country: 'France' },
  { name: 'Notre Dame', coordinates: { latitude: 48.8530, longitude: 2.3499 }, city: 'Paris', country: 'France' },
  { name: 'Champs Elysees', coordinates: { latitude: 48.8698, longitude: 2.3078 }, city: 'Paris', country: 'France' },
  { name: 'Montmartre', coordinates: { latitude: 48.8867, longitude: 2.3431 }, city: 'Paris', country: 'France' },
  { name: 'Versailles', coordinates: { latitude: 48.8049, longitude: 2.1204 }, city: 'Paris', country: 'France' },

  // USA - New York
  { name: 'JFK Airport', coordinates: { latitude: 40.6413, longitude: -73.7781 }, city: 'New York', country: 'USA', aliases: ['JFK'] },
  { name: 'LaGuardia Airport', coordinates: { latitude: 40.7769, longitude: -73.8740 }, city: 'New York', country: 'USA', aliases: ['LGA'] },
  { name: 'Times Square', coordinates: { latitude: 40.7580, longitude: -73.9855 }, city: 'New York', country: 'USA' },
  { name: 'Central Park', coordinates: { latitude: 40.7829, longitude: -73.9654 }, city: 'New York', country: 'USA' },
  { name: 'Statue of Liberty', coordinates: { latitude: 40.6892, longitude: -74.0445 }, city: 'New York', country: 'USA' },
  { name: 'Brooklyn Bridge', coordinates: { latitude: 40.7061, longitude: -73.9969 }, city: 'New York', country: 'USA' },
  { name: 'Empire State Building', coordinates: { latitude: 40.7484, longitude: -73.9857 }, city: 'New York', country: 'USA' },
  { name: 'Wall Street', coordinates: { latitude: 40.7074, longitude: -74.0113 }, city: 'New York', country: 'USA' },

  // UK - London
  { name: 'Heathrow Airport', coordinates: { latitude: 51.4700, longitude: -0.4543 }, city: 'London', country: 'UK', aliases: ['LHR'] },
  { name: 'Big Ben', coordinates: { latitude: 51.5007, longitude: -0.1246 }, city: 'London', country: 'UK' },
  { name: 'Tower Bridge', coordinates: { latitude: 51.5055, longitude: -0.0754 }, city: 'London', country: 'UK' },
  { name: 'Buckingham Palace', coordinates: { latitude: 51.5014, longitude: -0.1419 }, city: 'London', country: 'UK' },
  { name: 'London Eye', coordinates: { latitude: 51.5033, longitude: -0.1195 }, city: 'London', country: 'UK' },
  { name: 'Piccadilly Circus', coordinates: { latitude: 51.5100, longitude: -0.1340 }, city: 'London', country: 'UK' },

  // UAE - Dubai
  { name: 'Dubai Airport', coordinates: { latitude: 25.2532, longitude: 55.3657 }, city: 'Dubai', country: 'UAE', aliases: ['DXB'] },
  { name: 'Burj Khalifa', coordinates: { latitude: 25.1972, longitude: 55.2744 }, city: 'Dubai', country: 'UAE' },
  { name: 'Dubai Mall', coordinates: { latitude: 25.1975, longitude: 55.2796 }, city: 'Dubai', country: 'UAE' },
  { name: 'Palm Jumeirah', coordinates: { latitude: 25.1124, longitude: 55.1390 }, city: 'Dubai', country: 'UAE' },
  { name: 'Dubai Marina', coordinates: { latitude: 25.0805, longitude: 55.1403 }, city: 'Dubai', country: 'UAE' },
];

/**
 * Search for a location by name
 * Supports partial matching and aliases
 */
export function searchLocation(query: string): Location | null {
  if (!query || query.trim().length === 0) return null;

  const normalizedQuery = query.toLowerCase().trim();

  // Exact match
  let match = LOCATION_DATABASE.find(
    loc => loc.name.toLowerCase() === normalizedQuery
  );
  if (match) return match;

  // Alias match
  match = LOCATION_DATABASE.find(
    loc => loc.aliases?.some(alias => alias.toLowerCase() === normalizedQuery)
  );
  if (match) return match;

  // Partial match (starts with)
  match = LOCATION_DATABASE.find(
    loc => loc.name.toLowerCase().startsWith(normalizedQuery)
  );
  if (match) return match;

  // Partial match (contains)
  match = LOCATION_DATABASE.find(
    loc => loc.name.toLowerCase().includes(normalizedQuery)
  );
  if (match) return match;

  return null;
}

/**
 * Get location suggestions for autocomplete
 */
export function getLocationSuggestions(query: string, limit: number = 5): Location[] {
  if (!query || query.trim().length < 2) return [];

  const normalizedQuery = query.toLowerCase().trim();

  const matches = LOCATION_DATABASE.filter(loc => {
    const nameMatch = loc.name.toLowerCase().includes(normalizedQuery);
    const cityMatch = loc.city?.toLowerCase().includes(normalizedQuery);
    const aliasMatch = loc.aliases?.some(alias =>
      alias.toLowerCase().includes(normalizedQuery)
    );
    return nameMatch || cityMatch || aliasMatch;
  });

  return matches.slice(0, limit);
}

/**
 * Geocode a location name to coordinates
 * Falls back to Google Maps API if available and location not in database
 */
export async function geocodeLocation(locationName: string): Promise<Coordinates | null> {
  // Try local database first
  const localMatch = searchLocation(locationName);
  if (localMatch) {
    return localMatch.coordinates;
  }

  // Try Google Maps Geocoding API if key is available
  const googleApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (googleApiKey) {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(locationName)}&key=${googleApiKey}`
      );
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry.location;
        return { latitude: lat, longitude: lng };
      }
    } catch (error) {
      console.error('Google Maps geocoding error:', error);
    }
  }

  return null;
}

/**
 * Format location display name
 */
export function formatLocationName(location: Location): string {
  if (location.city && location.country) {
    return `${location.name}, ${location.city}, ${location.country}`;
  }
  if (location.city) {
    return `${location.name}, ${location.city}`;
  }
  return location.name;
}
