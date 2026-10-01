import React, { useState } from 'react';
import { Chapter } from '../types';
import { runJavaScript } from '../utils/codeRunner';
import { CodeBlock } from './CodeBlock';
import { detectCodeLanguage, buildHtmlPreviewDocument } from '../utils/codePreview';
import { LiveBrowserPreview } from './LiveBrowserPreview';
import { FormattedArabicText } from './FormattedArabicText';
import {
  Play,
  RotateCcw,
  Check,
  HelpCircle,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Terminal,
  BookOpen,
  CheckCircle2,
  Copy,
  Globe,
  Eye,
} from 'lucide-react';

interface ChapterViewProps {
  chapter: Chapter;
  onPrevChapter?: () => void;
  onNextChapter?: () => void;
  onOpenInPlayground: (code: string) => void;
  isCompleted: boolean;
  onToggleCompleted: () => void;
  savedChallengeCode?: string;
  onUpdateChallengeCode?: (code: string) => void;
}

export const ChapterView: React.FC<ChapterViewProps> = ({
  chapter,
  onPrevChapter,
  onNextChapter,
  onOpenInPlayground,
  isCompleted,
  onToggleCompleted,
  savedChallengeCode,
  onUpdateChallengeCode,
}) => {
  // Local states for interactive exercise runner
  const [runningSnippetIndex, setRunningSnippetIndex] = useState<number | null>(null);
  const [snippetOutputs, setSnippetOutputs] = useState<Record<number, { logs: string[]; errors: string[] }>>({});

  // States for exercises prediction cards
  const [revealedExercises, setRevealedExercises] = useState<Record<string, boolean>>({});
  const [exerciseOutputs, setExerciseOutputs] = useState<Record<string, { logs: string[]; errors: string[] }>>({});
  const [exercisePreviews, setExercisePreviews] = useState<Record<string, boolean>>({});
  const [previewSnippetIndex, setPreviewSnippetIndex] = useState<number | null>(null);

  // Challenge states
  const [challengeCode, setChallengeCode] = useState<string>(
    savedChallengeCode !== undefined ? savedChallengeCode : chapter.challenge?.initialCode || ''
  );
  const [challengeOutput, setChallengeOutput] = useState<{ logs: string[]; errors: string[] } | null>(null);
  const [challengeHtmlPreview, setChallengeHtmlPreview] = useState<string | null>(null);
  const [showChallengeHint, setShowChallengeHint] = useState(false);
  const [showChallengeSolution, setShowChallengeSolution] = useState(false);
  const [challengeSuccess, setChallengeSuccess] = useState<boolean | null>(null);

  // Sync challenge code when chapter or savedChallengeCode changes
  React.useEffect(() => {
    const codeToSet =
      savedChallengeCode !== undefined ? savedChallengeCode : chapter.challenge?.initialCode || '';
    setChallengeCode(codeToSet);
    setChallengeOutput(null);
    setChallengeHtmlPreview(null);
    setShowChallengeHint(false);
    setShowChallengeSolution(false);
    setChallengeSuccess(null);
    setSnippetOutputs({});
    setExerciseOutputs({});
    setExercisePreviews({});
    setRevealedExercises({});
    // Open preview by default for web chapters in Part 6
    if (chapter.partId === 6) {
      setPreviewSnippetIndex(0);
    } else {
      setPreviewSnippetIndex(null);
    }
  }, [chapter.id, savedChallengeCode]);

  const handleChallengeChange = (newCode: string) => {
    setChallengeCode(newCode);
    if (onUpdateChallengeCode) {
      onUpdateChallengeCode(newCode);
    }
  };

  const handleRunSnippet = async (index: number, code: string) => {
    setRunningSnippetIndex(index);
    const res = await runJavaScript(code);
    setSnippetOutputs((prev) => ({
      ...prev,
      [index]: { logs: res.logs, errors: res.errors },
    }));
    setRunningSnippetIndex(null);
  };

  const handleRunExercise = async (id: string, code: string) => {
    const lang = detectCodeLanguage(code);
    if (lang === 'html' || lang === 'css') {
      setExercisePreviews((prev) => ({ ...prev, [id]: !prev[id] }));
      return;
    }
    const res = await runJavaScript(code);
    setExerciseOutputs((prev) => ({
      ...prev,
      [id]: { logs: res.logs, errors: res.errors },
    }));
  };

  const handleTestChallenge = async () => {
    if (!challengeCode.trim()) return;
    const lang = detectCodeLanguage(challengeCode);
    const isWeb = lang === 'html' || lang === 'css' || chapter.id === 18 || chapter.id === 19;

    if (isWeb) {
      const effectiveLang = lang === 'css' || chapter.id === 19 ? 'css' : 'html';
      const previewDoc = buildHtmlPreviewDocument(challengeCode, effectiveLang);
      setChallengeHtmlPreview(previewDoc);

      if (chapter.id === 18) {
        const hasH1 = /<h1\b[^>]*>.*?<\/h1>/is.test(challengeCode);
        const hasP = /<p\b[^>]*>.*?<\/p>/is.test(challengeCode);
        const hasUl = /<ul\b[^>]*>[\s\S]*?<\/ul>/is.test(challengeCode);
        if (hasH1 && hasP && hasUl) {
          setChallengeOutput({
            logs: ['🎉 ممتاز جداً! كتبت هيكل بطاقة الـ HTML بالكامل، والمعاينة الحية ظاهرة أمامك في المتصفح.'],
            errors: [],
          });
          setChallengeSuccess(true);
        } else {
          setChallengeOutput({
            logs: [],
            errors: ['فاضل بعض الوسوم: تأكد من إضافة <h1> للعنوان، و <p> للتعريف، و <ul> للهوايات.'],
          });
          setChallengeSuccess(false);
        }
      } else if (chapter.id === 19) {
        const hasHighlight = /\.highlight\s*\{[\s\S]*?\}/i.test(challengeCode);
        if (hasHighlight) {
          setChallengeOutput({
            logs: ['🎉 رائع! تم تطبيق قاعدة كلاس .highlight على النص في المعاينة الحية.'],
            errors: [],
          });
          setChallengeSuccess(true);
        } else {
          setChallengeOutput({
            logs: [],
            errors: ['تأكد من كتابة قاعدة .highlight { ... } وتحديد اللون الأصفر color: yellow;'],
          });
          setChallengeSuccess(false);
        }
      } else {
        setChallengeOutput({ logs: ['✓ تم تفعيل المعاينة الحية في المتصفح بنجاح.'], errors: [] });
        setChallengeSuccess(true);
      }
      return;
    }

    setChallengeHtmlPreview(null);
    const res = await runJavaScript(challengeCode);
    setChallengeOutput({ logs: res.logs, errors: res.errors });

    // Validate if output was generated without error
    if (res.errors.length === 0 && res.logs.length > 0) {
      setChallengeSuccess(true);
    } else {
      setChallengeSuccess(false);
    }
  };

  return (
    <article className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      {/* Chapter Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/30 inline-block mb-2">
            {chapter.partTitle}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {chapter.title}
          </h1>
          <p className="text-sm sm:text-base text-slate-400 mt-1 font-medium">
            <FormattedArabicText text={chapter.subtitle} />
          </p>
        </div>

        <button
          onClick={onToggleCompleted}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition self-start sm:self-center ${
            isCompleted
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
              : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700'
          }`}
        >
          <CheckCircle2 className={`w-4 h-4 ${isCompleted ? 'text-emerald-400' : 'text-slate-500'}`} />
          <span>{isCompleted ? 'مكتمل ومقروء ✓' : 'تحديد كمكتمل'}</span>
        </button>
      </div>

      {/* Chapter Summary Cards */}
      {chapter.summaryPoints.length > 0 && (
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-inner">
          <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            أهم النقاط اللي هتطلع بيها من الفصل ده:
          </h3>
          <ul className="grid sm:grid-cols-2 gap-2.5 text-xs sm:text-sm text-slate-300">
            {chapter.summaryPoints.map((point, idx) => (
              <li key={idx} className="flex items-start gap-2 bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/80">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">
                  <FormattedArabicText text={point} />
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Chapter Sections */}
      <div className="space-y-8">
        {chapter.contentSections.map((sec, idx) => (
          <section key={idx} className="space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-slate-100 flex items-center gap-2">
              <span className="w-2 h-5 bg-amber-500 rounded-full inline-block"></span>
              <FormattedArabicText text={sec.heading} />
            </h2>

            <div className="text-sm sm:text-base text-slate-300 leading-relaxed whitespace-pre-line font-normal">
              <FormattedArabicText text={sec.text} />
            </div>

            {/* Live HTML Preview if applicable */}
            {sec.type === 'html_preview' && sec.htmlCode && (
              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-400 flex items-center justify-between">
                  <span>معاينة حية للمتصفح (HTML Preview):</span>
                  <span className="text-[11px] text-amber-400 font-mono">Live Rendering</span>
                </div>
                <div
                  className="rounded-xl overflow-hidden shadow-lg"
                  dangerouslySetInnerHTML={{ __html: sec.htmlCode }}
                />
              </div>
            )}

            {/* Code Snippet with Run Button */}
            {sec.codeSnippet && (() => {
              const lang = detectCodeLanguage(sec.codeSnippet);
              const isWebCode = lang === 'html' || lang === 'css';

              return (
                <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
                  <div className="bg-slate-900/90 px-4 py-2 flex items-center justify-between border-b border-slate-800 text-xs">
                    <div className="flex items-center gap-2 text-slate-400 font-mono">
                      {isWebCode ? (
                        <Globe className="w-3.5 h-3.5 text-cyan-400" />
                      ) : (
                        <Terminal className="w-3.5 h-3.5 text-amber-400" />
                      )}
                      <span>
                        {lang === 'css'
                          ? 'كود تنسيق CSS'
                          : lang === 'html'
                          ? 'كود هيكل HTML'
                          : 'كود جافاسكريبت'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onOpenInPlayground(sec.codeSnippet!)}
                        className="text-slate-400 hover:text-white px-2 py-1 rounded hover:bg-slate-800 transition"
                        title="فتح وتعديل في مختبر الأكواد"
                      >
                        تعديل في المختبر
                      </button>

                      {isWebCode ? (
                        <button
                          onClick={() =>
                            setPreviewSnippetIndex(previewSnippetIndex === idx ? null : idx)
                          }
                          className={`flex items-center gap-1.5 font-bold px-3 py-1 rounded-lg text-xs transition active:scale-95 shadow ${
                            previewSnippetIndex === idx
                              ? 'bg-cyan-600 text-white'
                              : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950'
                          }`}
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>
                            {previewSnippetIndex === idx ? 'إخفاء المعاينة' : 'معاينة في المتصفح'}
                          </span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleRunSnippet(idx, sec.codeSnippet!)}
                          disabled={runningSnippetIndex === idx}
                          className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1 rounded-lg text-xs transition active:scale-95 shadow"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>
                            {runningSnippetIndex === idx ? 'جاري التشغيل...' : 'شغّل الكود'}
                          </span>
                        </button>
                      )}
                    </div>
                  </div>

                  <CodeBlock code={sec.codeSnippet} showLineNumbers />

                  {/* HTML / CSS Live Browser Preview */}
                  {isWebCode && previewSnippetIndex === idx && (
                    <div className="p-3 bg-slate-900/90 border-t border-slate-800 animate-fadeIn">
                      <LiveBrowserPreview
                        htmlContent={buildHtmlPreviewDocument(sec.codeSnippet, lang)}
                        title={lang === 'css' ? 'معاينة تطبيق قواعد CSS' : 'معاينة صفحة الـ HTML'}
                        height="260px"
                      />
                    </div>
                  )}

                  {/* JS Snippet Output Console */}
                  {!isWebCode && snippetOutputs[idx] && (
                    <div className="border-t border-slate-800 bg-slate-900/90 p-3 text-xs font-mono">
                      <div className="text-slate-400 text-[10px] mb-1 uppercase tracking-wider flex items-center justify-between">
                        <span>الناتج في الـ Console:</span>
                        <button
                          onClick={() => {
                            setSnippetOutputs((prev) => {
                              const next = { ...prev };
                              delete next[idx];
                              return next;
                            });
                          }}
                          className="text-slate-500 hover:text-slate-300"
                        >
                          مسح
                        </button>
                      </div>

                      {snippetOutputs[idx].logs.length > 0 && (
                        <div
                          dir="ltr"
                          style={{ direction: 'ltr', textAlign: 'left', unicodeBidi: 'isolate' }}
                          className="space-y-1 text-emerald-400 text-left bg-slate-950 p-2 rounded-lg"
                        >
                          {snippetOutputs[idx].logs.map((log, lIdx) => (
                            <div key={lIdx}>{log}</div>
                          ))}
                        </div>
                      )}

                      {snippetOutputs[idx].errors.length > 0 && (
                        <div className="space-y-1 text-rose-400 text-right dir-rtl bg-rose-950/30 p-2.5 rounded-lg border border-rose-900/50 mt-1">
                          {snippetOutputs[idx].errors.map((err, eIdx) => (
                            <div key={eIdx}>{err}</div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Callout Box */}
            {sec.callout && (
              <div
                className={`p-4 rounded-2xl border flex items-start gap-3 ${
                  sec.callout.type === 'celebration'
                    ? 'bg-amber-950/20 border-amber-500/40 text-amber-200'
                    : sec.callout.type === 'warning'
                    ? 'bg-rose-950/20 border-rose-500/40 text-rose-200'
                    : sec.callout.type === 'common_mistake'
                    ? 'bg-orange-950/20 border-orange-500/40 text-orange-200'
                    : 'bg-sky-950/20 border-sky-500/40 text-sky-200'
                }`}
              >
                <div className="text-xl shrink-0 mt-0.5">
                  {sec.callout.type === 'celebration' ? '💥' : sec.callout.type === 'warning' ? '👻' : '🔍'}
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-sm sm:text-base text-white">
                    <FormattedArabicText text={sec.callout.title} />
                  </h4>
                  <p className="text-xs sm:text-sm leading-relaxed opacity-90">
                    <FormattedArabicText text={sec.callout.content} />
                  </p>
                </div>
              </div>
            )}
          </section>
        ))}
      </div>

      {/* Exercises Section: "جرّب بنفسك: توقّع الناتج" */}
      {chapter.exercises.length > 0 && (
        <section className="bg-slate-900/60 rounded-2xl border border-slate-800 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  جرّب بنفسك: توقّع الناتج
                </h3>
                <p className="text-xs text-slate-400">
                  فكر وتوقع ما سيطبعه الكمبيوتر قبل الضغط على كشف النتيجة!
                </p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {chapter.exercises.map((ex) => {
              const isRevealed = revealedExercises[ex.id] ?? false;
              const output = exerciseOutputs[ex.id];

              return (
                <div
                  key={ex.id}
                  className="bg-slate-950 rounded-xl border border-slate-800/90 overflow-hidden flex flex-col justify-between"
                >
                  <div className="p-3 bg-slate-900/60 border-b border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-200">{ex.title}</span>
                    {(() => {
                      const lang = detectCodeLanguage(ex.code);
                      const hasHtmlOrCss =
                        lang === 'html' ||
                        lang === 'css' ||
                        ex.code.includes('<') ||
                        (ex.code.includes('{') && ex.code.includes(':'));
                      const isPureWeb = lang === 'html' || lang === 'css';

                      return (
                        <div className="flex items-center gap-2">
                          {hasHtmlOrCss && (
                            <button
                              onClick={() =>
                                setExercisePreviews((prev) => ({ ...prev, [ex.id]: !prev[ex.id] }))
                              }
                              className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-medium"
                            >
                              <Eye className="w-3 h-3" />
                              <span>{exercisePreviews[ex.id] ? 'إخفاء المعاينة' : 'معاينة في المتصفح'}</span>
                            </button>
                          )}
                          {!isPureWeb && (
                            <button
                              onClick={async () => {
                                const res = await runJavaScript(ex.code);
                                setExerciseOutputs((prev) => ({
                                  ...prev,
                                  [ex.id]: { logs: res.logs, errors: res.errors },
                                }));
                              }}
                              className="flex items-center gap-1 text-amber-400 hover:text-amber-300 font-medium"
                            >
                              <Play className="w-3 h-3 fill-current" />
                              <span>شغّل الكود</span>
                            </button>
                          )}
                        </div>
                      );
                    })()}
                  </div>

                  <CodeBlock code={ex.code} />

                  {/* HTML / CSS Exercise Preview */}
                  {exercisePreviews[ex.id] && (
                    <div className="p-2.5 bg-slate-900 border-t border-slate-800 animate-fadeIn">
                      <LiveBrowserPreview
                        htmlContent={buildHtmlPreviewDocument(
                          ex.code.includes('console.log')
                            ? ex.code
                                .replace(/console\.log\((['"`])([\s\S]*?)\1\);?/, '$2')
                                .replace(/\\n/g, '\n')
                            : ex.code,
                          ex.code.includes('{') && ex.code.includes(':') ? 'css' : 'html'
                        )}
                        title="معاينة مخرجات التمرين في المتصفح"
                        height="170px"
                      />
                    </div>
                  )}

                  {/* Run Output */}
                  {output && output.logs.length > 0 && (
                    <div
                      dir="ltr"
                      style={{ direction: 'ltr', textAlign: 'left', unicodeBidi: 'isolate' }}
                      className="px-3 py-2 bg-slate-900 border-t border-slate-800 text-[11px] font-mono text-emerald-400 text-left"
                    >
                      {output.logs.map((l, i) => (
                        <div key={i}>{l}</div>
                      ))}
                    </div>
                  )}

                  {/* Expected Output Reveal */}
                  <div className="p-3 bg-slate-900/40 border-t border-slate-800/60 text-xs">
                    {isRevealed ? (
                      <div className="space-y-1.5 animate-fadeIn">
                        <div className="text-slate-400 flex items-center justify-between">
                          <span>الناتج المتوقع:</span>
                          <span className="text-emerald-400 font-bold font-mono">
                            {ex.expectedOutput}
                          </span>
                        </div>
                        {ex.explanation && (
                          <p className="text-[11px] text-slate-400 bg-slate-950/60 p-2 rounded border border-slate-800">
                            💡 <FormattedArabicText text={ex.explanation} />
                          </p>
                        )}
                      </div>
                    ) : (
                      <button
                        onClick={() =>
                          setRevealedExercises((prev) => ({ ...prev, [ex.id]: true }))
                        }
                        className="w-full py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-center font-medium transition"
                      >
                        اضغط لكشف الحل والتفسير 🔍
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Challenge Section: "وريني شطارتك 🧠" */}
      {chapter.challenge && (
        <section className="bg-gradient-to-b from-amber-950/20 via-slate-900 to-slate-950 rounded-2xl border border-amber-500/30 p-6 space-y-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500 text-slate-950 font-black text-lg">
              🧠
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                <FormattedArabicText text={chapter.challenge.title} />
              </h3>
              <p className="text-xs text-amber-300/80">
                تحدي عملي لتطبيق المفهوم بنفسك وكتابة الكود
              </p>
            </div>
          </div>

          <div className="text-sm text-slate-200 leading-relaxed font-medium bg-slate-950/70 p-3.5 rounded-xl border border-amber-500/20">
            <FormattedArabicText text={chapter.challenge.prompt} />
          </div>

          {/* Interactive Code Box for Challenge */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span>اكتب كود الحل هنا:</span>
                <span className="text-[11px] text-emerald-400/90 font-mono flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>محفوظ تلقائياً</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowChallengeHint(!showChallengeHint)}
                  className="text-amber-400 hover:text-amber-300 text-xs"
                >
                  {showChallengeHint ? 'إخفاء التلميح' : 'عايز تلميح؟ 💡'}
                </button>
                <button
                  onClick={() => setShowChallengeSolution(!showChallengeSolution)}
                  className="text-slate-400 hover:text-slate-200 text-xs"
                >
                  {showChallengeSolution ? 'إخفاء الحل' : 'عرض الحل النموذجي 🔑'}
                </button>
              </div>
            </div>

            {showChallengeHint && (
              <div className="p-3 bg-amber-950/40 rounded-xl border border-amber-500/30 text-xs text-amber-200 animate-fadeIn">
                <strong>تلميح:</strong> <FormattedArabicText text={chapter.challenge.hint} />
              </div>
            )}

            {showChallengeSolution && (
              <div className="rounded-xl border border-slate-700 overflow-hidden text-xs animate-fadeIn">
                <div className="bg-slate-900 px-3 py-1.5 text-right text-slate-400 text-[10px] dir-rtl font-sans border-b border-slate-800">
                  الحل النموذجي المقترح:
                </div>
                <CodeBlock code={chapter.challenge.solutionCode} />
              </div>
            )}

            <textarea
              value={challengeCode}
              onChange={(e) => handleChallengeChange(e.target.value)}
              rows={5}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs sm:text-sm font-mono text-amber-200 focus:outline-none focus:border-amber-500 text-left dir-ltr"
              placeholder="// اكتب كودك هنا..."
            />

            <div className="flex items-center justify-between">
              <button
                onClick={() => handleChallengeChange(chapter.challenge?.initialCode || '')}
                className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                استعادة الكود المبدئي
              </button>

              <button
                onClick={handleTestChallenge}
                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs sm:text-sm transition active:scale-95 shadow-lg shadow-amber-500/20"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                اختبر حلي الآن
              </button>
            </div>

            {challengeOutput && (
              <div className="mt-3 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono">
                <div className="flex items-center justify-between text-[11px] mb-1 text-slate-400">
                  <span>النتيجة:</span>
                  {challengeSuccess ? (
                    <span className="text-emerald-400 font-bold">رائع! تم تنفيذ الكود بنجاح 🚀</span>
                  ) : (
                    <span className="text-rose-400 font-bold">هناك خطأ بحاجة لمراجعة</span>
                  )}
                </div>

                {challengeHtmlPreview && (
                  <div className="mt-2.5">
                    <LiveBrowserPreview
                      htmlContent={challengeHtmlPreview}
                      title="معاينة حلك في المتصفح"
                      height="240px"
                    />
                  </div>
                )}

                {challengeOutput.logs.length > 0 && (
                  <div
                    dir="ltr"
                    style={{ direction: 'ltr', textAlign: 'left', unicodeBidi: 'isolate' }}
                    className="text-emerald-400 text-left space-y-1 bg-slate-900/80 p-2 rounded"
                  >
                    {challengeOutput.logs.map((l, i) => (
                      <div key={i}>{l}</div>
                    ))}
                  </div>
                )}

                {challengeOutput.errors.length > 0 && (
                  <div className="text-rose-400 text-right dir-rtl space-y-1 bg-rose-950/30 p-2 rounded mt-1">
                    {challengeOutput.errors.map((e, i) => (
                      <div key={i}>{e}</div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-8 border-t border-slate-800">
        {onPrevChapter ? (
          <button
            onClick={onPrevChapter}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs sm:text-sm font-semibold transition"
          >
            <ArrowRight className="w-4 h-4" />
            الفصل السابق
          </button>
        ) : (
          <div></div>
        )}

        {onNextChapter ? (
          <button
            onClick={onNextChapter}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs sm:text-sm font-bold transition shadow-lg shadow-amber-500/20"
          >
            الفصل التالي
            <ArrowLeft className="w-4 h-4" />
          </button>
        ) : (
          <div></div>
        )}
      </div>
    </article>
  );
};
