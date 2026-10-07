// ============================================================================
// SoundManager Utility: High-Performance, Zero-Latency Audio Engine for زكي كود
// Web Audio API with Pre-rendered AudioBuffers & Instant Interaction Unlock
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
  private preRenderedBuffers: Map<SoundEffectType, AudioBuffer> = new Map();
  private isPreRendering: boolean = false;
  private isUnlocked: boolean = false;
  private volume: number = 0.25; // Comfortable default volume
  private isMuted: boolean = false;
  private listeners: Set<SoundStateListener> = new Set();
  private initialized: boolean = false;

  private constructor() {
    this.restorePreferences();
    this.setupGlobalUnlockListeners();
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
      // Restricted context fallback
    }
  }

  /**
   * Set up passive global interaction listeners to unlock AudioContext
   * with ZERO latency on the very first touch/click/keypress.
   */
  private setupGlobalUnlockListeners(): void {
    if (typeof window === 'undefined') return;

    const unlockHandler = () => {
      this.unlock();
      // Remove listeners once unlocked
      window.removeEventListener('pointerdown', unlockHandler, true);
      window.removeEventListener('touchstart', unlockHandler, true);
      window.removeEventListener('mousedown', unlockHandler, true);
      window.removeEventListener('keydown', unlockHandler, true);
    };

    window.addEventListener('pointerdown', unlockHandler, { passive: true, capture: true });
    window.addEventListener('touchstart', unlockHandler, { passive: true, capture: true });
    window.addEventListener('mousedown', unlockHandler, { passive: true, capture: true });
    window.addEventListener('keydown', unlockHandler, { passive: true, capture: true });

    // Handle tab visibility changes without creating audio delay
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && this.audioCtx) {
        if (this.audioCtx.state === 'suspended') {
          this.audioCtx.resume().catch(() => {});
        }
      }
    });
  }

  /**
   * Immediately unlock the hardware audio bus and pre-render all sound effects
   */
  public unlock(): void {
    if (typeof window === 'undefined') return;

    this.getAudioContext();

    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }

    if (!this.isUnlocked && this.audioCtx) {
      // Play 1 sample of silence to prime iOS/Safari audio hardware
      try {
        const buffer = this.audioCtx.createBuffer(1, 1, 22050);
        const source = this.audioCtx.createBufferSource();
        source.buffer = buffer;
        source.connect(this.audioCtx.destination);
        source.start(0);
        this.isUnlocked = true;
      } catch {}
    }

    if (!this.initialized) {
      this.initialized = true;
      this.preRenderAllSounds();
      this.notify();
    }
  }

  /**
   * Lazy-initialize AudioContext singleton
   */
  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;

    if (!this.audioCtx) {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      try {
        if (AudioCtxClass) {
          this.audioCtx = new AudioCtxClass({
            latencyHint: 'interactive',
          });
        }
      } catch {
        // Audio optional fallback
      }
    }

    if (this.audioCtx && !this.masterGain) {
      this.masterGain = this.audioCtx.createGain();
      this.masterGain.gain.setValueAtTime(
        this.isMuted || this.volume === 0 ? 0 : 1,
        this.audioCtx.currentTime
      );
      this.masterGain.connect(this.audioCtx.destination);
    }

    return this.audioCtx;
  }

  public init(): void {
    this.unlock();
  }

  public preloadSounds(_assetMap?: Partial<Record<SoundEffectType, string>>): void {
    this.unlock();
  }

  // ==========================================
  // Pre-Rendering AudioBuffers for 0ms Latency
  // ==========================================

  /**
   * Pre-renders all sound effects using OfflineAudioContext.
   * Resulting AudioBuffers are stored in memory and triggered in < 0.5ms.
   */
  private preRenderAllSounds(): void {
    if (typeof window === 'undefined' || this.isPreRendering) return;
    this.isPreRendering = true;

    const soundTypes: SoundEffectType[] = [
      'click',
      'run',
      'success',
      'completion',
      'error',
      'badge',
      'bookmark',
      'levelUp',
    ];

    soundTypes.forEach((type) => {
      this.renderSoundToBuffer(type)
        .then((buffer) => {
          if (buffer) {
            this.preRenderedBuffers.set(type, buffer);
          }
        })
        .catch(() => {});
    });
  }

  private async renderSoundToBuffer(type: SoundEffectType): Promise<AudioBuffer | null> {
    const sampleRate = 44100;
    let duration = 0.5;

    switch (type) {
      case 'click': duration = 0.08; break;
      case 'run': duration = 0.15; break;
      case 'bookmark': duration = 0.35; break;
      case 'error': duration = 0.35; break;
      case 'success': duration = 0.6; break;
      case 'badge': duration = 0.7; break;
      case 'completion': duration = 1.2; break;
      case 'levelUp': duration = 1.4; break;
    }

    const OfflineCtxClass =
      window.OfflineAudioContext ||
      (window as unknown as { webkitOfflineAudioContext: typeof OfflineAudioContext }).webkitOfflineAudioContext;

    if (!OfflineCtxClass) return null;

    try {
      const offlineCtx = new OfflineCtxClass(2, Math.ceil(sampleRate * duration), sampleRate);
      this.buildSynthGraph(offlineCtx, type, 1.0, 0);
      return await offlineCtx.startRendering();
    } catch {
      return null;
    }
  }

  // ==========================================
  // Synthesis Graph Generator
  // ==========================================

  private buildSynthGraph(
    ctx: BaseAudioContext,
    type: SoundEffectType,
    volume: number,
    startTimeOffset: number = 0
  ): void {
    const now = ctx.currentTime + startTimeOffset;

    switch (type) {
      case 'click': {
        // High-end tactile UI click with subtle rounded pop
        const duration = 0.038;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, now);
        osc.frequency.exponentialRampToValueAtTime(380, now + duration);

        gain.gain.setValueAtTime(volume * 0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + duration);
        break;
      }

      case 'run': {
        // Futuristic tech execution chirp
        const duration = 0.09;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(980, now + duration);

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(volume * 0.4, now + 0.012);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + duration);
        break;
      }

      case 'success': {
        // Ascending major chord (C5 - E5 - G5 - C6) with warm chime harmonics
        const notes = [523.25, 659.25, 783.99, 1046.5];
        notes.forEach((freq, idx) => {
          const start = now + idx * 0.055;
          const duration = 0.32;

          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = idx === notes.length - 1 ? 'sine' : 'triangle';
          osc.frequency.setValueAtTime(freq, start);

          gain.gain.setValueAtTime(0.0001, start);
          gain.gain.linearRampToValueAtTime(volume * 0.45, start + 0.015);
          gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(start);
          osc.stop(start + duration);
        });
        break;
      }

      case 'completion': {
        // Grand celebratory fanfare arpeggio (C5 -> E5 -> G5 -> C6 -> E6) + golden shimmer
        const arpeggio = [523.25, 659.25, 783.99, 1046.5, 1318.51];
        arpeggio.forEach((freq, idx) => {
          const start = now + idx * 0.075;
          const duration = 0.48;

          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = idx >= 3 ? 'sine' : 'triangle';
          osc.frequency.setValueAtTime(freq, start);

          gain.gain.setValueAtTime(0.0001, start);
          gain.gain.linearRampToValueAtTime(volume * 0.42, start + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(start);
          osc.stop(start + duration);
        });

        // Ambient shimmer harmonic on final chord
        const shimmerStart = now + 0.3;
        const shimmerDuration = 0.75;
        const sOsc = ctx.createOscillator();
        const sGain = ctx.createGain();

        sOsc.type = 'sine';
        sOsc.frequency.setValueAtTime(1046.5, shimmerStart);

        sGain.gain.setValueAtTime(0.0001, shimmerStart);
        sGain.gain.linearRampToValueAtTime(volume * 0.22, shimmerStart + 0.04);
        sGain.gain.exponentialRampToValueAtTime(0.0001, shimmerStart + shimmerDuration);

        sOsc.connect(sGain);
        sGain.connect(ctx.destination);

        sOsc.start(shimmerStart);
        sOsc.stop(shimmerStart + shimmerDuration);
        break;
      }

      case 'error': {
        // Modern, subtle, warm dual-tone acoustic chime (pleasant, soft & soothing)
        const tones = [
          { freq: 415.3, delay: 0.0, duration: 0.18, vol: volume * 0.38 },   // G#4
          { freq: 311.13, delay: 0.055, duration: 0.24, vol: volume * 0.32 }, // D#4
        ];

        tones.forEach(({ freq, delay, duration, vol }) => {
          const start = now + delay;
          const osc = ctx.createOscillator();
          const subOsc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, start);

          // Subtle warm octave overtone
          subOsc.type = 'sine';
          subOsc.frequency.setValueAtTime(freq * 2, start);

          gain.gain.setValueAtTime(0.0001, start);
          gain.gain.linearRampToValueAtTime(vol, start + 0.012);
          gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

          osc.connect(gain);
          subOsc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(start);
          subOsc.start(start);
          osc.stop(start + duration);
          subOsc.stop(start + duration);
        });
        break;
      }

      case 'badge': {
        // Shimmering high bell harmonic for badges and achievements
        const notes = [880, 1174.66, 1760]; // A5, D6, A6
        notes.forEach((freq, i) => {
          const start = now + i * 0.065;
          const duration = 0.4;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, start);

          gain.gain.setValueAtTime(0.0001, start);
          gain.gain.linearRampToValueAtTime(volume * 0.38, start + 0.015);
          gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(start);
          osc.stop(start + duration);
        });
        break;
      }

      case 'bookmark': {
        // Warm acoustic acoustic harp tone
        const notes = [783.99, 987.77]; // G5, B5
        notes.forEach((freq, i) => {
          const start = now + i * 0.04;
          const duration = 0.28;

          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, start);

          gain.gain.setValueAtTime(0.0001, start);
          gain.gain.linearRampToValueAtTime(volume * 0.35, start + 0.008);
          gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(start);
          osc.stop(start + duration);
        });
        break;
      }

      case 'levelUp': {
        // Grand triumphant milestone (C5 -> G5 -> C6 -> E6 -> G6) + shimmering high chime
        const notes = [523.25, 783.99, 1046.5, 1318.51, 1567.98];
        notes.forEach((freq, idx) => {
          const start = now + idx * 0.06;
          const duration = idx === notes.length - 1 ? 0.6 : 0.28;

          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = idx >= 3 ? 'sine' : 'triangle';
          osc.frequency.setValueAtTime(freq, start);

          gain.gain.setValueAtTime(0.0001, start);
          gain.gain.linearRampToValueAtTime(volume * 0.45, start + 0.015);
          gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(start);
          osc.stop(start + duration);
        });

        // Top sparkle sparkle chime
        const sparkleNotes = [2093.0, 2637.02]; // C7, E7
        sparkleNotes.forEach((freq) => {
          const start = now + 0.26;
          const duration = 0.5;
          const sOsc = ctx.createOscillator();
          const sGain = ctx.createGain();

          sOsc.type = 'sine';
          sOsc.frequency.setValueAtTime(freq, start);

          sGain.gain.setValueAtTime(0.0001, start);
          sGain.gain.linearRampToValueAtTime(volume * 0.22, start + 0.02);
          sGain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

          sOsc.connect(sGain);
          sGain.connect(ctx.destination);

          sOsc.start(start);
          sOsc.stop(start + duration);
        });
        break;
      }
    }
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
    try {
      localStorage.setItem(STORAGE_KEY_VOLUME, clamped.toString());
    } catch {}
    this.notify();
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    this.updateMasterGate();
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

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  public subscribe(listener: SoundStateListener): () => void {
    this.listeners.add(listener);
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

  public static readonly VOLUME_SCALING_MAP: Record<SoundEffectType, number> = {
    levelUp: 1.35,     // Grand achievement milestone: prominent & triumphant
    completion: 1.20,  // Chapter / Exam finished: celebratory & clear
    badge: 1.15,       // Milestone badge: bright and elevated
    success: 1.00,     // Correct answer / snippet passed: baseline reference (100%)
    bookmark: 0.85,    // Chapter favorited: gentle
    error: 0.80,       // Soft alert: polite, non-startling
    run: 0.75,         // Code execution chirp: subtle tech feedback
    click: 0.35,       // Frequent UI clicks / tabs: soft & subtle to prevent fatigue
  };

  public getScaledVolume(type: SoundEffectType): number {
    if (this.isMuted) return 0;
    const factor = SoundManager.VOLUME_SCALING_MAP[type] ?? 1.0;
    return Math.min(1.0, Math.max(0.0, this.volume * factor));
  }

  // ==========================================
  // Instant Trigger Functions (Zero Latency)
  // ==========================================

  /**
   * Main sound trigger: Instant playback via pre-rendered AudioBuffer.
   * Takes less than 0.5ms with 0 perceptible latency.
   */
  public play(type: SoundEffectType): void {
    const scaledVolume = this.getScaledVolume(type);
    if (scaledVolume <= 0) return;

    const ctx = this.getAudioContext();
    if (!ctx) return;

    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    try {
      // 1. Fast Path: Instant AudioBufferSourceNode from pre-rendered buffer (< 0.5ms)
      const cachedBuffer = this.preRenderedBuffers.get(type);
      if (cachedBuffer) {
        const source = ctx.createBufferSource();
        source.buffer = cachedBuffer;

        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(scaledVolume, ctx.currentTime);

        source.connect(gainNode);
        gainNode.connect(this.masterGain ?? ctx.destination);

        source.start(0);
        return;
      }

      // 2. Direct Web Audio Synthesis Path
      this.buildSynthGraph(ctx, type, scaledVolume, 0);

      // Lazily pre-render for subsequent instant plays
      if (!this.preRenderedBuffers.has(type)) {
        this.renderSoundToBuffer(type).then((buf) => {
          if (buf) this.preRenderedBuffers.set(type, buf);
        });
      }
    } catch (err) {
      console.warn('SoundManager playback issue:', err);
    }
  }

  public playSuccess(): void {
    this.play('success');
  }

  public playCompletion(): void {
    this.play('completion');
  }

  public playError(): void {
    this.play('error');
  }

  public playClick(): void {
    this.play('click');
  }

  public playRun(): void {
    this.play('run');
  }

  public playBadge(): void {
    this.play('badge');
  }

  public playBookmark(): void {
    this.play('bookmark');
  }

  public playLevelUp(): void {
    this.play('levelUp');
  }
}

// Export singleton instance
export const soundManager = SoundManager.getInstance();
export default soundManager;
