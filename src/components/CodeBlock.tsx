import React, { useState } from 'react';
import { cleanCodeString } from '../utils/cleanCode';
import { Copy, Check } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  className?: string;
  showLineNumbers?: boolean;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  className = '',
  showLineNumbers = false,
}) => {
  const [copied, setCopied] = useState(false);
  const cleaned = cleanCodeString(code);
  const lines = cleaned.split('\n');

  const handleCopy = () => {
    navigator.clipboard.writeText(cleaned);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      dir="ltr"
      className={`relative group bg-slate-950 text-slate-100 font-mono text-xs sm:text-sm text-left ${className}`}
      style={{ direction: 'ltr', textAlign: 'left', unicodeBidi: 'isolate' }}
    >
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 hover:bg-slate-700 text-slate-300 p-1.5 rounded-lg text-xs flex items-center gap-1 shadow"
        title="نسخ الكود"
      >
        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
        <span className="text-[10px]">{copied ? 'تم' : 'نسخ'}</span>
      </button>

      <pre
        dir="ltr"
        className="p-4 overflow-x-auto leading-relaxed select-text"
        style={{ direction: 'ltr', textAlign: 'left', unicodeBidi: 'isolate' }}
      >
        <code dir="ltr" style={{ direction: 'ltr', textAlign: 'left', unicodeBidi: 'isolate' }}>
          {lines.map((line, idx) => (
            <div
              key={idx}
              dir="ltr"
              className="table-row font-mono"
              style={{ direction: 'ltr', textAlign: 'left', unicodeBidi: 'isolate' }}
            >
              {showLineNumbers && (
                <span className="table-cell pr-4 text-slate-600 select-none text-right text-[11px] font-mono w-6">
                  {idx + 1}
                </span>
              )}
              <span
                dir="ltr"
                className="table-cell"
                style={{ direction: 'ltr', textAlign: 'left', unicodeBidi: 'isolate' }}
              >
                {renderHighlightedLine(line)}
              </span>
            </div>
          ))}
        </code>
      </pre>
    </div>
  );
};

/**
 * Highlights a single line of JavaScript/HTML while keeping Arabic comments
 * safely isolated so they never flip punctuation or keywords.
 */
function renderHighlightedLine(line: string): React.ReactNode {
  // If line contains a comment //
  const commentIndex = line.indexOf('//');
  if (commentIndex !== -1) {
    const codePart = line.slice(0, commentIndex);
    const commentPart = line.slice(commentIndex);

    return (
      <>
        {renderCodeTokens(codePart)}
        <span
          dir="ltr"
          className="text-slate-500 italic inline-block"
          style={{ direction: 'ltr', unicodeBidi: 'isolate' }}
        >
          {commentPart}
        </span>
      </>
    );
  }

  return renderCodeTokens(line);
}

function renderCodeTokens(text: string): React.ReactNode {
  // Simple regex tokenizer for JS strings, keywords, numbers
  const regex =
    /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`|\b(?:let|const|var|function|return|if|else|switch|case|break|default|for|while|typeof|true|false|null|undefined|new)\b|\b(?:console|Math|document|window)\b|\b\d+(?:\.\d+)?\b)/g;

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    const matchedToken = match[0];
    const startIndex = match.index;

    if (startIndex > lastIndex) {
      parts.push(text.substring(lastIndex, startIndex));
    }

    if (matchedToken.startsWith('"') || matchedToken.startsWith("'") || matchedToken.startsWith('`')) {
      parts.push(
        <span
          key={startIndex}
          dir="ltr"
          className="text-emerald-300 font-semibold"
          style={{ direction: 'ltr', unicodeBidi: 'isolate' }}
        >
          {matchedToken}
        </span>
      );
    } else if (
      /^(let|const|var|function|return|if|else|switch|case|break|default|for|while|typeof|switch|case|break|default)$/.test(
        matchedToken
      )
    ) {
      parts.push(
        <span key={startIndex} className="text-purple-400 font-bold">
          {matchedToken}
        </span>
      );
    } else if (/^(true|false|null|undefined)$/.test(matchedToken)) {
      parts.push(
        <span key={startIndex} className="text-amber-400 font-semibold">
          {matchedToken}
        </span>
      );
    } else if (/^(console|Math|document|window)$/.test(matchedToken)) {
      parts.push(
        <span key={startIndex} className="text-sky-400 font-semibold">
          {matchedToken}
        </span>
      );
    } else if (/^\d+(?:\.\d+)?$/.test(matchedToken)) {
      parts.push(
        <span key={startIndex} className="text-orange-300 font-mono">
          {matchedToken}
        </span>
      );
    } else {
      parts.push(matchedToken);
    }

    lastIndex = startIndex + matchedToken.length;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts;
}
