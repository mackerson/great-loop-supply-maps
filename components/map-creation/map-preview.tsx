"use client"

import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { ZoomIn, ZoomOut, ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"
import { useMapCreationStore } from '@/stores/map-creation'
import { MapRenderer, type MapRendererRef } from './map-renderer'

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
  
  const mapRendererRef = useRef<MapRendererRef>(null)

  const handleExport = () => {
    if (onNext) {
      onNext()
    } else {
      nextStep()
    }
  }

  const handleZoomIn = () => {
    const map = mapRendererRef.current?.getMap()
    if (map) {
      map.zoomIn()
    }
  }

  const handleZoomOut = () => {
    const map = mapRendererRef.current?.getMap()
    if (map) {
      map.zoomOut()
    }
  }

  const activeLocation = locations[activeLocationIndex]

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
              <div className="flex-1">
                <MapRenderer 
                  ref={mapRendererRef}
                  className="w-full h-full"
                  style={{ minHeight: '500px' }}
                  showControls={false}
                />
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