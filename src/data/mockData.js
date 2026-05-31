// ROADWATCH AI - Multi-Country Mock Database
// Supporting: India, USA, UK, Australia, UAE

export const COUNTRIES = {
  IN: {
    name: "India",
    currency: "₹",
    currencyCode: "INR",
    flag: "🇮🇳",
    center: [12.9915, 80.2337], // IIT Madras / Chennai
    zoom: 14,
    roadTypes: ["National Highway (NH)", "State Highway (SH)", "Major District Road (MDR)", "Urban Arterial"],
    authorities: [
      "National Highways Authority of India (NHAI)",
      "State Highways Department (Tamil Nadu)",
      "Greater Chennai Corporation (GCC)",
      "Chennai Metropolitan Development Authority (CMDA)"
    ]
  },
  US: {
    name: "USA",
    currency: "$",
    currencyCode: "USD",
    flag: "🇺🇸",
    center: [40.7580, -73.9855], // Times Square / NYC
    zoom: 14,
    roadTypes: ["Interstate Highway", "US Route", "State Route", "City Boulevard", "Local Avenue"],
    authorities: [
      "Federal Highway Administration (FHWA)",
      "New York State Department of Transportation (NYSDOT)",
      "NYC Department of Transportation (NYCDOT)",
      "Port Authority of NY & NJ"
    ]
  },
  GB: {
    name: "UK",
    currency: "£",
    currencyCode: "GBP",
    flag: "🇬🇧",
    center: [51.5074, -0.1278], // Trafalgar Square / London
    zoom: 14,
    roadTypes: ["Motorway (M)", "A-Road", "B-Road", "Local Street"],
    authorities: [
      "National Highways (UK)",
      "Transport for London (TfL)",
      "City of Westminster Council",
      "Greater London Authority (GLA)"
    ]
  },
  AU: {
    name: "Australia",
    currency: "$",
    currencyCode: "AUD",
    flag: "🇦🇺",
    center: [-33.8688, 151.2093], // Sydney CBD
    zoom: 14,
    roadTypes: ["National Highway", "State Highway", "Arterial Road", "Local Street"],
    authorities: [
      "Infrastructure Australia",
      "Transport for NSW (TfNSW)",
      "City of Sydney Council",
      "Roads & Maritime Services"
    ]
  },
  AE: {
    name: "UAE",
    currency: "AED ",
    currencyCode: "AED",
    flag: "🇦🇪",
    center: [25.0805, 55.1403], // Dubai Marina
    zoom: 14,
    roadTypes: ["Federal Highway (E)", "Emirate Highway (D)", "Arterial Road", "Residential Street"],
    authorities: [
      "Federal Transport Authority (FTA)",
      "Roads and Transport Authority (RTA) - Dubai",
      "Dubai Municipality",
      "Abu Dhabi Department of Municipalities and Transport"
    ]
  }
};

export const CONTRACTORS = [
  {
    id: "c-1",
    name: "Vajra Infrastructure Ltd",
    rating: 4.2,
    roadsMaintained: 12,
    complaintCount: 14,
    resolvedCount: 12,
    budgetSpent: 45000000,
    budgetAllocated: 50000000,
    qualityScore: 84,
    riskScore: 28, // Low
    countries: ["IN"]
  },
  {
    id: "c-2",
    name: "Apex Roads & Infra",
    rating: 2.1,
    roadsMaintained: 8,
    complaintCount: 42,
    resolvedCount: 15,
    budgetSpent: 89000000,
    budgetAllocated: 92000000,
    qualityScore: 45,
    riskScore: 88, // High - Excessive spending & high complaints & low quality
    countries: ["IN", "AE"]
  },
  {
    id: "c-3",
    name: "L&T Infrastructure",
    rating: 4.8,
    roadsMaintained: 24,
    complaintCount: 9,
    resolvedCount: 9,
    budgetSpent: 125000000,
    budgetAllocated: 130000000,
    qualityScore: 95,
    riskScore: 8, // Low
    countries: ["IN", "AE"]
  },
  {
    id: "c-4",
    name: "Empire State Paving Corp",
    rating: 4.5,
    roadsMaintained: 15,
    complaintCount: 12,
    resolvedCount: 11,
    budgetSpent: 28000000,
    budgetAllocated: 30000000,
    qualityScore: 90,
    riskScore: 15, // Low
    countries: ["US"]
  },
  {
    id: "c-5",
    name: "Gotham Asphalt Group",
    rating: 1.8,
    roadsMaintained: 6,
    complaintCount: 56,
    resolvedCount: 20,
    budgetSpent: 62000000,
    budgetAllocated: 65000000,
    qualityScore: 38,
    riskScore: 92, // High
    countries: ["US"]
  },
  {
    id: "c-6",
    name: "Thames Highway Builders Ltd",
    rating: 4.6,
    roadsMaintained: 18,
    complaintCount: 8,
    resolvedCount: 8,
    budgetSpent: 38000000,
    budgetAllocated: 40000000,
    qualityScore: 92,
    riskScore: 12, // Low
    countries: ["GB"]
  },
  {
    id: "c-7",
    name: "Albion Roadworks Ltd",
    rating: 2.5,
    roadsMaintained: 9,
    complaintCount: 31,
    resolvedCount: 14,
    budgetSpent: 54000000,
    budgetAllocated: 56000000,
    qualityScore: 52,
    riskScore: 74, // High
    countries: ["GB"]
  },
  {
    id: "c-8",
    name: "Trans-Pacific Builders",
    rating: 4.4,
    roadsMaintained: 14,
    complaintCount: 16,
    resolvedCount: 15,
    budgetSpent: 42000000,
    budgetAllocated: 45000000,
    qualityScore: 88,
    riskScore: 18, // Low
    countries: ["AU"]
  },
  {
    id: "c-9",
    name: "Southern Cross Highways",
    rating: 2.8,
    roadsMaintained: 11,
    complaintCount: 29,
    resolvedCount: 18,
    budgetSpent: 68000000,
    budgetAllocated: 70000000,
    qualityScore: 61,
    riskScore: 65, // Medium
    countries: ["AU"]
  },
  {
    id: "c-10",
    name: "Arabian Peninsula Paving (APP)",
    rating: 4.9,
    roadsMaintained: 20,
    complaintCount: 4,
    resolvedCount: 4,
    budgetSpent: 110000000,
    budgetAllocated: 112000000,
    qualityScore: 97,
    riskScore: 5, // Low
    countries: ["AE"]
  }
];

export const MOCK_ROADS = {
  IN: [
    {
      id: "in-road-1",
      name: "Sardar Patel Road",
      type: "Urban Arterial",
      coordinates: [
        [13.0076, 80.2208],
        [13.0070, 80.2255],
        [13.0035, 80.2372],
        [12.9972, 80.2505]
      ],
      contractorId: "c-2", // Apex Roads - High Risk
      constructionDate: "2024-04-10",
      lastRelayingDate: "2025-11-20", // Frequent repair
      repairHistory: [
        { date: "2024-10-15", type: "Pothole Patching", cost: 450000 },
        { date: "2025-05-18", type: "Crack Resurfacing", cost: 1200000 },
        { date: "2025-11-20", type: "Micro-surfacing", cost: 3500000 }
      ],
      budgetSanctioned: 18000000,
      budgetUtilized: 17800000,
      authority: "Greater Chennai Corporation (GCC)",
      qualityScore: 48,
      transparencyScore: 32,
      riskLevel: "High", // Excessive repairs, poor quality
      complaintCount: 18,
      waterloggingRisk: "High",
      potholesCount: 12,
      cracksCount: 6
    },
    {
      id: "in-road-2",
      name: "Rajiv Gandhi Salai (OMR)",
      type: "State Highway (SH)",
      coordinates: [
        [12.9972, 80.2505],
        [12.9850, 80.2490],
        [12.9650, 80.2482],
        [12.9450, 80.2470]
      ],
      contractorId: "c-3", // L&T - Low Risk
      constructionDate: "2022-01-15",
      lastRelayingDate: "2024-06-10",
      repairHistory: [
        { date: "2024-06-10", type: "Scheduled Top-layer Relaying", cost: 8500000 }
      ],
      budgetSanctioned: 45000000,
      budgetUtilized: 42000000,
      authority: "State Highways Department (Tamil Nadu)",
      qualityScore: 92,
      transparencyScore: 95,
      riskLevel: "Low",
      complaintCount: 2,
      waterloggingRisk: "Low",
      potholesCount: 0,
      cracksCount: 2
    },
    {
      id: "in-road-3",
      name: "Gandhi Mandapam Road",
      type: "Major District Road (MDR)",
      coordinates: [
        [13.0118, 80.2372],
        [13.0035, 80.2372],
        [12.9912, 80.2325]
      ],
      contractorId: "c-1", // Vajra - Low Risk
      constructionDate: "2023-08-12",
      lastRelayingDate: "2024-09-05",
      repairHistory: [
        { date: "2024-09-05", type: "Joint repair", cost: 600000 }
      ],
      budgetSanctioned: 9500000,
      budgetUtilized: 8900000,
      authority: "Greater Chennai Corporation (GCC)",
      qualityScore: 82,
      transparencyScore: 85,
      riskLevel: "Low",
      complaintCount: 4,
      waterloggingRisk: "Medium",
      potholesCount: 2,
      cracksCount: 2
    },
    {
      id: "in-road-4",
      name: "Velachery Main Road",
      type: "Urban Arterial",
      coordinates: [
        [12.9912, 80.2325],
        [12.9810, 80.2250],
        [12.9705, 80.2185]
      ],
      contractorId: "c-2", // Apex Roads - High Risk
      constructionDate: "2023-11-20",
      lastRelayingDate: "2025-08-14",
      repairHistory: [
        { date: "2024-11-12", type: "Pothole Filling", cost: 850000 },
        { date: "2025-08-14", type: "Emergency Patching", cost: 2300000 }
      ],
      budgetSanctioned: 14000000,
      budgetUtilized: 16500000, // Budget Overrun!
      authority: "Greater Chennai Corporation (GCC)",
      qualityScore: 54,
      transparencyScore: 40,
      riskLevel: "High", // Overrun budget + poor quality
      complaintCount: 15,
      waterloggingRisk: "High",
      potholesCount: 9,
      cracksCount: 6
    },
    {
      id: "in-road-5",
      name: "IIT Madras Internal Bypass",
      type: "Major District Road (MDR)",
      coordinates: [
        [12.9922, 80.2339],
        [12.9901, 80.2301],
        [12.9840, 80.2330],
        [12.9860, 80.2410]
      ],
      contractorId: "c-3", // L&T
      constructionDate: "2023-01-01",
      lastRelayingDate: "2025-01-01",
      repairHistory: [
        { date: "2025-01-01", type: "Preventative Maintenance", cost: 500000 }
      ],
      budgetSanctioned: 5000000,
      budgetUtilized: 4800000,
      authority: "Chennai Metropolitan Development Authority (CMDA)",
      qualityScore: 96,
      transparencyScore: 98,
      riskLevel: "Low",
      complaintCount: 0,
      waterloggingRisk: "Low",
      potholesCount: 0,
      cracksCount: 0
    }
  ],
  US: [
    {
      id: "us-road-1",
      name: "Broadway",
      type: "City Boulevard",
      coordinates: [
        [40.7645, -73.9825],
        [40.7580, -73.9855],
        [40.7484, -73.9890],
        [40.7360, -73.9910]
      ],
      contractorId: "c-5", // Gotham Asphalt - High Risk
      constructionDate: "2023-03-15",
      lastRelayingDate: "2025-04-20",
      repairHistory: [
        { date: "2024-02-12", type: "Utility Cut Restoration", cost: 180000 },
        { date: "2024-09-05", type: "Pothole Patching", cost: 250000 },
        { date: "2025-04-20", type: "Resurfacing Section B", cost: 1400000 }
      ],
      budgetSanctioned: 8500000,
      budgetUtilized: 9200000, // Overrun
      authority: "NYC Department of Transportation (NYCDOT)",
      qualityScore: 40,
      transparencyScore: 35,
      riskLevel: "High",
      complaintCount: 32,
      waterloggingRisk: "Medium",
      potholesCount: 22,
      cracksCount: 10
    },
    {
      id: "us-road-2",
      name: "FDR Drive",
      type: "State Route",
      coordinates: [
        [40.7650, -73.9550],
        [40.7540, -73.9610],
        [40.7410, -73.9720],
        [40.7300, -73.9740]
      ],
      contractorId: "c-4", // Empire State - Low Risk
      constructionDate: "2021-08-10",
      lastRelayingDate: "2024-10-12",
      repairHistory: [
        { date: "2024-10-12", type: "Asphalt Overlaid & Barrier repair", cost: 6500000 }
      ],
      budgetSanctioned: 22000000,
      budgetUtilized: 21500000,
      authority: "New York State Department of Transportation (NYSDOT)",
      qualityScore: 91,
      transparencyScore: 94,
      riskLevel: "Low",
      complaintCount: 3,
      waterloggingRisk: "Low",
      potholesCount: 1,
      cracksCount: 2
    },
    {
      id: "us-road-3",
      name: "5th Avenue",
      type: "City Boulevard",
      coordinates: [
        [40.7680, -73.9720],
        [40.7580, -73.9780],
        [40.7485, -73.9850],
        [40.7410, -73.9890]
      ],
      contractorId: "c-4", // Empire State
      constructionDate: "2023-05-01",
      lastRelayingDate: "2025-01-20",
      repairHistory: [
        { date: "2025-01-20", type: "Manhole collar repairs", cost: 400000 }
      ],
      budgetSanctioned: 11000000,
      budgetUtilized: 10800000,
      authority: "NYC Department of Transportation (NYCDOT)",
      qualityScore: 86,
      transparencyScore: 89,
      riskLevel: "Low",
      complaintCount: 6,
      waterloggingRisk: "Low",
      potholesCount: 2,
      cracksCount: 4
    },
    {
      id: "us-road-4",
      name: "42nd Street",
      type: "Local Avenue",
      coordinates: [
        [40.7595, -74.0020],
        [40.7580, -73.9855],
        [40.7550, -73.9700]
      ],
      contractorId: "c-5", // Gotham - High Risk
      constructionDate: "2022-09-10",
      lastRelayingDate: "2024-11-30",
      repairHistory: [
        { date: "2023-04-18", type: "Utility excavation patch", cost: 550000 },
        { date: "2024-03-22", type: "Emergency pothole sweep", cost: 150000 },
        { date: "2024-11-30", type: "Segment Milling & Filling", cost: 2100000 }
      ],
      budgetSanctioned: 7000000,
      budgetUtilized: 8400000, // Budget Overrun
      authority: "NYC Department of Transportation (NYCDOT)",
      qualityScore: 50,
      transparencyScore: 42,
      riskLevel: "High",
      complaintCount: 25,
      waterloggingRisk: "High",
      potholesCount: 17,
      cracksCount: 8
    }
  ],
  GB: [
    {
      id: "gb-road-1",
      name: "Piccadilly",
      type: "A-Road",
      coordinates: [
        [51.5065, -0.1450],
        [51.5074, -0.1340],
        [51.5100, -0.1300]
      ],
      contractorId: "c-7", // Albion - High Risk
      constructionDate: "2023-02-14",
      lastRelayingDate: "2025-02-28",
      repairHistory: [
        { date: "2024-01-20", type: "Drain cover replacement", cost: 120000 },
        { date: "2024-07-15", type: "Emergency patching", cost: 350000 },
        { date: "2025-02-28", type: "Interim surface relaying", cost: 2400000 }
      ],
      budgetSanctioned: 5200000,
      budgetUtilized: 5800000, // Overrun
      authority: "City of Westminster Council",
      qualityScore: 51,
      transparencyScore: 45,
      riskLevel: "High",
      complaintCount: 24,
      waterloggingRisk: "High",
      potholesCount: 16,
      cracksCount: 8
    },
    {
      id: "gb-road-2",
      name: "Westminster Bridge Road",
      type: "A-Road",
      coordinates: [
        [51.5008, -0.1250],
        [51.5015, -0.1170],
        [51.5020, -0.1110]
      ],
      contractorId: "c-6", // Thames - Low Risk
      constructionDate: "2022-07-22",
      lastRelayingDate: "2024-08-15",
      repairHistory: [
        { date: "2024-08-15", type: "Full resurfacing & waterproofing", cost: 4200000 }
      ],
      budgetSanctioned: 15000000,
      budgetUtilized: 14200000,
      authority: "Transport for London (TfL)",
      qualityScore: 94,
      transparencyScore: 96,
      riskLevel: "Low",
      complaintCount: 1,
      waterloggingRisk: "Low",
      potholesCount: 0,
      cracksCount: 1
    },
    {
      id: "gb-road-3",
      name: "Regent Street",
      type: "A-Road",
      coordinates: [
        [51.5140, -0.1415],
        [51.5100, -0.1400],
        [51.5074, -0.1340]
      ],
      contractorId: "c-6", // Thames
      constructionDate: "2023-06-10",
      lastRelayingDate: "2025-03-01",
      repairHistory: [
        { date: "2025-03-01", type: "Utility work patching", cost: 300000 }
      ],
      budgetSanctioned: 8000000,
      budgetUtilized: 7900000,
      authority: "City of Westminster Council",
      qualityScore: 89,
      transparencyScore: 92,
      riskLevel: "Low",
      complaintCount: 4,
      waterloggingRisk: "Low",
      potholesCount: 1,
      cracksCount: 3
    }
  ],
  AU: [
    {
      id: "au-road-1",
      name: "George Street",
      type: "Arterial Road",
      coordinates: [
        [51.5074, -0.1278], // Wait, Sydney center is -33.8688, 151.2093. Let's fix coordinate alignment.
        [-33.8580, 151.2070],
        [-33.8650, 151.2065],
        [-33.8730, 151.2060],
        [-33.8820, 151.2030]
      ],
      contractorId: "c-9", // Southern Cross - Medium Risk
      constructionDate: "2023-01-20",
      lastRelayingDate: "2025-01-15",
      repairHistory: [
        { date: "2024-04-12", type: "Tram track joint sealing", cost: 400000 },
        { date: "2025-01-15", type: "General repaving", cost: 3800000 }
      ],
      budgetSanctioned: 18000000,
      budgetUtilized: 19500000,
      authority: "City of Sydney Council",
      qualityScore: 68,
      transparencyScore: 60,
      riskLevel: "Medium",
      complaintCount: 16,
      waterloggingRisk: "Medium",
      potholesCount: 10,
      cracksCount: 6
    },
    {
      id: "au-road-2",
      name: "Cahill Expressway",
      type: "National Highway",
      coordinates: [
        [-33.8590, 151.2130],
        [-33.8610, 151.2105],
        [-33.8625, 151.2075],
        [-33.8650, 151.2065]
      ],
      contractorId: "c-8", // Trans-Pacific - Low Risk
      constructionDate: "2021-05-18",
      lastRelayingDate: "2024-11-20",
      repairHistory: [
        { date: "2024-11-20", type: "Concrete slab grinding & sealing", cost: 7200000 }
      ],
      budgetSanctioned: 25000000,
      budgetUtilized: 24300000,
      authority: "Transport for NSW (TfNSW)",
      qualityScore: 92,
      transparencyScore: 95,
      riskLevel: "Low",
      complaintCount: 2,
      waterloggingRisk: "Low",
      potholesCount: 0,
      cracksCount: 2
    }
  ],
  AE: [
    {
      id: "ae-road-1",
      name: "Sheikh Zayed Road",
      type: "Federal Highway (E)",
      coordinates: [
        [25.0930, 55.1520],
        [25.0805, 55.1403],
        [25.0680, 55.1290],
        [25.0500, 55.1150]
      ],
      contractorId: "c-10", // Arabian Peninsula - Low Risk
      constructionDate: "2020-04-10",
      lastRelayingDate: "2025-02-10",
      repairHistory: [
        { date: "2025-02-10", type: "Asphalt overlay & smart loop sensors", cost: 18500000 }
      ],
      budgetSanctioned: 85000000,
      budgetUtilized: 84000000,
      authority: "Roads and Transport Authority (RTA) - Dubai",
      qualityScore: 98,
      transparencyScore: 97,
      riskLevel: "Low",
      complaintCount: 1,
      waterloggingRisk: "Low",
      potholesCount: 0,
      cracksCount: 1
    },
    {
      id: "ae-road-2",
      name: "Al Marsa Street",
      type: "Emirate Highway (D)",
      coordinates: [
        [25.0760, 55.1325],
        [25.0805, 55.1403],
        [25.0840, 55.1480]
      ],
      contractorId: "c-2", // Apex Roads - High Risk
      constructionDate: "2023-04-10",
      lastRelayingDate: "2025-01-20",
      repairHistory: [
        { date: "2024-03-12", type: "Minor joint alignment", cost: 950000 },
        { date: "2024-08-18", type: "Water drainage repair", cost: 2300000 },
        { date: "2025-01-20", type: "Asphalt replacement", cost: 6800000 }
      ],
      budgetSanctioned: 12000000,
      budgetUtilized: 15400000, // Extreme overrun
      authority: "Roads and Transport Authority (RTA) - Dubai",
      qualityScore: 60,
      transparencyScore: 50,
      riskLevel: "High", // Budget overrun, repetitive repairs
      complaintCount: 12,
      waterloggingRisk: "High",
      potholesCount: 4,
      cracksCount: 8
    }
  ]
};

export const MOCK_COMPLAINTS = [
  {
    id: "RW-101",
    roadId: "in-road-1",
    roadName: "Sardar Patel Road",
    defectType: "Pothole",
    description: "Deep pothole near IIT Madras In-gate, causes traffic deceleration and safety hazards.",
    locationName: "Near IIT Madras main gate",
    coordinates: [13.0068, 80.2220],
    severity: "Critical",
    status: "Routed to Authority",
    country: "IN",
    reporterName: "Dr. R. Ramanujam",
    dateSubmitted: "2026-05-28",
    image: "demo_pothole_1.jpg",
    timeline: [
      { status: "Reported", date: "2026-05-28", comment: "Citizen report registered via mobile." },
      { status: "AI Analyzed", date: "2026-05-28", comment: "Visual scan: Pothole detected, 14cm depth. Severity: Critical." },
      { status: "Routed to Authority", date: "2026-05-29", comment: "Assigned to GCC Ward Engineer (Zone 13)." }
    ]
  },
  {
    id: "RW-102",
    roadId: "in-road-1",
    roadName: "Sardar Patel Road",
    defectType: "Waterlogging",
    description: "Severe water collection under the Guindy Flyover after moderate rains, blocking the left lane.",
    locationName: "Under Guindy Flyover",
    coordinates: [13.0075, 80.2210],
    severity: "High",
    status: "Resolution Tracking",
    country: "IN",
    reporterName: "Ananya Swaminathan",
    dateSubmitted: "2026-05-25",
    image: "demo_waterlogging_1.jpg",
    timeline: [
      { status: "Reported", date: "2026-05-25", comment: "Logged with photo." },
      { status: "AI Analyzed", date: "2026-05-25", comment: "Flooding depth estimated at 12 inches." },
      { status: "Routed to Authority", date: "2026-05-26", comment: "Routed to Stormwater Drain Dept, GCC." },
      { status: "In Progress", date: "2026-05-27", comment: "Silt cleaning team dispatched to clear blockages." },
      { status: "Resolution Tracking", date: "2026-05-30", comment: "Drainage cleared. Checking for recurrence." }
    ]
  },
  {
    id: "RW-103",
    roadId: "in-road-4",
    roadName: "Velachery Main Road",
    defectType: "Road Cracks",
    description: "Long structural cracks stretching across 15 meters. Creating uneven pavement.",
    locationName: "Near Guru Nanak College",
    coordinates: [12.9802, 80.2245],
    severity: "Medium",
    status: "Reported",
    country: "IN",
    reporterName: "Ganesh Kumar",
    dateSubmitted: "2026-05-31",
    image: "demo_crack_1.jpg",
    timeline: [
      { status: "Reported", date: "2026-05-31", comment: "Citizen report uploaded." }
    ]
  },
  {
    id: "RW-104",
    roadId: "us-road-1",
    roadName: "Broadway",
    defectType: "Pothole",
    description: "Deep tire-damaging pothole in the bike lane of Broadway, near 46th St intersection.",
    locationName: "Broadway & W 46th St",
    coordinates: [40.7585, -73.9850],
    severity: "Critical",
    status: "In Progress",
    country: "US",
    reporterName: "Sarah Jenkins",
    dateSubmitted: "2026-05-26",
    image: "demo_pothole_bike.jpg",
    timeline: [
      { status: "Reported", date: "2026-05-26", comment: "Bike commuter report." },
      { status: "AI Analyzed", date: "2026-05-26", comment: "Deep hazard in high traffic bike zone: Critical." },
      { status: "Routed to Authority", date: "2026-05-27", comment: "Assigned to Manhattan Paving Crew #4." },
      { status: "In Progress", date: "2026-05-29", comment: "Crew scheduled for cold patch filling tonight." }
    ]
  },
  {
    id: "RW-105",
    roadId: "ae-road-2",
    roadName: "Al Marsa Street",
    defectType: "Missing Signboard",
    description: "Speed limit sign and lane warning sign knocked down after an accident, creating confusion.",
    locationName: "Opposite Marina Mall",
    coordinates: [25.0780, 55.1380],
    severity: "Medium",
    status: "Resolved",
    country: "AE",
    reporterName: "Ahmed Al Mansoori",
    dateSubmitted: "2026-05-20",
    image: "demo_sign.jpg",
    timeline: [
      { status: "Reported", date: "2026-05-20", comment: "Report logged." },
      { status: "AI Analyzed", date: "2026-05-20", comment: "Regulatory speed indicator missing: Medium risk." },
      { status: "Routed to Authority", date: "2026-05-21", comment: "Routed to RTA Signage & Markings dept." },
      { status: "In Progress", date: "2026-05-23", comment: "Work order dispatched for replacement board install." },
      { status: "Resolved", date: "2026-05-25", comment: "New speed limit sign successfully installed and audited." }
    ]
  }
];

// Helper to calculate statistics for a given country
export const getCountryStats = (countryCode, roads = MOCK_ROADS[countryCode], complaints = MOCK_COMPLAINTS.filter(c => c.country === countryCode)) => {
  const totalBudgetSanctioned = roads.reduce((sum, r) => sum + r.budgetSanctioned, 0);
  const totalBudgetUtilized = roads.reduce((sum, r) => sum + r.budgetUtilized, 0);
  const totalRoads = roads.length;
  const totalComplaints = complaints.length;
  const resolvedComplaints = complaints.filter(c => c.status === "Resolved").length;
  const pendingComplaints = totalComplaints - resolvedComplaints;
  
  const highRiskRoads = roads.filter(r => r.riskLevel === "High").length;
  
  // Calculate average quality score
  const avgQuality = totalRoads > 0 ? Math.round(roads.reduce((sum, r) => sum + r.qualityScore, 0) / totalRoads) : 0;
  
  // Calculate average transparency score
  const avgTransparency = totalRoads > 0 ? Math.round(roads.reduce((sum, r) => sum + r.transparencyScore, 0) / totalRoads) : 0;

  return {
    totalBudgetSanctioned,
    totalBudgetUtilized,
    totalRoads,
    totalComplaints,
    resolvedComplaints,
    pendingComplaints,
    highRiskRoads,
    avgQuality,
    avgTransparency
  };
};
