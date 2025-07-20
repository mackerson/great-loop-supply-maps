"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { motion } from "framer-motion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowLeft } from "lucide-react"
import { useMapCreationStore } from '@/stores/map-creation'
import { MapRenderer } from './map-renderer'
import { Card, CardContent } from "@/components/ui/card"

interface StyleCustomizerProps {
  onBack?: () => void
  onNext?: () => void
}

// Template-specific theme options
const getThemeOptions = (templateId: string | undefined, community: string | undefined) => {
  if (community === 'boating') {
    return [
      { id: "nautical", name: "Nautical", description: "Classic maritime styling perfect for boat cabins" },
      { id: "minimalist", name: "Minimalist", description: "Clean lines with subtle water-inspired details" },
      { id: "vintage", name: "Vintage Chart", description: "Traditional nautical chart aesthetic" },
    ]
  } else if (community === 'hiking') {
    return [
      { id: "wilderness", name: "Wilderness", description: "Natural outdoor styling perfect for trail memories" },
      { id: "minimalist", name: "Minimalist", description: "Clean lines with subtle terrain details" },
      { id: "topographic", name: "Topographic", description: "Classic trail map aesthetic" },
    ]
  } else {
    // Fallback to original themes
    return [
      { id: "minimalist", name: "Minimalist", description: "Clean lines with subtle details" },
      { id: "woodburn", name: "Woodburn", description: "Perfect for wood engraving" },
      { id: "vintage", name: "Vintage", description: "Classic aged map style" },
    ]
  }
}

// Font options
const fontOptions = [
  { id: "sans", name: "Sans-serif", value: "font-sans" },
  { id: "serif", name: "Serif", value: "font-serif" },
  { id: "mono", name: "Monospace", value: "font-mono" },
]

export function StyleCustomizer({ onBack, onNext }: StyleCustomizerProps) {
  const { 
    selectedTemplate,
    style, 
    updateStyle,
    nextStep,
    getPromptForStep,
    getPromptDescriptionForStep,
    getTerminology
  } = useMapCreationStore()

  // Get template-specific theme options
  const themeOptions = getThemeOptions(selectedTemplate?.id, selectedTemplate?.community)
  
  // Get template styling defaults
  const templateStyling = selectedTemplate?.config.styling
  
  const handleStrokeWidthChange = (value: number[]) => {
    updateStyle({ strokeWidth: value[0] })
  }

  const handleThemeChange = (theme: string) => {
    updateStyle({ theme: theme as 'minimalist' | 'woodburn' | 'vintage' | 'inverted' | 'nautical' | 'wilderness' | 'topographic' })
  }

  const handleFontChange = (font: string) => {
    updateStyle({ font })
  }

  const proceedToNextStep = () => {
    if (onNext) {
      onNext()
    } else {
      nextStep()
    }
  }

  // Get template-specific preview styling
  const getPreviewColors = () => {
    const currentTheme = style.theme
    const primaryColor = templateStyling?.primaryColor
    const secondaryColor = templateStyling?.secondaryColor
    
    if (selectedTemplate?.community === 'boating') {
      switch (currentTheme) {
        case "nautical":
          return {
            background: "bg-blue-50",
            lines: "text-blue-600",
            markers: primaryColor || "#1e40af",
            text: "text-blue-900",
            accent: secondaryColor || "#0ea5e9"
          }
        case "vintage":
          return {
            background: "bg-amber-50",
            lines: "text-blue-800",
            markers: "#1e3a8a",
            text: "text-blue-900",
            accent: "#3b82f6"
          }
        default: // minimalist
          return {
            background: "bg-white",
            lines: "text-blue-300",
            markers: primaryColor || "#475569",
            text: "text-slate-700",
            accent: secondaryColor || "#64748b"
          }
      }
    } else if (selectedTemplate?.community === 'hiking') {
      switch (currentTheme) {
        case "wilderness":
          return {
            background: "bg-green-50",
            lines: "text-green-600",
            markers: primaryColor || "#059669",
            text: "text-green-900",
            accent: secondaryColor || "#10b981"
          }
        case "topographic":
          return {
            background: "bg-orange-50",
            lines: "text-orange-600",
            markers: "#ea580c",
            text: "text-orange-900",
            accent: "#f97316"
          }
        default: // minimalist
          return {
            background: "bg-white",
            lines: "text-green-300",
            markers: primaryColor || "#475569",
            text: "text-slate-700",
            accent: secondaryColor || "#64748b"
          }
      }
    } else {
      // Fallback styling
      switch (currentTheme) {
        case "woodburn":
          return {
            background: "bg-amber-50",
            lines: "text-amber-800",
            markers: "#92400e",
            text: "text-amber-900",
            accent: "#d97706"
          }
        case "vintage":
          return {
            background: "bg-stone-100",
            lines: "text-stone-500",
            markers: "#44403c",
            text: "text-stone-700",
            accent: "#78716c"
          }
        default: // minimalist
          return {
            background: "bg-white",
            lines: "text-slate-300",
            markers: "#475569",
            text: "text-slate-700",
            accent: "#64748b"
          }
      }
    }
  }

  const previewColors = getPreviewColors()
  
  // Get template-specific labels for preview
  const getPreviewLabels = () => {
    if (selectedTemplate?.community === 'boating') {
      return ["Home Port", "Favorite Anchorage", "Final Destination"]
    } else if (selectedTemplate?.community === 'hiking') {
      return ["Trailhead", "Summit View", "Trail Town"]
    } else {
      return ["First Meeting", "Special Place", "Our Home"]
    }
  }
  
  const previewLabels = getPreviewLabels()

  return (
    <motion.div
      className="container max-w-4xl mx-auto py-12 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="space-y-8">
        <div className="flex items-center justify-between mb-4">
          {onBack && (
            <Button variant="outline" onClick={onBack} className="flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Chapters
            </Button>
          )}
          <div className="text-center flex-1">
            <h1 className="text-3xl font-light">
              {getPromptForStep(3) || "Customize Your Map"}
            </h1>
            <p className="text-muted-foreground">
              {getPromptDescriptionForStep(3) || `Choose colors and styling that capture the spirit of your ${getTerminology('journey')}`}
            </p>
          </div>
          <div className="w-[130px]"></div> {/* Spacer to balance the back button */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Style Options */}
          <div className="space-y-8 bg-card p-6 rounded-lg border border-border">
            <div className="space-y-4">
              <h2 className="text-xl font-light">Map Theme</h2>
              <p className="text-sm text-muted-foreground">
                {selectedTemplate?.community === 'boating' 
                  ? "Choose a style that works great for your boat cabin or home display"
                  : selectedTemplate?.community === 'hiking'
                  ? "Select a style perfect for framing your outdoor adventure"
                  : "Select a theme that works well for engraving or printing"
                }
              </p>

              <RadioGroup value={style.theme} onValueChange={handleThemeChange} className="grid gap-4">
                {themeOptions.map((theme) => (
                  <div key={theme.id} className="flex items-start space-x-3">
                    <RadioGroupItem value={theme.id} id={theme.id} className="mt-1" />
                    <div className="grid gap-1.5">
                      <Label htmlFor={theme.id} className="font-medium">
                        {theme.name}
                      </Label>
                      <p className="text-sm text-muted-foreground">{theme.description}</p>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-light">Typography</h2>
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="font-select">Font Style</Label>
                  <Select value={style.font} onValueChange={handleFontChange}>
                    <SelectTrigger id="font-select">
                      <SelectValue placeholder="Select a font" />
                    </SelectTrigger>
                    <SelectContent>
                      {fontOptions.map((font) => (
                        <SelectItem key={font.id} value={font.value}>
                          <span className={font.value}>{font.name}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {templateStyling?.font && (
                    <p className="text-xs text-muted-foreground">
                      Recommended: {fontOptions.find(f => f.value === templateStyling.font)?.name}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-light">Line Style</h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="stroke-width">Stroke Width</Label>
                    <span className="text-sm text-muted-foreground">{style.strokeWidth}px</span>
                  </div>
                  <Slider
                    id="stroke-width"
                    min={1}
                    max={5}
                    step={0.5}
                    value={[style.strokeWidth]}
                    onValueChange={handleStrokeWidthChange}
                  />
                  <p className="text-xs text-muted-foreground">
                    {selectedTemplate?.community === 'boating' 
                      ? "Thicker lines work well for nautical charts"
                      : selectedTemplate?.community === 'hiking'
                      ? "Medium lines capture trail map aesthetics"
                      : "Adjust line thickness for your intended use"
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Live Map Preview */}
          <div className="space-y-4">
            <h2 className="text-xl font-light">Live Preview</h2>
            <Card>
              <CardContent className="p-4">
                <div className="aspect-square">
                  <MapRenderer 
                    className="w-full h-full"
                    style={{ minHeight: '400px' }}
                    showControls={false}
                  />
                </div>
                
                <div className="mt-4 text-center text-sm text-muted-foreground">
                  Live preview with your actual {getTerminology('location')}s
                  <br />
                  <span className="text-xs text-blue-600">
                    Theme changes apply immediately
                  </span>
                </div>
              </CardContent>
            </Card>
            
            {/* Template styling info */}
            {templateStyling && (
              <div className="text-xs text-muted-foreground bg-muted p-3 rounded-lg">
                <p className="font-medium mb-1">Template Styling:</p>
                <p>
                  {selectedTemplate?.community === 'boating' 
                    ? "Optimized for nautical aesthetics with maritime colors and styling"
                    : selectedTemplate?.community === 'hiking'
                    ? "Designed for outdoor adventures with natural colors and trail-inspired styling"
                    : "Customized styling for your specific journey type"
                  }
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-center">
          <Button onClick={proceedToNextStep} size="lg" className="px-8">
            Continue to Preview
          </Button>
        </div>
      </div>
    </motion.div>
  )
} 