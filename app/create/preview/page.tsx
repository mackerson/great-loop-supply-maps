"use client"

import { useEffect } from "react"
import { useMapCreationStore } from "@/stores/map-creation"
import MapPreview from "@/components/map-preview"

export default function PreviewPage() {
  const { setCurrentStep } = useMapCreationStore()
  
  useEffect(() => {
    setCurrentStep(4)
  }, [setCurrentStep])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-light tracking-tight mb-4">
            See your Great Loop adventure come to life
          </h1>
          <p className="text-lg text-muted-foreground">
            Review your journey map and make any final adjustments before downloading.
          </p>
        </div>
        
        <MapPreview />
      </div>
    </div>
  )
} 