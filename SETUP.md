# Minimalist Map Generator - Setup Guide

A beautiful, narrative-driven map generator for creating custom maps suitable for wood engraving and other physical media.

## Quick Start

1. **Clone and Install Dependencies**
   ```bash
   npm install
   ```

2. **Set Up Mapbox (Required for Maps)**
   - Get your free Mapbox access token at [mapbox.com](https://account.mapbox.com/)
   - Create a `.env.local` file in the project root:
   ```bash
   # Required: Your Mapbox access token
   NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_access_token_here
   
   # Optional: Custom map style (defaults to light theme)
   NEXT_PUBLIC_MAPBOX_STYLE_URL=mapbox://styles/mapbox/light-v11
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Open Your Browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Features

### ✨ Narrative Experience
- **Step 1**: Emotional welcome with animated introduction
- **Step 2**: Location input with real-time geocoding
- **Step 3**: Chapter builder with custom markers (icons, emojis, images)
- **Step 4**: Style customization (minimalist, woodburn, vintage themes)
- **Step 5**: Map preview with interactive controls
- **Step 6**: Export interface with multiple formats

### 🗺️ Real Mapping
- **Mapbox Integration**: Real-world accurate maps
- **Location Search**: Powered by Mapbox geocoding API
- **Interactive Controls**: Zoom, pan, marker interaction
- **Custom Markers**: Support for icons, emojis, and custom images
- **Responsive Design**: Works on desktop and mobile

### 🎨 Customization
- **Themes**: Minimalist (white), Woodburn (warm), Vintage (aged)
- **Typography**: Sans-serif, serif, and monospace fonts
- **Stroke Width**: Adjustable line weights for different engraving methods
- **Markers**: Icons, emojis, or custom uploaded images
- **Captions**: Optional text labels for each location

### 📁 Export Options
- **PNG**: High-resolution raster images (2x DPI)
- **SVG**: Scalable vector graphics for editing
- **PDF**: Print-ready documents
- **DXF**: CAD format for laser cutting machines

### 🛒 E-commerce Ready
- **Material Selection**: Wood, metal, acrylic, leather options
- **Size Options**: Standard sizes (5"×5" to 10"×10") or custom dimensions
- **Pricing Integration**: Built-in pricing for engraving services
- **Account System**: User registration and payment processing (Stripe-ready)

## Technical Stack

- **Frontend**: Next.js 15, TypeScript, TailwindCSS
- **UI Components**: Radix UI with shadcn/ui
- **Maps**: Mapbox GL JS with custom styling
- **Animations**: Framer Motion
- **Export**: html2canvas, jsPDF for file generation
- **Icons**: Lucide React

## Environment Variables

```bash
# Required for map functionality
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.ey...

# Optional customizations
NEXT_PUBLIC_MAPBOX_STYLE_URL=mapbox://styles/mapbox/light-v11

# Future: Stripe integration for payments
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
# STRIPE_SECRET_KEY=sk_test_...
```

## Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Other Platforms
Works on any platform that supports Next.js:
- Netlify
- Railway
- AWS Amplify
- Docker

## Usage Examples

### Wedding Anniversary
"Map the journey of our love story - from where we first met to where we said 'I do'"

### Family Heritage
"Trace the path of our family's immigration and settlement across generations"

### Travel Adventures
"Document the places that changed our perspective and shaped who we are"

### Memorial Maps
"Honor loved ones by mapping the places that meant the most to them"

## Customization

### Adding New Themes
Edit `lib/mapbox.ts` and add theme colors:

```typescript
const themeColors = {
  yourTheme: {
    background: '#your-bg-color',
    lines: '#your-line-color', 
    markers: '#your-marker-color',
    text: '#your-text-color'
  }
}
```

### Custom Map Styles
Create custom styles in [Mapbox Studio](https://studio.mapbox.com/) and update the style URL.

### Additional Export Formats
Extend `lib/export.ts` to support new formats like EPS, AI, or custom engraving formats.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Support

- Check [Mapbox documentation](https://docs.mapbox.com/) for mapping issues
- Review [Next.js docs](https://nextjs.org/docs) for framework questions
- Open GitHub issues for bugs or feature requests

## License

MIT License - feel free to use for commercial or personal projects.

---

**Ready to create beautiful story maps? Start by getting your Mapbox token and follow the setup steps above!** 