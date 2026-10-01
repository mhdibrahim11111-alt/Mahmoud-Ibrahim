import React, { useState } from 'react';
import { BugQuiz, Part } from '../types';
import { runJavaScript } from '../utils/codeRunner';
import { detectCodeLanguage, buildHtmlPreviewDocument } from '../utils/codePreview';
import { CodeBlock } from './CodeBlock';
import { LiveBrowserPreview } from './LiveBrowserPreview';
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
  const currentPart = parts.find((p) => p.id === selectedPartId) || parts[0];
  const quiz = currentPart.bugHunter;
  const isWebQuiz = detectCodeLanguage(quiz.problemCode) === 'html';

  // Running states
  const [isRunningBug, setIsRunningBug] = useState(false);
  const [bugOutput, setBugOutput] = useState<{ logs: string[]; errors: string[] } | null>(null);
  const [showBugPreview, setShowBugPreview] = useState(false);

  const [isRunningFixed, setIsRunningFixed] = useState(false);
  const [fixedOutput, setFixedOutput] = useState<{ logs: string[]; errors: string[] } | null>(null);
  const [showFixedPreview, setShowFixedPreview] = useState(false);

  // Reveal states
  const [revealedHints, setRevealedHints] = useState<number>(0);
  const [isExplanationRevealed, setIsExplanationRevealed] = useState(false);

  // Reset when part changes
  React.useEffect(() => {
    setBugOutput(null);
    setFixedOutput(null);
    setShowBugPreview(false);
    setShowFixedPreview(false);
    setRevealedHints(0);
    setIsExplanationRevealed(false);
  }, [selectedPartId]);

  const isCompleted = completedQuizIds.includes(quiz.id);

  const handleRunBuggyCode = async () => {
    setIsRunningBug(true);
    if (isWebQuiz) {
      setShowBugPreview(true);
      setBugOutput({
        logs: [
          'المتصفح: بدأ قراءة وتحميل صفحة الـ HTML من البداية...',
          'المتصفح وصل للسطر 6 ونفّذ كود <script> فوراً وهو داخل <head>...',
        ],
        errors: [
          'TypeError: Cannot read properties of null (reading \'addEventListener\')',
          'السبب: الزرار "changeButton" لم يكن موجوداً بعد في شجرة الـ DOM لأن عناصر <body> لم تُحمّل بعد!',
        ],
      });
      setIsRunningBug(false);
      return;
    }

    const res = await runJavaScript(quiz.problemCode);
    setBugOutput({ logs: res.logs, errors: res.errors });
    setIsRunningBug(false);
  };

  const handleRunFixedCode = async () => {
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
      return;
    }

    const res = await runJavaScript(quiz.fixedCode);
    setFixedOutput({ logs: res.logs, errors: res.errors });
    setIsRunningFixed(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-900 p-6 rounded-2xl border border-rose-900/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30 shrink-0">
              <Bug className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white">
                  معمل صيد الأخطاء البرمجية (اكتشف الخطأ!)
                </h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">
                  {completedQuizIds.length} من {parts.length} محلول
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                تدريب تشخيصي عملي: اقرأ الكود المعطوب، فكر في سبب الخلل، واستكشف الحل والتصحيح
              </p>
            </div>
          </div>

          <button
            onClick={() => onToggleQuizCompleted(quiz.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition self-start sm:self-center ${
              isCompleted
                ? 'bg-emerald-500 text-slate-950 font-black shadow-lg shadow-emerald-500/20'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isCompleted ? 'تم إتقان هذا اللغز ✓' : 'تحديد كلغز محلول'}</span>
          </button>
        </div>

        {/* Part Tabs Selector */}
        <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-1">
          {parts.map((p) => {
            const isDone = completedQuizIds.includes(p.bugHunter.id);
            const isCurrent = p.id === selectedPartId;

            return (
              <button
                key={p.id}
                onClick={() => setSelectedPartId(p.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  isCurrent
                    ? 'bg-rose-500 text-slate-950 font-black shadow-md shadow-rose-500/20'
                    : 'bg-slate-950/60 hover:bg-slate-800/80 text-slate-300 border border-slate-800'
                }`}
              >
                <span>{p.title.split(':')[0]}</span>
                {isDone && <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Quiz Card */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 space-y-6 shadow-xl">
        {/* Scenario description */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-400 tracking-wider">
              {currentPart.title}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              اللغز {currentPart.id} من {parts.length}
            </span>
          </div>

          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span>🔍</span>
            <span>{quiz.title}</span>
          </h3>

          <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
            {quiz.context}
          </p>
        </div>

        {/* Buggy Code Box */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-rose-400 flex items-center gap-1.5">
              <Bug className="w-4 h-4" />
              الكود الذي يحتوي على خطأ:
            </span>
            <button
              onClick={handleRunBuggyCode}
              disabled={isRunningBug}
              className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold px-3 py-1.5 rounded-lg transition active:scale-95 shadow"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isRunningBug ? 'جاري الفحص...' : 'شغّل الكود وشوف الخطأ'}</span>
            </button>
          </div>

          <div className="rounded-xl border border-rose-900/40 overflow-hidden">
            <CodeBlock code={quiz.problemCode} showLineNumbers />

            {/* Live Browser Preview for Web Quiz */}
            {isWebQuiz && showBugPreview && (
              <div className="p-3 bg-slate-900 border-t border-rose-900/40 animate-fadeIn">
                <LiveBrowserPreview
                  htmlContent={buildHtmlPreviewDocument(quiz.problemCode, 'html')}
                  title="المعاينة في المتصفح (الكود المعطوب)"
                  height="190px"
                />
              </div>
            )}

            {bugOutput && (
              <div className="border-t border-rose-900/40 bg-rose-950/30 p-3.5 text-xs font-mono">
                <div className="text-[10px] text-rose-400 mb-1.5 font-bold uppercase tracking-wider">
                  رد المتصفح وشاشة الكونسول:
                </div>

                {bugOutput.logs.length > 0 && (
                  <div className="space-y-1 text-slate-300 text-left dir-ltr mb-2">
                    {bugOutput.logs.map((l, i) => (
                      <div key={i}>{l}</div>
                    ))}
                  </div>
                )}

                {bugOutput.errors.length > 0 && (
                  <div className="text-rose-400 text-right dir-rtl space-y-1 bg-rose-950/50 p-2.5 rounded-lg border border-rose-800/40">
                    {bugOutput.errors.map((e, i) => (
                      <div key={i}>{e}</div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Progressive Hints */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4" />
              تلميحات مساعدة للحل (خطوة بخطوة):
            </span>
            {revealedHints < quiz.hints.length && (
              <button
                onClick={() => setRevealedHints((prev) => prev + 1)}
                className="text-xs text-amber-400 hover:text-amber-300 font-semibold"
              >
                + إظهار تلميح ({revealedHints + 1} من {quiz.hints.length})
              </button>
            )}
          </div>

          <div className="space-y-2">
            {quiz.hints.slice(0, revealedHints).map((hint, idx) => (
              <div
                key={idx}
                className="p-3 bg-amber-950/30 rounded-xl border border-amber-500/30 text-xs text-amber-200 animate-fadeIn"
              >
                <span className="font-bold ml-1">تلميح {idx + 1}:</span> {hint}
              </div>
            ))}
            {revealedHints === 0 && (
              <p className="text-xs text-slate-500">
                حاول إيجاد الخطأ بنفسك أولاً، وإذا احتجت مساعدة اضغط على "إظهار تلميح".
              </p>
            )}
          </div>
        </div>

        {/* Diagnosis & Corrected Code Reveal */}
        <div className="pt-4 border-t border-slate-800">
          {!isExplanationRevealed ? (
            <button
              onClick={() => setIsExplanationRevealed(true)}
              className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 border border-slate-700"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>اكشف سبب الخلل والكود الصحيح مع الشرح 💡</span>
            </button>
          ) : (
            <div className="space-y-4 animate-fadeIn">
              {/* Why it happens explanation */}
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
                <h4 className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4" />
                  تشخيص المشكلة: {quiz.bugDescription}
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {quiz.whyItHappens}
                </p>
              </div>

              {/* Fixed Code and Run */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4" />
                    الكود بعد التصحيح:
                  </span>
                  <button
                    onClick={handleRunFixedCode}
                    disabled={isRunningFixed}
                    className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-lg transition active:scale-95 shadow"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{isRunningFixed ? 'جاري التشغيل...' : 'شغّل الكود المصحح'}</span>
                  </button>
                </div>

                <div className="rounded-xl border border-emerald-900/40 overflow-hidden">
                  <CodeBlock code={quiz.fixedCode} showLineNumbers />

                  {/* Live Browser Preview for Fixed Web Quiz */}
                  {isWebQuiz && showFixedPreview && (
                    <div className="p-3 bg-slate-900 border-t border-emerald-900/40 animate-fadeIn">
                      <LiveBrowserPreview
                        htmlContent={buildHtmlPreviewDocument(quiz.fixedCode, 'html')}
                        title="المعاينة الحية بعد التصحيح (اضغط على الزرار لتجربة التفاعل)"
                        height="200px"
                      />
                    </div>
                  )}

                  {fixedOutput && (
                    <div className="border-t border-emerald-900/40 bg-emerald-950/20 p-3.5 text-xs font-mono">
                      <div className="text-[10px] text-emerald-400 mb-1.5 font-bold uppercase tracking-wider">
                        الناتج الصحيح الآن:
                      </div>
                      <div className="space-y-1 text-emerald-300 text-left dir-ltr">
                        {fixedOutput.logs.map((l, i) => (
                          <div key={i}>{l}</div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
