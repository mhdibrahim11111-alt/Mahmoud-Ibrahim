import React, { useState, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Part, PartComprehensiveExam } from '../types';
import { ChapterQuiz } from './ChapterQuiz';
import { CodeBlock } from './CodeBlock';
import { FormattedArabicText } from './FormattedArabicText';
import { runJavaScript } from '../utils/codeRunner';
import { validateChallenge, ChallengeValidationResult } from '../utils/challengeValidator';
import { partSummaryDetails, RuleDetail } from '../data/partSummaryDetails';
import { useSoundManager } from '../hooks/useSoundManager';

const CodeEditor = lazy(() =>
  import('./CodeEditor').then((module) => ({ default: module.CodeEditor }))
);
import {
  Trophy,
  CheckCircle2,
  Play,
  RotateCcw,
  HelpCircle,
  Eye,
  ArrowRight,
  ArrowLeft,
  Terminal,
  BookOpen,
  ClipboardList,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Lightbulb,
  Sparkles,
  Zap,
} from 'lucide-react';

import type { Variants } from 'framer-motion';

const rulesContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const ruleCardVariants: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring' as const,
      damping: 20,
      stiffness: 280,
    },
  },
};

interface PartSummaryViewProps {
  part: Part;
  summary: PartComprehensiveExam;
  onPrevChapter?: () => void;
  onNextPart?: () => void;
  isCompleted?: boolean;
  onToggleCompleted?: () => void;
  onOpenInPlayground?: (code: string) => void;
}

export const PartSummaryView = React.memo<PartSummaryViewProps>(({
  part,
  summary,
  onPrevChapter,
  onNextPart,
  isCompleted = false,
  onToggleCompleted,
  onOpenInPlayground,
}) => {
  const [challengeCode, setChallengeCode] = useState(summary.challenge.initialCode);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState<{ logs: string[]; errors: string[] } | null>(null);
  const [feedback, setFeedback] = useState<ChallengeValidationResult | null>(null);
  const { playCompletion, playError, playRun } = useSoundManager();

  // Instant expandable rule details
  const [expandedRuleIndex, setExpandedRuleIndex] = useState<number | null>(null);

  // Reset challenge code when summary/part changes
  React.useEffect(() => {
    setChallengeCode(summary.challenge.initialCode);
    setOutput(null);
    setFeedback(null);
    setShowHint(false);
    setShowSolution(false);
    setExpandedRuleIndex(null);
  }, [summary.id]);

  const handleToggleRule = (idx: number) => {
    setExpandedRuleIndex((prev) => (prev === idx ? null : idx));
  };

  const handleRunChallenge = async () => {
    playRun();
    setIsRunning(true);
    const res = await runJavaScript(challengeCode);
    const validation = validateChallenge(
      summary.challenge.id,
      challengeCode,
      res.logs,
      res.errors
    );

    setOutput({ logs: res.logs, errors: res.errors });
    setFeedback(validation);
    setIsRunning(false);

    if (validation.passed) {
      playCompletion();
      if (onToggleCompleted && !isCompleted) {
        onToggleCompleted();
      }
    } else {
      playError();
    }
  };

  return (
    <article className="max-w-4xl mx-auto px-3 sm:px-4 py-6 sm:py-10 space-y-10 animate-fadeIn w-full font-['Cairo',sans-serif] pb-32 sm:pb-36 lg:pb-12">
      {/* Top Banner: Part Summary Hero */}
      <div className="bg-gradient-to-r from-amber-950/40 via-indigo-950/40 to-slate-900 p-6 sm:p-8 rounded-3xl border border-amber-500/30 shadow-2xl relative overflow-hidden space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold">
              <ClipboardList className="w-3.5 h-3.5 text-amber-400" />
              <span>ملخص {part.title.split(':')[0]} • ختام الجزء</span>
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              ملخص {part.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed max-w-2xl">
              خلاصة مركزة لكافة القواعد البرمجية، يليها تحدٍّ برمجي شامل يجمع كل المفاهيم التي تم دراستها في فصول هذا الجزء فقط.
            </p>
          </div>

          {onToggleCompleted && (
            <button
              onClick={onToggleCompleted}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition shrink-0 self-start sm:self-center shadow-md active:scale-95 ${
                isCompleted
                  ? 'bg-emerald-500/20 text-emerald-300 border-2 border-emerald-500/50 shadow-lg shadow-emerald-500/10'
                  : 'bg-slate-800/90 text-white hover:bg-slate-700 border-2 border-slate-600 hover:border-amber-400 shadow-md'
              }`}
            >
              <CheckCircle2 className={`w-4 h-4 ${isCompleted ? 'text-emerald-400' : 'text-amber-400'}`} />
              <span>{isCompleted ? 'تم إتمام ملخص وتحدي الجزء 🏆' : 'تحديد كمكتمل'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Section 1: Part Summary Key Points (الكبسولة البرمجية مع التوضيح الفوري السريع) */}
      {summary.keyPoints && summary.keyPoints.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="bg-slate-900/80 rounded-3xl border border-slate-800 p-5 sm:p-7 space-y-5 shadow-xl"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ scale: [1, 1.1, 1], rotate: [0, 4, -4, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold text-lg shrink-0"
              >
                💡
              </motion.div>
              <div>
                <h2 className="text-base sm:text-lg font-black text-white">
                  كبسولة الجزء: أهم القواعد والمفاهيم الذهبية والاستنتاجات
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  اضغط على أي قاعدة لعرض كود عملي وتوضيح بمثال من الحياة اليومية فوراً!
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-800 text-amber-300 border border-slate-700 self-start sm:self-auto">
              {summary.keyPoints.length} قواعد أساسية
            </span>
          </div>

          {/* Cards Grid with Instant Details */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={rulesContainerVariants}
            className="grid gap-3.5 sm:grid-cols-2"
          >
            {summary.keyPoints.map((point, idx) => {
              const isExpanded = expandedRuleIndex === idx;
              const ruleDetail: RuleDetail =
                partSummaryDetails[part.id]?.[idx] || {
                  codeSnippet: `// مثال عملي:\nconsole.log("تطبيق لقاعدة الجزء ${part.id}");`,
                  explanation: 'تطبيق مباشر لهذه القاعدة لترسيخ المفهوم البرمجي وكتابة كود سليم.',
                  realLifeAnalogy: 'تخيلها كخطوة أساسية في وصفة: الالتزام بيها يضمن نجاح المطلوب بدقة!',
                };

              return (
                <motion.div
                  key={idx}
                  variants={ruleCardVariants}
                  whileHover={{ scale: 1.012 }}
                  transition={{ type: 'spring', damping: 18, stiffness: 300 }}
                  className={`rounded-2xl border transition duration-200 overflow-hidden ${
                    isExpanded
                      ? 'bg-slate-950 border-amber-500/50 shadow-xl shadow-amber-500/5 sm:col-span-2'
                      : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  {/* Card Header / Main Point */}
                  <div
                    onClick={() => handleToggleRule(idx)}
                    className="p-3.5 sm:p-4 flex items-start justify-between gap-3 cursor-pointer select-none group"
                  >
                    <div className="flex items-start gap-3 flex-1">
                      <span className="w-6 h-6 rounded-lg bg-amber-500/10 text-amber-400 font-bold text-xs flex items-center justify-center shrink-0 border border-amber-500/20 group-hover:bg-amber-500 group-hover:text-slate-950 transition">
                        {idx + 1}
                      </span>
                      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                        <FormattedArabicText text={point} />
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 self-center">
                      <span
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition flex items-center gap-1 ${
                          isExpanded
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            : 'bg-slate-800/90 text-slate-300 border-slate-700 group-hover:bg-amber-500/15 group-hover:text-amber-300 group-hover:border-amber-500/30'
                        }`}
                      >
                        <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                        <span>{isExpanded ? 'إخفاء' : 'مثال وتوضيح'}</span>
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-amber-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-amber-400" />
                      )}
                    </div>
                  </div>

                  {/* Expanded Explanation & Code Example with AnimatePresence */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="border-t border-slate-800/80 p-4 sm:p-5 bg-gradient-to-b from-slate-900/60 to-slate-950 space-y-4 overflow-hidden"
                      >
                        {/* Code Snippet Box */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-[11px] text-slate-400 font-sans">
                            <span className="flex items-center gap-1.5 text-amber-400 font-bold">
                              <Terminal className="w-3.5 h-3.5" />
                              <span>كود جافاسكريبت عملي:</span>
                            </span>

                            {onOpenInPlayground && (
                              <button
                                onClick={(e) => {
                                 e.stopPropagation();
                                 onOpenInPlayground(ruleDetail.codeSnippet);
                                }}
                                className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 transition"
                              >
                                <span>افتح في محرر الكود 💻</span>
                                <ExternalLink className="w-3 h-3" />
                              </button>
                            )}
                          </div>

                          <div className="rounded-xl overflow-hidden border border-slate-800 text-xs">
                            <CodeBlock code={ruleDetail.codeSnippet} />
                          </div>
                        </div>

                        {/* Explanation & Real-life Analogy */}
                        <div className="grid sm:grid-cols-2 gap-3 text-xs leading-relaxed">
                          {/* Explanation Box */}
                          <div className="p-3.5 rounded-xl bg-indigo-950/20 border border-indigo-500/25 space-y-1">
                            <span className="font-bold text-indigo-300 flex items-center gap-1.5">
                              <Lightbulb className="w-3.5 h-3.5 text-indigo-400" />
                              <span>الشرح والتوضيح:</span>
                            </span>
                            <p className="text-slate-300 font-medium leading-relaxed">
                              <FormattedArabicText text={ruleDetail.explanation} />
                            </p>
                          </div>

                          {/* Real-life Analogy Box */}
                          <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/25 space-y-1">
                            <span className="font-bold text-amber-300 flex items-center gap-1.5">
                              <span>☕ تشبيه من الحياة اليومية:</span>
                            </span>
                            <p className="text-slate-300 font-medium leading-relaxed">
                              <FormattedArabicText text={ruleDetail.realLifeAnalogy} />
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.section>
      )}

      {/* Section 2: Comprehensive Part Quiz (كويز استيعاب الملخص) */}
      {summary.quiz && summary.quiz.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-white font-bold text-base sm:text-lg">
            <span className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center text-sm font-black">
              ⚡
            </span>
            <h3>كويز مراجعة الملخص ({summary.quiz.length} أسئلة)</h3>
          </div>

          <ChapterQuiz
            key={`part-summary-quiz-${summary.id}`}
            chapterId={summary.id}
            quiz={summary.quiz}
            chapterTitle={summary.title}
            onScrollToChallenge={() => {
              const el = document.getElementById('part-summary-capstone-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        </section>
      )}

      {/* Section 3: Comprehensive Capstone Challenge (التحدي البرمجي الشامل) */}
      <section
        id="part-summary-capstone-section"
        className="space-y-4 pt-6 border-t border-slate-800"
      >
        <div className="flex items-center gap-2 text-white font-bold text-base sm:text-lg">
          <span className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center text-sm font-black">
            🚀
          </span>
          <h3>التحدي البرمجي الشامل لفصول هذا الجزء</h3>
        </div>

        <div className="bg-gradient-to-b from-amber-950/20 via-slate-900 to-slate-950 rounded-3xl border border-amber-500/30 p-5 sm:p-7 space-y-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500 text-slate-950 font-black text-xl">
              🎯
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                <FormattedArabicText text={summary.challenge.title} />
              </h3>
              <p className="text-xs text-amber-300/80">
                مشروع تطبيقي يجمع كل المفاهيم التي تم دراستها في فصول هذا الجزء فقط
              </p>
            </div>
          </div>

          <div className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium bg-slate-950/80 p-4 rounded-2xl border border-amber-500/20">
            <FormattedArabicText text={summary.challenge.prompt} />
          </div>

          {/* Code Editor Area */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
              <span>اكتب كود الحل الشامل هنا:</span>
              <div className="flex items-center gap-3">
                {summary.challenge.hint && (
                  <button
                    onClick={() => setShowHint(!showHint)}
                    className="text-amber-400 hover:text-amber-300 text-xs font-semibold flex items-center gap-1"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>{showHint ? 'إخفاء التلميح' : 'عايز تلميح؟ 💡'}</span>
                  </button>
                )}
                {summary.challenge.solutionCode && (
                  <button
                    onClick={() => setShowSolution(!showSolution)}
                    className="text-slate-400 hover:text-slate-200 text-xs font-semibold flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{showSolution ? 'إخفاء الحل' : 'عرض الحل النموذجي 🔑'}</span>
                  </button>
                )}
              </div>
            </div>

            {showHint && summary.challenge.hint && (
              <div className="p-3.5 bg-amber-950/40 rounded-xl border border-amber-500/30 text-xs text-amber-200 animate-fadeIn">
                <strong>💡 تلميح: </strong>
                <FormattedArabicText text={summary.challenge.hint} />
              </div>
            )}

            {showSolution && summary.challenge.solutionCode && (
              <div className="rounded-xl border border-slate-700 overflow-hidden text-xs animate-fadeIn">
                <div className="bg-slate-900 px-3 py-1.5 text-right text-slate-400 text-[10px] dir-rtl font-sans border-b border-slate-800">
                  كود الحل النموذجي المقترح:
                </div>
                <CodeBlock code={summary.challenge.solutionCode} />
              </div>
            )}

            <div className="rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
              <Suspense
                fallback={
                  <div className="h-64 sm:h-72 bg-slate-950/80 flex flex-col items-center justify-center gap-2 text-slate-400 text-sm">
                    <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                    <span>تجهيز محرر الأكواد...</span>
                  </div>
                }
              >
                <CodeEditor
                  value={challengeCode}
                  onChange={setChallengeCode}
                  onRun={handleRunChallenge}
                  placeholder="// اكتب كود التحدي الشامل هنا..."
                  className="h-64 sm:h-72"
                />
              </Suspense>
            </div>

            {/* Actions Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
              <button
                onClick={() => {
                  setChallengeCode(summary.challenge.initialCode);
                  setOutput(null);
                  setFeedback(null);
                }}
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>استعادة الكود المبدئي</span>
              </button>

              <button
                onClick={handleRunChallenge}
                disabled={isRunning}
                className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm transition active:scale-95 shadow-lg shadow-amber-500/20 disabled:opacity-50"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{isRunning ? 'جاري الفحص...' : 'تشغيل واختبار التحدي الشامل'}</span>
              </button>
            </div>

            {/* Output Result Card */}
            {output && (
              <div className="mt-3 p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-3 shadow-lg animate-fadeIn">
                <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800/80">
                  <span className="font-bold flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-amber-400" />
                    <span>تقييم ونتيجة التحدي:</span>
                  </span>
                  {feedback?.passed ? (
                    <span className="text-emerald-400 font-bold px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-1">
                      <span>✓ كود متقن وتحدٍّ ناجح 🏆</span>
                    </span>
                  ) : (
                    <span className="text-amber-400 font-bold px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center gap-1">
                      <span>بحاجة لتعديل ⚠️</span>
                    </span>
                  )}
                </div>

                {feedback && (
                  <div
                    className={`p-3 rounded-xl border text-xs sm:text-sm leading-relaxed flex items-start gap-2.5 ${
                      feedback.passed
                        ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                        : 'bg-amber-950/40 border-amber-500/40 text-amber-200'
                    }`}
                  >
                    <span className="text-base shrink-0 mt-0.5">
                      {feedback.passed ? '🎉' : '💡'}
                    </span>
                    <span className="font-medium">
                      <FormattedArabicText text={feedback.message} />
                    </span>
                  </div>
                )}

                {output.logs.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-500 block">
                      مخرجات الكونسول المطبوعة (Console Output):
                    </span>
                    <div
                      dir="ltr"
                      className="text-emerald-400 text-left space-y-1 bg-slate-900/90 p-3 rounded-xl border border-slate-800 font-mono text-xs"
                    >
                      {output.logs.map((l, i) => (
                        <div key={i}>{l}</div>
                      ))}
                    </div>
                  </div>
                )}

                {output.errors.length > 0 && (
                  <div
                    dir="ltr"
                    className="p-3 bg-rose-950/40 border border-rose-900/40 text-rose-300 rounded-xl font-mono text-xs text-left"
                  >
                    {output.errors.map((e, i) => (
                      <div key={i}>{e}</div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer Navigation */}
      <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        {onPrevChapter ? (
          <button
            onClick={onPrevChapter}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition text-xs sm:text-sm w-full sm:w-auto justify-center"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة لآخر فصل في الجزء</span>
          </button>
        ) : <div />}

        {onNextPart && (
          <button
            onClick={onNextPart}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 text-slate-950 font-bold hover:brightness-110 transition text-xs sm:text-sm shadow-lg shadow-amber-500/20 w-full sm:w-auto justify-center"
          >
            <span>انطلق للجزء التالي 🚀</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        )}
      </div>
    </article>
  );
});

// Export alias for backward compatibility
export const PartExamView = PartSummaryView;
