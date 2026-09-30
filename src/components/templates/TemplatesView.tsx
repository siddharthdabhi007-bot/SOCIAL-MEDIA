import React, { useState } from 'react';
import { BookmarkCheck, Search, ArrowRight, Sparkles, Plus } from 'lucide-react';
import { POST_TEMPLATES } from '../../services/templates';
import { PLATFORMS_CONFIG } from '../../config/platforms';
import { PostTemplate } from '../../types';

interface TemplatesViewProps {
  onSelectTemplate: (template: PostTemplate) => void;
  onNavigate: (tab: string) => void;
}

export const TemplatesView: React.FC<TemplatesViewProps> = ({
  onSelectTemplate,
  onNavigate,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    'All',
    'Recruitment & Jobs',
    'Local Business',
    'Product & Tech',
    'Company Milestone',
    'Events & Education',
    'Brand & Culture',
    'Sales & E-Commerce',
  ];

  const filteredTemplates = POST_TEMPLATES.filter((t) => {
    const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory;
    const matchesSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.sampleContent.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#381B1E] pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#FFF8F0] tracking-tight flex items-center gap-2.5">
            <BookmarkCheck className="w-5 h-5 text-[#E0A96D]" />
            <span>Content Templates & Blueprints</span>
          </h1>
          <p className="text-xs text-[#D4A373] mt-0.5">
            Battle-tested post templates with pre-configured fields for high-conversion outcomes
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-[#A87B51] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search templates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#14090A] border border-[#381B1E] text-xs text-[#FFF8F0] placeholder-[#A87B51] focus:outline-none focus:border-[#8B1E2D]"
          />
        </div>
      </div>

      {/* Categories Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? 'bg-[#8B1E2D] text-white border border-[#A62639]/50 shadow-sm'
                : 'bg-[#1C0E10] text-[#D4A373] border border-[#381B1E] hover:text-[#FFF8F0] hover:bg-[#251214]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            className="rounded-2xl bg-[#1C0E10]/95 border border-[#381B1E] hover:border-[#8B1E2D]/60 p-5 flex flex-col justify-between space-y-4 transition-all group shadow-md"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold text-[#E0A96D] uppercase tracking-wider">
                  {template.category}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#251214] text-[#D4A373] capitalize border border-[#381B1E]">
                  {template.suggestedTone} tone
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-[#FFF8F0] group-hover:text-[#E0A96D] transition-colors">
                  {template.title}
                </h3>
                <p className="text-xs text-[#D4A373] mt-1 leading-relaxed">
                  {template.description}
                </p>
              </div>

              {/* Sample preview box */}
              <div className="p-3 rounded-xl bg-[#14090A] border border-[#381B1E] text-xs text-[#FFF8F0] line-clamp-3 leading-relaxed font-sans">
                "{template.sampleContent}"
              </div>

              {/* Recommended Platforms */}
              <div className="flex items-center gap-1.5 pt-1">
                <span className="text-[11px] text-[#A87B51] mr-1">Recommended:</span>
                {template.recommendedPlatforms.map((pId) => {
                  const pConfig = PLATFORMS_CONFIG[pId];
                  return (
                    <div
                      key={pId}
                      title={pConfig?.name}
                      className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold text-white shadow-sm"
                      style={{ backgroundColor: pConfig?.brandColor }}
                    >
                      {pConfig?.shortName}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-3 border-t border-[#381B1E] flex items-center justify-between">
              <button
                onClick={() => onSelectTemplate(template)}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl bg-[#8B1E2D]/25 hover:bg-[#8B1E2D] border border-[#A62639]/40 text-[#F5C2C7] hover:text-white text-xs font-semibold transition-all group-hover:border-[#8B1E2D]"
              >
                <span>Use This Template</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
