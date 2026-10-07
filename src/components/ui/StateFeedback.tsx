import React, { useState, useEffect } from 'react';
import {
  Wifi,
  WifiOff,
  CloudOff,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Bookmark,
  FileText,
  Code2,
  Search,
  Compass,
  Lock,
  RefreshCw,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  BookOpen,
  Terminal,
  ArrowLeft,
} from 'lucide-react';
import { Button } from './designSystem';

/**
 * Phase 8: Standardized Feedback & State Components
 * Unified across Loading, Empty, Error, Offline, and Cloud Sync workflows.
 */

// ==========================================
// 1. Loading States
// ==========================================

export interface LoadingStateProps {
  title?: string;
  subtitle?: string;
  variant?: 'fullscreen' | 'panel' | 'inline' | 'editor';
}

export const StandardLoadingState: React.FC<LoadingStateProps> = ({
  title = 'جارٍ تحميل المحتوى…',
  subtitle = 'يرجى الانتظار لحظات لتجهيز البيانات',
  variant = 'panel',
}) => {
  if (variant === 'fullscreen') {
    return (
      <main
        role="status"
        aria-live="polite"
        dir="rtl"
        className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6 font-['Cairo',sans-serif]"
      >
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 max-w-sm w-full text-center space-y-4 shadow-2xl backdrop-blur-md">
          <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
            <span className="absolute inset-0 rounded-full border-4 border-amber-500/20" />
            <span className="absolute inset-0 rounded-full border-4 border-amber-400 border-t-transparent animate-spin" />
            <Sparkles className="w-6 h-6 text-amber-400 animate-pulse" />
          </div>
          <div className="space-y-1">
            <h2 className="text-base font-bold text-white">{title}</h2>
            <p className="text-xs text-slate-400">{subtitle}</p>
          </div>
        </div>
      </main>
    );
  }

  if (variant === 'editor') {
    return (
      <div
        role="status"
        aria-live="polite"
        dir="rtl"
        className="h-full min-h-[360px] bg-slate-950/80 border border-slate-800 rounded-2xl flex flex-col items-center justify-center p-6 text-center space-y-3 font-['Cairo',sans-serif]"
      >
        <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center shadow-inner">
          <Terminal className="w-6 h-6 text-emerald-400 animate-pulse" />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-white">جارٍ تجهيز بيئة المحرر التفاعلية…</h3>
          <p className="text-xs text-slate-400">تحميل محرك تشغيل الجافاسكريبت والأدوات</p>
        </div>
      </div>
    );
  }

  return (
    <div
      role="status"
      aria-live="polite"
      dir="rtl"
      className="py-12 px-4 flex flex-col items-center justify-center text-center space-y-3 font-['Cairo',sans-serif]"
    >
      <div className="w-10 h-10 rounded-full border-3 border-amber-500/20 border-t-amber-400 animate-spin flex items-center justify-center" />
      <div className="space-y-0.5">
        <h3 className="text-sm font-bold text-slate-200">{title}</h3>
        {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
      </div>
    </div>
  );
};

// ==========================================
// 2. Standard Empty States
// ==========================================

export interface StandardEmptyStateProps {
  type: 'bookmarks' | 'notes' | 'snippets' | 'activity' | 'search' | 'custom';
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  searchQuery?: string;
  actionText?: string;
  onAction?: () => void;
  secondaryActionText?: string;
  onSecondaryAction?: () => void;
}

export const StandardEmptyState: React.FC<StandardEmptyStateProps> = ({
  type,
  title,
  description,
  icon,
  searchQuery,
  actionText,
  onAction,
  secondaryActionText,
  onSecondaryAction,
}) => {
  const configs = {
    bookmarks: {
      icon: <Bookmark className="w-8 h-8 text-amber-400" />,
      title: 'لا توجد دروس محفوظة بالمفضلة بعد',
      description: 'أثناء قراءة أي فصل في الكتاب، يمكنك النقر على زر "حفظ بالمفضلة" للرجوع إليه هنا بضغطة واحدة.',
      actionText: 'استكشف فصول الكتاب',
    },
    notes: {
      icon: <FileText className="w-8 h-8 text-sky-400" />,
      title: 'لم تقم بتدوين أي ملاحظات بعد',
      description: 'يمكنك كتابة ملخصاتك وأفكارك الخاصة في مساحة الملاحظات المخصصة أسفل كل درس وسيتم حفظها تلقائياً.',
      actionText: 'فتح الكتاب للتدوين',
    },
    snippets: {
      icon: <Code2 className="w-8 h-8 text-emerald-400" />,
      title: 'لا توجد مقتطفات برمجية محفوظة',
      description: 'عند كتابة أي كود مميز في المحرر التفاعلي، اضغط "حفظ الكود" لتخزينه في مكتبتك الخاصة.',
      actionText: 'فتح المحرر لتجربة كود',
    },
    activity: {
      icon: <Compass className="w-8 h-8 text-indigo-400" />,
      title: 'لا يوجد نشاط مسجل حتى الآن',
      description: 'ابدأ بقراءة أول فصل أو حل كويز قصير ليظهر سجلك التعليمي ومستوى إنجازك هنا.',
      actionText: 'ابدأ الدرس الأول',
    },
    search: {
      icon: <Search className="w-8 h-8 text-slate-400" />,
      title: searchQuery ? `لم نجد نتائج تطابق "${searchQuery}"` : 'لم يتم العثور على أي نتائج',
      description: 'جرّب البحث بكلمات مفتاحية أخرى مثل: المتغيرات، الدوال، المصفوفات، DOM، أو رقم الفصل.',
      actionText: 'عرض جميع الفصول',
    },
    custom: {
      icon: icon || <Sparkles className="w-8 h-8 text-amber-400" />,
      title: title || 'لا توجد عناصر لعرضها',
      description: description || 'القسم فارغ حالياً.',
      actionText: actionText,
    },
  };

  const current = configs[type];
  const finalTitle = title || current.title;
  const finalDesc = description || current.description;
  const finalActionText = actionText || current.actionText;
  const finalIcon = icon || current.icon;

  return (
    <div
      dir="rtl"
      className="text-center py-10 px-4 sm:px-6 max-w-md mx-auto space-y-4 font-['Cairo',sans-serif]"
    >
      <div className="w-16 h-16 mx-auto rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center shadow-lg shadow-black/40">
        {finalIcon}
      </div>

      <div className="space-y-1.5">
        <h3 className="text-base sm:text-lg font-bold text-white">{finalTitle}</h3>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{finalDesc}</p>
      </div>

      {(finalActionText || secondaryActionText) && (
        <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
          {finalActionText && onAction && (
            <Button variant="primary" size="md" onClick={onAction}>
              {finalActionText}
            </Button>
          )}
          {secondaryActionText && onSecondaryAction && (
            <Button variant="outline" size="md" onClick={onSecondaryAction}>
              {secondaryActionText}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

// ==========================================
// 3. Standard Error States
// Explicitly explains:
// 1. What happened
// 2. Whether student data is safe
// 3. What the student can do next
// ==========================================

export interface StandardErrorStateProps {
  type?: 'api' | 'cloud_sync' | 'expired_session' | 'permission' | 'unexpected';
  title?: string;
  whatHappened?: string;
  dataSafetyExplanation?: string;
  actionRecommendation?: string;
  onRetry?: () => void;
  onSecondaryAction?: () => void;
  secondaryActionLabel?: string;
  showSupportHint?: boolean;
}

export const StandardErrorState: React.FC<StandardErrorStateProps> = ({
  type = 'api',
  title,
  whatHappened,
  dataSafetyExplanation,
  actionRecommendation,
  onRetry,
  onSecondaryAction,
  secondaryActionLabel,
  showSupportHint = true,
}) => {
  const defaults = {
    api: {
      icon: <AlertTriangle className="w-8 h-8 text-rose-400" />,
      title: 'تعذر الاتصال بالخادم السحابي',
      whatHappened: 'حدث انقطاع مؤقت في الاتصال بين المنصة والخادم أثناء تنفيذ العملية.',
      dataSafety: 'أكوادك وإنجازاتك محفوظة بأمان على جهازك ولن تفقد أي تقدم تم إحرازه.',
      recommendation: 'تحقق من اتصالك بالإنترنت ثم اضغط "إعادة المحاولة" لإعادة الاتصال.',
      retryLabel: 'إعادة المحاولة 🔄',
    },
    cloud_sync: {
      icon: <CloudOff className="w-8 h-8 text-amber-400" />,
      title: 'تأخر المزامنة السحابية المؤقتة',
      whatHappened: 'لم نتمكن من مزامنة آخر التعديلات مع السحابة بسبب بطء أو انقطاع بالشبكة.',
      dataSafety: 'بياناتك محفوظة محلياً بنسبة 100%، وستتم المزامنة تلقائياً بمجرد استقرار الشبكة.',
      recommendation: 'يمكنك مواصلة القراءة والحل بشكل طبيعي أو الضغط على زر المزامنة الآن.',
      retryLabel: 'مزامنة الآن ☁️',
    },
    expired_session: {
      icon: <Lock className="w-8 h-8 text-rose-400" />,
      title: 'انتهت صلاحية جلسة الدخول',
      whatHappened: 'انتهت فترة صلاحية الكود أو تم تسجيل الدخول من جهاز آخر.',
      dataSafety: 'سجل إنجازاتك مرتبط برمز اشتراكك ولن يضيع.',
      recommendation: 'يرجى إعادة إدخال كود التفعيل لتجديد الجلسة ومتابعة التعلم.',
      retryLabel: 'تسجيل الدخول بكود التفعيل 🔑',
    },
    permission: {
      icon: <ShieldAlert className="w-8 h-8 text-rose-400" />,
      title: 'صلاحيات غير كافية',
      whatHappened: 'الصفحة أو الميزة المطلوبة مخصصة للمدير أو المعلم فقط.',
      dataSafety: 'حسابك وبياناتك الشخصية في أمان تام.',
      recommendation: 'يمكنك العودة إلى لوحة التحكم الرئيسية الخاصة بحسابك.',
      retryLabel: 'العودة للرئيسية 🏠',
    },
    unexpected: {
      icon: <AlertTriangle className="w-8 h-8 text-rose-400" />,
      title: 'حدث خطأ غير متوقع',
      whatHappened: 'واجه التطبيق استثناءً غير متوقع أثناء معالجة البيانات.',
      dataSafety: 'تم التقاط الخطأ بأمان وحماية بياناتك المحلية من التلف.',
      recommendation: 'اضغط على زر إعادة التحديث لإعادة تهيئة الواجهة بسلاسة.',
      retryLabel: 'إعادة التحديث 🔄',
    },
  };

  const conf = defaults[type];
  const finalTitle = title || conf.title;
  const finalWhatHappened = whatHappened || conf.whatHappened;
  const finalDataSafety = dataSafetyExplanation || conf.dataSafety;
  const finalRecommendation = actionRecommendation || conf.recommendation;

  return (
    <div
      role="alert"
      aria-live="assertive"
      dir="rtl"
      className="w-full max-w-lg mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-5 text-right font-['Cairo',sans-serif]"
    >
      {/* Header */}
      <div className="flex items-center gap-3.5 pb-4 border-b border-slate-800/80">
        <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center shrink-0 shadow-inner">
          {conf.icon}
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-black text-white">{finalTitle}</h2>
          <span className="text-xs text-slate-400">نظام إدارة الأخطاء التلقائي</span>
        </div>
      </div>

      {/* 3-Point Clarification Grid */}
      <div className="space-y-2.5 text-xs sm:text-sm">
        {/* 1. What Happened */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-3.5 space-y-1">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-xs">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>ماذا حدث؟</span>
          </div>
          <p className="text-slate-300 leading-relaxed text-xs sm:text-sm">{finalWhatHappened}</p>
        </div>

        {/* 2. Data Safety */}
        <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-2xl p-3.5 space-y-1">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>هل بياناتك في أمان؟</span>
          </div>
          <p className="text-emerald-200/90 leading-relaxed text-xs sm:text-sm">{finalDataSafety}</p>
        </div>

        {/* 3. What to do next */}
        <div className="bg-amber-950/20 border border-amber-500/20 rounded-2xl p-3.5 space-y-1">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>ما الخطوة التالية؟</span>
          </div>
          <p className="text-amber-200/90 leading-relaxed text-xs sm:text-sm">{finalRecommendation}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-end gap-2.5 pt-2 border-t border-slate-800/80">
        {onRetry && (
          <Button variant="primary" size="md" onClick={onRetry} className="flex-1 sm:flex-none justify-center">
            {conf.retryLabel}
          </Button>
        )}
        {onSecondaryAction && secondaryActionLabel && (
          <Button variant="outline" size="md" onClick={onSecondaryAction} className="flex-1 sm:flex-none justify-center">
            {secondaryActionLabel}
          </Button>
        )}
      </div>

      {showSupportHint && (
        <p className="text-[11px] text-center text-slate-500 pt-1">
          إذا استمرت المشكلة، يمكنك التواصل مع معلمك أو الدعم الفني للمنصة.
        </p>
      )}
    </div>
  );
};

// ==========================================
// 4. Real-time Offline Status Banner
// Standardized across the entire platform
// ==========================================

export const OfflineStatusIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(() => (typeof navigator !== 'undefined' ? navigator.onLine : true));
  const [showRestoredNotice, setShowRestoredNotice] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowRestoredNotice(true);
      const timer = setTimeout(() => setShowRestoredNotice(false), 4000);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowRestoredNotice(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline && !showRestoredNotice) return null;

  return (
    <aside
      aria-live="polite"
      dir="rtl"
      className="fixed bottom-20 md:bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50 font-['Cairo',sans-serif] animate-fadeIn"
    >
      {!isOnline ? (
        <div className="bg-slate-900/95 border border-amber-500/40 rounded-2xl p-3.5 shadow-2xl backdrop-blur-xl flex items-center justify-between gap-3 text-xs text-amber-200">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <WifiOff className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-white block">أنت الآن تعمل بدون إنترنت (Offline) ⚡</span>
              <span className="text-[11px] text-slate-400">جميع الدروس والمحرر يعمل 100% ويتم حفظ إنجازاتك محلياً.</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-slate-900/95 border border-emerald-500/40 rounded-2xl p-3.5 shadow-2xl backdrop-blur-xl flex items-center gap-2.5 text-xs text-emerald-200">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Wifi className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-white block">تم استعادة الاتصال بالإنترنت ✓</span>
            <span className="text-[11px] text-emerald-300/80">جاري مزامنة بياناتك وأكوادك مع السحابة تلقائياً.</span>
          </div>
        </div>
      )}
    </aside>
  );
};
