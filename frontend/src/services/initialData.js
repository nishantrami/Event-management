// Initial seed data for localStorage

export const IMAGES = {
  events: {
    wedding: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    birthday: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1200&q=80',
    engagement: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1200&q=80',
    anniversary: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
    religious: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1200&q=80',
    corporate: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
    babyshower: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1200&q=80',
    graduation: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80',
    reception: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80',
    special: 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&w=1200&q=80'
  },
  services: {
    mandap1: 'https://images.unsplash.com/photo-1545232979-fbf68fe9b1af?auto=format&fit=crop&w=800&q=80',
    mandap2: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
    mandap3: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80',
    catering1: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=800&q=80',
    catering2: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
    catering3: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    flowers1: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=800&q=80',
    flowers2: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=800&q=80',
    photo1: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=800&q=80',
    music1: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80',
    lighting1: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80',
    seating1: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=800&q=80',
    makeup1: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80'
  },
  preorders: {
    cake: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=600&q=80',
    bouquet: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&w=600&q=80',
    drinks: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80',
    dessert: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=600&q=80',
    gifts: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80',
    cards: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=600&q=80',
    kits: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=600&q=80'
  }
};

export const INITIAL_USERS = [
  {
    _id: 'user_1',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    phone: '+91 98765 43210',
    password: 'password123',
    createdAt: '2026-09-10T10:00:00.000Z'
  },
  {
    _id: 'user_2',
    name: 'Priya Patel',
    email: 'priya.patel@example.com',
    phone: '+91 98220 12345',
    password: 'password123',
    createdAt: '2026-09-15T11:30:00.000Z'
  },
  {
    _id: 'user_3',
    name: 'Amit Verma',
    email: 'amit.verma@example.com',
    phone: '+91 99112 88442',
    password: 'password123',
    createdAt: '2026-09-20T14:15:00.000Z'
  },
  {
    _id: 'user_4',
    name: 'Sneha Kulkarni',
    email: 'sneha.k@example.com',
    phone: '+91 97654 32109',
    password: 'password123',
    createdAt: '2026-10-01T09:45:00.000Z'
  }
];

export const INITIAL_EVENTS = [
  {
    _id: 'evt_1',
    name: 'Wedding',
    slug: 'wedding',
    tagline: 'Your Royal Fairytale Wedding',
    description: 'Wedding planning, decoration, catering, mandap setups, and complete venue services designed for an unforgettable day.',
    icon: 'HeartHandshake',
    image: IMAGES.events.wedding,
    startingPrice: 150000,
    popular: true
  },
  {
    _id: 'evt_2',
    name: 'Birthday Party',
    slug: 'birthday',
    tagline: 'Celebrate Milestones In Style',
    description: 'Vibrant birthday decoration, delicious food, custom themed cake, live entertainment, and creative photography.',
    icon: 'Cake',
    image: IMAGES.events.birthday,
    startingPrice: 25000,
    popular: true
  },
  {
    _id: 'evt_3',
    name: 'Engagement',
    slug: 'engagement',
    tagline: 'The First Step of Forever',
    description: 'Elegantly curated engagement stages, exotic floral styling, ambient lighting, gourmet catering, and candid shots.',
    icon: 'Gem',
    image: IMAGES.events.engagement,
    startingPrice: 65000,
    popular: true
  },
  {
    _id: 'evt_4',
    name: 'Anniversary',
    slug: 'anniversary',
    tagline: 'Cherishing Years of Togetherness',
    description: 'Intimate and romantic atmosphere, candlelight dining setups, bespoke flowers, and acoustic live musical sessions.',
    icon: 'Sparkles',
    image: IMAGES.events.anniversary,
    startingPrice: 35000,
    popular: false
  },
  {
    _id: 'evt_5',
    name: 'Religious Events',
    slug: 'religious',
    tagline: 'Sacred Rituals & Divine Grace',
    description: 'Traditional pooja setups, pure vegetarian catering, traditional seating arrangements, and ceremonial coordination.',
    icon: 'Flame',
    image: IMAGES.events.religious,
    startingPrice: 40000,
    popular: false
  },
  {
    _id: 'evt_6',
    name: 'Corporate Events',
    slug: 'corporate',
    tagline: 'Flawless Business Conventions',
    description: 'Sophisticated corporate venue setup, high-end audio/visual, stage branding, seating, and professional buffet arrangements.',
    icon: 'Building2',
    image: IMAGES.events.corporate,
    startingPrice: 85000,
    popular: true
  },
  {
    _id: 'evt_7',
    name: 'Baby Shower',
    slug: 'baby-shower',
    tagline: 'Welcoming The Little Miracle',
    description: 'Pastel-toned balloon & flower styling, delightful dessert stations, fun party games, and cozy photo booths.',
    icon: 'Baby',
    image: IMAGES.events.babyshower,
    startingPrice: 30000,
    popular: false
  },
  {
    _id: 'evt_8',
    name: 'Graduation',
    slug: 'graduation',
    tagline: 'Honoring Hard Work & Bright Futures',
    description: 'Commencement celebration setups, stage podiums, photo walls, energetic DJ, and celebration banquets.',
    icon: 'GraduationCap',
    image: IMAGES.events.graduation,
    startingPrice: 45000,
    popular: false
  },
  {
    _id: 'evt_9',
    name: 'Reception',
    slug: 'reception',
    tagline: 'Grand Evening of Feasting & Joy',
    description: 'Spectacular reception stages, red carpet entry, multi-cuisine dinner layout, and glamorous lighting effects.',
    icon: 'PartyPopper',
    image: IMAGES.events.reception,
    startingPrice: 110000,
    popular: true
  },
  {
    _id: 'evt_10',
    name: 'Other Special Events',
    slug: 'other',
    tagline: 'Custom Bespoke Celebrations',
    description: 'Tailored event management for festivals, housewarmings, product launches, reunions, and family galas.',
    icon: 'Star',
    image: IMAGES.events.special,
    startingPrice: 30000,
    popular: false
  }
];

export const INITIAL_PACKAGES = [
  {
    _id: 'pkg_1',
    name: 'Basic',
    title: 'Basic Package',
    description: 'Essential services tailored for modest gatherings and budget-friendly quality execution.',
    price: 49999,
    features: [
      'Basic Thematic Decoration',
      'Standard Banquet Seating for Guests',
      'Standard Buffet Food Arrangement',
      'Ambient Warm Lighting Setup',
      'Sound System with Mic Setup',
      '1 Dedicated On-Site Supervisor'
    ],
    popular: false,
    badge: '🌱 Essential Value',
    image: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=800&q=80'
  },
  {
    _id: 'pkg_2',
    name: 'Standard',
    title: 'Standard Package',
    description: 'Our most sought-after package, balancing premium aesthetics with comprehensive event elements.',
    price: 99999,
    features: [
      'Designer Stage & Themed Backdrop',
      'Premium Multi-Cuisine Food Options',
      'Exquisite Stage & Entrance Floral Decoration',
      'Professional Photography & High-Res Album',
      'Enhanced Moving Head & Truss Lighting',
      'Professional DJ Sound System',
      '2 Dedicated Event Coordinators'
    ],
    popular: true,
    badge: '⭐ Most Popular',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80'
  },
  {
    _id: 'pkg_3',
    name: 'Premium',
    title: 'Premium Package',
    description: 'The ultimate luxury celebration experience with bespoke grandeur, coordinators, and VIP treatment.',
    price: 189999,
    features: [
      'Ultra-Luxury Royal Mandap / Designer Stage',
      'Comprehensive Fresh Exotic Floral Styling Throughout',
      'Gourmet Multi-Course Live Catering Counters',
      'Candid Photography + Cinematic 4K Drone Videography',
      'Concert-Grade Intelligent LED Lighting & Smoke/Sparkler FX',
      'Live Musical Band or Celebrity DJ & Anchor',
      'VIP Lounge Furniture & Plush Banquet Seating',
      'Dedicated Master Event Director & Team'
    ],
    popular: false,
    badge: '👑 Premium Luxury',
    image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80'
  }
];

export const INITIAL_SERVICES = [
  {
    _id: 'srv_1',
    name: 'Gujarati Traditional Feast',
    category: 'Food & Catering',
    description: 'Authentic Gujarati Thali including Undhiyu, Dhokla, Shrikhand, Puri, Dal & Farsan.',
    price: 350,
    pricingUnit: 'per_guest',
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80',
    availability: true
  },
  {
    _id: 'srv_2',
    name: 'Punjabi Royal Spread',
    category: 'Food & Catering',
    description: 'Rich North Indian delicacies: Paneer Butter Masala, Dal Makhani, Naan, Pulao & Gulab Jamun.',
    price: 400,
    pricingUnit: 'per_guest',
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80',
    availability: true
  },
  {
    _id: 'srv_3',
    name: 'South Indian Grand Sadhya',
    category: 'Food & Catering',
    description: 'Traditional plantain leaf spread featuring Sambhar, Rasam, Avial, Payasam & Crispy Dosas.',
    price: 300,
    pricingUnit: 'per_guest',
    image: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=800&q=80',
    availability: true
  },
  {
    _id: 'srv_4',
    name: 'Asian & Chinese Delights',
    category: 'Food & Catering',
    description: 'Hakka noodles, Manchurian, fried rice, dim sums, spring rolls and sweet corn soup.',
    price: 350,
    pricingUnit: 'per_guest',
    image: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=800&q=80',
    availability: true
  },
  {
    _id: 'srv_5',
    name: 'Continental & Italian Buffet',
    category: 'Food & Catering',
    description: 'Woodfired pizzas, artisanal pastas, gourmet bruschetta, roasted veggies and tiramisu.',
    price: 500,
    pricingUnit: 'per_guest',
    image: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=800&q=80',
    availability: true
  },
  {
    _id: 'srv_6',
    name: 'Live Evening Snacks Counter',
    category: 'Food & Catering',
    description: 'Pani Puri, Chaat counters, sliders, French fries and hot bite-sized appetizers.',
    price: 150,
    pricingUnit: 'per_guest',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
    availability: true
  },
  {
    _id: 'srv_7',
    name: 'Artisan Dessert & Pastry Bar',
    category: 'Food & Catering',
    description: 'Assorted pastries, brownies, rasmalai mousse, kulfi sticks and fruit tarts.',
    price: 120,
    pricingUnit: 'per_guest',
    image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=800&q=80',
    availability: true
  },
  {
    _id: 'srv_8',
    name: 'Welcome Mocktails & Fresh Juices',
    category: 'Food & Catering',
    description: 'Cool blue lagoon, virgin mojitos, fresh fruit juices and sparkling lemonade upon arrival.',
    price: 80,
    pricingUnit: 'per_guest',
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
    availability: true
  },
  {
    _id: 'srv_9',
    name: 'Traditional Vedic Mandap',
    category: 'Mandap & Stage',
    description: 'Authentic wooden architecture adorned with marigold garlands, brass lamps, and havan setup.',
    price: 45000,
    pricingUnit: 'fixed',
    image: IMAGES.services.mandap1,
    availability: true
  },
  {
    _id: 'srv_10',
    name: 'Royal Palace Mandap',
    category: 'Mandap & Stage',
    description: 'Carved pillars, golden jali backdrops, velvet drapery and grand dome design.',
    price: 85000,
    pricingUnit: 'fixed',
    image: IMAGES.services.mandap2,
    availability: true
  },
  {
    _id: 'srv_11',
    name: 'Floral Canopy Mandap',
    category: 'Mandap & Stage',
    description: 'Full canopy of imported roses, hydrangeas, baby breath and suspended crystal chandeliers.',
    price: 95000,
    pricingUnit: 'fixed',
    image: IMAGES.services.mandap3,
    availability: true
  },
  {
    _id: 'srv_12',
    name: 'Minimalist Contemporary Mandap',
    category: 'Mandap & Stage',
    description: 'Sleek geometric arches with subtle pastel blossoms and warm back-illumination.',
    price: 35000,
    pricingUnit: 'fixed',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    availability: true
  },
  {
    _id: 'srv_13',
    name: 'Grand Reception Stage',
    category: 'Mandap & Stage',
    description: 'Spacious elevated stage with LED backdrop, floral wings, and VIP king/queen sofa seating.',
    price: 60000,
    pricingUnit: 'fixed',
    image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80',
    availability: true
  },
  {
    _id: 'srv_14',
    name: 'Grand Entrance Floral Arch',
    category: 'Flower Decoration',
    description: 'A magnificent welcome tunnel of blooming orchids, carnations, and fragrant tuberoses.',
    price: 25000,
    pricingUnit: 'fixed',
    image: IMAGES.services.flowers1,
    availability: true
  },
  {
    _id: 'srv_15',
    name: 'Mandap Flower Decoration',
    category: 'Flower Decoration',
    description: 'Lush floral pillars, floral ceiling drapery and fragrant marigold trails for the mandap.',
    price: 35000,
    pricingUnit: 'fixed',
    image: IMAGES.services.flowers2,
    availability: true
  },
  {
    _id: 'srv_16',
    name: 'Banquet Table Centerpiece Flowers',
    category: 'Flower Decoration',
    description: 'Set of 20 stylish centerpiece vases with fresh roses, lilies and aromatic greens.',
    price: 15000,
    pricingUnit: 'fixed',
    image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=800&q=80',
    availability: true
  },
  {
    _id: 'srv_17',
    name: 'Standard HD Photography',
    category: 'Photography',
    description: '2 Professional photographers covering key moments with 300+ edited digital high-res photos.',
    price: 20000,
    pricingUnit: 'fixed',
    image: IMAGES.services.photo1,
    availability: true
  },
  {
    _id: 'srv_18',
    name: 'Premium Candid Photography & Video',
    category: 'Photography',
    description: 'Candid specialists capturing spontaneous emotions plus full 1080p documentary video teaser.',
    price: 45000,
    pricingUnit: 'fixed',
    image: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=800&q=80',
    availability: true
  },
  {
    _id: 'srv_19',
    name: 'Drone Aerial 4K Cinematography',
    category: 'Photography',
    description: 'Certified drone pilot capturing majestic bird-eye views of your venue and processions.',
    price: 22000,
    pricingUnit: 'fixed',
    image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80',
    availability: true
  },
  {
    _id: 'srv_20',
    name: 'High-Energy DJ & Sound Setup',
    category: 'Music & Entertainment',
    description: 'Club DJ with Bollywood, EDM and Retro playlists, complete with JBL/RCF subwoofers and console.',
    price: 25000,
    pricingUnit: 'fixed',
    image: IMAGES.services.music1,
    availability: true
  },
  {
    _id: 'srv_21',
    name: 'Live Acoustic & Fusion Band',
    category: 'Music & Entertainment',
    description: '5-piece live musical band singing soulful melodies, Sufi tunes and contemporary pop favorites.',
    price: 40000,
    pricingUnit: 'fixed',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80',
    availability: true
  },
  {
    _id: 'srv_22',
    name: 'Ambient Warm Fairy & Rice Lights',
    category: 'Lighting',
    description: 'Romantic curtain of fairy lights across trees, fences, and ceilings for warm festive glow.',
    price: 15000,
    pricingUnit: 'fixed',
    image: IMAGES.services.lighting1,
    availability: true
  },
  {
    _id: 'srv_23',
    name: 'VIP Maharaja Sofa & Lounge Set',
    category: 'Furniture & Seating',
    description: 'Opulent tufted Chesterfield sofas, coffee tables and velvet lounge chairs for 30 VIP guests.',
    price: 22000,
    pricingUnit: 'fixed',
    image: IMAGES.services.seating1,
    availability: true
  },
  {
    _id: 'srv_24',
    name: 'Luxury HD Bridal Makeup & Hair',
    category: 'Makeup & Beauty',
    description: 'Certified celebrity makeup artist using MAC, Huda Beauty & Dior cosmetics, including draping.',
    price: 25000,
    pricingUnit: 'fixed',
    image: IMAGES.services.makeup1,
    availability: true
  }
];

export const INITIAL_PREORDERS = [
  {
    _id: 'pre_1',
    name: '3-Tier Royal Wedding Cake',
    description: 'Rich Belgian chocolate & red velvet cake garnished with edible gold flakes and fresh flowers.',
    price: 4500,
    image: IMAGES.preorders.cake,
    category: 'Bakery',
    availability: true
  },
  {
    _id: 'pre_2',
    name: 'Fresh Exotic Flower Bouquet',
    description: 'Hand-tied arrangement of Ecuadorian roses, lilies, and gypsophila wrapped in silk paper.',
    price: 1200,
    image: IMAGES.preorders.bouquet,
    category: 'Floral',
    availability: true
  },
  {
    _id: 'pre_3',
    name: 'Welcome Drink Dispenser Keg (50 Servings)',
    description: 'Fresh mint-infused mojito or fruit punch keg for self-service cocktail welcome.',
    price: 2500,
    image: IMAGES.preorders.drinks,
    category: 'Beverages',
    availability: true
  },
  {
    _id: 'pre_4',
    name: 'Gourmet Dessert Platter Counter',
    description: '50 pieces of mini macarons, chocolate truffles, and baklava bites.',
    price: 3200,
    image: IMAGES.preorders.dessert,
    category: 'Sweets',
    availability: true
  },
  {
    _id: 'pre_5',
    name: 'Exclusive Guest Welcome Kits (Pack of 10)',
    description: 'Custom tote bag containing scented candle, sanitizer, mints, wet wipes, and personalized note.',
    price: 2800,
    image: IMAGES.preorders.kits,
    category: 'Favors',
    availability: true
  },
  {
    _id: 'pre_6',
    name: 'Luxury Embossed Return Gift Boxes (Pack of 20)',
    description: 'Gold-foiled rigid boxes filled with roasted dry fruits and traditional silver coin replicas.',
    price: 5000,
    image: IMAGES.preorders.gifts,
    category: 'Favors',
    availability: true
  },
  {
    _id: 'pre_7',
    name: 'Custom Calligraphy Invitation Box (Pack of 5)',
    description: 'Handcrafted wedding invitations with lacquer wax seals and personalized gift jars.',
    price: 1800,
    image: IMAGES.preorders.cards,
    category: 'Stationery',
    availability: true
  }
];

export const INITIAL_SLOTS = [
  {
    _id: 'slot_1',
    eventType: 'Wedding',
    date: '2026-10-17',
    maxCapacity: 3,
    bookedCount: 3,
    status: 'Fully Booked',
    isBlocked: false,
    notes: ''
  },
  {
    _id: 'slot_2',
    eventType: 'Wedding',
    date: '2026-10-18',
    maxCapacity: 3,
    bookedCount: 2,
    status: 'Limited',
    isBlocked: false,
    notes: ''
  },
  {
    _id: 'slot_3',
    eventType: 'Wedding',
    date: '2026-10-19',
    maxCapacity: 3,
    bookedCount: 0,
    status: 'Available',
    isBlocked: false,
    notes: ''
  },
  {
    _id: 'slot_4',
    eventType: 'Wedding',
    date: '2026-10-20',
    maxCapacity: 3,
    bookedCount: 1,
    status: 'Available',
    isBlocked: false,
    notes: ''
  },
  {
    _id: 'slot_5',
    eventType: 'Wedding',
    date: '2026-10-24',
    maxCapacity: 3,
    bookedCount: 3,
    status: 'Fully Booked',
    isBlocked: false,
    notes: ''
  },
  {
    _id: 'slot_6',
    eventType: 'Birthday Party',
    date: '2026-10-17',
    maxCapacity: 3,
    bookedCount: 1,
    status: 'Available',
    isBlocked: false,
    notes: ''
  },
  {
    _id: 'slot_7',
    eventType: 'Birthday Party',
    date: '2026-10-18',
    maxCapacity: 3,
    bookedCount: 3,
    status: 'Fully Booked',
    isBlocked: false,
    notes: ''
  },
  {
    _id: 'slot_8',
    eventType: 'Corporate Events',
    date: '2026-10-22',
    maxCapacity: 3,
    bookedCount: 2,
    status: 'Limited',
    isBlocked: false,
    notes: ''
  }
];

export const INITIAL_BOOKINGS = [
  {
    _id: 'bkg_1',
    userId: 'user_1',
    customer: {
      name: 'Rahul Sharma',
      email: 'rahul.sharma@example.com',
      phone: '+91 98765 43210',
      address: 'MG Road, Bangalore'
    },
    eventType: 'Wedding',
    eventDate: '2026-10-17',
    package: {
      name: 'Premium',
      price: 189999,
      description: 'The ultimate luxury celebration experience',
      features: ['Ultra-Luxury Royal Mandap', 'Gourmet Multi-Course Live Catering', 'Candid Photography + Drone']
    },
    services: [
      {
        name: 'Punjabi Royal Spread',
        category: 'Food & Catering',
        price: 400,
        pricingUnit: 'per_guest',
        quantity: 200,
        total: 80000
      },
      {
        name: 'Floral Canopy Mandap',
        category: 'Mandap & Stage',
        price: 95000,
        pricingUnit: 'fixed',
        quantity: 1,
        total: 95000
      },
      {
        name: 'Drone Aerial 4K Cinematography',
        category: 'Photography',
        price: 22000,
        pricingUnit: 'fixed',
        quantity: 1,
        total: 22000
      }
    ],
    preOrders: [
      {
        name: '3-Tier Royal Wedding Cake',
        price: 4500,
        quantity: 2,
        total: 9000
      },
      {
        name: 'Fresh Exotic Flower Bouquet',
        price: 1200,
        quantity: 5,
        total: 6000
      }
    ],
    guestCount: 200,
    subtotal: 401999,
    discount: 15000,
    taxes: 19349,
    totalAmount: 406348,
    status: 'Confirmed',
    createdAt: '2026-09-28T10:30:00.000Z'
  },
  {
    _id: 'bkg_2',
    userId: 'user_2',
    customer: {
      name: 'Priya Patel',
      email: 'priya.patel@example.com',
      phone: '+91 98220 12345',
      address: 'Bandra West, Mumbai'
    },
    eventType: 'Wedding',
    eventDate: '2026-10-17',
    package: {
      name: 'Standard',
      price: 99999,
      description: 'Our most sought-after package',
      features: ['Designer Stage', 'Premium Multi-Cuisine Food']
    },
    services: [
      {
        name: 'Gujarati Traditional Feast',
        category: 'Food & Catering',
        price: 350,
        pricingUnit: 'per_guest',
        quantity: 150,
        total: 52500
      }
    ],
    preOrders: [],
    guestCount: 150,
    subtotal: 152499,
    discount: 5000,
    taxes: 7374,
    totalAmount: 154873,
    status: 'Confirmed',
    createdAt: '2026-10-01T14:20:00.000Z'
  },
  {
    _id: 'bkg_3',
    userId: 'user_3',
    customer: {
      name: 'Amit Verma',
      email: 'amit.verma@example.com',
      phone: '+91 99112 88442',
      address: 'Sector 44, Gurgaon'
    },
    eventType: 'Wedding',
    eventDate: '2026-10-17',
    package: {
      name: 'Basic',
      price: 49999,
      description: 'Essential services',
      features: ['Basic Thematic Decoration', 'Sound System']
    },
    services: [
      {
        name: 'Standard HD Photography',
        category: 'Photography',
        price: 20000,
        pricingUnit: 'fixed',
        quantity: 1,
        total: 20000
      }
    ],
    preOrders: [],
    guestCount: 80,
    subtotal: 69999,
    discount: 0,
    taxes: 3499,
    totalAmount: 73498,
    status: 'Confirmed',
    createdAt: '2026-10-02T16:00:00.000Z'
  },
  {
    _id: 'bkg_4',
    userId: 'user_4',
    customer: {
      name: 'Sneha Kulkarni',
      email: 'sneha.k@example.com',
      phone: '+91 97654 32109',
      address: 'Kothrud, Pune'
    },
    eventType: 'Wedding',
    eventDate: '2026-10-18',
    package: {
      name: 'Standard',
      price: 99999,
      features: ['Designer Stage', 'Exquisite Florals']
    },
    services: [
      {
        name: 'Royal Palace Mandap',
        category: 'Mandap & Stage',
        price: 85000,
        pricingUnit: 'fixed',
        quantity: 1,
        total: 85000
      }
    ],
    preOrders: [],
    guestCount: 150,
    subtotal: 184999,
    discount: 10000,
    taxes: 8749,
    totalAmount: 183748,
    status: 'Confirmed',
    createdAt: '2026-10-03T11:15:00.000Z'
  },
  {
    _id: 'bkg_5',
    userId: 'user_1',
    customer: {
      name: 'Rahul Sharma',
      email: 'rahul.sharma@example.com',
      phone: '+91 98765 43210',
      address: 'MG Road, Bangalore'
    },
    eventType: 'Wedding',
    eventDate: '2026-10-18',
    package: {
      name: 'Basic',
      price: 49999,
      features: ['Basic Decoration']
    },
    services: [],
    preOrders: [],
    guestCount: 100,
    subtotal: 49999,
    discount: 0,
    taxes: 2500,
    totalAmount: 52499,
    status: 'Confirmed',
    createdAt: '2026-10-04T09:00:00.000Z'
  }
];

export const STATIC_ADMIN = {
  email: 'admin@eventpro.com',
  password: 'Admin@123',
  name: 'Eventora Chief Executive',
  role: 'admin'
};
