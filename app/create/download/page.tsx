"use client"

import { useMapCreationStore } from '@/stores/map-creation'
import { ExportInterface } from '@/components/map-creation/export-interface'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function DownloadPage() {
  const router = useRouter()
  const { locations, canProceedToStep, setCurrentStep } = useMapCreationStore()

  useEffect(() => {
    // Set current step and validate
    setCurrentStep(5)
    if (!canProceedToStep(5)) {
      router.push('/create')
    }
  }, [canProceedToStep, router, setCurrentStep])

  const handleBack = () => {
    router.push('/create/preview')
  }

  if (locations.length === 0) {
    return null // Loading or redirect
  }

  return (
    <ExportInterface 
      onBack={handleBack}
    />
  )
} 