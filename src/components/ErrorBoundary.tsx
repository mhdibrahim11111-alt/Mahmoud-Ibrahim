import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, LogOut, RotateCcw } from 'lucide-react';
import { lockPlatform } from '../utils/activation';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an unhandled component error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  private handleClearAndReset = () => {
    try {
      // Clear transient view keys while preserving essential code
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key && (key.includes('active_view') || key.includes('part_exam') || key.includes('bughunter_part'))) {
          localStorage.removeItem(key);
        }
      }
    } catch {}
    window.location.hash = '';
    window.location.reload();
  };

  private handleLogout = () => {
    lockPlatform();
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const errorMessage = this.state.error?.message || 'حدث خطأ غير متوقع أثناء تشغيل واجهة المنصة.';

      return (
        <main
          role="alert"
          aria-live="assertive"
          dir="rtl"
          className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 sm:p-6 font-['Cairo',sans-serif]"
        >
          <div className="w-full max-w-lg bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl text-center space-y-6 animate-fadeIn">
            {/* Warning Icon */}
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-rose-500/15 border border-rose-500/30 text-rose-400 shadow-xl shadow-rose-500/10">
              <AlertTriangle className="w-8 h-8 sm:w-10 sm:h-10 text-rose-400" />
            </div>

            {/* Title & Description */}
            <div className="space-y-2">
              <h1 className="text-xl sm:text-2xl font-black text-white">
                عذراً، حدث خطأ غير متوقع في المنصة!
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-md mx-auto">
                تم التقاط الخطأ بنجاح لحماية بياناتك ومنع توقف التطبيق بالكامل. يمكنك تجربة أحد خيارات الاستعادة السريعة أدناه:
              </p>
            </div>

            {/* Error Message Box */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3.5 text-right font-mono text-xs text-rose-300/90 overflow-x-auto select-all">
              <span className="text-slate-500 text-[10px] block font-sans mb-1">تفاصيل الخطأ:</span>
              <p className="break-words">{errorMessage}</p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-1">
              <button
                type="button"
                onClick={this.handleReload}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 active:scale-[0.98]"
              >
                <RefreshCw className="w-4 h-4" />
                <span>إعادة تحميل المنصة (Reload) 🔄</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={this.handleClearAndReset}
                  className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center justify-center gap-1.5 border border-slate-700 active:scale-[0.98]"
                  title="إعادة تعيين الحالة المؤقتة وإعادة المحاولة"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                  <span>إعادة الضبط</span>
                </button>

                <button
                  type="button"
                  onClick={this.handleLogout}
                  className="py-2.5 px-3 rounded-xl bg-rose-950/30 hover:bg-rose-900/40 text-rose-300 text-xs font-bold transition flex items-center justify-center gap-1.5 border border-rose-800/40 active:scale-[0.98]"
                  title="تسجيل الخروج والعودة لشاشة الدخول"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-400" />
                  <span>شاشة الدخول</span>
                </button>
              </div>
            </div>

            {/* Technical Stack Details (Collapsible) */}
            {this.state.errorInfo && (
              <details className="text-right text-[11px] text-slate-500 border-t border-slate-800/80 pt-3">
                <summary className="cursor-pointer hover:text-slate-400 select-none transition">
                  عرض التفاصيل التقنية للخطأ (Stack Trace) 🛠️
                </summary>
                <pre className="mt-2 p-3 bg-slate-950 rounded-xl border border-slate-800/60 overflow-x-auto text-[10px] text-slate-400 font-mono text-left dir-ltr whitespace-pre-wrap max-h-40">
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}
