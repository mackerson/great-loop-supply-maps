import mapboxgl from 'mapbox-gl'

// Mapbox Access Token - You'll need to set NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN in your .env.local file
// Get your token from https://account.mapbox.com/
export const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || ''

// Default map style - you can customize this or use your own style URL
export const MAPBOX_STYLE_URL = process.env.NEXT_PUBLIC_MAPBOX_STYLE_URL || 'mapbox://styles/mapbox/light-v11'

// Debug logging for token availability
console.log('Mapbox token check:', {
  hasToken: !!MAPBOX_ACCESS_TOKEN,
  tokenLength: MAPBOX_ACCESS_TOKEN ? MAPBOX_ACCESS_TOKEN.length : 0,
  tokenStart: MAPBOX_ACCESS_TOKEN ? MAPBOX_ACCESS_TOKEN.substring(0, 8) + '...' : 'none'
})

// Initialize Mapbox
if (MAPBOX_ACCESS_TOKEN) {
  mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN
} else {
  console.warn('MAPBOX_ACCESS_TOKEN not found. Mapbox features will not work properly.')
  if (typeof window !== 'undefined') {
    alert('Mapbox access token is missing. Please configure NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN in your environment.')
  }
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

// Export interface for geographic features in manufacturing
export interface MapboxGeographicFeature {
  id: string
  type: 'coastline' | 'lake' | 'river' | 'boundary' | 'road'
  coordinates: [number, number][]
  properties?: Record<string, unknown>
}

// Get real geographic features from Mapbox vector tiles for manufacturing
export async function getMapboxGeographicFeatures(
  bounds: { minLat: number; maxLat: number; minLng: number; maxLng: number },
  featureTypes: string[] = ['water', 'admin', 'road']
): Promise<MapboxGeographicFeature[]> {
  console.log('getMapboxGeographicFeatures called with:', { bounds, featureTypes })
  console.log('Token available:', !!MAPBOX_ACCESS_TOKEN, 'Length:', MAPBOX_ACCESS_TOKEN?.length)
  
  if (!MAPBOX_ACCESS_TOKEN) {
    console.error('Mapbox access token not found. Cannot fetch geographic features.')
    throw new Error('Mapbox access token is required but not found. Please set NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN.')
  }

  try {
    const features: MapboxGeographicFeature[] = []
    
    // Use Mapbox Tilequery API to get vector features within bounds
    // This gets us real coastlines, water bodies, roads, etc.
    const centerLng = (bounds.minLng + bounds.maxLng) / 2
    const centerLat = (bounds.minLat + bounds.maxLat) / 2
    
    // Calculate appropriate radius in meters (roughly)
    const latDiff = bounds.maxLat - bounds.minLat
    const lngDiff = bounds.maxLng - bounds.minLng
    const radius = Math.max(latDiff, lngDiff) * 111000 // rough conversion to meters
    const clampedRadius = Math.min(radius, 50000) // Max 50km radius for API
    
    const tileQueryUrl = `https://api.mapbox.com/v4/mapbox.mapbox-streets-v8/tilequery/${centerLng},${centerLat}.json?radius=${clampedRadius}&layers=water,admin,road&access_token=${MAPBOX_ACCESS_TOKEN}`
    
    console.log('Fetching from Mapbox Tilequery API:', {
      center: [centerLng, centerLat],
      radius: clampedRadius,
      url: tileQueryUrl.replace(MAPBOX_ACCESS_TOKEN, '[TOKEN]')
    })
    
    const response = await fetch(tileQueryUrl)
    console.log('Mapbox API response status:', response.status, response.statusText)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Mapbox API error response:', errorText)
      throw new Error(`Mapbox tilequery request failed: ${response.status} ${response.statusText} - ${errorText}`)
    }
    
    const data = await response.json()
    console.log('Mapbox API response data:', {
      features: data.features?.length || 0,
      hasFeatures: !!data.features
    })
    
    // Process water features (coastlines, lakes)
    if (data.features) {
             data.features.forEach((feature: { 
         id?: string; 
         geometry?: { 
           type: string; 
           coordinates: number[][] | number[][][] | number[][][][]; 
         }; 
         properties?: Record<string, unknown>; 
         layer?: { id?: string }; 
       }) => {
        if (feature.geometry && feature.geometry.coordinates) {
          let featureType: MapboxGeographicFeature['type'] = 'coastline'
          
          // Determine feature type from Mapbox layer and properties
          if (feature.properties?.class === 'lake' || feature.properties?.type === 'lake') {
            featureType = 'lake'
          } else if (feature.properties?.class === 'river' || feature.properties?.type === 'river') {
            featureType = 'river'
          } else if (feature.layer?.id?.includes('admin')) {
            featureType = 'boundary'
          } else if (feature.layer?.id?.includes('road')) {
            featureType = 'road'
          }
          
          // Extract coordinates based on geometry type
          let coordinates: [number, number][] = []
          
                     if (feature.geometry.type === 'LineString') {
             coordinates = feature.geometry.coordinates as [number, number][]
           } else if (feature.geometry.type === 'Polygon') {
             coordinates = (feature.geometry.coordinates as number[][][])[0] as [number, number][]
           } else if (feature.geometry.type === 'MultiLineString') {
             coordinates = (feature.geometry.coordinates as number[][][]).flat() as [number, number][]
           } else if (feature.geometry.type === 'MultiPolygon') {
             coordinates = (feature.geometry.coordinates as number[][][][])[0][0] as [number, number][]
           }
          
          // Filter coordinates to bounds
          const filteredCoords = coordinates.filter(coord => 
            coord[0] >= bounds.minLng && coord[0] <= bounds.maxLng &&
            coord[1] >= bounds.minLat && coord[1] <= bounds.maxLat
          )
          
          if (filteredCoords.length > 1) {
            features.push({
              id: feature.id || `feature-${Math.random().toString(36).substr(2, 9)}`,
              type: featureType,
              coordinates: filteredCoords,
              properties: feature.properties as Record<string, unknown>
            })
          }
        }
      })
    }
    
    console.log(`Processed ${features.length} geographic features from Mapbox`)
    return features
    
  } catch (error) {
    console.error('Failed to fetch Mapbox geographic features:', error)
    if (error instanceof Error) {
      console.error('Error details:', error.message)
    }
    throw error // Re-throw the error so the caller can handle it appropriately
  }
}

// Get detailed coastline data using Mapbox Static Images API with vector overlay
export async function getMapboxCoastlineData(
  bounds: { minLat: number; maxLat: number; minLng: number; maxLng: number }
): Promise<MapboxGeographicFeature[]> {
  if (!MAPBOX_ACCESS_TOKEN) {
    console.warn('Mapbox access token not found.')
    return []
  }

  try {
    // Alternative approach: Use Mapbox Isochrone API boundaries as coastline approximation
    // or directly query vector tiles for more detailed coastline data
    
    // For now, we'll use a simplified approach with high-resolution vector tile queries
    const features: MapboxGeographicFeature[] = []
    
    // Make multiple tile queries for better resolution
    const gridSize = 3 // 3x3 grid for better coverage
    const latStep = (bounds.maxLat - bounds.minLat) / gridSize
    const lngStep = (bounds.maxLng - bounds.minLng) / gridSize
    
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const subBounds = {
          minLat: bounds.minLat + i * latStep,
          maxLat: bounds.minLat + (i + 1) * latStep,
          minLng: bounds.minLng + j * lngStep,
          maxLng: bounds.minLng + (j + 1) * lngStep
        }
        
                 const subFeatures = await getMapboxGeographicFeatures(subBounds, ['water'])
         features.push(...subFeatures.filter((f: MapboxGeographicFeature) => f.type === 'coastline' || f.type === 'lake'))
      }
    }
    
    // Deduplicate and merge similar features
    return deduplicateFeatures(features)
    
  } catch (error) {
    console.error('Failed to fetch coastline data:', error)
    return []
  }
}

// Deduplicate similar geographic features
function deduplicateFeatures(features: MapboxGeographicFeature[]): MapboxGeographicFeature[] {
  const seen = new Set<string>()
  return features.filter(feature => {
    // Create a simple hash of the feature based on first and last coordinates
    const firstCoord = feature.coordinates[0]
    const lastCoord = feature.coordinates[feature.coordinates.length - 1]
    const hash = `${feature.type}-${firstCoord?.[0]}-${firstCoord?.[1]}-${lastCoord?.[0]}-${lastCoord?.[1]}`
    
    if (seen.has(hash)) {
      return false
    }
    seen.add(hash)
    return true
  })
}

// Convert Mapbox features to SVG paths for manufacturing
export function mapboxFeaturesToSVG(
  features: MapboxGeographicFeature[],
  bounds: { minLat: number; maxLat: number; minLng: number; maxLng: number },
  width: number,
  height: number
): string {
  const projectCoordinate = (coord: [number, number]) => {
    const x = ((coord[0] - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * width
    const y = height - ((coord[1] - bounds.minLat) / (bounds.maxLat - bounds.minLat)) * height
    return [x, y]
  }

  return features.map(feature => {
    const projectedCoords = feature.coordinates.map(projectCoordinate)
    const pathData = projectedCoords.map((coord, index) => 
      `${index === 0 ? 'M' : 'L'} ${coord[0].toFixed(2)} ${coord[1].toFixed(2)}`
    ).join(' ')
    
    // Style based on feature type
    let strokeColor = '#000000'
    let strokeWidth = '0.5'
    let fill = 'none'
    let opacity = '1.0'
    
    switch (feature.type) {
      case 'coastline':
        strokeColor = '#2563eb'
        strokeWidth = '0.75'
        break
      case 'lake':
        strokeColor = '#0ea5e9'
        strokeWidth = '0.5'
        fill = 'none' // Just outline for engraving
        opacity = '0.8'
        break
      case 'river':
        strokeColor = '#06b6d4'
        strokeWidth = '1.0'
        break
      case 'boundary':
        strokeColor = '#6b7280'
        strokeWidth = '0.25'
        opacity = '0.5'
        break
      case 'road':
        strokeColor = '#374151'
        strokeWidth = '0.25'
        opacity = '0.3'
        break
    }
    
    const shouldClose = feature.type === 'lake'
    const finalPath = shouldClose ? pathData + ' Z' : pathData
    
    return `<path d="${finalPath}" 
                  stroke="${strokeColor}" 
                  stroke-width="${strokeWidth}" 
                  fill="${fill}" 
                  opacity="${opacity}"
                  class="mapbox-feature mapbox-${feature.type}" />`
  }).join('\n    ')
} 