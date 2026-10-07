import React, { useState, useRef, useEffect } from 'react';
import { ViewMode } from '../types';
import {
  LayoutDashboard,
  BookOpen,
  Terminal,
  Trophy,
  Bug,
  CheckCircle2,
  Lock,
  KeyRound,
  Search,
  MoreHorizontal,
  ChevronDown,
  Volume2,
  Download,
  Award,
  ShieldCheck,
  School,
  GraduationCap,
  Compass,
} from 'lucide-react';
import { InstallAppButton } from './InstallAppButton';
import { SoundControlButton } from './SoundControlButton';
import { soundManager } from '../utils/soundManager';

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
  onOpenOnboarding?: () => void;
  unlockedBadgesCount?: number;
}

export const Header = React.memo<HeaderProps>(({
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
  onOpenOnboarding,
  unlockedBadgesCount = 0,
}) => {
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const totalItems = totalChaptersCount + totalQuizzesCount;
  const progressPercent =
    totalItems > 0
      ? Math.min(100, Math.round(((completedChaptersCount + completedQuizzesCount) / totalItems) * 100))
      : 0;

  const isMaster = role === 'master' || role === 'admin';
  const isTeacher = role === 'teacher';
  const isStaff = isMaster || isTeacher;

  // Close more menu on click outside or escape key
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setIsMoreMenuOpen(false);
      }
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setIsMoreMenuOpen(false);
      }
    }

    if (isMoreMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMoreMenuOpen]);

  // Primary destinations (desktop nav bar)
  const primaryNavItems: { view: ViewMode; label: string; icon: React.ReactNode }[] = isStaff
    ? [
        {
          view: 'admin',
          label: isMaster ? 'لوحة الإدارة' : 'لوحة المعلم',
          icon: isMaster ? <ShieldCheck className="w-4 h-4" /> : <School className="w-4 h-4" />,
        },
        { view: 'reader', label: 'الكتاب', icon: <BookOpen className="w-4 h-4" /> },
        { view: 'playground', label: 'المحرّر', icon: <Terminal className="w-4 h-4" /> },
        { view: 'challenges', label: 'التحديات', icon: <Trophy className="w-4 h-4" /> },
        { view: 'dashboard', label: 'معاينة الطالب', icon: <GraduationCap className="w-4 h-4" /> },
      ]
    : [
        { view: 'dashboard', label: 'الرئيسية', icon: <LayoutDashboard className="w-4 h-4" /> },
        { view: 'reader', label: 'الكتاب', icon: <BookOpen className="w-4 h-4" /> },
        { view: 'playground', label: 'المحرّر', icon: <Terminal className="w-4 h-4" /> },
        { view: 'challenges', label: 'التحديات', icon: <Trophy className="w-4 h-4" /> },
      ];

  return (
    <header className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 text-slate-100 shadow-md shadow-black/20 font-['Cairo',sans-serif]">
      <div className="w-full px-3 sm:px-6 lg:px-8">
        <div className="h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4 w-full">
          {/* Right Brand / Logo */}
          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              onSelectView(isStaff ? 'admin' : 'dashboard');
            }}
            aria-label={isStaff ? 'الذهاب للوحة الإدارة الرئيسية' : 'الذهاب للوحة التحكم الرئيسية'}
            className="flex items-center gap-2 sm:gap-3 cursor-pointer select-none group shrink-0 rounded-xl text-right focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            <img
              src="/icons/icon.svg"
              alt="زكي كود"
              width={36}
              height={36}
              decoding="async"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl object-cover shadow-sm shadow-orange-500/20 group-hover:scale-105 transition duration-200 shrink-0"
            />
            <div className="flex flex-col">
              <span className="font-black text-sm sm:text-base tracking-tight text-white group-hover:text-amber-300 transition leading-tight">
                زكي كود
              </span>
              <span className="hidden sm:inline text-[10px] text-slate-400 font-medium">
                البرمجة بالعامية المصرية
              </span>
            </div>
          </button>

          {/* Center Navigation: Clean Primary Destinations (Desktop & Tablet) */}
          <nav
            aria-label="التنقل الرئيسي"
            className="hidden md:flex items-center p-1 bg-slate-900/90 rounded-xl border border-slate-800/90 shadow-inner"
          >
            {primaryNavItems.map((item) => {
              const isActive = currentView === item.view;
              return (
                <button
                  key={item.view}
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    onSelectView(item.view);
                  }}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm transition-all duration-150 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/70 font-semibold'
                  }`}
                >
                  <span className="shrink-0">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Left Controls: Global Search + Progress + Consolidated More Menu */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Global Search */}
            {onOpenSearch && (
              <button
                type="button"
                onClick={onOpenSearch}
                aria-label="البحث في محتوى الكتاب (Ctrl+K)"
                className="min-h-[40px] px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition text-xs font-semibold flex items-center gap-1.5 active:scale-95 focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                <Search className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="hidden sm:inline">بحث</span>
                <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[9px] font-mono text-slate-400 bg-slate-800 rounded border border-slate-700">
                  Ctrl+K
                </kbd>
              </button>
            )}

            {/* Quiet Course Progress Bar (Desktop only) */}
            <div
              className="hidden lg:flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800 text-xs"
              title={`مستوى الإنجاز العام: ${progressPercent}%`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span dir="ltr" className="text-white font-bold font-mono text-xs tabular-nums">
                {progressPercent}%
              </span>
              <div className="w-10 h-1.5 bg-slate-800 rounded-full overflow-hidden shrink-0">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Secondary Actions: Consolidated Accessible "More" Menu */}
            <div className="relative">
              <button
                ref={buttonRef}
                type="button"
                onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                aria-expanded={isMoreMenuOpen}
                aria-haspopup="true"
                aria-label="خيارات إضافية"
                className={`min-h-[40px] px-2.5 sm:px-3 py-1.5 rounded-xl border flex items-center gap-1.5 text-xs font-semibold transition active:scale-95 focus-visible:ring-2 focus-visible:ring-amber-400 ${
                  isMoreMenuOpen
                    ? 'bg-slate-800 text-amber-300 border-amber-500/40'
                    : 'bg-slate-900/90 text-slate-300 hover:text-white border-slate-800 hover:bg-slate-800'
                }`}
              >
                <MoreHorizontal className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="hidden sm:inline">المزيد</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                    isMoreMenuOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Accessible Dropdown Popover */}
              {isMoreMenuOpen && (
                <div
                  ref={menuRef}
                  role="menu"
                  aria-orientation="vertical"
                  className="absolute left-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl shadow-black/50 p-2 z-50 text-right space-y-1 animate-fadeIn font-['Cairo',sans-serif]"
                >
                  {/* Student Identity Header */}
                  {activeCode && (
                    <div className="px-3 py-2 border-b border-slate-800/80 mb-1">
                      <span className="text-[11px] text-slate-400 block font-medium">الحساب الحالي</span>
                      <span className="text-sm font-bold text-white truncate block">
                        {studentName || 'طالب جديد'}
                      </span>
                    </div>
                  )}

                  {/* 1. Bug Hunter */}
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      soundManager.playClick();
                      onSelectView('bughunter');
                      setIsMoreMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition ${
                      currentView === 'bughunter'
                        ? 'bg-amber-500/10 text-amber-400 font-bold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Bug className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>صياد الأخطاء</span>
                    </div>
                    {completedQuizzesCount > 0 && (
                      <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono">
                        {completedQuizzesCount}
                      </span>
                    )}
                  </button>

                  {/* 2. Achievements */}
                  {onOpenAchievements && (
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        soundManager.playBadge();
                        onOpenAchievements();
                        setIsMoreMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition"
                    >
                      <div className="flex items-center gap-2.5">
                        <Award className="w-4 h-4 text-yellow-400 shrink-0" />
                        <span>أوسمة الشرف</span>
                      </div>
                      {unlockedBadgesCount > 0 && (
                        <span className="text-[10px] bg-yellow-500/20 text-yellow-300 px-1.5 py-0.5 rounded font-bold font-mono">
                          {unlockedBadgesCount}
                        </span>
                      )}
                    </button>
                  )}

                  {/* 3. Onboarding Tour Guide */}
                  {onOpenOnboarding && (
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        soundManager.playClick();
                        onOpenOnboarding();
                        setIsMoreMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition"
                    >
                      <Compass className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>جولة تعريفية بالمنصة</span>
                    </button>
                  )}

                  {/* 4. Sound Settings Control */}
                  <div className="px-3 py-2 flex items-center justify-between text-xs text-slate-300 hover:bg-slate-800/50 rounded-xl">
                    <div className="flex items-center gap-2.5">
                      <Volume2 className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>المؤثرات الصوتية</span>
                    </div>
                    <SoundControlButton />
                  </div>

                  {/* 4. Install App Button */}
                  <div className="px-1 py-1">
                    <InstallAppButton />
                  </div>

                  {/* 5. Sign Out / Lock Platform */}
                  {onLockPlatform && (
                    <div className="pt-1 border-t border-slate-800/80 mt-1">
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          setIsMoreMenuOpen(false);
                          onLockPlatform();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition"
                      >
                        <Lock className="w-4 h-4 shrink-0" />
                        <span>قفل المنصة وتسجيل الخروج</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
});
