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
} from 'lucide-react';

interface SidebarProps {
  parts: Part[];
  selectedChapterId: number;
  onSelectChapter: (chapter: Chapter) => void;
  onSelectBugHunter: (partId: number) => void;
  completedChapterIds: number[];
  onToggleChapterCompleted: (chapterId: number) => void;
  completedQuizIds: string[];
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
}) => {
  const [searchQuery, setSearchQuery] = useState('');
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

  // Filter chapters based on search query
  const filteredParts = parts
    .map((part) => {
      const filteredChapters = part.chapters.filter(
        (ch) =>
          ch.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ch.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
      );
      return {
        ...part,
        chapters: filteredChapters,
      };
    })
    .filter((part) => part.chapters.length > 0 || !searchQuery);

  return (
    <aside className="w-full lg:w-80 bg-slate-900/60 border-l border-slate-800 flex flex-col h-[calc(100vh-4rem)] sticky top-16 select-none">
      {/* Search Input */}
      <div className="p-3.5 border-b border-slate-800">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث في فصول وموضوعات الكتاب..."
            className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl pr-9 pl-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/80 transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute left-2.5 top-2 text-xs text-slate-400 hover:text-white"
            >
              مسح
            </button>
          )}
        </div>
      </div>

      {/* Parts & Chapters List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
        {filteredParts.map((part) => {
          const isExpanded = expandedParts[part.id] ?? true;
          const completedCount = part.chapters.filter((ch) =>
            completedChapterIds.includes(ch.id)
          ).length;
          const isQuizDone = completedQuizIds.includes(part.bugHunter.id);

          return (
            <div
              key={part.id}
              className="bg-slate-950/40 rounded-xl border border-slate-800/80 overflow-hidden"
            >
              {/* Part Header */}
              <button
                onClick={() => togglePart(part.id)}
                className="w-full p-2.5 flex items-center justify-between text-right hover:bg-slate-800/40 transition gap-2"
              >
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-lg bg-slate-800/80">
                    {partIcons[part.id] || <BookOpen className="w-4 h-4 text-amber-400" />}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">
                      {part.title.split(':')[0]}
                    </span>
                    <span className="text-[11px] text-slate-400 block line-clamp-1">
                      {part.subtitle}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                    {completedCount}/{part.chapters.length}
                  </span>
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronLeft className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </button>

              {/* Part Chapters & Bug Hunter */}
              {isExpanded && (
                <div className="border-t border-slate-800/60 p-1.5 space-y-1">
                  {part.chapters.map((chapter) => {
                    const isSelected = selectedChapterId === chapter.id;
                    const isCompleted = completedChapterIds.includes(chapter.id);

                    return (
                      <div
                        key={chapter.id}
                        className={`group flex items-center justify-between rounded-lg px-2 py-1.5 transition text-xs ${
                          isSelected
                            ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 font-semibold'
                            : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                        }`}
                      >
                        <button
                          onClick={() => onSelectChapter(chapter)}
                          className="flex-1 text-right flex items-center gap-2 truncate pl-1"
                        >
                          <span className="w-4 text-slate-500 text-[10px] font-mono">
                            {chapter.id}
                          </span>
                          <span className="truncate">{chapter.title.split(':')[1] || chapter.title}</span>
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleChapterCompleted(chapter.id);
                          }}
                          title={isCompleted ? 'تمييز كغير مقروء' : 'تمييز كمقروء ومكتمل'}
                          className="text-slate-500 hover:text-emerald-400 p-0.5 transition"
                        >
                          {isCompleted ? (
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Circle className="w-3.5 h-3.5 text-slate-600 hover:text-slate-400" />
                          )}
                        </button>
                      </div>
                    );
                  })}

                  {/* Bug Hunter Shortcut */}
                  <button
                    onClick={() => onSelectBugHunter(part.id)}
                    className="w-full mt-1.5 flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-rose-950/20 border border-rose-900/30 text-rose-300 hover:bg-rose-950/40 text-xs transition"
                  >
                    <span className="flex items-center gap-1.5 text-[11px] font-medium">
                      <Bug className="w-3.5 h-3.5 text-rose-400" />
                      <span>اكتشف الخطأ! {part.title.split(':')[0]}</span>
                    </span>
                    {isQuizDone ? (
                      <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/60 px-1 rounded border border-emerald-500/30">
                        محلول ✓
                      </span>
                    ) : (
                      <span className="text-[10px] text-rose-400">تحدٍّ</span>
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
