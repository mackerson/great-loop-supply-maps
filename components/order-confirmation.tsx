"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Check, Download, Home, Share2 } from "lucide-react"
import Link from "next/link"

interface OrderConfirmationProps {
  orderId: string
  material:
    | {
        id: string
        name: string
        description: string
        price: number
        image: string
      }
    | undefined
  size: string
  orientation: string
  theme: string
}

export default function OrderConfirmation({ orderId, material, size, orientation, theme }: OrderConfirmationProps) {
  return (
    <motion.div
      className="container max-w-2xl mx-auto py-12 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center space-y-6 mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
          <Check className="h-8 w-8" />
        </div>
        <h1 className="text-3xl font-light">Order Confirmed!</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Thank you for your order. We've received your payment and will begin crafting your custom map.
        </p>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden mb-8">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-medium mb-2">Order Details</h2>
          <p className="text-sm text-muted-foreground">Order #{orderId}</p>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded overflow-hidden border border-border">
              <img
                src={material?.image || "/placeholder.svg?height=64&width=64"}
                alt={material?.name || "Map"}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-medium">Custom Engraved Map</h3>
              <p className="text-sm text-muted-foreground">
                {material?.name} • {size} • {orientation}
              </p>
            </div>
            <div className="text-right">
              <p className="font-medium">${material?.price.toFixed(2)}</p>
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>${material?.price.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="flex justify-between font-medium mt-4">
              <span>Total</span>
              <span>${material?.price.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden mb-8">
        <div className="p-6">
          <h2 className="text-xl font-medium mb-4">What's Next?</h2>

          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary mt-0.5">
                <span className="text-xs font-medium">1</span>
              </div>
              <div>
                <h3 className="font-medium">Production Begins</h3>
                <p className="text-sm text-muted-foreground">
                  Our artisans will begin crafting your custom map within 1-2 business days.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary mt-0.5">
                <span className="text-xs font-medium">2</span>
              </div>
              <div>
                <h3 className="font-medium">Order Updates</h3>
                <p className="text-sm text-muted-foreground">
                  You'll receive email updates as your map progresses through production.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary mt-0.5">
                <span className="text-xs font-medium">3</span>
              </div>
              <div>
                <h3 className="font-medium">Shipping</h3>
                <p className="text-sm text-muted-foreground">
                  Your map will be carefully packaged and shipped within 2-3 weeks.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center space-y-6">
        <p className="text-muted-foreground">A confirmation email has been sent to your email address.</p>

        <div className="flex flex-wrap justify-center gap-4">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download Digital Copy
          </Button>
          <Button variant="outline">
            <Share2 className="h-4 w-4 mr-2" />
            Share Your Map
          </Button>
          <Link href="/" passHref>
            <Button>
              <Home className="h-4 w-4 mr-2" />
              Return Home
            </Button>
          </Link>
        </div>

        <p className="text-sm text-muted-foreground pt-4">
          Questions about your order? Contact us at{" "}
          <a href="mailto:support@mapstoryteller.com" className="underline">
            support@mapstoryteller.com
          </a>
        </p>
      </div>
    </motion.div>
  )
}
