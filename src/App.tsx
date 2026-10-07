import React, { useEffect, useState } from 'react';
import { ActivationGate } from './components/ActivationGate';
import { ErrorBoundary } from './components/ErrorBoundary';
import { PlatformApp } from './PlatformApp';
import {
  isDeviceActivated,
  lockPlatform,
  validateSavedSession,
} from './utils/activation';
import type { ActivationState } from './utils/activation';

export function App() {
  const [activation, setActivation] = useState<ActivationState>(() => isDeviceActivated());

  useEffect(() => {
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
      <PlatformApp
        key={`platform-${activation.code}`}
        activeCode={activation.code}
        role={activation.role || 'student'}
        studentName={activation.studentName}
        onLockPlatform={handleLockPlatform}
      />
    </ErrorBoundary>
  );
}

export default App;
