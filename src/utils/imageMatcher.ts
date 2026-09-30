/**
 * Context-Aware Image Recommendation & Semantic Matcher
 * Maps natural language post text and metadata to high-resolution, relevant photography.
 */

export interface TopicImageConfig {
  category: string;
  keywords: string[];
  imageUrl: string;
  secondaryUrl: string;
  badge: string;
}

export const TOPIC_IMAGE_CATALOG: TopicImageConfig[] = [
  {
    category: 'Healthcare & Medicine',
    keywords: [
      'doctor', 'nurse', 'nursing', 'hospital', 'clinic', 'medical', 'medicine', 'health',
      'patient', 'surgery', 'surgeon', 'healthcare', 'pharma', 'pharmacy', 'dental', 'dentist',
      'physician', 'therapy', 'therapist', 'caregiver', 'clinical'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
    secondaryUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80',
    badge: 'Healthcare & Clinical Care',
  },
  {
    category: 'Fitness & Sports',
    keywords: [
      'gym', 'fitness', 'workout', 'training', 'trainer', 'exercise', 'yoga', 'athlete',
      'crossfit', 'sports', 'football', 'soccer', 'cricket', 'basketball', 'bodybuilding',
      'wellness', 'marathon', 'coach', 'stamina', 'weightloss'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80',
    secondaryUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80',
    badge: 'Fitness & Physical Performance',
  },
  {
    category: 'Education & Learning',
    keywords: [
      'school', 'college', 'university', 'student', 'students', 'teacher', 'teaching', 'tutor',
      'tuition', 'professor', 'education', 'learning', 'course', 'curriculum', 'exam', 'admission',
      'scholarship', 'campus', 'degree', 'masterclass', 'academy', 'coaching', 'study'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
    secondaryUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80',
    badge: 'Education & Academic Program',
  },
  {
    category: 'Finance, Banking & Crypto',
    keywords: [
      'finance', 'banking', 'bank', 'investment', 'investor', 'stocks', 'stock market', 'trading',
      'crypto', 'bitcoin', 'accounting', 'accountant', 'wealth', 'wealth management', 'fund',
      'mutual fund', 'loan', 'credit', 'audit', 'tax', 'financial advisor', 'roi', 'portfolio'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1200&q=80',
    secondaryUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80',
    badge: 'Finance & Capital Strategy',
  },
  {
    category: 'Real Estate & Interior',
    keywords: [
      'real estate', 'property', 'properties', 'villa', 'apartment', 'flat', 'house', 'housing',
      'realtor', 'broker', 'condo', 'penthouse', 'architecture', 'architect', 'interior',
      'construction', 'builder', 'plot', 'estate', 'leasing', 'mortgage'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    secondaryUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    badge: 'Prime Real Estate & Living',
  },
  {
    category: 'Travel, Tourism & Hospitality',
    keywords: [
      'travel', 'tourism', 'tourist', 'hotel', 'resort', 'vacation', 'holiday', 'trip', 'flight',
      'airline', 'destination', 'beach', 'mountain', 'alps', 'explore', 'wanderlust', 'getaway',
      'staycation', 'hospitality', 'israel', 'dubai', 'europe', 'asia', 'switzerland'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80',
    secondaryUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    badge: 'Travel & Global Destination',
  },
  {
    category: 'Culinary, Food & Dining',
    keywords: [
      'food', 'restaurant', 'chef', 'cooking', 'cuisine', 'gourmet', 'dining', 'dinner', 'lunch',
      'breakfast', 'recipe', 'bistro', 'eatery', 'buffet', 'pasta', 'burger', 'pizza', 'sushi',
      'dessert', 'delicious', 'menu', 'meal'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
    secondaryUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
    badge: 'Culinary & Dining Experience',
  },
  {
    category: 'Cafe, Coffee & Bakery',
    keywords: [
      'coffee', 'cafe', 'barista', 'espresso', 'latte', 'cappuccino', 'bakery', 'baker', 'pastry',
      'croissant', 'roaster', 'roastery', 'beans', 'brew', 'matcha', 'tea', 'cake', 'sweets'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80',
    secondaryUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80',
    badge: 'Artisan Coffee & Bakery',
  },
  {
    category: 'Technology, Software & AI',
    keywords: [
      'software', 'developer', 'coding', 'code', 'programmer', 'web development', 'ai',
      'artificial intelligence', 'machine learning', 'saas', 'app', 'mobile app', 'cloud',
      'database', 'devops', 'tech', 'cybersecurity', 'frontend', 'backend', 'fullstack', 'algorithm'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
    secondaryUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
    badge: 'Technology & Digital Innovation',
  },
  {
    category: 'Industrial, Engineering & Machining',
    keywords: [
      'cnc', 'machinist', 'machining', 'factory', 'lathe', 'milling', 'manufacturing',
      'industrial', 'mechanical', 'aerospace', 'automotive parts', 'welder', 'welding',
      'operator', 'technician', 'fabrication', 'precision engineering', 'hardware'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
    secondaryUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80',
    badge: 'Precision Industrial Engineering',
  },
  {
    category: 'Fashion, Beauty & Lifestyle',
    keywords: [
      'fashion', 'clothing', 'apparel', 'outfit', 'style', 'stylist', 'model', 'designer',
      'boutique', 'beauty', 'makeup', 'skincare', 'cosmetics', 'salon', 'haircut', 'hairstylist',
      'jewelry', 'accessories', 'fragrance', 'perfume', 'luxury'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80',
    secondaryUrl: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1200&q=80',
    badge: 'Fashion & Aesthetic Style',
  },
  {
    category: 'Automotive & Mobility',
    keywords: [
      'car', 'cars', 'automobile', 'vehicle', 'automotive', 'electric vehicle', 'ev', 'driving',
      'mechanic', 'garage', 'dealership', 'motorcycle', 'bike', 'speed', 'engine', 'fleet'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80',
    secondaryUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
    badge: 'Automotive & Modern Mobility',
  },
  {
    category: 'Music, Entertainment & Arts',
    keywords: [
      'music', 'concert', 'festival', 'band', 'song', 'singer', 'dj', 'audio', 'sound',
      'musician', 'instrument', 'guitar', 'piano', 'performance', 'show', 'theater', 'dance',
      'entertainment', 'art', 'artist', 'painting', 'gallery', 'exhibition'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
    secondaryUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
    badge: 'Music, Art & Creative Performance',
  },
  {
    category: 'Events, Conferences & Meetups',
    keywords: [
      'event', 'events', 'conference', 'summit', 'webinar', 'seminar', 'workshop', 'keynote',
      'speaker', 'audience', 'meetup', 'gathering', 'convention', 'expo', 'launch event'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
    secondaryUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
    badge: 'Live Event & Keynote Summit',
  },
  {
    category: 'Retail, E-Commerce & Deals',
    keywords: [
      'sale', 'discount', 'deal', 'promo', 'promotion', 'coupon', 'off', 'shopping', 'store',
      'ecommerce', 'e-commerce', 'shop', 'order', 'delivery', 'unboxing', 'collection', 'black friday'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=1200&q=80',
    secondaryUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
    badge: 'Retail & Exclusive Offer',
  },
  {
    category: 'Legal, Justice & Compliance',
    keywords: [
      'lawyer', 'attorney', 'legal', 'law', 'law firm', 'court', 'justice', 'judge', 'advocate',
      'litigation', 'compliance', 'contracts', 'intellectual property', 'patent'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80',
    secondaryUrl: 'https://images.unsplash.com/photo-1453733197781-704fa70b4888?auto=format&fit=crop&w=1200&q=80',
    badge: 'Legal Advocacy & Counsel',
  },
  {
    category: 'Recruitment & Team Hiring',
    keywords: [
      'hiring', 'we are hiring', 'vacancy', 'job opening', 'join our team', 'career', 'careers',
      'talent', 'recruit', 'recruiter', 'recruitment', 'hr', 'interview', 'positions', 'apply now'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=80',
    secondaryUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80',
    badge: 'Talent Acquisition & Career Vacancy',
  },
  {
    category: 'Agriculture, Nature & Sustainability',
    keywords: [
      'farm', 'farming', 'farmer', 'agriculture', 'organic', 'crops', 'harvest', 'nature',
      'environment', 'sustainable', 'sustainability', 'eco', 'green energy', 'solar', 'climate'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80',
    secondaryUrl: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=1200&q=80',
    badge: 'Agriculture & Sustainable Nature',
  },
  {
    category: 'Pets & Veterinary Care',
    keywords: [
      'pet', 'pets', 'dog', 'dogs', 'puppy', 'cat', 'cats', 'kitten', 'veterinary', 'vet',
      'animal', 'animals', 'pet care', 'grooming'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=1200&q=80',
    secondaryUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=1200&q=80',
    badge: 'Pets & Veterinary Wellness',
  },
  {
    category: 'Corporate, Office & Business Strategy',
    keywords: [
      'business', 'corporate', 'office', 'headquarters', 'strategy', 'leadership', 'executive',
      'management', 'company', 'startup', 'growth', 'partnership', 'meeting', 'collaboration'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
    secondaryUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    badge: 'Executive Business Strategy',
  },
];

/**
 * Evaluates text and returns the most relevant topic configuration.
 */
export function matchTopicByContent(content: string = ''): TopicImageConfig {
  const normalized = content.toLowerCase();

  let bestMatch: TopicImageConfig = TOPIC_IMAGE_CATALOG[TOPIC_IMAGE_CATALOG.length - 1]; // Corporate default
  let highestScore = 0;

  for (const topic of TOPIC_IMAGE_CATALOG) {
    let score = 0;
    for (const kw of topic.keywords) {
      // Regex word boundary or substring match
      const regex = new RegExp(`\\b${kw.replace(/\s+/g, '\\s+')}\\b`, 'i');
      if (regex.test(normalized)) {
        score += 3;
      } else if (normalized.includes(kw)) {
        score += 1;
      }
    }

    if (score > highestScore) {
      highestScore = score;
      bestMatch = topic;
    }
  }

  return bestMatch;
}

/**
 * Returns a guaranteed relevant image URL for given text or project media.
 */
export function getRelevantImageUrl(mediaUrl?: string | null, textContent?: string): string {
  if (mediaUrl && mediaUrl.trim().length > 0 && !mediaUrl.includes('placeholder')) {
    return mediaUrl;
  }
  const matched = matchTopicByContent(textContent || '');
  return matched.imageUrl;
}
