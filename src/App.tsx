import React, { useState, useEffect } from 'react';
import { ViewMode, Chapter } from './types';
import { bookParts } from './data/bookData';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ChapterView } from './components/ChapterView';
import { PartSummaryView } from './components/PartSummaryView';
import { CodePlayground } from './components/CodePlayground';
import { BugHunter } from './components/BugHunter';
import { ChallengesList } from './components/ChallengesList';
import { ActivationGate } from './components/ActivationGate';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { AchievementsModal } from './components/AchievementsModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { ALL_BADGES, StudentStats } from './types/achievements';
import {
  isDeviceActivated,
  lockPlatform,
  ActivationState,
  validateSavedSession,
  fetchCodeProgress,
  syncCodeProgress,
} from './utils/activation';
import { Menu, X } from 'lucide-react';

interface PlatformAppProps {
  activeCode: string;
  role: 'admin' | 'student';
  studentName?: string;
  onLockPlatform: () => void;
}

function PlatformApp({ activeCode, role, studentName, onLockPlatform }: PlatformAppProps) {
  const codeKey = activeCode.trim().toUpperCase();

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

  // Initialize strictly for THIS specific code from localStorage or empty []
  const [completedChapterIds, setCompletedChapterIds] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem(`codemasr_progress_chapters_${codeKey}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [completedQuizIds, setCompletedQuizIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(`codemasr_progress_quizzes_${codeKey}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [completedExamPartIds, setCompletedExamPartIds] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem(`codemasr_progress_exams_${codeKey}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [completedChallengeIds, setCompletedChallengeIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(`codemasr_completed_challenges_${codeKey}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Bookmarks
  const [bookmarkedChapterIds, setBookmarkedChapterIds] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem(`codemasr_bookmarks_${codeKey}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Personal Notes per chapter
  const [chapterNotes, setChapterNotes] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem(`codemasr_notes_${codeKey}`);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Student's written solution for each chapter challenge: { "1": "console.log(...)", ... }
  const [challengeCodes, setChallengeCodes] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem(`codemasr_challenges_${codeKey}`);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Guard to prevent saving to server before initial fetch finishes
  const [isInitialLoadDone, setIsInitialLoadDone] = useState(false);

  // On mount for this code, fetch from the server
  useEffect(() => {
    let isSubscribed = true;

    fetchCodeProgress(codeKey).then((prog) => {
      if (!isSubscribed) return;

      if (prog) {
        if (Array.isArray(prog.completedChapters)) {
          setCompletedChapterIds(prog.completedChapters);
          localStorage.setItem(
            `codemasr_progress_chapters_${codeKey}`,
            JSON.stringify(prog.completedChapters)
          );
        }
        if (Array.isArray(prog.completedQuizzes)) {
          setCompletedQuizIds(prog.completedQuizzes);
          localStorage.setItem(
            `codemasr_progress_quizzes_${codeKey}`,
            JSON.stringify(prog.completedQuizzes)
          );
        }
        if (Array.isArray(prog.completedChallenges)) {
          setCompletedChallengeIds((prev) => {
            const merged = Array.from(new Set([...prev, ...prog.completedChallenges!]));
            localStorage.setItem(
              `codemasr_completed_challenges_${codeKey}`,
              JSON.stringify(merged)
            );
            return merged;
          });
        }
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

    localStorage.setItem(
      `codemasr_progress_chapters_${codeKey}`,
      JSON.stringify(completedChapterIds)
    );
    localStorage.setItem(
      `codemasr_progress_quizzes_${codeKey}`,
      JSON.stringify(completedQuizIds)
    );
    localStorage.setItem(
      `codemasr_progress_exams_${codeKey}`,
      JSON.stringify(completedExamPartIds)
    );
    localStorage.setItem(
      `codemasr_completed_challenges_${codeKey}`,
      JSON.stringify(completedChallengeIds)
    );

    // Save to Firestore in background
    syncCodeProgress(codeKey, {
      completedChapters: completedChapterIds,
      completedQuizzes: completedQuizIds,
      completedChallenges: completedChallengeIds,
      lastChapterId: selectedChapterId,
    });
  }, [completedChapterIds, completedQuizIds, completedExamPartIds, completedChallengeIds, isInitialLoadDone, codeKey, selectedChapterId]);

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
    setCompletedChapterIds((prev) =>
      prev.includes(chapterId)
        ? prev.filter((id) => id !== chapterId)
        : [...prev, chapterId]
    );
  };

  const toggleExamPartCompleted = (partId: number) => {
    setCompletedExamPartIds((prev) =>
      prev.includes(partId)
        ? prev.filter((id) => id !== partId)
        : [...prev, partId]
    );
  };

  const toggleBookmark = (chapterId: number) => {
    setBookmarkedChapterIds((prev) => {
      const next = prev.includes(chapterId)
        ? prev.filter((id) => id !== chapterId)
        : [...prev, chapterId];
      try {
        localStorage.setItem(`codemasr_bookmarks_${codeKey}`, JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  const handleSaveNote = (chapterId: number, note: string) => {
    setChapterNotes((prev) => {
      const next = { ...prev, [chapterId.toString()]: note };
      try {
        localStorage.setItem(`codemasr_notes_${codeKey}`, JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
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
    setCompletedQuizIds((prev) =>
      prev.includes(quizId)
        ? prev.filter((id) => id !== quizId)
        : [...prev, quizId]
    );
  };

  const handleUpdateChallengeCode = (chapterId: number, code: string) => {
    setChallengeCodes((prev) => {
      const updated = { ...prev, [chapterId.toString()]: code };
      try {
        localStorage.setItem(`codemasr_challenges_${codeKey}`, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save challenge code locally:', e);
      }
      return updated;
    });
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
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Dynamic Views */}
        <main className="flex-1 min-w-0 bg-slate-950">
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

      {/* Feature 3: Achievements Modal */}
      <AchievementsModal
        isOpen={isAchievementsOpen}
        onClose={() => setIsAchievementsOpen(false)}
        stats={studentStats}
        studentName={studentName}
      />
    </div>
  );
}

export function App() {
  const [activation, setActivation] = useState<ActivationState>(() => isDeviceActivated());

  useEffect(() => {
    validateSavedSession().then((updated) => {
      setActivation(updated);
    });
  }, []);

  const handleActivationSuccess = (code: string, role: 'admin' | 'student', studentName?: string) => {
    setActivation({ activated: true, code, role, studentName });
  };

  const handleLockPlatform = () => {
    lockPlatform();
    setActivation({ activated: false, role: 'student' });
  };

  if (!activation.activated || !activation.code) {
    return <ActivationGate onActivated={handleActivationSuccess} />;
  }

  return (
    <PlatformApp
      activeCode={activation.code}
      role={activation.role || 'student'}
      studentName={activation.studentName}
      onLockPlatform={handleLockPlatform}
    />
  );
}
export default App;
