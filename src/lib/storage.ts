import { BrandKit, ConnectedAccount, PlatformId, Project, ScheduledPostItem } from '../types';

const STORAGE_KEYS = {
  PROJECTS: 'postflow_projects',
  BRAND_KIT: 'postflow_brand_kit',
  SCHEDULED_POSTS: 'postflow_scheduled_posts',
  CONNECTED_ACCOUNTS: 'postflow_connected_accounts',
  USER_PREFERENCES: 'postflow_user_preferences',
};

export const DEFAULT_BRAND_KIT: BrandKit = {
  companyName: 'Creator Workspace',
  tagline: 'Multi-Channel Social Publishing',
  logoUrl: '',
  brandColors: ['#8B1E2D', '#A62639', '#1C0E10'],
  website: 'https://example.com',
  phone: '',
  email: '',
  address: '',
  brandVoice: 'Engaging, authentic, and modern with clear value delivery.',
  preferredHashtags: ['#ContentCreator', '#SocialMedia', '#Growth', '#Marketing'],
  defaultCta: 'Visit the link in bio or message us for details!',
  description: 'Digital brand and content creation hub.',
};

export const INITIAL_CONNECTED_ACCOUNTS: ConnectedAccount[] = [
  {
    platform: 'linkedin',
    name: 'LinkedIn Professional Page',
    connected: true,
    username: 'Creator Workspace',
    handle: '@creator_workspace',
    connectedAt: '2026-09-15',
    scopes: ['w_member_social', 'r_organization_social', 'w_organization_social'],
  },
  {
    platform: 'twitter',
    name: 'X (Twitter) Feed',
    connected: true,
    username: 'Creator Workspace',
    handle: '@creator_hub',
    connectedAt: '2026-09-18',
    scopes: ['tweet.read', 'tweet.write', 'users.read'],
  },
  {
    platform: 'instagram',
    name: 'Instagram Business',
    connected: false,
    handle: '@apexprecision',
    scopes: ['instagram_basic', 'instagram_content_publish'],
  },
  {
    platform: 'facebook',
    name: 'Facebook Page',
    connected: false,
    scopes: ['pages_show_list', 'pages_read_engagement', 'pages_manage_posts'],
  },
  {
    platform: 'whatsapp',
    name: 'WhatsApp Business API',
    connected: true,
    username: 'Apex Careers Hotline',
    handle: '+91 98765 43210',
    connectedAt: '2026-09-20',
    scopes: ['whatsapp_business_messaging'],
  },
  {
    platform: 'snapchat',
    name: 'Snapchat Public Profile',
    connected: false,
    scopes: ['snapchat_marketing_api'],
  },
  {
    platform: 'handshake',
    name: 'Handshake University Employer',
    connected: true,
    username: 'Apex Global Careers',
    handle: 'apexprecision-talent',
    connectedAt: '2026-09-22',
    scopes: ['jobs_write', 'applications_read'],
  },
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-cnc-operator-israel',
    title: 'CNC 5-Axis Operator Vacancy (Israel)',
    sourceContent: 'We have an urgent vacancy in Israel for certified CNC 5-axis operators. Salary ₹3 lakh per month. Candidates need minimum 3 years of experience in precision aerospace or medical machining.',
    additionalInputs: {
      companyName: 'Apex Precision Engineering',
      location: 'Tel Aviv, Israel',
      salary: '₹3 Lakh / Month',
      contact: 'WhatsApp: +91 98765 43210 | careers@apexprecision.com',
      cta: 'Apply via WhatsApp or Email today',
      targetAudience: 'Certified CNC Operators & Machinists',
      keywords: 'CNC 5-axis, precision machining, international vacancy, aerospace',
    },
    selectedPlatforms: ['linkedin', 'whatsapp', 'twitter', 'instagram', 'handshake'],
    tone: 'recruitment',
    language: 'english',
    audience: 'job_seekers',
    media: {
      id: 'media-cnc-1',
      url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
      type: 'ai_generated',
      name: 'High-Precision 5-Axis Machining Center',
      prompt: 'Professional industrial photograph of certified CNC operator running 5-axis milling center in clean manufacturing facility',
      aspectRatio: '16:9',
      style: 'Industrial & Engineering',
    },
    createdAt: '2026-09-28T10:30:00.000Z',
    updatedAt: '2026-09-28T10:35:00.000Z',
    status: 'generated',
    platformPosts: {
      linkedin: {
        id: 'li-1',
        platform: 'linkedin',
        hook: 'We are expanding our overseas precision engineering workforce in Israel.',
        body: 'Apex Precision Engineering is actively recruiting certified CNC 5-Axis Operators for our advanced manufacturing facility in Israel.\n\nKey Opportunity Details:\n• Compensation: ₹3,00,000 per month (tax-optimized)\n• Experience: Minimum 3 years in 5-axis aerospace or orthopedic machining\n• Location: Tel Aviv, Israel\n• Benefits: Comprehensive visa sponsorship, accommodation assistance, and annual flight allowances included.',
        cta: 'Interested qualified machinists should email their CV to careers@apexprecision.com or connect directly via WhatsApp: +91 98765 43210.',
        hashtags: ['#CNCJobs', '#AerospaceManufacturing', '#MachinistCareers', '#PrecisionMachining', '#OverseasJobs'],
        fullPost: 'We are expanding our overseas precision engineering workforce in Israel.\n\nApex Precision Engineering is actively recruiting certified CNC 5-Axis Operators for our advanced manufacturing facility in Israel.\n\nKey Opportunity Details:\n• Compensation: ₹3,00,000 per month (tax-optimized)\n• Experience: Minimum 3 years in 5-axis aerospace or orthopedic machining\n• Location: Tel Aviv, Israel\n• Benefits: Comprehensive visa sponsorship, accommodation assistance, and annual flight allowances included.\n\nInterested qualified machinists should email their CV to careers@apexprecision.com or connect directly via WhatsApp: +91 98765 43210.\n\n#CNCJobs #AerospaceManufacturing #MachinistCareers #PrecisionMachining #OverseasJobs',
        characterCount: 820,
        estimatedReadingTimeSeconds: 45,
        status: 'generated',
        versions: [
          {
            version: 1,
            content: 'We are expanding our overseas precision engineering workforce in Israel...',
            hook: 'We are expanding our overseas precision engineering workforce in Israel.',
            body: 'Apex Precision Engineering is actively recruiting certified CNC 5-Axis Operators...',
            cta: 'Interested qualified machinists should email their CV...',
            hashtags: ['#CNCJobs', '#AerospaceManufacturing', '#MachinistCareers'],
            timestamp: '2026-09-28T10:35:00.000Z',
          },
        ],
      },
      whatsapp: {
        id: 'wa-1',
        platform: 'whatsapp',
        hook: '*URGENT OVERSEAS HIRING: CNC 5-AXIS OPERATORS (ISRAEL)*',
        body: '*Apex Precision Engineering* is hiring experienced operators for our Israel facility.\n\n*Key Details:*\n* *Salary:* ₹3 Lakh / month\n* *Experience:* Min. 3 years (5-axis precision machining)\n* *Location:* Israel\n* *Perks:* Visa sponsorship + housing allowance + flights\n\n*Eligibility:*\nMust have verified experience on 5-axis DMG MORI, Mazak, or Hermle controls with micrometer-level tolerances.',
        cta: '*How to Apply:*\nForward your resume to: careers@apexprecision.com\nOr WhatsApp your CV directly to: +91 98765 43210\n\n_Please forward this message to eligible machinist friends!_',
        hashtags: [],
        fullPost: '*URGENT OVERSEAS HIRING: CNC 5-AXIS OPERATORS (ISRAEL)*\n\n*Apex Precision Engineering* is hiring experienced operators for our Israel facility.\n\n*Key Details:*\n* *Salary:* ₹3 Lakh / month\n* *Experience:* Min. 3 years (5-axis precision machining)\n* *Location:* Israel\n* *Perks:* Visa sponsorship + housing allowance + flights\n\n*Eligibility:*\nMust have verified experience on 5-axis DMG MORI, Mazak, or Hermle controls with micrometer-level tolerances.\n\n*How to Apply:*\nForward your resume to: careers@apexprecision.com\nOr WhatsApp your CV directly to: +91 98765 43210\n\n_Please forward this message to eligible machinist friends!_',
        characterCount: 610,
        estimatedReadingTimeSeconds: 30,
        status: 'generated',
        versions: [],
      },
      twitter: {
        id: 'tw-1',
        platform: 'twitter',
        hook: 'Hiring: CNC 5-Axis Operators in Israel.',
        body: '₹3 Lakh/month salary. 3+ years experience in aerospace/medical precision machining required. Visa sponsorship & accommodation provided.',
        cta: 'Apply: careers@apexprecision.com | WhatsApp: +91 98765 43210',
        hashtags: ['#CNCJobs', '#Machinists'],
        fullPost: 'Hiring: CNC 5-Axis Operators in Israel.\n\n₹3 Lakh/month salary. 3+ years experience in aerospace/medical precision machining required. Visa sponsorship & accommodation provided.\n\nApply: careers@apexprecision.com | WhatsApp: +91 98765 43210\n\n#CNCJobs #Machinists',
        characterCount: 268,
        estimatedReadingTimeSeconds: 15,
        status: 'generated',
        versions: [],
      },
      instagram: {
        id: 'ig-1',
        platform: 'instagram',
        hook: 'Big career move for skilled machinists 🚀',
        body: 'We are recruiting certified CNC 5-Axis Operators for our state-of-the-art facility in Israel 🇮🇱\n\n⚙️ Role: CNC 5-Axis Precision Operator\n💰 Salary: ₹3,00,000 / month\n📍 Location: Israel\n🛠️ Experience: 3+ years in high-precision aerospace or medical machining\n✈️ Visa, accommodation allowance & round-trip airfare included!',
        cta: '📩 Send your resume to careers@apexprecision.com or WhatsApp us at +91 98765 43210. Link in bio!',
        hashtags: [
          '#CNC', '#Machinist', '#5AxisCNC', '#MachiningJobs', '#EngineeringCareers',
          '#Manufacturing', '#OverseasOpportunity', '#PrecisionMachining', '#JobOpening',
          '#TechJobs', '#AerospaceEngineering'
        ],
        fullPost: 'Big career move for skilled machinists 🚀\n\nWe are recruiting certified CNC 5-Axis Operators for our state-of-the-art facility in Israel 🇮🇱\n\n⚙️ Role: CNC 5-Axis Precision Operator\n💰 Salary: ₹3,00,000 / month\n📍 Location: Israel\n🛠️ Experience: 3+ years in high-precision aerospace or medical machining\n✈️ Visa, accommodation allowance & round-trip airfare included!\n\n📩 Send your resume to careers@apexprecision.com or WhatsApp us at +91 98765 43210. Link in bio!\n\n#CNC #Machinist #5AxisCNC #MachiningJobs #EngineeringCareers #Manufacturing #OverseasOpportunity #PrecisionMachining #JobOpening #TechJobs #AerospaceEngineering',
        characterCount: 680,
        estimatedReadingTimeSeconds: 35,
        status: 'generated',
        versions: [],
      },
      handshake: {
        id: 'hs-1',
        platform: 'handshake',
        hook: 'International Technical Opportunity: CNC 5-Axis Operator (Israel)',
        body: 'Apex Precision Engineering invites experienced machinists and advanced manufacturing graduates to apply for our specialized CNC 5-Axis machining roles in Israel.\n\nQualifications & Highlights:\n• Compensation: ₹3,00,000 monthly\n• Minimum Experience: 3 years on multi-axis CNC milling centers\n• Domain: High-precision aerospace & biomedical implants\n• Full international relocation support and sponsorship provided.',
        cta: 'Submit your profile via Handshake or email your credentials to careers@apexprecision.com.',
        hashtags: ['#EarlyCareerEngineering', '#ManufacturingJobs', '#CNCMachining'],
        fullPost: 'International Technical Opportunity: CNC 5-Axis Operator (Israel)\n\nApex Precision Engineering invites experienced machinists and advanced manufacturing graduates to apply for our specialized CNC 5-Axis machining roles in Israel.\n\nQualifications & Highlights:\n• Compensation: ₹3,00,000 monthly\n• Minimum Experience: 3 years on multi-axis CNC milling centers\n• Domain: High-precision aerospace & biomedical implants\n• Full international relocation support and sponsorship provided.\n\nSubmit your profile via Handshake or email your credentials to careers@apexprecision.com.\n\n#EarlyCareerEngineering #ManufacturingJobs #CNCMachining',
        characterCount: 690,
        estimatedReadingTimeSeconds: 40,
        status: 'generated',
        versions: [],
      },
      facebook: {
        id: 'fb-1',
        platform: 'facebook',
        hook: 'Exciting overseas career opportunity for skilled CNC machinists!',
        body: 'Apex Precision Engineering has an urgent opening for certified CNC 5-Axis Operators in Israel.\n\nIf you have at least 3 years of hands-on experience working on high-tolerance 5-axis machines, this is your chance to work in a world-class facility.\n\nDetails:\n• Salary: ₹3,00,000 / month\n• Location: Israel\n• Complete visa assistance and accommodation allowance included.',
        cta: 'Please share this with anyone in your network who qualifies! Applications open now via WhatsApp: +91 98765 43210 or email careers@apexprecision.com.',
        hashtags: ['#JobVacancy', '#MachinistJobs', '#OverseasCareers'],
        fullPost: 'Exciting overseas career opportunity for skilled CNC machinists!\n\nApex Precision Engineering has an urgent opening for certified CNC 5-Axis Operators in Israel.\n\nIf you have at least 3 years of hands-on experience working on high-tolerance 5-axis machines, this is your chance to work in a world-class facility.\n\nDetails:\n• Salary: ₹3,00,000 / month\n• Location: Israel\n• Complete visa assistance and accommodation allowance included.\n\nPlease share this with anyone in your network who qualifies! Applications open now via WhatsApp: +91 98765 43210 or email careers@apexprecision.com.\n\n#JobVacancy #MachinistJobs #OverseasCareers',
        characterCount: 660,
        estimatedReadingTimeSeconds: 35,
        status: 'generated',
        versions: [],
      },
      snapchat: {
        id: 'sc-1',
        platform: 'snapchat',
        hook: 'Overseas CNC Job in Israel 🇮🇱 ⚙️',
        body: '₹3L/month salary. 5-Axis CNC pros with 3+ yrs experience. Visa & stay sorted!',
        cta: 'Swipe up or DM for application info!',
        hashtags: [],
        fullPost: 'Overseas CNC Job in Israel 🇮🇱 ⚙️\n₹3L/month salary. 5-Axis CNC pros with 3+ yrs experience. Visa & stay sorted!\nSwipe up or DM for application info!',
        characterCount: 145,
        estimatedReadingTimeSeconds: 10,
        status: 'generated',
        versions: [],
      },
    },
  },
  {
    id: 'proj-artisan-cafe-opening',
    title: 'Artisan Coffee Roastery Grand Opening',
    sourceContent: 'Join us this Saturday for the grand opening of Velvet Bean Roastery! First 100 guests receive a complimentary pour-over and artisan pastry. Live jazz music from 10 AM to 2 PM.',
    additionalInputs: {
      companyName: 'Velvet Bean Roastery',
      location: '142 Market Street, Downtown',
      date: 'Saturday, 10:00 AM',
      cta: 'Tag a coffee lover and RSVP in bio!',
      keywords: 'artisan coffee, grand opening, espresso bar, specialty roast',
    },
    selectedPlatforms: ['instagram', 'facebook', 'twitter', 'whatsapp'],
    tone: 'friendly',
    language: 'english',
    audience: 'general',
    media: {
      id: 'media-cafe-1',
      url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80',
      type: 'preset',
      name: 'Artisan Espresso Bar & Specialty Beans',
      prompt: 'Warm aesthetic cafe bar with barista pouring latte art',
      aspectRatio: '16:9',
      style: 'Culinary Photography',
    },
    createdAt: '2026-09-29T14:20:00.000Z',
    updatedAt: '2026-09-29T14:25:00.000Z',
    status: 'generated',
    platformPosts: {
      instagram: {
        id: 'ig-cafe',
        platform: 'instagram',
        hook: 'Coffee lovers, your new downtown sanctuary is here ☕✨',
        body: 'This Saturday, doors officially open at Velvet Bean Roastery!\n\n📍 142 Market Street, Downtown\n⏰ Saturday from 10:00 AM\n\n🎉 First 100 guests get a FREE single-origin pour-over + fresh flaky artisan pastry on the house.\n🎷 Live acoustic jazz from 10 AM to 2 PM.',
        cta: 'Tag your coffee partner below & see you this Saturday! 👇',
        hashtags: ['#CoffeeLovers', '#ArtisanRoast', '#GrandOpening', '#SpecialtyCoffee', '#LatteArt', '#CafeCulture'],
        fullPost: 'Coffee lovers, your new downtown sanctuary is here ☕✨\n\nThis Saturday, doors officially open at Velvet Bean Roastery!\n\n📍 142 Market Street, Downtown\n⏰ Saturday from 10:00 AM\n\n🎉 First 100 guests get a FREE single-origin pour-over + fresh flaky artisan pastry on the house.\n🎷 Live acoustic jazz from 10 AM to 2 PM.\n\nTag your coffee partner below & see you this Saturday! 👇\n\n#CoffeeLovers #ArtisanRoast #GrandOpening #SpecialtyCoffee #LatteArt #CafeCulture',
        characterCount: 460,
        estimatedReadingTimeSeconds: 25,
        status: 'generated',
        versions: [],
      },
      twitter: {
        id: 'tw-cafe',
        platform: 'twitter',
        hook: 'Velvet Bean Roastery opens THIS Saturday! ☕',
        body: 'First 100 visitors receive a complimentary pour-over & pastry. Live jazz from 10 AM at 142 Market St.',
        cta: 'RT & bring a friend:',
        hashtags: ['#CoffeeLovers', '#Downtown'],
        fullPost: 'Velvet Bean Roastery opens THIS Saturday! ☕ First 100 visitors receive a complimentary pour-over & pastry. Live jazz from 10 AM at 142 Market St.\n\nRT & bring a friend: #CoffeeLovers #Downtown',
        characterCount: 195,
        estimatedReadingTimeSeconds: 15,
        status: 'generated',
        versions: [],
      },
      whatsapp: {
        id: 'wa-cafe',
        platform: 'whatsapp',
        hook: '*☕ GRAND OPENING: VELVET BEAN ROASTERY*',
        body: 'Hey friends! Join us this Saturday at 142 Market Street.\n\n• *Perk:* First 100 guests receive free specialty pour-over + pastry!\n• *Vibe:* Live jazz music (10 AM - 2 PM)\n• *Location:* 142 Market St, Downtown',
        cta: '_Forward this to your weekend coffee crew!_',
        hashtags: [],
        fullPost: '*☕ GRAND OPENING: VELVET BEAN ROASTERY*\n\nHey friends! Join us this Saturday at 142 Market Street.\n\n• *Perk:* First 100 guests receive free specialty pour-over + pastry!\n• *Vibe:* Live jazz music (10 AM - 2 PM)\n• *Location:* 142 Market St, Downtown\n\n_Forward this to your weekend coffee crew!_',
        characterCount: 290,
        estimatedReadingTimeSeconds: 18,
        status: 'generated',
        versions: [],
      },
      facebook: {
        id: 'fb-cafe',
        platform: 'facebook',
        hook: 'We are thrilled to welcome you to Velvet Bean Roastery this Saturday! 🥐☕',
        body: 'After months of crafting our custom roasting profiles, we are opening our doors to our community at 142 Market Street.\n\nCome celebrate with us:\n• First 100 visitors get a free pour-over & house-baked pastry\n• Live acoustic jazz sets\n• Meet our head roaster and sample rare beans',
        cta: 'RSVP and let us know in the comments if you will be stopping by!',
        hashtags: ['#CoffeeCommunity', '#GrandOpening'],
        fullPost: 'We are thrilled to welcome you to Velvet Bean Roastery this Saturday! 🥐☕\n\nAfter months of crafting our custom roasting profiles, we are opening our doors to our community at 142 Market Street.\n\nCome celebrate with us:\n• First 100 visitors get a free pour-over & house-baked pastry\n• Live acoustic jazz sets\n• Meet our head roaster and sample rare beans\n\nRSVP and let us know in the comments if you will be stopping by!\n\n#CoffeeCommunity #GrandOpening',
        characterCount: 470,
        estimatedReadingTimeSeconds: 25,
        status: 'generated',
        versions: [],
      },
    },
  },
  {
    id: 'proj-ai-developer-platform',
    title: 'Cloud AI Developer Suite Release (v2.0)',
    sourceContent: 'Introducing CloudAI Suite 2.0: Instant serverless agent workflows, sub-100ms inference caching, and native TypeScript SDK integration. Free tier now includes 50,000 monthly API calls.',
    additionalInputs: {
      companyName: 'CloudAI Systems',
      price: 'Free tier: 50K API calls',
      cta: 'Start building for free at cloudai.dev',
      keywords: 'developer tools, cloud ai, serverless, typescript, api',
    },
    selectedPlatforms: ['linkedin', 'twitter', 'facebook'],
    tone: 'promotional',
    language: 'english',
    audience: 'developers',
    media: {
      id: 'media-tech-1',
      url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
      type: 'preset',
      name: 'Developer Code & Serverless Cloud Terminal',
      prompt: 'Modern laptop showing elegant code and developer terminal with ambient lighting',
      aspectRatio: '16:9',
      style: 'Technology & SaaS',
    },
    createdAt: '2026-09-29T18:00:00.000Z',
    updatedAt: '2026-09-29T18:10:00.000Z',
    status: 'generated',
    platformPosts: {
      linkedin: {
        id: 'li-tech',
        platform: 'linkedin',
        hook: 'Today, we are launching CloudAI Suite 2.0 to empower engineers building production AI.',
        body: 'Modern developers need fast, reliable infrastructure without DevOps complexity. CloudAI 2.0 delivers:\n\n• Serverless agent orchestration with instant cold starts\n• Global edge caching under 100ms\n• Type-safe TypeScript SDK with automated retry policies\n• Developer-first telemetry dashboard\n\nTo support open innovation, our permanent developer free tier includes 50,000 monthly API calls with zero credit card required.',
        cta: 'Read the technical documentation and deploy your first agent in under 2 minutes: cloudai.dev',
        hashtags: ['#CloudComputing', '#DeveloperTools', '#ArtificialIntelligence', '#SoftwareEngineering', '#TechLaunch'],
        fullPost: 'Today, we are launching CloudAI Suite 2.0 to empower engineers building production AI.\n\nModern developers need fast, reliable infrastructure without DevOps complexity. CloudAI 2.0 delivers:\n\n• Serverless agent orchestration with instant cold starts\n• Global edge caching under 100ms\n• Type-safe TypeScript SDK with automated retry policies\n• Developer-first telemetry dashboard\n\nTo support open innovation, our permanent developer free tier includes 50,000 monthly API calls with zero credit card required.\n\nRead the technical documentation and deploy your first agent in under 2 minutes: cloudai.dev\n\n#CloudComputing #DeveloperTools #ArtificialIntelligence #SoftwareEngineering #TechLaunch',
        characterCount: 760,
        estimatedReadingTimeSeconds: 40,
        status: 'generated',
        versions: [],
      },
      twitter: {
        id: 'tw-tech',
        platform: 'twitter',
        hook: '🚀 CloudAI Suite 2.0 is officially LIVE!',
        body: 'Build production AI agents with sub-100ms caching and native TypeScript SDK. Free tier includes 50k calls/mo.',
        cta: 'Ship now: cloudai.dev',
        hashtags: ['#DevTools', '#BuildInPublic'],
        fullPost: '🚀 CloudAI Suite 2.0 is officially LIVE! Build production AI agents with sub-100ms caching and native TypeScript SDK. Free tier includes 50k calls/mo.\n\nShip now: cloudai.dev #DevTools #BuildInPublic',
        characterCount: 198,
        estimatedReadingTimeSeconds: 12,
        status: 'generated',
        versions: [],
      },
    },
  },
];

export const INITIAL_SCHEDULED_POSTS: ScheduledPostItem[] = [
  {
    id: 'sched-1',
    projectId: 'proj-cnc-operator-israel',
    projectTitle: 'CNC 5-Axis Operator Vacancy (Israel)',
    platform: 'linkedin',
    content: 'We are expanding our overseas precision engineering workforce in Israel...',
    scheduledDate: '2026-10-02',
    scheduledTime: '10:00',
    timezone: 'Asia/Kolkata (IST)',
    status: 'scheduled',
    createdAt: '2026-09-28T10:35:00.000Z',
  },
  {
    id: 'sched-2',
    projectId: 'proj-cnc-operator-israel',
    projectTitle: 'CNC 5-Axis Operator Vacancy (Israel)',
    platform: 'whatsapp',
    content: '*URGENT OVERSEAS HIRING: CNC 5-AXIS OPERATORS (ISRAEL)*...',
    scheduledDate: '2026-10-02',
    scheduledTime: '11:30',
    timezone: 'Asia/Kolkata (IST)',
    status: 'scheduled',
    createdAt: '2026-09-28T10:35:00.000Z',
  },
  {
    id: 'sched-3',
    projectId: 'proj-cnc-operator-israel',
    projectTitle: 'CNC 5-Axis Operator Vacancy (Israel)',
    platform: 'twitter',
    content: 'Hiring: CNC 5-Axis Operators in Israel. ₹3 Lakh/month salary...',
    scheduledDate: '2026-10-03',
    scheduledTime: '16:00',
    timezone: 'Asia/Kolkata (IST)',
    status: 'scheduled',
    createdAt: '2026-09-28T10:35:00.000Z',
  },
];

export function getStoredProjects(): Project[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(INITIAL_PROJECTS));
      return INITIAL_PROJECTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_PROJECTS;
  }
}

export function saveProjects(projects: Project[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  } catch (err) {
    console.error('Failed to save projects to localStorage:', err);
  }
}

export function saveSingleProject(project: Project): void {
  const current = getStoredProjects();
  const existingIdx = current.findIndex((p) => p.id === project.id);
  if (existingIdx >= 0) {
    current[existingIdx] = project;
  } else {
    current.unshift(project);
  }
  saveProjects(current);
}

export function deleteProject(projectId: string): Project[] {
  const current = getStoredProjects();
  const updated = current.filter((p) => p.id !== projectId);
  saveProjects(updated);
  return updated;
}

export function duplicateProject(projectId: string): Project | null {
  const current = getStoredProjects();
  const found = current.find((p) => p.id === projectId);
  if (!found) return null;

  const duplicated: Project = {
    ...JSON.parse(JSON.stringify(found)),
    id: `proj-${Date.now()}`,
    title: `${found.title} (Copy)`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  current.unshift(duplicated);
  saveProjects(current);
  return duplicated;
}

export function getStoredBrandKit(): BrandKit {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BRAND_KIT);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.BRAND_KIT, JSON.stringify(DEFAULT_BRAND_KIT));
      return DEFAULT_BRAND_KIT;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_BRAND_KIT;
  }
}

export function saveBrandKit(brandKit: BrandKit): void {
  try {
    localStorage.setItem(STORAGE_KEYS.BRAND_KIT, JSON.stringify(brandKit));
  } catch (err) {
    console.error('Failed to save brand kit:', err);
  }
}

export function getStoredScheduledPosts(): ScheduledPostItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SCHEDULED_POSTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.SCHEDULED_POSTS, JSON.stringify(INITIAL_SCHEDULED_POSTS));
      return INITIAL_SCHEDULED_POSTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_SCHEDULED_POSTS;
  }
}

export function saveScheduledPosts(items: ScheduledPostItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SCHEDULED_POSTS, JSON.stringify(items));
  } catch (err) {
    console.error('Failed to save scheduled posts:', err);
  }
}

export function getStoredConnectedAccounts(): ConnectedAccount[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CONNECTED_ACCOUNTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.CONNECTED_ACCOUNTS, JSON.stringify(INITIAL_CONNECTED_ACCOUNTS));
      return INITIAL_CONNECTED_ACCOUNTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_CONNECTED_ACCOUNTS;
  }
}

export function saveConnectedAccounts(accounts: ConnectedAccount[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CONNECTED_ACCOUNTS, JSON.stringify(accounts));
  } catch (err) {
    console.error('Failed to save connected accounts:', err);
  }
}
