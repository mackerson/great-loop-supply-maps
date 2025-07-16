import { Template } from '../templates'

export const greatLoopTemplate: Template = {
  id: 'great-loop',
  name: 'Great Loop',
  category: 'journey',
  community: 'boating',
  description: 'Document your Great Loop adventure around America\'s Great Loop waterway system',
  preview: {
    tagline: 'Chart your Great Loop adventure',
    locations: ['Home port', 'Favorite anchorage', 'Memorable marina', 'Final destination'],
    image: '/templates/great-loop-preview.jpg'
  },
  config: {
    prompts: [
      {
        step: 1,
        key: 'start_location',
        title: 'Where did your Great Loop adventure begin?',
        description: 'Start by adding your home port or where you began your Great Loop journey.',
        placeholder: 'Search for your home port...',
        helpText: 'This could be your home marina, the first port where you started your loop, or any meaningful starting point.'
      },
      {
        step: 2,
        key: 'add_chapters',
        title: 'What ports made your Great Loop special?',
        description: 'Add the anchorages, marinas, and ports that tell the story of your adventure.',
        placeholder: 'Search for ports and anchorages...',
        helpText: 'Include memorable stops, favorite anchorages, ports with great stories, or places where you met fellow Loopers.'
      },
      {
        step: 3,
        key: 'customize_style',
        title: 'Customize your nautical map',
        description: 'Choose colors and styling that capture the spirit of your Great Loop journey.',
        helpText: 'Nautical themes work great for framing in your boat cabin or home.'
      },
      {
        step: 4,
        key: 'preview_map',
        title: 'Preview your Great Loop map',
        description: 'See how your adventure looks and make final adjustments.',
        helpText: 'This map will be perfect for your boat cabin, home office, or as a gift for fellow Loopers.'
      },
      {
        step: 5,
        key: 'download_map',
        title: 'Download your Great Loop keepsake',
        description: 'Get your custom map in the perfect format for display or engraving.',
        helpText: 'Popular choices include high-resolution prints for framing or SVG files for custom engraving.'
      }
    ],
    terminology: [
      { key: 'location', term: 'port', plural: 'ports' },
      { key: 'stop', term: 'anchorage', plural: 'anchorages' },
      { key: 'journey', term: 'Great Loop adventure' },
      { key: 'community', term: 'fellow Loopers' },
      { key: 'route', term: 'waterway' },
      { key: 'waypoint', term: 'marina' },
      { key: 'destination', term: 'harbor' },
      { key: 'path', term: 'channel' },
      { key: 'marker', term: 'buoy' },
      { key: 'guide', term: 'chart' }
    ],
    styling: {
      theme: 'nautical',
      primaryColor: '#1e40af', // Deep blue
      secondaryColor: '#0ea5e9', // Light blue
      iconStyle: 'nautical',
      font: 'font-serif'
    },
    iconSets: [
      {
        id: 'nautical-primary',
        name: 'Nautical Icons',
        icons: [
          { id: 'anchor', name: 'Anchor', category: 'nautical', symbol: '⚓' },
          { id: 'sailboat', name: 'Sailboat', category: 'nautical', symbol: '⛵' },
          { id: 'ship', name: 'Ship', category: 'nautical', symbol: '🚢' },
          { id: 'compass', name: 'Compass', category: 'nautical', symbol: '🧭' },
          { id: 'lighthouse', name: 'Lighthouse', category: 'nautical', symbol: '🗼' },
          { id: 'buoy', name: 'Buoy', category: 'nautical', symbol: '🛟' },
          { id: 'wheel', name: 'Ship Wheel', category: 'nautical', symbol: '⚙️' },
          { id: 'flag', name: 'Flag', category: 'nautical', symbol: '🏴' }
        ]
      },
      {
        id: 'locations',
        name: 'Location Markers',
        icons: [
          { id: 'home', name: 'Home', category: 'location', symbol: '🏠' },
          { id: 'marina', name: 'Marina', category: 'location', symbol: '🏖️' },
          { id: 'city', name: 'City', category: 'location', symbol: '🏙️' },
          { id: 'bridge', name: 'Bridge', category: 'location', symbol: '🌉' },
          { id: 'sunset', name: 'Sunset', category: 'location', symbol: '🌅' },
          { id: 'star', name: 'Star', category: 'location', symbol: '⭐' },
          { id: 'heart', name: 'Heart', category: 'location', symbol: '❤️' },
          { id: 'pin', name: 'Pin', category: 'location', symbol: '📍' }
        ]
      }
    ],
    routeData: {
      regions: [
        'Great Lakes',
        'Illinois River',
        'Mississippi River', 
        'Tennessee River',
        'Mobile Bay',
        'Gulf of Mexico',
        'Atlantic Intracoastal Waterway',
        'Chesapeake Bay',
        'Delaware Bay',
        'Hudson River',
        'Erie Canal',
        'Trent-Severn Waterway'
      ],
      bounds: {
        north: 49.0,
        south: 24.0,
        east: -66.0,
        west: -125.0
      },
      waypoints: [
        { id: 'chicago', name: 'Chicago', coordinates: [-87.6298, 41.8781], type: 'waypoint', description: 'Gateway to the Great Lakes' },
        { id: 'mobile', name: 'Mobile', coordinates: [-88.0399, 30.6954], type: 'waypoint', description: 'Mobile Bay entrance' },
        { id: 'norfolk', name: 'Norfolk', coordinates: [-76.2859, 36.8508], type: 'waypoint', description: 'Chesapeake Bay hub' },
        { id: 'new-york', name: 'New York', coordinates: [-74.0060, 40.7128], type: 'waypoint', description: 'Hudson River entrance' }
      ]
    },
    examples: [
      {
        id: 'classic-loop',
        title: 'Classic Great Loop',
        description: 'A traditional clockwise loop starting from Chicago',
        locations: ['Chicago', 'Mobile', 'Key West', 'Norfolk', 'New York', 'Buffalo', 'Chicago'],
        previewImage: '/examples/classic-loop.jpg'
      },
      {
        id: 'southern-route',
        title: 'Southern Emphasis',
        description: 'Focus on Gulf Coast and Southern waterways',
        locations: ['New Orleans', 'Mobile', 'Tampa', 'Miami', 'Charleston', 'Norfolk'],
        previewImage: '/examples/southern-route.jpg'
      },
      {
        id: 'great-lakes-focus',
        title: 'Great Lakes Adventure',
        description: 'Emphasis on the Great Lakes region',
        locations: ['Chicago', 'Mackinac Island', 'Detroit', 'Cleveland', 'Buffalo', 'Toronto'],
        previewImage: '/examples/great-lakes.jpg'
      }
    ]
  }
} 