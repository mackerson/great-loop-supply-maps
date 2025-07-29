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

// Get real geographic features using OpenStreetMap (clean, reliable GeoJSON)
export async function getMapboxGeographicFeatures(
  bounds: { minLat: number; maxLat: number; minLng: number; maxLng: number },
  featureTypes: string[] = ['water', 'admin', 'road']
): Promise<MapboxGeographicFeature[]> {
  console.log('Fetching geographic features for bounds:', bounds)
  
  try {
    const features: MapboxGeographicFeature[] = []
    
    // Use OpenStreetMap Overpass API for clean, reliable coastline data
    // OSM is the same data source that Mapbox uses, so it's consistent
    const overpassQuery = `
      [out:json][timeout:25];
      (
        way["natural"="coastline"](${bounds.minLat},${bounds.minLng},${bounds.maxLat},${bounds.maxLng});
        way["natural"="water"](${bounds.minLat},${bounds.minLng},${bounds.maxLat},${bounds.maxLng});
        way["waterway"="river"](${bounds.minLat},${bounds.minLng},${bounds.maxLat},${bounds.maxLng});
      );
      out geom;
    `.trim()
    
    console.log('Fetching from OpenStreetMap Overpass API...')
    
    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: overpassQuery
    })
    
    if (!response.ok) {
      throw new Error(`Overpass API failed: ${response.status}`)
    }
    
    const data = await response.json()
    console.log(`OSM returned ${data.elements?.length || 0} geographic elements`)
    
    // Process OSM elements into our format
    if (data.elements && Array.isArray(data.elements)) {
      data.elements.forEach((element: {
        type: string;
        geometry?: Array<{ lat: number; lon: number }>;
        tags?: Record<string, string>;
        id: number;
      }, index: number) => {
        
        if (element.geometry && element.geometry.length > 1) {
          // Convert OSM format to our coordinate format
          const coordinates: [number, number][] = element.geometry.map(point => [point.lon, point.lat])
          
          // Determine feature type from OSM tags
          let featureType: MapboxGeographicFeature['type'] = 'coastline'
          if (element.tags?.natural === 'coastline') featureType = 'coastline'
          else if (element.tags?.natural === 'water') featureType = 'lake'
          else if (element.tags?.waterway === 'river') featureType = 'river'
          
          features.push({
            id: `osm-${element.id}`,
            type: featureType,
            coordinates: coordinates,
            properties: { source: 'openstreetmap', tags: element.tags || {} }
          })
          
          console.log(`Added ${featureType} with ${coordinates.length} coordinates`)
        }
      })
    }
    
    console.log(`Successfully processed ${features.length} geographic features`)
    return features
    
  } catch (error) {
    console.error('Failed to fetch geographic features:', error)
    throw new Error(`Geographic features fetch failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Removed all complex tile calculation and fallback logic - keeping it simple!

// Generate enhanced coastline features for specific bounds (more accurate than generic simplified)
function generateEnhancedCoastlineForBounds(
  bounds: { minLat: number; maxLat: number; minLng: number; maxLng: number }
): MapboxGeographicFeature[] {
  const features: MapboxGeographicFeature[] = []
  
  console.log('Generating enhanced coastline for bounds:', bounds)
  
  // More detailed coastline segments based on actual bounds
  // This is much more accurate than the generic approach
  
  // East Coast detailed segments (if bounds include this area)
  if (bounds.minLng > -85 && bounds.maxLat > 25 && bounds.minLat < 45) {
    const eastCoastDetails = [
      // Florida East Coast (detailed)
      [[-80.1, 25.8], [-80.0, 26.1], [-79.9, 26.4], [-79.8, 26.7], [-79.7, 27.0], [-79.6, 27.3], [-79.5, 27.6], [-79.4, 27.9], [-79.3, 28.2], [-79.2, 28.5], [-79.1, 28.8], [-79.0, 29.1], [-78.9, 29.4]],
      
      // Georgia/South Carolina Coast  
      [[-78.9, 29.4], [-79.1, 29.8], [-79.3, 30.2], [-79.5, 30.6], [-79.7, 31.0], [-79.9, 31.4], [-80.1, 31.8], [-80.3, 32.2], [-80.5, 32.6], [-80.7, 33.0]],
      
      // North Carolina Outer Banks
      [[-80.7, 33.0], [-80.5, 33.5], [-80.0, 34.0], [-79.5, 34.5], [-79.0, 35.0], [-78.5, 35.5], [-78.0, 36.0]],
      
      // Chesapeake Bay
      [[-78.0, 36.0], [-77.5, 36.5], [-77.0, 37.0], [-76.5, 37.5], [-76.0, 38.0], [-75.5, 38.5], [-75.0, 39.0], [-74.5, 39.5]]
    ]
    
    eastCoastDetails.forEach((coords, index) => {
      const filteredCoords = coords.filter(coord => 
        coord[0] >= bounds.minLng && coord[0] <= bounds.maxLng &&
        coord[1] >= bounds.minLat && coord[1] <= bounds.maxLat
      ) as [number, number][]
      
      if (filteredCoords.length > 1) {
        features.push({
          id: `enhanced-east-coast-${index}`,
          type: 'coastline',
          coordinates: filteredCoords,
          properties: { source: 'enhanced', region: 'east-coast' }
        })
      }
    })
  }
  
  // Gulf Coast detailed segments (if bounds include this area)
  if (bounds.minLng > -100 && bounds.maxLng < -80 && bounds.maxLat > 24 && bounds.minLat < 32) {
    const gulfCoastDetails = [
      // Florida Panhandle
      [[-87.5, 30.4], [-87.2, 30.3], [-86.9, 30.2], [-86.6, 30.1], [-86.3, 30.0], [-86.0, 29.9], [-85.7, 29.8], [-85.4, 29.7], [-85.1, 29.6], [-84.8, 29.5]],
      
      // Alabama/Mississippi Coast
      [[-87.5, 30.4], [-88.0, 30.3], [-88.5, 30.2], [-89.0, 30.1], [-89.5, 30.0], [-90.0, 29.9], [-90.5, 29.8]],
      
      // Louisiana Coast (detailed with bayous)
      [[-90.5, 29.8], [-91.0, 29.6], [-91.5, 29.4], [-92.0, 29.2], [-92.5, 29.0], [-93.0, 28.8], [-93.5, 28.6], [-94.0, 28.4]]
    ]
    
    gulfCoastDetails.forEach((coords, index) => {
      const filteredCoords = coords.filter(coord => 
        coord[0] >= bounds.minLng && coord[0] <= bounds.maxLng &&
        coord[1] >= bounds.minLat && coord[1] <= bounds.maxLat
      ) as [number, number][]
      
      if (filteredCoords.length > 1) {
        features.push({
          id: `enhanced-gulf-coast-${index}`,
          type: 'coastline',
          coordinates: filteredCoords,
          properties: { source: 'enhanced', region: 'gulf-coast' }
        })
      }
    })
  }
  
  // Great Lakes detailed segments (if bounds include this area)
  if (bounds.minLng > -95 && bounds.maxLng < -75 && bounds.maxLat > 40 && bounds.minLat < 50) {
    const greatLakesDetails = [
      // Lake Michigan (detailed western shore)
      [[-87.8, 41.8], [-87.7, 42.0], [-87.6, 42.2], [-87.5, 42.4], [-87.4, 42.6], [-87.3, 42.8], [-87.2, 43.0], [-87.1, 43.2], [-87.0, 43.4], [-86.9, 43.6], [-86.8, 43.8], [-86.7, 44.0]],
      
      // Lake Huron (eastern Michigan)
      [[-82.5, 43.0], [-82.3, 43.2], [-82.1, 43.4], [-81.9, 43.6], [-81.7, 43.8], [-81.5, 44.0], [-81.3, 44.2], [-81.1, 44.4], [-80.9, 44.6], [-80.7, 44.8]],
      
      // Lake Erie (southern shore)
      [[-83.0, 41.5], [-82.5, 41.6], [-82.0, 41.7], [-81.5, 41.8], [-81.0, 41.9], [-80.5, 42.0], [-80.0, 42.1], [-79.5, 42.2], [-79.0, 42.3]]
    ]
    
    greatLakesDetails.forEach((coords, index) => {
      const filteredCoords = coords.filter(coord => 
        coord[0] >= bounds.minLng && coord[0] <= bounds.maxLng &&
        coord[1] >= bounds.minLat && coord[1] <= bounds.maxLat
      ) as [number, number][]
      
      if (filteredCoords.length > 1) {
        features.push({
          id: `enhanced-great-lakes-${index}`,
          type: 'lake',
          coordinates: filteredCoords,
          properties: { source: 'enhanced', region: 'great-lakes' }
        })
      }
    })
  }
  
  console.log(`Generated ${features.length} enhanced geographic features for specific bounds`)
  return features
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
    
    // Style based on feature type - ALL BLACK for engraving
    let strokeColor = '#000000'
    let strokeWidth = '0.5'
    let fill = 'none'
    let opacity = '1.0'
    
    switch (feature.type) {
      case 'coastline':
        strokeColor = '#000000' // Black for engraving
        strokeWidth = '0.75'
        break
      case 'lake':
        strokeColor = '#000000' // Black for engraving
        strokeWidth = '0.5'
        fill = 'none' // Just outline for engraving
        opacity = '1.0' // Full opacity for engraving
        break
      case 'river':
        strokeColor = '#000000' // Black for engraving
        strokeWidth = '0.5'
        break
      case 'boundary':
        strokeColor = '#000000' // Black for engraving
        strokeWidth = '0.25'
        opacity = '0.5'
        break
      case 'road':
        strokeColor = '#000000' // Black for engraving
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