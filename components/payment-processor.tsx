"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, CreditCard, Loader2, Lock } from "lucide-react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import OrderConfirmation from "@/components/order-confirmation"
import { useMapCreationStore } from '@/stores/map-creation'
import { createOrderFromMapState, saveOrderLocally } from '@/lib/order-processing'
import { CustomerInfo, OrderData } from '@/lib/types'

interface PaymentProcessorProps {
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
  onBack: () => void
}

export default function PaymentProcessor({ material, size, orientation, theme, onBack }: PaymentProcessorProps) {
  const mapCreationState = useMapCreationStore()
  const [cardNumber, setCardNumber] = useState("")
  const [cardName, setCardName] = useState("")
  const [expiryMonth, setExpiryMonth] = useState("")
  const [expiryYear, setExpiryYear] = useState("")
  const [cvv, setCvv] = useState("")
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [zipCode, setZipCode] = useState("")
  const [country, setCountry] = useState("US")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [orderComplete, setOrderComplete] = useState(false)
  const [orderData, setOrderData] = useState<OrderData | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Basic validation
    if (!cardNumber || !cardName || !expiryMonth || !expiryYear || !cvv || !address || !city || !state || !zipCode) {
      setError("Please fill in all required fields")
      setIsLoading(false)
      return
    }

    // Create customer info from form data
    const customerInfo: CustomerInfo = {
      name: cardName,
      email: `${cardName.toLowerCase().replace(/\s+/g, '.')}@example.com`, // Placeholder - would come from auth
      isGuest: true,
      shippingAddress: {
        line1: address,
        city,
        state,
        postalCode: zipCode,
        country
      }
    }

    // Simulate payment processing then create real order
    setTimeout(() => {
      try {
        // Create complete order with manufacturing data
        const order = createOrderFromMapState(customerInfo, mapCreationState)
        
        // Save order locally (will be replaced with Supabase)
        saveOrderLocally(order)
        
        // Set order data for confirmation
        setOrderData(order)
        setOrderComplete(true)
        setIsLoading(false)
        
        console.log('Order created successfully:', order.orderNumber)
        console.log('Manufacturing data:', order.productionData)
      } catch (error) {
        console.error('Failed to create order:', error)
        setError('Failed to process order. Please try again.')
        setIsLoading(false)
      }
    }, 2500)
  }

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []

    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(" ")
    } else {
      return value
    }
  }

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setCardNumber(formatCardNumber(value))
  }

  if (orderComplete && orderData) {
    return (
      <OrderConfirmation orderId={orderData.orderNumber} material={material} size={size} orientation={orientation} theme={theme} />
    )
  }

  return (
    <motion.div
      className="container max-w-2xl mx-auto py-12 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-8">
        <Button variant="ghost" onClick={onBack} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Order
        </Button>

        <div className="text-center space-y-2">
          <h1 className="text-3xl font-light">Complete Your Purchase</h1>
          <p className="text-muted-foreground">Secure payment for your custom engraved map</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
              <CardDescription>Enter your payment details securely</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Card Details</h3>

                  <div className="space-y-2">
                    <Label htmlFor="card-number">Card Number</Label>
                    <div className="relative">
                      <Input
                        id="card-number"
                        placeholder="1234 5678 9012 3456"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        maxLength={19}
                        className="pl-10"
                        disabled={isLoading}
                      />
                      <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="card-name">Cardholder Name</Label>
                    <Input
                      id="card-name"
                      placeholder="John Smith"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry-month">Month</Label>
                      <Select value={expiryMonth} onValueChange={setExpiryMonth} disabled={isLoading}>
                        <SelectTrigger id="expiry-month">
                          <SelectValue placeholder="MM" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 12 }, (_, i) => {
                            const month = (i + 1).toString().padStart(2, "0")
                            return (
                              <SelectItem key={month} value={month}>
                                {month}
                              </SelectItem>
                            )
                          })}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="expiry-year">Year</Label>
                      <Select value={expiryYear} onValueChange={setExpiryYear} disabled={isLoading}>
                        <SelectTrigger id="expiry-year">
                          <SelectValue placeholder="YY" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 10 }, (_, i) => {
                            const year = (new Date().getFullYear() + i).toString().slice(-2)
                            return (
                              <SelectItem key={year} value={year}>
                                {year}
                              </SelectItem>
                            )
                          })}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        maxLength={4}
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Shipping Address</h3>

                  <div className="space-y-2">
                    <Label htmlFor="address">Street Address</Label>
                    <Input
                      id="address"
                      placeholder="123 Main St"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        placeholder="New York"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="state">State/Province</Label>
                      <Input
                        id="state"
                        placeholder="NY"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="zip">ZIP/Postal Code</Label>
                      <Input
                        id="zip"
                        placeholder="10001"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Select value={country} onValueChange={setCountry} disabled={isLoading}>
                        <SelectTrigger id="country">
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="US">United States</SelectItem>
                          <SelectItem value="CA">Canada</SelectItem>
                          <SelectItem value="UK">United Kingdom</SelectItem>
                          <SelectItem value="AU">Australia</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {error && <p className="text-sm text-red-500">{error}</p>}

                <div className="pt-2">
                  <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                    {isLoading ? (
                      <span className="flex items-center">
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Lock className="h-4 w-4 mr-2" />
                        Complete Order
                      </span>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <div className="w-full flex items-center justify-center space-x-4 text-sm text-muted-foreground">
                <Lock className="h-4 w-4" />
                <span>Secure payment processing</span>
              </div>
            </CardFooter>
          </Card>
        </div>

        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {material && (
                <>
                  <div className="flex justify-between text-sm">
                    <span>Custom Map ({material.name})</span>
                    <span>${material.price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Size: {size}</span>
                    <span></span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Orientation: {orientation}</span>
                    <span></span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Theme: {theme}</span>
                    <span></span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="pt-4 border-t border-border flex justify-between font-medium">
                    <span>Total</span>
                    <span>${material.price.toFixed(2)}</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <div className="mt-4 p-4 bg-muted rounded-lg">
            <p className="text-sm">
              Your map will be carefully engraved and shipped within 2-3 weeks. Each piece is handcrafted to ensure the
              highest quality.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
