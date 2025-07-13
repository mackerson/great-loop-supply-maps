"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MapPin, Search, Loader2, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { useMapCreationStore } from "@/stores/map-creation"
import { geocodeLocation, type GeocodeResult } from "@/lib/mapbox"

const narrativePrompts = [
  "Your home port",
  "Where you started your Great Loop",
  "Your favorite anchorage",
  "The port that surprised you most",
  "Where you met fellow Loopers",
  "The place you'll never forget",
]

export default function LocationInput() {
  const router = useRouter()
  const { locations, addLocation, canProceedToStep } = useMapCreationStore()
  
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLocation, setSelectedLocation] = useState<GeocodeResult | null>(null)
  const [showResults, setShowResults] = useState(false)
  const [narrative, setNarrative] = useState("")
  const [currentPrompt, setCurrentPrompt] = useState(narrativePrompts[0])
  const [searchResults, setSearchResults] = useState<GeocodeResult[]>([])
  const [isSearching, setIsSearching] = useState(false)

  // Search for locations using Mapbox geocoding
  useEffect(() => {
    const searchLocations = async () => {
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

    const timeoutId = setTimeout(searchLocations, 300)
    return () => clearTimeout(timeoutId)
  }, [searchTerm, selectedLocation])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    if (selectedLocation) {
      setSelectedLocation(null)
    }
  }

  const selectLocation = (result: GeocodeResult) => {
    setSelectedLocation(result)
    setSearchTerm(result.full_name)
    setShowResults(false)
  }

  const handleAddLocation = () => {
    if (selectedLocation && narrative) {
      addLocation({
        name: selectedLocation.full_name,
        address: selectedLocation.full_name,
        coordinates: [selectedLocation.lng, selectedLocation.lat],
        description: narrative,
      })

      // Reset form
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
    router.push('/create/chapters')
  }

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
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
            What makes this port special?
          </Label>
          <textarea
            id="narrative"
            placeholder="Share your Great Loop story about this port..."
            value={narrative}
            onChange={(e) => setNarrative(e.target.value)}
            className="min-h-[100px] w-full p-3 border border-border rounded-md bg-background resize-none"
          />
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleAddLocation}
            disabled={!selectedLocation || !narrative}
            className="flex items-center gap-2"
          >
            Add Port
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Added Locations */}
      {locations.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Your Great Loop Journey So Far</h3>
          <div className="space-y-3">
            {locations.map((location) => (
              <div
                key={location.id}
                className="p-4 bg-card border border-border rounded-lg"
              >
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{location.name}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{location.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Proceed Button */}
      {canProceedToStep(2) && (
        <div className="flex justify-center">
          <Button
            onClick={proceedToNextStep}
            size="lg"
            className="px-8"
          >
            Continue to Chapters
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}
    </motion.div>
  )
} 