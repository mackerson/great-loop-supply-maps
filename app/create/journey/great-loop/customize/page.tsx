"use client"

import { useMapCreationStore } from '@/stores/map-creation'
import { StyleCustomizer } from '@/components/map-creation/style-customizer'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function GreatLoopCustomizePage() {
  const router = useRouter()
  const { selectedTemplate, canProceedToStep, setCurrentStep } = useMapCreationStore()

  useEffect(() => {
    // Ensure we have a selected template and can proceed to step 3
    if (!selectedTemplate || selectedTemplate.id !== 'great-loop') {
      router.push('/create/journey/great-loop')
      return
    }
    
    // Set current step and validate
    setCurrentStep(3)
    if (!canProceedToStep(3)) {
      router.push('/create/journey/great-loop/chapters')
    }
  }, [selectedTemplate, canProceedToStep, router, setCurrentStep])

  const handleBack = () => {
    router.push('/create/journey/great-loop/chapters')
  }

  const handleNext = () => {
    router.push('/create/journey/great-loop/preview')
  }

  if (!selectedTemplate || !canProceedToStep(3)) {
    return null // Loading or redirect
  }

  return (
    <StyleCustomizer 
      onBack={handleBack}
      onNext={handleNext}
    />
  )
} 