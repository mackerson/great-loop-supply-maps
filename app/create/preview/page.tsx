"use client"

import { useMapCreationStore } from '@/stores/map-creation'
import { MapPreview } from '@/components/map-creation/map-preview'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function PreviewPage() {
  const router = useRouter()
  const { locations, canProceedToStep, setCurrentStep } = useMapCreationStore()

  useEffect(() => {
    // Set current step and validate
    setCurrentStep(4)
    if (!canProceedToStep(4)) {
      router.push('/create')
    }
  }, [canProceedToStep, router, setCurrentStep])

  const handleBack = () => {
    router.push('/create/customize')
  }

  const handleNext = () => {
    router.push('/create/download')
  }

  if (locations.length === 0) {
    return null // Loading or redirect
  }

  return (
    <MapPreview 
      onBack={handleBack}
      onNext={handleNext}
    />
  )
} 