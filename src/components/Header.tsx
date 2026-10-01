import React, { useState } from 'react';
import { ViewMode } from '../types';
import {
  BookOpen,
  Terminal,
  Bug,
  Trophy,
  CheckCircle2,
  Lock,
  KeyRound,
  User,
  Sparkles,
} from 'lucide-react';
import { InstallAppButton } from './InstallAppButton';
import { OwnerCodeModal } from './OwnerCodeModal';

interface HeaderProps {
  currentView: ViewMode;
  onSelectView: (view: ViewMode) => void;
  completedChaptersCount: number;
  totalChaptersCount: number;
  completedQuizzesCount: number;
  totalQuizzesCount: number;
  role: 'admin' | 'student';
  activeCode?: string;
  studentName?: string;
  onLockPlatform?: () => void;
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
}) => {
  const [showOwnerModal, setShowOwnerModal] = useState(false);
  const totalItems = totalChaptersCount + totalQuizzesCount;
  const progressPercent = totalItems > 0
    ? Math.round(((completedChaptersCount + completedQuizzesCount) / totalItems) * 100)
    : 0;

  const isAdmin = role === 'admin';

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800/80 text-slate-100 shadow-lg shadow-black/40">
      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-5">
        <div className="h-16 flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-yellow-400 flex items-center justify-center shadow-md shadow-amber-500/25 text-slate-950 font-black text-base sm:text-lg select-none">
              كود
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-base sm:text-lg font-black tracking-tight text-white whitespace-nowrap">
                  كود بالمصري
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Sparkles className="w-2.5 h-2.5" />
                  <span>تفاعلي</span>
                </span>
              </div>
              <span className="hidden lg:block text-[11px] text-slate-400 font-medium">
                المنهاج التفاعلي الشامل لتعلم البرمجة من الصفر
              </span>
            </div>
          </div>

          {/* Center Navigation Segmented Control (Desktop & Tablet) */}
          <nav className="hidden md:flex items-center p-1 bg-slate-900/90 rounded-xl border border-slate-800/90 shadow-inner">
            <button
              onClick={() => onSelectView('reader')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm transition-all duration-200 whitespace-nowrap ${
                currentView === 'reader'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/70 font-semibold'
              }`}
            >
              <BookOpen className="w-4 h-4 shrink-0" />
              <span>قراءة المنهج</span>
            </button>

            <button
              onClick={() => onSelectView('playground')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm transition-all duration-200 whitespace-nowrap ${
                currentView === 'playground'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/70 font-semibold'
              }`}
            >
              <Terminal className="w-4 h-4 shrink-0" />
              <span>مختبر الأكواد</span>
            </button>

            <button
              onClick={() => onSelectView('bughunter')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm transition-all duration-200 whitespace-nowrap relative ${
                currentView === 'bughunter'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/70 font-semibold'
              }`}
            >
              <Bug className="w-4 h-4 shrink-0" />
              <span>صائد الأخطاء</span>
              {completedQuizzesCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-slate-900 absolute top-1 left-1" />
              )}
            </button>

            <button
              onClick={() => onSelectView('challenges')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm transition-all duration-200 whitespace-nowrap ${
                currentView === 'challenges'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/70 font-semibold'
              }`}
            >
              <Trophy className="w-4 h-4 shrink-0" />
              <span>التحديات</span>
            </button>
          </nav>

          {/* Left Controls: Progress, User Chip, Install */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Learning Progress Chip (Desktop & Tablet) */}
            <div className="hidden lg:flex items-center gap-2.5 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800/80 text-xs">
              <div className="flex flex-col items-end">
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>الإنجاز: <strong className="text-white font-mono">{progressPercent}%</strong></span>
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {completedChaptersCount} من {totalChaptersCount} فصل
                </span>
              </div>
              <div className="w-12 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* PWA Install Button */}
            <InstallAppButton />

            {/* User Profile / Role Chip */}
            {activeCode && onLockPlatform && (
              <div className="flex items-center bg-slate-900/90 border border-slate-800 px-2.5 py-1.5 rounded-xl text-xs gap-1.5">
                {isAdmin ? (
                  <>
                    <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1">
                      <span>👑</span>
                      <span>المدير</span>
                    </span>
                    <button
                      onClick={() => setShowOwnerModal(true)}
                      className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 font-bold transition text-[11px]"
                      title="إدارة وتوليد أكواد الطلاب"
                    >
                      <KeyRound className="w-3 h-3" />
                      <span>الأكواد</span>
                    </button>
                  </>
                ) : (
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <div className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-800/60 flex items-center justify-center text-cyan-300">
                      <User className="w-3 h-3" />
                    </div>
                    <span className="text-[11px] font-medium text-slate-200 max-w-[90px] truncate">
                      {studentName || 'طالب جديد'}
                    </span>
                  </div>
                )}

                {/* Logout / Lock Button */}
                <button
                  onClick={onLockPlatform}
                  className="text-slate-400 hover:text-rose-400 p-1 rounded-lg hover:bg-rose-950/30 transition"
                  title="تسجيل الخروج / قفل المنصة"
                >
                  <Lock className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation Bar (Grid 4 columns, 0 scrollbars, 100% clean) */}
      <div className="md:hidden border-t border-slate-800/80 bg-slate-950/95 px-2 py-1.5">
        <nav className="grid grid-cols-4 gap-1 p-0.5 bg-slate-900 rounded-xl border border-slate-800/80">
          <button
            onClick={() => onSelectView('reader')}
            className={`flex flex-col sm:flex-row items-center justify-center gap-1 py-1.5 px-1 rounded-lg text-[11px] transition ${
              currentView === 'reader'
                ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                : 'text-slate-300 hover:text-white font-medium'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">المنهج</span>
          </button>

          <button
            onClick={() => onSelectView('playground')}
            className={`flex flex-col sm:flex-row items-center justify-center gap-1 py-1.5 px-1 rounded-lg text-[11px] transition ${
              currentView === 'playground'
                ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                : 'text-slate-300 hover:text-white font-medium'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">المختبر</span>
          </button>

          <button
            onClick={() => onSelectView('bughunter')}
            className={`flex flex-col sm:flex-row items-center justify-center gap-1 py-1.5 px-1 rounded-lg text-[11px] transition relative ${
              currentView === 'bughunter'
                ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                : 'text-slate-300 hover:text-white font-medium'
            }`}
          >
            <Bug className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">الأخطاء</span>
            {completedQuizzesCount > 0 && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 absolute top-1 left-1" />
            )}
          </button>

          <button
            onClick={() => onSelectView('challenges')}
            className={`flex flex-col sm:flex-row items-center justify-center gap-1 py-1.5 px-1 rounded-lg text-[11px] transition ${
              currentView === 'challenges'
                ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                : 'text-slate-300 hover:text-white font-medium'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">التحديات</span>
          </button>
        </nav>
      </div>

      {/* Admin Codes Modal */}
      {isAdmin && (
        <OwnerCodeModal
          adminCode={activeCode || ''}
          isOpen={showOwnerModal}
          onClose={() => setShowOwnerModal(false)}
        />
      )}
    </header>
  );
};
