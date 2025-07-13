"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

export default function MapAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Draw soft map animation
    const drawMap = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw a minimalist map with soft lines
      ctx.strokeStyle = "#d1d5db"
      ctx.lineWidth = 0.5

      // Draw some map-like elements
      // Horizontal lines (latitude)
      for (let i = 0; i < canvas.height; i += 20) {
        ctx.beginPath()
        ctx.moveTo(0, i)
        ctx.bezierCurveTo(
          canvas.width * 0.2,
          i + Math.sin(i * 0.1) * 5,
          canvas.width * 0.8,
          i + Math.cos(i * 0.05) * 5,
          canvas.width,
          i + Math.sin(i * 0.02) * 3,
        )
        ctx.stroke()
      }

      // Vertical lines (longitude)
      for (let i = 0; i < canvas.width; i += 30) {
        ctx.beginPath()
        ctx.moveTo(i, 0)
        ctx.bezierCurveTo(
          i + Math.sin(i * 0.05) * 5,
          canvas.height * 0.3,
          i + Math.cos(i * 0.03) * 5,
          canvas.height * 0.7,
          i + Math.sin(i * 0.02) * 3,
          canvas.height,
        )
        ctx.stroke()
      }

      // Draw a few points representing locations
      const points = [
        { x: canvas.width * 0.2, y: canvas.height * 0.3 },
        { x: canvas.width * 0.5, y: canvas.height * 0.5 },
        { x: canvas.width * 0.8, y: canvas.height * 0.7 },
      ]

      points.forEach((point) => {
        ctx.beginPath()
        ctx.arc(point.x, point.y, 3, 0, Math.PI * 2)
        ctx.fillStyle = "#94a3b8"
        ctx.fill()

        // Draw a soft glow
        const gradient = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, 20)
        gradient.addColorStop(0, "rgba(148, 163, 184, 0.3)")
        gradient.addColorStop(1, "rgba(148, 163, 184, 0)")

        ctx.beginPath()
        ctx.arc(point.x, point.y, 20, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()
      })
    }

    drawMap()

    // Redraw on resize
    const handleResize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      drawMap()
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <motion.div
      className="w-full aspect-video max-w-md mx-auto rounded-lg overflow-hidden border border-border"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
    >
      <canvas ref={canvasRef} className="w-full h-full" />
    </motion.div>
  )
}
