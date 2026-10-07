import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { runJavaScript } from '../utils/codeRunner';
import { detectCodeLanguage, buildHtmlPreviewDocument } from '../utils/codePreview';
import { generateSmartLocalHint, SmartHintResponse } from '../utils/smartHints';
import { LiveBrowserPreview } from './LiveBrowserPreview';
import { StandardEmptyState } from './ui/StateFeedback';

const CodeEditor = lazy(() =>
  import('./CodeEditor').then((module) => ({ default: module.CodeEditor }))
);
import {
  fetchStudentWork,
  saveStudentDraftToServer,
  saveStudentSnippetToServer,
  deleteStudentSnippetFromServer,
  saveProgressEntry,
  sessionHeaders,
  StudentSnippet,
} from '../utils/activation';
import {
  Play,
  RotateCcw,
  Copy,
  Check,
  Terminal,
  Code2,
  Trash2,
  Sparkles,
  Globe,
  Sun,
  Moon,
  Save,
  FolderCode,
  X,
  Lightbulb,
  Clock,
  CheckCircle2,
  FileCode2,
  Trophy,
  Award,
  MessageSquareHeart,
  Target,
  MoreHorizontal,
  AlertTriangle,
  PanelRight,
} from 'lucide-react';
import { CODING_CHALLENGES, CodingChallenge } from '../data/codingChallenges';
import { markChallengeCompleted } from '../utils/challengesAndTts';
import { useSoundManager } from '../hooks/useSoundManager';

interface CodePlaygroundProps {
  initialCode?: string;
  activeCode?: string;
  studentName?: string;
}

const presets = [
  {
    name: 'أول كود وطباعة نصوص',
    code: `console.log("أهلاً بيك في عالم البرمجة!");
console.log("النتيجة هي:", 2026);
console.log(7 * 6);`,
  },
  {
    name: 'حسابات وباقي القسمة %',
    code: `const price = 50;
const quantity = 3;
const total = price * quantity;
console.log("الإجمالي: " + total);

// فحص الزوجي والفردي
const num = 17;
console.log("باقي قسمة 17 على 2:", num % 2);`,
  },
  {
    name: 'الشروط والمعاملات المنطقية',
    code: `const age = 19;
const hasLicense = true;

if (age >= 18 && hasLicense) {
  console.log("تقدر تسوق العربية بأمان 🚗");
} else {
  console.log("غير مسموح بالقيادة");
}`,
  },
  {
    name: 'حلقة تكرار وفحص الأرقام',
    code: `for (let i = 1; i <= 6; i++) {
  if (i % 2 === 0) {
    console.log(i + " -> رقم زوجي");
  } else {
    console.log(i + " -> رقم فردي");
  }
}`,
  },
  {
    name: 'دالة حساب مساحة المستطيل',
    code: `function calculateArea(width, height) {
  return width * height;
}

const area1 = calculateArea(8, 5);
console.log("مساحة المستطيل الأول: " + area1);

const area2 = calculateArea(10, 3);
console.log("مساحة المستطيل الثاني: " + area2);`,
  },
  {
    name: 'هيكل صفحة ويب HTML كاملة',
    code: `<!DOCTYPE html>
<html lang="ar" dir="rtl">
  <head>
    <title>صفحتي الأولى</title>
    <style>
      body { font-family: sans-serif; padding: 25px; background: #0f172a; color: #f8fafc; }
      h1 { color: #38bdf8; }
      p { color: #cbd5e1; font-size: 16px; }
      .badge { background: #0284c7; padding: 4px 10px; border-radius: 6px; font-size: 13px; font-weight: bold; }
    </style>
  </head>
  <body>
    <h1>مرحباً بكم في موقعي الأول!</h1>
    <p>هذه صفحة ويب حقيقية مبنية بـ HTML و CSS وتعمل في المتصفح.</p>
    <span class="badge">متعلم ويب</span>
  </body>
</html>`,
  },
  {
    name: 'تنسيق زرار CSS مع تأثير الفأرة :hover',
    code: `button {
  background-color: #0d9488;
  color: white;
  border: 2px solid #14b8a6;
  border-radius: 10px;
  padding: 12px 26px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s;
}

button:hover {
  background-color: #042f2e;
  border-color: #2dd4bf;
  transform: scale(1.05);
}

.warning {
  color: #fbbf24;
  font-size: 14px;
  margin-top: 10px;
}`,
  },
  {
    name: 'زرار تفاعلي مع العداد (DOM + JS)',
    code: `<!DOCTYPE html>
<html lang="ar" dir="rtl">
  <head>
    <style>
      body { background: #0f172a; color: white; padding: 30px; font-family: sans-serif; text-align: center; }
      #count { font-size: 48px; color: #f59e0b; font-weight: bold; margin: 15px 0; }
      button { background: #f59e0b; color: #0f172a; border: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; font-size: 16px; cursor: pointer; }
      button:active { transform: scale(0.95); }
    </style>
  </head>
  <body>
    <h3>تجرِبة تفاعل الـ DOM المباشر:</h3>
    <div id="count">0</div>
    <button id="addBtn">+ زوّد العداد</button>

    <script>
      let c = 0;
      const display = document.getElementById('count');
      document.getElementById('addBtn').addEventListener('click', function() {
        c++;
        display.textContent = c;
        console.log("تم النقر! القيمة الحالية:", c);
      });
    </script>
  </body>
</html>`,
  },
];

export const CodePlayground: React.FC<CodePlaygroundProps> = ({
  initialCode,
  activeCode,
  studentName,
}) => {
  const [code, setCode] = useState<string>(() => {
    if (initialCode) return initialCode;
    if (activeCode) {
      const cached = localStorage.getItem(`codemasr_draft_${activeCode.toUpperCase()}`);
      if (cached) return cached;
    }
    return presets[0].code;
  });

  const [logs, setLogs] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [execTime, setExecTime] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState<'auto' | 'js' | 'html'>('auto');
  const [previewTheme, setPreviewTheme] = useState<'dark' | 'light'>('dark');
  const [previewRefreshTrigger, setPreviewRefreshTrigger] = useState(0);
  const [showMoreActions, setShowMoreActions] = useState(false);
  const [mobileWorkspaceTab, setMobileWorkspaceTab] = useState<'code' | 'output'>('code');
  const { playSuccess, playCompletion, playError, playRun } = useSoundManager();

  // Student Saved Code & Snippets
  const [snippets, setSnippets] = useState<StudentSnippet[]>([]);
  const [showSavedSnippetsModal, setShowSavedSnippetsModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [snippetTitleInput, setSnippetTitleInput] = useState('');
  const [isSavingSnippet, setIsSavingSnippet] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [copiedSnippetId, setCopiedSnippetId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Smart Hints States
  const [isHintLoading, setIsHintLoading] = useState(false);
  const [smartHint, setSmartHint] = useState<SmartHintResponse | null>(null);
  const [showHintBox, setShowHintBox] = useState(false);
  const [hintCopied, setHintCopied] = useState(false);

  const codeKey = (activeCode || localStorage.getItem('codemasr_active_code') || 'GUEST').trim().toUpperCase();

  // Coding Challenges States
  const [activeChallenge, setActiveChallenge] = useState<CodingChallenge | null>(null);
  const [isProgressLoaded, setIsProgressLoaded] = useState(false);
  const [completedChallengeIds, setCompletedChallengeIds] = useState<string[]>(() => {
    try {
      const key = (activeCode || localStorage.getItem('codemasr_active_code') || 'GUEST').trim().toUpperCase();
      const saved = localStorage.getItem(`codemasr_completed_challenges_${key}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [showChallengesModal, setShowChallengesModal] = useState(false);
  const [challengeResult, setChallengeResult] = useState<{ passed: boolean; message: string; hint?: string } | null>(null);
  const [isVerifyingChallenge, setIsVerifyingChallenge] = useState(false);
  const [celebrationModal, setCelebrationModal] = useState<{ title: string; points: number } | null>(null);

  // Teacher feedback notification
  const [coachFeedback, setCoachFeedback] = useState<string | null>(null);
  const [dismissedFeedback, setDismissedFeedback] = useState(false);

  const initialCodeLoadedRef = useRef(false);

  // Determine effective mode
  const detectedLang = detectCodeLanguage(code);
  const isWebMode =
    mode === 'html' || (mode === 'auto' && (detectedLang === 'html' || detectedLang === 'css'));

  // Load student work (draft & snippets) on mount / code change
  useEffect(() => {
    if (!activeCode) return;
    const clean = activeCode.trim().toUpperCase();

    fetchStudentWork(clean).then((work) => {
      if (work.snippets) {
        setSnippets(work.snippets);
      }
      // If no explicit initialCode was passed and student has saved draft code, restore it
      if (!initialCode && work.draftCode && !initialCodeLoadedRef.current) {
        setCode(work.draftCode);
        initialCodeLoadedRef.current = true;
      }
    });

    // 1. Immediately read cached progress from localStorage
    try {
      const savedChallenges = localStorage.getItem(`codemasr_completed_challenges_${clean}`);
      if (savedChallenges) {
        const parsed = JSON.parse(savedChallenges);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCompletedChallengeIds((prev) => Array.from(new Set([...prev, ...parsed])));
        }
      }
    } catch {}

    // 2. Load student progress from server (completed challenges & coach feedback)
    fetch('/api/progress', { headers: sessionHeaders() })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.success) {
          const entries = data.progress?.stateEntries as Record<string, { value: boolean | string; updatedAt: number }> | undefined;
          if (entries) {
            Object.entries(entries).forEach(([key, entry]) => {
              if (key.startsWith('challengeSolution:') && typeof entry.value === 'string') {
                const challengeId = key.slice('challengeSolution:'.length);
                localStorage.setItem(`codemasr_challenge_code_${clean}_${challengeId}`, entry.value);
              }
            });
          }
          if (Array.isArray(data.progress?.completedChallenges)) {
            setCompletedChallengeIds((prev) => {
              const merged = Array.from(new Set([...prev, ...data.progress.completedChallenges]));
              try {
                localStorage.setItem(`codemasr_completed_challenges_${clean}`, JSON.stringify(merged));
              } catch {}
              return merged;
            });
          }
          if (data.feedback && !dismissedFeedback) {
            setCoachFeedback(data.feedback);
          }
        }
      })
      .catch(() => {})
      .finally(() => setIsProgressLoaded(true));
  }, [activeCode, initialCode, dismissedFeedback]);

  // Auto-save student draft code (debounced 1200ms)
  useEffect(() => {
    if (!activeCode) return;
    const clean = activeCode.trim().toUpperCase();

    // Cache locally immediately
    try {
      localStorage.setItem(`codemasr_draft_${clean}`, code);
    } catch {}

    setAutoSaveStatus('saving');
    const timer = setTimeout(() => {
      saveStudentDraftToServer(clean, code);
      setAutoSaveStatus('saved');
    }, 1200);

    return () => clearTimeout(timer);
  }, [code, activeCode]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleRun = async () => {
    playRun();
    setMobileWorkspaceTab('output');
    if (isWebMode) {
      setPreviewRefreshTrigger((prev) => prev + 1);
      playSuccess();
      return;
    }

    setIsRunning(true);
    const result = await runJavaScript(code);
    setLogs(result.logs);
    setErrors(result.errors);
    setExecTime(result.executionTimeMs);
    setIsRunning(false);

    if (result.errors && result.errors.length > 0) {
      playError();
    } else {
      playSuccess();
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClearConsole = () => {
    setLogs([]);
    setErrors([]);
    setExecTime(null);
  };

  // Save new snippet to student's account
  const handleSaveSnippet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCode) return;
    const clean = activeCode.trim().toUpperCase();

    const title = snippetTitleInput.trim() || `مشروعي ${new Date().toLocaleTimeString('ar-EG')}`;
    setIsSavingSnippet(true);

    const lang = isWebMode ? 'html' : 'javascript';
    const res = await saveStudentSnippetToServer(clean, title, code, lang);

    setIsSavingSnippet(false);
    if (res.success && res.snippet) {
      setSnippets((prev) => [res.snippet!, ...prev.filter((s) => s.id !== res.snippet!.id)]);
      setShowSaveModal(false);
      setSnippetTitleInput('');
      showToast('تم حفظ الكود في حسابك بنجاح! 💾');
    } else {
      showToast(res.message || 'حدث خطأ أثناء الحفظ');
    }
  };

  // Delete snippet
  const handleDeleteSnippet = async (snippetId: string) => {
    if (!activeCode) return;
    const snippet = snippets.find((item) => item.id === snippetId);
    if (!window.confirm(`هل تريد حذف "${snippet?.title || 'هذا الكود'}" نهائياً؟`)) return;
    const clean = activeCode.trim().toUpperCase();

    const success = await deleteStudentSnippetFromServer(clean, snippetId);
    if (success) {
      setSnippets((prev) => prev.filter((s) => s.id !== snippetId));
      showToast('تم حذف الكود من قائمة ملفاتك.');
    }
  };

  // Load a saved snippet into editor
  const handleLoadSnippet = (s: StudentSnippet) => {
    setCode(s.code);
    setShowSavedSnippetsModal(false);
    showToast(`تم فتح "${s.title}" في المحرر ⚡`);
  };

  // Copy snippet from list
  const handleCopySnippetCode = (snip: StudentSnippet) => {
    navigator.clipboard.writeText(snip.code);
    setCopiedSnippetId(snip.id);
    setTimeout(() => setCopiedSnippetId(null), 2000);
  };

  // Smart Hints Handler
  const fetchSmartHint = async (specificError?: string) => {
    setIsHintLoading(true);
    setShowHintBox(true);

    const activeError = specificError || (errors.length > 0 ? errors[0] : '');

    try {
      const response = await fetch('/api/smart-hint', {
        method: 'POST',
        headers: sessionHeaders(true),
        body: JSON.stringify({
          code,
          error: activeError,
          mode: detectedLang,
        }),
      });

      if (!response.ok) {
        throw new Error('Server returned an error');
      }

      const data = await response.json();
      if (data && (data.rawText || data.hint)) {
        setSmartHint(data);
      } else {
        const local = generateSmartLocalHint(code, activeError, detectedLang);
        setSmartHint(local);
      }
    } catch {
      const local = generateSmartLocalHint(code, activeError, detectedLang);
      setSmartHint(local);
    } finally {
      setIsHintLoading(false);
    }
  };

  const handleCopyHint = () => {
    if (!smartHint) return;
    const textToCopy = smartHint.rawText
      ? smartHint.rawText
      : `${smartHint.diagnosis}\n\n${smartHint.hint}\n\n${smartHint.proTip || ''}`;
    navigator.clipboard.writeText(textToCopy);
    setHintCopied(true);
    setTimeout(() => setHintCopied(false), 2000);
  };

  // Challenge Selection (restores previous code written by user if available)
  const handleSelectChallenge = (ch: CodingChallenge) => {
    setActiveChallenge(ch);
    const savedChallengeCode = localStorage.getItem(`codemasr_challenge_code_${codeKey}_${ch.id}`);
    setCode(savedChallengeCode || ch.starterCode);
    setChallengeResult(null);
    setShowChallengesModal(false);
    handleClearConsole();
    if (ch.id === 'challenge-6-dom') {
      setMode('html');
    } else {
      setMode('js');
    }
    showToast(`تم فتح: ${ch.title} 🚀`);
  };

  // Auto-save active challenge code
  useEffect(() => {
    if (!isProgressLoaded || !activeChallenge) return;
    try {
      localStorage.setItem(`codemasr_challenge_code_${codeKey}_${activeChallenge.id}`, code);
    } catch {}
    const timer = window.setTimeout(() => {
      void saveProgressEntry(codeKey, `challengeSolution:${activeChallenge.id}`, code);
    }, 1200);
    return () => window.clearTimeout(timer);
  }, [code, activeChallenge, codeKey, isProgressLoaded]);

  useEffect(() => {
    if (!isProgressLoaded || !activeChallenge || code !== activeChallenge.starterCode) return;
    const saved = localStorage.getItem(`codemasr_challenge_code_${codeKey}_${activeChallenge.id}`);
    if (saved && saved !== code) setCode(saved);
  }, [isProgressLoaded, activeChallenge, code, codeKey]);

  // Verify Active Challenge Solution
  const handleVerifyChallenge = async () => {
    if (!activeChallenge) return;
    setIsVerifyingChallenge(true);

    // 1. Run the code first to capture fresh logs & errors
    let currentLogs: string[] = [];
    if (!isWebMode) {
      const exec = await runJavaScript(code);
      setLogs(exec.logs);
      setErrors(exec.errors);
      setExecTime(exec.executionTimeMs);
      currentLogs = exec.logs;
    }

    // 2. Run challenge validator
    const checkRes = activeChallenge.check(code, currentLogs);
    setChallengeResult(checkRes);
    setIsVerifyingChallenge(false);

    if (checkRes.passed) {
      playCompletion();
      const updated = await markChallengeCompleted(activeChallenge.id);
      const newIds = Array.from(
        new Set([
          ...completedChallengeIds,
          ...(Array.isArray(updated) ? updated : []),
          activeChallenge.id,
        ])
      );
      setCompletedChallengeIds(newIds);
      try {
        localStorage.setItem(`codemasr_completed_challenges_${codeKey}`, JSON.stringify(newIds));
        localStorage.setItem(`codemasr_challenge_code_${codeKey}_${activeChallenge.id}`, code);
      } catch {}
      setCelebrationModal({ title: activeChallenge.title, points: activeChallenge.points });
    } else {
      playError();
    }
  };

  return (
    <div className="mx-auto max-w-[1480px] space-y-4 px-3 py-4 pb-28 sm:px-5 sm:py-6 lg:px-6 lg:pb-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div role="status" aria-live="polite" className="fixed bottom-24 right-4 z-50 flex max-w-[calc(100vw-2rem)] items-center gap-2 rounded-2xl border border-emerald-500/40 bg-emerald-950 px-4 py-3 text-xs font-semibold text-emerald-200 shadow-2xl animate-fadeIn sm:bottom-6 sm:right-6 sm:text-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Bar */}
      <div className="ui-card p-3 sm:p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
              {isWebMode ? (
                <Globe className="w-5 h-5 text-cyan-400" />
              ) : (
                <Terminal className="w-5 h-5 text-amber-400" />
              )}
              <span>محرّر الأكواد</span>
            </h2>
            <p className="hidden sm:block text-xs text-slate-400 mt-0.5">
              اكتب وجرب الكود بأمان — يُحفظ تلقائيًا في حسابك
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <span className={`hidden rounded-full border px-2 py-1 font-mono text-[10px] font-bold sm:inline-flex ${
              isWebMode
                ? 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300'
                : 'border-amber-500/30 bg-amber-500/10 text-amber-300'
            }`} dir="ltr">
              {isWebMode ? (detectedLang === 'css' ? 'CSS' : 'HTML') : 'JavaScript'}
            </span>
            {activeCode && (
              <span className="flex shrink-0 items-center gap-1 rounded-full border border-slate-800 bg-slate-950 px-2 py-1 text-[10px] font-bold" role="status" aria-live="polite">
                {autoSaveStatus === 'saving' ? (
                  <span className="animate-pulse text-amber-400">جاري الحفظ</span>
                ) : (
                  <span className="flex items-center gap-1 text-emerald-400">
                    <Check className="w-3 h-3" />
                    <span>محفوظ</span>
                  </span>
                )}
              </span>
            )}
          </div>
        </div>

        {/* Main editor controls: language, example, run, and save */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap sm:items-center gap-2">
          <div role="group" aria-label="اختيار لغة المحرر" className="col-span-2 sm:col-span-1 flex w-full sm:w-auto items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setMode('auto')}
              aria-pressed={mode === 'auto'}
              aria-label="اكتشاف اللغة تلقائيًا"
              className={`flex-1 sm:flex-none px-2.5 py-2 sm:py-1.5 rounded-lg transition ${
                mode === 'auto'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              تلقائي
            </button>
            <button
              onClick={() => setMode('js')}
              aria-pressed={mode === 'js'}
              aria-label="JavaScript"
              className={`flex-1 sm:flex-none px-2.5 py-2 sm:py-1.5 rounded-lg transition flex items-center justify-center gap-1 ${
                mode === 'js'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Terminal className="w-3 h-3" />
              <span>JS</span>
            </button>
            <button
              onClick={() => setMode('html')}
              aria-pressed={mode === 'html'}
              aria-label="HTML وCSS"
              className={`flex-1 sm:flex-none px-2.5 py-2 sm:py-1.5 rounded-lg transition flex items-center justify-center gap-1 ${
                mode === 'html'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Globe className="w-3 h-3" />
              <span>HTML & CSS</span>
            </button>
          </div>

          <select
            onChange={(e) => {
              const selected = presets.find((p) => p.name === e.target.value);
              if (selected) {
                setCode(selected.code);
                handleClearConsole();
                setShowHintBox(false);
              }
            }}
            aria-label="اختيار مثال جاهز"
            className="col-span-2 sm:col-span-1 sm:w-52 min-w-0 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 sm:py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
          >
            <option value="">مثال جاهز من الكورس...</option>
            {presets.map((p, idx) => (
              <option key={idx} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>

          <button
            onClick={handleRun}
            disabled={isRunning}
            title="تشغيل الكود (Ctrl+Enter)"
            className={`col-span-2 sm:col-span-1 flex w-full sm:w-auto items-center justify-center gap-2 font-black px-5 py-3 sm:py-2 rounded-xl text-sm transition active:scale-[0.99] shadow-lg disabled:opacity-60 ${
              isWebMode
                ? 'bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 text-slate-950 shadow-cyan-500/25'
                : 'bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 shadow-amber-500/25'
            }`}
          >
            {isWebMode ? <Globe className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
            <span>
              {isRunning ? 'جاري التشغيل...' : isWebMode ? 'معاينة الصفحة' : 'تشغيل الكود'}
            </span>
            <span className="hidden sm:inline text-[10px] font-semibold opacity-70">Ctrl+Enter</span>
          </button>

          <button
            onClick={() => {
              setSnippetTitleInput(`مشروع ${snippets.length + 1} - ${isWebMode ? 'ويب' : 'JS'}`);
              setShowSaveModal(true);
            }}
            className="flex min-w-0 items-center justify-center gap-1.5 px-2.5 py-2.5 sm:py-2 rounded-xl bg-emerald-600/15 hover:bg-emerald-600/25 border border-emerald-500/35 text-emerald-300 text-xs font-bold transition active:scale-95"
            title="حفظ الكود الحالي في ملفاتك الدائمة باسم مخصص"
          >
            <Save className="w-4 h-4 shrink-0" />
            <span>حفظ</span>
          </button>

          <button
            onClick={() => setShowSavedSnippetsModal(true)}
            className="flex min-w-0 items-center justify-center gap-1.5 px-2.5 py-2.5 sm:py-2 rounded-xl bg-indigo-600/15 hover:bg-indigo-600/25 border border-indigo-500/35 text-indigo-300 text-xs font-bold transition active:scale-95"
            title="عرض كل الأكواد والمشاريع التي قمت بحفظها"
          >
            <FolderCode className="w-4 h-4 shrink-0" />
            <span className="truncate">المحفوظات ({snippets.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setShowMoreActions((isOpen) => !isOpen)}
            aria-expanded={showMoreActions}
            aria-controls="playground-more-actions"
            className="col-span-2 sm:col-span-1 flex items-center justify-center gap-1.5 px-3 py-2.5 sm:py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
          >
            <MoreHorizontal className="w-4 h-4" />
            <span>{showMoreActions ? 'إخفاء الأدوات' : 'أدوات إضافية'}</span>
            <span className={`transition-transform ${showMoreActions ? 'rotate-180' : ''}`}>⌄</span>
          </button>

          <div id="playground-more-actions" hidden={!showMoreActions} className="col-span-2 sm:col-span-full sm:w-full grid grid-cols-2 sm:flex sm:flex-wrap gap-2 pt-1">
              <button
                onClick={() => {
                  setShowChallengesModal(true);
                  setShowMoreActions(false);
                }}
                className="flex flex-1 items-center justify-center gap-1.5 px-2.5 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold transition"
                title="تحديات برمجية تفاعلية مرتبطة بفصول الكتاب"
              >
                <Trophy className="w-4 h-4 shrink-0" />
                <span>التحديات {completedChallengeIds.length}/{CODING_CHALLENGES.length}</span>
              </button>
              <button
                onClick={() => {
                  fetchSmartHint();
                  setShowMoreActions(false);
                }}
                className="flex flex-1 items-center justify-center gap-1.5 px-2.5 py-2.5 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-orange-300 text-xs font-bold transition"
                title="طلب تلميح ذكي حول الكود أو الأخطاء"
              >
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>تلميح ذكي</span>
              </button>
              <button
                onClick={() => {
                  handleCopy();
                  setShowMoreActions(false);
                }}
                className="flex flex-1 items-center justify-center gap-1.5 px-2.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'تم النسخ' : 'نسخ الكود'}</span>
              </button>
              <button
                onClick={() => {
                  setCode('');
                  setShowHintBox(false);
                  setShowMoreActions(false);
                }}
                className="flex flex-1 items-center justify-center gap-1.5 px-2.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition"
              >
                <RotateCcw className="w-4 h-4" />
                <span>مسح الكود</span>
              </button>
              {isWebMode && (
                <button
                  onClick={() => setPreviewTheme((theme) => theme === 'dark' ? 'light' : 'dark')}
                  className="col-span-2 sm:col-span-1 flex flex-1 items-center justify-center gap-1.5 px-2.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition"
                  title="تبديل مظهر المعاينة بين الفاتح والداكن"
                >
                  {previewTheme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-cyan-400" />}
                  <span>{previewTheme === 'dark' ? 'مظهر فاتح' : 'مظهر داكن'}</span>
                </button>
              )}
          </div>
        </div>
      </div>

      {/* Teacher / Coach Feedback Banner */}
      {coachFeedback && !dismissedFeedback && (
        <div className="bg-gradient-to-r from-purple-950/60 via-slate-900 to-purple-950/60 border border-purple-500/40 rounded-2xl p-4 shadow-xl flex items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-300 flex items-center justify-center font-bold text-lg shrink-0">
              💌
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-xs sm:text-sm">رسالة تشجيع خاصة من مدرب المنصة:</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">
                  Coach Note
                </span>
              </div>
              <p className="text-xs text-purple-200 mt-0.5 leading-relaxed font-sans">
                "{coachFeedback}"
              </p>
            </div>
          </div>
          <button
            onClick={() => setDismissedFeedback(true)}
            className="p-1 text-slate-400 hover:text-white rounded-lg transition"
            title="إخفاء الرسالة"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Active Challenge Banner */}
      {activeChallenge && (
        <div className="bg-gradient-to-r from-slate-900 via-amber-950/30 to-slate-900 border-2 border-amber-500/50 rounded-2xl p-4 sm:p-5 shadow-2xl space-y-3 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-500/20 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-300 flex items-center justify-center font-bold text-lg shadow-sm">
                🏆
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-amber-400 font-mono font-bold">
                    {activeChallenge.chapterTitle}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-950 text-slate-300 border border-slate-800">
                    {activeChallenge.difficultyLabel}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold">
                    +{activeChallenge.points} نقطة 🎯
                  </span>
                  {completedChallengeIds.includes(activeChallenge.id) && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 flex items-center gap-1">
                      <Check className="w-3 h-3" /> تم الحل مسبقاً
                    </span>
                  )}
                </div>
                <h3 className="text-base sm:text-lg font-black text-white mt-0.5">
                  {activeChallenge.title}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              {/* Reset to starter code button */}
              <button
                type="button"
                onClick={() => {
                  setCode(activeChallenge.starterCode);
                  setChallengeResult(null);
                  try {
                    localStorage.removeItem(`codemasr_challenge_code_${codeKey}_${activeChallenge.id}`);
                  } catch {}
                  showToast('تمت إعادة تعيين كود التحدي للبدء من جديد 🔄');
                }}
                className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-1 transition active:scale-95 border border-slate-700/60"
                title="إعادة تعيين كود التحدي إلى الكود المبدئي"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">إعادة تعيين الكود</span>
              </button>

              {/* Verify Solution Button */}
              <button
                type="button"
                onClick={handleVerifyChallenge}
                disabled={isVerifyingChallenge}
                className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-1.5 transition active:scale-95 shadow-lg shadow-amber-500/20 disabled:opacity-50"
              >
                <Target className="w-4 h-4" />
                <span>{isVerifyingChallenge ? 'جاري الفحص...' : 'تحقق من حلي 🎯'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveChallenge(null);
                  setChallengeResult(null);
                }}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
                title="إغلاق التحدي والعودة للوضع الحر"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs leading-relaxed">
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-1">
              <span className="font-bold text-amber-300 block">📖 قصة التحدي:</span>
              <p className="text-slate-300 font-sans">{activeChallenge.story}</p>
            </div>

            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-1">
              <span className="font-bold text-cyan-300 block">🎯 المطلوب منك بالملي:</span>
              <p className="text-slate-300 font-sans">{activeChallenge.objective}</p>
            </div>
          </div>

          {/* Verification Result Banner */}
          {challengeResult && (
            <div
              className={`p-3.5 rounded-xl border flex items-start gap-2.5 animate-fadeIn text-xs sm:text-sm ${
                challengeResult.passed
                  ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                  : 'bg-rose-950/40 border-rose-500/50 text-rose-200'
              }`}
            >
              <div className="text-base shrink-0 mt-0.5">
                {challengeResult.passed ? '🎉' : '⚠️'}
              </div>
              <div className="space-y-1 flex-1">
                <p className="font-bold">{challengeResult.message}</p>
                {challengeResult.hint && (
                  <p className="text-xs opacity-90 text-amber-300 font-sans">
                    💡 تلميح: {challengeResult.hint}
                  </p>
                )}
              </div>
              {!challengeResult.passed && (
                <button
                  type="button"
                  onClick={() => fetchSmartHint(challengeResult.hint || challengeResult.message)}
                  className="px-3 py-1 rounded-lg bg-rose-900/60 hover:bg-rose-900 text-white text-xs font-bold shrink-0 transition"
                >
                  تلميح AI 🤖
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Smart Hints Expandable Banner */}
      {showHintBox && (
        <div className="bg-gradient-to-r from-slate-900 via-amber-950/20 to-slate-900 border border-amber-500/40 rounded-2xl p-4 sm:p-5 shadow-2xl animate-fadeIn space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-300 flex items-center justify-center font-bold text-lg shadow-sm">
                🤖
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-1.5">
                    مدرب البرمجة الذكي 🤖
                  </h3>
                  {smartHint?.source === 'gemini' ? (
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 flex items-center gap-1 shadow-sm">
                      <Sparkles className="w-3 h-3 text-emerald-400" />
                      مدعوم بـ Gemini AI ✨
                    </span>
                  ) : (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                      Smart Hint 💡
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400">
                  توجيه مخصص لمساعدتك في فهم المشكلة واكتشاف الحل بنفسك
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {smartHint && !isHintLoading && (
                <button
                  onClick={handleCopyHint}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition"
                  title="نسخ التلميح"
                >
                  {hintCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span className="hidden sm:inline">{hintCopied ? 'تم النسخ' : 'نسخ'}</span>
                </button>
              )}

              <button
                onClick={() => fetchSmartHint()}
                disabled={isHintLoading}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition"
                title="تحديث أو طلب تلميح آخر"
              >
                <RotateCcw className={`w-3.5 h-3.5 ${isHintLoading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">تحديث</span>
              </button>

              <button
                onClick={() => setShowHintBox(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                title="إغلاق التلميح"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Hint Body */}
          {isHintLoading ? (
            <div className="p-6 flex flex-col items-center justify-center space-y-2.5 text-amber-300/90 text-center">
              <Sparkles className="w-7 h-7 animate-pulse text-amber-400" />
              <p className="text-xs sm:text-sm font-semibold">
                جاري فحص الكود البرمجي ورسالة الخطأ وتجهيز التلميح...
              </p>
              <span className="text-[11px] text-slate-500">لحظات وبيكون جاهز ⏳</span>
            </div>
          ) : smartHint ? (
            <div className="space-y-3 pt-1">
              {smartHint.rawText ? (
                <div className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-slate-950/80 p-4 rounded-xl border border-slate-800 whitespace-pre-wrap font-sans">
                  {smartHint.rawText}
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="bg-rose-950/20 border border-rose-900/40 p-3.5 rounded-xl space-y-1">
                    <span className="font-bold text-rose-300 text-xs sm:text-sm flex items-center gap-1.5">
                      <span>👻 إيه اللي زعل الكمبيوتر؟</span>
                    </span>
                    <p className="text-xs text-rose-100/90 leading-relaxed">
                      {smartHint.diagnosis}
                    </p>
                  </div>

                  <div className="bg-amber-950/20 border border-amber-500/30 p-3.5 rounded-xl space-y-1">
                    <span className="font-bold text-amber-300 text-xs sm:text-sm flex items-center gap-1.5">
                      <Lightbulb className="w-4 h-4 text-amber-400" />
                      <span>💡 تلميح للحل خطوة بخطوة:</span>
                    </span>
                    <p className="text-xs text-amber-100/90 leading-relaxed whitespace-pre-line">
                      {smartHint.hint}
                    </p>
                  </div>

                  {smartHint.proTip && (
                    <div className="md:col-span-2 bg-sky-950/20 border border-sky-500/30 p-3.5 rounded-xl space-y-1">
                      <span className="font-bold text-sky-300 text-xs flex items-center gap-1.5">
                        <span>🔍 تفصيلة صغيرة.. بس حوار!</span>
                      </span>
                      <p className="text-xs text-sky-100/90 leading-relaxed">
                        {smartHint.proTip}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : null}
        </div>
      )}

      {/* Editor & Console / Preview Grid */}
      <div className="sticky top-14 z-30 -mx-1 flex items-center gap-2 rounded-2xl border border-slate-700/80 bg-slate-950/92 p-2 shadow-xl backdrop-blur-xl sm:top-16 lg:hidden">
        <div role="tablist" aria-label="مساحة العمل" className="grid min-w-0 flex-1 grid-cols-2 rounded-xl bg-slate-900 p-1">
          <button
            type="button"
            role="tab"
            aria-selected={mobileWorkspaceTab === 'code'}
            onClick={() => setMobileWorkspaceTab('code')}
            className={`flex min-h-10 items-center justify-center gap-2 rounded-lg text-xs font-bold transition ${
              mobileWorkspaceTab === 'code'
                ? 'bg-slate-700 text-white shadow-sm'
                : 'text-slate-400'
            }`}
          >
            <Code2 className="h-4 w-4" />
            الكود
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mobileWorkspaceTab === 'output'}
            onClick={() => setMobileWorkspaceTab('output')}
            className={`flex min-h-10 items-center justify-center gap-2 rounded-lg text-xs font-bold transition ${
              mobileWorkspaceTab === 'output'
                ? isWebMode
                  ? 'bg-cyan-500/20 text-cyan-200 shadow-sm'
                  : 'bg-emerald-500/15 text-emerald-200 shadow-sm'
                : 'text-slate-400'
            }`}
          >
            {isWebMode ? <PanelRight className="h-4 w-4" /> : <Terminal className="h-4 w-4" />}
            {isWebMode ? 'المعاينة' : 'الكونسول'}
            {!isWebMode && errors.length > 0 && (
              <span className="grid h-5 min-w-5 place-items-center rounded-full bg-rose-500 px-1 font-mono text-[10px] text-white" dir="ltr">
                {errors.length}
              </span>
            )}
          </button>
        </div>
        <button
          type="button"
          onClick={handleRun}
          disabled={isRunning}
          className={`flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl px-4 text-xs font-black text-slate-950 shadow-lg transition active:scale-95 disabled:opacity-60 ${
            isWebMode ? 'bg-cyan-400 shadow-cyan-950/40' : 'bg-amber-400 shadow-amber-950/40'
          }`}
          aria-label={isWebMode ? 'تحديث معاينة الصفحة' : 'تشغيل الكود'}
        >
          {isWebMode ? <Globe className="h-4 w-4" /> : <Play className="h-4 w-4 fill-current" />}
          <span className="hidden min-[390px]:inline">{isRunning ? 'جاري التشغيل' : 'تشغيل'}</span>
        </button>
      </div>

      <div className="flex min-h-[520px] flex-col gap-4 lg:grid lg:h-[calc(100vh-9rem)] lg:min-h-[660px] lg:grid-cols-2">
        {/* Code Editor Panel */}
        <div className={`${mobileWorkspaceTab === 'code' ? 'block' : 'hidden'} h-[calc(100vh-13rem)] min-h-[480px] lg:block lg:h-full lg:min-h-0`}>
          <Suspense
            fallback={
              <div className="h-full bg-slate-950 flex flex-col items-center justify-center gap-3 text-slate-400 text-sm">
                <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                <span>تجهيز محرر الأكواد الشامل...</span>
              </div>
            }
          >
            <CodeEditor
              value={code}
              onChange={setCode}
              onRun={handleRun}
              isWebMode={isWebMode}
              studentName={studentName}
              activeCode={activeCode}
              placeholder={
                isWebMode
                  ? '<!-- اكتب كود HTML أو CSS هنا وستظهر المعاينة الحية فوراً -->'
                  : '// اكتب كود جافاسكريبت هنا ودوس تشغيل...'
              }
              className="h-full"
            />
          </Suspense>
        </div>

        {/* Right Output Panel: Console OR Live Web Browser Preview */}
        {isWebMode ? (
          <div className={`${mobileWorkspaceTab === 'output' ? 'flex' : 'hidden'} h-[calc(100vh-13rem)] min-h-[480px] flex-col lg:flex lg:h-full lg:min-h-0`}>
            <LiveBrowserPreview
              key={previewRefreshTrigger}
              htmlContent={buildHtmlPreviewDocument(
                code,
                detectedLang === 'css' ? 'css' : 'html',
                previewTheme
              )}
              title={
                detectedLang === 'css'
                  ? 'معاينة تطبيق قواعد CSS الحية'
                  : 'معاينة صفحة الويب التفاعلية (HTML/DOM)'
              }
              height="100%"
            />
          </div>
        ) : (
          <div className={`${mobileWorkspaceTab === 'output' ? 'flex' : 'hidden'} h-[calc(100vh-13rem)] min-h-[480px] flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl lg:flex lg:h-full lg:min-h-0`}>
            <div className="bg-slate-900/90 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-mono text-slate-300 flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  شاشة الـ Console
                </span>
                {(logs.length > 0 || errors.length > 0) && (
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    errors.length > 0
                      ? 'bg-rose-500/15 text-rose-300'
                      : 'bg-emerald-500/15 text-emerald-300'
                  }`}>
                    {errors.length > 0 ? 'يحتاج مراجعة' : 'تم التشغيل بنجاح'}
                  </span>
                )}
                {execTime !== null && (
                  <span dir="ltr" className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
                    {execTime}ms
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleClearConsole}
                  className="flex items-center gap-1 text-slate-400 hover:text-slate-200 text-xs"
                  title="مسح مخرجات الشاشة"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  مسح
                </button>
              </div>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-2 font-mono text-xs custom-scrollbar" role="log" aria-live="polite" aria-label="نتيجة تشغيل الكود">
              {logs.length === 0 && errors.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-3 select-none text-center">
                  <span className="grid h-14 w-14 place-items-center rounded-2xl border border-slate-800 bg-slate-900/70">
                    <Terminal className="w-6 h-6 text-slate-600" />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-slate-400">جاهز لتشغيل الكود</p>
                    <p className="mt-1 max-w-xs font-sans text-xs leading-5 text-slate-600">
                      اضغط تشغيل أو استخدم الاختصار
                      <kbd dir="ltr" className="mx-1 rounded border border-slate-700 bg-slate-800 px-1.5 py-0.5 font-mono text-[10px] text-slate-400">Ctrl+Enter</kbd>
                    </p>
                  </div>
                </div>
              )}

              {logs.map((log, idx) => (
                <div
                  key={idx}
                  dir="ltr"
                  style={{ direction: 'ltr', textAlign: 'left', unicodeBidi: 'isolate' }}
                  className="text-emerald-400 bg-slate-900/60 p-2 rounded-lg border border-slate-800/80 text-left whitespace-pre-wrap font-mono"
                >
                  <span className="text-slate-600 select-none mr-2 font-mono text-[10px]">
                    ›
                  </span>
                  {log}
                </div>
              ))}

              {errors.map((err, idx) => (
                <div
                  key={idx}
                  className="space-y-2 rounded-xl border border-rose-900/50 bg-rose-950/20 p-3.5 text-right leading-relaxed text-rose-400 animate-fadeIn"
                  dir="rtl"
                >
                  <div className="flex items-center gap-1.5 font-bold text-rose-300">
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    <span>الكود محتاج مراجعة بسيطة</span>
                  </div>

                  <div dir="ltr" className="rounded-lg bg-slate-950/60 p-2.5 text-left font-mono text-xs leading-relaxed text-rose-200/90">{err}</div>
                </div>
              ))}
            </div>

            <div className="p-2.5 bg-slate-900/50 border-t border-slate-800/80 text-[11px] text-slate-500 flex items-center justify-between">
              <span>البيئة: JavaScript Sandbox آمن ومحمي ضد الحلقات اللانهائية</span>
              <span className={`font-bold ${isRunning ? 'text-amber-300' : errors.length > 0 ? 'text-rose-300' : 'text-emerald-400'}`}>
                {isRunning ? 'جاري التشغيل' : errors.length > 0 ? 'تحقق من الأخطاء' : 'جاهز'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Modal 1: Save Current Code */}
      {showSaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-5 space-y-4 shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Save className="w-5 h-5 text-emerald-400" />
                <h3 className="font-black text-white text-base">حفظ الكود في حسابي</h3>
              </div>
              <button
                onClick={() => setShowSaveModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSnippet} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  اسم المشروع أو الكود:
                </label>
                <input
                  type="text"
                  required
                  value={snippetTitleInput}
                  onChange={(e) => setSnippetTitleInput(e.target.value)}
                  placeholder="مثال: حساب مجموع الأرقام أو تجربة الـ DOM"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="text-[11px] text-slate-400 bg-slate-950 p-2.5 rounded-xl border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span>نوع الملف:</span>
                  <span className="font-mono text-amber-300 font-bold">
                    {isWebMode ? 'HTML & CSS Web Page' : 'JavaScript (.js)'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>عدد الأسطر:</span>
                  <span className="font-mono text-slate-200">{code.split('\n').length} سطر</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSaveModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isSavingSnippet || !snippetTitleInput.trim()}
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition active:scale-95 disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSavingSnippet ? 'جاري الحفظ...' : 'حفظ الكود الآن'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Saved Snippets Library */}
      {showSavedSnippetsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl animate-scaleUp">
            {/* Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FolderCode className="w-5 h-5 text-indigo-400" />
                <div>
                  <h3 className="font-black text-white text-base">مكتبة أكوادي ومشاريعي</h3>
                  <p className="text-[11px] text-slate-400">
                    جميع الأكواد التي قمت بحفظها في حسابك ({snippets.length} كود)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSavedSnippetsModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {snippets.length === 0 ? (
                <StandardEmptyState
                  type="snippets"
                  actionText="إغلاق والبدء في كتابة كود"
                  onAction={() => setShowSavedSnippetsModal(false)}
                />
              ) : (
                snippets.map((snip) => (
                  <div
                    key={snip.id}
                    className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-2.5 hover:border-slate-700 transition"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileCode2 className="w-4 h-4 text-indigo-400 shrink-0" />
                        <span className="font-bold text-white text-sm">{snip.title}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 text-slate-400 border border-slate-800 font-mono">
                          {snip.language}
                        </span>
                      </div>

                      <div className="text-[10px] text-slate-500 flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(snip.updatedAt || snip.createdAt).toLocaleDateString('ar-EG')}</span>
                      </div>
                    </div>

                    {/* Preview snippet code lines */}
                    <div
                      dir="ltr"
                      style={{ direction: 'ltr', textAlign: 'left' }}
                      className="bg-slate-900/70 p-2 rounded-lg font-mono text-[11px] text-slate-300 max-h-20 overflow-hidden line-clamp-3 border border-slate-800/80 whitespace-pre"
                    >
                      {snip.code}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-1 text-xs">
                      <button
                        onClick={() => handleLoadSnippet(snip)}
                        className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1 transition active:scale-95"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>فتح في المحرر ⚡</span>
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleCopySnippetCode(snip)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1"
                        >
                          {copiedSnippetId === snip.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400 text-[11px]">تم النسخ</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span className="text-[11px]">نسخ</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => handleDeleteSnippet(snip.id)}
                          className="px-2.5 py-1 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 border border-rose-900/40 text-rose-300 text-xs flex items-center gap-1 transition"
                          title="حذف هذا الكود"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span className="text-[11px]">حذف</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Coding Challenges Modal */}
      {showChallengesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl max-h-[88vh] flex flex-col shadow-2xl overflow-hidden animate-scaleUp">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-yellow-500 to-amber-500 text-slate-950 flex items-center justify-center font-black text-xl shadow-lg shadow-yellow-500/20">
                  🏆
                </div>
                <div>
                  <h3 className="font-black text-white text-base sm:text-lg flex items-center gap-2">
                    <span>تحديات زكي كود التفاعلية</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                      {completedChallengeIds.length} / {CODING_CHALLENGES.length} مكتمل
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    تمارين عملية ذكية بالعامية لاختبار فهمك لكل درس
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowChallengesModal(false)}
                className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Challenges List */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 custom-scrollbar">
              {CODING_CHALLENGES.map((ch, index) => {
                const isCompleted = completedChallengeIds.includes(ch.id);
                return (
                  <div
                    key={ch.id}
                    className={`border rounded-2xl p-4 transition space-y-3 ${
                      isCompleted
                        ? 'bg-emerald-950/20 border-emerald-500/40 hover:border-emerald-500/60'
                        : 'bg-gradient-to-r from-slate-950 via-slate-950 to-amber-950/25 border-amber-500/35 hover:border-amber-400/60 shadow-[0_0_15px_rgba(245,158,11,0.12)] hover:shadow-[0_0_24px_rgba(245,158,11,0.22)]'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-mono font-bold text-amber-400">
                            تحدي #{index + 1}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {ch.chapterTitle}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 text-slate-300 border border-slate-800">
                            {ch.difficultyLabel}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold">
                            +{ch.points} نقطة
                          </span>
                        </div>
                        <h4 className="font-bold text-white text-sm sm:text-base flex items-center gap-2">
                          <span>{ch.title}</span>
                          {isCompleted && (
                            <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                              <span>تم الحل بنجاح!</span>
                            </span>
                          )}
                        </h4>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleSelectChallenge(ch)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shrink-0 active:scale-95 shadow ${
                          isCompleted
                            ? 'bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/30'
                            : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                        }`}
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>{isCompleted ? 'إعادة التحدي 🔁' : 'ابدأ التحدي ⚡'}</span>
                      </button>
                    </div>

                    <p className="text-xs text-slate-300 font-sans leading-relaxed">
                      {ch.story}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Celebration Modal when challenge is solved */}
      {celebrationModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fadeIn">
          <div className="bg-gradient-to-b from-slate-900 via-amber-950/40 to-slate-900 border-2 border-amber-500/60 rounded-3xl p-6 sm:p-8 max-w-md w-full text-center space-y-4 shadow-2xl animate-scaleUp">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 flex items-center justify-center text-3xl shadow-xl shadow-amber-500/30 animate-bounce">
              🎉
            </div>

            <div className="space-y-1">
              <span className="text-xs font-mono font-bold text-amber-400">
                مبروك يا وحش البرمجة! 🌟
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                حل مظبوط 100%!
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
                أثبت إنك مبرمج مصري أصيل وفاهم أصول الصنعة! تم تسجيل إنجازك بنجاح في حسابك.
              </p>
            </div>

            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-around text-xs">
              <div className="text-center">
                <span className="text-slate-400 block text-[11px]">التحدي</span>
                <span className="font-bold text-white">{celebrationModal.title}</span>
              </div>
              <div className="text-center">
                <span className="text-slate-400 block text-[11px]">النقاط</span>
                <span className="font-bold text-amber-400 font-mono">+{celebrationModal.points} XP 🏆</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setCelebrationModal(null)}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black rounded-xl text-sm transition shadow-lg shadow-amber-500/20 active:scale-95"
            >
              عاش يا بطل، كمل للبعده! 🚀
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
