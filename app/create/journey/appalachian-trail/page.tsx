"use client"

import { useEffect } from "react"
import { useMapCreationStore } from "@/stores/map-creation"
import { templateRegistry } from "@/lib/template-registry"
import LocationInput from "@/components/map-creation/location-input"
import { useRouter } from "next/navigation"

export default function AppalachianTrailWorkflowPage() {
  const router = useRouter()
  const { selectedTemplate, setTemplate, setCurrentStep, getPromptForStep, getPromptDescriptionForStep } = useMapCreationStore()
  
  useEffect(() => {
    // Ensure Appalachian Trail template is selected
    if (!selectedTemplate || selectedTemplate.id !== 'appalachian-trail') {
      const template = templateRegistry.getTemplate('appalachian-trail')
      if (template) {
        setTemplate(template)
      } else {
        // If template not found, redirect to template selection
        router.push('/create/journey')
        return
      }
    }
    
    // Set current step to 1
    setCurrentStep(1)
  }, [selectedTemplate, setTemplate, setCurrentStep, router])

  // Show loading if template is not yet loaded
  if (!selectedTemplate) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <p>Loading your Appalachian Trail adventure...</p>
        </div>
      </div>
    )
  }

  const promptTitle = getPromptForStep(1)
  const promptDescription = getPromptDescriptionForStep(1)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-light tracking-tight mb-4">
            {promptTitle || 'Where did your AT adventure begin?'}
          </h1>
          <p className="text-lg text-muted-foreground">
            {promptDescription || 'Start by adding your starting trailhead or where you began your Appalachian Trail journey.'}
          </p>
        </div>
        
        <LocationInput />
      </div>
    </div>
  )
} 