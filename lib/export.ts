import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import type { Location } from './types'

export interface ExportOptions {
  format: 'png' | 'svg' | 'pdf' | 'dxf'
  width: number
  height: number
  orientation: 'portrait' | 'landscape'
  theme: string
  strokeWidth: number
  font: string
}

// Export map as PNG using html2canvas
export async function exportToPNG(
  mapContainer: HTMLElement,
  locations: Location[],
  options: ExportOptions
): Promise<Blob> {
  try {
    // Configure html2canvas options for high quality export
    const canvas = await html2canvas(mapContainer, {
      backgroundColor: getThemeBackgroundColor(options.theme),
      scale: 2, // High DPI for better quality
      useCORS: true,
      allowTaint: true,
      width: options.width * 96, // Convert inches to pixels (96 DPI)
      height: options.height * 96,
      logging: false
    })

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob)
        } else {
          throw new Error('Failed to create PNG blob')
        }
      }, 'image/png', 1.0)
    })
  } catch (error) {
    console.error('PNG export error:', error)
    throw new Error('Failed to export PNG')
  }
}

// Export map as SVG by creating a custom SVG element
export function exportToSVG(
  locations: Location[],
  options: ExportOptions
): string {
  const { width, height, theme, strokeWidth } = options
  const pixelWidth = width * 96
  const pixelHeight = height * 96

  const themeColors = getThemeColors(theme)
  
  // Calculate bounds for all locations
  const bounds = calculateBounds(locations)
  
  // SVG template
  const svg = `
    <svg 
      width="${pixelWidth}" 
      height="${pixelHeight}" 
      viewBox="0 0 ${pixelWidth} ${pixelHeight}"
      xmlns="http://www.w3.org/2000/svg"
      style="background-color: ${themeColors.background}"
    >
      <defs>
        <style>
          .location-text { 
            font-family: ${getFontFamily(options.font)}; 
            font-size: 14px; 
            fill: ${themeColors.text}; 
          }
          .marker { 
            stroke: white; 
            stroke-width: ${strokeWidth}px; 
            fill: ${themeColors.markers}; 
          }
        </style>
      </defs>
      
      <!-- Background -->
      <rect width="100%" height="100%" fill="${themeColors.background}"/>
      
      <!-- Grid lines for minimal map aesthetic -->
      ${generateGridLines(pixelWidth, pixelHeight, themeColors.lines, strokeWidth)}
      
      <!-- Location markers -->
      ${locations.map((location, index) => {
        const coords = projectLocationToSVG(location, bounds, pixelWidth, pixelHeight)
        return generateLocationMarker(location, coords, index, options)
      }).join('')}
      
      <!-- Location labels -->
      ${locations.map((location, index) => {
        const coords = projectLocationToSVG(location, bounds, pixelWidth, pixelHeight)
        return generateLocationLabel(location, coords, index, options)
      }).join('')}
    </svg>
  `.trim()

  return svg
}

// Export map as PDF using jsPDF
export async function exportToPDF(
  mapContainer: HTMLElement,
  locations: Location[],
  options: ExportOptions
): Promise<Blob> {
  try {
    // First create PNG
    const pngBlob = await exportToPNG(mapContainer, locations, options)
    const pngDataUrl = await blobToDataURL(pngBlob)

    // Create PDF
    const pdf = new jsPDF({
      orientation: options.orientation,
      unit: 'in',
      format: [options.width, options.height]
    })

    // Add the PNG image to PDF
    pdf.addImage(
      pngDataUrl,
      'PNG',
      0,
      0,
      options.width,
      options.height,
      undefined,
      'FAST'
    )

    // Convert to blob
    const pdfBlob = pdf.output('blob')
    return pdfBlob
  } catch (error) {
    console.error('PDF export error:', error)
    throw new Error('Failed to export PDF')
  }
}

// Generate DXF format (basic implementation for laser cutting)
export function exportToDXF(
  locations: Location[],
  options: ExportOptions
): string {
  const { width, height } = options
  const bounds = calculateBounds(locations)

  // Basic DXF header
  const dxf = `
0
SECTION
2
HEADER
9
$INSUNITS
70
4
9
$MEASUREMENT
70
1
0
ENDSEC
0
SECTION
2
ENTITIES
  ${locations.map((location, _index) => {
  const coords = projectLocationToSVG(location, bounds, width * 25.4, height * 25.4) // Convert to mm
  return `
0
CIRCLE
8
MARKERS
10
${coords.x}
20
${coords.y}
40
2.0
0
TEXT
8
LABELS
10
${coords.x + 5}
20
${coords.y + 5}
1
${location.name}
`
}).join('')}
0
ENDSEC
0
EOF
  `.trim()

  return dxf
}

// Helper functions
function getThemeBackgroundColor(theme: string): string {
  switch (theme) {
    case 'minimalist':
      return '#ffffff'
    case 'woodburn':
      return '#fef3c7'
    case 'vintage':
      return '#f5f5f4'
    default:
      return '#ffffff'
  }
}

function getThemeColors(theme: string) {
  switch (theme) {
    case 'minimalist':
      return {
        background: '#ffffff',
        lines: '#e2e8f0',
        markers: '#475569',
        text: '#475569'
      }
    case 'woodburn':
      return {
        background: '#fef3c7',
        lines: '#92400e',
        markers: '#92400e',
        text: '#451a03'
      }
    case 'vintage':
      return {
        background: '#f5f5f4',
        lines: '#78716c',
        markers: '#44403c',
        text: '#44403c'
      }
    default:
      return {
        background: '#ffffff',
        lines: '#e2e8f0',
        markers: '#475569',
        text: '#475569'
      }
  }
}

function getFontFamily(font: string): string {
  switch (font) {
    case 'font-serif':
      return 'Georgia, serif'
    case 'font-mono':
      return 'Monaco, monospace'
    default:
      return 'Inter, sans-serif'
  }
}

function calculateBounds(locations: Location[]) {
  if (locations.length === 0) {
    return { minLat: 0, maxLat: 0, minLng: 0, maxLng: 0 }
  }

  let minLat = locations[0].lat
  let maxLat = locations[0].lat
  let minLng = locations[0].lng
  let maxLng = locations[0].lng

  locations.forEach(location => {
    minLat = Math.min(minLat, location.lat)
    maxLat = Math.max(maxLat, location.lat)
    minLng = Math.min(minLng, location.lng)
    maxLng = Math.max(maxLng, location.lng)
  })

  // Add padding
  const latPadding = (maxLat - minLat) * 0.1 || 1
  const lngPadding = (maxLng - minLng) * 0.1 || 1

  return {
    minLat: minLat - latPadding,
    maxLat: maxLat + latPadding,
    minLng: minLng - lngPadding,
    maxLng: maxLng + lngPadding
  }
}

function projectLocationToSVG(
  location: Location,
  bounds: ReturnType<typeof calculateBounds>,
  width: number,
  height: number
) {
  const x = ((location.lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * width
  const y = height - ((location.lat - bounds.minLat) / (bounds.maxLat - bounds.minLat)) * height
  
  return { x, y }
}

function generateGridLines(width: number, height: number, color: string, strokeWidth: number): string {
  const lines = []
  const gridSpacing = Math.min(width, height) / 20

  // Horizontal lines
  for (let y = gridSpacing; y < height; y += gridSpacing) {
    lines.push(`<line x1="0" y1="${y}" x2="${width}" y2="${y}" stroke="${color}" stroke-width="${strokeWidth * 0.5}" opacity="0.3"/>`)
  }

  // Vertical lines
  for (let x = gridSpacing; x < width; x += gridSpacing) {
    lines.push(`<line x1="${x}" y1="0" x2="${x}" y2="${height}" stroke="${color}" stroke-width="${strokeWidth * 0.5}" opacity="0.3"/>`)
  }

  return lines.join('')
}

function generateLocationMarker(
  location: Location,
  coords: { x: number; y: number },
  _index: number,
  _options: ExportOptions
): string {
  if (location.iconType === 'emoji' && location.emoji) {
    return `<text x="${coords.x}" y="${coords.y + 5}" text-anchor="middle" font-size="24" fill="black">${location.emoji}</text>`
  }
  
  return `<circle cx="${coords.x}" cy="${coords.y}" r="12" class="marker"/>`
}

function generateLocationLabel(
  location: Location,
  coords: { x: number; y: number },
  _index: number,
  _options: ExportOptions
): string {
  const labelY = coords.y + 25
  return `
    <text x="${coords.x}" y="${labelY}" text-anchor="middle" class="location-text">
      ${location.name}
    </text>
    ${location.caption ? `
    <text x="${coords.x}" y="${labelY + 16}" text-anchor="middle" class="location-text" font-size="12" opacity="0.7">
      ${location.caption}
    </text>
    ` : ''}
  `
}

async function blobToDataURL(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

// Utility function to trigger download
export function downloadFile(blob: Blob | string, filename: string, mimeType?: string) {
  const url = typeof blob === 'string' 
    ? `data:${mimeType || 'text/plain'};charset=utf-8,${encodeURIComponent(blob)}`
    : URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  if (typeof blob !== 'string') {
    URL.revokeObjectURL(url)
  }
} 