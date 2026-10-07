import React, { lazy, Suspense, useState, useEffect, useRef, useMemo, useCallback } from 'react';
import type { ViewMode, Chapter, Part, PartComprehensiveExam } from './types';
import { Header } from './components/Header';
import { MobileBottomNav } from './components/MobileBottomNav';
import { ALL_BADGES } from './types/achievements';
import type { StudentStats } from './types/achievements';
import {
  isDeviceActivated,
  lockPlatform,
  ActivationState,
  validateSavedSession,
  fetchCodeProgress,
  syncCodeProgress,
} from './utils/activation';
import {
  getStringProgressMap,
  getTrueProgressIds,
  mergeProgressEntries,
  progressEntriesFromLegacy,
  readLocalProgressEntries,
  saveLocalProgressEntries,
  updateProgressEntry,
} from './utils/progressSync';
import { Menu, X } from 'lucide-react';
import { soundManager } from './utils/soundManager';
import { bookParts, preloadAllCourseParts, loadPartExamsData } from './data/bookData';
import { StudentDashboard } from './components/StudentDashboard';
import { Sidebar } from './components/Sidebar';
import { ChapterView } from './components/ChapterView';
import { PartSummaryView } from './components/PartSummaryView';
import {
  StandardLoadingState,
  StandardErrorState,
  OfflineStatusIndicator,
} from './components/ui/StateFeedback';

const CodePlayground = lazy(() => import('./components/CodePlayground').then((module) => ({ default: module.CodePlayground })));
const BugHunter = lazy(() => import('./components/BugHunter').then((module) => ({ default: module.BugHunter })));
const ChallengesList = lazy(() => import('./components/ChallengesList').then((module) => ({ default: module.ChallengesList })));
const AdminDashboard = lazy(() => import('./components/AdminDashboard').then((module) => ({ default: module.AdminDashboard })));
const GlobalSearchModal = lazy(() => import('./components/GlobalSearchModal').then((module) => ({ default: module.GlobalSearchModal })));
const AchievementsModal = lazy(() => import('./components/AchievementsModal').then((module) => ({ default: module.AchievementsModal })));
const OnboardingModal = lazy(() => import('./components/OnboardingModal').then((module) => ({ default: module.OnboardingModal })));

function ViewLoadingState() {
  return (
    <StandardLoadingState
      variant="panel"
      title="جارٍ تحميل القسم…"
      subtitle="تجهيز المحتوى والتمارين التفاعلية"
    />
  );
}

interface PlatformAppProps {
  activeCode: string;
  role: 'master' | 'admin' | 'teacher' | 'student';
  studentName?: string;
  onLockPlatform: () => void;
}

export function PlatformApp({ activeCode, role, studentName, onLockPlatform }: PlatformAppProps) {
  const codeKey = activeCode.trim().toUpperCase();
  const [partsList, setPartsList] = useState<Part[]>(() => bookParts);

  // Deferred Promise for non-critical static assets and large data files (part exams & comprehensive summaries)
  const deferredCourseDataPromiseRef = useRef<Promise<Record<number, PartComprehensiveExam>> | null>(null);

  useEffect(() => {
    let isCancelled = false;

    // Prioritize core UI shell rendering: schedule deferred loading when the main thread is idle
    const executeDeferredLoading = () => {
      if (isCancelled) return;

      const promise = loadPartExamsData();
      deferredCourseDataPromiseRef.current = promise;

      promise
        .then((exams) => {
          if (isCancelled) return;
          setPartsList((prevParts) =>
            prevParts.map((p) => {
              if (exams[p.id] && (!p.summary || !p.comprehensiveExam)) {
                return {
                  ...p,
                  summary: exams[p.id],
                  comprehensiveExam: exams[p.id],
                };
              }
              return p;
            })
          );
        })
        .catch((err) => {
          console.error('Deferred course data load error:', err);
        })
        .finally(() => {
          if (!isCancelled) {
            preloadAllCourseParts();
          }
        });
    };

    if (typeof window === 'undefined') return;

    if ('requestIdleCallback' in window) {
      const idleHandle = (window as unknown as { requestIdleCallback: (cb: () => void, opts: { timeout: number }) => number })
        .requestIdleCallback(executeDeferredLoading, { timeout: 2500 });
      return () => {
        isCancelled = true;
        if ('cancelIdleCallback' in window) {
          (window as unknown as { cancelIdleCallback: (id: number) => void }).cancelIdleCallback(idleHandle);
        }
      };
    } else {
      const timer = setTimeout(executeDeferredLoading, 1000);
      return () => {
        isCancelled = true;
        clearTimeout(timer);
      };
    }
  }, []);

  const isStaffRole = role === 'master' || role === 'admin' || role === 'teacher';

  const [currentView, setCurrentView] = useState<ViewMode>(() => {
    try {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (['dashboard', 'reader', 'playground', 'bughunter', 'challenges', 'admin'].includes(hash)) {
        if (hash === 'admin' || (hash !== 'dashboard' && ['reader', 'playground', 'bughunter', 'challenges'].includes(hash))) {
          return hash as ViewMode;
        }
        if (hash === 'dashboard' && !isStaffRole) {
          return 'dashboard';
        }
      }
      const saved = localStorage.getItem(`codemasr_active_view_${codeKey}`);
      if (saved && ['dashboard', 'reader', 'playground', 'bughunter', 'challenges', 'admin'].includes(saved)) {
        if (isStaffRole) {
          if (saved === 'dashboard') return 'admin';
          return saved as ViewMode;
        }
        return saved as ViewMode;
      }
    } catch {}
    return isStaffRole ? 'admin' : 'dashboard';
  });

  const [selectedChapterId, setSelectedChapterId] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(`codemasr_active_chapter_${codeKey}`);
      if (saved && !isNaN(Number(saved)) && Number(saved) >= 1) {
        return Number(saved);
      }
    } catch {}
    return 1;
  });

  const [selectedPartExamId, setSelectedPartExamId] = useState<number | null>(() => {
    try {
      const saved = localStorage.getItem(`codemasr_part_exam_${codeKey}`);
      return saved ? Number(saved) : null;
    } catch {
      return null;
    }
  });

  // Dynamically load the full detailed lessons for the active part on demand
  useEffect(() => {
    if (!partsList.length) return;

    // Find which part the selectedChapter belongs to
    const targetPart = partsList.find((p) => p.chapters.some((c) => c.id === selectedChapterId));
    if (!targetPart) return;

    // Check if the chapter already has full contentSections loaded
    const targetChapter = targetPart.chapters.find((c) => c.id === selectedChapterId);
    if (targetChapter && targetChapter.contentSections && targetChapter.contentSections.length > 0) {
      return; // Already loaded!
    }

    let isCancelled = false;

    import('./data/bookData').then(({ loadPartDetails }) => {
      return loadPartDetails(targetPart.id);
    }).then((fullPart) => {
      if (isCancelled) return;
      setPartsList((prevParts) =>
        prevParts.map((p) => (p.id === fullPart.id ? fullPart : p))
      );
    }).catch((err) => {
      console.error('Failed to load part details:', err);
    });

    return () => {
      isCancelled = true;
    };
  }, [selectedChapterId, partsList]);

  // Also dynamically load full part if part summary/exam is selected
  useEffect(() => {
    if (!partsList.length || !selectedPartExamId) return;
    const targetPart = partsList.find((p) => p.id === selectedPartExamId);
    if (!targetPart) return;

    let isCancelled = false;

    // Ensure exams data is loaded immediately if student navigates to exam
    if (!targetPart.summary || !targetPart.comprehensiveExam) {
      loadPartExamsData().then((exams) => {
        if (isCancelled) return;
        if (exams[selectedPartExamId]) {
          setPartsList((prevParts) =>
            prevParts.map((p) =>
              p.id === selectedPartExamId
                ? {
                    ...p,
                    summary: exams[selectedPartExamId],
                    comprehensiveExam: exams[selectedPartExamId],
                  }
                : p
            )
          );
        }
      }).catch(() => {});
    }

    const firstCh = targetPart.chapters[0];
    if (firstCh && firstCh.contentSections && firstCh.contentSections.length > 0) {
      return;
    }

    import('./data/bookData').then(({ loadPartDetails }) => {
      return loadPartDetails(targetPart.id);
    }).then((fullPart) => {
      if (isCancelled) return;
      setPartsList((prevParts) =>
        prevParts.map((p) => (p.id === fullPart.id ? fullPart : p))
      );
    }).catch((err) => {
      console.error('Failed to load exam part details:', err);
    });

    return () => {
      isCancelled = true;
    };
  }, [selectedPartExamId, partsList]);

  const [playgroundCode, setPlaygroundCode] = useState<string>('');

  const [selectedBugHunterPartId, setSelectedBugHunterPartId] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(`codemasr_bughunter_part_${codeKey}`);
      return saved ? Number(saved) : 1;
    } catch {
      return 1;
    }
  });

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isMobileSidebarOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsMobileSidebarOpen(false);
    };
    window.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isMobileSidebarOpen]);

  // New Modals States
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  // Per-item timestamps let multiple devices merge edits and removals safely.
  const [progressEntries, setProgressEntries] = useState(() => readLocalProgressEntries(codeKey));

  // Memoize progress selectors to prevent 7 new object/array allocations and child re-renders on every update
  const completedChapterIds = useMemo(
    () => getTrueProgressIds(progressEntries, 'completedChapter').map(Number),
    [progressEntries]
  );
  const completedQuizIds = useMemo(
    () => getTrueProgressIds(progressEntries, 'completedQuiz').map(String),
    [progressEntries]
  );
  const completedExamPartIds = useMemo(
    () => getTrueProgressIds(progressEntries, 'completedExam').map(Number),
    [progressEntries]
  );
  const completedChallengeIds = useMemo(
    () => getTrueProgressIds(progressEntries, 'completedChallenge').map(String),
    [progressEntries]
  );
  const bookmarkedChapterIds = useMemo(
    () => getTrueProgressIds(progressEntries, 'bookmarkedChapter').map(Number),
    [progressEntries]
  );
  const chapterNotes = useMemo(
    () => getStringProgressMap(progressEntries, 'chapterNote'),
    [progressEntries]
  );
  const challengeCodes = useMemo(
    () => getStringProgressMap(progressEntries, 'chapterChallengeCode'),
    [progressEntries]
  );

  // Guard to prevent saving to server before initial fetch finishes
  const [isInitialLoadDone, setIsInitialLoadDone] = useState(false);

  // On mount for this code, fetch from the server
  useEffect(() => {
    let isSubscribed = true;

    fetchCodeProgress(codeKey).then((prog) => {
      if (!isSubscribed) return;

      if (prog) {
        const hasVersionedEntries = Boolean(prog.stateEntries && Object.keys(prog.stateEntries).length);
        const remoteEntries = hasVersionedEntries
          ? prog.stateEntries!
          : progressEntriesFromLegacy(prog as unknown as Record<string, unknown>);
        setProgressEntries((local) => mergeProgressEntries(local, remoteEntries, hasVersionedEntries));
        if (prog.lastChapterId && !localStorage.getItem(`codemasr_active_chapter_${codeKey}`)) {
          setSelectedChapterId(prog.lastChapterId);
        }
      }
      setIsInitialLoadDone(true);
    });

    return () => {
      isSubscribed = false;
    };
  }, [codeKey]);

  useEffect(() => {
    const handleLocalProgressEntry = (event: Event) => {
      const detail = (event as CustomEvent<{
        codeKey?: string;
        key?: string;
        entry?: { value: boolean | string; updatedAt: number };
      }>).detail;
      if (detail?.codeKey !== codeKey || !detail.key || !detail.entry) return;
      setProgressEntries((current) => mergeProgressEntries(
        current,
        { [detail.key!]: detail.entry! },
        true,
      ));
    };
    window.addEventListener('codemasr:progress-entry', handleLocalProgressEntry);
    return () => window.removeEventListener('codemasr:progress-entry', handleLocalProgressEntry);
  }, [codeKey]);

  // Global Keyboard Shortcut: Ctrl+K or Cmd+K for Global Search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Sync active view and URL hash
  useEffect(() => {
    try {
      localStorage.setItem(`codemasr_active_view_${codeKey}`, currentView);
      if (window.location.hash !== `#${currentView}`) {
        window.history.replaceState(null, '', `#${currentView}`);
      }
    } catch {}
  }, [currentView, codeKey]);

  // Sync selected chapter to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`codemasr_active_chapter_${codeKey}`, String(selectedChapterId));
    } catch {}
  }, [selectedChapterId, codeKey]);

  // Sync exam and bug hunter selection
  useEffect(() => {
    try {
      if (selectedPartExamId) {
        localStorage.setItem(`codemasr_part_exam_${codeKey}`, String(selectedPartExamId));
      } else {
        localStorage.removeItem(`codemasr_part_exam_${codeKey}`);
      }
    } catch {}
  }, [selectedPartExamId, codeKey]);

  useEffect(() => {
    try {
      localStorage.setItem(`codemasr_bughunter_part_${codeKey}`, String(selectedBugHunterPartId));
    } catch {}
  }, [selectedBugHunterPartId, codeKey]);

  // First-use Onboarding check: Auto-open if 0 completed chapters and not yet dismissed
  useEffect(() => {
    try {
      const shown = localStorage.getItem(`codemasr_onboarding_shown_${codeKey}`);
      if (!shown && completedChapterIds.length === 0) {
        setIsOnboardingOpen(true);
      }
    } catch {}
  }, [codeKey, completedChapterIds.length]);

  const handleDismissOnboarding = () => {
    setIsOnboardingOpen(false);
    try {
      localStorage.setItem(`codemasr_onboarding_shown_${codeKey}`, 'true');
    } catch {}
  };

  // Listen to browser Back/Forward hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (['dashboard', 'reader', 'playground', 'bughunter', 'challenges', 'admin'].includes(hash)) {
        setCurrentView(hash as ViewMode);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Active session monitoring to instantly kick revoked sessions
  useEffect(() => {
    let isCancelled = false;
    const checkSession = async () => {
      const state = await validateSavedSession();
      if (isCancelled) return;
      if (!state.activated) {
        onLockPlatform();
      }
    };

    const interval = setInterval(checkSession, 30000);
    const onFocus = () => void checkSession();
    const onRevokedEvent = () => onLockPlatform();

    window.addEventListener('focus', onFocus);
    window.addEventListener('codemasr:session-revoked', onRevokedEvent);

    return () => {
      isCancelled = true;
      clearInterval(interval);
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('codemasr:session-revoked', onRevokedEvent);
    };
  }, [onLockPlatform]);

  // Sync to Cloud whenever progress changes, ONLY after initial load is complete
  useEffect(() => {
    if (!isInitialLoadDone) return;
    saveLocalProgressEntries(codeKey, progressEntries);

    // Keep local changes immediate, but coalesce rapid actions into one cloud write.
    const timer = window.setTimeout(() => {
      void syncCodeProgress(codeKey, {
        lastChapterId: selectedChapterId,
        stateEntries: progressEntries,
      });
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [progressEntries, isInitialLoadDone, codeKey, selectedChapterId]);

  // Helper to find all chapters flat (memoized)
  const allChapters = useMemo(() => partsList.flatMap((p) => p.chapters), [partsList]);
  const currentChapter = useMemo(
    () => allChapters.find((c) => c.id === selectedChapterId) || allChapters[0],
    [allChapters, selectedChapterId]
  );

  const selectedPart = useMemo(
    () => (selectedPartExamId ? partsList.find((p) => p.id === selectedPartExamId) : null),
    [partsList, selectedPartExamId]
  );

  const isLastChapterInPart = useCallback(
    (chapter: Chapter) => {
      const part = partsList.find((p) => p.id === chapter.partId);
      if (!part) return false;
      const lastCh = part.chapters[part.chapters.length - 1];
      return lastCh?.id === chapter.id;
    },
    [partsList]
  );

  const handleNextChapter = useCallback(() => {
    const currentIndex = allChapters.findIndex((c) => c.id === selectedChapterId);
    if (currentIndex < allChapters.length - 1) {
      setSelectedChapterId(allChapters[currentIndex + 1].id);
      setSelectedPartExamId(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [allChapters, selectedChapterId]);

  const handlePrevChapter = useCallback(() => {
    const currentIndex = allChapters.findIndex((c) => c.id === selectedChapterId);
    if (currentIndex > 0) {
      setSelectedChapterId(allChapters[currentIndex - 1].id);
      setSelectedPartExamId(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [allChapters, selectedChapterId]);

  const toggleChapterCompleted = useCallback(
    (chapterId: number) => {
      const isNowCompleted = !completedChapterIds.includes(chapterId);
      if (isNowCompleted) {
        soundManager.playSuccess();
      }
      setProgressEntries((prev) => updateProgressEntry(prev, `completedChapter:${chapterId}`, isNowCompleted));
    },
    [completedChapterIds]
  );

  const toggleExamPartCompleted = useCallback(
    (partId: number) => {
      const isNowCompleted = !completedExamPartIds.includes(partId);
      if (isNowCompleted) {
        soundManager.playSuccess();
      }
      setProgressEntries((prev) => updateProgressEntry(prev, `completedExam:${partId}`, isNowCompleted));
    },
    [completedExamPartIds]
  );

  const toggleBookmark = useCallback(
    (chapterId: number) => {
      const isNowBookmarked = !bookmarkedChapterIds.includes(chapterId);
      if (isNowBookmarked) {
        soundManager.playBookmark();
      } else {
        soundManager.playClick();
      }
      setProgressEntries((prev) => updateProgressEntry(prev, `bookmarkedChapter:${chapterId}`, isNowBookmarked));
    },
    [bookmarkedChapterIds]
  );

  const handleSaveNote = useCallback((chapterId: number, note: string) => {
    soundManager.playSuccess();
    setProgressEntries((prev) => updateProgressEntry(prev, `chapterNote:${chapterId}`, note));
  }, []);

  const handleOpenPlaygroundWithCode = useCallback((code: string) => {
    soundManager.playClick();
    setPlaygroundCode(code);
    setCurrentView('playground');
  }, []);

  const handleSelectBugHunterFromPart = useCallback((partId: number) => {
    soundManager.playClick();
    setSelectedBugHunterPartId(partId);
    setCurrentView('bughunter');
  }, []);

  const handleSelectPartExam = useCallback((partId: number) => {
    soundManager.playClick();
    setCurrentView('reader');
    setSelectedPartExamId(partId);
    setIsMobileSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const toggleQuizCompleted = useCallback(
    (quizId: string) => {
      const isNowCompleted = !completedQuizIds.includes(quizId);
      if (isNowCompleted) {
        soundManager.playSuccess();
      }
      setProgressEntries((prev) => updateProgressEntry(prev, `completedQuiz:${quizId}`, isNowCompleted));
    },
    [completedQuizIds]
  );

  const handleUpdateChallengeCode = useCallback((chapterId: number, code: string) => {
    setProgressEntries((prev) => updateProgressEntry(prev, `chapterChallengeCode:${chapterId}`, code));
  }, []);

  // Calculate Student Achievements Stats (memoized)
  const studentStats: StudentStats = useMemo(
    () => ({
      completedChaptersCount: completedChapterIds.length,
      completedQuizzesCount: completedQuizIds.length,
      completedExamPartsCount: completedExamPartIds.length,
      savedSnippetsCount: 1,
      notesCount: Object.values(chapterNotes).filter((n) => n.trim().length > 0).length,
      bookmarkedCount: bookmarkedChapterIds.length,
    }),
    [
      completedChapterIds.length,
      completedQuizIds.length,
      completedExamPartIds.length,
      chapterNotes,
      bookmarkedChapterIds.length,
    ]
  );

  const unlockedBadgesCount = useMemo(
    () => ALL_BADGES.filter((b) => b.isUnlocked(studentStats)).length,
    [studentStats]
  );

  // Level-Up Audio Detection: play triumphant levelUp fanfare when new badge is unlocked
  const prevBadgesCountRef = useRef<number | null>(null);
  useEffect(() => {
    if (!isInitialLoadDone) return;
    if (prevBadgesCountRef.current !== null && unlockedBadgesCount > prevBadgesCountRef.current) {
      soundManager.playLevelUp();
    }
    prevBadgesCountRef.current = unlockedBadgesCount;
  }, [unlockedBadgesCount, isInitialLoadDone]);

  // Memoized derived stats for Header and StudentDashboard
  const totalCompletedCount = useMemo(
    () => completedChapterIds.length + completedExamPartIds.length,
    [completedChapterIds.length, completedExamPartIds.length]
  );
  const totalItemsCount = useMemo(
    () => allChapters.length + partsList.length,
    [allChapters.length, partsList.length]
  );
  const totalQuizzesCount = useMemo(() => partsList.length, [partsList.length]);

  // Stabilized View Navigation and Modal Callbacks
  const handleSelectView = useCallback((view: ViewMode) => {
    soundManager.playClick();
    setCurrentView(view);
    setIsMobileSidebarOpen(false);
  }, []);

  const handleOpenSearch = useCallback(() => {
    soundManager.playClick();
    setIsSearchOpen(true);
  }, []);

  const handleOpenAchievements = useCallback(() => {
    soundManager.playBadge();
    setIsAchievementsOpen(true);
  }, []);

  const handleOpenOnboarding = useCallback(() => {
    soundManager.playClick();
    setIsOnboardingOpen(true);
  }, []);

  const handleToggleMobileSidebar = useCallback(() => {
    setIsMobileSidebarOpen((prev) => !prev);
  }, []);

  const handleCloseMobileSidebar = useCallback(() => {
    setIsMobileSidebarOpen(false);
  }, []);

  // Stabilized Chapter Navigation Callbacks
  const handleSelectChapterFromSidebar = useCallback((ch: Chapter) => {
    setSelectedChapterId(ch.id);
    setSelectedPartExamId(null);
    setIsMobileSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleSelectBugHunterFromMobile = useCallback((partId: number) => {
    handleSelectBugHunterFromPart(partId);
    setIsMobileSidebarOpen(false);
  }, [handleSelectBugHunterFromPart]);

  const handleSelectChapterFromDashboard = useCallback((chId: number) => {
    setSelectedChapterId(chId);
    setSelectedPartExamId(null);
    setCurrentView('reader');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleSelectViewFromDashboard = useCallback((v: ViewMode) => {
    setCurrentView(v);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Stabilized ChapterView callbacks
  const handleToggleCurrentChapterCompleted = useCallback(() => {
    toggleChapterCompleted(currentChapter.id);
  }, [toggleChapterCompleted, currentChapter.id]);

  const handleToggleCurrentChapterBookmark = useCallback(() => {
    toggleBookmark(currentChapter.id);
  }, [toggleBookmark, currentChapter.id]);

  const handleUpdateCurrentChapterChallengeCode = useCallback((code: string) => {
    handleUpdateChallengeCode(currentChapter.id, code);
  }, [handleUpdateChallengeCode, currentChapter.id]);

  const handleSaveCurrentChapterNote = useCallback((note: string) => {
    handleSaveNote(currentChapter.id, note);
  }, [handleSaveNote, currentChapter.id]);

  const handleCompleteCurrentChapterQuiz = useCallback((chId: number) => {
    toggleQuizCompleted(chId.toString());
  }, [toggleQuizCompleted]);

  // Stabilized PartSummaryView callbacks
  const handleToggleCurrentExamCompleted = useCallback(() => {
    if (selectedPart) toggleExamPartCompleted(selectedPart.id);
  }, [toggleExamPartCompleted, selectedPart]);

  const handlePrevChapterFromExam = useCallback(() => {
    if (!selectedPart) return;
    const lastCh = selectedPart.chapters[selectedPart.chapters.length - 1];
    if (lastCh) {
      setSelectedChapterId(lastCh.id);
      setSelectedPartExamId(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [selectedPart]);

  const handleNextPartFromExam = useCallback(() => {
    if (!selectedPart) return;
    const nextPart = partsList.find((p) => p.id === selectedPart.id + 1);
    if (nextPart && nextPart.chapters[0]) {
      setSelectedChapterId(nextPart.chapters[0].id);
      setSelectedPartExamId(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [selectedPart, partsList]);

  // Stabilized ChallengesList Callbacks
  const handleOpenChapterFromChallenges = useCallback((chId: number) => {
    setSelectedChapterId(chId);
    setSelectedPartExamId(null);
    setCurrentView('reader');
  }, []);

  const handleOpenPlaygroundFromChallenges = useCallback(() => {
    setCurrentView('playground');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Cairo',sans-serif] overflow-x-clip">
      {/* Top Header */}
      <Header
        currentView={currentView}
        onSelectView={handleSelectView}
        completedChaptersCount={totalCompletedCount}
        totalChaptersCount={totalItemsCount}
        completedQuizzesCount={completedQuizIds.length}
        totalQuizzesCount={totalQuizzesCount}
        role={role}
        activeCode={activeCode}
        studentName={studentName}
        onLockPlatform={onLockPlatform}
        onOpenSearch={handleOpenSearch}
        onOpenAchievements={handleOpenAchievements}
        onOpenOnboarding={handleOpenOnboarding}
        unlockedBadgesCount={unlockedBadgesCount}
      />

      {/* Mobile Drawer Toggle (Only in Reader Mode - Styled like Figma) */}
      {currentView === 'reader' && (
        <div className="lg:hidden bg-slate-950/95 backdrop-blur-md border-b border-slate-800/80 px-4 py-2.5 flex items-center justify-between gap-3 min-w-0 min-h-[56px] sticky top-0 z-40">
          <span className="min-w-0 truncate text-xs sm:text-sm text-slate-300 font-bold text-right">
            {selectedPartExamId ? `ملخص الجزء ${selectedPartExamId}` : currentChapter.title}
          </span>
          <button
            type="button"
            onClick={handleToggleMobileSidebar}
            aria-expanded={isMobileSidebarOpen}
            aria-controls="mobile-content-drawer"
            className="min-h-[40px] shrink-0 flex items-center gap-2 text-xs sm:text-sm font-black text-slate-950 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 active:scale-95 px-4 py-2 rounded-xl transition-all shadow-md shadow-amber-500/20 touch-manipulation"
          >
            {isMobileSidebarOpen ? <X className="w-4 h-4 stroke-[2.5]" /> : <Menu className="w-4 h-4 stroke-[2.5]" />}
            <span>الفهرس</span>
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:flex-row pb-[calc(4.5rem+env(safe-area-inset-bottom))] sm:pb-[calc(5rem+env(safe-area-inset-bottom))] lg:pb-0">
        {/* Sidebar in Reader Mode */}
        {currentView === 'reader' && (
          <>
            {/* Desktop Sidebar */}
            <div className="hidden lg:block shrink-0">
              <Sidebar
                parts={partsList}
                selectedChapterId={selectedPartExamId ? -1 : currentChapter.id}
                onSelectChapter={handleSelectChapterFromSidebar}
                onSelectBugHunter={handleSelectBugHunterFromPart}
                completedChapterIds={completedChapterIds}
                onToggleChapterCompleted={toggleChapterCompleted}
                completedQuizIds={completedQuizIds}
                onSelectPartExam={handleSelectPartExam}
                selectedPartExamId={selectedPartExamId}
                completedExamIds={completedExamPartIds}
                bookmarkedChapterIds={bookmarkedChapterIds}
                notesMap={chapterNotes}
              />
            </div>

            {/* Mobile Sidebar Modal/Overlay */}
            {isMobileSidebarOpen && (
              <div className="fixed inset-0 z-50 lg:hidden flex">
                <button
                  type="button"
                  aria-label="إغلاق فهرس المحتوى"
                  className="fixed inset-0 bg-black/70 backdrop-blur-sm"
                  onClick={handleCloseMobileSidebar}
                />
                <div id="mobile-content-drawer" role="dialog" aria-modal="true" aria-label="فهرس المحتوى" className="relative z-10 w-80 max-w-[85%] bg-slate-950 h-full flex flex-col border-l border-slate-800">
                  <div className="p-3.5 border-b border-slate-800 flex items-center justify-between min-h-[56px]">
                    <span className="font-bold text-amber-400 text-sm">فهرس المحتوى</span>
                    <button
                      type="button"
                      onClick={handleCloseMobileSidebar}
                      aria-label="إغلاق الفهرس"
                      className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 active:scale-90 transition touch-manipulation"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    <Sidebar
                      parts={partsList}
                      selectedChapterId={selectedPartExamId ? -1 : currentChapter.id}
                      onSelectChapter={handleSelectChapterFromSidebar}
                      onSelectBugHunter={handleSelectBugHunterFromMobile}
                      completedChapterIds={completedChapterIds}
                      onToggleChapterCompleted={toggleChapterCompleted}
                      completedQuizIds={completedQuizIds}
                      onSelectPartExam={handleSelectPartExam}
                      selectedPartExamId={selectedPartExamId}
                      completedExamIds={completedExamPartIds}
                      bookmarkedChapterIds={bookmarkedChapterIds}
                      notesMap={chapterNotes}
                    />
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Dynamic Views */}
        <main className="flex-1 min-w-0 bg-slate-950">
          {currentView === 'dashboard' && (
            <StudentDashboard
              role={role}
              studentName={studentName}
              parts={partsList}
              completedChapterIds={completedChapterIds}
              completedQuizIds={completedQuizIds}
              completedChallengeIds={completedChallengeIds}
              completedExamPartIds={completedExamPartIds}
              unlockedBadgesCount={unlockedBadgesCount}
              bookmarkedCount={bookmarkedChapterIds.length}
              notesCount={studentStats.notesCount}
              currentChapterId={selectedChapterId}
              onSelectChapter={handleSelectChapterFromDashboard}
              onSelectView={handleSelectViewFromDashboard}
              onOpenAchievements={handleOpenAchievements}
              onOpenOnboarding={handleOpenOnboarding}
            />
          )}

          {currentView === 'reader' && (
            selectedPartExamId && (selectedPart?.summary || selectedPart?.comprehensiveExam) ? (
              <PartSummaryView
                part={selectedPart}
                summary={selectedPart.summary || selectedPart.comprehensiveExam!}
                isCompleted={completedExamPartIds.includes(selectedPart.id)}
                onToggleCompleted={handleToggleCurrentExamCompleted}
                onOpenInPlayground={handleOpenPlaygroundWithCode}
                onPrevChapter={handlePrevChapterFromExam}
                onNextPart={handleNextPartFromExam}
              />
            ) : (
              <ChapterView
                chapter={currentChapter}
                onNextChapter={handleNextChapter}
                onPrevChapter={handlePrevChapter}
                isCompleted={completedChapterIds.includes(currentChapter.id)}
                onToggleCompleted={handleToggleCurrentChapterCompleted}
                onOpenInPlayground={handleOpenPlaygroundWithCode}
                savedChallengeCode={challengeCodes[currentChapter.id.toString()]}
                onUpdateChallengeCode={handleUpdateCurrentChapterChallengeCode}
                onOpenPartExam={handleSelectPartExam}
                isLastChapterInPart={isLastChapterInPart(currentChapter)}
                isBookmarked={bookmarkedChapterIds.includes(currentChapter.id)}
                onToggleBookmark={handleToggleCurrentChapterBookmark}
                userNote={chapterNotes[currentChapter.id.toString()] || ''}
                onSaveUserNote={handleSaveCurrentChapterNote}
                onCompleteQuiz={handleCompleteCurrentChapterQuiz}
              />
            )
          )}

          {(currentView === 'playground' ||
            currentView === 'bughunter' ||
            currentView === 'challenges' ||
            currentView === 'admin') && (
            <Suspense fallback={<ViewLoadingState />}>
              {currentView === 'playground' && (
                <CodePlayground
                  initialCode={playgroundCode || undefined}
                  activeCode={activeCode}
                  studentName={studentName}
                />
              )}

              {currentView === 'bughunter' && (
                <BugHunter
                  parts={partsList}
                  initialPartId={selectedBugHunterPartId}
                  completedQuizIds={completedQuizIds}
                  onToggleQuizCompleted={toggleQuizCompleted}
                />
              )}

              {currentView === 'challenges' && (
                <ChallengesList
                  key={`challenges-${codeKey}`}
                  parts={partsList}
                  activeCode={activeCode}
                  onOpenChapter={handleOpenChapterFromChallenges}
                  onOpenPlayground={handleOpenPlaygroundFromChallenges}
                />
              )}

              {currentView === 'admin' && (
                <AdminDashboard
                  key={`admin-dash-${codeKey}`}
                  activeCode={activeCode}
                  role={role}
                  studentName={studentName}
                  onSelectView={setCurrentView}
                />
              )}
            </Suspense>
          )}
        </main>
      </div>

      {/* Feature 6: Mobile Bottom Navigation Bar (5 primary items max) */}
      <MobileBottomNav
        currentView={currentView}
        role={role}
        studentName={studentName}
        onSelectView={handleSelectView}
        onOpenSearch={handleOpenSearch}
        onOpenAchievements={handleOpenAchievements}
        onOpenOnboarding={handleOpenOnboarding}
        onLockPlatform={onLockPlatform}
        unlockedBadgesCount={unlockedBadgesCount}
      />

      {/* Feature 2: Global Search Modal */}
      <Suspense fallback={null}>
        <GlobalSearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          parts={partsList}
          onSelectChapter={(chId) => {
            setSelectedChapterId(chId);
            setSelectedPartExamId(null);
            setCurrentView('reader');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onSelectPartSummary={(pId) => {
            setSelectedPartExamId(pId);
            setCurrentView('reader');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      </Suspense>

      {/* Feature 3: Achievements Modal */}
      <Suspense fallback={null}>
        <AchievementsModal
          isOpen={isAchievementsOpen}
          onClose={() => setIsAchievementsOpen(false)}
          stats={studentStats}
          studentName={studentName}
        />
      </Suspense>

      {/* Feature 4: First-use Onboarding Modal */}
      <Suspense fallback={null}>
        <OnboardingModal
          isOpen={isOnboardingOpen}
          studentName={studentName}
          onClose={handleDismissOnboarding}
          onStartFirstLesson={() => {
            handleDismissOnboarding();
            setSelectedChapterId(1);
            setSelectedPartExamId(null);
            setCurrentView('reader');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      </Suspense>

      {/* Feature 5: Real-time Offline & Sync Indicator */}
      <OfflineStatusIndicator />
    </div>
  );
}
