import { ExecutionResult } from '../types';

/**
 * Executes JavaScript code in a sandboxed, protected scope with timeout protection
 * against infinite loops and capture of console output.
 */
export async function runJavaScript(
  code: string,
  userInputs: string[] = ['أحمد', '42', '5', '85']
): Promise<ExecutionResult> {
  const startTime = performance.now();

  try {
    const result = await runInSandboxedIframe(code, userInputs, 2500);
    const endTime = performance.now();
    return {
      logs: result.logs,
      errors: result.errors,
      executionTimeMs: Math.round(endTime - startTime),
      success: result.errors.length === 0,
    };
  } catch (err: unknown) {
    const endTime = performance.now();
    const errorMsg = err instanceof Error ? err.message : String(err);
    return {
      logs: [],
      errors: [translateErrorToArabic(errorMsg)],
      executionTimeMs: Math.round(endTime - startTime),
      success: false,
    };
  }
}

function runInSandboxedIframe(
  code: string,
  inputs: string[],
  timeoutMs: number
): Promise<{ logs: string[]; errors: string[] }> {
  return new Promise((resolve) => {
    const frame = document.createElement('iframe');
    const runId = typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random()}`;
    frame.setAttribute('sandbox', 'allow-scripts');
    frame.setAttribute('aria-hidden', 'true');
    frame.style.cssText = 'position:fixed;width:1px;height:1px;left:-10px;top:-10px;border:0';
    frame.srcdoc = `<!doctype html><meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline' 'unsafe-eval'; connect-src 'none'; img-src 'none'; media-src 'none'; object-src 'none'; frame-src 'none'; worker-src 'none'; form-action 'none'; base-uri 'none'; navigate-to 'none'"><script>
      addEventListener('message', function receive(event) {
        if (event.source !== parent || !event.data || event.data.type !== 'run') return;
        removeEventListener('message', receive);
        const { code, inputs, runId } = event.data;
        const logs = [];
        const errors = [];
        let promptIndex = 0;
        const prompt = (message) => {
          const value = inputs[promptIndex] ?? '25';
          promptIndex += 1;
          logs.push('[prompt]: ' + (message || '') + ' -> ' + value);
          return value;
        };
        const safeConsole = {
          log: (...args) => logs.push(args.map((value) => {
            if (typeof value === 'object' && value !== null) {
              try { return JSON.stringify(value); } catch { return String(value); }
            }
            return String(value);
          }).join(' ')),
          error: (...args) => errors.push(args.map(String).join(' ')),
          warn: (...args) => logs.push('[تحذير]: ' + args.map(String).join(' ')),
        };
        try {
          new Function('console', 'prompt', code)(safeConsole, prompt);
          parent.postMessage({ type: 'result', runId, logs, errors }, '*');
        } catch (error) {
          errors.push(error instanceof Error ? error.name + ': ' + error.message : String(error));
          parent.postMessage({ type: 'result', runId, logs, errors }, '*');
        }
      });
    </script>`;

    let isDone = false;
    const finish = (result: { logs: string[]; errors: string[] }) => {
      if (isDone) return;
      isDone = true;
      clearTimeout(timer);
      window.removeEventListener('message', handleMessage);
      frame.remove();
      resolve(result);
    };
    const handleMessage = (event: MessageEvent) => {
      if (event.source !== frame.contentWindow || event.data?.type !== 'result' || event.data.runId !== runId) return;
      finish({
        logs: Array.isArray(event.data.logs) ? event.data.logs.map(String) : [],
        errors: Array.isArray(event.data.errors) ? event.data.errors.map(translateErrorToArabic) : [],
      });
    };
    const timer = window.setTimeout(() => finish({
      logs: [],
      errors: [
        'خطأ: توقف البرنامج بسبب حلقة تكرار لانهائية (Infinite Loop) استغرقت وقتاً طويلاً!',
        'تأكد من أن عداد الحلقة (مثل i++ أو n++) يتغير في كل دورة ويصل لشرط التوقف.',
      ],
    }), timeoutMs);
    window.addEventListener('message', handleMessage);
    frame.addEventListener('load', () => {
      frame.contentWindow?.postMessage({ type: 'run', runId, code, inputs }, '*');
    }, { once: true });
    document.body.appendChild(frame);
  });
}

/**
 * Translates JavaScript error messages into friendly Egyptian Arabic explanations
 */
export function translateErrorToArabic(rawError: string): string {
  if (rawError.includes('Assignment to constant variable')) {
    return 'TypeError: Assignment to constant variable. (حاولت تغيّر قيمة خزنة const! متغيّرات const مقفولة ومبتتغيّرش، لو محتاج تغيّرها استخدم let).';
  }
  if (rawError.includes('already been declared')) {
    return 'SyntaxError: Identifier already declared. (الاسم ده متعرّف قبل كده بـ let أو const! مينفعش تكتب let لنفس المتغير مرتين في نفس النطاق).';
  }
  if (rawError.includes('is not defined')) {
    // Extract actual identifier (handles both "ReferenceError: foo is not defined" and "foo is not defined")
    const match = rawError.match(/(?:ReferenceError:\s*)?([a-zA-Z0-9_$]+)\s+is not defined/i);
    const varName = match?.[1] || 'المتغير أو الدالة';
    return `${rawError} (الكمبيوتر بيقولك: أنا مش لاقي "${varName}"! اتأكد من كتابة الاسم صح (الحروف الكبيرة والصغيرة)، وإنه متعرّف في نفس الكود اللي بتشغّله؛ كل بلوك تشغيل منفصل ومش بيشارك متغيراته مع البلوكات التانية).`;
  }
  if (rawError.includes('Unexpected token')) {
    return `${rawError} (خطأ في بناء الكود SyntaxError: فيه قوس ناقص، أو علامة تنصيص مش مقفولة، أو فاصلة منسية).`;
  }
  return rawError;
}
