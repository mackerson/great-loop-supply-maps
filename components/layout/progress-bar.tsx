"use client"

import { usePathname, useRouter } from 'next/navigation'
import { useMapCreationStore } from '@/stores/map-creation'
import { cn } from '@/lib/utils'

export default function ProgressBar() {
  const pathname = usePathname()
  const router = useRouter()
  const { selectedTemplate, currentStep, canProceedToStep, setCurrentStep, getTerminology } = useMapCreationStore()
  
  // Only show on template workflow pages, not on template selection pages
  const isTemplateWorkflow = pathname.includes('/create/journey/') || pathname.includes('/create/relationship/') || pathname.includes('/create/story/')
  
  if (!isTemplateWorkflow || !selectedTemplate) {
    return null
  }
  
  // Generate template-specific steps
  const getSteps = () => {
    const baseSteps = [
      { number: 1, title: `Choose ${getTerminology('location')}s`, key: 'start_location' },
      { number: 2, title: `Add ${getTerminology('journey')} chapters`, key: 'add_chapters' },
      { number: 3, title: 'Customize', key: 'customize_style' },
      { number: 4, title: 'Preview', key: 'preview_map' },
      { number: 5, title: 'Download', key: 'download_map' },
    ]
    
    const basePath = `/create/${selectedTemplate.category}/${selectedTemplate.id}`
    const pathSuffixes = ['', '/chapters', '/customize', '/preview', '/download']
    
    return baseSteps.map((step, index) => ({
      ...step,
      path: basePath + pathSuffixes[index]
    }))
  }
  
  const steps = getSteps()
  
  const handleStepClick = (step: typeof steps[0]) => {
    if (canProceedToStep(step.number)) {
      setCurrentStep(step.number)
      router.push(step.path)
    }
  }
  
  return (
    <div className="border-b bg-muted/20">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          {steps.map((step, index) => {
            const isActive = step.path === pathname
            const isCompleted = step.number < currentStep
            const isAccessible = canProceedToStep(step.number)
            
            return (
              <div key={step.number} className="flex items-center">
                {/* Step Circle */}
                <div className="flex items-center">
                  <div 
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200",
                      {
                        "bg-primary text-primary-foreground": isActive,
                        "bg-primary/20 text-primary": isCompleted,
                        "bg-muted text-muted-foreground": !isActive && !isCompleted && isAccessible,
                        "bg-muted/50 text-muted-foreground/50": !isAccessible,
                        "cursor-pointer hover:bg-primary hover:text-primary-foreground hover:scale-105": isAccessible && !isActive,
                        "cursor-not-allowed": !isAccessible,
                      }
                    )}
                    onClick={() => handleStepClick(step)}
                    role={isAccessible ? "button" : undefined}
                    tabIndex={isAccessible ? 0 : -1}
                    onKeyDown={(e) => {
                      if (isAccessible && (e.key === 'Enter' || e.key === ' ')) {
                        e.preventDefault()
                        handleStepClick(step)
                      }
                    }}
                  >
                    {step.number}
                  </div>
                  
                  {/* Step Label */}
                  <div className="ml-3 hidden sm:block">
                    <div 
                      className={cn(
                        "text-sm font-medium transition-colors cursor-pointer select-none",
                        {
                          "text-foreground": isActive,
                          "text-muted-foreground hover:text-foreground": !isActive && isAccessible,
                          "text-muted-foreground/50": !isAccessible,
                        }
                      )}
                      onClick={() => handleStepClick(step)}
                      role={isAccessible ? "button" : undefined}
                      tabIndex={isAccessible ? 0 : -1}
                      onKeyDown={(e) => {
                        if (isAccessible && (e.key === 'Enter' || e.key === ' ')) {
                          e.preventDefault()
                          handleStepClick(step)
                        }
                      }}
                    >
                      {step.title}
                    </div>
                  </div>
                </div>
                
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className={cn(
                    "h-px w-16 mx-4 transition-colors",
                    {
                      "bg-primary/20": isCompleted,
                      "bg-muted": !isCompleted,
                    }
                  )} />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
} 