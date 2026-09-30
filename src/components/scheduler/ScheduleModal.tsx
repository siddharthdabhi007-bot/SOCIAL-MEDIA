import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, Globe, X, Check } from 'lucide-react';
import { PlatformId, Project, ScheduledPostItem } from '../../types';
import { PLATFORMS_CONFIG } from '../../config/platforms';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  defaultPlatform?: PlatformId;
  onSaveSchedule: (items: ScheduledPostItem[]) => void;
  onNotify: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
}

export const ScheduleModal: React.FC<ScheduleModalProps> = ({
  isOpen,
  onClose,
  project,
  defaultPlatform,
  onSaveSchedule,
  onNotify,
}) => {
  const availablePlatforms = project.selectedPlatforms.length > 0
    ? project.selectedPlatforms
    : (Object.keys(project.platformPosts) as PlatformId[]);

  const [targetPlatforms, setTargetPlatforms] = useState<PlatformId[]>(
    defaultPlatform ? [defaultPlatform] : availablePlatforms
  );

  // Set default schedule date to tomorrow at 10:00 AM
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const [scheduledDate, setScheduledDate] = useState(tomorrowStr);
  const [scheduledTime, setScheduledTime] = useState('10:00');
  const [timezone, setTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata'
  );

  if (!isOpen) return null;

  const togglePlatform = (p: PlatformId) => {
    if (targetPlatforms.includes(p)) {
      if (targetPlatforms.length === 1) return; // keep at least 1
      setTargetPlatforms(targetPlatforms.filter((item) => item !== p));
    } else {
      setTargetPlatforms([...targetPlatforms, p]);
    }
  };

  const handleConfirm = () => {
    if (targetPlatforms.length === 0) return;

    const newItems: ScheduledPostItem[] = targetPlatforms.map((pId) => {
      const post = project.platformPosts[pId];
      return {
        id: `sched-${pId}-${Date.now()}`,
        projectId: project.id,
        projectTitle: project.title || 'Untitled Post',
        platform: pId,
        content: post?.fullPost || project.sourceContent,
        mediaUrl: project.media?.url,
        scheduledDate,
        scheduledTime,
        timezone,
        status: 'scheduled',
        createdAt: new Date().toISOString(),
      };
    });

    onSaveSchedule(newItems);
    onNotify(
      'success',
      'Posts Scheduled!',
      `Queued for ${scheduledDate} at ${scheduledTime} (${targetPlatforms.length} platforms).`
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-md rounded-2xl bg-[#1C0E10] border border-[#381B1E] shadow-2xl p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-[#381B1E] pb-3">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-[#E0A96D]" />
            <h3 className="text-sm font-bold text-[#FFF8F0]">Schedule Post Delivery</h3>
          </div>
          <button onClick={onClose} className="p-1 text-[#A87B51] hover:text-[#FFF8F0]">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Platform selection for schedule */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-[#D4A373]">
            Target Platforms to Queue
          </label>
          <div className="flex flex-wrap gap-2">
            {availablePlatforms.map((pId) => {
              const cfg = PLATFORMS_CONFIG[pId];
              const isSelected = targetPlatforms.includes(pId);
              return (
                <button
                  key={pId}
                  type="button"
                  onClick={() => togglePlatform(pId)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    isSelected
                      ? 'bg-[#8B1E2D] text-white border border-[#A62639]/50 shadow-sm'
                      : 'bg-[#251214] text-[#D4A373] border border-[#381B1E]'
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: cfg.brandColor }}
                  />
                  <span>{cfg.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Date and Time Pickers */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-[#D4A373] mb-1.5 flex items-center gap-1">
              <CalendarIcon className="w-3 h-3 text-[#A87B51]" /> Date
            </label>
            <input
              type="date"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#14090A] border border-[#381B1E] text-xs text-[#FFF8F0] focus:outline-none focus:border-[#8B1E2D]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#D4A373] mb-1.5 flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#A87B51]" /> Time
            </label>
            <input
              type="time"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#14090A] border border-[#381B1E] text-xs text-[#FFF8F0] focus:outline-none focus:border-[#8B1E2D]"
            />
          </div>
        </div>

        {/* Timezone */}
        <div>
          <label className="block text-xs font-medium text-[#D4A373] mb-1.5 flex items-center gap-1">
            <Globe className="w-3 h-3 text-[#A87B51]" /> Timezone
          </label>
          <input
            type="text"
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-[#14090A] border border-[#381B1E] text-xs text-[#FFF8F0] focus:outline-none"
          />
        </div>

        {/* Footer Actions */}
        <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#381B1E]">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 rounded-xl bg-[#251214] hover:bg-[#381B1E] text-xs font-medium text-[#D4A373] transition-colors border border-[#381B1E]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#8B1E2D] to-[#A62639] hover:from-[#A62639] hover:to-[#C93B51] text-white text-xs font-semibold shadow-lg shadow-[#8B1E2D]/35 transition-all active:scale-95"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Confirm Schedule</span>
          </button>
        </div>
      </div>
    </div>
  );
};
