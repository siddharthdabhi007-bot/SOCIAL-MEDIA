export type PlatformId =
  | 'instagram'
  | 'facebook'
  | 'linkedin'
  | 'twitter'
  | 'whatsapp'
  | 'snapchat'
  | 'handshake';

export type ToneType =
  | 'auto'
  | 'professional'
  | 'friendly'
  | 'casual'
  | 'luxury'
  | 'promotional'
  | 'educational'
  | 'motivational'
  | 'urgent'
  | 'funny'
  | 'genz'
  | 'corporate'
  | 'recruitment'
  | 'minimal'
  | 'inspirational';

export type LanguageType =
  | 'auto'
  | 'english'
  | 'hindi'
  | 'gujarati'
  | 'spanish'
  | 'french'
  | 'german'
  | 'arabic'
  | 'english_gujarati'
  | 'english_hindi';

export type AudienceType =
  | 'general'
  | 'students'
  | 'professionals'
  | 'job_seekers'
  | 'business_owners'
  | 'developers'
  | 'customers'
  | 'genz'
  | 'recruiters'
  | 'investors'
  | 'custom';

export interface PlatformConfig {
  id: PlatformId;
  name: string;
  shortName: string;
  badge: string;
  brandColor: string;
  hoverBorderColor: string;
  characterLimit: number;
  recommendedAspect: string;
  supportsHashtags: boolean;
  recommendedHashtags: string;
  description: string;
  writingRules: string[];
}

export interface PostVersion {
  version: number;
  content: string;
  hook: string;
  body: string;
  cta: string;
  hashtags: string[];
  timestamp: string;
  note?: string;
}

export interface PlatformPostResult {
  id: string;
  platform: PlatformId;
  hook: string;
  body: string;
  cta: string;
  hashtags: string[];
  fullPost: string;
  characterCount: number;
  estimatedReadingTimeSeconds: number;
  status: 'draft' | 'generated' | 'scheduled' | 'published';
  scheduledAt?: string;
  versions: PostVersion[];
}

export interface MediaAsset {
  id: string;
  url: string;
  type: 'upload' | 'ai_generated' | 'preset';
  name: string;
  prompt?: string;
  aspectRatio?: string;
  style?: string;
  thumbnailUrl?: string;
  resolution?: string;
  sizeBytes?: number;
}

export interface AdditionalInputs {
  url?: string;
  productName?: string;
  companyName?: string;
  location?: string;
  date?: string;
  price?: string;
  salary?: string;
  contact?: string;
  cta?: string;
  targetAudience?: string;
  keywords?: string;
}

export type PostFormat = 'feed' | 'carousel' | 'video_script' | 'thread' | 'story';

export interface PfpOption {
  id: string;
  name: string;
  style: string;
  url: string;
  avatarType: 'ai_photo' | 'monogram' | 'illustration' | '3d';
  accentColor: string;
}

export interface StorySlide {
  id: string;
  hook: string;
  highlightText: string;
  sticker: string;
  ctaText: string;
  theme: 'midnight' | 'neon_purple' | 'emerald_minimal' | 'sunset_gradient';
  bgImageUrl?: string;
  badge?: string;
}

export interface CarouselSlide {
  slideNumber: number;
  title: string;
  content: string;
  keyTakeaway: string;
}

export interface Project {
  id: string;
  title: string;
  sourceContent: string;
  additionalInputs: AdditionalInputs;
  selectedPlatforms: PlatformId[];
  tone: ToneType;
  language: LanguageType;
  audience: AudienceType;
  customAudience?: string;
  postFormat?: PostFormat;
  carouselSlides?: CarouselSlide[];
  videoScript?: { hook: string; intro: string; body: string; cta: string };
  media?: MediaAsset;
  platformPosts: Partial<Record<PlatformId, PlatformPostResult>>;
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'generated' | 'scheduled' | 'published';
}

export interface BrandKit {
  companyName: string;
  tagline: string;
  logoUrl?: string;
  brandColors: string[];
  website: string;
  phone: string;
  email: string;
  address: string;
  brandVoice: string;
  preferredHashtags: string[];
  defaultCta: string;
  description: string;
}

export interface ScheduledPostItem {
  id: string;
  projectId: string;
  projectTitle: string;
  platform: PlatformId;
  content: string;
  mediaUrl?: string;
  scheduledDate: string; // YYYY-MM-DD
  scheduledTime: string; // HH:MM
  timezone: string;
  status: 'scheduled' | 'published' | 'failed';
  createdAt: string;
}

export interface ConnectedAccount {
  platform: PlatformId;
  name: string;
  connected: boolean;
  username?: string;
  handle?: string;
  avatarUrl?: string;
  connectedAt?: string;
  scopes: string[];
}

export interface PostTemplate {
  id: string;
  title: string;
  category: string;
  description: string;
  icon: string;
  sampleContent: string;
  additionalInputs: AdditionalInputs;
  recommendedPlatforms: PlatformId[];
  suggestedTone: ToneType;
}

export interface GenerationRequest {
  content: string;
  platforms: PlatformId[];
  tone: ToneType;
  language: LanguageType;
  audience: AudienceType;
  customAudience?: string;
  additionalInputs?: AdditionalInputs;
  brandKit?: BrandKit;
}

export interface GenerationResponse {
  results: Record<PlatformId, {
    hook: string;
    body: string;
    cta: string;
    hashtags: string[];
    fullPost: string;
  }>;
  isAiLive: boolean;
  modelUsed?: string;
}

export interface MediaRecommendation {
  keywords: string[];
  imagePrompt: string;
  recommendedStyle: string;
  recommendedRatio: string;
  visualIdeas: string[];
}
