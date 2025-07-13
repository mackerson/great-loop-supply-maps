"use client"

import { useEffect } from "react"
import { useMapCreationStore } from "@/stores/map-creation"
import StyleCustomizer from "@/components/style-customizer"

export default function CustomizePage() {
  const { setCurrentStep } = useMapCreationStore()
  
  useEffect(() => {
    setCurrentStep(3)
  }, [setCurrentStep])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-light tracking-tight mb-4">
            Personalize your Great Loop map
          </h1>
          <p className="text-lg text-muted-foreground">
            Choose the perfect style and theme for your journey map. Each option is optimized for boat cabin display, engraving, and printing.
          </p>
        </div>
        
        <StyleCustomizer />
      </div>
    </div>
  )
} 