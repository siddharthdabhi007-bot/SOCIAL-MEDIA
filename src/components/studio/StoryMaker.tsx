import React, { useState } from 'react';
import {
  Sparkles,
  Download,
  Share2,
  Layers,
  ChevronDown,
  Check,
  Wand2,
  Copy,
  Eye,
  Smartphone,
} from 'lucide-react';
import { BrandKit, Project, StorySlide } from '../../types';
import { getRelevantImageUrl } from '../../utils/imageMatcher';

interface StoryMakerProps {
  project: Project;
  brandKit: BrandKit;
  onAttachStoryMedia: (dataUrl: string) => void;
  onNotify: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
  compact?: boolean;
}

export const StoryMaker: React.FC<StoryMakerProps> = ({
  project,
  brandKit,
  onAttachStoryMedia,
  onNotify,
  compact = false,
}) => {
  const company = brandKit.companyName || project.additionalInputs?.companyName || 'Apex Precision';
  const role = project.additionalInputs?.productName || 'Special Announcement';
  const salaryOrFact = project.additionalInputs?.salary || project.additionalInputs?.price || project.additionalInputs?.location || 'New Opportunity';

  const [headline, setHeadline] = useState(
    project.sourceContent ? project.sourceContent.slice(0, 70) + '...' : 'Overseas Precision Machining Vacancy'
  );
  const [highlightPill, setHighlightPill] = useState(salaryOrFact);
  const [activeSticker, setActiveSticker] = useState('🔥 URGENT OPENING');
  const [ctaSticker, setCtaSticker] = useState('👉 SWIPE UP TO APPLY');
  const [activeTheme, setActiveTheme] = useState<'maroon' | 'chocolate' | 'midnight' | 'sunset'>('maroon');
  const [showPoll, setShowPoll] = useState(true);

  const storyImageUrl = getRelevantImageUrl(
    project.media?.url,
    `${project.title} ${project.sourceContent}`
  );

  const STICKERS = [
    '🔥 URGENT OPENING',
    '⚡ WE ARE HIRING',
    '🚀 NEW LAUNCH',
    '📍 ISRAEL VACANCY',
    '☕ GRAND OPENING',
    '⏳ LIMITED TIME',
    '💡 DID YOU KNOW?',
  ];

  const CTA_STICKERS = [
    '👉 SWIPE UP TO APPLY',
    '🔗 LINK IN BIO',
    '📩 DM US FOR DETAILS',
    '📲 WHATSAPP US DIRECTLY',
    '⚡ TAP HERE TO REGISTER',
  ];

  const THEMES = {
    maroon: {
      bg: 'linear-gradient(180deg, rgba(20, 7, 9, 0.85) 0%, rgba(59, 18, 24, 0.65) 50%, rgba(20, 7, 9, 0.95) 100%)',
      cardBg: 'rgba(38, 14, 18, 0.88)',
      accent: '#8B1E2D',
      badgeColor: '#E0A96D',
    },
    chocolate: {
      bg: 'linear-gradient(180deg, rgba(28, 14, 16, 0.85) 0%, rgba(56, 27, 30, 0.65) 50%, rgba(28, 14, 16, 0.95) 100%)',
      cardBg: 'rgba(42, 20, 23, 0.88)',
      accent: '#9E2A2B',
      badgeColor: '#D4A373',
    },
    midnight: {
      bg: 'linear-gradient(180deg, rgba(16, 8, 9, 0.85) 0%, rgba(36, 16, 20, 0.65) 60%, rgba(16, 8, 9, 0.95) 100%)',
      cardBg: 'rgba(30, 14, 16, 0.85)',
      accent: '#B83244',
      badgeColor: '#F5C2C7',
    },
    sunset: {
      bg: 'linear-gradient(180deg, rgba(36, 14, 16, 0.85) 0%, rgba(74, 27, 32, 0.65) 50%, rgba(36, 14, 16, 0.95) 100%)',
      cardBg: 'rgba(48, 18, 22, 0.88)',
      accent: '#A62639',
      badgeColor: '#FDA4AF',
    },
  };

  const themeConfig = THEMES[activeTheme];

  // Generate 9:16 SVG Story Graphic
  const generateStorySvgDataUrl = () => {
    const width = 1080;
    const height = 1920;

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
      <defs>
        <linearGradient id="storyBg" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#140709" />
          <stop offset="50%" stop-color="#2E1216" />
          <stop offset="100%" stop-color="#140709" />
        </linearGradient>
      </defs>

      <!-- Background Image -->
      <image href="${storyImageUrl}" width="${width}" height="${height}" preserveAspectRatio="xMidYMid slice" opacity="0.9" />
      <rect width="${width}" height="${height}" fill="url(#storyBg)" opacity="0.65" />

      <!-- Top Story Bar -->
      <rect x="60" y="80" width="310" height="8" rx="4" fill="#FFF8F0" opacity="0.9" />
      <rect x="390" y="80" width="310" height="8" rx="4" fill="#FFF8F0" opacity="0.3" />
      <rect x="720" y="80" width="300" height="8" rx="4" fill="#FFF8F0" opacity="0.3" />

      <!-- Author header -->
      <g transform="translate(60, 130)">
        <circle cx="36" cy="36" r="36" fill="${themeConfig.accent}" />
        <text x="36" y="47" font-family="system-ui, sans-serif" font-size="28" font-weight="900" fill="#FFFFFF" text-anchor="middle">
          ${company.charAt(0)}
        </text>
        <text x="96" y="32" font-family="system-ui, sans-serif" font-size="32" font-weight="800" fill="#FFF8F0">
          ${company}
        </text>
        <text x="96" y="62" font-family="system-ui, sans-serif" font-size="22" font-weight="500" fill="#D4A373">
          Official Announcement
        </text>
      </g>

      <!-- Sticker Pill -->
      <g transform="translate(60, 340)">
        <rect width="auto" height="74" rx="37" fill="${themeConfig.accent}" opacity="0.95" />
        <text x="36" y="48" font-family="system-ui, sans-serif" font-size="32" font-weight="800" fill="#FFFFFF">
          ${activeSticker}
        </text>
      </g>

      <!-- Big Story Main Card -->
      <rect x="60" y="460" width="960" height="820" rx="40" fill="${themeConfig.cardBg}" stroke="rgba(224,169,109,0.3)" stroke-width="3" />

      <!-- Card Headline -->
      <foreignObject x="110" y="520" width="860" height="420">
        <div xmlns="http://www.w3.org/1999/xhtml" style="font-family: system-ui, sans-serif; font-size: 64px; font-weight: 900; color: #FFF8F0; line-height: 1.2;">
          ${headline}
        </div>
      </foreignObject>

      <!-- Highlight Badge -->
      <g transform="translate(110, 1020)">
        <rect width="auto" height="80" rx="40" fill="rgba(139, 30, 45, 0.45)" stroke="#E0A96D" stroke-width="3" />
        <text x="40" y="52" font-family="system-ui, sans-serif" font-size="36" font-weight="800" fill="#E0A96D">
          ${highlightPill}
        </text>
      </g>

      <!-- Poll sticker if enabled -->
      ${
        showPoll
          ? `
      <g transform="translate(140, 1340)">
        <rect width="800" height="240" rx="36" fill="rgba(28, 14, 16, 0.95)" stroke="rgba(224,169,109,0.25)" stroke-width="2" />
        <text x="400" y="70" font-family="system-ui, sans-serif" font-size="30" font-weight="800" fill="#FFF8F0" text-anchor="middle">
          Interested in this opportunity?
        </text>
        <rect x="60" y="110" width="320" height="80" rx="24" fill="rgba(139, 30, 45, 0.6)" stroke="#8B1E2D" stroke-width="2" />
        <text x="220" y="160" font-family="system-ui, sans-serif" font-size="28" font-weight="700" fill="#FFFFFF" text-anchor="middle">
          YES! Apply Now
        </text>
        <rect x="420" y="110" width="320" height="80" rx="24" fill="rgba(255, 255, 255, 0.08)" stroke="rgba(255,255,255,0.2)" stroke-width="2" />
        <text x="580" y="160" font-family="system-ui, sans-serif" font-size="28" font-weight="700" fill="#D4A373" text-anchor="middle">
          Send Details
        </text>
      </g>`
          : ''
      }

      <!-- Bottom Swipe Up CTA -->
      <g transform="translate(190, 1680)">
        <rect width="700" height="96" rx="48" fill="#FFF8F0" />
        <text x="350" y="60" font-family="system-ui, sans-serif" font-size="32" font-weight="900" fill="#1C0E10" text-anchor="middle">
          ${ctaSticker}
        </text>
      </g>
    </svg>`;

    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  };

  const currentStoryUrl = generateStorySvgDataUrl();

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = currentStoryUrl;
    a.download = `story_9_16_${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    onNotify('success', 'Story Graphic Downloaded', 'Saved as 9:16 high-resolution vertical story.');
  };

  const handleAttachToProject = () => {
    onAttachStoryMedia(currentStoryUrl);
    onNotify('success', 'Story Asset Attached', 'Saved to current project media for Snapchat & Instagram stories.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-[#381B1E] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-[#FFF8F0] tracking-tight flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-[#E0A96D]" />
            <span>Story Maker (Vertical 9:16 Visual Canvas)</span>
          </h2>
          <p className="text-xs text-[#D4A373] mt-0.5">
            Auto-generate high-converting visual stories for Instagram Stories, Snapchat, and WhatsApp Status
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#251214] hover:bg-[#381B1E] border border-[#381B1E] text-xs font-semibold text-[#FFF8F0] transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-[#E0A96D]" />
            <span>Download 9:16</span>
          </button>
          <button
            onClick={handleAttachToProject}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#8B1E2D] to-[#671018] hover:from-[#A62639] hover:to-[#8B1E2D] text-xs font-bold text-white shadow-lg shadow-[#8B1E2D]/30 transition-all"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Attach to Campaign</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Authentic Vertical Phone Frame Mockup (5 Cols) */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="w-[300px] sm:w-[330px] rounded-[36px] bg-[#140709] border-[6px] border-[#381B1E] p-2 shadow-2xl relative overflow-hidden aspect-[9/16]">
            {/* Notch / Dynamic Island */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-4 bg-[#1C0E10] border border-[#381B1E]/60 rounded-full z-20" />

            <div className="w-full h-full rounded-[28px] overflow-hidden flex flex-col justify-between p-4 relative">
              {/* Background Visual Image instead of blank gradient! */}
              <img
                src={storyImageUrl}
                alt="Story Background"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover z-0"
              />
              <div
                className="absolute inset-0 z-0"
                style={{ background: themeConfig.bg }}
              />
              {/* Top Instagram-style story progression bars */}
              <div className="grid grid-cols-3 gap-1 z-10 pt-2">
                <div className="h-1 rounded-full bg-white opacity-90" />
                <div className="h-1 rounded-full bg-white opacity-30" />
                <div className="h-1 rounded-full bg-white opacity-30" />
              </div>

              {/* Author badge */}
              <div className="flex items-center gap-2 z-10 pt-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#8B1E2D] to-[#D4A373] flex items-center justify-center font-bold text-white text-[10px] shadow">
                  {company.charAt(0)}
                </div>
                <div>
                  <p className="text-xs font-bold text-[#FFF8F0] leading-tight">{company}</p>
                  <p className="text-[10px] text-[#D4A373]">Story · Just Now</p>
                </div>
              </div>

              {/* Sticker Pill */}
              <div className="self-start z-10">
                <span className="px-3 py-1 rounded-full bg-[#8B1E2D] text-[11px] font-extrabold text-white shadow">
                  {activeSticker}
                </span>
              </div>

              {/* Story Content Card */}
              <div
                className="rounded-2xl p-4 border border-[#E0A96D]/30 space-y-2 z-10 backdrop-blur-md shadow-xl"
                style={{ backgroundColor: themeConfig.cardBg }}
              >
                <h3 className="text-sm sm:text-base font-black text-[#FFF8F0] leading-snug">
                  {headline}
                </h3>
                <div className="inline-block px-2.5 py-1 rounded-lg bg-[#8B1E2D]/40 border border-[#E0A96D]/40 text-[11px] font-bold text-[#E0A96D]">
                  {highlightPill}
                </div>
              </div>

              {/* Poll sticker simulation */}
              {showPoll && (
                <div className="rounded-xl bg-[#1C0E10]/90 border border-[#381B1E] p-2.5 text-center space-y-2 z-10 shadow-lg">
                  <p className="text-[11px] font-bold text-[#FFF8F0]">Interested in this opportunity?</p>
                  <div className="grid grid-cols-2 gap-1.5 text-[10px] font-bold">
                    <div className="py-1 rounded-lg bg-[#8B1E2D]/70 text-white border border-[#A62639]/50 shadow">
                      YES! Apply Now
                    </div>
                    <div className="py-1 rounded-lg bg-[#251214] text-[#D4A373] border border-[#381B1E]">
                      Send Details
                    </div>
                  </div>
                </div>
              )}

              {/* Swipe Up CTA Button */}
              <div className="text-center z-10">
                <div className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full bg-[#FFF8F0] text-[#1C0E10] font-black text-xs shadow-xl">
                  <span>{ctaSticker}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Story Controls (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl bg-[#1C0E10] border border-[#381B1E] p-5 space-y-4 shadow-xl">
            <h3 className="text-xs font-bold text-[#E0A96D] uppercase tracking-wider">
              Story Customization & Sticker Placement
            </h3>

            {/* Headline editing */}
            <div>
              <label className="block text-xs font-medium text-[#D4A373] mb-1">Story Title / Big Hook</label>
              <textarea
                rows={2}
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="w-full p-3 rounded-xl bg-[#140709] border border-[#381B1E] text-xs text-[#FFF8F0] focus:outline-none focus:border-[#8B1E2D] resize-none font-sans"
              />
            </div>

            {/* Highlight Pill */}
            <div>
              <label className="block text-xs font-medium text-[#D4A373] mb-1">Highlight Badge</label>
              <input
                type="text"
                value={highlightPill}
                onChange={(e) => setHighlightPill(e.target.value)}
                placeholder="e.g. Salary ₹3 Lakh/mo · Israel"
                className="w-full px-3 py-2 rounded-xl bg-[#140709] border border-[#381B1E] text-xs text-[#FFF8F0] focus:outline-none focus:border-[#8B1E2D]"
              />
            </div>

            {/* Theme Selector */}
            <div className="space-y-1.5 pt-1">
              <label className="block text-xs font-medium text-[#D4A373]">Story Color Theme</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(Object.keys(THEMES) as Array<keyof typeof THEMES>).map((tKey) => (
                  <button
                    key={tKey}
                    type="button"
                    onClick={() => setActiveTheme(tKey)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold capitalize transition-all border ${
                      activeTheme === tKey
                        ? 'border-[#8B1E2D] text-white bg-[#8B1E2D]/40 shadow-md'
                        : 'border-[#381B1E] text-[#D4A373] bg-[#140709] hover:border-[#4A2227]'
                    }`}
                  >
                    {tKey}
                  </button>
                ))}
              </div>
            </div>

            {/* Top Action Sticker */}
            <div className="space-y-1.5 pt-1">
              <label className="block text-xs font-medium text-[#D4A373]">Top Energy Sticker</label>
              <div className="flex flex-wrap gap-1.5">
                {STICKERS.map((stk) => (
                  <button
                    key={stk}
                    type="button"
                    onClick={() => setActiveSticker(stk)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                      activeSticker === stk
                        ? 'bg-[#8B1E2D] text-white shadow'
                        : 'bg-[#140709] text-[#D4A373] border border-[#381B1E] hover:text-[#FFF8F0]'
                    }`}
                  >
                    {stk}
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom CTA Sticker */}
            <div className="space-y-1.5 pt-1">
              <label className="block text-xs font-medium text-[#D4A373]">Bottom Action Sticker</label>
              <div className="flex flex-wrap gap-1.5">
                {CTA_STICKERS.map((cta) => (
                  <button
                    key={cta}
                    type="button"
                    onClick={() => setCtaSticker(cta)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                      ctaSticker === cta
                        ? 'bg-[#E0A96D] text-[#1C0E10] font-black shadow'
                        : 'bg-[#140709] text-[#D4A373] border border-[#381B1E] hover:text-[#FFF8F0]'
                    }`}
                  >
                    {cta}
                  </button>
                ))}
              </div>
            </div>

            {/* Poll Toggle */}
            <div className="pt-2 flex items-center justify-between border-t border-[#381B1E] text-xs">
              <span className="text-[#FFF8F0] font-medium">Include Interactive Poll Sticker</span>
              <button
                type="button"
                onClick={() => setShowPoll(!showPoll)}
                className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                  showPoll ? 'bg-[#8B1E2D]/50 text-[#F5C2C7] border border-[#8B1E2D]' : 'bg-[#251214] text-[#A87B51] border border-[#381B1E]'
                }`}
              >
                {showPoll ? 'Active' : 'Disabled'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
