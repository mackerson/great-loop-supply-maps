import mapboxgl from 'mapbox-gl'

// Mapbox Access Token - You'll need to set NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN in your .env.local file
// Get your token from https://account.mapbox.com/
export const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || ''

// Default map style - you can customize this or use your own style URL
export const MAPBOX_STYLE_URL = process.env.NEXT_PUBLIC_MAPBOX_STYLE_URL || 'mapbox://styles/mapbox/light-v11'

// Initialize Mapbox
if (MAPBOX_ACCESS_TOKEN) {
  mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN
}

export interface GeocodeResult {
  id: string
  name: string
  lat: number
  lng: number
  place_type: string[]
  full_name: string
}

interface MapboxFeature {
  id: string
  text: string
  place_name: string
  center: [number, number]
  place_type: string[]
}

interface MapboxGeocodingResponse {
  features: MapboxFeature[]
}

interface MapboxLayer {
  id: string
  type: 'background' | 'line' | 'symbol'
  source?: string
  'source-layer'?: string
  filter?: (string | string[])[]
  paint?: Record<string, string | number>
  layout?: Record<string, string | number | string[]>
}

// Geocoding function to search for locations
export async function geocodeLocation(query: string): Promise<GeocodeResult[]> {
  if (!MAPBOX_ACCESS_TOKEN) {
    console.warn('Mapbox access token not found. Using mock data.')
    return mockGeocode(query)
  }

  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${MAPBOX_ACCESS_TOKEN}&limit=5&types=place,locality,neighborhood,address`
    )
    
    if (!response.ok) {
      throw new Error('Geocoding request failed')
    }

    const data = await response.json() as MapboxGeocodingResponse
    
    return data.features.map((feature) => ({
      id: feature.id,
      name: feature.text,
      lat: feature.center[1],
      lng: feature.center[0],
      place_type: feature.place_type,
      full_name: feature.place_name
    }))
  } catch (error) {
    console.error('Geocoding error:', error)
    return mockGeocode(query)
  }
}

// Mock geocoding for development when API key isn't available
function mockGeocode(query: string): GeocodeResult[] {
  const mockLocations = [
    { id: "1", name: "Paris", lat: 48.8566, lng: 2.3522, place_type: ["place"], full_name: "Paris, France" },
    { id: "2", name: "New York", lat: 40.7128, lng: -74.006, place_type: ["place"], full_name: "New York, NY, United States" },
    { id: "3", name: "Tokyo", lat: 35.6762, lng: 139.6503, place_type: ["place"], full_name: "Tokyo, Japan" },
    { id: "4", name: "London", lat: 51.5074, lng: -0.1278, place_type: ["place"], full_name: "London, England, United Kingdom" },
    { id: "5", name: "Sydney", lat: -33.8688, lng: 151.2093, place_type: ["place"], full_name: "Sydney, NSW, Australia" },
    { id: "6", name: "San Francisco", lat: 37.7749, lng: -122.4194, place_type: ["place"], full_name: "San Francisco, CA, United States" },
    { id: "7", name: "Rome", lat: 41.9028, lng: 12.4964, place_type: ["place"], full_name: "Rome, Italy" },
    { id: "8", name: "Barcelona", lat: 41.3851, lng: 2.1734, place_type: ["place"], full_name: "Barcelona, Spain" },
  ]

  return mockLocations.filter(location => 
    location.name.toLowerCase().includes(query.toLowerCase()) ||
    location.full_name.toLowerCase().includes(query.toLowerCase())
  )
}

// Create map bounds from an array of locations
export function getBounds(locations: { lat: number; lng: number }[]): mapboxgl.LngLatBounds {
  if (locations.length === 0) {
    return new mapboxgl.LngLatBounds()
  }
  
  const bounds = new mapboxgl.LngLatBounds()
  locations.forEach(location => {
    bounds.extend([location.lng, location.lat])
  })
  
  // Add some padding
  return bounds
}

// Generate a minimal map style for engraving
export function getMinimalMapStyle(theme: string = 'minimalist') {
  const baseStyle = {
    version: 8 as const,
    sources: {
      'mapbox-streets': {
        type: 'vector',
        url: 'mapbox://mapbox.mapbox-streets-v8'
      }
    },
    layers: [] as MapboxLayer[]
  }

  // Define theme colors
  const themeColors = {
    minimalist: {
      background: '#ffffff',
      water: '#f0f9ff',
      roads: '#e2e8f0',
      text: '#475569'
    },
    woodburn: {
      background: '#fef3c7',
      water: '#fed7aa',
      roads: '#92400e',
      text: '#451a03'
    },
    vintage: {
      background: '#f5f5f4',
      water: '#e7e5e4',
      roads: '#78716c',
      text: '#44403c'
    }
  }

  const colors = themeColors[theme as keyof typeof themeColors] || themeColors.minimalist

  // Add background layer
  baseStyle.layers.push({
    id: 'background',
    type: 'background',
    paint: {
      'background-color': colors.background
    }
  })

  // Add major roads only
  baseStyle.layers.push({
    id: 'roads',
    type: 'line',
    source: 'mapbox-streets',
    'source-layer': 'road',
    filter: ['in', 'class', 'motorway', 'trunk', 'primary'],
    paint: {
      'line-color': colors.roads,
      'line-width': 1
    }
  })

  // Add place labels
  baseStyle.layers.push({
    id: 'place-labels',
    type: 'symbol',
    source: 'mapbox-streets',
    'source-layer': 'place_label',
    filter: ['in', 'type', 'city', 'town'],
    layout: {
      'text-field': '{name}',
      'text-font': ['Open Sans Regular'],
      'text-size': 12
    },
    paint: {
      'text-color': colors.text
    }
  })

  return baseStyle
} 