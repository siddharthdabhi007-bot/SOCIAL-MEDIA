import React, { useState } from 'react';
import {
  Palette,
  Building2,
  Globe,
  Phone,
  Mail,
  MapPin,
  Check,
  Plus,
  Trash2,
  Sparkles,
  Save,
} from 'lucide-react';
import { BrandKit } from '../../types';

interface BrandKitViewProps {
  brandKit: BrandKit;
  onSaveBrandKit: (updated: BrandKit) => void;
  onNotify: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
}

export const BrandKitView: React.FC<BrandKitViewProps> = ({
  brandKit,
  onSaveBrandKit,
  onNotify,
}) => {
  const [formData, setFormData] = useState<BrandKit>({ ...brandKit });
  const [newHashtag, setNewHashtag] = useState('');

  const handleChange = (field: keyof BrandKit, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddHashtag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHashtag.trim()) return;
    const formatted = newHashtag.startsWith('#') ? newHashtag.trim() : `#${newHashtag.trim()}`;
    if (!formData.preferredHashtags.includes(formatted)) {
      handleChange('preferredHashtags', [...formData.preferredHashtags, formatted]);
    }
    setNewHashtag('');
  };

  const handleRemoveHashtag = (tag: string) => {
    handleChange(
      'preferredHashtags',
      formData.preferredHashtags.filter((t) => t !== tag)
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveBrandKit(formData);
    onNotify('success', 'Brand Kit Saved!', 'AI will now automatically inject this brand context into all future post generations.');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#381B1E] pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#FFF8F0] tracking-tight flex items-center gap-2.5">
            <Palette className="w-5 h-5 text-[#E0A96D]" />
            <span>Brand Kit & Style Identity</span>
          </h1>
          <p className="text-xs text-[#D4A373] mt-0.5">
            Save your corporate identity, tone voice, and default CTAs. AI references these in every generation.
          </p>
        </div>

        <button
          type="submit"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#8B1E2D] to-[#A62639] hover:from-[#A62639] hover:to-[#C93B51] text-white text-xs font-bold shadow-lg shadow-[#8B1E2D]/35 transition-all active:scale-95 whitespace-nowrap"
        >
          <Save className="w-4 h-4" />
          <span>Save Brand Kit</span>
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Core Identity */}
        <div className="rounded-2xl bg-[#1C0E10]/95 border border-[#381B1E] p-5 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-[#FFF8F0] flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#E0A96D]" />
            <span>Company Profile</span>
          </h3>

          <div>
            <label className="block text-xs font-semibold text-[#D4A373] mb-1">Company / Brand Name</label>
            <input
              type="text"
              value={formData.companyName}
              onChange={(e) => handleChange('companyName', e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#14090A] border border-[#381B1E] text-xs text-[#FFF8F0] focus:outline-none focus:border-[#8B1E2D]"
              placeholder="e.g. Apex Precision Engineering"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#D4A373] mb-1">Tagline or Mission</label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => handleChange('tagline', e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#14090A] border border-[#381B1E] text-xs text-[#FFF8F0] focus:outline-none focus:border-[#8B1E2D]"
              placeholder="e.g. High-Precision Machining for Aerospace & Medical Devices"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#D4A373] mb-1">Company Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="w-full p-3 rounded-xl bg-[#14090A] border border-[#381B1E] text-xs text-[#FFF8F0] focus:outline-none focus:border-[#8B1E2D] resize-none"
              placeholder="Describe your core products, services, certifications, and market presence..."
            />
          </div>
        </div>

        {/* Voice & AI Guidelines */}
        <div className="rounded-2xl bg-[#1C0E10]/95 border border-[#381B1E] p-5 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-[#FFF8F0] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#E0A96D]" />
            <span>Voice & Copywriting Directives</span>
          </h3>

          <div>
            <label className="block text-xs font-semibold text-[#D4A373] mb-1">Brand Voice & Editorial Style</label>
            <textarea
              rows={3}
              value={formData.brandVoice}
              onChange={(e) => handleChange('brandVoice', e.target.value)}
              className="w-full p-3 rounded-xl bg-[#14090A] border border-[#381B1E] text-xs text-[#FFF8F0] focus:outline-none focus:border-[#8B1E2D] resize-none"
              placeholder="e.g. Professional, authoritative, engineering-focused, with high attention to precision and safety..."
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#D4A373] mb-1">Default Call to Action (CTA)</label>
            <input
              type="text"
              value={formData.defaultCta}
              onChange={(e) => handleChange('defaultCta', e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#14090A] border border-[#381B1E] text-xs text-[#FFF8F0] focus:outline-none focus:border-[#8B1E2D]"
              placeholder="e.g. Apply today via WhatsApp or email careers@apexprecision.com"
            />
          </div>

          {/* Preferred Hashtags */}
          <div>
            <label className="block text-xs font-semibold text-[#D4A373] mb-1.5">
              Default Preferred Hashtags
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {formData.preferredHashtags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#251214] border border-[#381B1E] text-xs text-[#E0A96D]"
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveHashtag(tag)}
                    className="text-[#A87B51] hover:text-rose-400"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="#YourTag"
                value={newHashtag}
                onChange={(e) => setNewHashtag(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-xl bg-[#14090A] border border-[#381B1E] text-xs text-[#FFF8F0] placeholder-[#A87B51] focus:outline-none focus:border-[#8B1E2D]"
              />
              <button
                type="button"
                onClick={handleAddHashtag}
                className="px-3 py-1.5 rounded-xl bg-[#251214] hover:bg-[#381B1E] text-xs font-medium text-[#FFF8F0] border border-[#381B1E]"
              >
                Add Tag
              </button>
            </div>
          </div>
        </div>

        {/* Contact & Verification Information */}
        <div className="md:col-span-2 rounded-2xl bg-[#1C0E10]/95 border border-[#381B1E] p-5 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-[#FFF8F0] flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#E0A96D]" />
            <span>Digital Footprint & Official Contacts</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
            <div>
              <label className="block text-xs text-[#D4A373] mb-1 flex items-center gap-1.5">
                <Globe className="w-3 h-3 text-[#A87B51]" /> Website
              </label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => handleChange('website', e.target.value)}
                placeholder="https://apexprecision.com"
                className="w-full px-3 py-1.5 rounded-lg bg-[#14090A] border border-[#381B1E] text-xs text-[#FFF8F0] focus:outline-none focus:border-[#8B1E2D]"
              />
            </div>

            <div>
              <label className="block text-xs text-[#D4A373] mb-1 flex items-center gap-1.5">
                <Phone className="w-3 h-3 text-[#A87B51]" /> Phone / WhatsApp
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-3 py-1.5 rounded-lg bg-[#14090A] border border-[#381B1E] text-xs text-[#FFF8F0] focus:outline-none focus:border-[#8B1E2D]"
              />
            </div>

            <div>
              <label className="block text-xs text-[#D4A373] mb-1 flex items-center gap-1.5">
                <Mail className="w-3 h-3 text-[#A87B51]" /> Inquiries Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="careers@apexprecision.com"
                className="w-full px-3 py-1.5 rounded-lg bg-[#14090A] border border-[#381B1E] text-xs text-[#FFF8F0] focus:outline-none focus:border-[#8B1E2D]"
              />
            </div>

            <div>
              <label className="block text-xs text-[#D4A373] mb-1 flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-[#A87B51]" /> Headquarters
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                placeholder="Ahmedabad, Gujarat"
                className="w-full px-3 py-1.5 rounded-lg bg-[#14090A] border border-[#381B1E] text-xs text-[#FFF8F0] focus:outline-none focus:border-[#8B1E2D]"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};
