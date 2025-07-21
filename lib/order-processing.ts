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

// Generate manufacturing export data
export function generateManufacturingExport(order: OrderData): ManufacturingExport {
  const now = new Date().toISOString()
  
  return {
    orderId: order.id,
    formats: {
      svg: {
        cutLayer: generateCutLayerSVG(order),
        engraveLayer: generateEngraveLayerSVG(order),
        combined: generateCombinedSVG(order)
      },
      dxf: {
        cutFile: generateCutDXF(order),
        engraveFile: generateEngraveDXF(order)
      },
      specs: {
        materialSheet: generateMaterialSheet(order),
        productionInstructions: generateProductionInstructions(order),
        customerPreview: generateCustomerPreview(order)
      }
    },
    metadata: {
      exportedAt: now,
      exportedBy: 'system',
      version: '1.0'
    }
  }
}

// SVG generation functions (to be implemented with actual map rendering)
function generateCutLayerSVG(order: OrderData): string {
  const { widthInches, heightInches } = order.productionData.dimensions
  
  return `<svg width="${widthInches}in" height="${heightInches}in" viewBox="0 0 ${widthInches * 72} ${heightInches * 72}" xmlns="http://www.w3.org/2000/svg">
    <!-- Cut outline -->
    <rect x="10" y="10" width="${widthInches * 72 - 20}" height="${heightInches * 72 - 20}" 
          fill="none" stroke="red" stroke-width="0.5"/>
  </svg>`
}

function generateEngraveLayerSVG(order: OrderData): string {
  // This will be enhanced to generate actual map content
  const { widthInches, heightInches } = order.productionData.dimensions
  
  return `<svg width="${widthInches}in" height="${heightInches}in" viewBox="0 0 ${widthInches * 72} ${heightInches * 72}" xmlns="http://www.w3.org/2000/svg">
    <!-- Map content for engraving -->
    <text x="50%" y="50%" text-anchor="middle" font-family="Arial" font-size="12" fill="black">
      ${order.mapData.template.name} Map
    </text>
  </svg>`
}

function generateCombinedSVG(order: OrderData): string {
  const cutLayer = generateCutLayerSVG(order)
  const engraveLayer = generateEngraveLayerSVG(order)
  
  // Combine both layers
  return cutLayer.replace('</svg>', engraveLayer.replace(/<svg[^>]*>/, '').replace('</svg>', '')) + '</svg>'
}

// DXF generation (simplified - real implementation would use proper DXF library)
function generateCutDXF(order: OrderData): string {
  return `0\nSECTION\n2\nENTITIES\n0\nLWPOLYLINE\n8\nCUT\n0\nENDSEC\n0\nEOF\n`
}

function generateEngraveDXF(order: OrderData): string {
  return `0\nSECTION\n2\nENTITIES\n0\nTEXT\n8\nENGRAVE\n0\nENDSEC\n0\nEOF\n`
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