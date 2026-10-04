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
} from 'lucide-react';
import { sendStudentFeedback } from '../utils/challengesAndTts';

interface OwnerCodeModalProps {
  adminCode: string;
  role?: 'master' | 'admin' | 'teacher' | 'student';
  studentName?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const OwnerCodeModal: React.FC<OwnerCodeModalProps> = ({
  adminCode,
  role = 'master',
  studentName: currentUserName,
  isOpen,
  onClose,
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
  const searchTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const [adminTab, setAdminTab] = useState<'codes' | 'activity'>('codes');
  const [feedbackTarget, setFeedbackTarget] = useState<{ code: string; studentName: string } | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [isSendingFeedback, setIsSendingFeedback] = useState(false);
  const [isExportingBackup, setIsExportingBackup] = useState(false);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const [newAdminCodeInput, setNewAdminCodeInput] = useState('');
  const [isRevokingSessions, setIsRevokingSessions] = useState(false);
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

    const res = await adminEditCode(adminCode, {
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

  // Restore Backup State
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [pendingBackup, setPendingBackup] = useState<{
    schemaVersion?: number;
    createdAt?: string;
    codes: CodeRecord[];
    fileName: string;
  } | null>(null);
  const [restoreStrategy, setRestoreStrategy] = useState<'merge' | 'overwrite'>('merge');
  const [isRestoring, setIsRestoring] = useState(false);

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
    if (res.success) {
      showNotification(res.message);
      setIsSecurityModalOpen(false);
    } else {
      showNotification(res.message, 'error');
    }
  };

  const handleRotateAdminCode = async () => {
    if (!newAdminCodeInput.trim() || newAdminCodeInput.trim().length < 8) {
      showNotification('كود المالك الجديد يجب أن يتكون من 8 خانات على الأقل.', 'error');
      return;
    }
    setIsRotatingAdminCode(true);
    const res = await adminRotateAdminCode(newAdminCodeInput.trim(), true);
    setIsRotatingAdminCode(false);
    if (res.success) {
      showNotification(res.message);
      setNewAdminCodeInput('');
      setIsSecurityModalOpen(false);
      await loadCodes(1);
    } else {
      showNotification(res.message, 'error');
    }
  };

  // Custom delete confirmation state
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; code: string; studentName?: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
      const res = await fetchAdminCodes(adminCode, {
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
      const chosenRole = isTeacher ? 'student' : targetRole;
      const res = await adminGenerateCode(adminCode, {
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
    const isTeacherCode = code.role === 'teacher';
    const roleTitle = isTeacherCode ? 'أستاذ / معلم' : 'طالب';
    const msg = `أهلاً بك يا ${roleTitle}! 🚀\nتم تفعيل حسابك في منصة "زكي كود" لتعلم البرمجة.\n\n👤 الاسم: ${code.studentName}\n🔑 كود التفعيل: ${code.code}\n🌐 رابط المنصة: ${appUrl}\n\nافتح الرابط وضع الكود لبدء التجربة التعليمية فوراً!`;
    handleCopy(msg, `msg-${code.id}`);
  };

  const isCurrentlyActive = (code: CodeRecord) =>
    code.status === 'active' && (!code.expiresAt || Date.parse(code.expiresAt) >= Date.now());
  const pageStart = (currentPage - 1) * pageSize;
  const currentFilterCount =
    filter === 'active' ? activeCount : filter === 'expired' ? expiredCount : totalCount;
  const totalChapterCount = bookParts.reduce((total, part) => total + part.chapters.length, 0);

  const teachersCount = codes.filter((c) => c.role === 'teacher').length;
  const studentsCount = codes.filter((c) => (c.role || 'student') === 'student').length;

  return createPortal(
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center overflow-y-auto p-3 sm:p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-5xl w-full h-[calc(100dvh-1.5rem)] sm:h-[calc(100dvh-2rem)] max-h-[calc(100dvh-1.5rem)] sm:max-h-[calc(100dvh-2rem)] min-h-0 shrink-0 flex flex-col shadow-2xl text-slate-100 overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black shadow-lg ${
              isMaster
                ? 'bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 shadow-amber-500/20'
                : 'bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 shadow-emerald-500/20'
            }`}>
              {isMaster ? '👑' : '👨‍🏫'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-white text-base sm:text-lg">
                  {isMaster ? 'لوحة تحكم مالك المنصة (Super Admin)' : `لوحة المعلم - ${currentUserName || 'المعلم'}`}
                </h3>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                  isMaster
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                }`}>
                  {isMaster ? 'مالك المنصة (صلاحية كاملة)' : 'حساب معلم معتمد 👨‍🏫'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {isMaster ? 'إدارة أكواد المعلمين والطلاب والنسخ الاحتياطي والأمان' : 'إدارة ومتابعة طلاب الفصل الدراسي وتوجيههم'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isMaster && (
              <>
                <button
                  type="button"
                  onClick={() => setIsMasterCodeModalOpen(true)}
                  className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-semibold text-yellow-300 hover:text-white hover:bg-yellow-900/40 transition border border-yellow-500/30"
                  title="تعديل وتعيين كود المالك الأساسي"
                >
                  <Key className="w-4 h-4 text-yellow-400" />
                  <span className="hidden sm:inline">كود المالك 👑</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsSecurityModalOpen(true)}
                  className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-semibold text-amber-300 hover:text-white hover:bg-amber-900/40 transition border border-amber-500/30"
                  title="مركز الأمان وإبطال الجلسات وتدوير الأكواد"
                >
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  <span className="hidden sm:inline">مركز الأمان 🛡️</span>
                </button>
                <button
                  type="button"
                  onClick={() => void handleDownloadBackup()}
                  disabled={isExportingBackup}
                  className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-semibold text-emerald-300 hover:text-white hover:bg-emerald-900/40 disabled:opacity-50 transition border border-emerald-500/20"
                  title="تنزيل نسخة يدوية من بيانات المنصة"
                >
                  <Download className="w-4 h-4 text-emerald-400" />
                  <span className="hidden sm:inline">{isExportingBackup ? 'جارٍ التجهيز…' : 'نسخة احتياطية 📥'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleTriggerRestoreFile}
                  disabled={isRestoring}
                  className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-semibold text-cyan-300 hover:text-white hover:bg-cyan-900/40 disabled:opacity-50 transition border border-cyan-500/20"
                  title="استعادة بيانات وأكواد الطلاب من ملف نسخة احتياطية (JSON)"
                >
                  <Upload className="w-4 h-4 text-cyan-400" />
                  <span className="hidden sm:inline">استعادة نسخة 📤</span>
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

        {/* Navigation Tabs */}
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
            <span>{isMaster ? `إدارة الأكواد والرتب (${totalCount})` : `أكواد طلاب فصلي (${totalCount})`}</span>
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
              <div className={`grid gap-2.5 sm:gap-3 text-center ${isMaster ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-3'}`}>
                <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                  <span className="text-[11px] text-slate-400 block mb-0.5">
                    {isMaster ? 'إجمالي الأكواد' : 'إجمالي طلابك'}
                  </span>
                  <strong className="text-lg sm:text-xl font-bold text-white font-mono">{totalCount}</strong>
                </div>

                {isMaster && (
                  <div className="p-3 bg-purple-950/30 rounded-2xl border border-purple-900/40">
                    <span className="text-[11px] text-purple-400 block mb-0.5">المعلمون 👨‍🏫</span>
                    <strong className="text-lg sm:text-xl font-bold text-purple-300 font-mono">{teachersCount}</strong>
                  </div>
                )}

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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="font-bold text-sm text-amber-400 flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    <span>{isMaster ? 'توليد كود جديد (معلم / طالب)' : 'توليد كود لطالب جديد في فصلك'}</span>
                  </span>

                  {isMaster ? (
                    <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
                      <button
                        type="button"
                        onClick={() => setTargetRole('student')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                          targetRole === 'student'
                            ? 'bg-amber-500 text-slate-950 shadow-sm'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <User className="w-3.5 h-3.5" />
                        <span>كود طالب 🎓</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setTargetRole('teacher')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                          targetRole === 'teacher'
                            ? 'bg-purple-600 text-white shadow-sm'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <School className="w-3.5 h-3.5" />
                        <span>كود معلم 👨‍🏫</span>
                      </button>
                    </div>
                  ) : (
                    <span className="text-[11px] text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded-xl border border-emerald-900/50">
                      🎓 توليد كود طالب تابع لفصلك
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {/* Name Input */}
                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                      {isMaster && targetRole === 'teacher' ? 'اسم المعلم / الأستاذ:' : 'اسم الطالب / المشترك:'}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        maxLength={100}
                        value={targetName}
                        onChange={(e) => setTargetName(e.target.value)}
                        placeholder={isMaster && targetRole === 'teacher' ? 'مثال: أ. محمود إبراهيم' : 'مثال: أحمد حسام'}
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

                  {/* Master Teacher Max Students Limit */}
                  {isMaster && targetRole === 'teacher' && (
                    <div>
                      <label className="text-[11px] font-semibold text-purple-300 block mb-1">
                        الحد الأقصى لطلاب المعلم:
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          min={1}
                          max={2000}
                          value={maxStudentsLimit}
                          onChange={(e) => setMaxStudentsLimit(Number(e.target.value))}
                          className="w-full bg-slate-900 border border-purple-500/50 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-purple-400"
                        />
                        <Users className="w-3.5 h-3.5 text-purple-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>
                  )}
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
                    placeholder={
                      isMaster && targetRole === 'teacher'
                        ? 'كود مخصص للمعلم (مثال: TCH-MAHMOUD)'
                        : 'كود مخصص للطالب (مثال: STD-AHMED2026)'
                    }
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
                    <span>{isGenerating ? 'جاري الإنشاء...' : 'توليد كود تلقائي 🎲'}</span>
                  </button>
                </div>
              </div>

              {recentlyGenerated && (
                <div className="bg-emerald-950/40 border border-emerald-700/60 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-emerald-300">
                        {recentlyGenerated.role === 'teacher' ? 'تم إنشاء حساب المعلم بنجاح:' : 'تم إنشاء اشتراك الطالب وحفظه:'}
                      </p>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        recentlyGenerated.role === 'teacher'
                          ? 'bg-purple-950 text-purple-300 border border-purple-800'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}>
                        {recentlyGenerated.role === 'teacher' ? '👨‍🏫 كود معلم' : '🎓 كود طالب'}
                      </span>
                    </div>
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
                      <Share2 className="w-4 h-4" /> دعوة المستخدم
                    </button>
                  </div>
                </div>
              )}

              {/* Codes List Section */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">
                      {isMaster ? 'سجل الأكواد الصادرة في المنصة:' : 'أكواد طلاب فصلي:'}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">({currentFilterCount})</span>
                  </div>

                  {/* Filters */}
                  <div className="flex flex-wrap gap-2 items-center">
                    <label className="relative">
                      <Search className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="search"
                        value={searchQuery}
                        onChange={(event) => handleSearchChange(event.target.value)}
                        placeholder="ابحث بالاسم أو الكود"
                        className="w-full sm:w-44 bg-slate-950 border border-slate-800 rounded-xl pr-8 pl-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                        aria-label="ابحث عن مستخدم أو كود"
                      />
                    </label>

                    {/* Master Role Filter */}
                    {isMaster && (
                      <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                        <button
                          type="button"
                          onClick={() => handleRoleFilterChange('all')}
                          className={`px-2 py-1 rounded-lg transition ${
                            roleFilter === 'all' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          الكل
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRoleFilterChange('teacher')}
                          className={`px-2 py-1 rounded-lg transition ${
                            roleFilter === 'teacher' ? 'bg-purple-950 text-purple-300 font-bold border border-purple-800' : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          المعلمون ({teachersCount})
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRoleFilterChange('student')}
                          className={`px-2 py-1 rounded-lg transition ${
                            roleFilter === 'student' ? 'bg-amber-950 text-amber-300 font-bold border border-amber-800' : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          الطلاب ({studentsCount})
                        </button>
                      </div>
                    )}

                    {/* Status Filter */}
                    <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                      <button
                        type="button"
                        onClick={() => handleFilterChange('all')}
                        className={`px-2 py-1 rounded-lg transition ${
                          filter === 'all' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        الكل ({totalCount})
                      </button>
                      <button
                        type="button"
                        onClick={() => handleFilterChange('active')}
                        className={`px-2 py-1 rounded-lg transition ${
                          filter === 'active' ? 'bg-emerald-950 text-emerald-300 font-bold border border-emerald-800' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        فعال ({activeCount})
                      </button>
                      <button
                        type="button"
                        onClick={() => handleFilterChange('expired')}
                        className={`px-2 py-1 rounded-lg transition ${
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
                    <RefreshCw className="w-4 h-4 animate-spin" /> جاري تحميل قائمة الأكواد...
                  </div>
                ) : codes.length === 0 ? (
                  <div className="text-center py-8 bg-slate-950 rounded-2xl border border-slate-800 text-slate-500 text-xs">
                    {searchQuery.trim() ? 'لا توجد نتائج تطابق البحث.' : 'لا توجد أكواد مسجلة في هذا القسم حالياً.'}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {codes.map((c) => {
                      const isActive = isCurrentlyActive(c);
                      const isExpired = c.status === 'expired' || (c.status === 'active' && !isActive);
                      const isRevoked = c.status === 'revoked';
                      const isTeacherRow = c.role === 'teacher';

                      return (
                        <div
                          key={c.id}
                          className={`p-3.5 rounded-2xl border transition space-y-2.5 ${
                            isActive
                              ? isTeacherRow
                                ? 'bg-slate-950/90 border-purple-900/40 hover:border-purple-800'
                                : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                              : 'bg-slate-950/40 border-slate-800/50 opacity-80'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            {/* Left: Code info */}
                            <div className="flex items-center gap-2.5">
                              <span className={`font-mono font-black text-base tracking-wider px-2.5 py-1 rounded-xl border ${
                                isTeacherRow
                                  ? 'bg-purple-950/60 text-purple-300 border-purple-800/60'
                                  : 'bg-slate-900 text-amber-300 border-slate-800'
                              }`}>
                                {c.code}
                              </span>

                              <div className="flex flex-col">
                                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                                  <span>{c.studentName || (isTeacherRow ? 'معلم جديد' : 'طالب جديد')}</span>
                                  {isTeacherRow ? (
                                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">
                                      👨‍🏫 معلم
                                    </span>
                                  ) : (
                                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500/10 text-amber-400 font-bold border border-amber-500/20">
                                      🎓 طالب
                                    </span>
                                  )}
                                </span>
                                <span className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                                  <span>
                                    {c.expiresAt
                                      ? `ينتهي: ${new Date(c.expiresAt).toLocaleDateString('ar-EG')}`
                                      : 'صلاحية دائمة'}
                                  </span>
                                  <span>•</span>
                                  <span>استُخدم {c.usedCount || 0} مرة</span>
                                  {isTeacherRow && c.maxStudentsLimit && (
                                    <>
                                      <span>•</span>
                                      <span className="text-purple-300">حد الطلاب: {c.maxStudentsLimit}</span>
                                    </>
                                  )}
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

                          {/* Progress Track (for students) */}
                          {!isTeacherRow && (() => {
                            const completedChs = Math.min(totalChapterCount, new Set(c.progress?.completedChapters || []).size);
                            const completedQz = Math.min(bookParts.length, new Set(c.progress?.completedQuizzes || []).size);
                            const percent = Math.round(((completedChs + completedQz) / (totalChapterCount + bookParts.length)) * 100);

                            return (
                              <div className="bg-slate-900/90 rounded-xl p-2.5 border border-slate-800/80 text-[11px] space-y-1.5">
                                <div className="flex items-center justify-between">
                                  <span className="text-slate-300 font-medium flex items-center gap-1.5">
                                    <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                    <span>تقدم التعلم:</span>
                                    <strong className="text-amber-300 font-bold">{completedChs} من {totalChapterCount} فصل</strong>
                                    <span className="text-emerald-400 text-[10px]">({completedQz} اختبارات)</span>
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
                              {/* Copy code */}
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

                              {/* WhatsApp invite */}
                              <button
                                type="button"
                                onClick={() => handleCopyInvite(c)}
                                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-800/60 text-emerald-300 text-[11px] font-semibold transition"
                              >
                                {copiedKey === `msg-${c.id}` ? (
                                  <>
                                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                                    <span>تم نسخ الرسالة</span>
                                  </>
                                ) : (
                                  <>
                                    <Send className="w-3.5 h-3.5 text-emerald-400" />
                                    <span>دعوة واتساب 💬</span>
                                  </>
                                )}
                              </button>

                              {/* Edit Code Button */}
                              <button
                                type="button"
                                onClick={() => handleOpenEditModal(c)}
                                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-950/60 hover:bg-sky-900/80 border border-sky-800/60 text-sky-300 text-[11px] font-semibold transition"
                                title="تعديل الكود، الاسم، الرتبة أو الصلاحية"
                              >
                                <Pencil className="w-3.5 h-3.5 text-sky-400" />
                                <span>تعديل ✏️</span>
                              </button>

                              {/* Inspect student code */}
                              {!isTeacherRow && (
                                <button
                                  type="button"
                                  onClick={() => setInspectingStudent(c)}
                                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-950/60 hover:bg-indigo-900/80 border border-indigo-800/60 text-indigo-300 text-[11px] font-semibold transition"
                                  title="عرض وفحص الأكواد والمشاريع التي كتبها هذا الطالب"
                                >
                                  <Code2 className="w-3.5 h-3.5 text-indigo-400" />
                                  <span>
                                    أكواد الطالب 💻{' '}
                                    {c.savedSnippets && c.savedSnippets.length > 0
                                      ? `(${c.savedSnippets.length})`
                                      : ''}
                                  </span>
                                </button>
                              )}
                            </div>

                            {/* Expire, Reactivate, Delete */}
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
                                  <span>إنهاء الصلاحية</span>
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
                  <span className="text-xs text-slate-400 block mb-1">
                    {isMaster ? 'إجمالي الطلاب المسجلين' : 'طلاب فصلي النشطين'}
                  </span>
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
                    لا يوجد طلاب مسجلين بعد. أنشئ كوداً جديداً من تبويب الأكواد!
                  </div>
                ) : (
                  codes
                    .filter((c) => (c.role || 'student') === 'student')
                    .map((student) => {
                      const completedChallengesCount =
                        (student.progress as { completedChallenges?: string[] })?.completedChallenges?.length || 0;
                      const completedChaptersCount = student.progress?.completedChapters?.length || 0;
                      const snippetsCount = student.savedSnippets?.length || 0;
                      const hasDraft = Boolean(student.draftCode && student.draftCode.trim());
                      const studentFeedback = student.feedback;

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
                                title="إرسال رسالة تشجيع وملاحظة تظهر للطالب في حسابه"
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
                                📝 لديه مسودة نشطة بالمحرر
                              </span>
                            )}

                            {studentFeedback && (
                              <span className="px-2.5 py-0.5 rounded-md bg-purple-950/40 text-purple-300 border border-purple-800/40 text-[10px] flex items-center gap-1">
                                <span>💌 رسالة المعلم: "{studentFeedback.slice(0, 30)}..."</span>
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
            {isMaster
              ? '👑 أنت مسجل كمالك للمنصة مع كامل الصلاحيات لإنشاء أكواد المعلمين والطلاب.'
              : '👨‍🏫 أنت مسجل كمعلم معتمد لمتابعة طلابك وتوليد أكوادهم.'}
          </span>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition"
          >
            إغلاق
          </button>
        </div>
      </div>

      {/* Student Written Codes Inspector Modal */}
      {inspectingStudent && (
        <div className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-3xl rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] flex flex-col text-right dir-rtl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold border border-indigo-500/30">
                  <Code2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                    <span>مشاريع وأكواد الطالب:</span>
                    <span className="text-amber-300">{inspectingStudent.studentName}</span>
                  </h4>
                  <p className="text-[11px] text-slate-400 font-mono">الكود: {inspectingStudent.code}</p>
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

            <div className="flex-1 overflow-y-auto space-y-4 pr-1 custom-scrollbar">
              {/* Current Playground Draft */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <FileCode2 className="w-4 h-4 text-amber-400" />
                    <span>المسودة الحالية في محرر الأكواد (Playground Draft):</span>
                  </span>
                  {inspectingStudent.draftCode && (
                    <button
                      type="button"
                      onClick={() => handleCopy(inspectingStudent.draftCode || '', 'draft-copy')}
                      className="text-[11px] text-amber-400 hover:underline flex items-center gap-1"
                    >
                      {copiedKey === 'draft-copy' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'draft-copy' ? 'تم النسخ' : 'نسخ المسودة'}</span>
                    </button>
                  )}
                </div>
                {inspectingStudent.draftCode && inspectingStudent.draftCode.trim() ? (
                  <pre
                    dir="ltr"
                    className="p-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-amber-200 overflow-x-auto max-h-48 whitespace-pre-wrap leading-relaxed select-all"
                  >
                    {inspectingStudent.draftCode}
                  </pre>
                ) : (
                  <p className="text-xs text-slate-500 italic p-3 bg-slate-950/50 rounded-xl border border-slate-800/50">
                    لا توجد مسودة كود محفوظة حالياً لدى الطالب في المحرر.
                  </p>
                )}
              </div>

              {/* Saved Snippets List */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <span className="text-xs font-bold text-slate-300 block">
                  المشاريع البرمجية المحفوظة في حساب الطالب ({inspectingStudent.savedSnippets?.length || 0}):
                </span>
                {(!inspectingStudent.savedSnippets || inspectingStudent.savedSnippets.length === 0) ? (
                  <p className="text-xs text-slate-500 italic p-4 bg-slate-950/50 rounded-xl border border-slate-800/50 text-center">
                    لم يقم الطالب بحفظ مشاريع برمجية خاصة في حسابه بعد.
                  </p>
                ) : (
                  inspectingStudent.savedSnippets.map((snip) => (
                    <div key={snip.id} className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{snip.title}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-500 font-mono">
                            {new Date(snip.updatedAt).toLocaleDateString('ar-EG')}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              handleCopy(snip.code, `snip-${snip.id}`);
                              setCopiedAdminSnippetId(snip.id);
                              setTimeout(() => setCopiedAdminSnippetId(null), 2000);
                            }}
                            className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold"
                          >
                            {copiedAdminSnippetId === snip.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="text-emerald-400">تم النسخ</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>نسخ الكود</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                      <pre
                        dir="ltr"
                        className="p-2.5 bg-slate-900 border border-slate-800/80 rounded-lg font-mono text-xs text-emerald-300 overflow-x-auto max-h-40 whitespace-pre-wrap leading-relaxed select-all"
                      >
                        {snip.code}
                      </pre>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-end shrink-0">
              <button
                type="button"
                onClick={() => setInspectingStudent(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition"
              >
                إغلاق المعاينة
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Encouragement Feedback Modal */}
      {feedbackTarget && (
        <div className="fixed inset-0 z-[110] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 text-right dir-rtl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <MessageSquareHeart className="w-5 h-5 text-amber-400" />
                <h4 className="text-sm sm:text-base font-bold text-white">
                  إرسال ملاحظة وتشجيع للطالب ({feedbackTarget.studentName})
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setFeedbackTarget(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
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

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-rose-500/30 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden p-6 space-y-5 animate-scaleUp">
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

      {/* Security & Credential Rotation Modal (Master Admin Only) */}
      {isSecurityModalOpen && isMaster && (
        <div className="fixed inset-0 z-[110] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6 text-right dir-rtl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold border border-amber-500/30">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white">مركز الأمان وإدارة الجلسات</h3>
                  <p className="text-xs text-slate-400">إبطال الجلسات وتدوير صلاحيات الوصول</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsSecurityModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Section 1: Global Session Revocation */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                <PowerOff className="w-4 h-4" />
                <span>إبطال جميع الجلسات النشطة فوراً</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                في حال الاشتباه في تسريب أي كود أو لمزيد من الأمان، يمكنك إبطال جميع جلسات الدخول الحالية لجميع الطلاب والمعلمين بنقرة واحدة.
              </p>
              <button
                type="button"
                onClick={handleRevokeAllSessions}
                disabled={isRevokingSessions}
                className="w-full py-2.5 px-4 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 text-xs font-bold transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <PowerOff className="w-4 h-4" />
                <span>{isRevokingSessions ? 'جاري إبطال الجلسات...' : 'إبطال كل الجلسات المسجلة الآن'}</span>
              </button>
            </div>

            {/* Section 2: Rotate Admin Access Code */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <Key className="w-4 h-4" />
                <span>تدوير / إضافة كود مالك جديد (Master Admin Rotation)</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                عيّن كود مالك جديد فوري. سيتم تفعيل الكود فوراً على الخادم وإبطال الجلسات السابقة.
              </p>
              <div className="space-y-2">
                <input
                  type="text"
                  dir="ltr"
                  value={newAdminCodeInput}
                  onChange={(e) => setNewAdminCodeInput(e.target.value.toUpperCase())}
                  placeholder="مثال: ADM-MYNEWSECRETCODE2026"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-sm focus:border-amber-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleRotateAdminCode}
                  disabled={isRotatingAdminCode || !newAdminCodeInput.trim()}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-50"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>{isRotatingAdminCode ? 'جاري تدوير الكود...' : 'حفظ وتفعيل كود المالك الجديد'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Restore Backup Preview & Confirmation Modal (Master Admin Only) */}
      {pendingBackup && isMaster && (
        <div className="fixed inset-0 z-[110] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6 text-right dir-rtl">
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

            {/* Backup Info Overview */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-300 pb-2 border-b border-slate-800/80">
                <span className="text-slate-400">اسم الملف:</span>
                <span className="font-mono font-bold text-white text-[11px] truncate max-w-[200px]">{pendingBackup.fileName}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-300 pb-2 border-b border-slate-800/80">
                <span className="text-slate-400">تاريخ النسخة:</span>
                <span className="text-amber-300 font-mono">{new Date(pendingBackup.createdAt || '').toLocaleString('ar-EG')}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="text-slate-400">عدد السجلات المكتشفة:</span>
                <span className="text-emerald-400 font-bold text-sm bg-emerald-500/10 px-2.5 py-0.5 rounded-lg border border-emerald-500/20">
                  {pendingBackup.codes.length} كود
                </span>
              </div>
            </div>

            {/* Strategy Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 block">طريقة الاستعادة:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRestoreStrategy('merge')}
                  className={`p-3 rounded-2xl border text-right transition space-y-1 ${
                    restoreStrategy === 'merge'
                      ? 'bg-cyan-500/15 border-cyan-500/50 text-cyan-300 ring-1 ring-cyan-500/30'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="font-bold text-xs flex items-center gap-1.5">
                    <span>دمج وتحديث (Merge)</span>
                    {restoreStrategy === 'merge' && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                  </div>
                  <p className="text-[10px] text-slate-400 leading-tight">يحافظ على الأكواد الموجودة ويضيف الجديد.</p>
                </button>

                <button
                  type="button"
                  onClick={() => setRestoreStrategy('overwrite')}
                  className={`p-3 rounded-2xl border text-right transition space-y-1 ${
                    restoreStrategy === 'overwrite'
                      ? 'bg-amber-500/15 border-amber-500/50 text-amber-300 ring-1 ring-amber-500/30'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="font-bold text-xs flex items-center gap-1.5">
                    <span>استبدال كامل (Overwrite)</span>
                    {restoreStrategy === 'overwrite' && <Check className="w-3.5 h-3.5 text-amber-400" />}
                  </div>
                  <p className="text-[10px] text-slate-400 leading-tight">يكتب السجلات بالكامل كما هي في الملف.</p>
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleExecuteRestore}
                disabled={isRestoring}
                className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-black text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 disabled:opacity-50"
              >
                <Upload className="w-4 h-4" />
                <span>{isRestoring ? 'جاري الاستعادة والمزامنة...' : `تأكيد استعادة (${pendingBackup.codes.length}) كود 🚀`}</span>
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

      {/* Edit Code Modal (Master & Teacher) */}
      {editingCode && (
        <div className="fixed inset-0 z-[110] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-sky-500/40 w-full max-w-lg rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 text-right dir-rtl max-h-[90vh] overflow-y-auto">
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
                <span className="text-[10px] text-slate-500">
                  يمكنك تغيير رمز الكود وسيتم نقل تقدم الطالب ومسوداته للكود الجديد تلقائياً.
                </span>
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

            {/* Actions */}
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

      {/* Master Code Customization Modal (Super Admin Only) */}
      {isMasterCodeModalOpen && isMaster && (
        <div className="fixed inset-0 z-[110] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
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
                كود المالك هو الكود الأعلى صلاحية في المنصة، والذي يتيح لك إنشاء وتعديل أكواد المعلمين والطلاب، وتعيين الحصص، وأخذ النسخ الاحتياطية وإدارة الأمان.
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
              <span className="text-[11px] text-slate-500 block">
                يجب أن يحتوي على 6 أحرف/أرقام على الأقل، بدون مسافات.
              </span>
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
    </div>,
    document.body,
  );
};
