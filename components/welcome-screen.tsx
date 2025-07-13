"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import MapAnimation from "@/components/map-animation"
import LocationInput from "@/components/location-input"

export default function WelcomeScreen() {
  const [started, setStarted] = useState(false)

  if (started) {
    return <LocationInput onBack={() => setStarted(false)} />
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="mb-8 w-full max-w-md"
      >
        <MapAnimation />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="space-y-6 max-w-xl"
      >
        <h1 className="text-4xl font-light tracking-tight">Map Your Journey</h1>
        <p className="text-lg text-muted-foreground">
          Every place holds a memory. Every memory tells a story. Create a beautiful map of the moments that shaped your
          journey.
        </p>

        <Button
          size="lg"
          onClick={() => setStarted(true)}
          className="mt-6 text-lg px-8 py-6 rounded-full transition-all duration-300 hover:scale-105"
        >
          Begin Your Story
        </Button>
      </motion.div>
    </div>
  )
}
