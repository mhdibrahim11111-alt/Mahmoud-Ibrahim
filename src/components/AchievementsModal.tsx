import React, { useState, useMemo, useRef } from 'react';
import { ALL_BADGES, StudentStats, Badge } from '../types/achievements';
import { useFocusTrap } from '../hooks/useFocusTrap';
import {
  Trophy,
  X,
  CheckCircle2,
  Lock,
  Sparkles,
  Award,
  Rocket,
  Zap,
  BookOpen,
  GraduationCap,
  Bug,
  Target,
  Wrench,
  Gem,
  Code2,
  StickyNote,
  Flame,
  Layers,
  Check,
} from 'lucide-react';

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: StudentStats;
  studentName?: string;
}

type CategoryFilter = 'all' | 'chapters' | 'bughunter' | 'capstones' | 'workspace';

// Mapping badge icons to Lucide icons
function getBadgeIcon(badgeId: string) {
  switch (badgeId) {
    case 'first-step':
      return <Rocket className="w-5 h-5 text-amber-400" />;
    case 'fast-learner':
      return <Zap className="w-5 h-5 text-yellow-400" />;
    case 'halfway-hero':
      return <BookOpen className="w-5 h-5 text-orange-400" />;
    case 'master-graduate':
      return <GraduationCap className="w-5 h-5 text-emerald-400" />;
    case 'bug-buster':
      return <Bug className="w-5 h-5 text-rose-400" />;
    case 'master-bug-hunter':
      return <Target className="w-5 h-5 text-rose-400" />;
    case 'capstone-engineer':
      return <Wrench className="w-5 h-5 text-cyan-400" />;
    case 'legend-developer':
      return <Gem className="w-5 h-5 text-indigo-400" />;
    case 'code-crafter':
      return <Code2 className="w-5 h-5 text-cyan-400" />;
    case 'dedicated-notetaker':
      return <StickyNote className="w-5 h-5 text-purple-400" />;
    default:
      return <Award className="w-5 h-5 text-amber-400" />;
  }
}

// Target numbers for progress calculation
function getBadgeProgress(badgeId: string, stats: StudentStats): { current: number; target: number; percent: number } {
  let current = 0;
  let target = 1;

  switch (badgeId) {
    case 'first-step':
      current = stats.completedChaptersCount;
      target = 1;
      break;
    case 'fast-learner':
      current = stats.completedChaptersCount;
      target = 5;
      break;
    case 'halfway-hero':
      current = stats.completedChaptersCount;
      target = 12;
      break;
    case 'master-graduate':
      current = stats.completedChaptersCount;
      target = 25;
      break;
    case 'bug-buster':
      current = stats.completedQuizzesCount;
      target = 1;
      break;
    case 'master-bug-hunter':
      current = stats.completedQuizzesCount;
      target = 6;
      break;
    case 'capstone-engineer':
      current = stats.completedExamPartsCount;
      target = 1;
      break;
    case 'legend-developer':
      current = stats.completedExamPartsCount;
      target = 6;
      break;
    case 'code-crafter':
      current = stats.savedSnippetsCount;
      target = 1;
      break;
    case 'dedicated-notetaker':
      current = stats.notesCount;
      target = 1;
      break;
    default:
      current = 0;
      target = 1;
  }

  const clamped = Math.min(current, target);
  const percent = target > 0 ? Math.round((clamped / target) * 100) : 0;
  return { current, target, percent };
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  isOpen,
  onClose,
  stats,
  studentName,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const modalContentRef = useFocusTrap<HTMLDivElement>({
    isOpen,
    onClose,
    returnFocus: true,
  });

  const unlockedBadges = useMemo(() => ALL_BADGES.filter((b) => b.isUnlocked(stats)), [stats]);
  const lockedBadges = useMemo(() => ALL_BADGES.filter((b) => !b.isUnlocked(stats)), [stats]);
  const progressPercent = Math.round((unlockedBadges.length / ALL_BADGES.length) * 100);

  // Find next achievable badge (locked badge with highest progress)
  const nextTargetBadge = useMemo(() => {
    if (lockedBadges.length === 0) return null;
    return lockedBadges.reduce((best, current) => {
      const progCurrent = getBadgeProgress(current.id, stats).percent;
      const progBest = getBadgeProgress(best.id, stats).percent;
      return progCurrent > progBest ? current : best;
    }, lockedBadges[0]);
  }, [lockedBadges, stats]);

  // Filtered badges by category
  const filteredBadges = useMemo(() => {
    if (selectedCategory === 'all') return ALL_BADGES;
    if (selectedCategory === 'chapters') return ALL_BADGES.filter((b) => b.category === 'chapters');
    if (selectedCategory === 'bughunter') return ALL_BADGES.filter((b) => b.category === 'bughunter');
    if (selectedCategory === 'capstones') return ALL_BADGES.filter((b) => b.category === 'capstones');
    if (selectedCategory === 'workspace') return ALL_BADGES.filter((b) => b.category === 'playground' || b.category === 'notes');
    return ALL_BADGES;
  }, [selectedCategory]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="أوسمة الشرف والإنجازات"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 font-['Cairo',sans-serif]"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/85 backdrop-blur-md transition-opacity animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div
        ref={modalContentRef}
        className="relative z-10 w-full max-w-3xl bg-slate-900 border border-amber-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh] animate-scaleUp"
      >
        {/* Header Hero */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-amber-950/40 via-indigo-950/40 to-slate-900 border-b border-slate-800 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-2xl shadow-lg shadow-amber-500/10 shrink-0">
                <Trophy className="w-6 h-6 text-amber-400" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight">
                    أوسمة الشرف والإنجازات
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold font-mono shrink-0">
                    <span dir="ltr">{unlockedBadges.length} / {ALL_BADGES.length}</span> مفتوحة
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 font-sans">
                  {studentName ? `سجل إنجازات البطل: ${studentName}` : 'مستواك وتقدمك البرمجي في المسار'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700 transition shrink-0"
              title="إغلاق"
              aria-label="إغلاق نافذة الأوسمة"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Overall Progress Bar */}
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between text-xs text-slate-300 font-semibold">
              <span>نسبة اكتمال أوسمة المنصة:</span>
              <span dir="ltr" className="text-amber-400 font-bold font-mono text-xs">{progressPercent}%</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full transition-all duration-500 shadow-md shadow-amber-500/20"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Spotlight: Next Target Badge Banner */}
          {nextTargetBadge && progressPercent < 100 && (
            <div className="bg-slate-950/70 border border-amber-500/25 p-3 rounded-2xl flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/30 shrink-0">
                  <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400 text-[11px] font-bold">الوسام التالي لتحقيقه:</span>
                    <strong className="text-amber-300 font-bold truncate">{nextTargetBadge.title.replace(/[^\u0600-\u06FF\s\w]/g, '').trim()}</strong>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">{nextTargetBadge.description}</p>
                </div>
              </div>

              <div className="text-right shrink-0 font-mono text-amber-400 font-bold text-xs bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                <span dir="ltr">{getBadgeProgress(nextTargetBadge.id, stats).percent}%</span>
              </div>
            </div>
          )}

          {/* 100% Completion Celebration Banner */}
          {progressPercent === 100 && (
            <div className="bg-emerald-950/40 border-2 border-emerald-500/50 p-3.5 rounded-2xl flex items-center gap-3 text-xs text-emerald-200">
              <Sparkles className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <strong className="text-emerald-300 block text-sm font-black">إنجاز أسطوري مكتمل 100%!</strong>
                <span>أنت الآن حاصل على جميع أوسمة المنصة.. مبرمج مصري محترف ومتقن لكل الأدوات!</span>
              </div>
            </div>
          )}

          {/* Category Tabs */}
          <div
            role="tablist"
            aria-label="تصنيفات الأوسمة"
            className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs select-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {[
              { id: 'all', label: 'الكل', count: ALL_BADGES.length, unlocked: unlockedBadges.length },
              { id: 'chapters', label: 'فصول الكورس', count: 4, unlocked: unlockedBadges.filter((b) => b.category === 'chapters').length },
              { id: 'bughunter', label: 'صيد الأخطاء', count: 2, unlocked: unlockedBadges.filter((b) => b.category === 'bughunter').length },
              { id: 'capstones', label: 'المشاريع الشاملة', count: 2, unlocked: unlockedBadges.filter((b) => b.category === 'capstones').length },
              { id: 'workspace', label: 'المحرر والملاحظات', count: 2, unlocked: unlockedBadges.filter((b) => b.category === 'playground' || b.category === 'notes').length },
            ].map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setSelectedCategory(cat.id as CategoryFilter)}
                  className={`min-h-[36px] px-3.5 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap flex items-center gap-1.5 shrink-0 ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
                      : 'bg-slate-950/60 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span
                    dir="ltr"
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                      isSelected ? 'bg-slate-950/20 text-slate-950 font-black' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {cat.unlocked}/{cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Badges Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar">
          {filteredBadges.length === 0 ? (
            <div className="py-12 text-center text-slate-500 space-y-2">
              <Award className="w-10 h-10 mx-auto opacity-30 text-amber-400" />
              <p className="text-sm font-semibold">لا توجد أوسمة في هذا القسم حالياً</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {filteredBadges.map((badge) => {
                const unlocked = badge.isUnlocked(stats);
                const prog = getBadgeProgress(badge.id, stats);

                return (
                  <div
                    key={badge.id}
                    className={`p-4 rounded-2xl border transition-all relative overflow-hidden flex flex-col justify-between gap-3 ${
                      unlocked
                        ? 'bg-gradient-to-br from-amber-950/20 via-slate-900 to-slate-950 border-amber-500/40 shadow-lg shadow-amber-500/5'
                        : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      {/* Badge Lucide Icon Container */}
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border shadow-inner ${
                          unlocked
                            ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                            : 'bg-slate-900 border-slate-800 text-slate-500'
                        }`}
                      >
                        {getBadgeIcon(badge.id)}
                      </div>

                      {/* Badge Details */}
                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 flex-wrap">
                          <h4
                            className={`text-sm font-black truncate ${
                              unlocked ? 'text-amber-300' : 'text-slate-200'
                            }`}
                          >
                            {badge.title.replace(/[^\u0600-\u06FF\s\w]/g, '').trim()}
                          </h4>
                          {unlocked ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/40">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                              <span>مفتوح ✓</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-400 bg-slate-900 px-2 py-0.5 rounded-full border border-slate-800">
                              <Lock className="w-3 h-3 text-slate-500" />
                              <span>مقفل</span>
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed font-sans">
                          {badge.description}
                        </p>
                      </div>
                    </div>

                    {/* Progress Sub-Bar */}
                    <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] font-medium font-mono">
                        <span className="text-slate-400 font-sans">التقدم:</span>
                        <span className={unlocked ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                          {badge.progressText(stats)}
                        </span>
                      </div>

                      <div className="w-full h-1.5 rounded-full bg-slate-950 overflow-hidden border border-slate-800/80">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            unlocked
                              ? 'bg-emerald-500 shadow-sm shadow-emerald-500/30'
                              : 'bg-amber-500/80'
                          }`}
                          style={{ width: `${prog.percent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-medium">
          <span className="hidden xs:inline">كل خطوة وتمرين تكمله يقربك من وسام جديد 🌟</span>
          <button
            onClick={onClose}
            className="min-h-[40px] px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs transition active:scale-95 shadow-md shadow-amber-500/20 mr-auto xs:mr-0"
          >
            استمر في التعلم 🚀
          </button>
        </div>
      </div>
    </div>
  );
};
