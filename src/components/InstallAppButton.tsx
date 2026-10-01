import React, { useState, useEffect } from 'react';
import { Smartphone, Download, Check, X, Share } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
  prompt(): Promise<void>;
}

export const InstallAppButton: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showIosModal, setShowIosModal] = useState(false);

  // Detect iOS Safari
  const isIos =
    typeof window !== 'undefined' &&
    /iPad|iPhone|iPod/.test(navigator.userAgent) &&
    !(window as any).MSStream;

  const isStandalone =
    typeof window !== 'undefined' &&
    (window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true);

  useEffect(() => {
    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [isStandalone]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
      setIsInstallable(false);
    } else if (isIos) {
      setShowIosModal(true);
    } else {
      // Direct instruction for desktop/other
      alert('لتثبيت التطبيق على جهازك: اضغط على أيقونة التثبيت (Install) بجوار شريط العنوان في متصفحك.');
    }
  };

  if (isInstalled) {
    return null; // Already running as installed PWA app
  }

  return (
    <>
      <button
        onClick={handleInstallClick}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition active:scale-95 shadow shadow-emerald-500/10"
        title="تثبيت منصة كود بالمصري كتطبيق على هاتفك أو حاسوبك"
      >
        <Download className="w-3.5 h-3.5 text-emerald-400 animate-bounce" />
        <span className="hidden sm:inline">تثبيت التطبيق 📲</span>
        <span className="sm:hidden">تثبيت</span>
      </button>

      {/* iOS Safari instructions modal */}
      {showIosModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 mx-auto flex items-center justify-center">
              <Share className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-white">تثبيت التطبيق على iPhone / iPad</h3>

            <div className="text-xs text-slate-300 space-y-2.5 text-right bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <p className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-[11px] shrink-0">1</span>
                <span>اضغط على زر المشاركة (Share) في أسفل متصفح Safari.</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-[11px] shrink-0">2</span>
                <span>مرر للأسفل واختر <strong>"Add to Home Screen"</strong> (إضافة إلى الشاشة الرئيسية).</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-[11px] shrink-0">3</span>
                <span>اضغط <strong>"Add"</strong> وسيظهر التطبيق على شاشة هاتفك فوراً!</span>
              </p>
            </div>

            <button
              onClick={() => setShowIosModal(false)}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition"
            >
              فهمت، حسناً
            </button>
          </div>
        </div>
      )}
    </>
  );
};
