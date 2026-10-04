import React, { useState, useEffect, useMemo } from 'react';
import { Part, Challenge } from '../types';
import { runJavaScript } from '../utils/codeRunner';
import { detectCodeLanguage, buildHtmlPreviewDocument } from '../utils/codePreview';
import { validateChallenge, ChallengeValidationResult } from '../utils/challengeValidator';
import { saveProgressEntry, sessionHeaders } from '../utils/activation';
import { markChallengeCompleted } from '../utils/challengesAndTts';
import { CodeBlock } from './CodeBlock';
import { CodeEditor } from './CodeEditor';
import { LiveBrowserPreview } from './LiveBrowserPreview';
import {
  Trophy,
  CheckCircle,
  Play,
  RotateCcw,
  Sparkles,
  HelpCircle,
  Filter,
  Globe,
  Eye,
  Terminal,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ListOrdered,
  X,
  Layers,
} from 'lucide-react';

interface ChallengesListProps {
  parts: Part[];
  activeCode?: string;
  onOpenChapter: (chapterId: number) => void;
  onOpenPlayground?: () => void;
}

export const ChallengesList: React.FC<ChallengesListProps> = ({
  parts,
  activeCode,
  onOpenChapter,
  onOpenPlayground,
}) => {
  // Flatten all challenges across chapters (memoized to prevent re-creation on every render)
  const allChallenges = useMemo(
    () =>
      parts.flatMap((part) =>
        part.chapters
          .filter((ch) => !!ch.challenge)
          .map((ch) => ({
            chapter: ch,
            part: part,
            challenge: ch.challenge as Challenge,
          }))
      ),
    [parts]
  );

  const codeKey = useMemo(() => {
    return (activeCode || localStorage.getItem('codemasr_active_code') || 'GUEST').trim().toUpperCase();
  }, [activeCode]);

  const [selectedChallengeId, setSelectedChallengeId] = useState<string>(
    () => allChallenges[0]?.challenge.id || ''
  );
  const [filterPartId, setFilterPartId] = useState<number | 'all'>('all');

  const currentItem = useMemo(
    () => allChallenges.find((c) => c.challenge.id === selectedChallengeId),
    [allChallenges, selectedChallengeId]
  );

  const [userCode, setUserCode] = useState<string>(() => {
    const firstChallenge = allChallenges[0];
    if (firstChallenge) {
      const savedCode = localStorage.getItem(
        `codemasr_book_chal_code_${codeKey}_${firstChallenge.challenge.id}`
      );
      return savedCode || firstChallenge.challenge.initialCode;
    }
    return '';
  });
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState<{ logs: string[]; errors: string[] } | null>(null);
  const [feedback, setFeedback] = useState<ChallengeValidationResult | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [solvedMap, setSolvedMap] = useState<Record<string, boolean>>(() => {
    try {
      const key = (activeCode || localStorage.getItem('codemasr_active_code') || 'GUEST').trim().toUpperCase();
      const saved = localStorage.getItem(`codemasr_book_challenges_solved_${key}`);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [htmlPreviewDoc, setHtmlPreviewDoc] = useState<string | null>(null);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isProgressLoaded, setIsProgressLoaded] = useState(false);

  // Sync selected challenge if list changes or initial id is missing
  useEffect(() => {
    if (!selectedChallengeId && allChallenges.length > 0) {
      setSelectedChallengeId(allChallenges[0].challenge.id);
    }
  }, [allChallenges, selectedChallengeId]);

  const currentChallengeIndex = allChallenges.findIndex(
    (c) => c.challenge.id === selectedChallengeId
  );
  const prevChallenge =
    currentChallengeIndex > 0 ? allChallenges[currentChallengeIndex - 1] : null;
  const nextChallenge =
    currentChallengeIndex >= 0 && currentChallengeIndex < allChallenges.length - 1
      ? allChallenges[currentChallengeIndex + 1]
      : null;

  const currentSavedCode = currentItem
    ? localStorage.getItem(`codemasr_book_chal_code_${codeKey}_${currentItem.challenge.id}`)
    : null;
  const isCurrentSolved = currentItem ? Boolean(solvedMap[currentItem.challenge.id]) : false;
  const isCurrentStarted = Boolean(
    currentSavedCode &&
      currentSavedCode.trim() !== '' &&
      currentSavedCode !== currentItem?.challenge.initialCode
  );
  const isCurrentNotStarted = !isCurrentSolved && !isCurrentStarted;

  // Load code when selectedChallengeId changes
  useEffect(() => {
    if (currentItem) {
      const savedCode = localStorage.getItem(
        `codemasr_book_chal_code_${codeKey}_${currentItem.challenge.id}`
      );
      setUserCode(savedCode || currentItem.challenge.initialCode);
      setOutput(null);
      setFeedback(null);
      setHtmlPreviewDoc(null);
      setShowHint(false);
      setShowSolution(false);
    }
  }, [selectedChallengeId, codeKey, isProgressLoaded]);

  // Auto-save challenge code
  useEffect(() => {
    if (!isProgressLoaded || !currentItem || !userCode) return;
    try {
      localStorage.setItem(`codemasr_book_chal_code_${codeKey}_${currentItem.challenge.id}`, userCode);
    } catch {}
    const timer = window.setTimeout(() => {
      void saveProgressEntry(codeKey, `bookChallengeSolution:${currentItem.challenge.id}`, userCode);
    }, 1200);
    return () => window.clearTimeout(timer);
  }, [userCode, currentItem?.challenge.id, codeKey, isProgressLoaded]);

  // Load server completed challenges on mount
  useEffect(() => {
    fetch('/api/progress', { headers: sessionHeaders() })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        const entries = data?.progress?.stateEntries as Record<string, { value: boolean | string; updatedAt: number }> | undefined;
        if (entries) {
          Object.entries(entries).forEach(([key, entry]) => {
            if (key.startsWith('bookChallengeSolution:') && typeof entry.value === 'string') {
              const challengeId = key.slice('bookChallengeSolution:'.length);
              localStorage.setItem(`codemasr_book_chal_code_${codeKey}_${challengeId}`, entry.value);
            }
          });
        }
        if (data?.success && Array.isArray(data.progress?.completedChallenges)) {
          setSolvedMap((prev) => {
            const next = { ...prev };
            data.progress.completedChallenges.forEach((id: string) => {
              next[id] = true;
            });
            try {
              localStorage.setItem(`codemasr_book_challenges_solved_${codeKey}`, JSON.stringify(next));
            } catch {}
            return next;
          });
        }
      })
      .catch(() => {})
      .finally(() => setIsProgressLoaded(true));
  }, [codeKey]);

  const handleRun = async () => {
    if (!currentItem) return;
    setIsRunning(true);

    const lang = detectCodeLanguage(userCode);
    const isWeb =
      lang === 'html' ||
      lang === 'css' ||
      currentItem.challenge.id === 'ch18-chal' ||
      currentItem.challenge.id === 'ch19-chal';

    if (isWeb) {
      const doc = buildHtmlPreviewDocument(userCode, lang === 'css' ? 'css' : 'html');
      setHtmlPreviewDoc(doc);

      // Validation logic for web challenges
      let isValid = false;
      let msg = '';
      const feedbackLogs: string[] = [];
      const feedbackErrors: string[] = [];

      if (currentItem.challenge.id === 'ch18-chal') {
        const hasH1 = /<h1\b[^>]*>.*?<\/h1>/is.test(userCode);
        const hasP = /<p\b[^>]*>.*?<\/p>/is.test(userCode);
        const hasUl = /<ul\b[^>]*>[\s\S]*?<\/ul>/is.test(userCode);
        const hasLi = /<li\b[^>]*>.*?<\/li>/is.test(userCode);

        if (hasH1 && hasP && hasUl && hasLi) {
          isValid = true;
          msg = '🎉 ممتاز جداً! كتبت هيكل بطاقة التعارف بالـ HTML بالكامل مع العناوين والفقرات والقوائم.';
          feedbackLogs.push(msg);
        } else {
          const missing: string[] = [];
          if (!hasH1) missing.push('وسم العنوان <h1>');
          if (!hasP) missing.push('وسم الفقرة <p>');
          if (!hasUl || !hasLi) missing.push('قائمة الهوايات <ul> مع وسوم <li>');
          msg = 'فاضل شوية حاجات: تأكد من إضافة ' + missing.join(' و ');
          feedbackErrors.push(msg);
        }
      } else if (currentItem.challenge.id === 'ch19-chal') {
        const hasHighlightClass = /\.highlight\s*\{[\s\S]*?\}/i.test(userCode);
        const hasColor = /color\s*:\s*(yellow|#[0-9a-fA-F]+)/i.test(userCode);

        if (hasHighlightClass) {
          isValid = true;
          msg = '🎉 عاش جداً! كتبت قاعدة CSS ممتازة لكلاس .highlight وتم تطبيق التنسيق في المعاينة الحية!';
          feedbackLogs.push(msg);
        } else {
          msg = 'تأكد من كتابة كلاس .highlight مع فتح القوسين { } وتحديد لون النص color: yellow;';
          feedbackErrors.push(msg);
        }
      } else {
        isValid = true;
        msg = '✓ تم تفعيل المعاينة الحية في المتصفح بنجاح!';
        feedbackLogs.push(msg);
      }

      setOutput({ logs: feedbackLogs, errors: feedbackErrors });
      setFeedback({ passed: isValid, message: msg });
      if (isValid) {
        setSolvedMap((prev) => {
          const next = { ...prev, [currentItem.challenge.id]: true };
          try {
            localStorage.setItem(`codemasr_book_challenges_solved_${codeKey}`, JSON.stringify(next));
          } catch {}
          return next;
        });
        markChallengeCompleted(currentItem.challenge.id).catch(() => {});
      } else {
        setSolvedMap((prev) => {
          const next = { ...prev };
          delete next[currentItem.challenge.id];
          try {
            localStorage.setItem(`codemasr_book_challenges_solved_${codeKey}`, JSON.stringify(next));
          } catch {}
          return next;
        });
      }
      setIsRunning(false);
      return;
    }

    // JavaScript Challenge: Run and Strictly Validate using shared challengeValidator
    setHtmlPreviewDoc(null);
    const res = await runJavaScript(userCode);
    const validation = validateChallenge(
      currentItem.chapter.id,
      userCode,
      res.logs,
      res.errors
    );

    setOutput({ logs: res.logs, errors: res.errors });
    setFeedback(validation);
    setIsRunning(false);

    if (validation.passed) {
      setSolvedMap((prev) => {
        const next = { ...prev, [currentItem.challenge.id]: true };
        try {
          localStorage.setItem(`codemasr_book_challenges_solved_${codeKey}`, JSON.stringify(next));
        } catch {}
        return next;
      });
      markChallengeCompleted(currentItem.challenge.id).catch(() => {});
    } else {
      setSolvedMap((prev) => {
        const next = { ...prev };
        delete next[currentItem.challenge.id];
        try {
          localStorage.setItem(`codemasr_book_challenges_solved_${codeKey}`, JSON.stringify(next));
        } catch {}
        return next;
      });
    }
  };

  const filteredChallenges = useMemo(() => {
    return allChallenges.filter((item) => {
      if (filterPartId !== 'all' && item.part.id !== filterPartId) return false;
      return true;
    });
  }, [allChallenges, filterPartId]);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-6 space-y-3.5 pb-36 lg:pb-12 w-full max-w-full min-w-0 overflow-x-hidden">
      {/* 1. Reduced Hero Banner Height */}
      <div className="bg-gradient-to-r from-orange-950/40 via-slate-900 to-slate-900 px-3.5 py-3 sm:px-5 sm:py-3.5 rounded-2xl border border-orange-500/30 flex items-center justify-between gap-3 shadow-md w-full min-w-0">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center border border-orange-500/30 shrink-0 font-bold text-base sm:text-xl shadow-inner">
            🧠
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-lg font-black text-white truncate">
                تحديات «وريني شطارتك»
              </h2>
              <span className="text-[10px] sm:text-[11px] px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 font-bold border border-orange-500/30 shrink-0">
                {Object.keys(solvedMap).length} من {allChallenges.length} منجز
              </span>
            </div>
            <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5 hidden xs:block truncate">
              25 تحدياً برمجياً عملياً لاختبار قدراتك خطوة بخطوة
            </p>
          </div>
        </div>
      </div>

      {/* 2. Compact Inline Filter Bar & 4. Clarify General Editor Access */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-slate-900/60 p-2 sm:p-2.5 rounded-xl border border-slate-800 w-full min-w-0">
        {/* Horizontal Part Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 scroll-smooth w-full min-w-0">
          <button
            onClick={() => setFilterPartId('all')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition whitespace-nowrap shrink-0 ${
              filterPartId === 'all'
                ? 'bg-orange-500 text-slate-950 shadow-sm'
                : 'bg-slate-950/80 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            كل الأجزاء ({allChallenges.length})
          </button>
          {parts.map((p) => (
            <button
              key={p.id}
              onClick={() => setFilterPartId(p.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition whitespace-nowrap shrink-0 ${
                filterPartId === p.id
                  ? 'bg-orange-500 text-slate-950 shadow-sm'
                  : 'bg-slate-950/80 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              الجزء {p.id}
            </button>
          ))}
        </div>

        {/* 4. Direct route to Playground for freeform coding */}
        {onOpenPlayground && (
          <button
            onClick={onOpenPlayground}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 text-orange-300 border border-orange-500/30 text-xs font-bold transition shrink-0 self-end sm:self-auto active:scale-95"
            title="انتقل لكتابة كود حر بدون قيود التحدي"
          >
            <Terminal className="w-3.5 h-3.5 text-orange-400" />
            <span>كتابة كود حر (المحرّر) ↗</span>
          </button>
        )}
      </div>

      {/* Main Grid: Sidebar List (Desktop Only) + Workspace */}
      <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 w-full min-w-0">
        {/* 3. Left Side: Compact Challenge Cards (Desktop Only - Hidden on Mobile to prevent scrolling) */}
        <div className="hidden lg:block space-y-1.5 lg:max-h-[720px] lg:overflow-y-auto custom-scrollbar pr-1 w-full min-w-0">
          {filteredChallenges.map((item) => {
            const isSelected = item.challenge.id === selectedChallengeId;
            const isSolved = Boolean(solvedMap[item.challenge.id]);
            const savedCode = localStorage.getItem(`codemasr_book_chal_code_${codeKey}_${item.challenge.id}`);
            const isStarted = Boolean(savedCode && savedCode.trim() !== '' && savedCode !== item.challenge.initialCode);
            const isNotStarted = !isSolved && !isStarted;

            let cardStyles = '';
            if (isSolved) {
              cardStyles = isSelected
                ? 'bg-emerald-950/20 border-emerald-500/50 shadow-sm'
                : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/60';
            } else if (isNotStarted) {
              // Elegant static glow for challenges not started yet (no blinking animate-pulse)
              cardStyles = isSelected
                ? 'bg-gradient-to-r from-orange-500/20 via-amber-500/15 to-slate-900/90 border-orange-500/70 shadow-[0_0_20px_rgba(249,115,22,0.25)] ring-1 ring-orange-500/40'
                : 'bg-gradient-to-r from-slate-900/95 via-slate-900/90 to-amber-950/25 border-amber-500/35 hover:border-amber-400/70 shadow-[0_0_12px_rgba(245,158,11,0.12)] hover:shadow-[0_0_18px_rgba(245,158,11,0.22)]';
            } else {
              // In progress
              cardStyles = isSelected
                ? 'bg-orange-500/10 border-orange-500/50 shadow-sm'
                : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/60';
            }

            return (
              <button
                key={item.challenge.id}
                onClick={() => setSelectedChallengeId(item.challenge.id)}
                className={`w-full text-right p-2.5 rounded-xl border transition duration-200 flex items-center justify-between gap-2.5 ${cardStyles}`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition ${
                      isSolved
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : isNotStarted
                        ? isSelected
                          ? 'bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 font-black shadow-md shadow-orange-500/30'
                          : 'bg-amber-500/15 text-amber-300 border border-amber-500/40 shadow-[0_0_8px_rgba(245,158,11,0.2)]'
                        : isSelected
                        ? 'bg-orange-500 text-slate-950 shadow-sm'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {isSolved ? (
                      <CheckCircle className="w-3.5 h-3.5" />
                    ) : isNotStarted ? (
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    ) : (
                      item.chapter.id
                    )}
                  </div>
                  <div className="min-w-0">
                    <h4 className={`text-xs font-bold truncate ${isSelected ? 'text-orange-300' : isNotStarted ? 'text-amber-100' : 'text-white'}`}>
                      {item.challenge.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 truncate block">
                      الفصل {item.chapter.id}: {item.chapter.title.split(':')[1] || item.chapter.title}
                    </span>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-1.5">
                  {isSolved ? (
                    <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                      مكتمل ✓
                    </span>
                  ) : isNotStarted ? (
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/15 text-amber-300 font-bold border border-amber-500/40 shadow-[0_0_8px_rgba(245,158,11,0.18)] flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.6)]"></span>
                      <span>تحدي جديد ✨</span>
                    </span>
                  ) : (
                    <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-orange-500/15 text-orange-300 font-semibold border border-orange-500/30">
                      قيد الحل ⏳
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Side: Active Challenge Workspace (Immediately at top on mobile!) */}
        {currentItem && (
          <div className="lg:col-span-2 space-y-3.5 w-full min-w-0">
            {/* Mobile Challenge Switcher Bar: Fully responsive, zero cut-off */}
            <div className="lg:hidden bg-slate-900 border border-slate-800 rounded-2xl p-2.5 sm:p-3 shadow-lg space-y-2 w-full min-w-0">
              <div className="flex items-center justify-between gap-1.5 sm:gap-2 w-full min-w-0">
                {/* Prev Challenge Button */}
                <button
                  onClick={() => prevChallenge && setSelectedChallengeId(prevChallenge.challenge.id)}
                  disabled={!prevChallenge}
                  className="px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 disabled:opacity-30 disabled:pointer-events-none transition flex items-center gap-1 text-[11px] sm:text-xs font-bold shrink-0 active:scale-95"
                  title="التحدي السابق"
                >
                  <ChevronRight className="w-4 h-4 shrink-0" />
                  <span>السابق</span>
                </button>

                {/* Center: Open All Challenges Drawer */}
                <button
                  onClick={() => setIsMobileDrawerOpen(true)}
                  className="flex-1 min-w-0 px-2 py-1.5 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-center transition flex items-center justify-center gap-1 group active:scale-95 shadow-sm overflow-hidden"
                >
                  <div className="text-center truncate min-w-0 w-full">
                    <div className="flex items-center justify-center gap-1 text-[11px] sm:text-xs font-black text-orange-400 truncate">
                      <span>تحدي {currentItem.chapter.id} من {allChallenges.length}</span>
                      <ChevronDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition shrink-0" />
                    </div>
                    <div className="text-[10px] sm:text-[11px] text-slate-200 font-bold truncate">
                      {currentItem.challenge.title}
                    </div>
                  </div>
                </button>

                {/* Next Challenge Button */}
                <button
                  onClick={() => nextChallenge && setSelectedChallengeId(nextChallenge.challenge.id)}
                  disabled={!nextChallenge}
                  className="px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 disabled:opacity-30 disabled:pointer-events-none transition flex items-center gap-1 text-[11px] sm:text-xs font-bold shrink-0 active:scale-95"
                  title="التحدي التالي"
                >
                  <span>التالي</span>
                  <ChevronLeft className="w-4 h-4 shrink-0" />
                </button>
              </div>

              {/* Status and quick drawer trigger */}
              <div className="flex items-center justify-between text-[10px] sm:text-[11px] pt-1.5 border-t border-slate-800/80 text-slate-400 font-medium w-full min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2 truncate">
                  {solvedMap[selectedChallengeId] ? (
                    <span className="text-emerald-400 font-bold flex items-center gap-1 shrink-0">
                      <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>مكتمل ✓</span>
                    </span>
                  ) : (
                    <span className="text-orange-400 font-semibold shrink-0">قيد الحل</span>
                  )}
                  <span>•</span>
                  <span className="font-mono text-slate-300 font-bold truncate">
                    {Object.keys(solvedMap).length}/{allChallenges.length} منجز
                  </span>
                </div>

                <button
                  onClick={() => setIsMobileDrawerOpen(true)}
                  className="text-orange-400 hover:text-orange-300 font-bold flex items-center gap-1 text-[10px] sm:text-[11px] shrink-0"
                >
                  <ListOrdered className="w-3.5 h-3.5 shrink-0" />
                  <span>فهرس الـ 25 تحدي 📋</span>
                </button>
              </div>
            </div>

            {/* Header info */}
            <div
              className={`p-3.5 sm:p-5 rounded-2xl border space-y-2.5 sm:space-y-3 transition duration-300 w-full min-w-0 overflow-hidden ${
                isCurrentSolved
                  ? 'bg-slate-900/80 border-emerald-500/30'
                  : isCurrentNotStarted
                  ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-amber-950/25 border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.15)]'
                  : 'bg-slate-900/80 border-slate-800'
              }`}
            >
              <div className="flex items-start sm:items-center justify-between gap-2 w-full min-w-0">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] text-orange-400 font-bold">
                      الجزء {currentItem.part.id} • الفصل {currentItem.chapter.id}
                    </span>
                    {isCurrentNotStarted && (
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 font-bold border border-amber-500/40 shadow-[0_0_8px_rgba(245,158,11,0.2)] flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.6)]"></span>
                        <span>تحدي لم يبدأ بعد ✨</span>
                      </span>
                    )}
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-white mt-0.5 break-words">
                    {currentItem.challenge.title}
                  </h3>
                </div>

                <button
                  onClick={() => onOpenChapter(currentItem.chapter.id)}
                  className="text-[11px] sm:text-xs text-slate-400 hover:text-orange-400 transition flex items-center gap-1 font-medium shrink-0 pt-0.5"
                >
                  <span className="hidden xs:inline">الذهاب لشرح الفصل</span>
                  <span className="xs:hidden">الشرح</span>
                  <span>↗</span>
                </button>
              </div>

              <div className="p-3 sm:p-3.5 bg-slate-950/80 rounded-xl border border-slate-800/80 text-xs text-slate-200 leading-relaxed font-sans break-words">
                {currentItem.challenge.prompt}
              </div>

              {/* Hints & Solutions buttons */}
              <div className="flex items-center justify-between sm:justify-end gap-2 text-xs pt-1 font-sans w-full min-w-0">
                {currentItem.challenge.hint && (
                  <button
                    onClick={() => setShowHint(!showHint)}
                    className="text-orange-400 hover:text-orange-300 flex items-center gap-1 font-semibold text-xs"
                  >
                    <HelpCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{showHint ? 'إخفاء التلميح' : 'محتاج تلميح؟ 💡'}</span>
                  </button>
                )}
                {currentItem.challenge.solutionCode && (
                  <button
                    onClick={() => setShowSolution(!showSolution)}
                    className="text-slate-400 hover:text-slate-200 flex items-center gap-1 text-xs"
                  >
                    <Eye className="w-3.5 h-3.5 shrink-0" />
                    <span>{showSolution ? 'إخفاء الحل' : 'عرض الحل النموذجي 🔑'}</span>
                  </button>
                )}
              </div>

              {showHint && currentItem.challenge.hint && (
                <div className="p-3 bg-amber-950/40 rounded-xl border border-amber-500/30 text-xs text-amber-200 font-sans break-words">
                  <strong>💡 تلميح: </strong>
                  <span>{currentItem.challenge.hint}</span>
                </div>
              )}

              {showSolution && currentItem.challenge.solutionCode && (
                <div className="rounded-xl border border-slate-700 overflow-hidden text-xs w-full min-w-0">
                  <div className="bg-slate-900 px-3 py-1.5 text-right text-slate-400 text-[10px] dir-rtl font-sans border-b border-slate-800">
                    الحل النموذجي المقترح:
                  </div>
                  <CodeBlock code={currentItem.challenge.solutionCode} />
                </div>
              )}
            </div>

            {/* Code Editor */}
            <div className="space-y-2.5 sm:space-y-3 w-full min-w-0">
              <div className="rounded-2xl overflow-hidden border border-slate-800 shadow-2xl w-full min-w-0">
                <CodeEditor
                  value={userCode}
                  onChange={setUserCode}
                  onRun={handleRun}
                  isWebMode={
                    currentItem.challenge.id === 'ch18-chal' ||
                    currentItem.challenge.id === 'ch19-chal'
                  }
                  className="h-52 sm:h-72"
                />
              </div>

              {/* Actions Toolbar - Highly responsive and prominent on mobile */}
              <div className="flex items-center justify-between gap-2 pt-1 w-full min-w-0">
                <button
                  onClick={() => {
                    setUserCode(currentItem.challenge.initialCode);
                    setOutput(null);
                    setFeedback(null);
                    setHtmlPreviewDoc(null);
                  }}
                  className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white transition font-sans shrink-0 px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 active:scale-95"
                >
                  <RotateCcw className="w-3.5 h-3.5 shrink-0" />
                  <span>إعادة تعيين</span>
                </button>

                <button
                  onClick={handleRun}
                  disabled={isRunning}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-black px-5 py-2.5 rounded-xl text-xs sm:text-sm transition active:scale-95 shadow-lg shadow-orange-500/25 disabled:opacity-50 font-sans cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current shrink-0" />
                  <span>{isRunning ? 'جاري الفحص...' : 'تشغيل واختبار الكود 🚀'}</span>
                </button>
              </div>

              {/* Live Web Preview for HTML/CSS challenges */}
              {htmlPreviewDoc && (
                <div className="space-y-2 w-full min-w-0">
                  <div className="text-xs font-bold text-cyan-400 flex items-center gap-1 font-sans">
                    <Globe className="w-3.5 h-3.5" />
                    <span>المعاينة الحية لصفحة الويب الخاصة بك:</span>
                  </div>
                  <LiveBrowserPreview
                    htmlContent={htmlPreviewDoc}
                    title="معاينة حل التحدي في المتصفح"
                    height="200px"
                  />
                </div>
              )}

              {/* Output Result Card (Clean Arabic font, no monospace letter spacing bugs) */}
              {output && (
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3 shadow-xl w-full min-w-0">
                  <div className="text-xs text-slate-300 flex items-center justify-between font-sans pb-2 border-b border-slate-800/80 gap-2">
                    <span className="font-bold flex items-center gap-1.5 shrink-0">
                      <Terminal className="w-4 h-4 text-orange-400 shrink-0" />
                      <span>نتيجة الفحص والاختبار:</span>
                    </span>
                    {feedback?.passed ? (
                      <span className="text-emerald-400 font-bold px-2 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-1 text-[11px] sm:text-xs shrink-0">
                        <span>✓ تم حل التحدي بنجاح 🎯</span>
                      </span>
                    ) : (
                      <span className="text-amber-400 font-bold px-2 py-0.5 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center gap-1 text-[11px] sm:text-xs shrink-0">
                        <span>⚠️ الحل غير مكتمل بعد</span>
                      </span>
                    )}
                  </div>

                  {/* Feedback Message */}
                  {feedback && (
                    <div
                      className={`p-3 rounded-xl text-xs font-sans leading-relaxed text-right dir-rtl break-words ${
                        feedback.passed
                          ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/30'
                          : 'bg-amber-950/40 text-amber-200 border border-amber-500/30'
                      }`}
                    >
                      {feedback.message}
                    </div>
                  )}

                  {/* Actual console output printed by the code */}
                  {output.logs.length > 0 && (
                    <div className="space-y-1 w-full min-w-0">
                      <span className="text-[10px] text-slate-500 font-sans block text-right dir-rtl">
                        مخرجات أوامر console.log المطبوعة:
                      </span>
                      <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs text-left dir-ltr space-y-0.5 overflow-x-auto w-full min-w-0">
                        {output.logs.map((l, i) => (
                          <div key={i} className="text-emerald-400 break-words">
                            {l}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Execution errors if any */}
                  {output.errors.length > 0 && (
                    <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-900/60 font-mono text-xs text-left dir-ltr text-rose-300 overflow-x-auto w-full min-w-0">
                      {output.errors.map((e, i) => (
                        <div key={i} className="break-words">{e}</div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Mobile All Challenges Drawer / Bottom Sheet */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end lg:hidden font-['Cairo',sans-serif]">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsMobileDrawerOpen(false)}
          />

          {/* Drawer Sheet */}
          <div className="relative z-10 w-full max-h-[85vh] bg-slate-900 border-t border-orange-500/30 rounded-t-3xl shadow-2xl flex flex-col overflow-hidden animate-slideUp">
            {/* Sheet Header */}
            <div className="p-4 border-b border-slate-800 bg-slate-950/90 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-lg">
                  🧠
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">
                    فهرس تحديات «وريني شطارتك»
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    اختر أي تحدٍّ للبدء في كتابة وتجربة الكود فوراً ({allChallenges.length} تحدي)
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsMobileDrawerOpen(false)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Part Filter Pills inside Sheet */}
            <div className="p-2.5 border-b border-slate-800/80 bg-slate-900/90 flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1.5">
              <button
                onClick={() => setFilterPartId('all')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition whitespace-nowrap shrink-0 ${
                  filterPartId === 'all'
                    ? 'bg-orange-500 text-slate-950 shadow-sm'
                    : 'bg-slate-950 text-slate-400 border border-slate-800'
                }`}
              >
                الكل ({allChallenges.length})
              </button>
              {parts.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setFilterPartId(p.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition whitespace-nowrap shrink-0 ${
                    filterPartId === p.id
                      ? 'bg-orange-500 text-slate-950 shadow-sm'
                      : 'bg-slate-950 text-slate-400 border border-slate-800'
                  }`}
                >
                  الجزء {p.id}
                </button>
              ))}
            </div>

            {/* Challenge Items Scroll Area */}
            <div className="p-3 overflow-y-auto space-y-1.5 flex-1 custom-scrollbar">
              {filteredChallenges.map((item) => {
                const isSelected = item.challenge.id === selectedChallengeId;
                const isSolved = Boolean(solvedMap[item.challenge.id]);
                const savedCode = localStorage.getItem(`codemasr_book_chal_code_${codeKey}_${item.challenge.id}`);
                const isStarted = Boolean(savedCode && savedCode.trim() !== '' && savedCode !== item.challenge.initialCode);
                const isNotStarted = !isSolved && !isStarted;

                let cardStyles = '';
                if (isSolved) {
                  cardStyles = isSelected
                    ? 'bg-emerald-950/20 border-emerald-500/50 shadow-sm'
                    : 'bg-slate-950/70 border-slate-800/80 hover:bg-slate-800';
                } else if (isNotStarted) {
                  // Glowing effect for unstarted challenges in mobile drawer (static, no blinking)
                  cardStyles = isSelected
                    ? 'bg-gradient-to-r from-orange-500/20 via-amber-500/15 to-slate-950/90 border-orange-500/70 shadow-[0_0_18px_rgba(249,115,22,0.25)] ring-1 ring-orange-500/40'
                    : 'bg-gradient-to-r from-slate-950/95 via-slate-950/90 to-amber-950/25 border-amber-500/35 hover:border-amber-400/70 shadow-[0_0_12px_rgba(245,158,11,0.12)] hover:shadow-[0_0_18px_rgba(245,158,11,0.22)]';
                } else {
                  // In progress
                  cardStyles = isSelected
                    ? 'bg-orange-500/15 border-orange-500/60 shadow-sm'
                    : 'bg-slate-950/70 border-slate-800/80 hover:bg-slate-800';
                }

                return (
                  <button
                    key={item.challenge.id}
                    onClick={() => {
                      setSelectedChallengeId(item.challenge.id);
                      setIsMobileDrawerOpen(false);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`w-full text-right p-3 rounded-xl border transition duration-200 flex items-center justify-between gap-3 ${cardStyles}`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition ${
                          isSolved
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : isNotStarted
                            ? isSelected
                              ? 'bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 font-black shadow-md shadow-orange-500/30'
                              : 'bg-amber-500/15 text-amber-300 border border-amber-500/40 shadow-[0_0_8px_rgba(245,158,11,0.2)]'
                            : isSelected
                            ? 'bg-orange-500 text-slate-950 shadow-sm'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {isSolved ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : isNotStarted ? (
                          <Sparkles className="w-4 h-4 text-amber-400" />
                        ) : (
                          item.chapter.id
                        )}
                      </div>
                      <div className="min-w-0">
                        <h4 className={`text-xs font-bold truncate ${isSelected ? 'text-orange-300' : isNotStarted ? 'text-amber-100' : 'text-white'}`}>
                          {item.challenge.title}
                        </h4>
                        <span className="text-[10px] text-slate-400 truncate block">
                          الجزء {item.part.id} • الفصل {item.chapter.id}: {item.chapter.title.split(':')[1] || item.chapter.title}
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-1.5">
                      {isSolved ? (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                          مكتمل ✓
                        </span>
                      ) : isNotStarted ? (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/15 text-amber-300 font-bold border border-amber-500/40 shadow-[0_0_8px_rgba(245,158,11,0.18)] flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.6)]"></span>
                          <span>تحدي جديد ✨</span>
                        </span>
                      ) : (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500/15 text-orange-300 font-semibold border border-orange-500/30">
                          قيد الحل ⏳
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
