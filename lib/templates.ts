// Template system type definitions
export interface Template {
  id: string
  name: string
  category: 'journey' | 'relationship' | 'story'
  community: string
  description: string
  config: TemplateConfig
  preview?: {
    image?: string
    locations?: string[]
    tagline?: string
  }
}

export interface TemplateConfig {
  prompts: TemplatePrompt[]
  terminology: TemplateTerm[]
  styling: TemplateStyle
  iconSets: IconSet[]
  routeData?: RouteData
  examples: TemplateExample[]
}

export interface TemplatePrompt {
  step: number
  key: string
  title: string
  description: string
  placeholder?: string
  helpText?: string
}

export interface TemplateTerm {
  key: string
  term: string
  plural?: string
}

export interface TemplateStyle {
  theme: 'nautical' | 'wilderness' | 'urban' | 'romantic' | 'classic'
  primaryColor: string
  secondaryColor?: string
  iconStyle: 'nautical' | 'outdoor' | 'urban' | 'romantic' | 'classic'
  font?: string
}

export interface IconSet {
  id: string
  name: string
  icons: Icon[]
}

export interface Icon {
  id: string
  name: string
  category: string
  symbol: string
  unicode?: string
}

export interface RouteData {
  path?: [number, number][] // [lng, lat] coordinates
  waypoints?: RouteWaypoint[]
  regions?: string[]
  bounds?: {
    north: number
    south: number
    east: number
    west: number
  }
}

export interface RouteWaypoint {
  id: string
  name: string
  coordinates: [number, number]
  type: 'start' | 'stop' | 'waypoint' | 'end'
  description?: string
}

export interface TemplateExample {
  id: string
  title: string
  description: string
  locations: string[]
  previewImage?: string
}

// Template registry interface
export interface TemplateRegistry {
  templates: Template[]
  getTemplate: (id: string) => Template | undefined
  getTemplatesByCategory: (category: string) => Template[]
  getTemplatesByCommunity: (community: string) => Template[]
  registerTemplate: (template: Template) => void
} 