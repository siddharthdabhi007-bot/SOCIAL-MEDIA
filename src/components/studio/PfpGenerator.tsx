import React, { useState } from 'react';
import {
  Sparkles,
  User,
  Download,
  Check,
  RefreshCw,
  Palette,
  Camera,
  Shield,
  Layers,
  Wand2,
} from 'lucide-react';
import { BrandKit, PfpOption } from '../../types';

interface PfpGeneratorProps {
  brandKit: BrandKit;
  onUpdateBrandKit: (updated: BrandKit) => void;
  onNotify: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
  compact?: boolean;
}

export const PfpGenerator: React.FC<PfpGeneratorProps> = ({
  brandKit,
  onUpdateBrandKit,
  onNotify,
  compact = false,
}) => {
  const [name, setName] = useState(brandKit.companyName || 'Apex Precision');
  const [roleOrTagline, setRoleOrTagline] = useState(brandKit.tagline || 'Industrial Engineering');
  const [selectedStyle, setSelectedStyle] = useState<'studio' | 'monogram' | '3d' | 'cyber'>('monogram');
  const [shape, setShape] = useState<'circle' | 'rounded'>('circle');
  const [accentColor, setAccentColor] = useState('#8B1E2D');
  const [isGenerating, setIsGenerating] = useState(false);

  // Generate initials monogram
  const initials = name
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'OP';

  // SVG Monogram generator
  const createMonogramDataUrl = (bg: string, fg: string, border: string, text: string) => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
      <defs>
        <linearGradient id="pfpGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${bg}" />
          <stop offset="100%" stop-color="#14090A" />
        </linearGradient>
      </defs>
      <rect width="500" height="500" rx="${shape === 'circle' ? '250' : '90'}" fill="url(#pfpGrad)" />
      <circle cx="250" cy="250" r="235" fill="none" stroke="${border}" stroke-width="8" opacity="0.6" stroke-dasharray="12 8" />
      <circle cx="250" cy="250" r="215" fill="none" stroke="${border}" stroke-width="3" opacity="0.3" />
      <text x="250" y="295" font-family="system-ui, -apple-system, sans-serif" font-size="160" font-weight="900" fill="${fg}" text-anchor="middle" letter-spacing="4">
        ${text}
      </text>
    </svg>`;
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  };

  const STYLES = [
    {
      id: 'monogram',
      name: 'Geometric Monogram',
      desc: 'High-contrast typography initials with luxury border',
      url: createMonogramDataUrl('#8B1E2D', '#FFF8F0', '#E0A96D', initials),
    },
    {
      id: 'studio',
      name: 'Studio Executive',
      desc: 'Sophisticated dark chocolate & caramel emblem',
      url: createMonogramDataUrl('#4A2810', '#E0A96D', '#A62639', initials),
    },
    {
      id: '3d',
      name: '3D Gold Foil Emblem',
      desc: 'Deep wine maroon backdrop with warm amber gold',
      url: createMonogramDataUrl('#671018', '#F5EBE0', '#D4934E', initials),
    },
    {
      id: 'cyber',
      name: 'Cyber Aura Glow',
      desc: 'Modern tech radiance for founders & creators',
      url: createMonogramDataUrl('#A62639', '#FFFFFF', '#F2B0BB', initials),
    },
  ];

  const currentPreviewUrl =
    STYLES.find((s) => s.id === selectedStyle)?.url || STYLES[0].url;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = currentPreviewUrl;
    link.download = `${name.toLowerCase().replace(/\s+/g, '-')}-pfp.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onNotify('success', 'PFP Downloaded', 'Profile image saved.');
  };

  const handleApplyToBrandKit = () => {
    onUpdateBrandKit({
      ...brandKit,
      logoUrl: currentPreviewUrl,
    });
    onNotify('success', 'Avatar Set', 'Applied as active company avatar.');
  };

  return (
    <div className={`space-y-6 ${compact ? 'text-xs' : ''}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#381B1E] pb-3">
        <div>
          <h2 className="text-xl font-extrabold text-[#FFF8F0] tracking-tight flex items-center gap-2">
            <Camera className="w-5 h-5 text-[#E0A96D]" />
            <span>PFP & Brand Avatar Studio</span>
          </h2>
          <p className="text-xs text-[#D4A373] mt-0.5">
            Craft high-converting profile pictures for Instagram, LinkedIn, X, and WhatsApp
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#251214] hover:bg-[#381B1E] text-xs font-semibold text-[#FFF8F0] border border-[#381B1E] transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-[#E0A96D]" />
            <span>Download Image</span>
          </button>
          <button
            onClick={handleApplyToBrandKit}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#8B1E2D] to-[#A62639] hover:from-[#A62639] hover:to-[#C93B51] text-xs font-bold text-white shadow-lg shadow-[#8B1E2D]/30 transition-all"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Set as Avatar</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Live Avatar Visualizer (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-8 rounded-3xl bg-[#1C0E10]/95 border border-[#381B1E] shadow-2xl space-y-6">
          <div className="relative">
            {/* Outer customizable glowing ring */}
            <div
              className={`p-2 transition-all duration-300 shadow-2xl ${
                shape === 'circle' ? 'rounded-full' : 'rounded-3xl'
              }`}
              style={{
                background: `linear-gradient(135deg, ${accentColor}, #E0A96D)`,
                boxShadow: `0 0 35px ${accentColor}50`,
              }}
            >
              <div
                className={`w-44 h-44 sm:w-52 sm:h-52 bg-[#14090A] overflow-hidden flex items-center justify-center border-4 border-[#14090A] ${
                  shape === 'circle' ? 'rounded-full' : 'rounded-2xl'
                }`}
              >
                <img
                  src={currentPreviewUrl}
                  alt="Profile Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Verified badge simulation */}
            <div className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-[#8B1E2D] border-2 border-[#14090A] flex items-center justify-center text-white text-xs font-bold shadow">
              ✓
            </div>
          </div>

          <div className="text-center space-y-1">
            <h3 className="text-base font-bold text-[#FFF8F0]">{name}</h3>
            <p className="text-xs text-[#D4A373]">{roleOrTagline}</p>
          </div>

          {/* Frame Shape Toggle */}
          <div className="flex items-center gap-2 p-1 rounded-xl bg-[#14090A] border border-[#381B1E] text-xs">
            <button
              onClick={() => setShape('circle')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                shape === 'circle' ? 'bg-[#8B1E2D] text-white shadow-sm' : 'text-[#D4A373] hover:text-[#FFF8F0]'
              }`}
            >
              Circular Frame (IG / X)
            </button>
            <button
              onClick={() => setShape('rounded')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                shape === 'rounded' ? 'bg-[#8B1E2D] text-white shadow-sm' : 'text-[#D4A373] hover:text-[#FFF8F0]'
              }`}
            >
              Rounded Square (LinkedIn)
            </button>
          </div>
        </div>

        {/* Right Side: Avatar Customization Controls (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="rounded-2xl bg-[#1C0E10]/95 border border-[#381B1E] p-5 space-y-4 shadow-xl">
            <h3 className="text-xs font-bold text-[#FFF8F0] uppercase tracking-wider">
              Profile & Brand Identity Parameters
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#D4A373] mb-1">Company / Handle</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#14090A] border border-[#381B1E] text-xs text-[#FFF8F0] focus:outline-none focus:border-[#8B1E2D]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#D4A373] mb-1">Tagline / Industry</label>
                <input
                  type="text"
                  value={roleOrTagline}
                  onChange={(e) => setRoleOrTagline(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#14090A] border border-[#381B1E] text-xs text-[#FFF8F0] focus:outline-none focus:border-[#8B1E2D]"
                />
              </div>
            </div>

            {/* Style Cards */}
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-medium text-[#D4A373]">Avatar Aesthetic Style</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {STYLES.map((st) => (
                  <div
                    key={st.id}
                    onClick={() => setSelectedStyle(st.id as any)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all space-y-1 ${
                      selectedStyle === st.id
                        ? 'bg-[#8B1E2D]/25 border-[#8B1E2D] shadow-md'
                        : 'bg-[#14090A] border-[#381B1E] hover:border-[#8B1E2D]/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-[#FFF8F0]">{st.name}</p>
                      {selectedStyle === st.id && <Check className="w-3.5 h-3.5 text-[#E0A96D]" />}
                    </div>
                    <p className="text-[11px] text-[#D4A373] leading-snug">{st.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Accent Ring Color */}
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-medium text-[#D4A373]">Accent Ring Glow Color</label>
              <div className="flex items-center gap-3">
                {['#8B1E2D', '#A62639', '#4A2810', '#E0A96D', '#D4934E', '#10B981'].map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setAccentColor(color)}
                    className="w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 flex items-center justify-center"
                    style={{
                      backgroundColor: color,
                      borderColor: accentColor === color ? '#FFFFFF' : 'transparent',
                    }}
                  >
                    {accentColor === color && <Check className="w-3.5 h-3.5 text-white" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
