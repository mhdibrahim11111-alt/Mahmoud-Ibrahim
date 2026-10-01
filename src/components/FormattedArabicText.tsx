import React from 'react';

interface FormattedArabicTextProps {
  text: string;
  className?: string;
}

const CODE_MATCH_PATTERN =
  /((?:(?:const|let|var)\s+[a-zA-Z0-9_$]+\s*=\s*[^;]+;?)|(?:[a-zA-Z_$][a-zA-Z0-9_$.]*\s*\([^)]*\))|(?:<[^>]+>)|(?:===|!==|==|!=)|(?:\b(?:typeof|NaN|true|false|null|undefined|number|string|boolean)\b)|(?:"[^"]*"|'[^']*'))/g;

const IS_CODE_EXACT =
  /^(?:(?:const|let|var)\s+[a-zA-Z0-9_$]+\s*=\s*[^;]+;?|[a-zA-Z_$][a-zA-Z0-9_$.]*\s*\([^)]*\)|<[^>]+>|===|!==|==|!=|\b(?:typeof|NaN|true|false|null|undefined|number|string|boolean)\b|"[^"]*"|'[^']*')$/;

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

  // Append invisible Right-to-Left Mark (\u200F) after sentence-ending colons or punctuation
  // so browsers never flip colons to the beginning of the Arabic line.
  const formatArabicPunctuation = (str: string) => {
    return str.replace(/([:!؟.])$/g, '$1\u200F');
  };

  const renderCodeChip = (codeContent: string, key: string | number) => {
    return (
      <bdi
        key={key}
        dir="ltr"
        className="inline-block font-mono text-amber-300 bg-slate-900/95 px-1.5 py-0.5 rounded-md border border-slate-800 text-[12px] sm:text-[13px] mx-1 align-baseline select-text shadow-sm"
        style={{ unicodeBidi: 'isolate' }}
      >
        {codeContent}
      </bdi>
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
