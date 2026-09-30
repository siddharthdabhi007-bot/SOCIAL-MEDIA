import React, { useState } from 'react';
import {
  Layers,
  Video,
  FileText,
  AlignLeft,
  Smartphone,
  Copy,
  Check,
  Sparkles,
  ArrowRight,
  Download,
  Share2,
} from 'lucide-react';
import { CarouselSlide, PostFormat, Project } from '../../types';

interface PostOptionsViewProps {
  project: Project;
  onUpdateProject: (updated: Project) => void;
  onNotify: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
  compact?: boolean;
}

export const PostOptionsView: React.FC<PostOptionsViewProps> = ({
  project,
  onUpdateProject,
  onNotify,
  compact = false,
}) => {
  const [activeFormat, setActiveFormat] = useState<PostFormat>(project.postFormat || 'feed');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const content = project.sourceContent || 'Certified CNC 5-axis operator vacancy in Israel. Salary ₹3 lakh per month. Relocation and visa support included.';
  const company = project.additionalInputs?.companyName || 'Apex Precision Engineering';
  const salary = project.additionalInputs?.salary || '₹3 Lakh / Month';

  // Computed Carousel Slides
  const defaultCarouselSlides: CarouselSlide[] = [
    {
      slideNumber: 1,
      title: 'SLIDE 1: THE CURIOSITY HOOK',
      content: `A rare overseas career opportunity just opened up in advanced aerospace manufacturing. Here is everything you need to know. 👇`,
      keyTakeaway: 'The Opportunity',
    },
    {
      slideNumber: 2,
      title: 'SLIDE 2: THE ROLE & FACILITY',
      content: `${company} is expanding operations. We are seeking certified CNC 5-Axis Operators for high-tolerance multi-axis machining centers.`,
      keyTakeaway: 'Certified 5-Axis Machining',
    },
    {
      slideNumber: 3,
      title: 'SLIDE 3: COMPENSATION & RELOCATION',
      content: `• Salary: ${salary} (tax-optimized)\n• Full international visa sponsorship\n• Premium accommodation allowance included\n• Round-trip annual flight tickets`,
      keyTakeaway: salary,
    },
    {
      slideNumber: 4,
      title: 'SLIDE 4: ELIGIBILITY CRITERIA',
      content: `• Minimum 3 years verified experience on 5-axis milling centers (DMG MORI / Mazak / Hermle)\n• Strong blueprint & GD&T interpretation\n• Commitment to micrometer precision`,
      keyTakeaway: '3+ Years Experience',
    },
    {
      slideNumber: 5,
      title: 'SLIDE 5: HOW TO APPLY',
      content: `Applications are reviewed on a rolling basis.\n\nSend your CV or WhatsApp our talent lead directly. Share with a colleague who qualifies!`,
      keyTakeaway: 'Direct WhatsApp Apply',
    },
  ];

  // Computed Short-Form Reel / TikTok Script
  const reelScript = {
    hook: `[0:00 - 0:03] (Hook shot / Machinist at 5-axis center): "If you have 3 years of CNC experience, stop scrolling because this overseas package is huge."`,
    intro: `[0:03 - 0:15] (B-roll of precision cutting): "${company} just opened recruitment for certified 5-axis CNC operators in Israel, and the monthly salary is ${salary}."`,
    body: `[0:15 - 0:42] (Text overlay with bullet points): "Here is what is included: complete visa sponsorship, accommodation allowance, and flights paid for. You will be working on top-tier aerospace components."`,
    cta: `[0:42 - 0:60] (Host pointing to screen): "Requirements: 3 years minimum on multi-axis machines. Spots are limited — send your resume or click the link in bio right now!"`,
  };

  // Computed Multi-Part Thread
  const threadTweets = [
    `1/5 🚨 Massive opportunity alert: ${company} has opened certified CNC 5-Axis Operator roles.\n\nSalary: ${salary} with complete relocation support. Breakdown below 👇`,
    `2/5 The Facility & Work:\nYou will be operating modern 5-axis machining centers manufacturing mission-critical aerospace and medical device hardware to micrometer tolerances.`,
    `3/5 The Benefits Package:\n💰 ${salary} monthly compensation\n✈️ Full visa sponsorship & flights\n🏠 Accommodation allowance provided\n🛡️ Comprehensive health coverage`,
    `4/5 Who Qualifies:\n• 3+ years experience on 5-axis milling/turning\n• Deep knowledge of CNC controls & setup\n• High commitment to quality & safety standards`,
    `5/5 How to Apply:\nSend your CV immediately or WhatsApp our careers line.\n\nRetweet & share with skilled machinists in your network!`,
  ];

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    onNotify('success', 'Copied to Clipboard!', 'Ready to paste directly into your publishing tool.');
    setTimeout(() => setCopiedKey(null), 1500);
  };

  const handleSelectFormat = (fmt: PostFormat) => {
    setActiveFormat(fmt);
    onUpdateProject({
      ...project,
      postFormat: fmt,
    });
    onNotify('info', `Switched Post Format`, `Active format set to ${fmt.toUpperCase()}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-[#381B1E] pb-4">
        <h2 className="text-xl font-extrabold text-[#FFF8F0] tracking-tight flex items-center gap-2">
          <Layers className="w-5 h-5 text-[#E0A96D]" />
          <span>Post Options & Format Architect</span>
        </h2>
        <p className="text-xs text-[#D4A373] mt-0.5">
          Transform your post into multi-slide Carousels, 60-second Reel Scripts, or Multi-Post Threads
        </p>
      </div>

      {/* Format Selector Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          type="button"
          onClick={() => handleSelectFormat('feed')}
          className={`p-4 rounded-2xl border text-left transition-all space-y-2 ${
            activeFormat === 'feed'
              ? 'bg-[#8B1E2D]/25 border-[#8B1E2D] shadow-lg shadow-[#8B1E2D]/20'
              : 'bg-[#1C0E10]/95 border-[#381B1E] hover:border-[#8B1E2D]/50'
          }`}
        >
          <div className="p-2 rounded-xl bg-[#8B1E2D]/30 text-[#F5C2C7] w-fit">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#FFF8F0]">Standard Feed Post</h4>
            <p className="text-[11px] text-[#D4A373]">Single caption + visual asset</p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => handleSelectFormat('carousel')}
          className={`p-4 rounded-2xl border text-left transition-all space-y-2 ${
            activeFormat === 'carousel'
              ? 'bg-[#8B1E2D]/25 border-[#8B1E2D] shadow-lg shadow-[#8B1E2D]/20'
              : 'bg-[#1C0E10]/95 border-[#381B1E] hover:border-[#8B1E2D]/50'
          }`}
        >
          <div className="p-2 rounded-xl bg-[#8B1E2D]/30 text-[#E0A96D] w-fit">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#FFF8F0]">5-Slide Carousel</h4>
            <p className="text-[11px] text-[#D4A373]">Multi-slide swipeable breakdown</p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => handleSelectFormat('video_script')}
          className={`p-4 rounded-2xl border text-left transition-all space-y-2 ${
            activeFormat === 'video_script'
              ? 'bg-[#8B1E2D]/25 border-[#8B1E2D] shadow-lg shadow-[#8B1E2D]/20'
              : 'bg-[#1C0E10]/95 border-[#381B1E] hover:border-[#8B1E2D]/50'
          }`}
        >
          <div className="p-2 rounded-xl bg-[#8B1E2D]/30 text-[#F5C2C7] w-fit">
            <Video className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#FFF8F0]">Reel / Video Script</h4>
            <p className="text-[11px] text-[#D4A373]">60-second timed video script</p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => handleSelectFormat('thread')}
          className={`p-4 rounded-2xl border text-left transition-all space-y-2 ${
            activeFormat === 'thread'
              ? 'bg-[#8B1E2D]/25 border-[#8B1E2D] shadow-lg shadow-[#8B1E2D]/20'
              : 'bg-[#1C0E10]/95 border-[#381B1E] hover:border-[#8B1E2D]/50'
          }`}
        >
          <div className="p-2 rounded-xl bg-[#8B1E2D]/30 text-[#E0A96D] w-fit">
            <AlignLeft className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#FFF8F0]">Multi-Post Thread</h4>
            <p className="text-[11px] text-[#D4A373]">Numbered (1/5, 2/5...) series</p>
          </div>
        </button>
      </div>

      {/* Format Display Canvas */}

      {/* 1. Carousel Mode */}
      {activeFormat === 'carousel' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#FFF8F0] flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#E0A96D]" />
              <span>5-Slide LinkedIn & Instagram Carousel Outline</span>
            </h3>
            <button
              onClick={() => {
                const fullCarouselText = defaultCarouselSlides
                  .map((s) => `[${s.title}]\n${s.content}\nTakeaway: ${s.keyTakeaway}`)
                  .join('\n\n---\n\n');
                handleCopy(fullCarouselText, 'carousel-all');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#251214] hover:bg-[#381B1E] text-xs font-semibold text-[#FFF8F0] border border-[#381B1E] transition-colors"
            >
              {copiedKey === 'carousel-all' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#E0A96D]" />}
              <span>Copy All Slides</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {defaultCarouselSlides.map((slide) => (
              <div
                key={slide.slideNumber}
                className="p-4 rounded-2xl bg-[#1C0E10]/95 border border-[#381B1E] flex flex-col justify-between space-y-3 shadow-lg"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#8B1E2D]/25 border border-[#8B1E2D]/40 text-[#F5C2C7] font-bold">
                      SLIDE {slide.slideNumber}
                    </span>
                    <button
                      onClick={() => handleCopy(slide.content, `slide-${slide.slideNumber}`)}
                      className="text-[#A87B51] hover:text-[#FFF8F0]"
                    >
                      {copiedKey === `slide-${slide.slideNumber}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-[#E0A96D]" />}
                    </button>
                  </div>
                  <h4 className="text-xs font-bold text-[#FFF8F0]">{slide.title}</h4>
                  <p className="text-xs text-[#D4A373] leading-relaxed whitespace-pre-wrap">
                    {slide.content}
                  </p>
                </div>
                <div className="pt-2 border-t border-[#381B1E] text-[10px] text-[#E0A96D] font-bold truncate">
                  ★ {slide.keyTakeaway}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Video Script Mode */}
      {activeFormat === 'video_script' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#FFF8F0] flex items-center gap-2">
              <Video className="w-4 h-4 text-[#E0A96D]" />
              <span>60-Second Short-Form Video Script (Reels / TikTok / Shorts)</span>
            </h3>
            <button
              onClick={() => {
                const fullScript = `${reelScript.hook}\n\n${reelScript.intro}\n\n${reelScript.body}\n\n${reelScript.cta}`;
                handleCopy(fullScript, 'reel-all');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#251214] hover:bg-[#381B1E] text-xs font-semibold text-[#FFF8F0] border border-[#381B1E] transition-colors"
            >
              {copiedKey === 'reel-all' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#E0A96D]" />}
              <span>Copy Full Script</span>
            </button>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-[#1C0E10]/95 border border-[#8B1E2D]/40 space-y-1">
              <span className="text-[11px] font-bold text-[#E0A96D] uppercase tracking-wider">
                Step 1: The 3-Second Visual Hook
              </span>
              <p className="text-xs text-[#FFF8F0] font-mono leading-relaxed">{reelScript.hook}</p>
            </div>

            <div className="p-4 rounded-xl bg-[#1C0E10]/95 border border-[#381B1E] space-y-1">
              <span className="text-[11px] font-bold text-[#E0A96D] uppercase tracking-wider">
                Step 2: The Core Hook & Intro (3s - 15s)
              </span>
              <p className="text-xs text-[#FFF8F0] font-mono leading-relaxed">{reelScript.intro}</p>
            </div>

            <div className="p-4 rounded-xl bg-[#1C0E10]/95 border border-[#381B1E] space-y-1">
              <span className="text-[11px] font-bold text-[#E0A96D] uppercase tracking-wider">
                Step 3: Value Breakdown & Proof (15s - 42s)
              </span>
              <p className="text-xs text-[#FFF8F0] font-mono leading-relaxed">{reelScript.body}</p>
            </div>

            <div className="p-4 rounded-xl bg-[#1C0E10]/95 border border-emerald-500/30 space-y-1">
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                Step 4: Immediate Call to Action (42s - 60s)
              </span>
              <p className="text-xs text-[#FFF8F0] font-mono leading-relaxed">{reelScript.cta}</p>
            </div>
          </div>
        </div>
      )}

      {/* 3. Thread Mode */}
      {activeFormat === 'thread' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#FFF8F0] flex items-center gap-2">
              <AlignLeft className="w-4 h-4 text-[#E0A96D]" />
              <span>Multi-Part Numbered Thread (X & LinkedIn)</span>
            </h3>
            <button
              onClick={() => {
                handleCopy(threadTweets.join('\n\n---\n\n'), 'thread-all');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#251214] hover:bg-[#381B1E] text-xs font-semibold text-[#FFF8F0] border border-[#381B1E] transition-colors"
            >
              {copiedKey === 'thread-all' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#E0A96D]" />}
              <span>Copy Full Thread</span>
            </button>
          </div>

          <div className="space-y-3">
            {threadTweets.map((tweet, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-[#1C0E10]/95 border border-[#381B1E] flex items-start justify-between gap-4"
              >
                <div className="space-y-1 flex-1">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#8B1E2D]/25 border border-[#8B1E2D]/40 text-[#F5C2C7] font-bold">
                    POST {idx + 1} OF 5
                  </span>
                  <p className="text-xs text-[#FFF8F0] leading-relaxed whitespace-pre-wrap font-sans">
                    {tweet}
                  </p>
                </div>
                <button
                  onClick={() => handleCopy(tweet, `tweet-${idx}`)}
                  className="p-2 rounded-lg bg-[#251214] hover:bg-[#381B1E] text-[#D4A373] hover:text-[#FFF8F0] shrink-0 border border-[#381B1E]"
                >
                  {copiedKey === `tweet-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#E0A96D]" />}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Feed Post Mode */}
      {activeFormat === 'feed' && (
        <div className="p-6 rounded-2xl bg-[#1C0E10]/95 border border-[#381B1E] space-y-3 text-center">
          <p className="text-sm font-semibold text-[#FFF8F0]">
            Standard Single-Post Mode Active
          </p>
          <p className="text-xs text-[#D4A373] max-w-md mx-auto leading-relaxed">
            Content is generated as single, high-impact captions for each selected social platform with attached visual imagery. Switch to Carousel, Video Script, or Thread above for multi-part formats.
          </p>
        </div>
      )}
    </div>
  );
};
