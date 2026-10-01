import React, { useState, useEffect } from 'react';
import {
  CodeRecord,
  fetchAdminCodes,
  adminGenerateCode,
  adminExpireCode,
  adminReactivateCode,
  adminDeleteCode,
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
} from 'lucide-react';

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

  const loadCodes = async () => {
    setLoading(true);
    const res = await fetchAdminCodes(adminCode);
    if (res.success) {
      setCodes(res.codes);
    } else {
      setNotice({ text: res.message || 'فشل تحميل الأكواد', type: 'error' });
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      loadCodes();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const showNotification = (text: string, type: 'success' | 'error' = 'success') => {
    setNotice({ text, type });
    setTimeout(() => setNotice(null), 3500);
  };

  const handleGenerate = async (useRandom = false) => {
    const res = await adminGenerateCode(adminCode, {
      studentName: studentName.trim() || undefined,
      customCode: useRandom ? undefined : newCustomCode.trim() || undefined,
      durationDays: durationDays > 0 ? durationDays : null,
    });

    if (res.success) {
      showNotification(`✓ ${res.message} الكود: ${res.code?.code}`);
      setNewCustomCode('');
      setStudentName('');
      loadCodes();
    } else {
      showNotification(res.message, 'error');
    }
  };

  const handleExpire = async (codeId: string) => {
    const res = await adminExpireCode(adminCode, codeId);
    if (res.success) {
      showNotification(res.message);
      loadCodes();
    } else {
      showNotification(res.message, 'error');
    }
  };

  const handleReactivate = async (codeId: string, days = 30) => {
    const res = await adminReactivateCode(adminCode, codeId, days);
    if (res.success) {
      showNotification(res.message);
      loadCodes();
    } else {
      showNotification(res.message, 'error');
    }
  };

  const handleDelete = async (codeId: string, codeStr: string) => {
    if (!window.confirm(`هل أنت متأكد من حذف الكود "${codeStr}" نهائياً؟`)) return;

    const res = await adminDeleteCode(adminCode, codeId);
    if (res.success) {
      showNotification(res.message);
      loadCodes();
    } else {
      showNotification(res.message, 'error');
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleCopyInvite = (code: CodeRecord) => {
    const appUrl = window.location.origin;
    const msg = `أهلاً بك يا بطل! 🚀\nتم تفعيل اشتراكك في منصة "كود بالمصري" لتعلم البرمجة.\n\n👤 الطالب: ${code.studentName}\n🔑 كود التفعيل: ${code.code}\n🌐 رابط المنصة: ${appUrl}\n\nافتح الرابط وضع الكود لبدء المذاكرة ومختبر الأكواد فوراً!`;
    handleCopy(msg, `msg-${code.id}`);
  };

  const filteredCodes = codes.filter((c) => {
    if (filter === 'active') return c.status === 'active';
    if (filter === 'expired') return c.status === 'expired' || c.status === 'revoked';
    return true;
  });

  const activeCount = codes.filter((c) => c.status === 'active').length;
  const expiredCount = codes.filter((c) => c.status === 'expired' || c.status === 'revoked').length;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden">
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
              <p className="text-xs text-slate-400">
                أنت مسجل كمدير بالرمز: <span className="font-mono text-amber-300 font-bold">{adminCode}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadCodes}
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

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 custom-scrollbar">
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
                value={newCustomCode}
                onChange={(e) => setNewCustomCode(e.target.value.toUpperCase())}
                placeholder="كود مخصص يدوي (مثال: AHMED-2026)"
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-amber-300 font-mono font-bold uppercase focus:outline-none focus:border-amber-500"
              />

              <button
                type="button"
                onClick={() => handleGenerate(false)}
                disabled={!newCustomCode.trim()}
                className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition active:scale-95 disabled:opacity-40"
              >
                <Check className="w-4 h-4" />
                <span>حفظ الكود المخصص</span>
              </button>

              <button
                type="button"
                onClick={() => handleGenerate(true)}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition active:scale-95 shadow"
              >
                <Dices className="w-4 h-4" />
                <span>توليد كود عشوائي 🎲</span>
              </button>
            </div>
          </div>

          {/* Codes List Section */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-white">قائمة الأكواد الصادرة:</span>
                <span className="text-xs text-slate-500 font-mono">({filteredCodes.length})</span>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                <button
                  type="button"
                  onClick={() => setFilter('all')}
                  className={`px-2.5 py-1 rounded-lg transition ${
                    filter === 'all' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  الكل ({codes.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilter('active')}
                  className={`px-2.5 py-1 rounded-lg transition ${
                    filter === 'active' ? 'bg-emerald-950 text-emerald-300 font-bold border border-emerald-800' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  فعال ({activeCount})
                </button>
                <button
                  type="button"
                  onClick={() => setFilter('expired')}
                  className={`px-2.5 py-1 rounded-lg transition ${
                    filter === 'expired' ? 'bg-rose-950 text-rose-300 font-bold border border-rose-800' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  منتهي ({expiredCount})
                </button>
              </div>
            </div>

            {/* List */}
            {filteredCodes.length === 0 ? (
              <div className="text-center py-8 bg-slate-950 rounded-2xl border border-slate-800 text-slate-500 text-xs">
                لا توجد أكواد في هذا التصنيف حالياً.
              </div>
            ) : (
              <div className="space-y-2">
                {filteredCodes.map((c) => {
                  const isActive = c.status === 'active';
                  const isExpired = c.status === 'expired';
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
                        const completedChs = c.progress?.completedChapters?.length || 0;
                        const completedQz = c.progress?.completedQuizzes?.length || 0;
                        const percent = Math.min(100, Math.round(((completedChs + completedQz) / (25 + 5)) * 100));

                        return (
                          <div className="bg-slate-900/90 rounded-xl p-2.5 border border-slate-800/80 text-[11px] space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-slate-300 font-medium flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                <span>إنجاز هذا الطالب:</span>
                                <strong className="text-amber-300 font-bold">{completedChs} من 25 فصل</strong>
                                {completedQz > 0 && (
                                  <span className="text-emerald-400 text-[10px]">({completedQz} اختبارات مجتازة)</span>
                                )}
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
                              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-900/50 text-emerald-300 text-[11px] font-semibold transition"
                              title="إعادة تفعيل الكود لمدة 30 يوماً"
                            >
                              <RotateCcw className="w-3 h-3 text-emerald-400" />
                              <span>إعادة تفعيل 🔄</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleDelete(c.id, c.code)}
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
          </div>
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
    </div>
  );
};
