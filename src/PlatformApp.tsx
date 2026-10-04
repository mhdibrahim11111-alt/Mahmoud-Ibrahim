import React, { lazy, Suspense, useState, useEffect } from 'react';
import type { ViewMode, Chapter, Part } from './types';
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

const Sidebar = lazy(() => import('./components/Sidebar').then((module) => ({ default: module.Sidebar })));
const ChapterView = lazy(() => import('./components/ChapterView').then((module) => ({ default: module.ChapterView })));
const PartSummaryView = lazy(() => import('./components/PartSummaryView').then((module) => ({ default: module.PartSummaryView })));
const CodePlayground = lazy(() => import('./components/CodePlayground').then((module) => ({ default: module.CodePlayground })));
const BugHunter = lazy(() => import('./components/BugHunter').then((module) => ({ default: module.BugHunter })));
const ChallengesList = lazy(() => import('./components/ChallengesList').then((module) => ({ default: module.ChallengesList })));
const GlobalSearchModal = lazy(() => import('./components/GlobalSearchModal').then((module) => ({ default: module.GlobalSearchModal })));
const AchievementsModal = lazy(() => import('./components/AchievementsModal').then((module) => ({ default: module.AchievementsModal })));

function ViewLoadingState() {
  return (
    <div role="status" aria-live="polite" className="min-h-48 flex items-center justify-center gap-3 text-sm text-slate-300">
      <span aria-hidden="true" className="w-5 h-5 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
      <span>جارٍ تحميل المحتوى…</span>
    </div>
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

  const [bookParts, setBookParts] = useState<Part[]>([]);
  const [bookLoadFailed, setBookLoadFailed] = useState(false);

  useEffect(() => {
    let isSubscribed = true;
    import('./data/bookData').then(({ bookParts: loadedParts }) => {
      if (isSubscribed) setBookParts(loadedParts);
    }).catch((error) => {
      console.error('Failed to load course content:', error);
      if (isSubscribed) setBookLoadFailed(true);
    });
    return () => { isSubscribed = false; };
  }, []);

  const [currentView, setCurrentView] = useState<ViewMode>(() => {
    try {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (['reader', 'playground', 'bughunter', 'challenges'].includes(hash)) {
        return hash as ViewMode;
      }
      const saved = localStorage.getItem(`codemasr_active_view_${codeKey}`);
      if (saved && ['reader', 'playground', 'bughunter', 'challenges'].includes(saved)) {
        return saved as ViewMode;
      }
    } catch {}
    return 'reader';
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

  // New Modals States
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);

  // Per-item timestamps let multiple devices merge edits and removals safely.
  const [progressEntries, setProgressEntries] = useState(() => readLocalProgressEntries(codeKey));
  const completedChapterIds = getTrueProgressIds(progressEntries, 'completedChapter').map(Number);
  const completedQuizIds = getTrueProgressIds(progressEntries, 'completedQuiz').map(String);
  const completedExamPartIds = getTrueProgressIds(progressEntries, 'completedExam').map(Number);
  const bookmarkedChapterIds = getTrueProgressIds(progressEntries, 'bookmarkedChapter').map(Number);
  const chapterNotes = getStringProgressMap(progressEntries, 'chapterNote');
  const challengeCodes = getStringProgressMap(progressEntries, 'chapterChallengeCode');

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

  // Listen to browser Back/Forward hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (['reader', 'playground', 'bughunter', 'challenges'].includes(hash)) {
        setCurrentView(hash as ViewMode);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

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

  // Helper to find all chapters flat
  const allChapters = bookParts.flatMap((p) => p.chapters);
  const currentChapter =
    allChapters.find((c) => c.id === selectedChapterId) || allChapters[0];

  const selectedPart = selectedPartExamId
    ? bookParts.find((p) => p.id === selectedPartExamId)
    : null;

  const isLastChapterInPart = (chapter: Chapter) => {
    const part = bookParts.find((p) => p.id === chapter.partId);
    if (!part) return false;
    const lastCh = part.chapters[part.chapters.length - 1];
    return lastCh?.id === chapter.id;
  };

  const handleNextChapter = () => {
    const currentIndex = allChapters.findIndex((c) => c.id === selectedChapterId);
    if (currentIndex < allChapters.length - 1) {
      setSelectedChapterId(allChapters[currentIndex + 1].id);
      setSelectedPartExamId(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevChapter = () => {
    const currentIndex = allChapters.findIndex((c) => c.id === selectedChapterId);
    if (currentIndex > 0) {
      setSelectedChapterId(allChapters[currentIndex - 1].id);
      setSelectedPartExamId(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const toggleChapterCompleted = (chapterId: number) => {
    setProgressEntries((prev) => updateProgressEntry(prev, `completedChapter:${chapterId}`, !completedChapterIds.includes(chapterId)));
  };

  const toggleExamPartCompleted = (partId: number) => {
    setProgressEntries((prev) => updateProgressEntry(prev, `completedExam:${partId}`, !completedExamPartIds.includes(partId)));
  };

  const toggleBookmark = (chapterId: number) => {
    setProgressEntries((prev) => updateProgressEntry(prev, `bookmarkedChapter:${chapterId}`, !bookmarkedChapterIds.includes(chapterId)));
  };

  const handleSaveNote = (chapterId: number, note: string) => {
    setProgressEntries((prev) => updateProgressEntry(prev, `chapterNote:${chapterId}`, note));
  };

  const handleOpenPlaygroundWithCode = (code: string) => {
    setPlaygroundCode(code);
    setCurrentView('playground');
  };

  const handleSelectBugHunterFromPart = (partId: number) => {
    setSelectedBugHunterPartId(partId);
    setCurrentView('bughunter');
  };

  const handleSelectPartExam = (partId: number) => {
    setCurrentView('reader');
    setSelectedPartExamId(partId);
    setIsMobileSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleQuizCompleted = (quizId: string) => {
    setProgressEntries((prev) => updateProgressEntry(prev, `completedQuiz:${quizId}`, !completedQuizIds.includes(quizId)));
  };

  const handleUpdateChallengeCode = (chapterId: number, code: string) => {
    setProgressEntries((prev) => updateProgressEntry(prev, `chapterChallengeCode:${chapterId}`, code));
  };

  // Calculate Student Achievements Stats
  const studentStats: StudentStats = {
    completedChaptersCount: completedChapterIds.length,
    completedQuizzesCount: completedQuizIds.length,
    completedExamPartsCount: completedExamPartIds.length,
    savedSnippetsCount: 1,
    notesCount: Object.values(chapterNotes).filter((n) => n.trim().length > 0).length,
    bookmarkedCount: bookmarkedChapterIds.length,
  };
  const unlockedBadgesCount = ALL_BADGES.filter((b) => b.isUnlocked(studentStats)).length;

  if (!bookParts.length) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6" dir="rtl">
        <div role={bookLoadFailed ? 'alert' : 'status'} aria-live="polite" className="text-center space-y-3">
          {bookLoadFailed ? (
            <>
              <p className="text-rose-300">تعذر تحميل محتوى المنصة.</p>
              <button type="button" onClick={() => window.location.reload()} className="rounded-lg bg-amber-400 px-4 py-2 font-bold text-slate-950">
                إعادة المحاولة
              </button>
            </>
          ) : (
            <div className="flex items-center justify-center gap-3 text-sm text-slate-300">
              <span aria-hidden="true" className="w-5 h-5 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
              <span>جارٍ تحميل محتوى المنصة…</span>
            </div>
          )}
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Cairo',sans-serif] overflow-x-clip">
      {/* Top Header */}
      <Header
        currentView={currentView}
        onSelectView={(view) => {
          setCurrentView(view);
          setIsMobileSidebarOpen(false);
        }}
        completedChaptersCount={completedChapterIds.length + completedExamPartIds.length}
        totalChaptersCount={allChapters.length + bookParts.length}
        completedQuizzesCount={completedQuizIds.length}
        totalQuizzesCount={bookParts.length}
        role={role}
        activeCode={activeCode}
        studentName={studentName}
        onLockPlatform={onLockPlatform}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAchievements={() => setIsAchievementsOpen(true)}
        unlockedBadgesCount={unlockedBadgesCount}
      />

      {/* Mobile Drawer Toggle (Only in Reader Mode) */}
      {currentView === 'reader' && (
        <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 py-2 flex items-center justify-between">
          <button
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className="flex items-center gap-2 text-xs font-semibold text-amber-400 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700"
          >
            {isMobileSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            <span>فهرس الفصول والأجزاء (25 فصلاً)</span>
          </button>
          <span className="text-xs text-slate-400">
            {selectedPartExamId ? `ملخص الجزء ${selectedPartExamId}` : `الفصل: ${currentChapter.id}`}
          </span>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:flex-row pb-24 sm:pb-28 lg:pb-0">
        {/* Sidebar in Reader Mode */}
        {currentView === 'reader' && (
          <>
            {/* Desktop Sidebar */}
            <div className="hidden lg:block shrink-0">
              <Suspense fallback={<div aria-hidden="true" className="w-72 min-h-screen bg-slate-950" />}>
                <Sidebar
                  parts={bookParts}
                  selectedChapterId={selectedPartExamId ? -1 : currentChapter.id}
                  onSelectChapter={(ch) => {
                    setSelectedChapterId(ch.id);
                    setSelectedPartExamId(null);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
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
              </Suspense>
            </div>

            {/* Mobile Sidebar Modal/Overlay */}
            {isMobileSidebarOpen && (
              <div className="fixed inset-0 z-50 lg:hidden flex">
                <div
                  className="fixed inset-0 bg-black/70 backdrop-blur-sm"
                  onClick={() => setIsMobileSidebarOpen(false)}
                />
                <div className="relative z-10 w-80 max-w-[85%] bg-slate-950 h-full flex flex-col border-l border-slate-800">
                  <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                    <span className="font-bold text-amber-400 text-sm">فهرس المحتوى</span>
                    <button
                      onClick={() => setIsMobileSidebarOpen(false)}
                      className="p-1 rounded-lg text-slate-400 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    <Suspense fallback={<ViewLoadingState />}>
                      <Sidebar
                        parts={bookParts}
                        selectedChapterId={selectedPartExamId ? -1 : currentChapter.id}
                        onSelectChapter={(ch) => {
                          setSelectedChapterId(ch.id);
                          setSelectedPartExamId(null);
                          setIsMobileSidebarOpen(false);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        onSelectBugHunter={(partId) => {
                          handleSelectBugHunterFromPart(partId);
                          setIsMobileSidebarOpen(false);
                        }}
                        completedChapterIds={completedChapterIds}
                        onToggleChapterCompleted={toggleChapterCompleted}
                        completedQuizIds={completedQuizIds}
                        onSelectPartExam={handleSelectPartExam}
                        selectedPartExamId={selectedPartExamId}
                        completedExamIds={completedExamPartIds}
                        bookmarkedChapterIds={bookmarkedChapterIds}
                        notesMap={chapterNotes}
                      />
                    </Suspense>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Dynamic Views */}
        <main className="flex-1 min-w-0 bg-slate-950">
          <Suspense fallback={<ViewLoadingState />}>
          {currentView === 'reader' && (
            selectedPartExamId && (selectedPart?.summary || selectedPart?.comprehensiveExam) ? (
              <PartSummaryView
                part={selectedPart}
                summary={selectedPart.summary || selectedPart.comprehensiveExam!}
                isCompleted={completedExamPartIds.includes(selectedPart.id)}
                onToggleCompleted={() => toggleExamPartCompleted(selectedPart.id)}
                onOpenInPlayground={handleOpenPlaygroundWithCode}
                onPrevChapter={() => {
                  const lastCh = selectedPart.chapters[selectedPart.chapters.length - 1];
                  if (lastCh) {
                    setSelectedChapterId(lastCh.id);
                    setSelectedPartExamId(null);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                onNextPart={() => {
                  const nextPart = bookParts.find((p) => p.id === selectedPart.id + 1);
                  if (nextPart && nextPart.chapters[0]) {
                    setSelectedChapterId(nextPart.chapters[0].id);
                    setSelectedPartExamId(null);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
              />
            ) : (
              <ChapterView
                chapter={currentChapter}
                onNextChapter={handleNextChapter}
                onPrevChapter={handlePrevChapter}
                isCompleted={completedChapterIds.includes(currentChapter.id)}
                onToggleCompleted={() => toggleChapterCompleted(currentChapter.id)}
                onOpenInPlayground={handleOpenPlaygroundWithCode}
                savedChallengeCode={challengeCodes[currentChapter.id.toString()]}
                onUpdateChallengeCode={(code) => handleUpdateChallengeCode(currentChapter.id, code)}
                onOpenPartExam={handleSelectPartExam}
                isLastChapterInPart={isLastChapterInPart(currentChapter)}
                isBookmarked={bookmarkedChapterIds.includes(currentChapter.id)}
                onToggleBookmark={() => toggleBookmark(currentChapter.id)}
                userNote={chapterNotes[currentChapter.id.toString()] || ''}
                onSaveUserNote={(note) => handleSaveNote(currentChapter.id, note)}
              />
            )
          )}

          {currentView === 'playground' && (
            <CodePlayground
              initialCode={playgroundCode || undefined}
              activeCode={activeCode}
              studentName={studentName}
            />
          )}

          {currentView === 'bughunter' && (
            <BugHunter
              parts={bookParts}
              initialPartId={selectedBugHunterPartId}
              completedQuizIds={completedQuizIds}
              onToggleQuizCompleted={toggleQuizCompleted}
            />
          )}

          {currentView === 'challenges' && (
            <ChallengesList
              key={`challenges-${codeKey}`}
              parts={bookParts}
              activeCode={activeCode}
              onOpenChapter={(chId) => {
                setSelectedChapterId(chId);
                setSelectedPartExamId(null);
                setCurrentView('reader');
              }}
              onOpenPlayground={() => {
                setCurrentView('playground');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}
          </Suspense>
        </main>
      </div>

      {/* Feature 6: Mobile Bottom Navigation Bar (4 primary items) */}
      <MobileBottomNav
        currentView={currentView}
        onSelectView={(view) => {
          setCurrentView(view);
          setIsMobileSidebarOpen(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Feature 2: Global Search Modal */}
      <Suspense fallback={null}>
        <GlobalSearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          parts={bookParts}
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
    </div>
  );
}
