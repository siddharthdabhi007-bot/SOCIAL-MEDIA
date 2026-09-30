import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  PenSquare,
  Calendar,
  Bookmark,
  History,
  Palette,
  Share2,
  Sparkles,
  X,
  ArrowRight,
  Camera,
  Smartphone,
  Layers,
} from 'lucide-react';
import { POST_TEMPLATES } from '../../services/templates';
import { PostTemplate } from '../../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: string) => void;
  onSelectTemplate: (template: PostTemplate) => void;
  onOpenSmartTools: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onSelectTemplate,
  onOpenSmartTools,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // parent will toggle
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const actions = [
    { id: 'create', title: 'Create New Social Post', desc: 'Open multi-platform composer', icon: PenSquare, tab: 'composer' },
    { id: 'pfp', title: 'PFP & Avatar Studio', desc: 'Generate social media profile pictures & avatars', icon: Camera, tab: 'pfp' },
    { id: 'story', title: 'Story Maker (9:16)', desc: 'Design vertical story graphics with interactive stickers', icon: Smartphone, tab: 'story' },
    { id: 'post_options', title: 'Post Options & Decks', desc: 'Generate carousel slides, short-form scripts, and threads', icon: Layers, tab: 'post_options' },
    { id: 'calendar', title: 'View Content Calendar', desc: 'Inspect scheduled releases', icon: Calendar, tab: 'calendar' },
    { id: 'templates', title: 'Explore Post Templates', desc: 'Browse 15 curated blueprints', icon: Bookmark, tab: 'templates' },
    { id: 'history', title: 'Search Post History', desc: 'View past drafts and generations', icon: History, tab: 'history' },
    { id: 'brandkit', title: 'Configure Brand Kit', desc: 'Edit voice, colors, and hashtags', icon: Palette, tab: 'brandkit' },
    { id: 'integrations', title: 'Connected Social Accounts', desc: 'Manage platform integrations', icon: Share2, tab: 'integrations' },
  ];

  const filteredActions = actions.filter(
    (a) => a.title.toLowerCase().includes(query.toLowerCase()) || a.desc.toLowerCase().includes(query.toLowerCase())
  );

  const filteredTemplates = POST_TEMPLATES.filter(
    (t) => t.title.toLowerCase().includes(query.toLowerCase()) || t.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-xl rounded-2xl bg-[#1C0E10] border border-[#381B1E] shadow-2xl overflow-hidden">
        {/* Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-[#381B1E]">
          <Search className="w-5 h-5 text-[#A87B51] mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command, page, or search templates..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-[#FFF8F0] placeholder-[#A87B51] focus:outline-none"
          />
          <button onClick={onClose} className="p-1 text-[#A87B51] hover:text-[#FFF8F0]">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content list */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-4">
          {/* Quick Actions */}
          <div>
            <p className="px-3 py-1 text-[11px] font-semibold text-[#A87B51] uppercase tracking-wider">Navigation & Actions</p>
            <div className="space-y-1">
              {filteredActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.id}
                    onClick={() => {
                      onNavigate(action.tab);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#251214] text-left transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2 rounded-lg bg-[#251214] border border-[#381B1E] text-[#E0A96D] group-hover:bg-[#8B1E2D]/20 group-hover:border-[#8B1E2D]/40 transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-[#FFF8F0]">{action.title}</p>
                        <p className="text-[11px] text-[#D4A373] truncate">{action.desc}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#A87B51] group-hover:text-[#FFF8F0] transition-colors" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* AI Tools shortcut */}
          <div className="px-2">
            <button
              onClick={() => {
                onOpenSmartTools();
                onClose();
              }}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[#8B1E2D]/20 hover:bg-[#8B1E2D]/35 border border-[#8B1E2D]/40 transition-colors text-left"
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-[#E0A96D]" />
                <div>
                  <p className="text-xs font-semibold text-[#F5C2C7]">Open AI Smart Utilities</p>
                  <p className="text-[11px] text-[#D4A373]">Generate hooks, hashtags, CTAs, and rewriters</p>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#8B1E2D]/40 text-[#F5C2C7] border border-[#A62639]/30">Launch</span>
            </button>
          </div>

          {/* Templates */}
          {filteredTemplates.length > 0 && (
            <div>
              <p className="px-3 py-1 text-[11px] font-semibold text-[#A87B51] uppercase tracking-wider">Quick Start Blueprints</p>
              <div className="space-y-1">
                {filteredTemplates.slice(0, 4).map((template) => (
                  <button
                    key={template.id}
                    onClick={() => {
                      onSelectTemplate(template);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#251214] text-left transition-colors group"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-[#FFF8F0]">{template.title}</p>
                      <p className="text-[11px] text-[#D4A373] truncate">{template.category} · {template.sampleContent.slice(0, 60)}...</p>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#251214] text-[#D4A373] border border-[#381B1E] group-hover:bg-[#8B1E2D]/40 group-hover:text-[#F5C2C7] transition-colors">
                      Use
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 border-t border-[#381B1E] bg-[#14090A] flex items-center justify-between text-[11px] text-[#A87B51]">
          <span>Navigate with mouse or keyboard</span>
          <span>ESC to dismiss</span>
        </div>
      </div>
    </div>
  );
};
