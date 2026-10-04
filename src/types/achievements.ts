export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'chapters' | 'bughunter' | 'capstones' | 'notes' | 'playground';
  isUnlocked: (stats: StudentStats) => boolean;
  progressText: (stats: StudentStats) => string;
}

export interface StudentStats {
  completedChaptersCount: number;
  completedQuizzesCount: number;
  completedExamPartsCount: number;
  savedSnippetsCount: number;
  notesCount: number;
  bookmarkedCount: number;
}

export const ALL_BADGES: Badge[] = [
  {
    id: 'first-step',
    title: 'أول خطوة 🌟',
    description: 'أتممت دراسة أول فصل برمجياً بنجاح!',
    icon: '🚀',
    category: 'chapters',
    isUnlocked: (s) => s.completedChaptersCount >= 1,
    progressText: (s) => `${Math.min(s.completedChaptersCount, 1)} / 1 فصل`,
  },
  {
    id: 'fast-learner',
    title: 'المتدرب السريع ⚡',
    description: 'أتممت 5 فصول دراسية كاملة.',
    icon: '⚡',
    category: 'chapters',
    isUnlocked: (s) => s.completedChaptersCount >= 5,
    progressText: (s) => `${Math.min(s.completedChaptersCount, 5)} / 5 فصول`,
  },
  {
    id: 'halfway-hero',
    title: 'نصف الطريق 📚',
    description: 'قطعت نصف المسار وأتممت 12 فصلاً!',
    icon: '🔥',
    category: 'chapters',
    isUnlocked: (s) => s.completedChaptersCount >= 12,
    progressText: (s) => `${Math.min(s.completedChaptersCount, 12)} / 12 فصلاً`,
  },
  {
    id: 'master-graduate',
    title: 'خريج كود بالمصري 🎓',
    description: 'أنهيت الـ 25 فصلاً بالكامل.. إنجاز أسطوري!',
    icon: '👑',
    category: 'chapters',
    isUnlocked: (s) => s.completedChaptersCount >= 25,
    progressText: (s) => `${Math.min(s.completedChaptersCount, 25)} / 25 فصلاً`,
  },
  {
    id: 'bug-buster',
    title: 'صياد أخطاء مبتدئ 🐛',
    description: 'اكتشفت وصلحت أول خطأ برمجي في كويز صياد الأخطاء.',
    icon: '🔍',
    category: 'bughunter',
    isUnlocked: (s) => s.completedQuizzesCount >= 1,
    progressText: (s) => `${Math.min(s.completedQuizzesCount, 1)} / 1 كويز`,
  },
  {
    id: 'master-bug-hunter',
    title: 'سيد صيادي الأخطاء 🏆',
    description: 'أكملت جميع كويزات صياد الأخطاء الـ 6 بلا استثناء!',
    icon: '🎯',
    category: 'bughunter',
    isUnlocked: (s) => s.completedQuizzesCount >= 6,
    progressText: (s) => `${Math.min(s.completedQuizzesCount, 6)} / 6 كويزات`,
  },
  {
    id: 'capstone-engineer',
    title: 'مهندس المشاريع 🏗️',
    description: 'أكملت أول تحدٍ شامل في ملخص أحد الأجزاء.',
    icon: '🛠️',
    category: 'capstones',
    isUnlocked: (s) => s.completedExamPartsCount >= 1,
    progressText: (s) => `${Math.min(s.completedExamPartsCount, 1)} / 1 تحدٍ شامل`,
  },
  {
    id: 'legend-developer',
    title: 'الأسطورة البرمجية 💎',
    description: 'أنجزت جميع التحديات الشاملة للأجزاء الـ 6 بنجاح!',
    icon: '💎',
    category: 'capstones',
    isUnlocked: (s) => s.completedExamPartsCount >= 6,
    progressText: (s) => `${Math.min(s.completedExamPartsCount, 6)} / 6 أجزاء`,
  },
  {
    id: 'code-crafter',
    title: 'مبتكر الأكواد 💻',
    description: 'أنشأت وحفظت أول مشروع أو Snippet في الملعب البرمجي.',
    icon: '💻',
    category: 'playground',
    isUnlocked: (s) => s.savedSnippetsCount >= 1,
    progressText: (s) => `${Math.min(s.savedSnippetsCount, 1)} / 1 مشروع`,
  },
  {
    id: 'dedicated-notetaker',
    title: 'المبرمج المنظم 📝',
    description: 'دوّنت أول ملحوظة شخصية خاصة بك داخل أحد الفصول.',
    icon: '📝',
    category: 'notes',
    isUnlocked: (s) => s.notesCount >= 1,
    progressText: (s) => `${Math.min(s.notesCount, 1)} / 1 ملاحظة`,
  },
];
