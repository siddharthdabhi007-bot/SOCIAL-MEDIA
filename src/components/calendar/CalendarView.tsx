import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Share2,
  Trash2,
  Plus,
  ExternalLink,
} from 'lucide-react';
import { PlatformId, ScheduledPostItem } from '../../types';
import { ALL_PLATFORM_IDS, PLATFORMS_CONFIG } from '../../config/platforms';

interface CalendarViewProps {
  scheduledPosts: ScheduledPostItem[];
  onRemoveScheduled: (id: string) => void;
  onNavigate: (tab: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  scheduledPosts,
  onRemoveScheduled,
  onNavigate,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [selectedPost, setSelectedPost] = useState<ScheduledPostItem | null>(null);

  // Month navigation
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  // Compute calendar grid days
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days: { day: number; dateStr: string; isCurrentMonth: boolean }[] = [];

  // Padding days from previous month
  const prevMonthDays = new Date(year, month, 0).getDate();
  for (let i = firstDay - 1; i >= 0; i--) {
    const d = prevMonthDays - i;
    days.push({
      day: d,
      dateStr: `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
      isCurrentMonth: false,
    });
  }

  // Days in current month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({
      day: i,
      dateStr: `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`,
      isCurrentMonth: true,
    });
  }

  // Fill up trailing grid
  const remaining = 35 - days.length > 0 ? 35 - days.length : (42 - days.length);
  for (let i = 1; i <= remaining; i++) {
    days.push({
      day: i,
      dateStr: `${year}-${String(month + 2).padStart(2, '0')}-${String(i).padStart(2, '0')}`,
      isCurrentMonth: false,
    });
  }

  const filteredPosts = scheduledPosts.filter((item) => {
    if (platformFilter !== 'all' && item.platform !== platformFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#381B1E] pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#FFF8F0] tracking-tight flex items-center gap-2.5">
            <CalendarIcon className="w-5 h-5 text-[#E0A96D]" />
            <span>Content Publishing Calendar</span>
          </h1>
          <p className="text-xs text-[#D4A373] mt-0.5">
            Plan, organize, and inspect multi-platform post release schedules
          </p>
        </div>

        {/* Controls and month switcher */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-[#1C0E10] border border-[#381B1E] rounded-xl p-1">
            <button
              onClick={prevMonth}
              className="p-1.5 rounded-lg hover:bg-[#251214] text-[#D4A373] hover:text-[#FFF8F0] transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-[#FFF8F0] px-3 min-w-[120px] text-center font-mono">
              {monthName}
            </span>
            <button
              onClick={nextMonth}
              className="p-1.5 rounded-lg hover:bg-[#251214] text-[#D4A373] hover:text-[#FFF8F0] transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => onNavigate('composer')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#8B1E2D] to-[#A62639] hover:from-[#A62639] hover:to-[#C93B51] text-white text-xs font-semibold shadow-md shadow-[#8B1E2D]/30 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Schedule Post</span>
          </button>
        </div>
      </div>

      {/* Platform Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setPlatformFilter('all')}
          className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
            platformFilter === 'all'
              ? 'bg-[#8B1E2D] text-white border border-[#A62639]/50 shadow-sm'
              : 'bg-[#1C0E10] text-[#D4A373] border border-[#381B1E] hover:text-[#FFF8F0]'
          }`}
        >
          All Platforms ({scheduledPosts.length})
        </button>
        {ALL_PLATFORM_IDS.map((pId) => {
          const cfg = PLATFORMS_CONFIG[pId];
          const count = scheduledPosts.filter((p) => p.platform === pId).length;
          return (
            <button
              key={pId}
              onClick={() => setPlatformFilter(pId)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                platformFilter === pId
                  ? 'bg-[#8B1E2D] text-white border border-[#A62639]/50 shadow-sm'
                  : 'bg-[#1C0E10] text-[#D4A373] border border-[#381B1E] hover:text-[#FFF8F0]'
              }`}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cfg.brandColor }} />
              <span>{cfg.name}</span>
              <span className="text-[10px] text-[#A87B51] font-mono">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Month Calendar Grid with Deep Chocolate Theme */}
      <div className="rounded-2xl bg-[#1C0E10]/95 border border-[#381B1E] overflow-hidden shadow-xl">
        {/* Days of week header */}
        <div className="grid grid-cols-7 border-b border-[#381B1E] bg-[#14090A] text-center py-2.5 text-[11px] font-semibold text-[#D4A373] uppercase tracking-wider">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-[#381B1E]">
          {days.map((item, idx) => {
            const dayPosts = filteredPosts.filter((p) => p.scheduledDate === item.dateStr);

            return (
              <div
                key={idx}
                className={`min-h-[95px] p-2 flex flex-col justify-between transition-colors ${
                  item.isCurrentMonth ? 'bg-[#1C0E10]/70 hover:bg-[#251214]' : 'bg-[#14090A]/50 opacity-40'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className={`font-mono text-xs ${item.isCurrentMonth ? 'text-[#FFF8F0]' : 'text-[#A87B51]'}`}>
                    {item.day}
                  </span>
                  {dayPosts.length > 0 && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#8B1E2D]/40 text-[#F5C2C7] font-mono">
                      {dayPosts.length}
                    </span>
                  )}
                </div>

                {/* Scheduled item cards in cell */}
                <div className="space-y-1 overflow-y-auto max-h-20">
                  {dayPosts.map((post) => {
                    const cfg = PLATFORMS_CONFIG[post.platform];
                    return (
                      <div
                        key={post.id}
                        onClick={() => setSelectedPost(post)}
                        className="px-2 py-1 rounded-md bg-[#251214] hover:bg-[#381B1E] border border-[#381B1E] cursor-pointer text-left transition-all"
                      >
                        <div className="flex items-center gap-1.5">
                          <span
                            className="w-1.5 h-1.5 rounded-full shrink-0"
                            style={{ backgroundColor: cfg?.brandColor || '#8B1E2D' }}
                          />
                          <p className="text-[10px] font-semibold text-[#FFF8F0] truncate">
                            {post.scheduledTime} · {post.projectTitle}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Post Detail Drawer / Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-2xl bg-[#1C0E10] border border-[#381B1E] shadow-2xl p-6 space-y-4">
            <div className="flex items-start justify-between border-b border-[#381B1E] pb-3">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow"
                  style={{ backgroundColor: PLATFORMS_CONFIG[selectedPost.platform]?.brandColor }}
                >
                  {PLATFORMS_CONFIG[selectedPost.platform]?.shortName}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#FFF8F0]">{selectedPost.projectTitle}</h3>
                  <p className="text-xs text-[#D4A373]">
                    Scheduled for {selectedPost.scheduledDate} at {selectedPost.scheduledTime} ({selectedPost.timezone})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedPost(null)}
                className="text-[#A87B51] hover:text-[#FFF8F0] text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-[#14090A] border border-[#381B1E] text-xs text-[#FFF8F0] whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
              {selectedPost.content}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#381B1E]">
              <button
                onClick={() => {
                  onRemoveScheduled(selectedPost.id);
                  setSelectedPost(null);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-rose-400 hover:bg-rose-950/30 text-xs font-semibold transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Cancel Schedule</span>
              </button>

              <button
                onClick={() => setSelectedPost(null)}
                className="px-4 py-1.5 rounded-lg bg-[#251214] hover:bg-[#381B1E] border border-[#381B1E] text-xs font-medium text-[#FFF8F0] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
