import { 
  OrderData, 
  CustomerInfo, 
  CompleteMapData, 
  ProductionData, 
  OrderStatus,
  ManufacturingExport,
  OrderStatusEntry
} from './types'
import { useMapCreationStore } from '@/stores/map-creation'
import { greatLoopTemplate } from './templates/great-loop'
import { 
  getMapboxGeographicFeatures, 
  getMapboxCoastlineData, 
  mapboxFeaturesToSVG,
  MapboxGeographicFeature,
  MAPBOX_ACCESS_TOKEN
} from './mapbox'

// Generate unique order number
export function generateOrderNumber(): string {
  const prefix = 'EM'
  const timestamp = Date.now().toString().slice(-6)
  const random = Math.floor(Math.random() * 100).toString().padStart(2, '0')
  return `${prefix}${timestamp}${random}`
}

// Convert map creation state to complete order data
export function createOrderFromMapState(
  customerInfo: CustomerInfo,
  mapCreationState: ReturnType<typeof useMapCreationStore.getState>
): OrderData {
  const orderId = crypto.randomUUID()
  const orderNumber = generateOrderNumber()
  const now = new Date().toISOString()

  // Extract complete map data from Zustand store
  const mapData: CompleteMapData = {
    template: {
      id: mapCreationState.selectedTemplate?.id || '',
      name: mapCreationState.selectedTemplate?.name || '',
      category: mapCreationState.selectedTemplate?.category || '',
      community: mapCreationState.selectedTemplate?.community || ''
    },
    locations: mapCreationState.locations,
    chapters: mapCreationState.chapters,
    style: mapCreationState.style,
    exportSettings: mapCreationState.export
  }

  // Generate production data
  const productionData = generateProductionData(mapData)

  // Create initial status entry
  const initialStatus: OrderStatusEntry = {
    id: crypto.randomUUID(),
    orderId,
    status: 'pending',
    timestamp: now,
    notes: 'Order received and queued for design review',
    updatedBy: 'system'
  }

  const order: OrderData = {
    id: orderId,
    orderNumber,
    status: 'pending',
    createdAt: now,
    updatedAt: now,
    customer: customerInfo,
    mapData,
    productionData,
    statusHistory: [initialStatus]
  }

  return order
}

// Generate production data and manufacturing files
export function generateProductionData(mapData: CompleteMapData): ProductionData {
  const { exportSettings } = mapData
  
  // Parse dimensions from export settings
  const dimensions = parseDimensions(exportSettings.selectedSize, exportSettings.orientation)
  
  // Get material specifications
  const material = getMaterialSpecs(exportSettings.selectedMaterial)
  
  // Generate manufacturing files
  const files = generateManufacturingFiles(mapData)
  
  // Set default machine settings based on material
  const machineSettings = getDefaultMachineSettings(material.type)

  return {
    dimensions,
    material,
    files,
    machineSettings
  }
}

// Parse dimensions from size string (e.g., "8x10", "12x16")
function parseDimensions(sizeString: string, orientation: string) {
  let width: number, height: number
  const thickness: number = 0.25 // Default 1/4 inch

  if (sizeString === "8x10") {
    width = 8
    height = 10
  } else if (sizeString === "11x14") {
    width = 11
    height = 14
  } else if (sizeString === "16x20") {
    width = 16
    height = 20
  } else {
    // Parse custom dimensions or default
    const parts = sizeString.split('x')
    width = parseInt(parts[0]) || 8
    height = parseInt(parts[1]) || 10
  }

  // Swap for landscape orientation
  if (orientation === 'landscape' && width < height) {
    [width, height] = [height, width]
  }

  return {
    widthInches: width,
    heightInches: height,
    thicknessInches: thickness
  }
}

// Get material specifications
function getMaterialSpecs(materialId: string) {
  const materials = {
    'cherry-wood': {
      id: 'cherry-wood',
      name: 'Cherry Wood',
      type: 'wood' as const,
      finish: 'Natural',
      engraveDepth: 0.02 // 20 thousandths
    },
    'walnut-wood': {
      id: 'walnut-wood',
      name: 'Walnut Wood',
      type: 'wood' as const,
      finish: 'Natural',
      engraveDepth: 0.02
    },
    'bamboo': {
      id: 'bamboo',
      name: 'Bamboo',
      type: 'wood' as const,
      finish: 'Natural',
      engraveDepth: 0.015
    },
    'anodized-aluminum': {
      id: 'anodized-aluminum',
      name: 'Anodized Aluminum',
      type: 'metal' as const,
      finish: 'Brushed',
      engraveDepth: 0.005
    }
  }

  return materials[materialId as keyof typeof materials] || materials['cherry-wood']
}

// Generate manufacturing files (placeholders for now, will be enhanced)
function generateManufacturingFiles(mapData: CompleteMapData) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  
  return {
    customerPreview: `preview-${timestamp}.png`,
    vectorCut: `cut-${timestamp}.svg`,
    vectorEngrave: `engrave-${timestamp}.svg`,
    materialSpec: `spec-${timestamp}.pdf`,
    productionNotes: `notes-${timestamp}.txt`
  }
}

// Get default machine settings based on material
function getDefaultMachineSettings(materialType: string) {
  const settings = {
    wood: {
      cutSpeed: 100,
      cutPower: 75,
      engraveSpeed: 400,
      engravePower: 45,
      passes: 1
    },
    metal: {
      cutSpeed: 80,
      cutPower: 90,
      engraveSpeed: 300,
      engravePower: 60,
      passes: 2
    },
    acrylic: {
      cutSpeed: 120,
      cutPower: 65,
      engraveSpeed: 500,
      engravePower: 30,
      passes: 1
    }
  }

  return settings[materialType as keyof typeof settings] || settings.wood
}

// Generate manufacturing export data - now requires real Mapbox data
export async function generateManufacturingExport(order: OrderData): Promise<ManufacturingExport> {
  const now = new Date().toISOString()
  
  // Check Mapbox availability upfront
  if (!MAPBOX_ACCESS_TOKEN) {
    throw new Error('Manufacturing exports require Mapbox access token for real geographic data. Please configure NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN.')
  }
  
  try {
    console.log(`Generating manufacturing export for order ${order.orderNumber} with real Mapbox data...`)
    
    return {
      orderId: order.id,
      formats: {
        svg: {
          cutLayer: generateCutLayerSVG(order),
          textEngraveLayer: await generateTextEngraveLayerSVG(order),
          geographicFeaturesLayer: await generateGeographicFeaturesLayerSVG(order),
          routePathLayer: await generateRoutePathLayerSVG(order),
          combined: await generateCombinedSVGAsync(order)
        },
        dxf: {
          cutFile: generateCutDXF(order),
          textEngraveFile: generateTextEngraveDXF(order),
          geographicFeaturesFile: generateGeographicFeaturesDXF(order),
          routePathFile: generateRoutePathDXF(order)
        },
        specs: {
          materialSheet: generateMaterialSheet(order),
          productionInstructions: generateProductionInstructions(order),
          customerPreview: generateCustomerPreview(order),
          manufacturingGuide: generateManufacturingProcessGuide(order)
        }
      },
      metadata: {
        exportedAt: now,
        exportedBy: 'system',
        version: '3.0-multi-layer-manufacturing'
      }
    }
  } catch (error) {
    console.error('Manufacturing export failed:', error)
    throw new Error(`Manufacturing export failed for order ${order.orderNumber}: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Enhanced SVG generation functions with real map data
function generateCutLayerSVG(order: OrderData): string {
  const { widthInches, heightInches } = order.productionData.dimensions
  const margin = 0.125 // 1/8 inch margin for cutting
  
  console.log('Generating cut layer with dimensions:', { widthInches, heightInches, margin })
  
  // Convert inches to points (72 DPI)
  const widthPts = widthInches * 72
  const heightPts = heightInches * 72
  const marginPts = margin * 72
  
  console.log('Cut layer calculations:', { widthPts, heightPts, marginPts })
  
  const cutSVG = `<svg width="${widthInches}in" height="${heightInches}in" viewBox="0 0 ${widthPts} ${heightPts}" xmlns="http://www.w3.org/2000/svg">
    <!-- Cut layer - outer boundary for cutting -->
    <rect x="${marginPts}" y="${marginPts}" 
          width="${widthPts - (2 * marginPts)}" 
          height="${heightPts - (2 * marginPts)}" 
          fill="none" 
          stroke="red" 
          stroke-width="2"
          class="cut-boundary"/>
    
    <!-- Corner registration marks -->
    <circle cx="${marginPts}" cy="${marginPts}" r="4" fill="red" class="registration-mark"/>
    <circle cx="${widthPts - marginPts}" cy="${marginPts}" r="4" fill="red" class="registration-mark"/>
    <circle cx="${marginPts}" cy="${heightPts - marginPts}" r="4" fill="red" class="registration-mark"/>
    <circle cx="${widthPts - marginPts}" cy="${heightPts - marginPts}" r="4" fill="red" class="registration-mark"/>
    
    <!-- Debug info -->
    <text x="10" y="20" font-family="Arial" font-size="8" fill="red">
      Cut: ${widthInches}"×${heightInches}" (${widthPts}×${heightPts}pts)
    </text>
  </svg>`
  
  console.log('Generated cut SVG:', cutSVG.substring(0, 200) + '...')
  return cutSVG
}

// Generate text and symbols layer (fine laser engraving)
async function generateTextEngraveLayerSVG(order: OrderData): Promise<string> {
  const { widthInches, heightInches } = order.productionData.dimensions
  const { mapData } = order
  
  // Convert inches to points (72 DPI)
  const widthPts = widthInches * 72
  const heightPts = heightInches * 72
  const margin = 36 // 0.5 inch margin for content
  const contentWidth = widthPts - (2 * margin)
  const contentHeight = heightPts - (2 * margin)
  
  // Start building SVG content for text/symbols only
  let svgContent = `<svg width="${widthInches}in" height="${heightInches}in" viewBox="0 0 ${widthPts} ${heightPts}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <style>
        .map-title { font-family: Arial, sans-serif; font-size: 18px; font-weight: bold; text-anchor: middle; fill: black; }
        .location-label { font-family: Arial, sans-serif; font-size: 8px; text-anchor: middle; fill: black; }
        .chapter-title { font-family: Arial, sans-serif; font-size: 10px; font-weight: bold; text-anchor: start; fill: black; }
        .location-marker { fill: black; stroke: none; }
      </style>
    </defs>
    
    <!-- Content group with margins -->
    <g transform="translate(${margin}, ${margin})">
  `
  
  // Add title
  svgContent += `
      <!-- Map Title -->
      <text x="${contentWidth / 2}" y="30" class="map-title">${mapData.template.name}</text>
  `
  
  const mapContentY = 50
  const mapContentHeight = contentHeight - 100
  
  // Calculate map bounds for positioning
  const bounds = calculateMapBounds(mapData)
  
  // Add location markers and labels
  const locationMarkers = generateLocationMarkers(mapData.locations, bounds, contentWidth, mapContentHeight, mapContentY)
  svgContent += locationMarkers
  
  // Add chapter information
  const chapterInfo = generateChapterInfo(mapData.chapters, mapData.locations, contentWidth, contentHeight)
  svgContent += chapterInfo
  
  svgContent += `
    </g>
  </svg>`
  
  return svgContent
}

// Generate geographic features layer (deep CNC routing or laser etching)
async function generateGeographicFeaturesLayerSVG(order: OrderData): Promise<string> {
  const { widthInches, heightInches } = order.productionData.dimensions
  const { mapData } = order
  
  // Geographic features now use OpenStreetMap (no token required)
  
  // Convert inches to points (72 DPI)
  const widthPts = widthInches * 72
  const heightPts = heightInches * 72
  const margin = 36 // 0.5 inch margin for content
  const contentWidth = widthPts - (2 * margin)
  const contentHeight = heightPts - (2 * margin)
  
  // Calculate map bounds from locations and route
  const bounds = calculateMapBounds(mapData)
  
  // Start building SVG content for geographic features only
  let svgContent = `<svg width="${widthInches}in" height="${heightInches}in" viewBox="0 0 ${widthPts} ${heightPts}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <style>
        .mapbox-feature { vector-effect: non-scaling-stroke; }
        .mapbox-coastline { stroke: #000000; stroke-width: 1.0; fill: none; }
        .mapbox-lake { stroke: #000000; stroke-width: 0.75; fill: none; }
        .mapbox-river { stroke: #000000; stroke-width: 0.5; fill: none; }
        .mapbox-boundary { stroke: #000000; stroke-width: 0.25; fill: none; opacity: 0.5; }
        .mapbox-road { stroke: #000000; stroke-width: 0.25; fill: none; opacity: 0.3; }
      </style>
    </defs>
    
    <!-- Content group with margins -->
    <g transform="translate(${margin}, ${margin})">
  `
  
  const mapContentY = 50
  const mapContentHeight = contentHeight - 100
  
  try {
          // Fetch real geographic features from OpenStreetMap
      console.log('Fetching real geographic data for geographic features layer...')
      const geoFeatures = await getMapboxGeographicFeatures(bounds, ['water', 'admin'])
      
      if (geoFeatures.length === 0) {
        throw new Error('No geographic features found from OpenStreetMap.')
      }
      
      console.log(`Successfully fetched ${geoFeatures.length} geographic features for features layer`)
      
      // Convert geographic features to SVG
      const realGeographicFeatures = mapboxFeaturesToSVG(
        geoFeatures,
        bounds,
        contentWidth,
        mapContentHeight
      )
    
    svgContent += `
      <!-- Geographic Features from Mapbox -->
      <g transform="translate(0, ${mapContentY})">
        ${realGeographicFeatures}
      </g>
    `
    
  } catch (error) {
    console.error('Failed to fetch geographic features:', error)
    throw error
  }
  
  svgContent += `
    </g>
  </svg>`
  
  return svgContent
}

// Generate route path layer (medium depth engraving)
async function generateRoutePathLayerSVG(order: OrderData): Promise<string> {
  const { widthInches, heightInches } = order.productionData.dimensions
  const { mapData } = order
  
  // Convert inches to points (72 DPI)
  const widthPts = widthInches * 72
  const heightPts = heightInches * 72
  const margin = 36 // 0.5 inch margin for content
  const contentWidth = widthPts - (2 * margin)
  const contentHeight = heightPts - (2 * margin)
  
  // Calculate map bounds from locations and route
  const bounds = calculateMapBounds(mapData)
  
  // Start building SVG content for route path only
  let svgContent = `<svg width="${widthInches}in" height="${heightInches}in" viewBox="0 0 ${widthPts} ${heightPts}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <style>
        .route-path { stroke: black; stroke-width: 2.0; fill: none; stroke-dasharray: none; }
        .route-segment { stroke: black; stroke-width: 1.5; fill: none; }
      </style>
    </defs>
    
    <!-- Content group with margins -->
    <g transform="translate(${margin}, ${margin})">
  `
  
  const mapContentY = 50
  const mapContentHeight = contentHeight - 100
  
  // Add route path
  const routePath = generateRoutePath(mapData, bounds, contentWidth, mapContentHeight)
  svgContent += `
    <!-- Route Path -->
    <g transform="translate(0, ${mapContentY})" class="route-group">
      ${routePath}
    </g>
  `
  
  svgContent += `
    </g>
  </svg>`
  
  return svgContent
}

// Legacy function - now calls the text layer
async function generateEngraveLayerSVG(order: OrderData): Promise<string> {
  const { widthInches, heightInches } = order.productionData.dimensions
  const { mapData } = order
  
  // Check if Mapbox is available
  if (!MAPBOX_ACCESS_TOKEN) {
    throw new Error('Mapbox access token is required for manufacturing exports. Geographic features cannot be generated without real map data.')
  }
  
  // Convert inches to points (72 DPI)
  const widthPts = widthInches * 72
  const heightPts = heightInches * 72
  const margin = 36 // 0.5 inch margin for content
  const contentWidth = widthPts - (2 * margin)
  const contentHeight = heightPts - (2 * margin)
  
  // Calculate map bounds from locations and route
  const bounds = calculateMapBounds(mapData)
  
  // Start building SVG content
  let svgContent = `<svg width="${widthInches}in" height="${heightInches}in" viewBox="0 0 ${widthPts} ${heightPts}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <style>
        .map-title { font-family: Arial, sans-serif; font-size: 18px; font-weight: bold; text-anchor: middle; fill: black; }
        .location-label { font-family: Arial, sans-serif; font-size: 8px; text-anchor: middle; fill: black; }
        .chapter-title { font-family: Arial, sans-serif; font-size: 10px; font-weight: bold; text-anchor: start; fill: black; }
        .route-path { stroke: black; stroke-width: 1.5; fill: none; stroke-dasharray: 2,1; }
        .location-marker { fill: black; stroke: none; }
        .mapbox-feature { vector-effect: non-scaling-stroke; }
        .mapbox-coastline { stroke: #1e40af; stroke-width: 0.75; fill: none; }
        .mapbox-lake { stroke: #0ea5e9; stroke-width: 0.5; fill: none; opacity: 0.8; }
        .mapbox-river { stroke: #06b6d4; stroke-width: 1.0; fill: none; }
        .mapbox-boundary { stroke: #6b7280; stroke-width: 0.25; fill: none; opacity: 0.5; }
        .mapbox-road { stroke: #374151; stroke-width: 0.25; fill: none; opacity: 0.3; }
      </style>
    </defs>
    
    <!-- Content group with margins -->
    <g transform="translate(${margin}, ${margin})">
  `
  
  // Add title
  svgContent += `
      <!-- Map Title -->
      <text x="${contentWidth / 2}" y="30" class="map-title">${mapData.template.name}</text>
  `
  
  // Add geographic features using real Mapbox data
  const mapContentY = 50
  const mapContentHeight = contentHeight - 100 // Leave space for title and legend
  
  try {
    // Fetch real geographic features from Mapbox - this is required
    console.log('Fetching real geographic data from Mapbox for manufacturing...')
    const mapboxFeatures = await getMapboxGeographicFeatures(bounds, ['water', 'admin'])
    
    if (mapboxFeatures.length === 0) {
      throw new Error('No geographic features found from Mapbox. This may indicate the map area is outside supported regions or the API request failed.')
    }
    
    console.log(`Successfully fetched ${mapboxFeatures.length} geographic features from Mapbox`)
    
    // Convert Mapbox features to SVG
    const realGeographicFeatures = mapboxFeaturesToSVG(
      mapboxFeatures,
      bounds,
      contentWidth,
      mapContentHeight
    )
    
    svgContent += `
      <!-- Real Geographic Features from Mapbox -->
      <g transform="translate(0, ${mapContentY})">
        ${realGeographicFeatures}
      </g>
    `
    
    // Add route path
    const routePath = generateRoutePath(mapData, bounds, contentWidth, mapContentHeight)
    svgContent += `
      <!-- Route Path -->
      <g transform="translate(0, ${mapContentY})" class="route-group">
        ${routePath}
      </g>
    `
    
  } catch (error) {
    console.error('Failed to fetch required Mapbox data for manufacturing:', error)
    throw new Error(`Manufacturing export failed: Unable to fetch real geographic data. ${error instanceof Error ? error.message : 'Unknown error occurred.'} Please ensure your Mapbox access token is valid and try again.`)
  }
  
  // Add location markers and labels
  const locationMarkers = generateLocationMarkers(mapData.locations, bounds, contentWidth, mapContentHeight, mapContentY)
  svgContent += locationMarkers
  
  // Add chapter information
  const chapterInfo = generateChapterInfo(mapData.chapters, mapData.locations, contentWidth, contentHeight)
  svgContent += chapterInfo
  
  svgContent += `
    </g>
  </svg>`
  
  return svgContent
}

// All fallback functions removed - manufacturing exports now require real Mapbox data

function calculateMapBounds(mapData: CompleteMapData): {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
} {
  let minLat = Infinity, maxLat = -Infinity, minLng = Infinity, maxLng = -Infinity
  
  // Include user locations
  mapData.locations.forEach(location => {
    minLat = Math.min(minLat, location.lat)
    maxLat = Math.max(maxLat, location.lat)
    minLng = Math.min(minLng, location.lng)
    maxLng = Math.max(maxLng, location.lng)
  })
  
  // Include template route bounds if available
  if (mapData.template.id === 'great-loop') {
    const templateBounds = greatLoopTemplate.config.routeData?.bounds
    if (templateBounds) {
      minLat = Math.min(minLat, templateBounds.south)
      maxLat = Math.max(maxLat, templateBounds.north)
      minLng = Math.min(minLng, templateBounds.west)
      maxLng = Math.max(maxLng, templateBounds.east)
    }
  }
  
  // Add padding
  const latPadding = (maxLat - minLat) * 0.1
  const lngPadding = (maxLng - minLng) * 0.1
  
  return {
    minLat: minLat - latPadding,
    maxLat: maxLat + latPadding,
    minLng: minLng - lngPadding,
    maxLng: maxLng + lngPadding
  }
}

function generateRoutePath(
  mapData: CompleteMapData, 
  bounds: { minLat: number; maxLat: number; minLng: number; maxLng: number }, 
  width: number, 
  height: number
): string {
  if (mapData.template.id !== 'great-loop') return ''
  
  const routeCoordinates = greatLoopTemplate.config.routeData?.path
  if (!routeCoordinates) return ''
  
  const projectCoordinate = (coord: [number, number]) => {
    const x = ((coord[0] - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * width
    const y = height - ((coord[1] - bounds.minLat) / (bounds.maxLat - bounds.minLat)) * height
    return [x, y]
  }
  
  const projectedCoords = routeCoordinates.map(projectCoordinate)
  const pathData = projectedCoords.map((coord: number[], index: number) => 
    `${index === 0 ? 'M' : 'L'} ${coord[0].toFixed(2)} ${coord[1].toFixed(2)}`
  ).join(' ')
  
  return `<path d="${pathData}" class="route-path" />`
}

function generateLocationMarkers(
  locations: CompleteMapData['locations'], 
  bounds: { minLat: number; maxLat: number; minLng: number; maxLng: number }, 
  width: number, 
  height: number, 
  offsetY: number
): string {
  const projectCoordinate = (lat: number, lng: number) => {
    const x = ((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * width
    const y = height - ((lat - bounds.minLat) / (bounds.maxLat - bounds.minLat)) * height
    return [x, y + offsetY]
  }
  
  return locations.map(location => {
    const [x, y] = projectCoordinate(location.lat, location.lng)
    
    return `
      <!-- Location: ${location.name} -->
      <g class="location-group">
        <!-- Marker -->
        <circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="2" class="location-marker"/>
        
        <!-- Label -->
        <text x="${x.toFixed(2)}" y="${(y + 12).toFixed(2)}" class="location-label">
          ${location.name}
        </text>
      </g>
    `
  }).join('')
}

function generateChapterInfo(
  chapters: CompleteMapData['chapters'], 
  locations: CompleteMapData['locations'], 
  width: number, 
  height: number
): string {
  if (chapters.length === 0) return ''
  
  let chapterContent = `
    <!-- Chapter Information -->
    <g class="chapter-info" transform="translate(10, ${height - 80})">
      <text x="0" y="0" class="chapter-title">Journey Highlights:</text>
  `
  
  chapters.slice(0, 5).forEach((chapter, index) => {
    const location = locations.find(loc => loc.id === chapter.locationId)
    const locationName = location ? location.name : 'Unknown'
    
    chapterContent += `
      <text x="0" y="${(index + 1) * 12}" class="location-label">
        ${chapter.icon} ${chapter.title} - ${locationName}
      </text>
    `
  })
  
  chapterContent += `
    </g>
  `
  
  return chapterContent
}

// Update combined SVG generation to be async-only
function generateCombinedSVG(order: OrderData): string {
  throw new Error('Synchronous combined SVG generation is no longer supported. Use generateCombinedSVGAsync with real Mapbox data.')
}

// Async version is now the main version
async function generateCombinedSVGAsync(order: OrderData): Promise<string> {
  const cutLayer = generateCutLayerSVG(order)
  const engraveLayer = await generateEngraveLayerSVG(order)
  
  // Extract content from engrave layer and combine with cut layer
  const engraveContent = engraveLayer.replace(/<svg[^>]*>/, '').replace('</svg>', '')
  const combinedSVG = cutLayer.replace('</svg>', engraveContent + '</svg>')
  
  return combinedSVG
}

// Enhanced DXF generation with real content
function generateCutDXF(order: OrderData): string {
  const { widthInches, heightInches } = order.productionData.dimensions
  const margin = 0.125
  
  // Simple DXF format for cutting outline
  return `0
SECTION
2
ENTITIES
0
LWPOLYLINE
5
100
8
CUT
62
1
70
1
90
4
10
${margin}
20
${margin}
10
${widthInches - margin}
20
${margin}
10
${widthInches - margin}
20
${heightInches - margin}
10
${margin}
20
${heightInches - margin}
0
ENDSEC
0
EOF`
}

function generateEngraveDXF(order: OrderData): string {
  const { mapData } = order
  
  // Simplified DXF with location points and basic text
  let dxfContent = `0
SECTION
2
ENTITIES
`
  
  // Add location points
  mapData.locations.forEach((location, index) => {
    dxfContent += `0
CIRCLE
5
${200 + index}
8
ENGRAVE
62
7
10
${location.lng + 100}
20
${location.lat}
40
0.02
`
    
    // Add text label
    dxfContent += `0
TEXT
5
${300 + index}
8
TEXT
62
7
10
${location.lng + 100}
20
${location.lat + 0.1}
40
0.08
1
${location.name}
`
  })
  
  dxfContent += `0
ENDSEC
0
EOF`
  
  return dxfContent
}

// Generate material specification sheet
function generateMaterialSheet(order: OrderData): string {
  const { material, dimensions, machineSettings } = order.productionData
  
  return `MATERIAL SPECIFICATION SHEET
Order: ${order.orderNumber}
Date: ${new Date(order.createdAt).toLocaleDateString()}

DIMENSIONS:
- Width: ${dimensions.widthInches}"
- Height: ${dimensions.heightInches}"
- Thickness: ${dimensions.thicknessInches}"

MATERIAL:
- Type: ${material.name}
- Material Category: ${material.type}
- Finish: ${material.finish || 'Natural'}
- Engrave Depth: ${material.engraveDepth}"

MACHINE SETTINGS:
- Cut Speed: ${machineSettings.cutSpeed}
- Cut Power: ${machineSettings.cutPower}%
- Engrave Speed: ${machineSettings.engraveSpeed}
- Engrave Power: ${machineSettings.engravePower}%
- Passes: ${machineSettings.passes}

CUSTOMER INFO:
- Name: ${order.customer.name}
- Order Date: ${new Date(order.createdAt).toLocaleDateString()}
- Template: ${order.mapData.template.name}
`
}

// Generate production instructions
function generateProductionInstructions(order: OrderData): string {
  return `PRODUCTION INSTRUCTIONS
Order #${order.orderNumber}

1. MATERIAL PREP:
   - Verify material: ${order.productionData.material.name}
   - Check dimensions: ${order.productionData.dimensions.widthInches}" x ${order.productionData.dimensions.heightInches}"
   - Ensure material is flat and secure

2. CNC/LASER SETUP:
   - Load cut file: cut-${order.orderNumber}.svg
   - Load engrave file: engrave-${order.orderNumber}.svg
   - Set material parameters per specification sheet

3. PRODUCTION STEPS:
   - Run engrave operations first
   - Complete all engraving before cutting
   - Cut outline last to prevent material movement

4. QUALITY CHECK:
   - Verify all engraving is complete and legible
   - Check cut edges are clean
   - Confirm dimensions match specification

5. FINISHING:
   - Light sanding if needed
   - Apply finish if specified
   - Clean thoroughly before packaging

SPECIAL NOTES:
- Template: ${order.mapData.template.name}
- Theme: ${order.mapData.style.theme}
- Customer requested: ${order.mapData.exportSettings.orientation} orientation
`
}

// Generate customer preview (placeholder)
function generateCustomerPreview(order: OrderData): string {
  return `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==`
}

// Save order to localStorage (temporary - will be replaced with Supabase)
export function saveOrderLocally(order: OrderData): void {
  try {
    const existingOrders = getLocalOrders()
    existingOrders.push(order)
    localStorage.setItem('map-orders', JSON.stringify(existingOrders))
    console.log('Order saved locally:', order.orderNumber)
  } catch (error) {
    console.error('Failed to save order locally:', error)
  }
}

// Get orders from localStorage
export function getLocalOrders(): OrderData[] {
  try {
    const orders = localStorage.getItem('map-orders')
    return orders ? JSON.parse(orders) : []
  } catch (error) {
    console.error('Failed to load orders from localStorage:', error)
    return []
  }
}

// Update order status
export function updateOrderStatus(
  orderId: string, 
  newStatus: OrderStatus, 
  notes?: string,
  updatedBy: string = 'system'
): void {
  try {
    const orders = getLocalOrders()
    const orderIndex = orders.findIndex(order => order.id === orderId)
    
    if (orderIndex !== -1) {
      const order = orders[orderIndex]
      const now = new Date().toISOString()
      
      // Add status history entry
      const statusEntry: OrderStatusEntry = {
        id: crypto.randomUUID(),
        orderId,
        status: newStatus,
        timestamp: now,
        notes,
        updatedBy
      }
      
      // Update order
      order.status = newStatus
      order.updatedAt = now
      order.statusHistory.push(statusEntry)
      
      // Save back to localStorage
      localStorage.setItem('map-orders', JSON.stringify(orders))
      
      console.log(`Order ${order.orderNumber} status updated to ${newStatus}`)
    }
  } catch (error) {
    console.error('Failed to update order status:', error)
  }
} 

// Generate text engraving DXF
function generateTextEngraveDXF(order: OrderData): string {
  const { mapData } = order
  
  // Simple DXF with text and symbols only
  let dxfContent = `0
SECTION
2
ENTITIES
`
  
  // Add location points and text labels
  mapData.locations.forEach((location, index) => {
    // Add text label
    dxfContent += `0
TEXT
5
${300 + index}
8
TEXT-ENGRAVE
62
7
10
${location.lng + 100}
20
${location.lat}
40
0.08
1
${location.name}
`
  })
  
  // Add title text
  dxfContent += `0
TEXT
5
100
8
TEXT-ENGRAVE
62
7
10
0
20
0
40
0.15
1
${mapData.template.name}
`
  
  dxfContent += `0
ENDSEC
0
EOF`
  
  return dxfContent
}

// Generate geographic features DXF
function generateGeographicFeaturesDXF(order: OrderData): string {
  // Placeholder for geographic features in DXF format
  let dxfContent = `0
SECTION
2
ENTITIES
`
  
  // Add placeholder geographic feature paths
  dxfContent += `0
LWPOLYLINE
5
200
8
GEOGRAPHIC-FEATURES
62
7
70
0
90
4
10
0
20
0
10
100
20
0
10
100
20
100
10
0
20
100
`
  
  dxfContent += `0
ENDSEC
0
EOF`
  
  return dxfContent
}

// Generate route path DXF
function generateRoutePathDXF(order: OrderData): string {
  // Placeholder for route path in DXF format
  let dxfContent = `0
SECTION
2
ENTITIES
`
  
  // Add route path as polyline
  dxfContent += `0
LWPOLYLINE
5
300
8
ROUTE-PATH
62
7
70
0
90
2
10
50
20
50
10
150
20
150
`
  
  dxfContent += `0
ENDSEC
0
EOF`
  
  return dxfContent
}

// Generate manufacturing process guide
function generateManufacturingProcessGuide(order: OrderData): string {
  return `MANUFACTURING PROCESS GUIDE
Order #${order.orderNumber}

MULTI-LAYER MANUFACTURING APPROACH:

1. CUT LAYER (cut-${order.orderNumber}.svg)
   - Operation: Laser cutting or CNC routing
   - Purpose: Cut material to final dimensions
   - Settings: High power, single pass
   - File: Red lines for cutting path

2. TEXT ENGRAVING LAYER (text-engrave-${order.orderNumber}.svg)
   - Operation: Fine laser engraving or small engraving bit
   - Purpose: Text, location labels, symbols
   - Depth: 0.005" - 0.01" 
   - Settings: Low power, high speed for crisp text

3. GEOGRAPHIC FEATURES LAYER (geographic-features-${order.orderNumber}.svg)
   - Operation: Deep CNC routing or laser etching
   - Purpose: Coastlines, lakes, rivers for tactile detail
   - Depth: 0.02" - 0.05" for tactile feel
   - Settings: Multiple passes, moderate speed

4. ROUTE PATH LAYER (route-path-${order.orderNumber}.svg)
   - Operation: Medium depth engraving
   - Purpose: Journey route highlighting
   - Depth: 0.015" - 0.03"
   - Settings: Single or double pass

RECOMMENDED PROCESSING ORDER:
1. Cut to size (cut layer)
2. Deep geographic features (if using CNC)
3. Medium route paths
4. Fine text engraving (last to avoid damage)

MACHINE SETTINGS:
Material: ${order.productionData.material.name}
Cut Speed: ${order.productionData.machineSettings.cutSpeed}
Cut Power: ${order.productionData.machineSettings.cutPower}%
Engrave Speed: ${order.productionData.machineSettings.engraveSpeed}
Engrave Power: ${order.productionData.machineSettings.engravePower}%

QUALITY NOTES:
- Test engraving depths on scrap material first
- Clean chips between operations
- Check registration between layers
- Verify all text is legible before final assembly
`
} 