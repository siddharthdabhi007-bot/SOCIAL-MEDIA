import React from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Share2,
  Zap,
  Layers,
  Wand2,
  Clock,
  Palette,
  X,
  ChevronRight,
  Image as ImageIcon,
} from 'lucide-react';
import { ALL_PLATFORM_IDS, PLATFORMS_CONFIG } from '../../config/platforms';
import { APP_CONFIG } from '../../config/appConfig';
import { AppLogo } from '../ui/AppLogo';

interface LandingPageProps {
  onStartCreating: () => void;
  onClose?: () => void;
  isModal?: boolean;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartCreating,
  onClose,
  isModal = false,
}) => {
  const PRICING_TIERS = [
    {
      name: 'Free Starter',
      price: '$0',
      period: 'forever',
      description: 'Ideal for solo creators exploring multi-platform publishing.',
      features: ['Up to 15 posts / month', 'Instagram, LinkedIn & X', 'Standard AI generation', 'Manual scheduling export'],
      cta: 'Start Free',
      popular: false,
    },
    {
      name: 'Creator Pro',
      price: '$29',
      period: 'per month',
      description: 'Built for growth creators and independent consultants.',
      features: ['Unlimited post generations', 'All 7 social channels', 'AI Visual context creator', 'Custom Brand Kit', 'Content Calendar & autosave'],
      cta: 'Start Pro Trial',
      popular: true,
    },
    {
      name: 'Agency & Team',
      price: '$89',
      period: 'per month',
      description: 'For social marketing agencies managing multiple client brands.',
      features: ['Multi-brand workspaces', 'Unlimited connected accounts', 'Dedicated tone guidelines', 'Team permission roles', 'Direct API webhooks'],
      cta: 'Contact Agency Team',
      popular: false,
    },
  ];

  const FAQS = [
    {
      q: `Does ${APP_CONFIG.name} copy the exact same post across platforms?`,
      a: 'Never. Each social network operates on a unique culture. Instagram receives catchy hooks, emojis, and hashtags; LinkedIn receives structured professional spacing and business value; WhatsApp receives clean bold messages easy to forward; and X is strictly edited within 280 characters.',
    },
    {
      q: 'Will the AI hallucinate or change factual figures like salary or dates?',
      a: `${APP_CONFIG.name} enforces strict factual preservation rules. Crucial numbers such as salary amounts (e.g., ₹3 lakh/month), required years of experience, locations, and deadlines are preserved with 100% fidelity.`,
    },
    {
      q: 'Can I regenerate an individual platform post without affecting the others?',
      a: 'Yes! You can regenerate LinkedIn into a more corporate tone, shorten X, or add emojis to Instagram independently without altering the other platform outputs.',
    },
    {
      q: 'How does the visual image generation work?',
      a: 'OmniPost AI automatically reads your announcement context (e.g., CNC machining, cafe opening, product launch) and generates high-resolution matching photography and branded social cards without you having to write image prompts.',
    },
  ];

  return (
    <div className={`relative ${isModal ? 'max-w-5xl mx-auto rounded-3xl bg-[#14090A] border border-[#381B1E] p-6 md:p-10 shadow-2xl overflow-y-auto max-h-[90vh]' : 'space-y-16 pb-16'}`}>
      {/* Modal Close Button */}
      {isModal && onClose && (
        <div className="flex justify-end pb-2">
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#251214] hover:bg-[#381B1E] text-[#D4A373] hover:text-[#FFF8F0] transition-colors border border-[#381B1E]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Hero Section */}
      <section className="text-center space-y-6 max-w-3xl mx-auto pt-4">
        <div className="flex justify-center">
          <AppLogo size="xl" showText={false} />
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#8B1E2D]/25 border border-[#8B1E2D]/40 text-[#F5C2C7] text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-[#E0A96D]" />
          <span>Next-Generation Multi-Channel Social Engine</span>
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-[#FFF8F0] tracking-tight leading-tight">
          Create Once.{' '}
          <span className="bg-gradient-to-r from-[#F5C2C7] via-[#E0A96D] to-[#FFF8F0] bg-clip-text text-transparent">
            Post Everywhere.
          </span>
        </h1>

        <p className="text-sm sm:text-base text-[#D4A373] leading-relaxed max-w-2xl mx-auto">
          Turn one piece of content, idea, or vacancy into individually optimized visual posts for Instagram, LinkedIn, WhatsApp, X, Facebook, Snapchat, and Handshake.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={onStartCreating}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#8B1E2D] to-[#A62639] hover:from-[#A62639] hover:to-[#C93B51] text-white text-sm font-bold shadow-xl shadow-[#8B1E2D]/40 active:scale-95 transition-all"
          >
            <span>Start Creating Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <a
            href="#how-it-works"
            className="px-5 py-3 rounded-xl bg-[#251214] hover:bg-[#381B1E] border border-[#381B1E] text-xs font-semibold text-[#FFF8F0] transition-colors"
          >
            See How It Works
          </a>
        </div>
      </section>

      {/* Interactive Transformation Visual Showcase */}
      <section className="relative rounded-3xl bg-[#1C0E10]/95 border border-[#381B1E] p-6 md:p-8 overflow-hidden shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Input side */}
          <div className="lg:col-span-5 p-5 rounded-2xl bg-[#251214] border border-[#381B1E] space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#E0A96D] font-semibold">
              Source Material & Visual Asset
            </span>
            <h4 className="text-sm font-bold text-[#FFF8F0]">"New CNC operator vacancy in Israel"</h4>
            
            {/* Visual Media Showcase */}
            <div className="relative aspect-video rounded-xl overflow-hidden border border-[#381B1E] bg-black">
              <img
                src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80"
                alt="Visual context"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-[10px] font-semibold text-white flex items-center gap-1 border border-white/20">
                <ImageIcon className="w-3 h-3 text-[#E0A96D]" />
                <span>AI Inferred Visual</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-[#A87B51]">
              <span>Tone: Recruitment</span>
              <span>·</span>
              <span>Platforms: 7 Channels</span>
            </div>
          </div>

          {/* Flow Indicator */}
          <div className="lg:col-span-2 flex flex-col items-center justify-center text-[#E0A96D] py-2">
            <div className="w-10 h-10 rounded-full bg-[#8B1E2D]/25 border border-[#8B1E2D]/40 flex items-center justify-center animate-pulse">
              <Wand2 className="w-5 h-5 text-[#E0A96D]" />
            </div>
            <span className="text-[11px] font-mono text-[#D4A373] mt-1">OmniPost Engine</span>
          </div>

          {/* Multi-Channel Outputs */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-[#251214] border border-[#0A66C2]/40 space-y-1">
              <span className="text-[10px] font-bold text-[#70B5F9]">LinkedIn Post</span>
              <p className="text-[11px] text-[#D4A373] line-clamp-2">
                Executive opening for certified CNC 5-axis machinists with comprehensive relocation package.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-[#251214] border border-[#E1306C]/40 space-y-1">
              <span className="text-[10px] font-bold text-[#F472B6]">Instagram Post</span>
              <p className="text-[11px] text-[#D4A373] line-clamp-2">
                Big career move for machinists 🚀 5-Axis CNC role in Israel (₹3L/mo) with full visa sponsorship!
              </p>
            </div>
            <div className="p-3 rounded-xl bg-[#251214] border border-[#00A884]/40 space-y-1">
              <span className="text-[10px] font-bold text-[#2DD4BF]">WhatsApp Broadcast</span>
              <p className="text-[11px] text-[#D4A373] line-clamp-2">
                *URGENT HIRING: CNC 5-AXIS* Salary: ₹3 Lakh/mo. Direct WhatsApp application link included.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-[#251214] border border-[#1D9BF0]/40 space-y-1">
              <span className="text-[10px] font-bold text-[#38BDF8]">X (Twitter) Update</span>
              <p className="text-[11px] text-[#D4A373] line-clamp-2">
                Hiring: CNC 5-Axis Operators in Israel. ₹3L/mo, aerospace precision. Apply now: #CNCJobs
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Supported Platforms Grid */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-[#FFF8F0]">7 Tailored Social Networks</h2>
          <p className="text-xs text-[#D4A373]">Every channel follows its own native writing guidelines</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {ALL_PLATFORM_IDS.map((pId) => {
            const p = PLATFORMS_CONFIG[pId];
            return (
              <div
                key={pId}
                className="p-5 rounded-2xl bg-[#1C0E10]/95 border border-[#381B1E] space-y-3 shadow-md"
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-xs shadow-sm"
                    style={{ backgroundColor: p.brandColor }}
                  >
                    {p.shortName}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-[#FFF8F0]">{p.name}</h3>
                    <span className="text-[10px] text-[#D4A373]">{p.badge}</span>
                  </div>
                </div>

                <p className="text-xs text-[#D4A373] leading-relaxed">{p.description}</p>

                <div className="pt-2 border-t border-[#381B1E] text-[11px] text-[#A87B51] space-y-1">
                  <p>Limit: ≤ {p.characterLimit} chars</p>
                  <p>Recommended: {p.recommendedAspect}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-[#FFF8F0]">How OmniPost Works in 3 Steps</h2>
          <p className="text-xs text-[#D4A373]">From raw thought to published content in under 60 seconds</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[#1C0E10]/95 border border-[#381B1E] space-y-3 shadow-md">
            <div className="w-8 h-8 rounded-full bg-[#8B1E2D]/25 border border-[#8B1E2D]/40 text-[#F5C2C7] flex items-center justify-center font-mono font-bold text-sm">
              1
            </div>
            <h3 className="text-sm font-bold text-[#FFF8F0]">Enter Your Content</h3>
            <p className="text-xs text-[#D4A373] leading-relaxed">
              Describe your idea, job opening, event, product release, or paste a blog link. Add optional metadata like salary or dates.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#1C0E10]/95 border border-[#381B1E] space-y-3 shadow-md">
            <div className="w-8 h-8 rounded-full bg-[#8B1E2D]/25 border border-[#8B1E2D]/40 text-[#E0A96D] flex items-center justify-center font-mono font-bold text-sm">
              2
            </div>
            <h3 className="text-sm font-bold text-[#FFF8F0]">Select Networks & Visuals</h3>
            <p className="text-xs text-[#D4A373] leading-relaxed">
              Choose your target channels and tone. AI analyzes your text context to generate matching commercial visual images automatically.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#1C0E10]/95 border border-[#381B1E] space-y-3 shadow-md">
            <div className="w-8 h-8 rounded-full bg-[#8B1E2D]/25 border border-[#8B1E2D]/40 text-[#F5C2C7] flex items-center justify-center font-mono font-bold text-sm">
              3
            </div>
            <h3 className="text-sm font-bold text-[#FFF8F0]">Refine, Copy & Schedule</h3>
            <p className="text-xs text-[#D4A373] leading-relaxed">
              Inspect realistic previews for each network, make one-click tone adjustments, and queue posts directly to the calendar.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Comparison */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-[#FFF8F0]">Transparent Plans for Every Stage</h2>
          <p className="text-xs text-[#D4A373]">Scale your social presence without per-seat complexity</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PRICING_TIERS.map((tier) => (
            <div
              key={tier.name}
              className={`p-6 rounded-3xl flex flex-col justify-between space-y-6 border transition-all ${
                tier.popular
                  ? 'bg-gradient-to-b from-[#2D1418] via-[#1C0E10] to-[#14090A] border-[#8B1E2D] shadow-xl shadow-[#8B1E2D]/25'
                  : 'bg-[#1C0E10]/90 border-[#381B1E]'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#FFF8F0]">{tier.name}</h3>
                  {tier.popular && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#8B1E2D]/40 text-[#F5C2C7] font-semibold uppercase border border-[#A62639]/30">
                      Most Popular
                    </span>
                  )}
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-[#FFF8F0] font-mono">{tier.price}</span>
                  <span className="text-xs text-[#D4A373]">/ {tier.period}</span>
                </div>

                <p className="text-xs text-[#D4A373] leading-relaxed">{tier.description}</p>

                <div className="space-y-2 pt-2 border-t border-[#381B1E] text-xs text-[#D4A373]">
                  {tier.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#E0A96D] shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={onStartCreating}
                className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all ${
                  tier.popular
                    ? 'bg-gradient-to-r from-[#8B1E2D] to-[#A62639] hover:from-[#A62639] hover:to-[#C93B51] text-white shadow-lg shadow-[#8B1E2D]/40'
                    : 'bg-[#251214] hover:bg-[#381B1E] text-[#FFF8F0] border border-[#381B1E]'
                }`}
              >
                {tier.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="space-y-4 max-w-3xl mx-auto">
        <h2 className="text-xl font-bold text-[#FFF8F0] text-center">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {FAQS.map((faq, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-[#1C0E10]/95 border border-[#381B1E] space-y-1.5 shadow-md">
              <h4 className="text-xs font-bold text-[#FFF8F0]">{faq.q}</h4>
              <p className="text-xs text-[#D4A373] leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-8 border-t border-[#381B1E] text-center space-y-2 text-xs text-[#A87B51]">
        <p className="font-semibold text-[#FFF8F0]">{APP_CONFIG.name} — {APP_CONFIG.tagline}</p>
        <p className="text-[11px] text-[#A87B51]">
          Designed with luxury maroon & chocolate editorial styling and intelligent multi-platform generative AI.
        </p>
      </footer>
    </div>
  );
};
