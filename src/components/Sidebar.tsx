import React, { useState } from 'react';
import { Part, Chapter } from '../types';
import {
  ChevronDown,
  ChevronLeft,
  CheckCircle,
  Circle,
  Bug,
  Search,
  BookOpen,
  Boxes,
  GitFork,
  Repeat,
  Cpu,
  Layers,
  Globe,
  Trophy,
  Star,
  FileText,
} from 'lucide-react';

interface SidebarProps {
  parts: Part[];
  selectedChapterId: number;
  onSelectChapter: (chapter: Chapter) => void;
  onSelectBugHunter: (partId: number) => void;
  completedChapterIds: number[];
  onToggleChapterCompleted: (chapterId: number) => void;
  completedQuizIds: string[];
  onSelectPartExam?: (partId: number) => void;
  selectedPartExamId?: number | null;
  completedExamIds?: number[];
  bookmarkedChapterIds?: number[];
  notesMap?: Record<string, string>;
}

const partIcons: Record<number, React.ReactNode> = {
  1: <Boxes className="w-4 h-4 text-amber-400" />,
  2: <GitFork className="w-4 h-4 text-sky-400" />,
  3: <Repeat className="w-4 h-4 text-emerald-400" />,
  4: <Cpu className="w-4 h-4 text-purple-400" />,
  5: <Layers className="w-4 h-4 text-rose-400" />,
  6: <Globe className="w-4 h-4 text-cyan-400" />,
};

export const Sidebar: React.FC<SidebarProps> = ({
  parts,
  selectedChapterId,
  onSelectChapter,
  onSelectBugHunter,
  completedChapterIds,
  onToggleChapterCompleted,
  completedQuizIds,
  onSelectPartExam,
  selectedPartExamId,
  completedExamIds,
  bookmarkedChapterIds = [],
  notesMap = {},
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyBookmarked, setOnlyBookmarked] = useState(false);
  const [expandedParts, setExpandedParts] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: true,
    4: true,
    5: true,
    6: true,
  });

  const togglePart = (partId: number) => {
    setExpandedParts((prev) => ({
      ...prev,
      [partId]: !prev[partId],
    }));
  };

  // Filter chapters based on search query & bookmark filter
  const filteredParts = parts
    .map((part) => {
      const filteredChapters = part.chapters.filter((ch) => {
        const matchesQuery =
          !searchQuery ||
          ch.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ch.subtitle.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesBookmark = !onlyBookmarked || bookmarkedChapterIds.includes(ch.id);

        return matchesQuery && matchesBookmark;
      });

      return {
        ...part,
        chapters: filteredChapters,
      };
    })
    .filter((part) => part.chapters.length > 0 || (!searchQuery && !onlyBookmarked));

  return (
    <aside className="w-full lg:w-80 bg-slate-900/60 border-l border-slate-800 flex flex-col h-[calc(100vh-4rem)] sticky top-16 select-none">
      {/* Search Input & Filter Tabs */}
      <div className="p-3 border-b border-slate-800 space-y-2">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث في فصول وموضوعات الكتاب..."
            className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl pr-9 pl-10 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/80 transition min-h-[42px]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              aria-label="مسح البحث"
              className="absolute left-1 top-1/2 -translate-y-1/2 min-h-[38px] min-w-[38px] flex items-center justify-center text-xs text-slate-400 hover:text-white rounded-lg active:bg-slate-800 transition touch-manipulation"
            >
              مسح
            </button>
          )}
        </div>

        {/* Bookmarks & All Toggle Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950/80 rounded-xl border border-slate-800/80 text-xs font-bold">
          <button
            type="button"
            onClick={() => setOnlyBookmarked(false)}
            className={`flex-1 min-h-[44px] sm:min-h-[38px] py-2 rounded-lg transition flex items-center justify-center touch-manipulation ${
              !onlyBookmarked
                ? 'bg-amber-500 text-slate-950 shadow-sm font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            كل الفصول (25)
          </button>
          <button
            type="button"
            onClick={() => setOnlyBookmarked(true)}
            className={`flex-1 min-h-[44px] sm:min-h-[38px] py-2 rounded-lg transition flex items-center justify-center gap-1.5 touch-manipulation ${
              onlyBookmarked
                ? 'bg-amber-500 text-slate-950 shadow-sm font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>المفضلة ({bookmarkedChapterIds.length})</span>
          </button>
        </div>
      </div>

      {/* Parts & Chapters List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {filteredParts.length === 0 && (
          <div className="text-center py-10 space-y-2 text-slate-500 text-xs">
            <p>لا توجد فصول مطابقة</p>
            {onlyBookmarked && (
              <p className="text-[11px] text-amber-400/80">
                يمكنك الضغط على علامة النجمة داخل أي فصل لإضافته للمفضلة ⭐️
              </p>
            )}
          </div>
        )}

        {filteredParts.map((part) => {
          const isExpanded = expandedParts[part.id] ?? true;
          const isQuizDone = completedQuizIds.includes(part.bugHunter.id);
          const completedCount = part.chapters.filter((ch) =>
            completedChapterIds.includes(ch.id)
          ).length;

          return (
            <div
              key={part.id}
              className="rounded-xl border border-slate-800 bg-slate-950/40 overflow-hidden"
            >
              {/* Part Header Accordion */}
              <button
                type="button"
                onClick={() => togglePart(part.id)}
                className="w-full min-h-[50px] flex items-center justify-between p-3 text-right bg-slate-900/40 hover:bg-slate-800/40 active:bg-slate-800/60 transition touch-manipulation"
              >
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                  <div className="p-1.5 rounded-lg bg-slate-800 shrink-0">
                    {partIcons[part.id] || <Boxes className="w-4 h-4 text-amber-400" />}
                  </div>
                  <div className="truncate">
                    <h3 className="text-xs sm:text-sm font-bold text-white truncate">{part.title}</h3>
                    <p className="text-[11px] text-slate-400 truncate font-sans">
                      {completedCount} من {part.chapters.length} منجز
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-slate-400 shrink-0">
                  {completedCount === part.chapters.length && part.chapters.length > 0 && (
                    <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-1.5 py-0.5 rounded font-bold">
                      تم ✓
                    </span>
                  )}
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronLeft className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </button>

              {/* Chapters List */}
              {isExpanded && (
                <div className="p-1.5 space-y-1 bg-slate-950/20">
                  {part.chapters.map((chapter) => {
                    const isSelected = selectedChapterId === chapter.id && !selectedPartExamId;
                    const isCompleted = completedChapterIds.includes(chapter.id);
                    const isBookmarked = bookmarkedChapterIds.includes(chapter.id);
                    const hasNote = Boolean(notesMap[chapter.id.toString()]?.trim());

                    return (
                      <div
                        key={chapter.id}
                        className={`group flex items-center justify-between rounded-xl px-2 py-1 min-h-[46px] transition text-xs ${
                          isSelected
                            ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 font-semibold'
                            : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => onSelectChapter(chapter)}
                          className="flex-1 min-h-[44px] text-right flex items-center gap-2 truncate pl-2 py-1 touch-manipulation active:scale-[0.99] transition"
                        >
                          <span className="w-5 text-slate-500 text-xs font-mono shrink-0">
                            {chapter.id}
                          </span>
                          <span className="truncate text-xs sm:text-[13px]">{chapter.title.split(':')[1] || chapter.title}</span>
                          {isBookmarked && (
                            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
                          )}
                          {hasNote && (
                            <span title="يحتوي على ملاحظاتك">
                              <FileText className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                            </span>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleChapterCompleted(chapter.id);
                          }}
                          aria-label={isCompleted ? 'تمييز كغير مقروء' : 'تمييز كمقروء ومكتمل'}
                          title={isCompleted ? 'تمييز كغير مقروء' : 'تمييز كمقروء ومكتمل'}
                          className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-slate-500 hover:text-emerald-400 active:bg-slate-800 active:scale-90 transition touch-manipulation shrink-0"
                        >
                          {isCompleted ? (
                            <CheckCircle className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-600 hover:text-slate-400" />
                          )}
                        </button>
                      </div>
                    );
                  })}

                  {/* Part Summary & Capstone Shortcut */}
                  {(part.summary || part.comprehensiveExam) && onSelectPartExam && (
                    <button
                      type="button"
                      onClick={() => onSelectPartExam(part.id)}
                      className={`w-full mt-2 min-h-[46px] flex items-center justify-between px-3 py-2.5 rounded-xl border text-xs transition font-semibold touch-manipulation active:scale-[0.99] ${
                        selectedPartExamId === part.id
                          ? 'bg-amber-500/20 border-amber-500/60 text-amber-300 shadow-sm'
                          : 'bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-transparent border-amber-500/25 text-amber-300 hover:from-amber-500/20 hover:via-indigo-500/20'
                      }`}
                    >
                      <span className="flex items-center gap-2 text-xs">
                        <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>ملخص وتحدي {part.title.split(':')[0]} الشامل</span>
                      </span>
                      {completedExamIds?.includes(part.id) ? (
                        <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/30">
                          مكتمل 🏆
                        </span>
                      ) : (
                        <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-bold">
                          ملخص 📋
                        </span>
                      )}
                    </button>
                  )}

                  {/* Bug Hunter Shortcut */}
                  <button
                    type="button"
                    onClick={() => onSelectBugHunter(part.id)}
                    className="w-full mt-1.5 min-h-[46px] flex items-center justify-between px-3 py-2.5 rounded-xl bg-rose-950/20 border border-rose-900/30 text-rose-300 hover:bg-rose-950/40 text-xs transition touch-manipulation active:scale-[0.99]"
                  >
                    <span className="flex items-center gap-2 text-xs font-medium">
                      <Bug className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>اكتشف الخطأ! {part.title.split(':')[0]}</span>
                    </span>
                    {isQuizDone ? (
                      <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/30">
                        محلول ✓
                      </span>
                    ) : (
                      <span className="text-[10px] text-rose-400 bg-rose-900/40 px-2 py-0.5 rounded-full">تحدٍّ</span>
                    )}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
};
