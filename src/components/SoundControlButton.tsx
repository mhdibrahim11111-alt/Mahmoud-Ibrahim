import React, { useState, useRef, useEffect } from 'react';
import { Volume2, Volume1, VolumeX, Sparkles, CheckCircle2, AlertCircle, Bookmark, Play, Trophy } from 'lucide-react';
import { useSoundManager } from '../hooks/useSoundManager';

export const SoundControlButton: React.FC = () => {
  const {
    volume,
    isMuted,
    setVolume,
    toggleMute,
    playSuccess,
    playCompletion,
    playError,
    playClick,
    playRun,
    playBookmark,
    playLevelUp,
  } = useSoundManager();

  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close popup when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const muted = toggleMute();
    if (!muted) {
      playClick();
    }
  };

  const currentPercent = isMuted ? 0 : Math.round(volume * 100);

  const getIcon = () => {
    if (isMuted || volume === 0) {
      return <VolumeX className="w-4 h-4 text-slate-500" strokeWidth={2.2} />;
    }
    if (volume < 0.5) {
      return <Volume1 className="w-4 h-4 text-amber-400" strokeWidth={2.2} />;
    }
    return <Volume2 className="w-4 h-4 text-orange-400" strokeWidth={2.2} />;
  };

  return (
    <div className="relative inline-block" ref={containerRef} dir="rtl">
      {/* Sound Toggle Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        onDoubleClick={handleToggleMute}
        aria-label={`التحكم بالمؤثرات الصوتية (${isMuted ? 'مكتوم' : `${currentPercent}%`})`}
        aria-expanded={isOpen}
        title={isMuted ? 'المؤثرات الصوتية مكتومة (اضغط للضبط)' : `مستوى المؤثرات الصوتية ${currentPercent}%`}
        className={`flex items-center gap-1.5 p-2 rounded-xl border transition text-xs font-semibold shadow-sm active:scale-95 ${
          isMuted || volume === 0
            ? 'bg-slate-900/80 hover:bg-slate-800 border-slate-800 text-slate-500'
            : 'bg-slate-900/90 hover:bg-slate-800 border-slate-800 hover:border-orange-500/40 text-slate-200'
        }`}
      >
        {getIcon()}
        <span className="hidden md:inline font-mono text-[11px] text-slate-400">
          {isMuted ? 'مكتوم' : `${currentPercent}%`}
        </span>
      </button>

      {/* Floating Sound Control Panel */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="إعدادات المؤثرات الصوتية"
          className="absolute left-0 mt-2 w-64 bg-slate-900/95 border border-slate-800 rounded-2xl p-4 shadow-2xl backdrop-blur-xl z-50 text-slate-100 animate-fadeIn space-y-3.5"
        >
          {/* Header & Quick Mute */}
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">المؤثرات الصوتية</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 font-mono">
                FX
              </span>
            </div>

            <button
              type="button"
              onClick={handleToggleMute}
              className={`p-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                isMuted
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              <span className="text-[11px]">{isMuted ? 'إلغاء الكتم' : 'كتم'}</span>
            </button>
          </div>

          {/* Volume Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs text-slate-400 font-medium">
              <span>درجة الصوت</span>
              <span className="font-mono text-orange-400 font-bold" dir="ltr">
                {currentPercent}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setVolume(val);
              }}
              aria-label="مستوى الصوت"
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />
          </div>

          {/* Test Sound Triggers */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] font-semibold text-slate-400 block">
              تجربة المؤثرات الصوتية:
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => playSuccess()}
                className="flex flex-col items-center justify-center gap-1 p-2 rounded-xl bg-slate-950/60 hover:bg-emerald-950/40 border border-slate-800 hover:border-emerald-500/40 text-emerald-300 transition text-[10px] font-bold group"
              >
                <CheckCircle2 className="w-3.5 h-3.5 group-hover:scale-110 transition" />
                <span>نجاح</span>
              </button>

              <button
                type="button"
                onClick={() => playCompletion()}
                className="flex flex-col items-center justify-center gap-1 p-2 rounded-xl bg-slate-950/60 hover:bg-amber-950/40 border border-slate-800 hover:border-amber-500/40 text-amber-300 transition text-[10px] font-bold group"
              >
                <Sparkles className="w-3.5 h-3.5 group-hover:scale-110 transition" />
                <span>احتفال</span>
              </button>

              <button
                type="button"
                onClick={() => playError()}
                className="flex flex-col items-center justify-center gap-1 p-2 rounded-xl bg-slate-950/60 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-500/40 text-rose-300 transition text-[10px] font-bold group"
              >
                <AlertCircle className="w-3.5 h-3.5 group-hover:scale-110 transition" />
                <span>تنبيه</span>
              </button>

              <button
                type="button"
                onClick={() => playBookmark()}
                className="flex flex-col items-center justify-center gap-1 p-2 rounded-xl bg-slate-950/60 hover:bg-orange-950/40 border border-slate-800 hover:border-orange-500/40 text-orange-300 transition text-[10px] font-bold group"
              >
                <Bookmark className="w-3.5 h-3.5 group-hover:scale-110 transition" />
                <span>علامة</span>
              </button>

              <button
                type="button"
                onClick={() => playRun()}
                className="flex flex-col items-center justify-center gap-1 p-2 rounded-xl bg-slate-950/60 hover:bg-cyan-950/40 border border-slate-800 hover:border-cyan-500/40 text-cyan-300 transition text-[10px] font-bold group"
              >
                <Play className="w-3.5 h-3.5 group-hover:scale-110 transition" />
                <span>تشغيل</span>
              </button>

              <button
                type="button"
                onClick={() => playLevelUp()}
                className="flex flex-col items-center justify-center gap-1 p-2 rounded-xl bg-slate-950/60 hover:bg-purple-950/40 border border-slate-800 hover:border-purple-500/40 text-purple-300 transition text-[10px] font-bold group"
              >
                <Trophy className="w-3.5 h-3.5 group-hover:scale-110 transition" />
                <span>ترقية 🏆</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
