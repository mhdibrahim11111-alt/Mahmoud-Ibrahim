import React from 'react';
import { ViewMode } from '../types';
import { BookOpen, Terminal, Bug, Code2, KeyRound } from 'lucide-react';
import { soundManager } from '../utils/soundManager';

interface MobileBottomNavProps {
  currentView: ViewMode;
  role?: 'master' | 'admin' | 'teacher' | 'student';
  onSelectView: (view: ViewMode) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentView,
  role = 'student',
  onSelectView,
}) => {
  const isMaster = role === 'master' || role === 'admin';
  const isTeacher = role === 'teacher';
  const isStaff = isMaster || isTeacher;

  const navItems: { view: ViewMode; label: string; icon: React.ReactNode }[] = [
    { view: 'reader', label: 'الكتاب', icon: <BookOpen className="w-5 h-5" /> },
    { view: 'playground', label: 'المحرّر', icon: <Terminal className="w-5 h-5" /> },
    { view: 'bughunter', label: 'صياد الأخطاء', icon: <Bug className="w-5 h-5" /> },
    { view: 'challenges', label: 'التحديات', icon: <Code2 className="w-5 h-5" /> },
    ...(isStaff ? [{ view: 'admin' as ViewMode, label: isMaster ? 'الإدارة 👑' : 'الفصل 👨‍🏫', icon: <KeyRound className="w-5 h-5" /> }] : []),
  ];

  return (
    <nav
      aria-label="التنقل الرئيسي"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800 px-2 py-1 flex items-center justify-around font-['Cairo',sans-serif] shadow-2xl safe-area-bottom min-h-[64px] h-[calc(4.25rem+env(safe-area-inset-bottom,0px))] touch-manipulation"
    >
      {navItems.map((item) => {
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
            className={`flex-1 min-h-[52px] min-w-[48px] py-1 px-1 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all duration-150 active:scale-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 select-none ${
              isActive
                ? 'text-amber-400 font-bold'
                : 'text-slate-400 hover:text-slate-200 font-medium'
            }`}
          >
            <div
              className={`p-1.5 rounded-xl transition flex items-center justify-center ${
                isActive
                  ? 'bg-amber-500/20 text-amber-400 shadow-sm shadow-amber-500/10'
                  : 'text-slate-400'
              }`}
            >
              {item.icon}
            </div>
            <span className={`text-[11px] sm:text-xs leading-none transition-transform ${isActive ? 'font-bold' : ''}`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
