"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MapPin, Search, ArrowLeft, Loader2, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"
import ChapterBuilder from "@/components/chapter-builder"
import type { Location } from "@/lib/types"
import { geocodeLocation, type GeocodeResult } from "@/lib/mapbox"

const narrativePrompts = [
  "Where you first met",
  "The place that changed everything",
  "Where you felt most alive",
  "A place you call home",
  "Where you made a difficult decision",
  "The spot where you realized something important",
]

interface LocationInputProps {
  onBack?: () => void
}

export default function LocationInput({ onBack }: LocationInputProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [showResults, setShowResults] = useState(false)
  const [narrative, setNarrative] = useState("")
  const [locations, setLocations] = useState<Location[]>([])
  const [currentPrompt, setCurrentPrompt] = useState(narrativePrompts[0])
  const [proceedToChapters, setProceedToChapters] = useState(false)
  const [searchResults, setSearchResults] = useState<GeocodeResult[]>([])
  const [isSearching, setIsSearching] = useState(false)

  // Search for locations using Mapbox geocoding
  useEffect(() => {
    const searchLocations = async () => {
      // Don't search if we have a selected location (user just picked one)
      if (selectedLocation) {
        setSearchResults([])
        setShowResults(false)
        return
      }

      if (searchTerm.length < 2) {
        setSearchResults([])
        setShowResults(false)
        return
      }

      setIsSearching(true)
      try {
        const results = await geocodeLocation(searchTerm)
        setSearchResults(results)
        setShowResults(results.length > 0)
      } catch (error) {
        console.error('Search error:', error)
        setSearchResults([])
        setShowResults(false)
      } finally {
        setIsSearching(false)
      }
    }

    const timeoutId = setTimeout(searchLocations, 300) // Debounce search
    return () => clearTimeout(timeoutId)
  }, [searchTerm, selectedLocation])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    // Clear selected location when user starts typing again
    if (selectedLocation) {
      setSelectedLocation(null)
    }
  }

  const selectLocation = (result: GeocodeResult) => {
    const location: Location = {
      id: result.id,
      name: result.full_name,
      lat: result.lat,
      lng: result.lng,
    }
    setSelectedLocation(location)
    setSearchTerm(result.full_name)
    setShowResults(false)
  }

  const addLocation = () => {
    if (selectedLocation && narrative) {
      const newLocation = {
        ...selectedLocation,
        narrative,
        prompt: currentPrompt,
      }

      setLocations([...locations, newLocation])
      setSelectedLocation(null)
      setSearchTerm("")
      setNarrative("")

      // Cycle to next prompt
      const currentIndex = narrativePrompts.indexOf(currentPrompt)
      const nextIndex = (currentIndex + 1) % narrativePrompts.length
      setCurrentPrompt(narrativePrompts[nextIndex])
    }
  }

  const proceedToNextStep = () => {
    setProceedToChapters(true)
  }

  if (proceedToChapters) {
    return <ChapterBuilder initialLocations={locations} onBack={() => setProceedToChapters(false)} />
  }

  return (
    <motion.div
      className="container max-w-2xl mx-auto py-12 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="space-y-8">
        <div className="flex items-center justify-between mb-4">
          {onBack && (
            <Button variant="outline" onClick={onBack} className="flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Welcome
            </Button>
          )}
          <div className="text-center flex-1">
            <h1 className="text-3xl font-light">Begin Your Story</h1>
            <p className="text-muted-foreground">Add the places that matter to your journey</p>
          </div>
          <div className="w-[120px]"></div> {/* Spacer to balance the back button */}
        </div>

        <div className="space-y-6 bg-card p-6 rounded-lg border border-border">
          <div className="space-y-2">
            <Label htmlFor="location-prompt" className="text-lg font-normal">
              {currentPrompt}
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                {isSearching ? (
                  <Loader2 className="h-4 w-4 text-muted-foreground animate-spin" />
                ) : (
                  <Search className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
              <Input
                id="location-prompt"
                type="text"
                placeholder="Search for a place..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-10"
              />

              {showResults && searchResults.length > 0 && (
                <motion.div
                  className="absolute z-10 mt-1 w-full bg-card border border-border rounded-md shadow-md max-h-60 overflow-y-auto"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ul className="py-1">
                    {searchResults.map((result) => (
                      <li
                        key={result.id}
                        className="px-4 py-2 hover:bg-accent cursor-pointer flex items-center gap-2"
                        onClick={() => selectLocation(result)}
                      >
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <div className="flex flex-col">
                          <span className="font-medium">{result.name}</span>
                          <span className="text-sm text-muted-foreground">{result.full_name}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="narrative" className="text-lg font-normal">
              What makes this place special?
            </Label>
            <textarea
              id="narrative"
              placeholder="Share your story about this place..."
              value={narrative}
              onChange={(e) => setNarrative(e.target.value)}
              className="w-full min-h-[100px] p-3 rounded-md border border-input bg-background"
            />
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={addLocation} disabled={!selectedLocation || !narrative}>
              Add This Place
            </Button>

            <Button onClick={proceedToNextStep} disabled={locations.length === 0} className="flex items-center">
              Continue to Chapters
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>

        {locations.length > 0 && (
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl font-light">Your Places</h2>
            <ul className="space-y-2">
              {locations.map((location, index) => (
                <li key={index} className="p-4 bg-card rounded-lg border border-border">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-muted-foreground">{location.prompt}</p>
                      <h3 className="font-medium">{location.name}</h3>
                      <p className="text-sm mt-1">{location.narrative}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
