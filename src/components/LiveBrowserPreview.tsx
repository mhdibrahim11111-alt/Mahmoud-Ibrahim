import React, { useState, useEffect } from 'react';
import {
  Globe,
  RotateCcw,
  Monitor,
  Smartphone,
  Tablet,
  Terminal,
  AlertTriangle,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

interface LiveBrowserPreviewProps {
  htmlContent: string;
  title?: string;
  height?: string;
  onThemeChange?: (theme: 'dark' | 'light') => void;
}

export const LiveBrowserPreview: React.FC<LiveBrowserPreviewProps> = ({
  htmlContent,
  title = 'معاينة حية للمتصفح (Browser Live View)',
  height = '320px',
}) => {
  const [reloadKey, setReloadKey] = useState(0);
  const [deviceWidth, setDeviceWidth] = useState<'full' | 'tablet' | 'mobile'>('full');
  const [activeTab, setActiveTab] = useState<'preview' | 'console'>('preview');
  const [capturedLogs, setCapturedLogs] = useState<{ type: string; message: string; time: string }[]>([]);

  // Listen to messages from the preview iframe bridge
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.source === 'code-preview-frame') {
        const time = new Date().toLocaleTimeString('ar-EG', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        });
        setCapturedLogs((prev) => [
          ...prev,
          {
            type: event.data.type,
            message: event.data.message,
            time,
          },
        ]);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Clear logs when reloading
  const handleReload = () => {
    setCapturedLogs([]);
    setReloadKey((prev) => prev + 1);
  };

  const errorCount = capturedLogs.filter((l) => l.type === 'error').length;

  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-950 overflow-hidden shadow-2xl flex flex-col w-full h-full min-h-[360px]">
      {/* Mock Browser Header */}
      <div className="bg-slate-900 px-3 py-2 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs select-none">
        <div className="flex items-center gap-2">
          {/* Traffic lights */}
          <div className="flex items-center gap-1.5 pl-1">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></div>
          </div>

          <span className="font-bold text-slate-200 mr-1 flex items-center gap-1.5 text-[11px]">
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span className="truncate max-w-[140px] sm:max-w-xs">{title}</span>
          </span>
        </div>

        {/* View mode tabs: Preview vs Console */}
        <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-[11px]">
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-2.5 py-0.5 rounded transition font-medium ${
              activeTab === 'preview'
                ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            المعاينة
          </button>
          <button
            onClick={() => setActiveTab('console')}
            className={`px-2.5 py-0.5 rounded transition font-medium flex items-center gap-1 ${
              activeTab === 'console'
                ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Terminal className="w-3 h-3" />
            <span>Console</span>
            {capturedLogs.length > 0 && (
              <span
                className={`text-[9px] px-1 py-0.2 rounded-full font-mono ${
                  errorCount > 0 ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-300'
                }`}
              >
                {capturedLogs.length}
              </span>
            )}
          </button>
        </div>

        {/* Responsive Width & Actions (Always visible, responsive on mobile & desktop) */}
        <div className="flex items-center gap-1.5">
          {/* Responsive device buttons */}
          <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800">
            <button
              onClick={() => setDeviceWidth('full')}
              title="عرض شاشة كاملة (Desktop)"
              className={`p-1.5 rounded transition ${
                deviceWidth === 'full'
                  ? 'bg-slate-800 text-cyan-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setDeviceWidth('tablet')}
              title="عرض مقاس تابلت (Tablet • 640px)"
              className={`p-1.5 rounded transition ${
                deviceWidth === 'tablet'
                  ? 'bg-slate-800 text-cyan-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Tablet className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setDeviceWidth('mobile')}
              title="عرض مقاس موبايل (Mobile • 375px)"
              className={`p-1.5 rounded transition ${
                deviceWidth === 'mobile'
                  ? 'bg-slate-800 text-cyan-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>

          <div
            dir="ltr"
            className="hidden xl:block px-2 py-0.5 rounded bg-slate-950 text-[10px] text-slate-400 font-mono border border-slate-800"
          >
            https://my-project.local
          </div>

          <button
            onClick={handleReload}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition"
            title="إعادة تحميل المعاينة ومسح السجلات"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-slate-950 flex-1 overflow-auto custom-scrollbar relative flex flex-col items-center justify-center p-2 sm:p-4">
        {activeTab === 'preview' ? (
          <>
            {/* 1. Mobile Phone Mockup View */}
            {deviceWidth === 'mobile' && (
              <div className="w-full flex flex-col items-center justify-center py-2 animate-fadeIn">
                {/* Device Badge */}
                <div className="mb-2 text-[11px] text-cyan-300 font-mono bg-slate-900 px-3 py-1 rounded-full border border-slate-800 flex items-center gap-1.5 shadow-sm">
                  <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
                  <span>محاكاة شاشة الموبايل (iPhone / Android • 375px)</span>
                </div>

                {/* Smartphone Chassis Mockup */}
                <div className="w-[375px] max-w-full h-[580px] max-h-[75vh] min-h-[460px] rounded-[2.5rem] bg-slate-900 p-3 shadow-2xl border-4 border-slate-700/80 ring-1 ring-slate-600/30 flex flex-col shrink-0 select-none">
                  {/* Phone Status Bar & Dynamic Island */}
                  <div className="h-6 w-full flex items-center justify-between px-5 mb-1.5 shrink-0">
                    <span className="text-[11px] font-bold text-slate-300 font-mono">9:41</span>
                    {/* Dynamic Island */}
                    <div className="w-20 h-4 bg-slate-950 rounded-full flex items-center justify-center gap-1.5 border border-slate-800/80 shadow-inner">
                      <div className="w-2 h-2 rounded-full bg-slate-800"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-500/40"></div>
                    </div>
                    {/* Signal & Battery */}
                    <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono">
                      <span>5G</span>
                      <div className="w-4 h-2 rounded-2xs border border-slate-400 p-0.5 flex items-center">
                        <div className="w-full h-full bg-emerald-400 rounded-2xs"></div>
                      </div>
                    </div>
                  </div>

                  {/* Phone Screen Viewport */}
                  <div className="w-full flex-1 rounded-[1.75rem] overflow-hidden bg-white shadow-inner relative">
                    <iframe
                      key={`mobile-${reloadKey}`}
                      srcDoc={htmlContent}
                      title="Mobile Web Preview"
                      sandbox="allow-scripts allow-modals"
                      className="w-full h-full border-0 bg-white"
                    />
                  </div>

                  {/* Phone Bottom Home Bar */}
                  <div className="w-full pt-2 flex items-center justify-center shrink-0">
                    <div className="w-28 h-1 bg-slate-600 rounded-full"></div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. Tablet Mockup View */}
            {deviceWidth === 'tablet' && (
              <div className="w-full flex flex-col items-center justify-center py-2 animate-fadeIn">
                {/* Device Badge */}
                <div className="mb-2 text-[11px] text-cyan-300 font-mono bg-slate-900 px-3 py-1 rounded-full border border-slate-800 flex items-center gap-1.5 shadow-sm">
                  <Tablet className="w-3.5 h-3.5 text-cyan-400" />
                  <span>محاكاة شاشة التابلت (Tablet Viewport • 640px)</span>
                </div>

                {/* Tablet Chassis Mockup */}
                <div className="w-[640px] max-w-full h-[560px] max-h-[75vh] min-h-[440px] rounded-[2rem] bg-slate-900 p-3 shadow-2xl border-4 border-slate-700/80 ring-1 ring-slate-600/30 flex flex-col shrink-0 select-none">
                  {/* Tablet Top Camera */}
                  <div className="h-4 w-full flex items-center justify-center mb-1 shrink-0">
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-950 border border-slate-800"></div>
                  </div>

                  {/* Screen Viewport */}
                  <div className="w-full flex-1 rounded-xl overflow-hidden bg-white shadow-inner relative">
                    <iframe
                      key={`tablet-${reloadKey}`}
                      srcDoc={htmlContent}
                      title="Tablet Web Preview"
                      sandbox="allow-scripts allow-modals"
                      className="w-full h-full border-0 bg-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 3. Full Width Desktop View */}
            {deviceWidth === 'full' && (
              <div className="w-full h-full flex-1 flex flex-col animate-fadeIn">
                <iframe
                  key={`full-${reloadKey}`}
                  srcDoc={htmlContent}
                  title="Full Web Preview"
                  sandbox="allow-scripts allow-modals"
                  style={{ height: height === '100%' ? '100%' : height, minHeight: '260px' }}
                  className="w-full flex-1 bg-white border-0 shadow-inner rounded-xl"
                />
              </div>
            )}
          </>
        ) : (
          /* Console Tab */
          <div
            style={{ height: height === '100%' ? '100%' : height, minHeight: '260px' }}
            className="w-full p-4 overflow-y-auto font-mono text-xs text-left dir-ltr bg-slate-950 space-y-2 custom-scrollbar flex-1"
          >
            <div className="text-[10px] text-slate-500 mb-2 border-b border-slate-800 pb-1 flex items-center justify-between">
              <span>// Browser Console Output:</span>
              <button
                onClick={() => setCapturedLogs([])}
                className="text-slate-500 hover:text-slate-300 transition"
              >
                Clear
              </button>
            </div>

            {capturedLogs.length === 0 ? (
              <div className="text-slate-600 flex flex-col items-center justify-center h-32 select-none">
                <Terminal className="w-6 h-6 mb-2 opacity-40" />
                <p className="text-[11px]">لا توجد مخرجات console.log أو أخطاء برمجية بعد.</p>
              </div>
            ) : (
              capturedLogs.map((log, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded-lg text-xs leading-relaxed ${
                    log.type === 'error'
                      ? 'bg-rose-950/40 text-rose-300 border border-rose-900/60'
                      : log.type === 'warn'
                      ? 'bg-amber-950/40 text-amber-300 border border-amber-900/60'
                      : 'bg-slate-900 text-emerald-400 border border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-slate-500 mb-0.5">
                    <span className="uppercase font-bold tracking-wider">{log.type}</span>
                    <span>{log.time}</span>
                  </div>
                  <div className="whitespace-pre-wrap break-all">{log.message}</div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Footer Status Bar */}
      <div className="bg-slate-900/90 px-3 py-1.5 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between select-none shrink-0">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>المتصفح نشط (HTML5 & CSS3 Sandbox)</span>
        </span>
        {errorCount > 0 ? (
          <button
            onClick={() => setActiveTab('console')}
            className="text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1 transition"
          >
            <AlertTriangle className="w-3 h-3" />
            <span>يوجد {errorCount} خطأ في المتصفح! اضغط للعرض</span>
          </button>
        ) : (
          <span className="text-slate-500 font-mono text-[10px]">
            {deviceWidth === 'mobile' ? 'Mobile (375px)' : deviceWidth === 'tablet' ? 'Tablet (640px)' : 'Full (100%)'}
          </span>
        )}
      </div>
    </div>
  );
};
