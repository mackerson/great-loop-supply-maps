"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { motion } from "framer-motion"
import { Download, ArrowLeft, Check, Smartphone, Monitor, Printer, Anchor, Heart, Star, ChevronRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useMapCreationStore } from '@/stores/map-creation'
import { MapPreview } from './map-preview'
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

// Physical keepsake showcase
const physicalShowcase = [
  {
    id: "boat-cabin",
    title: "Perfect for Your Boat Cabin",
    description: "Display your Great Loop achievement where fellow Loopers can see it",
    image: "/showcase/boat-cabin-map.jpg", // Placeholder
    price: "$89",
    material: "Marine-grade aluminum"
  },
  {
    id: "home-office", 
    title: "Beautiful Home Display",
    description: "A conversation starter that tells your adventure story",
    image: "/showcase/home-office-map.jpg", // Placeholder  
    price: "$79",
    material: "Premium maple wood"
  },
  {
    id: "gift-option",
    title: "Perfect Gift for Fellow Loopers",
    description: "Custom engraved with their home port and special anchorages",
    image: "/showcase/gift-map.jpg", // Placeholder
    price: "$99", 
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

  const mapPreviewRef = useRef<HTMLDivElement>(null)

  const handleDownload = async () => {
    setIsDownloading(true)
    
    try {
      const preset = downloadPresets.find(p => p.id === selectedPreset)
      if (!preset) return

      // Find the map container within the MapPreview component
      const mapContainer = mapPreviewRef.current?.querySelector('[class*="mapContainer"]') as HTMLElement
      if (!mapContainer) {
        // Fallback to the entire preview container
        const previewContainer = mapPreviewRef.current
        if (!previewContainer) {
          throw new Error('Map container not found')
        }
        
        // Capture the preview container
        const canvas = await html2canvas(previewContainer, {
          backgroundColor: '#ffffff',
          scale: 2, // Higher quality
          useCORS: true,
          allowTaint: true,
          ignoreElements: (element) => {
            // Skip UI controls and buttons
            return element.tagName === 'BUTTON' || 
                   element.classList.contains('mapboxgl-control-container') ||
                   element.classList.contains('mapboxgl-popup')
          }
        })

        // Generate download
        const timestamp = new Date().toISOString().slice(0, 10)
        const filename = `great-loop-map-${timestamp}.png`

        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = filename
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            URL.revokeObjectURL(url)
          }
        }, 'image/png', 1.0)
        
        setIsDownloaded(true)
        setTimeout(() => setIsDownloaded(false), 3000)
        return
      }

      // If we found the specific map container, use that
      const canvas = await html2canvas(mapContainer, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        allowTaint: true
      })

      const timestamp = new Date().toISOString().slice(0, 10)
      const filename = `great-loop-map-${timestamp}.png`

      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.download = filename
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          URL.revokeObjectURL(url)
        }
      }, 'image/png', 1.0)
      
      setIsDownloaded(true)
      setTimeout(() => setIsDownloaded(false), 3000)
    } catch (error) {
      console.error('Download error:', error)
      alert('Download failed. Please try again.')
    } finally {
      setIsDownloading(false)
    }
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

        {!showPhysicalOptions ? (
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
                            {preset.size}
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
                    ref={mapPreviewRef}
                    className={`${
                      selectedPresetData?.orientation === 'landscape' ? 'aspect-video' : 'aspect-[3/4]'
                    } rounded-lg border border-border overflow-hidden relative`}
                  >
                    {/* Use the actual working MapPreview component */}
                    <div className="absolute inset-0" style={{ transform: 'scale(0.8)', transformOrigin: 'center' }}>
                      <MapPreview />
                    </div>
                  </div>

                  <div className="mt-4 text-center text-sm text-muted-foreground">
                    Preview: {selectedPresetData?.name} 
                    {selectedPresetData && ` (${selectedPresetData.size})`}
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
                      <span className="text-lg font-medium">{item.price}</span>
                      <Button variant="outline" size="sm">
                        Learn More
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
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