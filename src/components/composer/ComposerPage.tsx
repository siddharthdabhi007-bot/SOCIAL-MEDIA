import React, { useState } from 'react';
import {
  Sparkles,
  ChevronDown,
  ChevronUp,
  Globe,
  Briefcase,
  Building,
  MapPin,
  Calendar,
  DollarSign,
  Phone,
  Target,
  Key,
  Check,
  Wand2,
  Layers,
  ArrowRight,
  FileText,
  Link2,
} from 'lucide-react';
import {
  AdditionalInputs,
  AudienceType,
  BrandKit,
  LanguageType,
  MediaAsset,
  PlatformId,
  Project,
  ToneType,
} from '../../types';
import {
  ALL_PLATFORM_IDS,
  AUDIENCES_LIST,
  LANGUAGES_LIST,
  PLATFORMS_CONFIG,
  TONES_LIST,
} from '../../config/platforms';
import { MediaPicker } from './MediaPicker';
import { extractFromUrl, generateImageByContext, generateSocialPosts } from '../../services/api';
import { POST_TEMPLATES } from '../../services/templates';

interface ComposerPageProps {
  currentProject: Project;
  onUpdateProject: (updated: Project) => void;
  onGenerationComplete: () => void;
  onNotify: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
  brandKit: BrandKit;
  onNavigateTab?: (tab: string) => void;
}

export const ComposerPage: React.FC<ComposerPageProps> = ({
  currentProject,
  onUpdateProject,
  onGenerationComplete,
  onNotify,
  brandKit,
  onNavigateTab,
}) => {
  const [showAdditionalInputs, setShowAdditionalInputs] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');
  const [isExtractingUrl, setIsExtractingUrl] = useState(false);
  const [urlInput, setUrlInput] = useState('');

  const {
    sourceContent,
    additionalInputs = {},
    selectedPlatforms = [],
    tone = 'auto',
    language = 'english',
    audience = 'general',
    customAudience = '',
    media,
  } = currentProject;

  const handleUpdate = (fields: Partial<Project>) => {
    onUpdateProject({
      ...currentProject,
      ...fields,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleUpdateInputs = (key: keyof AdditionalInputs, value: string) => {
    handleUpdate({
      additionalInputs: {
        ...additionalInputs,
        [key]: value,
      },
    });
  };

  const togglePlatform = (id: PlatformId) => {
    const exists = selectedPlatforms.includes(id);
    let updated: PlatformId[];
    if (exists) {
      updated = selectedPlatforms.filter((p) => p !== id);
    } else {
      updated = [...selectedPlatforms, id];
    }
    handleUpdate({ selectedPlatforms: updated });
  };

  const selectAllPlatforms = () => {
    if (selectedPlatforms.length === ALL_PLATFORM_IDS.length) {
      handleUpdate({ selectedPlatforms: ['linkedin', 'instagram', 'twitter'] });
    } else {
      handleUpdate({ selectedPlatforms: [...ALL_PLATFORM_IDS] });
    }
  };

  const handleLoadSample = (templateId: string) => {
    const t = POST_TEMPLATES.find((item) => item.id === templateId);
    if (!t) return;
    handleUpdate({
      title: t.title,
      sourceContent: t.sampleContent,
      additionalInputs: { ...t.additionalInputs },
      selectedPlatforms: [...t.recommendedPlatforms],
      tone: t.suggestedTone,
    });
    setShowAdditionalInputs(true);
    onNotify('info', `Loaded: ${t.title}`, 'Sample data pre-filled into composer.');
  };

  const handleExtractUrl = async () => {
    if (!urlInput || !urlInput.startsWith('http')) {
      onNotify('error', 'Invalid URL', 'Please enter a valid URL starting with http:// or https://');
      return;
    }

    try {
      setIsExtractingUrl(true);
      const res = await extractFromUrl(urlInput);
      handleUpdate({
        sourceContent: res.extractedContent,
        additionalInputs: {
          ...additionalInputs,
          url: urlInput,
          productName: res.title || additionalInputs.productName,
        },
      });
      onNotify('success', 'Webpage Extracted', `Imported readable content from ${res.title || 'URL'}`);
    } catch (err: any) {
      onNotify('error', 'Extraction Failed', err.message);
    } finally {
      setIsExtractingUrl(false);
    }
  };

  const handleGenerate = async () => {
    if (!sourceContent.trim()) {
      onNotify('error', 'Content Required', 'Please enter content or describe your announcement.');
      return;
    }
    if (selectedPlatforms.length === 0) {
      onNotify('error', 'Platform Required', 'Please select at least one social media platform.');
      return;
    }

    try {
      setIsGenerating(true);

      // Multi-step progress indicators
      setGenerationStep('Analyzing source content & tone semantics...');
      await new Promise((r) => setTimeout(r, 400));

      setGenerationStep(`Formulating rules for ${selectedPlatforms.length} platforms...`);
      await new Promise((r) => setTimeout(r, 400));

      setGenerationStep('Generating platform-native hooks, body copy, and hashtags...');

      // If no media is selected, automatically generate matching image by context
      let generatedMedia = media;
      if (!generatedMedia) {
        setGenerationStep('Generating matching visual from post context...');
        try {
          const imgRes = await generateImageByContext({
            content: sourceContent,
            additionalInputs,
            brandKit,
            style: 'Professional Photography',
            ratio: '16:9',
          });
          if (imgRes.success && imgRes.primaryImage) {
            generatedMedia = imgRes.primaryImage;
          }
        } catch (imgErr) {
          console.warn('Auto image generation error:', imgErr);
        }
      }

      const response = await generateSocialPosts({
        content: sourceContent,
        platforms: selectedPlatforms,
        tone,
        language,
        audience,
        customAudience,
        additionalInputs,
        brandKit,
      });

      // Construct PlatformPostResult objects
      const newPostsMap: Partial<Record<PlatformId, any>> = { ...currentProject.platformPosts };

      for (const pId of selectedPlatforms) {
        const rawItem = response.results[pId];
        if (rawItem) {
          newPostsMap[pId] = {
            id: `${pId}-${Date.now()}`,
            platform: pId,
            hook: rawItem.hook,
            body: rawItem.body,
            cta: rawItem.cta,
            hashtags: rawItem.hashtags || [],
            fullPost: rawItem.fullPost,
            characterCount: rawItem.fullPost.length,
            estimatedReadingTimeSeconds: Math.max(5, Math.round((rawItem.fullPost.trim().split(/\s+/).length / 200) * 60)),
            status: 'generated',
            versions: [],
          };
        }
      }

      handleUpdate({
        platformPosts: newPostsMap,
        media: generatedMedia,
        status: 'generated',
      });

      onNotify('success', 'Posts Ready!', `Generated tailored content for ${selectedPlatforms.length} platforms.`);
      onGenerationComplete();
    } catch (err: any) {
      onNotify('error', 'Generation Error', err.message || 'Could not generate posts.');
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  return (
    <div className="space-y-8 pb-28">
      {/* Hero Composer Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#381B1E] pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#FFF8F0]">
            What do you want to post about?
          </h1>
          <p className="text-xs text-[#D4A373] mt-0.5">
            Provide raw content or an idea. OmniPost AI transforms it into tailored visual posts for every platform.
          </p>
        </div>

        {/* Quick Sample Chips */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] text-[#A87B51] font-medium mr-1">Try Sample:</span>
          <button
            type="button"
            onClick={() => handleLoadSample('cnc-operator-job')}
            className="px-2.5 py-1 rounded-lg bg-[#251214] hover:bg-[#381B1E] border border-[#381B1E] text-[11px] text-[#E0A96D] font-medium transition-colors"
          >
            CNC Vacancy (Israel)
          </button>
          <button
            type="button"
            onClick={() => handleLoadSample('cafe-grand-opening')}
            className="px-2.5 py-1 rounded-lg bg-[#251214] hover:bg-[#381B1E] border border-[#381B1E] text-[11px] text-[#E0A96D] font-medium transition-colors"
          >
            Cafe Opening
          </button>
          <button
            type="button"
            onClick={() => handleLoadSample('new-product-launch')}
            className="px-2.5 py-1 rounded-lg bg-[#251214] hover:bg-[#381B1E] border border-[#381B1E] text-[11px] text-[#E0A96D] font-medium transition-colors"
          >
            Product Launch
          </button>
        </div>
      </div>

      {/* Primary Input Container */}
      <div className="space-y-4">
        <div className="rounded-2xl bg-[#1C0E10]/95 border border-[#381B1E] p-5 space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-[#FFF8F0] flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 text-[#E0A96D]" />
              Source Content, Idea, or Announcement
            </label>
            <span className="text-[11px] text-[#A87B51] font-mono">
              {sourceContent.length} characters
            </span>
          </div>

          <textarea
            rows={6}
            value={sourceContent}
            onChange={(e) => handleUpdate({ sourceContent: e.target.value })}
            placeholder="Describe your vacancy, product launch, office opening, event, discount offer, or paste an article / announcement here..."
            className="w-full p-4 rounded-xl bg-[#14090A] border border-[#381B1E] text-sm leading-relaxed text-[#FFF8F0] placeholder-[#A87B51] focus:outline-none focus:border-[#8B1E2D] transition-colors resize-y"
          />

          {/* Quick URL Extractor Toolbar */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 text-xs">
            <div className="relative flex-1">
              <Link2 className="w-3.5 h-3.5 text-[#A87B51] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="url"
                placeholder="Or paste an article / webpage URL to extract (https://...)"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#14090A] border border-[#381B1E] text-xs text-[#FFF8F0] placeholder-[#A87B51] focus:outline-none focus:border-[#8B1E2D]"
              />
            </div>
            <button
              type="button"
              onClick={handleExtractUrl}
              disabled={isExtractingUrl}
              className="px-3 py-1.5 rounded-lg bg-[#251214] hover:bg-[#381B1E] text-xs font-medium text-[#FFF8F0] border border-[#381B1E] whitespace-nowrap transition-colors"
            >
              {isExtractingUrl ? 'Extracting...' : 'Extract Content'}
            </button>
          </div>
        </div>

        {/* Collapsible Additional Inputs Accordion */}
        <div className="rounded-2xl bg-[#1C0E10]/80 border border-[#381B1E] overflow-hidden">
          <button
            type="button"
            onClick={() => setShowAdditionalInputs(!showAdditionalInputs)}
            className="w-full flex items-center justify-between p-4 text-xs font-semibold text-[#FFF8F0] hover:bg-[#251214] transition-colors"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#E0A96D]" />
              <span>Smart Metadata & Fact Anchors (Optional)</span>
              <span className="text-[11px] text-[#D4A373] font-normal">
                — AI extracts these automatically, or fill for 100% precision
              </span>
            </div>
            {showAdditionalInputs ? <ChevronUp className="w-4 h-4 text-[#A87B51]" /> : <ChevronDown className="w-4 h-4 text-[#A87B51]" />}
          </button>

          {showAdditionalInputs && (
            <div className="p-5 pt-1 border-t border-[#381B1E] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 text-xs animate-in fade-in duration-150">
              <div>
                <label className="block text-[#D4A373] mb-1 flex items-center gap-1.5">
                  <Building className="w-3 h-3 text-[#A87B51]" /> Company Name
                </label>
                <input
                  type="text"
                  value={additionalInputs.companyName || ''}
                  onChange={(e) => handleUpdateInputs('companyName', e.target.value)}
                  placeholder={brandKit.companyName || 'e.g. Apex Precision'}
                  className="w-full px-3 py-1.5 rounded-lg bg-[#14090A] border border-[#381B1E] text-[#FFF8F0] placeholder-[#A87B51] focus:outline-none focus:border-[#8B1E2D]"
                />
              </div>

              <div>
                <label className="block text-[#D4A373] mb-1 flex items-center gap-1.5">
                  <Briefcase className="w-3 h-3 text-[#A87B51]" /> Job Role / Product Name
                </label>
                <input
                  type="text"
                  value={additionalInputs.productName || ''}
                  onChange={(e) => handleUpdateInputs('productName', e.target.value)}
                  placeholder="e.g. 5-Axis CNC Operator"
                  className="w-full px-3 py-1.5 rounded-lg bg-[#14090A] border border-[#381B1E] text-[#FFF8F0] placeholder-[#A87B51] focus:outline-none focus:border-[#8B1E2D]"
                />
              </div>

              <div>
                <label className="block text-[#D4A373] mb-1 flex items-center gap-1.5">
                  <DollarSign className="w-3 h-3 text-[#A87B51]" /> Salary / Compensation / Price
                </label>
                <input
                  type="text"
                  value={additionalInputs.salary || additionalInputs.price || ''}
                  onChange={(e) => handleUpdateInputs('salary', e.target.value)}
                  placeholder="e.g. ₹2.5 - 3.5 Lakh / month"
                  className="w-full px-3 py-1.5 rounded-lg bg-[#14090A] border border-[#381B1E] text-[#FFF8F0] placeholder-[#A87B51] focus:outline-none focus:border-[#8B1E2D]"
                />
              </div>

              <div>
                <label className="block text-[#D4A373] mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-[#A87B51]" /> Location / Relocation
                </label>
                <input
                  type="text"
                  value={additionalInputs.location || ''}
                  onChange={(e) => handleUpdateInputs('location', e.target.value)}
                  placeholder="e.g. Israel (Visa Sponsored)"
                  className="w-full px-3 py-1.5 rounded-lg bg-[#14090A] border border-[#381B1E] text-[#FFF8F0] placeholder-[#A87B51] focus:outline-none focus:border-[#8B1E2D]"
                />
              </div>

              <div>
                <label className="block text-[#D4A373] mb-1 flex items-center gap-1.5">
                  <Phone className="w-3 h-3 text-[#A87B51]" /> Contact Phone / WhatsApp
                </label>
                <input
                  type="text"
                  value={additionalInputs.contact || ''}
                  onChange={(e) => handleUpdateInputs('contact', e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full px-3 py-1.5 rounded-lg bg-[#14090A] border border-[#381B1E] text-[#FFF8F0] placeholder-[#A87B51] focus:outline-none focus:border-[#8B1E2D]"
                />
              </div>

              <div>
                <label className="block text-[#D4A373] mb-1 flex items-center gap-1.5">
                  <Target className="w-3 h-3 text-[#A87B51]" /> Specific Call to Action
                </label>
                <input
                  type="text"
                  value={additionalInputs.cta || ''}
                  onChange={(e) => handleUpdateInputs('cta', e.target.value)}
                  placeholder="e.g. DM resume or call on WhatsApp"
                  className="w-full px-3 py-1.5 rounded-lg bg-[#14090A] border border-[#381B1E] text-[#FFF8F0] placeholder-[#A87B51] focus:outline-none focus:border-[#8B1E2D]"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Visual Asset & Contextual Image Generator */}
      <MediaPicker
        media={media}
        onChangeMedia={(newMedia) => handleUpdate({ media: newMedia })}
        sourceContent={sourceContent}
        additionalInputs={additionalInputs}
        brandKit={brandKit}
        onNotify={onNotify}
      />

      {/* Post Format & Creative Options Bar */}
      <div className="rounded-2xl bg-[#1C0E10]/95 border border-[#381B1E] p-5 space-y-3 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-[#FFF8F0] flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#E0A96D]" />
              <span>Post Format Architecture</span>
            </h3>
            <p className="text-xs text-[#D4A373]">
              Select output architecture: Standard post, multi-slide carousel deck, video script, or thread
            </p>
          </div>

          {onNavigateTab && (
            <div className="flex items-center gap-1.5 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => onNavigateTab('story')}
                className="px-2.5 py-1 rounded-lg bg-[#251214] hover:bg-[#381B1E] border border-[#381B1E] text-[11px] font-semibold text-[#E0A96D] transition-colors"
              >
                📱 Open Story Maker
              </button>
              <button
                type="button"
                onClick={() => onNavigateTab('pfp')}
                className="px-2.5 py-1 rounded-lg bg-[#251214] hover:bg-[#381B1E] border border-[#381B1E] text-[11px] font-semibold text-[#E0A96D] transition-colors"
              >
                🎨 PFP Studio
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
          {[
            { id: 'feed', label: 'Standard Post', desc: 'Single high-impact caption' },
            { id: 'carousel', label: 'Carousel Deck', desc: '5-slide swipeable breakdown' },
            { id: 'video_script', label: 'Reel Script', desc: '60s timed short-form video' },
            { id: 'thread', label: 'Multi-Thread', desc: 'Numbered 1/5, 2/5 series' },
          ].map((fmt) => {
            const isSelected = (currentProject.postFormat || 'feed') === fmt.id;
            return (
              <button
                key={fmt.id}
                type="button"
                onClick={() => handleUpdate({ postFormat: fmt.id as any })}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-[#8B1E2D]/25 border-[#8B1E2D] shadow-md'
                    : 'bg-[#14090A] border-[#381B1E] hover:border-[#8B1E2D]/50'
                }`}
              >
                <p className={`text-xs font-bold ${isSelected ? 'text-[#F5C2C7]' : 'text-[#FFF8F0]'}`}>
                  {fmt.label}
                </p>
                <p className="text-[10px] text-[#A87B51] mt-0.5">{fmt.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Platform Selector Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#FFF8F0]">Select Target Platforms</h3>
            <p className="text-xs text-[#D4A373]">
              Content will be independently crafted according to each platform's writing culture and character limits.
            </p>
          </div>
          <button
            type="button"
            onClick={selectAllPlatforms}
            className="text-xs font-semibold text-[#E0A96D] hover:text-[#FFF8F0] transition-colors"
          >
            {selectedPlatforms.length === ALL_PLATFORM_IDS.length ? 'Deselect Extra' : 'Select All 7'}
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {ALL_PLATFORM_IDS.map((pId) => {
            const p = PLATFORMS_CONFIG[pId];
            const isSelected = selectedPlatforms.includes(pId);

            return (
              <div
                key={pId}
                onClick={() => togglePlatform(pId)}
                className={`relative flex flex-col justify-between p-3.5 rounded-2xl cursor-pointer transition-all duration-200 select-none ${
                  isSelected
                    ? 'bg-[#1C0E10] border-2 shadow-lg shadow-[#8B1E2D]/20 scale-[1.02]'
                    : 'bg-[#14090A] border border-[#381B1E] hover:bg-[#251214] hover:border-[#442125]'
                }`}
                style={{
                  borderColor: isSelected ? p.brandColor : undefined,
                }}
              >
                {/* Active Checkmark Badge */}
                <div className="flex items-center justify-between mb-2">
                  <div
                    className="w-7 h-7 rounded-xl flex items-center justify-center text-white text-xs font-bold shadow-sm"
                    style={{ backgroundColor: p.brandColor }}
                  >
                    {p.shortName}
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center border transition-colors ${
                      isSelected
                        ? 'bg-[#8B1E2D] border-[#A62639] text-white'
                        : 'border-[#381B1E] bg-[#14090A]'
                    }`}
                  >
                    {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-bold text-[#FFF8F0] leading-tight">{p.name}</p>
                  <p className="text-[10px] text-[#D4A373] mt-0.5 truncate">{p.badge}</p>
                  <p className="text-[10px] text-[#A87B51] font-mono mt-1">≤ {p.characterLimit}c</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tone, Audience & Language Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Tone Selector */}
        <div className="rounded-2xl bg-[#1C0E10]/95 border border-[#381B1E] p-4 space-y-2 shadow-md">
          <label className="block text-xs font-bold text-[#FFF8F0]">Writing Tone</label>
          <select
            value={tone}
            onChange={(e) => handleUpdate({ tone: e.target.value as ToneType })}
            className="w-full px-3 py-2 rounded-xl bg-[#14090A] border border-[#381B1E] text-xs text-[#FFF8F0] focus:outline-none focus:border-[#8B1E2D]"
          >
            {TONES_LIST.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
          <p className="text-[11px] text-[#D4A373]">Adapts voice and emotional framing.</p>
        </div>

        {/* Target Audience */}
        <div className="rounded-2xl bg-[#1C0E10]/95 border border-[#381B1E] p-4 space-y-2 shadow-md">
          <label className="block text-xs font-bold text-[#FFF8F0]">Target Audience</label>
          <select
            value={audience}
            onChange={(e) => handleUpdate({ audience: e.target.value as AudienceType })}
            className="w-full px-3 py-2 rounded-xl bg-[#14090A] border border-[#381B1E] text-xs text-[#FFF8F0] focus:outline-none focus:border-[#8B1E2D]"
          >
            {AUDIENCES_LIST.map((a) => (
              <option key={a.id} value={a.id}>
                {a.label}
              </option>
            ))}
          </select>
          {audience === 'custom' && (
            <input
              type="text"
              placeholder="e.g. Aerospace machine shop owners"
              value={customAudience}
              onChange={(e) => handleUpdate({ customAudience: e.target.value })}
              className="w-full mt-1.5 px-3 py-1.5 rounded-lg bg-[#14090A] border border-[#381B1E] text-xs text-[#FFF8F0] placeholder-[#A87B51] focus:outline-none focus:border-[#8B1E2D]"
            />
          )}
          <p className="text-[11px] text-[#D4A373]">Guides vocabulary, empathy, and hooks.</p>
        </div>

        {/* Language Selector */}
        <div className="rounded-2xl bg-[#1C0E10]/95 border border-[#381B1E] p-4 space-y-2 shadow-md">
          <label className="block text-xs font-bold text-[#FFF8F0]">Output Language</label>
          <select
            value={language}
            onChange={(e) => handleUpdate({ language: e.target.value as LanguageType })}
            className="w-full px-3 py-2 rounded-xl bg-[#14090A] border border-[#381B1E] text-xs text-[#FFF8F0] focus:outline-none focus:border-[#8B1E2D]"
          >
            {LANGUAGES_LIST.map((l) => (
              <option key={l.id} value={l.id}>
                {l.label}
              </option>
            ))}
          </select>
          <p className="text-[11px] text-[#D4A373]">Supports native and bilingual blends.</p>
        </div>
      </div>

      {/* Sticky Bottom Generation Bar with Rich Maroon Theme */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#14090A]/95 backdrop-blur-xl border-t border-[#381B1E] px-4 md:px-8 py-3.5 flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#D4A373]">
            <span>Selected:</span>
            <span className="font-semibold text-[#E0A96D] font-mono">
              {selectedPlatforms.length} {selectedPlatforms.length === 1 ? 'Platform' : 'Platforms'}
            </span>
          </div>
          {isGenerating && (
            <div className="flex items-center gap-2 text-xs text-[#E0A96D] animate-pulse">
              <Wand2 className="w-4 h-4 animate-spin text-[#E0A96D]" />
              <span>{generationStep || 'Generating platform-tailored posts...'}</span>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleGenerate}
          disabled={isGenerating}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#8B1E2D] via-[#A62639] to-[#C93B51] hover:from-[#A62639] hover:to-[#E0A96D] text-white text-xs sm:text-sm font-bold shadow-xl shadow-[#8B1E2D]/40 active:scale-95 transition-all disabled:opacity-60 whitespace-nowrap"
        >
          <Sparkles className="w-4 h-4 text-[#E0A96D]" />
          <span>
            {isGenerating
              ? 'Synthesizing Content...'
              : `Generate ${selectedPlatforms.length} Visual Posts`}
          </span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
