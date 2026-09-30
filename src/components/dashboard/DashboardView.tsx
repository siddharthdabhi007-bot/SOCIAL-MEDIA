import React from 'react';
import {
  PenSquare,
  Sparkles,
  Layers,
  Calendar,
  Image as ImageIcon,
  Share2,
  Clock,
  ArrowRight,
  Copy,
  Trash2,
  ExternalLink,
  Plus,
  BookmarkCheck,
  CheckCircle2,
} from 'lucide-react';
import { BrandKit, PlatformId, Project, ScheduledPostItem } from '../../types';
import { PLATFORMS_CONFIG } from '../../config/platforms';
import { POST_TEMPLATES } from '../../services/templates';
import { AppLogo } from '../ui/AppLogo';
import { getRelevantImageUrl } from '../../utils/imageMatcher';

interface DashboardViewProps {
  projects: Project[];
  scheduledPosts: ScheduledPostItem[];
  brandKit: BrandKit;
  onNavigate: (tab: string) => void;
  onSelectProject: (project: Project) => void;
  onDuplicateProject: (projectId: string) => void;
  onDeleteProject: (projectId: string) => void;
  onUseTemplate: (template: any) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  projects,
  scheduledPosts,
  brandKit,
  onNavigate,
  onSelectProject,
  onDuplicateProject,
  onDeleteProject,
  onUseTemplate,
}) => {
  // Aggregate real analytics from local projects & schedules
  const totalPostsGenerated = projects.reduce((acc, p) => {
    return acc + Object.keys(p.platformPosts || {}).length;
  }, 0);

  const uniquePlatformsUsed = new Set<PlatformId>();
  projects.forEach((p) => {
    p.selectedPlatforms.forEach((id) => uniquePlatformsUsed.add(id));
  });

  const totalMediaAssets = projects.filter((p) => !!p.media).length;
  const totalScheduled = scheduledPosts.length;

  return (
    <div className="space-y-8">
      {/* Welcome Banner with Realistic Maroon & Chocolate Theme */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#2D1418] via-[#1F0E11] to-[#14090A] border border-[#8B1E2D]/40 p-6 md:p-8 shadow-xl shadow-[#14090A]">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8B1E2D]/25 border border-[#A62639]/40 text-[#F5C2C7] text-xs font-semibold">
            <AppLogo size="xs" showText={false} />
            <span>OmniPost AI Workspace Active</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#FFF8F0] tracking-tight leading-tight">
            One Idea. Every Platform.
          </h1>
          <p className="text-xs md:text-sm text-[#D4A373] leading-relaxed">
            Turn your announcements, vacancies, product features, and stories into native high-impact posts for Instagram, LinkedIn, WhatsApp, X, Facebook, Snapchat, and Handshake.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('composer')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#8B1E2D] to-[#A62639] hover:from-[#A62639] hover:to-[#C93B51] text-white text-xs font-semibold shadow-lg shadow-[#8B1E2D]/35 active:scale-95 transition-all"
            >
              <PenSquare className="w-3.5 h-3.5" />
              <span>Create New Post</span>
            </button>
            <button
              onClick={() => onNavigate('templates')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#251214] hover:bg-[#381B1E] border border-[#442125] text-[#F5EBE0] text-xs font-medium transition-colors"
            >
              <BookmarkCheck className="w-3.5 h-3.5 text-[#E0A96D]" />
              <span>Explore Templates</span>
            </button>
            <button
              onClick={() => onNavigate('calendar')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#251214] hover:bg-[#381B1E] border border-[#442125] text-[#F5EBE0] text-xs font-medium transition-colors"
            >
              <Calendar className="w-3.5 h-3.5 text-[#E0A96D]" />
              <span>View Calendar</span>
            </button>
          </div>
        </div>

        {/* Ambient background glow */}
        <div className="absolute right-0 top-0 -bottom-8 w-96 bg-gradient-to-bl from-[#8B1E2D]/25 via-[#E0A96D]/15 to-transparent blur-3xl pointer-events-none" />
      </div>

      {/* Analytics Cards with Chocolate & Warm Caramel Theme */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#1C0E10]/90 border border-[#381B1E] space-y-2 shadow-md">
          <div className="flex items-center justify-between text-[#A87B51]">
            <span className="text-xs font-medium">Posts Generated</span>
            <Layers className="w-4 h-4 text-[#E0A96D]" />
          </div>
          <p className="text-2xl font-bold text-[#FFF8F0] font-mono tabular-nums">
            {totalPostsGenerated}
          </p>
          <p className="text-[11px] text-[#D4A373]/80">Across all social networks</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#1C0E10]/90 border border-[#381B1E] space-y-2 shadow-md">
          <div className="flex items-center justify-between text-[#A87B51]">
            <span className="text-xs font-medium">Platforms Used</span>
            <Share2 className="w-4 h-4 text-[#E0A96D]" />
          </div>
          <p className="text-2xl font-bold text-[#FFF8F0] font-mono tabular-nums">
            {uniquePlatformsUsed.size} <span className="text-xs font-normal text-[#A87B51]">/ 7</span>
          </p>
          <p className="text-[11px] text-[#D4A373]/80">Target channels configured</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#1C0E10]/90 border border-[#381B1E] space-y-2 shadow-md">
          <div className="flex items-center justify-between text-[#A87B51]">
            <span className="text-xs font-medium">Visual Assets</span>
            <ImageIcon className="w-4 h-4 text-[#E0A96D]" />
          </div>
          <p className="text-2xl font-bold text-[#FFF8F0] font-mono tabular-nums">
            {totalMediaAssets}
          </p>
          <p className="text-[11px] text-[#D4A373]/80">AI graphics & visual recipes</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#1C0E10]/90 border border-[#381B1E] space-y-2 shadow-md">
          <div className="flex items-center justify-between text-[#A87B51]">
            <span className="text-xs font-medium">Scheduled Posts</span>
            <Clock className="w-4 h-4 text-[#E0A96D]" />
          </div>
          <p className="text-2xl font-bold text-[#FFF8F0] font-mono tabular-nums">
            {totalScheduled}
          </p>
          <p className="text-[11px] text-[#D4A373]/80">Queued in content calendar</p>
        </div>
      </div>

      {/* Recent Projects Section - Displays Image instead of Text! */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#FFF8F0]">Recent Post Campaigns</h2>
            <p className="text-xs text-[#D4A373]">Visual social campaigns created from your source ideas</p>
          </div>
          <button
            onClick={() => onNavigate('composer')}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#E0A96D] hover:text-[#FFF8F0] transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Post</span>
          </button>
        </div>

        {projects.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[#1C0E10]/70 border border-[#381B1E] space-y-3">
            <Layers className="w-8 h-8 text-[#A87B51] mx-auto" />
            <p className="text-sm font-semibold text-[#F5EBE0]">No projects yet</p>
            <p className="text-xs text-[#D4A373] max-w-sm mx-auto">
              Ready to generate platform-perfect posts with matching visual imagery?
            </p>
            <button
              onClick={() => onNavigate('composer')}
              className="px-4 py-2 rounded-xl bg-[#8B1E2D] hover:bg-[#A62639] text-white text-xs font-semibold transition-colors"
            >
              Create Your First Post
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((proj) => {
              const dateStr = new Date(proj.updatedAt || proj.createdAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
              });

              // Contextual or media image relevant to text
              const projectImageUrl = getRelevantImageUrl(
                proj.media?.url,
                `${proj.title} ${proj.sourceContent}`
              );

              return (
                <div
                  key={proj.id}
                  className="rounded-2xl bg-[#1C0E10]/90 border border-[#381B1E] hover:border-[#8B1E2D]/60 p-4 flex flex-col justify-between space-y-3 transition-all group shadow-md hover:shadow-xl hover:shadow-[#14090A]"
                >
                  <div className="space-y-3">
                    {/* Header: Title and Status */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-bold text-[#FFF8F0] truncate group-hover:text-[#E0A96D] transition-colors">
                          {proj.title || 'Untitled Post Campaign'}
                        </h3>
                        <div className="flex items-center gap-2 text-[11px] text-[#A87B51] mt-0.5">
                          <span>{dateStr}</span>
                          <span>·</span>
                          <span className="capitalize">{proj.tone} tone</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 uppercase">
                        {proj.status}
                      </span>
                    </div>

                    {/* Prominent Visual Media Image Display Instead of Plain Text */}
                    <div
                      onClick={() => onSelectProject(proj)}
                      className="relative aspect-video w-full rounded-xl overflow-hidden bg-[#14090A] border border-[#381B1E] group-hover:border-[#8B1E2D]/60 transition-colors cursor-pointer"
                    >
                      <img
                        src={projectImageUrl}
                        alt={proj.title || 'Campaign Visual'}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#14090A]/95 via-transparent to-black/30 pointer-events-none" />
                      
                      {/* Image badge overlay */}
                      <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md border border-white/20 text-[10px] font-semibold text-[#FFF8F0] flex items-center gap-1.5 shadow">
                        <ImageIcon className="w-3 h-3 text-[#E0A96D]" />
                        <span>Visual Asset</span>
                      </div>

                      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[11px] text-[#FFF8F0] font-medium drop-shadow">
                        <span className="truncate max-w-[200px] text-[#F5EBE0]">
                          {proj.media?.name || proj.title || 'Context Graphic'}
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-[#8B1E2D]/80 text-[#F5C2C7] font-mono text-[10px]">
                          {proj.media?.aspectRatio || '16:9'}
                        </span>
                      </div>
                    </div>

                    {/* Platform icons row */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {proj.selectedPlatforms.map((pId) => {
                        const pConfig = PLATFORMS_CONFIG[pId];
                        return (
                          <div
                            key={pId}
                            title={pConfig?.name}
                            className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold text-white shadow-sm"
                            style={{ backgroundColor: pConfig?.brandColor || '#8B1E2D' }}
                          >
                            {pConfig?.shortName || pId.slice(0, 2).toUpperCase()}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center justify-between pt-3 border-t border-[#381B1E] text-xs">
                    <button
                      onClick={() => onSelectProject(proj)}
                      className="flex items-center gap-1.5 text-[#E0A96D] hover:text-[#FFF8F0] font-semibold transition-colors"
                    >
                      <span>View & Edit</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onDuplicateProject(proj.id)}
                        className="p-1.5 rounded-lg text-[#A87B51] hover:text-[#FFF8F0] hover:bg-[#251214] transition-colors"
                        title="Duplicate project"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteProject(proj.id)}
                        className="p-1.5 rounded-lg text-[#A87B51] hover:text-rose-400 hover:bg-[#251214] transition-colors"
                        title="Delete project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Launch Templates Carousel */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#FFF8F0]">Featured Content Templates</h2>
            <p className="text-xs text-[#D4A373]">Pre-configured fields for proven high-converting post formats</p>
          </div>
          <button
            onClick={() => onNavigate('templates')}
            className="text-xs font-semibold text-[#E0A96D] hover:text-[#FFF8F0] transition-colors"
          >
            Browse All 15 Templates →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {POST_TEMPLATES.slice(0, 4).map((template) => (
            <div
              key={template.id}
              onClick={() => onUseTemplate(template)}
              className="p-4 rounded-2xl bg-[#1C0E10]/90 border border-[#381B1E] hover:border-[#8B1E2D]/50 hover:bg-[#251214] cursor-pointer transition-all flex flex-col justify-between space-y-3 group shadow-sm"
            >
              <div className="space-y-2">
                <span className="text-[10px] font-semibold text-[#E0A96D] uppercase tracking-wider">
                  {template.category}
                </span>
                <h4 className="text-xs font-bold text-[#FFF8F0] group-hover:text-[#E0A96D] transition-colors">
                  {template.title}
                </h4>
                <p className="text-[11px] text-[#D4A373]/80 line-clamp-2 leading-relaxed">
                  {template.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#381B1E] text-xs">
                <span className="text-[11px] text-[#A87B51] font-mono">
                  {template.recommendedPlatforms.length} platforms
                </span>
                <span className="text-[#E0A96D] group-hover:translate-x-0.5 transition-transform">
                  Use →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
