import React, { useState, useEffect } from 'react';
import {
  Globe,
  RotateCcw,
  Monitor,
  Smartphone,
  Tablet,
  Sun,
  Moon,
  Terminal,
  AlertTriangle,
  ExternalLink,
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
    <div className="rounded-2xl border border-slate-700 bg-slate-950 overflow-hidden shadow-2xl flex flex-col w-full">
      {/* Mock Browser Header */}
      <div className="bg-slate-900 px-3 py-2 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          {/* Traffic lights */}
          <div className="flex items-center gap-1.5 pl-1">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></div>
          </div>

          <span className="font-bold text-slate-200 mr-2 flex items-center gap-1 text-[11px]">
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            {title}
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
            المعاينة المرئية
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
            <span>الـ Console</span>
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

        {/* Responsive Width & Actions */}
        <div className="flex items-center gap-1.5">
          {/* Responsive device buttons */}
          <div className="hidden sm:flex items-center bg-slate-950 p-0.5 rounded border border-slate-800">
            <button
              onClick={() => setDeviceWidth('full')}
              title="عرض شاشة كاملة"
              className={`p-1 rounded ${deviceWidth === 'full' ? 'bg-slate-800 text-cyan-400' : 'text-slate-400'}`}
            >
              <Monitor className="w-3 h-3" />
            </button>
            <button
              onClick={() => setDeviceWidth('tablet')}
              title="عرض مقاس تابلت (600px)"
              className={`p-1 rounded ${deviceWidth === 'tablet' ? 'bg-slate-800 text-cyan-400' : 'text-slate-400'}`}
            >
              <Tablet className="w-3 h-3" />
            </button>
            <button
              onClick={() => setDeviceWidth('mobile')}
              title="عرض مقاس موبايل (360px)"
              className={`p-1 rounded ${deviceWidth === 'mobile' ? 'bg-slate-800 text-cyan-400' : 'text-slate-400'}`}
            >
              <Smartphone className="w-3 h-3" />
            </button>
          </div>

          <div
            dir="ltr"
            className="hidden md:block px-2 py-0.5 rounded bg-slate-950 text-[10px] text-slate-400 font-mono border border-slate-800"
          >
            https://my-web-project.local
          </div>

          <button
            onClick={handleReload}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition"
            title="إعادة تحميل المعاينة ومسح السجلات"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Content: Iframe Live Preview OR Console Tab */}
      <div className="bg-slate-950 flex-1 overflow-hidden relative flex flex-col items-center justify-center">
        {activeTab === 'preview' ? (
          <div
            className={`w-full transition-all duration-300 flex-1 flex flex-col ${
              deviceWidth === 'tablet'
                ? 'max-w-[600px] border-x border-slate-800 my-1 shadow-2xl'
                : deviceWidth === 'mobile'
                ? 'max-w-[360px] border-x border-slate-800 my-1 shadow-2xl'
                : 'max-w-full'
            }`}
          >
            <iframe
              key={reloadKey}
              srcDoc={htmlContent}
              title="Live Web Preview"
              sandbox="allow-scripts allow-modals"
              style={{ height, minHeight: '220px' }}
              className="w-full flex-1 bg-white border-0 shadow-inner"
            />
          </div>
        ) : (
          <div
            style={{ height, minHeight: '220px' }}
            className="w-full p-4 overflow-y-auto font-mono text-xs text-left dir-ltr bg-slate-950 space-y-2 custom-scrollbar"
          >
            <div className="text-[10px] text-slate-500 mb-2 border-b border-slate-800 pb-1 flex items-center justify-between">
              <span>// Browser Console Output:</span>
              <button
                onClick={() => setCapturedLogs([])}
                className="text-slate-500 hover:text-slate-300"
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
                  <div className="whitespace-pre-wrap">{log.message}</div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Footer Status Bar */}
      <div className="bg-slate-900/90 px-3 py-1.5 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>المتصفح نشط (HTML5 & CSS3 Sandbox)</span>
        </span>
        {errorCount > 0 ? (
          <button
            onClick={() => setActiveTab('console')}
            className="text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1"
          >
            <AlertTriangle className="w-3 h-3" />
            <span>يوجد {errorCount} خطأ في المتصفح! اضغط للعرض</span>
          </button>
        ) : (
          <span className="text-slate-500 font-mono text-[10px]">Ready</span>
        )}
      </div>
    </div>
  );
};
