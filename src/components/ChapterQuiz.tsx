import React, { useState } from 'react';
import { ChapterQuizItem } from '../types';
import { FormattedArabicText } from './FormattedArabicText';
import { useSoundManager } from '../hooks/useSoundManager';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  Sparkles,
  RotateCcw,
  ArrowLeft,
  ArrowRight,
  Code2,
  Trophy,
} from 'lucide-react';

interface ChapterQuizProps {
  chapterId: number | string;
  quiz: ChapterQuizItem[];
  chapterTitle: string;
  onComplete?: () => void;
  onScrollToChallenge?: () => void;
}

export const ChapterQuiz: React.FC<ChapterQuizProps> = ({
  chapterId,
  quiz,
  chapterTitle,
  onComplete,
  onScrollToChallenge,
}) => {
  const storageKey = `zaki_quiz_state_ch_${chapterId}`;

  // Initialize state from localStorage if available
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed.selectedAnswers === 'object') {
          return parsed.selectedAnswers;
        }
      }
    } catch {}
    return {};
  });

  const [isFinished, setIsFinished] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.isFinished === 'boolean') {
          return parsed.isFinished;
        }
      }
    } catch {}
    return false;
  });

  const [currentIdx, setCurrentIdx] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.currentIdx === 'number' && parsed.currentIdx < quiz.length) {
          return parsed.currentIdx;
        }
      }
    } catch {}
    return 0;
  });

  const { playSuccess, playError, playCompletion } = useSoundManager();

  // Synchronize state changes with localStorage
  const saveStateToStorage = (answers: Record<string, string>, finished: boolean, idx: number) => {
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          selectedAnswers: answers,
          isFinished: finished,
          currentIdx: idx,
          updatedAt: Date.now(),
        })
      );
    } catch {}
  };

  // Re-sync when chapterId changes
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed) {
          setSelectedAnswers(parsed.selectedAnswers || {});
          setIsFinished(!!parsed.isFinished);
          setCurrentIdx(Math.min(parsed.currentIdx || 0, Math.max(0, quiz.length - 1)));
          return;
        }
      }
    } catch {}
    setSelectedAnswers({});
    setIsFinished(false);
    setCurrentIdx(0);
  }, [chapterId, storageKey, quiz.length]);

  if (!quiz || quiz.length === 0) return null;

  const currentQ = quiz[currentIdx] || quiz[0];
  const selectedOptionId = selectedAnswers[currentQ.id];
  const selectedOption = currentQ.options.find((o) => o.id === selectedOptionId);
  const isAnswered = !!selectedOption;

  const handleSelectOption = (optionId: string) => {
    if (isAnswered) return; // Prevent changing answer once selected

    const newAnswers = { ...selectedAnswers, [currentQ.id]: optionId };
    setSelectedAnswers(newAnswers);

    // If all questions are answered, mark as completed
    const allAnswered = quiz.every((q) => !!newAnswers[q.id]);
    const chosenOption = currentQ.options.find((o) => o.id === optionId);

    if (allAnswered) {
      playCompletion();
      saveStateToStorage(newAnswers, isFinished, currentIdx);
      if (onComplete) onComplete();
    } else {
      if (chosenOption?.isCorrect) {
        playSuccess();
      } else {
        playError();
      }
      saveStateToStorage(newAnswers, isFinished, currentIdx);
    }
  };

  const handleNext = () => {
    if (currentIdx < quiz.length - 1) {
      const nextIdx = currentIdx + 1;
      setCurrentIdx(nextIdx);
      saveStateToStorage(selectedAnswers, isFinished, nextIdx);
    } else {
      setIsFinished(true);
      saveStateToStorage(selectedAnswers, true, currentIdx);
      if (onComplete) onComplete();
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      const prevIdx = currentIdx - 1;
      setCurrentIdx(prevIdx);
      saveStateToStorage(selectedAnswers, isFinished, prevIdx);
    }
  };

  // Full Reset
  const handleReset = () => {
    setSelectedAnswers({});
    setCurrentIdx(0);
    setIsFinished(false);
    try {
      localStorage.removeItem(storageKey);
    } catch {}
  };

  // Retry ONLY Incorrect Questions
  const wrongQuestions = quiz.filter((q) => {
    const ansId = selectedAnswers[q.id];
    if (!ansId) return true;
    const opt = q.options.find((o) => o.id === ansId);
    return !opt?.isCorrect;
  });

  const handleRetryWrongOnly = () => {
    const updatedAnswers = { ...selectedAnswers };
    wrongQuestions.forEach((q) => {
      delete updatedAnswers[q.id];
    });

    // Find the index of the first wrong question in the original quiz
    const firstWrongIdx = quiz.findIndex((q) => wrongQuestions.some((wq) => wq.id === q.id));
    const targetIdx = firstWrongIdx >= 0 ? firstWrongIdx : 0;

    setSelectedAnswers(updatedAnswers);
    setCurrentIdx(targetIdx);
    setIsFinished(false);
    saveStateToStorage(updatedAnswers, false, targetIdx);
  };

  // Calculate score
  const correctCount = quiz.filter((q) => {
    const ansId = selectedAnswers[q.id];
    const opt = q.options.find((o) => o.id === ansId);
    return opt?.isCorrect;
  }).length;

  const optionLabels = ['أ', 'ب', 'ج', 'د'];

  return (
    <section className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 rounded-3xl border border-indigo-500/20 p-5 sm:p-7 space-y-6 shadow-xl relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold text-lg shrink-0">
            ⚡
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-white">
                كويز الفصل السريع: اختبر فهمك
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              تأكد من استيعابك للمفاهيم الأساسية قبل الدخول في التحدي البرمجي العملي!
            </p>
          </div>
        </div>

        {/* Question Counter / Progress indicator */}
        {!isFinished ? (
          <div className="flex items-center gap-2 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800 text-xs text-slate-400 self-start sm:self-auto font-sans">
            <span>السؤال</span>
            <span className="font-bold text-amber-400 font-mono text-sm">
              {currentIdx + 1}
            </span>
            <span>من</span>
            <span className="font-mono text-slate-300">{quiz.length}</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 bg-indigo-500/15 text-indigo-300 px-3 py-1.5 rounded-xl border border-indigo-500/30 text-xs font-bold font-sans self-start sm:self-auto">
            <span>اكتمل الكويز ✓</span>
          </div>
        )}
      </div>

      {/* Quiz Body */}
      {!isFinished ? (
        <div className="space-y-5 animate-fadeIn">
          {/* Question Text */}
          <div className="text-sm sm:text-base font-bold text-slate-100 leading-relaxed text-right dir-rtl">
            <FormattedArabicText text={currentQ.question} />
          </div>

          {/* Optional Code Snippet inside Question */}
          {currentQ.codeSnippet && (
            <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 text-xs">
              <div className="bg-slate-900/80 px-3 py-1.5 text-slate-400 text-[10px] flex items-center gap-1.5 border-b border-slate-800 font-mono dir-ltr">
                <Code2 className="w-3.5 h-3.5 text-amber-400" />
                <span>JavaScript</span>
              </div>
              <pre className="p-3 text-amber-200 overflow-x-auto font-mono text-xs leading-relaxed dir-ltr text-left">
                <code>{currentQ.codeSnippet}</code>
              </pre>
            </div>
          )}

          {/* Options List */}
          <div className="grid gap-2.5">
            {currentQ.options.map((opt, oIdx) => {
              const isSelected = selectedOptionId === opt.id;
              const showResult = isAnswered;

              let btnStyle =
                'bg-slate-950/80 hover:bg-slate-800/80 border-slate-800 text-slate-200';
              let badgeStyle = 'bg-slate-800 text-slate-400 border-slate-700';

              if (showResult) {
                if (opt.isCorrect) {
                  btnStyle =
                    'bg-emerald-950/60 border-emerald-500/60 text-emerald-200 shadow-md shadow-emerald-500/10';
                  badgeStyle = 'bg-emerald-500 text-slate-950 border-emerald-400';
                } else if (isSelected && !opt.isCorrect) {
                  btnStyle =
                    'bg-rose-950/60 border-rose-500/60 text-rose-200 shadow-md shadow-rose-500/10';
                  badgeStyle = 'bg-rose-500 text-white border-rose-400';
                } else {
                  btnStyle = 'opacity-40 border-slate-800 bg-slate-950/40 text-slate-400';
                }
              }

              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelectOption(opt.id)}
                  disabled={isAnswered}
                  className={`w-full text-right p-3.5 sm:p-4 rounded-2xl border transition flex items-center justify-between gap-3 text-xs sm:text-sm font-sans ${btnStyle} ${
                    !isAnswered ? 'cursor-pointer active:scale-[0.99]' : 'cursor-default'
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <span
                      className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 border ${badgeStyle}`}
                    >
                      {optionLabels[oIdx] || oIdx + 1}
                    </span>
                    <span className="leading-relaxed font-medium flex-1 text-right">
                      <FormattedArabicText text={opt.text} />
                    </span>
                  </div>

                  {/* Result Icons */}
                  {showResult && (
                    <div className="shrink-0">
                      {opt.isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 animate-bounce" />
                      ) : isSelected ? (
                        <XCircle className="w-5 h-5 text-rose-400" />
                      ) : null}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Box on Answer */}
          {selectedOption && (
            <div
              className={`p-4 rounded-2xl border text-xs sm:text-sm leading-relaxed animate-fadeIn space-y-1.5 font-sans ${
                selectedOption.isCorrect
                  ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-200'
                  : 'bg-rose-950/50 border-rose-500/40 text-rose-200'
              }`}
            >
              <div className="font-bold flex items-center gap-1.5">
                {selectedOption.isCorrect ? (
                  <>
                    <span>🎉 إجابة صحيحة وممتازة!</span>
                  </>
                ) : (
                  <>
                    <span>💡 مش بالظبط.. ركز في دي:</span>
                  </>
                )}
              </div>
              <p className="text-slate-300 opacity-95">
                <FormattedArabicText text={selectedOption.explanation} />
              </p>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handlePrev}
              disabled={currentIdx === 0}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span>السؤال السابق</span>
            </button>

            {isAnswered && (
              <button
                onClick={handleNext}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25 transition active:scale-95 animate-fadeIn"
              >
                <span>
                  {currentIdx < quiz.length - 1 ? 'السؤال التالي' : 'عرض النتيجة النهائية'}
                </span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Quiz Summary / Completion Screen */
        <div className="text-center py-6 space-y-5 animate-fadeIn">
          {(() => {
            const isPerfect = correctCount === quiz.length;
            const isPassing = correctCount >= Math.ceil(quiz.length / 2);
            const hasPartial = correctCount > 0 && !isPassing;
            const isZero = correctCount === 0;

            const scoreIcon = isPerfect ? '🏆' : isPassing ? '👏' : hasPartial ? '💡' : '📚';

            const scoreTitle = isPerfect
              ? 'علامة كاملة! استيعاب 10/10 يا بطل 🚀'
              : isZero
              ? `لم توفق في الإجابة على أي سؤال (0 من ${quiz.length})`
              : correctCount === 1
              ? `جاوبت على سؤال واحد صحيح من أصل ${quiz.length}`
              : correctCount === 2
              ? `جاوبت على سؤالين صحيحين من أصل ${quiz.length}`
              : `جاوبت على ${correctCount} من أصل ${quiz.length} أسئلة صحيحة!`;

            const scoreSubtitle = isPerfect
              ? `أنت جاهز تماماً ومستوعب لكل المفاهيم، انطلق لخوض التحدي البرمجي العملي للفصل: "${chapterTitle}".`
              : isPassing
              ? 'أداء جيد جداً! يمكنك إعادة المحاولة للحصول على الدرجة الكاملة أو المتابعة للتحدي العملي.'
              : hasPartial
              ? 'محاولة طيبة! يُفضّل مراجعة فقرات الفصل السابقة وإعادة الكويز لترسيخ المفاهيم قبل البدء في كتابة الكود.'
              : 'ولا يهمك، الخطأ أول طريق التعلّم! أعد قراءة شرح الفصل بتمعّن ثم جرّب الكويز مرة أخرى لتثبيت المعلومات.';

            return (
              <>
                <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-500 to-indigo-500 text-slate-950 mx-auto flex items-center justify-center text-3xl shadow-xl shadow-indigo-500/20">
                  {scoreIcon}
                </div>

                <div className="space-y-1">
                  <h4 className="text-lg sm:text-xl font-black text-white">
                    {scoreTitle}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
                    {scoreSubtitle}
                  </p>
                </div>
              </>
            );
          })()}

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {wrongQuestions.length > 0 && (
              <button
                onClick={handleRetryWrongOnly}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25 transition active:scale-95 animate-pulse"
                title="إعادة حل الأسئلة التي أخطأت فيها فقط والاحتفاظ بالإجابات الصحيحة"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>
                  إعادة تجربة الأسئلة الخاطئة فقط ({wrongQuestions.length === 1 ? 'سؤال واحد' : wrongQuestions.length === 2 ? 'سؤالان' : `${wrongQuestions.length} أسئلة`})
                </span>
              </button>
            )}

            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition"
              title="إعادة الكويز من البداية ومسح جميع الإجابات"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>إعادة الكويز كاملاً</span>
            </button>

            {onScrollToChallenge && (
              <button
                onClick={onScrollToChallenge}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20 transition active:scale-95"
              >
                <Trophy className="w-4 h-4" />
                <span>انطلق للتحدي العملي الآن 🔥</span>
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
