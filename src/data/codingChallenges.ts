/**
 * Coding Challenges for "كود بالمصري"
 * Practical, fun, and pedagogy-aligned interactive exercises.
 */

export interface CodingChallenge {
  id: string;
  chapterId: number;
  chapterTitle: string;
  title: string;
  difficulty: 'beginner' | 'intermediate' | 'hero';
  difficultyLabel: string;
  points: number;
  story: string;
  objective: string;
  starterCode: string;
  solutionHint: string;
  check: (code: string, outputLogs: string[]) => {
    passed: boolean;
    message: string;
    hint?: string;
  };
}

export const CODING_CHALLENGES: CodingChallenge[] = [
  {
    id: 'challenge-1-vars',
    chapterId: 1,
    chapterTitle: 'الفصل 1: الأساسيات ومفاهيم البرمجة',
    title: 'تحدي الصندوق والخزنة (let & const)',
    difficulty: 'beginner',
    difficultyLabel: 'سهل للمبتدئين 🌱',
    points: 10,
    story: 'عايزين نعمل بروفايل لاعب في لعبة. عندك اسم اللعبة مستحيل يتغير (خزنة حديد)، والنقاط بتزيد مع اللعب (صندوق كرتون)!',
    objective: 'عرّف متغير باسم gameName باستخدام const بقيمة "كود بالمصري"، ومتغير باسم score باستخدام let بقيمة 0، ثم زوّد الـ score بقيمة 50 واطبع الاثنين في الكونسول.',
    starterCode: `// 1. عرّف خزنة ثابتة لاسم اللعبة باسم gameName وقيمة "كود بالمصري" باستخدام const


// 2. عرّف صندوق للنقاط باسم score باستخدام let وابدأ بـ 0


// 3. زوّد الـ score بمقدار 50 (مثلاً: score = score + 50 أو score += 50)


// 4. اطبع اسم اللعبة والنقاط في الكونسول باستخدام console.log


`,
    solutionHint: 'اتأكد إنك كتبت let score = 0 وبعدها score = 50 أو score += 50 واستخدمت console.log(score) عشان يظهر في الشاشة.',
    check: (code: string, logs: string[]) => {
      const c = code.replace(/\s+/g, ' ');
      const hasConst = /const\s+gameName\s*=/.test(c);
      const hasLet = /let\s+score\s*=/.test(c);
      const hasLog = logs.some((l) => l.includes('50')) && logs.some((l) => l.includes('كود بالمصري'));

      if (!hasConst) {
        return {
          passed: false,
          message: 'فين الخزنة؟ اتأكد من تعريف gameName باستخدام const!',
          hint: 'اكتب: const gameName = "كود بالمصري";',
        };
      }
      if (!hasLet) {
        return {
          passed: false,
          message: 'النقاط محتاجة صندوق let عشان تقدر تغير قيمته!',
          hint: 'اكتب: let score = 0;',
        };
      }
      if (!hasLog) {
        return {
          passed: false,
          message: 'الناتج مش ظاهر في الـ Console! اتأكد من طباعة اسم اللعبة و 50.',
          hint: 'اطبع: console.log(gameName); و console.log(score); وشغل الكود.',
        };
      }
      return {
        passed: true,
        message: 'عاش يا بطل! 🎯 فرّقت صح بين الصندوق والخزنة الحديد وطبعت النتيجة بنجاح!',
      };
    },
  },
  {
    id: 'challenge-2-conditionals',
    chapterId: 2,
    chapterTitle: 'الفصل 2: اتخاذ القرارات (if / else)',
    title: 'تحدي كاشير السوبرماركت (الخصم الذكي)',
    difficulty: 'beginner',
    difficultyLabel: 'سهل وممتع 🛒',
    points: 15,
    story: 'في سوبرماركت، لو فاتورة الزبون 100 جنيه أو أكتر بياخد خصم ويدفع أقل، وإلا بيدفع الفاتورة زي ما هي بدون خصم.',
    objective: 'عرّف متغير bill قيمته 150. لو bill >= 100، اطبع "مبروك الخصم"، وغير كده اطبع "شكراً لزيارتكم".',
    starterCode: `let bill = 150;

// المطلوب منك:
// اكتب شرط if / else:
// لو الفاتورة bill أكبر من أو تساوي 100 اطبع: "مبروك الخصم"
// لو أقل، اطبع: "شكراً لزيارتكم"

if (/* اكتب الشرط هنا */) {
  // اطبع رسالة مبروك الخصم
  
} else {
  // اطبع رسالة شكراً لزيارتكم
  
}
`,
    solutionHint: 'اكتب جوه القوسين bill >= 100، وجوه الـ if اطبع console.log("مبروك الخصم");',
    check: (code: string, logs: string[]) => {
      const c = code.toLowerCase();
      const hasIf = c.includes('if') && (c.includes('>=') || c.includes('>'));
      const hasDiscountLog = logs.some((l) => l.includes('مبروك الخصم') || l.includes('الخصم'));

      if (!hasIf) {
        return {
          passed: false,
          message: 'محتاجين نستخدم شرط if لفحص قيمة الفاتورة!',
          hint: 'اكتب: if (bill >= 100) { ... }',
        };
      }
      if (!hasDiscountLog) {
        return {
          passed: false,
          message: 'الشرط مش بيطبع رسالة الخصم في الـ Console.',
          hint: 'اتأكد إن bill بـ 150 وإن console.log بيطبع "مبروك الخصم".',
        };
      }
      return {
        passed: true,
        message: 'الله ينور عليك! 🛍️ الكاشير اشتغل تمام وأعطى الخصم للزبون الصح!',
      };
    },
  },
  {
    id: 'challenge-3-functions',
    chapterId: 3,
    chapterTitle: 'الفصل 3: الدوال وعصير الأوامر',
    title: 'تحدي خلاط الدوال (دالة حساب المجموع)',
    difficulty: 'intermediate',
    difficultyLabel: 'متوسط 🥤',
    points: 20,
    story: 'الدالة عاملة زي الخلاط: بتديها المكونات (Parameters)، تخلطهم جواها، وترجعلك عصير فريش (Return Value)!',
    objective: 'اكتب دالة اسمها calculateTotal تاخد رقمين (price1, price2) وترجع مجموعهم. ثم استدعي الدالة بـ 20 و 30 واطبع الناتج في الكونسول (50).',
    starterCode: `// 1. صمم دالة الخلاط باسم calculateTotal تاخد معاملين price1 و price2
function calculateTotal(price1, price2) {
  // رجع مجموع الرقمين هنا باستخدام return
  
}

// 2. استدعي الدالة بـ 20 و 30 واطبع الناتج في الكونسول
// تلميح: اكتب console.log(calculateTotal(20, 30));

`,
    solutionHint: 'جوه الدالة اكتب: return price1 + price2; ثم في سطر جديد اكتب console.log(calculateTotal(20, 30));',
    check: (code: string, logs: string[]) => {
      const c = code.replace(/\s+/g, ' ');
      const hasFunc = /function\s+calculateTotal/.test(c) || /calculateTotal\s*=\s*\(/.test(c);
      const hasReturn = /return\s+.*price1.*price2|return\s+.*price2.*price1/.test(c) || c.includes('return price1 + price2');
      const hasResult = logs.some((l) => l.trim() === '50' || l.includes('50'));

      if (!hasFunc) {
        return {
          passed: false,
          message: 'فين دالة calculateTotal؟ اتأكد من كتابة اسم الدالة بالحروف الدقيقة!',
          hint: 'اكتب: function calculateTotal(price1, price2) { ... }',
        };
      }
      if (!hasReturn) {
        return {
          passed: false,
          message: 'الخلاط اشتغل بس مرجعش الناتج! نسيت كلمة return.',
          hint: 'اكتب: return price1 + price2; جوه الدالة.',
        };
      }
      if (!hasResult) {
        return {
          passed: false,
          message: 'الناتج 50 مش ظاهر في الكونسول! استدعي الدالة واطبع الناتج.',
          hint: 'اكتب: console.log(calculateTotal(20, 30));',
        };
      }
      return {
        passed: true,
        message: 'عاش يا باشمهندس! 🍹 عصير الدوال طلع مظبوط وطلعت النتيجة 50!',
      };
    },
  },
  {
    id: 'challenge-4-arrays-loops',
    chapterId: 4,
    chapterTitle: 'الفصل 4: المصفوفات وحلقات التكرار',
    title: 'تحدي منيو الأكلات المصرية (Loops & Arrays)',
    difficulty: 'intermediate',
    difficultyLabel: 'متوسط ولذيذ 🍲',
    points: 20,
    story: 'عندنا مصفوفة فيها أكلات مصرية أصيلة، وعايزين نطبع كل أكلة سطر بسطر باستخدام حلقة تكرار (for loop) عشان منكتبش نفس الأمر ميت مرة!',
    objective: 'اعمل مصفوفة foods فيها ["كشري", "ملوخية", "حواوشي"]. استخدم for loop للمرور على كل عنصر وطباعته.',
    starterCode: `// 1. مصفوفة الأكلات المصرية
const foods = ["كشري", "ملوخية", "حواوشي"];

// 2. اكتب حلقة for للمرور على عناصر المصفوفة وطباعة كل أكلة بالترتيب
// تلميح: ابدأ بـ for (let i = 0; i < foods.length; i++) واطبع foods[i]


`,
    solutionHint: 'استخدم: for (let i = 0; i < foods.length; i++) { console.log(foods[i]); }',
    check: (code: string, logs: string[]) => {
      const c = code.toLowerCase();
      const hasArray = c.includes('كشري') && c.includes('ملوخية');
      const hasLoop = c.includes('for') || c.includes('foreach') || c.includes('for of');
      const hasLogs = logs.some((l) => l.includes('كشري')) &&
                      logs.some((l) => l.includes('ملوخية')) &&
                      logs.some((l) => l.includes('حواوشي'));

      if (!hasArray) {
        return {
          passed: false,
          message: 'فين مصفوفة الأكلات؟ اتأكد من كتابة كشري وملوخية وحواوشي!',
        };
      }
      if (!hasLoop) {
        return {
          passed: false,
          message: 'المطلوب استخدام حلقة تكرار for أو for...of بدل الطباعة اليدوية.',
        };
      }
      if (!hasLogs) {
        return {
          passed: false,
          message: 'الأكلات مظهرتش في الكونسول! اتأكد من تشغيل الكود.',
          hint: 'شغل الكود وشوف هل الـ 3 أكلات انطبعوا في الـ Console شاشة النتائج.',
        };
      }
      return {
        passed: true,
        message: 'بالهنا والشفا! 🍽️ لفيت على المصفوفة كلها وطبعت أحلى منيو مصري!',
      };
    },
  },
  {
    id: 'challenge-5-objects',
    chapterId: 5,
    chapterTitle: 'الفصل 5: الكائنات ومصنع البيانات',
    title: 'تحدي كائن بطل اللعبة (Objects)',
    difficulty: 'intermediate',
    difficultyLabel: 'متوسط 🦸‍♂️',
    points: 25,
    story: 'في الألعاب، كل شخصية بتكون عبارة عن Object بيحتوي على خصائص (الاسم، المستوى، القوة) ودوال (أفعال يقدر يعملها).',
    objective: 'عرّف كائن باسم hero يحتوي على: name (اسمه)، level (مستواه برقم)، و sayHello دالة تطبع "أهلاً، أنا البطل!". ثم استدعي الدالة hero.sayHello().',
    starterCode: `// 1. ابنِ كائن بطل اللعبة hero مع خاصية name و level ودالة sayHello
const hero = {
  name: "صقر البرمجة",
  level: 1,
  // أضف دالة sayHello هنا تطبع: "أهلاً، أنا البطل!"
  
};

// 2. استدعي دالة sayHello للبطل هنا عشان يتكلم
// hero...

`,
    solutionHint: 'جوه الكائن أضف sayHello: function() { console.log("أهلاً، أنا البطل!"); } ثم بالخارج اكتب hero.sayHello();',
    check: (code: string, logs: string[]) => {
      const c = code.replace(/\s+/g, ' ');
      const hasObject = c.includes('hero') && c.includes('level') && c.includes('sayHello');
      const hasOutput = logs.some((l) => l.includes('أهلاً') || l.includes('البطل'));

      if (!hasObject) {
        return {
          passed: false,
          message: 'اتأكد من وجود الكائن hero وفيه الخصائص name و level ودالة sayHello.',
        };
      }
      if (!hasOutput) {
        return {
          passed: false,
          message: 'البطل لسه متكلمش! استدعي الدالة hero.sayHello() عشان تطبع التحية.',
          hint: 'اكتب في آخر سطر: hero.sayHello();',
        };
      }
      return {
        passed: true,
        message: 'وحش البرمجة! 🌟 الكائن اشتغل والبطل حيّا الجمهور بنجاح!',
      };
    },
  },
  {
    id: 'challenge-6-dom',
    chapterId: 6,
    chapterTitle: 'الفصل 6: تفاعل صفحة الويب والـ DOM',
    title: 'تحدي الزر التفاعلي والـ DOM (HTML & JS)',
    difficulty: 'hero',
    difficultyLabel: 'تحدي الأبطال 👑',
    points: 30,
    story: 'الـ DOM هو الكوبري السحري اللي بيخلي جافاسكريبت تتحكم في أي عنصر في صفحة الـ HTML وتغير ألوانه ونصوصه لما المستخدم يضغط كليك!',
    objective: 'حوّل المحرر لوضع HTML، اعمل زر button بزر كليك يغير نص عنوان h1 إلى "مبروك يا مبرمج كود بالمصري!".',
    starterCode: `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <style>
    body { font-family: sans-serif; text-align: center; padding: 30px; background: #0f172a; color: white; }
    button { background: #f59e0b; color: black; font-weight: bold; padding: 10px 20px; border: none; border-radius: 8px; cursor: pointer; }
  </style>
</head>
<body>
  <h1 id="title">اضغط على الزر يا بطل!</h1>
  <button onclick="changeText()">غيّر النص 🪄</button>

  <script>
    function changeText() {
      // 1. استخدم document.getElementById لمسك العنصر صاحب الـ id="title"
      
      // 2. غيّر خاصية innerText للعنصر واكتب: "مبروك يا مبرمج كود بالمصري!"
      
    }
  </script>
</body>
</html>
`,
    solutionHint: 'جوه الدالة اكتب: document.getElementById("title").innerText = "مبروك يا مبرمج كود بالمصري!";',
    check: (code: string) => {
      const c = code.toLowerCase();
      const hasButton = c.includes('<button') && c.includes('onclick');
      const hasGetElement = c.includes('getelementbyid') || c.includes('queryselector');
      const hasChange = c.includes('innertext') || c.includes('innerhtml') || c.includes('textcontent');

      if (!hasButton) {
        return {
          passed: false,
          message: 'لازم الصفحة تحتوي على عنصر <button> فيه حدث onclick!',
        };
      }
      if (!hasGetElement || !hasChange) {
        return {
          passed: false,
          message: 'محتاجين نمسك العنصر بـ document.getElementById ونغير نصه بـ innerText.',
          hint: 'اكتب: document.getElementById("title").innerText = "مبروك يا مبرمج كود بالمصري!";',
        };
      }
      return {
        passed: true,
        message: 'بطل حقيقي! 🏆 ربطت الجافاسكريبت بالـ DOM وصفحتك بقت تفاعلية بامتياز!',
      };
    },
  },
];
