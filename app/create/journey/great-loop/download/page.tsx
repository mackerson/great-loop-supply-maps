"use client"

import { useMapCreationStore } from '@/stores/map-creation'
import { GreatLoopDownload } from '@/components/map-creation/great-loop-download'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function GreatLoopDownloadPage() {
  const router = useRouter()
  const { selectedTemplate, canProceedToStep, setCurrentStep } = useMapCreationStore()

  useEffect(() => {
    // Ensure we have a selected template and can proceed to step 5
    if (!selectedTemplate || selectedTemplate.id !== 'great-loop') {
      router.push('/create/journey/great-loop')
      return
    }
    
    // Set current step and validate
    setCurrentStep(5)
    if (!canProceedToStep(5)) {
      router.push('/create/journey/great-loop/preview')
    }
  }, [selectedTemplate, canProceedToStep, router, setCurrentStep])

  const handleBack = () => {
    router.push('/create/journey/great-loop/preview')
  }

  if (!selectedTemplate || !canProceedToStep(5)) {
    return null // Loading or redirect
  }

  return (
    <GreatLoopDownload 
      onBack={handleBack}
    />
  )
} 