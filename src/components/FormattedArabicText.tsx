import React from 'react';

interface FormattedArabicTextProps {
  text: string;
  className?: string;
}

// Only match programming tokens, valid HTML tags, operators, and Latin strings (NOT Arabic conversational quotes)
const CODE_MATCH_PATTERN =
  /((?:(?:const|let|var)\s+[a-zA-Z0-9_$]+\s*=\s*[^;]+;?)|(?:[a-zA-Z_$][a-zA-Z0-9_$.]*\s*\([^)]*\))|(?:<\/?[a-zA-Z][a-zA-Z0-9-]*(?:\s+[^>]*?)?>)|(?:===|!==|==|!=|>=|<=|&&|\|\|)|(?:\b(?:typeof|NaN|true|false|null|undefined|number|string|boolean)\b)|(?:"[^"\u0600-\u06FF\n]+"|'[^'\u0600-\u06FF\n]+'))/g;

const IS_CODE_EXACT =
  /^(?:(?:const|let|var)\s+[a-zA-Z0-9_$]+\s*=\s*[^;]+;?|[a-zA-Z_$][a-zA-Z0-9_$.]*\s*\([^)]*\)|<\/?[a-zA-Z][a-zA-Z0-9-]*(?:\s+[^>]*?)?>|===|!==|==|!=|>=|<=|&&|\|\||\b(?:typeof|NaN|true|false|null|undefined|number|string|boolean)\b|"[^"\u0600-\u06FF\n]+"|'[^'\u0600-\u06FF\n]+')$/;

/**
 * Renders Arabic text with embedded English/code snippets properly isolated.
 * Prevents Unicode BiDi punctuation flipping (e.g. colon at beginning of sentence,
 * reversed parentheses like ()Number, and scrambled quotes/semicolons).
 */
export const FormattedArabicText: React.FC<FormattedArabicTextProps> = ({
  text,
  className = '',
}) => {
  if (!text) return null;

  // Append invisible Right-to-Left Mark (\u200F) before/after punctuation
  // so browsers never flip colons or brackets to the wrong side of an English chip.
  const formatArabicPunctuation = (str: string) => {
    return str
      .replace(/^([):!؟.,،])/g, '\u200F$1')
      .replace(/([):!؟.,،])$/g, '$1\u200F');
  };

  const renderCodeChip = (codeContent: string, key: string | number) => {
    const hasArabic = /[\u0600-\u06FF]/.test(codeContent);

    if (hasArabic) {
      return (
        <span
          key={key}
          dir="rtl"
          className="inline font-sans font-bold text-amber-300 bg-slate-900/90 px-1.5 py-0.5 rounded border border-slate-800 text-xs sm:text-sm mx-0.5 align-baseline select-text shadow-sm"
        >
          {codeContent}
        </span>
      );
    }

    return (
      <React.Fragment key={key}>
        <bdi
          dir="ltr"
          className="inline font-mono font-medium text-amber-300 bg-slate-900/95 px-1.5 py-0.5 rounded border border-slate-800 text-[11px] sm:text-[13px] mx-0.5 align-baseline select-text shadow-sm whitespace-nowrap"
          style={{ unicodeBidi: 'isolate' }}
        >
          {codeContent}
        </bdi>
        {'\u200F'}
      </React.Fragment>
    );
  };

  // 1. First split by explicit markdown backticks `code`
  const backtickParts = text.split(/(`[^`]+`)/g);

  return (
    <span className={`inline ${className}`} dir="rtl">
      {backtickParts.map((part, pIdx) => {
        if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
          const rawCode = part.slice(1, -1);
          return renderCodeChip(rawCode, `bt-${pIdx}`);
        }

        // 2. In normal text, split by detected code snippets
        const subTokens = part.split(CODE_MATCH_PATTERN);

        return (
          <React.Fragment key={`p-${pIdx}`}>
            {subTokens.map((sub, sIdx) => {
              if (IS_CODE_EXACT.test(sub.trim())) {
                return renderCodeChip(sub.trim(), `token-${pIdx}-${sIdx}`);
              }
              return (
                <span key={`txt-${pIdx}-${sIdx}`}>
                  {formatArabicPunctuation(sub)}
                </span>
              );
            })}
          </React.Fragment>
        );
      })}
    </span>
  );
};
