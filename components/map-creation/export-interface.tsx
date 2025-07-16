"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"
import { Download, ArrowLeft, Check, Package, Truck, ShoppingCart } from "lucide-react"
import { 
  exportToPNG, 
  exportToSVG, 
  exportToPDF, 
  exportToDXF, 
  downloadFile,
  type ExportOptions 
} from "@/lib/export"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import AccountCreation from "@/components/account-creation"
import PaymentProcessor from "@/components/payment-processor"
import { useMapCreationStore } from '@/stores/map-creation'

interface ExportInterfaceProps {
  onBack?: () => void
}

// Export format options
const exportFormats = [
  { id: "png", name: "PNG Image", description: "Best for digital sharing" },
  { id: "svg", name: "SVG Vector", description: "Scalable format for editing" },
  { id: "pdf", name: "PDF Document", description: "Print-ready document" },
  { id: "dxf", name: "DXF File", description: "For CAD and engraving machines" },
]

// Canvas size presets
const canvasSizes = [
  { id: "5x5", name: '5" × 5"', width: 5, height: 5 },
  { id: "8x8", name: '8" × 8"', width: 8, height: 8 },
  { id: "8x10", name: '8" × 10"', width: 8, height: 10 },
  { id: "10x10", name: '10" × 10"', width: 10, height: 10 },
  { id: "custom", name: "Custom Size", width: 0, height: 0 },
]

// Engraving material options
const engravingMaterials = [
  {
    id: "wood",
    name: "Premium Wood",
    description: "Warm, natural maple or walnut wood",
    price: 79.99,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "metal",
    name: "Brushed Metal",
    description: "Elegant stainless steel or brass finish",
    price: 99.99,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "acrylic",
    name: "Crystal Acrylic",
    description: "Modern, transparent with LED base option",
    price: 89.99,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "leather",
    name: "Genuine Leather",
    description: "Rustic, aged leather with frame",
    price: 119.99,
    image: "/placeholder.svg?height=100&width=100",
  },
]

export function ExportInterface({ onBack }: ExportInterfaceProps) {
  const {
    locations,
    style,
    export: exportOptions,
    updateExport
  } = useMapCreationStore()

  const [isExporting, setIsExporting] = useState(false)
  const [isExported, setIsExported] = useState(false)
  const [activeTab, setActiveTab] = useState("download")

  const handleExport = async () => {
    setIsExporting(true)

    try {
      const selectedSizeData = canvasSizes.find(s => s.id === exportOptions.selectedSize)
      const width = exportOptions.selectedSize === 'custom' ? parseFloat(exportOptions.customWidth) : selectedSizeData?.width || 8
      const height = exportOptions.selectedSize === 'custom' ? parseFloat(exportOptions.customHeight) : selectedSizeData?.height || 8

      const options: ExportOptions = {
        format: exportOptions.selectedFormat as 'png' | 'svg' | 'pdf' | 'dxf',
        width,
        height,
        orientation: exportOptions.orientation,
        theme: style.theme,
        strokeWidth: style.strokeWidth,
        font: style.font
      }

      const timestamp = new Date().toISOString().slice(0, 10)
      const filename = `story-map-${timestamp}.${exportOptions.selectedFormat}`

      switch (exportOptions.selectedFormat) {
        case 'png': {
          // For PNG, we need to capture the actual map element
          const mapContainer = document.querySelector('[ref="mapContainerRef"]') as HTMLElement
          if (!mapContainer) {
            throw new Error('Map container not found')
          }
          const blob = await exportToPNG(mapContainer, locations, options)
          downloadFile(blob, filename)
          break
        }
        case 'svg': {
          const svgContent = exportToSVG(locations, options)
          downloadFile(svgContent, filename, 'image/svg+xml')
          break
        }
        case 'pdf': {
          const mapContainer = document.querySelector('[ref="mapContainerRef"]') as HTMLElement
          if (!mapContainer) {
            throw new Error('Map container not found')
          }
          const blob = await exportToPDF(mapContainer, locations, options)
          downloadFile(blob, filename)
          break
        }
        case 'dxf': {
          const dxfContent = exportToDXF(locations, options)
          downloadFile(dxfContent, filename, 'application/dxf')
          break
        }
        default:
          throw new Error('Unsupported export format')
      }

      setIsExported(true)
      setTimeout(() => {
        setIsExported(false)
      }, 3000)
    } catch (error) {
      console.error('Export error:', error)
      alert('Export failed. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  const handlePurchase = () => {
    if (!exportOptions.hasAccount) {
      updateExport({ showAccountCreation: true })
    } else {
      updateExport({ showPayment: true })
    }
  }

  const handleAccountCreated = () => {
    updateExport({ hasAccount: true, showAccountCreation: false, showPayment: true })
  }

  const getThemeColors = () => {
    switch (style.theme) {
      case "minimalist":
        return {
          background: "bg-white",
          lines: "text-slate-300",
          markers: "#475569",
          text: "text-slate-700",
        }
      case "woodburn":
        return {
          background: "bg-amber-50",
          lines: "text-amber-800",
          markers: "#92400e",
          text: "text-amber-900",
        }
      case "vintage":
        return {
          background: "bg-stone-100",
          lines: "text-stone-500",
          markers: "#44403c",
          text: "text-stone-700",
        }
      default:
        return {
          background: "bg-white",
          lines: "text-slate-300",
          markers: "#475569",
          text: "text-slate-700",
        }
    }
  }

  const themeColors = getThemeColors()

  if (exportOptions.showAccountCreation) {
    return <AccountCreation onAccountCreated={handleAccountCreated} onBack={() => updateExport({ showAccountCreation: false })} />
  }

  if (exportOptions.showPayment) {
    const selectedMaterialObj = engravingMaterials.find((m) => m.id === exportOptions.selectedMaterial)
    return (
      <PaymentProcessor
        material={selectedMaterialObj}
        size={
          exportOptions.selectedSize === "custom"
            ? `${exportOptions.customWidth}" × ${exportOptions.customHeight}"`
            : canvasSizes.find((s) => s.id === exportOptions.selectedSize)?.name || ""
        }
        orientation={exportOptions.orientation}
        theme={style.theme}
        onBack={() => updateExport({ showPayment: false })}
      />
    )
  }

  return (
    <motion.div
      className="container max-w-5xl mx-auto py-12 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Preview
          </Button>
          <h1 className="text-3xl font-light">Your Map</h1>
          <div className="w-[130px]"></div> {/* Spacer for centering */}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="download">Download Digital File</TabsTrigger>
            <TabsTrigger value="purchase">Order Engraved Map</TabsTrigger>
          </TabsList>

          <TabsContent value="download" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Export Options */}
              <div className="space-y-8 bg-card p-6 rounded-lg border border-border">
                <div className="space-y-4">
                  <h2 className="text-xl font-light">Download Format</h2>
                  <RadioGroup 
                    value={exportOptions.selectedFormat} 
                    onValueChange={(value) => updateExport({ selectedFormat: value })} 
                    className="grid gap-3"
                  >
                    {exportFormats.map((format) => (
                      <div key={format.id} className="flex items-start space-x-3">
                        <RadioGroupItem value={format.id} id={`dl-${format.id}`} className="mt-1" />
                        <div className="grid gap-1">
                          <Label htmlFor={`dl-${format.id}`} className="font-medium">
                            {format.name}
                          </Label>
                          <p className="text-sm text-muted-foreground">{format.description}</p>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="space-y-4">
                  <h2 className="text-xl font-light">Canvas Size</h2>
                  <div className="grid gap-4">
                    <Select 
                      value={exportOptions.selectedSize} 
                      onValueChange={(value) => updateExport({ selectedSize: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a size" />
                      </SelectTrigger>
                      <SelectContent>
                        {canvasSizes.map((size) => (
                          <SelectItem key={size.id} value={size.id}>
                            {size.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {exportOptions.selectedSize === "custom" && (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="custom-width">Width (inches)</Label>
                          <Input
                            id="custom-width"
                            type="number"
                            min="1"
                            max="48"
                            value={exportOptions.customWidth}
                            onChange={(e) => updateExport({ customWidth: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="custom-height">Height (inches)</Label>
                          <Input
                            id="custom-height"
                            type="number"
                            min="1"
                            max="48"
                            value={exportOptions.customHeight}
                            onChange={(e) => updateExport({ customHeight: e.target.value })}
                          />
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label>Orientation</Label>
                      <RadioGroup 
                        value={exportOptions.orientation} 
                        onValueChange={(value) => updateExport({ orientation: value as 'portrait' | 'landscape' })} 
                        className="flex gap-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="portrait" id="portrait" />
                          <Label htmlFor="portrait">Portrait</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="landscape" id="landscape" />
                          <Label htmlFor="landscape">Landscape</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div className="space-y-6">
                <div className="bg-card p-6 rounded-lg border border-border">
                  <div
                    className={`aspect-square ${
                      exportOptions.orientation === "landscape" ? "rotate-90 scale-75" : ""
                    } ${themeColors.background} ${style.font} rounded-lg border border-border overflow-hidden`}
                  >
                    <div className="relative w-full h-full p-4">
                      {/* Simple map preview based on selected theme */}
                      <svg
                        width="100%"
                        height="100%"
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                        className={themeColors.lines}
                      >
                        {/* Horizontal lines */}
                        {[15, 30, 45, 60, 75, 90].map((y) => (
                          <path
                            key={`h-${y}`}
                            d={`M 5 ${y} C 25 ${y + (Math.random() * 6 - 3)}, 75 ${y + (Math.random() * 6 - 3)}, 95 ${y}`}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={style.strokeWidth * 0.15}
                            strokeLinecap="round"
                            className={style.theme === "vintage" ? "stroke-dasharray-2" : ""}
                          />
                        ))}

                        {/* Vertical lines */}
                        {[15, 30, 45, 60, 75, 90].map((x) => (
                          <path
                            key={`v-${x}`}
                            d={`M ${x} 5 C ${x + (Math.random() * 6 - 3)} 25, ${x + (Math.random() * 6 - 3)} 75, ${x} 95`}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={style.strokeWidth * 0.15}
                            strokeLinecap="round"
                            className={style.theme === "vintage" ? "stroke-dasharray-2" : ""}
                          />
                        ))}

                        {/* Sample location markers */}
                        {locations.map((location, index) => {
                          // Generate pseudo-random positions based on location name
                          const hash = location.name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
                          const x = 20 + (hash % 60)
                          const y = 20 + ((hash * 13) % 60)

                          return <circle key={index} cx={x} cy={y} r={style.strokeWidth * 0.6} fill={themeColors.markers} />
                        })}
                      </svg>

                      {/* Title */}
                      <div
                        className={`absolute top-4 left-1/2 transform -translate-x-1/2 text-center ${themeColors.text}`}
                      >
                        <h3 className="text-sm font-medium">Our Journey</h3>
                        <p className="text-xs">The places that shaped our story</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 text-center text-sm text-muted-foreground">
                    {exportOptions.selectedSize === "custom"
                      ? `${exportOptions.customWidth}" × ${exportOptions.customHeight}" ${exportOptions.orientation}`
                      : `${canvasSizes.find((s) => s.id === exportOptions.selectedSize)?.name} ${exportOptions.orientation}`}
                  </div>
                </div>

                <div className="space-y-4">
                  <Button onClick={handleExport} className="w-full" size="lg" disabled={isExporting || isExported}>
                    {isExporting ? (
                      <span className="flex items-center">
                        <div className="animate-spin -ml-1 mr-2 h-4 w-4 border-2 border-current border-r-transparent rounded-full" />
                        Preparing your map...
                      </span>
                    ) : isExported ? (
                      <span className="flex items-center">
                        <Check className="h-4 w-4 mr-2" />
                        Map downloaded successfully!
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Download className="h-4 w-4 mr-2" />
                        Download {exportOptions.selectedFormat.toUpperCase()} Map
                      </span>
                    )}
                  </Button>

                  <div className="text-center">
                    <Button variant="link" onClick={() => setActiveTab("purchase")}>
                      Want a physical keepsake? Order an engraved version →
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="purchase" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Material Selection */}
              <div className="space-y-8 bg-card p-6 rounded-lg border border-border">
                <div className="space-y-4">
                  <h2 className="text-xl font-light">Select Material</h2>
                  <p className="text-sm text-muted-foreground">Choose a premium material for your engraved map</p>

                  <RadioGroup 
                    value={exportOptions.selectedMaterial} 
                    onValueChange={(value) => updateExport({ selectedMaterial: value })} 
                    className="grid gap-4"
                  >
                    {engravingMaterials.map((material) => (
                      <div
                        key={material.id}
                        className={`flex items-start space-x-3 p-3 rounded-lg border ${
                          exportOptions.selectedMaterial === material.id ? "border-primary bg-accent/50" : "border-border"
                        }`}
                      >
                        <RadioGroupItem value={material.id} id={`material-${material.id}`} className="mt-1" />
                        <div className="grid gap-1 flex-1">
                          <div className="flex justify-between">
                            <Label htmlFor={`material-${material.id}`} className="font-medium">
                              {material.name}
                            </Label>
                            <span className="font-medium">${material.price.toFixed(2)}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{material.description}</p>
                        </div>
                        <div className="w-16 h-16 rounded overflow-hidden border border-border">
                          <img
                            src={material.image || "/placeholder.svg"}
                            alt={material.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="space-y-4">
                  <h2 className="text-xl font-light">Size & Orientation</h2>
                  <div className="grid gap-4">
                    <Select 
                      value={exportOptions.selectedSize} 
                      onValueChange={(value) => updateExport({ selectedSize: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a size" />
                      </SelectTrigger>
                      <SelectContent>
                        {canvasSizes.map((size) => (
                          <SelectItem key={size.id} value={size.id}>
                            {size.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {exportOptions.selectedSize === "custom" && (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="custom-width-purchase">Width (inches)</Label>
                          <Input
                            id="custom-width-purchase"
                            type="number"
                            min="1"
                            max="48"
                            value={exportOptions.customWidth}
                            onChange={(e) => updateExport({ customWidth: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="custom-height-purchase">Height (inches)</Label>
                          <Input
                            id="custom-height-purchase"
                            type="number"
                            min="1"
                            max="48"
                            value={exportOptions.customHeight}
                            onChange={(e) => updateExport({ customHeight: e.target.value })}
                          />
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label>Orientation</Label>
                      <RadioGroup 
                        value={exportOptions.orientation} 
                        onValueChange={(value) => updateExport({ orientation: value as 'portrait' | 'landscape' })} 
                        className="flex gap-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="portrait" id="portrait-purchase" />
                          <Label htmlFor="portrait-purchase">Portrait</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="landscape" id="landscape-purchase" />
                          <Label htmlFor="landscape-purchase">Landscape</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 className="text-xl font-light">Shipping & Production</h2>
                  <div className="space-y-2">
                    <div className="flex items-start space-x-3 p-3 rounded-lg border border-border">
                      <Package className="h-5 w-5 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Handcrafted with Care</p>
                        <p className="text-sm text-muted-foreground">Each map is custom engraved by skilled artisans</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 rounded-lg border border-border">
                      <Truck className="h-5 w-5 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Free Shipping</p>
                        <p className="text-sm text-muted-foreground">2-3 week production time plus delivery</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                    <CardDescription>Review your custom engraved map</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div
                      className={`aspect-square ${
                        exportOptions.orientation === "landscape" ? "rotate-90 scale-75" : ""
                      } ${themeColors.background} ${style.font} rounded-lg border border-border overflow-hidden`}
                    >
                      <div className="relative w-full h-full p-4">
                        {/* Map preview (same as download tab) */}
                        <svg
                          width="100%"
                          height="100%"
                          viewBox="0 0 100 100"
                          preserveAspectRatio="none"
                          className={themeColors.lines}
                        >
                          {/* Horizontal lines */}
                          {[15, 30, 45, 60, 75, 90].map((y) => (
                            <path
                              key={`h-${y}`}
                              d={`M 5 ${y} C 25 ${y + (Math.random() * 6 - 3)}, 75 ${y + (Math.random() * 6 - 3)}, 95 ${y}`}
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={style.strokeWidth * 0.15}
                              strokeLinecap="round"
                              className={style.theme === "vintage" ? "stroke-dasharray-2" : ""}
                            />
                          ))}

                          {/* Vertical lines */}
                          {[15, 30, 45, 60, 75, 90].map((x) => (
                            <path
                              key={`v-${x}`}
                              d={`M ${x} 5 C ${x + (Math.random() * 6 - 3)} 25, ${x + (Math.random() * 6 - 3)} 75, ${x} 95`}
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={style.strokeWidth * 0.15}
                              strokeLinecap="round"
                              className={style.theme === "vintage" ? "stroke-dasharray-2" : ""}
                            />
                          ))}

                          {/* Sample location markers */}
                          {locations.map((location, index) => {
                            // Generate pseudo-random positions based on location name
                            const hash = location.name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
                            const x = 20 + (hash % 60)
                            const y = 20 + ((hash * 13) % 60)

                            return <circle key={index} cx={x} cy={y} r={style.strokeWidth * 0.6} fill={themeColors.markers} />
                          })}
                        </svg>

                        {/* Title */}
                        <div
                          className={`absolute top-4 left-1/2 transform -translate-x-1/2 text-center ${themeColors.text}`}
                        >
                          <h3 className="text-sm font-medium">Our Journey</h3>
                          <p className="text-xs">The places that shaped our story</p>
                        </div>
                      </div>
                    </div>

                    {exportOptions.selectedMaterial && (
                      <div className="space-y-4 mt-6">
                        <div className="flex justify-between text-sm">
                          <span>Material</span>
                          <span className="font-medium">
                            {engravingMaterials.find((m) => m.id === exportOptions.selectedMaterial)?.name}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Size</span>
                          <span>
                            {exportOptions.selectedSize === "custom"
                              ? `${exportOptions.customWidth}" × ${exportOptions.customHeight}"`
                              : canvasSizes.find((s) => s.id === exportOptions.selectedSize)?.name}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Orientation</span>
                          <span className="capitalize">{exportOptions.orientation}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Theme</span>
                          <span className="capitalize">{style.theme}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Shipping</span>
                          <span>Free</span>
                        </div>
                        <div className="pt-4 border-t border-border flex justify-between">
                          <span className="font-medium">Total</span>
                          <span className="font-medium">
                            ${engravingMaterials.find((m) => m.id === exportOptions.selectedMaterial)?.price.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex flex-col space-y-4">
                    <Button onClick={handlePurchase} className="w-full" size="lg" disabled={!exportOptions.selectedMaterial}>
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Proceed to Checkout
                    </Button>

                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Checkbox id="terms" />
                      <label htmlFor="terms" className="text-xs">
                        I agree to the{" "}
                        <a href="#" className="underline">
                          Terms of Service
                        </a>{" "}
                        and{" "}
                        <a href="#" className="underline">
                          Privacy Policy
                        </a>
                      </label>
                    </div>
                  </CardFooter>
                </Card>

                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm italic">
                    &quot;Transform your digital story into a tangible keepsake that will last for generations. Each engraved
                    map is handcrafted with care to preserve your special moments.&quot;
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  )
} 