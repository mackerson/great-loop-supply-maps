"use client"

import { useEffect } from "react"
import { useMapCreationStore } from "@/stores/map-creation"
import ExportInterface from "@/components/export-interface"

export default function DownloadPage() {
  const { setCurrentStep } = useMapCreationStore()
  
  useEffect(() => {
    setCurrentStep(5)
  }, [setCurrentStep])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-light tracking-tight mb-4">
            Preserve your Great Loop memories forever
          </h1>
          <p className="text-lg text-muted-foreground">
            Download your journey map in the perfect format for your boat, home, or gifts. Ready for cabin display, engraving, or sharing with fellow Loopers.
          </p>
        </div>
        
        <ExportInterface />
      </div>
    </div>
  )
} 