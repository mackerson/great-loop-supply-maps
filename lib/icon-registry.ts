// Icon SVG paths from Lucide icons
const iconPaths: Record<string, string> = {
  'Home': 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10',
  'MapPin': 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
  'Compass': 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z',
  'Anchor': 'M12 2a3 3 0 0 1 3 3c0 1.5-1.1 2.7-2.5 2.9V10h4v2h-4v8a6 6 0 0 0 4.5-5.5H19a8 8 0 0 1-16 0h2.5A6 6 0 0 0 10 20v-8H6v-2h4V7.9A3 3 0 0 1 12 2z',
  'Car': 'M14 16H9m10 0h3l-3.5-7h-5l-3.5 7h3zm0 0a2 2 0 1 1 4 0m-4 0a2 2 0 1 0-4 0M2 16h3m5 0a2 2 0 1 1-4 0',
  'Camera': 'M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z M12 17a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  'Coffee': 'M6 2v20h2.28l2.51-6h2.42l2.51 6H18V2m-8 5h4v2H10m0 4h4v2H10m11 1a4 4 0 0 0-4-4h-1v8h1a4 4 0 0 0 4-4z',
  'Music': 'M9 18V5l12-2v13 M6 15h3 M21 3l-12 2',
  'Heart': 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z',
  'Star': 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  'Smile': 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M8 14s1.5 2 4 2 4-2 4-2 M9 9h.01 M15 9h.01',
  'Flag': 'M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z M4 22v-7'
}

export interface IconDefinition {
  name: string
  path: string
  category: 'travel' | 'activities' | 'places' | 'emotions'
  symbol: string // For backward compatibility with emojis
}

// Comprehensive icon registry with SVG paths
export const iconRegistry: IconDefinition[] = [
  // Travel & Navigation
  { name: 'Home', path: iconPaths['Home'], category: 'travel', symbol: '🏠' },
  { name: 'MapPin', path: iconPaths['MapPin'], category: 'travel', symbol: '📍' },
  { name: 'Compass', path: iconPaths['Compass'], category: 'travel', symbol: '🧭' },
  { name: 'Anchor', path: iconPaths['Anchor'], category: 'travel', symbol: '⚓' },
  { name: 'Car', path: iconPaths['Car'], category: 'travel', symbol: '🚗' },

  // Activities & Interests  
  { name: 'Camera', path: iconPaths['Camera'], category: 'activities', symbol: '📷' },
  { name: 'Coffee', path: iconPaths['Coffee'], category: 'activities', symbol: '☕' },
  { name: 'Music', path: iconPaths['Music'], category: 'activities', symbol: '🎵' },
  { name: 'Heart', path: iconPaths['Heart'], category: 'activities', symbol: '❤️' },
  { name: 'Star', path: iconPaths['Star'], category: 'activities', symbol: '⭐' },

  // Emotions & Markers
  { name: 'Smile', path: iconPaths['Smile'], category: 'emotions', symbol: '😊' },
  { name: 'Flag', path: iconPaths['Flag'], category: 'emotions', symbol: '🚩' },
]

// Convert an icon path to a data URL for Mapbox
export function iconToDataUrl(
  iconPath: string,
  color: string = '#ffffff',
  backgroundColor: string = '#1e40af',
  size: number = 32
): string {
  const iconSize = size * 0.6
  const iconOffset = (size - iconSize) / 2

  // Create SVG string with the icon path
  const svgString = `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <circle 
        cx="${size / 2}" 
        cy="${size / 2}" 
        r="${size / 2 - 2}" 
        fill="${backgroundColor}" 
        stroke="#ffffff" 
        stroke-width="3"
      />
      <g transform="translate(${iconOffset}, ${iconOffset}) scale(${iconSize / 24})">
        <path
          d="${iconPath}"
          fill="none"
          stroke="${color}"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </g>
    </svg>
  `.trim()

  // Convert to data URL
  const dataUrl = `data:image/svg+xml;base64,${btoa(svgString)}`
  return dataUrl
}

// Generate icon data URLs for a specific theme
export function generateThemeIcons(theme: string = 'nautical'): Record<string, string> {
  const themeColors = {
    nautical: { bg: '#1e40af', fg: '#ffffff' },
    minimalist: { bg: '#475569', fg: '#ffffff' },
    woodburn: { bg: '#92400e', fg: '#ffffff' },
    vintage: { bg: '#44403c', fg: '#ffffff' }
  }

  const colors = themeColors[theme as keyof typeof themeColors] || themeColors.nautical
  const iconMap: Record<string, string> = {}

  iconRegistry.forEach(({ name, path }) => {
    iconMap[name] = iconToDataUrl(path, colors.fg, colors.bg)
  })

  return iconMap
}

// Get icon by name
export function getIconByName(name: string): IconDefinition | undefined {
  return iconRegistry.find(icon => icon.name === name)
}

// Get icons by category
export function getIconsByCategory(category: IconDefinition['category']): IconDefinition[] {
  return iconRegistry.filter(icon => icon.category === category)
}

// Backward compatibility: map old emoji names to new icon names
export const emojiToIconMap: Record<string, string> = {
  'Heart': 'Heart',
  'Star': 'Star',
  'Home': 'Home',
  'Coffee': 'Coffee',
  'Map': 'MapPin',
  'Music': 'Music',
  'Camera': 'Camera',
  'Smile': 'Smile',
  'Frown': 'Frown',
  'Compass': 'Compass',
  'Anchor': 'Anchor'
} 