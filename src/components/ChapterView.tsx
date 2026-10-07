import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Chapter } from '../types';
import { runJavaScript } from '../utils/codeRunner';
import { CodeBlock } from './CodeBlock';
import { detectCodeLanguage, buildHtmlPreviewDocument } from '../utils/codePreview';
import { validateChallenge } from '../utils/challengeValidator';
import { LiveBrowserPreview } from './LiveBrowserPreview';
import { FormattedArabicText } from './FormattedArabicText';
import { ChapterQuiz } from './ChapterQuiz';
import { soundManager } from '../utils/soundManager';
import { StandardLoadingState } from './ui/StateFeedback';

const CodeEditor = lazy(() =>
  import('./CodeEditor').then((module) => ({ default: module.CodeEditor }))
);
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
  Globe,
  Eye,
  Bookmark,
  Star,
  Brain,
  Lightbulb,
  Zap,
  Clock,
  Layers,
  ListOrdered,
  AlertTriangle,
  AlertCircle,
  Award,
  Undo2,
  X,
  ChevronDown,
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
  onOpenPartExam?: (partId: number) => void;
  isLastChapterInPart?: boolean;
  isBookmarked?: boolean;
  onToggleBookmark?: () => void;
  userNote?: string;
  onSaveUserNote?: (note: string) => void;
  onCompleteQuiz?: (chapterId: number) => void;
}

import type { Variants } from 'framer-motion';

// Framer Motion animation variants for conclusions and analytical cards
const conclusionsContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const conclusionItemVariants: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.96 },
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

const sectionFadeVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: Math.min(i * 0.06, 0.4),
      duration: 0.35,
      ease: 'easeOut' as const,
    },
  }),
};

export const ChapterView = React.memo<ChapterViewProps>(({
  chapter,
  onPrevChapter,
  onNextChapter,
  onOpenInPlayground,
  isCompleted,
  onToggleCompleted,
  savedChallengeCode,
  onUpdateChallengeCode,
  onOpenPartExam,
  isLastChapterInPart = false,
  isBookmarked = false,
  onToggleBookmark,
  userNote = '',
  onSaveUserNote,
  onCompleteQuiz,
}) => {
  // Personal notes state
  const [noteText, setNoteText] = useState(userNote);
  const [isNoteSaved, setIsNoteSaved] = useState(false);

  React.useEffect(() => {
    setNoteText(userNote);
  }, [userNote, chapter.id]);

  const handleNoteChange = (text: string) => {
    setNoteText(text);
    setIsNoteSaved(true);
    if (onSaveUserNote) {
      onSaveUserNote(text);
    }
  };

  // Phase 5: Lesson Reading Experience & Table of Contents
  const articleRef = useRef<HTMLElement | null>(null);
  const [readingProgress, setReadingProgress] = useState(0);
  const [activeSectionId, setActiveSectionId] = useState<string>('');
  const [isMobileTocOpen, setIsMobileTocOpen] = useState(false);

  // Calculate estimated reading time based on actual lesson word count
  const estimatedReadingMinutes = React.useMemo(() => {
    if (!chapter?.contentSections) return 3;
    let totalWords = 0;
    for (const sec of chapter.contentSections) {
      totalWords += (sec.heading || '').split(/\s+/).filter(Boolean).length;
      totalWords += (sec.text || '').split(/\s+/).filter(Boolean).length;
    }
    if (chapter.summaryPoints) {
      totalWords += chapter.summaryPoints.join(' ').split(/\s+/).filter(Boolean).length;
    }
    return Math.max(2, Math.round(totalWords / 160));
  }, [chapter]);

  // Generated table of contents items
  const tocItems = React.useMemo(() => {
    const items: Array<{
      id: string;
      title: string;
      number?: number;
      type: 'section' | 'exercises' | 'quiz' | 'notes' | 'challenge';
    }> = [];

    chapter.contentSections?.forEach((sec, idx) => {
      items.push({
        id: `sec-${idx}`,
        title: sec.heading || `الموضوع ${idx + 1}`,
        number: idx + 1,
        type: 'section',
      });
    });

    if (chapter.exercises && chapter.exercises.length > 0) {
      items.push({
        id: 'chapter-exercises',
        title: 'جرّب بنفسك: توقّع الناتج',
        type: 'exercises',
      });
    }

    if (chapter.quiz && chapter.quiz.length > 0) {
      items.push({
        id: 'chapter-quiz-section',
        title: 'كويز الفصل السريع',
        type: 'quiz',
      });
    }

    items.push({
      id: 'chapter-notes-section',
      title: 'ملاحظاتي وتلخيصي الخاص',
      type: 'notes',
    });

    if (chapter.challenge) {
      items.push({
        id: 'chapter-challenge-section',
        title: chapter.challenge.title || 'تحدي الفصل البرمجي',
        type: 'challenge',
      });
    }

    return items;
  }, [chapter]);

  // Track scroll position for reading progress bar
  useEffect(() => {
    const handleScroll = () => {
      const el = articleRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const scrollableDistance = rect.height - window.innerHeight;
      if (scrollableDistance <= 0) {
        setReadingProgress(100);
        return;
      }
      const scrolled = -rect.top;
      const pct = Math.min(100, Math.max(0, (scrolled / scrollableDistance) * 100));
      setReadingProgress(pct);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [chapter.id]);

  // IntersectionObserver for tracking active section
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((e) => e.isIntersecting);
        if (visibleEntries.length > 0) {
          const topVisible = visibleEntries.reduce((prev, curr) =>
            curr.boundingClientRect.top < prev.boundingClientRect.top ? curr : prev
          );
          setActiveSectionId(topVisible.target.id);
        }
      },
      {
        rootMargin: '-80px 0px -40% 0px',
        threshold: 0.1,
      }
    );

    const sectionNodes = document.querySelectorAll('[data-chapter-target]');
    sectionNodes.forEach((node) => observer.observe(node));

    return () => observer.disconnect();
  }, [chapter.id, tocItems]);

  const scrollToTarget = (id: string) => {
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSectionId(id);
    }
    setIsMobileTocOpen(false);
  };
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
  const [challengeFeedback, setChallengeFeedback] = useState<string | null>(null);

  // Defer CodeEditor loading until student scrolls to or clicks the challenge editor
  const [isEditorActivated, setIsEditorActivated] = useState(false);
  const editorObserverRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isEditorActivated) return;
    const target = editorObserverRef.current;
    if (!target) return;

    if (!('IntersectionObserver' in window)) {
      setIsEditorActivated(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setIsEditorActivated(true);
          observer.disconnect();
        }
      },
      { rootMargin: '300px' }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [isEditorActivated, chapter.id]);

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
    setChallengeFeedback(null);
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

  const getChainedSnippetCode = (index: number, code: string): string => {
    if (index === 0) return code;
    const lang = detectCodeLanguage(code);
    if (lang === 'html' || lang === 'css') return code;

    const previousSnippets: string[] = [];
    for (let i = 0; i < index; i++) {
      const prevSec = chapter.contentSections[i];
      if (prevSec?.codeSnippet) {
        const prevLang = detectCodeLanguage(prevSec.codeSnippet);
        if (prevLang !== 'html' && prevLang !== 'css') {
          previousSnippets.push(prevSec.codeSnippet);
        }
      }
    }
    if (previousSnippets.length === 0) return code;
    return [...previousSnippets, code].join('\n\n');
  };

  const handleRunSnippet = async (index: number, code: string) => {
    soundManager.playRun();
    setRunningSnippetIndex(index);
    let res = await runJavaScript(code);

    // If standalone execution failed due to an undefined variable/function (ReferenceError),
    // automatically link and chain with previous code snippets in the same chapter
    if (res.errors && res.errors.length > 0 && index > 0) {
      const hasNotDefinedError = res.errors.some((err) => err.includes('is not defined'));
      if (hasNotDefinedError) {
        const chainedCode = getChainedSnippetCode(index, code);
        if (chainedCode !== code) {
          const chainedRes = await runJavaScript(chainedCode);
          if (chainedRes.success || chainedRes.errors.length < res.errors.length) {
            res = chainedRes;
          }
        }
      }
    }

    setSnippetOutputs((prev) => ({
      ...prev,
      [index]: { logs: res.logs, errors: res.errors },
    }));
    setRunningSnippetIndex(null);
    if (res.errors && res.errors.length > 0) {
      soundManager.playError();
    } else {
      soundManager.playSuccess();
    }
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

function evaluateChapterChallenge(
  chapterId: number,
  code: string,
  logs: string[],
  errors: string[] = []
): { passed: boolean; message: string } {
  return validateChallenge(chapterId, code, logs, errors);
}

  const handleTestChallenge = async () => {
    if (!challengeCode.trim()) return;
    soundManager.playRun();
    const lang = detectCodeLanguage(challengeCode);
    const isWeb = lang === 'html' || lang === 'css' || (chapter.partId === 6 && chapter.id !== 29);

    if (isWeb) {
      const effectiveLang = lang === 'css' || chapter.id === 24 || chapter.id === 26 || chapter.id === 27 ? 'css' : 'html';
      const previewDoc = buildHtmlPreviewDocument(challengeCode, effectiveLang);
      setChallengeHtmlPreview(previewDoc);

      let isSuccess = false;
      let resultMsg = '';

      if (chapter.id === 23) {
        const hasH1 = /<h1\b[^>]*>.*?<\/h1>/is.test(challengeCode);
        const hasP = /<p\b[^>]*>.*?<\/p>/is.test(challengeCode);
        const hasUl = /<ul\b[^>]*>[\s\S]*?<\/ul>/is.test(challengeCode);
        if (hasH1 && hasP && hasUl) {
          isSuccess = true;
          resultMsg = '🎉 ممتاز جداً! كتبت هيكل بطاقة الـ HTML بالكامل، والمعاينة الحية ظاهرة أمامك في المتصفح.';
          setChallengeOutput({ logs: [resultMsg], errors: [] });
        } else {
          isSuccess = false;
          resultMsg = 'فاضل بعض الوسوم: تأكد من إضافة <h1> للعنوان، و <p> للتعريف، و <ul> للهوايات.';
          setChallengeOutput({ logs: [], errors: [resultMsg] });
        }
      } else if (chapter.id === 24) {
        const highlightRule = challengeCode.match(/\.highlight\s*\{([\s\S]*?)\}/i)?.[1] ?? '';
        const hasHighlight = /(?:^|;)\s*color\s*:\s*yellow\s*(?:;|$)/i.test(highlightRule);
        if (hasHighlight) {
          isSuccess = true;
          resultMsg = '🎉 رائع! تم تطبيق قاعدة كلاس .highlight على النص في المعاينة الحية.';
          setChallengeOutput({ logs: [resultMsg], errors: [] });
        } else {
          isSuccess = false;
          resultMsg = 'تأكد من كتابة قاعدة .highlight { ... } وتحديد اللون الأصفر color: yellow;';
          setChallengeOutput({ logs: [], errors: [resultMsg] });
        }
      } else if (chapter.id === 25) {
        const labelFor = challengeCode.match(/<label\b[^>]*\bfor=["']([^"']+)["']/i)?.[1];
        const inputId = challengeCode.match(/<input\b[^>]*\bid=["']([^"']+)["']/i)?.[1];
        const valid = /<form\b/i.test(challengeCode) && labelFor && labelFor === inputId &&
          /<input\b[^>]*\btype=["']email["']/i.test(challengeCode) &&
          /<button\b[^>]*\btype=["']submit["']/i.test(challengeCode);
        isSuccess = Boolean(valid);
        resultMsg = valid ? 'ممتاز! النموذج فيه تسمية مربوطة بحقل البريد وزر إرسال.' : 'ضيف form، واربط label بالحقل بـ for وid، واستخدم input type="email" وزر type="submit".';
        setChallengeOutput({ logs: valid ? [resultMsg] : [], errors: valid ? [] : [resultMsg] });
      } else if (chapter.id === 26) {
        const hasRule = /button\s*\{[\s\S]*?border-radius\s*:\s*12px\s*;?[\s\S]*?\}/i.test(challengeCode);
        isSuccess = Boolean(hasRule);
        resultMsg = hasRule ? 'حلو! قاعدة button بتدوّر الحواف بمقدار 12px.' : 'اكتب قاعدة button فيها border-radius: 12px;.';
        setChallengeOutput({ logs: hasRule ? [resultMsg] : [], errors: hasRule ? [] : [resultMsg] });
      } else if (chapter.id === 27) {
        const hasRule = /body\s*\{[\s\S]*?background-color\s*:\s*#ffffff\s*;?[\s\S]*?\}/i.test(challengeCode);
        isSuccess = Boolean(hasRule);
        resultMsg = hasRule ? 'تمام! خليت خلفية body بيضا بكود Hex.' : 'اكتب body { background-color: #ffffff; }.';
        setChallengeOutput({ logs: hasRule ? [resultMsg] : [], errors: hasRule ? [] : [resultMsg] });
      } else if (chapter.id === 28) {
        const valid = /class=["']product-card["']/i.test(challengeCode) && /<h2\b/i.test(challengeCode) &&
          /<p\b/i.test(challengeCode) && /<button\b/i.test(challengeCode) && /\.product-card\s*\{/i.test(challengeCode);
        isSuccess = Boolean(valid);
        resultMsg = valid ? 'بطاقة المنتج كاملة: HTML للمحتوى وقاعدة CSS للشكل.' : 'ضيف بطاقة class="product-card" فيها h2 وفقرة وزر، واكتب قاعدة CSS للمحدد .product-card.';
        setChallengeOutput({ logs: valid ? [resultMsg] : [], errors: valid ? [] : [resultMsg] });
      } else if (chapter.id === 30) {
        const valid = /<button\b/i.test(challengeCode) && /<p\b[^>]*\bid=["']status["']/i.test(challengeCode) &&
          /addEventListener\s*\(\s*["']click["']/i.test(challengeCode) && /isOn\s*=\s*!isOn/.test(challengeCode) &&
          /textContent/.test(challengeCode) && /النور مضاء/.test(challengeCode) && /النور مطفي/.test(challengeCode);
        isSuccess = Boolean(valid);
        resultMsg = valid ? 'ممتاز! الزر بيبدّل قيمة Boolean وبيغيّر نص الفقرة لما نضغط عليه.' : 'ضيف زر وفقرة id="status"، واربط click عشان يبدّل isOn ويغيّر textContent للنصين المطلوبين.';
        setChallengeOutput({ logs: valid ? [resultMsg] : [], errors: valid ? [] : [resultMsg] });
      } else if (chapter.id === 31) {
        const valid = /addEventListener\s*\(\s*["']input["']/i.test(challengeCode) &&
          /<input\b/i.test(challengeCode) && (/<p\b/i.test(challengeCode) || /<span\b/i.test(challengeCode));
        isSuccess = Boolean(valid);
        resultMsg = valid ? '🎉 رائع جداً! ربطت حدث input بتحديث عدد الحروف على الفور!' : 'تأكد من إضافة حقل input وفقرة لعرض العداد، وربط حدث input بـ addEventListener لتحديث طول النص.';
        setChallengeOutput({ logs: valid ? [resultMsg] : [], errors: valid ? [] : [resultMsg] });
      } else {
        isSuccess = true;
        resultMsg = '✓ تم تفعيل المعاينة الحية في المتصفح بنجاح.';
        setChallengeOutput({ logs: [resultMsg], errors: [] });
      }

      setChallengeSuccess(isSuccess);
      setChallengeFeedback(resultMsg);
      if (isSuccess) {
        soundManager.playCompletion();
      } else {
        soundManager.playError();
      }
      return;
    }

    setChallengeHtmlPreview(null);
    const res = await runJavaScript(challengeCode);
    setChallengeOutput({ logs: res.logs, errors: res.errors });

    const evalResult = evaluateChapterChallenge(chapter.id, challengeCode, res.logs, res.errors);
    setChallengeSuccess(evalResult.passed);
    setChallengeFeedback(evalResult.message);
    if (evalResult.passed) {
      soundManager.playCompletion();
    } else {
      soundManager.playError();
    }
  };

  // If detailed lesson content is loading dynamically for this part
  if (!chapter || !chapter.contentSections || chapter.contentSections.length === 0) {
    return (
      <article className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-8 space-y-6 sm:space-y-8 animate-pulse w-full pb-32">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="space-y-2 w-full max-w-md">
            <div className="h-5 bg-slate-800 rounded-md w-1/3"></div>
            <div className="h-8 bg-slate-800 rounded-lg w-3/4"></div>
            <div className="h-4 bg-slate-800 rounded w-1/2"></div>
          </div>
        </div>
        <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-6 space-y-4">
          <div className="h-4 bg-slate-800 rounded w-full"></div>
          <div className="h-4 bg-slate-800 rounded w-5/6"></div>
          <div className="h-4 bg-slate-800 rounded w-4/6"></div>
        </div>
        <div className="flex items-center justify-center py-8 text-slate-500 font-mono text-xs gap-2">
          <BookOpen className="w-5 h-5 animate-pulse text-amber-500/60" />
          <span>جاري فتح محتوى الدرس وموضوعاته...</span>
        </div>
      </article>
    );
  }

  const isAnalyticalReview =
    chapter.title.includes('المراجعة التحليلية') ||
    chapter.title.includes('مراجعة تحليلية') ||
    chapter.title.includes('المراجعة والربط') ||
    chapter.title.includes('مراجعة') ||
    chapter.subtitle?.includes('تحليل') ||
    chapter.subtitle?.includes('المراجعة التحليلية') ||
    chapter.id === 5 ||
    chapter.id === 18 ||
    chapter.id === 22 ||
    chapter.id === 31;

  return (
    <motion.article
      ref={articleRef}
      key={`chapter-article-${chapter.id}`}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-8 space-y-6 sm:space-y-8 w-full pb-32 sm:pb-36 lg:pb-16 relative"
    >
      {/* 1. Thin Reading Progress Indicator */}
      <div
        className="sticky top-0 z-30 w-full h-1 bg-slate-900/90 backdrop-blur-sm -mt-4 sm:-mt-8 mb-4 overflow-hidden border-b border-slate-800/40 rounded-full"
        role="progressbar"
        aria-valuenow={Math.round(readingProgress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="نسبة قراءة الدرس"
      >
        <div
          className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400 transition-[width] duration-150 ease-out shadow-sm shadow-amber-500/50"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Analytical Review Glow Banner */}
      {isAnalyticalReview && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'spring', damping: 18, stiffness: 220 }}
          className="relative overflow-hidden rounded-3xl p-5 sm:p-6 bg-gradient-to-r from-amber-500/20 via-indigo-600/20 to-cyan-500/20 border-2 border-amber-500/40 shadow-2xl shadow-amber-500/10"
        >
          {/* Animated background ambient aura */}
          <motion.div
            animate={{
              opacity: [0.15, 0.35, 0.15],
              scale: [1, 1.08, 1],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -right-10 -top-10 w-48 h-48 bg-amber-500/30 rounded-full blur-3xl pointer-events-none"
          />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-4">
              <motion.div
                animate={{
                  rotate: [0, 6, -6, 0],
                  scale: [1, 1.08, 1],
                }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 flex items-center justify-center text-2xl shadow-lg shrink-0 font-black"
              >
                🧠
              </motion.div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider text-amber-300 flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-amber-500/20 border border-amber-500/30">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    المراجعة والربط التحليلي الشامل
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-200 border border-indigo-500/30 font-bold">
                    Interactive Analytical Review
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-black text-white">
                  محطة استنتاج وتتبع مسار الكود واكتشاف الأخطاء وتثبيت القواعد
                </h2>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  استعرض الاستنتاجات البرمجية أدناه وتحليل سيناريوهات التنفيذ خطوة بخطوة 🔍⚡
                </p>
              </div>
            </div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="self-start sm:self-center px-3.5 py-2 rounded-xl bg-slate-900/90 border border-amber-500/30 text-xs font-bold text-amber-300 flex items-center gap-2 shadow-md shrink-0"
            >
              <Zap className="w-4 h-4 text-amber-400 animate-bounce" />
              <span>تحليل استنتاجي</span>
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* Chapter Top Breadcrumb, Metadata & Actions (Matched to Figma screenshot) */}
      <div className="space-y-4 pb-6 border-b border-slate-800/80">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2">
            <div>
              <span className="inline-block text-xs sm:text-sm font-black px-3.5 py-1.5 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/30 shadow-sm">
                {chapter.partTitle}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              {chapter.title}
            </h1>
            <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed">
              <FormattedArabicText text={chapter.subtitle} />
            </p>

            {/* Reading metadata */}
            <div className="flex items-center gap-4 text-xs sm:text-sm text-slate-400 pt-1 font-medium">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>حوالي {estimatedReadingMinutes} دقائق قراءة</span>
              </span>
              <span className="flex items-center gap-1.5">
                <ListOrdered className="w-4 h-4 text-slate-400" />
                <span>{chapter.contentSections.length} موضوعات</span>
              </span>
            </div>
          </div>

          {/* Action buttons (Completed + Bookmark) */}
          <div className="flex items-center gap-2.5 self-start sm:self-center shrink-0">
            <button
              onClick={onToggleCompleted}
              className={`flex items-center gap-2 min-h-[44px] px-5 py-2 rounded-2xl text-xs sm:text-sm font-black transition-all shadow-md active:scale-95 ${
                isCompleted
                  ? 'bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border-2 border-emerald-500/40 shadow-emerald-500/10'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-2 border-slate-700/80 hover:border-amber-400'
              }`}
            >
              <span>{isCompleted ? '✓ مكتمل ومقروء' : 'تحديد كمكتمل'}</span>
              <CheckCircle2 className={`w-4 h-4 ${isCompleted ? 'text-emerald-400' : 'text-slate-400'}`} />
            </button>

            {onToggleBookmark && (
              <button
                onClick={onToggleBookmark}
                className={`flex items-center justify-center min-h-[44px] min-w-[44px] p-2.5 rounded-2xl text-xs sm:text-sm font-bold transition border active:scale-95 ${
                  isBookmarked
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                    : 'bg-slate-900/90 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
                title={isBookmarked ? 'إزالة من المفضلة' : 'حفظ في المفضلة'}
                aria-label="حفظ في المفضلة"
              >
                <Star className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400 text-amber-400' : 'text-slate-400'}`} />
              </button>
            )}
          </div>
        </div>

        {/* Mobile Dedicated Table of Contents Button Bar (Figma layout) */}
        <div className="xl:hidden pt-2">
          <button
            onClick={() => setIsMobileTocOpen(true)}
            className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-slate-900/90 hover:bg-slate-800/90 text-slate-200 border border-slate-800 transition active:scale-[0.99] shadow-lg"
          >
            <span className="text-xs text-slate-400 truncate max-w-[50%] text-right font-medium">
              {chapter.contentSections?.find((s, idx) => `sec-${idx}` === activeSectionId)?.heading || chapter.contentSections?.[0]?.heading || ''}
            </span>
            <div className="flex items-center gap-2 font-bold text-sm text-white">
              <span>محتويات الدرس</span>
              <ListOrdered className="w-4 h-4 text-amber-400" />
            </div>
          </button>
        </div>
      </div>

      {/* Two-Column Grid: Reading Column + Desktop Sticky TOC */}
      <div className="xl:grid xl:grid-cols-[1fr_270px] gap-8 items-start">
        {/* Main Reading Column */}
        <div className="min-w-0 space-y-6 sm:space-y-8">

      {/* Chapter Summary / Conclusions Cards with Framer Motion Stagger */}
      {chapter.summaryPoints.length > 0 && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={conclusionsContainerVariants}
          className={`rounded-3xl border p-5 sm:p-6 shadow-xl relative overflow-hidden ${
            isAnalyticalReview
              ? 'bg-gradient-to-b from-slate-900/95 via-slate-900/90 to-slate-950 border-amber-500/40 shadow-amber-500/5'
              : 'bg-slate-900/90 border-slate-800 shadow-inner'
          }`}
        >
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800/80">
            <div className="flex items-center gap-2.5">
              <motion.div
                animate={{ scale: [1, 1.12, 1] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                className={`p-2 rounded-xl ${
                  isAnalyticalReview
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                }`}
              >
                {isAnalyticalReview ? (
                  <Brain className="w-4 h-4 text-amber-400" strokeWidth={2.3} />
                ) : (
                  <BookOpen className="w-4 h-4 text-orange-400" strokeWidth={2.3} />
                )}
              </motion.div>
              <div>
                <h3 className="text-xs sm:text-sm font-black text-amber-300 uppercase tracking-wider flex items-center gap-2">
                  <span>
                    {isAnalyticalReview
                      ? 'الاستنتاجات والنقاط التحليلية الذهبية للفصل:'
                      : 'أهم النقاط والاستنتاجات اللي هتطلع بيها من الفصل:'}
                  </span>
                  {isAnalyticalReview && <span className="text-base">💡</span>}
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  تظهر النقاط أدناه تدريجياً لترسيخ المفاهيم وتحليلها بدقة:
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-amber-300 bg-amber-500/15 px-3 py-1 rounded-full border border-amber-500/30 shrink-0">
              {chapter.summaryPoints.length} استنتاجات
            </span>
          </div>

          <motion.ul variants={conclusionsContainerVariants} className="grid sm:grid-cols-2 gap-3 text-xs sm:text-sm text-slate-300">
            {chapter.summaryPoints.map((point, idx) => (
              <motion.li
                key={idx}
                variants={conclusionItemVariants}
                whileHover={{ scale: 1.018, y: -2 }}
                transition={{ type: 'spring', damping: 18, stiffness: 320 }}
                className={`flex items-start gap-3 p-3.5 rounded-2xl border transition duration-200 cursor-default shadow-sm ${
                  isAnalyticalReview
                    ? 'bg-slate-950/80 border-amber-500/30 hover:border-amber-400/70 hover:bg-slate-950 hover:shadow-md hover:shadow-amber-500/10'
                    : 'bg-slate-950/60 border-slate-800/90 hover:border-slate-700 hover:bg-slate-950'
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-xl font-black flex items-center justify-center text-xs shrink-0 mt-0.5 border ${
                    isAnalyticalReview
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm shadow-amber-500/20'
                      : 'bg-orange-500/20 text-orange-400 border-orange-500/30'
                  }`}
                >
                  {idx + 1}
                </span>
                <span className="leading-relaxed flex-1 text-right font-medium" dir="rtl">
                  <FormattedArabicText text={point} />
                </span>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      )}

      {/* Chapter Sections */}
      <div className="space-y-8">
        {chapter.contentSections.map((sec, idx) => (
          <motion.section
            key={idx}
            id={`sec-${idx}`}
            data-chapter-target
            custom={idx}
            initial="hidden"
            animate="visible"
            variants={sectionFadeVariants}
            className="scroll-mt-24 space-y-4"
          >
            <h2 className="text-base sm:text-xl font-bold text-slate-100 flex items-start gap-2.5 leading-snug sm:leading-relaxed">
              <span className="w-1.5 sm:w-2 h-5 bg-orange-500 rounded-full shrink-0 mt-0.5 sm:mt-1 shadow-sm shadow-orange-500/40"></span>
              <span className="flex-1 min-w-0">
                <FormattedArabicText text={sec.heading} />
              </span>
            </h2>

            <div className="text-sm sm:text-base text-slate-300 leading-relaxed sm:leading-loose whitespace-pre-line font-normal break-words text-right" dir="rtl">
              <FormattedArabicText text={sec.text} />
            </div>

            {/* Live HTML Preview if applicable */}
            {sec.type === 'html_preview' && (sec.codeSnippet || sec.htmlCode) && (
              <div className="space-y-2.5 my-4">
                <div className="text-xs font-semibold text-slate-400 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
                    <Globe className="w-4 h-4" />
                    <span>معاينة حية للمتصفح (HTML Preview) — تطبيق تفاعلي يعمل مباشرة:</span>
                  </span>
                  <span className="text-[11px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    Live Rendering ⚡
                  </span>
                </div>
                <div className="rounded-2xl overflow-hidden shadow-2xl border border-slate-700">
                  <LiveBrowserPreview
                    htmlContent={buildHtmlPreviewDocument(
                      sec.codeSnippet || sec.htmlCode || '',
                      'html'
                    )}
                    title={sec.heading || 'معاينة صفحة الويب'}
                    height="320px"
                  />
                </div>
              </div>
            )}

            {/* Code Snippet with Run Button */}
            {sec.codeSnippet && (() => {
              const lang = detectCodeLanguage(sec.codeSnippet);
              const isWebCode = lang === 'html' || lang === 'css';

              return (
                <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
                  <div className="bg-slate-900/90 px-3 sm:px-4 py-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 text-xs">
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
                    <div className="grid grid-cols-2 w-full sm:w-auto sm:flex sm:items-center gap-2">
                      <button
                        onClick={() => onOpenInPlayground(getChainedSnippetCode(idx, sec.codeSnippet!))}
                        className="min-h-11 flex items-center justify-center text-slate-300 hover:text-white px-2 py-1 rounded-lg hover:bg-slate-800 transition touch-manipulation"
                        title="فتح الكود وتعديله في المحرّر"
                      >
                        تعديل في المحرّر
                      </button>

                      {isWebCode ? (
                        <button
                          onClick={() =>
                            setPreviewSnippetIndex(previewSnippetIndex === idx ? null : idx)
                          }
                          className={`min-h-11 flex items-center justify-center gap-1.5 font-bold px-2 sm:px-3 py-1 rounded-lg text-xs transition active:scale-95 shadow ${
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
                          className="min-h-11 flex items-center justify-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-2 sm:px-3 py-1 rounded-lg text-xs transition active:scale-95 shadow"
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

            {/* Standardized Informational Callout Box (Phase 5: semantic Lucide icons) */}
            {sec.callout && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', bounce: 0.2, duration: 0.35 }}
                className={`p-4 sm:p-5 rounded-2xl border flex items-start gap-3 sm:gap-4 ${
                  sec.callout.type === 'celebration'
                    ? 'bg-amber-950/20 border-amber-500/40 text-amber-200'
                    : sec.callout.type === 'warning'
                    ? 'bg-rose-950/20 border-rose-500/40 text-rose-200'
                    : sec.callout.type === 'common_mistake'
                    ? 'bg-orange-950/20 border-orange-500/40 text-orange-200'
                    : 'bg-sky-950/20 border-sky-500/40 text-sky-200'
                }`}
              >
                <div
                  className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                    sec.callout.type === 'celebration'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : sec.callout.type === 'warning'
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      : sec.callout.type === 'common_mistake'
                      ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                      : 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                  }`}
                >
                  {sec.callout.type === 'celebration' ? (
                    <Sparkles className="w-5 h-5 text-amber-400" />
                  ) : sec.callout.type === 'warning' ? (
                    <AlertTriangle className="w-5 h-5 text-rose-400" />
                  ) : sec.callout.type === 'common_mistake' ? (
                    <AlertCircle className="w-5 h-5 text-orange-400" />
                  ) : (
                    <Lightbulb className="w-5 h-5 text-sky-400" />
                  )}
                </div>
                <div className="space-y-1 flex-1 min-w-0">
                  <h4 className="font-bold text-sm sm:text-base text-white">
                    <FormattedArabicText text={sec.callout.title} />
                  </h4>
                  <p className="text-xs sm:text-sm leading-relaxed opacity-90">
                    <FormattedArabicText text={sec.callout.content} />
                  </p>
                </div>
              </motion.div>
            )}
          </motion.section>
        ))}
      </div>

      {/* Exercises Section: "جرّب بنفسك: توقّع الناتج" */}
      {chapter.exercises.length > 0 && (
        <section
          id="chapter-exercises"
          data-chapter-target
          className="scroll-mt-24 bg-slate-900/60 rounded-2xl border border-slate-800 p-6 space-y-6"
        >
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

      {/* Chapter Interactive Quiz: "كويز الفصل السريع" */}
      {chapter.quiz && chapter.quiz.length > 0 && (
        <div id="chapter-quiz-section" data-chapter-target className="scroll-mt-24">
          <ChapterQuiz
            key={`chapter-quiz-${chapter.id}`}
            chapterId={chapter.id}
            quiz={chapter.quiz}
            chapterTitle={chapter.title}
            onComplete={onCompleteQuiz ? () => onCompleteQuiz(chapter.id) : undefined}
            onScrollToChallenge={() => {
              const el = document.getElementById('chapter-challenge-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        </div>
      )}

      {/* Student Personal Notes Card */}
      <section
        id="chapter-notes-section"
        data-chapter-target
        className="scroll-mt-24 bg-slate-900/80 rounded-2xl border border-slate-800 p-4 sm:p-5 space-y-2.5 shadow-md"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white font-bold text-sm sm:text-base">
            <span className="text-amber-400">📝</span>
            <h4>ملاحظاتي وتلخيصي الخاص لهذا الفصل:</h4>
          </div>
          {isNoteSaved && (
            <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              <span>محفوظ تلقائياً</span>
            </span>
          )}
        </div>
        <textarea
          value={noteText}
          onChange={(e) => handleNoteChange(e.target.value)}
          placeholder="سجّل أي ملحوظة أو تركة برمجية خاصة بيك هنا.. هيفضل محفوظ في حسابك وتقدر ترجعله في أي وقت!"
          className="w-full h-24 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/50 resize-y leading-relaxed font-sans"
          dir="auto"
        />
      </section>

      {/* Challenge Section: "وريني شطارتك 🧠" */}
      {chapter.challenge && (
        <section
          id="chapter-challenge-section"
          data-chapter-target
          className="scroll-mt-24 bg-gradient-to-b from-amber-950/20 via-slate-900 to-slate-950 rounded-2xl border border-amber-500/30 p-6 space-y-4 shadow-xl"
        >
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
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span>اكتب كود الحل هنا:</span>
                <span className="text-[11px] text-emerald-400/90 font-mono flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>محفوظ تلقائياً</span>
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowChallengeHint(!showChallengeHint)}
                  className="text-amber-400 hover:text-amber-300 text-xs font-medium"
                >
                  {showChallengeHint ? 'إخفاء التلميح' : 'عايز تلميح؟ 💡'}
                </button>
                <button
                  onClick={() => setShowChallengeSolution(!showChallengeSolution)}
                  className="text-slate-400 hover:text-slate-200 text-xs font-medium"
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

            <div
              ref={editorObserverRef}
              className="rounded-2xl overflow-hidden border border-slate-800 shadow-xl"
            >
              {isEditorActivated ? (
                <Suspense
                  fallback={
                    <StandardLoadingState variant="editor" />
                  }
                >
                  <CodeEditor
                    value={challengeCode}
                    onChange={handleChallengeChange}
                    onRun={handleTestChallenge}
                    placeholder="// اكتب كودك هنا..."
                    isWebMode={chapter.partId === 6 && chapter.id !== 29}
                    className="h-60 sm:h-72"
                  />
                </Suspense>
              ) : (
                <div
                  onClick={() => setIsEditorActivated(true)}
                  className="h-60 sm:h-72 bg-slate-950/80 p-4 font-mono text-xs text-slate-400 cursor-pointer flex flex-col justify-between hover:bg-slate-900/60 transition group select-none"
                  title="انقر لتشغيل المحرر وكتابة الحل"
                >
                  <div className="space-y-1.5 opacity-75 group-hover:opacity-100 transition">
                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                      <Terminal className="w-3.5 h-3.5 text-amber-400" />
                      <span>محرر الكود التفاعلي (انقر للبدء)</span>
                    </div>
                    <pre className="text-slate-300 font-mono text-xs overflow-hidden leading-relaxed whitespace-pre-wrap">
                      {challengeCode || '// اكتب كود الحل هنا...'}
                    </pre>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20">
                    <span>انقر لتفعيل المحرر وكتابة الحل ⚡</span>
                    <Play className="w-3.5 h-3.5 fill-current" />
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2.5">
              <button
                onClick={() => {
                  const initial = chapter.challenge?.initialCode || '';
                  handleChallengeChange(initial);
                  setChallengeOutput(null);
                  setChallengeFeedback(null);
                  setChallengeSuccess(null);
                }}
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
              <div className="mt-3 p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-sans space-y-3 shadow-lg">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-bold flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-amber-400" />
                    <span>تقييم ونتيجة الحل:</span>
                  </span>
                  {challengeSuccess ? (
                    <span className="text-emerald-400 font-bold px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-1">
                      <span>✓ إجابة صحيحة ومكتملة 🚀</span>
                    </span>
                  ) : (
                    <span className="text-rose-400 font-bold px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center gap-1">
                      <span>بحاجة لتعديل ⚠️</span>
                    </span>
                  )}
                </div>

                {/* Educational guidance banner */}
                {challengeFeedback && (
                  <div
                    className={`p-3 rounded-xl border text-xs sm:text-sm leading-relaxed flex items-start gap-2.5 font-sans ${
                      challengeSuccess
                        ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                        : 'bg-amber-950/40 border-amber-500/40 text-amber-200'
                    }`}
                  >
                    <span className="text-base shrink-0 mt-0.5">
                      {challengeSuccess ? '🎉' : '💡'}
                    </span>
                    <span className="font-medium">
                      <FormattedArabicText text={challengeFeedback} />
                    </span>
                  </div>
                )}

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
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-500 block">المخرجات في الكونسول (Console Output):</span>
                    <div
                      dir="ltr"
                      style={{ direction: 'ltr', textAlign: 'left', unicodeBidi: 'isolate' }}
                      className="text-emerald-400 text-left space-y-1 bg-slate-900/90 p-3 rounded-xl border border-slate-800 font-mono text-xs"
                    >
                      {challengeOutput.logs.map((l, i) => (
                        <div key={i}>{l}</div>
                      ))}
                    </div>
                  </div>
                )}

                {challengeOutput.errors.length > 0 && (
                  <div className="text-rose-400 text-right dir-rtl space-y-1 bg-rose-950/30 border border-rose-900/40 p-3 rounded-xl">
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

          {/* 5. End-of-Lesson Dedicated Completion Panel (Phase 5) */}
          <section className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-slate-950 p-5 sm:p-7 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              <div className="flex items-start sm:items-center gap-4">
                <div
                  className={`p-3 rounded-2xl shrink-0 ${
                    isCompleted
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-7 h-7 text-emerald-400" />
                  ) : (
                    <BookOpen className="w-7 h-7 text-amber-400" />
                  )}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-bold text-white">
                      {isCompleted
                        ? 'أتممت قراءة وتطبيق هذا الفصل بنجاح 🎉'
                        : 'أنهيت قراءة جميع موضوعات هذا الفصل؟'}
                    </h3>
                    {isCompleted && (
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        مكتمل
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {isCompleted
                      ? 'تم حفظ إنجازك في ملفك التعليمي، وجاهز للمتابعة إلى الخطوة التالية.'
                      : 'علّم الفصل كمكتمل لحفظ تقدمك وفتح مسارات التقييم والإحصائيات.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={onToggleCompleted}
                  className={`min-h-[48px] px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md active:scale-95 flex items-center gap-2 ${
                    isCompleted
                      ? 'bg-slate-800/90 hover:bg-slate-700 text-slate-300 border border-slate-700'
                      : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
                  }`}
                >
                  {isCompleted ? (
                    <>
                      <Undo2 className="w-4 h-4 text-slate-400" />
                      <span>تحديد كغير مكتمل (تراجع)</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 fill-slate-950 text-emerald-500" />
                      <span>تحديد الفصل كمكتمل وحفظ التقدم</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </section>

          {/* 6. Navigation Footer (Phase 5: Touch-friendly min-h-[48px], clean semantics) */}
          <div className="flex items-center justify-between pt-8 border-t border-slate-800 gap-3">
            {onPrevChapter ? (
              <button
                onClick={onPrevChapter}
                className="min-h-[48px] flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs sm:text-sm font-semibold transition"
              >
                <ArrowRight className="w-4 h-4" />
                <span>الفصل السابق</span>
              </button>
            ) : (
              <div></div>
            )}

            {isLastChapterInPart && onOpenPartExam ? (
              <button
                onClick={() => onOpenPartExam(chapter.partId)}
                className="min-h-[48px] flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-indigo-500 hover:brightness-110 text-slate-950 text-xs sm:text-sm font-black transition shadow-lg shadow-amber-500/20"
              >
                <Award className="w-4 h-4" />
                <span>ملخص وتحدي الجزء {chapter.partId} الشامل</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            ) : onNextChapter ? (
              <button
                onClick={onNextChapter}
                className="min-h-[48px] flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs sm:text-sm font-bold transition shadow-lg shadow-amber-500/20"
              >
                <span>الفصل التالي</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            ) : (
              <div></div>
            )}
          </div>
        </div>

        {/* 7. Desktop Sticky Lesson-Outline (TOC) Panel */}
        <aside className="hidden xl:block sticky top-20 z-10 space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 shadow-xl backdrop-blur-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
              <div className="flex items-center gap-2 font-bold text-sm text-white">
                <ListOrdered className="w-4 h-4 text-amber-400" />
                <span>محتويات الدرس</span>
              </div>
              <span
                className="text-[11px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20"
                dir="ltr"
              >
                {Math.round(readingProgress)}%
              </span>
            </div>

            {/* Mini Progress Bar */}
            <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden mb-3">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-150"
                style={{ width: `${readingProgress}%` }}
              />
            </div>

            <nav className="space-y-1 max-h-[calc(100vh-220px)] overflow-y-auto pr-1 text-xs">
              {tocItems.map((item) => {
                const isActive = activeSectionId === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => scrollToTarget(item.id)}
                    className={`w-full text-right px-3 py-2 rounded-xl transition flex items-center gap-2.5 text-xs ${
                      isActive
                        ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`}
                  >
                    {item.number ? (
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono shrink-0 ${
                          isActive
                            ? 'bg-amber-500 text-slate-950 font-black'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {item.number}
                      </span>
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                    )}
                    <span className="truncate">{item.title}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>
      </div>

      {/* 8. Mobile & Tablet TOC Modal Bottom Sheet */}
      <AnimatePresence>
        {isMobileTocOpen && (
          <div className="fixed inset-0 z-50 xl:hidden flex items-end justify-center">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileTocOpen(false)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
            />

            {/* Bottom Sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="relative z-10 w-full max-w-lg bg-slate-900 border-t border-slate-700/80 rounded-t-3xl p-5 shadow-2xl max-h-[80vh] flex flex-col"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2 font-bold text-white text-base">
                  <ListOrdered className="w-5 h-5 text-amber-400" />
                  <span>محتويات الدرس</span>
                  <span
                    className="text-xs text-amber-400 font-mono bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20"
                    dir="ltr"
                  >
                    {Math.round(readingProgress)}%
                  </span>
                </div>
                <button
                  onClick={() => setIsMobileTocOpen(false)}
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-slate-800 text-slate-400 hover:text-white"
                  aria-label="إغلاق قائمة المحتويات"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="overflow-y-auto py-3 space-y-1.5 flex-1">
                {tocItems.map((item) => {
                  const isActive = activeSectionId === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => scrollToTarget(item.id)}
                      className={`w-full min-h-[44px] text-right px-3.5 py-2.5 rounded-xl transition flex items-center gap-3 text-sm ${
                        isActive
                          ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                          : 'text-slate-300 hover:bg-slate-800/80'
                      }`}
                    >
                      {item.number ? (
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono shrink-0 ${
                            isActive
                              ? 'bg-amber-500 text-slate-950 font-black'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {item.number}
                        </span>
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                      )}
                      <span className="truncate">{item.title}</span>
                    </button>
                  );
                })}
              </nav>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.article>
  );
});
