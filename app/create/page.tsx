"use client"

import { useEffect } from "react"
import { useMapCreationStore } from "@/stores/map-creation"
import LocationInput from "@/components/map-creation/location-input"

export default function CreateMapPage() {
  const { setCurrentStep } = useMapCreationStore()
  
  useEffect(() => {
    setCurrentStep(1)
  }, [setCurrentStep])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-light tracking-tight mb-4">
            Where did your Great Loop adventure begin?
          </h1>
          <p className="text-lg text-muted-foreground">
            Start by adding the first port or location that holds special meaning to your Great Loop journey.
          </p>
        </div>
        
        <LocationInput />
      </div>
    </div>
  )
} 