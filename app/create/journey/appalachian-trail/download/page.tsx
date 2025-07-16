"use client"

import { useMapCreationStore } from '@/stores/map-creation'
import { ExportInterface } from '@/components/map-creation/export-interface'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AppalachianTrailDownloadPage() {
  const router = useRouter()
  const { selectedTemplate, canProceedToStep, setCurrentStep } = useMapCreationStore()

  useEffect(() => {
    // Ensure we have a selected template and can proceed to step 5
    if (!selectedTemplate || selectedTemplate.id !== 'appalachian-trail') {
      router.push('/create/journey/appalachian-trail')
      return
    }
    
    // Set current step and validate
    setCurrentStep(5)
    if (!canProceedToStep(5)) {
      router.push('/create/journey/appalachian-trail/preview')
    }
  }, [selectedTemplate, canProceedToStep, router, setCurrentStep])

  const handleBack = () => {
    router.push('/create/journey/appalachian-trail/preview')
  }

  if (!selectedTemplate || !canProceedToStep(5)) {
    return null // Loading or redirect
  }

  return (
    <ExportInterface 
      onBack={handleBack}
    />
  )
} 