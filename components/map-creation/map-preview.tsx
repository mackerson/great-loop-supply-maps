"use client"

import { useRef, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ZoomIn, ZoomOut, ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"
import mapboxgl from 'mapbox-gl'
import { MAPBOX_ACCESS_TOKEN, getBounds } from '@/lib/mapbox'
import { useMapCreationStore } from '@/stores/map-creation'

// Import Mapbox CSS
import 'mapbox-gl/dist/mapbox-gl.css'

interface MapPreviewProps {
  onBack?: () => void
  onNext?: () => void
}

export function MapPreview({ onBack, onNext }: MapPreviewProps) {
  const { 
    locations, 
    style, 
    activeLocationIndex, 
    setActiveLocationIndex,
    nextStep
  } = useMapCreationStore()
  
  const [map, setMap] = useState<mapboxgl.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)

  const handleExport = () => {
    if (onNext) {
      onNext()
    } else {
      nextStep()
    }
  }

  const handleZoomIn = () => {
    if (map) {
      map.zoomIn()
    }
  }

  const handleZoomOut = () => {
    if (map) {
      map.zoomOut()
    }
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
  const activeLocation = locations[activeLocationIndex]

  // Apply theme-specific styling to the base light-v11 map
  const applyThemeStyles = (map: mapboxgl.Map, currentTheme: string) => {
    const themes = {
      minimalist: {
        water: '#f1f5f9',
        roads: '#e2e8f0',
        text: '#475569'
      },
      woodburn: {
        water: '#fed7aa', 
        roads: '#92400e',
        text: '#451a03'
      },
      vintage: {
        water: '#e7e5e4',
        roads: '#78716c', 
        text: '#44403c'
      }
    }

    const colors = themes[currentTheme as keyof typeof themes] || themes.minimalist

    // Get all layer IDs to see what's available
    const style = map.getStyle()
    const layers = style.layers || []
    
    // Look for and modify water layers
    layers.forEach(layer => {
      if (layer.id.includes('water') && map.getLayer(layer.id)) {
        try {
          map.setPaintProperty(layer.id, 'fill-color', colors.water)
        } catch (e) {
          console.log(`Could not modify water layer ${layer.id}:`, e)
        }
      }
      
      // Look for and modify road layers
      if ((layer.id.includes('road') || layer.id.includes('street') || layer.id.includes('highway')) && map.getLayer(layer.id)) {
        try {
          map.setPaintProperty(layer.id, 'line-color', colors.roads)
        } catch (e) {
          console.log(`Could not modify road layer ${layer.id}:`, e)
        }
      }
      
      // Look for and modify text layers
      if ((layer.id.includes('place') || layer.id.includes('label') || layer.id.includes('text')) && map.getLayer(layer.id)) {
        try {
          map.setPaintProperty(layer.id, 'text-color', colors.text)
        } catch (e) {
          console.log(`Could not modify text layer ${layer.id}:`, e)
        }
      }
    })
  }

  // Initialize Mapbox map
  useEffect(() => {
    if (!mapContainerRef.current) return
    if (!MAPBOX_ACCESS_TOKEN) {
      console.warn('Mapbox access token not found. Map will not render.')
      return
    }

    // Use light-v11 as base for all themes (clean, minimal, perfect for engraving)
    const mapInstance = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: locations.length > 0 ? [locations[0].lng, locations[0].lat] : [0, 0],
      zoom: 1,
      attributionControl: false // Hide attribution for cleaner export
    })

    // Apply theme-specific styling once the map loads
    mapInstance.on('style.load', () => {
      applyThemeStyles(mapInstance, style.theme)
    })

    // Add custom markers for each location
    locations.forEach((location, index) => {
      // Create custom marker element
      const markerElement = document.createElement('div')
      markerElement.className = 'custom-marker'
      markerElement.style.cssText = `
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background-color: ${themeColors.markers};
        border: 3px solid white;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        color: white;
        font-weight: bold;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        transition: transform 0.2s ease;
      `

      // Add icon or emoji to marker
      if (location.iconType === 'emoji' && location.emoji) {
        markerElement.textContent = location.emoji
        markerElement.style.fontSize = '16px'
        markerElement.style.backgroundColor = 'transparent'
        markerElement.style.border = 'none'
      } else if (location.iconType === 'icon') {
        markerElement.textContent = (index + 1).toString()
      } else {
        markerElement.textContent = (index + 1).toString()
      }

      // Create marker and add to map
      const marker = new mapboxgl.Marker(markerElement)
        .setLngLat([location.lng, location.lat])
        .addTo(mapInstance)

      // Add click handler
      markerElement.addEventListener('click', () => {
        setActiveLocationIndex(index)
        markerElement.style.transform = 'scale(1.2)'
        setTimeout(() => {
          markerElement.style.transform = 'scale(1)'
        }, 200)
      })

      // Add popup with location info
      if (location.caption || location.narrative) {
        const popup = new mapboxgl.Popup({ 
          offset: 25,
          closeButton: false 
        })
        .setHTML(`
          <div style="text-align: center; padding: 12px; max-width: 200px;">
            <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold; color: #333;">${location.name}</h3>
            ${location.caption ? `<p style="margin: 0 0 6px 0; font-size: 14px; color: #666; font-weight: 500;">${location.caption}</p>` : ''}
            ${location.narrative ? `<p style="margin: 0; font-size: 12px; color: #888; line-height: 1.4;">${location.narrative}</p>` : ''}
          </div>
        `)

        marker.setPopup(popup)
      }
    })

    // Fit map to show all locations
    if (locations.length > 1) {
      const bounds = getBounds(locations)
      mapInstance.fitBounds(bounds, { padding: 80 })
    } else if (locations.length === 1) {
      mapInstance.setCenter([locations[0].lng, locations[0].lat])
      mapInstance.setZoom(10)
    }

    setMap(mapInstance)

    // Cleanup
    return () => {
      mapInstance.remove()
    }
  }, [locations, style.theme, themeColors.markers, setActiveLocationIndex])

  return (
    <motion.div
      className="container max-w-6xl mx-auto py-12 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-light">Your Story Map</h1>
          <p className="text-muted-foreground">Explore your map and make final adjustments</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Preview */}
          <div className="lg:col-span-2">
            <div className="flex flex-col h-full">
              {/* Map Controls */}
              <div className="flex justify-start items-center mb-4">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleZoomIn}>
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleZoomOut}>
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Map Container */}
              <div
                ref={mapContainerRef}
                className={`relative flex-1 rounded-lg border border-border overflow-hidden ${style.font}`}
                style={{ minHeight: '500px' }}
              >
                {!MAPBOX_ACCESS_TOKEN && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-600 z-10">
                    <div className="text-center p-8">
                      <h3 className="text-lg font-semibold mb-2">Mapbox Configuration Required</h3>
                      <p className="mb-2">To see your map, add your Mapbox access token:</p>
                      <code className="bg-gray-200 px-2 py-1 rounded text-sm">
                        NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_token_here
                      </code>
                      <p className="text-sm mt-2">
                        Get your free token at{' '}
                        <a href="https://account.mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                          mapbox.com
                        </a>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Location Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-light">Your Places</h2>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveLocationIndex(Math.max(0, activeLocationIndex - 1))}
                    disabled={activeLocationIndex === 0}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveLocationIndex(Math.min(locations.length - 1, activeLocationIndex + 1))}
                    disabled={activeLocationIndex === locations.length - 1}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Active Location Details */}
              {activeLocation && (
                <motion.div
                  key={activeLocationIndex}
                  className="bg-card p-6 rounded-lg border border-border"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      {activeLocation.iconType === 'emoji' && activeLocation.emoji && (
                        <div className="text-2xl">{activeLocation.emoji}</div>
                      )}
                      {activeLocation.iconType === 'icon' && (
                        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                          {activeLocationIndex + 1}
                        </div>
                      )}
                      <div>
                        <h3 className="font-medium text-lg">{activeLocation.name}</h3>
                        {activeLocation.caption && (
                          <p className="text-sm text-muted-foreground font-medium">{activeLocation.caption}</p>
                        )}
                      </div>
                    </div>

                    {activeLocation.narrative && (
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Your Story</p>
                        <p className="text-sm leading-relaxed">{activeLocation.narrative}</p>
                      </div>
                    )}

                    {activeLocation.description && (
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Description</p>
                        <p className="text-sm leading-relaxed">{activeLocation.description}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* All Locations List */}
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {locations.map((location, index) => (
                  <div
                    key={location.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      index === activeLocationIndex
                        ? 'bg-accent border-primary'
                        : 'bg-background border-border hover:bg-accent/50'
                    }`}
                    onClick={() => setActiveLocationIndex(index)}
                  >
                    <div className="flex items-center gap-2">
                      {location.iconType === 'emoji' && location.emoji && (
                        <div className="text-lg">{location.emoji}</div>
                      )}
                      {location.iconType === 'icon' && (
                        <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{location.name}</p>
                        {location.caption && (
                          <p className="text-sm text-muted-foreground truncate">{location.caption}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          {onBack && (
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Customization
            </Button>
          )}
          <Button onClick={handleExport} className="flex items-center gap-2">
            Export Map
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </motion.div>
  )
} 