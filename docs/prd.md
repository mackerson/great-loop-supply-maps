**Product Requirements Document: Minimalist Map Generator for Wood Engraving**

---

**Overview**
The Minimalist Map Generator is a web-based tool designed for users who want to create custom, downloadable maps with marked locations and minimal visual clutter. These maps will be suitable for physical media, such as wood engraving, screen printing, or decorative posters. The design emphasizes simplicity, emotional storytelling, and high-contrast readability.

---

**Goals**

* Provide a narrative-driven, step-by-step user experience that helps users tell a personal story through place.
* Allow users to input one or more significant locations.
* Generate a map with minimal clutter: major roads, place names, and landmarks only.
* Allow users to place custom markers on each location, selecting from a variety of preset icons (e.g., hearts, stars, pins), emojis, or uploading their own custom images for maximum personalization and utility.
* Export maps as high-resolution images suitable for physical engraving, including options for transparent backgrounds, vector paths (SVG) optimized for laser cutting, and potential support for formats like PDF or DXF depending on end-use requirements.

---

**User Stories**

1. As a user, when I begin creating my map, I want to feel a sense of emotional reflection so I can thoughtfully choose locations meaningful to my personal story.
2. As a user, I want a visually elegant, narrative-driven experience so that creating my map feels as special as the memories it represents.
3. As a user, I want clear, engaging guidance at each step to ensure the final engraving is visually appealing and emotionally resonant.
4. As a user, I want to download a PNG, SVG, PDF, or DXF of the final map so I can use it for engraving.

---

**Narrative Experience Flow**

* **Welcome Page**: “Every Place Tells a Story”

  * Brief emotional introduction and inspiring examples (e.g., weddings, anniversaries, family heirlooms).
  * Minimalist aesthetic with soft animated map illustration.
  * CTA: “Begin Your Story.”

* **Step 1: Choosing Your Moments**

  * Prompt: “Where did your journey begin?”
  * User adds first location with reflective prompt (e.g., “Your hometown,” “Where you met”).
  * Area of the map softly transitions into focus.

* **Step 2: Adding Chapters**

  * Prompt: “What other moments made your story special?”
  * Add multiple locations; each treated as a chapter.
  * Choose unique icon/emoji for each.
  * Short optional caption (e.g., “Where we said yes”).
  * Side panel elegantly displays each marker and caption.

* **Step 3: Customize the Look and Feel**

  * Prompt: “Personalize your narrative.”
  * Theme selection: minimalist, woodburn, vintage paper, inverted.
  * Font options optimized for engraving.
  * Stroke width and resolution previews for engraving clarity.

* **Step 4: Preview Your Story**

  * Prompt: “See your journey come to life.”
  * Interactive map preview with poetic caption option.
  * Recommendations for engraving material (e.g., “Perfect on cherry wood”).

* **Step 5: Download Your Keepsake**

  * Prompt: “Preserve your memories forever.”
  * Download options: PNG, SVG, PDF, DXF.
  * Optional suggestions for engraving services and DIY tips.
  * Personalized export message (e.g., “Perfect as an anniversary gift.”)

---

**Core Features**

* **Location Input**: Autocomplete search bar for location input (Mapbox, Google Maps, or similar).
* **Map Rendering**:

  * Minimalist tile styling (OSM tiles via Mapbox Studio or custom raster tiles).
  * Suppress small roads, parks, terrain, and water bodies unless toggled.
  * High-contrast black-and-white or monochrome themes.
* **Custom Marker Placement**:

  * Drop icons (e.g., hearts, stars) on entered locations.
  * Optional marker labels (e.g., “Where we met”), with support for rich text formatting (custom fonts, sizes, and orientation).
* **Viewport Controls**:

  * Auto-zoom to fit all markers.
  * Manual zoom and pan.
* **Export Options**:

  * Download map as PNG, SVG, PDF, or DXF.
  * Set canvas size (e.g., 8x10, 12x12 inches).
  * Choose orientation (portrait/landscape).

---

**Tech Stack**

* **Frontend**: Next.js, TailwindCSS, TypeScript
* **Mapping**: Mapbox GL JS with custom Mapbox Studio style
* **Backend/Storage**: Optional (e.g., Neon for user-saved maps or auth)
* **Deployment**: Vercel
* **Payment Integration**: Stripe (for future premium features)

---

**Stretch Features (Post-MVP)**

* Save/load custom maps with user accounts
* Advanced styling (e.g., vintage paper background)
* Integration with laser cutter presets
* API for programmatic map generation
* Poetic summary generation via GPT

---

**Design Notes**

* Prioritize legibility: large font sizes, few competing elements
* Offer one-click style toggles (monochrome, inverted, woodburn)
* Enable grid-free design for clean edge-to-edge rendering, with support for bleed margins and custom crop marks
* Smooth page-to-page transitions evoking a “turning pages” metaphor
* Minimal but elegant animations to support continuity and refinement

---

**Open Questions**

* Should we support street-level views, or limit to zoom levels 4–10?
* Do we need to account for engraving tolerances (e.g., stroke weight vs burn depth)?
* Should maps be geocentered on markers, bounding box, or custom?
* Will we offer downloadable vector data (e.g., JSON/GeoJSON overlays)?
* Should poetic summaries be AI-generated, user-written, or both?

---

**Next Steps**

* Prototype narrative UX flow with page-turn transitions
* Define minimal tile style via Mapbox Studio
* Build out frontend with basic map+marker rendering
* Prototype export flow (SVG/PNG/PDF/DXF canvas capture)
* Validate engraving output needs and UX coaching content

---

**Notes** Use cases may include: weddings, anniversaries, ports of call, memorials, custom gifts, local art prints. Fonts and styles should be easily brandable for future white-labeling or API use. Focus on emotional storytelling through places, not just map generation.
