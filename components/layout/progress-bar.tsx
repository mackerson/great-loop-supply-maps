"use client"

import { usePathname } from 'next/navigation'
import { useMapCreationStore } from '@/stores/map-creation'
import { cn } from '@/lib/utils'

const steps = [
  { number: 1, title: 'Choose Moments', path: '/create' },
  { number: 2, title: 'Add Chapters', path: '/create/chapters' },
  { number: 3, title: 'Customize', path: '/create/customize' },
  { number: 4, title: 'Preview', path: '/create/preview' },
  { number: 5, title: 'Download', path: '/create/download' },
]

export default function ProgressBar() {
  const pathname = usePathname()
  const { currentStep, canProceedToStep } = useMapCreationStore()
  
  // Only show on workflow pages
  if (!pathname.startsWith('/create')) {
    return null
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
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                    {
                      "bg-primary text-primary-foreground": isActive,
                      "bg-primary/20 text-primary": isCompleted,
                      "bg-muted text-muted-foreground": !isActive && !isCompleted && isAccessible,
                      "bg-muted/50 text-muted-foreground/50": !isAccessible,
                    }
                  )}>
                    {step.number}
                  </div>
                  
                  {/* Step Label */}
                  <div className="ml-3 hidden sm:block">
                    <div className={cn(
                      "text-sm font-medium",
                      {
                        "text-foreground": isActive,
                        "text-muted-foreground": !isActive && isAccessible,
                        "text-muted-foreground/50": !isAccessible,
                      }
                    )}>
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