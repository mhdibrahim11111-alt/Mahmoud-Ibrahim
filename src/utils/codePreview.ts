/**
 * Utility for detecting code language and generating live web previews
 * for HTML, CSS, and DOM interaction snippets.
 */

export type CodeLanguage = 'javascript' | 'html' | 'css';

/**
 * Accurately determines if code is HTML, CSS, or JavaScript.
 */
export function detectCodeLanguage(code: string): CodeLanguage {
  if (!code) return 'javascript';
  const trimmed = code.trim();

  // If code explicitly starts with console.log, let, const, function, var, it's JS
  // even if it happens to contain HTML tag strings inside console.log("<ul>...</ul>")
  const startsWithJs = /^(console\s*\.\s*log|let\s+|const\s+|var\s+|function\s+|if\s*\(|for\s*\(|while\s*\()/i.test(
    trimmed
  );
  if (startsWithJs) {
    return 'javascript';
  }

  // HTML detection: contains DOCTYPE, html, head, body, or tags like <div>, <h1>, <p>, <button>, <input>, <!--
  const hasDoctypeOrHtml = /^<!DOCTYPE|^<html|^<!--/i.test(trimmed);
  const hasHtmlTags = /<\/?(div|h[1-6]|p|span|button|input|ul|ol|li|header|nav|main|footer|section|article|table|form|select|textarea|label|img|a|style|script)\b[^>]*>/i.test(
    trimmed
  );

  if (hasDoctypeOrHtml || hasHtmlTags) {
    return 'html';
  }

  // CSS detection: selector { property: value; } or starts with CSS comment /* ... */
  // Strip comments first to analyze rules
  const strippedComments = trimmed.replace(/\/\*[\s\S]*?\*\//g, '').trim();
  const hasCssRule = /^[.#a-zA-Z0-9_\-:\s,>+~*\[\]="'^$*]+\s*\{[\s\S]*:[^;]+;/m.test(
    strippedComments
  );
  const hasCssProperties = /\b(color|background|background-color|font-size|font-family|font-weight|padding|margin|border|border-radius|display|width|height|opacity|transition|cursor|text-align)\s*:/i.test(
    strippedComments
  );
  const hasJsKeywords = /\b(console\.log|function\s+\w+|const\s+\w+|let\s+\w+|var\s+\w+|return\s+|typeof\s+)\b/.test(
    strippedComments
  );

  if ((hasCssRule || hasCssProperties) && !hasJsKeywords) {
    return 'css';
  }

  return 'javascript';
}

/**
 * Injected script bridge that intercepts console.log, console.error, console.warn,
 * and window.onerror inside the preview iframe, sending them to the parent window.
 */
const BRIDGE_SCRIPT = `
<script>
  (function() {
    function send(type, text) {
      try {
        window.parent.postMessage({
          source: 'code-preview-frame',
          type: type,
          message: text
        }, '*');
      } catch (e) {}
    }

    const origLog = console.log;
    const origError = console.error;
    const origWarn = console.warn;

    console.log = function() {
      const args = Array.from(arguments).map(function(arg) {
        if (typeof arg === 'object' && arg !== null) {
          try { return JSON.stringify(arg); } catch (e) { return String(arg); }
        }
        return String(arg);
      }).join(' ');
      send('log', args);
      origLog.apply(console, arguments);
    };

    console.error = function() {
      const args = Array.from(arguments).map(function(arg) { return String(arg); }).join(' ');
      send('error', args);
      origError.apply(console, arguments);
    };

    console.warn = function() {
      const args = Array.from(arguments).map(function(arg) { return String(arg); }).join(' ');
      send('warn', args);
      origWarn.apply(console, arguments);
    };

    window.onerror = function(msg, url, line, col, error) {
      var errorMsg = String(msg || 'Error');
      if (line) {
        errorMsg += ' (السطر ' + line + ')';
      }
      send('error', errorMsg);
      return false;
    };
  })();
</script>
`;

/**
 * Builds a complete self-contained HTML document for the iframe live preview.
 */
export function buildHtmlPreviewDocument(
  code: string,
  language: CodeLanguage,
  theme: 'dark' | 'light' = 'dark'
): string {
  const trimmed = code ? code.trim() : '';

  const bgColor = theme === 'dark' ? '#0f172a' : '#ffffff';
  const textColor = theme === 'dark' ? '#f8fafc' : '#1e293b';
  const subtleBorder = theme === 'dark' ? '#334155' : '#e2e8f0';

  if (language === 'html') {
    // If it's already a full HTML document
    if (trimmed.includes('<html') || trimmed.includes('<!DOCTYPE')) {
      // Inject the bridge script inside <head> or at the top
      if (trimmed.includes('<head>')) {
        return trimmed.replace('<head>', `<head>${BRIDGE_SCRIPT}`);
      }
      if (trimmed.includes('<html>')) {
        return trimmed.replace('<html>', `<html><head>${BRIDGE_SCRIPT}</head>`);
      }
      return `${BRIDGE_SCRIPT}\n${trimmed}`;
    }

    // Wrap fragment in a clean, stylish HTML shell with Arabic fonts and defaults
    return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap" rel="stylesheet">
  ${BRIDGE_SCRIPT}
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: 'Cairo', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      margin: 0;
      padding: 24px;
      background-color: ${bgColor};
      color: ${textColor};
      line-height: 1.6;
    }
    input, button, select, textarea {
      font-family: inherit;
    }
    button {
      cursor: pointer;
    }
  </style>
</head>
<body>
  ${trimmed}
</body>
</html>`;
  }

  if (language === 'css') {
    const demoHtml = generateDemoHtmlForCss(trimmed);

    return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap" rel="stylesheet">
  ${BRIDGE_SCRIPT}
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: 'Cairo', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      margin: 0;
      padding: 24px;
      background-color: ${bgColor};
      color: ${textColor};
      line-height: 1.6;
    }
    .preview-banner {
      font-size: 11px;
      color: ${theme === 'dark' ? '#94a3b8' : '#64748b'};
      margin-bottom: 16px;
      padding-bottom: 8px;
      border-bottom: 1px dashed ${subtleBorder};
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    /* Styles written by the student */
    ${trimmed}
  </style>
</head>
<body>
  <div class="preview-banner">
    <span>معاينة تطبيق قواعد CSS على عناصر الصفحة المجهزة:</span>
    <span style="font-family: monospace;">CSS Active</span>
  </div>
  ${demoHtml}
</body>
</html>`;
  }

  return '';
}

/**
 * Generates sample HTML elements matching the CSS selectors in the snippet
 * so the CSS can be visually tested and verified in real time.
 */
function generateDemoHtmlForCss(css: string): string {
  const elements: string[] = [];

  if (css.includes('h1')) {
    elements.push('<h1>عنوان رئيسي h1</h1>');
  }
  if (css.includes('h2')) {
    elements.push('<h2>عنوان فرعي h2</h2>');
  }
  if (css.includes('h3')) {
    elements.push('<h3>عنوان h3</h3>');
  }
  if (css.includes('.highlight')) {
    elements.push('<p class="highlight">ده نص مميز بكلاس .highlight تم تطبيق تنسيقه بنجاح!</p>');
  }
  if (css.includes('.warning')) {
    elements.push('<p class="warning">خد بالك، ده تنبيه مهم بكلاس .warning</p>');
  }
  if (css.includes('.important')) {
    elements.push('<p class="important">ده نص مهم جداً بكلاس .important</p>');
  }
  if (css.includes('button') || css.includes('.promo-button')) {
    elements.push(`
      <div style="margin: 12px 0;">
        <button class="promo-button">اضغط هنا (زرار تجريبي :hover)</button>
      </div>
    `);
  }
  if (css.includes('p') && !css.includes('.warning') && !css.includes('.highlight')) {
    elements.push('<p>ده نص فقرة عادي يتأثر بقاعدة p { ... } المكتوبة.</p>');
  }
  if (css.includes('ul') || css.includes('li')) {
    elements.push(`
      <ul>
        <li>عنصر أول في القائمة</li>
        <li>عنصر ثاني في القائمة</li>
      </ul>
    `);
  }
  if (css.includes('.card')) {
    elements.push(`
      <div class="card" style="padding: 16px; margin: 12px 0; border-radius: 8px;">
        <h3>كارت تجريبي .card</h3>
        <p>محتوى الكارت المتأثر بقواعد الـ CSS.</p>
      </div>
    `);
  }
  if (css.includes('.product')) {
    elements.push(`
      <div class="product" style="padding: 16px; margin: 12px 0; border-radius: 8px;">
        <h2>كتاب البرمجة للمبتدئين</h2>
        <p>شرح مبسط لكلاس .product وتنسيقات المتجر.</p>
        <button>أضف للسلة</button>
      </div>
    `);
  }
  if (css.includes('.online')) {
    elements.push('<p>الحالة: <span class="online">متصل الآن</span></p>');
  }
  if (css.includes('input')) {
    elements.push('<input type="text" placeholder="حقل إدخال تجريبي..." style="margin: 8px 0; padding: 8px;" />');
  }

  if (elements.length === 0) {
    elements.push(`
      <h1>عنوان تجريبي</h1>
      <p class="highlight">فقرة نصية تجريبية للتأكد من تنسيقات الـ CSS.</p>
      <button>زرار تجريبي</button>
    `);
  }

  return elements.join('\n');
}
