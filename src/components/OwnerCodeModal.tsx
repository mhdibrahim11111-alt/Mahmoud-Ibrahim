import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { bookParts } from '../data/bookData';
import {
  CodeRecord,
  fetchAdminCodes,
  adminGenerateCode,
  adminExpireCode,
  adminReactivateCode,
  adminDeleteCode,
  fetchAdminBackup,
} from '../utils/activation';
import {
  KeyRound,
  Plus,
  Copy,
  Check,
  X,
  ShieldCheck,
  Dices,
  Trash2,
  Share2,
  Send,
  Clock,
  User,
  AlertCircle,
  RefreshCw,
  PowerOff,
  RotateCcw,
  Sparkles,
  Code2,
  FileCode2,
  Search,
  MessageSquareHeart,
  Trophy,
  GraduationCap,
  Download,
} from 'lucide-react';
import { sendStudentFeedback } from '../utils/challengesAndTts';

interface OwnerCodeModalProps {
  adminCode: string;
  isOpen: boolean;
  onClose: () => void;
}

export const OwnerCodeModal: React.FC<OwnerCodeModalProps> = ({
  adminCode,
  isOpen,
  onClose,
}) => {
  const [codes, setCodes] = useState<CodeRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [newCustomCode, setNewCustomCode] = useState('');
  const [studentName, setStudentName] = useState('');
  const [durationDays, setDurationDays] = useState<number>(0); // 0 = permanent
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'expired'>('all');
  const [inspectingStudent, setInspectingStudent] = useState<CodeRecord | null>(null);
  const [copiedAdminSnippetId, setCopiedAdminSnippetId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [busyCodeId, setBusyCodeId] = useState<string | null>(null);
  const [recentlyGenerated, setRecentlyGenerated] = useState<CodeRecord | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;
  const [totalCount, setTotalCount] = useState(0);
  const [activeCount, setActiveCount] = useState(0);
  const [expiredCount, setExpiredCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [cursorMap, setCursorMap] = useState<Record<number, string | null>>({ 1: null });
  const searchTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const [adminTab, setAdminTab] = useState<'codes' | 'activity'>('codes');
  const [feedbackTarget, setFeedbackTarget] = useState<{ code: string; studentName: string } | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [isSendingFeedback, setIsSendingFeedback] = useState(false);
  const [isExportingBackup, setIsExportingBackup] = useState(false);

  // Custom delete confirmation state
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; code: string; studentName?: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSendFeedback = async () => {
    if (!feedbackTarget || !feedbackMessage.trim()) return;
    setIsSendingFeedback(true);
    const ok = await sendStudentFeedback(feedbackTarget.code, feedbackMessage.trim());
    setIsSendingFeedback(false);
    if (ok) {
      showNotification('تم إرسال رسالة التشجيع للطالب بنجاح! 💌');
      setFeedbackTarget(null);
      setFeedbackMessage('');
      await loadCodes(currentPage);
    } else {
      showNotification('تعذر إرسال الرسالة، حاول مرة أخرى.', 'error');
    }
  };

  const handleDownloadBackup = async () => {
    if (isExportingBackup) return;
    setIsExportingBackup(true);
    try {
      const result = await fetchAdminBackup();
      if (!result.success || !result.backup) {
        showNotification(result.message || 'تعذر إنشاء النسخة الاحتياطية.', 'error');
        return;
      }
      const blob = new Blob([JSON.stringify(result.backup, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `zaki-code-backup-${new Date(result.backup.createdAt).toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      showNotification('تم تنزيل النسخة. احتفظ بها في مكان آمن.');
    } finally {
      setIsExportingBackup(false);
    }
  };

  const loadCodes = async (
    targetPage = currentPage,
    overrides?: {
      filter?: 'all' | 'active' | 'expired';
      search?: string;
      cursor?: string | null;
    }
  ) => {
    setLoading(true);
    const activeFilter = overrides?.filter ?? filter;
    const activeSearch = overrides?.search !== undefined ? overrides.search : searchQuery;
    const targetCursor =
      overrides?.cursor !== undefined
        ? overrides.cursor
        : (cursorMap[targetPage] || null);

    try {
      const res = await fetchAdminCodes(adminCode, {
        page: targetPage,
        pageSize: 8,
        filter: activeFilter,
        search: activeSearch.trim() || undefined,
        cursor: targetCursor,
      });

      if (res.success) {
        setCodes(res.codes);
        setTotalCount(res.totalCount ?? res.codes.length);
        setActiveCount(res.activeCount ?? 0);
        setExpiredCount(res.expiredCount ?? 0);
        setCurrentPage(res.page ?? targetPage);
        setTotalPages(res.totalPages ?? 1);

        if (res.nextCursor) {
          const nextKey = (res.page ?? targetPage) + 1;
          const nextVal: string = res.nextCursor;
          setCursorMap((prev) => {
            const nextMap: Record<number, string | null> = { ...prev };
            nextMap[nextKey] = nextVal;
            return nextMap;
          });
        }
      } else {
        setNotice({ text: res.message || 'فشل تحميل الأكواد', type: 'error' });
      }
    } catch {
      setNotice({ text: 'تعذر الاتصال بالخادم لتحميل الأكواد.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (newVal: string) => {
    setSearchQuery(newVal);
    setCurrentPage(1);
    setCursorMap({ 1: null });

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      loadCodes(1, { search: newVal, cursor: null });
    }, 350);
  };

  const handleFilterChange = (newFilter: 'all' | 'active' | 'expired') => {
    setFilter(newFilter);
    setCurrentPage(1);
    setCursorMap({ 1: null });
    loadCodes(1, { filter: newFilter, cursor: null });
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages || loading) return;
    loadCodes(newPage);
  };

  useEffect(() => {
    if (isOpen) {
      loadCodes(1);
    }
  }, [isOpen, adminCode]);

  if (!isOpen) return null;

  const showNotification = (text: string, type: 'success' | 'error' = 'success') => {
    setNotice({ text, type });
    setTimeout(() => setNotice(null), 3500);
  };

  const handleGenerate = async (useRandom = false) => {
    if (isGenerating) return;
    setIsGenerating(true);
    try {
      const res = await adminGenerateCode(adminCode, {
        studentName: studentName.trim() || undefined,
        customCode: useRandom ? undefined : newCustomCode.trim() || undefined,
        durationDays,
      });

      if (res.success && res.code) {
        setRecentlyGenerated(res.code);
        setNewCustomCode('');
        setStudentName('');
        showNotification(res.message);
        setCurrentPage(1);
        setCursorMap({ 1: null });
        await loadCodes(1, { cursor: null });
      } else {
        showNotification(res.message || 'تعذر إنشاء الكود.', 'error');
      }
    } catch {
      showNotification('تعذر الاتصال بالخادم لإنشاء الكود.', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExpire = async (codeId: string) => {
    setBusyCodeId(codeId);
    try {
      const res = await adminExpireCode(adminCode, codeId);
      if (res.success) {
        showNotification(res.message);
        await loadCodes();
      } else {
        showNotification(res.message, 'error');
      }
    } finally {
      setBusyCodeId(null);
    }
  };

  const handleReactivate = async (codeId: string, days = 30) => {
    setBusyCodeId(codeId);
    try {
      const res = await adminReactivateCode(adminCode, codeId, days);
      if (res.success) {
        showNotification(res.message);
        await loadCodes();
      } else {
        showNotification(res.message, 'error');
      }
    } finally {
      setBusyCodeId(null);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget || isDeleting) return;

    setIsDeleting(true);
    setBusyCodeId(deleteTarget.id);
    try {
      const res = await adminDeleteCode(adminCode, deleteTarget.id);
      if (res.success) {
        showNotification(res.message);
        setDeleteTarget(null);
        await loadCodes(currentPage);
      } else {
        showNotification(res.message || 'تعذر حذف الكود.', 'error');
      }
    } catch {
      showNotification('حدث خطأ أثناء محاولة حذف الكود.', 'error');
    } finally {
      setIsDeleting(false);
      setBusyCodeId(null);
    }
  };

  const handleCopy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      showNotification('لم نتمكن من النسخ. تحقق من إذن الحافظة في المتصفح.', 'error');
    }
  };

  const handleCopyInvite = (code: CodeRecord) => {
    const appUrl = window.location.origin;
const msg = `أهلاً بك يا بطل! 🚀\nتم تفعيل اشتراكك في منصة "زكي كود" لتعلم البرمجة.\n\n👤 الطالب: ${code.studentName}\n🔑 كود التفعيل: ${code.code}\n🌐 رابط المنصة: ${appUrl}\n\nافتح الرابط وضع الكود لبدء المذاكرة ومختبر الأكواد فوراً!`;    handleCopy(msg, `msg-${code.id}`);
  };

  const isCurrentlyActive = (code: CodeRecord) =>
    code.status === 'active' && (!code.expiresAt || Date.parse(code.expiresAt) >= Date.now());
  const pageStart = (currentPage - 1) * pageSize;
  const currentFilterCount =
    filter === 'active' ? activeCount : filter === 'expired' ? expiredCount : totalCount;
  const totalChapterCount = bookParts.reduce((total, part) => total + part.chapters.length, 0);

  return createPortal(
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center overflow-y-auto p-3 sm:p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-5xl w-full h-[calc(100dvh-1.5rem)] sm:h-[calc(100dvh-2rem)] max-h-[calc(100dvh-1.5rem)] sm:max-h-[calc(100dvh-2rem)] min-h-0 shrink-0 flex flex-col shadow-2xl text-slate-100 overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-amber-500/20">
              👑
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-white text-base sm:text-lg">
                  لوحة تحكم المدير (Admin Dashboard)
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                  صلاحية كاملة
                </span>
              </div>
              <p className="text-xs text-slate-400">إدارة الاشتراكات ومتابعة تقدم الطلاب</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => void handleDownloadBackup()}
              disabled={isExportingBackup}
              className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-semibold text-emerald-300 hover:text-white hover:bg-emerald-900/40 disabled:opacity-50 transition"
              title="تنزيل نسخة يدوية من بيانات الطلاب"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">{isExportingBackup ? 'جارٍ تجهيز النسخة…' : 'نسخة احتياطية'}</span>
            </button>
            <button
              onClick={() => void loadCodes(currentPage)}
              disabled={loading}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="تحديث القائمة"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notice alert */}
        {notice && (
          <div
            className={`px-4 py-2.5 text-xs font-semibold flex items-center gap-2 shrink-0 ${
              notice.type === 'error'
                ? 'bg-rose-950/80 text-rose-300 border-b border-rose-900'
                : 'bg-emerald-950/80 text-emerald-300 border-b border-emerald-900'
            }`}
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{notice.text}</span>
          </div>
        )}

        {/* Admin Navigation Tabs */}
        <div className="flex items-center gap-2 px-4 sm:px-5 bg-slate-950/40 border-b border-slate-800 shrink-0">
          <button
            type="button"
            onClick={() => setAdminTab('codes')}
            className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition flex items-center gap-2 ${
              adminTab === 'codes'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>إدارة الأكواد والاشتراكات ({codes.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setAdminTab('activity')}
            className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition flex items-center gap-2 ${
              adminTab === 'activity'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>سجل نشاط وأعمال الطلاب 👨‍🎓</span>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 sm:p-5 space-y-5 custom-scrollbar">
          {adminTab === 'codes' && (
            <>
              {/* Quick Stats Bar */}
              <div className="grid grid-cols-3 gap-2.5 sm:gap-3 text-center">
                <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                  <span className="text-[11px] text-slate-400 block mb-0.5">إجمالي الأكواد</span>
                  <strong className="text-lg sm:text-xl font-bold text-white font-mono">{codes.length}</strong>
                </div>
                <div className="p-3 bg-emerald-950/30 rounded-2xl border border-emerald-900/40">
                  <span className="text-[11px] text-emerald-400 block mb-0.5">أكواد فعالة</span>
                  <strong className="text-lg sm:text-xl font-bold text-emerald-300 font-mono">{activeCount}</strong>
                </div>
                <div className="p-3 bg-rose-950/30 rounded-2xl border border-rose-900/40">
                  <span className="text-[11px] text-rose-400 block mb-0.5">منتهية / ملغية</span>
                  <strong className="text-lg sm:text-xl font-bold text-rose-300 font-mono">{expiredCount}</strong>
                </div>
              </div>

          {/* Code Generator Card */}
          <div className="bg-slate-950 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-amber-400 flex items-center gap-2">
                <Plus className="w-4 h-4" />
                <span>إنشاء كود جديد لطالب</span>
              </span>
              <span className="text-[11px] text-slate-500">مخزن بالسيرفر ويعمل من أي جهاز</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Student Name */}
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                  اسم الطالب / المشترك (اختياري):
                </label>
                <div className="relative">
                  <input
                    type="text"
                    maxLength={100}
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="مثال: أحمد إبراهيم"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500"
                  />
                  <User className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Expiration Duration */}
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                  مدة الصلاحية:
                </label>
                <div className="relative">
                  <select
                    value={durationDays}
                    onChange={(e) => setDurationDays(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value={0}>بدون انتهاء (دائم مدى الحياة)</option>
                    <option value={7}>7 أيام (تجريبي)</option>
                    <option value={30}>شهر (30 يوماً)</option>
                    <option value={90}>3 شهور (90 يوماً)</option>
                    <option value={180}>6 شهور (نصف سنة)</option>
                    <option value={365}>سنة كاملة (365 يوماً)</option>
                  </select>
                  <Clock className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Custom Code Input + Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 pt-1">
              <input
                type="text"
                maxLength={32}
                value={newCustomCode}
                onChange={(e) => setNewCustomCode(e.target.value.toUpperCase())}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newCustomCode.trim() && !isGenerating) {
                    e.preventDefault();
                    void handleGenerate(false);
                  }
                }}
                placeholder="كود مخصص يدوي (مثال: AHMED-2026)"
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-amber-300 font-mono font-bold uppercase focus:outline-none focus:border-amber-500"
              />

              <button
                type="button"
                onClick={() => handleGenerate(false)}
                disabled={isGenerating || !newCustomCode.trim()}
                className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition active:scale-95 disabled:opacity-40"
              >
                <Check className="w-4 h-4" />
                <span>{isGenerating ? 'جاري الإنشاء...' : 'إنشاء الكود المخصص'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleGenerate(true)}
                disabled={isGenerating}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition active:scale-95 shadow"
              >
                <Dices className="w-4 h-4" />
                <span>{isGenerating ? 'جاري الإنشاء...' : 'توليد كود آمن 🎲'}</span>
              </button>
            </div>
          </div>

          {recentlyGenerated && (
            <div className="bg-emerald-950/40 border border-emerald-700/60 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-emerald-300">تم إنشاء الاشتراك وحفظه. أرسل هذا الكود للطالب:</p>
                <p dir="ltr" className="mt-1 text-xl font-black font-mono tracking-[0.18em] text-white">
                  {recentlyGenerated.code}
                </p>
                <p className="mt-1 text-[11px] text-emerald-200/70">
                  {recentlyGenerated.studentName} · {recentlyGenerated.expiresAt
                    ? `ينتهي ${new Date(recentlyGenerated.expiresAt).toLocaleDateString('ar-EG')}`
                    : 'بدون انتهاء'}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => void handleCopy(recentlyGenerated.code, 'recent-code')}
                  className="px-3 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5"
                >
                  {copiedKey === 'recent-code' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copiedKey === 'recent-code' ? 'تم النسخ' : 'نسخ الكود'}
                </button>
                <button
                  type="button"
                  onClick={() => void handleCopyInvite(recentlyGenerated)}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-bold flex items-center gap-1.5"
                >
                  <Share2 className="w-4 h-4" /> دعوة الطالب
                </button>
              </div>
            </div>
          )}

          {/* Codes List Section */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-white">قائمة الأكواد الصادرة:</span>
                <span className="text-xs text-slate-500 font-mono">({currentFilterCount})</span>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                <label className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(event) => handleSearchChange(event.target.value)}
                    placeholder="ابحث بالاسم أو الكود"
                    className="w-full sm:w-52 bg-slate-950 border border-slate-800 rounded-xl pr-8 pl-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                    aria-label="ابحث عن طالب أو كود"
                  />
                </label>
                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                <button
                  type="button"
                  onClick={() => handleFilterChange('all')}
                  className={`px-2.5 py-1 rounded-lg transition ${
                    filter === 'all' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  الكل ({totalCount})
                </button>
                <button
                  type="button"
                  onClick={() => handleFilterChange('active')}
                  className={`px-2.5 py-1 rounded-lg transition ${
                    filter === 'active' ? 'bg-emerald-950 text-emerald-300 font-bold border border-emerald-800' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  فعال ({activeCount})
                </button>
                <button
                  type="button"
                  onClick={() => handleFilterChange('expired')}
                  className={`px-2.5 py-1 rounded-lg transition ${
                    filter === 'expired' ? 'bg-rose-950 text-rose-300 font-bold border border-rose-800' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  منتهي ({expiredCount})
                </button>
                </div>
              </div>
            </div>

            {/* List */}
            {loading ? (
              <div className="text-center py-8 bg-slate-950 rounded-2xl border border-slate-800 text-slate-400 text-xs flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin" /> جاري تحميل لوحة الطلاب...
              </div>
            ) : codes.length === 0 ? (
              <div className="text-center py-8 bg-slate-950 rounded-2xl border border-slate-800 text-slate-500 text-xs">
                {searchQuery.trim() ? 'لا توجد نتائج تطابق البحث.' : 'لا توجد أكواد في هذا التصنيف حالياً.'}
              </div>
            ) : (
              <div className="space-y-2">
                {codes.map((c) => {
                  const isActive = isCurrentlyActive(c);
                  const isExpired = c.status === 'expired' || (c.status === 'active' && !isActive);
                  const isRevoked = c.status === 'revoked';

                  return (
                    <div
                      key={c.id}
                      className={`p-3.5 rounded-2xl border transition space-y-2.5 ${
                        isActive
                          ? 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                          : 'bg-slate-950/40 border-slate-800/50 opacity-80'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        {/* Left: Code info */}
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono font-black text-amber-300 text-base tracking-wider bg-slate-900 px-2.5 py-1 rounded-xl border border-slate-800">
                            {c.code}
                          </span>

                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-white flex items-center gap-1.5">
                              <span>{c.studentName || 'طالب مجهول'}</span>
                            </span>
                            <span className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                              <span>
                                {c.expiresAt
                                  ? `ينتهي في: ${new Date(c.expiresAt).toLocaleDateString('ar-EG')}`
                                  : 'صلاحية غير محدودة (دائم)'}
                              </span>
                              <span>•</span>
                              <span>استُخدم {c.usedCount || 0} مرة</span>
                            </span>
                          </div>
                        </div>

                        {/* Status badge */}
                        <div>
                          {isActive && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                              ✓ نشط وفعال
                            </span>
                          )}
                          {isExpired && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30">
                              منتهي الصلاحية
                            </span>
                          )}
                          {isRevoked && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                              ملغي من الإدارة
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Student Progress Track */}
                      {(() => {
                        const completedChs = Math.min(totalChapterCount, new Set(c.progress?.completedChapters || []).size);
                        const completedQz = Math.min(bookParts.length, new Set(c.progress?.completedQuizzes || []).size);
                        const percent = Math.round(((completedChs + completedQz) / (totalChapterCount + bookParts.length)) * 100);

                        return (
                          <div className="bg-slate-900/90 rounded-xl p-2.5 border border-slate-800/80 text-[11px] space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-slate-300 font-medium flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                <span>إنجاز هذا الطالب:</span>
                                <strong className="text-amber-300 font-bold">{completedChs} من {totalChapterCount} فصل</strong>
                                <span className="text-emerald-400 text-[10px]">({completedQz} من {bookParts.length} اختبارات)</span>
                              </span>
                              <span className="font-mono font-bold text-white text-xs">{percent}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full transition-all duration-300"
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                          </div>
                        );
                      })()}

                      {/* Actions toolbar */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-900 text-xs">
                        <div className="flex items-center gap-1.5">
                          {/* Copy code only */}
                          <button
                            type="button"
                            onClick={() => handleCopy(c.code, `code-${c.id}`)}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold transition"
                          >
                            {copiedKey === `code-${c.id}` ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="text-emerald-400">تم النسخ</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5 text-slate-400" />
                                <span>نسخ الكود</span>
                              </>
                            )}
                          </button>

                          {/* Copy WhatsApp invite */}
                          <button
                            type="button"
                            onClick={() => handleCopyInvite(c)}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-800/60 text-emerald-300 text-[11px] font-semibold transition"
                          >
                            {copiedKey === `msg-${c.id}` ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span>تم نسخ الدعوة</span>
                              </>
                            ) : (
                              <>
                                <Send className="w-3.5 h-3.5 text-emerald-400" />
                                <span>دعوة واتساب جاهزة 💬</span>
                              </>
                            )}
                          </button>

                          {/* View Student Written Codes */}
                          <button
                            type="button"
                            onClick={() => setInspectingStudent(c)}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-950/60 hover:bg-indigo-900/80 border border-indigo-800/60 text-indigo-300 text-[11px] font-semibold transition"
                            title="عرض وفحص الأكواد والمشاريع التي كتبها هذا الطالب في حسابه"
                          >
                            <Code2 className="w-3.5 h-3.5 text-indigo-400" />
                            <span>
                              أكواد الطالب 💻{' '}
                              {c.savedSnippets && c.savedSnippets.length > 0
                                ? `(${c.savedSnippets.length})`
                                : ''}
                            </span>
                          </button>
                        </div>

                        {/* Lifecycle buttons: Expire, Reactivate, Delete */}
                        <div className="flex items-center gap-1.5">
                          {isActive ? (
                            <button
                              type="button"
                              onClick={() => handleExpire(c.id)}
                              disabled={busyCodeId === c.id}
                              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-950/40 hover:bg-amber-900/60 border border-amber-900/50 text-amber-300 text-[11px] font-semibold transition"
                              title="إنهاء صلاحية هذا الكود فوراً"
                            >
                              <PowerOff className="w-3 h-3 text-amber-400" />
                              <span>إنهاء الصلاحية (Expire)</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleReactivate(c.id, 30)}
                              disabled={busyCodeId === c.id}
                              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-900/50 text-emerald-300 text-[11px] font-semibold transition"
                              title="إعادة تفعيل الكود لمدة 30 يوماً"
                            >
                              <RotateCcw className="w-3 h-3 text-emerald-400" />
                              <span>إعادة تفعيل 🔄</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => setDeleteTarget({ id: c.id, code: c.code, studentName: c.studentName })}
                            disabled={busyCodeId === c.id}
                            className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-950 hover:text-rose-400 text-slate-500 border border-slate-800 transition"
                            title="حذف نهائي من قاعدة البيانات"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {!loading && totalPages > 1 && (
              <div className="flex flex-col gap-2 border-t border-slate-800 pt-3 sm:flex-row sm:items-center sm:justify-between" dir="rtl">
                <span className="text-[11px] text-slate-400">
                  عرض {pageStart + 1}–{Math.min(pageStart + codes.length, currentFilterCount)} من {currentFilterCount}
                </span>
                <div className="flex items-center justify-between gap-2 sm:justify-end">
                  <button
                    type="button"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1 || loading}
                    className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    السابق
                  </button>
                  <span className="min-w-20 text-center text-xs text-slate-400 font-mono">
                    صفحة {currentPage} من {totalPages}
                  </span>
                  <button
                    type="button"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages || loading}
                    className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    التالي
                  </button>
                </div>
              </div>
            )}
          </div>
            </>
          )}

          {/* Tab 2: Student Activity Feed & Submissions */}
          {adminTab === 'activity' && (
            <div className="space-y-4">
              {/* Activity Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-center">
                  <span className="text-xs text-slate-400 block mb-1">إجمالي الطلاب المسجلين</span>
                  <strong className="text-2xl font-bold text-white font-mono">{totalCount}</strong>
                </div>
                <div className="p-4 bg-amber-950/20 rounded-2xl border border-amber-900/30 text-center">
                  <span className="text-xs text-amber-400 block mb-1">التحديات البرمجية المنجزة</span>
                  <strong className="text-2xl font-bold text-amber-300 font-mono">
                    {codes.reduce((acc, c) => acc + ((c.progress as { completedChallenges?: string[] })?.completedChallenges?.length || 0), 0)}
                  </strong>
                </div>
                <div className="p-4 bg-indigo-950/20 rounded-2xl border border-indigo-900/30 text-center">
                  <span className="text-xs text-indigo-400 block mb-1">المشاريع المحفوظة بالمعمل</span>
                  <strong className="text-2xl font-bold text-indigo-300 font-mono">
                    {codes.reduce((acc, c) => acc + (c.savedSnippets?.length || 0), 0)}
                  </strong>
                </div>
              </div>

              {/* Students Activity Feed */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-amber-400" />
                    <span>متابعة تفاعل وإنجاز الطلاب الأكاديمي:</span>
                  </h4>
                  <span className="text-xs text-slate-500 font-mono">({totalCount} طالب)</span>
                </div>

                {codes.length === 0 ? (
                  <div className="p-8 text-center bg-slate-950 rounded-2xl border border-slate-800 text-slate-500 text-xs">
                    لا يوجد طلاب مسجلين بعد. أنشئ كوداً جديداً من تبويب إدارة الأكواد!
                  </div>
                ) : (
                  codes.map((student) => {
                    const completedChallengesCount =
                      (student.progress as { completedChallenges?: string[] })?.completedChallenges?.length || 0;
                    const completedChaptersCount = student.progress?.completedChapters?.length || 0;
                    const snippetsCount = student.savedSnippets?.length || 0;
                    const hasDraft = Boolean(student.draftCode && student.draftCode.trim());
                    const studentFeedback = (student as { feedback?: string }).feedback;

                    return (
                      <div
                        key={student.id}
                        className="bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 transition space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center font-bold text-amber-400 text-base shadow-sm">
                              👤
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-white text-sm sm:text-base">
                                  {student.studentName || 'طالب بدون اسم'}
                                </span>
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-900 text-amber-300 border border-slate-800">
                                  {student.code}
                                </span>
                              </div>
                              <span className="text-[11px] text-slate-500 block">
                                آخر استخدام: {student.lastUsedAt ? new Date(student.lastUsedAt).toLocaleDateString('ar-EG') : 'لم يدخل بعد'} • مرات الدخول: {student.usedCount}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-center">
                            <button
                              type="button"
                              onClick={() => {
                                setFeedbackTarget({
                                  code: student.code,
                                  studentName: student.studentName || student.code,
                                });
                                setFeedbackMessage(studentFeedback || '');
                              }}
                              className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition active:scale-95"
                              title="إرسال رسالة تشجيع للطالب تظهر في حسابه"
                            >
                              <MessageSquareHeart className="w-3.5 h-3.5" />
                              <span>{studentFeedback ? 'تعديل التشجيع 💌' : 'إرسال تشجيع 💌'}</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setInspectingStudent(student)}
                              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition active:scale-95 shadow shadow-indigo-600/20"
                              title="استعراض مسودة كود الطالب ومشاريعه المحفوظة"
                            >
                              <FileCode2 className="w-3.5 h-3.5" />
                              <span>أكواد الطالب 🔍</span>
                            </button>
                          </div>
                        </div>

                        {/* Progress Badges */}
                        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-900 text-xs">
                          <span className="px-2.5 py-1 rounded-lg bg-yellow-950/30 text-yellow-300 border border-yellow-800/40 flex items-center gap-1 text-[11px] font-semibold">
                            <Trophy className="w-3 h-3 text-yellow-400" />
                            <span>{completedChallengesCount} / 6 تحديات محلولة</span>
                          </span>

                          <span className="px-2.5 py-1 rounded-lg bg-emerald-950/30 text-emerald-300 border border-emerald-800/40 flex items-center gap-1 text-[11px] font-semibold">
                            <span>📖 {completedChaptersCount} فصول منتهية</span>
                          </span>

                          <span className="px-2.5 py-1 rounded-lg bg-indigo-950/30 text-indigo-300 border border-indigo-800/40 flex items-center gap-1 text-[11px] font-semibold">
                            <span>💾 {snippetsCount} مشاريع محفوظة</span>
                          </span>

                          {hasDraft && (
                            <span className="px-2 py-0.5 rounded-md bg-slate-900 text-slate-400 text-[10px]">
                              📝 لديه كود نشط بالمحرر
                            </span>
                          )}

                          {studentFeedback && (
                            <span className="px-2.5 py-0.5 rounded-md bg-purple-950/40 text-purple-300 border border-purple-800/40 text-[10px] flex items-center gap-1">
                              <span>💌 رسالتك: "{studentFeedback.slice(0, 30)}..."</span>
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {!loading && totalPages > 1 && (
                <div className="flex flex-col gap-2 border-t border-slate-800 pt-3 sm:flex-row sm:items-center sm:justify-between" dir="rtl">
                  <span className="text-[11px] text-slate-400">
                    عرض {pageStart + 1}–{Math.min(pageStart + codes.length, totalCount)} من {totalCount} طالب
                  </span>
                  <div className="flex items-center justify-between gap-2 sm:justify-end">
                    <button
                      type="button"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage <= 1 || loading}
                      className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      السابق
                    </button>
                    <span className="min-w-20 text-center text-xs text-slate-400 font-mono">
                      صفحة {currentPage} من {totalPages}
                    </span>
                    <button
                      type="button"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage >= totalPages || loading}
                      className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      التالي
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between shrink-0 bg-slate-950/50">
          <span className="text-[11px] text-slate-400">
            🔒 كود الإدارة هو مفتاح التحكم الوحيد ولا يظهر للطلاب.
          </span>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition"
          >
            إغلاق
          </button>
        </div>
      </div>

      {/* Student Written Codes Inspector Modal (For Teacher/Admin) */}
      {inspectingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl animate-scaleUp">
            {/* Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 flex items-center justify-center font-bold text-lg">
                  💻
                </div>
                <div>
                  <h3 className="font-black text-white text-base flex items-center gap-2">
                    <span>أكواد ومشاريع الطالب:</span>
                    <span className="text-amber-300 font-mono">
                      {inspectingStudent.studentName || inspectingStudent.code}
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono">
                    كود التفعيل: {inspectingStudent.code}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setInspectingStudent(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {/* Draft / current work */}
              {inspectingStudent.draftCode ? (
                <div className="bg-slate-950 border border-amber-500/30 rounded-xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>الكود النشط حالياً في محرر الطالب (Current Draft):</span>
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(inspectingStudent.draftCode || '');
                        setCopiedAdminSnippetId('draft');
                        setTimeout(() => setCopiedAdminSnippetId(null), 2000);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1"
                    >
                      {copiedAdminSnippetId === 'draft' ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400 text-[11px]">تم النسخ</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span className="text-[11px]">نسخ</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre
                    dir="ltr"
                    className="p-3 bg-slate-900 text-amber-200 font-mono text-xs rounded-lg overflow-x-auto max-h-48 border border-slate-800"
                  >
                    {inspectingStudent.draftCode}
                  </pre>
                </div>
              ) : null}

              {/* Saved Snippets */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-300">
                  الأكواد والمشاريع المحفوظة رسمياً ({inspectingStudent.savedSnippets?.length || 0}):
                </h4>

                {!inspectingStudent.savedSnippets || inspectingStudent.savedSnippets.length === 0 ? (
                  <div className="p-6 text-center text-slate-500 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                    لم يقم الطالب بحفظ مشاريع منفصلة باسم مخصص بعد.
                  </div>
                ) : (
                  inspectingStudent.savedSnippets.map((s) => (
                    <div
                      key={s.id}
                      className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileCode2 className="w-4 h-4 text-indigo-400" />
                          <span className="font-bold text-white text-xs sm:text-sm">{s.title}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 text-slate-400 border border-slate-800 font-mono">
                            {s.language}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-500 font-mono">
                            {new Date(s.updatedAt || s.createdAt).toLocaleString('ar-EG')}
                          </span>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(s.code);
                              setCopiedAdminSnippetId(s.id);
                              setTimeout(() => setCopiedAdminSnippetId(null), 2000);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1"
                          >
                            {copiedAdminSnippetId === s.id ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span className="text-emerald-400 text-[11px]">تم النسخ</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span className="text-[11px]">نسخ الكود</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      <pre
                        dir="ltr"
                        className="p-3 bg-slate-900 text-slate-200 font-mono text-xs rounded-lg overflow-x-auto max-h-48 border border-slate-800 whitespace-pre"
                      >
                        {s.code}
                      </pre>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Teacher Encouragement Feedback Modal */}
      {feedbackTarget && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <MessageSquareHeart className="w-5 h-5 text-amber-400" />
                <h4 className="font-bold text-white text-sm">
                  رسالة تشجيع لـ: {feedbackTarget.studentName}
                </h4>
              </div>
              <button
                onClick={() => setFeedbackTarget(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1.5 font-semibold">
                اكتب رسالة ملاحظة أو تشجيع ستظهر فوراً للطالب عند دخوله المنصة:
              </label>
              <textarea
                rows={4}
                value={feedbackMessage}
                onChange={(e) => setFeedbackMessage(e.target.value)}
                placeholder="مثال: عاش يا بطل، حلك لتحدي المصفوفات ممتاز جداً! ركز الآن على الفصل الخامس 🌟"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500 placeholder:text-slate-600 resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setFeedbackTarget(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleSendFeedback}
                disabled={isSendingFeedback || !feedbackMessage.trim()}
                className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl transition flex items-center gap-1.5 disabled:opacity-40"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSendingFeedback ? 'جاري الإرسال...' : 'إرسال التشجيع 💌'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Custom Arabic Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-rose-500/30 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden p-6 space-y-5 animate-scaleUp">
            {/* Header Icon & Title */}
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center shadow-lg shadow-rose-500/10 mb-1">
                <Trash2 className="w-7 h-7" />
              </div>
              <h3 className="font-black text-white text-lg">
                تأكيد حذف كود الطالب نهائياً
              </h3>
              <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                هل أنت متأكد من رغبتك في حذف هذا الكود نهائياً من قاعدة بيانات Firestore؟
              </p>
            </div>

            {/* Targeted Code Details */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-2 text-center">
              <span className="text-[11px] text-slate-500 block">كود التفعيل المحدد للحذف:</span>
              <div className="inline-block px-3.5 py-1.5 rounded-lg bg-rose-950/30 border border-rose-800/40 font-mono font-bold text-amber-300 text-sm tracking-wider">
                {deleteTarget.code}
              </div>
              {deleteTarget.studentName && (
                <div className="text-xs text-slate-300 font-medium">
                  الطالب المسجل: <span className="text-white font-bold">{deleteTarget.studentName}</span>
                </div>
              )}
            </div>

            {/* Warning Note */}
            <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 text-[11px] text-amber-300 leading-relaxed text-right dir-rtl">
              ⚠️ <strong>تنبيه هام:</strong> هذا الإجراء غير قابل للتراجع. سيتم حذف الكود وإلغاء صلاحية الوصول ومسح تقدم الطالب ومسوداته المحفوظة فوراً.
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-1">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-bold transition disabled:opacity-50"
              >
                إلغاء
              </button>

              <button
                type="button"
                onClick={confirmDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-lg shadow-rose-600/30 disabled:opacity-50 active:scale-95"
              >
                {isDeleting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>جاري الحذف...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>حذف نهائي</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>,
    document.body,
  );
};
