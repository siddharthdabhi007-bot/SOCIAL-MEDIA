import {
  AdditionalInputs,
  BrandKit,
  GenerationResponse,
  LanguageType,
  MediaAsset,
  MediaRecommendation,
  PlatformId,
  PlatformPostResult,
  ToneType,
} from '../types';

export async function generateSocialPosts(params: {
  content: string;
  platforms: PlatformId[];
  tone: ToneType;
  language: LanguageType;
  audience: string;
  customAudience?: string;
  additionalInputs?: AdditionalInputs;
  brandKit?: BrandKit;
}): Promise<GenerationResponse> {
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to generate posts. Your draft is safe.');
  }

  return response.json();
}

export async function regenerateSinglePlatform(params: {
  platform: PlatformId;
  content: string;
  instruction: string;
  currentPost?: PlatformPostResult;
  tone?: string;
  language?: string;
  additionalInputs?: AdditionalInputs;
}): Promise<{ result: { hook: string; body: string; cta: string; hashtags: string[]; fullPost: string }; isAiLive: boolean }> {
  const response = await fetch('/api/regenerate-platform', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to regenerate platform post.');
  }

  return response.json();
}

export async function generateImageByContext(params: {
  content: string;
  additionalInputs?: AdditionalInputs;
  brandKit?: BrandKit;
  style?: string;
  ratio?: string;
}): Promise<{
  success: boolean;
  primaryImage: MediaAsset;
  variations: Array<{
    id: string;
    title: string;
    url: string;
    style: string;
    aspectRatio: string;
  }>;
  detectedContext: {
    domain: string;
    headline: string;
    badge: string;
    sceneDescription: string;
  };
}> {
  const response = await fetch('/api/generate-image-by-context', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to generate visual from context.');
  }

  return response.json();
}

export async function getMediaRecommendations(content: string): Promise<MediaRecommendation> {
  const response = await fetch('/api/media/recommend', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  });

  if (!response.ok) {
    throw new Error('Failed to get visual recommendations.');
  }

  return response.json();
}

export async function invokeSmartTool(
  action: 'generate-hooks' | 'generate-hashtags' | 'suggest-ctas' | 'repurpose-content' | 'rewrite',
  content: string,
  target?: string
): Promise<any> {
  const response = await fetch('/api/smart-tools', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, content, target }),
  });

  if (!response.ok) {
    throw new Error('Smart tool action failed.');
  }

  return response.json();
}

export async function extractFromUrl(url: string): Promise<{ title: string; extractedContent: string; sourceUrl: string }> {
  const response = await fetch('/api/extract-url', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  });

  if (!response.ok) {
    throw new Error('Failed to extract content from URL.');
  }

  return response.json();
}

export async function getBackendStatus(): Promise<{ status: string; app: string; hasApiKey: boolean; model: string }> {
  const response = await fetch('/api/status');
  if (!response.ok) {
    throw new Error('Backend status check failed.');
  }
  return response.json();
}
