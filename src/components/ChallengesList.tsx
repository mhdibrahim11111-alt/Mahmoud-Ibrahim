import React, { useState } from 'react';
import { Part, Challenge } from '../types';
import { runJavaScript } from '../utils/codeRunner';
import { detectCodeLanguage, buildHtmlPreviewDocument } from '../utils/codePreview';
import { CodeBlock } from './CodeBlock';
import { LiveBrowserPreview } from './LiveBrowserPreview';
import {
  Trophy,
  CheckCircle,
  Play,
  RotateCcw,
  Sparkles,
  HelpCircle,
  Filter,
  Globe,
  Eye,
} from 'lucide-react';

interface ChallengesListProps {
  parts: Part[];
  onOpenChapter: (chapterId: number) => void;
}

export const ChallengesList: React.FC<ChallengesListProps> = ({
  parts,
  onOpenChapter,
}) => {
  // Flatten all challenges across chapters
  const allChallenges = parts.flatMap((part) =>
    part.chapters
      .filter((ch) => !!ch.challenge)
      .map((ch) => ({
        chapter: ch,
        part: part,
        challenge: ch.challenge as Challenge,
      }))
  );

  const [selectedChallengeId, setSelectedChallengeId] = useState<string>(
    allChallenges[0]?.challenge.id || ''
  );
  const [filterPartId, setFilterPartId] = useState<number | 'all'>('all');
  const [userCode, setUserCode] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState<{ logs: string[]; errors: string[] } | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [solvedMap, setSolvedMap] = useState<Record<string, boolean>>({});
  const [htmlPreviewDoc, setHtmlPreviewDoc] = useState<string | null>(null);

  const currentItem = allChallenges.find(
    (c) => c.challenge.id === selectedChallengeId
  );

  React.useEffect(() => {
    if (currentItem) {
      setUserCode(currentItem.challenge.initialCode);
      setOutput(null);
      setHtmlPreviewDoc(null);
      setShowHint(false);
      setShowSolution(false);
    }
  }, [selectedChallengeId]);

  const handleRun = async () => {
    if (!currentItem) return;
    setIsRunning(true);

    const lang = detectCodeLanguage(userCode);
    const isWeb =
      lang === 'html' ||
      lang === 'css' ||
      currentItem.challenge.id === 'ch18-chal' ||
      currentItem.challenge.id === 'ch19-chal';

    if (isWeb) {
      const doc = buildHtmlPreviewDocument(userCode, lang === 'css' ? 'css' : 'html');
      setHtmlPreviewDoc(doc);

      // Validation logic for web challenges
      let isValid = false;
      const feedbackLogs: string[] = [];
      const feedbackErrors: string[] = [];

      if (currentItem.challenge.id === 'ch18-chal') {
        const hasH1 = /<h1\b[^>]*>.*?<\/h1>/is.test(userCode);
        const hasP = /<p\b[^>]*>.*?<\/p>/is.test(userCode);
        const hasUl = /<ul\b[^>]*>[\s\S]*?<\/ul>/is.test(userCode);
        const hasLi = /<li\b[^>]*>.*?<\/li>/is.test(userCode);

        if (hasH1 && hasP && hasUl && hasLi) {
          isValid = true;
          feedbackLogs.push('🎉 برافو عليك! كتبت هيكل الـ HTML المطلوب بالكامل:');
          feedbackLogs.push('✓ وسم <h1> لعنوان بطاقتك.');
          feedbackLogs.push('✓ وسم <p> لفقرة التعريف.');
          feedbackLogs.push('✓ وسم <ul> وقائمة <li> للهوايات.');
          feedbackLogs.push('المعاينة الحية لصفحتك معروضة أمامك في المتصفح!');
        } else {
          const missing: string[] = [];
          if (!hasH1) missing.push('وسم العنوان <h1>');
          if (!hasP) missing.push('وسم الفقرة <p>');
          if (!hasUl || !hasLi) missing.push('قائمة الهوايات <ul> مع وسوم <li>');
          feedbackErrors.push('فاضل شوية حاجات: تأكد من إضافة ' + missing.join(' و '));
        }
      } else if (currentItem.challenge.id === 'ch19-chal') {
        const hasHighlightClass = /\.highlight\s*\{[\s\S]*?\}/i.test(userCode);
        const hasColor = /color\s*:\s*(yellow|#[0-9a-fA-F]+)/i.test(userCode);

        if (hasHighlightClass) {
          isValid = true;
          feedbackLogs.push('🎉 عاش جداً! كتبت قاعدة CSS ممتازة لكلاس .highlight:');
          feedbackLogs.push('✓ المحدّد .highlight مكتوب بشكل صحيح.');
          feedbackLogs.push('✓ تم تطبيق التنسيق على النص في المعاينة الحية للمتصفح!');
        } else {
          feedbackErrors.push('تأكد من كتابة كلاس .highlight مع فتح القوسين { } وتحديد لون النص color: yellow;');
        }
      } else {
        isValid = true;
        feedbackLogs.push('✓ تم تفعيل المعاينة الحية في المتصفح بنجاح!');
      }

      setOutput({ logs: feedbackLogs, errors: feedbackErrors });
      if (isValid) {
        setSolvedMap((prev) => ({ ...prev, [currentItem.challenge.id]: true }));
      }
      setIsRunning(false);
      return;
    }

    // JavaScript Challenge
    setHtmlPreviewDoc(null);
    const res = await runJavaScript(userCode);
    setOutput({ logs: res.logs, errors: res.errors });
    setIsRunning(false);

    if (res.errors.length === 0 && res.logs.length > 0) {
      setSolvedMap((prev) => ({ ...prev, [currentItem.challenge.id]: true }));
    }
  };

  const filteredChallenges = allChallenges.filter((item) => {
    if (filterPartId !== 'all' && item.part.id !== filterPartId) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6 animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 p-6 rounded-2xl border border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30 shrink-0 font-bold text-xl">
            🧠
          </div>
          <div>
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              تحديات "وريني شطارتك"
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold">
                {Object.keys(solvedMap).length} من {allChallenges.length} منجز
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              مجموعة التحديات البرمجية الـ 25 الموزعة على فصول الكتاب لاختبار قدراتك عملياً في جافاسكريبت و HTML و CSS
            </p>
          </div>
        </div>

        {/* Filter by Part */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={filterPartId}
            onChange={(e) =>
              setFilterPartId(e.target.value === 'all' ? 'all' : Number(e.target.value))
            }
            className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
          >
            <option value="all">كل الأجزاء ({allChallenges.length} تحدي)</option>
            {parts.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title.split(':')[0]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid: Challenges Sidebar + Editor Arena */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Challenges Sidebar List */}
        <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-3 h-[600px] overflow-y-auto space-y-1.5 custom-scrollbar">
          {filteredChallenges.map((item) => {
            const isSelected = item.challenge.id === selectedChallengeId;
            const isSolved = solvedMap[item.challenge.id];
            const isWebChallenge =
              item.challenge.id === 'ch18-chal' || item.challenge.id === 'ch19-chal';

            return (
              <button
                key={item.challenge.id}
                onClick={() => setSelectedChallengeId(item.challenge.id)}
                className={`w-full text-right p-3 rounded-xl transition flex items-center justify-between text-xs ${
                  isSelected
                    ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40 font-bold'
                    : 'bg-slate-950/40 text-slate-300 hover:bg-slate-800/60 border border-slate-800/80'
                }`}
              >
                <div className="truncate pl-2">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-[10px] text-amber-400 font-mono">
                      {item.chapter.title.split(':')[0]}
                    </span>
                    {isWebChallenge && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                        ويب
                      </span>
                    )}
                  </div>
                  <span className="truncate block font-semibold">
                    {item.challenge.title.replace('وريني شطارتك 🧠: ', '')}
                  </span>
                </div>

                <div className="shrink-0 mr-2">
                  {isSolved ? (
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-slate-700"></div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Challenge Arena */}
        {currentItem && (
          <div className="lg:col-span-2 bg-slate-900/80 rounded-2xl border border-slate-800 p-6 flex flex-col justify-between shadow-xl space-y-5">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div>
                  <span className="text-xs text-amber-400 font-semibold block">
                    {currentItem.chapter.title}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {currentItem.part.title.split(':')[0]}
                  </span>
                </div>

                <button
                  onClick={() => onOpenChapter(currentItem.chapter.id)}
                  className="text-xs text-slate-400 hover:text-white underline decoration-slate-600 underline-offset-4"
                >
                  الذهاب لشرح الفصل ↗
                </button>
              </div>

              <h3 className="text-lg font-black text-white">
                {currentItem.challenge.title}
              </h3>

              <div className="p-3.5 bg-slate-950/70 rounded-xl border border-slate-800 text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                {currentItem.challenge.prompt}
              </div>

              {/* Hints & Solutions toggles */}
              <div className="flex items-center gap-3 text-xs">
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="text-amber-400 hover:text-amber-300 font-medium"
                >
                  {showHint ? 'إخفاء التلميح' : 'محتاج تلميح؟ 💡'}
                </button>
                <button
                  onClick={() => setShowSolution(!showSolution)}
                  className="text-slate-400 hover:text-slate-200 font-medium"
                >
                  {showSolution ? 'إخفاء الحل' : 'عرض الحل النموذجي 🔑'}
                </button>
              </div>

              {showHint && (
                <div className="p-3 bg-amber-950/40 rounded-xl border border-amber-500/30 text-xs text-amber-200 animate-fadeIn">
                  <strong>تلميح:</strong> {currentItem.challenge.hint}
                </div>
              )}

              {showSolution && (
                <div className="rounded-xl border border-emerald-900/40 overflow-hidden animate-fadeIn">
                  <CodeBlock code={currentItem.challenge.solutionCode} />
                </div>
              )}

              {/* Code Editor */}
              <div className="space-y-1.5">
                <textarea
                  value={userCode}
                  onChange={(e) => setUserCode(e.target.value)}
                  rows={6}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs sm:text-sm font-mono text-amber-200 focus:outline-none focus:border-amber-500 text-left dir-ltr custom-scrollbar"
                  placeholder="// اكتب كودك هنا..."
                />
              </div>

              {/* Actions & Runner */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setUserCode(currentItem.challenge.initialCode)}
                  className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  إعادة تعيين الكود
                </button>

                <button
                  onClick={handleRun}
                  disabled={isRunning}
                  className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-2 rounded-xl text-xs sm:text-sm transition active:scale-95 shadow-lg shadow-amber-500/20"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{isRunning ? 'جاري الفحص...' : 'تشغيل واختبار الكود'}</span>
                </button>
              </div>

              {/* Live Web Preview for HTML/CSS challenges */}
              {htmlPreviewDoc && (
                <div className="animate-fadeIn space-y-2">
                  <div className="text-xs font-bold text-cyan-400 flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5" />
                    <span>المعاينة الحية لصفحة الويب الخاصة بك:</span>
                  </div>
                  <LiveBrowserPreview
                    htmlContent={htmlPreviewDoc}
                    title="معاينة حل التحدي في المتصفح"
                    height="190px"
                  />
                </div>
              )}

              {/* Output Result */}
              {output && (
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono space-y-1">
                  <div className="text-[10px] text-slate-400 flex items-center justify-between mb-1">
                    <span>نتيجة الفحص والاختبار:</span>
                    {solvedMap[currentItem.challenge.id] && (
                      <span className="text-emerald-400 font-bold">تم حل التحدي بنجاح 🎯</span>
                    )}
                  </div>
                  {output.logs.map((l, i) => (
                    <div key={i} className="text-emerald-400 text-right dir-rtl leading-relaxed">
                      {l}
                    </div>
                  ))}
                  {output.errors.map((e, i) => (
                    <div key={i} className="text-rose-400 text-right dir-rtl leading-relaxed">
                      {e}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
