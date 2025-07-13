import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface Location {
  id: string
  name: string
  address: string
  coordinates: [number, number] // [lng, lat]
  description?: string
}

export interface Chapter {
  id: string
  locationId: string
  title: string
  description?: string
  icon: string
  emoji?: string
  customImage?: string
}

export interface StyleOptions {
  theme: 'minimalist' | 'woodburn' | 'vintage' | 'inverted'
  fontSize: number
  strokeWidth: number
  showLabels: boolean
  showRoads: boolean
  showLandmarks: boolean
}

export interface PreviewSettings {
  canvasSize: { width: number; height: number }
  orientation: 'portrait' | 'landscape'
  format: 'png' | 'svg' | 'pdf' | 'dxf'
  resolution: number
}

export interface MapCreationState {
  // Current step (1-5)
  currentStep: number
  
  // Step 1: Locations
  locations: Location[]
  
  // Step 2: Chapters
  chapters: Chapter[]
  
  // Step 3: Customization
  style: StyleOptions
  
  // Step 4: Preview
  preview: PreviewSettings
  
  // Draft management
  isDraft: boolean
  lastSaved: string | null
  
  // Actions
  setCurrentStep: (step: number) => void
  nextStep: () => void
  prevStep: () => void
  
  // Location actions
  addLocation: (location: Omit<Location, 'id'>) => void
  updateLocation: (id: string, updates: Partial<Location>) => void
  removeLocation: (id: string) => void
  
  // Chapter actions
  addChapter: (chapter: Omit<Chapter, 'id'>) => void
  updateChapter: (id: string, updates: Partial<Chapter>) => void
  removeChapter: (id: string) => void
  
  // Style actions
  updateStyle: (updates: Partial<StyleOptions>) => void
  
  // Preview actions
  updatePreview: (updates: Partial<PreviewSettings>) => void
  
  // Draft management
  saveDraft: () => void
  loadDraft: () => void
  clearDraft: () => void
  
  // Validation
  canProceedToStep: (step: number) => boolean
  
  // Reset
  resetWorkflow: () => void
}

const initialState = {
  currentStep: 1,
  locations: [],
  chapters: [],
  style: {
    theme: 'minimalist' as const,
    fontSize: 14,
    strokeWidth: 2,
    showLabels: true,
    showRoads: true,
    showLandmarks: true,
  },
  preview: {
    canvasSize: { width: 800, height: 600 },
    orientation: 'landscape' as const,
    format: 'png' as const,
    resolution: 300,
  },
  isDraft: false,
  lastSaved: null,
}

export const useMapCreationStore = create<MapCreationState>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      // Step management
      setCurrentStep: (step) => set({ currentStep: step }),
      nextStep: () => {
        const { currentStep } = get()
        if (currentStep < 5) {
          set({ currentStep: currentStep + 1 })
        }
      },
      prevStep: () => {
        const { currentStep } = get()
        if (currentStep > 1) {
          set({ currentStep: currentStep - 1 })
        }
      },
      
      // Location actions
      addLocation: (location) => {
        const id = crypto.randomUUID()
        set((state) => ({
          locations: [...state.locations, { ...location, id }],
          isDraft: true,
        }))
      },
      updateLocation: (id, updates) => {
        set((state) => ({
          locations: state.locations.map(loc => 
            loc.id === id ? { ...loc, ...updates } : loc
          ),
          isDraft: true,
        }))
      },
      removeLocation: (id) => {
        set((state) => ({
          locations: state.locations.filter(loc => loc.id !== id),
          chapters: state.chapters.filter(ch => ch.locationId !== id),
          isDraft: true,
        }))
      },
      
      // Chapter actions
      addChapter: (chapter) => {
        const id = crypto.randomUUID()
        set((state) => ({
          chapters: [...state.chapters, { ...chapter, id }],
          isDraft: true,
        }))
      },
      updateChapter: (id, updates) => {
        set((state) => ({
          chapters: state.chapters.map(ch => 
            ch.id === id ? { ...ch, ...updates } : ch
          ),
          isDraft: true,
        }))
      },
      removeChapter: (id) => {
        set((state) => ({
          chapters: state.chapters.filter(ch => ch.id !== id),
          isDraft: true,
        }))
      },
      
      // Style actions
      updateStyle: (updates) => {
        set((state) => ({
          style: { ...state.style, ...updates },
          isDraft: true,
        }))
      },
      
      // Preview actions
      updatePreview: (updates) => {
        set((state) => ({
          preview: { ...state.preview, ...updates },
          isDraft: true,
        }))
      },
      
      // Draft management
      saveDraft: () => {
        set({ 
          isDraft: false, 
          lastSaved: new Date().toISOString() 
        })
      },
      loadDraft: () => {
        // This is handled by the persist middleware
      },
      clearDraft: () => {
        set({ 
          ...initialState,
          isDraft: false,
          lastSaved: null,
        })
      },
      
      // Validation
      canProceedToStep: (step) => {
        const state = get()
        switch (step) {
          case 1:
            return true
          case 2:
            return state.locations.length > 0
          case 3:
            return state.chapters.length > 0
          case 4:
            return state.chapters.length > 0
          case 5:
            return state.chapters.length > 0
          default:
            return false
        }
      },
      
      // Reset
      resetWorkflow: () => {
        set(initialState)
      },
    }),
    {
      name: 'map-creation-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Only persist the workflow data, not UI state
        locations: state.locations,
        chapters: state.chapters,
        style: state.style,
        preview: state.preview,
        currentStep: state.currentStep,
        isDraft: state.isDraft,
        lastSaved: state.lastSaved,
      }),
    }
  )
) 