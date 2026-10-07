import React, { useState, useEffect } from 'react';
import { useFocusTrap } from '../hooks/useFocusTrap';
import {
  Sparkles,
  BookOpen,
  Terminal,
  Trophy,
  ArrowLeft,
  ArrowRight,
  Check,
  X,
  Lightbulb,
  Compass,
  Play,
  Award,
} from 'lucide-react';
import { Button } from './ui/designSystem';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartFirstLesson: () => void;
  studentName?: string;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onStartFirstLesson,
  studentName,
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  const modalRef = useFocusTrap<HTMLDivElement>({
    isOpen,
    onClose,
    returnFocus: true,
  });

  // Step arrow navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        // RTL: ArrowLeft moves forward to next step
        if (currentStep < 3) {
          setCurrentStep((s) => s + 1);
        }
      } else if (e.key === 'ArrowRight') {
        // RTL: ArrowRight moves back to prev step
        if (currentStep > 0) {
          setCurrentStep((s) => s - 1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentStep]);

  if (!isOpen) return null;

  const displayName = studentName && studentName.trim() ? studentName.trim() : 'يا بطل';

  const steps = [
    {
      title: `مرحباً بك، ${displayName}! 🚀`,
      subtitle: 'البرمجة بالعامية المصرية من الصفر وحتى الاحتراف',
      description:
        'صُممت منصة "زكي كود" لتأخذك في رحلة تفاعلية ممتعة بعيداً عن الحفظ النظري. كل مفهوم برمجي مشروح بأمثلة واقعية من حياتنا اليومية مع تدريب فوري يثبت المعلومة في ذهنك.',
      icon: <Sparkles className="w-8 h-8 text-amber-400" />,
      badge: 'الخطوة 1 من 4: الترحيب والرؤية',
      tip: 'المنصة مصممة للتطبيق العملي وتجربة كل سطر كود بنفسك.',
      demoNote: null,
    },
    {
      title: 'خريطة الدورة وفصول الكتاب 📚',
      subtitle: 'مسار منظم من 6 أجزاء متدرجة و25 فصلاً',
      description:
        'يغطي الكتاب أساسيات الجافاسكريبت، الدوال، المصفوفات، الكائنات، وبناء واجهات الويب الحية. في نهاية كل جزء ستجد امتحاناً شاملاً وصياد الأخطاء (Bug Hunter) لترسيخ مهاراتك.',
      icon: <BookOpen className="w-8 h-8 text-sky-400" />,
      badge: 'الخطوة 2 من 4: هيكل الدورة والصلاحيات',
      tip: 'يمكنك تصفح الفهرس، والبحث الشامل بأي وقت عبر الضغط على (Ctrl+K).',
      demoNote: 'في الوضع التجريبي يُتاح الجزء الأول للاستكشاف، بينما يفتح كود التفعيل كامل الأجزاء الـ 6 والامتحانات.',
    },
    {
      title: 'محرّر الأكواد والمعاينة الحية 💻',
      subtitle: 'شغّل وجرّب الكود بيدك وشاهد النتيجة فوراً',
      description:
        'يحتوي كل درس على محرر حي لتنفيذ جافاسكريبت وصفحات HTML & CSS. اضغط "تشغيل الكود" (أو اختصار Ctrl+Enter) لرؤية المخرجات بالكونسول، واطلب تلميحات ذكية إن واجهت أي صعوبة.',
      icon: <Terminal className="w-8 h-8 text-emerald-400" />,
      badge: 'الخطوة 3 من 4: بيئة التطبيق العملي',
      tip: 'زر "تشغيل الكود" أو اختصار Ctrl+Enter هما أداتك الأساسية للاختبار والتجربة.',
      demoNote: null,
    },
    {
      title: 'تتبع الإنجاز وأوسمة الشرف 🏆',
      subtitle: 'تقدمك وملاحظاتك محفوظة دائماً محلياً وسحابياً',
      description:
        'مع إتمام كل فصل وتحدٍ برمجي، ستجمع أوسمة شرف تضاف لملفك التعليمي. يمكنك حفظ الدروس المفضلة وتدوين ملاحظاتك للرجوع إليها، وإعادة فتح هذه الجولة متى شئت من قائمة "المزيد" أو اللوحة الرئيسية.',
      icon: <Trophy className="w-8 h-8 text-yellow-400" />,
      badge: 'الخطوة 4 من 4: التقدم والأوسمة',
      tip: 'أنت الآن جاهز تماماً لبدء أول درس والانطلاق في عالم البرمجة!',
      demoNote: null,
    },
  ];

  const step = steps[currentStep];
  const isLast = currentStep === steps.length - 1;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="دليل البدء السريع والجولة التعريفية"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn font-['Cairo',sans-serif]"
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-right text-slate-100 space-y-5 overflow-hidden"
      >
        {/* Subtle Ambient Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header: Badge & Dismiss Button */}
        <div className="flex items-center justify-between relative z-10">
          <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-slate-800 text-amber-300 border border-slate-700">
            {step.badge}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق الجولة التعريفية"
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition active:scale-95"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Indicator Progress Dots */}
        <div className="flex items-center justify-center gap-2 pt-1 relative z-10">
          {steps.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentStep(idx)}
              aria-label={`الانتقال إلى الخطوة ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-200 ${
                idx === currentStep
                  ? 'w-8 bg-amber-400'
                  : 'w-2.5 bg-slate-700 hover:bg-slate-600'
              }`}
            />
          ))}
        </div>

        {/* Icon & Step Headings */}
        <div className="space-y-3 relative z-10 pt-1">
          <div className="w-14 h-14 rounded-2xl bg-slate-800/90 border border-slate-700 flex items-center justify-center shadow-lg shadow-black/40">
            {step.icon}
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
              {step.title}
            </h2>
            <p className="text-xs sm:text-sm font-bold text-amber-400 mt-1">
              {step.subtitle}
            </p>
          </div>
        </div>

        {/* Description Body */}
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed relative z-10 min-h-[56px]">
          {step.description}
        </p>

        {/* Contextual Tip Callout */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3.5 text-xs text-slate-300 flex items-center gap-2.5 font-medium relative z-10">
          <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{step.tip}</span>
        </div>

        {/* Clear Demo Mode Limitations Notice */}
        {step.demoNote && (
          <div className="bg-amber-950/20 border border-amber-500/30 rounded-2xl p-3 text-xs text-amber-300 flex items-center gap-2.5 font-semibold relative z-10">
            <span className="px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 font-bold text-[10px] shrink-0 border border-amber-500/30">
              الوضع التجريبي
            </span>
            <span className="leading-relaxed">{step.demoNote}</span>
          </div>
        )}

        {/* Controls Footer */}
        <div className="flex items-center justify-between gap-3 pt-2 relative z-10 border-t border-slate-800/80">
          {currentStep > 0 ? (
            <Button
              variant="outline"
              size="md"
              onClick={() => setCurrentStep((s) => s - 1)}
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="start"
              className="text-xs sm:text-sm"
            >
              السابق
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="md"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-200 text-xs sm:text-sm"
            >
              تخطي الجولة
            </Button>
          )}

          {isLast ? (
            <Button
              variant="primary"
              size="md"
              icon={<Play className="w-4 h-4 fill-current" />}
              onClick={() => {
                onClose();
                onStartFirstLesson();
              }}
              className="text-xs sm:text-sm shadow-lg shadow-amber-500/20"
            >
              ابدأ الدرس الأول الآن
            </Button>
          ) : (
            <Button
              variant="primary"
              size="md"
              icon={<ArrowLeft className="w-4 h-4" />}
              iconPosition="end"
              onClick={() => setCurrentStep((s) => s + 1)}
              className="text-xs sm:text-sm"
            >
              التالي
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
