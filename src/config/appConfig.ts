export interface AppConfig {
  name: string;
  tagline: string;
  version: string;
  creator: string;
  supportEmail: string;
  website: string;
  githubUrl: string;
  demoModeNotice: string;
}

export const APP_CONFIG: AppConfig = {
  name: 'OmniPost AI',
  tagline: 'One Idea. Every Platform.',
  version: '2.5.0',
  creator: 'OmniPost Technologies',
  supportEmail: 'support@omnipost.ai',
  website: 'https://omnipost.ai',
  githubUrl: 'https://github.com/omnipost-ai',
  demoModeNotice: 'Using intelligent native generation engine. Connect GEMINI_API_KEY for live Gemini 3.8 models.',
};
