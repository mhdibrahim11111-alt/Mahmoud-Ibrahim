import React, { useState, useEffect, useRef } from 'react';
import { bookParts } from '../data/bookData';
import {
  CodeRecord,
  fetchAdminCodes,
  adminGenerateCode,
  adminExpireCode,
  adminReactivateCode,
  adminDeleteCode,
  adminEditCode,
  adminUpdateMasterCode,
  fetchAdminBackup,
  restoreAdminBackup,
  adminRevokeAllSessions,
  adminRotateAdminCode,
} from '../utils/activation';
import {
  KeyRound,
  Plus,
  Copy,
  Check,
  X,
  ShieldCheck,
  ShieldAlert,
  Key,
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
  Upload,
  School,
  Users,
  Pencil,
  CheckCircle2,
  Filter,
  BarChart3,
  Calendar,
  Lock,
} from 'lucide-react';
import { sendStudentFeedback } from '../utils/challengesAndTts';

interface AdminDashboardProps {
  activeCode: string;
  role: 'master' | 'admin' | 'teacher' | 'student';
  studentName?: string;
  onSelectView?: (view: any) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  activeCode,
  role,
  studentName: currentUserName,
  onSelectView,
}) => {
  const isMaster = role === 'master' || role === 'admin';
  const isTeacher = role === 'teacher';

  const [codes, setCodes] = useState<CodeRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [targetRole, setTargetRole] = useState<'teacher' | 'student'>('student');
  const [newCustomCode, setNewCustomCode] = useState('');
  const [targetName, setTargetName] = useState('');
  const [durationDays, setDurationDays] = useState<number>(0); // 0 = permanent
  const [maxStudentsLimit, setMaxStudentsLimit] = useState<number>(50);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'expired'>('all');
  const [roleFilter, setRoleFilter] = useState<'all' | 'teacher' | 'student'>('all');
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
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [activeTab, setActiveTab] = useState<'codes' | 'activity' | 'backup' | 'security'>('codes');
  const [feedbackTarget, setFeedbackTarget] = useState<{ code: string; studentName: string } | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [isSendingFeedback, setIsSendingFeedback] = useState(false);
  const [isExportingBackup, setIsExportingBackup] = useState(false);
  const [newAdminCodeInput, setNewAdminCodeInput] = useState('');
  const [isRevokingSessions, setIsRevokingSessions] = useState(false);
  const [isRevokeConfirmOpen, setIsRevokeConfirmOpen] = useState(false);
  const [isRotatingAdminCode, setIsRotatingAdminCode] = useState(false);

  // Edit Code State
  const [editingCode, setEditingCode] = useState<CodeRecord | null>(null);
  const [editCodeStr, setEditCodeStr] = useState('');
  const [editStudentName, setEditStudentName] = useState('');
  const [editRole, setEditRole] = useState<'teacher' | 'student'>('student');
  const [editStatus, setEditStatus] = useState<'active' | 'expired' | 'revoked'>('active');
  const [editDurationOption, setEditDurationOption] = useState<'keep' | 'permanent' | '30' | '90' | '365'>('keep');
  const [editMaxStudentsLimit, setEditMaxStudentsLimit] = useState<number>(50);
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // Master Code Settings Modal State
  const [isMasterCodeModalOpen, setIsMasterCodeModalOpen] = useState(false);
  const [newMasterCodeInput, setNewMasterCodeInput] = useState('');
  const [isUpdatingMasterCode, setIsUpdatingMasterCode] = useState(false);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; code: string; studentName?: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Restore Backup State
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [pendingBackup, setPendingBackup] = useState<{
    schemaVersion?: number;
    createdAt?: string;
    codes: CodeRecord[];
    fileName: string;
  } | null>(null);
  const [restoreStrategy, setRestoreStrategy] = useState<'merge' | 'overwrite'>('merge');
  const [isRestoring, setIsRestoring] = useState(false);

  const showNotification = (text: string, type: 'success' | 'error' = 'success') => {
    setNotice({ text, type });
    setTimeout(() => setNotice(null), 3500);
  };

  const loadCodes = async (
    targetPage = currentPage,
    overrides?: {
      filter?: 'all' | 'active' | 'expired';
      roleFilter?: 'all' | 'teacher' | 'student';
      search?: string;
      cursor?: string | null;
    }
  ) => {
    setLoading(true);
    const activeFilter = overrides?.filter ?? filter;
    const activeRoleFilter = overrides?.roleFilter ?? roleFilter;
    const activeSearch = overrides?.search !== undefined ? overrides.search : searchQuery;
    const targetCursor =
      overrides?.cursor !== undefined
        ? overrides.cursor
        : (cursorMap[targetPage] || null);

    try {
      const res = await fetchAdminCodes(activeCode, {
        page: targetPage,
        pageSize: 8,
        filter: activeFilter,
        roleFilter: isMaster ? activeRoleFilter : 'student',
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
        showNotification(res.message || 'فشل تحميل الأكواد', 'error');
      }
    } catch {
      showNotification('تعذر الاتصال بالخادم لتحميل الأكواد.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCodes(1);
  }, [activeCode]);

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

  const handleRoleFilterChange = (newRoleFilter: 'all' | 'teacher' | 'student') => {
    setRoleFilter(newRoleFilter);
    setCurrentPage(1);
    setCursorMap({ 1: null });
    loadCodes(1, { roleFilter: newRoleFilter, cursor: null });
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages || loading) return;
    loadCodes(newPage);
  };

  const handleGenerate = async (useRandom = false) => {
    if (isGenerating) return;
    setIsGenerating(true);
    try {
      const chosenRole = isTeacher ? 'student' : targetRole;
      const res = await adminGenerateCode(activeCode, {
        studentName: targetName.trim() || undefined,
        role: chosenRole,
        customCode: useRandom ? undefined : newCustomCode.trim() || undefined,
        durationDays,
        maxStudentsLimit: chosenRole === 'teacher' ? maxStudentsLimit : undefined,
      });

      if (res.success && res.code) {
        setRecentlyGenerated(res.code);
        setNewCustomCode('');
        setTargetName('');
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

  const handleOpenEditModal = (code: CodeRecord) => {
    setEditingCode(code);
    setEditCodeStr(code.code);
    setEditStudentName(code.studentName || '');
    setEditRole(code.role === 'teacher' ? 'teacher' : 'student');
    setEditStatus(code.status || 'active');
    setEditDurationOption('keep');
    setEditMaxStudentsLimit(code.maxStudentsLimit || 50);
  };

  const handleSaveEdit = async () => {
    if (!editingCode) return;
    if (!editCodeStr.trim()) {
      showNotification('رمز الكود لا يمكن أن يكون فارغاً', 'error');
      return;
    }
    setIsSavingEdit(true);
    let targetExpiresAt: string | null | undefined = undefined;
    if (editDurationOption === 'permanent') {
      targetExpiresAt = null;
    } else if (editDurationOption === '30') {
      targetExpiresAt = new Date(Date.now() + 30 * 86400000).toISOString();
    } else if (editDurationOption === '90') {
      targetExpiresAt = new Date(Date.now() + 90 * 86400000).toISOString();
    } else if (editDurationOption === '365') {
      targetExpiresAt = new Date(Date.now() + 365 * 86400000).toISOString();
    }

    const res = await adminEditCode(activeCode, {
      code: editingCode.code,
      newCode: editCodeStr.trim().toUpperCase() !== editingCode.code.toUpperCase() ? editCodeStr.trim().toUpperCase() : undefined,
      studentName: editStudentName.trim() || undefined,
      role: isMaster ? editRole : undefined,
      status: editStatus,
      expiresAt: targetExpiresAt,
      maxStudentsLimit: (isMaster && editRole === 'teacher') ? editMaxStudentsLimit : undefined,
    });
    setIsSavingEdit(false);
    if (res.success) {
      showNotification(res.message);
      setEditingCode(null);
      await loadCodes(currentPage);
    } else {
      showNotification(res.message || 'تعذر تعديل الكود.', 'error');
    }
  };

  const handleUpdateMasterCode = async () => {
    if (!newMasterCodeInput.trim() || newMasterCodeInput.trim().length < 6) {
      showNotification('كود المالك الجديد يجب أن يتكون من 6 أحرف/أرقام على الأقل.', 'error');
      return;
    }
    setIsUpdatingMasterCode(true);
    const res = await adminUpdateMasterCode(newMasterCodeInput.trim().toUpperCase());
    setIsUpdatingMasterCode(false);
    if (res.success) {
      showNotification(res.message);
      setNewMasterCodeInput('');
      setIsMasterCodeModalOpen(false);
      await loadCodes(1);
    } else {
      showNotification(res.message || 'تعذر تحديث كود المالك.', 'error');
    }
  };

  const handleExpire = async (codeId: string) => {
    setBusyCodeId(codeId);
    try {
      const res = await adminExpireCode(activeCode, codeId);
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
      const res = await adminReactivateCode(activeCode, codeId, days);
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
      const res = await adminDeleteCode(activeCode, deleteTarget.id);
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
    const isTeacherCode = code.role === 'teacher';
    const roleTitle = isTeacherCode ? 'أستاذ / معلم' : 'طالب';
    const msg = `أهلاً بك يا ${roleTitle}! 🚀\nتم تفعيل حسابك في منصة "زكي كود" لتعلم البرمجة.\n\n👤 الاسم: ${code.studentName}\n🔑 كود التفعيل: ${code.code}\n🌐 رابط المنصة: ${appUrl}\n\nافتح الرابط وضع الكود لبدء التجربة التعليمية فوراً!`;
    handleCopy(msg, `msg-${code.id}`);
  };

  const handleSendFeedback = async () => {
    if (!feedbackTarget || !feedbackMessage.trim()) return;
    setIsSendingFeedback(true);
    const ok = await sendStudentFeedback(feedbackTarget.code, feedbackMessage.trim());
    setIsSendingFeedback(false);
    if (ok) {
      showNotification('تم إرسال رسالة التوجيه والتشجيع للطالب بنجاح! 💌');
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
      showNotification('تم تنزيل النسخة الاحتياطية بنجاح.');
    } finally {
      setIsExportingBackup(false);
    }
  };

  const handleTriggerRestoreFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        const codesList = Array.isArray(parsed) ? parsed : parsed.codes;

        if (!Array.isArray(codesList) || codesList.length === 0) {
          showNotification('الملف المحدد لا يحتوي على قائمة صالحة من الأكواد.', 'error');
          return;
        }

        setPendingBackup({
          schemaVersion: parsed.schemaVersion || 1,
          createdAt: parsed.createdAt || new Date().toISOString(),
          codes: codesList,
          fileName: file.name,
        });
      } catch {
        showNotification('فشل قراءة ملف النسخة الاحتياطية. تأكد من أنه ملف JSON صالح.', 'error');
      }
    };
    reader.readAsText(file);
  };

  const handleExecuteRestore = async () => {
    if (!pendingBackup) return;
    setIsRestoring(true);
    const result = await restoreAdminBackup(
      {
        schemaVersion: pendingBackup.schemaVersion,
        createdAt: pendingBackup.createdAt,
        codes: pendingBackup.codes,
      },
      restoreStrategy
    );
    setIsRestoring(false);

    if (result.success) {
      showNotification(result.message);
      setPendingBackup(null);
      await loadCodes(1);
    } else {
      showNotification(result.message, 'error');
    }
  };

  const handleRevokeAllSessions = async () => {
    setIsRevokingSessions(true);
    const res = await adminRevokeAllSessions();
    setIsRevokingSessions(false);
    setIsRevokeConfirmOpen(false);
    if (res.success) {
      showNotification(res.message);
    } else {
      showNotification(res.message, 'error');
    }
  };

  const handleRotateAdminCode = async () => {
    const codeToSet = newAdminCodeInput.trim().toUpperCase();
    if (!codeToSet) {
      showNotification('يرجى كتابة كود المالك الجديد أولاً.', 'error');
      return;
    }
    if (codeToSet.length < 6) {
      showNotification('كود المالك يجب أن يتكون من 6 أحرف/أرقام على الأقل.', 'error');
      return;
    }
    setIsRotatingAdminCode(true);
    const res = await adminRotateAdminCode(codeToSet, true);
    setIsRotatingAdminCode(false);
    if (res.success) {
      showNotification(res.message);
      setNewAdminCodeInput('');
      await loadCodes(1);
    } else {
      showNotification(res.message || 'تعذر تدوير كود المالك.', 'error');
    }
  };

  // Global Escape key dismissal for open sub-modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (editingCode) setEditingCode(null);
        else if (deleteTarget) setDeleteTarget(null);
        else if (inspectingStudent) setInspectingStudent(null);
        else if (feedbackTarget) setFeedbackTarget(null);
        else if (isMasterCodeModalOpen) setIsMasterCodeModalOpen(false);
        else if (isRevokeConfirmOpen) setIsRevokeConfirmOpen(false);
        else if (pendingBackup) setPendingBackup(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    editingCode,
    deleteTarget,
    inspectingStudent,
    feedbackTarget,
    isMasterCodeModalOpen,
    isRevokeConfirmOpen,
    pendingBackup,
  ]);

  const isCurrentlyActive = (code: CodeRecord) =>
    code.status === 'active' && (!code.expiresAt || Date.parse(code.expiresAt) >= Date.now());
  const pageStart = (currentPage - 1) * pageSize;
  const currentFilterCount =
    filter === 'active' ? activeCount : filter === 'expired' ? expiredCount : totalCount;
  const totalChapterCount = bookParts.reduce((total, part) => total + part.chapters.length, 0);

  const teachersCount = codes.filter((c) => c.role === 'teacher').length;
  const studentsCount = codes.filter((c) => (c.role || 'student') === 'student').length;

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 font-['Cairo',sans-serif] text-slate-100 animate-fadeIn" dir="rtl">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-3xl flex items-center justify-center text-3xl shadow-xl border ${
              isMaster
                ? 'bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 border-amber-400/40 shadow-amber-500/20'
                : 'bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 border-emerald-400/40 shadow-emerald-500/20'
            }`}>
              {isMaster ? '👑' : '👨‍🏫'}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl sm:text-2xl font-black text-white">
                  {isMaster ? 'لوحة تحكم مالك المنصة (Super Admin)' : `لوحة تحكم المعلم - ${currentUserName || 'المعلم'}`}
                </h1>
                <span className={`text-xs px-2.5 py-1 rounded-full font-bold border ${
                  isMaster
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                }`}>
                  {isMaster ? 'المالك الرئيسي 👑' : 'حساب معلم معتمد 👨‍🏫'}
                </span>
              </div>
              <p className="text-sm text-slate-400 mt-1">
                {isMaster
                  ? 'إدارة متكاملة لأكواد المعلمين والطلاب، تتبع التقدم، النسخ الاحتياطي وإعدادات الأمان السحابية.'
                  : 'إدارة طلاب فصلك، توليد الأكواد الجديدة، متابعة تقدم التعلم وإرسال رسائل التوجيه.'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            {isMaster && (
              <>
                <button
                  type="button"
                  onClick={() => setIsMasterCodeModalOpen(true)}
                  className="flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition active:scale-95"
                  title="تعديل وتعيين كود مالك المنصة"
                >
                  <Key className="w-4 h-4" />
                  <span>كود المالك 👑</span>
                </button>

                <button
                  type="button"
                  onClick={() => void handleDownloadBackup()}
                  disabled={isExportingBackup}
                  className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 font-bold text-xs sm:text-sm transition active:scale-95 disabled:opacity-50"
                  title="تنزيل نسخة احتياطية من قاعدة البيانات JSON"
                >
                  <Download className="w-4 h-4 text-emerald-400" />
                  <span>{isExportingBackup ? 'جارٍ التجهيز…' : 'نسخة احتياطية 📥'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleTriggerRestoreFile}
                  disabled={isRestoring}
                  className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 font-bold text-xs sm:text-sm transition active:scale-95 disabled:opacity-50"
                  title="استعادة الأكواد والبيانات من ملف نسخة احتياطية JSON"
                >
                  <Upload className="w-4 h-4 text-cyan-400" />
                  <span>استعادة نسخة 📤</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('security')}
                  className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl bg-rose-950/80 hover:bg-rose-900 border border-rose-500/40 text-rose-300 font-bold text-xs sm:text-sm transition active:scale-95"
                  title="مركز الأمان وإبطال الجلسات"
                >
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  <span>مركز الأمان 🛡️</span>
                </button>

                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".json,application/json"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </>
            )}

            <button
              type="button"
              onClick={() => void loadCodes(currentPage)}
              disabled={loading}
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs sm:text-sm border border-slate-700 transition active:scale-95"
              title="تحديث البيانات"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>تحديث 🔄</span>
            </button>
          </div>
        </div>

        {/* Global Notice Alert */}
        {notice && (
          <div
            className={`mt-6 p-4 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-3 animate-fadeIn ${
              notice.type === 'error'
                ? 'bg-rose-950/90 text-rose-200 border border-rose-800'
                : 'bg-emerald-950/90 text-emerald-200 border border-emerald-800'
            }`}
          >
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{notice.text}</span>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 text-center space-y-1 shadow-lg">
          <span className="text-xs text-slate-400 font-medium block">
            {isMaster ? 'إجمالي الأكواد' : 'إجمالي طلابك'}
          </span>
          <span className="text-2xl sm:text-3xl font-black text-white font-mono" dir="ltr">{totalCount}</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 text-center space-y-1 shadow-lg">
          <span className="text-xs text-emerald-400 font-medium block">الأكواد النشطة</span>
          <span className="text-2xl sm:text-3xl font-black text-emerald-300 font-mono" dir="ltr">{activeCount}</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 text-center space-y-1 shadow-lg">
          <span className="text-xs text-rose-400 font-medium block">الأكواد المنتهية</span>
          <span className="text-2xl sm:text-3xl font-black text-rose-300 font-mono" dir="ltr">{expiredCount}</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 text-center space-y-1 shadow-lg">
          <span className="text-xs text-amber-400 font-medium block">
            {isMaster ? 'المعلمون / الطلاب' : 'الفصول التفاعلية'}
          </span>
          <span className="text-lg sm:text-xl font-black text-amber-300 font-mono">
            {isMaster ? (
              <>
                <span dir="ltr">{teachersCount}</span> 👨‍🏫 / <span dir="ltr">{studentsCount}</span> 🎓
              </>
            ) : (
              'مفعل ✓'
            )}
          </span>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 border-b border-slate-800 pb-2 sm:pb-1">
        <button
          type="button"
          onClick={() => setActiveTab('codes')}
          className={`px-2.5 py-2.5 sm:px-5 sm:py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-black transition flex items-center justify-center text-center gap-1.5 sm:gap-2 ${
            activeTab === 'codes'
              ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <KeyRound className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
          <span>إدارة الأكواد</span>
          <span className="hidden sm:inline">وتوليدها</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('activity')}
          className={`px-2.5 py-2.5 sm:px-5 sm:py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-black transition flex items-center justify-center text-center gap-1.5 sm:gap-2 ${
            activeTab === 'activity'
              ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
          <span>نشاط الطلاب</span>
          <span className="hidden sm:inline">وأعمالهم 💻</span>
        </button>

        {isMaster && (
          <>
            <button
              type="button"
              onClick={() => setActiveTab('backup')}
              className={`px-2.5 py-2.5 sm:px-5 sm:py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-black transition flex items-center justify-center text-center gap-1.5 sm:gap-2 ${
                activeTab === 'backup'
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span>النسخ الاحتياطي</span>
              <span className="hidden sm:inline">والاستعادة</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('security')}
              className={`px-2.5 py-2.5 sm:px-5 sm:py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-black transition flex items-center justify-center text-center gap-1.5 sm:gap-2 ${
                activeTab === 'security'
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span>مركز الأمان</span>
              <span className="hidden sm:inline">والجلسات 🛡️</span>
            </button>
          </>
        )}
      </div>

      {/* Main Tab Content */}
      {activeTab === 'codes' && (
        <div className="space-y-6">
          {/* Generation Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-amber-400" />
              <h2 className="text-base font-black text-white">
                {isMaster ? 'توليد كود جديد (معلم أو طالب)' : 'توليد كود طالب جديد لفصلك'}
              </h2>
            </div>

            {/* Role Select (Master Only) */}
            {isMaster && (
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200">
                  <div className="flex items-center gap-2">
                    <Key className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>لتغيير كود الإدارة (Master Admin) وإلغاء الأكواد القديمة، استخدم تبويب <strong>مركز الأمان</strong>.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('security')}
                    className="px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition text-[11px] shrink-0 self-start sm:self-auto"
                  >
                    الانتقال لمركز الأمان 🛡️
                  </button>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 block">اختر نوع الكود والرتبة المراد توليدها:</label>
                  <div className="grid grid-cols-2 gap-3 max-w-md">
                    <button
                      type="button"
                      onClick={() => setTargetRole('student')}
                      className={`p-3 rounded-2xl border text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 ${
                        targetRole === 'student'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-md'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
                      }`}
                    >
                      <span>🎓 كود طالب (Student)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTargetRole('teacher')}
                      className={`p-3 rounded-2xl border text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 ${
                        targetRole === 'teacher'
                          ? 'bg-purple-500/20 text-purple-300 border-purple-500/50 shadow-md'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
                      }`}
                    >
                      <span>👨‍🏫 كود معلم (Teacher)</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">
                  {targetRole === 'teacher' ? 'اسم المعلم (اختياري):' : 'اسم الطالب (اختياري):'}
                </label>
                <input
                  type="text"
                  value={targetName}
                  onChange={(e) => setTargetName(e.target.value)}
                  placeholder={targetRole === 'teacher' ? 'مثال: أستاذ أحمد علي' : 'مثال: محمد إبراهيم'}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-2xl text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">كود مخصص (اختياري):</label>
                <input
                  type="text"
                  dir="ltr"
                  value={newCustomCode}
                  onChange={(e) => setNewCustomCode(e.target.value.toUpperCase())}
                  placeholder={targetRole === 'teacher' ? 'مثال: TCH-CAIRO2026' : 'مثال: STD-PRO2026'}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-2xl text-xs sm:text-sm text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">مدة الصلاحية:</label>
                <select
                  value={durationDays}
                  onChange={(e) => setDurationDays(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-2xl text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500"
                >
                  <option value={0}>دائم (بدون انتهاء)</option>
                  <option value={30}>30 يوماً (شهر)</option>
                  <option value={90}>90 يوماً (3 أشهر)</option>
                  <option value={180}>180 يوماً (6 أشهر)</option>
                  <option value={365}>سنة كاملة (365 يوماً)</option>
                </select>
              </div>
            </div>

            {/* Teacher Student Quota Limit Input (Master Only) */}
            {isMaster && targetRole === 'teacher' && (
              <div className="max-w-xs space-y-1">
                <label className="text-xs font-semibold text-purple-300">
                  الحد الأقصى لطلاب المعلم (Quota):
                </label>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={maxStudentsLimit}
                  onChange={(e) => setMaxStudentsLimit(Number(e.target.value))}
                  className="w-full px-4 py-2 bg-slate-950 border border-purple-900/60 rounded-2xl text-xs sm:text-sm text-purple-200 font-mono focus:outline-none focus:border-purple-500"
                />
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleGenerate(false)}
                disabled={isGenerating}
                className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs sm:text-sm transition flex items-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                <span>{isGenerating ? 'جاري التوليد...' : `توليد وحفظ كود ${targetRole === 'teacher' ? 'المعلم' : 'الطالب'} ✨`}</span>
              </button>

              <button
                type="button"
                onClick={() => handleGenerate(true)}
                disabled={isGenerating}
                className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs sm:text-sm transition flex items-center gap-1.5"
              >
                <Dices className="w-4 h-4" />
                <span>كود عشوائي سريع</span>
              </button>
            </div>

            {/* Recently Generated Banner */}
            {recentlyGenerated && (
              <div className="mt-4 p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-scaleUp">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-lg">
                    ✨
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-base text-amber-300 tracking-wider">
                        {recentlyGenerated.code}
                      </span>
                      <span className="text-xs text-slate-300">({recentlyGenerated.studentName})</span>
                    </div>
                    <span className="text-[11px] text-emerald-400 font-medium">تم إنشاء الكود وحفظه بنجاح في قاعدة البيانات.</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopy(recentlyGenerated.code, 'recent-code')}
                    className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedKey === 'recent-code' ? 'تم النسخ' : 'نسخ الكود'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCopyInvite(recentlyGenerated)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>دعوة واتساب</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Codes List & Search */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <h3 className="font-black text-white text-base">
                  {isMaster ? 'سجل الأكواد الصادرة في المنصة:' : 'أكواد طلاب فصلي:'}
                </h3>
                <span className="text-xs text-slate-400 font-mono">({currentFilterCount})</span>
              </div>

              {/* Filters & Search */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 w-full lg:w-auto">
                <div className="relative w-full sm:w-56">
                  <Search className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    placeholder="ابحث بالاسم أو الكود..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl pr-9 pl-4 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500 shadow-inner"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {isMaster && (
                    <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-2xl border border-slate-800 text-xs overflow-x-auto">
                      <button
                        type="button"
                        onClick={() => handleRoleFilterChange('all')}
                        className={`px-3 py-1.5 rounded-xl transition ${
                          roleFilter === 'all' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        الكل
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRoleFilterChange('teacher')}
                        className={`px-3 py-1.5 rounded-xl transition ${
                          roleFilter === 'teacher' ? 'bg-purple-950 text-purple-300 font-bold border border-purple-800' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        المعلمون ({teachersCount})
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRoleFilterChange('student')}
                        className={`px-3 py-1.5 rounded-xl transition ${
                          roleFilter === 'student' ? 'bg-amber-950 text-amber-300 font-bold border border-amber-800' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        الطلاب ({studentsCount})
                      </button>
                    </div>
                  )}

                  <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-2xl border border-slate-800 text-xs overflow-x-auto">
                    <button
                      type="button"
                      onClick={() => handleFilterChange('all')}
                      className={`px-3 py-1.5 rounded-xl transition ${
                        filter === 'all' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      الكل ({totalCount})
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFilterChange('active')}
                      className={`px-3 py-1.5 rounded-xl transition ${
                        filter === 'active' ? 'bg-emerald-950 text-emerald-300 font-bold border border-emerald-800' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      فعال ({activeCount})
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFilterChange('expired')}
                      className={`px-3 py-1.5 rounded-xl transition ${
                        filter === 'expired' ? 'bg-rose-950 text-rose-300 font-bold border border-rose-800' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      منتهي ({expiredCount})
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Codes List */}
            {loading ? (
              <div className="text-center py-12 text-slate-400 text-sm flex items-center justify-center gap-2">
                <RefreshCw className="w-5 h-5 animate-spin text-amber-400" />
                <span>جاري تحميل الأكواد من السحابة...</span>
              </div>
            ) : codes.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-sm bg-slate-950/60 rounded-2xl border border-slate-800/80">
                {searchQuery.trim() ? 'لا توجد نتائج تطابق بحثك.' : 'لا توجد أكواد مسجلة في هذا القسم.'}
              </div>
            ) : (
              <div className="space-y-3.5">
                {codes.map((c) => {
                  const isActive = isCurrentlyActive(c);
                  const isExpired = c.status === 'expired' || (c.status === 'active' && !isActive);
                  const isRevoked = c.status === 'revoked';
                  const isTeacherRow = c.role === 'teacher';

                  return (
                    <div
                      key={c.id}
                      className={`p-4 sm:p-5 rounded-2xl border transition space-y-3.5 overflow-hidden ${
                        isActive
                          ? isTeacherRow
                            ? 'bg-slate-950/90 border-purple-900/50 hover:border-purple-800 shadow-md shadow-purple-950/20'
                            : 'bg-slate-950/85 border-slate-800 hover:border-slate-700 shadow-md shadow-black/30'
                          : 'bg-slate-950/50 border-slate-800/60 opacity-85'
                      }`}
                    >
                      {/* Card Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 min-w-0">
                        {/* User identity and metadata */}
                        <div className="space-y-1.5 min-w-0 flex-1">
                          <div className="flex items-center justify-between sm:justify-start gap-2 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 min-w-0">
                              <span className="font-black text-white text-base sm:text-lg truncate">
                                {c.studentName || (isTeacherRow ? 'معلم جديد' : 'طالب جديد')}
                              </span>
                              {isTeacherRow ? (
                                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold border border-purple-500/40 shrink-0">
                                  👨‍🏫 معلم
                                </span>
                              ) : (
                                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400 font-bold border border-amber-500/30 shrink-0">
                                  🎓 طالب
                                </span>
                              )}
                            </div>

                            {/* Mobile status pill */}
                            <div className="sm:hidden shrink-0">
                              {isActive && (
                                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                  ✓ نشط
                                </span>
                              )}
                              {isExpired && (
                                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30">
                                  منتهي
                                </span>
                              )}
                              {isRevoked && (
                                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                                  ملغي
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Metadata row */}
                          <div className="text-xs text-slate-400 flex flex-wrap items-center gap-x-2.5 gap-y-1">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                              <span>
                                {c.expiresAt
                                  ? `ينتهي: ${new Date(c.expiresAt).toLocaleDateString('ar-EG')}`
                                  : 'صلاحية دائمة'}
                              </span>
                            </span>
                            <span className="text-slate-600 hidden xs:inline">•</span>
                            <span className="flex items-center gap-1">
                              <Users className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                              <span>استُخدم {c.usedCount || 0} مرة</span>
                            </span>
                            {isTeacherRow && c.maxStudentsLimit && (
                              <>
                                <span className="text-slate-600 hidden xs:inline">•</span>
                                <span className="text-purple-300 font-bold">حد الطلاب: {c.maxStudentsLimit}</span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Code badge & Desktop Status */}
                        <div className="flex items-center justify-between sm:justify-end gap-2.5 min-w-0 pt-1 sm:pt-0">
                          <div
                            dir="ltr"
                            className={`font-mono font-black text-sm sm:text-base tracking-wider px-3.5 py-1.5 rounded-xl border flex items-center gap-2 select-all break-all ${
                              isTeacherRow
                                ? 'bg-purple-950/70 text-purple-200 border-purple-800/70 shadow-inner'
                                : 'bg-slate-900 text-amber-300 border-slate-800 shadow-inner'
                            }`}
                          >
                            <span>{c.code}</span>
                          </div>

                          {/* Desktop status pill */}
                          <div className="hidden sm:block shrink-0">
                            {isActive && (
                              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 whitespace-nowrap">
                                ✓ نشط وفعال
                              </span>
                            )}
                            {isExpired && (
                              <span className="text-xs font-bold px-3 py-1 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30 whitespace-nowrap">
                                منتهي الصلاحية
                              </span>
                            )}
                            {isRevoked && (
                              <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700 whitespace-nowrap">
                                ملغي من الإدارة
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Student Progress Track */}
                      {!isTeacherRow && (() => {
                        const completedChs = Math.min(totalChapterCount, new Set(c.progress?.completedChapters || []).size);
                        const completedQz = Math.min(bookParts.length, new Set(c.progress?.completedQuizzes || []).size);
                        const percent = Math.round(((completedChs + completedQz) / (totalChapterCount + bookParts.length)) * 100);

                        return (
                          <div className="bg-slate-900/90 rounded-2xl p-3 border border-slate-800/80 text-xs space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-slate-300 font-medium flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                                <span>تقدم التعلم:</span>
                                <strong className="text-amber-300 font-bold">
                                  <span dir="ltr">{completedChs}/{totalChapterCount}</span> فصل
                                </strong>
                                <span className="text-emerald-400 text-xs">
                                  (<span dir="ltr">{completedQz}</span> اختبارات)
                                </span>
                              </span>
                              <span className="font-mono font-bold text-white text-xs" dir="ltr">{percent}%</span>
                            </div>
                            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full transition-all duration-300"
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                          </div>
                        );
                      })()}

                      {/* Actions Toolbar */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-3 border-t border-slate-800/70 text-xs">
                        {/* Primary action tools (Copy, Invite, Edit, Student Codes) */}
                        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleCopy(c.code, `code-${c.id}`)}
                            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition active:scale-95 touch-manipulation min-h-[38px]"
                          >
                            {copiedKey === `code-${c.id}` ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                <span className="text-emerald-400">تم النسخ</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span>نسخ الكود</span>
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleCopyInvite(c)}
                            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-800/60 text-emerald-300 text-xs font-bold transition active:scale-95 touch-manipulation min-h-[38px]"
                          >
                            <Send className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>دعوة واتساب 💬</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(c)}
                            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-sky-950/60 hover:bg-sky-900/80 border border-sky-800/60 text-sky-300 text-xs font-bold transition active:scale-95 touch-manipulation min-h-[38px]"
                            title="تعديل الكود والاسم والرتبة والصلاحيات"
                          >
                            <Pencil className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                            <span>تعديل ✏️</span>
                          </button>

                          {!isTeacherRow && (
                            <button
                              type="button"
                              onClick={() => setInspectingStudent(c)}
                              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-950/60 hover:bg-indigo-900/80 border border-indigo-800/60 text-indigo-300 text-xs font-bold transition active:scale-95 touch-manipulation min-h-[38px]"
                              title="عرض وفحص الأكواد والمشاريع التي كتبها هذا الطالب"
                            >
                              <Code2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                              <span>أكواد الطالب 💻</span>
                            </button>
                          )}
                        </div>

                        {/* Secondary Status & Delete Actions */}
                        <div className="flex items-center justify-between sm:justify-end gap-2 pt-1 sm:pt-0">
                          {isActive ? (
                            <button
                              type="button"
                              onClick={() => handleExpire(c.id)}
                              disabled={busyCodeId === c.id}
                              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-amber-950/40 hover:bg-amber-900/60 border border-amber-900/50 text-amber-300 text-xs font-bold transition active:scale-95 touch-manipulation min-h-[38px]"
                              title="إنهاء صلاحية هذا الكود فوراً"
                            >
                              <PowerOff className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                              <span>إنهاء الصلاحية</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleReactivate(c.id, 30)}
                              disabled={busyCodeId === c.id}
                              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-900/50 text-emerald-300 text-xs font-bold transition active:scale-95 touch-manipulation min-h-[38px]"
                              title="إعادة تفعيل الكود لمدة 30 يوماً"
                            >
                              <RotateCcw className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              <span>إعادة تفعيل 🔄</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => setDeleteTarget({ id: c.id, code: c.code, studentName: c.studentName })}
                            disabled={busyCodeId === c.id}
                            className="min-w-[38px] min-h-[38px] flex items-center justify-center p-2 rounded-xl bg-slate-900 hover:bg-rose-950 hover:text-rose-400 text-slate-500 border border-slate-800 transition active:scale-95 touch-manipulation"
                            title="حذف نهائي من قاعدة البيانات"
                            aria-label="حذف الكود نهائياً"
                          >
                            <Trash2 className="w-4 h-4 shrink-0" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination Controls */}
            {!loading && totalPages > 1 && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-slate-800 pt-4">
                <span className="text-xs text-slate-400">
                  عرض {pageStart + 1}–{Math.min(pageStart + codes.length, currentFilterCount)} من {currentFilterCount}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1 || loading}
                    className="rounded-xl border border-slate-700 px-4 py-2 text-xs font-bold text-slate-200 hover:bg-slate-800 disabled:opacity-40"
                  >
                    السابق
                  </button>
                  <span className="text-xs text-slate-400 font-mono">
                    صفحة {currentPage} من {totalPages}
                  </span>
                  <button
                    type="button"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages || loading}
                    className="rounded-xl border border-slate-700 px-4 py-2 text-xs font-bold text-slate-200 hover:bg-slate-800 disabled:opacity-40"
                  >
                    التالي
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab: Student Activity */}
      {activeTab === 'activity' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <GraduationCap className="w-6 h-6 text-amber-400" />
            <div>
              <h3 className="text-lg font-black text-white">سجل مشاريع وأكواد الطلاب</h3>
              <p className="text-xs text-slate-400">فحص المسودات المكتوبة وإرسال التشجيعات والملاحظات</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {codes.filter((c) => c.role !== 'teacher').map((student) => {
              const snippetsCount = student.savedSnippets?.length || 0;
              const hasDraft = Boolean(student.draftCode?.trim());

              return (
                <div key={student.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-white text-sm">{student.studentName || 'طالب'}</h4>
                      <span className="text-xs font-mono text-amber-400">{student.code}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFeedbackTarget({ code: student.code, studentName: student.studentName || 'طالب' })}
                      className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 hover:bg-amber-500 hover:text-slate-950 text-xs font-bold transition flex items-center gap-1.5"
                    >
                      <MessageSquareHeart className="w-3.5 h-3.5" />
                      <span>إرسال تشجيع 💌</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span>المشاريع المحفوظة: <strong className="text-white">{snippetsCount}</strong></span>
                    <span>•</span>
                    <span>المسودة الحالية: <strong className={hasDraft ? 'text-emerald-400' : 'text-slate-500'}>{hasDraft ? 'موجودة' : 'فارغة'}</strong></span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setInspectingStudent(student)}
                    className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold transition flex items-center justify-center gap-2"
                  >
                    <Code2 className="w-4 h-4 text-indigo-400" />
                    <span>فحص أكواد الطالب ومشاريعه</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab: Backup & Restore */}
      {activeTab === 'backup' && isMaster && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <Download className="w-6 h-6 text-emerald-400" />
            <div>
              <h3 className="text-lg font-black text-white">النسخ الاحتياطي واستعادة البيانات</h3>
              <p className="text-xs text-slate-400">حفظ نسخة كاملة من أكواد وبيانات المنصة كملف JSON واستعادتها في أي وقت</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <Download className="w-5 h-5" />
                <span>تصدير نسخة احتياطية فورية</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                قم بتنزيل ملف JSON يحتوي على جميع الأكواد، رتب المستخدمين، وتقدم الطلاب في الفصول والاختبارات.
              </p>
              <button
                type="button"
                onClick={() => void handleDownloadBackup()}
                disabled={isExportingBackup}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>{isExportingBackup ? 'جاري تجهيز النسخة...' : 'تنزيل ملف النسخة الاحتياطية (JSON) 📥'}</span>
              </button>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                <Upload className="w-5 h-5" />
                <span>استعادة بيانات من نسخة احتياطية</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                استرجع جميع السجلات والأكواد من ملف JSON محفوظ مسبقاً مع إمكانية الدمج أو الاستبدال.
              </p>
              <button
                type="button"
                onClick={handleTriggerRestoreFile}
                disabled={isRestoring}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-black text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 disabled:opacity-50"
              >
                <Upload className="w-4 h-4" />
                <span>اختر ملف الاستعادة (JSON) 📤</span>
              </button>
              <input
                type="file"
                ref={fileInputRef}
                accept=".json,application/json"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab: Security */}
      {activeTab === 'security' && isMaster && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">مركز الأمان وإدارة الجلسات</h3>
              <p className="text-xs text-slate-400">إبطال الجلسات النشطة، تدوير كود المالك، ومراقبة حماية بيانات المنصة</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. Global Session Revocation */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3.5 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                  <PowerOff className="w-5 h-5" />
                  <span>إبطال جميع الجلسات النشطة فوراً</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  في حال الاشتباه في تسريب أي كود أو انتهاء الفصل الدراسي، يمكنك إبطال كل جلسات الدخول الحالية لجميع الطلاب والمعلمين لإجبار الجميع على إعادة تسجيل الدخول فوراً.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsRevokeConfirmOpen(true)}
                disabled={isRevokingSessions}
                className="w-full py-3 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
              >
                <PowerOff className="w-4 h-4" />
                <span>إبطال كل الجلسات المسجلة الآن 🛑</span>
              </button>
            </div>

            {/* 2. Rotate Master Admin Access Key */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3.5 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <Key className="w-5 h-5" />
                  <span>تدوير كود المالك فورياً (Master Key Rotation)</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  عيّن كود مالك جديد يتم تفعيله فوراً على السيرفر ويقوم بإبطال الجلسات القديمة وتجديد جلستك الحالية تلقائياً.
                </p>
                <div className="space-y-2 pt-1">
                  <input
                    type="text"
                    dir="ltr"
                    value={newAdminCodeInput}
                    onChange={(e) => setNewAdminCodeInput(e.target.value.toUpperCase())}
                    placeholder="مثال: MASTER-PRO-2026"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-amber-300 font-mono font-bold text-sm focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={handleRotateAdminCode}
                disabled={isRotatingAdminCode || !newAdminCodeInput.trim()}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-50 active:scale-95"
              >
                <KeyRound className="w-4 h-4" />
                <span>{isRotatingAdminCode ? 'جاري تدوير الكود...' : 'حفظ وتفعيل كود المالك الجديد 👑'}</span>
              </button>
            </div>

            {/* 3. Database & Security Health Status */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3 md:col-span-2">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <ShieldCheck className="w-5 h-5" />
                  <span>حالة أنظمة الأمان والنسخ الاحتياطي في المنصة</span>
                </div>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  آمن ونشط 100%
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                  <span className="text-xs text-slate-400 block font-medium">قواعد بيانات Firestore</span>
                  <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-400" />
                    قواعد الأمان Rules مطبقة ومحمية
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                  <span className="text-xs text-slate-400 block font-medium">توقيع الجلسات المشفر</span>
                  <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <Lock className="w-4 h-4 text-amber-400" />
                    HMAC-SHA256 Token Protection
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                  <span className="text-xs text-slate-400 block font-medium">النسخ الاحتياطي اليدوي</span>
                  <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                    <Upload className="w-4 h-4 text-cyan-400" />
                    تصدير واستيراد JSON فوري
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Code Dialog Modal */}
      {editingCode && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="تعديل بيانات الكود"
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
        >
          <div className="bg-slate-900 border border-sky-500/40 w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-5 text-right dir-rtl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold border border-sky-500/30">
                  <Pencil className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white">تعديل بيانات الكود</h3>
                  <p className="text-xs text-slate-400">تحديث الرمز أو الاسم أو الرتبة أو الصلاحية</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingCode(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Code string */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block">
                  رمز الكود (Code String):
                </label>
                <input
                  type="text"
                  dir="ltr"
                  value={editCodeStr}
                  onChange={(e) => setEditCodeStr(e.target.value.toUpperCase())}
                  placeholder="مثال: STD-AHMED2026 أو TCH-SALAH"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-amber-300 font-mono font-bold text-sm focus:border-sky-500 focus:outline-none"
                />
              </div>

              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block">
                  {editRole === 'teacher' ? 'اسم المعلم:' : 'اسم الطالب:'}
                </label>
                <input
                  type="text"
                  value={editStudentName}
                  onChange={(e) => setEditStudentName(e.target.value)}
                  placeholder="الاسم المسجل"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-sky-500 focus:outline-none"
                />
              </div>

              {/* Role Toggle (Master Only) */}
              {isMaster && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 block">رتبة ونوع الحساب:</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setEditRole('student')}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 ${
                        editRole === 'student'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                          : 'bg-slate-950/60 text-slate-400 border-slate-800'
                      }`}
                    >
                      <span>🎓 طالب (Student)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditRole('teacher')}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 ${
                        editRole === 'teacher'
                          ? 'bg-purple-500/20 text-purple-300 border-purple-500/50'
                          : 'bg-slate-950/60 text-slate-400 border-slate-800'
                      }`}
                    >
                      <span>👨‍🏫 معلم (Teacher)</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Teacher student limit */}
              {isMaster && editRole === 'teacher' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 block">
                    الحد الأقصى لطلاب المعلم (Quota):
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    value={editMaxStudentsLimit}
                    onChange={(e) => setEditMaxStudentsLimit(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-sm focus:border-sky-500 focus:outline-none"
                  />
                </div>
              )}

              {/* Status Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block">حالة الحساب والوصول:</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setEditStatus('active')}
                    className={`p-2 rounded-xl border text-xs font-bold transition ${
                      editStatus === 'active'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                        : 'bg-slate-950/60 text-slate-400 border-slate-800'
                    }`}
                  >
                    ✓ نشط وفعال
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditStatus('expired')}
                    className={`p-2 rounded-xl border text-xs font-bold transition ${
                      editStatus === 'expired'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                        : 'bg-slate-950/60 text-slate-400 border-slate-800'
                    }`}
                  >
                    منتهي الصلاحية
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditStatus('revoked')}
                    className={`p-2 rounded-xl border text-xs font-bold transition ${
                      editStatus === 'revoked'
                        ? 'bg-slate-700 text-slate-200 border-slate-600'
                        : 'bg-slate-950/60 text-slate-400 border-slate-800'
                    }`}
                  >
                    ملغي (Revoked)
                  </button>
                </div>
              </div>

              {/* Expiry options */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block">تعديل مدة الصلاحية:</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setEditDurationOption('keep')}
                    className={`p-2 rounded-xl border font-bold transition ${
                      editDurationOption === 'keep'
                        ? 'bg-sky-500/20 text-sky-300 border-sky-500/50'
                        : 'bg-slate-950/60 text-slate-400 border-slate-800'
                    }`}
                  >
                    الإبقاء الحالية
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditDurationOption('permanent')}
                    className={`p-2 rounded-xl border font-bold transition ${
                      editDurationOption === 'permanent'
                        ? 'bg-sky-500/20 text-sky-300 border-sky-500/50'
                        : 'bg-slate-950/60 text-slate-400 border-slate-800'
                    }`}
                  >
                    صلاحية دائمة
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditDurationOption('30')}
                    className={`p-2 rounded-xl border font-bold transition ${
                      editDurationOption === '30'
                        ? 'bg-sky-500/20 text-sky-300 border-sky-500/50'
                        : 'bg-slate-950/60 text-slate-400 border-slate-800'
                    }`}
                  >
                    +30 يوماً
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditDurationOption('365')}
                    className={`p-2 rounded-xl border font-bold transition ${
                      editDurationOption === '365'
                        ? 'bg-sky-500/20 text-sky-300 border-sky-500/50'
                        : 'bg-slate-950/60 text-slate-400 border-slate-800'
                    }`}
                  >
                    +1 سنة
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={handleSaveEdit}
                disabled={isSavingEdit}
                className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-black text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20 disabled:opacity-50"
              >
                {isSavingEdit ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>جاري حفظ التعديلات...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>حفظ التعديلات على الكود 💾</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setEditingCode(null)}
                disabled={isSavingEdit}
                className="py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Master Code Customization Modal */}
      {isMasterCodeModalOpen && isMaster && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="إعدادات كود المالك"
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
        >
          <div className="bg-slate-900 border border-yellow-500/40 w-full max-w-lg rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 text-right dir-rtl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-yellow-500/20 text-yellow-400 flex items-center justify-center font-bold border border-yellow-500/30">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white">إعدادات كود المالك (Master Code)</h3>
                  <p className="text-xs text-slate-400">تغيير وتعيين كود مالك المنصة الرئيسي 👑</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsMasterCodeModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-2 text-xs text-slate-300 leading-relaxed">
              <p className="text-yellow-300 font-bold">👑 ما هو كود المالك؟</p>
              <p className="text-slate-400 text-[11px]">
                كود المالك هو الكود الأعلى صلاحية في المنصة، والذي يتيح لك إنشاء وتعديل أكواد المعلمين والطلاب، وتعيين الحصص، وإدارة النسخ الاحتياطية والأمان.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 block">
                اكتب كود المالك الجديد:
              </label>
              <input
                type="text"
                dir="ltr"
                value={newMasterCodeInput}
                onChange={(e) => setNewMasterCodeInput(e.target.value.toUpperCase())}
                placeholder="مثال: ZAKI-MASTER-2026 أو MY-OWNER-KEY"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-yellow-300 font-mono font-black text-sm focus:border-yellow-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={handleUpdateMasterCode}
                disabled={isUpdatingMasterCode || !newMasterCodeInput.trim()}
                className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-yellow-500/20 disabled:opacity-50"
              >
                {isUpdatingMasterCode ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>جاري حفظ كود المالك...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>حفظ وتفعيل كود المالك الجديد 👑</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setIsMasterCodeModalOpen(false)}
                disabled={isUpdatingMasterCode}
                className="py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="تأكيد حذف الكود"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-fadeIn"
        >
          <div className="bg-slate-900 border border-rose-500/30 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden p-6 space-y-5 animate-scaleUp text-right dir-rtl">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center shadow-lg shadow-rose-500/10 mb-1">
                <Trash2 className="w-7 h-7" />
              </div>
              <h3 className="font-black text-white text-lg">
                تأكيد حذف الكود نهائياً
              </h3>
              <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                هل أنت متأكد من رغبتك في حذف هذا الكود نهائياً من قاعدة بيانات المنصة؟
              </p>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-2 text-center">
              <span className="text-[11px] text-slate-500 block">الكود المحدد للحذف:</span>
              <div className="inline-block px-3.5 py-1.5 rounded-lg bg-rose-950/30 border border-rose-800/40 font-mono font-bold text-amber-300 text-sm tracking-wider">
                {deleteTarget.code}
              </div>
              {deleteTarget.studentName && (
                <div className="text-xs text-slate-300 font-medium">
                  الاسم المسجل: <span className="text-white font-bold">{deleteTarget.studentName}</span>
                </div>
              )}
            </div>

            <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 text-[11px] text-amber-300 leading-relaxed text-right dir-rtl">
              ⚠️ <strong>تنبيه هام:</strong> هذا الإجراء غير قابل للتراجع. سيتم حذف الكود وإلغاء صلاحية الوصول فوراً.
            </div>

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

      {/* Inspect Student Modal */}
      {inspectingStudent && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="أكواد ومشاريع الطالب"
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
        >
          <div className="bg-slate-900 border border-indigo-500/40 w-full max-w-2xl rounded-3xl p-6 shadow-2xl space-y-5 text-right dir-rtl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold border border-indigo-500/30">
                  <Code2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white">
                    أكواد ومشاريع: {inspectingStudent.studentName || 'طالب'}
                  </h3>
                  <span className="text-xs font-mono text-amber-400">{inspectingStudent.code}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setInspectingStudent(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Current Draft */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-300 block">المسودة المكتوبة حالياً في المحرر:</span>
              <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-amber-300 font-mono text-xs overflow-x-auto max-h-48" dir="ltr">
                {inspectingStudent.draftCode?.trim() || '// لا توجد مسودة مكتوبة حالياً.'}
              </pre>
            </div>

            {/* Saved Snippets */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-300 block">
                المشاريع المحفوظة ({inspectingStudent.savedSnippets?.length || 0}):
              </span>
              {(!inspectingStudent.savedSnippets || inspectingStudent.savedSnippets.length === 0) ? (
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center text-xs text-slate-500">
                  لم يقم الطالب بحفظ أي مشاريع مستقلة بعد.
                </div>
              ) : (
                inspectingStudent.savedSnippets.map((snippet) => (
                  <div key={snippet.id} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs">{snippet.title}</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(snippet.code, snippet.id)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 text-[11px] text-slate-300 font-bold"
                      >
                        {copiedKey === snippet.id ? 'تم النسخ' : 'نسخ الكود'}
                      </button>
                    </div>
                    <pre className="p-3 rounded-xl bg-slate-900 text-emerald-300 font-mono text-[11px] overflow-x-auto max-h-36" dir="ltr">
                      {snippet.code}
                    </pre>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Send Feedback Modal */}
      {feedbackTarget && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="إرسال تشجيع وتوجيه للطالب"
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
        >
          <div className="bg-slate-900 border border-amber-500/40 w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4 text-right dir-rtl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-amber-400 font-bold">
                <MessageSquareHeart className="w-5 h-5" />
                <span>إرسال تشجيع وتوجيه للطالب</span>
              </div>
              <button
                type="button"
                onClick={() => setFeedbackTarget(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              إرسال رسالة تشجيعية أو نصيحة برمجية للطالب <strong className="text-white">{feedbackTarget.studentName}</strong> ستظهر له مباشرة في منصته.
            </p>

            <textarea
              rows={4}
              value={feedbackMessage}
              onChange={(e) => setFeedbackMessage(e.target.value)}
              placeholder="اكتب نصيحتك أو تشجيعك هنا..."
              className="w-full p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm focus:outline-none focus:border-amber-500"
            />

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={handleSendFeedback}
                disabled={isSendingFeedback || !feedbackMessage.trim()}
                className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{isSendingFeedback ? 'جاري الإرسال...' : 'إرسال الرسالة 💌'}</span>
              </button>
              <button
                type="button"
                onClick={() => setFeedbackTarget(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Restore Confirmation Modal */}
      {pendingBackup && isMaster && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="استعادة نسخة احتياطية"
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
        >
          <div className="bg-slate-900 border border-cyan-500/40 w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-5 text-right dir-rtl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold border border-cyan-500/30">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white">استعادة نسخة احتياطية</h3>
                  <p className="text-xs text-slate-400">مراجعة الملف وتأكيد استعادة بيانات المنصة</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPendingBackup(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-2 text-xs text-slate-300">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">اسم الملف:</span>
                <span className="font-mono font-bold text-white truncate max-w-[200px]">{pendingBackup.fileName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">عدد السجلات:</span>
                <span className="text-emerald-400 font-bold text-sm">{pendingBackup.codes.length} كود</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 block">طريقة الاستعادة:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRestoreStrategy('merge')}
                  className={`p-3 rounded-2xl border text-right transition space-y-1 ${
                    restoreStrategy === 'merge'
                      ? 'bg-cyan-500/15 border-cyan-500/50 text-cyan-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <span className="font-bold text-xs block">دمج وتحديث (Merge)</span>
                  <span className="text-[10px] text-slate-400">يحافظ على الأكواد الحالية ويضيف الجديد.</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRestoreStrategy('overwrite')}
                  className={`p-3 rounded-2xl border text-right transition space-y-1 ${
                    restoreStrategy === 'overwrite'
                      ? 'bg-amber-500/15 border-amber-500/50 text-amber-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <span className="font-bold text-xs block">استبدال كامل (Overwrite)</span>
                  <span className="text-[10px] text-slate-400">يكتب السجلات كما هي في الملف.</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleExecuteRestore}
                disabled={isRestoring}
                className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-black text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 disabled:opacity-50"
              >
                <Upload className="w-4 h-4" />
                <span>{isRestoring ? 'جاري الاستعادة...' : `تأكيد استعادة (${pendingBackup.codes.length}) كود 🚀`}</span>
              </button>

              <button
                type="button"
                onClick={() => setPendingBackup(null)}
                disabled={isRestoring}
                className="py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Session Revocation Confirmation Modal */}
      {isRevokeConfirmOpen && isMaster && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="تأكيد إبطال جميع الجلسات النشطة"
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
        >
          <div className="bg-slate-900 border border-rose-500/40 w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-5 text-right dir-rtl">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center shadow-lg shadow-rose-500/10 mb-1">
                <PowerOff className="w-7 h-7" />
              </div>
              <h3 className="font-black text-white text-lg">
                تأكيد إبطال جميع الجلسات النشطة
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
                هل أنت متأكد من رغبتك في إبطال كل جلسات الدخول الحالية لجميع الطلاب والمعلمين؟
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-rose-950/30 border border-rose-800/40 text-xs text-rose-200 leading-relaxed text-right">
              ⚠️ <strong>تنبيه الأمان:</strong> سيتعين على جميع المستخدمين والمعلمين إعادة إدخال أكوادهم لتسجيل الدخول إلى المنصة مرة أخرى. لن تتأثر بيانات التقدم أو المشاريع المحفوظة.
            </div>

            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={handleRevokeAllSessions}
                disabled={isRevokingSessions}
                className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-black text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30 disabled:opacity-50 active:scale-95"
              >
                {isRevokingSessions ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>جاري الإبطال...</span>
                  </>
                ) : (
                  <>
                    <PowerOff className="w-4 h-4" />
                    <span>تأكيد الإبطال الفوري 🛑</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setIsRevokeConfirmOpen(false)}
                disabled={isRevokingSessions}
                className="py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
