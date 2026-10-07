import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Part } from '../types';
import { StandardEmptyState } from './ui/StateFeedback';
import { useFocusTrap } from '../hooks/useFocusTrap';
import {
  Search,
  X,
  BookOpen,
  Code2,
  Lightbulb,
  ArrowLeft,
  Clock,
  Trash2,
  CornerDownLeft,
  Layers,
  Sparkles,
  Trophy,
} from 'lucide-react';

interface SearchResult {
  id: string;
  type: 'chapter' | 'rule' | 'challenge';
  partId: number;
  partTitle: string;
  chapterId?: number;
  title: string;
  subtitle?: string;
  snippet: string;
}

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  parts: Part[];
  onSelectChapter: (chapterId: number) => void;
  onSelectPartSummary: (partId: number) => void;
}

const RECENT_SEARCHES_KEY = 'codemasr_recent_searches';
const SUGGESTED_QUERIES = [
  'let vs const',
  'filter',
  'localStorage',
  'addEventListener',
  'switch',
  'JSON.parse',
  'مصفوفات',
  'دوال',
];

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  parts,
  onSelectChapter,
  onSelectPartSummary,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);

  const modalContainerRef = useFocusTrap<HTMLDivElement>({
    isOpen,
    onClose,
    initialFocusRef: inputRef,
    returnFocus: true,
  });

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Save to recent searches
  const saveRecentSearch = (text: string) => {
    const clean = text.trim();
    if (!clean || clean.length < 2) return;
    setRecentSearches((prev) => {
      const updated = [clean, ...prev.filter((item) => item.toLowerCase() !== clean.toLowerCase())].slice(0, 6);
      try {
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // Clear single or all recent searches
  const handleClearRecentSearch = (itemToRemove?: string) => {
    if (!itemToRemove) {
      setRecentSearches([]);
      try {
        localStorage.removeItem(RECENT_SEARCHES_KEY);
      } catch {}
    } else {
      setRecentSearches((prev) => {
        const updated = prev.filter((item) => item !== itemToRemove);
        try {
          localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
        } catch {}
        return updated;
      });
    }
  };

  // Build searchable index from all parts, chapters, rules, and challenges
  const results: SearchResult[] = useMemo(() => {
    const clean = query.trim().toLowerCase();
    if (!clean) return [];

    const list: SearchResult[] = [];

    parts.forEach((part) => {
      // 1. Search Chapters
      part.chapters.forEach((chapter) => {
        const titleMatch = chapter.title.toLowerCase().includes(clean);
        const subMatch = chapter.subtitle?.toLowerCase().includes(clean);
        const summaryMatch = chapter.summaryPoints?.some((sp) => sp.toLowerCase().includes(clean));

        // Content sections match
        let matchedSectionText = '';
        chapter.contentSections?.forEach((sec) => {
          if (
            sec.heading?.toLowerCase().includes(clean) ||
            sec.text?.toLowerCase().includes(clean) ||
            sec.codeSnippet?.toLowerCase().includes(clean)
          ) {
            matchedSectionText = `${sec.heading}: ${sec.text?.slice(0, 130) || ''}`;
          }
        });

        if (titleMatch || subMatch || summaryMatch || matchedSectionText) {
          list.push({
            id: `ch-${chapter.id}`,
            type: 'chapter',
            partId: part.id,
            partTitle: part.title,
            chapterId: chapter.id,
            title: chapter.title,
            subtitle: chapter.subtitle,
            snippet:
              matchedSectionText ||
              (chapter.summaryPoints?.[0] ? chapter.summaryPoints[0] : chapter.subtitle),
          });
        }

        // 2. Search Chapter Challenge
        if (chapter.challenge) {
          const chTitleMatch = chapter.challenge.title.toLowerCase().includes(clean);
          const chPromptMatch = chapter.challenge.prompt.toLowerCase().includes(clean);
          const chCodeMatch = chapter.challenge.initialCode?.toLowerCase().includes(clean);

          if (chTitleMatch || chPromptMatch || chCodeMatch) {
            list.push({
              id: `chal-${chapter.id}`,
              type: 'challenge',
              partId: part.id,
              partTitle: part.title,
              chapterId: chapter.id,
              title: `تحدي: ${chapter.challenge.title}`,
              subtitle: `من ${chapter.title}`,
              snippet: chapter.challenge.prompt.slice(0, 120) + '...',
            });
          }
        }
      });

      // 3. Search Part Summary Rules
      const examOrSummary = part.summary || part.comprehensiveExam;
      if (examOrSummary?.keyPoints) {
        examOrSummary.keyPoints.forEach((point, idx) => {
          if (point.toLowerCase().includes(clean)) {
            list.push({
              id: `rule-${part.id}-${idx}`,
              type: 'rule',
              partId: part.id,
              partTitle: part.title,
              title: `قاعدة ذهبية: ${point.slice(0, 50)}...`,
              subtitle: `من ملخص ${part.title.split(':')[0]}`,
              snippet: point,
            });
          }
        });
      }
    });

    return list.slice(0, 20);
  }, [query, parts]);

  // Grouped results
  const groupedResults = useMemo(() => {
    const chapters = results.filter((r) => r.type === 'chapter');
    const rules = results.filter((r) => r.type === 'rule');
    const challenges = results.filter((r) => r.type === 'challenge');
    return { chapters, rules, challenges };
  }, [results]);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [results]);

  // Handle select action
  const handleSelect = (item: SearchResult) => {
    saveRecentSearch(query.trim() || item.title);
    if (item.type === 'rule') {
      onSelectPartSummary(item.partId);
    } else if (item.chapterId) {
      onSelectChapter(item.chapterId);
    }
    onClose();
  };

  // Keyboard navigation listener (Arrow Up, Arrow Down, Enter, Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (results.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % results.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const selected = results[selectedIndex];
        if (selected) {
          handleSelect(selected);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, query, onClose]);

  // Scroll active item into view
  useEffect(() => {
    if (resultsContainerRef.current) {
      const activeEl = resultsContainerRef.current.querySelector<HTMLElement>(`[data-search-index="${selectedIndex}"]`);
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="البحث الشامل في محتوى الكورس"
      className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-20 px-3 sm:px-4 font-['Cairo',sans-serif]"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal Dialog Box */}
      <div
        ref={modalContainerRef}
        className="relative z-10 w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-scaleUp"
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3 bg-slate-950/90">
          <Search className="w-5 h-5 text-amber-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث عن أي مفهوم، كود، أو دالة (مثل: let, filter, switch, localStorage)..."
            className="w-full bg-transparent text-white placeholder-slate-500 text-sm sm:text-base outline-none font-medium text-right dir-rtl"
            dir="auto"
          />
          {query ? (
            <button
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              className="p-1 rounded-lg text-slate-400 hover:text-white transition"
              aria-label="مسح نص البحث"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-800 rounded border border-slate-700">
              ESC
            </kbd>
          )}
        </div>

        {/* Results Body */}
        <div ref={resultsContainerRef} className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4 custom-scrollbar">
          {/* Default State: Recent Searches & Suggestions */}
          {!query.trim() && (
            <div className="py-6 space-y-6">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs text-slate-400 px-1 font-bold">
                    <span className="flex items-center gap-1.5 text-slate-300">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>عمليات البحث الأخيرة:</span>
                    </span>
                    <button
                      onClick={() => handleClearRecentSearch()}
                      className="text-slate-500 hover:text-rose-400 transition text-[11px] flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>مسح السجل</span>
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((item, idx) => (
                      <div
                        key={idx}
                        className="group flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/40 text-slate-200 hover:text-white text-xs transition"
                      >
                        <button
                          onClick={() => setQuery(item)}
                          className="flex items-center gap-1 font-medium"
                        >
                          <Search className="w-3 h-3 text-slate-500 group-hover:text-amber-400" />
                          <span>{item}</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleClearRecentSearch(item);
                          }}
                          className="text-slate-600 hover:text-rose-400 ml-1 p-0.5"
                          aria-label={`حذف ${item} من السجل`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggestions */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 px-1 font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>موضوعات ومفاهيم شائعة في الكورس:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTED_QUERIES.map((term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="px-3 py-1.5 rounded-xl bg-slate-950/80 hover:bg-slate-800 text-amber-300 hover:text-amber-200 border border-slate-800 hover:border-amber-500/30 text-xs font-semibold transition active:scale-95"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* No Results State */}
          {query.trim() && results.length === 0 && (
            <StandardEmptyState
              type="search"
              searchQuery={query}
              actionText="مسح البحث وتصفح الاقتراحات"
              onAction={() => setQuery('')}
            />
          )}

          {/* Group 1: Chapters */}
          {groupedResults.chapters.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-sky-400 px-1 pt-1">
                <BookOpen className="w-3.5 h-3.5" />
                <span>فصول وشروحات الكتاب ({groupedResults.chapters.length})</span>
              </div>

              <div className="space-y-1.5">
                {groupedResults.chapters.map((item) => {
                  const globalIdx = results.findIndex((r) => r.id === item.id);
                  const isHighlighted = globalIdx === selectedIndex;
                  return (
                    <SearchResultItem
                      key={item.id}
                      item={item}
                      query={query}
                      index={globalIdx}
                      isSelected={isHighlighted}
                      onSelect={() => handleSelect(item)}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* Group 2: Golden Rules & Summaries */}
          {groupedResults.rules.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-purple-400 px-1 pt-1">
                <Lightbulb className="w-3.5 h-3.5" />
                <span>القواعد والملخصات الذهبية ({groupedResults.rules.length})</span>
              </div>

              <div className="space-y-1.5">
                {groupedResults.rules.map((item) => {
                  const globalIdx = results.findIndex((r) => r.id === item.id);
                  const isHighlighted = globalIdx === selectedIndex;
                  return (
                    <SearchResultItem
                      key={item.id}
                      item={item}
                      query={query}
                      index={globalIdx}
                      isSelected={isHighlighted}
                      onSelect={() => handleSelect(item)}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* Group 3: Challenges */}
          {groupedResults.challenges.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 px-1 pt-1">
                <Trophy className="w-3.5 h-3.5" />
                <span>التحديات البرمجية ({groupedResults.challenges.length})</span>
              </div>

              <div className="space-y-1.5">
                {groupedResults.challenges.map((item) => {
                  const globalIdx = results.findIndex((r) => r.id === item.id);
                  const isHighlighted = globalIdx === selectedIndex;
                  return (
                    <SearchResultItem
                      key={item.id}
                      item={item}
                      query={query}
                      index={globalIdx}
                      isSelected={isHighlighted}
                      onSelect={() => handleSelect(item)}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer info & keyboard hints */}
        <div className="px-4 py-3 bg-slate-950 border-t border-slate-800 text-xs text-slate-400 flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-medium">
          <div className="flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[10px]">↑</kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[10px]">↓</kbd>
              <span>للتنقل</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[10px]">↵</kbd>
              <span>للفتح</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[10px]">ESC</kbd>
              <span>للإغلاق</span>
            </span>
          </div>

          <div className="text-[11px] text-slate-400">
            {results.length > 0 ? (
              <span>تم العثور على <strong className="text-amber-400 font-mono">{results.length}</strong> نتيجة</span>
            ) : (
              <span>البحث الفوري في كامل فصول وملخصات الكتاب</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface SearchResultItemProps {
  item: SearchResult;
  query: string;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
}

const SearchResultItem: React.FC<SearchResultItemProps> = ({
  item,
  query,
  index,
  isSelected,
  onSelect,
}) => {
  return (
    <div
      data-search-index={index}
      onClick={onSelect}
      className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-start justify-between gap-3 text-right ${
        isSelected
          ? 'bg-slate-800/95 border-amber-500/50 shadow-md shadow-amber-500/10 ring-1 ring-amber-500/30'
          : 'bg-slate-950/60 hover:bg-slate-800/70 border-slate-800/80'
      }`}
    >
      <div className="space-y-1.5 flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] text-slate-400 font-bold">
            {item.partTitle.split(':')[0]}
          </span>
          {item.subtitle && (
            <>
              <span className="text-slate-600 text-xs">•</span>
              <span className="text-[11px] text-slate-400 truncate max-w-[200px] font-sans">
                {item.subtitle}
              </span>
            </>
          )}
        </div>

        <h4 className="text-sm font-bold text-white transition leading-snug">
          {highlightText(item.title, query)}
        </h4>

        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed font-sans select-none">
          {highlightText(item.snippet, query)}
        </p>
      </div>

      <div className="shrink-0 self-center flex items-center gap-2">
        {isSelected && (
          <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-amber-300 font-bold bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">
            <CornerDownLeft className="w-3 h-3" />
            فتح
          </span>
        )}
        <div className={`p-1 rounded-lg transition ${isSelected ? 'text-amber-400' : 'text-slate-600'}`}>
          <ArrowLeft className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};

/**
 * Safely highlights occurrences of the search query inside text
 */
function highlightText(text: string, query: string): React.ReactNode {
  if (!query.trim() || !text) return text;

  const parts = text.split(new RegExp(`(${escapeRegExp(query.trim())})`, 'gi'));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.trim().toLowerCase() ? (
          <mark
            key={i}
            className="bg-amber-500/30 text-amber-200 font-bold px-0.5 rounded border-b border-amber-400 not-italic"
          >
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
