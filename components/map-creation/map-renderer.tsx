"use client"

import { useRef, useEffect, useState, forwardRef, useImperativeHandle } from "react"
import mapboxgl from 'mapbox-gl'
import { MAPBOX_ACCESS_TOKEN, getBounds } from '@/lib/mapbox'
import { useMapCreationStore } from '@/stores/map-creation'
import { generateThemeIcons, getIconByName, emojiToIconMap } from '@/lib/icon-registry'

// Import Mapbox CSS
import 'mapbox-gl/dist/mapbox-gl.css'

interface MapRendererProps {
  className?: string
  style?: React.CSSProperties
  onMapLoad?: (map: mapboxgl.Map) => void
  showControls?: boolean
}

export interface MapRendererRef {
  getMap: () => mapboxgl.Map | null
  exportImage: (width?: number, height?: number) => Promise<string>
  resize: () => void
}

export const MapRenderer = forwardRef<MapRendererRef, MapRendererProps>(({ 
  className = "", 
  style = {}, 
  onMapLoad,
  showControls = false
}, ref) => {
  const { 
    locations, 
    style: mapStyle, 
    activeLocationIndex, 
    setActiveLocationIndex,
    selectedTemplate
  } = useMapCreationStore()
  
  const [map, setMap] = useState<mapboxgl.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)

  // Expose map instance and export function through ref
  useImperativeHandle(ref, () => ({
    getMap: () => map,
    exportImage: async (targetWidth?: number, targetHeight?: number) => {
      if (!map) throw new Error('Map not initialized')
      
      return new Promise((resolve, reject) => {
        try {
          const container = mapContainerRef.current
          if (!container) {
            reject(new Error('Map container not found'))
            return
          }

          // Store original dimensions and view state
          const originalWidth = container.style.width
          const originalHeight = container.style.height
          const originalCenter = map.getCenter()
          const originalZoom = map.getZoom()
          
          // Set target dimensions if provided
          if (targetWidth && targetHeight) {
            console.log(`Exporting at ${targetWidth}x${targetHeight}`)
            container.style.width = `${targetWidth}px`
            container.style.height = `${targetHeight}px`
            map.resize()
            
            // Re-fit bounds for the new aspect ratio
            if (selectedTemplate?.config.routeData?.bounds && locations.length > 0) {
              // Use template bounds for templates with route data (like Great Loop)
              const templateBounds = selectedTemplate.config.routeData.bounds
              const bounds = new mapboxgl.LngLatBounds(
                [templateBounds.west, templateBounds.south],
                [templateBounds.east, templateBounds.north]
              )
              
                             // Calculate padding based on aspect ratio (smaller = tighter zoom)
               const aspectRatio = targetWidth / targetHeight
               let padding: number | { top: number; bottom: number; left: number; right: number } = 20
               
               if (aspectRatio < 0.8) {
                 // Portrait: much tighter for mobile
                 padding = { top: 10, bottom: 10, left: 15, right: 15 }
               } else if (aspectRatio > 1.5) {
                 // Landscape: more vertical padding  
                 padding = { top: 40, bottom: 40, left: 20, right: 20 }
               }
              
              map.fitBounds(bounds, { padding })
            } else if (locations.length > 1) {
              // For multiple locations without template bounds, fit to all locations
              const bounds = getBounds(locations)
              map.fitBounds(bounds, { padding: 80 })
            } else if (locations.length === 1) {
              // For single location, center and use appropriate zoom
              map.setCenter([locations[0].lng, locations[0].lat])
              map.setZoom(10)
            }
          }

          // Wait for map to be fully loaded and idle
          const waitForMapReady = () => {
            if (map.loaded() && map.isStyleLoaded()) {
              // Add a small delay to ensure rendering is complete
              setTimeout(() => {
                try {
                  const canvas = map.getCanvas()
                  console.log('Canvas dimensions:', canvas.width, 'x', canvas.height)
                  
                  // Force a repaint before export
                  map.triggerRepaint()
                  
                  // Wait a bit more after repaint
                  setTimeout(() => {
                    // Check if we need to account for device pixel ratio
                    const actualWidth = canvas.width
                    const actualHeight = canvas.height
                    const devicePixelRatio = window.devicePixelRatio || 1
                    
                    console.log(`Target: ${targetWidth}x${targetHeight}, Actual canvas: ${actualWidth}x${actualHeight}, DPR: ${devicePixelRatio}`)
                    
                    // If we got scaled dimensions due to device pixel ratio, we may need to resize
                    if (targetWidth && targetHeight && devicePixelRatio > 1) {
                      const expectedWidth = targetWidth * devicePixelRatio
                      const expectedHeight = targetHeight * devicePixelRatio
                      console.log(`Expected with DPR: ${expectedWidth}x${expectedHeight}`)
                    }
                    
                    const dataURL = canvas.toDataURL('image/png', 1.0)
                    console.log('DataURL length:', dataURL.length)
                    
                    // Restore original dimensions and view
                    if (targetWidth && targetHeight) {
                      container.style.width = originalWidth
                      container.style.height = originalHeight
                      map.resize()
                      // Restore original view
                      map.setCenter(originalCenter)
                      map.setZoom(originalZoom)
                    }
                    
                    resolve(dataURL)
                  }, 300)
                } catch (error) {
                  console.error('Canvas export error:', error)
                  
                  // Restore original dimensions and view on error
                  if (targetWidth && targetHeight) {
                    container.style.width = originalWidth
                    container.style.height = originalHeight
                    map.resize()
                    map.setCenter(originalCenter)
                    map.setZoom(originalZoom)
                  }
                  
                  reject(error)
                }
              }, 800) // Longer delay for high-res rendering
            } else {
              // Check again in 100ms
              setTimeout(waitForMapReady, 100)
            }
          }
          
          waitForMapReady()
        } catch (error) {
          reject(error)
        }
      })
    },
    resize: () => {
      if (map) {
        // Trigger map resize after a short delay to ensure container has updated
        setTimeout(() => {
          map.resize()
          // Force a second resize to ensure proper fit
          setTimeout(() => {
            map.resize()
          }, 50)
        }, 100)
      }
    }
  }))

  const getThemeColors = () => {
    switch (mapStyle.theme) {
      case "minimalist":
        return {
          background: "bg-white",
          lines: "text-slate-300",
          markers: "#475569",
          text: "text-slate-700",
        }
      case "woodburn":
        return {
          background: "bg-amber-50",
          lines: "text-amber-800",
          markers: "#92400e",
          text: "text-amber-900",
        }
      case "vintage":
        return {
          background: "bg-stone-100",
          lines: "text-stone-500",
          markers: "#44403c",
          text: "text-stone-700",
        }
      case "nautical":
        return {
          background: "bg-blue-50",
          lines: "text-blue-600",
          markers: selectedTemplate?.config.styling.primaryColor || "#1e40af",
          text: "text-blue-900",
        }
      default:
        return {
          background: "bg-white",
          lines: "text-slate-300",
          markers: "#475569",
          text: "text-slate-700",
        }
    }
  }

  const themeColors = getThemeColors()

  // Apply theme-specific styling to the base light-v11 map
  const applyThemeStyles = (map: mapboxgl.Map, currentTheme: string) => {
    const themes = {
      minimalist: {
        water: '#f1f5f9',
        roads: '#e2e8f0',
        text: '#475569'
      },
      woodburn: {
        water: '#fed7aa', 
        roads: '#92400e',
        text: '#451a03'
      },
      vintage: {
        water: '#e7e5e4',
        roads: '#78716c', 
        text: '#44403c'
      },
      nautical: {
        water: '#dbeafe',
        roads: '#1e40af',
        text: '#1e3a8a'
      }
    }

    const colors = themes[currentTheme as keyof typeof themes] || themes.minimalist

    // Get all layer IDs to see what's available
    const style = map.getStyle()
    if (!style || !style.layers) return
    
    const layers = style.layers
    
    // Look for and modify water layers
    layers.forEach(layer => {
      if (!layer || !layer.id) return
      
      const mapLayer = map.getLayer(layer.id)
      if (!mapLayer) return
      
      if (layer.id.includes('water')) {
        try {
          // Only set fill-color for fill layers
          if (mapLayer.type === 'fill') {
            map.setPaintProperty(layer.id, 'fill-color', colors.water)
          }
          // Set line-color for line layers
          if (mapLayer.type === 'line') {
            map.setPaintProperty(layer.id, 'line-color', colors.water)
          }
        } catch (e) {
          // Silently fail - some layers might not support these properties
        }
      }
      
      // Look for and modify road layers
      if (layer.id.includes('road') || layer.id.includes('street') || layer.id.includes('highway')) {
        try {
          // Only set line-color for line layers
          if (mapLayer.type === 'line') {
            map.setPaintProperty(layer.id, 'line-color', colors.roads)
          }
        } catch (e) {
          // Silently fail - some layers might not support these properties
        }
      }
      
      // Look for and modify text layers
      if (layer.id.includes('place') || layer.id.includes('label') || layer.id.includes('text')) {
        try {
          // Only set text-color for symbol layers
          if (mapLayer.type === 'symbol') {
            map.setPaintProperty(layer.id, 'text-color', colors.text)
          }
        } catch (e) {
          // Silently fail - some layers might not support these properties
        }
      }
    })
  }

  // Initialize Mapbox map
  useEffect(() => {
    if (!mapContainerRef.current) return
    if (!MAPBOX_ACCESS_TOKEN) {
      console.warn('Mapbox access token not found. Map will not render.')
      return
    }

    // Ensure access token is set before creating map
    mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN

    // Use light-v11 as base for all themes (clean, minimal, perfect for engraving)
    const mapInstance = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: locations.length > 0 ? [locations[0].lng, locations[0].lat] : [0, 0],
      zoom: 1,
      attributionControl: showControls, // Only show attribution if controls are enabled
      preserveDrawingBuffer: true // Essential for image export - preserves WebGL canvas data
    })

    // Add navigation controls if requested
    if (showControls) {
      mapInstance.addControl(new mapboxgl.NavigationControl(), 'top-right')
    }

    // Apply theme-specific styling once the map loads
    mapInstance.on('style.load', () => {
      applyThemeStyles(mapInstance, mapStyle.theme)
      
      // Add route path if available in template
      if (selectedTemplate?.config.routeData?.path) {
        const routePath = selectedTemplate.config.routeData.path
        
        // Add route source
        mapInstance.addSource('route', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: routePath
            }
          }
        })
        
        // Add route layer with theme-appropriate styling
        let routeColor = selectedTemplate.config.styling.primaryColor || '#1e40af'
        
        // Override route color based on theme for better visibility
        switch (mapStyle.theme) {
          case 'nautical':
            routeColor = '#1e40af' // Deep blue for nautical
            break
          case 'minimalist':
            routeColor = '#475569' // Slate for minimalist
            break
          case 'woodburn':
            routeColor = '#92400e' // Amber for woodburn
            break
          case 'vintage':
            routeColor = '#44403c' // Stone for vintage
            break
          default:
            routeColor = selectedTemplate.config.styling.primaryColor || '#1e40af'
        }
        mapInstance.addLayer({
          id: 'route',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': routeColor,
            'line-width': 3,
            'line-opacity': 0.8
          }
        })
        
        // Add a subtle glow effect
        mapInstance.addLayer({
          id: 'route-glow',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': routeColor,
            'line-width': 6,
            'line-opacity': 0.3,
            'line-blur': 2
          }
        }, 'route') // Insert below the main route line
      }

      // Add location markers as map layers (after style is loaded)
      if (locations.length > 0) {
        // Generate theme-appropriate icons
        const themeIcons = generateThemeIcons(mapStyle.theme)
        
        // Add icon images to map
        Object.entries(themeIcons).forEach(([iconName, dataUrl]) => {
          if (!mapInstance.hasImage(iconName)) {
            const img = new Image()
            img.onload = () => mapInstance.addImage(iconName, img)
            img.src = dataUrl
          }
        })

        // Create GeoJSON source for location points
        const locationFeatures = locations.map((location, index) => {
          // Determine which icon to use
          let iconId = 'MapPin' // Default fallback
          
          if (location.iconType === 'icon' && location.icon) {
            // Map old icon names to new icon names
            iconId = emojiToIconMap[location.icon] || location.icon
          } else if (location.iconType === 'emoji' && location.emoji) {
            // For now, use a default icon for emojis (we could expand this mapping)
            iconId = 'Heart' // Default for emoji type
          }

          // Ensure the icon exists in our registry
          const iconDef = getIconByName(iconId)
          if (!iconDef) {
            iconId = 'MapPin' // Ultimate fallback
          }

          return {
            type: 'Feature' as const,
            properties: {
              title: location.name,
              description: location.caption || '',
              iconId: iconId,
              index: index
            },
            geometry: {
              type: 'Point' as const,
              coordinates: [location.lng, location.lat]
            }
          }
        })

        // Add location markers source
        mapInstance.addSource('location-markers', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection' as const,
            features: locationFeatures
          }
        })

        // Add location marker icons
        mapInstance.addLayer({
          id: 'location-icons',
          type: 'symbol',
          source: 'location-markers',
          layout: {
            'icon-image': ['get', 'iconId'],
            'icon-size': 1.0,
            'icon-allow-overlap': true,
            'icon-ignore-placement': true,
            'icon-anchor': 'center'
          }
        })
      }

      // Notify parent that map is loaded
      if (onMapLoad) {
        onMapLoad(mapInstance)
      }
    })

          // Add DOM markers for interactivity (click handlers, popups)
      locations.forEach((location, index) => {
        // Create minimal DOM marker for interactivity only
        const markerElement = document.createElement('div')
        markerElement.style.cssText = `
          width: 32px;
          height: 32px;
          background: transparent;
          cursor: pointer;
        `

        // Create marker and add to map
        const marker = new mapboxgl.Marker(markerElement)
          .setLngLat([location.lng, location.lat])
          .addTo(mapInstance)

        // Add click handler
        markerElement.addEventListener('click', () => {
          setActiveLocationIndex(index)
        })

        // Add popup with location info
        if (location.caption || location.narrative) {
          const popup = new mapboxgl.Popup({ 
            offset: 25,
            closeButton: false 
          })
          .setHTML(`
            <div style="text-align: center; padding: 12px; max-width: 200px;">
              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold; color: #333;">${location.name}</h3>
              ${location.caption ? `<p style="margin: 0 0 6px 0; font-size: 14px; color: #666; font-weight: 500;">${location.caption}</p>` : ''}
              ${location.narrative ? `<p style="margin: 0; font-size: 12px; color: #888; line-height: 1.4;">${location.narrative}</p>` : ''}
            </div>
          `)

          marker.setPopup(popup)
        }
      })

    // Fit map to show appropriate view
    if (selectedTemplate?.config.routeData?.bounds && locations.length > 0) {
      // Use template bounds for templates with route data (like Great Loop)
      const templateBounds = selectedTemplate.config.routeData.bounds
      const bounds = new mapboxgl.LngLatBounds(
        [templateBounds.west, templateBounds.south],
        [templateBounds.east, templateBounds.north]
      )
      mapInstance.fitBounds(bounds, { padding: 40 })
    } else if (locations.length > 1) {
      // For multiple locations without template bounds, fit to all locations
      const bounds = getBounds(locations)
      mapInstance.fitBounds(bounds, { padding: 80 })
    } else if (locations.length === 1) {
      // For single location without template bounds, center and zoom
      mapInstance.setCenter([locations[0].lng, locations[0].lat])
      mapInstance.setZoom(10)
    }

    setMap(mapInstance)

    // Cleanup
    return () => {
      mapInstance.remove()
    }
  }, [locations, mapStyle.theme, themeColors.markers, setActiveLocationIndex, selectedTemplate, showControls, onMapLoad])

  return (
    <div className="relative w-full h-full">
      <div
        ref={mapContainerRef}
        className={`w-full h-full rounded-lg border border-border overflow-hidden ${mapStyle.font} ${className}`}
        style={{ minHeight: '400px', ...style }}
      />
      {!MAPBOX_ACCESS_TOKEN && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-600 z-10">
          <div className="text-center p-8">
            <h3 className="text-lg font-semibold mb-2">Mapbox Configuration Required</h3>
            <p className="mb-2">To see your map, add your Mapbox access token:</p>
            <code className="bg-gray-200 px-2 py-1 rounded text-sm">
              NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_token_here
            </code>
            <p className="text-sm mt-2">
              Get your free token at{' '}
              <a href="https://account.mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                mapbox.com
              </a>
            </p>
          </div>
        </div>
      )}
    </div>
  )
})

MapRenderer.displayName = "MapRenderer" 