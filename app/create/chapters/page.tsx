"use client"

import { useMapCreationStore } from '@/stores/map-creation'
import { ChapterBuilder } from '@/components/map-creation/chapter-builder'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function ChaptersPage() {
  const router = useRouter()
  const { locations, canProceedToStep, setCurrentStep } = useMapCreationStore()

  useEffect(() => {
    // Set current step and validate
    setCurrentStep(2)
    if (!canProceedToStep(2)) {
      router.push('/create')
    }
  }, [canProceedToStep, router, setCurrentStep])

  const handleBack = () => {
    router.push('/create')
  }

  const handleNext = () => {
    router.push('/create/customize')
  }

  if (locations.length === 0) {
    return null // Loading or redirect
  }

  return (
    <ChapterBuilder 
      onBack={handleBack}
      onNext={handleNext}
    />
  )
} 