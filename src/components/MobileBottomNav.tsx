import React from 'react';
import { ViewMode } from '../types';
import { BookOpen, Terminal, Bug, Code2 } from 'lucide-react';

interface MobileBottomNavProps {
  currentView: ViewMode;
  onSelectView: (view: ViewMode) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentView,
  onSelectView,
}) => {
  const navItems: { view: ViewMode; label: string; icon: React.ReactNode }[] = [
    { view: 'reader', label: 'الكتاب', icon: <BookOpen className="w-5 h-5" /> },
    { view: 'playground', label: 'الملعب', icon: <Terminal className="w-5 h-5" /> },
    { view: 'bughunter', label: 'صياد الأخطاء', icon: <Bug className="w-5 h-5" /> },
    { view: 'challenges', label: 'التحديات', icon: <Code2 className="w-5 h-5" /> },
  ];

  return (
    <nav aria-label="التنقل الرئيسي" className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800 px-3 py-2 flex items-center justify-around font-['Cairo',sans-serif] shadow-2xl safe-area-bottom h-16">
      {navItems.map((item) => {
        const isActive = currentView === item.view;
        return (
          <button
            key={item.view}
            onClick={() => onSelectView(item.view)}
            aria-current={isActive ? 'page' : undefined}
            className={`flex-1 flex flex-col items-center justify-center gap-1 py-1 rounded-xl transition-all duration-200 active:scale-95 ${
              isActive
                ? 'text-orange-400 font-bold'
                : 'text-slate-400 hover:text-slate-200 font-medium'
            }`}
          >
            <div className={`p-1 rounded-lg transition ${isActive ? 'bg-orange-500/15 text-orange-400' : ''}`}>
              {item.icon}
            </div>
            <span className="text-[11px] leading-none">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
