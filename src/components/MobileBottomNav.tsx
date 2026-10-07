import React, { useState } from 'react';
import { ViewMode } from '../types';
import {
  LayoutDashboard,
  BookOpen,
  Terminal,
  Trophy,
  MoreHorizontal,
  Bug,
  Award,
  Search,
  Volume2,
  Lock,
  KeyRound,
  ShieldCheck,
  School,
  GraduationCap,
  Compass,
  X,
} from 'lucide-react';
import { soundManager } from '../utils/soundManager';
import { SoundControlButton } from './SoundControlButton';
import { InstallAppButton } from './InstallAppButton';

interface MobileBottomNavProps {
  currentView: ViewMode;
  role?: 'master' | 'admin' | 'teacher' | 'student';
  studentName?: string;
  onSelectView: (view: ViewMode) => void;
  onOpenSearch?: () => void;
  onOpenAchievements?: () => void;
  onOpenOnboarding?: () => void;
  onLockPlatform?: () => void;
  unlockedBadgesCount?: number;
}

export const MobileBottomNav = React.memo<MobileBottomNavProps>(({
  currentView,
  role = 'student',
  studentName,
  onSelectView,
  onOpenSearch,
  onOpenAchievements,
  onOpenOnboarding,
  onLockPlatform,
  unlockedBadgesCount = 0,
}) => {
  const [isMoreSheetOpen, setIsMoreSheetOpen] = useState(false);

  const isMaster = role === 'master' || role === 'admin';
  const isTeacher = role === 'teacher';
  const isStaff = isMaster || isTeacher;

  // Max 5 primary destinations on mobile
  const primaryTabs: { view: ViewMode; label: string; icon: React.ReactNode }[] = isStaff
    ? [
        {
          view: 'admin',
          label: isMaster ? 'الإدارة' : 'المعلم',
          icon: isMaster ? <ShieldCheck className="w-5 h-5" /> : <School className="w-5 h-5" />,
        },
        { view: 'reader', label: 'الكتاب', icon: <BookOpen className="w-5 h-5" /> },
        { view: 'playground', label: 'المحرّر', icon: <Terminal className="w-5 h-5" /> },
        { view: 'challenges', label: 'التحديات', icon: <Trophy className="w-5 h-5" /> },
      ]
    : [
        { view: 'dashboard', label: 'الرئيسية', icon: <LayoutDashboard className="w-5 h-5" /> },
        { view: 'reader', label: 'الكتاب', icon: <BookOpen className="w-5 h-5" /> },
        { view: 'playground', label: 'المحرّر', icon: <Terminal className="w-5 h-5" /> },
        { view: 'challenges', label: 'التحديات', icon: <Trophy className="w-5 h-5" /> },
      ];

  const isMoreActive = isStaff
    ? currentView === 'dashboard' || currentView === 'bughunter'
    : currentView === 'bughunter' || currentView === 'admin';

  return (
    <>
      <nav
        aria-label="التنقل الرئيسي للهاتف"
        className="md:hidden fixed inset-x-0 bottom-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800 px-2 pt-1.5 pb-[calc(env(safe-area-inset-bottom,0px)+0.25rem)] flex items-center justify-around font-['Cairo',sans-serif] shadow-2xl h-[calc(4.25rem+env(safe-area-inset-bottom,0px))] touch-manipulation"
      >
        {primaryTabs.map((tab) => {
          const isActive = currentView === tab.view;
          return (
            <button
              key={tab.view}
              type="button"
              onClick={() => {
                soundManager.playClick();
                onSelectView(tab.view);
              }}
              aria-current={isActive ? 'page' : undefined}
              className={`flex-1 min-w-[56px] min-h-[48px] py-1 px-1 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all duration-150 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 select-none ${
                isActive
                  ? 'text-amber-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200 font-medium'
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition flex items-center justify-center ${
                  isActive ? 'bg-amber-500/15 text-amber-400' : 'text-slate-400'
                }`}
              >
                {tab.icon}
              </div>
              <span className="text-[11px] leading-tight truncate">{tab.label}</span>
            </button>
          );
        })}

        {/* 5th Tab: "More" Sheet Trigger */}
        <button
          type="button"
          onClick={() => {
            soundManager.playClick();
            setIsMoreSheetOpen(true);
          }}
          aria-expanded={isMoreSheetOpen}
          aria-label="قائمة الخيارات الإضافية"
          className={`flex-1 min-w-[56px] min-h-[48px] py-1 px-1 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all duration-150 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 select-none ${
            isMoreActive || isMoreSheetOpen
              ? 'text-amber-400 font-bold'
              : 'text-slate-400 hover:text-slate-200 font-medium'
          }`}
        >
          <div
            className={`p-1.5 rounded-xl transition flex items-center justify-center ${
              isMoreActive || isMoreSheetOpen ? 'bg-amber-500/15 text-amber-400' : 'text-slate-400'
            }`}
          >
            <MoreHorizontal className="w-5 h-5" />
          </div>
          <span className="text-[11px] leading-tight truncate">المزيد</span>
        </button>
      </nav>

      {/* Accessible Mobile "More" Drawer / Bottom Sheet */}
      {isMoreSheetOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-end">
          {/* Backdrop */}
          <button
            type="button"
            aria-label="إغلاق القائمة"
            className="fixed inset-0 bg-black/75 backdrop-blur-sm"
            onClick={() => setIsMoreSheetOpen(false)}
          />

          {/* Sheet Surface */}
          <div
            role="dialog"
            aria-modal="true"
            aria-label="قائمة الأدوات الإضافية"
            className="relative z-10 bg-slate-900 border-t border-slate-800 rounded-t-3xl p-5 pb-[calc(env(safe-area-inset-bottom,0px)+1.5rem)] max-h-[85vh] overflow-y-auto space-y-4 font-['Cairo',sans-serif] animate-fadeIn text-right"
          >
            {/* Sheet Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-xs text-slate-400 block font-medium">
                  {isMaster ? 'حساب المالك الرئيسي 👑' : isTeacher ? 'حساب المعلم 👨‍🏫' : 'أدوات إضافية'}
                </span>
                <span className="text-base font-bold text-white">
                  {studentName || (isMaster ? 'المدير' : isTeacher ? 'المعلم' : 'حساب الطالب')}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsMoreSheetOpen(false)}
                aria-label="إغلاق النافذة"
                className="w-11 h-11 flex items-center justify-center rounded-xl bg-slate-800 text-slate-300 hover:text-white active:scale-95"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Menu Items Grid / List */}
            <div className="space-y-2">
              {/* Staff Student View Preview */}
              {isStaff && (
                <button
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    onSelectView('dashboard');
                    setIsMoreSheetOpen(false);
                  }}
                  className={`w-full min-h-[48px] flex items-center justify-between p-3 rounded-2xl border transition ${
                    currentView === 'dashboard'
                      ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 font-bold'
                      : 'bg-slate-800/70 border-slate-700/60 text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold block">معاينة لوحة الطالب</span>
                      <span className="text-[11px] text-slate-400">استعراض المنصة وتجربتها كطالب</span>
                    </div>
                  </div>
                </button>
              )}

              {/* Bug Hunter */}
              <button
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  onSelectView('bughunter');
                  setIsMoreSheetOpen(false);
                }}
                className={`w-full min-h-[48px] flex items-center justify-between p-3 rounded-2xl border transition ${
                  currentView === 'bughunter'
                    ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 font-bold'
                    : 'bg-slate-800/70 border-slate-700/60 text-slate-200 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
                    <Bug className="w-5 h-5" />
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold block">صياد الأخطاء</span>
                    <span className="text-[11px] text-slate-400">كويزات تشخيص الأخطاء البرمجية</span>
                  </div>
                </div>
              </button>

              {/* Achievements */}
              {onOpenAchievements && (
                <button
                  type="button"
                  onClick={() => {
                    soundManager.playBadge();
                    onOpenAchievements();
                    setIsMoreSheetOpen(false);
                  }}
                  className="w-full min-h-[48px] flex items-center justify-between p-3 rounded-2xl bg-slate-800/70 border border-slate-700/60 text-slate-200 hover:bg-slate-800 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-800 text-amber-400 flex items-center justify-center">
                      <Award className="w-5 h-5" />
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold block">أوسمة الشرف</span>
                      <span className="text-xs text-slate-300">إنجازاتك وميداليات التقدم</span>
                    </div>
                  </div>
                  {unlockedBadgesCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-xs font-bold">
                      {unlockedBadgesCount}
                    </span>
                  )}
                </button>
              )}

              {/* Search Modal Trigger */}
              {onOpenSearch && (
                <button
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    onOpenSearch();
                    setIsMoreSheetOpen(false);
                  }}
                  className="w-full min-h-[48px] flex items-center gap-3 p-3 rounded-2xl bg-slate-800/70 border border-slate-700/60 text-slate-200 hover:bg-slate-800 transition"
                >
                  <div className="w-9 h-9 rounded-xl bg-slate-800 text-amber-400 flex items-center justify-center">
                    <Search className="w-5 h-5" />
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold block">البحث الشامل</span>
                    <span className="text-xs text-slate-300">ابحث عن أي مصطلح أو درس</span>
                  </div>
                </button>
              )}

              {/* Onboarding Tour Trigger */}
              {onOpenOnboarding && (
                <button
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    onOpenOnboarding();
                    setIsMoreSheetOpen(false);
                  }}
                  className="w-full min-h-[48px] flex items-center gap-3 p-3 rounded-2xl bg-slate-800/70 border border-slate-700/60 text-slate-200 hover:bg-slate-800 transition"
                >
                  <div className="w-9 h-9 rounded-xl bg-slate-800 text-amber-400 flex items-center justify-center">
                    <Compass className="w-5 h-5" />
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold block">جولة تعريفية بالمنصة</span>
                    <span className="text-xs text-slate-300">استكشف طريقة التعلم وميزات المنصة</span>
                  </div>
                </button>
              )}

              {/* Sound Settings Control */}
              <div className="p-3 rounded-2xl bg-slate-800/50 border border-slate-800 flex items-center justify-between min-h-[48px]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center">
                    <Volume2 className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-semibold text-slate-200">المؤثرات الصوتية</span>
                </div>
                <SoundControlButton />
              </div>

              {/* Install App */}
              <div className="pt-1">
                <InstallAppButton />
              </div>

              {/* Sign Out / Lock Platform */}
              {onLockPlatform && (
                <div className="pt-2 border-t border-slate-800/80">
                  <button
                    type="button"
                    onClick={() => {
                      setIsMoreSheetOpen(false);
                      onLockPlatform();
                    }}
                    className="w-full min-h-[48px] flex items-center justify-center gap-2 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 font-bold text-sm transition"
                  >
                    <Lock className="w-4 h-4 shrink-0" />
                    <span>قفل المنصة وتسجيل الخروج</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
});
