"use client"

import { useEffect } from "react"
import { useMapCreationStore } from "@/stores/map-creation"
import ChapterBuilder from "@/components/chapter-builder"

export default function ChaptersPage() {
  const { setCurrentStep } = useMapCreationStore()
  
  useEffect(() => {
    setCurrentStep(2)
  }, [setCurrentStep])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-light tracking-tight mb-4">
            What other ports made your Great Loop special?
          </h1>
          <p className="text-lg text-muted-foreground">
            Add more locations and create chapters for each meaningful port or stop on your Great Loop adventure.
          </p>
        </div>
        
        <ChapterBuilder />
      </div>
    </div>
  )
} 