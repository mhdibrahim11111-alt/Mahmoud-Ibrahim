import React from 'react';
import { ALL_BADGES, StudentStats, Badge } from '../types/achievements';
import { Trophy, X, CheckCircle2, Lock, Sparkles, Award } from 'lucide-react';

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: StudentStats;
  studentName?: string;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  isOpen,
  onClose,
  stats,
  studentName,
}) => {
  if (!isOpen) return null;

  const unlockedBadges = ALL_BADGES.filter((b) => b.isUnlocked(stats));
  const progressPercent = Math.round((unlockedBadges.length / ALL_BADGES.length) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 font-['Cairo',sans-serif]">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-3xl bg-slate-900 border border-amber-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh] animate-scaleUp">
        {/* Header Hero */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-amber-950/40 via-indigo-950/40 to-slate-900 border-b border-slate-800">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-2xl shadow-lg shadow-amber-500/10 shrink-0">
                🏆
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg sm:text-2xl font-black text-white">
                    أوسمة الشرف والإنجازات
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold shrink-0">
                    {unlockedBadges.length} من {ALL_BADGES.length} مفتوحة
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300">
                  {studentName ? `سجل إنجازات البطل: ${studentName}` : 'مستواك وتقدمك البرمجي في المسار'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700 transition shrink-0"
              title="إغلاق"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mt-5 space-y-1.5">
            <div className="flex justify-between text-xs text-slate-300 font-semibold">
              <span>نسبة الأوسمة المكتسبة:</span>
              <span className="text-amber-400 font-bold">{progressPercent}%</span>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full transition-all duration-500 shadow-md shadow-amber-500/20"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Badges Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {ALL_BADGES.map((badge) => {
              const unlocked = badge.isUnlocked(stats);

              return (
                <div
                  key={badge.id}
                  className={`p-4 rounded-2xl border transition relative overflow-hidden flex items-start gap-3.5 ${
                    unlocked
                      ? 'bg-gradient-to-br from-amber-950/20 to-slate-950 border-amber-500/40 shadow-lg shadow-amber-500/5'
                      : 'bg-slate-950/50 border-slate-800/80 opacity-60 grayscale'
                  }`}
                >
                  {/* Badge Icon */}
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 border ${
                      unlocked
                        ? 'bg-amber-500/20 border-amber-500/40 shadow-inner'
                        : 'bg-slate-900 border-slate-800'
                    }`}
                  >
                    {badge.icon}
                  </div>

                  {/* Badge Details */}
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <h4
                        className={`text-sm font-black ${
                          unlocked ? 'text-amber-300' : 'text-slate-300'
                        }`}
                      >
                        {badge.title}
                      </h4>
                      {unlocked ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-500/30">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>تم فتحه</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] text-slate-500 bg-slate-900 px-2 py-0.5 rounded-full border border-slate-800">
                          <Lock className="w-3 h-3" />
                          <span>مقفل</span>
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed font-medium">
                      {badge.description}
                    </p>

                    <div className="pt-1 text-[10px] font-bold text-slate-400 font-mono flex items-center justify-between">
                      <span>التقدم:</span>
                      <span className={unlocked ? 'text-emerald-400' : 'text-slate-400'}>
                        {badge.progressText(stats)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>كل خطوة وتمرين تكمله يقربك من وسام جديد 🌟</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition"
          >
            استمر في التعلم 🚀
          </button>
        </div>
      </div>
    </div>
  );
};
