import React, { useState, useEffect } from 'react';
import { Part } from '../types';
import { runJavaScript } from '../utils/codeRunner';
import { detectCodeLanguage, buildHtmlPreviewDocument } from '../utils/codePreview';
import { LiveBrowserPreview } from './LiveBrowserPreview';
import { useSoundManager } from '../hooks/useSoundManager';
import { cleanCodeString } from '../utils/cleanCode';
import {
  Bug,
  CheckCircle,
  HelpCircle,
  Play,
  RotateCcw,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Terminal,
  Globe,
  Eye,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  ArrowLeft,
  Target,
  Copy,
  Check,
} from 'lucide-react';

interface BugHunterProps {
  parts: Part[];
  initialPartId?: number;
  completedQuizIds: string[];
  onToggleQuizCompleted: (quizId: string) => void;
}

export const BugHunter: React.FC<BugHunterProps> = ({
  parts,
  initialPartId = 1,
  completedQuizIds,
  onToggleQuizCompleted,
}) => {
  const [selectedPartId, setSelectedPartId] = useState<number>(initialPartId);

  // Current quiz based on selected part
  const currentPartIndex = parts.findIndex((p) => p.id === selectedPartId);
  const currentPart = parts[currentPartIndex] || parts[0];
  const quiz = currentPart.bugHunter;
  const isWebQuiz = detectCodeLanguage(quiz.problemCode) === 'html';
  const { playSuccess, playCompletion, playError, playRun } = useSoundManager();

  // Running states
  const [isRunningBug, setIsRunningBug] = useState(false);
  const [bugOutput, setBugOutput] = useState<{ logs: string[]; errors: string[] } | null>(null);
  const [showBugPreview, setShowBugPreview] = useState(false);

  const [isRunningFixed, setIsRunningFixed] = useState(false);
  const [fixedOutput, setFixedOutput] = useState<{ logs: string[]; errors: string[] } | null>(null);
  const [showFixedPreview, setShowFixedPreview] = useState(false);

  // Suspected error selection
  const [selectedSuspectedLine, setSelectedSuspectedLine] = useState<number | null>(null);
  const [lineVerificationState, setLineVerificationState] = useState<{
    tested: boolean;
    isCorrect: boolean;
    message: string;
  } | null>(null);

  // Progressive hints & solution reveal
  const [revealedHints, setRevealedHints] = useState<number>(0);
  const [isExplanationRevealed, setIsExplanationRevealed] = useState(false);
  const [copiedCodeType, setCopiedCodeType] = useState<'problem' | 'fixed' | null>(null);

  // Reset states when switching part
  useEffect(() => {
    setBugOutput(null);
    setFixedOutput(null);
    setShowBugPreview(false);
    setShowFixedPreview(false);
    setSelectedSuspectedLine(null);
    setLineVerificationState(null);
    setRevealedHints(0);
    setIsExplanationRevealed(false);
    setCopiedCodeType(null);
  }, [selectedPartId]);

  const isCompleted = completedQuizIds.includes(quiz.id);
  const completedCount = parts.filter((p) => completedQuizIds.includes(p.bugHunter.id)).length;
  const totalCount = parts.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Run buggy code
  const handleRunBuggyCode = async () => {
    playRun();
    setIsRunningBug(true);
    if (isWebQuiz) {
      setShowBugPreview(true);
      setBugOutput({
        logs: [
          'المتصفح: بدأ قراءة وتحميل صفحة الـ HTML من البداية...',
          'المتصفح وصل للسطر 6 ونفّذ كود <script> فوراً وهو داخل <head>...',
        ],
        errors: [
          "TypeError: Cannot read properties of null (reading 'addEventListener')",
          'السبب: الزرار "changeButton" لم يكن موجوداً بعد في شجرة الـ DOM لأن عناصر <body> لم تُحمّل بعد!',
        ],
      });
      setIsRunningBug(false);
      playError();
      return;
    }

    const res = await runJavaScript(quiz.problemCode);
    setBugOutput({ logs: res.logs, errors: res.errors });
    setIsRunningBug(false);
    playError();
  };

  // Run fixed code
  const handleRunFixedCode = async () => {
    playRun();
    setIsRunningFixed(true);
    if (isWebQuiz) {
      setShowFixedPreview(true);
      setFixedOutput({
        logs: [
          '✓ تم تحميل عناصر الصفحة (h1 والزرار) بالكامل أولاً.',
          '✓ تم تنفيذ السكريبت في نهاية <body> وربط حدث النقر بنجاح!',
          '👉 جرّب النقر على زرار "غيّر" الآن في المعاينة الحية بالأعلى لتشاهد النتيجة بنفسك!',
        ],
        errors: [],
      });
      setIsRunningFixed(false);
      playSuccess();
      return;
    }

    const res = await runJavaScript(quiz.fixedCode);
    setFixedOutput({ logs: res.logs, errors: res.errors });
    setIsRunningFixed(false);
    playSuccess();
  };

  // Verify Suspected Line
  const handleCheckSuspectedLine = (lineNum: number) => {
    setSelectedSuspectedLine(lineNum);
    const correctLine = quiz.bugLineNumber || 3;
    const isCorrect = lineNum === correctLine;

    if (isCorrect) {
      playSuccess();
      setLineVerificationState({
        tested: true,
        isCorrect: true,
        message: `🎯 برافو عليك! السطر رقم ${lineNum} هو فعلاً مصدر الخلل في الكود.`,
      });
    } else {
      playError();
      setLineVerificationState({
        tested: true,
        isCorrect: false,
        message: `🔍 السطر ${lineNum} ليس سبب العطل المباشر. ركّز في السطور التي تقوم بالعملية الأساسية أو افتح التلميحات لمساعدتك.`,
      });
    }
  };

  // Copy Code
  const handleCopyCode = (codeText: string, type: 'problem' | 'fixed') => {
    navigator.clipboard.writeText(cleanCodeString(codeText));
    setCopiedCodeType(type);
    setTimeout(() => setCopiedCodeType(null), 2000);
  };

  // Reset puzzle
  const handleResetPuzzle = () => {
    setBugOutput(null);
    setFixedOutput(null);
    setShowBugPreview(false);
    setShowFixedPreview(false);
    setSelectedSuspectedLine(null);
    setLineVerificationState(null);
    setRevealedHints(0);
    setIsExplanationRevealed(false);
  };

  // Navigation handlers
  const hasPrev = currentPartIndex > 0;
  const hasNext = currentPartIndex < parts.length - 1;

  const handlePrevPuzzle = () => {
    if (hasPrev) {
      setSelectedPartId(parts[currentPartIndex - 1].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextPuzzle = () => {
    if (hasNext) {
      setSelectedPartId(parts[currentPartIndex + 1].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const problemLines = cleanCodeString(quiz.problemCode).split('\n');
  const fixedLines = cleanCodeString(quiz.fixedCode).split('\n');

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-6 sm:py-8 space-y-6 animate-fadeIn pb-32 sm:pb-36 lg:pb-16 font-['Cairo',sans-serif]">
      {/* 1. Header & Progress Banner */}
      <div className="bg-gradient-to-br from-rose-950/40 via-slate-900 to-slate-950 p-5 sm:p-6 rounded-3xl border border-rose-900/40 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30 shrink-0 shadow-lg shadow-rose-500/10">
              <Bug className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black text-white tracking-tight">
                  معمل صيد الأخطاء البرمجية (اكتشف الخطأ!)
                </h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">
                  {completedCount} من {totalCount} محلول
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-sans">
                تدريب تشخيصي تفاعلي: فكّر كمبرمج، حدّد سطر الخطأ، وشغّل الكود لاختبار النتيجة
              </p>
            </div>
          </div>

          {/* Mastered / Completed Toggle Button */}
          <button
            onClick={() => {
              if (!isCompleted) {
                playCompletion();
              }
              onToggleQuizCompleted(quiz.id);
            }}
            className={`min-h-[44px] px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 shrink-0 ${
              isCompleted
                ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
                : 'bg-slate-800/90 hover:bg-slate-700 text-slate-200 border-2 border-slate-700 hover:border-rose-500'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isCompleted ? '✓ تم إتقان هذا اللغز' : 'تحديد كلغز محلول'}</span>
          </button>
        </div>

        {/* Course Parts Selector Bar */}
        <div className="pt-2 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-medium">
            <span>اختر لغز الجزء:</span>
            <span dir="ltr" className="font-mono text-amber-400 font-bold">
              {progressPercent}% إنجاز المعمل
            </span>
          </div>

          <div
            role="tablist"
            aria-label="ألغاز أجزاء الكتاب"
            className="flex items-center gap-2 overflow-x-auto pb-1 text-xs select-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {parts.map((p, idx) => {
              const isDone = completedQuizIds.includes(p.bugHunter.id);
              const isCurrent = p.id === selectedPartId;

              return (
                <button
                  key={p.id}
                  role="tab"
                  aria-selected={isCurrent}
                  onClick={() => setSelectedPartId(p.id)}
                  className={`min-h-[40px] flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all shrink-0 active:scale-95 ${
                    isCurrent
                      ? 'bg-gradient-to-r from-rose-500 to-rose-600 text-white font-black shadow-lg shadow-rose-500/25 ring-2 ring-rose-400/40'
                      : isDone
                      ? 'bg-slate-900/90 text-emerald-300 border border-emerald-500/40 hover:bg-slate-800'
                      : 'bg-slate-950/80 text-slate-400 border border-slate-800 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <span>لغز {idx + 1}: {p.title.split(':')[0]}</span>
                  {isDone ? (
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Main Puzzle Card */}
      <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-5 sm:p-7 space-y-6 shadow-2xl backdrop-blur-sm">
        {/* Scenario and Problem Statement */}
        <div className="space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs font-bold px-3 py-1 rounded-xl bg-rose-500/10 text-rose-300 border border-rose-500/30">
              {currentPart.title}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-mono">
                اللغز <span dir="ltr" className="font-bold text-white">{currentPartIndex + 1}/{parts.length}</span>
              </span>
              <button
                type="button"
                onClick={handleResetPuzzle}
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 px-2 py-1 rounded-lg hover:bg-slate-800 transition"
                title="إعادة تعيين المحاولة"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">إعادة التجربة</span>
              </button>
            </div>
          </div>

          <h2 className="text-lg sm:text-2xl font-black text-white flex items-center gap-2">
            <span className="text-rose-400">🔍</span>
            <span>{quiz.title}</span>
          </h2>

          <div className="bg-slate-950/80 p-4 sm:p-5 rounded-2xl border border-slate-800/90 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
              <Target className="w-4 h-4 text-amber-400" />
              <span>سيناريو الكود والمشكلة المطلوبة:</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              {quiz.context}
            </p>
          </div>
        </div>

        {/* 3. Interactive Buggy Code Box with Clickable Line Pinpointing */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-rose-400">
              <Bug className="w-4 h-4" />
              <span>الكود المعطوب (اضغط على السطر لتحديده كمصدر للخلل):</span>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-center">
              <button
                onClick={() => handleCopyCode(quiz.problemCode, 'problem')}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition"
                title="نسخ الكود"
              >
                {copiedCodeType === 'problem' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span>{copiedCodeType === 'problem' ? 'تم النسخ' : 'نسخ'}</span>
              </button>

              {/* Run Buggy Code Action */}
              <button
                onClick={handleRunBuggyCode}
                disabled={isRunningBug}
                className="min-h-[36px] flex items-center gap-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold px-3.5 py-1.5 rounded-xl transition active:scale-95 shadow-md shadow-rose-600/20 disabled:opacity-60 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isRunningBug ? 'جاري الفحص...' : 'شغّل الكود وشوف الخطأ'}</span>
              </button>
            </div>
          </div>

          {/* Code Viewer with Line Selection */}
          <div
            dir="ltr"
            className="rounded-2xl border-2 border-rose-900/50 bg-slate-950 overflow-hidden shadow-inner font-mono text-xs sm:text-sm"
          >
            <div className="bg-slate-900/90 px-4 py-2 border-b border-rose-900/40 flex items-center justify-between text-xs select-none">
              <span className="text-rose-300 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                {isWebQuiz ? 'HTML / Web Document (Buggy)' : 'JavaScript (Buggy File)'}
              </span>
              <span className="text-slate-500 text-[11px]">
                {problemLines.length} سطور
              </span>
            </div>

            <div className="p-3 sm:p-4 overflow-x-auto select-text leading-relaxed">
              <table className="w-full border-collapse">
                <tbody>
                  {problemLines.map((lineText, idx) => {
                    const lineNum = idx + 1;
                    const isSelected = selectedSuspectedLine === lineNum;
                    return (
                      <tr
                        key={idx}
                        onClick={() => handleCheckSuspectedLine(lineNum)}
                        className={`group cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-rose-500/20 text-rose-100'
                            : 'hover:bg-slate-900/80 text-slate-300'
                        }`}
                        title={`انقر لتحديد السطر ${lineNum} كسطر الخطأ`}
                      >
                        <td className="w-10 pr-4 pl-2 text-right select-none font-mono text-[11px] text-slate-600 group-hover:text-rose-400">
                          <span className={`inline-block px-1.5 py-0.5 rounded ${
                            isSelected ? 'bg-rose-500 text-slate-950 font-black' : ''
                          }`}>
                            {lineNum}
                          </span>
                        </td>
                        <td className="py-0.5 px-2 text-left whitespace-pre font-mono">
                          {lineText || ' '}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Live Browser Preview for Web Quiz */}
            {isWebQuiz && showBugPreview && (
              <div className="p-3.5 bg-slate-900 border-t border-rose-900/40 animate-fadeIn" dir="rtl">
                <LiveBrowserPreview
                  htmlContent={buildHtmlPreviewDocument(quiz.problemCode, 'html')}
                  title="المعاينة في المتصفح (الكود المعطوب)"
                  height="190px"
                />
              </div>
            )}

            {/* Buggy Code Execution Output */}
            {bugOutput && (
              <div className="border-t border-rose-900/40 bg-rose-950/30 p-4 text-xs font-mono" dir="rtl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] text-rose-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-rose-400" />
                    <span>رد شاشة الكونسول أثناء تشغيل الكود المعطوب:</span>
                  </span>
                </div>

                {bugOutput.logs.length > 0 && (
                  <div className="space-y-1 text-slate-300 text-left dir-ltr mb-2.5 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                    {bugOutput.logs.map((l, i) => (
                      <div key={i} className="text-emerald-400">{l}</div>
                    ))}
                  </div>
                )}

                {bugOutput.errors.length > 0 && (
                  <div className="text-rose-300 text-right dir-rtl space-y-1.5 bg-rose-950/60 p-3 rounded-xl border border-rose-800/50">
                    <span className="font-bold text-rose-200 block text-xs">⚠️ رسالة الخطأ الناتجة:</span>
                    {bugOutput.errors.map((e, i) => (
                      <div key={i} className="text-rose-300 font-sans text-xs leading-relaxed">{e}</div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Line Selection Feedback Banner */}
          {lineVerificationState && (
            <div
              className={`p-4 rounded-2xl border text-xs sm:text-sm font-sans flex items-start gap-3 animate-fadeIn ${
                lineVerificationState.isCorrect
                  ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                  : 'bg-amber-950/30 border-amber-500/40 text-amber-200'
              }`}
            >
              <span className="text-base shrink-0 mt-0.5">
                {lineVerificationState.isCorrect ? '🎉' : '💡'}
              </span>
              <div className="space-y-1">
                <p className="font-bold">{lineVerificationState.message}</p>
                {lineVerificationState.isCorrect && (
                  <p className="text-xs text-emerald-300 font-normal">
                    اضغط الآن على زر "اكشف سبب الخلل والكود المصحح" بالأسفل لرؤية الكود بعد التصحيح ومقارنته.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 4. Progressive Hints */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4" />
              <span>تلميحات مساعدة للحل (خطوة بخطوة):</span>
            </span>

            {revealedHints < quiz.hints.length ? (
              <button
                type="button"
                onClick={() => setRevealedHints((prev) => prev + 1)}
                className="min-h-[36px] text-xs text-amber-300 hover:text-amber-200 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 px-3.5 py-1.5 rounded-xl font-bold transition active:scale-95 flex items-center gap-1.5"
              >
                <Lightbulb className="w-3.5 h-3.5" />
                <span>إظهار تلميح ({revealedHints + 1} من {quiz.hints.length})</span>
              </button>
            ) : (
              <span className="text-xs text-slate-500 font-medium">تم فتح جميع التلميحات</span>
            )}
          </div>

          <div className="space-y-2">
            {quiz.hints.slice(0, revealedHints).map((hint, idx) => (
              <div
                key={idx}
                className="p-3.5 bg-amber-950/25 rounded-2xl border border-amber-500/30 text-xs sm:text-sm text-amber-200 leading-relaxed animate-fadeIn flex items-start gap-2.5 font-sans"
              >
                <span className="font-bold text-amber-400 shrink-0">تلميح {idx + 1}:</span>
                <span>{hint}</span>
              </div>
            ))}

            {revealedHints === 0 && (
              <p className="text-xs text-slate-500 bg-slate-950/40 p-3 rounded-xl border border-slate-800">
                💡 حاول تشخيص مكان الخطأ بنفسك أولاً، وإذا احتجت مساعدة اضغط على زر "إظهار تلميح".
              </p>
            )}
          </div>
        </div>

        {/* 5. Diagnosis & Solution Reveal (Separate Check Action) */}
        <div className="pt-4 border-t border-slate-800">
          {!isExplanationRevealed ? (
            <button
              onClick={() => {
                setIsExplanationRevealed(true);
                playSuccess();
              }}
              className="w-full min-h-[48px] py-3 px-5 rounded-2xl bg-gradient-to-r from-slate-800 via-slate-800 to-slate-700 hover:brightness-110 text-white text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 border-2 border-amber-500/30 hover:border-amber-500/60 shadow-lg active:scale-[0.99]"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>اكشف سبب الخلل والكود الصحيح مع الشرح 💡</span>
            </button>
          ) : (
            <div className="space-y-5 animate-fadeIn">
              {/* Diagnosis Box */}
              <div className="p-4 sm:p-5 rounded-2xl bg-emerald-950/20 border-2 border-emerald-500/40 space-y-3 shadow-lg">
                <div className="flex items-center gap-2 font-bold text-sm sm:text-base text-emerald-300">
                  <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>تشخيص المشكلة: {quiz.bugDescription}</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                  {quiz.whyItHappens}
                </p>

                {quiz.expectedCorrectOutput && (
                  <div className="pt-2 border-t border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                    <span className="text-slate-400 font-sans">🎯 الناتج المتوقع بعد التصحيح:</span>
                    <span dir="ltr" className="font-mono text-emerald-300 font-bold bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 text-left">
                      {quiz.expectedCorrectOutput}
                    </span>
                  </div>
                )}
              </div>

              {/* Fixed Code and Run Section */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4" />
                    <span>الكود بعد التصحيح:</span>
                  </span>

                  <div className="flex items-center gap-2 self-start sm:self-center">
                    <button
                      onClick={() => handleCopyCode(quiz.fixedCode, 'fixed')}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition"
                      title="نسخ الكود المصحح"
                    >
                      {copiedCodeType === 'fixed' ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span>{copiedCodeType === 'fixed' ? 'تم النسخ' : 'نسخ'}</span>
                    </button>

                    {/* Run Fixed Code Action */}
                    <button
                      onClick={handleRunFixedCode}
                      disabled={isRunningFixed}
                      className="min-h-[36px] flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-4 py-1.5 rounded-xl transition active:scale-95 shadow-md shadow-emerald-500/20 disabled:opacity-60 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{isRunningFixed ? 'جاري التشغيل...' : 'شغّل الكود المصحح 🚀'}</span>
                    </button>
                  </div>
                </div>

                <div
                  dir="ltr"
                  className="rounded-2xl border-2 border-emerald-900/50 bg-slate-950 overflow-hidden shadow-inner font-mono text-xs sm:text-sm"
                >
                  <div className="bg-slate-900/90 px-4 py-2 border-b border-emerald-900/40 flex items-center justify-between text-xs select-none">
                    <span className="text-emerald-300 font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      {isWebQuiz ? 'HTML / Corrected Code' : 'JavaScript / Corrected Code'}
                    </span>
                    <span className="text-slate-500 text-[11px]">
                      {fixedLines.length} سطور
                    </span>
                  </div>

                  <div className="p-3 sm:p-4 overflow-x-auto select-text leading-relaxed">
                    <table className="w-full border-collapse">
                      <tbody>
                        {fixedLines.map((lineText, idx) => (
                          <tr key={idx} className="text-emerald-300/90 hover:bg-slate-900/50">
                            <td className="w-10 pr-4 pl-2 text-right select-none font-mono text-[11px] text-slate-600">
                              {idx + 1}
                            </td>
                            <td className="py-0.5 px-2 text-left whitespace-pre font-mono">
                              {lineText || ' '}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Live Browser Preview for Fixed Web Quiz */}
                  {isWebQuiz && showFixedPreview && (
                    <div className="p-3.5 bg-slate-900 border-t border-emerald-900/40 animate-fadeIn" dir="rtl">
                      <LiveBrowserPreview
                        htmlContent={buildHtmlPreviewDocument(quiz.fixedCode, 'html')}
                        title="المعاينة الحية بعد التصحيح (اضغط على الزرار لتجربة التفاعل)"
                        height="200px"
                      />
                    </div>
                  )}

                  {/* Fixed Code Output */}
                  {fixedOutput && (
                    <div className="border-t border-emerald-900/40 bg-emerald-950/30 p-4 text-xs font-mono" dir="rtl">
                      <div className="text-[11px] text-emerald-300 mb-2 font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                        <span>مخرجات الكونسول بعد التصحيح:</span>
                      </div>
                      <div className="space-y-1.5 text-emerald-300 text-left dir-ltr bg-slate-900/80 p-3 rounded-xl border border-emerald-500/30 font-mono">
                        {fixedOutput.logs.map((l, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <span className="text-emerald-500 select-none">›</span>
                            <span>{l}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 6. Navigation Controls Between Puzzles */}
        <div className="pt-6 border-t border-slate-800 flex items-center justify-between gap-3">
          {hasPrev ? (
            <button
              type="button"
              onClick={handlePrevPuzzle}
              className="min-h-[44px] px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs sm:text-sm font-bold transition flex items-center gap-2"
            >
              <ArrowRight className="w-4 h-4" />
              <span>اللغز السابق</span>
            </button>
          ) : (
            <div />
          )}

          {hasNext ? (
            <button
              type="button"
              onClick={handleNextPuzzle}
              className="min-h-[44px] px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs sm:text-sm font-black transition shadow-lg shadow-rose-600/20 flex items-center gap-2"
            >
              <span>اللغز التالي</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  );
};
