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
          { id: 'anchor', name: 'Anchor', category: 'nautical', symbol: '⚓', svgIcon: 'Anchor' },
          { id: 'compass', name: 'Compass', category: 'nautical', symbol: '🧭', svgIcon: 'Compass' },
          { id: 'car', name: 'Car', category: 'nautical', symbol: '🚗', svgIcon: 'Car' },
          { id: 'flag', name: 'Flag', category: 'nautical', symbol: '🏴', svgIcon: 'Flag' }
        ]
      },
      {
        id: 'locations',
        name: 'Location Markers', 
        icons: [
          { id: 'home', name: 'Home', category: 'location', symbol: '🏠', svgIcon: 'Home' },
          { id: 'mappin', name: 'Map Pin', category: 'location', symbol: '📍', svgIcon: 'MapPin' },
          { id: 'star', name: 'Star', category: 'location', symbol: '⭐', svgIcon: 'Star' },
          { id: 'heart', name: 'Heart', category: 'location', symbol: '❤️', svgIcon: 'Heart' },
          { id: 'camera', name: 'Camera', category: 'location', symbol: '📷', svgIcon: 'Camera' },
          { id: 'coffee', name: 'Coffee', category: 'location', symbol: '☕', svgIcon: 'Coffee' },
          { id: 'music', name: 'Music', category: 'location', symbol: '🎵', svgIcon: 'Music' },
          { id: 'smile', name: 'Smile', category: 'location', symbol: '😊', svgIcon: 'Smile' }
        ]
      }
    ],
    routeData: {
      // Simplified Great Loop path - major segments of the waterway system
      path: [
        // Starting from Chicago, going south via Illinois River
        [-87.6298, 41.8781], // Chicago
        [-87.7006, 41.7781], // Chicago River to Lake Michigan
        [-87.9073, 41.5781], // Cal-Sag Channel
        [-88.0814, 41.4075], // Illinois Waterway
        [-88.2434, 41.3114], // Joliet
        [-89.0937, 40.6931], // Peoria
        [-89.6501, 39.7817], // Springfield area
        [-90.1994, 38.8906], // St. Louis area
        [-90.1848, 38.6270], // Mississippi River confluence
        
        // Down the Mississippi River
        [-89.6787, 36.9014], // Cape Girardeau
        [-89.9287, 35.1495], // Memphis
        [-91.1871, 32.2988], // Vicksburg
        [-91.4043, 30.4515], // Baton Rouge
        [-90.0715, 29.9511], // New Orleans
        
        // Through Gulf Coast
        [-89.4012, 30.3813], // Mississippi Sound
        [-88.0399, 30.6954], // Mobile Bay
        [-87.6169, 30.3835], // Pensacola
        [-84.9877, 29.6516], // Apalachicola
        [-84.1557, 30.4518], // Tallahassee area
        [-82.5515, 27.7676], // Tampa Bay
        [-81.8019, 26.5020], // Fort Myers
        [-81.0784, 25.7617], // Key Largo
        [-80.1918, 25.7617], // Miami
        
        // Up the Atlantic Coast (ICW)
        [-80.0328, 26.7056], // Fort Lauderdale
        [-80.0533, 27.0648], // West Palm Beach
        [-80.2706, 27.9506], // Stuart
        [-80.8426, 28.5383], // Space Coast
        [-81.0212, 29.2108], // Daytona
        [-81.3924, 29.9012], // St. Augustine
        [-81.4639, 30.5013], // Jacksonville
        [-80.9018, 31.9996], // Savannah
        [-79.9311, 32.7765], // Charleston
        [-78.9382, 33.6890], // Myrtle Beach
        [-77.9447, 34.2257], // Wilmington
        [-76.6413, 34.7199], // Outer Banks
        [-76.2859, 36.8508], // Norfolk/Chesapeake Bay
        
        // Up Chesapeake Bay
        [-76.4951, 38.9717], // Annapolis
        [-76.6122, 39.2904], // Baltimore
        [-75.5277, 39.7391], // Delaware Bay
        [-74.7429, 40.2206], // Atlantic City area
        [-74.0060, 40.7128], // New York Harbor
        
        // Up Hudson River
        [-73.9282, 41.3456], // West Point
        [-73.6854, 42.6864], // Albany
        [-73.7562, 43.2994], // Champlain Canal (north)
        
        // Erie Canal system (west)
        [-73.7562, 42.9864], // Troy
        [-74.3754, 42.8142], // Schenectady
        [-74.9254, 42.8142], // Amsterdam
        [-75.3254, 42.8142], // Little Falls
        [-76.1474, 43.0481], // Syracuse
        [-77.6088, 43.1564], // Rochester
        [-78.8784, 43.0962], // Buffalo/Niagara
        
        // Great Lakes - Lake Erie
        [-79.0377, 42.8864], // Erie, PA
        [-81.6943, 41.4993], // Cleveland
        [-82.7326, 41.7370], // Toledo area
        [-83.0302, 42.3314], // Detroit River
        
        // Great Lakes - connecting waterways
        [-82.6282, 45.7640], // Sault Ste. Marie
        [-84.3273, 46.5197], // Mackinac Straits
        [-85.6681, 45.3311], // Traverse City area
        [-86.4526, 44.2619], // Ludington
        [-87.0073, 43.0389], // Milwaukee
        [-87.6298, 41.8781]  // Back to Chicago
      ],
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