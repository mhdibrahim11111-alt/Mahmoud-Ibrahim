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
      className="lg:hidden fixed inset-x-0 bottom-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800 px-1.5 pt-1.5 pb-[env(safe-area-inset-bottom)] flex items-center justify-around font-['Cairo',sans-serif] shadow-2xl h-[calc(4rem+env(safe-area-inset-bottom))]"
    >
      {navItems.map((item) => {
        const isActive = currentView === item.view;
        return (
          <button
            key={item.view}
            onClick={() => {
              soundManager.playClick();
              onSelectView(item.view);
            }}
            aria-current={isActive ? 'page' : undefined}
            className={`flex-1 min-w-0 min-h-11 flex flex-col items-center justify-center gap-1 px-0.5 rounded-xl transition-all duration-200 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400 ${
              isActive
                ? 'text-orange-400 font-bold'
                : 'text-slate-400 hover:text-slate-200 font-medium'
            }`}
          >
            <div className={`p-1 rounded-lg transition ${isActive ? 'bg-orange-500/15 text-orange-400' : ''}`}>
              {item.icon}
            </div>
            <span className="max-w-full truncate whitespace-nowrap text-[10px] leading-tight sm:text-[11px]">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
