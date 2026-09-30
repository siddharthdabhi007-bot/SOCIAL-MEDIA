import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Command,
  Plus,
  HelpCircle,
  Layers,
  ChevronDown,
  Palette,
  Share2,
  BookmarkCheck,
  History,
  Smartphone,
  Camera,
  Calendar,
  PenSquare,
  LayoutDashboard,
} from 'lucide-react';
import { APP_CONFIG } from '../../config/appConfig';
import { AppLogo } from '../ui/AppLogo';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  onOpenCommandPalette: () => void;
  onOpenSmartTools: () => void;
  onToggleLandingModal: () => void;
  isAiLive: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onNavigate,
  onOpenCommandPalette,
  onOpenSmartTools,
  onToggleLandingModal,
  isAiLive,
}) => {
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
        setIsMoreOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const primaryNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'composer', label: 'Create', icon: PenSquare, highlight: true },
    { id: 'story', label: 'Story Maker', icon: Smartphone },
    { id: 'pfp', label: 'PFP Studio', icon: Camera },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'templates', label: 'Templates', icon: BookmarkCheck },
    { id: 'history', label: 'History', icon: History },
  ];

  const moreNavItems = [
    {
      id: 'brandkit',
      label: 'Brand Kit & Style',
      description: 'Brand voice, hashtags & guidelines',
      icon: Palette,
    },
    {
      id: 'post_options',
      label: 'Post Formats & Decks',
      description: 'Carousels, short video scripts & threads',
      icon: Layers,
    },
    {
      id: 'integrations',
      label: 'Connected Accounts',
      description: 'Manage 7 social channel gateways',
      icon: Share2,
    },
  ];

  const isMoreActive = moreNavItems.some((item) => item.id === currentTab);

  return (
    <header className="sticky top-0 z-40 w-full h-16 border-b border-[#381B1E]/80 bg-[#14090A]/95 backdrop-blur-xl px-4 md:px-6 lg:px-8 flex items-center justify-between shadow-lg shadow-black/40">
      {/* Zone 1: Logo & AI Status */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-2.5 hover:opacity-95 transition-opacity text-left group"
        >
          <AppLogo size="sm" showText={false} />
          <div className="flex items-center gap-1.5">
            <span className="text-base sm:text-lg font-extrabold tracking-tight bg-gradient-to-r from-white via-[#F5EBE0] to-[#E0A96D] bg-clip-text text-transparent group-hover:from-[#F5C2C7] group-hover:to-[#E0A96D] transition-colors">
              OmniPost
            </span>
            <span className="px-1.5 py-0.5 rounded-md bg-[#8B1E2D]/35 border border-[#A62639]/40 text-[10px] font-mono font-bold text-[#F5C2C7] shadow-sm">
              AI
            </span>
          </div>
        </button>

        {/* Quiet status dot */}
        <div
          title={isAiLive ? 'Connected to Gemini 3.8 Flash' : 'Native Intelligent Generator Active'}
          className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#251214] border border-[#442125] text-[11px] text-[#D4A373] font-mono"
        >
          <span className={`w-1.5 h-1.5 rounded-full ${isAiLive ? 'bg-emerald-400 animate-pulse' : 'bg-[#E0A96D]'}`} />
          <span>{isAiLive ? 'AI Live' : 'Native Engine'}</span>
        </div>
      </div>

      {/* Zone 2: Primary Navigation Tabs + More Dropdown */}
      <nav className="hidden md:flex items-center gap-1 lg:gap-1.5 mx-2 overflow-x-auto scrollbar-none py-1">
        {primaryNavItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`px-2.5 lg:px-3 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                isActive
                  ? 'bg-[#8B1E2D]/30 text-[#FFF8F0] border border-[#A62639]/60 shadow-sm shadow-[#8B1E2D]/20'
                  : 'text-[#D4A373]/85 hover:text-[#FFF8F0] hover:bg-[#251214] border border-transparent'
              }`}
            >
              <span>{item.label}</span>
              {item.highlight && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#E0A96D] animate-ping" />
              )}
            </button>
          );
        })}

        {/* More Dropdown for secondary features */}
        <div className="relative" ref={moreRef}>
          <button
            onClick={() => setIsMoreOpen(!isMoreOpen)}
            className={`px-2.5 lg:px-3 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
              isMoreActive || isMoreOpen
                ? 'bg-[#8B1E2D]/30 text-[#FFF8F0] border border-[#A62639]/60 shadow-sm'
                : 'text-[#D4A373]/85 hover:text-[#FFF8F0] hover:bg-[#251214] border border-transparent'
            }`}
          >
            <span>More</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isMoreOpen ? 'rotate-180' : ''}`} />
          </button>

          {isMoreOpen && (
            <div className="absolute right-0 sm:left-0 sm:right-auto mt-2 w-64 rounded-2xl bg-[#1C0E10] border border-[#381B1E] shadow-2xl p-2 space-y-1 z-50 animate-in fade-in zoom-in-95 duration-100">
              <p className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#A87B51]">
                Workspace & Assets
              </p>
              {moreNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onNavigate(item.id);
                      setIsMoreOpen(false);
                    }}
                    className={`w-full flex items-start gap-2.5 p-2.5 rounded-xl text-left transition-colors ${
                      isActive
                        ? 'bg-[#8B1E2D]/30 text-white border border-[#A62639]/40'
                        : 'hover:bg-[#251214] text-[#D4A373] hover:text-[#FFF8F0]'
                    }`}
                  >
                    <div className="p-1.5 rounded-lg bg-[#251214] border border-[#381B1E] text-[#E0A96D] shrink-0 mt-0.5">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#FFF8F0]">{item.label}</p>
                      <p className="text-[11px] text-[#A87B51] truncate">{item.description}</p>
                    </div>
                  </button>
                );
              })}

              <div className="pt-1 mt-1 border-t border-[#381B1E]">
                <button
                  onClick={() => {
                    onToggleLandingModal();
                    setIsMoreOpen(false);
                  }}
                  className="w-full flex items-center gap-2 p-2 rounded-xl text-left text-xs font-semibold text-[#D4A373] hover:text-[#FFF8F0] hover:bg-[#251214] transition-colors"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-[#E0A96D]" />
                  <span>Feature Guide & Tour</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Zone 3: Actions */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Command shortcut button */}
        <button
          onClick={onOpenCommandPalette}
          className="hidden lg:flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-[#251214] border border-[#381B1E] text-xs text-[#D4A373] hover:text-[#FFF8F0] hover:border-[#8B1E2D]/50 transition-colors shadow-sm"
          title="Search or jump to (Cmd+K)"
        >
          <Command className="w-3.5 h-3.5 text-[#E0A96D]" />
          <span className="text-[11px] font-mono">⌘K</span>
        </button>

        {/* Smart Tools quick trigger */}
        <button
          onClick={onOpenSmartTools}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#251214] hover:bg-[#381B1E] text-xs font-semibold text-[#F5C2C7] border border-[#381B1E] hover:border-[#8B1E2D]/50 transition-colors whitespace-nowrap shadow-sm"
          title="Smart Hook, Hashtag & CTA Generators"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#E0A96D]" />
          <span className="hidden sm:inline">AI Tools</span>
        </button>

        {/* Feature guide button */}
        <button
          onClick={onToggleLandingModal}
          className="p-2 rounded-xl text-[#A87B51] hover:text-[#FFF8F0] hover:bg-[#251214] transition-colors border border-[#381B1E]/60 hidden sm:flex"
          title="Product Tour & Features"
          aria-label="Features Guide"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        {/* Primary CTA button */}
        <button
          onClick={() => onNavigate('composer')}
          className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-[#8B1E2D] to-[#A62639] hover:from-[#A62639] hover:to-[#C93B51] text-white text-xs font-bold shadow-lg shadow-[#8B1E2D]/35 active:scale-95 transition-all whitespace-nowrap"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Post</span>
        </button>
      </div>
    </header>
  );
};
