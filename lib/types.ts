export interface Location {
  id: string
  name: string
  lat: number
  lng: number
  narrative?: string
  prompt?: string
  iconType?: "icon" | "emoji" | "image"
  icon?: string
  emoji?: string
  caption?: string
  customImage?: string | null
}
