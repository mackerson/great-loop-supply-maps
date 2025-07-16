"use client"

import { useMapCreationStore } from '@/stores/map-creation'
import { MapPreview } from '@/components/map-creation/map-preview'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AppalachianTrailPreviewPage() {
  const router = useRouter()
  const { selectedTemplate, canProceedToStep, setCurrentStep } = useMapCreationStore()

  useEffect(() => {
    // Ensure we have a selected template and can proceed to step 4
    if (!selectedTemplate || selectedTemplate.id !== 'appalachian-trail') {
      router.push('/create/journey/appalachian-trail')
      return
    }
    
    // Set current step and validate
    setCurrentStep(4)
    if (!canProceedToStep(4)) {
      router.push('/create/journey/appalachian-trail/customize')
    }
  }, [selectedTemplate, canProceedToStep, router, setCurrentStep])

  const handleBack = () => {
    router.push('/create/journey/appalachian-trail/customize')
  }

  const handleNext = () => {
    router.push('/create/journey/appalachian-trail/download')
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