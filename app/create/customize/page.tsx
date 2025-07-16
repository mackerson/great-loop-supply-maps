"use client"

import { useMapCreationStore } from '@/stores/map-creation'
import { StyleCustomizer } from '@/components/map-creation/style-customizer'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function CustomizePage() {
  const router = useRouter()
  const { locations, canProceedToStep, setCurrentStep } = useMapCreationStore()

  useEffect(() => {
    // Set current step and validate
    setCurrentStep(3)
    if (!canProceedToStep(3)) {
      router.push('/create')
    }
  }, [canProceedToStep, router, setCurrentStep])

  const handleBack = () => {
    router.push('/create/chapters')
  }

  const handleNext = () => {
    router.push('/create/preview')
  }

  if (locations.length === 0) {
    return null // Loading or redirect
  }

  return (
    <StyleCustomizer 
      onBack={handleBack}
      onNext={handleNext}
    />
  )
} 