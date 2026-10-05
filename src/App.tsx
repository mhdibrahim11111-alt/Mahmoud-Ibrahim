import React, { lazy, Suspense, useEffect, useState } from 'react';
import { ActivationGate } from './components/ActivationGate';
import { ErrorBoundary } from './components/ErrorBoundary';
import {
  isDeviceActivated,
  lockPlatform,
  validateSavedSession,
} from './utils/activation';
import type { ActivationState } from './utils/activation';
import { soundManager } from './utils/soundManager';

const PlatformApp = lazy(() => import('./PlatformApp').then((module) => ({ default: module.PlatformApp })));

function AppLoadingState() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center" dir="rtl">
      <div role="status" aria-live="polite" className="flex items-center gap-3 text-sm text-slate-300">
        <span aria-hidden="true" className="w-5 h-5 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
        <span>جارٍ تحميل المنصة…</span>
      </div>
    </main>
  );
}

export function App() {
  const [activation, setActivation] = useState<ActivationState>(() => isDeviceActivated());

  useEffect(() => {
    // Preload sound assets and initialize audio subsystem
    soundManager.preloadSounds();

    let isMounted = true;
    validateSavedSession().then((updated) => {
      if (isMounted) {
        setActivation(updated);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleActivationSuccess = (code: string, role: 'master' | 'admin' | 'teacher' | 'student', studentName?: string) => {
    setActivation({ activated: true, code, role, studentName });
  };

  const handleLockPlatform = () => {
    lockPlatform();
    setActivation({ activated: false, role: 'student' });
  };

  if (!activation.activated || !activation.code) {
    return (
      <ErrorBoundary onReset={() => setActivation(isDeviceActivated())}>
        <ActivationGate onActivated={handleActivationSuccess} />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary onReset={() => setActivation(isDeviceActivated())}>
      <Suspense fallback={<AppLoadingState />}>
        <PlatformApp
          key={`platform-${activation.code}`}
          activeCode={activation.code}
          role={activation.role || 'student'}
          studentName={activation.studentName}
          onLockPlatform={handleLockPlatform}
        />
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
