// Simplified geographic features for Great Loop maps
// Focused on major coastlines, Great Lakes, and key waterways

export interface GeographicFeature {
  id: string
  name: string
  type: 'coastline' | 'lake' | 'river' | 'state_boundary'
  coordinates: [number, number][]
  style?: {
    stroke?: string
    strokeWidth?: number
    fill?: string
    opacity?: number
  }
}

// Simplified US coastlines relevant to Great Loop
export const greatLoopCoastlines: GeographicFeature[] = [
  {
    id: 'atlantic-coast',
    name: 'Atlantic Coast',
    type: 'coastline',
    coordinates: [
      [-81.0, 25.5], // Miami area
      [-80.5, 26.0], // Fort Lauderdale
      [-80.0, 27.0], // West Palm Beach
      [-79.8, 28.5], // Cape Canaveral
      [-81.0, 29.5], // Daytona
      [-81.4, 30.5], // St. Augustine
      [-81.5, 31.0], // Jacksonville
      [-80.8, 32.0], // Savannah
      [-79.9, 32.8], // Charleston
      [-78.6, 33.9], // Myrtle Beach
      [-77.8, 34.2], // Cape Fear
      [-76.3, 36.0], // Cape Hatteras
      [-76.0, 37.0], // Chesapeake Bay
      [-75.5, 38.5], // Delaware Bay
      [-74.0, 40.7], // New York Harbor
      [-72.0, 41.0], // Long Island
    ]
  },
  {
    id: 'gulf-coast',
    name: 'Gulf Coast',
    type: 'coastline',
    coordinates: [
      [-97.4, 25.9], // South Texas
      [-94.0, 29.3], // Houston area
      [-93.7, 29.7], // Louisiana border
      [-91.8, 29.2], // Mississippi River delta
      [-89.0, 30.2], // Mississippi coast
      [-88.0, 30.7], // Mobile Bay
      [-87.5, 30.4], // Pensacola
      [-86.5, 30.2], // Florida panhandle
      [-84.9, 29.6], // Apalachicola
      [-83.0, 28.9], // Big Bend
      [-82.5, 27.8], // Tampa Bay
      [-81.8, 26.1], // Fort Myers
      [-81.1, 25.8], // Naples
      [-80.9, 25.5], // Florida Keys start
    ]
  }
]

// Great Lakes system
export const greatLakes: GeographicFeature[] = [
  {
    id: 'lake-michigan',
    name: 'Lake Michigan',
    type: 'lake',
    coordinates: [
      [-87.0, 42.0], // Southern tip
      [-86.3, 42.7], // Southeast shore
      [-86.0, 43.5], // East central
      [-85.8, 44.8], // Northeast
      [-85.5, 45.8], // North tip
      [-87.1, 45.7], // Northwest
      [-87.9, 44.0], // West central
      [-87.6, 42.5], // Southwest
      [-87.0, 42.0], // Back to start
    ]
  },
  {
    id: 'lake-huron',
    name: 'Lake Huron',
    type: 'lake',
    coordinates: [
      [-82.4, 43.0], // South
      [-82.2, 44.0], // Southeast
      [-81.6, 45.0], // East
      [-81.2, 46.0], // Northeast
      [-83.5, 46.0], // North
      [-84.7, 45.8], // Northwest
      [-84.5, 45.0], // West
      [-83.2, 44.0], // Southwest
      [-82.4, 43.0], // Back to start
    ]
  },
  {
    id: 'lake-erie',
    name: 'Lake Erie',
    type: 'lake',
    coordinates: [
      [-83.2, 41.3], // Western tip
      [-82.7, 41.5], // Toledo area
      [-81.7, 41.5], // Cleveland area
      [-80.5, 42.0], // Buffalo area
      [-79.0, 42.9], // Eastern tip
      [-79.8, 42.2], // South shore east
      [-81.0, 41.9], // South shore central
      [-82.5, 41.7], // South shore west
      [-83.2, 41.3], // Back to start
    ]
  },
  {
    id: 'lake-ontario',
    name: 'Lake Ontario',
    type: 'lake',
    coordinates: [
      [-79.2, 43.2], // Western end
      [-78.9, 43.4], // Rochester area
      [-76.8, 43.8], // Eastern end
      [-76.2, 44.2], // Northeast
      [-77.0, 44.0], // North shore central
      [-78.0, 43.7], // North shore west
      [-79.2, 43.2], // Back to start
    ]
  }
]

// Major rivers relevant to Great Loop
export const greatLoopRivers: GeographicFeature[] = [
  {
    id: 'mississippi-river',
    name: 'Mississippi River',
    type: 'river',
    coordinates: [
      [-90.2, 38.6], // St. Louis area
      [-89.7, 36.9], // Cape Girardeau
      [-90.0, 35.1], // Memphis
      [-91.1, 32.3], // Vicksburg
      [-91.4, 30.5], // Baton Rouge
      [-90.1, 29.9], // New Orleans
    ]
  },
  {
    id: 'hudson-river',
    name: 'Hudson River',
    type: 'river',
    coordinates: [
      [-74.0, 40.7], // New York Harbor
      [-73.9, 41.3], // West Point
      [-73.7, 42.7], // Albany
      [-73.8, 43.3], // Champlain Canal
    ]
  }
]

// Generate SVG path for geographic features
export function generateGeographicFeatures(
  features: GeographicFeature[],
  bounds: { minLat: number; maxLat: number; minLng: number; maxLng: number },
  width: number,
  height: number,
  theme: string
): string {
  const getFeatureStyle = (feature: GeographicFeature) => {
    const baseStyles = {
      coastline: { stroke: '#94a3b8', strokeWidth: '1', fill: 'none', opacity: '0.6' },
      lake: { stroke: '#0ea5e9', strokeWidth: '1', fill: '#e0f2fe', opacity: '0.4' },
      river: { stroke: '#0ea5e9', strokeWidth: '2', fill: 'none', opacity: '0.5' },
      state_boundary: { stroke: '#e2e8f0', strokeWidth: '0.5', fill: 'none', opacity: '0.3' }
    }
    
    return { ...baseStyles[feature.type], ...feature.style }
  }

  const projectCoordinate = (coord: [number, number]) => {
    const x = ((coord[0] - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * width
    const y = height - ((coord[1] - bounds.minLat) / (bounds.maxLat - bounds.minLat)) * height
    return [x, y]
  }

  return features.map(feature => {
    const style = getFeatureStyle(feature)
    const projectedCoords = feature.coordinates.map(projectCoordinate)
    const pathData = projectedCoords.map((coord, index) => 
      `${index === 0 ? 'M' : 'L'} ${coord[0]} ${coord[1]}`
    ).join(' ')
    
    const shouldClose = feature.type === 'lake'
    const finalPath = shouldClose ? pathData + ' Z' : pathData
    
    return `<path d="${finalPath}" 
                  stroke="${style.stroke}" 
                  stroke-width="${style.strokeWidth}" 
                  fill="${style.fill || 'none'}" 
                  opacity="${style.opacity}"
                  class="geographic-feature geographic-${feature.type}" />`
  }).join('\n    ')
}

// Get all Great Loop geographic features
export function getGreatLoopGeography(): GeographicFeature[] {
  return [
    ...greatLoopCoastlines,
    ...greatLakes,
    ...greatLoopRivers
  ]
} 