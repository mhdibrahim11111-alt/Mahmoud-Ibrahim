import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Part, Chapter } from '../types';
import {
  Search,
  X,
  BookOpen,
  Code2,
  Lightbulb,
  ArrowLeft,
  Terminal,
  Trophy,
  Sparkles,
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

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  parts,
  onSelectChapter,
  onSelectPartSummary,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Global keydown for Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

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
            matchedSectionText = `${sec.heading}: ${sec.text?.slice(0, 100) || ''}`;
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
              snippet: chapter.challenge.prompt.slice(0, 100) + '...',
            });
          }
        }
      });

      // 3. Search Part Summary Rules
      if (part.summary?.keyPoints) {
        part.summary.keyPoints.forEach((point, idx) => {
          if (point.toLowerCase().includes(clean)) {
            list.push({
              id: `rule-${part.id}-${idx}`,
              type: 'rule',
              partId: part.id,
              partTitle: part.title,
              title: `قاعدة ذهبية: ${point.slice(0, 45)}...`,
              subtitle: `من ملخص ${part.title.split(':')[0]}`,
              snippet: point,
            });
          }
        });
      }
    });

    return list.slice(0, 15);
  }, [query, parts]);

  if (!isOpen) return null;

  const handleSelect = (item: SearchResult) => {
    if (item.type === 'rule') {
      onSelectPartSummary(item.partId);
    } else if (item.chapterId) {
      onSelectChapter(item.chapterId);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 font-['Cairo',sans-serif]">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-scaleUp">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3 bg-slate-950/80">
          <Search className="w-5 h-5 text-amber-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث عن أي مفهوم، كود، أو دالة (مثل: filter, localStorage, if, let)..."
            className="w-full bg-transparent text-white placeholder-slate-500 text-sm sm:text-base outline-none font-medium"
            dir="auto"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-lg text-slate-400 hover:text-white"
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
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2">
          {!query.trim() && (
            <div className="py-12 text-center space-y-3 text-slate-400">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center text-xl">
                🔍
              </div>
             <p className="text-sm font-semibold text-slate-300">
  ابحث في كل شروحات وأكواد وتحديات منصة زكي كود
</p>
              <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2 text-xs">
                <span className="text-slate-500">جرب البحث عن:</span>
                {['filter', 'localStorage', 'const vs let', 'addEventListener', 'switch', 'JSON.parse'].map((word) => (
                  <button
                    key={word}
                    onClick={() => setQuery(word)}
                    className="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 transition"
                  >
                    {word}
                  </button>
                ))}
              </div>
            </div>
          )}

          {query.trim() && results.length === 0 && (
            <div className="py-12 text-center space-y-2 text-slate-400">
              <p className="text-base font-bold text-slate-300">
                لم نجد أي نتائج لـ «{query}»
              </p>
              <p className="text-xs text-slate-500">
                تأكد من كتابة الكلمة بشكل صحيح، أو ابحث باسم الدالة بالإنجليزية أو المفهوم بالعربية.
              </p>
            </div>
          )}

          {results.map((item) => (
            <div
              key={item.id}
              onClick={() => handleSelect(item)}
              className="p-3.5 rounded-2xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800/80 hover:border-amber-500/40 cursor-pointer transition flex items-start justify-between gap-3 group"
            >
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  {item.type === 'chapter' && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-sky-500/10 text-sky-400 border border-sky-500/20 text-[10px] font-bold">
                      <BookOpen className="w-3 h-3" />
                      فصل
                    </span>
                  )}
                  {item.type === 'challenge' && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold">
                      <Code2 className="w-3 h-3" />
                      تحدٍّ برمجي
                    </span>
                  )}
                  {item.type === 'rule' && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[10px] font-bold">
                      <Lightbulb className="w-3 h-3" />
                      قاعدة ذهبية
                    </span>
                  )}
                  <span className="text-[11px] text-slate-400 font-medium">
                    {item.partTitle.split(':')[0]}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition">
                  {item.title}
                </h4>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed font-sans">
                  {item.snippet}
                </p>
              </div>

              <div className="shrink-0 self-center text-slate-500 group-hover:text-amber-400 transition">
                <ArrowLeft className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <span>نتائج البحث الفورية في محتوى الكتاب</span>
          <span>اضغط على النتيجة للانتقال فوراً</span>
        </div>
      </div>
    </div>
  );
};
