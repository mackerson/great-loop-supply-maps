"use client"

import { useMapCreationStore } from '@/stores/map-creation'
import { ChapterBuilder } from '@/components/map-creation/chapter-builder'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function GreatLoopChaptersPage() {
  const router = useRouter()
  const { selectedTemplate, locations, canProceedToStep, setCurrentStep } = useMapCreationStore()

  useEffect(() => {
    // Ensure we have a selected template and can proceed to step 2
    if (!selectedTemplate || selectedTemplate.id !== 'great-loop') {
      router.push('/create/journey/great-loop')
      return
    }
    
    // Set current step and validate
    setCurrentStep(2)
    if (!canProceedToStep(2)) {
      router.push('/create/journey/great-loop')
    }
  }, [selectedTemplate, canProceedToStep, router, setCurrentStep])

  const handleBack = () => {
    router.push('/create/journey/great-loop')
  }

  const handleNext = () => {
    router.push('/create/journey/great-loop/customize')
  }

  if (!selectedTemplate || locations.length === 0) {
    return null // Loading or redirect
  }

  return (
    <ChapterBuilder 
      onBack={handleBack}
      onNext={handleNext}
    />
  )
} 