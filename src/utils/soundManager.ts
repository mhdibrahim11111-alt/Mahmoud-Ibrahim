// ============================================================================
// SoundManager Utility: Centralized Audio Feedback System for زكي كود
// Supports preloaded audio assets with resilient Web Audio API synthesis fallback
// ============================================================================

export type SoundEffectType =
  | 'success'
  | 'completion'
  | 'error'
  | 'click'
  | 'run'
  | 'badge'
  | 'bookmark'
  | 'levelUp';

export interface SoundState {
  volume: number;       // 0.0 to 1.0
  isMuted: boolean;
  isReady: boolean;
}

export type SoundStateListener = (state: SoundState) => void;

const STORAGE_KEY_VOLUME = 'zakicode_sound_volume';
const STORAGE_KEY_MUTED = 'zakicode_sound_muted';

class SoundManager {
  private static instance: SoundManager;

  private audioCtx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private idleSuspendTimer: ReturnType<typeof setTimeout> | null = null;
  private activeAudio: Map<HTMLAudioElement, SoundEffectType> = new Map();
  private volume: number = 0.25; // Comfortable default volume
  private isMuted: boolean = false;
  private listeners: Set<SoundStateListener> = new Set();

  // Registry of preloaded HTML5 Audio elements
  private preloadedAudios: Map<SoundEffectType, HTMLAudioElement> = new Map();
  private assetUrls: Partial<Record<SoundEffectType, string>> = {};
  private loadedAssets: Set<SoundEffectType> = new Set();
  private initialized: boolean = false;

  private constructor() {
    this.restorePreferences();
  }

  public static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  /**
   * Load saved volume and mute preferences from localStorage
   */
  private restorePreferences(): void {
    if (typeof window === 'undefined') return;

    try {
      const savedVolume = localStorage.getItem(STORAGE_KEY_VOLUME);
      if (savedVolume !== null) {
        const parsed = parseFloat(savedVolume);
        if (!isNaN(parsed) && parsed >= 0 && parsed <= 1) {
          this.volume = parsed;
        }
      }

      const savedMuted = localStorage.getItem(STORAGE_KEY_MUTED);
      if (savedMuted !== null) {
        this.isMuted = savedMuted === 'true';
      }
    } catch {
      // Ignore localStorage exceptions in restricted contexts
    }
  }

  /**
   * Initialize or resume the Web Audio Context (must be triggered on user gesture)
   */
  public init(): void {
    if (typeof window === 'undefined') return;

    if (!this.audioCtx) {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      try {
        if (AudioCtxClass) this.audioCtx = new AudioCtxClass();
      } catch {
        // Audio is optional; playback can still use explicitly supplied audio assets.
      }
    }

    if (this.audioCtx && !this.masterGain) {
      this.masterGain = this.audioCtx.createGain();
      this.masterGain.gain.value = this.isMuted || this.volume === 0 ? 0 : 1;
      this.masterGain.connect(this.audioCtx.destination);
    }

    if (this.idleSuspendTimer) {
      clearTimeout(this.idleSuspendTimer);
      this.idleSuspendTimer = null;
    }

    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }

    this.initialized = true;
    this.notify();
  }

  /**
   * Preload external audio assets (MP3/WAV/OGG).
   * If any asset is missing or fails to load, SoundManager automatically
   * falls back to the built-in procedural Web Audio synthesizer.
   */
  public preloadSounds(assetMap?: Partial<Record<SoundEffectType, string>>): void {
    if (typeof window === 'undefined') return;

    if (assetMap) {
      this.assetUrls = { ...this.assetUrls, ...assetMap };
    }

    // Only load assets explicitly provided by the app; absent optional files
    // should not generate network 404s during startup.
    const urlsToPreload = this.assetUrls;

    (Object.entries(urlsToPreload) as [SoundEffectType, string][]).forEach(([type, url]) => {
      try {
        const audio = new Audio();
        audio.preload = 'auto';
        audio.src = url;

        audio.addEventListener(
          'canplaythrough',
          () => {
            this.preloadedAudios.set(type, audio);
            this.loadedAssets.add(type);
          },
          { once: true }
        );
        audio.addEventListener('error', () => {
          this.preloadedAudios.delete(type);
          this.loadedAssets.delete(type);
        }, { once: true });

        // Pre-fetch
        audio.load();
      } catch {
        // Will rely on Web Audio synthesis
      }
    });
  }

  // ==========================================
  // State Management (Volume, Mute, Observers)
  // ==========================================

  public getState(): SoundState {
    return {
      volume: this.volume,
      isMuted: this.isMuted,
      isReady: this.initialized,
    };
  }

  public setVolume(volume: number): void {
    const clamped = Math.max(0, Math.min(1, volume));
    this.volume = clamped;
    this.updateMasterGate();
    this.activeAudio.forEach((type, audio) => {
      audio.volume = this.getScaledVolume(type);
      if (audio.volume === 0) this.stopAudio(audio);
    });
    try {
      localStorage.setItem(STORAGE_KEY_VOLUME, clamped.toString());
    } catch {}
    this.notify();
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    this.updateMasterGate();
    if (muted) {
      this.activeAudio.forEach((_type, audio) => this.stopAudio(audio));
    }
    try {
      localStorage.setItem(STORAGE_KEY_MUTED, muted.toString());
    } catch {}
    this.notify();
  }

  private updateMasterGate(): void {
    if (!this.masterGain || !this.audioCtx) return;
    this.masterGain.gain.setValueAtTime(
      this.isMuted || this.volume === 0 ? 0 : 1,
      this.audioCtx.currentTime
    );
  }

  private stopAudio(audio: HTMLAudioElement): void {
    audio.pause();
    try { audio.currentTime = 0; } catch {}
    this.activeAudio.delete(audio);
  }

  private scheduleContextSuspend(): void {
    if (!this.audioCtx || typeof window === 'undefined') return;
    if (this.idleSuspendTimer) clearTimeout(this.idleSuspendTimer);
    this.idleSuspendTimer = setTimeout(() => {
      this.idleSuspendTimer = null;
      if (this.audioCtx?.state === 'running') this.audioCtx.suspend().catch(() => {});
    }, 5000);
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  public subscribe(listener: SoundStateListener): () => void {
    this.listeners.add(listener);
    // Emit immediate current state
    listener(this.getState());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    const state = this.getState();
    this.listeners.forEach((fn) => {
      try {
        fn(state);
      } catch (err) {
        console.error('SoundManager listener error:', err);
      }
    });
  }

  /**
   * Action-type based volume scaling multipliers.
   * High-importance celebratory sounds (like 'levelUp' and 'completion') are boosted,
   * while frequent repetitive UI interactions (like 'click' and 'pageFlip')
   * are softened to avoid listener fatigue.
   */
  public static readonly VOLUME_SCALING_MAP: Record<SoundEffectType, number> = {
    levelUp: 1.35,     // Grand achievement milestone: prominent & triumphant
    completion: 1.20,  // Chapter / Exam finished: celebratory & clear
    badge: 1.15,       // Milestone badge: bright and elevated
    success: 1.00,     // Correct answer / snippet passed: baseline reference (100%)
    bookmark: 0.85,    // Chapter favorited: gentle
    error: 0.80,       // Soft alert: polite, non-startling
    run: 0.75,         // Code execution chirp: subtle tech feedback
    click: 0.40,       // Frequent UI clicks / tabs: soft & subtle to prevent fatigue
  };

  /**
   * Calculates the scaled effective volume for a specific action type,
   * clamped safely between 0.0 and 1.0.
   */
  public getScaledVolume(type: SoundEffectType): number {
    if (this.isMuted) return 0;
    const factor = SoundManager.VOLUME_SCALING_MAP[type] ?? 1.0;
    return Math.min(1.0, Math.max(0.0, this.volume * factor));
  }

  private getEffectiveVolume(type?: SoundEffectType): number {
    if (this.isMuted) return 0;
    if (type) {
      return this.getScaledVolume(type);
    }
    return this.volume;
  }

  // ==========================================
  // Trigger Functions
  // ==========================================

  /**
   * Main sound trigger: attempts preloaded audio element first,
   * falls back seamlessly to procedural Web Audio synthesis.
   * Applies action-specific volume scaling automatically.
   */
  public play(type: SoundEffectType): void {
    const scaledVolume = this.getScaledVolume(type);
    if (scaledVolume <= 0) return;

    this.init();

    // 1. Try playing from preloaded audio asset if available
    const preloaded = this.preloadedAudios.get(type);
    if (preloaded && this.loadedAssets.has(type)) {
      try {
        // Clone node to allow rapid overlapping triggers
        const clone = preloaded.cloneNode() as HTMLAudioElement;
        clone.volume = scaledVolume;
        this.activeAudio.set(clone, type);
        clone.addEventListener('ended', () => this.activeAudio.delete(clone), { once: true });
        const playPromise = clone.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            this.activeAudio.delete(clone);
            // Autoplay restriction or decode failure; fallback to synth
            this.synthesizeSound(type, scaledVolume);
          });
          this.scheduleContextSuspend();
          return;
        }
      } catch {
        // Fallback to synth
      }
    }

    // 2. High-fidelity procedural Web Audio fallback
    this.synthesizeSound(type, scaledVolume);
    this.scheduleContextSuspend();
  }

  /**
   * Positive chime for correct answers, valid code snippets, or passed assertions
   */
  public playSuccess(): void {
    this.play('success');
  }

  /**
   * Grand celebratory fanfare for completing a chapter, quiz, or challenge
   */
  public playCompletion(): void {
    this.play('completion');
  }

  /**
   * Distinct, gentle warning buzz for syntax mistakes, incorrect answers, or run failures
   */
  public playError(): void {
    this.play('error');
  }

  /**
   * Tactile click/pop for UI navigation and buttons
   */
  public playClick(): void {
    this.play('click');
  }

  /**
   * Futuristic code execution ping
   */
  public playRun(): void {
    this.play('run');
  }

  /**
   * Sparkling bell chime for badges and milestones
   */
  public playBadge(): void {
    this.play('badge');
  }

  /**
   * Delicate acoustic harp/bell tone for bookmarking chapters
   */
  public playBookmark(): void {
    this.play('bookmark');
  }

  /**
   * Grand triumphant fanfare for leveling up or achieving a new badge
   */
  public playLevelUp(): void {
    this.play('levelUp');
  }

  // ==========================================
  // Web Audio Procedural Synthesis Engine
  // ==========================================

  private synthesizeSound(type: SoundEffectType, volume: number): void {
    if (!this.audioCtx) return;

    try {
      const ctx = this.audioCtx;
      const now = ctx.currentTime;

      switch (type) {
        case 'success': {
          // Ascending major chord chime (C5 - E5 - G5)
          const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
          notes.forEach((freq, idx) => {
            const startTime = now + idx * 0.07;
            const duration = 0.28;

            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, startTime);

            // Envelope: quick attack, smooth exponential decay
            gain.gain.setValueAtTime(0.001, startTime);
            gain.gain.linearRampToValueAtTime(volume * 0.45, startTime + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

            osc.connect(gain);
            gain.connect(this.masterGain ?? ctx.destination);

            osc.start(startTime);
            osc.stop(startTime + duration);
          });
          break;
        }

        case 'completion': {
          // Triumphant multi-note arpeggio + shimmer chord
          // C5, E5, G5, C6, E6
          const arpeggio = [523.25, 659.25, 783.99, 1046.5, 1318.51];
          arpeggio.forEach((freq, idx) => {
            const startTime = now + idx * 0.09;
            const duration = 0.45;

            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = idx === arpeggio.length - 1 ? 'sine' : 'triangle';
            osc.frequency.setValueAtTime(freq, startTime);

            gain.gain.setValueAtTime(0.001, startTime);
            gain.gain.linearRampToValueAtTime(volume * 0.4, startTime + 0.03);
            gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

            osc.connect(gain);
            gain.connect(this.masterGain ?? ctx.destination);

            osc.start(startTime);
            osc.stop(startTime + duration);
          });

          // Sustained warm shimmer harmonic on the final chord
          const shimmerStartTime = now + 0.36;
          const shimmerDuration = 0.6;
          const shimmerOsc = ctx.createOscillator();
          const shimmerGain = ctx.createGain();

          shimmerOsc.type = 'sine';
          shimmerOsc.frequency.setValueAtTime(1046.5, shimmerStartTime);

          shimmerGain.gain.setValueAtTime(0.001, shimmerStartTime);
          shimmerGain.gain.linearRampToValueAtTime(volume * 0.25, shimmerStartTime + 0.05);
          shimmerGain.gain.exponentialRampToValueAtTime(0.0001, shimmerStartTime + shimmerDuration);

          shimmerOsc.connect(shimmerGain);
          shimmerGain.connect(this.masterGain ?? ctx.destination);

          shimmerOsc.start(shimmerStartTime);
          shimmerOsc.stop(shimmerStartTime + shimmerDuration);
          break;
        }

        case 'error': {
          // Polite, gentle wooden marimba double-tap ("تنبيه ناعم، خفيف ورشيق مثل نقر الخشب الهادئ")
          // No somber chords, no static, no buzzer — just crisp tactile feedback
          const taps = [
            { freq: 440, delay: 0.0, duration: 0.045, vol: volume * 0.35 },
            { freq: 350, delay: 0.05, duration: 0.055, vol: volume * 0.28 },
          ];

          taps.forEach(({ freq, delay, duration, vol }) => {
            const startTime = now + delay;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, startTime);
            osc.frequency.exponentialRampToValueAtTime(Math.max(120, freq * 0.72), startTime + duration);

            gain.gain.setValueAtTime(0.0001, startTime);
            gain.gain.linearRampToValueAtTime(vol, startTime + 0.004);
            gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

            osc.connect(gain);
            gain.connect(this.masterGain ?? ctx.destination);

            osc.start(startTime);
            osc.stop(startTime + duration);
          });
          break;
        }

        case 'click': {
          // Subtle, snappy tactile pop
          const duration = 0.04;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(1000, now);
          osc.frequency.exponentialRampToValueAtTime(450, now + duration);

          gain.gain.setValueAtTime(volume * 0.2, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

          osc.connect(gain);
          gain.connect(this.masterGain ?? ctx.destination);

          osc.start(now);
          osc.stop(now + duration);
          break;
        }

        case 'run': {
          // Futuristic tech activation chirp
          const duration = 0.08;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(420, now);
          osc.frequency.exponentialRampToValueAtTime(880, now + duration);

          gain.gain.setValueAtTime(0.001, now);
          gain.gain.linearRampToValueAtTime(volume * 0.3, now + 0.015);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

          osc.connect(gain);
          gain.connect(this.masterGain ?? ctx.destination);

          osc.start(now);
          osc.stop(now + duration);
          break;
        }

        case 'badge': {
          // Shimmering high bell for achievements
          const notes = [880, 1174.66, 1760]; // A5, D6, A6
          notes.forEach((freq, i) => {
            const start = now + i * 0.08;
            const duration = 0.35;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, start);

            gain.gain.setValueAtTime(0.001, start);
            gain.gain.linearRampToValueAtTime(volume * 0.3, start + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

            osc.connect(gain);
            gain.connect(this.masterGain ?? ctx.destination);

            osc.start(start);
            osc.stop(start + duration);
          });
          break;
        }

        case 'bookmark': {
          // Delicate acoustic harp/bell tone for bookmarking chapters
          const notes = [783.99, 987.77]; // G5, B5
          notes.forEach((freq, i) => {
            const start = now + i * 0.045;
            const duration = 0.28;

            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, start);

            gain.gain.setValueAtTime(0.0001, start);
            gain.gain.linearRampToValueAtTime(volume * 0.35, start + 0.008);
            gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

            osc.connect(gain);
            gain.connect(this.masterGain ?? ctx.destination);

            osc.start(start);
            osc.stop(start + duration);
          });
          break;
        }

        case 'levelUp': {
          // Grand triumphant fanfare (C5 -> G5 -> C6 -> E6 -> G6) + shimmering high chime
          const notes = [523.25, 783.99, 1046.50, 1318.51, 1567.98];
          notes.forEach((freq, idx) => {
            const start = now + idx * 0.065;
            const duration = idx === notes.length - 1 ? 0.55 : 0.25;

            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = idx >= 3 ? 'sine' : 'triangle';
            osc.frequency.setValueAtTime(freq, start);

            gain.gain.setValueAtTime(0.0001, start);
            gain.gain.linearRampToValueAtTime(volume * 0.42, start + 0.015);
            gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

            osc.connect(gain);
            gain.connect(this.masterGain ?? ctx.destination);

            osc.start(start);
            osc.stop(start + duration);
          });

          // Top sparkle shimmer chord
          const sparkleNotes = [2093.0, 2637.02]; // C7, E7
          sparkleNotes.forEach((freq) => {
            const start = now + 0.28;
            const duration = 0.45;
            const sOsc = ctx.createOscillator();
            const sGain = ctx.createGain();

            sOsc.type = 'sine';
            sOsc.frequency.setValueAtTime(freq, start);

            sGain.gain.setValueAtTime(0.0001, start);
            sGain.gain.linearRampToValueAtTime(volume * 0.2, start + 0.02);
            sGain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

            sOsc.connect(sGain);
            sGain.connect(this.masterGain ?? ctx.destination);

            sOsc.start(start);
            sOsc.stop(start + duration);
          });
          break;
        }
      }
    } catch (err) {
      console.warn('Procedural audio generation encountered an issue:', err);
    }
  }
}

// Export singleton instance as default & named
export const soundManager = SoundManager.getInstance();
export default soundManager;
