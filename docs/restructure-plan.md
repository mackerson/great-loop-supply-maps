# Great Loop Supply Company - Map Gen App Restructure Plan

## Overview
Refactoring from a single-page microsite to a scalable multi-page application with proper routing, state management, and organization. This Journey Map creator will be one of the flagship products for Great Loop Supply Company, serving the Great Loop boating community.

## Goals
- ✅ Proper Next.js App Router structure
- ✅ Zustand for workflow state management
- ✅ localStorage for draft persistence
- ✅ Organized component structure
- ✅ URL-based navigation for each workflow step
- ✅ Foundation for sales pages, user accounts, and multiple products

## Current State
- Single `WelcomeScreen` component managing entire workflow
- Conditional rendering for different steps
- All components in flat `/components/` directory
- No URL structure or bookmarkable states
- No persistence

## Target Architecture

### 1. App Router Structure
```
app/
├── page.tsx                 # Landing/marketing page
├── layout.tsx              # Root layout with navigation
├── create/                 # Map creation workflow
│   ├── page.tsx           # Step 1: Choose your moments
│   ├── chapters/          # Step 2: Add chapters
│   │   └── page.tsx
│   ├── customize/         # Step 3: Customize look
│   │   └── page.tsx
│   ├── preview/           # Step 4: Preview
│   │   └── page.tsx
│   └── download/          # Step 5: Download
│       └── page.tsx
├── products/              # Future: Other map types
├── account/               # User dashboard
├── pricing/               # Sales page
└── about/                 # Marketing content
```

### 2. Component Organization
```
components/
├── marketing/             # Landing page components
│   ├── hero.tsx
│   ├── features.tsx
│   └── testimonials.tsx
├── map-creation/          # Map workflow components
│   ├── location-input.tsx
│   ├── chapter-builder.tsx
│   ├── style-customizer.tsx
│   ├── map-preview.tsx
│   └── export-interface.tsx
├── layout/                # Navigation, headers, etc.
│   ├── header.tsx
│   ├── footer.tsx
│   └── progress-bar.tsx
└── ui/                    # Existing shadcn components
```

### 3. State Management (Zustand)
```typescript
interface MapCreationState {
  // Step 1: Locations
  locations: Location[]
  
  // Step 2: Chapters
  chapters: Chapter[]
  
  // Step 3: Customization
  theme: Theme
  style: StyleOptions
  
  // Step 4: Preview
  previewSettings: PreviewSettings
  
  // Actions
  addLocation: (location: Location) => void
  addChapter: (chapter: Chapter) => void
  updateStyle: (style: StyleOptions) => void
  // ... etc
}
```

### 4. Persistence Strategy
- Auto-save to localStorage on state changes
- Draft recovery on app load
- Clear drafts on successful completion

## Implementation Plan

### Phase 1: Foundation Setup ✅
- [x] Create new app router structure
- [x] Set up Zustand store with persistence
- [x] Create layout components (header, footer, progress bar)
- [x] Migrate welcome screen to landing page

### Phase 2: Workflow Pages 🔄
- [x] Create Step 1: Choose your moments (`/create`)
- [x] Create Step 2: Add chapters (`/create/chapters`)
- [x] Create Step 3: Customize (`/create/customize`)
- [x] Create Step 4: Preview (`/create/preview`)
- [x] Create Step 5: Download (`/create/download`)

### Phase 3: Component Migration 📦
- [x] Move LocationInput to map-creation folder and update to use Zustand
- [ ] Move ChapterBuilder to map-creation folder and update to use Zustand
- [ ] Move StyleCustomizer to map-creation folder and update to use Zustand
- [ ] Move MapPreview to map-creation folder and update to use Zustand
- [ ] Move ExportInterface to map-creation folder and update to use Zustand
- [ ] Update imports and dependencies
- [ ] Test workflow end-to-end

### Phase 4: Enhanced Features ✨
- [ ] Add progress indicator
- [ ] Implement draft saving/loading
- [ ] Add navigation between steps
- [ ] Polish transitions and UX

### Phase 5: Foundation for Growth 🚀
- [ ] Set up marketing pages structure
- [ ] Create account pages skeleton
- [ ] Add product pages foundation

## Technical Decisions

### Zustand Store Structure
```typescript
// stores/map-creation.ts
interface MapCreationStore {
  // State
  currentStep: number
  locations: Location[]
  chapters: Chapter[]
  style: StyleOptions
  
  // Actions
  nextStep: () => void
  prevStep: () => void
  addLocation: (location: Location) => void
  // ... etc
  
  // Persistence
  saveToStorage: () => void
  loadFromStorage: () => void
  clearDraft: () => void
}
```

### URL Strategy
- `/create` - Step 1 (default)
- `/create/chapters` - Step 2
- `/create/customize` - Step 3
- `/create/preview` - Step 4
- `/create/download` - Step 5

### Progress Tracking
- URL-based progress determination
- Zustand store for step validation
- Progress bar component in layout

## Success Metrics
- ✅ User can navigate between steps via URL
- ✅ State persists across browser sessions
- ✅ Workflow can be resumed from any step
- ✅ Clean component organization
- ✅ Ready for additional features/pages

## Next Steps
1. Start with Zustand store setup
2. Create basic app router structure
3. Migrate welcome screen logic
4. Build out each workflow step
5. Test end-to-end flow

---

**Status**: 🚀 Ready to implement
**Started**: [Current Date]
**Target Completion**: [Target Date] 