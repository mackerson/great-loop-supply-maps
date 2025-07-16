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
  const { width, height, strokeWidth = 1 } = options
  
  // DXF header
  let dxf = `0
SECTION
2
HEADER
9
$ACADVER
1
AC1015
9
$INSUNITS
70
4
0
ENDSEC
0
SECTION
2
TABLES
0
TABLE
2
LTYPE
5
5
330
0
100
AcDbSymbolTable
70
1
0
LTYPE
5
14
330
5
100
AcDbSymbolTableRecord
100
AcDbLinetypeTableRecord
2
BYLAYER
70
0
3

72
65
73
0
40
0.0
0
LTYPE
5
15
330
5
100
AcDbSymbolTableRecord
100
AcDbLinetypeTableRecord
2
BYBLOCK
70
0
3

72
65
73
0
40
0.0
0
LTYPE
5
16
330
5
100
AcDbSymbolTableRecord
100
AcDbLinetypeTableRecord
2
CONTINUOUS
70
0
3
Solid line
72
65
73
0
40
0.0
0
ENDTAB
0
TABLE
2
LAYER
5
2
330
0
100
AcDbSymbolTable
70
1
0
LAYER
5
10
330
2
100
AcDbSymbolTableRecord
100
AcDbLayerTableRecord
2
0
70
0
62
7
6
CONTINUOUS
370
0
390
F
0
ENDTAB
0
TABLE
2
STYLE
5
3
330
0
100
AcDbSymbolTable
70
1
0
STYLE
5
11
330
3
100
AcDbSymbolTableRecord
100
AcDbTextStyleTableRecord
2
STANDARD
70
0
40
0.0
41
1.0
50
0.0
71
0
42
0.2
3
txt
4

0
ENDTAB
0
ENDSEC
0
SECTION
2
BLOCKS
0
BLOCK
5
20
330
1F
100
AcDbEntity
8
0
100
AcDbBlockBegin
2
*MODEL_SPACE
70
0
10
0.0
20
0.0
30
0.0
3
*MODEL_SPACE
1

0
ENDBLK
5
21
330
1F
100
AcDbEntity
8
0
100
AcDbBlockEnd
0
BLOCK
5
1C
330
1B
100
AcDbEntity
8
0
100
AcDbBlockBegin
2
*PAPER_SPACE
70
0
10
0.0
20
0.0
30
0.0
3
*PAPER_SPACE
1

0
ENDBLK
5
1D
330
1B
100
AcDbEntity
8
0
100
AcDbBlockEnd
0
ENDSEC
0
SECTION
2
ENTITIES
`

  // Add map boundary
  dxf += `0
LWPOLYLINE
5
100
330
1F
100
AcDbEntity
8
0
100
AcDbPolyline
90
5
70
1
43
${strokeWidth}
10
0.0
20
0.0
10
${width}
20
0.0
10
${width}
20
${height}
10
0.0
20
${height}
10
0.0
20
0.0
`

  // Add location markers
  locations.forEach((location) => {
    // Convert lat/lng to DXF coordinates (simplified)
    const x = (location.lng + 180) * (width / 360)
    const y = (location.lat + 90) * (height / 180)
    
    // Add circle for location
    dxf += `0
CIRCLE
5
${Math.floor(Math.random() * 1000) + 200}
330
1F
100
AcDbEntity
8
0
100
AcDbCircle
10
${x}
20
${y}
30
0.0
40
${strokeWidth * 2}
`

    // Add text label
    dxf += `0
TEXT
5
${Math.floor(Math.random() * 1000) + 300}
330
1F
100
AcDbEntity
8
0
100
AcDbText
10
${x}
20
${y + strokeWidth * 3}
30
0.0
40
${strokeWidth * 2}
1
${location.name}
50
0.0
7
STANDARD
41
1.0
51
0.0
`
  })

  // DXF footer
  dxf += `0
ENDSEC
0
EOF
`

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
  index: number,
  options: ExportOptions
): string {
  if (location.iconType === 'emoji' && location.emoji) {
    return `<text x="${coords.x}" y="${coords.y + 5}" text-anchor="middle" font-size="24" fill="black">${location.emoji}</text>`
  }
  
  return `<circle cx="${coords.x}" cy="${coords.y}" r="12" class="marker"/>`
}

function generateLocationLabel(
  location: Location,
  coords: { x: number; y: number },
  index: number,
  options: ExportOptions
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