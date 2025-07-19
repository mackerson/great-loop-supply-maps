"use client"

import { useMapCreationStore } from '@/stores/map-creation'
import { MapPreview } from '@/components/map-creation/map-preview'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function GreatLoopPreviewPage() {
  const router = useRouter()
  const { selectedTemplate, canProceedToStep, setCurrentStep, hasHydrated } = useMapCreationStore()

  useEffect(() => {
    // Wait for store to hydrate from localStorage before making routing decisions
    if (!hasHydrated) return

    // Ensure we have a selected template and can proceed to step 4
    if (!selectedTemplate || selectedTemplate.id !== 'great-loop') {
      router.push('/create/journey/great-loop')
      return
    }
    
    // Set current step and validate
    setCurrentStep(4)
    if (!canProceedToStep(4)) {
      router.push('/create/journey/great-loop/customize')
    }
  }, [selectedTemplate, canProceedToStep, router, setCurrentStep, hasHydrated])

  const handleBack = () => {
    router.push('/create/journey/great-loop/customize')
  }

  const handleNext = () => {
    router.push('/create/journey/great-loop/download')
  }

  // Show loading while hydrating or if validation fails
  if (!hasHydrated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <p>Loading your Great Loop adventure...</p>
        </div>
      </div>
    )
  }

  if (!selectedTemplate || !canProceedToStep(4)) {
    return null // Loading or redirect
  }

  return (
    <MapPreview 
      onBack={handleBack}
      onNext={handleNext}
    />
  )
} 