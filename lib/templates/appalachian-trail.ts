import { Template } from '../templates'

export const appalachianTrailTemplate: Template = {
  id: 'appalachian-trail',
  name: 'Appalachian Trail',
  category: 'journey',
  community: 'hiking',
  description: 'Document your Appalachian Trail thru-hike or section hiking adventure',
  preview: {
    tagline: 'Map your trail journey',
    locations: ['Starting trailhead', 'Favorite shelter', 'Trail town stop', 'Summit achievement'],
    image: '/templates/appalachian-trail-preview.jpg'
  },
  config: {
    prompts: [
      {
        step: 1,
        key: 'start_location',
        title: 'Where did your AT adventure begin?',
        description: 'Start by adding your starting trailhead or where you began your Appalachian Trail journey.',
        placeholder: 'Search for your starting trailhead...',
        helpText: 'This could be Springer Mountain, Mount Katahdin, or any trailhead where you started your section hike.'
      },
      {
        step: 2,
        key: 'add_chapters',
        title: 'What trail towns and shelters made your hike special?',
        description: 'Add the shelters, trail towns, and peaks that tell the story of your hiking adventure.',
        placeholder: 'Search for trail towns and shelters...',
        helpText: 'Include memorable shelters, trail towns with great trail magic, challenging peaks, or places where you met amazing trail family.'
      },
      {
        step: 3,
        key: 'customize_style',
        title: 'Customize your wilderness map',
        description: 'Choose colors and styling that capture the spirit of your trail experience.',
        helpText: 'Wilderness themes work great for framing at home or as a gift for fellow hikers.'
      },
      {
        step: 4,
        key: 'preview_map',
        title: 'Preview your trail map',
        description: 'See how your hiking adventure looks and make final adjustments.',
        helpText: 'This map will be perfect for your home, office, or as a gift for your trail family.'
      },
      {
        step: 5,
        key: 'download_map',
        title: 'Download your trail keepsake',
        description: 'Get your custom map in the perfect format for display or engraving.',
        helpText: 'Popular choices include high-resolution prints for framing or SVG files for custom engraving.'
      }
    ],
    terminology: [
      { key: 'location', term: 'trail town', plural: 'trail towns' },
      { key: 'stop', term: 'shelter', plural: 'shelters' },
      { key: 'journey', term: 'AT thru-hike' },
      { key: 'community', term: 'trail angels' },
      { key: 'route', term: 'trail' },
      { key: 'waypoint', term: 'trailhead' },
      { key: 'destination', term: 'summit' },
      { key: 'path', term: 'trail section' },
      { key: 'marker', term: 'blaze' },
      { key: 'guide', term: 'trail guide' }
    ],
    styling: {
      theme: 'wilderness',
      primaryColor: '#059669', // Forest green
      secondaryColor: '#10b981', // Light green
      iconStyle: 'outdoor',
      font: 'font-sans'
    },
    iconSets: [
      {
        id: 'hiking-primary',
        name: 'Hiking Icons',
        icons: [
          { id: 'hiking-boot', name: 'Hiking Boot', category: 'hiking', symbol: '🥾' },
          { id: 'mountain', name: 'Mountain', category: 'hiking', symbol: '⛰️' },
          { id: 'tent', name: 'Tent', category: 'hiking', symbol: '⛺' },
          { id: 'backpack', name: 'Backpack', category: 'hiking', symbol: '🎒' },
          { id: 'compass', name: 'Compass', category: 'hiking', symbol: '🧭' },
          { id: 'tree', name: 'Tree', category: 'hiking', symbol: '🌲' },
          { id: 'campfire', name: 'Campfire', category: 'hiking', symbol: '🔥' },
          { id: 'binoculars', name: 'Binoculars', category: 'hiking', symbol: '🔭' }
        ]
      },
      {
        id: 'trail-markers',
        name: 'Trail Markers',
        icons: [
          { id: 'trail-marker', name: 'Trail Marker', category: 'trail', symbol: '📍' },
          { id: 'shelter', name: 'Shelter', category: 'trail', symbol: '🏠' },
          { id: 'water', name: 'Water Source', category: 'trail', symbol: '💧' },
          { id: 'peak', name: 'Peak', category: 'trail', symbol: '🏔️' },
          { id: 'bridge', name: 'Bridge', category: 'trail', symbol: '🌉' },
          { id: 'vista', name: 'Vista', category: 'trail', symbol: '🌅' },
          { id: 'star', name: 'Star', category: 'trail', symbol: '⭐' },
          { id: 'heart', name: 'Heart', category: 'trail', symbol: '❤️' }
        ]
      }
    ],
    routeData: {
      regions: [
        'Georgia',
        'North Carolina',
        'Tennessee',
        'Virginia',
        'West Virginia',
        'Maryland',
        'Pennsylvania',
        'New Jersey',
        'New York',
        'Connecticut',
        'Massachusetts',
        'Vermont',
        'New Hampshire',
        'Maine'
      ],
      bounds: {
        north: 45.9,
        south: 34.6,
        east: -68.2,
        west: -84.8
      },
      waypoints: [
        { id: 'springer', name: 'Springer Mountain', coordinates: [-84.279, 34.627], type: 'start', description: 'Southern terminus of the AT' },
        { id: 'blood-mountain', name: 'Blood Mountain', coordinates: [-83.934, 34.737], type: 'waypoint', description: 'Highest peak in Georgia' },
        { id: 'clingmans-dome', name: 'Clingmans Dome', coordinates: [-83.498, 35.563], type: 'waypoint', description: 'Highest point on the AT' },
        { id: 'mcafee-knob', name: 'McAfee Knob', coordinates: [-80.078, 37.378], type: 'waypoint', description: 'Most photographed spot on the AT' },
        { id: 'harpers-ferry', name: 'Harpers Ferry', coordinates: [-77.740, 39.325], type: 'waypoint', description: 'Psychological halfway point' },
        { id: 'katahdin', name: 'Mount Katahdin', coordinates: [-69.269, 45.904], type: 'end', description: 'Northern terminus of the AT' }
      ]
    },
    examples: [
      {
        id: 'thru-hike',
        title: 'Complete Thru-Hike',
        description: 'A full northbound thru-hike from Georgia to Maine',
        locations: ['Springer Mountain', 'Blood Mountain', 'Clingmans Dome', 'McAfee Knob', 'Harpers Ferry', 'Mount Katahdin'],
        previewImage: '/examples/thru-hike.jpg'
      },
      {
        id: 'section-hike',
        title: 'Virginia Section',
        description: 'Section hiking through Virginia',
        locations: ['Shenandoah National Park', 'McAfee Knob', 'Dragons Tooth', 'Mount Rogers'],
        previewImage: '/examples/virginia-section.jpg'
      },
      {
        id: 'new-england',
        title: 'New England Trail',
        description: 'The challenging northern states',
        locations: ['Mount Washington', 'Franconia Ridge', 'Mount Katahdin', 'Hanover'],
        previewImage: '/examples/new-england.jpg'
      }
    ]
  }
} 