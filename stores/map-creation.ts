import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { Template, IconSet } from '@/lib/templates'
import { templateRegistry } from '@/lib/template-registry'

export interface Location {
  id: string
  name: string
  address: string
  coordinates: [number, number] // [lng, lat]
  lat: number
  lng: number
  description?: string
  // Chapter-specific properties
  iconType?: 'icon' | 'emoji' | 'image'
  icon?: string
  emoji?: string
  customImage?: string | null
  caption?: string
  narrative?: string
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
  theme: 'minimalist' | 'woodburn' | 'vintage' | 'inverted' | 'nautical' | 'wilderness' | 'topographic'
  font: string
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

export interface ExportOptions {
  selectedFormat: string
  selectedSize: string
  customWidth: string
  customHeight: string
  orientation: 'portrait' | 'landscape'
  selectedMaterial: string
  showAccountCreation: boolean
  showPayment: boolean
  hasAccount: boolean
}

export interface MapCreationState {
  // Template selection
  selectedTemplate: Template | null
  
  // Hydration state
  hasHydrated: boolean
  
  // Current step (1-5)
  currentStep: number
  
  // Step 1: Locations
  locations: Location[]
  
  // Step 2: Chapters
  chapters: Chapter[]
  activeLocationIndex: number
  
  // Step 3: Customization
  style: StyleOptions
  
  // Step 4: Preview
  preview: PreviewSettings
  
  // Step 5: Export
  export: ExportOptions
  
  // Draft management
  isDraft: boolean
  lastSaved: string | null
  
  // Template actions
  setTemplate: (template: Template) => void
  getPromptForStep: (step: number) => string
  getPromptDescriptionForStep: (step: number) => string
  getPromptPlaceholderForStep: (step: number) => string
  getPromptHelpTextForStep: (step: number) => string
  getTerminology: (key: string) => string
  getTerminologyPlural: (key: string) => string
  getTemplateIconSets: () => IconSet[]
  
  // Actions
  setCurrentStep: (step: number) => void
  nextStep: () => void
  prevStep: () => void
  
  // Location actions
  addLocation: (location: Omit<Location, 'id'>) => void
  updateLocation: (id: string, updates: Partial<Location>) => void
  removeLocation: (id: string) => void
  setActiveLocationIndex: (index: number) => void
  
  // Chapter actions
  addChapter: (chapter: Omit<Chapter, 'id'>) => void
  updateChapter: (id: string, updates: Partial<Chapter>) => void
  removeChapter: (id: string) => void
  
  // Style actions
  updateStyle: (updates: Partial<StyleOptions>) => void
  
  // Preview actions
  updatePreview: (updates: Partial<PreviewSettings>) => void
  
  // Export actions
  updateExport: (updates: Partial<ExportOptions>) => void
  
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
  selectedTemplate: null,
  hasHydrated: false,
  currentStep: 1,
  locations: [],
  chapters: [],
  activeLocationIndex: 0,
  style: {
    theme: 'minimalist' as const,
    font: 'font-sans',
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
  export: {
    selectedFormat: 'svg',
    selectedSize: '8x8',
    customWidth: '8',
    customHeight: '8',
    orientation: 'portrait' as const,
    selectedMaterial: '',
    showAccountCreation: false,
    showPayment: false,
    hasAccount: false,
  },
  isDraft: false,
  lastSaved: null,
}

export const useMapCreationStore = create<MapCreationState>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      // Template actions
      setTemplate: (template) => set({ selectedTemplate: template }),
      getPromptForStep: (step) => {
        const { selectedTemplate } = get()
        if (!selectedTemplate) return ''
        const prompt = selectedTemplate.config.prompts.find(p => p.step === step)
        return prompt?.title || ''
      },
      getPromptDescriptionForStep: (step) => {
        const { selectedTemplate } = get()
        if (!selectedTemplate) return ''
        const prompt = selectedTemplate.config.prompts.find(p => p.step === step)
        return prompt?.description || ''
      },
      getPromptPlaceholderForStep: (step) => {
        const { selectedTemplate } = get()
        if (!selectedTemplate) return ''
        const prompt = selectedTemplate.config.prompts.find(p => p.step === step)
        return prompt?.placeholder || ''
      },
      getPromptHelpTextForStep: (step) => {
        const { selectedTemplate } = get()
        if (!selectedTemplate) return ''
        const prompt = selectedTemplate.config.prompts.find(p => p.step === step)
        return prompt?.helpText || ''
      },
      getTerminology: (key) => {
        const { selectedTemplate } = get()
        if (!selectedTemplate) return key
        const term = selectedTemplate.config.terminology.find(t => t.key === key)
        return term?.term || key
      },
      getTerminologyPlural: (key) => {
        const { selectedTemplate } = get()
        if (!selectedTemplate) return key
        const term = selectedTemplate.config.terminology.find(t => t.key === key)
        return term?.plural || term?.term || key
      },
      getTemplateIconSets: () => {
        const { selectedTemplate } = get()
        if (!selectedTemplate) return []
        return selectedTemplate.config.iconSets
      },
      
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
      setActiveLocationIndex: (index) => {
        set({ activeLocationIndex: index })
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
      
      // Export actions
      updateExport: (updates) => {
        set((state) => ({
          export: { ...state.export, ...updates },
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
        selectedTemplate: state.selectedTemplate,
        locations: state.locations,
        chapters: state.chapters,
        style: state.style,
        preview: state.preview,
        export: state.export,
        currentStep: state.currentStep,
        isDraft: state.isDraft,
        lastSaved: state.lastSaved,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.hasHydrated = true
        }
      },
    }
  )
) 