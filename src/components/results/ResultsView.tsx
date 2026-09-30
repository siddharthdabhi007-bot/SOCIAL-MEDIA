import React, { useState } from 'react';
import {
  Copy,
  Check,
  RefreshCw,
  Sparkles,
  History,
  Calendar,
  Eye,
  Sliders,
  Smile,
  SmilePlus,
  Briefcase,
  Flame,
  ArrowRight,
  Maximize2,
  Minimize2,
  Trash2,
  Plus,
  Wand2,
  Camera,
  Smartphone,
  Layers,
  ExternalLink,
  Image as ImageIcon,
  Download,
  Share2,
} from 'lucide-react';
import {
  BrandKit,
  MediaAsset,
  PlatformId,
  PlatformPostResult,
  Project,
} from '../../types';
import { PLATFORMS_CONFIG } from '../../config/platforms';
import { PlatformPreview } from '../previews/PlatformPreviews';
import { regenerateSinglePlatform } from '../../services/api';
import { PfpGenerator } from '../studio/PfpGenerator';
import { StoryMaker } from '../studio/StoryMaker';
import { PostOptionsView } from '../studio/PostOptionsView';
import { getRelevantImageUrl } from '../../utils/imageMatcher';

interface ResultsViewProps {
  project: Project;
  onUpdateProject: (updated: Project) => void;
  onOpenSchedule: (platform?: PlatformId) => void;
  onNotify: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
  brandKit: BrandKit;
  onUpdateBrandKit?: (updated: BrandKit) => void;
  onNavigate?: (tab: string) => void;
}

function getEffectiveImageUrl(media?: MediaAsset, postText?: string, projectTitle?: string): string {
  const combinedText = `${projectTitle || ''} ${postText || ''}`;
  return getRelevantImageUrl(media?.url, combinedText);
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  project,
  onUpdateProject,
  onOpenSchedule,
  onNotify,
  brandKit,
  onUpdateBrandKit,
  onNavigate,
}) => {
  const activePlatforms = project.selectedPlatforms.length > 0
    ? project.selectedPlatforms
    : (Object.keys(project.platformPosts) as PlatformId[]);

  const [activeTab, setActiveTab] = useState<PlatformId>(activePlatforms[0] || 'linkedin');
  const [copied, setCopied] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [newHashtagInput, setNewHashtagInput] = useState('');
  const [showVersions, setShowVersions] = useState(false);
  const [activeStudioTab, setActiveStudioTab] = useState<'pfp' | 'story' | 'post_options'>('pfp');
  const [rightPanelMode, setRightPanelMode] = useState<'simulation' | 'studio'>('simulation');
  
  // Left column view mode: 'image' (Visual graphic & image) vs 'text' (Text copy editor)
  const [leftViewMode, setLeftViewMode] = useState<'image' | 'text'>('image');

  const currentPost = project.platformPosts[activeTab];
  const config = PLATFORMS_CONFIG[activeTab];

  if (!currentPost) {
    return (
      <div className="p-12 text-center text-[#D4A373]">
        <p>No content generated for this platform yet.</p>
      </div>
    );
  }

  const isOverLimit = currentPost.fullPost.length > config.characterLimit;
  const wordCount = currentPost.fullPost.trim().split(/\s+/).filter(Boolean).length;
  const readingTimeSeconds = Math.max(5, Math.round((wordCount / 200) * 60));
  const effectiveImageUrl = getEffectiveImageUrl(project.media, currentPost.fullPost, project.title);

  const handleCopyPost = () => {
    navigator.clipboard.writeText(currentPost.fullPost);
    setCopied(true);
    onNotify('success', `${config.name} Post Copied!`, 'Formatted content copied to clipboard.');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadImage = () => {
    try {
      const link = document.createElement('a');
      link.href = effectiveImageUrl;
      link.download = `${project.title.toLowerCase().replace(/\s+/g, '-')}-${activeTab}-visual.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      onNotify('success', 'Image Downloaded', 'Graphic saved to your downloads folder.');
    } catch {
      window.open(effectiveImageUrl, '_blank');
    }
  };

  const handleUpdateFullPost = (newText: string) => {
    onUpdateProject({
      ...project,
      platformPosts: {
        ...project.platformPosts,
        [activeTab]: {
          ...currentPost,
          fullPost: newText,
          characterCount: newText.length,
          estimatedReadingTimeSeconds: Math.max(5, Math.round((newText.trim().split(/\s+/).length / 200) * 60)),
        },
      },
      updatedAt: new Date().toISOString(),
    });
  };

  const handleRemoveHashtag = (tagIndex: number) => {
    const updatedTags = currentPost.hashtags.filter((_, i) => i !== tagIndex);
    const postWithoutTags = currentPost.fullPost.replace(/(#[a-zA-Z0-9_]+\s*)+$/, '').trim();
    const newFullPost = updatedTags.length > 0 ? `${postWithoutTags}\n\n${updatedTags.join(' ')}` : postWithoutTags;

    onUpdateProject({
      ...project,
      platformPosts: {
        ...project.platformPosts,
        [activeTab]: {
          ...currentPost,
          hashtags: updatedTags,
          fullPost: newFullPost,
          characterCount: newFullPost.length,
        },
      },
    });
  };

  const handleAddHashtag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHashtagInput.trim()) return;
    const formattedTag = newHashtagInput.startsWith('#')
      ? newHashtagInput.trim()
      : `#${newHashtagInput.trim().replace(/\s+/g, '')}`;

    const updatedTags = [...currentPost.hashtags, formattedTag];
    const postWithoutTags = currentPost.fullPost.replace(/(#[a-zA-Z0-9_]+\s*)+$/, '').trim();
    const newFullPost = `${postWithoutTags}\n\n${updatedTags.join(' ')}`;

    onUpdateProject({
      ...project,
      platformPosts: {
        ...project.platformPosts,
        [activeTab]: {
          ...currentPost,
          hashtags: updatedTags,
          fullPost: newFullPost,
          characterCount: newFullPost.length,
        },
      },
    });
    setNewHashtagInput('');
  };

  const handleRegenerateWithInstruction = async (instruction: string) => {
    try {
      setIsRegenerating(true);

      const currentVersions = currentPost.versions || [];
      const newVersionNum = currentVersions.length + 1;
      const historyEntry = {
        version: newVersionNum,
        content: currentPost.fullPost,
        hook: currentPost.hook,
        body: currentPost.body,
        cta: currentPost.cta,
        hashtags: currentPost.hashtags,
        timestamp: new Date().toISOString(),
        note: `Before: ${instruction}`,
      };

      const res = await regenerateSinglePlatform({
        platform: activeTab,
        content: project.sourceContent,
        instruction: instruction,
        currentPost: currentPost,
        tone: project.tone,
        language: project.language,
        additionalInputs: project.additionalInputs,
      });

      const newPost: PlatformPostResult = {
        ...currentPost,
        hook: res.result.hook || currentPost.hook,
        body: res.result.body || currentPost.body,
        cta: res.result.cta || currentPost.cta,
        hashtags: res.result.hashtags || currentPost.hashtags,
        fullPost: res.result.fullPost,
        characterCount: res.result.fullPost.length,
        estimatedReadingTimeSeconds: Math.max(5, Math.round((res.result.fullPost.trim().split(/\s+/).length / 200) * 60)),
        versions: [historyEntry, ...currentVersions],
      };

      onUpdateProject({
        ...project,
        platformPosts: {
          ...project.platformPosts,
          [activeTab]: newPost,
        },
        updatedAt: new Date().toISOString(),
      });

      onNotify('success', `${config.name} Post Refreshed`, `Applied: "${instruction}"`);
    } catch (err: any) {
      onNotify('error', 'Regeneration Failed', err.message || 'Could not regenerate platform.');
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleRestoreVersion = (ver: any) => {
    const updatedPost: PlatformPostResult = {
      ...currentPost,
      hook: ver.hook || currentPost.hook,
      body: ver.body || currentPost.body,
      cta: ver.cta || currentPost.cta,
      hashtags: ver.hashtags || currentPost.hashtags,
      fullPost: ver.content,
      characterCount: ver.content.length,
    };

    onUpdateProject({
      ...project,
      platformPosts: {
        ...project.platformPosts,
        [activeTab]: updatedPost,
      },
    });

    setShowVersions(false);
    onNotify('info', 'Version Restored', `Restored Version ${ver.version}`);
  };

  return (
    <div className="space-y-6">
      {/* Platform Navigation Tabs with Realistic Maroon / Chocolate Theme */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-[#381B1E]">
        {activePlatforms.map((pId) => {
          const pConfig = PLATFORMS_CONFIG[pId];
          const postItem = project.platformPosts[pId];
          const isSelected = activeTab === pId;
          const hasExceeded = postItem && postItem.fullPost.length > pConfig.characterLimit;

          return (
            <button
              key={pId}
              onClick={() => setActiveTab(pId)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-gradient-to-r from-[#8B1E2D] to-[#A62639] text-white border border-[#C93B51]/50 shadow-lg shadow-[#8B1E2D]/25'
                  : 'bg-[#1C0E10]/80 text-[#D4A373] border border-[#381B1E] hover:text-[#FFF8F0] hover:bg-[#251214]'
              }`}
            >
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: pConfig.brandColor }}
              />
              <span>{pConfig.name}</span>
              {hasExceeded && (
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" title="Over character limit" />
              )}
            </button>
          );
        })}
      </div>

      {/* Main Grid: Left Column (Image & Editor) | Right Column (Live Preview & Studio) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Image First or Text Editor (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl bg-[#1C0E10]/95 border border-[#381B1E] p-5 space-y-4 shadow-xl">
            {/* Platform Card Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-md"
                  style={{ backgroundColor: config.brandColor }}
                >
                  {config.shortName}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#FFF8F0] flex items-center gap-2">
                    {config.name}
                    <span className="text-[11px] font-normal text-[#A87B51]">· {config.badge}</span>
                  </h3>
                  <div className="flex items-center gap-2 text-[11px] text-[#D4A373] font-mono">
                    <span className={isOverLimit ? 'text-rose-400 font-bold' : 'text-[#D4A373]'}>
                      {currentPost.fullPost.length} / {config.characterLimit} chars
                    </span>
                    <span>·</span>
                    <span>~{readingTimeSeconds}s read</span>
                  </div>
                </div>
              </div>

              {/* Header Action Buttons */}
              <div className="flex items-center gap-2">
                {currentPost.versions && currentPost.versions.length > 0 && (
                  <button
                    onClick={() => setShowVersions(!showVersions)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#251214] hover:bg-[#381B1E] text-xs text-[#D4A373] border border-[#381B1E] transition-colors"
                    title="Version history"
                  >
                    <History className="w-3.5 h-3.5 text-[#E0A96D]" />
                    <span className="text-[11px]">v{currentPost.versions.length + 1}</span>
                  </button>
                )}

                <button
                  onClick={handleCopyPost}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#251214] hover:bg-[#381B1E] text-xs font-medium text-[#FFF8F0] border border-[#381B1E] transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#E0A96D]" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>

                <button
                  onClick={() => onOpenSchedule(activeTab)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#8B1E2D]/25 hover:bg-[#8B1E2D]/40 border border-[#A62639]/40 text-xs font-semibold text-[#F5C2C7] transition-colors"
                >
                  <Calendar className="w-3.5 h-3.5 text-[#E0A96D]" />
                  <span>Schedule</span>
                </button>
              </div>
            </div>

            {/* View Mode Toggle: Visual Image First vs Text Editor */}
            <div className="flex items-center justify-between p-1 rounded-xl bg-[#14090A] border border-[#381B1E]">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setLeftViewMode('image')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    leftViewMode === 'image'
                      ? 'bg-gradient-to-r from-[#8B1E2D] to-[#A62639] text-white shadow-md'
                      : 'text-[#D4A373] hover:text-[#FFF8F0] hover:bg-[#251214]'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5 text-[#E0A96D]" />
                  <span>Visual Graphic & Image</span>
                </button>
                <button
                  type="button"
                  onClick={() => setLeftViewMode('text')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    leftViewMode === 'text'
                      ? 'bg-gradient-to-r from-[#8B1E2D] to-[#A62639] text-white shadow-md'
                      : 'text-[#D4A373] hover:text-[#FFF8F0] hover:bg-[#251214]'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5 text-[#E0A96D]" />
                  <span>Text Copy & Refinements</span>
                </button>
              </div>

              <span className="text-[11px] text-[#A87B51] font-mono pr-2">
                {leftViewMode === 'image' ? 'Image First' : `${currentPost.characterCount} chars`}
              </span>
            </div>

            {/* Version History Drawer */}
            {showVersions && currentPost.versions && (
              <div className="p-3.5 rounded-xl bg-[#14090A] border border-[#381B1E] space-y-2 animate-in fade-in duration-150">
                <div className="flex items-center justify-between text-xs font-semibold text-[#FFF8F0]">
                  <span>Version History ({currentPost.versions.length} past revisions)</span>
                  <button onClick={() => setShowVersions(false)} className="text-[#A87B51] hover:text-[#FFF8F0]">
                    Close
                  </button>
                </div>
                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                  {currentPost.versions.map((ver) => (
                    <div
                      key={ver.version}
                      className="flex items-center justify-between p-2 rounded-lg bg-[#251214] border border-[#381B1E] text-xs"
                    >
                      <div className="min-w-0 flex-1 pr-2">
                        <p className="font-semibold text-[#E0A96D] truncate">
                          Version {ver.version} <span className="text-[10px] text-[#A87B51]">· {ver.note || 'Prior draft'}</span>
                        </p>
                        <p className="text-[11px] text-[#D4A373] truncate">{ver.content}</p>
                      </div>
                      <button
                        onClick={() => handleRestoreVersion(ver)}
                        className="px-2 py-1 rounded bg-[#381B1E] hover:bg-[#8B1E2D] text-[#FFF8F0] text-[11px] transition-colors whitespace-nowrap"
                      >
                        Restore
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PRIMARY VIEW CONTENT: EITHER IMAGE FIRST OR TEXT */}
            {leftViewMode === 'image' ? (
              /* PROMINENT VISUAL GRAPHIC & IMAGE DISPLAY */
              <div className="space-y-4 animate-in fade-in duration-200">
                {/* Hero Visual Card */}
                <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-[#14090A] border-2 border-[#8B1E2D]/50 shadow-2xl group">
                  <img
                    src={effectiveImageUrl}
                    alt={project.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#14090A] via-[#14090A]/20 to-black/40 pointer-events-none" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-[#E0A96D]/30 text-white text-[11px] font-bold flex items-center gap-1.5 shadow-lg">
                      <Sparkles className="w-3.5 h-3.5 text-[#E0A96D]" />
                      <span>{project.media?.style || 'Professional Visual Asset'}</span>
                    </span>
                    <span className="px-2 py-1 rounded-lg bg-[#8B1E2D]/80 backdrop-blur-md text-[#F5C2C7] text-[10px] font-mono font-bold shadow">
                      {config.name} Optimized
                    </span>
                  </div>

                  {/* Quick Action Overlay Buttons */}
                  <div className="absolute top-3 right-3 flex items-center gap-2">
                    <button
                      onClick={handleDownloadImage}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/70 hover:bg-[#8B1E2D] backdrop-blur-md border border-white/20 text-white text-xs font-semibold shadow-lg transition-colors"
                      title="Download image"
                    >
                      <Download className="w-3.5 h-3.5 text-[#E0A96D]" />
                      <span>Download</span>
                    </button>
                  </div>

                  {/* Bottom Text Overlay with Post Hook & Brand */}
                  <div className="absolute bottom-3 left-3 right-3 p-3.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-white space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-[#E0A96D] font-semibold">
                      <span>{brandKit.companyName || 'OmniPost Creative'}</span>
                      <span className="font-mono text-[10px] text-[#D4A373]">
                        {project.media?.aspectRatio || '16:9'}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-white line-clamp-2 leading-snug drop-shadow-md">
                      {currentPost.hook || project.title}
                    </p>
                  </div>
                </div>

                {/* Companion Headline & Caption Preview */}
                <div className="p-4 rounded-xl bg-[#251214] border border-[#381B1E] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#E0A96D] uppercase tracking-wide">
                      Accompanying Post Caption
                    </span>
                    <button
                      onClick={() => setLeftViewMode('text')}
                      className="text-xs text-[#E0A96D] hover:text-[#FFF8F0] font-medium flex items-center gap-1 transition-colors"
                    >
                      <span>Edit Full Text</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                  <p className="text-xs text-[#F5EBE0] leading-relaxed line-clamp-4 whitespace-pre-wrap">
                    {currentPost.fullPost}
                  </p>
                </div>
              </div>
            ) : (
              /* TEXT COPY & REFINEMENTS VIEW */
              <div className="space-y-4 animate-in fade-in duration-200">
                {/* Compact Thumbnail Banner */}
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#14090A] border border-[#381B1E]">
                  <div className="w-16 h-12 rounded-lg overflow-hidden shrink-0 border border-[#381B1E] bg-black">
                    <img
                      src={effectiveImageUrl}
                      alt="Thumbnail"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-[#FFF8F0] truncate">{project.title}</p>
                    <p className="text-[11px] text-[#A87B51]">Visual asset linked · Ready for export</p>
                  </div>
                  <button
                    onClick={() => setLeftViewMode('image')}
                    className="px-2.5 py-1 rounded-lg bg-[#251214] hover:bg-[#381B1E] border border-[#442125] text-xs text-[#E0A96D] font-medium transition-colors"
                  >
                    View Image
                  </button>
                </div>

                {/* Primary Textarea */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#D4A373]">
                    Post Copy (Directly Editable)
                  </label>
                  <textarea
                    rows={9}
                    value={currentPost.fullPost}
                    onChange={(e) => handleUpdateFullPost(e.target.value)}
                    className={`w-full p-4 rounded-xl bg-[#14090A] border text-xs leading-relaxed text-[#FFF8F0] placeholder-[#A87B51] focus:outline-none focus:border-[#8B1E2D] transition-colors font-sans resize-y ${
                      isOverLimit ? 'border-rose-500/80 focus:border-rose-500' : 'border-[#381B1E]'
                    }`}
                    placeholder="Platform post content..."
                  />
                </div>

                {/* Quick AI Modifiers Toolbar with Maroon Styling */}
                <div className="space-y-2 pt-1 border-t border-[#381B1E]">
                  <div className="flex items-center justify-between text-xs text-[#D4A373]">
                    <span className="font-medium flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#E0A96D]" />
                      Quick AI Refinements for {config.name}
                    </span>
                    {isRegenerating && (
                      <span className="text-[11px] text-[#E0A96D] flex items-center gap-1 animate-pulse">
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        Regenerating...
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      disabled={isRegenerating}
                      onClick={() => handleRegenerateWithInstruction('Make it strictly shorter and more concise')}
                      className="px-2.5 py-1.5 rounded-lg bg-[#251214] hover:bg-[#381B1E] border border-[#442125] text-xs text-[#FFF8F0] transition-colors disabled:opacity-50"
                    >
                      ✂️ Shorter
                    </button>
                    <button
                      type="button"
                      disabled={isRegenerating}
                      onClick={() => handleRegenerateWithInstruction('Expand with richer context and depth')}
                      className="px-2.5 py-1.5 rounded-lg bg-[#251214] hover:bg-[#381B1E] border border-[#442125] text-xs text-[#FFF8F0] transition-colors disabled:opacity-50"
                    >
                      📝 Expand
                    </button>
                    <button
                      type="button"
                      disabled={isRegenerating}
                      onClick={() => handleRegenerateWithInstruction('Adopt an authoritative, highly professional corporate tone')}
                      className="px-2.5 py-1.5 rounded-lg bg-[#251214] hover:bg-[#381B1E] border border-[#442125] text-xs text-[#FFF8F0] transition-colors disabled:opacity-50"
                    >
                      👔 Professional
                    </button>
                    <button
                      type="button"
                      disabled={isRegenerating}
                      onClick={() => handleRegenerateWithInstruction('Adopt a friendly, casual, approachable conversational style')}
                      className="px-2.5 py-1.5 rounded-lg bg-[#251214] hover:bg-[#381B1E] border border-[#442125] text-xs text-[#FFF8F0] transition-colors disabled:opacity-50"
                    >
                      ☕ Casual
                    </button>
                    <button
                      type="button"
                      disabled={isRegenerating}
                      onClick={() => handleRegenerateWithInstruction('Enhance with relevant, tasteful emojis to structure information')}
                      className="px-2.5 py-1.5 rounded-lg bg-[#251214] hover:bg-[#381B1E] border border-[#442125] text-xs text-[#FFF8F0] transition-colors disabled:opacity-50"
                    >
                      ✨ Emojis
                    </button>
                    <button
                      type="button"
                      disabled={isRegenerating}
                      onClick={() => handleRegenerateWithInstruction('Craft an irresistible, curiosity-driven opening hook')}
                      className="px-2.5 py-1.5 rounded-lg bg-[#251214] hover:bg-[#381B1E] border border-[#442125] text-xs text-[#FFF8F0] transition-colors disabled:opacity-50"
                    >
                      🪝 Improve Hook
                    </button>
                    <button
                      type="button"
                      disabled={isRegenerating}
                      onClick={() => handleRegenerateWithInstruction('Rewrite with a compelling, high-converting call to action')}
                      className="px-2.5 py-1.5 rounded-lg bg-[#251214] hover:bg-[#381B1E] border border-[#442125] text-xs text-[#FFF8F0] transition-colors disabled:opacity-50"
                    >
                      🎯 Enhance CTA
                    </button>
                  </div>
                </div>

                {/* Hashtag Manager */}
                {config.supportsHashtags && (
                  <div className="space-y-2 pt-2 border-t border-[#381B1E]">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-[#D4A373]">
                        Hashtags ({config.recommendedHashtags})
                      </label>
                      <button
                        type="button"
                        onClick={() => handleRegenerateWithInstruction('Regenerate fresh targeted platform hashtags')}
                        disabled={isRegenerating}
                        className="text-[11px] text-[#E0A96D] hover:text-[#FFF8F0] flex items-center gap-1"
                      >
                        <RefreshCw className="w-3 h-3" />
                        Regenerate Tags
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1.5 items-center">
                      {currentPost.hashtags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#251214] border border-[#381B1E] text-xs text-[#E0A96D]"
                        >
                          <span>{tag}</span>
                          <button
                            onClick={() => handleRemoveHashtag(idx)}
                            className="text-[#A87B51] hover:text-rose-400 ml-0.5"
                          >
                            ×
                          </button>
                        </span>
                      ))}

                      <form onSubmit={handleAddHashtag} className="inline-flex items-center">
                        <input
                          type="text"
                          placeholder="+ Add tag..."
                          value={newHashtagInput}
                          onChange={(e) => setNewHashtagInput(e.target.value)}
                          className="px-2.5 py-1 rounded-lg bg-[#14090A] border border-[#381B1E] text-xs text-[#FFF8F0] placeholder-[#A87B51] focus:outline-none focus:border-[#8B1E2D] w-24"
                        />
                      </form>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Realistic Live Platform Preview OR Studio Options (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1 p-0.5 bg-[#14090A] rounded-lg border border-[#381B1E]">
              <button
                type="button"
                onClick={() => setRightPanelMode('simulation')}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                  rightPanelMode === 'simulation'
                    ? 'bg-[#8B1E2D] text-white shadow-sm'
                    : 'text-[#D4A373] hover:text-[#FFF8F0]'
                }`}
              >
                <Eye className="w-3.5 h-3.5 text-[#E0A96D]" />
                <span>Live {config.name} Mockup</span>
              </button>
              <button
                type="button"
                onClick={() => setRightPanelMode('studio')}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                  rightPanelMode === 'studio'
                    ? 'bg-[#8B1E2D] text-white shadow-sm'
                    : 'text-[#D4A373] hover:text-[#FFF8F0]'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-[#E0A96D]" />
                <span>Studio Tools</span>
              </button>
            </div>

            <span className="text-[11px] text-[#A87B51] font-mono">
              {rightPanelMode === 'simulation' ? 'Pixel-Realistic' : 'Companion Assets'}
            </span>
          </div>

          {rightPanelMode === 'simulation' ? (
            <div className="p-4 rounded-2xl bg-[#1C0E10]/95 border border-[#381B1E] shadow-xl">
              <PlatformPreview
                platform={activeTab}
                post={currentPost}
                media={project.media}
                brandKit={brandKit}
              />
            </div>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-1 p-1 bg-[#14090A] rounded-xl border border-[#381B1E]">
                <button
                  type="button"
                  onClick={() => setActiveStudioTab('pfp')}
                  className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${
                    activeStudioTab === 'pfp'
                      ? 'bg-[#8B1E2D] text-white shadow'
                      : 'text-[#D4A373] hover:text-[#FFF8F0] hover:bg-[#251214]'
                  }`}
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>PFP</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStudioTab('story')}
                  className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${
                    activeStudioTab === 'story'
                      ? 'bg-[#8B1E2D] text-white shadow'
                      : 'text-[#D4A373] hover:text-[#FFF8F0] hover:bg-[#251214]'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Story</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStudioTab('post_options')}
                  className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${
                    activeStudioTab === 'post_options'
                      ? 'bg-[#8B1E2D] text-white shadow'
                      : 'text-[#D4A373] hover:text-[#FFF8F0] hover:bg-[#251214]'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Formats</span>
                </button>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#1C0E10]/95 border border-[#381B1E] shadow-inner max-h-[720px] overflow-y-auto">
                {activeStudioTab === 'pfp' && (
                  <PfpGenerator
                    brandKit={brandKit}
                    onUpdateBrandKit={(updated) => onUpdateBrandKit?.(updated)}
                    onNotify={onNotify}
                    compact={true}
                  />
                )}
                {activeStudioTab === 'story' && (
                  <StoryMaker
                    project={project}
                    brandKit={brandKit}
                    onAttachStoryMedia={(dataUrl) => {
                      onUpdateProject({
                        ...project,
                        media: {
                          id: `story-${Date.now()}`,
                          url: dataUrl,
                          name: '9:16 Story Asset',
                          type: 'ai_generated',
                          aspectRatio: '9:16',
                        },
                      });
                      onNotify('success', 'Story Attached', 'Story graphic linked to current social project.');
                    }}
                    onNotify={onNotify}
                    compact={true}
                  />
                )}
                {activeStudioTab === 'post_options' && (
                  <PostOptionsView
                    project={project}
                    onUpdateProject={onUpdateProject}
                    onNotify={onNotify}
                    compact={true}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
