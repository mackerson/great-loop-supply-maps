"use client"

import type React from "react"
import { useEffect } from "react"
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
  Car,
  Flag,
  Upload,
  X,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
} from "lucide-react"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useMapCreationStore, type Location } from '@/stores/map-creation'
import { iconRegistry, getIconsByCategory } from '@/lib/icon-registry'

// Fallback icons for locations
const fallbackIcons = [
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

// Fallback emojis for locations
const fallbackEmojis = ["❤️", "🌟", "🏠", "☕", "🗺️", "🎵", "📷", "😊", "😢", "🧭", "⚓", "🌈", "🌊", "🌲", "🌄", "🚗"]

interface ChapterBuilderProps {
  onBack?: () => void
  onNext?: () => void
}

export function ChapterBuilder({ onBack, onNext }: ChapterBuilderProps) {
  const { 
    locations, 
    chapters,
    activeLocationIndex, 
    setActiveLocationIndex, 
    updateLocation, 
    removeLocation,
    addChapter,
    updateChapter,
    removeChapter,
    nextStep,
    selectedTemplate,
    getTemplateIconSets,
    getTerminology,
    getPromptForStep,
    getPromptDescriptionForStep
  } = useMapCreationStore()
  
  // Get template-specific icons and emojis from the new icon registry
  const templateIconSets = getTemplateIconSets()
  
  // Use SVG icons from registry, organized by category
  const availableIcons = iconRegistry.map(iconDef => ({
    name: iconDef.name,
    icon: fallbackIcons.find(f => f.name === iconDef.name)?.icon || Heart, // For UI display
    category: iconDef.category
  }))
  
  // Keep emoji support for backward compatibility  
  const availableEmojis = templateIconSets.length > 0 ?
    templateIconSets.flatMap(set => set.icons.map(icon => icon.symbol)).filter(symbol => symbol && symbol.length <= 2) :
    fallbackEmojis

  // Helper function to ensure a chapter exists for a location
  const ensureChapterExists = (location: Location) => {
    const existingChapter = chapters.find(ch => ch.locationId === location.id)
    if (!existingChapter) {
      addChapter({
        locationId: location.id,
        title: location.name,
        description: location.description || location.narrative,
        icon: location.icon || 'Heart',
        emoji: location.emoji,
        customImage: location.customImage || undefined
      })
    }
  }

  // Automatically create chapters for locations that don't have them
  useEffect(() => {
    locations.forEach(location => {
      const existingChapter = chapters.find(ch => ch.locationId === location.id)
      if (!existingChapter) {
        addChapter({
          locationId: location.id,
          title: location.name,
          description: location.description || location.narrative,
          icon: location.icon || 'Heart',
          emoji: location.emoji,
          customImage: location.customImage || undefined
        })
      }
    })
  }, [locations, chapters]) // Removed addChapter from dependencies since Zustand functions are stable

  const updateLocationIcon = (index: number, iconName: string) => {
    const location = locations[index]
    if (location) {
      updateLocation(location.id, {
        iconType: "icon",
        icon: iconName,
      })
      
      // Ensure chapter exists and update it
      ensureChapterExists(location)
      const chapter = chapters.find(ch => ch.locationId === location.id)
      if (chapter) {
        updateChapter(chapter.id, { icon: iconName })
      }
    }
  }

  const updateLocationEmoji = (index: number, emoji: string) => {
    const location = locations[index]
    if (location) {
      updateLocation(location.id, {
        iconType: "emoji",
        emoji,
      })
      
      // Ensure chapter exists and update it
      ensureChapterExists(location)
      const chapter = chapters.find(ch => ch.locationId === location.id)
      if (chapter) {
        updateChapter(chapter.id, { emoji })
      }
    }
  }

  const updateLocationCaption = (index: number, caption: string) => {
    const location = locations[index]
    if (location) {
      updateLocation(location.id, { caption })
      
      // Ensure chapter exists and update it
      ensureChapterExists(location)
      const chapter = chapters.find(ch => ch.locationId === location.id)
      if (chapter) {
        updateChapter(chapter.id, { 
          title: caption || location.name,
          description: location.description || location.narrative 
        })
      }
    }
  }

  const handleImageUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      const location = locations[index]
      if (location) {
        const customImageData = reader.result as string
        updateLocation(location.id, {
          iconType: "image",
          customImage: customImageData,
        })
        
        // Ensure chapter exists and update it
        ensureChapterExists(location)
        const chapter = chapters.find(ch => ch.locationId === location.id)
        if (chapter) {
          updateChapter(chapter.id, { customImage: customImageData })
        }
      }
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveLocation = (index: number) => {
    const location = locations[index]
    if (location) {
      // Remove corresponding chapter if it exists
      const chapter = chapters.find(ch => ch.locationId === location.id)
      if (chapter) {
        removeChapter(chapter.id)
      }
      
      removeLocation(location.id)
      if (activeLocationIndex >= locations.length - 1) {
        setActiveLocationIndex(Math.max(0, locations.length - 2))
      }
    }
  }

  const proceedToNextStep = () => {
    if (onNext) {
      onNext()
    } else {
      nextStep()
    }
  }

  const activeLocation = locations[activeLocationIndex]

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
            <h1 className="text-3xl font-light">{getPromptForStep(2) || "Build Your Chapters"}</h1>
            <p className="text-muted-foreground">{getPromptDescriptionForStep(2) || `Customize each ${getTerminology('location')} to tell your unique story`}</p>
          </div>
          <div className="w-[130px]"></div> {/* Spacer to balance the back button */}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Location List Sidebar */}
          <div className="lg:col-span-1 bg-card p-4 rounded-lg border border-border">
            <h2 className="text-xl font-light mb-4">Your {getTerminology('location')}s</h2>
            <ul className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
              {locations.map((location, index) => (
                <li
                  key={location.id}
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
                        handleRemoveLocation(index)
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
                      onClick={() => setActiveLocationIndex(Math.max(0, activeLocationIndex - 1))}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      disabled={activeLocationIndex === locations.length - 1}
                      onClick={() => setActiveLocationIndex(Math.min(locations.length - 1, activeLocationIndex + 1))}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <Tabs defaultValue="icon" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="icon">Icons</TabsTrigger>
                    <TabsTrigger value="emoji">Emojis</TabsTrigger>
                    <TabsTrigger value="image">Custom Image</TabsTrigger>
                  </TabsList>

                  <TabsContent value="icon" className="space-y-4">
                    <div className="space-y-2">
                      <Label>Choose an icon</Label>
                      
                      {/* Travel Icons */}
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium text-muted-foreground">Travel & Navigation</h4>
                        <div className="grid grid-cols-6 gap-2">
                          {getIconsByCategory('travel').map((iconItem) => {
                            const IconComponent = iconItem.name === 'Home' ? Home :
                                               iconItem.name === 'MapPin' ? Map :
                                               iconItem.name === 'Compass' ? Compass :
                                               iconItem.name === 'Anchor' ? Anchor :
                                               iconItem.name === 'Car' ? Car : Heart
                            return (
                              <Button
                                key={iconItem.name}
                                variant={activeLocation.icon === iconItem.name ? "default" : "outline"}
                                size="icon"
                                className="h-12 w-12"
                                onClick={() => updateLocationIcon(activeLocationIndex, iconItem.name)}
                              >
                                <IconComponent className="h-6 w-6" />
                              </Button>
                            )
                          })}
                        </div>
                      </div>

                      {/* Activity Icons */}
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium text-muted-foreground">Activities</h4>
                        <div className="grid grid-cols-6 gap-2">
                          {getIconsByCategory('activities').map((iconItem) => {
                            const IconComponent = iconItem.name === 'Camera' ? Camera :
                                               iconItem.name === 'Coffee' ? Coffee :
                                               iconItem.name === 'Music' ? Music :
                                               iconItem.name === 'Heart' ? Heart :
                                               iconItem.name === 'Star' ? Star : Heart
                            return (
                              <Button
                                key={iconItem.name}
                                variant={activeLocation.icon === iconItem.name ? "default" : "outline"}
                                size="icon"
                                className="h-12 w-12"
                                onClick={() => updateLocationIcon(activeLocationIndex, iconItem.name)}
                              >
                                <IconComponent className="h-6 w-6" />
                              </Button>
                            )
                          })}
                        </div>
                      </div>

                      {/* Emotion Icons */}
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium text-muted-foreground">Emotions & Markers</h4>
                        <div className="grid grid-cols-6 gap-2">
                          {getIconsByCategory('emotions').map((iconItem) => {
                            const IconComponent = iconItem.name === 'Smile' ? Smile :
                                               iconItem.name === 'Flag' ? Flag : Heart
                            return (
                              <Button
                                key={iconItem.name}
                                variant={activeLocation.icon === iconItem.name ? "default" : "outline"}
                                size="icon"
                                className="h-12 w-12"
                                onClick={() => updateLocationIcon(activeLocationIndex, iconItem.name)}
                              >
                                <IconComponent className="h-6 w-6" />
                              </Button>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="emoji" className="space-y-4">
                    <div className="space-y-2">
                      <Label>Choose an emoji</Label>
                      <div className="grid grid-cols-8 gap-2">
                        {availableEmojis.map((emoji) => (
                          <Button
                            key={emoji}
                            variant={activeLocation.emoji === emoji ? "default" : "outline"}
                            size="icon"
                            className="h-12 w-12 text-xl"
                            onClick={() => updateLocationEmoji(activeLocationIndex, emoji)}
                          >
                            {emoji}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="image" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="image-upload">Upload custom image</Label>
                      <div className="flex items-center gap-4">
                        <input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(activeLocationIndex, e)}
                          className="hidden"
                        />
                        <Button
                          variant="outline"
                          onClick={() => document.getElementById("image-upload")?.click()}
                          className="flex items-center gap-2"
                        >
                          <Upload className="h-4 w-4" />
                          Upload Image
                        </Button>
                        {activeLocation.customImage && (
                          <div className="w-12 h-12 rounded-full overflow-hidden">
                            <img
                              src={activeLocation.customImage}
                              alt="Custom"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="mt-6 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="caption">Caption</Label>
                    <Input
                      id="caption"
                      value={activeLocation.caption || ""}
                      onChange={(e) => updateLocationCaption(activeLocationIndex, e.target.value)}
                      placeholder="A short description of this location"
                    />
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="bg-card p-6 rounded-lg border border-border text-center">
                <p className="text-muted-foreground">No {getTerminology('location')}s to edit. Add some {getTerminology('location')}s first.</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-center">
          <Button onClick={proceedToNextStep} size="lg" className="px-8">
Continue to Customize
          </Button>
        </div>
      </div>
    </motion.div>
  )
} 