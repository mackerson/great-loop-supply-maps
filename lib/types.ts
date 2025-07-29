export interface Location {
  id: string
  name: string
  lat: number
  lng: number
  narrative?: string
  prompt?: string
  iconType?: "icon" | "emoji" | "image"
  icon?: string
  emoji?: string
  caption?: string
  customImage?: string | null
}

// Enhanced order and manufacturing data types
export interface OrderData {
  id: string
  orderNumber: string // EM123456
  status: OrderStatus
  createdAt: string
  updatedAt: string
  
  // Customer information
  customer: CustomerInfo
  
  // Complete map creation data
  mapData: CompleteMapData
  
  // Manufacturing specifications
  productionData: ProductionData
  
  // Order tracking
  statusHistory: OrderStatusEntry[]
}

export interface CustomerInfo {
  name: string
  email: string
  phone?: string
  shippingAddress: ShippingAddress
  isGuest: boolean
  userId?: string
}

export interface ShippingAddress {
  line1: string
  line2?: string
  city: string
  state: string
  postalCode: string
  country: string
}

export interface CompleteMapData {
  template: {
    id: string
    name: string
    category: string
    community: string
  }
  locations: Location[]
  chapters: {
    id: string
    locationId: string
    title: string
    description?: string
    icon: string
    emoji?: string
  }[]
  style: {
    theme: string
    font: string
    fontSize: number
    strokeWidth: number
    showLabels: boolean
    showRoads: boolean
    showLandmarks: boolean
  }
  exportSettings: {
    selectedFormat: string
    selectedSize: string
    customWidth?: string
    customHeight?: string
    orientation: 'portrait' | 'landscape'
    selectedMaterial: string
  }
}

export interface ProductionData {
  // Physical specifications
  dimensions: {
    widthInches: number
    heightInches: number
    thicknessInches: number
  }
  
  // Material specifications
  material: {
    id: string
    name: string
    type: 'wood' | 'metal' | 'acrylic' | 'leather'
    finish?: string
    engraveDepth?: number
  }
  
  // Manufacturing files
  files: {
    customerPreview: string // PNG/JPG for customer
    vectorCut: string // SVG or DXF for cutting outline
    vectorEngrave: string // SVG or DXF for engraving content
    materialSpec: string // Manufacturing specifications sheet
    productionNotes: string // Special instructions
  }
  
  // CNC/Laser settings
  machineSettings: {
    cutSpeed?: number
    cutPower?: number
    engraveSpeed?: number
    engravePower?: number
    passes?: number
  }
}

export type OrderStatus = 
  | 'pending'        // Order received, awaiting review
  | 'design_review'  // Checking design for manufacturing feasibility
  | 'approved'       // Ready for production
  | 'in_production'  // Being manufactured
  | 'quality_check'  // Post-production inspection
  | 'packaging'      // Preparing for shipment
  | 'shipped'        // In transit to customer
  | 'delivered'      // Successfully delivered
  | 'cancelled'      // Order cancelled
  | 'refunded'       // Order refunded

export interface OrderStatusEntry {
  id: string
  orderId: string
  status: OrderStatus
  timestamp: string
  notes?: string
  updatedBy: string // user ID or 'system'
}

// Manufacturing export formats
export interface ManufacturingExport {
  orderId: string
  formats: {
    svg: {
      cutLayer: string
      textEngraveLayer: string
      geographicFeaturesLayer: string
      routePathLayer: string
      engraveLayer?: string // Legacy support
      combined: string
    }
    dxf: {
      cutFile: string
      textEngraveFile: string
      geographicFeaturesFile: string
      routePathFile: string
      engraveFile?: string // Legacy support
    }
    specs: {
      materialSheet: string
      productionInstructions: string
      customerPreview: string
      manufacturingGuide: string
    }
  }
  metadata: {
    exportedAt: string
    exportedBy: string
    version: string
  }
}
