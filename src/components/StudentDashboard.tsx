import React from 'react';
import type { Part, Chapter, ViewMode } from '../types';
import {
  BookOpen,
  Terminal,
  Trophy,
  Bug,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Code2,
  Bookmark,
  FileText,
  ShieldCheck,
  Compass,
} from 'lucide-react';
import { soundManager } from '../utils/soundManager';

interface StudentDashboardProps {
  role?: 'master' | 'admin' | 'teacher' | 'student';
  studentName?: string;
  parts: Part[];
  completedChapterIds: number[];
  completedQuizIds: string[];
  completedChallengeIds?: string[];
  completedExamPartIds: number[];
  unlockedBadgesCount?: number;
  bookmarkedCount?: number;
  notesCount?: number;
  currentChapterId: number;
  onSelectChapter: (chapterId: number) => void;
  onSelectView: (view: ViewMode) => void;
  onOpenAchievements?: () => void;
  onOpenOnboarding?: () => void;
}

export const StudentDashboard = React.memo<StudentDashboardProps>(({
  role = 'student',
  studentName,
  parts,
  completedChapterIds,
  completedQuizIds,
  completedChallengeIds = [],
  completedExamPartIds,
  unlockedBadgesCount = 0,
  bookmarkedCount = 0,
  notesCount = 0,
  currentChapterId,
  onSelectChapter,
  onSelectView,
  onOpenAchievements,
  onOpenOnboarding,
}) => {
  // Collect all chapters across all parts
  const allChapters: Chapter[] = React.useMemo(() => {
    return parts.flatMap((p) => p.chapters || []);
  }, [parts]);

  const totalChapters = allChapters.length || 25;
  const completedChaptersCount = completedChapterIds.length;
  const totalItems = totalChapters + (parts.length || 6); // chapters + part exams
  const completedTotal = completedChaptersCount + completedExamPartIds.length;
  const progressPercent =
    totalItems > 0 ? Math.min(100, Math.round((completedTotal / totalItems) * 100)) : 0;

  // Determine current or next chapter to resume
  const currentChapter = React.useMemo(() => {
    const found = allChapters.find((c) => c.id === currentChapterId);
    if (found) return found;

    const firstUncompleted = allChapters.find((c) => !completedChapterIds.includes(c.id));
    if (firstUncompleted) return firstUncompleted;

    return allChapters[0] || null;
  }, [allChapters, currentChapterId, completedChapterIds]);

  const currentPart = React.useMemo(() => {
    if (!currentChapter) return parts[0] || null;
    return parts.find((p) => p.id === currentChapter.partId) || null;
  }, [parts, currentChapter]);

  const greetingName = studentName && studentName.trim() ? studentName.trim() : 'يا بطل';
  const isCurrentCompleted = currentChapter ? completedChapterIds.includes(currentChapter.id) : false;

  const isStaff = role === 'admin' || role === 'master' || role === 'teacher';

  return (
    <div
      dir="rtl"
      className="w-full max-w-2xl sm:max-w-3xl lg:max-w-4xl mx-auto px-3.5 sm:px-6 py-5 sm:py-8 space-y-6 font-['Cairo',sans-serif] text-slate-100 pb-28 sm:pb-32"
    >
      {/* Staff Preview Notice Banner */}
      {isStaff && (
        <div className="bg-gradient-to-r from-amber-500/15 via-slate-900 to-slate-900 border border-amber-500/30 rounded-3xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-200 shadow-lg shadow-amber-500/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-sm text-white block">وضع استعراض شاشة الطالب (معاينة)</span>
              <span className="text-xs text-amber-300/80">
                أنت الآن تتصفح المنصة كما يراها الطالب. لوحتك الرئيسية هي لوحة الإدارة.
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onSelectView('admin')}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition active:scale-95 shrink-0 shadow-md shadow-amber-500/20"
          >
            <span>العودة للإدارة</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 1. Hero Card: Continue Learning with Progress Bar & Prominent Orange Action */}
      {currentChapter && (
        <div className="bg-slate-900/60 border border-slate-800/90 rounded-3xl p-5 sm:p-7 shadow-xl shadow-black/40 space-y-5 relative overflow-hidden backdrop-blur-sm">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

          {/* Chapter Title & Subtitle */}
          <div className="space-y-1.5 relative z-10">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs sm:text-sm text-amber-400 font-bold">
                {currentPart ? `${currentPart.title} · ` : ''}الفصل{' '}
                <span dir="ltr" className="font-mono font-bold">
                  {currentChapter.id}
                </span>
              </span>
              {onOpenOnboarding && (
                <button
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    onOpenOnboarding();
                  }}
                  className="text-xs text-slate-400 hover:text-amber-300 flex items-center gap-1 font-semibold transition py-0.5 px-2 rounded-lg hover:bg-slate-800"
                >
                  <Compass className="w-3.5 h-3.5 text-amber-400" />
                  <span>دليل المنصة</span>
                </button>
              )}
            </div>

            <h2 className="text-lg sm:text-2xl font-black text-white leading-snug">
              {currentChapter.title}
            </h2>
          </div>

          {/* Progress Row */}
          <div className="space-y-2 relative z-10">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-slate-300 font-bold">تقدمك في المسار</span>
              <span dir="ltr" className="font-mono font-black text-amber-400 text-sm sm:text-base tabular-nums">
                {progressPercent}%
              </span>
            </div>

            {/* Custom Glowing Progress Bar */}
            <div className="w-full bg-slate-950 rounded-full h-3 sm:h-3.5 p-0.5 border border-slate-800 overflow-hidden relative">
              <div
                className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400 rounded-full transition-all duration-500 relative flex items-center justify-end"
                style={{ width: `${Math.max(progressPercent, 5)}%` }}
              >
                <span className="w-2 h-2 rounded-full bg-white shadow-sm shadow-orange-500 mr-0.5 shrink-0" />
              </div>
            </div>
          </div>

          {/* Dominant Orange Action Button */}
          <div className="pt-1 relative z-10 flex justify-end">
            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                onSelectChapter(currentChapter.id);
                onSelectView('reader');
              }}
              className="w-full sm:w-auto py-3.5 px-8 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-lg shadow-orange-500/25 transition-all duration-150 active:scale-95"
            >
              <span>{isCurrentCompleted ? 'مراجعة الدرس' : 'متابعة التعلم'}</span>
              <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>
        </div>
      )}

      {/* 2. Achievements Summary Card ("ملخص سريع / إنجازاتك") */}
      <div className="bg-slate-900/60 border border-slate-800/90 rounded-3xl p-5 sm:p-6 shadow-xl shadow-black/40 space-y-4">
        {/* Section Heading */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-amber-500 block">ملخص سريع</span>
            <h3 className="text-xl sm:text-2xl font-black text-white">إنجازاتك</h3>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <Trophy className="w-5 h-5" />
          </div>
        </div>

        {/* 2x2 Grid of Stat Cards matching the UI */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {/* Card 1: Completed Chapters */}
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between min-h-[96px] space-y-2">
            <div className="flex items-center justify-end text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="text-center space-y-0.5">
              <span dir="ltr" className="font-mono font-black text-white text-xl sm:text-2xl block tabular-nums">
                {completedChaptersCount}/{totalChapters}
              </span>
              <span className="text-xs text-slate-400 font-semibold block">فصل مكتمل</span>
            </div>
          </div>

          {/* Card 2: Completed Exams */}
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between min-h-[96px] space-y-2">
            <div className="flex items-center justify-end text-amber-400">
              <Trophy className="w-4 h-4" />
            </div>
            <div className="text-center space-y-0.5">
              <span dir="ltr" className="font-mono font-black text-white text-xl sm:text-2xl block tabular-nums">
                {completedExamPartIds.length}/{parts.length || 6}
              </span>
              <span className="text-xs text-slate-400 font-semibold block">اختبار منجز</span>
            </div>
          </div>

          {/* Card 3: Completed Challenges */}
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between min-h-[96px] space-y-2">
            <div className="flex items-center justify-end text-indigo-400">
              <Code2 className="w-4 h-4" />
            </div>
            <div className="text-center space-y-0.5">
              <span dir="ltr" className="font-mono font-black text-white text-xl sm:text-2xl block tabular-nums">
                {completedChallengeIds.length}
              </span>
              <span className="text-xs text-slate-400 font-semibold block">تحديات شاملة</span>
            </div>
          </div>

          {/* Card 4: Unlocked Badges */}
          <div
            onClick={() => {
              if (onOpenAchievements) {
                soundManager.playBadge();
                onOpenAchievements();
              }
            }}
            className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between min-h-[96px] space-y-2 cursor-pointer hover:border-amber-500/40 hover:bg-slate-950/90 transition group"
          >
            <div className="flex items-center justify-end text-yellow-400">
              <Sparkles className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-center space-y-0.5">
              <span dir="ltr" className="font-mono font-black text-white text-xl sm:text-2xl block tabular-nums">
                {unlockedBadgesCount}
              </span>
              <span className="text-xs text-slate-400 font-semibold block group-hover:text-amber-300 transition">
                أوسمة مفتوحة
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Spaces Section ("اختصارات / اختار مساحتك") */}
      <div className="bg-slate-900/60 border border-slate-800/90 rounded-3xl p-5 sm:p-6 shadow-xl shadow-black/40 space-y-4">
        {/* Section Heading */}
        <div className="space-y-0.5">
          <span className="text-xs font-bold text-amber-500 block">اختصارات</span>
          <h3 className="text-xl sm:text-2xl font-black text-white">اختار مساحتك</h3>
        </div>

        {/* Vertical Stack of Hubs */}
        <div className="space-y-2.5">
          {/* Hub 1: Reader */}
          <div
            onClick={() => {
              soundManager.playClick();
              onSelectView('reader');
            }}
            className="group bg-slate-950/70 hover:bg-slate-950/90 border border-slate-800/80 hover:border-sky-500/40 rounded-2xl p-3.5 sm:p-4 cursor-pointer transition flex items-center justify-between gap-3 active:scale-[0.99]"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-11 h-11 rounded-2xl bg-sky-950/60 border border-sky-500/30 text-sky-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-white text-sm sm:text-base group-hover:text-sky-300 transition truncate">
                  الكتاب التفاعلي
                </h4>
                <p className="text-xs text-slate-400 truncate">
                  راجع الفصول وتابع رحلتك
                </p>
              </div>
            </div>
            <ArrowLeft className="w-4 h-4 text-slate-500 group-hover:text-sky-400 group-hover:translate-x-[-3px] transition-transform shrink-0" />
          </div>

          {/* Hub 2: Code Playground */}
          <div
            onClick={() => {
              soundManager.playClick();
              onSelectView('playground');
            }}
            className="group bg-slate-950/70 hover:bg-slate-950/90 border border-slate-800/80 hover:border-purple-500/40 rounded-2xl p-3.5 sm:p-4 cursor-pointer transition flex items-center justify-between gap-3 active:scale-[0.99]"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-11 h-11 rounded-2xl bg-purple-950/60 border border-purple-500/30 text-purple-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Terminal className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-white text-sm sm:text-base group-hover:text-purple-300 transition truncate">
                  محرر الأكواد
                </h4>
                <p className="text-xs text-slate-400 truncate">
                  جرّب أفكارك وشاهد النتيجة
                </p>
              </div>
            </div>
            <ArrowLeft className="w-4 h-4 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-[-3px] transition-transform shrink-0" />
          </div>

          {/* Hub 3: Coding Challenges */}
          <div
            onClick={() => {
              soundManager.playClick();
              onSelectView('challenges');
            }}
            className="group bg-slate-950/70 hover:bg-slate-950/90 border border-slate-800/80 hover:border-amber-500/40 rounded-2xl p-3.5 sm:p-4 cursor-pointer transition flex items-center justify-between gap-3 active:scale-[0.99]"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-11 h-11 rounded-2xl bg-amber-950/60 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Code2 className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-white text-sm sm:text-base group-hover:text-amber-300 transition truncate">
                  التحديات
                </h4>
                <p className="text-xs text-slate-400 truncate">
                  طبّق ما تعلمته عملياً
                </p>
              </div>
            </div>
            <ArrowLeft className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-[-3px] transition-transform shrink-0" />
          </div>

          {/* Hub 4: Bug Hunter */}
          <div
            onClick={() => {
              soundManager.playClick();
              onSelectView('bughunter');
            }}
            className="group bg-slate-950/70 hover:bg-slate-950/90 border border-slate-800/80 hover:border-rose-500/40 rounded-2xl p-3.5 sm:p-4 cursor-pointer transition flex items-center justify-between gap-3 active:scale-[0.99]"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-11 h-11 rounded-2xl bg-rose-950/60 border border-rose-500/30 text-rose-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Bug className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-white text-sm sm:text-base group-hover:text-rose-300 transition truncate">
                  صياد الأخطاء
                </h4>
                <p className="text-xs text-slate-400 truncate">
                  درّب عينك على اكتشاف المشاكل
                </p>
              </div>
            </div>
            <ArrowLeft className="w-4 h-4 text-slate-500 group-hover:text-rose-400 group-hover:translate-x-[-3px] transition-transform shrink-0" />
          </div>
        </div>
      </div>

      {/* 4. Library / Saved Section ("مكتبتك / محفوظاتك") */}
      <div className="bg-slate-900/60 border border-slate-800/90 rounded-3xl p-5 sm:p-6 shadow-xl shadow-black/40 space-y-4">
        {/* Section Heading */}
        <div className="space-y-0.5">
          <span className="text-xs font-bold text-amber-500 block">مكتبتك</span>
          <h3 className="text-xl sm:text-2xl font-black text-white">محفوظاتك</h3>
        </div>

        {/* Stack of Saved Counters */}
        <div className="space-y-2.5">
          {/* Row 1: Bookmarks */}
          <div
            onClick={() => {
              soundManager.playClick();
              onSelectView('reader');
            }}
            className="bg-slate-950/70 hover:bg-slate-950/90 border border-slate-800/80 hover:border-amber-500/30 rounded-2xl p-4 flex items-center justify-between cursor-pointer transition active:scale-[0.99]"
          >
            <div className="flex items-center gap-3">
              <Bookmark className="w-4 h-4 text-amber-400" />
              <span className="font-bold text-sm text-white">الفصول المفضلة</span>
            </div>
            <span dir="ltr" className="font-mono font-black text-white text-base tabular-nums">
              {bookmarkedCount}
            </span>
          </div>

          {/* Row 2: Personal Notes */}
          <div
            onClick={() => {
              soundManager.playClick();
              onSelectView('reader');
            }}
            className="bg-slate-950/70 hover:bg-slate-950/90 border border-slate-800/80 hover:border-cyan-500/30 rounded-2xl p-4 flex items-center justify-between cursor-pointer transition active:scale-[0.99]"
          >
            <div className="flex items-center gap-3">
              <FileText className="w-4 h-4 text-cyan-400" />
              <span className="font-bold text-sm text-white">ملاحظاتك</span>
            </div>
            <span dir="ltr" className="font-mono font-black text-white text-base tabular-nums">
              {notesCount}
            </span>
          </div>
        </div>

        {/* Bottom Full-width Action: Open Book */}
        <button
          type="button"
          onClick={() => {
            soundManager.playClick();
            onSelectView('reader');
          }}
          className="w-full py-3.5 px-4 rounded-2xl bg-slate-950/80 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-600 text-white font-bold text-sm sm:text-base transition text-center active:scale-95 shadow-md"
        >
          فتح الكتاب
        </button>
      </div>
    </div>
  );
});
