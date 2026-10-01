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
  onActivated: (code: string, role: 'admin' | 'student', studentName?: string) => void;
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
          onActivated(code.trim().toUpperCase(), result.role, result.studentName);
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
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* App Logo & Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500 via-orange-500 to-yellow-400 shadow-2xl shadow-amber-500/30 text-slate-950 font-black text-3xl mb-1 transform hover:scale-105 transition">
            كود
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center justify-center gap-2">
            <span>كود بالمصري</span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
              تطبيق خاص 🔒
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xs mx-auto leading-relaxed">
            المنصة التفاعلية الشاملة لتعلم جافاسكريبت والويب من الصفر بالعامية المصرية
          </p>
        </div>

        {/* Activation Box */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-5">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white">تفعيل الوصول للمنصة</h2>
              <p className="text-[11px] text-slate-400">أدخل كود الاشتراك المسلّم لك من صاحب المنصة</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 block">
                كود التفعيل (Activation Code):
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value.toUpperCase());
                    setError(null);
                  }}
                  placeholder="أدخل كود الاشتراك هنا..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-4 py-3.5 text-center text-base sm:text-lg font-mono font-bold tracking-widest text-amber-300 placeholder:text-slate-600 focus:outline-none focus:border-amber-500 transition shadow-inner"
                  autoFocus
                  required
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                  <Lock className="w-4 h-4" />
                </span>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-rose-950/30 border border-rose-900/50 rounded-xl text-rose-300 text-xs flex items-center gap-2 animate-fadeIn">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="p-3 bg-emerald-950/30 border border-emerald-900/50 rounded-xl text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{success}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !code.trim()}
              className="w-full py-3.5 px-6 rounded-2xl font-black text-sm bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 shadow-lg shadow-amber-500/25 transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span>جاري التحقق من الكود...</span>
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
              <HelpCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>معاكش كود؟ تواصل مع صاحب المنصة للحصول على كودك الخاص.</span>
            </p>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="flex items-center justify-around text-center text-slate-500 text-[11px]">
          <span className="flex items-center gap-1">
            <Smartphone className="w-3.5 h-3.5 text-amber-400/70" />
            تطبيق PWA قابل للتثبيت
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400/70" />
            حفظ التفعيل بالجهاز
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400/70" />
            محتوى تفاعلي حصري
          </span>
        </div>
      </div>
    </div>
  );
};
