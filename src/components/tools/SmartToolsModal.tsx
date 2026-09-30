import React, { useState } from 'react';
import {
  Sparkles,
  X,
  Copy,
  Check,
  Wand2,
  RefreshCw,
  Hash,
  Target,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { invokeSmartTool } from '../../services/api';

interface SmartToolsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertToComposer: (text: string) => void;
  onNotify: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
}

export const SmartToolsModal: React.FC<SmartToolsModalProps> = ({
  isOpen,
  onClose,
  onInsertToComposer,
  onNotify,
}) => {
  const [activeTool, setActiveTool] = useState<
    'generate-hooks' | 'generate-hashtags' | 'suggest-ctas' | 'repurpose-content'
  >('generate-hooks');
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [summaryResult, setSummaryResult] = useState('');
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleRunTool = async () => {
    if (!inputText.trim()) {
      onNotify('error', 'Text Required', 'Please enter your announcement or topic.');
      return;
    }

    try {
      setIsLoading(true);
      setResults([]);
      setSummaryResult('');

      const res = await invokeSmartTool(activeTool, inputText);

      if (Array.isArray(res.items)) {
        setResults(res.items);
      } else if (res.summary) {
        setSummaryResult(res.summary);
      } else if (res.result) {
        setResults([res.result]);
      }

      onNotify('success', 'Smart Utility Output Generated', 'Pick an option to copy or insert.');
    } catch (err: any) {
      onNotify('error', 'Execution Error', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    onNotify('success', 'Copied to Clipboard', text.slice(0, 30) + '...');
    setTimeout(() => setCopiedIdx(null), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-2xl rounded-2xl bg-[#1C0E10] border border-[#381B1E] shadow-2xl p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#381B1E] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-[#8B1E2D]/25 border border-[#8B1E2D]/40 text-[#E0A96D]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#FFF8F0]">AI Content Tool Suite</h3>
              <p className="text-xs text-[#D4A373]">Generate hooks, hashtags, and CTAs on demand</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-[#A87B51] hover:text-[#FFF8F0]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tool selector tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-[#14090A] rounded-xl border border-[#381B1E] overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTool('generate-hooks')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTool === 'generate-hooks'
                ? 'bg-[#8B1E2D] text-white shadow-sm'
                : 'text-[#D4A373] hover:text-[#FFF8F0]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#E0A96D]" />
            <span>Hook Generator</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTool('generate-hashtags')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTool === 'generate-hashtags'
                ? 'bg-[#8B1E2D] text-white shadow-sm'
                : 'text-[#D4A373] hover:text-[#FFF8F0]'
            }`}
          >
            <Hash className="w-3.5 h-3.5 text-[#E0A96D]" />
            <span>Hashtag Cluster</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTool('suggest-ctas')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTool === 'suggest-ctas'
                ? 'bg-[#8B1E2D] text-white shadow-sm'
                : 'text-[#D4A373] hover:text-[#FFF8F0]'
            }`}
          >
            <Target className="w-3.5 h-3.5 text-[#E0A96D]" />
            <span>CTA Suggestions</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTool('repurpose-content')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTool === 'repurpose-content'
                ? 'bg-[#8B1E2D] text-white shadow-sm'
                : 'text-[#D4A373] hover:text-[#FFF8F0]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-[#E0A96D]" />
            <span>Repurpose / Summarize</span>
          </button>
        </div>

        {/* Prompt Input */}
        <div className="space-y-2">
          <label className="block text-xs font-medium text-[#D4A373]">
            Source Material or Core Idea:
          </label>
          <textarea
            rows={3}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="e.g. Vacancy in Israel for CNC 5-axis operator, salary ₹3 lakh per month, aerospace manufacturing..."
            className="w-full p-3 rounded-xl bg-[#14090A] border border-[#381B1E] text-xs text-[#FFF8F0] placeholder-[#A87B51] focus:outline-none focus:border-[#8B1E2D] resize-none font-sans"
          />

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleRunTool}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#8B1E2D] to-[#A62639] hover:from-[#A62639] hover:to-[#C93B51] text-white text-xs font-semibold shadow-md shadow-[#8B1E2D]/30 transition-all disabled:opacity-50"
            >
              <Wand2 className={`w-3.5 h-3.5 text-[#E0A96D] ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Synthesizing...' : 'Generate Options'}</span>
            </button>
          </div>
        </div>

        {/* Results Display */}
        {(results.length > 0 || summaryResult) && (
          <div className="space-y-2 pt-2 border-t border-[#381B1E]">
            <p className="text-xs font-semibold text-[#FFF8F0]">AI Generated Recommendations:</p>

            {summaryResult ? (
              <div className="p-3.5 rounded-xl bg-[#14090A] border border-[#381B1E] text-xs text-[#FFF8F0] leading-relaxed whitespace-pre-wrap">
                {summaryResult}
                <div className="pt-2 flex justify-end gap-2">
                  <button
                    onClick={() => {
                      onInsertToComposer(summaryResult);
                      onClose();
                    }}
                    className="px-3 py-1 rounded-lg bg-[#8B1E2D] text-white text-xs font-semibold"
                  >
                    Insert to Composer
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {results.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-[#14090A] border border-[#381B1E] text-xs hover:border-[#8B1E2D]/50 transition-colors"
                  >
                    <span className="text-[#FFF8F0] pr-2">{item}</span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleCopy(item, idx)}
                        className="p-1.5 rounded-lg bg-[#251214] hover:bg-[#381B1E] text-[#D4A373] transition-colors border border-[#381B1E]"
                        title="Copy"
                      >
                        {copiedIdx === idx ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onInsertToComposer(item);
                          onClose();
                        }}
                        className="px-2.5 py-1 rounded-lg bg-[#8B1E2D]/30 hover:bg-[#8B1E2D]/50 border border-[#8B1E2D]/40 text-[#F5C2C7] text-[11px] font-semibold transition-colors"
                      >
                        Insert
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
