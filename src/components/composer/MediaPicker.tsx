import React, { useState } from 'react';
import {
  Sparkles,
  Upload,
  Image as ImageIcon,
  X,
  Wand2,
  Check,
  RefreshCw,
  Layers,
  ArrowRight,
  Eye,
  Sliders,
  Download,
} from 'lucide-react';
import { AdditionalInputs, BrandKit, MediaAsset } from '../../types';
import { generateImageByContext } from '../../services/api';

interface MediaPickerProps {
  media?: MediaAsset;
  onChangeMedia: (media?: MediaAsset) => void;
  sourceContent: string;
  additionalInputs?: AdditionalInputs;
  brandKit?: BrandKit;
  onNotify: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
}

export const MediaPicker: React.FC<MediaPickerProps> = ({
  media,
  onChangeMedia,
  sourceContent,
  additionalInputs,
  brandKit,
  onNotify,
}) => {
  const [activeTab, setActiveTab] = useState<'context_ai' | 'upload' | 'presets'>('context_ai');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedRatio, setSelectedRatio] = useState('16:9');
  const [selectedStyle, setSelectedStyle] = useState('Professional Photography');
  const [variations, setVariations] = useState<
    Array<{ id: string; title: string; url: string; style: string; aspectRatio: string }>
  >([]);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const RATIOS = [
    { label: '16:9 Landscape', value: '16:9', desc: 'LinkedIn, X, Facebook, Handshake' },
    { label: '1:1 Square', value: '1:1', desc: 'Instagram Feed, WhatsApp' },
    { label: '4:5 Portrait', value: '4:5', desc: 'Instagram Portrait' },
    { label: '9:16 Story', value: '9:16', desc: 'Snapchat, Reels, Stories' },
  ];

  const STYLES = [
    'Professional Photography',
    'Industrial & Engineering',
    'Cinematic & Atmospheric',
    'Minimalist Modern',
    'Branded Social Graphic',
    'Corporate Executive',
  ];

  const PRESETS = [
    {
      id: 'preset-cnc',
      name: 'High-Precision 5-Axis Machining Center',
      prompt: 'Professional industrial photograph of CNC machinist operating 5-axis center in clean facility',
      url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
      ratio: '16:9',
      style: 'Industrial & Engineering',
    },
    {
      id: 'preset-cafe',
      name: 'Modern Specialty Espresso Bar & Bakery',
      prompt: 'Interior architectural photograph of artisan coffee bar, natural light, minimalist oak counter',
      url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80',
      ratio: '16:9',
      style: 'Warm Artisan Interior',
    },
    {
      id: 'preset-tech',
      name: 'Modern Cloud Architecture & Engineering Workspace',
      prompt: 'High-end developer desk setup with dual displays and ambient workspace lighting',
      url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
      ratio: '16:9',
      style: 'Tech & Digital Abstract',
    },
    {
      id: 'preset-office',
      name: 'Collaborative Headquarters Campus',
      prompt: 'Modern architectural interior of bright collaborative workspace with living plants and wood accents',
      url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
      ratio: '16:9',
      style: 'Corporate Executive',
    },
  ];

  // Helper to extract a readable live context summary from the post text
  const liveContextSummary = React.useMemo(() => {
    if (!sourceContent.trim()) return '';
    const hasCnc = /cnc|machin|engineer|operator|aerospace/i.test(sourceContent);
    const hasCafe = /coffee|cafe|bakery|espresso|restaurant/i.test(sourceContent);
    const hasTech = /software|developer|ai|saas|app|code|cloud/i.test(sourceContent);
    const hasJob = /vacancy|hiring|salary|job|position|recruit/i.test(sourceContent);

    const comp = additionalInputs?.companyName || brandKit?.companyName;
    const salary = additionalInputs?.salary || additionalInputs?.price;
    const loc = additionalInputs?.location;

    const extras = [comp, loc, salary].filter(Boolean).join(' · ');

    if (hasCnc && hasJob) return `Industrial CNC 5-Axis Recruitment ${extras ? `(${extras})` : ''}`;
    if (hasCafe) return `Artisan Coffee & Cafe Experience ${extras ? `(${extras})` : ''}`;
    if (hasTech) return `Cloud Software & Tech Release ${extras ? `(${extras})` : ''}`;
    if (hasJob) return `Professional Career Opportunity ${extras ? `(${extras})` : ''}`;

    const snippet = sourceContent.trim().split(/\s+/).slice(0, 7).join(' ');
    return `${snippet}... ${extras ? `(${extras})` : ''}`;
  }, [sourceContent, additionalInputs, brandKit]);

  // Core handler: Generate image by post context without user typing prompts!
  const handleGenerateByContext = async () => {
    if (!sourceContent.trim()) {
      onNotify('info', 'Post Content Needed', 'Type your post content first so AI can extract the visual context.');
      return;
    }

    try {
      setIsGenerating(true);
      const res = await generateImageByContext({
        content: sourceContent,
        additionalInputs,
        brandKit,
        style: selectedStyle,
        ratio: selectedRatio,
      });

      if (res.success && res.primaryImage) {
        onChangeMedia(res.primaryImage);
        if (res.variations && res.variations.length > 0) {
          setVariations(res.variations);
        }
        onNotify('success', 'Visual Image Generated', 'Context matched to your post content.');
      } else {
        onNotify('error', 'Generation Notice', (res as any).error || 'Could not generate visual image.');
      }
    } catch (err: any) {
      onNotify('error', 'Image Error', err.message || 'Error creating contextual image.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      onNotify('error', 'Invalid File', 'Please upload a PNG, JPG, or WebP image.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      onNotify('error', 'File Too Large', 'Maximum image upload size is 10MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const img = new Image();
      img.onload = () => {
        const ratioVal = img.width >= img.height * 1.3 ? '16:9' : img.width === img.height ? '1:1' : '4:5';
        const newMedia: MediaAsset = {
          id: `upload-${Date.now()}`,
          url: result,
          name: file.name,
          type: 'upload',
          aspectRatio: ratioVal,
          resolution: `${img.width}x${img.height}`,
          sizeBytes: file.size,
        };
        onChangeMedia(newMedia);
        onNotify('success', 'Image Uploaded', `${file.name} ready for publishing.`);
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="rounded-2xl bg-[#1C0E10]/95 border border-[#381B1E] p-5 space-y-4 shadow-xl">
      {/* Header and Mode Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#8B1E2D]/25 border border-[#A62639]/40 text-[#F5C2C7]">
            <Sparkles className="w-4 h-4 text-[#E0A96D]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#FFF8F0] flex items-center gap-2">
              Visual Graphic & Image Asset
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#8B1E2D]/30 border border-[#A62639]/40 text-[#F5C2C7] uppercase font-bold">
                Context-Driven
              </span>
            </h3>
            <p className="text-xs text-[#D4A373]">
              AI extracts context from your post and creates matching visual assets automatically
            </p>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1 p-1 bg-[#14090A] rounded-xl border border-[#381B1E] self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('context_ai')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'context_ai'
                ? 'bg-gradient-to-r from-[#8B1E2D] to-[#A62639] text-white shadow-sm'
                : 'text-[#D4A373] hover:text-[#FFF8F0]'
            }`}
          >
            <Wand2 className="w-3.5 h-3.5 text-[#E0A96D]" />
            <span>Generate by Context</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'upload' ? 'bg-[#251214] text-[#FFF8F0] border border-[#381B1E]' : 'text-[#D4A373] hover:text-[#FFF8F0]'
            }`}
          >
            Upload File
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('presets')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'presets' ? 'bg-[#251214] text-[#FFF8F0] border border-[#381B1E]' : 'text-[#D4A373] hover:text-[#FFF8F0]'
            }`}
          >
            Presets
          </button>
        </div>
      </div>

      {/* Main Tab: Generate by Context (No Prompt Writing Required!) */}
      {activeTab === 'context_ai' && (
        <div className="space-y-4">
          {/* Live Context Inferred from Post Content */}
          {liveContextSummary && (
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#251214] border border-[#442125] text-xs">
              <Sparkles className="w-4 h-4 text-[#E0A96D] shrink-0" />
              <div className="min-w-0 flex-1">
                <span className="font-bold text-[#E0A96D] mr-2">Inferred Post Context:</span>
                <span className="text-[#FFF8F0]">{liveContextSummary}</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold shrink-0">
                Ready to Generate
              </span>
            </div>
          )}

          {/* Generation Trigger Bar */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-[#2D1418] via-[#1E0E11] to-[#14090A] border border-[#8B1E2D]/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-md">
            <div className="space-y-1 max-w-xl">
              <p className="text-xs font-bold text-[#FFF8F0] flex items-center gap-2">
                <span>Automatic Context Visualizer</span>
                <span className="text-[10px] text-emerald-400 font-mono">Generates image by context (no prompt needed)</span>
              </p>
              <p className="text-xs text-[#D4A373] leading-relaxed">
                Reads your announcement above, infers the subject domain, workplace, or product context, and creates matching high-resolution photography and social cards automatically.
              </p>
            </div>

            <button
              type="button"
              onClick={handleGenerateByContext}
              disabled={isGenerating}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#8B1E2D] to-[#A62639] hover:from-[#A62639] hover:to-[#C93B51] text-white text-xs font-bold shadow-lg shadow-[#8B1E2D]/35 active:scale-95 transition-all disabled:opacity-60 whitespace-nowrap"
            >
              <Wand2 className={`w-4 h-4 ${isGenerating ? 'animate-spin text-[#E0A96D]' : 'text-[#E0A96D]'}`} />
              <span>{isGenerating ? 'Rendering Contextual Image...' : 'Generate Image by Context'}</span>
            </button>
          </div>

          {/* Ratio & Style Options Bar (Quick Toggles) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-medium text-[#D4A373] mb-1">Target Aspect Ratio</label>
              <select
                value={selectedRatio}
                onChange={(e) => setSelectedRatio(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-[#14090A] border border-[#381B1E] text-xs text-[#FFF8F0] focus:outline-none focus:border-[#8B1E2D]"
              >
                {RATIOS.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label} ({r.desc})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#D4A373] mb-1">Preferred Aesthetic Style</label>
              <select
                value={selectedStyle}
                onChange={(e) => setSelectedStyle(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-[#14090A] border border-[#381B1E] text-xs text-[#FFF8F0] focus:outline-none focus:border-[#8B1E2D]"
              >
                {STYLES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Attached Post Image Display */}
          {media && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs text-[#D4A373]">
                <span className="font-semibold text-[#FFF8F0] flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-400" />
                  Active Attached Post Image
                </span>
                <button
                  type="button"
                  onClick={() => onChangeMedia(undefined)}
                  className="text-[#D4A373] hover:text-rose-400 transition-colors"
                >
                  Remove Image
                </button>
              </div>

              <div className="relative aspect-video max-h-72 w-full rounded-2xl overflow-hidden bg-[#14090A] border-2 border-[#8B1E2D]/50 shadow-xl group">
                <img
                  src={media.url}
                  alt={media.name || 'Post asset'}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#14090A]/90 via-transparent to-black/20" />

                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-1.5 border border-white/20">
                  <ImageIcon className="w-3.5 h-3.5 text-[#E0A96D]" />
                  <span>{media.name || 'Attached Graphic Asset'}</span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-[#FFF8F0]">
                  <span className="font-medium text-[#D4A373]">Aspect Ratio: {media.aspectRatio || '16:9'}</span>
                  <span className="px-2 py-0.5 rounded bg-[#8B1E2D]/80 text-[#F5C2C7] font-mono text-[11px]">
                    Ready for Publishing
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Upload File Tab */}
      {activeTab === 'upload' && (
        <div className="space-y-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />

          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-[#381B1E] hover:border-[#8B1E2D] rounded-2xl p-8 text-center cursor-pointer transition-colors bg-[#14090A]/50 space-y-3"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#251214] border border-[#381B1E] flex items-center justify-center text-[#E0A96D] mx-auto">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#FFF8F0]">Click to upload brand photo or graphic</p>
              <p className="text-xs text-[#D4A373] mt-1">Supports PNG, JPG, WebP up to 10MB</p>
            </div>
          </div>
        </div>
      )}

      {/* Presets Tab */}
      {activeTab === 'presets' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {PRESETS.map((pr) => (
            <div
              key={pr.id}
              onClick={() => {
                onChangeMedia({
                  id: pr.id,
                  url: pr.url,
                  name: pr.name,
                  type: 'preset',
                  aspectRatio: pr.ratio,
                  style: pr.style,
                });
                onNotify('success', 'Preset Selected', pr.name);
              }}
              className="p-3 rounded-xl bg-[#251214] border border-[#381B1E] hover:border-[#8B1E2D]/60 cursor-pointer transition-all flex items-center gap-3 group"
            >
              <div className="w-16 h-12 rounded-lg overflow-hidden bg-black shrink-0">
                <img src={pr.url} alt={pr.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-[#FFF8F0] truncate group-hover:text-[#E0A96D] transition-colors">{pr.name}</p>
                <p className="text-[11px] text-[#D4A373] truncate">{pr.style} · {pr.ratio}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
