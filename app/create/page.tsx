"use client"

import { useMapCreationStore } from "@/stores/map-creation"
import { templateRegistry } from "@/lib/template-registry"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function CreateMapPage() {
  const router = useRouter()
  const { setTemplate } = useMapCreationStore()
  
  const handleMapTypeSelection = (type: string) => {
    router.push(`/create/${type}`)
  }

  const handleTemplateSelection = (templateId: string) => {
    const template = templateRegistry.getTemplate(templateId)
    if (template) {
      setTemplate(template)
      router.push(`/create/${template.category}/${template.id}`)
    }
  }

  const journeyTemplates = templateRegistry.getJourneyTemplates()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-light tracking-tight mb-4">
            Create Your Map
          </h1>
          <p className="text-xl text-muted-foreground">
            Choose the type of map that best tells your story
          </p>
        </div>
        
        {/* Map Type Selection */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleMapTypeSelection('journey')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🗺️ Journey Maps
              </CardTitle>
              <CardDescription>
                Document your adventures along established routes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Perfect for Great Loop, hiking trails, road trips, and other travel adventures
              </p>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:shadow-lg transition-shadow opacity-50" onClick={() => handleMapTypeSelection('relationship')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                💕 Relationship Maps
              </CardTitle>
              <CardDescription>
                Celebrate the places that brought you together
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Coming soon: Maps for couples, families, and friendships
              </p>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:shadow-lg transition-shadow opacity-50" onClick={() => handleMapTypeSelection('story')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📖 Story Maps
              </CardTitle>
              <CardDescription>
                Capture the moments that shaped your life
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Coming soon: Maps for life milestones and personal stories
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Journey Templates Preview */}
        {journeyTemplates.length > 0 && (
          <div>
            <h2 className="text-2xl font-light tracking-tight mb-6">
              Popular Journey Templates
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {journeyTemplates.map((template) => (
                <Card key={template.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleTemplateSelection(template.id)}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {template.category === 'journey' && '🗺️'} {template.name}
                    </CardTitle>
                    <CardDescription>
                      {template.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        {template.preview?.tagline}
                      </p>
                      {template.preview?.locations && (
                        <div className="flex flex-wrap gap-1">
                          {template.preview.locations.map((location, index) => (
                            <span key={index} className="text-xs bg-muted px-2 py-1 rounded">
                              {location}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 