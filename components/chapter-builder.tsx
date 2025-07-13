"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Heart,
  Star,
  Home,
  Coffee,
  Map,
  Music,
  Camera,
  Smile,
  Frown,
  Compass,
  Anchor,
  Upload,
  X,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
} from "lucide-react"
import { motion } from "framer-motion"
import type { Location } from "@/lib/types"
import StyleCustomizer from "@/components/style-customizer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Available icons for locations
const availableIcons = [
  { name: "Heart", icon: Heart },
  { name: "Star", icon: Star },
  { name: "Home", icon: Home },
  { name: "Coffee", icon: Coffee },
  { name: "Map", icon: Map },
  { name: "Music", icon: Music },
  { name: "Camera", icon: Camera },
  { name: "Smile", icon: Smile },
  { name: "Frown", icon: Frown },
  { name: "Compass", icon: Compass },
  { name: "Anchor", icon: Anchor },
]

// Available emojis for locations
const availableEmojis = ["❤️", "🌟", "🏠", "☕", "🗺️", "🎵", "📷", "😊", "😢", "🧭", "⚓", "🌈", "🌊", "🌲", "🌄", "🚗"]

interface ChapterBuilderProps {
  initialLocations: Location[]
  onBack?: () => void
}

export default function ChapterBuilder({ initialLocations, onBack }: ChapterBuilderProps) {
  const [locations, setLocations] = useState(
    initialLocations.map((loc) => ({
      ...loc,
      iconType: "icon" as const,
      icon: "Heart",
      emoji: "❤️",
      caption: "",
      customImage: null as string | null,
    })),
  )

  const [activeLocationIndex, setActiveLocationIndex] = useState(0)
  const [proceedToStyle, setProceedToStyle] = useState(false)

  const updateLocationIcon = (index: number, iconName: string) => {
    const updatedLocations = [...locations]
    updatedLocations[index] = {
      ...updatedLocations[index],
      iconType: "icon",
      icon: iconName,
    }
    setLocations(updatedLocations)
  }

  const updateLocationEmoji = (index: number, emoji: string) => {
    const updatedLocations = [...locations]
    updatedLocations[index] = {
      ...updatedLocations[index],
      iconType: "emoji",
      emoji,
    }
    setLocations(updatedLocations)
  }

  const updateLocationCaption = (index: number, caption: string) => {
    const updatedLocations = [...locations]
    updatedLocations[index] = {
      ...updatedLocations[index],
      caption,
    }
    setLocations(updatedLocations)
  }

  const handleImageUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // In a real app, we would upload this to a server
    // For now, we'll just create a data URL
    const reader = new FileReader()
    reader.onload = () => {
      const updatedLocations = [...locations]
      updatedLocations[index] = {
        ...updatedLocations[index],
        iconType: "image",
        customImage: reader.result as string,
      }
      setLocations(updatedLocations)
    }
    reader.readAsDataURL(file)
  }

  const removeLocation = (index: number) => {
    const updatedLocations = [...locations]
    updatedLocations.splice(index, 1)
    setLocations(updatedLocations)

    if (activeLocationIndex >= updatedLocations.length) {
      setActiveLocationIndex(Math.max(0, updatedLocations.length - 1))
    }
  }

  const proceedToNextStep = () => {
    setProceedToStyle(true)
  }

  const activeLocation = locations[activeLocationIndex]

  if (proceedToStyle) {
    return <StyleCustomizer locations={locations} onBack={() => setProceedToStyle(false)} />
  }

  return (
    <motion.div
      className="container max-w-5xl mx-auto py-12 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="space-y-8">
        <div className="flex items-center justify-between mb-4">
          {onBack && (
            <Button variant="outline" onClick={onBack} className="flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Locations
            </Button>
          )}
          <div className="text-center flex-1">
            <h1 className="text-3xl font-light">Build Your Chapters</h1>
            <p className="text-muted-foreground">Customize each location to tell your unique story</p>
          </div>
          <div className="w-[130px]"></div> {/* Spacer to balance the back button */}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Location List Sidebar */}
          <div className="lg:col-span-1 bg-card p-4 rounded-lg border border-border">
            <h2 className="text-xl font-light mb-4">Your Places</h2>
            <ul className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
              {locations.map((location, index) => (
                <li
                  key={index}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    index === activeLocationIndex
                      ? "bg-accent border-primary"
                      : "bg-background border-border hover:bg-accent/50"
                  }`}
                  onClick={() => setActiveLocationIndex(index)}
                >
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      {location.iconType === "icon" && (
                        <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                          {(() => {
                            const IconComponent = availableIcons.find((i) => i.name === location.icon)?.icon
                            return IconComponent ? <IconComponent className="h-5 w-5" /> : null
                          })()}
                        </div>
                      )}
                      {location.iconType === "emoji" && (
                        <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">{location.emoji}</div>
                      )}
                      {location.iconType === "image" && location.customImage && (
                        <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
                          <img
                            src={location.customImage || "/placeholder.svg"}
                            alt="Custom"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <span className="text-sm font-medium leading-tight min-w-0 break-words">{location.name}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 flex-shrink-0"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeLocation(index)
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  {location.caption && (
                    <p className="text-xs text-muted-foreground mt-1 break-words leading-tight">{location.caption}</p>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Location Editor */}
          <div className="lg:col-span-2">
            {locations.length > 0 && activeLocation ? (
              <motion.div
                key={activeLocationIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-card p-6 rounded-lg border border-border"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-medium">{activeLocation.name}</h2>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      disabled={activeLocationIndex === 0}
                      onClick={() => setActiveLocationIndex((prev) => Math.max(0, prev - 1))}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      disabled={activeLocationIndex === locations.length - 1}
                      onClick={() => setActiveLocationIndex((prev) => Math.min(locations.length - 1, prev + 1))}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="text-sm text-muted-foreground mb-6">{activeLocation.prompt}</div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="caption" className="text-lg font-normal">
                      Caption
                    </Label>
                    <Input
                      id="caption"
                      placeholder="Add a short caption for this place..."
                      value={activeLocation.caption}
                      onChange={(e) => updateLocationCaption(activeLocationIndex, e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-lg font-normal">Choose a Marker</Label>

                    <Tabs defaultValue="icons">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="icons">Icons</TabsTrigger>
                        <TabsTrigger value="emojis">Emojis</TabsTrigger>
                        <TabsTrigger value="custom">Custom Image</TabsTrigger>
                      </TabsList>

                      <TabsContent value="icons" className="mt-4">
                        <div className="grid grid-cols-6 gap-2">
                          {availableIcons.map((iconObj) => {
                            const IconComponent = iconObj.icon
                            return (
                              <Button
                                key={iconObj.name}
                                variant={
                                  activeLocation.iconType === "icon" && activeLocation.icon === iconObj.name
                                    ? "default"
                                    : "outline"
                                }
                                size="icon"
                                className="h-10 w-10"
                                onClick={() => updateLocationIcon(activeLocationIndex, iconObj.name)}
                              >
                                <IconComponent className="h-5 w-5" />
                              </Button>
                            )
                          })}
                        </div>
                      </TabsContent>

                      <TabsContent value="emojis" className="mt-4">
                        <div className="grid grid-cols-8 gap-2">
                          {availableEmojis.map((emoji) => (
                            <Button
                              key={emoji}
                              variant={
                                activeLocation.iconType === "emoji" && activeLocation.emoji === emoji
                                  ? "default"
                                  : "outline"
                              }
                              size="icon"
                              className="h-10 w-10 text-lg"
                              onClick={() => updateLocationEmoji(activeLocationIndex, emoji)}
                            >
                              {emoji}
                            </Button>
                          ))}
                        </div>
                      </TabsContent>

                      <TabsContent value="custom" className="mt-4">
                        <div className="space-y-4">
                          <div className="flex items-center justify-center border-2 border-dashed border-border rounded-lg p-6">
                            {activeLocation.iconType === "image" && activeLocation.customImage ? (
                              <div className="relative w-24 h-24">
                                <img
                                  src={activeLocation.customImage || "/placeholder.svg"}
                                  alt="Custom marker"
                                  className="w-full h-full object-cover rounded-lg"
                                />
                                <Button
                                  variant="destructive"
                                  size="icon"
                                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                                  onClick={() => {
                                    const updatedLocations = [...locations]
                                    updatedLocations[activeLocationIndex] = {
                                      ...updatedLocations[activeLocationIndex],
                                      iconType: "icon",
                                      icon: "Heart",
                                      customImage: null,
                                    }
                                    setLocations(updatedLocations)
                                  }}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            ) : (
                              <div className="text-center">
                                <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                                <p className="mt-2 text-sm text-muted-foreground">Upload a custom image</p>
                                <Input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  id="image-upload"
                                  onChange={(e) => handleImageUpload(activeLocationIndex, e)}
                                />
                                <Label
                                  htmlFor="image-upload"
                                  className="mt-4 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 cursor-pointer"
                                >
                                  Select Image
                                </Label>
                              </div>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground text-center">
                            For best results, use a square image less than 1MB in size
                          </p>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-lg font-normal">Your Story</Label>
                    <div className="p-4 bg-background rounded-lg border border-border">
                      <p className="text-sm">{activeLocation.narrative}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="flex items-center justify-center h-full bg-card p-6 rounded-lg border border-border">
                <p className="text-muted-foreground">No locations added yet</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <Button onClick={proceedToNextStep} disabled={locations.length === 0} size="lg" className="flex items-center">
            Continue to Styling
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
