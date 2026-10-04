import React, { useRef, useEffect, useState } from 'react';
import {
  EditorView,
  lineNumbers,
  highlightActiveLineGutter,
  highlightActiveLine,
  dropCursor,
  drawSelection,
  keymap,
  placeholder as cmPlaceholder,
} from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands';
import { bracketMatching, bidiIsolates, defaultHighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { closeBrackets, closeBracketsKeymap } from '@codemirror/autocomplete';
import { javascript } from '@codemirror/lang-javascript';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { oneDark } from '@codemirror/theme-one-dark';
import { Copy, Check, Code2, Sparkles } from 'lucide-react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  onRun?: () => void;
  placeholder?: string;
  isWebMode?: boolean;
  studentName?: string;
  activeCode?: string;
  className?: string;
  readOnly?: boolean;
}

const customDarkTheme = EditorView.theme({
  '&': {
    backgroundColor: '#020617', // slate-950
    color: '#f8fafc',
    fontSize: '13px',
    height: '100%',
    fontFamily: "'JetBrains Mono', 'Cairo', 'Segoe UI', system-ui, -apple-system, sans-serif",
    letterSpacing: '0px',
  },
  '.cm-scroller': {
    overflow: 'auto',
    fontFamily: 'inherit',
    lineHeight: '1.65',
  },
  '.cm-content': {
    direction: 'ltr',
    textAlign: 'left',
    caretColor: '#f59e0b',
    padding: '10px 4px',
    letterSpacing: '0px',
  },
  '.cm-cursor, .cm-dropCursor': {
    borderLeftColor: '#f59e0b',
    borderLeftWidth: '2px',
  },
  '&.cm-focused .cm-cursor': {
    borderLeftColor: '#f59e0b',
  },
  '&.cm-focused': {
    outline: 'none',
  },
  '.cm-gutters': {
    backgroundColor: '#090d16',
    color: '#475569',
    border: 'none',
    borderRight: '1px solid #1e293b',
    userSelect: 'none',
    paddingRight: '6px',
    paddingLeft: '4px',
  },
  '.cm-activeLineGutter': {
    backgroundColor: '#1e293b',
    color: '#f59e0b',
  },
  '.cm-activeLine': {
    backgroundColor: 'rgba(245, 158, 11, 0.04)',
  },
  '.cm-selectionBackground, &.cm-focused .cm-selectionBackground': {
    backgroundColor: 'rgba(245, 158, 11, 0.22) !important',
  },
  '.cm-line': {
    padding: '0 6px',
    letterSpacing: 'normal',
    wordBreak: 'break-word',
  },
  '.cm-placeholder': {
    color: '#64748b',
    fontStyle: 'italic',
  },
});

export const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  onRun,
  placeholder = '// اكتب كودك هنا...',
  isWebMode = false,
  studentName,
  activeCode,
  className = '',
  readOnly = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorViewRef = useRef<EditorView | null>(null);
  const isUpdatingFromEditor = useRef(false);

  const onRunRef = useRef(onRun);
  onRunRef.current = onRun;

  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const [copied, setCopied] = useState(false);
  const [lineCount, setLineCount] = useState(1);
  const [charCount, setCharCount] = useState(0);

  // Initialize CodeMirror instance with line wrapping and Arabic cursive support
  useEffect(() => {
    if (!containerRef.current) return;

    const runCommand = () => {
      if (onRunRef.current) {
        onRunRef.current();
        return true;
      }
      return false;
    };

    const langExtension = isWebMode ? html() : javascript();

    const startState = EditorState.create({
      doc: value,
      extensions: [
        lineNumbers(),
        highlightActiveLineGutter(),
        highlightActiveLine(),
        history(),
        drawSelection(),
        dropCursor(),
        bracketMatching(),
        closeBrackets(), // Automatically closes (), {}, [], "", '', and ``
        bidiIsolates(), // First-class Bidirectional Text Isolation for comments & strings
        EditorView.lineWrapping, // Automatically wrap lines on mobile viewports
        syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
        oneDark,
        customDarkTheme,
        langExtension,
        cmPlaceholder(placeholder),
        keymap.of([
          { key: 'Mod-Enter', run: runCommand },
          indentWithTab,
          ...closeBracketsKeymap, // Backspace auto-deletes empty pairs & typing closing bracket skips over
          ...defaultKeymap,
          ...historyKeymap,
        ]),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            isUpdatingFromEditor.current = true;
            const newContent = update.state.doc.toString();
            onChangeRef.current(newContent);
            setLineCount(update.state.doc.lines);
            setCharCount(newContent.length);
            isUpdatingFromEditor.current = false;
          }
        }),
        EditorState.readOnly.of(readOnly),
      ],
    });

    const view = new EditorView({
      state: startState,
      parent: containerRef.current,
    });

    editorViewRef.current = view;
    setLineCount(view.state.doc.lines);
    setCharCount(view.state.doc.length);

    return () => {
      view.destroy();
      editorViewRef.current = null;
    };
  }, [isWebMode, readOnly]);

  // Synchronize external value changes (e.g., initial code reset or chapter switches)
  useEffect(() => {
    const view = editorViewRef.current;
    if (!view) return;
    if (isUpdatingFromEditor.current) return;

    const currentDoc = view.state.doc.toString();
    if (currentDoc !== value) {
      view.dispatch({
        changes: {
          from: 0,
          to: currentDoc.length,
          insert: value,
        },
      });
      setLineCount(view.state.doc.lines);
      setCharCount(value.length);
    }
  }, [value]);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const insertPairOrSymbol = (open: string, close?: string) => {
    const view = editorViewRef.current;
    if (!view) return;
    const { from, to } = view.state.selection.main;
    const selectedText = view.state.sliceDoc(from, to);

    if (close) {
      if (selectedText.length > 0) {
        view.dispatch({
          changes: { from, to, insert: `${open}${selectedText}${close}` },
          selection: { anchor: from + open.length, head: to + open.length },
        });
      } else {
        view.dispatch({
          changes: { from, insert: `${open}${close}` },
          selection: { anchor: from + open.length },
        });
      }
    } else {
      view.dispatch({
        changes: { from, to, insert: open },
        selection: { anchor: from + open.length },
      });
    }
    view.focus();
  };

  return (
    <div
      dir="ltr"
      className={`code-editor-root bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex flex-col shadow-2xl w-full max-w-full min-w-0 ${className}`}
      style={{ direction: 'ltr', textAlign: 'left' }}
    >
      {/* Editor Header Bar (Responsive for mobile & desktop) */}
      <div
        dir="ltr"
        className="bg-slate-900/90 px-3 sm:px-4 py-2 border-b border-slate-800 flex items-center justify-between text-xs select-none gap-2 shrink-0 w-full min-w-0"
        style={{ direction: 'ltr', textAlign: 'left' }}
      >
        <div className="font-mono text-slate-300 flex items-center gap-1.5 sm:gap-2 min-w-0">
          <Code2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 shrink-0" />
          <span className="font-semibold text-white text-xs truncate">
            {isWebMode ? 'HTML / CSS' : 'JavaScript'}
          </span>
          <span className="hidden sm:inline-flex text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 items-center gap-1 font-sans shrink-0">
            <Sparkles className="w-2.5 h-2.5 text-emerald-400" />
            <span>BiDi</span>
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {activeCode && (
            <span className="text-[10px] text-slate-400 font-mono hidden md:inline">
              {studentName ? `${studentName} • ` : ''}حفظ تلقائي
            </span>
          )}

          <button
            type="button"
            onClick={handleCopyCode}
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition shrink-0"
            title="نسخ الكود بالكامل"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span className="text-[10px]">{copied ? 'تم النسخ' : 'نسخ'}</span>
          </button>
        </div>
      </div>

      {/* Quick Symbol Bar (Fast auto-closing pairs & brackets insertion for Mobile & Desktop) */}
      <div
        dir="ltr"
        className="bg-slate-900/90 px-2 sm:px-3 py-1.5 border-b border-slate-800/80 flex items-center gap-1.5 overflow-x-auto flex-nowrap w-full max-w-full min-w-0 select-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        style={{ direction: 'ltr', textAlign: 'left', WebkitOverflowScrolling: 'touch' }}
      >
        <button
          type="button"
          onClick={() => insertPairOrSymbol('(', ')')}
          className="inline-flex items-center justify-center whitespace-nowrap shrink-0 h-7 px-2.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-amber-300 font-mono text-xs font-bold transition-all active:scale-90 border border-slate-700/60 shadow-sm"
          title="أقواس دائرية ()"
        >
          ()
        </button>
        <button
          type="button"
          onClick={() => insertPairOrSymbol('{', '}')}
          className="inline-flex items-center justify-center whitespace-nowrap shrink-0 h-7 px-2.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-amber-300 font-mono text-xs font-bold transition-all active:scale-90 border border-slate-700/60 shadow-sm"
          title="أقواس معقوفة {}"
        >
          {'{ }'}
        </button>
        <button
          type="button"
          onClick={() => insertPairOrSymbol('[', ']')}
          className="inline-flex items-center justify-center whitespace-nowrap shrink-0 h-7 px-2.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-amber-300 font-mono text-xs font-bold transition-all active:scale-90 border border-slate-700/60 shadow-sm"
          title="أقواس مصفوفة []"
        >
          []
        </button>
        <button
          type="button"
          onClick={() => insertPairOrSymbol('"', '"')}
          className="inline-flex items-center justify-center whitespace-nowrap shrink-0 h-7 px-2.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-amber-300 font-mono text-xs font-bold transition-all active:scale-90 border border-slate-700/60 shadow-sm"
          title='علامات تنصيص مزدوجة ""'
        >
          &quot;&quot;
        </button>
        <button
          type="button"
          onClick={() => insertPairOrSymbol("'", "'")}
          className="inline-flex items-center justify-center whitespace-nowrap shrink-0 h-7 px-2.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-amber-300 font-mono text-xs font-bold transition-all active:scale-90 border border-slate-700/60 shadow-sm"
          title="علامات تنصيص مفردة ''"
        >
          &apos;&apos;
        </button>
        <button
          type="button"
          onClick={() => insertPairOrSymbol('`', '`')}
          className="inline-flex items-center justify-center whitespace-nowrap shrink-0 h-7 px-2.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-amber-300 font-mono text-xs font-bold transition-all active:scale-90 border border-slate-700/60 shadow-sm"
          title="علامات تنصيص مائلة ``"
        >
          &#96;&#96;
        </button>
        <button
          type="button"
          onClick={() => insertPairOrSymbol(';')}
          className="inline-flex items-center justify-center whitespace-nowrap shrink-0 h-7 px-2 rounded-lg bg-slate-800/70 hover:bg-slate-700 text-slate-300 font-mono text-xs font-bold transition-all active:scale-90 border border-slate-700/40"
          title="فاصلة منقوطة ;"
        >
          ;
        </button>
        <button
          type="button"
          onClick={() => insertPairOrSymbol('.')}
          className="inline-flex items-center justify-center whitespace-nowrap shrink-0 h-7 px-2 rounded-lg bg-slate-800/70 hover:bg-slate-700 text-amber-400 font-mono text-xs font-black transition-all active:scale-90 border border-slate-700/40"
          title="نقطة ."
        >
          .
        </button>
        <button
          type="button"
          onClick={() => insertPairOrSymbol(', ')}
          className="inline-flex items-center justify-center whitespace-nowrap shrink-0 h-7 px-2 rounded-lg bg-slate-800/70 hover:bg-slate-700 text-slate-300 font-mono text-xs font-bold transition-all active:scale-90 border border-slate-700/40"
          title="فاصلة ,"
        >
          ,
        </button>
        <button
          type="button"
          onClick={() => insertPairOrSymbol(' => ')}
          className="inline-flex items-center justify-center whitespace-nowrap shrink-0 h-7 px-2 rounded-lg bg-slate-800/70 hover:bg-slate-700 text-emerald-400 font-mono text-xs font-bold transition-all active:scale-90 border border-slate-700/40"
          title="دالة سهمية =>"
        >
          =&gt;
        </button>
        <button
          type="button"
          onClick={() => insertPairOrSymbol(' = ')}
          className="inline-flex items-center justify-center whitespace-nowrap shrink-0 h-7 px-2 rounded-lg bg-slate-800/70 hover:bg-slate-700 text-slate-300 font-mono text-xs font-bold transition-all active:scale-90 border border-slate-700/40"
          title="يساوي ="
        >
          =
        </button>
        <button
          type="button"
          onClick={() => insertPairOrSymbol('<', '>')}
          className="inline-flex items-center justify-center whitespace-nowrap shrink-0 h-7 px-2 rounded-lg bg-slate-800/70 hover:bg-slate-700 text-cyan-400 font-mono text-xs font-bold transition-all active:scale-90 border border-slate-700/40"
          title="وسم HTML <>"
        >
          &lt;&gt;
        </button>
        <button
          type="button"
          onClick={() => insertPairOrSymbol('// ')}
          className="inline-flex items-center justify-center whitespace-nowrap shrink-0 h-7 px-2 rounded-lg bg-slate-800/70 hover:bg-slate-700 text-slate-400 font-mono text-xs font-bold transition-all active:scale-90 border border-slate-700/40"
          title="تعليق //"
        >
          //
        </button>
      </div>

      {/* Editor Body: CodeMirror 6 Mount Point */}
      <div
        ref={containerRef}
        dir="ltr"
        className="relative flex-1 min-h-0 w-full max-w-full overflow-hidden"
        style={{ direction: 'ltr', textAlign: 'left' }}
      />

      {/* Editor Footer Bar */}
      <div
        dir="ltr"
        className="px-3 sm:px-4 py-1.5 sm:py-2 bg-slate-900/50 border-t border-slate-800/80 text-[10px] sm:text-[11px] text-slate-400 flex items-center justify-between select-none shrink-0"
        style={{ direction: 'ltr', textAlign: 'left' }}
      >
        <span className="flex items-center gap-1.5 truncate">
          <span className="text-amber-400 font-semibold">💡 تشغيل:</span>
          <span>Ctrl + Enter</span>
        </span>
        <span className="font-mono text-slate-400 shrink-0">
          {lineCount} {lineCount === 1 ? 'سطر' : 'أسطر'} • {charCount} حرف
        </span>
      </div>
    </div>
  );
};
