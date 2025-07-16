"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import Link from "next/link"
import MapAnimation from "@/components/map-animation"

export default function Hero() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-4 text-center">
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
        <h1 className="text-4xl font-light tracking-tight">
          Chart Your Adventure
        </h1>
        <p className="text-lg text-muted-foreground">
          Create beautiful maps of your journey. Whether it&apos;s the Great Loop, Appalachian Trail, or any adventure - document the places, memories, and moments that shaped your story.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="text-lg px-8 py-6 rounded-full transition-all duration-300 hover:scale-105">
            <Link href="/create">Create Your Map</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 rounded-full">
            <Link href="/examples">See Examples</Link>
          </Button>
        </div>
      </motion.div>
    </div>
  )
} 