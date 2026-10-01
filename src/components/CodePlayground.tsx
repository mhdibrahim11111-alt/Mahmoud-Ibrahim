import React, { useState, useEffect, useRef } from 'react';
import { runJavaScript } from '../utils/codeRunner';
import { detectCodeLanguage, buildHtmlPreviewDocument } from '../utils/codePreview';
import { generateSmartLocalHint, SmartHintResponse } from '../utils/smartHints';
import { LiveBrowserPreview } from './LiveBrowserPreview';
import {
  fetchStudentWork,
  saveStudentDraftToServer,
  saveStudentSnippetToServer,
  deleteStudentSnippetFromServer,
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
} from 'lucide-react';

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
  }, [activeCode, initialCode]);

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
    if (isWebMode) {
      setPreviewRefreshTrigger((prev) => prev + 1);
      return;
    }

    setIsRunning(true);
    const result = await runJavaScript(code);
    setLogs(result.logs);
    setErrors(result.errors);
    setExecTime(result.executionTimeMs);
    setIsRunning(false);
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
        headers: { 'Content-Type': 'application/json' },
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-950 border border-emerald-500/40 text-emerald-200 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 animate-bounce text-xs sm:text-sm font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              {isWebMode ? (
                <Globe className="w-5 h-5 text-cyan-400" />
              ) : (
                <Terminal className="w-5 h-5 text-amber-400" />
              )}
              مختبر الأكواد التجريبي التفاعلي
            </h2>

            {/* Auto-save Status Badge */}
            {activeCode && (
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-slate-950 border border-slate-800 flex items-center gap-1">
                {autoSaveStatus === 'saving' ? (
                  <span className="text-amber-400 animate-pulse">جاري الحفظ بالسيرفر...</span>
                ) : (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    <span>محفوظ في حسابك</span>
                  </span>
                )}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            اكتب، عدل، وجرب الكود بأمان — كل كود تكتبه يُحفظ تلقائياً في حسابك
          </p>
        </div>

        {/* Presets Selector & Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Mode Switcher */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setMode('auto')}
              className={`px-2.5 py-1 rounded-lg transition ${
                mode === 'auto'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              كشف تلقائي
            </button>
            <button
              onClick={() => setMode('js')}
              className={`px-2.5 py-1 rounded-lg transition flex items-center gap-1 ${
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
              className={`px-2.5 py-1 rounded-lg transition flex items-center gap-1 ${
                mode === 'html'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Globe className="w-3 h-3" />
              <span>HTML & CSS</span>
            </button>
          </div>

          {/* Theme switcher for preview */}
          {isWebMode && (
            <button
              onClick={() => setPreviewTheme(previewTheme === 'dark' ? 'light' : 'dark')}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 hover:text-white"
              title="تبديل مظهر المعاينة بين الفاتح والداكن"
            >
              {previewTheme === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>فاتح</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-cyan-400" />
                  <span>داكن</span>
                </>
              )}
            </button>
          )}

          {/* Save Code to Account Button */}
          <button
            onClick={() => {
              setSnippetTitleInput(`مشروع ${snippets.length + 1} - ${isWebMode ? 'ويب' : 'JS'}`);
              setShowSaveModal(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition active:scale-95 shadow shadow-emerald-500/10"
            title="حفظ الكود الحالي في ملفاتك الدائمة باسم مخصص"
          >
            <Save className="w-3.5 h-3.5" />
            <span>حفظ الكود 💾</span>
          </button>

          {/* My Saved Snippets Button */}
          <button
            onClick={() => setShowSavedSnippetsModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 text-xs font-bold transition active:scale-95"
            title="عرض كل الأكواد والمشاريع التي قمت بحفظها"
          >
            <FolderCode className="w-3.5 h-3.5" />
            <span>أكوادي المحفوظة ({snippets.length})</span>
          </button>

          {/* Smart Hints Trigger Button */}
          <button
            onClick={() => fetchSmartHint()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 border border-amber-500/40 text-amber-300 text-xs font-bold transition active:scale-95 shadow shadow-amber-500/10"
            title="طلب تلميح ومساعدة ذكية لشرح الكود أو الأخطاء"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>تلميح ذكي 💡</span>
          </button>

          <select
            onChange={(e) => {
              const selected = presets.find((p) => p.name === e.target.value);
              if (selected) {
                setCode(selected.code);
                handleClearConsole();
                setShowHintBox(false);
              }
            }}
            className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
          >
            <option value="">اختر مثالاً جاهزاً من الكورس...</option>
            {presets.map((p, idx) => (
              <option key={idx} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'تم النسخ' : 'نسخ'}</span>
          </button>

          <button
            onClick={() => {
              setCode('');
              setShowHintBox(false);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>تفريغ</span>
          </button>

          {/* Unified prominent Run / Refresh button */}
          <button
            onClick={handleRun}
            disabled={isRunning}
            className={`flex items-center gap-2 font-black px-5 py-2 rounded-xl text-xs sm:text-sm transition active:scale-95 shadow-lg ${
              isWebMode
                ? 'bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 text-slate-950 shadow-cyan-500/25'
                : 'bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 shadow-amber-500/25'
            }`}
          >
            {isWebMode ? <Globe className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
            <span>
              {isRunning
                ? 'جاري التشغيل...'
                : isWebMode
                ? 'تحديث ومعاينة الصفحة (Ctrl+Enter)'
                : 'تشغيل الكود (Ctrl+Enter)'}
            </span>
          </button>
        </div>
      </div>

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
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                    Smart Hint 💡
                  </span>
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
      <div className="grid lg:grid-cols-2 gap-4 h-[650px]">
        {/* Code Editor Panel */}
        <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex flex-col shadow-2xl">
          <div className="bg-slate-900/90 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-xs">
            <span className="font-mono text-slate-300 flex items-center gap-1.5">
              <Code2 className="w-4 h-4 text-amber-400" />
              {isWebMode ? 'محرر الويب (HTML & CSS)' : 'محرر جافاسكريبت (JavaScript)'}
            </span>
            <div className="flex items-center gap-2">
              {activeCode && (
                <span className="text-[11px] text-slate-400 font-mono">
                  {studentName ? `${studentName} • ` : ''}حفظ سحابي نشط
                </span>
              )}
              <span className="text-[11px] text-cyan-400 font-mono">
                {isWebMode ? 'معاينة حية' : 'UTF-8'}
              </span>
            </div>
          </div>

          <textarea
            dir="ltr"
            style={{ direction: 'ltr', textAlign: 'left', unicodeBidi: 'isolate' }}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={(e) => {
              if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                handleRun();
              }
            }}
            placeholder={
              isWebMode
                ? '<!-- اكتب كود HTML أو CSS هنا وستظهر المعاينة الحية فوراً -->'
                : '// اكتب كود جافاسكريبت هنا ودوس تشغيل...'
            }
            className="flex-1 w-full p-4 bg-slate-950 text-amber-200 font-mono text-xs sm:text-sm focus:outline-none resize-none leading-relaxed text-left custom-scrollbar selection:bg-amber-500 selection:text-slate-950"
            spellCheck={false}
          />

          <div className="p-2.5 bg-slate-900/50 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
            <span>
              {isWebMode
                ? '🌐 وضع الويب: أي تعديل على الكود يظهر في المتصفح تلقائياً أو اضغط تحديث'
                : '💡 اختصار التشغيل السريع: Ctrl + Enter'}
            </span>
            <span>عدد الأسطر: {code.split('\n').length}</span>
          </div>
        </div>

        {/* Right Output Panel: Console OR Live Web Browser Preview */}
        {isWebMode ? (
          <div className="h-full flex flex-col">
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
          <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex flex-col shadow-2xl">
            <div className="bg-slate-900/90 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-mono text-slate-300 flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  شاشة الـ Console
                </span>
                {execTime !== null && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
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

            <div className="flex-1 p-4 overflow-y-auto space-y-2 font-mono text-xs custom-scrollbar">
              {logs.length === 0 && errors.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-2 select-none">
                  <Terminal className="w-8 h-8 opacity-40" />
                  <p className="text-xs">المخرجات ستظهر هنا عند النقر على "تشغيل الكود"</p>
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
                  className="text-rose-400 bg-rose-950/20 p-3.5 rounded-xl border border-rose-900/50 text-right dir-rtl leading-relaxed animate-fadeIn space-y-1.5"
                >
                  <div className="flex items-center gap-1.5 font-bold text-rose-300">
                    <span>👻 ماتتخضش! الكمبيوتر بيقولك:</span>
                  </div>

                  <div className="text-xs font-sans text-rose-200/90 leading-relaxed">{err}</div>
                </div>
              ))}
            </div>

            <div className="p-2.5 bg-slate-900/50 border-t border-slate-800/80 text-[11px] text-slate-500 flex items-center justify-between">
              <span>البيئة: JavaScript Sandbox آمن ومحمي ضد الحلقات اللانهائية</span>
              <span className="text-emerald-400 font-bold">جاهز</span>
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
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {snippets.length === 0 ? (
                <div className="p-8 text-center text-slate-500 space-y-2">
                  <FileCode2 className="w-10 h-10 mx-auto opacity-30 text-indigo-400" />
                  <p className="text-sm font-semibold">لم تقم بحفظ أي كود بعد في حسابك</p>
                  <p className="text-xs text-slate-600">
                    اكتب كودك في المحرر ثم اضغط على زر "حفظ الكود 💾" ليظل محفوظاً دائماً
                  </p>
                </div>
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
                          <Trash2 className="w-3 h-3" />
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
    </div>
  );
};
