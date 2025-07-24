"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  getLocalOrders, 
  updateOrderStatus, 
  generateManufacturingExport 
} from '@/lib/order-processing'
import { OrderData, OrderStatus } from '@/lib/types'
import { Download, Eye, Package, Truck, CheckCircle } from 'lucide-react'

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderData[]>([])
  const [loading, setLoading] = useState(true)
  const [downloadingFiles, setDownloadingFiles] = useState<{ [orderId: string]: boolean }>({})

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = () => {
    try {
      const localOrders = getLocalOrders()
      setOrders(localOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
    } catch (error) {
      console.error('Failed to load orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus, `Status updated to ${newStatus}`, 'admin')
    loadOrders() // Refresh the orders list
  }

  const downloadManufacturingFiles = async (order: OrderData) => {
    try {
      setDownloadingFiles(prev => ({ ...prev, [order.id]: true }))
      
      console.log(`Starting manufacturing export for order ${order.orderNumber}...`)
      
      // Generate manufacturing files with real Mapbox data (async)
      const manufacturingExport = await generateManufacturingExport(order)
      
      // Create download for each file type
      const files = [
        { name: `cut-${order.orderNumber}.svg`, content: manufacturingExport.formats.svg.cutLayer, type: 'image/svg+xml' },
        { name: `engrave-${order.orderNumber}.svg`, content: manufacturingExport.formats.svg.engraveLayer, type: 'image/svg+xml' },
        { name: `combined-${order.orderNumber}.svg`, content: manufacturingExport.formats.svg.combined, type: 'image/svg+xml' },
        { name: `cut-${order.orderNumber}.dxf`, content: manufacturingExport.formats.dxf.cutFile, type: 'application/dxf' },
        { name: `engrave-${order.orderNumber}.dxf`, content: manufacturingExport.formats.dxf.engraveFile, type: 'application/dxf' },
        { name: `material-spec-${order.orderNumber}.txt`, content: manufacturingExport.formats.specs.materialSheet, type: 'text/plain' },
        { name: `production-instructions-${order.orderNumber}.txt`, content: manufacturingExport.formats.specs.productionInstructions, type: 'text/plain' }
      ]
      
      // Download each file
      files.forEach(file => {
        const blob = new Blob([file.content], { type: file.type })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = file.name
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
      })
      
      console.log(`Successfully downloaded ${files.length} manufacturing files for order ${order.orderNumber}`)
      
    } catch (error) {
      console.error('Manufacturing export failed:', error)
      
      // Show user-friendly error message
      let errorMessage = 'Failed to generate manufacturing files.'
      
      if (error instanceof Error) {
        if (error.message.includes('Mapbox access token')) {
          errorMessage = 'Manufacturing exports require Mapbox access token. Please configure your environment variables.'
        } else if (error.message.includes('No geographic features found')) {
          errorMessage = 'Unable to fetch geographic data for this map area. The region may not be supported or there may be a network issue.'
        } else if (error.message.includes('Unable to fetch real geographic data')) {
          errorMessage = 'Failed to fetch map data from Mapbox. Please check your internet connection and try again.'
        } else {
          errorMessage = `Manufacturing export error: ${error.message}`
        }
      }
      
      alert(errorMessage)
    } finally {
      setDownloadingFiles(prev => ({ ...prev, [order.id]: false }))
    }
  }

  const getStatusBadgeColor = (status: OrderStatus) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      design_review: 'bg-blue-100 text-blue-800',
      approved: 'bg-green-100 text-green-800',
      in_production: 'bg-purple-100 text-purple-800',
      quality_check: 'bg-orange-100 text-orange-800',
      packaging: 'bg-pink-100 text-pink-800',
      shipped: 'bg-blue-100 text-blue-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'in_production': return <Package className="w-4 h-4" />
      case 'shipped': return <Truck className="w-4 h-4" />
      case 'delivered': return <CheckCircle className="w-4 h-4" />
      default: return null
    }
  }

  const filterOrdersByStatus = (status: string) => {
    if (status === 'all') return orders
    return orders.filter(order => order.status === status)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p>Loading orders...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Order Management</h1>
        <p className="text-muted-foreground">Manage orders and download manufacturing data for CNC/laser production</p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all">All ({orders.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({filterOrdersByStatus('pending').length})</TabsTrigger>
          <TabsTrigger value="approved">Ready ({filterOrdersByStatus('approved').length})</TabsTrigger>
          <TabsTrigger value="in_production">Production ({filterOrdersByStatus('in_production').length})</TabsTrigger>
          <TabsTrigger value="shipped">Shipped ({filterOrdersByStatus('shipped').length})</TabsTrigger>
          <TabsTrigger value="delivered">Delivered ({filterOrdersByStatus('delivered').length})</TabsTrigger>
        </TabsList>

        {['all', 'pending', 'approved', 'in_production', 'shipped', 'delivered'].map(statusFilter => (
          <TabsContent key={statusFilter} value={statusFilter} className="mt-6">
            <div className="grid gap-4">
              {filterOrdersByStatus(statusFilter).map(order => (
                <Card key={order.id} className="w-full">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          #{order.orderNumber}
                          {getStatusIcon(order.status)}
                        </CardTitle>
                        <CardDescription>
                          {order.customer.name} • {new Date(order.createdAt).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <Badge className={getStatusBadgeColor(order.status)}>
                        {order.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground">Template</h4>
                        <p className="font-medium">{order.mapData.template.name}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground">Material</h4>
                        <p className="font-medium">{order.productionData.material.name}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground">Dimensions</h4>
                        <p className="font-medium">
                          {order.productionData.dimensions.widthInches}" × {order.productionData.dimensions.heightInches}"
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground">Locations</h4>
                        <p className="font-medium">{order.mapData.locations.length} locations</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadManufacturingFiles(order)}
                        disabled={downloadingFiles[order.id]}
                      >
                        {downloadingFiles[order.id] ? 'Generating...' : 'Download Production Files'}
                        <Download className="w-4 h-4 ml-2" />
                      </Button>

                      {order.status === 'pending' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusUpdate(order.id, 'approved')}
                        >
                          Approve for Production
                        </Button>
                      )}

                      {order.status === 'approved' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusUpdate(order.id, 'in_production')}
                        >
                          Start Production
                        </Button>
                      )}

                      {order.status === 'in_production' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusUpdate(order.id, 'quality_check')}
                        >
                          Quality Check
                        </Button>
                      )}

                      {order.status === 'quality_check' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusUpdate(order.id, 'packaging')}
                        >
                          Package
                        </Button>
                      )}

                      {order.status === 'packaging' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusUpdate(order.id, 'shipped')}
                        >
                          Mark as Shipped
                        </Button>
                      )}

                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </div>

                    {/* Latest status update */}
                    {order.statusHistory.length > 0 && (
                      <div className="mt-4 p-3 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          <strong>Latest Update:</strong> {order.statusHistory[order.statusHistory.length - 1].notes}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(order.statusHistory[order.statusHistory.length - 1].timestamp).toLocaleString()}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}

              {filterOrdersByStatus(statusFilter).length === 0 && (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-muted-foreground">No orders found for this status.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
} 