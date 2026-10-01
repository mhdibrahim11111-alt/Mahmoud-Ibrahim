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
  const logs: string[] = [];
  const errors: string[] = [];

  let inputIndex = 0;
  const mockPrompt = (msg?: string) => {
    const val = userInputs[inputIndex] ?? '25';
    inputIndex++;
    logs.push(`[سؤال النظام - prompt]: "${msg || ''}" -> تم إدخال: "${val}"`);
    return val;
  };

  // Safe console capture
  const customConsole = {
    log: (...args: unknown[]) => {
      const formatted = args
        .map((arg) => {
          if (typeof arg === 'object' && arg !== null) {
            try {
              return JSON.stringify(arg, null, 2);
            } catch {
              return String(arg);
            }
          }
          return String(arg);
        })
        .join(' ');
      logs.push(formatted);
    },
    error: (...args: unknown[]) => {
      const formatted = args.map((a) => String(a)).join(' ');
      errors.push(formatted);
    },
    warn: (...args: unknown[]) => {
      logs.push(`[تحذير]: ${args.map((a) => String(a)).join(' ')}`);
    },
  };

  try {
    // Check for potential infinite loop signatures and inject a guard if possible, or execute with worker/timeout
    // Basic protection: wrap execution in a Web Worker or timed Function
    // Since workers require Blob URLs in Vite, Blob URL worker is clean and prevents tab freeze!
    const result = await runInWorkerWithTimeout(code, customConsole, mockPrompt, 2500);
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
    errors.push(translateErrorToArabic(errorMsg));
    return {
      logs,
      errors,
      executionTimeMs: Math.round(endTime - startTime),
      success: false,
    };
  }
}

async function runInWorkerWithTimeout(
  code: string,
  customConsole: { log: (...args: unknown[]) => void; error: (...args: unknown[]) => void },
  mockPrompt: (msg?: string) => string,
  timeoutMs: number
): Promise<{ logs: string[]; errors: string[] }> {
  // If web worker is supported:
  if (typeof Worker !== 'undefined') {
    return new Promise((resolve) => {
      const logs: string[] = [];
      const errors: string[] = [];

      const workerCode = `
        self.onmessage = function(e) {
          const userCode = e.data.code;
          const capturedLogs = [];
          const capturedErrors = [];

          let promptIndex = 0;
          const inputs = e.data.inputs || ['50', 'أحمد', '42'];
          const prompt = function(msg) {
            const val = inputs[promptIndex] || '25';
            promptIndex++;
            capturedLogs.push('[prompt]: ' + (msg || '') + ' -> ' + val);
            return val;
          };

          const console = {
            log: function(...args) {
              const str = args.map(a => {
                if (typeof a === 'object' && a !== null) {
                  try { return JSON.stringify(a); } catch(e) { return String(a); }
                }
                return String(a);
              }).join(' ');
              capturedLogs.push(str);
            },
            error: function(...args) {
              capturedErrors.push(args.map(a => String(a)).join(' '));
            }
          };

          try {
            const runner = new Function('console', 'prompt', userCode);
            runner(console, prompt);
            self.postMessage({ type: 'success', logs: capturedLogs, errors: capturedErrors });
          } catch (err) {
            self.postMessage({ type: 'error', logs: capturedLogs, errors: [err.name + ': ' + err.message] });
          }
        };
      `;

      let blob: Blob;
      let workerUrl: string;
      try {
        blob = new Blob([workerCode], { type: 'application/javascript' });
        workerUrl = URL.createObjectURL(blob);
      } catch {
        // Fallback to inline runner
        return resolve(runInline(code, customConsole, mockPrompt));
      }

      const worker = new Worker(workerUrl);
      let isDone = false;

      const timer = setTimeout(() => {
        if (!isDone) {
          isDone = true;
          worker.terminate();
          URL.revokeObjectURL(workerUrl);
          resolve({
            logs,
            errors: [
              'خطأ: توقف البرنامج بسبب حلقة تكرار لانهائية (Infinite Loop) استغرقت وقتاً طويلاً!',
              'تأكد من أن عداد الحلقة (مثل i++ أو n++) يتغير في كل دورة ويصل لشرط التوقف.',
            ],
          });
        }
      }, timeoutMs);

      worker.onmessage = (e) => {
        if (isDone) return;
        isDone = true;
        clearTimeout(timer);
        worker.terminate();
        URL.revokeObjectURL(workerUrl);

        if (e.data.type === 'success') {
          resolve({ logs: e.data.logs, errors: e.data.errors });
        } else {
          const translatedErrors = (e.data.errors as string[]).map(translateErrorToArabic);
          resolve({ logs: e.data.logs, errors: translatedErrors });
        }
      };

      worker.onerror = (err) => {
        if (isDone) return;
        isDone = true;
        clearTimeout(timer);
        worker.terminate();
        URL.revokeObjectURL(workerUrl);
        resolve({
          logs,
          errors: [translateErrorToArabic(err.message || 'حدث خطأ في تشغيل الكود')],
        });
      };

      worker.postMessage({ code, inputs: ['25', 'أحمد', '42', '5', '85'] });
    });
  }

  return runInline(code, customConsole, mockPrompt);
}

function runInline(
  code: string,
  customConsole: { log: (...args: unknown[]) => void; error: (...args: unknown[]) => void },
  mockPrompt: (msg?: string) => string
): { logs: string[]; errors: string[] } {
  const logs: string[] = [];
  const errors: string[] = [];

  const localConsole = {
    log: (...args: unknown[]) => {
      logs.push(args.map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '));
    },
    error: (...args: unknown[]) => {
      errors.push(args.map((a) => String(a)).join(' '));
    },
  };

  try {
    const fn = new Function('console', 'prompt', code);
    fn(localConsole, mockPrompt);
  } catch (err: unknown) {
    const msg = err instanceof Error ? `${err.name}: ${err.message}` : String(err);
    errors.push(translateErrorToArabic(msg));
  }

  return { logs, errors };
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
    const varName = rawError.split(' ')[0] || 'المتغير';
    return `${rawError} (الكمبيوتر بيقولك: أنا مش لاقي "${varName}"! اتأكد من كتابة الاسم صح (الحروف الكبيرة والصغيرة)، أو اتأكد إنه متعرّف في نفس النطاق scope).`;
  }
  if (rawError.includes('Unexpected token')) {
    return `${rawError} (خطأ في بناء الكود SyntaxError: فيه قوس ناقص، أو علامة تنصيص مش مقفولة، أو فاصلة منسية).`;
  }
  return rawError;
}
