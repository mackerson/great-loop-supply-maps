"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { motion } from "framer-motion"
import type { Location } from "@/lib/types"
import MapPreview from "@/components/map-preview"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowLeft, ChevronRight } from "lucide-react"

interface StyleCustomizerProps {
  locations: Location[]
  onBack?: () => void
}

// Map theme options
const mapThemes = [
  { id: "minimalist", name: "Minimalist", description: "Clean lines with subtle details" },
  { id: "woodburn", name: "Woodburn", description: "Perfect for wood engraving" },
  { id: "vintage", name: "Vintage", description: "Classic aged map style" },
]

// Font options
const fontOptions = [
  { id: "sans", name: "Sans-serif", value: "font-sans" },
  { id: "serif", name: "Serif", value: "font-serif" },
  { id: "mono", name: "Monospace", value: "font-mono" },
]

export default function StyleCustomizer({ locations, onBack }: StyleCustomizerProps) {
  const [selectedTheme, setSelectedTheme] = useState("minimalist")
  const [selectedFont, setSelectedFont] = useState("font-sans")
  const [strokeWidth, setStrokeWidth] = useState(2)
  const [showPreview, setShowPreview] = useState(false)

  const handleStrokeWidthChange = (value: number[]) => {
    setStrokeWidth(value[0])
  }

  const proceedToPreview = () => {
    setShowPreview(true)
  }

  if (showPreview) {
    return (
      <MapPreview
        locations={locations}
        theme={selectedTheme}
        font={selectedFont}
        strokeWidth={strokeWidth}
        onBack={() => setShowPreview(false)}
      />
    )
  }

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
            <h1 className="text-3xl font-light">Customize Your Map</h1>
            <p className="text-muted-foreground">Choose a style that best tells your story</p>
          </div>
          <div className="w-[130px]"></div> {/* Spacer to balance the back button */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Style Options */}
          <div className="space-y-8 bg-card p-6 rounded-lg border border-border">
            <div className="space-y-4">
              <h2 className="text-xl font-light">Map Theme</h2>
              <p className="text-sm text-muted-foreground">Select a theme that works well for engraving or printing</p>

              <RadioGroup value={selectedTheme} onValueChange={setSelectedTheme} className="grid gap-4">
                {mapThemes.map((theme) => (
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
                  <Select value={selectedFont} onValueChange={setSelectedFont}>
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
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-light">Line Style</h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="stroke-width">Stroke Width</Label>
                    <span className="text-sm text-muted-foreground">{strokeWidth}px</span>
                  </div>
                  <Slider
                    id="stroke-width"
                    min={1}
                    max={5}
                    step={0.5}
                    value={[strokeWidth]}
                    onValueChange={handleStrokeWidthChange}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-4">
            <h2 className="text-xl font-light">Preview</h2>
            <div className="bg-card aspect-square rounded-lg border border-border overflow-hidden">
              <div className={`w-full h-full p-4 ${selectedFont}`}>
                <div className="relative w-full h-full">
                  {/* Simple map preview based on selected theme */}
                  <div
                    className={`w-full h-full rounded-lg ${
                      selectedTheme === "minimalist"
                        ? "bg-white"
                        : selectedTheme === "woodburn"
                          ? "bg-amber-50"
                          : "bg-stone-100"
                    }`}
                  >
                    {/* Map lines */}
                    <svg
                      width="100%"
                      height="100%"
                      viewBox="0 0 100 100"
                      preserveAspectRatio="none"
                      className={`${
                        selectedTheme === "minimalist"
                          ? "text-slate-300"
                          : selectedTheme === "woodburn"
                            ? "text-amber-800"
                            : "text-stone-500"
                      }`}
                    >
                      {/* Horizontal lines */}
                      {[20, 40, 60, 80].map((y) => (
                        <path
                          key={`h-${y}`}
                          d={`M 10 ${y} C 30 ${y + 5}, 70 ${y - 5}, 90 ${y}`}
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={strokeWidth * 0.2}
                          strokeLinecap="round"
                          className={selectedTheme === "vintage" ? "stroke-dasharray-2" : ""}
                        />
                      ))}

                      {/* Vertical lines */}
                      {[30, 50, 70].map((x) => (
                        <path
                          key={`v-${x}`}
                          d={`M ${x} 10 C ${x - 5} 30, ${x + 5} 70, ${x} 90`}
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={strokeWidth * 0.2}
                          strokeLinecap="round"
                          className={selectedTheme === "vintage" ? "stroke-dasharray-2" : ""}
                        />
                      ))}

                      {/* Sample location markers */}
                      {[
                        { x: 30, y: 30 },
                        { x: 70, y: 40 },
                        { x: 50, y: 70 },
                      ].map((pos, i) => (
                        <circle
                          key={i}
                          cx={pos.x}
                          cy={pos.y}
                          r={strokeWidth * 0.8}
                          fill={
                            selectedTheme === "minimalist"
                              ? "#475569"
                              : selectedTheme === "woodburn"
                                ? "#92400e"
                                : "#44403c"
                          }
                        />
                      ))}
                    </svg>

                    {/* Sample labels */}
                    <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2">
                      <div
                        className={`text-xs ${
                          selectedTheme === "minimalist"
                            ? "text-slate-700"
                            : selectedTheme === "woodburn"
                              ? "text-amber-900"
                              : "text-stone-700"
                        }`}
                      >
                        First Meeting
                      </div>
                    </div>

                    <div className="absolute top-2/3 right-1/4 transform translate-x-1/2 -translate-y-1/2">
                      <div
                        className={`text-xs ${
                          selectedTheme === "minimalist"
                            ? "text-slate-700"
                            : selectedTheme === "woodburn"
                              ? "text-amber-900"
                              : "text-stone-700"
                        }`}
                      >
                        Our Home
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-light">Engraving Clarity</h3>
              <p className="text-sm text-muted-foreground">
                {strokeWidth < 2
                  ? "Fine details, best for high-precision engraving."
                  : strokeWidth < 3.5
                    ? "Balanced details, suitable for most engraving methods."
                    : "Bold lines, ideal for larger engravings and wood burning."}
              </p>
            </div>

            <div className="pt-4">
              <Button onClick={proceedToPreview} className="w-full flex items-center justify-center" size="lg">
                Continue to Preview
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
