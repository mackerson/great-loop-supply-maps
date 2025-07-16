"use client"

import { useMapCreationStore } from '@/stores/map-creation'
import { StyleCustomizer } from '@/components/map-creation/style-customizer'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AppalachianTrailCustomizePage() {
  const router = useRouter()
  const { selectedTemplate, canProceedToStep, setCurrentStep } = useMapCreationStore()

  useEffect(() => {
    // Ensure we have a selected template and can proceed to step 3
    if (!selectedTemplate || selectedTemplate.id !== 'appalachian-trail') {
      router.push('/create/journey/appalachian-trail')
      return
    }
    
    // Set current step and validate
    setCurrentStep(3)
    if (!canProceedToStep(3)) {
      router.push('/create/journey/appalachian-trail/chapters')
    }
  }, [selectedTemplate, canProceedToStep, router, setCurrentStep])

  const handleBack = () => {
    router.push('/create/journey/appalachian-trail/chapters')
  }

  const handleNext = () => {
    router.push('/create/journey/appalachian-trail/preview')
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