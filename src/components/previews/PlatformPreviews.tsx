import React from 'react';
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  Share2,
  ThumbsUp,
  Repeat2,
  Briefcase,
  ExternalLink,
  ChevronDown,
  MoreHorizontal,
  Sparkles,
} from 'lucide-react';
import { BrandKit, MediaAsset, PlatformId, PlatformPostResult } from '../../types';

interface PlatformPreviewProps {
  platform: PlatformId;
  post: PlatformPostResult;
  media?: MediaAsset;
  brandKit: BrandKit;
}

const CONTEXT_FALLBACK_IMAGES = {
  industrial: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
  cafe: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80',
  tech: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
  office: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
  event: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
};

function getEffectiveImageUrl(media?: MediaAsset, postText?: string): string {
  if (media?.url) return media.url;
  const str = (postText || '').toLowerCase();
  if (/cnc|machin|operator|engineer|aerospace|manufactur|factory|industrial/i.test(str)) {
    return CONTEXT_FALLBACK_IMAGES.industrial;
  }
  if (/coffee|cafe|bakery|restaurant|espresso|food|roaster/i.test(str)) {
    return CONTEXT_FALLBACK_IMAGES.cafe;
  }
  if (/software|developer|ai|saas|app|code|cloud|platform/i.test(str)) {
    return CONTEXT_FALLBACK_IMAGES.tech;
  }
  if (/webinar|event|conference|summit|masterclass/i.test(str)) {
    return CONTEXT_FALLBACK_IMAGES.event;
  }
  return CONTEXT_FALLBACK_IMAGES.industrial;
}

export const PlatformPreview: React.FC<PlatformPreviewProps> = ({
  platform,
  post,
  media,
  brandKit,
}) => {
  const company = brandKit.companyName || 'Apex Precision Engineering';
  const handle = brandKit.companyName ? `@${brandKit.companyName.toLowerCase().replace(/\s+/g, '')}` : '@omnipost';
  const imageUrl = getEffectiveImageUrl(media, post.fullPost);

  switch (platform) {
    case 'instagram':
      return <InstagramPreview post={post} imageUrl={imageUrl} company={company} handle={handle} />;
    case 'linkedin':
      return <LinkedInPreview post={post} imageUrl={imageUrl} company={company} />;
    case 'twitter':
      return <TwitterPreview post={post} imageUrl={imageUrl} company={company} handle={handle} />;
    case 'facebook':
      return <FacebookPreview post={post} imageUrl={imageUrl} company={company} />;
    case 'snapchat':
      return <SnapchatPreview post={post} imageUrl={imageUrl} company={company} />;
    case 'handshake':
      return <HandshakePreview post={post} imageUrl={imageUrl} company={company} />;
    case 'whatsapp':
      return <WhatsAppPreview post={post} imageUrl={imageUrl} company={company} />;
    default:
      return null;
  }
};

/* --- Instagram Realistic Mockup (Image Focused) --- */
const InstagramPreview: React.FC<{ post: PlatformPostResult; imageUrl: string; company: string; handle: string }> = ({
  post,
  imageUrl,
  company,
  handle,
}) => {
  return (
    <div className="max-w-md mx-auto rounded-2xl bg-black border border-neutral-800 text-white overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-neutral-900">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#9E2A2B] via-[#8B1E2D] to-[#E0A96D] p-[1.5px]">
            <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-[11px] font-bold text-white">
              {company.charAt(0)}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold leading-tight">{handle}</p>
            <p className="text-[10px] text-neutral-400">Sponsored Announcement</p>
          </div>
        </div>
        <MoreHorizontal className="w-4 h-4 text-neutral-400" />
      </div>

      {/* Prominent Visual Image Container */}
      <div className="relative aspect-square w-full bg-neutral-900 overflow-hidden">
        <img
          src={imageUrl}
          alt={post.hook || company}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-[10px] font-semibold text-white/95 border border-white/15 flex items-center gap-1.5 shadow-md">
          <Sparkles className="w-3 h-3 text-[#E0A96D]" />
          <span>Visual Media Asset</span>
        </div>
      </div>

      {/* Action Bar */}
      <div className="p-3 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-neutral-200">
            <Heart className="w-5 h-5 hover:text-rose-500 cursor-pointer transition-colors" />
            <MessageCircle className="w-5 h-5 cursor-pointer hover:text-neutral-400" />
            <Send className="w-5 h-5 cursor-pointer hover:text-neutral-400" />
          </div>
          <Bookmark className="w-5 h-5 text-neutral-200 cursor-pointer hover:text-neutral-400" />
        </div>

        <p className="text-xs font-semibold text-neutral-300">1,248 likes</p>

        {/* Caption */}
        <div className="text-xs leading-relaxed space-y-1.5 text-neutral-200 whitespace-pre-wrap">
          <span className="font-semibold mr-1.5 text-white">{handle}</span>
          {post.fullPost}
        </div>

        <p className="text-[11px] text-neutral-500 pt-1">View all 42 comments</p>
        <p className="text-[10px] text-neutral-600 uppercase tracking-wider">2 hours ago</p>
      </div>
    </div>
  );
};

/* --- LinkedIn Realistic Mockup (Image Focused) --- */
const LinkedInPreview: React.FC<{ post: PlatformPostResult; imageUrl: string; company: string }> = ({
  post,
  imageUrl,
  company,
}) => {
  return (
    <div className="max-w-lg mx-auto rounded-2xl bg-[#1B1F23] border border-neutral-700/60 text-white overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="p-4 border-b border-neutral-800 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-lg bg-[#0A66C2] flex items-center justify-center text-white font-bold text-base shadow">
            {company.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-bold text-white hover:underline cursor-pointer">{company}</p>
              <span className="text-[11px] text-neutral-400">· 1st</span>
            </div>
            <p className="text-[11px] text-neutral-400">Precision Engineering & Global Manufacturing</p>
            <p className="text-[10px] text-neutral-500">1h · Edited · 🌐</p>
          </div>
        </div>
        <button className="px-3 py-1 rounded-full border border-[#0A66C2] text-[#70B5F9] text-xs font-semibold hover:bg-[#0A66C2]/10 transition-colors">
          + Follow
        </button>
      </div>

      {/* Prominent Visual Media Container (Image First) */}
      <div className="border-b border-neutral-800 bg-neutral-900 max-h-80 overflow-hidden relative">
        <img
          src={imageUrl}
          alt={company}
          referrerPolicy="no-referrer"
          className="w-full object-cover max-h-80"
        />
      </div>

      {/* Post Text */}
      <div className="p-4 text-xs leading-relaxed text-neutral-200 whitespace-pre-wrap">
        {post.fullPost}
      </div>

      {/* Engagement Counters */}
      <div className="px-4 py-2 flex items-center justify-between text-[11px] text-neutral-400 border-b border-neutral-800">
        <div className="flex items-center gap-1">
          <span className="w-4 h-4 rounded-full bg-[#0A66C2] flex items-center justify-center text-[10px]">👍</span>
          <span className="w-4 h-4 rounded-full bg-emerald-600 flex items-center justify-center text-[10px]">👏</span>
          <span className="ml-1 text-neutral-300">89 reactions</span>
        </div>
        <p>14 comments · 9 reposts</p>
      </div>

      {/* Reactions Bar */}
      <div className="px-2 py-1.5 flex items-center justify-around text-xs font-semibold text-neutral-400">
        <button className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg hover:bg-neutral-800 hover:text-neutral-200 transition-colors">
          <ThumbsUp className="w-4 h-4" />
          <span>Like</span>
        </button>
        <button className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg hover:bg-neutral-800 hover:text-neutral-200 transition-colors">
          <MessageCircle className="w-4 h-4" />
          <span>Comment</span>
        </button>
        <button className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg hover:bg-neutral-800 hover:text-neutral-200 transition-colors">
          <Repeat2 className="w-4 h-4" />
          <span>Repost</span>
        </button>
        <button className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg hover:bg-neutral-800 hover:text-neutral-200 transition-colors">
          <Send className="w-4 h-4" />
          <span>Send</span>
        </button>
      </div>
    </div>
  );
};

/* --- X / Twitter Realistic Mockup (Image Focused) --- */
const TwitterPreview: React.FC<{ post: PlatformPostResult; imageUrl: string; company: string; handle: string }> = ({
  post,
  imageUrl,
  company,
  handle,
}) => {
  const isOverLimit = post.fullPost.length > 280;

  return (
    <div className="max-w-md mx-auto rounded-2xl bg-black border border-neutral-800 text-white p-4 space-y-3 shadow-2xl">
      {/* Author Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-white text-sm">
            {company.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-sm font-bold text-white">{company}</span>
              <span className="text-cyan-400 text-xs">☑</span>
            </div>
            <p className="text-xs text-neutral-500">{handle} · Just now</p>
          </div>
        </div>
        <MoreHorizontal className="w-4 h-4 text-neutral-500" />
      </div>

      {/* Prominent Visual Media Container (Image First) */}
      <div className="rounded-xl overflow-hidden border border-neutral-800 max-h-64 bg-neutral-900 relative">
        <img
          src={imageUrl}
          alt={company}
          referrerPolicy="no-referrer"
          className="w-full object-cover max-h-64 hover:scale-102 transition-transform"
        />
      </div>

      {/* Tweet Body */}
      <p className="text-sm text-neutral-100 leading-relaxed whitespace-pre-wrap">
        {post.fullPost}
      </p>

      {/* Character limit gauge */}
      <div className="pt-2 flex items-center justify-between border-t border-neutral-900 text-xs text-neutral-500">
        <div className="flex items-center gap-1 font-mono">
          <span className={isOverLimit ? 'text-rose-400 font-bold' : 'text-neutral-400'}>
            {post.fullPost.length}
          </span>
          <span>/ 280 chars</span>
        </div>
        {isOverLimit && (
          <span className="text-[11px] text-rose-400 font-medium">Over limit! Edit to fit single tweet</span>
        )}
      </div>

      {/* Metrics Bar */}
      <div className="flex items-center justify-between text-neutral-500 text-xs pt-1">
        <span className="hover:text-cyan-400 cursor-pointer flex items-center gap-1.5"><MessageCircle className="w-4 h-4" /> 24</span>
        <span className="hover:text-emerald-400 cursor-pointer flex items-center gap-1.5"><Repeat2 className="w-4 h-4" /> 18</span>
        <span className="hover:text-rose-400 cursor-pointer flex items-center gap-1.5"><Heart className="w-4 h-4" /> 142</span>
        <span className="hover:text-cyan-400 cursor-pointer flex items-center gap-1.5"><Share2 className="w-4 h-4" /></span>
      </div>
    </div>
  );
};

/* --- Facebook Realistic Mockup (Image Focused) --- */
const FacebookPreview: React.FC<{ post: PlatformPostResult; imageUrl: string; company: string }> = ({
  post,
  imageUrl,
  company,
}) => {
  return (
    <div className="max-w-lg mx-auto rounded-2xl bg-[#242526] border border-neutral-800 text-white overflow-hidden shadow-2xl">
      <div className="p-4 flex items-center justify-between border-b border-neutral-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#1877F2] flex items-center justify-center font-bold text-white text-sm">
            {company.charAt(0)}
          </div>
          <div>
            <p className="text-xs font-bold text-white">{company}</p>
            <p className="text-[10px] text-neutral-400">Published by Admin · 3 hrs · 🌐</p>
          </div>
        </div>
        <MoreHorizontal className="w-4 h-4 text-neutral-400" />
      </div>

      {/* Prominent Visual Media Container (Image First) */}
      <div className="border-t border-neutral-800 bg-black max-h-80 overflow-hidden relative">
        <img
          src={imageUrl}
          alt={company}
          referrerPolicy="no-referrer"
          className="w-full object-cover max-h-80"
        />
      </div>

      <div className="p-4 text-xs leading-relaxed text-neutral-200 whitespace-pre-wrap">
        {post.fullPost}
      </div>

      <div className="px-4 py-2 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400">
        <div className="flex items-center gap-1">
          <span className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center text-[10px]">👍</span>
          <span className="w-4 h-4 rounded-full bg-rose-600 flex items-center justify-center text-[10px]">❤️</span>
          <span className="ml-1 text-neutral-300">156</span>
        </div>
        <p>28 comments · 14 shares</p>
      </div>

      <div className="px-2 py-1.5 border-t border-neutral-800 flex items-center justify-around text-xs font-semibold text-neutral-400">
        <button className="flex items-center gap-1.5 py-1 px-4 hover:bg-neutral-800 rounded-lg">
          <ThumbsUp className="w-4 h-4" /> Like
        </button>
        <button className="flex items-center gap-1.5 py-1 px-4 hover:bg-neutral-800 rounded-lg">
          <MessageCircle className="w-4 h-4" /> Comment
        </button>
        <button className="flex items-center gap-1.5 py-1 px-4 hover:bg-neutral-800 rounded-lg">
          <Share2 className="w-4 h-4" /> Share
        </button>
      </div>
    </div>
  );
};

/* --- Snapchat Story Mockup (Full Visual Canvas) --- */
const SnapchatPreview: React.FC<{ post: PlatformPostResult; imageUrl: string; company: string }> = ({
  post,
  imageUrl,
  company,
}) => {
  return (
    <div className="max-w-xs mx-auto rounded-3xl bg-black border-2 border-neutral-800 text-white overflow-hidden shadow-2xl aspect-[9/16] relative flex flex-col justify-between p-4">
      {/* Top story header */}
      <div className="z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#FFFC00] text-black font-bold text-xs flex items-center justify-center">
            {company.charAt(0)}
          </div>
          <div>
            <p className="text-xs font-bold leading-none">{company}</p>
            <p className="text-[10px] text-neutral-300 drop-shadow">Story · 1h ago</p>
          </div>
        </div>
        <MoreHorizontal className="w-4 h-4 text-white drop-shadow" />
      </div>

      {/* Prominent Background Visual Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={imageUrl}
          alt={company}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/75" />
      </div>

      {/* Minimal Floating Caption Sticker so the image is the primary hero */}
      <div className="z-10 self-center max-w-[90%] bg-black/60 backdrop-blur-md rounded-2xl p-3.5 border border-white/20 text-center shadow-2xl space-y-1">
        <p className="text-xs font-black text-amber-300 uppercase tracking-wide">{post.hook || 'Official Update'}</p>
        <p className="text-[11px] text-white/95 leading-snug line-clamp-3">{post.body || post.fullPost}</p>
        {post.cta && <p className="text-[10px] text-cyan-300 font-bold mt-1">{post.cta}</p>}
      </div>

      {/* Bottom swipe up prompt */}
      <div className="z-10 text-center space-y-1">
        <div className="w-7 h-7 rounded-full bg-white/25 backdrop-blur-md mx-auto flex items-center justify-center animate-bounce shadow">
          <ChevronDown className="w-3.5 h-3.5 rotate-180 text-white" />
        </div>
        <p className="text-[10px] font-extrabold text-white tracking-wider uppercase drop-shadow">Swipe Up to Read</p>
      </div>
    </div>
  );
};

/* --- Handshake Career Mockup (With Visual Facility Photo) --- */
const HandshakePreview: React.FC<{ post: PlatformPostResult; imageUrl: string; company: string }> = ({
  post,
  imageUrl,
  company,
}) => {
  return (
    <div className="max-w-lg mx-auto rounded-2xl bg-[#181E29] border border-neutral-700 text-white overflow-hidden shadow-2xl font-sans">
      <div className="bg-[#8B1E2D] px-4 py-2 flex items-center justify-between text-xs font-bold tracking-wide">
        <span className="flex items-center gap-1.5">
          <Briefcase className="w-3.5 h-3.5" />
          <span>Handshake Talent Network</span>
        </span>
        <span className="text-[11px] uppercase tracking-wider font-mono">Verified Employer</span>
      </div>

      <div className="p-5 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#2A1417] border border-[#8B1E2D]/40 flex items-center justify-center font-bold text-[#E0A96D] text-lg shadow">
              {company.charAt(0)}
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">{post.hook || 'Career Opportunity'}</h4>
              <p className="text-xs text-neutral-300 font-medium">{company}</p>
              <p className="text-[11px] text-neutral-400">Full-time · Multiple Openings · International Sponsoring</p>
            </div>
          </div>
        </div>

        {/* Visual Opportunity Photo Banner */}
        <div className="rounded-xl overflow-hidden border border-slate-700/80 max-h-52 bg-slate-900">
          <img
            src={imageUrl}
            alt={company}
            referrerPolicy="no-referrer"
            className="w-full object-cover max-h-52"
          />
        </div>

        {/* Handshake Details Body */}
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-neutral-200 leading-relaxed whitespace-pre-wrap">
          {post.fullPost}
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between pt-2 border-t border-neutral-800">
          <div className="text-[11px] text-neutral-400">
            Open to Students, Alumni & Early Career
          </div>
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#8B1E2D] hover:bg-[#671018] text-white text-xs font-semibold shadow-md transition-colors">
            <span>Apply on Handshake</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

/* --- WhatsApp Realistic Media Card Mockup (Image Focused) --- */
const WhatsAppPreview: React.FC<{ post: PlatformPostResult; imageUrl: string; company: string }> = ({
  post,
  imageUrl,
  company,
}) => {
  return (
    <div className="max-w-md mx-auto rounded-2xl bg-[#0B141A] border border-[#202C33] text-white overflow-hidden shadow-2xl">
      {/* WhatsApp Chat Header */}
      <div className="bg-[#202C33] px-3.5 py-2.5 flex items-center justify-between border-b border-[#2A3942]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#00A884] text-white flex items-center justify-center font-bold text-xs shadow">
            {company.charAt(0)}
          </div>
          <div>
            <p className="text-xs font-semibold text-[#E9EDEF]">{company} Broadcast</p>
            <p className="text-[10px] text-[#8696A0]">Official Business Channel</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[#8696A0]">
          <span className="text-[10px] px-2 py-0.5 rounded bg-[#00A884]/20 text-[#00A884] font-semibold">
            Status Post
          </span>
        </div>
      </div>

      {/* WhatsApp Message Bubble with Prominent Photo Media */}
      <div className="p-3 bg-[#0B141A] space-y-2">
        <div className="max-w-[94%] ml-auto bg-[#005C4B] rounded-2xl rounded-tr-xs overflow-hidden shadow-md border border-[#005C4B]/50">
          {/* Visual Media Photo */}
          <div className="relative aspect-video w-full bg-[#111B21] overflow-hidden">
            <img
              src={imageUrl}
              alt={company}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-[10px] font-medium text-white flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#E0A96D]" />
              <span>Media Attachment</span>
            </div>
          </div>

          {/* Caption Text */}
          <div className="p-3 space-y-1.5 text-xs text-[#E9EDEF]">
            {post.hook && <p className="font-bold text-white text-[13px]">{post.hook}</p>}
            <p className="leading-relaxed whitespace-pre-wrap text-[12px] opacity-95">{post.fullPost}</p>
            <div className="flex items-center justify-end gap-1 text-[10px] text-[#8696A0] pt-1">
              <span>Just now</span>
              <span className="text-[#53BDEB]">✓✓</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

