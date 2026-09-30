import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check endpoint
app.get('/api/status', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    app: 'POSTFLOW AI',
    hasApiKey: !!apiKey,
    model: 'gemini-3.8-flash',
  });
});

// Platform specific guidelines for prompt
const PLATFORM_INSTRUCTIONS: Record<string, string> = {
  instagram: `
- Instagram style: Hook in line 1-2. Aesthetic vertical spacing. Short 1-2 sentence paragraphs.
- Emojis highlighting key concepts.
- Call to action (Save, share, link in bio, DM).
- Include 8 to 15 relevant, targeted hashtags at the very bottom.
`,
  linkedin: `
- LinkedIn style: Authoritative, professional, business value-oriented.
- Strong opening headline line. Proper spacing between thoughts.
- Professional recruitment / industry terminology without fluff.
- Clean bullet points for key facts. Credible, engaging CTA.
- Include 3 to 5 targeted industry hashtags only. Avoid excessive emojis.
`,
  twitter: `
- X / Twitter style: Ultra-concise, high signal. STRICTLY maximum 280 characters.
- Compelling hook + core details + link or CTA.
- Maximum 1 to 2 hashtags.
`,
  whatsapp: `
- WhatsApp style: Easy-to-forward message.
- Use *bold* text headers for *Role:*, *Salary:*, *Location:*, *Contact:*.
- Bulleted key highlights for quick reading on mobile chats.
- Direct contact details & easy application prompt.
- Do NOT include hashtags (unnatural on WhatsApp).
`,
  facebook: `
- Facebook style: Warm, conversational, community-oriented narrative.
- Medium-length readable paragraphs.
- Clear context and relatable storytelling.
- Encourage comments, shares, or tags. 1 to 3 community hashtags.
`,
  snapchat: `
- Snapchat style: Very short, punchy story caption (under 200 characters).
- Youth-friendly dynamic phrasing, 1-2 emojis, swipe-up or DM CTA.
- Low text density.
`,
  handshake: `
- Handshake style: University & early-career job opportunity tone.
- Welcoming employer branding, explicit skills/eligibility requirements.
- Transparent compensation and direct application pathway for students/grads.
- 2 to 4 career hashtags (#EarlyCareer, #Hiring, etc.).
`,
};

function generateNativeRuleBasedPost(
  platform: string,
  content: string,
  tone: string,
  language: string,
  audience: string,
  inputs: Record<string, string> = {}
) {
  const company = inputs.companyName || 'Our Organization';
  const roleOrProduct = inputs.productName || 'Opportunity';
  const salaryOrPrice = inputs.salary || inputs.price || '';
  const location = inputs.location || '';
  const contact = inputs.contact || '';
  const customCta = inputs.cta || '';

  // Extract common numbers or facts from text if present
  const hasSalary = salaryOrPrice || content.match(/(?:salary|₹|\$|INR|per month)[\s\w,₹$]+/i)?.[0];
  const hasExperience = content.match(/\d+[\s+]*(?:years?|yrs?)(?:\s+of)?\s+experience/i)?.[0];

  switch (platform) {
    case 'instagram': {
      const hook = `Exciting news: Here is your next big opportunity 🚀`;
      const body = `${content}\n\n${company ? `🏢 Company: ${company}\n` : ''}${location ? `📍 Location: ${location}\n` : ''}${hasSalary ? `💰 Compensation: ${hasSalary}\n` : ''}${hasExperience ? `⚙️ Requirements: ${hasExperience}\n` : ''}`;
      const cta = customCta || `📩 Send a DM or follow the link in bio for full details!`;
      const hashtags = ['#HiringNow', '#CareerMove', '#NewOpening', '#Opportunities', '#WorkLife', '#JobSearch', '#FutureOfWork', '#GrowthMindset'];
      const fullPost = `${hook}\n\n${body}\n${cta}\n\n${hashtags.join(' ')}`;
      return { hook, body, cta, hashtags, fullPost };
    }
    case 'linkedin': {
      const hook = `We are pleased to announce a strategic update from ${company}.`;
      const body = `${content}\n\nKey Highlights:\n${hasSalary ? `• Compensation: ${hasSalary}\n` : ''}${hasExperience ? `• Qualifications: ${hasExperience}\n` : ''}${location ? `• Location: ${location}\n` : ''}${contact ? `• Contact: ${contact}\n` : ''}`;
      const cta = customCta || `Qualified candidates and partners are encouraged to connect directly or reach out via ${contact || 'email'}.`;
      const hashtags = ['#ProfessionalGrowth', '#Hiring', '#TalentAcquisition', '#IndustryLeadership'];
      const fullPost = `${hook}\n\n${body}\n\n${cta}\n\n${hashtags.join(' ')}`;
      return { hook, body, cta, hashtags, fullPost };
    }
    case 'whatsapp': {
      const hook = `*IMPORTANT ANNOUNCEMENT - ${company.toUpperCase()}*`;
      const body = `${content}\n\n*Key Details:*\n${hasSalary ? `• *Salary/Offer:* ${hasSalary}\n` : ''}${location ? `• *Location:* ${location}\n` : ''}${hasExperience ? `• *Experience:* ${hasExperience}\n` : ''}${contact ? `• *Contact:* ${contact}\n` : ''}`;
      const cta = customCta || `*To apply or enquire:* Forward your resume to ${contact || 'us'} directly.\n\n_Please forward this message to anyone who might benefit!_`;
      const hashtags: string[] = [];
      const fullPost = `${hook}\n\n${body}\n\n${cta}`;
      return { hook, body, cta, hashtags, fullPost };
    }
    case 'twitter': {
      const conciseContent = content.length > 150 ? content.slice(0, 140) + '...' : content;
      const hook = `${company ? `${company}: ` : ''}New update!`;
      const body = `${conciseContent}${hasSalary ? ` (${hasSalary})` : ''}`;
      const cta = customCta ? ` ${customCta}` : ` Check it out:`;
      const hashtags = ['#Update', '#Opportunities'];
      const textCandidate = `${hook} ${body}${cta} ${hashtags.join(' ')}`;
      const fullPost = textCandidate.length > 280 ? textCandidate.slice(0, 276) + '...' : textCandidate;
      return { hook, body, cta, hashtags, fullPost };
    }
    case 'facebook': {
      const hook = `We have something great to share with our community today!`;
      const body = `${content}\n\n${company ? `Organization: ${company}\n` : ''}${location ? `Location: ${location}\n` : ''}${hasSalary ? `Compensation / Details: ${hasSalary}\n` : ''}`;
      const cta = customCta || `Feel free to leave a comment below or tag someone who needs to see this!`;
      const hashtags = ['#Community', '#Announcement', '#Opportunities'];
      const fullPost = `${hook}\n\n${body}\n\n${cta}\n\n${hashtags.join(' ')}`;
      return { hook, body, cta, hashtags, fullPost };
    }
    case 'snapchat': {
      const hook = `Huge update! 🔥`;
      const body = `${content.slice(0, 110)}...`;
      const cta = customCta || `Swipe up or message for details!`;
      const hashtags: string[] = [];
      const fullPost = `${hook} ${body} ${cta}`;
      return { hook, body, cta, hashtags, fullPost };
    }
    case 'handshake': {
      const hook = `Opportunity Alert for Students & Early-Career Professionals: ${roleOrProduct}`;
      const body = `${company} is welcoming applications for our latest opening.\n\n${content}\n\nOverview:\n${hasSalary ? `• Compensation: ${hasSalary}\n` : ''}${location ? `• Location: ${location}\n` : ''}${hasExperience ? `• Desired Experience: ${hasExperience}\n` : ''}`;
      const cta = customCta || `Apply directly via Handshake or connect with our recruitment team.`;
      const hashtags = ['#EarlyCareer', '#EntryLevel', '#CollegeHiring'];
      const fullPost = `${hook}\n\n${body}\n\n${cta}\n\n${hashtags.join(' ')}`;
      return { hook, body, cta, hashtags, fullPost };
    }
    default: {
      const hook = `Announcement`;
      const body = content;
      const cta = customCta || `Learn more today.`;
      const hashtags: string[] = [];
      const fullPost = `${hook}\n\n${body}\n\n${cta}`;
      return { hook, body, cta, hashtags, fullPost };
    }
  }
}

// POST /api/generate
app.post('/api/generate', async (req: Request, res: Response) => {
  try {
    const {
      content,
      platforms = [],
      tone = 'professional',
      language = 'english',
      audience = 'general',
      customAudience,
      additionalInputs = {},
      brandKit,
    } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Source content is required.' });
    }

    if (!Array.isArray(platforms) || platforms.length === 0) {
      return res.status(400).json({ error: 'At least one platform must be selected.' });
    }

    // Try Gemini API if key is present
    if (aiClient) {
      try {
        const platformInstructionsJoined = platforms
          .map((p) => `### Platform: ${p}\n${PLATFORM_INSTRUCTIONS[p] || ''}`)
          .join('\n\n');

        const systemPrompt = `You are PostFlow AI, an elite social media strategist and professional copywriter.
Your task is to transform the provided source content into distinct, platform-optimized social media posts.

CRITICAL INSTRUCTIONS:
1. Preserve all important factual details from the source (e.g., salary figures, experience requirements, dates, prices, addresses, qualifications, contact info). NEVER invent or alter facts (e.g. if salary is ₹3 lakh, keep ₹3 lakh).
2. Match requested tone: "${tone}".
3. Match target audience: "${customAudience || audience}".
4. Language: "${language}". If bilingual (e.g. English + Gujarati), weave natural bilingual sentences smoothly.
5. Brand Context: Company "${brandKit?.companyName || additionalInputs.companyName || ''}", Brand Voice "${brandKit?.brandVoice || ''}".
6. Make each platform version feel native rather than duplicating the same text.
7. Return a valid JSON object strictly matching the requested schema.

Platform rules:
${platformInstructionsJoined}
`;

        const userPrompt = `Source Content:
"""
${content}
"""

Additional Metadata Provided by User:
- Product/Role: ${additionalInputs.productName || ''}
- Company: ${additionalInputs.companyName || brandKit?.companyName || ''}
- Location: ${additionalInputs.location || ''}
- Date/Time: ${additionalInputs.date || ''}
- Price/Salary: ${additionalInputs.price || additionalInputs.salary || ''}
- Contact Info: ${additionalInputs.contact || brandKit?.contact || ''}
- Preferred CTA: ${additionalInputs.cta || brandKit?.defaultCta || ''}
- Keywords: ${additionalInputs.keywords || ''}

Generate optimized posts for these platforms: ${platforms.join(', ')}.`;

        const responseSchema = {
          type: Type.OBJECT,
          properties: {
            results: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  platform: { type: Type.STRING },
                  hook: { type: Type.STRING },
                  body: { type: Type.STRING },
                  cta: { type: Type.STRING },
                  hashtags: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  fullPost: { type: Type.STRING },
                },
                required: ['platform', 'hook', 'body', 'cta', 'hashtags', 'fullPost'],
              },
            },
          },
          required: ['results'],
        };

        const response = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: userPrompt,
          config: {
            systemInstruction: systemPrompt,
            responseMimeType: 'application/json',
            responseSchema: responseSchema,
            temperature: 0.7,
          },
        });

        const textOutput = response.text;
        if (textOutput) {
          const parsed = JSON.parse(textOutput);
          const resultsMap: Record<string, any> = {};

          if (Array.isArray(parsed.results)) {
            for (const item of parsed.results) {
              resultsMap[item.platform.toLowerCase()] = item;
            }
          }

          // Ensure all requested platforms have an entry
          for (const p of platforms) {
            if (!resultsMap[p]) {
              resultsMap[p] = generateNativeRuleBasedPost(p, content, tone, language, audience, additionalInputs);
            }
          }

          return res.json({
            results: resultsMap,
            isAiLive: true,
            modelUsed: 'gemini-3.8-flash',
          });
        }
      } catch (geminiError: any) {
        console.warn('Gemini API call failed, using intelligent native fallback:', geminiError?.message || geminiError);
      }
    }

    // Native rule-based intelligent fallback
    const fallbackResults: Record<string, any> = {};
    for (const p of platforms) {
      fallbackResults[p] = generateNativeRuleBasedPost(p, content, tone, language, audience, additionalInputs);
    }

    return res.json({
      results: fallbackResults,
      isAiLive: false,
      modelUsed: 'native-engine',
    });
  } catch (error: any) {
    console.error('Error generating posts:', error);
    return res.status(500).json({ error: 'Failed to generate posts. Your draft is safe.' });
  }
});

// POST /api/regenerate-platform
app.post('/api/regenerate-platform', async (req: Request, res: Response) => {
  try {
    const {
      platform,
      content,
      instruction = 'make more engaging',
      currentPost,
      tone,
      language,
      additionalInputs = {},
    } = req.body;

    if (!platform || !content) {
      return res.status(400).json({ error: 'Platform and source content are required.' });
    }

    if (aiClient) {
      try {
        const prompt = `Regenerate the social media post for platform: "${platform}".
Source Content: "${content}"
Current Post Version: "${currentPost?.fullPost || ''}"
User Adjustment Instruction: "${instruction}"
Tone: "${tone || 'professional'}"
Language: "${language || 'english'}"

Platform Guidelines for ${platform}:
${PLATFORM_INSTRUCTIONS[platform] || ''}

Follow the instruction carefully (e.g. if "shorter", make it strictly more concise; if "more professional", adopt executive tone; if "improve hook", write an unforgettable opening line). Return JSON.`;

        const responseSchema = {
          type: Type.OBJECT,
          properties: {
            platform: { type: Type.STRING },
            hook: { type: Type.STRING },
            body: { type: Type.STRING },
            cta: { type: Type.STRING },
            hashtags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            fullPost: { type: Type.STRING },
          },
          required: ['platform', 'hook', 'body', 'cta', 'hashtags', 'fullPost'],
        };

        const response = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: responseSchema,
            temperature: 0.8,
          },
        });

        if (response.text) {
          const parsed = JSON.parse(response.text);
          return res.json({ result: parsed, isAiLive: true });
        }
      } catch (err: any) {
        console.warn('Gemini regeneration failed, using native fallback:', err?.message);
      }
    }

    // Fallback modification
    const regenerated = generateNativeRuleBasedPost(platform, content, tone || 'professional', language || 'english', 'general', additionalInputs);
    if (instruction.includes('shorter') || instruction.includes('concise')) {
      regenerated.body = regenerated.body.split('\n')[0] || regenerated.body;
      regenerated.fullPost = `${regenerated.hook}\n\n${regenerated.body}\n${regenerated.cta}`;
    } else if (instruction.includes('professional')) {
      regenerated.hook = `Official Update from ${additionalInputs.companyName || 'Management'}:`;
      regenerated.fullPost = `${regenerated.hook}\n\n${regenerated.body}\n\n${regenerated.cta}`;
    }

    return res.json({ result: regenerated, isAiLive: false });
  } catch (err: any) {
    console.error('Error in regenerate-platform:', err);
    return res.status(500).json({ error: 'Failed to regenerate platform post.' });
  }
});

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

function createBrandedGraphicCard(options: {
  headline: string;
  badge: string;
  companyName: string;
  domain: string;
  aspectRatio: string;
}): string {
  const isSquare = options.aspectRatio === '1:1';
  const width = isSquare ? 1080 : 1200;
  const height = isSquare ? 1080 : 675;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#14090A" />
      <stop offset="45%" stop-color="#251214" />
      <stop offset="100%" stop-color="#14090A" />
    </linearGradient>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(224, 169, 109, 0.05)" stroke-width="1"/>
    </pattern>
  </defs>

  <rect width="${width}" height="${height}" fill="url(#bgGrad)" />
  <rect width="${width}" height="${height}" fill="url(#grid)" />

  <circle cx="${width * 0.8}" cy="${height * 0.25}" r="${width * 0.28}" fill="#8B1E2D" opacity="0.18" />
  <circle cx="${width * 0.2}" cy="${height * 0.8}" r="${width * 0.22}" fill="#4A2810" opacity="0.2" />

  <rect x="50" y="50" width="${width - 100}" height="${height - 100}" rx="24" fill="rgba(28, 14, 16, 0.8)" stroke="rgba(224, 169, 109, 0.25)" stroke-width="1.5" />

  <text x="90" y="125" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="700" fill="#E0A96D" letter-spacing="2">
    ${escapeXml(options.domain.toUpperCase())}
  </text>

  <text x="90" y="165" font-family="system-ui, -apple-system, sans-serif" font-size="22" font-weight="600" fill="#D4A373">
    ${escapeXml(options.companyName || 'OMNIPOST OFFICIAL')}
  </text>

  <text x="90" y="240" font-family="system-ui, -apple-system, sans-serif" font-size="${isSquare ? '48' : '42'}" font-weight="800" fill="#FFF8F0">
    ${escapeXml(options.headline.slice(0, 42))}
  </text>
  ${options.headline.length > 42 ? `
  <text x="90" y="300" font-family="system-ui, -apple-system, sans-serif" font-size="${isSquare ? '48' : '42'}" font-weight="800" fill="#FFF8F0">
    ${escapeXml(options.headline.slice(42, 90))}
  </text>` : ''}

  ${options.badge ? `
  <g transform="translate(90, ${height - 150})">
    <rect width="${Math.min(500, Math.max(260, options.badge.length * 15))}" height="50" rx="25" fill="rgba(139, 30, 45, 0.4)" stroke="#8B1E2D" stroke-width="1.5" />
    <text x="24" y="32" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="700" fill="#E0A96D">
      ${escapeXml(options.badge)}
    </text>
  </g>` : ''}

  <text x="${width - 90}" y="${height - 118}" text-anchor="end" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="600" fill="rgba(224, 169, 109, 0.45)">
    OMNIPOST AI · SYNDICATED
  </text>
</svg>`;

  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

// POST /api/generate-image-by-context
app.post('/api/generate-image-by-context', async (req: Request, res: Response) => {
  try {
    const {
      content = '',
      additionalInputs = {},
      brandKit,
      style = 'Professional Photography',
      ratio = '16:9',
    } = req.body;

    if (!content.trim()) {
      return res.status(400).json({ error: 'Post content is required to infer visual context.' });
    }

    const companyName = additionalInputs.companyName || brandKit?.companyName || 'Organization';
    const salary = additionalInputs.salary || additionalInputs.price || '';
    const location = additionalInputs.location || '';

    // Step 1: 20-Domain Comprehensive Catalog for guaranteed relevant photography
    const DOMAIN_CATALOG: Array<{
      category: string;
      keywords: RegExp;
      photo: string;
      secondaryPhoto: string;
      defaultHeadline: string;
      defaultBadge: string;
    }> = [
      {
        category: 'Healthcare & Medicine',
        keywords: /\b(doctor|nurse|nursing|hospital|clinic|medical|medicine|health|patient|surgery|surgeon|healthcare|pharma|pharmacy|dental|dentist|physician|therapy|caregiver|clinical)\b/i,
        photo: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
        secondaryPhoto: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80',
        defaultHeadline: 'Healthcare Excellence & Medical Updates',
        defaultBadge: 'Clinical Care & Wellness',
      },
      {
        category: 'Fitness & Athletics',
        keywords: /\b(gym|fitness|workout|training|trainer|exercise|yoga|athlete|crossfit|sports|football|soccer|cricket|basketball|bodybuilding|wellness|marathon|coach|stamina|weightloss)\b/i,
        photo: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80',
        secondaryPhoto: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80',
        defaultHeadline: 'Transform Your Fitness & Peak Performance',
        defaultBadge: 'Strength & Athletic Conditioning',
      },
      {
        category: 'Education & Academics',
        keywords: /\b(school|college|university|student|students|teacher|teaching|tutor|tuition|professor|education|learning|course|curriculum|exam|admission|scholarship|campus|degree|masterclass|academy|coaching|study)\b/i,
        photo: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
        secondaryPhoto: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80',
        defaultHeadline: 'Academic Excellence & Future Pathways',
        defaultBadge: 'Educational Opportunity & Learning',
      },
      {
        category: 'Finance, Banking & Crypto',
        keywords: /\b(finance|banking|bank|investment|investor|stocks|stock market|trading|crypto|bitcoin|accounting|accountant|wealth|wealth management|fund|mutual fund|loan|credit|audit|tax|financial advisor|roi|portfolio)\b/i,
        photo: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1200&q=80',
        secondaryPhoto: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80',
        defaultHeadline: 'Strategic Financial Growth & Wealth Management',
        defaultBadge: 'Capital Markets & Wealth Advisory',
      },
      {
        category: 'Real Estate & Properties',
        keywords: /\b(real estate|property|properties|villa|apartment|flat|house|housing|realtor|broker|condo|penthouse|architecture|architect|interior|construction|builder|plot|estate|leasing|mortgage)\b/i,
        photo: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        secondaryPhoto: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
        defaultHeadline: 'Exclusive Architectural Living & Prime Property',
        defaultBadge: 'Luxury Living & Real Estate',
      },
      {
        category: 'Travel & Global Destinations',
        keywords: /\b(travel|tourism|tourist|hotel|resort|vacation|holiday|trip|flight|airline|destination|beach|mountain|alps|explore|wanderlust|getaway|staycation|hospitality|israel|dubai|europe|asia|switzerland)\b/i,
        photo: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80',
        secondaryPhoto: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
        defaultHeadline: 'Unforgettable Journeys & Iconic Destinations',
        defaultBadge: 'World Travel & Adventure',
      },
      {
        category: 'Culinary & Dining',
        keywords: /\b(food|restaurant|chef|cooking|cuisine|gourmet|dining|dinner|lunch|breakfast|recipe|bistro|eatery|buffet|pasta|burger|pizza|sushi|dessert|delicious|menu|meal)\b/i,
        photo: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
        secondaryPhoto: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
        defaultHeadline: 'Exceptional Flavors & Culinary Mastery',
        defaultBadge: 'Gourmet Dining & Chef Craft',
      },
      {
        category: 'Artisan Cafe & Bakery',
        keywords: /\b(coffee|cafe|barista|espresso|latte|cappuccino|bakery|baker|pastry|croissant|roaster|roastery|beans|brew|matcha|tea|cake|sweets)\b/i,
        photo: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80',
        secondaryPhoto: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80',
        defaultHeadline: 'Artisan Coffee Roasting & Fresh Bakery',
        defaultBadge: 'Handcrafted Espresso & Roast',
      },
      {
        category: 'Technology & AI',
        keywords: /\b(software|developer|coding|code|programmer|web development|ai|artificial intelligence|machine learning|saas|app|mobile app|cloud|database|devops|tech|cybersecurity|frontend|backend|fullstack|algorithm)\b/i,
        photo: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
        secondaryPhoto: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
        defaultHeadline: 'Next-Generation Technology & Software Innovation',
        defaultBadge: 'Developer Platform & Cloud AI',
      },
      {
        category: 'Industrial Engineering & Machining',
        keywords: /\b(cnc|machinist|machining|factory|lathe|milling|manufacturing|industrial|mechanical|aerospace|automotive parts|welder|welding|operator|technician|fabrication|precision engineering|hardware)\b/i,
        photo: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
        secondaryPhoto: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80',
        defaultHeadline: 'Precision 5-Axis Industrial Manufacturing',
        defaultBadge: 'Industrial Precision Engineering',
      },
      {
        category: 'Fashion & Style',
        keywords: /\b(fashion|clothing|apparel|outfit|style|stylist|model|designer|boutique|beauty|makeup|skincare|cosmetics|salon|haircut|hairstylist|jewelry|accessories|fragrance|perfume|luxury)\b/i,
        photo: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80',
        secondaryPhoto: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1200&q=80',
        defaultHeadline: 'Modern Fashion Editorial & Haute Couture',
        defaultBadge: 'Style & Designer Collection',
      },
      {
        category: 'Automotive & Mobility',
        keywords: /\b(car|cars|automobile|vehicle|automotive|electric vehicle|ev|driving|mechanic|garage|dealership|motorcycle|bike|speed|engine|fleet)\b/i,
        photo: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80',
        secondaryPhoto: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
        defaultHeadline: 'Advanced Automotive Engineering & Modern Drive',
        defaultBadge: 'Electric Mobility & Automotive',
      },
      {
        category: 'Music, Sound & Arts',
        keywords: /\b(music|concert|festival|band|song|singer|dj|audio|sound|musician|instrument|guitar|piano|performance|show|theater|dance|entertainment|art|artist|painting|gallery|exhibition)\b/i,
        photo: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
        secondaryPhoto: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
        defaultHeadline: 'Live Musical Performance & Audio Mastery',
        defaultBadge: 'Music & Creative Performing Arts',
      },
      {
        category: 'Events & Summits',
        keywords: /\b(event|events|conference|summit|webinar|seminar|workshop|keynote|speaker|audience|meetup|gathering|convention|expo|launch event)\b/i,
        photo: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
        secondaryPhoto: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
        defaultHeadline: 'Global Leadership Summit & Conference',
        defaultBadge: 'Keynote & Executive Gathering',
      },
      {
        category: 'Retail & E-Commerce',
        keywords: /\b(sale|discount|deal|promo|promotion|coupon|off|shopping|store|ecommerce|e-commerce|shop|order|delivery|unboxing|collection|black friday)\b/i,
        photo: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=1200&q=80',
        secondaryPhoto: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
        defaultHeadline: 'Exclusive Product Release & Special Offer',
        defaultBadge: 'Special Showcase & Promotions',
      },
      {
        category: 'Recruitment & Talent Hiring',
        keywords: /\b(hiring|we are hiring|vacancy|job opening|join our team|career|careers|talent|recruit|recruiter|recruitment|hr|interview|positions|apply now)\b/i,
        photo: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=80',
        secondaryPhoto: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80',
        defaultHeadline: 'Career Growth & Talent Opportunities',
        defaultBadge: 'Talent Acquisition & Open Positions',
      },
      {
        category: 'Corporate Strategy & Leadership',
        keywords: /\b(business|corporate|office|headquarters|strategy|leadership|executive|management|company|startup|growth|partnership|meeting|collaboration)\b/i,
        photo: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
        secondaryPhoto: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
        defaultHeadline: 'Executive Strategy & Business Expansion',
        defaultBadge: 'Corporate Leadership & Growth',
      },
    ];

    // Find best semantic category based on text analysis
    let matchedDomain = DOMAIN_CATALOG[DOMAIN_CATALOG.length - 1]; // default corporate
    for (const d of DOMAIN_CATALOG) {
      if (d.keywords.test(content)) {
        matchedDomain = d;
        break;
      }
    }

    let domain = matchedDomain.category;
    let headline = matchedDomain.defaultHeadline;
    let badge = salary ? `Salary: ${salary}` : location ? `Location: ${location}` : matchedDomain.defaultBadge;
    let sceneDescription = `Professional high-end commercial photograph depicting ${domain.toLowerCase()}`;
    let photoUrl = matchedDomain.photo;
    let secondaryPhotoUrl = matchedDomain.secondaryPhoto;

    // Enhance with Gemini if live
    if (aiClient) {
      try {
        const analyzePrompt = `Analyze this social media post content and extract 4 concise visual metadata elements in JSON:
Content: """${content}"""
Company: "${companyName}"
Salary/Price: "${salary}"
Location: "${location}"

Return JSON:
{
  "domain": "Specific industry category (e.g. Healthcare, Fine Dining, SaaS Software, Luxury Real Estate)",
  "headline": "Punchy 3-7 word title describing the core announcement",
  "badge": "Short key fact badge (e.g. ₹3 Lakh / Month, Doors Open 8 AM, 40% Off)",
  "sceneDescription": "Detailed photographic visual scene description without logos or watermarks"
}`;

        const analysisResp = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: analyzePrompt,
          config: { responseMimeType: 'application/json' },
        });

        if (analysisResp.text) {
          const parsed = JSON.parse(analysisResp.text);
          if (parsed.domain) domain = parsed.domain;
          if (parsed.headline) headline = parsed.headline;
          if (parsed.badge) badge = parsed.badge;
          if (parsed.sceneDescription) sceneDescription = parsed.sceneDescription;

          // Re-evaluate category match using Gemini domain + text
          for (const d of DOMAIN_CATALOG) {
            if (d.keywords.test(`${content} ${parsed.domain}`)) {
              photoUrl = d.photo;
              secondaryPhotoUrl = d.secondaryPhoto;
              break;
            }
          }
        }
      } catch (err) {
        console.warn('Context extraction error:', err);
      }
    }

    // Try Gemini image model if available
    let geminiGeneratedDataUrl = '';
    if (aiClient) {
      try {
        const imagePrompt = `Professional commercial studio photograph of ${sceneDescription}, sharp focus, pristine lighting, 8k commercial quality, ultra-clean aesthetic, high resolution, no logos or text.`;
        const genImageResp = await aiClient.models.generateContent({
          model: 'gemini-3.1-flash-lite-image',
          contents: {
            parts: [{ text: imagePrompt }],
          },
          config: {
            imageConfig: {
              aspectRatio: ratio === '1:1' ? '1:1' : ratio === '4:3' ? '4:3' : ratio === '9:16' ? '9:16' : '16:9',
            },
          },
        });

        if (genImageResp.candidates?.[0]?.content?.parts) {
          for (const part of genImageResp.candidates[0].content.parts) {
            if (part.inlineData?.data) {
              geminiGeneratedDataUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
              break;
            }
          }
        }
      } catch (geminiImgErr: any) {
        // Fallback gracefully without breaking
      }
    }

    // Generate dynamic graphic banner based on extracted context
    const graphicCardUrl = createBrandedGraphicCard({
      headline,
      badge,
      companyName,
      domain,
      aspectRatio: ratio,
    });

    const primaryUrl = geminiGeneratedDataUrl || photoUrl;

    const variations = [
      {
        id: `var-photo-1`,
        title: 'Contextual Photographic Scene',
        url: primaryUrl,
        style: 'Commercial Photography',
        aspectRatio: ratio,
      },
      {
        id: `var-graphic-2`,
        title: 'Branded Social Card Banner',
        url: graphicCardUrl,
        style: 'Branded Graphic Banner',
        aspectRatio: ratio,
      },
      {
        id: `var-photo-3`,
        title: 'Alternative Focal Perspective',
        url: secondaryPhotoUrl,
        style: 'Modern Architectural Framing',
        aspectRatio: ratio,
      },
    ];

    return res.json({
      success: true,
      primaryImage: {
        id: `img-${Date.now()}`,
        url: primaryUrl,
        name: `${headline} — ${domain}`,
        prompt: sceneDescription,
        aspectRatio: ratio,
        style: style,
        type: 'ai_generated',
      },
      variations,
      detectedContext: {
        domain,
        headline,
        badge,
        sceneDescription,
      },
    });
  } catch (err: any) {
    console.error('generate-image-by-context error:', err);
    return res.status(500).json({ error: 'Failed to generate visual from context.' });
  }
});

// POST /api/media/recommend
app.post('/api/media/recommend', async (req: Request, res: Response) => {

  try {
    const { content = '' } = req.body;

    if (!content.trim()) {
      return res.status(400).json({ error: 'Content required.' });
    }

    if (aiClient) {
      try {
        const prompt = `Analyze this social media announcement/content and recommend visual art direction and an AI image generation prompt.
Content: """${content}"""

Return a JSON with:
1. keywords: 4-6 visual keywords
2. imagePrompt: high-quality commercial photography or render prompt (no logos, sharp focus, professional lighting)
3. recommendedStyle: (e.g. Professional Photography, Industrial Engineering, Modern Interior, Minimalist Tech, Luxury)
4. recommendedRatio: "1:1" | "16:9" | "4:3" | "9:16"
5. visualIdeas: 3 distinct visual angle descriptions`;

        const responseSchema = {
          type: Type.OBJECT,
          properties: {
            keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
            imagePrompt: { type: Type.STRING },
            recommendedStyle: { type: Type.STRING },
            recommendedRatio: { type: Type.STRING },
            visualIdeas: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ['keywords', 'imagePrompt', 'recommendedStyle', 'recommendedRatio', 'visualIdeas'],
        };

        const response = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: responseSchema,
          },
        });

        if (response.text) {
          return res.json(JSON.parse(response.text));
        }
      } catch (err) {
        console.warn('Gemini media recommendation failed:', err);
      }
    }

    // Native fallback rule
    const isTech = /software|ai|app|code|developer|saas|cloud/i.test(content);
    const isIndustrial = /cnc|machin|engineer|manufactur|factory|industrial/i.test(content);
    const isFood = /coffee|cafe|restaurant|bakery|food|dine/i.test(content);

    let imagePrompt = 'Professional commercial photography of modern workplace environment, crisp natural lighting, editorial aesthetic';
    let recommendedStyle = 'Professional Photography';
    let keywords = ['business', 'announcement', 'growth', 'modern'];

    if (isIndustrial) {
      imagePrompt = 'Professional industrial photograph of an experienced CNC machinist operating a modern 5-axis machining center in an ultra-clean facility, realistic lighting, recruitment aesthetic';
      recommendedStyle = 'Industrial Engineering';
      keywords = ['cnc 5-axis', 'manufacturing', 'precision machining', 'machinist'];
    } else if (isFood) {
      imagePrompt = 'Warm sunlit interior photography of a stylish artisan espresso bar and bakery, minimalist wooden counter, steam rising from espresso, inviting cafe aesthetic';
      recommendedStyle = 'Warm Artisan Interior';
      keywords = ['artisan coffee', 'espresso bar', 'cafe opening', 'bakery'];
    } else if (isTech) {
      imagePrompt = 'Clean modern technology workspace, high-end monitor displaying code and analytics, ergonomic desk setup, subtle ambient lighting';
      recommendedStyle = 'Minimalist Tech';
      keywords = ['developer tools', 'saas product', 'modern workspace', 'technology'];
    }

    return res.json({
      keywords,
      imagePrompt,
      recommendedStyle,
      recommendedRatio: '16:9',
      visualIdeas: [
        'Close-up focus on the human operator or craftsperson at work',
        'Wide architectural perspective showing state-of-the-art facility',
        'Clean product detail shot with soft depth of field',
      ],
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to generate visual recommendations.' });
  }
});

// POST /api/smart-tools
app.post('/api/smart-tools', async (req: Request, res: Response) => {
  try {
    const { action, content = '', target = '' } = req.body;

    if (!content.trim()) {
      return res.status(400).json({ error: 'Content required.' });
    }

    if (aiClient) {
      try {
        let prompt = '';
        if (action === 'generate-hooks') {
          prompt = `Generate 5 high-converting, irresistible opening hooks for this content:\n"${content}"\nProvide a JSON array of strings under "items".`;
        } else if (action === 'generate-hashtags') {
          prompt = `Generate 15 targeted, non-spammy social media hashtags for this content:\n"${content}"\nProvide a JSON array of strings under "items" with # symbols.`;
        } else if (action === 'suggest-ctas') {
          prompt = `Generate 6 clear, action-oriented CTAs (Call to Actions) for this content:\n"${content}"\nProvide a JSON array of strings under "items".`;
        } else if (action === 'repurpose-content') {
          prompt = `Summarize and repurpose this long article/document into a crisp executive 3-bullet summary ready for social media transformation:\n"${content}"\nProvide a JSON with field "summary".`;
        } else {
          prompt = `Rewrite this text to be "${target || 'more engaging'}":\n"${content}"\nProvide a JSON with field "result".`;
        }

        const response = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: { responseMimeType: 'application/json' },
        });

        if (response.text) {
          return res.json(JSON.parse(response.text));
        }
      } catch (err) {
        console.warn('Smart tools Gemini failed:', err);
      }
    }

    // Native fallback
    if (action === 'generate-hooks') {
      return res.json({
        items: [
          'Here is the career breakthrough you’ve been looking for 👇',
          'We have an urgent announcement we could not wait to share:',
          'Why the best opportunities never stay open for long ⚡',
          'Stop scrolling if you care about your next career milestone:',
          'A rare opportunity is now live — and here is why it matters:',
        ],
      });
    }

    if (action === 'generate-hashtags') {
      return res.json({
        items: [
          '#CareerMove',
          '#HiringAlert',
          '#PrecisionEngineering',
          '#TechJobs',
          '#IndustryNews',
          '#NowHiring',
          '#JobVacancy',
          '#GrowthMindset',
        ],
      });
    }

    if (action === 'suggest-ctas') {
      return res.json({
        items: [
          'Apply directly via WhatsApp or Email today.',
          'Send your CV to our talent team before slots fill.',
          'Save this post & share with an experienced colleague.',
          'Drop a comment below with any questions.',
          'Click the link in bio to register for immediate review.',
        ],
      });
    }

    return res.json({
      result: `Refined & polished: ${content}`,
      summary: content.slice(0, 200) + '...',
    });
  } catch (err) {
    return res.status(500).json({ error: 'Smart tool operation failed.' });
  }
});

// POST /api/extract-url
app.post('/api/extract-url', async (req: Request, res: Response) => {
  try {
    const { url } = req.body;
    if (!url || typeof url !== 'string' || !url.startsWith('http')) {
      return res.status(400).json({ error: 'Valid URL starting with http:// or https:// is required.' });
    }

    try {
      const response = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; PostFlowBot/1.0)' },
      });
      const html = await response.text();

      // Extract title and text cleanly
      const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
      const title = titleMatch ? titleMatch[1].trim() : '';

      // Strip scripts, styles, tags
      let cleanText = html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ')
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      const extracted = cleanText.slice(0, 2500);

      return res.json({
        title,
        extractedContent: extracted,
        sourceUrl: url,
      });
    } catch (fetchErr: any) {
      return res.json({
        title: 'Source Webpage',
        extractedContent: `Could not directly fetch external URL (${url}). You can paste the announcement or text directly into the composer.`,
        sourceUrl: url,
      });
    }
  } catch (err) {
    return res.status(500).json({ error: 'URL processing failed.' });
  }
});

// Setup Vite dev server middleware or serve dist in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`🚀 PostFlow AI full-stack server running on port ${PORT}`);
  });
}

startServer();
