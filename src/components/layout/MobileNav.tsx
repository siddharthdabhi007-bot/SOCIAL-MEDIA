import React from 'react';
import { LayoutDashboard, PenSquare, CalendarDays, BookmarkCheck, MoreHorizontal } from 'lucide-react';

interface MobileNavProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  onOpenMore: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ currentTab, onNavigate, onOpenMore }) => {
  const items = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'composer', label: 'Create', icon: PenSquare, highlight: true },
    { id: 'calendar', label: 'Calendar', icon: CalendarDays },
    { id: 'templates', label: 'Templates', icon: BookmarkCheck },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 h-16 bg-[#14090A]/95 backdrop-blur-xl border-t border-[#381B1E] px-2 flex items-center justify-around shadow-2xl">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = currentTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center justify-center w-14 py-1 gap-1 text-[10px] font-medium transition-colors ${
              isActive ? 'text-[#E0A96D]' : 'text-[#D4A373] hover:text-[#FFF8F0]'
            }`}
          >
            {item.highlight ? (
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#8B1E2D] to-[#A62639] flex items-center justify-center text-white shadow-lg shadow-[#8B1E2D]/40">
                <Icon className="w-4 h-4" />
              </div>
            ) : (
              <Icon className="w-5 h-5" />
            )}
            <span>{item.label}</span>
          </button>
        );
      })}

      <button
        onClick={onOpenMore}
        className="flex flex-col items-center justify-center w-14 py-1 gap-1 text-[10px] font-medium text-[#D4A373] hover:text-[#FFF8F0]"
      >
        <MoreHorizontal className="w-5 h-5" />
        <span>More</span>
      </button>
    </nav>
  );
};
