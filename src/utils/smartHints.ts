/**
 * Smart Hints (التلميحات الذكية) utility for CodePlayground.
 * Provides intelligent analysis and friendly Egyptian Arabic hints for common code errors.
 */

export interface SmartHintResponse {
  source: 'gemini' | 'local';
  diagnosis: string;
  hint: string;
  proTip?: string;
  rawText: string;
}

/**
 * Local heuristic engine that understands beginner JavaScript, HTML, and CSS errors
 * and explains them in the warm, engaging Egyptian Arabic style of the book.
 */
export function generateSmartLocalHint(
  code: string,
  errorMessage?: string,
  mode: string = 'javascript'
): SmartHintResponse {
  const err = (errorMessage || '').toLowerCase();
  const c = code || '';

  // 1. TypeError: Assignment to constant variable
  if (err.includes('assignment to constant') || err.includes('constant variable')) {
    return {
      source: 'local',
      diagnosis: 'حاولت تغيّر قيمة متغيّر متعرف بـ const (خزنة حديد)!',
      hint: 'الـ const دي خزنة بتتقفل على أول قيمة ومبتتفتحش تاني. بص على السطر اللي فيه الخطأ وشوف فين المتغير اللي بتغيره، وبدل ما تعرفه بـ const في الأول، عرّفه بـ let (الصندوق الكرتون) عشان تقدر تعدل قيمته براحتك.',
      proTip: 'القاعدة الذهبية: لو القيمة هتتغير (زي عداد أو مجموع أو نتيجة حسابية) استخدم let، ولو ثابتة مستحيل تتغير استخدم const.',
      rawText: '',
    };
  }

  // 2. ReferenceError: X is not defined
  if (err.includes('is not defined') || err.includes('referenceerror')) {
    const match = errorMessage?.match(/(\w+)\s+is not defined/i);
    const varName = match ? match[1] : 'المتغير';

    return {
      source: 'local',
      diagnosis: `الكمبيوتر مش لاقي حاجة اسمها "${varName}"!`,
      hint: `اتأكد من 3 حاجات:
1. هل نسيت تحط قبله كلمة let أو const في أول تعريف ليه؟
2. هل الكلمة دي كانت نص ونسيت تحطها بين علامتين تنصيص "${varName}"؟
3. خد بالك: جافاسكريبت حساسة للحروف الكبيرة والصغيرة (Case-Sensitive)، يعني name غير Name!`,
      proTip: 'لو كنت تقصد تطبع كلمة عادية مش متغير، لازم تحطها جوه دبل كوتشين " "، وإلا الكمبيوتر هيفتكرها صندوق متخزن في الذاكرة.',
      rawText: '',
    };
  }

  // 3. SyntaxError: Unexpected token
  if (err.includes('unexpected token') || err.includes('syntaxerror')) {
    if (c.includes('<') && (err.includes('<') || mode === 'js')) {
      return {
        source: 'local',
        diagnosis: 'كتبت كود HTML جوه محرر جافاسكريبت!',
        hint: 'الكمبيوتر استغرب من علامة الأقواس الزاوية < لأن لغة جافاسكريبت مبتفهمش وسوم الـ HTML مباشرة إلا لو كانت جوه نص مثل: console.log("<h1>...</h1>") أو حولت المحرر لوضع (HTML & CSS).',
        proTip: 'اضغط على زرار (HTML & CSS) في أعلى المحرر أو حوّله للكشف التلقائي عشان تظهر لك المعاينة الحية فوراً.',
        rawText: '',
      };
    }

    return {
      source: 'local',
      diagnosis: 'فيه علامة أو قوس مش مظبوط في الكود!',
      hint: 'الكمبيوتر تاه بسبب قوس مفتوح ومش مقفول (زي ( ) أو { } أو [ ])، أو علامة تنصيص " " مش مقفولة، أو فاصلة منسية. راجع الأقواس في السطر اللي الكمبيوتر مشاور عليه.',
      proTip: 'دايماً لما تفتح أي قوس ( أو { اكتب قفلته فوراً قبل ما تكتب الكود جواه علشان متنساهوش.',
      rawText: '',
    };
  }

  // 4. Cannot read properties of null / undefined (DOM Error)
  if (err.includes('cannot read properties of null') || err.includes('null (reading') || err.includes('of undefined')) {
    return {
      source: 'local',
      diagnosis: 'حاولت تنفذ أمر على عنصر مش موجود في الصفحة (رجع null)!',
      hint: `لو بتستخدم document.getElementById:
1. اتأكد إن الـ id مكتوب بالحرف ومطابق للـ HTML.
2. اتأكد إن كود السكريبت مكتوب بعد عناصر الـ HTML (قبل إغلاق body)، لأن لو السكريبت اشتغل في أول الصفحة قبل ما الزرار يترسم، هيرجع null ويعترض!`,
      proTip: 'المتصفح بيقرأ الصفحة من فوق لتحت؛ لو ناديت على زرار قبل ما المتصفح يرسمه، الكمبيوتر هيقولك مفيش زرار بالاسم ده!',
      rawText: '',
    };
  }

  // 5. Infinite loop / Execution timeout
  if (err.includes('timeout') || err.includes('أخذ وقتاً طويلاً') || err.includes('حلقة لا نهائية')) {
    return {
      source: 'local',
      diagnosis: 'الكمبيوتر دخل في دوامة حلقة تكرار مش راضية تخلص (Infinite Loop)!',
      hint: 'بص جوه حلقة while أو for: هل العداد بيزيد أو بينقص؟ هل الشرط في مرحلة ما هيصبح false عشان الحلقة تقف؟ لو نسيت تكتب i++ العداد هيفضل زي ما هو والبرنامج هيلف للأبد.',
      proTip: 'أول ما تبدأ تكتب حلقة while، اكتب سطر زيادة العداد i++ أول حاجة علشان تضمن إن الحلقة هتقف بعد عدد معين.',
      rawText: '',
    };
  }

  // 6. Function errors (X is not a function)
  if (err.includes('is not a function')) {
    return {
      source: 'local',
      diagnosis: 'حاولت تنادي متغير كدالة وحطيت وراه أقواس () وهو أصلاً مش دالة!',
      hint: 'اتأكد إنك كاتب اسم الدالة صح، ومش معرف متغير بنفس الاسم بالخطأ بيلغي تعريف الدالة.',
      proTip: 'الأقواس () بنحطها ورا الدوال بس لما نكون عايزين نشغلها، زي console.log() أو calculate().',
      rawText: '',
    };
  }

  // 7. General review / No error
  return {
    source: 'local',
    diagnosis: errorMessage ? `الكمبيوتر معترض على: ${errorMessage}` : 'الكود مفيهوش خطأ متوقف، وجاهز للمراجعة!',
    hint: 'بص على السطور الأخيرة اللي كتبتها، اتأكد من صحة أسماء المتغيرات والأقواس. لو بتطبع ناتج، جرب تضيف أمر console.log واضح يوضح لك كل خطوة بيحسبها الكمبيوتر.',
    proTip: 'طريقة المبرمجين المحترفين: لو محتار، اطبع المتغيرات في الـ Console في كل خطوة عشان تشوف الكمبيوتر شايف إيه بالضبط.',
    rawText: '',
  };
}
