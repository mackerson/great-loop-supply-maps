"use client"

import { useMapCreationStore } from "@/stores/map-creation"
import { templateRegistry } from "@/lib/template-registry"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"

export default function JourneyMapsPage() {
  const router = useRouter()
  const { setTemplate } = useMapCreationStore()
  
  const handleBack = () => {
    router.push('/create')
  }

  const handleTemplateSelection = (templateId: string) => {
    const template = templateRegistry.getTemplate(templateId)
    if (template) {
      setTemplate(template)
      router.push(`/create/journey/${template.id}`)
    }
  }

  const journeyTemplates = templateRegistry.getJourneyTemplates()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={handleBack} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Map Types
          </Button>
        </div>
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-light tracking-tight mb-4">
            Journey Maps
          </h1>
          <p className="text-xl text-muted-foreground">
            Document your adventures along established routes
          </p>
        </div>
        
        {/* Journey Templates */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {journeyTemplates.map((template) => (
            <Card key={template.id} className="cursor-pointer hover:shadow-lg transition-all duration-200 group">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🗺️ {template.name}
                </CardTitle>
                <CardDescription>
                  {template.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
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
                  
                  <div className="pt-2">
                    <Button 
                      onClick={() => handleTemplateSelection(template.id)}
                      className="w-full group-hover:bg-primary/90"
                    >
                      Start {template.name} Map
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Coming Soon Templates */}
        <div className="mt-12">
          <h2 className="text-2xl font-light tracking-tight mb-6 text-center">
            Coming Soon
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {['Appalachian Trail', 'Pacific Crest Trail', 'Route 66', 'European Camino'].map((templateName) => (
              <Card key={templateName} className="opacity-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    🗺️ {templateName}
                  </CardTitle>
                  <CardDescription>
                    Coming soon
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    We're working on bringing you more adventure templates
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 