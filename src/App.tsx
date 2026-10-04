import React, { lazy, Suspense, useEffect, useState } from 'react';
import { ActivationGate } from './components/ActivationGate';
import {
  isDeviceActivated,
  lockPlatform,
  validateSavedSession,
} from './utils/activation';
import type { ActivationState } from './utils/activation';

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
    <Suspense fallback={<AppLoadingState />}>
      <PlatformApp
        activeCode={activation.code}
        role={activation.role || 'student'}
        studentName={activation.studentName}
        onLockPlatform={handleLockPlatform}
      />
    </Suspense>
  );
}

export default App;