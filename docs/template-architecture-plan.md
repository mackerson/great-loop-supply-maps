# Template Architecture Implementation Plan

## Overview
Extending the current map creation workflow to support multiple map types and templates, starting with Journey Maps (Great Loop & Appalachian Trail) and setting the foundation for Relationship and Story maps.

## Current State vs. Future State

### Current State
- Single hardcoded "journey" workflow
- Great Loop specific terminology hardcoded into components
- Single Zustand store for one workflow type

### Future State
- Template-driven workflows with community-specific experiences
- Dynamic terminology and prompts based on selected template
- Extensible architecture for adding new map types and templates

## Technical Architecture

### 1. Template System

```typescript
// Core template interface
interface Template {
  id: string
  name: string
  category: 'journey' | 'relationship' | 'story'
  community: string
  config: TemplateConfig
}

interface TemplateConfig {
  prompts: TemplatePrompt[]
  terminology: TemplateTerm[]
  styling: TemplateStyle
  iconSets: IconSet[]
  routeData?: RouteData // For journey maps
  examples: TemplateExample[]
}

// Template-specific prompts
interface TemplatePrompt {
  step: number
  key: string
  text: string
  placeholder?: string
  helpText?: string
}

// Template-specific terminology
interface TemplateTerm {
  key: string
  term: string
  plural?: string
}
```

### 2. Updated Zustand Store

```typescript
interface MapCreationState {
  // Template selection
  selectedTemplate: Template | null
  
  // Current workflow state
  currentStep: number
  
  // Dynamic data based on template
  locations: Location[]
  chapters: Chapter[]
  style: StyleOptions
  preview: PreviewSettings
  
  // Template-specific actions
  setTemplate: (template: Template) => void
  getPromptForStep: (step: number) => string
  getTerminology: (key: string) => string
  
  // ... existing actions remain the same
}
```

### 3. Template Definitions

```typescript
// templates/great-loop.ts
export const greatLoopTemplate: Template = {
  id: 'great-loop',
  name: 'Great Loop',
  category: 'journey',
  community: 'boating',
  config: {
    prompts: [
      {
        step: 1,
        key: 'start_location',
        text: 'Where did your Great Loop adventure begin?',
        placeholder: 'Search for your home port...',
        helpText: 'Start by adding your home port or where you began your Great Loop journey.'
      },
      {
        step: 2,
        key: 'add_stops',
        text: 'What other ports made your Great Loop special?',
        placeholder: 'Search for ports and anchorages...',
        helpText: 'Add more locations and create chapters for each meaningful port or stop.'
      }
    ],
    terminology: [
      { key: 'location', term: 'port', plural: 'ports' },
      { key: 'stop', term: 'anchorage', plural: 'anchorages' },
      { key: 'journey', term: 'Great Loop adventure' },
      { key: 'community', term: 'fellow Loopers' }
    ],
    styling: {
      theme: 'nautical',
      primaryColor: '#1e40af',
      iconStyle: 'nautical'
    },
    iconSets: ['nautical', 'boating', 'maritime'],
    routeData: {
      path: [...], // Great Loop route coordinates
      waypoints: [...], // Common stops and ports
      regions: ['Great Lakes', 'Atlantic Coast', 'Gulf Coast', 'Rivers']
    }
  }
}

// templates/appalachian-trail.ts
export const appalachianTrailTemplate: Template = {
  id: 'appalachian-trail',
  name: 'Appalachian Trail',
  category: 'journey',
  community: 'hiking',
  config: {
    prompts: [
      {
        step: 1,
        key: 'start_location',
        text: 'Where did your AT adventure begin?',
        placeholder: 'Search for your starting trailhead...',
        helpText: 'Start by adding where you began your Appalachian Trail journey.'
      },
      {
        step: 2,
        key: 'add_stops',
        text: 'What trail towns and shelters made your hike special?',
        placeholder: 'Search for trail towns and shelters...',
        helpText: 'Add meaningful stops along your AT journey.'
      }
    ],
    terminology: [
      { key: 'location', term: 'trail town', plural: 'trail towns' },
      { key: 'stop', term: 'shelter', plural: 'shelters' },
      { key: 'journey', term: 'AT thru-hike' },
      { key: 'community', term: 'trail angels' }
    ],
    styling: {
      theme: 'wilderness',
      primaryColor: '#059669',
      iconStyle: 'outdoor'
    },
    iconSets: ['hiking', 'outdoor', 'wilderness'],
    routeData: {
      path: [...], // AT trail coordinates
      waypoints: [...], // Shelters and trail towns
      regions: ['Georgia', 'North Carolina', 'Tennessee', 'Virginia', 'West Virginia', 'Maryland', 'Pennsylvania', 'New Jersey', 'New York', 'Connecticut', 'Massachusetts', 'Vermont', 'New Hampshire', 'Maine']
    }
  }
}
```

### 4. URL Structure

```
/create                          # Template selection
/create/journey                  # Journey map type
/create/journey/great-loop       # Great Loop template workflow
/create/journey/appalachian-trail # AT template workflow
/create/relationship             # Relationship map type
/create/story                    # Story map type
```

### 5. Component Architecture

```typescript
// components/template-selection/
├── map-type-selector.tsx        # Journey, Relationship, Story
├── template-gallery.tsx        # Template previews
├── template-card.tsx           # Individual template cards

// components/map-creation/
├── template-aware-location-input.tsx  # Uses template prompts
├── template-aware-chapter-builder.tsx # Uses template terminology
├── template-aware-style-customizer.tsx # Uses template styling
├── template-aware-map-preview.tsx     # Uses template route data
└── template-aware-export-interface.tsx # Uses template presets
```

## Implementation Strategy

### Phase 1: Template Foundation
1. **Create template system infrastructure**
   - Template interface definitions
   - Template registry and loader
   - Update Zustand store for template support

2. **Implement template selection**
   - Create template selection pages
   - Update routing for template workflows
   - Build template gallery component

3. **Update existing components**
   - Make location-input template-aware
   - Update prompts and terminology dynamically
   - Maintain Great Loop as default

### Phase 2: Multi-Template Support
1. **Create Appalachian Trail template**
   - Define AT template configuration
   - Create AT-specific prompts and terminology
   - Add hiking iconography and styling

2. **Enhance template features**
   - Add route awareness to maps
   - Implement template-specific examples
   - Create template-based export presets

### Phase 3: Map Type Expansion
1. **Add Relationship map type**
   - Create relationship-specific workflow
   - Design couple/family oriented prompts
   - Add relationship iconography

2. **Add Story map type**
   - Create life-event workflow
   - Design milestone-oriented prompts
   - Add general purpose iconography

## Database Schema (Future)

```sql
-- Templates table
CREATE TABLE templates (
  id VARCHAR PRIMARY KEY,
  name VARCHAR NOT NULL,
  category VARCHAR NOT NULL,
  community VARCHAR NOT NULL,
  config JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- User maps table
CREATE TABLE user_maps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id VARCHAR REFERENCES templates(id),
  user_id UUID, -- For future user accounts
  title VARCHAR NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## Success Metrics

### Template Usage
- Template selection distribution
- Completion rates by template
- User satisfaction by template

### Community Engagement
- Great Loop vs AT usage patterns
- Community-specific feature requests
- Template sharing and examples

## Next Steps

1. **Implement template selection UI**
2. **Create template system architecture**
3. **Build Great Loop template (refactor existing)**
4. **Add Appalachian Trail template**
5. **Test multi-template workflows**
6. **Plan relationship and story map types**

---

**Note**: This architecture maintains backward compatibility while enabling the multi-template vision. The current Great Loop implementation becomes the first template in the new system. 