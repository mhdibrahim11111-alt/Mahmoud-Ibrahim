import React, { useState } from 'react';
import { activateWithCode } from '../utils/activation';
import {
  Lock,
  KeyRound,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Smartphone,
  HelpCircle,
} from 'lucide-react';

interface ActivationGateProps {
  onActivated: (code: string, role: 'master' | 'admin' | 'teacher' | 'student', studentName?: string) => void;
}

export const ActivationGate: React.FC<ActivationGateProps> = ({ onActivated }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await activateWithCode(code);
      if (result.success) {
        setSuccess(result.message);
        setTimeout(() => {
          onActivated(result.code || code.trim().toUpperCase(), result.role, result.studentName);
        }, 500);
      } else {
        setError(result.message);
        setIsLoading(false);
      }
    } catch {
      setError('حدث خطأ أثناء التحقق، يرجى المحاولة لاحقاً');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-4 py-12 sm:py-16 pb-20 sm:pb-28 relative overflow-hidden font-['Cairo',sans-serif]">
      {/* Ambient background glows - Unified warm brand palette */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* App Logo & Header Section */}
        <div className="text-center space-y-3.5">
          {/* Logo Icon */}
<img
  src="/icons/icon-512.png"
  alt="زكي كود"
  className="inline-block w-32 h-32 sm:w-40 sm:h-40 rounded-[2rem] object-cover shadow-2xl shadow-orange-500/30 transform hover:scale-105 transition duration-300"
/>


{/* 4. Standalone Centered Badge Pill (Directly below logo for breathing room) */}
<div>
  <span className="inline-flex items-center gap-1.5 text-xs px-3.5 py-1 rounded-full bg-orange-500/15 text-orange-300 border border-orange-500/30 font-bold shadow-sm">
    <Lock className="w-3 h-3 text-orange-400" />
    <span>تطبيق خاص وحصري</span>
  </span>
</div>

<h1 className="sr-only">زكي كود</h1>

<p className="text-xs sm:text-sm text-slate-400 max-w-xs mx-auto leading-relaxed">
  المنصة التفاعلية الشاملة لتعلم جافاسكريبت والويب من الصفر بالعامية المصرية
</p>
</div>
        {/* Activation Box */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-5">
          {/* Header of Card */}
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center font-bold shrink-0 border border-orange-500/20">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white">تفعيل الوصول للمنصة</h2>
              <p className="text-[11px] text-slate-400">أدخل كود الاشتراك المسلّم لك من صاحب المنصة</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="activation-code" className="text-xs font-semibold text-slate-300 block">
                كود التفعيل (Activation Code):
              </label>
              <div className="relative">
                {/* 2. Fixed input with placeholder:tracking-normal to ensure natural connected Arabic script */}
                <input
                  id="activation-code"
                  type="text"
                  dir="ltr"
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value.toUpperCase());
                    setError(null);
                  }}
                  placeholder="أدخل كود الاشتراك هنا..."
                  className={`w-full bg-slate-950 border border-slate-700 rounded-2xl px-4 py-3.5 text-center text-base sm:text-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition shadow-inner placeholder:tracking-normal placeholder:font-sans placeholder:font-normal placeholder:text-slate-500 ${
                    code.length > 0
                      ? 'font-mono font-bold tracking-widest text-orange-400'
                      : 'font-sans tracking-normal text-slate-200'
                  }`}
                  autoFocus
                  required
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? 'activation-error' : undefined}
                />
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                  <Lock className="w-4 h-4 text-orange-400/60" />
                </span>
              </div>
            </div>

            {error && (
              <div id="activation-error" role="alert" className="p-3 bg-rose-950/30 border border-rose-900/50 rounded-xl text-rose-300 text-xs flex items-center gap-2 animate-fadeIn">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div role="status" aria-live="polite" className="p-3 bg-emerald-950/30 border border-emerald-900/50 rounded-xl text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{success}</span>
              </div>
            )}

            {/* 1. Primary CTA Vibrancy: High visual punch bright brand orange button */}
            <button
              type="submit"
              disabled={isLoading || !code.trim()}
              className="w-full py-3.5 px-6 rounded-2xl font-black text-sm sm:text-base bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 shadow-xl shadow-orange-500/25 hover:shadow-orange-500/35 hover:brightness-105 transition active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span role="status" aria-live="polite">جاري التحقق من الكود...</span>
              ) : (
                <>
                  <span>دخول المنصة</span>
                  <ArrowLeft className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Help note */}
          <div className="pt-3 border-t border-slate-800/80 text-center">
            <p className="text-xs text-slate-400 flex items-center justify-center gap-1.5 leading-relaxed">
              <HelpCircle className="w-3.5 h-3.5 text-orange-400 shrink-0" />
              <span>معاكش كود؟ تواصل مع صاحب المنصة للحصول على كودك الخاص.</span>
            </p>
          </div>
        </div>

        {/* 5. Bottom Section Padding & Feature Highlights */}
        <div className="pt-2 pb-4 flex items-center justify-around text-center text-slate-400 text-[11px] sm:text-xs">
          <span className="flex items-center gap-1.5">
            <Smartphone className="w-4 h-4 text-orange-400" />
            تطبيق PWA قابل للتثبيت
          </span>
          <span className="text-slate-700">•</span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            حفظ التفعيل بالجهاز
          </span>
          <span className="text-slate-700">•</span>
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-orange-400" />
            محتوى تفاعلي حصري
          </span>
        </div>
      </div>
    </div>
  );
};
