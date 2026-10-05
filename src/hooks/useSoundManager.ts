import { useEffect, useState, useCallback, useMemo } from 'react';
import {
  soundManager,
  SoundEffectType,
  SoundState,
} from '../utils/soundManager';

export interface UseSoundManagerReturn {
  // Volume & Mute States
  volume: number;
  isMuted: boolean;
  isReady: boolean;

  // State Mutators
  setVolume: (volume: number) => void;
  setMuted: (muted: boolean) => void;
  toggleMute: () => boolean;
  init: () => void;
  preloadSounds: (assetMap?: Partial<Record<SoundEffectType, string>>) => void;
  getScaledVolume: (type: SoundEffectType) => number;

  // Feedback Trigger Functions
  playSuccess: () => void;
  playCompletion: () => void;
  playError: () => void;
  playClick: () => void;
  playRun: () => void;
  playBadge: () => void;
  playBookmark: () => void;
  playLevelUp: () => void;
  play: (type: SoundEffectType) => void;
}

/**
 * Hook for consuming centralized sound feedback in any React component.
 * Automatically synchronizes with SoundManager state changes across all components.
 */
export function useSoundManager(): UseSoundManagerReturn {
  const [soundState, setSoundState] = useState<SoundState>(() => soundManager.getState());

  useEffect(() => {
    // Subscribe to state mutations (volume change, mute toggle from anywhere)
    const unsubscribe = soundManager.subscribe((nextState) => {
      setSoundState(nextState);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Stabilized callbacks
  const setVolume = useCallback((vol: number) => {
    soundManager.setVolume(vol);
  }, []);

  const setMuted = useCallback((muted: boolean) => {
    soundManager.setMuted(muted);
  }, []);

  const toggleMute = useCallback(() => {
    return soundManager.toggleMute();
  }, []);

  const init = useCallback(() => {
    soundManager.init();
  }, []);

  const preloadSounds = useCallback(
    (assetMap?: Partial<Record<SoundEffectType, string>>) => {
      soundManager.preloadSounds(assetMap);
    },
    []
  );

  const getScaledVolume = useCallback((type: SoundEffectType) => {
    return soundManager.getScaledVolume(type);
  }, []);

  const playSuccess = useCallback(() => {
    soundManager.playSuccess();
  }, []);

  const playCompletion = useCallback(() => {
    soundManager.playCompletion();
  }, []);

  const playError = useCallback(() => {
    soundManager.playError();
  }, []);

  const playClick = useCallback(() => {
    soundManager.playClick();
  }, []);

  const playRun = useCallback(() => {
    soundManager.playRun();
  }, []);

  const playBadge = useCallback(() => {
    soundManager.playBadge();
  }, []);

  const playBookmark = useCallback(() => {
    soundManager.playBookmark();
  }, []);

  const playLevelUp = useCallback(() => {
    soundManager.playLevelUp();
  }, []);

  const play = useCallback((type: SoundEffectType) => {
    soundManager.play(type);
  }, []);

  return useMemo(
    () => ({
      volume: soundState.volume,
      isMuted: soundState.isMuted,
      isReady: soundState.isReady,
      setVolume,
      setMuted,
      toggleMute,
      init,
      preloadSounds,
      getScaledVolume,
      playSuccess,
      playCompletion,
      playError,
      playClick,
      playRun,
      playBadge,
      playBookmark,
      playLevelUp,
      play,
    }),
    [
      soundState,
      setVolume,
      setMuted,
      toggleMute,
      init,
      preloadSounds,
      getScaledVolume,
      playSuccess,
      playCompletion,
      playError,
      playClick,
      playRun,
      playBadge,
      playBookmark,
      playLevelUp,
      play,
    ]
  );
}

export default useSoundManager;
