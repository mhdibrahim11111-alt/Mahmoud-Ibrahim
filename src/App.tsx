import React, { useState, useEffect } from 'react';
import { ViewMode, Chapter } from './types';
import { bookParts } from './data/bookData';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ChapterView } from './components/ChapterView';
import { CodePlayground } from './components/CodePlayground';
import { BugHunter } from './components/BugHunter';
import { ChallengesList } from './components/ChallengesList';
import { ActivationGate } from './components/ActivationGate';
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

  const [currentView, setCurrentView] = useState<ViewMode>('reader');
  const [selectedChapterId, setSelectedChapterId] = useState<number>(1);
  const [playgroundCode, setPlaygroundCode] = useState<string>('');
  const [selectedBugHunterPartId, setSelectedBugHunterPartId] = useState<number>(1);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

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
        if (prog.challengeCodes && typeof prog.challengeCodes === 'object') {
          setChallengeCodes(prog.challengeCodes);
          localStorage.setItem(
            `codemasr_challenges_${codeKey}`,
            JSON.stringify(prog.challengeCodes)
          );
        }
        if (prog.lastChapterId) {
          setSelectedChapterId(prog.lastChapterId);
        }
      }

      setIsInitialLoadDone(true);
    });

    return () => {
      isSubscribed = false;
    };
  }, [codeKey]);

  // Sync back to server ONLY when user makes a change AFTER the initial fetch is done
  useEffect(() => {
    if (!isInitialLoadDone) return;

    try {
      localStorage.setItem(`codemasr_progress_chapters_${codeKey}`, JSON.stringify(completedChapterIds));
      localStorage.setItem(`codemasr_progress_quizzes_${codeKey}`, JSON.stringify(completedQuizIds));
      localStorage.setItem(`codemasr_challenges_${codeKey}`, JSON.stringify(challengeCodes));
    } catch (e) {
      console.error(e);
    }

    syncCodeProgress(codeKey, {
      completedChapters: completedChapterIds,
      completedQuizzes: completedQuizIds,
      lastChapterId: selectedChapterId,
      challengeCodes,
    });
  }, [completedChapterIds, completedQuizIds, selectedChapterId, challengeCodes, codeKey, isInitialLoadDone]);

  const handleUpdateChallengeCode = (chapterId: number, code: string) => {
    setChallengeCodes((prev) => ({
      ...prev,
      [chapterId.toString()]: code,
    }));
  };

  const toggleChapterCompleted = (chapterId: number) => {
    setCompletedChapterIds((prev) =>
      prev.includes(chapterId) ? prev.filter((id) => id !== chapterId) : [...prev, chapterId]
    );
  };

  const toggleQuizCompleted = (quizId: string) => {
    setCompletedQuizIds((prev) =>
      prev.includes(quizId) ? prev.filter((id) => id !== quizId) : [...prev, quizId]
    );
  };

  // Find all chapters flat list
  const allChapters: Chapter[] = bookParts.flatMap((part) => part.chapters);
  const currentChapter = allChapters.find((ch) => ch.id === selectedChapterId) || allChapters[0];

  const handleNextChapter = () => {
    const currentIndex = allChapters.findIndex((ch) => ch.id === currentChapter.id);
    if (currentIndex < allChapters.length - 1) {
      const nextCh = allChapters[currentIndex + 1];
      setSelectedChapterId(nextCh.id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevChapter = () => {
    const currentIndex = allChapters.findIndex((ch) => ch.id === currentChapter.id);
    if (currentIndex > 0) {
      const prevCh = allChapters[currentIndex - 1];
      setSelectedChapterId(prevCh.id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleOpenPlaygroundWithCode = (code: string) => {
    setPlaygroundCode(code);
    setCurrentView('playground');
  };

  const handleSelectBugHunterFromPart = (partId: number) => {
    setSelectedBugHunterPartId(partId);
    setCurrentView('bughunter');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Cairo',sans-serif]">
      {/* Top Header */}
      <Header
        currentView={currentView}
        onSelectView={(view) => {
          setCurrentView(view);
          setIsMobileSidebarOpen(false);
        }}
        completedChaptersCount={completedChapterIds.length}
        totalChaptersCount={allChapters.length}
        completedQuizzesCount={completedQuizIds.length}
        totalQuizzesCount={bookParts.length}
        role={role}
        activeCode={activeCode}
        studentName={studentName}
        onLockPlatform={onLockPlatform}
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
            الفصل الحالي: {currentChapter.id}
          </span>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Sidebar in Reader Mode */}
        {currentView === 'reader' && (
          <>
            {/* Desktop Sidebar */}
            <div className="hidden lg:block shrink-0">
              <Sidebar
                parts={bookParts}
                selectedChapterId={currentChapter.id}
                onSelectChapter={(ch) => {
                  setSelectedChapterId(ch.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onSelectBugHunter={handleSelectBugHunterFromPart}
                completedChapterIds={completedChapterIds}
                onToggleChapterCompleted={toggleChapterCompleted}
                completedQuizIds={completedQuizIds}
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
                      selectedChapterId={currentChapter.id}
                      onSelectChapter={(ch) => {
                        setSelectedChapterId(ch.id);
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
            <ChapterView
              chapter={currentChapter}
              onNextChapter={handleNextChapter}
              onPrevChapter={handlePrevChapter}
              isCompleted={completedChapterIds.includes(currentChapter.id)}
              onToggleCompleted={() => toggleChapterCompleted(currentChapter.id)}
              onOpenInPlayground={handleOpenPlaygroundWithCode}
              savedChallengeCode={challengeCodes[currentChapter.id.toString()]}
              onUpdateChallengeCode={(code) => handleUpdateChallengeCode(currentChapter.id, code)}
            />
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
              parts={bookParts}
              onOpenChapter={(chId) => {
                setSelectedChapterId(chId);
                setCurrentView('reader');
              }}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  const [activationState, setActivationState] = useState<ActivationState>(() =>
    isDeviceActivated()
  );
  const [isCheckingSession, setIsCheckingSession] = useState(() => isDeviceActivated().activated);

  useEffect(() => {
    if (!isDeviceActivated().activated) return;
    let isSubscribed = true;
    validateSavedSession().then((state) => {
      if (!isSubscribed) return;
      setActivationState(state);
      setIsCheckingSession(false);
    });
    return () => {
      isSubscribed = false;
    };
  }, []);

  const handleActivated = (code: string, role: 'admin' | 'student', studentName?: string) => {
    setActivationState({ activated: true, role, code, studentName });
  };

  const handleLockPlatform = () => {
    lockPlatform();
    setActivationState({ activated: false, role: 'student' });
  };

  // If user is not logged in, show the Activation Gate
  if (isCheckingSession) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center font-['Cairo',sans-serif]">
        جاري التحقق من الجلسة...
      </div>
    );
  }

  if (!activationState.activated || !activationState.code) {
    return <ActivationGate onActivated={handleActivated} />;
  }

  // Remount cleanly with key={activationState.code} for complete isolation
  return (
    <PlatformApp
      key={activationState.code}
      activeCode={activationState.code}
      role={activationState.role}
      studentName={activationState.studentName}
      onLockPlatform={handleLockPlatform}
    />
  );
}
