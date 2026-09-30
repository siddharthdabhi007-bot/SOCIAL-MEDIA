import React, { useState } from 'react';
import {
  History,
  Search,
  Download,
  Filter,
  Trash2,
  Copy,
  PenSquare,
  ArrowRight,
  Layers,
  Image as ImageIcon,
} from 'lucide-react';
import { PlatformId, Project } from '../../types';
import { ALL_PLATFORM_IDS, PLATFORMS_CONFIG } from '../../config/platforms';
import { getRelevantImageUrl } from '../../utils/imageMatcher';

interface HistoryViewProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onDuplicateProject: (projectId: string) => void;
  onDeleteProject: (projectId: string) => void;
  onNotify: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  projects,
  onSelectProject,
  onDuplicateProject,
  onDeleteProject,
  onNotify,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [platformFilter, setPlatformFilter] = useState<string>('all');

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.sourceContent.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    const matchesPlatform = platformFilter === 'all' || p.selectedPlatforms.includes(platformFilter as PlatformId);
    return matchesSearch && matchesStatus && matchesPlatform;
  });

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(projects, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `omnipost_export_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    onNotify('success', 'Export Complete', 'Downloaded full project archive as JSON.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#381B1E] pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#FFF8F0] tracking-tight flex items-center gap-2.5">
            <History className="w-5 h-5 text-[#E0A96D]" />
            <span>Post Archive & Revision History</span>
          </h1>
          <p className="text-xs text-[#D4A373] mt-0.5">
            View, duplicate, edit, or export all generated multi-channel posts and drafts.
          </p>
        </div>

        <button
          onClick={handleExportJson}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#251214] hover:bg-[#381B1E] border border-[#381B1E] text-xs font-semibold text-[#FFF8F0] transition-colors self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5 text-[#E0A96D]" />
          <span>Export Archive (JSON)</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#A87B51] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search campaigns by keyword, topic, or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#14090A] border border-[#381B1E] text-xs text-[#FFF8F0] placeholder-[#A87B51] focus:outline-none focus:border-[#8B1E2D]"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#14090A] border border-[#381B1E] text-xs text-[#D4A373] focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="generated">Generated</option>
            <option value="draft">Draft</option>
          </select>

          {/* Platform filter */}
          <select
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#14090A] border border-[#381B1E] text-xs text-[#D4A373] focus:outline-none"
          >
            <option value="all">All Platforms</option>
            {ALL_PLATFORM_IDS.map((pId) => (
              <option key={pId} value={pId}>
                {PLATFORMS_CONFIG[pId].name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Project list with visual image thumbnails */}
      {filteredProjects.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#1C0E10]/95 border border-[#381B1E] space-y-3">
          <Layers className="w-8 h-8 text-[#A87B51] mx-auto" />
          <p className="text-sm font-semibold text-[#FFF8F0]">No campaigns found</p>
          <p className="text-xs text-[#D4A373]">Try adjusting your search query or platform filters.</p>
        </div>
      ) : (
        <div className="rounded-2xl bg-[#1C0E10]/95 border border-[#381B1E] overflow-hidden shadow-xl">
          <div className="divide-y divide-[#381B1E]">
            {filteredProjects.map((proj) => {
              const dateStr = new Date(proj.updatedAt || proj.createdAt).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              });

              const imageUrl = getRelevantImageUrl(
                proj.media?.url,
                `${proj.title} ${proj.sourceContent}`
              );

              return (
                <div
                  key={proj.id}
                  className="p-4 md:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-[#251214] transition-colors"
                >
                  {/* Left Side: Thumbnail Image + Meta */}
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    {/* Visual Media Thumbnail (Display image instead of just text) */}
                    <div
                      onClick={() => onSelectProject(proj)}
                      className="w-20 h-14 rounded-xl overflow-hidden bg-black border border-[#381B1E] shrink-0 cursor-pointer group/thumb relative shadow"
                    >
                      <img
                        src={imageUrl}
                        alt={proj.title}
                        className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover/thumb:bg-transparent transition-colors" />
                    </div>

                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2.5">
                        <h3
                          onClick={() => onSelectProject(proj)}
                          className="text-sm font-bold text-[#FFF8F0] truncate hover:text-[#E0A96D] cursor-pointer transition-colors"
                        >
                          {proj.title || 'Untitled Campaign'}
                        </h3>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 uppercase">
                          {proj.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-[#A87B51]">
                        <span>Updated: {dateStr}</span>
                        <span>·</span>
                        <span className="capitalize">{proj.tone} Tone</span>
                        <span>·</span>
                        <span className="capitalize">{proj.language}</span>
                      </div>
                    </div>
                  </div>

                  {/* Platforms & Actions */}
                  <div className="flex items-center gap-4 shrink-0 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-[#381B1E]">
                    <div className="flex items-center gap-1">
                      {proj.selectedPlatforms.map((pId) => {
                        const cfg = PLATFORMS_CONFIG[pId];
                        return (
                          <div
                            key={pId}
                            title={cfg?.name}
                            className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold text-white shadow-sm"
                            style={{ backgroundColor: cfg?.brandColor || '#8B1E2D' }}
                          >
                            {cfg?.shortName}
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onSelectProject(proj)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#8B1E2D]/25 hover:bg-[#8B1E2D] border border-[#A62639]/40 text-[#F5C2C7] hover:text-white text-xs font-semibold transition-colors"
                      >
                        <PenSquare className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => onDuplicateProject(proj.id)}
                        className="p-1.5 rounded-lg text-[#A87B51] hover:text-[#FFF8F0] hover:bg-[#381B1E] transition-colors"
                        title="Duplicate"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteProject(proj.id)}
                        className="p-1.5 rounded-lg text-[#A87B51] hover:text-rose-400 hover:bg-[#381B1E] transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
