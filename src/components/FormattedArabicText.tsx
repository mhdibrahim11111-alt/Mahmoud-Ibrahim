import React from 'react';

interface FormattedArabicTextProps {
  text: string;
  className?: string;
}

// Matches code operators, keywords, latin functions/variables (including nested calls like f(g(x))), and parenthesized terms like (Reassignment)
const CODE_OR_LATIN_PATTERN =
  /((?:(?:const|let|var)\s+[a-zA-Z0-9_$]+\s*=\s*[^;]+;?)|(?:[a-zA-Z_$][a-zA-Z0-9_$.]*\s*\((?:[^()]|\((?:[^()]|\([^()]*\))*\))*\))|(?:\([a-zA-Z0-9_$\s-]+\))|(?:<\/?[a-zA-Z][a-zA-Z0-9-]*(?:\s+[^>]*?)?>)|(?:===|!==|==|!=|>=|<=|&&|\|\|)|(?:\b(?:typeof|NaN|true|false|null|undefined|number|string|boolean|const|let|var|console\.log|Array|Object)\b)|(?:"[^"\u0600-\u06FF\n]+"|'[^'\u0600-\u06FF\n]+'))/g;

const IS_EXACT_TOKEN =
  /^(?:(?:const|let|var)\s+[a-zA-Z0-9_$]+\s*=\s*[^;]+;?|[a-zA-Z_$][a-zA-Z0-9_$.]*\s*\((?:[^()]|\((?:[^()]|\([^()]*\))*\))*\)|\([a-zA-Z0-9_$\s-]+\)|<\/?[a-zA-Z][a-zA-Z0-9-]*(?:\s+[^>]*?)?>|===|!==|==|!=|>=|<=|&&|\|\||\b(?:typeof|NaN|true|false|null|undefined|number|string|boolean|const|let|var|console\.log|Array|Object)\b|"[^"\u0600-\u06FF\n]+"|'[^'\u0600-\u06FF\n]+')$/;

/**
 * Renders Arabic text with embedded English/code snippets properly isolated.
 * Correctly parses markdown bold (**text**), inline code (`code`), and Latin phrases
 * to prevent Unicode BiDi text reversing or punctuation flipping.
 */
export const FormattedArabicText: React.FC<FormattedArabicTextProps> = ({
  text,
  className = '',
}) => {
  if (!text) return null;

  // Render a clean isolated code or Latin chip
  const renderChip = (content: string, key: string | number) => {
    // If it's a parenthesized Latin word like (Reassignment)
    if (content.startsWith('(') && content.endsWith(')')) {
      return (
        <React.Fragment key={key}>
          {'\u200F'}
          <bdi
            dir="ltr"
            className="inline text-slate-300 font-sans mx-1 align-baseline text-xs sm:text-sm font-medium"
            style={{ unicodeBidi: 'isolate' }}
          >
            {content}
          </bdi>
          {'\u200F'}
        </React.Fragment>
      );
    }

    const hasArabic = /[\u0600-\u06FF]/.test(content);
    if (hasArabic) {
      return (
        <span
          key={key}
          dir="rtl"
          className="inline font-sans font-bold text-amber-300 bg-slate-900/90 px-1.5 py-0.5 rounded border border-slate-800 text-xs sm:text-sm mx-0.5 align-baseline select-text shadow-sm"
        >
          {content}
        </span>
      );
    }

    return (
      <React.Fragment key={key}>
        {'\u200F'}
        <bdi
          dir="ltr"
          className="inline font-mono font-semibold text-amber-300 bg-slate-900/95 px-1.5 py-0.5 rounded border border-slate-800 text-[11px] sm:text-[13px] mx-0.5 align-baseline select-text shadow-sm whitespace-nowrap"
          style={{ unicodeBidi: 'isolate' }}
        >
          {content}
        </bdi>
        {'\u200F'}
      </React.Fragment>
    );
  };

  // Helper to parse text for code tokens and Latin words
  const parseTokens = (plainText: string, keyPrefix: string) => {
    const parts = plainText.split(CODE_OR_LATIN_PATTERN);
    return parts.map((sub, sIdx) => {
      if (IS_EXACT_TOKEN.test(sub.trim())) {
        return renderChip(sub.trim(), `${keyPrefix}-tok-${sIdx}`);
      }
      return (
        <span key={`${keyPrefix}-txt-${sIdx}`}>
          {sub}
        </span>
      );
    });
  };

  // 1. Split text by explicit markdown bold (**...**)
  const boldParts = text.split(/(\*\*[^*]+\*\*)/g);

  return (
    <span className={`inline ${className}`} dir="rtl">
      {boldParts.map((boldPart, bIdx) => {
        // If it's a bold chunk
        if (boldPart.startsWith('**') && boldPart.endsWith('**') && boldPart.length > 4) {
          const innerBold = boldPart.slice(2, -2);
          // Check for backticks inside bold
          const backtickParts = innerBold.split(/(`[^`]+`)/g);
          return (
            <strong key={`b-${bIdx}`} className="font-bold text-amber-200">
              {backtickParts.map((btPart, pIdx) => {
                if (btPart.startsWith('`') && btPart.endsWith('`') && btPart.length > 2) {
                  return renderChip(btPart.slice(1, -1), `b-${bIdx}-bt-${pIdx}`);
                }
                return parseTokens(btPart, `b-${bIdx}-p-${pIdx}`);
              })}
            </strong>
          );
        }

        // 2. Not bold: split by backticks (`...`)
        const backtickParts = boldPart.split(/(`[^`]+`)/g);
        return (
          <React.Fragment key={`nb-${bIdx}`}>
            {backtickParts.map((btPart, pIdx) => {
              if (btPart.startsWith('`') && btPart.endsWith('`') && btPart.length > 2) {
                return renderChip(btPart.slice(1, -1), `nb-${bIdx}-bt-${pIdx}`);
              }
              return parseTokens(btPart, `nb-${bIdx}-p-${pIdx}`);
            })}
          </React.Fragment>
        );
      })}
    </span>
  );
};
