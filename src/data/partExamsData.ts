import { PartComprehensiveExam } from '../types';

export const partExamsData: Record<number, PartComprehensiveExam> = {
  1: {
    id: 'part-1-exam',
    partId: 1,
    title: 'الاختبار والتحدي الشامل: الجزء الأول',
    subtitle: 'المتغيرات والأنواع والعمليات الحسابية (الفصول 1 إلى 4)',
    description:
      'اختبار مجمّع يقيس إتقانك لكافة أساسيات البرمجة في الجزء الأول: من أوامر الطباعة والتعليقات وحساسية الحروف، إلى العمليات الرياضية وباقي القسمة، وصولاً للفرق بين let و const وتحويل الأنواع.',
    keyPoints: [
          "console.log هي شاشة العرض للمبرمج؛ واحرص على كتابتها بحروف صغيرة (Case Sensitive).",
          "أي سطر مسبوق بـ // أو بين /* */ هو تعليق مهمل لتوضيح الكود ولا ينفذه المفسر.",
          "باقي القسمة (%) يعطيك ما تبقى بعد توزيع الأرقام الصحيحة (مثلاً: 14 % 4 = 2).",
          "علامة + مع النصوص تقوم بدمج النصوص (Concatenation) وليس جمعاً حسابياً (مثل \"10\" + 5 = \"105\").",
          "استخدم const كخيارك الافتراضي لحماية المتغيرات من التعديل، واستخدم let فقط لو كانت القيمة ستتغير لاحقاً.",
          "دالة Number(val) أو parseInt(val) هي الوسيلة القياسية لتحويل النصوص لأرقام قبل إجراء الحسابات."
    ],
    quiz: [
      {
        id: 'p1-q1',
        question: 'لو كتبت console.LOG بدلاً من console.log.. المفسر هيعمل إيه؟',
        options: [
          {
            id: 'a',
            text: 'هيعترض ويطلع خطأ ReferenceError لأن جافاسكريبت حساسة لحالة الحروف (Case Sensitive)',
            isCorrect: true,
            explanation: 'صح جداً! 👏 console.log لازم تتكتب كلها بحروف صغيرة (lowercase).',
          },
          {
            id: 'b',
            text: 'هيطبع النص بحروف كبيرة عادي',
            isCorrect: false,
            explanation: 'اسم الدالة نفسه غلط، فالبرنامج مش هيتعرف عليها.',
          },
          {
            id: 'c',
            text: 'هيتجاهل السطر كأنه تعليق',
            isCorrect: false,
            explanation: 'التعليقات فقط هي اللي بتبدأ بـ // أو /* */.',
          },
        ],
      },
      {
        id: 'p1-q2',
        question: 'توقّع ناتج تشغيل الكود التالي في الكونسول:',
        codeSnippet: 'const x = "10";\nconst y = 5;\nconsole.log(x + y * 2);',
        options: [
          {
            id: 'a',
            text: '"1010"',
            isCorrect: true,
            explanation: 'عبقري! 🎯 الضرب 5 * 2 يتم أولاً = 10، ثم ندمج النص "10" مع 10 فينتج "1010".',
          },
          {
            id: 'b',
            text: '30',
            isCorrect: false,
            explanation: 'x نص مش رقم، فعلامة + دمجت النصين مع بعض.',
          },
          {
            id: 'c',
            text: '"20"',
            isCorrect: false,
            explanation: 'أولويات العمليات تنفذ الضرب أولاً ثم الدمج.',
          },
        ],
      },
      {
        id: 'p1-q3',
        question: 'لو عندنا 14 تفاحة وقسمناهم على 4 أطفال بالتساوي، باقي القسمة (14 % 4) هيكون كام؟',
        options: [
          {
            id: 'a',
            text: '2',
            isCorrect: true,
            explanation: 'ممتاز! 👏 4 * 3 = 12، ويتبقى 2 من الـ 14، فباقي القسمة هو 2.',
          },
          {
            id: 'b',
            text: '3',
            isCorrect: false,
            explanation: '3 هو ناتج القسمة الصحيحة، مش باقي القسمة.',
          },
          {
            id: 'c',
            text: '0',
            isCorrect: false,
            explanation: 'الباقي 0 لو كان الرقم يقبل القسمة تماماً بدون باقٍ.',
          },
        ],
      },
      {
        id: 'p1-q4',
        question: 'إيه الفرق الحاسم بين let و const؟',
        options: [
          {
            id: 'a',
            text: 'const ثابتة تمنع إعادة تعيين القيمة بعد إنشائها، بينما let تسمح بالتعديل',
            isCorrect: true,
            explanation: 'إجابة نموذجية! 🔒 const اختصار constant يعني ثابت، و let متغير.',
          },
          {
            id: 'b',
            text: 'let للنصوص فقط و const للأرقام فقط',
            isCorrect: false,
            explanation: 'أي نوع بيانات يمكن تخزينه في let أو const.',
          },
          {
            id: 'c',
            text: 'const بتمسح قيمتها تلقائياً بعد ثانية',
            isCorrect: false,
            explanation: 'القيمة بتفضل محفوظة طالما البرنامج شغال.',
          },
        ],
      },
      {
        id: 'p1-q5',
        question: 'إزاي نحول النص "250" لرقم حقيقي عشان نجمعه مع رقم تاني بدون ما يحصل دمج نصوص؟',
        options: [
          {
            id: 'a',
            text: 'Number("250") أو parseInt("250")',
            isCorrect: true,
            explanation: 'برافو عليك! 💡 دالة Number تحول النص لرقم صالح للعمليات الحسابية.',
          },
          {
            id: 'b',
            text: 'String("250")',
            isCorrect: false,
            explanation: 'String بتحول لنص مش لرقم.',
          },
          {
            id: 'c',
            text: '"250".makeNumber()',
            isCorrect: false,
            explanation: 'مفيش دالة في جافاسكريبت بالاسم ده.',
          },
        ],
      },
    ],
    challenge: {
      id: 'part1-capstone',
      title: 'تحدي الجزء 1 الشامل: حاسبة فاتورة الطلبات الذكية',
      prompt:
        'اكتب برنامج يحسب فاتورة مطعم: عندك سعر الوجبة `const mealPrice = "120";` كـ نص، وسعر المشروب `const drinkPrice = 30` كـ رقم، وتوصيل 20، وضريبة 15. احسب الإجمالي بدون أخطاء دمج نصوص، واطبع بالظبط: "الإجمالي النهائي: 185". مع وضع تعليق توضيحي في بداية الكود.',
      hint: 'استخدم دالة Number(mealPrice) لتحويل سعر الوجبة قبل جمعه مع باقي الأرقام.',
      initialCode: `// اكتب كود حاسبة الفاتورة الشاملة للجزء الأول هنا بنفسك...
`,
      solutionCode: `// مشروع حاسبة الفاتورة للجزء الأول
const mealPrice = "120";
const drinkPrice = 30;
const delivery = 20;
const tax = 15;

const total = Number(mealPrice) + drinkPrice + delivery + tax;
console.log("الإجمالي النهائي: " + total);`,
    },
  },

  2: {
    id: 'part-2-exam',
    partId: 2,
    title: 'الاختبار والتحدي الشامل: الجزء الثاني',
    subtitle: 'القرارات والشروط والمعاملات المنطقية (الفصول 5 إلى 7)',
    description:
      'اختبار مجمّع يقيس قدرتك على توجيه مسار تنفيذ البرنامج: من شروط if..else المتعددة، إلى المعاملات المنطقية المعقدة && و || و !، وحتى بنية switch وسلوك break.',
    keyPoints: [
          "جملة if تفحص شرطاً منطقياً بين قوسين، وتنفذ كودها فقط لو كان الناتج true.",
          "كتلة else توفر المسار البديل لو كان الشرط false، و else if تسمح بفحص احتمالات متتالية.",
          "ترتيب الشروط في else if مهم جداً: رتّب دائماً من الأضيق والأعلى إلى الأوسع لتجنب تخطي الحالات الخاصة.",
          "المعامل && (AND) يشترط تحقق جميع الشروط معاً، بينما || (OR) يكتفي بتحقق شرط واحد على الأقل.",
          "علامة ! (NOT) تعكس القيمة المنطقية (تحول true إلى false والعكس).",
          "جملة switch مثالية لمقارنة متغير واحد بقيم محددة وثابتة؛ واحرص دائماً على وضع break; لمنع الـ fall-through."
    ],
    quiz: [
      {
        id: 'p2-q1',
        question: 'المعامل المنطقي || (OR) بيرجع false في أنهي حالة فقط؟',
        options: [
          {
            id: 'a',
            text: 'فقط لو الطرفين الاتنين كان ناتجهم false',
            isCorrect: true,
            explanation: 'صح! 🎯 علامة || متساهلة، يكفيها طرف واحد true لتعطي true، ولا تعطي false إلا لو كل الأطراف false.',
          },
          {
            id: 'b',
            text: 'لو طرف واحد بس كان false',
            isCorrect: false,
            explanation: 'لو طرف واحد true بترجع true على طول.',
          },
          {
            id: 'c',
            text: 'مستحيل ترجع false أبداً',
            isCorrect: false,
            explanation: 'بترجع false لو كان: false || false.',
          },
        ],
      },
      {
        id: 'p2-q2',
        question: 'الكود ده هيطبع إيه في الشاشة؟',
        codeSnippet: 'const score = 88;\nif (score >= 90) {\n  console.log("A");\n} else if (score >= 80) {\n  console.log("B");\n} else {\n  console.log("C");\n}',
        options: [
          {
            id: 'a',
            text: '"B"',
            isCorrect: true,
            explanation: 'ممتاز! 👏 الشرط الأول 88 >= 90 غلط، فانتقل لـ else if ووجد 88 >= 80 صح، فطبع B وتوقف.',
          },
          {
            id: 'b',
            text: '"A"',
            isCorrect: false,
            explanation: 'الدرجة 88 أقل من 90.',
          },
          {
            id: 'c',
            text: '"B" ثم "C"',
            isCorrect: false,
            explanation: 'سلسلة if..else if تنفذ شرطاً واحداً فقط وتتجاهل الباقي.',
          },
        ],
      },
      {
        id: 'p2-q3',
        question: 'إيه اللي هيحصل لو حذفنا كلمة break; من جميع حالات جملة switch؟',
        options: [
          {
            id: 'a',
            text: 'البرنامج هينفذ الحالة المتطابقة ويكمل تنفيذ كل الحالات التالية وراها (Fall-through)',
            isCorrect: true,
            explanation: 'إجابة مظبوطة! ⚠️ كلمة break هي السور الذي يحمي كل حالة ويمنع التسرب للي بعدها.',
          },
          {
            id: 'b',
            text: 'البرنامج هيطلع SyntaxError',
            isCorrect: false,
            explanation: 'مش هيطلع خطأ لغوي، دي ميزة مقصودة في اللغة لكنها تسبب أخطاء لو نسيناها.',
          },
          {
            id: 'c',
            text: 'البرنامج مش هينفذ أي حاجة خالص',
            isCorrect: false,
            explanation: 'بالعكس، ده هينفذ كل الحالات التالية.',
          },
        ],
      },
      {
        id: 'p2-q4',
        question: 'توقّع قيمة التعبير المنطقي التالي: !(5 > 3 && 2 < 1)',
        options: [
          {
            id: 'a',
            text: 'true',
            isCorrect: true,
            explanation: 'عاش يا عبقري! 🧠 اللي جوه القوس: 5 > 3 (صح) && 2 < 1 (غلط) = غلط (false). وعلامة ! عكسته فبقى true!',
          },
          {
            id: 'b',
            text: 'false',
            isCorrect: false,
            explanation: 'احسب اللي بين القوسين الأول ثم اقلب النتيجة بعلامة !.',
          },
          {
            id: 'c',
            text: 'Error',
            isCorrect: false,
            explanation: 'المعاملات المنطقية صالحة وتعمل بكفاءة.',
          },
        ],
      },
      {
        id: 'p2-q5',
        question: 'ليه الترتيب التنازلي للشروط في if..else if مهم جداً؟',
        options: [
          {
            id: 'a',
            text: 'لأن الكمبيوتر بيتوقف عند أول شرط صحيح، فلو وضعنا الشرط الأوسع في الأول هيبلع كل الحالات',
            isCorrect: true,
            explanation: 'حكمة برمجية خالصة! 🎯 لو حطيت score >= 50 في الأول، الطالب اللي جاب 95 هيطبع مقبول ويتوقف!',
          },
          {
            id: 'b',
            text: 'لأن لغة جافاسكريبت ترفض الترتيب العشوائي',
            isCorrect: false,
            explanation: 'اللغة تقبل أي ترتيب، لكن المنطق البرمجي هو الذي سينكسر.',
          },
          {
            id: 'c',
            text: 'لتسريع سرعة الإنترنت',
            isCorrect: false,
            explanation: 'ملوش علاقة بالإنترنت.',
          },
        ],
      },
    ],
    challenge: {
      id: 'part2-capstone',
      title: 'تحدي الجزء 2 الشامل: محرك تذاكر الملاهي الذكي',
      prompt:
        'صمم محرك تذاكر: عندك `const age = 14;` و `const isWeekend = true;`. لو العمر أقل من 6 يطبع "دخول مجاني للأطفال"، لو العمر بين 6 و 12 يطبع "تذكرة أطفال: 50"، لو العمر أكبر من 12 و هو يوم إجازة (isWeekend === true) يطبع "تذكرة ويك إند كبار: 100"، وغير كدة يطبع "تذكرة عادية: 80".',
      hint: 'استخدم if و else if مع ربط شرط العمر ويوم الإجازة بـ &&.',
      initialCode: `// اكتب كود محرك تذاكر الملاهي الشامل هنا بنفسك...
`,
      solutionCode: `const age = 14;
const isWeekend = true;

if (age < 6) {
  console.log("دخول مجاني للأطفال");
} else if (age <= 12) {
  console.log("تذكرة أطفال: 50");
} else if (age > 12 && isWeekend) {
  console.log("تذكرة ويك إند كبار: 100");
} else {
  console.log("تذكرة عادية: 80");
}`,
    },
  },

  3: {
    id: 'part-3-exam',
    partId: 3,
    title: 'الاختبار والتحدي الشامل: الجزء الثالث',
    subtitle: 'التكرار والحلقات البرمجية (الفصول 8 و 9)',
    description:
      'اختبار مجمّع يقيس قدرتك على أتمتة العمليات المتكررة: التحكم في العدادات بـ for، التعامل مع شروط while، وتفادي الحلقات اللانهائية القاتلة.',
    keyPoints: [
          "حلقة for تتكون من 3 أركان: العداد المبدئي (let i=0)، شرط الاستمرار (i < n)، وخطوة التحديث (i++).",
          "حلقة while تستمر طالما الشرط true؛ وتأكد دائماً من تحديث المتغير بداخلها تجنباً للحلقة اللانهائية (Infinite Loop).",
          "حلقة do..while تضمن تنفيذ الكود لمرة واحدة على الأقل قبل فحص الشرط في النهاية.",
          "أمر break ينهي الحلقة ويخرج منها فوراً، بينما أمر continue يتخطى الدورة الحالية فقط ويبدأ الدورة التالية."
    ],
    quiz: [
      {
        id: 'p3-q1',
        question: 'في حلقة for (let i = 0; i <= 5; i++)، الكود هيتكرر كام مرة بالظبط؟',
        options: [
          {
            id: 'a',
            text: '6 مرات (من 0 إلى 5 معاً لأن الشرط فيه <=)',
            isCorrect: true,
            explanation: 'صح جداً! 👏 لاحظ علامة <=، يعني العداد هيشمل: 0, 1, 2, 3, 4, 5 (مجموعهم 6 مرات).',
          },
          {
            id: 'b',
            text: '5 مرات فقط',
            isCorrect: false,
            explanation: 'كانت هتبقى 5 مرات لو كان الشرط i < 5 بدون علامة =.',
          },
          {
            id: 'c',
            text: '7 مرات',
            isCorrect: false,
            explanation: 'العد بدأ من 0 وانتهى عند 5.',
          },
        ],
      },
      {
        id: 'p3-q2',
        question: 'لو نسيت تكتب سطر زيادة العداد (زي count++) جوه حلقة while.. إيه النتيجة؟',
        options: [
          {
            id: 'a',
            text: 'حلقة لانهائية (Infinite Loop) تجمد المتصفح وتهنج الصفحة',
            isCorrect: true,
            explanation: 'تحذير هام! ⚠️ العداد لو متعدلش هيفضل الشرط صحيح للأبد ومش هيخرج من الحلقة أبداً.',
          },
          {
            id: 'b',
            text: 'البرنامج هيتوقف ويطلع رسالة خطأ',
            isCorrect: false,
            explanation: 'الكمبيوتر هيفضل ينفذ الحلقة بسرعة جنونية بدون ما يتوقف.',
          },
          {
            id: 'c',
            text: 'هتشتغل مرة واحدة بس',
            isCorrect: false,
            explanation: 'هتفضل تكرر إلى ما لا نهاية.',
          },
        ],
      },
      {
        id: 'p3-q3',
        question: 'أمر break لما نكتبه جوه حلقة تكرار بيعمل إيه؟',
        options: [
          {
            id: 'a',
            text: 'بيكسر الحلقة ويخرج منها فوراً حتى لو الشرط لسه صحيح',
            isCorrect: true,
            explanation: 'ممتاز! 🛑 break بتوقف الحلقة فوراً عند تحقق شرط طوارئ معين.',
          },
          {
            id: 'b',
            text: 'بيبدأ اللفة من أول وجديد',
            isCorrect: false,
            explanation: 'بدء اللفة التالية وتخطي الحالية وظيفته continue مش break.',
          },
          {
            id: 'c',
            text: 'بيبطأ سرعة التكرار',
            isCorrect: false,
            explanation: 'ملوش علاقة بالسرعة.',
          },
        ],
      },
      {
        id: 'p3-q4',
        question: 'إيه الفرق الحقيقي بين while و do..while؟',
        options: [
          {
            id: 'a',
            text: 'do..while بتنفذ الكود مرة واحدة على الأقل قبل فحص الشرط',
            isCorrect: true,
            explanation: 'إجابة مظبوطة! 🎯 while بتفحص الشرط الأول، بينما do..while بتنفذ بعدين تفحص.',
          },
          {
            id: 'b',
            text: 'while مخصصة للأرقام و do..while للنصوص',
            isCorrect: false,
            explanation: 'الحلقات بتتعامل مع أي منطق في البرنامج.',
          },
          {
            id: 'c',
            text: 'do..while أقدم ومش مستخدمة',
            isCorrect: false,
            explanation: 'موجودة ومفيدة في حالات تتطلب تنفيذ الأمر لمرة واحدة مؤكدة أولاً.',
          },
        ],
      },
    ],
    challenge: {
      id: 'part3-capstone',
      title: 'تحدي الجزء 3 الشامل: مولد جدول الضرب وحساب المجموع',
      prompt:
        'باستخدام حلقة for، اكتب كود يطبع جدول ضرب الرقم 3 من 1 إلى 5 بالشكل: "3 * 1 = 3"، ثم في نهاية البرنامج اطبع مجموع النواتج كلها بالشكل: "المجموع الكلي: 45".',
      hint: 'عرّف متغير let sum = 0 قبل الحلقة، وكل لفة اضرب واطبع وزوّد الناتج على sum.',
      initialCode: `// اكتب كود جدول الضرب وحساب المجموع للجزء الثالث هنا بنفسك...
`,
      solutionCode: `let sum = 0;
for (let i = 1; i <= 5; i++) {
  const result = 3 * i;
  console.log("3 * " + i + " = " + result);
  sum = sum + result;
}
console.log("المجموع الكلي: " + sum);`,
    },
  },

  4: {
    id: 'part-4-exam',
    partId: 4,
    title: 'الاختبار والتحدي الشامل: الجزء الرابع',
    subtitle: 'الدوال والمصفوفات (الفصول 10 إلى 13)',
    description:
      'اختبار مجمّع يقيس قدرتك على تنظيم الكود في دوال قابلة لإعادة الاستخدام، ومعالجة مجموعات البيانات الكبيرة بالمصفوفات ودوال التحويل map و filter.',
    keyPoints: [
          "الدوال تُجمّع الأوامر في وحدة واحدة قابلة لإعادة الاستخدام؛ والمعاملات (Parameters) هي مدخلات الدالة.",
          "أمر return هو الذي يُسلّم ناتج الدالة لباقي البرنامج؛ والدالة بدون return ترجع undefined تلقائياً.",
          "دوال السهم (Arrow Functions) توفر صيغة أنيقة ومختصرة مع إرجاع ضمني (Implicit Return) عند كتابتها بسطر واحد.",
          "المصفوفات تبدأ من الفهرس صفر [0]؛ ونستخدم push للإضافة في النهاية، و pop للحذف، و length لمعرفة عدد العناصر.",
          "دالة filter تستخرج العناصر التي تحقق شرطاً معيناً في مصفوفة جديدة.",
          "دالة map تحوّل كل عنصر في المصفوفة وتنتج مصفوفة جديدة بنفس الطول."
    ],
    quiz: [
      {
        id: 'p4-q1',
        question: 'لو دالة مفيهاش أمر return ونادينا عليها، القيمة المعادة منها هتكون:',
        options: [
          {
            id: 'a',
            text: 'undefined',
            isCorrect: true,
            explanation: 'صح جداً! 👏 لو معملتش return صريح، جافاسكريبت بترجع undefined تلقائياً.',
          },
          {
            id: 'b',
            text: '0',
            isCorrect: false,
            explanation: 'الدالة لا تفترض أي رقم.',
          },
          {
            id: 'c',
            text: 'null',
            isCorrect: false,
            explanation: 'null قيمة تخصص يدوياً.',
          },
        ],
      },
      {
        id: 'p4-q2',
        question: 'دالة السهم (Arrow Function) دي بتعمل إيه؟ const square = n => n * n;',
        options: [
          {
            id: 'a',
            text: 'بتاخد رقم n وترجع مربعه (n * n) تلقائياً (Implicit Return)',
            isCorrect: true,
            explanation: 'ممتاز! 🚀 دالة سهم أنيقة بسطر واحد بدون أقواس أو كلمة return.',
          },
          {
            id: 'b',
            text: 'بتجمع n + n',
            isCorrect: false,
            explanation: 'العلامة هي * يعني ضرب.',
          },
          {
            id: 'c',
            text: 'بتطبع في الكونسول فقط',
            isCorrect: false,
            explanation: 'الدالة تعيد قيمة ناتج الضرب.',
          },
        ],
      },
      {
        id: 'p4-q3',
        question: 'توقّع ناتج تشغيل الكود التالي في الكونسول:',
        codeSnippet: 'const fruits = ["تفاح", "موز"];\nfruits.push("مانجو");\nconsole.log(fruits.length);',
        options: [
          {
            id: 'a',
            text: '3',
            isCorrect: true,
            explanation: 'برافو! 🎯 push أضافت "مانجو" في الآخر، فأصبح عدد العناصر 3.',
          },
          {
            id: 'b',
            text: '2',
            isCorrect: false,
            explanation: 'push زادت طول المصفوفة بعنصر جديد.',
          },
          {
            id: 'c',
            text: '"مانجو"',
            isCorrect: false,
            explanation: 'المطلوب طباعة fruits.length يعني عدد العناصر.',
          },
        ],
      },
      {
        id: 'p4-q4',
        question: 'لو عندك مصفوفة درجات وعايز تستخرج فقط درجات الطلاب الناجحين (>= 50)، أنسب دالة هي:',
        options: [
          {
            id: 'a',
            text: '.filter()',
            isCorrect: true,
            explanation: 'صح جداً! 🌟 filter بتصفي وتطلع مصفوفة جديدة بالعناصر التي تحقق الشرط فقط.',
          },
          {
            id: 'b',
            text: '.push()',
            isCorrect: false,
            explanation: 'push لإضافة عناصر في النهاية.',
          },
          {
            id: 'c',
            text: '.sort()',
            isCorrect: false,
            explanation: 'sort للترتيب فقط.',
          },
        ],
      },
      {
        id: 'p4-q5',
        question: 'دالة .map() بتختلف عن .forEach() في إنها:',
        options: [
          {
            id: 'a',
            text: 'ترجع مصفوفة جديدة بنفس الطول بعد تطبيق التعديل على كل عنصر',
            isCorrect: true,
            explanation: 'إجابة عبقرية! 💡 map بتحوّل البيانات لمصفوفة جديدة، و forEach بتلف وتنفذ أوامر بس.',
          },
          {
            id: 'b',
            text: 'بتحذف العناصر غير المرغوبة',
            isCorrect: false,
            explanation: 'الحذف والتصفية وظيفة filter.',
          },
          {
            id: 'c',
            text: 'بتشتغل على أول عنصر بس',
            isCorrect: false,
            explanation: 'map بتمر على كل عناصر المصفوفة بلا استثناء.',
          },
        ],
      },
    ],
    challenge: {
      id: 'part4-capstone',
      title: 'تحدي الجزء 4 الشامل: نظام تحليل نتائج الطلاب',
      prompt:
        'عندك مصفوفة درجات: `const scores = [45, 80, 92, 35, 70];`. اكتب دالة باسم `getPassed` تستخدم `.filter()` لاستخراج الدرجات الناجحة (>= 50)، ثم استخدم `.map()` لإضافة 5 درجات بونص لكل درجة ناجحة، واطبع في النهاية عدد الطلاب الناجحين بالشكل: "الناجحين: 3".',
      hint: 'استخدم filter أولاً ثم map أو اطبع طول المصفوفة المفلترة.',
      initialCode: `// اكتب كود نظام تحليل درجات الطلاب للجزء الرابع هنا بنفسك...
`,
      solutionCode: `const scores = [45, 80, 92, 35, 70];

function getPassed(arr) {
  const passed = arr.filter(s => s >= 50);
  const withBonus = passed.map(s => s + 5);
  console.log("الناجحين: " + passed.length);
  return withBonus;
}

getPassed(scores);`,
    },
  },

  5: {
    id: 'part-5-exam',
    partId: 5,
    title: 'الاختبار والتحدي الشامل: الجزء الخامس',
    subtitle: 'الكائنات وشجرة الـ DOM وتفاعل المستخدم (الفصول 14 إلى 17)',
    description:
      'اختبار مجمّع يقيس قدرتك على نمذجة البيانات المعقدة بالكائنات والـ Methods، وربط كود جافاسكريبت بصفحة الويب والـ DOM والاستجابة لنقرات المستخدم.',
    keyPoints: [
          "الكائنات (Objects) تنظم البيانات المعقدة في هيئة مفاتيح وقيم { key: value } يسهل الوصول إليها بنقطة (.) أو أقواس ([]).",
          "الدوال داخل الكائنات تسمى Methods؛ والكلمة المفتاحية this تشير إلى نفس الكائن الحالي الذي استدعى الدالة.",
          "شجرة الـ DOM تمثل صفحة الويب ككائنات قابلة للتحكم والتعديل بواسطة كود جافاسكريبت.",
          "دالة document.querySelector تختار العناصر بأي محدد CSS؛ وخاصية textContent تعدل النصوص بأمان وسرعة.",
          "نستخدم addEventListener(\"click\", callback) للاستماع لتفاعلات ونقرات المستخدم والاستجابة لها في الحال."
    ],
    quiz: [
      {
        id: 'p5-q1',
        question: 'في الكائن التالي، إزاي ننفذ دالة الترحيب sayHello؟',
        codeSnippet: 'const bot = {\n  name: "روبوت",\n  sayHello() { return "أهلاً"; }\n};',
        options: [
          {
            id: 'a',
            text: 'bot.sayHello()',
            isCorrect: true,
            explanation: 'صح جداً! 🤖 نكتب اسم الكائن ثم نقطة ثم اسم الدالة وقوسين الاستدعاء ().',
          },
          {
            id: 'b',
            text: 'sayHello()',
            isCorrect: false,
            explanation: 'الدالة موجودة داخل الكائن bot وليست معرّفة خارجه.',
          },
          {
            id: 'c',
            text: 'bot["sayHello"] بدون أقواس',
            isCorrect: false,
            explanation: 'بدون أقواس هيرجعلك نص الدالة مش هينفذها.',
          },
        ],
      },
      {
        id: 'p5-q2',
        question: 'كلمة this لما نستخدمها جوه دالة تابعة لكائن بتشير لمين؟',
        options: [
          {
            id: 'a',
            text: 'للكائن الحالي نفسه اللي الدالة شغالة جواه',
            isCorrect: true,
            explanation: 'إجابة ممتازة! 👏 this بتسمح للدالة تقرأ وتعدل خواص نفس الكائن بسهولة.',
          },
          {
            id: 'b',
            text: 'لمتصفح جوجل كروم',
            isCorrect: false,
            explanation: 'سياق التنفيذ مرتبط بالكائن المستدعي.',
          },
          {
            id: 'c',
            text: 'لأي متغير عشوائي في الملف',
            isCorrect: false,
            explanation: 'this محددة بدقة بحسب طريقة الاستدعاء.',
          },
        ],
      },
      {
        id: 'p5-q3',
        question: 'أفضل دالة عصرية للوصول لعنصر من عناصر الـ HTML بكلاس أو id هي:',
        options: [
          {
            id: 'a',
            text: 'document.querySelector()',
            isCorrect: true,
            explanation: 'صح! 🎯 بتاخد أي محدد CSS زي #id أو .class أو اسم الوسم.',
          },
          {
            id: 'b',
            text: 'document.find()',
            isCorrect: false,
            explanation: 'مفيش دالة في الـ DOM القياسي بالاسم ده.',
          },
          {
            id: 'c',
            text: 'window.getElement()',
            isCorrect: false,
            explanation: 'البحث عن العناصر يتم عبر كائن document.',
          },
        ],
      },
      {
        id: 'p5-q4',
        question: 'لتغيير الكلام المكتوب جوه فقرة <p> بأمان وبدون ثغرات أمنية بنستخدم:',
        options: [
          {
            id: 'a',
            text: 'element.textContent = "النص الجديد"',
            isCorrect: true,
            explanation: 'أحسن ممارسة برمجية! 🛡️ textContent يعامل المدخلات كنص صريح ويحمي من حقن الأكواد الخبيثة.',
          },
          {
            id: 'b',
            text: 'element.writeText("النص الجديد")',
            isCorrect: false,
            explanation: 'اسم الخاصية القياسي هو textContent أو innerText.',
          },
          {
            id: 'c',
            text: 'element.change()',
            isCorrect: false,
            explanation: 'change ده حدث مش دالة لتغيير النصوص.',
          },
        ],
      },
      {
        id: 'p5-q5',
        question: 'لمراقبة نقرة المستخدم على زر في الصفحة، بنربط الحدث باستخدام:',
        options: [
          {
            id: 'a',
            text: 'btn.addEventListener("click", () => { ... })',
            isCorrect: true,
            explanation: 'برافو! 🚀 addEventListener هي الأسلوب الاحترافي القياسي في برمجة الويب.',
          },
          {
            id: 'b',
            text: 'btn.listenOnClick()',
            isCorrect: false,
            explanation: 'اسم الدالة الرسمي هو addEventListener.',
          },
          {
            id: 'c',
            text: 'btn.waitClick()',
            isCorrect: false,
            explanation: 'مفيش دالة بالاسم ده.',
          },
        ],
      },
    ],
    challenge: {
      id: 'part5-capstone',
      title: 'تحدي الجزء 5 الشامل: نظام كائن الحساب البنكي الذكي',
      prompt:
        'أنشئ كائناً باسم `account` يحتوي على الخاصية `balance: 500`، ودالة `deposit(amount)` تزود الرصيد بـ this.balance وتطبع "تم إيداع: " مع المبلغ، ودالة `getBalance()` تطبع بالظبط: "الرصيد الحالي: " مع الرصيد بعد التعديل. استدعِ deposit بمبلغ 200 ثم استدعِ getBalance.',
      hint: 'استخدم this.balance للوصول للرصيد وتعديله داخل الدوال.',
      initialCode: `// اكتب كود كائن الحساب البنكي للجزء الخامس هنا بنفسك...
`,
      solutionCode: `const account = {
  balance: 500,
  deposit(amount) {
    this.balance = this.balance + amount;
    console.log("تم إيداع: " + amount);
  },
  getBalance() {
    console.log("الرصيد الحالي: " + this.balance);
  }
};

account.deposit(200);
account.getBalance();`,
    },
  },

  6: {
    id: 'part-6-exam',
    partId: 6,
    title: 'الاختبار والتحدي الشامل: الجزء السادس والنهائي',
    subtitle: 'الويب المتكامل، التخزين المحلي، والـ Async (الفصول 18 إلى 25)',
    description:
      'الاختبار النهائي الكبير لكامل مسار احتراف البرمجة بجافاسكريبت: يدمج التخزين في localStorage مع JSON، التعامل مع النماذج، الأكواد غير المتزامنة async/await، معالجة الأخطاء بـ try..catch، وبناء التطبيقات المتكاملة.',
    keyPoints: [
          "HTML يبني الهيكل الأساسي للصفحة، و CSS يتحكم في الألوان والتنسيقات والمسافات.",
          "في النماذج (Forms)، نستخدم input.value لقراءة مدخلات المستخدم، و e.preventDefault() لمنع إعادة تحميل الصفحة.",
          "التخزين المحلي localStorage يحفظ البيانات في متصفح المستخدم؛ ونستخدم JSON.stringify للحفظ و JSON.parse للقراءة.",
          "العمليات غير المتزامنة async و await تضمن عدم تجميد واجهة المستخدم أثناء جلب البيانات الخارجية بـ fetch.",
          "بنية try...catch تحمي التطبيق من الانهيار المفاجئ وتصطاد الأخطاء غير المتوقعة (Exceptions) بذكاء.",
          "فصل المسؤوليات (Separation of Concerns) هو المبدأ الهندسي الأهم لتنظيم الحالة (State) والواجهة (UI) والأحداث (Events)."
    ],
    quiz: [
      {
        id: 'p6-q1',
        question: 'ليه لازم نعمل JSON.stringify() لما نخزن كائن في localStorage؟',
        options: [
          {
            id: 'a',
            text: 'لأن localStorage بتخزن نصوص فقط، و stringify بتحول الكائن لنص JSON صالح للتخزين',
            isCorrect: true,
            explanation: 'إجابة صحيحة 100%! 📦 لو مخزنتوش كـ stringify هيتخزن كنص مشوه ومستحيل ترجعه.',
          },
          {
            id: 'b',
            text: 'لحماية الكود من الفيروسات',
            isCorrect: false,
            explanation: 'JSON هو صيغة بيانات نصية وليس برنامج حماية.',
          },
          {
            id: 'c',
            text: 'لإرساله للسيرفر فوراً',
            isCorrect: false,
            explanation: 'localStorage تخزين محلي على جهاز المستخدم فقط.',
          },
        ],
      },
      {
        id: 'p6-q2',
        question: 'لما نستقبل بيانات من localStorage بنستخدم دالة إيه عشان نرجعها كائن حقيقي؟',
        options: [
          {
            id: 'a',
            text: 'JSON.parse()',
            isCorrect: true,
            explanation: 'ممتاز! 🔄 parse بتفك النص وترجعه كائن جافاسكريبت تقدر تقرأ خواصه بسهولة.',
          },
          {
            id: 'b',
            text: 'JSON.stringify()',
            isCorrect: false,
            explanation: 'stringify بتعمل العكس (من كائن لنص).',
          },
          {
            id: 'c',
            text: 'JSON.decode()',
            isCorrect: false,
            explanation: 'اسم الدالة الرسمي هو JSON.parse.',
          },
        ],
      },
      {
        id: 'p6-q3',
        question: 'كلمة await في كود جافاسكريبت وظيفتها إيه؟',
        options: [
          {
            id: 'a',
            text: 'انتظار اكتمال الوعد (Promise) وحل نتيجته بدون تجميد واجهة المستخدم',
            isCorrect: true,
            explanation: 'صح جداً! ⏳ بتخلي الكود غير المتزامن يتقرأ ويتكتب بأسلوب متسلسل وأنيق.',
          },
          {
            id: 'b',
            text: 'إيقاف المتصفح لمدة ساعة',
            isCorrect: false,
            explanation: 'هي بتنتظر فقط العملية غير المتزامنة وتكمل فوراً بعد انتهائها.',
          },
          {
            id: 'c',
            text: 'إعادة تشغيل الصفحة',
            isCorrect: false,
            explanation: 'ملهاش علاقة بالريلود.',
          },
        ],
      },
      {
        id: 'p6-q4',
        question: 'ليه بنستخدم بنية try...catch في التطبيقات الكبيرة؟',
        options: [
          {
            id: 'a',
            text: 'لاصطياد الأخطاء غير المتوقعة (Exceptions) ومنع انهيار التطبيق وتقديم تجربة مستقرة للمستخدم',
            isCorrect: true,
            explanation: 'فكر مهندس برمجيات حقيقي! 🛡️ بتخلي التطبيق صلب (Resilient) ويتحمل أي عطل غير متوقع.',
          },
          {
            id: 'b',
            text: 'لتسريع معالجة الصور',
            isCorrect: false,
            explanation: 'try/catch وظيفتها الأمان ومعالجة الأخطاء.',
          },
          {
            id: 'c',
            text: 'لحذف الملفات المؤقتة',
            isCorrect: false,
            explanation: 'لا علاقة لها بالملفات.',
          },
        ],
      },
      {
        id: 'p6-q5',
        question: 'أمر e.preventDefault() مع حدث submit في النماذج (Forms) بيعمل إيه؟',
        options: [
          {
            id: 'a',
            text: 'بيمنع السلوك التلقائي للمتصفح وهو إعادة تحميل الصفحة بالكامل (Page Reload)',
            isCorrect: true,
            explanation: 'عاش! 🚀 بيسمح لجافاسكريبت تاخد البيانات وتعالجها وتخزنها فوراً دون وميض أو ريفريش.',
          },
          {
            id: 'b',
            text: 'بيمنع المستخدم من الكتابة في الفورم',
            isCorrect: false,
            explanation: 'هو بس بيمنع إعادة التحميل عند الإرسال.',
          },
          {
            id: 'c',
            text: 'بيحذف قاعدة البيانات',
            isCorrect: false,
            explanation: 'أمر آمن يخص أحداث المتصفح فقط.',
          },
        ],
      },
    ],
    challenge: {
      id: 'part6-capstone',
      title: 'التحدي النهائي للمسار: نظام إدارة وحفظ المهام',
      prompt:
        'اكتب برنامجاً متكاملاً: يحتوي على دالة `saveTask(taskName)` بتفحص اسم المهمة؛ لو كان فارغاً ترمي خطأ بـ `throw new Error("اسم المهمة مطلوب")`. استخدم بنية `try...catch` لاستدعاء الدالة بمهمة صحيحة "تعلم جافاسكريبت"، واطبع في النجاح: "تم حفظ المهمة بنجاح 🎯"، مع تجربة استدعائها بنص فارغ واصطياد الخطأ وطباعة رسالته.',
      hint: 'استخدم try { saveTask("تعلم جافاسكريبت"); } ثم try ثانية أو if/else مع throw و catch.',
      initialCode: `// اكتب كود التحدي الختامي الشامل للمسار هنا بنفسك...
`,
      solutionCode: `function saveTask(taskName) {
  if (!taskName || taskName.trim() === "") {
    throw new Error("اسم المهمة مطلوب");
  }
  console.log("تم حفظ المهمة بنجاح 🎯");
}

try {
  saveTask("تعلم جافاسكريبت");
  saveTask("");
} catch (err) {
  console.log("تم اصطياد الخطأ: " + err.message);
}`,
    },
  },
};
