# SVG Icon Implementation Plan

## Problem Statement
- Emojis don't render properly in Mapbox WebGL symbol layers
- Need icons that work in both live preview and exported images
- Current approach switches between working preview vs working export

## Solution: Lucide React SVG Icons

### Why Lucide React?
- ✅ **Already installed** in the project
- ✅ **2000+ professional icons** available
- ✅ **Consistent design** system
- ✅ **Lightweight SVG** format
- ✅ **React-friendly** integration
- ✅ **Works in Mapbox** as image layers

## Implementation Plan

### Phase 1: Icon Registry
- [x] Create `lib/icon-registry.ts`
- [x] Convert Lucide icons to data URLs
- [x] Organize icons by category (travel, activities, places, emotions)
- [x] Add theme-aware color tinting

### Phase 2: Map Integration
- [x] Update `MapRenderer` to load icon images
- [x] Replace symbol layer with icon layer
- [x] Ensure icons render in exports
- [x] Maintain click handlers and popups

### Phase 3: Chapter Builder Update
- [x] Update `ChapterBuilder` to use new icon registry
- [x] Replace emoji selection with SVG icon selection
- [x] Maintain existing functionality
- [x] Add icon preview in UI

### Phase 4: Template Integration
- [x] Update template icon sets to use Lucide icons
- [x] Ensure backward compatibility
- [x] Add fallback handling

## Icon Categories

### Travel & Navigation
- `Home`, `MapPin`, `Compass`, `Anchor`, `Car`, `Plane`, `Ship`, `Train`

### Activities & Interests  
- `Camera`, `Coffee`, `Music`, `Heart`, `Star`, `Book`, `Utensils`, `Gamepad2`

### Places & Landmarks
- `Building`, `Mountain`, `Trees`, `Waves`, `Sun`, `Moon`, `Castle`, `Church`

### Emotions & Markers
- `Smile`, `Frown`, `ThumbsUp`, `Flag`, `Award`, `Gift`, `Target`, `Zap`

## Technical Details

### Icon Processing
```typescript
// Convert Lucide icon to data URL
const iconToDataUrl = (IconComponent: LucideIcon, color: string) => {
  // Render React component to SVG string
  // Convert to data URL for Mapbox
}
```

### Map Layer Structure
```typescript
// Replace text symbol with icon image
mapInstance.addLayer({
  id: 'location-icons',
  type: 'symbol',
  source: 'location-markers',
  layout: {
    'icon-image': ['get', 'iconId'],
    'icon-size': 0.8,
    'icon-allow-overlap': true
  }
})
```

### Benefits
- ✅ **Perfect rendering** in WebGL context
- ✅ **Included in canvas exports**
- ✅ **Scalable** at any resolution
- ✅ **Theme-aware** styling
- ✅ **Professional appearance**
- ✅ **Consistent** across all devices

## Success Criteria
- [x] Icons display correctly in live preview
- [x] Icons appear in exported images
- [x] Chapter builder has good icon selection
- [x] Performance remains good
- [x] All existing functionality preserved

## Files to Modify
- `lib/icon-registry.ts` (new)
- `components/map-creation/map-renderer.tsx`
- `components/map-creation/chapter-builder.tsx`
- `lib/templates/great-loop.ts` (update icon sets)

## Rollback Plan
If issues arise, we can:
1. Keep DOM markers for interactivity
2. Fall back to numbered markers for export
3. Revert to previous emoji approach for preview only 