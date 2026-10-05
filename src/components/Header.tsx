import React from 'react';
import { ViewMode } from '../types';
import {
  BookOpen,
  Terminal,
  Bug,
  Trophy,
  CheckCircle2,
  Lock,
  KeyRound,
  Sparkles,
  Search,
} from 'lucide-react';
import { InstallAppButton } from './InstallAppButton';
import { SoundControlButton } from './SoundControlButton';

interface HeaderProps {
  currentView: ViewMode;
  onSelectView: (view: ViewMode) => void;
  completedChaptersCount: number;
  totalChaptersCount: number;
  completedQuizzesCount: number;
  totalQuizzesCount: number;
  role: 'master' | 'admin' | 'teacher' | 'student';
  activeCode?: string;
  studentName?: string;
  onLockPlatform?: () => void;
  onOpenSearch?: () => void;
  onOpenAchievements?: () => void;
  unlockedBadgesCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onSelectView,
  completedChaptersCount,
  totalChaptersCount,
  completedQuizzesCount,
  totalQuizzesCount,
  role,
  activeCode,
  studentName,
  onLockPlatform,
  onOpenSearch,
  onOpenAchievements,
  unlockedBadgesCount = 0,
}) => {
  const totalItems = totalChaptersCount + totalQuizzesCount;
  const progressPercent =
    totalItems > 0
      ? Math.round(((completedChaptersCount + completedQuizzesCount) / totalItems) * 100)
      : 0;

  const isMaster = role === 'master' || role === 'admin';
  const isTeacher = role === 'teacher';
  const isStaff = isMaster || isTeacher;

  return (
    <header className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 text-slate-100 shadow-md shadow-black/30 font-['Cairo',sans-serif]">
      {/* Main Bar */}
      <div className="w-full px-2 sm:px-6 lg:px-8">
       <div className="h-14 sm:h-16 flex items-center justify-between gap-1 sm:gap-4 w-full">
  {/* Right Brand / Logo */}
  <button
    type="button"
    onClick={() => onSelectView('reader')}
    aria-label="العودة إلى الكتاب"
    className="flex items-center gap-2 sm:gap-3 cursor-pointer select-none group shrink-0 rounded-xl text-right"
  >
    <img
      src="/icons/icon-192.png"
      alt="زكي كود"
      className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl object-cover shadow-md shadow-orange-500/25 group-hover:scale-105 transition duration-300 shrink-0"
    />
    <div className="flex flex-col">
      <span className="font-black text-sm sm:text-base tracking-tight text-white group-hover:text-amber-300 transition leading-tight">
        زكي كود
      </span>
      <span className="hidden sm:inline text-[10px] text-slate-400 font-medium">
        تعلم البرمجة بالعامية من الصفر للاحتراف
      </span>
    </div>
  </button>

          {/* Center Navigation: Desktop Only (Hidden on Mobile/Tablet to eliminate duplication) */}
          <nav aria-label="التنقل الرئيسي" className="hidden lg:flex items-center p-1 bg-slate-900/90 rounded-xl border border-slate-800 shadow-inner">
            <button
              onClick={() => onSelectView('reader')}
              aria-current={currentView === 'reader' ? 'page' : undefined}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm transition-all duration-200 whitespace-nowrap ${
                currentView === 'reader'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-black shadow-md shadow-orange-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/70 font-semibold'
              }`}
            >
              <BookOpen className="w-4 h-4 shrink-0" strokeWidth={2.2} />
              <span>الكتاب</span>
            </button>

            <button
              onClick={() => onSelectView('playground')}
              aria-current={currentView === 'playground' ? 'page' : undefined}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm transition-all duration-200 whitespace-nowrap ${
                currentView === 'playground'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-black shadow-md shadow-orange-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/70 font-semibold'
              }`}
            >
              <Terminal className="w-4 h-4 shrink-0" strokeWidth={2.2} />
              <span>المحرّر</span>
            </button>

            <button
              onClick={() => onSelectView('bughunter')}
              aria-current={currentView === 'bughunter' ? 'page' : undefined}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm transition-all duration-200 whitespace-nowrap relative ${
                currentView === 'bughunter'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-black shadow-md shadow-orange-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/70 font-semibold'
              }`}
            >
              <Bug className="w-4 h-4 shrink-0" strokeWidth={2.2} />
              <span>صياد الأخطاء</span>
              {completedQuizzesCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-slate-900 absolute top-1 left-1" />
              )}
            </button>

            <button
              onClick={() => onSelectView('challenges')}
              aria-current={currentView === 'challenges' ? 'page' : undefined}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm transition-all duration-200 whitespace-nowrap ${
                currentView === 'challenges'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-black shadow-md shadow-orange-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/70 font-semibold'
              }`}
            >
              <Trophy className="w-4 h-4 shrink-0" strokeWidth={2.2} />
              <span>التحديات</span>
            </button>

            {isStaff && (
              <button
                onClick={() => onSelectView('admin')}
                aria-current={currentView === 'admin' ? 'page' : undefined}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm transition-all duration-200 whitespace-nowrap ${
                  currentView === 'admin'
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black shadow-md shadow-amber-500/20'
                    : isMaster
                    ? 'text-amber-300 hover:text-amber-200 hover:bg-amber-950/40 font-bold border border-amber-500/30'
                    : 'text-emerald-300 hover:text-emerald-200 hover:bg-emerald-950/40 font-bold border border-emerald-500/30'
                }`}
              >
                <KeyRound className="w-4 h-4 shrink-0" strokeWidth={2.2} />
                <span>{isMaster ? 'لوحة الإدارة 👑' : 'لوحة فصلي 👨‍🏫'}</span>
              </button>
            )}
          </nav>

          {/* Left Controls: Single Search, Combined Profile & Trophies Badge, PWA */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* 1. Global Search Button */}
            {onOpenSearch && (
              <button
                onClick={onOpenSearch}
                aria-label="بحث شامل في محتوى الكتاب"
                className="min-w-11 min-h-11 flex items-center justify-center gap-1.5 p-2 sm:px-3 sm:py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition text-xs font-semibold shadow-sm active:scale-95"
                title="بحث شامل في محتوى الكتاب (Ctrl+K)"
              >
                <Search className="w-4 h-4 text-orange-400 shrink-0" strokeWidth={2.3} />
                <span className="hidden sm:inline">بحث</span>
                <kbd className="hidden xl:inline-block px-1.5 py-0.2 text-[9px] font-mono text-slate-400 bg-slate-800 rounded border border-slate-700">
                  Ctrl+K
                </kbd>
              </button>
            )}

            {/* 2. Unified User Profile & Achievements Badge */}
            {activeCode && (
              <button
                onClick={onOpenAchievements}
                aria-label={`الإنجازات وحساب ${studentName || 'طالب جديد'}`}
                className="min-h-11 min-w-11 flex items-center justify-center bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-orange-500/40 px-2 sm:px-2.5 py-1.5 rounded-xl text-xs gap-1.5 shrink-0 shadow-sm transition active:scale-95"
                title="اضغط لفتح أوسمة الشرف والإنجازات 🏆"
              >
                <div className="w-5 h-5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/40 flex items-center justify-center text-xs shrink-0 font-bold">
                  🏆
                </div>
                <span className="hidden sm:inline text-[11px] font-semibold text-slate-200 max-w-[100px] truncate">
                  {studentName || 'طالب جديد'}
                </span>
                {unlockedBadgesCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-orange-500 text-slate-950 font-black text-[10px]">
                    {unlockedBadgesCount}
                  </span>
                )}
              </button>
            )}

            {/* Sound Effects Controller & Mute Toggle */}
            <SoundControlButton />

            {/* PWA Install Button (Desktop & Tablet only) */}
            <div className="hidden sm:flex">
              <InstallAppButton />
            </div>

            {/* Learning Progress Chip (Desktop only) */}
            <div className="hidden xl:flex items-center gap-2.5 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-800 text-xs shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" strokeWidth={2.3} />
              <span dir="ltr" className="text-white font-bold font-mono text-xs">
                {progressPercent}%
              </span>
              <div className="w-12 h-1.5 bg-slate-800 rounded-full overflow-hidden shrink-0">
                <div
                  className="h-full bg-gradient-to-r from-orange-500 to-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Logout / Lock Button */}
            {onLockPlatform && (
              <button
                onClick={onLockPlatform}
                aria-label="قفل المنصة وتسجيل الخروج"
                className="min-w-11 min-h-11 flex items-center justify-center text-slate-400 hover:text-rose-400 p-1.5 rounded-xl hover:bg-rose-950/30 transition shrink-0"
                title="قفل المنصة"
              >
                <Lock className="w-3.5 h-3.5" strokeWidth={2.3} />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
