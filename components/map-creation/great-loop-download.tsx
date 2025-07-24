"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { motion } from "framer-motion"
import { Download, ArrowLeft, Check, Smartphone, Monitor, Printer, Anchor, Heart, Star, ChevronRight, ShoppingCart } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useMapCreationStore } from '@/stores/map-creation'
import { MapRenderer, type MapRendererRef } from './map-renderer'
import PaymentProcessor from '@/components/payment-processor'
import html2canvas from 'html2canvas'

interface GreatLoopDownloadProps {
  onBack?: () => void
}

// Download presets optimized for different uses
const downloadPresets = [
  { 
    id: "phone-wallpaper", 
    name: "Phone Wallpaper", 
    description: "Perfect for your phone lock screen",
    icon: Smartphone,
    format: "png",
    size: "1080x1920",
    orientation: "portrait"
  },
  { 
    id: "desktop-wallpaper", 
    name: "Desktop Background", 
    description: "Great for your computer wallpaper",
    icon: Monitor,
    format: "png", 
    size: "1920x1080",
    orientation: "landscape"
  },
  { 
    id: "print-ready", 
    name: "Print at Home", 
    description: "High-res for personal printing",
    icon: Printer,
    format: "pdf",
    size: "8x10",
    orientation: "portrait"
  }
]

// Available materials for physical maps
const materials = [
  {
    id: "cherry-wood",
    name: "Cherry Wood",
    description: "Classic warmth with beautiful grain patterns",
    price: 89,
    image: "/materials/cherry-wood.jpg",
    engraveDepth: 0.01
  },
  {
    id: "walnut",
    name: "Walnut Wood", 
    description: "Rich, dark tones for an elegant display",
    price: 99,
    image: "/materials/walnut.jpg",
    engraveDepth: 0.01
  },
  {
    id: "bamboo",
    name: "Bamboo",
    description: "Eco-friendly with modern appeal",
    price: 79,
    image: "/materials/bamboo.jpg",
    engraveDepth: 0.005
  },
  {
    id: "aluminum",
    name: "Anodized Aluminum",
    description: "Marine-grade durability, perfect for boats",
    price: 129,
    image: "/materials/aluminum.jpg",
    engraveDepth: 0.02
  }
]

// Available sizes
const sizes = [
  { id: "8x10", name: "8\" × 10\"", description: "Perfect for desk or shelf" },
  { id: "11x14", name: "11\" × 14\"", description: "Great for wall display" },
  { id: "16x20", name: "16\" × 20\"", description: "Statement piece" }
]

// Physical keepsake showcase
const physicalShowcase = [
  {
    id: "boat-cabin",
    title: "Perfect for Your Boat Cabin",
    description: "Display your Great Loop achievement where fellow Loopers can see it",
    image: "/showcase/boat-cabin-map.jpg", // Placeholder
    material: "Marine-grade aluminum"
  },
  {
    id: "home-office", 
    title: "Beautiful Home Display",
    description: "A conversation starter that tells your adventure story",
    image: "/showcase/home-office-map.jpg", // Placeholder  
    material: "Premium maple wood"
  },
  {
    id: "gift-option",
    title: "Perfect Gift for Fellow Loopers",
    description: "Custom engraved with their home port and special anchorages",
    image: "/showcase/gift-map.jpg", // Placeholder
    material: "Brushed marine brass"
  }
]

export function GreatLoopDownload({ onBack }: GreatLoopDownloadProps) {
  const {
    locations,
    style,
    selectedTemplate,
    getTerminology
  } = useMapCreationStore()

  const [selectedPreset, setSelectedPreset] = useState("phone-wallpaper")
  const [isDownloading, setIsDownloading] = useState(false)
  const [isDownloaded, setIsDownloaded] = useState(false)
  const [showPhysicalOptions, setShowPhysicalOptions] = useState(false)
  const [showOrderFlow, setShowOrderFlow] = useState(false)
  const [selectedMaterial, setSelectedMaterial] = useState<string>("")
  const [selectedSize, setSelectedSize] = useState<string>("")
  const [selectedOrientation, setSelectedOrientation] = useState<string>("portrait")
  const [actualDimensions, setActualDimensions] = useState<Record<string, string>>({})

  const mapRendererRef = useRef<MapRendererRef>(null)

  // Calculate actual dimensions for current device and update display
  useEffect(() => {
    const devicePixelRatio = window.devicePixelRatio || 1
    const newDimensions: Record<string, string> = {}
    
    downloadPresets.forEach(preset => {
      const { width, height } = getParsedDimensions(preset.size, preset.orientation)
      const actualWidth = Math.round(width * devicePixelRatio)
      const actualHeight = Math.round(height * devicePixelRatio)
      newDimensions[preset.id] = `${actualWidth}×${actualHeight}`
    })
    
    setActualDimensions(newDimensions)
  }, [])

  // Trigger map resize when preset selection changes
  useEffect(() => {
    if (mapRendererRef.current) {
      mapRendererRef.current.resize()
    }
  }, [selectedPreset])

  // Helper function to parse dimensions from preset size string
  const getParsedDimensions = (sizeString: string, orientation: string) => {
    if (sizeString === "8x10") {
      // For print, use 300 DPI: 8"×10" = 2400×3000 pixels
      return orientation === "portrait" ? { width: 2400, height: 3000 } : { width: 3000, height: 2400 }
    }
    
    const [widthStr, heightStr] = sizeString.split('x')
    let width = parseInt(widthStr)
    let height = parseInt(heightStr)
    
    // Account for device pixel ratio to get exact dimensions
    const devicePixelRatio = window.devicePixelRatio || 1
    if (devicePixelRatio > 1) {
      console.log(`Adjusting for device pixel ratio: ${devicePixelRatio}`)
      // Scale down the target to compensate for automatic DPR scaling
      width = Math.round(width / devicePixelRatio)
      height = Math.round(height / devicePixelRatio)
      console.log(`Adjusted dimensions: ${width}x${height} (will be scaled to ${width * devicePixelRatio}x${height * devicePixelRatio})`)
    }
    
    return { width, height }
  }

  const handleDownload = async () => {
    setIsDownloading(true)
    
    try {
      const preset = downloadPresets.find(p => p.id === selectedPreset)
      if (!preset) return

      // Use the MapRenderer's built-in export functionality
      if (!mapRendererRef.current) {
        throw new Error('Map not ready for export')
      }

      // Get target dimensions for high-resolution export
      const { width, height } = getParsedDimensions(preset.size, preset.orientation)
      console.log(`Downloading ${preset.name} at ${width}x${height}`)

      const dataURL = await mapRendererRef.current.exportImage(width, height)
      
      // Generate download
      const timestamp = new Date().toISOString().slice(0, 10)
      const filename = `great-loop-map-${preset.name.toLowerCase().replace(/\s+/g, '-')}-${timestamp}.png`

      // Convert data URL to blob and download
      const response = await fetch(dataURL)
      const blob = await response.blob()
      
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      setIsDownloaded(true)
      setTimeout(() => setIsDownloaded(false), 3000)
    } catch (error) {
      console.error('Download error:', error)
      alert('Download failed. Please try again.')
    } finally {
      setIsDownloading(false)
    }
  }

  const handleOrderPhysicalMap = () => {
    setShowPhysicalOptions(false)
    setShowOrderFlow(true)
  }

  const handleProceedToPayment = () => {
    if (!selectedMaterial || !selectedSize) {
      alert('Please select both material and size')
      return
    }
    // This will trigger the payment processor view
    setShowOrderFlow(true)
  }

  const getThemeColors = () => {
    if (selectedTemplate?.config.styling.theme === 'nautical') {
      return {
        background: "bg-blue-50",
        primary: selectedTemplate.config.styling.primaryColor || "#1e40af",
        secondary: selectedTemplate.config.styling.secondaryColor || "#0ea5e9"
      }
    }
    return {
      background: "bg-gray-50", 
      primary: "#1e40af",
      secondary: "#0ea5e9"
    }
  }

  const themeColors = getThemeColors()
  const selectedPresetData = downloadPresets.find(p => p.id === selectedPreset)
  const selectedMaterialData = materials.find(m => m.id === selectedMaterial)
  const selectedSizeData = sizes.find(s => s.id === selectedSize)

  // Show payment processor if order flow is active and material/size selected
  if (showOrderFlow && selectedMaterial && selectedSize && selectedMaterialData) {
    return (
      <PaymentProcessor
        material={selectedMaterialData}
        size={selectedSizeData?.name || selectedSize}
        orientation={selectedOrientation}
        theme={selectedTemplate?.config.styling.theme || 'nautical'}
        onBack={() => setShowOrderFlow(false)}
      />
    )
  }

  return (
    <motion.div
      className="container max-w-6xl mx-auto py-12 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Preview
          </Button>
          <div className="text-center">
            <h1 className="text-3xl font-light">Your Great Loop Map</h1>
            <p className="text-muted-foreground">
              Chart your adventure • Share your story • Inspire fellow Loopers
            </p>
          </div>
          <div className="w-[130px]"></div> {/* Spacer for centering */}
        </div>

        {showOrderFlow && (!selectedMaterial || !selectedSize) ? (
          /* Product Configuration Section */
          <div className="space-y-8">
            <div className="text-center">
              <Button 
                variant="ghost" 
                onClick={() => setShowOrderFlow(false)}
                className="mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Options
              </Button>
              <div className="flex items-center gap-2 justify-center mb-2">
                <ShoppingCart className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-600 uppercase tracking-wide">
                  Custom Order
                </span>
              </div>
              <h2 className="text-3xl font-light mb-3">
                Create Your Physical Map
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Choose your material and size to create a lasting keepsake of your Great Loop adventure.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Material Selection */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Choose Material</CardTitle>
                    <CardDescription>Select the perfect material for your map</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup value={selectedMaterial} onValueChange={setSelectedMaterial}>
                      <div className="space-y-4">
                        {materials.map((material) => (
                          <div 
                            key={material.id}
                            className={`flex items-center space-x-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                              selectedMaterial === material.id 
                                ? 'border-blue-500 bg-blue-50' 
                                : 'border-border hover:bg-accent'
                            }`}
                            onClick={() => setSelectedMaterial(material.id)}
                          >
                            <RadioGroupItem value={material.id} id={material.id} />
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <Label htmlFor={material.id} className="font-medium cursor-pointer">
                                  {material.name}
                                </Label>
                                <span className="font-medium">${material.price}</span>
                              </div>
                              <p className="text-sm text-muted-foreground">{material.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>

                {/* Size Selection */}
                <Card>
                  <CardHeader>
                    <CardTitle>Choose Size</CardTitle>
                    <CardDescription>Select the dimensions for your map</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup value={selectedSize} onValueChange={setSelectedSize}>
                      <div className="space-y-3">
                        {sizes.map((size) => (
                          <div 
                            key={size.id}
                            className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                              selectedSize === size.id 
                                ? 'border-blue-500 bg-blue-50' 
                                : 'border-border hover:bg-accent'
                            }`}
                            onClick={() => setSelectedSize(size.id)}
                          >
                            <RadioGroupItem value={size.id} id={size.id} />
                            <div className="flex-1">
                              <Label htmlFor={size.id} className="font-medium cursor-pointer">
                                {size.name}
                              </Label>
                              <p className="text-sm text-muted-foreground">{size.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>

                {/* Orientation Selection */}
                <Card>
                  <CardHeader>
                    <CardTitle>Orientation</CardTitle>
                    <CardDescription>Choose how your map will be oriented</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup value={selectedOrientation} onValueChange={setSelectedOrientation}>
                      <div className="space-y-3">
                        <div 
                          className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                            selectedOrientation === 'portrait' 
                              ? 'border-blue-500 bg-blue-50' 
                              : 'border-border hover:bg-accent'
                          }`}
                          onClick={() => setSelectedOrientation('portrait')}
                        >
                          <RadioGroupItem value="portrait" id="portrait" />
                          <Label htmlFor="portrait" className="font-medium cursor-pointer">
                            Portrait (Tall)
                          </Label>
                        </div>
                        <div 
                          className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                            selectedOrientation === 'landscape' 
                              ? 'border-blue-500 bg-blue-50' 
                              : 'border-border hover:bg-accent'
                          }`}
                          onClick={() => setSelectedOrientation('landscape')}
                        >
                          <RadioGroupItem value="landscape" id="landscape" />
                          <Label htmlFor="landscape" className="font-medium cursor-pointer">
                            Landscape (Wide)
                          </Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>

                <Button 
                  onClick={handleProceedToPayment} 
                  className="w-full" 
                  size="lg"
                  disabled={!selectedMaterial || !selectedSize}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Proceed to Payment
                  {selectedMaterialData && ` • $${selectedMaterialData.price}`}
                </Button>
              </div>

              {/* Map Preview */}
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <div 
                      className={`${
                        selectedOrientation === 'landscape' ? 'aspect-video' : 'aspect-[3/4]'
                      } rounded-lg border border-border overflow-hidden relative`}
                    >
                      <div className="absolute inset-0">
                        <MapRenderer 
                          ref={mapRendererRef}
                          className=""
                          style={{ width: '100%', height: '100%' }}
                          showControls={false}
                        />
                      </div>
                    </div>

                    <div className="mt-4 text-center text-sm text-muted-foreground">
                      Preview: {selectedSizeData?.name || selectedSize} {selectedOrientation}
                      {selectedMaterialData && (
                        <>
                          <br />
                          <span className="text-blue-600">{selectedMaterialData.name}</span>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {selectedMaterialData && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span>Material:</span>
                        <span>{selectedMaterialData.name}</span>
                      </div>
                      {selectedSizeData && (
                        <div className="flex justify-between">
                          <span>Size:</span>
                          <span>{selectedSizeData.name}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Orientation:</span>
                        <span className="capitalize">{selectedOrientation}</span>
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Shipping:</span>
                        <span>Free</span>
                      </div>
                      <div className="pt-2 border-t flex justify-between font-medium text-lg">
                        <span>Total:</span>
                        <span>${selectedMaterialData.price}</span>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        ) : !showPhysicalOptions ? (
          /* Free Download Section */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Download Options */}
            <div className="space-y-6">
              <div className="text-center lg:text-left">
                <div className="flex items-center gap-2 justify-center lg:justify-start mb-2">
                  <Anchor className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-600 uppercase tracking-wide">
                    Free Download
                  </span>
                </div>
                <h2 className="text-2xl font-light mb-3">
                  Take Your Adventure Everywhere
                </h2>
                <p className="text-muted-foreground">
                  Download your Great Loop map for free! Perfect for your phone wallpaper, 
                  desktop background, or printing at home. Share your adventure with fellow Loopers.
                </p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Choose Your Format</CardTitle>
                  <CardDescription>
                    Select the perfect format for how you want to use your map
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <RadioGroup 
                    value={selectedPreset} 
                    onValueChange={setSelectedPreset}
                    className="grid gap-3"
                  >
                    {downloadPresets.map((preset) => {
                      const IconComponent = preset.icon
                      return (
                        <div 
                          key={preset.id} 
                          className={`flex items-center space-x-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                            selectedPreset === preset.id 
                              ? 'border-blue-500 bg-blue-50' 
                              : 'border-border hover:bg-accent'
                          }`}
                          onClick={() => setSelectedPreset(preset.id)}
                        >
                          <RadioGroupItem value={preset.id} id={preset.id} />
                          <IconComponent className="h-5 w-5 text-blue-600" />
                          <div className="flex-1">
                            <Label htmlFor={preset.id} className="font-medium cursor-pointer">
                              {preset.name}
                            </Label>
                            <p className="text-sm text-muted-foreground">{preset.description}</p>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {actualDimensions[preset.id] || preset.size}
                          </div>
                        </div>
                      )
                    })}
                  </RadioGroup>
                </CardContent>
              </Card>

              <Button 
                onClick={handleDownload} 
                className="w-full" 
                size="lg" 
                disabled={isDownloading || isDownloaded}
              >
                {isDownloading ? (
                  <span className="flex items-center">
                    <div className="animate-spin -ml-1 mr-2 h-4 w-4 border-2 border-current border-r-transparent rounded-full" />
                    Preparing your map...
                  </span>
                ) : isDownloaded ? (
                  <span className="flex items-center">
                    <Check className="h-4 w-4 mr-2" />
                    Downloaded! Check your downloads folder
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Download className="h-4 w-4 mr-2" />
                    Download Free {selectedPresetData?.name}
                  </span>
                )}
              </Button>

              <div className="text-center">
                <Button 
                  variant="link" 
                  onClick={() => setShowPhysicalOptions(true)}
                  className="text-blue-600"
                >
                  Want something more permanent? See keepsake options →
                </Button>
              </div>
            </div>

            {/* Map Preview - Real Mapbox Map */}
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div 
                    className={`${
                      selectedPresetData?.orientation === 'landscape' ? 'aspect-video' : 'aspect-[3/4]'
                    } rounded-lg border border-border overflow-hidden relative`}
                  >
                    <div className="absolute inset-0">
                      <MapRenderer 
                        ref={mapRendererRef}
                        className=""
                        style={{ width: '100%', height: '100%' }}
                        showControls={false}
                      />
                    </div>
                  </div>

                  <div className="mt-4 text-center text-sm text-muted-foreground">
                    Preview: {selectedPresetData?.name} 
                    {selectedPresetData && ` (${actualDimensions[selectedPresetData.id] || selectedPresetData.size})`}
                    <br />
                    <span className="text-xs text-blue-600">Live preview of your actual map</span>
                  </div>
                </CardContent>
              </Card>

              {/* Usage examples */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="space-y-2">
                  <div className="w-12 h-12 mx-auto bg-blue-100 rounded-lg flex items-center justify-center">
                    <Smartphone className="h-6 w-6 text-blue-600" />
                  </div>
                  <p className="text-sm font-medium">Phone Wallpaper</p>
                  <p className="text-xs text-muted-foreground">Show your pride</p>
                </div>
                <div className="space-y-2">
                  <div className="w-12 h-12 mx-auto bg-blue-100 rounded-lg flex items-center justify-center">
                    <Monitor className="h-6 w-6 text-blue-600" />
                  </div>
                  <p className="text-sm font-medium">Desktop Background</p>
                  <p className="text-xs text-muted-foreground">Daily inspiration</p>
                </div>
                <div className="space-y-2">
                  <div className="w-12 h-12 mx-auto bg-blue-100 rounded-lg flex items-center justify-center">
                    <Printer className="h-6 w-6 text-blue-600" />
                  </div>
                  <p className="text-sm font-medium">Print & Frame</p>
                  <p className="text-xs text-muted-foreground">Personal keepsake</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Physical Keepsakes Section */
          <div className="space-y-8">
            <div className="text-center">
              <Button 
                variant="ghost" 
                onClick={() => setShowPhysicalOptions(false)}
                className="mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Free Download
              </Button>
              <div className="flex items-center gap-2 justify-center mb-2">
                <Star className="h-5 w-5 text-amber-600" />
                <span className="text-sm font-medium text-amber-600 uppercase tracking-wide">
                  Premium Keepsakes
                </span>
              </div>
              <h2 className="text-3xl font-light mb-3">
                Turn Your Adventure Into a Lasting Keepsake
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Your Great Loop journey deserves more than a digital file. Create a beautiful, 
                handcrafted piece that celebrates your achievement and inspires others.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {physicalShowcase.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <div className="aspect-video bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                    {/* Placeholder for actual product images */}
                    <div className="text-center p-4">
                      <Anchor className="h-12 w-12 mx-auto text-blue-600 mb-2" />
                      <p className="text-sm text-blue-600">Product Photo</p>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="space-y-2 mb-4">
                      <h3 className="font-medium">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                      <p className="text-sm text-blue-600">{item.material}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Starting at $79</span>
                      <Button variant="outline" size="sm" onClick={handleOrderPhysicalMap}>
                        Order Now
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <Button onClick={handleOrderPhysicalMap} size="lg" className="mb-4">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Create Custom Physical Map
              </Button>
              <div className="inline-flex items-center gap-4 p-6 bg-blue-50 rounded-lg">
                <Heart className="h-8 w-8 text-blue-600" />
                <div className="text-left">
                  <p className="font-medium">Join the Great Loop Community</p>
                  <p className="text-sm text-muted-foreground">
                    Every purchase supports the Great Loop community and helps us create better tools for future Loopers
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
} 