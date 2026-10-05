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
    subtitle: 'Math والدوال وreturn وscope ومحاكاة لعبة التخمين (الفصول 10 إلى 14)',
    description:
      'الاختبار ده بيراجع أدوات Math، وكتابة الدوال واستدعاءها، والفرق بين الطباعة وreturn، ونطاق المتغيرات، ومنطق لعبة التخمين.',
    keyPoints: [
          "Math فيها دوال جاهزة زي round وfloor وceil وrandom.",
          "الدالة بتستقبل مدخلات عن طريق parameters، ونقدر نستدعيها أكتر من مرة.",
          "return بيرجّع القيمة لمكان استدعاء الدالة، إنما console.log بيعرضها بس.",
          "المتغير المحلي اللي جوه الدالة مش بنقدر نستخدمه برّه نطاقها.",
          "لعبة التخمين بتستخدم رقم عشوائي وشرط if/else عشان تقارن التخمين بالرقم السري."
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
        question: 'Math.random() بترجع قيمة في أي مدى؟',
        options: [
          {
            id: 'a',
            text: 'من 0 (مشمولة) إلى أقل من 1',
            isCorrect: true,
            explanation: 'صحيح، وتقدر دمجها مع Math.floor لتوليد أعداد صحيحة ضمن مدى.',
          },
          {
            id: 'b',
            text: 'من 1 إلى 100 دائماً',
            isCorrect: false,
            explanation: 'Math.random لا تختار مدى صحيحاً بهذا الشكل تلقائياً.',
          },
          {
            id: 'c',
            text: 'تعيد دائماً الرقم 0',
            isCorrect: false,
            explanation: 'القيمة تتغير عشوائياً مع كل استدعاء.',
          },
        ],
      },
      {
        id: 'p4-q3',
        question: 'توقّع ناتج الكود التالي:',
        codeSnippet: 'console.log(Math.floor(8.99));',
        options: [
          {
            id: 'a',
            text: '8',
            isCorrect: true,
            explanation: 'Math.floor تنزل إلى العدد الصحيح الأقل.',
          },
          {
            id: 'b',
            text: '9',
            isCorrect: false,
            explanation: 'هذا ناتج التقريب للأعلى، وليس floor.',
          },
          {
            id: 'c',
            text: '8.9',
            isCorrect: false,
            explanation: 'floor تعيد عدداً صحيحاً ولا تحتفظ بالكسور.',
          },
        ],
      },
      {
        id: 'p4-q4',
        question: 'ما نتيجة Math.max(10, 50, 5)؟',
        options: [
          {
            id: 'a',
            text: '50',
            isCorrect: true,
            explanation: 'Math.max تعيد أكبر قيمة من المدخلات.',
          },
          {
            id: 'b',
            text: '10',
            isCorrect: false,
            explanation: 'هذه أصغر قيمة، وتعيدها Math.min.',
          },
          {
            id: 'c',
            text: '5',
            isCorrect: false,
            explanation: '5 ليست أكبر قيمة في القائمة.',
          },
        ],
      },
      {
        id: 'p4-q5',
        question: 'لو عرّفنا const secret داخل دالة startGame، هل يمكن قراءته خارجها؟',
        options: [
          {
            id: 'a',
            text: 'لا، لأنه متغير محلي داخل نطاق الدالة',
            isCorrect: true,
            explanation: 'المتغير المحلي متاح داخل الدالة فقط.',
          },
          {
            id: 'b',
            text: 'نعم، كل المتغيرات متاحة عالمياً',
            isCorrect: false,
            explanation: 'النطاق يمنع الوصول لمتغير محلي من الخارج.',
          },
          {
            id: 'c',
            text: 'نعم، إذا بدأ اسمه بحرف كبير',
            isCorrect: false,
            explanation: 'اسم المتغير لا يغيّر نطاقه.',
          },
        ],
      },
    ],
    challenge: {
      id: 'part4-capstone',
      title: 'تحدي الجزء 4 الشامل: لعبة تخمين الرقم',
      prompt:
        'اكتب دالة checkGuess(secret, guess) ترجع "مبروك كسبت" لو الرقمين زي بعض، و"حاول مرة تانية" لو مختلفين. جرّبها بالرقمين 6 و6 واطبع النتيجة.',
      hint: 'استخدم if/else جوه الدالة وreturn عشان ترجع الرسالة، وبعدها اطبع checkGuess(6, 6).',
      initialCode: `// اكتب دالة لعبة التخمين هنا...
`,
      solutionCode: `function checkGuess(secret, guess) {
  if (secret === guess) {
    return "مبروك كسبت";
  }
  return "حاول مرة أخرى";
}

console.log(checkGuess(6, 6));`,
    },
  },

  5: {
    id: 'part-5-exam',
    partId: 5,
    title: 'الاختبار والتحدي الشامل: الجزء الخامس',
    subtitle: 'المصفوفات والفهرسة والحلقات وطرق المصفوفة (الفصول 15 إلى 17)',
    description:
      'الاختبار ده بيراجع الفهرسة من الصفر، وlength، وحلقة for...of، وطرق push وpop وincludes وindexOf.',
    keyPoints: [
          "عناصر المصفوفة بتبدأ من index 0، وآخر فهرس هو length - 1.",
          "نقدر نغيّر عنصر عن طريق فهرسه، وlength بتقولنا عدد العناصر.",
          "حلقة for...of بتعدّي على قيم العناصر مباشرة.",
          "push بتضيف عنصر في آخر المصفوفة، وpop بتحذف آخر عنصر.",
          "includes بتشوف إذا كانت القيمة موجودة، وindexOf بيرجّع فهرسها أو -1 لو مش موجودة."
    ],
    quiz: [
      {
        id: 'p5-q1',
        question: 'كيف نصل إلى أول عنصر في المصفوفة التالية؟',
        codeSnippet: 'const foods = ["كشري", "ملوخية"];',
        options: [
          {
            id: 'a',
            text: 'foods[0]',
            isCorrect: true,
            explanation: 'الفهرسة تبدأ من صفر، لذلك foods[0] هو العنصر الأول.',
          },
          {
            id: 'b',
            text: 'foods[1]',
            isCorrect: false,
            explanation: 'هذا هو العنصر الثاني.',
          },
          {
            id: 'c',
            text: 'foods.length',
            isCorrect: false,
            explanation: 'length تعيد عدد العناصر، لا أول عنصر.',
          },
        ],
      },
      {
        id: 'p5-q2',
        question: 'إذا كانت المصفوفة فيها 4 عناصر، فما فهرس آخر عنصر؟',
        options: [
          {
            id: 'a',
            text: '3',
            isCorrect: true,
            explanation: 'الفهارس 0 و1 و2 و3؛ أي أن آخر فهرس هو length - 1.',
          },
          {
            id: 'b',
            text: '4',
            isCorrect: false,
            explanation: '4 هو عدد العناصر، وليس فهرس آخر عنصر.',
          },
          {
            id: 'c',
            text: '5',
            isCorrect: false,
            explanation: '5 يتجاوز عدد العناصر.',
          },
        ],
      },
      {
        id: 'p5-q3',
        question: 'أي حلقة تمر على قيم المصفوفة مباشرة؟',
        options: [
          {
            id: 'a',
            text: 'for...of',
            isCorrect: true,
            explanation: 'for...of تسند كل قيمة إلى المتغير في كل دورة.',
          },
          {
            id: 'b',
            text: 'try...catch',
            isCorrect: false,
            explanation: 'هذه بنية لمعالجة الأخطاء وليست حلقة.',
          },
          {
            id: 'c',
            text: 'addEventListener',
            isCorrect: false,
            explanation: 'تستمع هذه الدالة للأحداث على عناصر الصفحة.',
          },
        ],
      },
      {
        id: 'p5-q4',
        question: 'ما الذي تفعله push عند استخدامها مع مصفوفة؟',
        options: [
          {
            id: 'a',
            text: 'تضيف عنصراً إلى نهاية المصفوفة',
            isCorrect: true,
            explanation: 'push تضيف قيمة جديدة بعد آخر عنصر.',
          },
          {
            id: 'b',
            text: 'تحذف أول عنصر',
            isCorrect: false,
            explanation: 'shift هي التي تحذف أول عنصر.',
          },
          {
            id: 'c',
            text: 'ترتب المصفوفة أبجدياً',
            isCorrect: false,
            explanation: 'push لا ترتب العناصر.',
          },
        ],
      },
      {
        id: 'p5-q5',
        question: 'ما نتيجة colors.includes("أزرق") إذا كانت colors تساوي ["أحمر", "أزرق"]؟',
        options: [
          {
            id: 'a',
            text: 'true',
            isCorrect: true,
            explanation: 'includes تعيد true عند وجود القيمة في المصفوفة.',
          },
          {
            id: 'b',
            text: 'false',
            isCorrect: false,
            explanation: 'القيمة موجودة بالفعل.',
          },
          {
            id: 'c',
            text: '1',
            isCorrect: false,
            explanation: '1 هو فهرس القيمة، وليس نتيجة includes.',
          },
        ],
      },
    ],
    challenge: {
      id: 'part5-capstone',
      title: 'تحدي الجزء 5 الشامل: تلخيص درجات الطلاب',
      prompt:
        'معاك المصفوفة [45, 80, 92, 35, 70]. استخدم حلقة for...of وعدّ الدرجات الناجحة (50 أو أكتر)، وبعدها اطبع "الناجحين: 3".',
      hint: 'ابدأ العداد بصفر، وجوه for...of زوّده لما الدرجة تبقى >= 50.',
      initialCode: `// اكتب حلقة لحساب عدد الدرجات الناجحة...
`,
      solutionCode: `const scores = [45, 80, 92, 35, 70];
let passed = 0;
for (const score of scores) {
  if (score >= 50) passed++;
}
console.log("الناجحين: " + passed);`,
    },
  },

  6: {
    id: 'part-6-exam',
    partId: 6,
    title: 'الاختبار والتحدي الشامل: الجزء السادس والنهائي',
    subtitle: 'HTML وCSS والنماذج والمشروع والـ DOM (الفصول 18 إلى 25)',
    description:
      'الاختبار الختامي ده بيراجع HTML ومعاني الوسوم، وقواعد CSS والألوان، والنماذج، والكائنات، وأساسيات DOM والأحداث.',
    keyPoints: [
          "HTML بيبني هيكل الصفحة، والعناوين والقوائم والصور والروابط بتوضح معنى المحتوى.",
          "alt وصف بديل للصورة، وlabel المرتبط بالحقل بيخلّي النموذج أوضح وأسهل في الاستخدام.",
          "CSS بينسّق العناصر بمحددات وخصائص وقيم، وبيتحكم في الألوان والمسافات والحدود.",
          "نموذج الصندوق بيتكوّن من المحتوى والحشوة والحدود والهامش.",
          "الكائن بيجمع الخصائص والطرق، وthis بتشاور على الكائن اللي استدعى الطريقة.",
          "DOM وaddEventListener بيربطوا تفاعل المستخدم بعناصر الصفحة."
    ],
    quiz: [
      {
        id: 'p6-q1',
        question: 'ما وظيفة الخاصية alt في وسم img؟',
        options: [
          {
            id: 'a',
            text: 'تقدم وصفاً بديلاً لقارئات الشاشة وعند تعذر تحميل الصورة',
            isCorrect: true,
            explanation: 'alt يصف الصورة لمن لا يراها أو عند تعذر تحميلها.',
          },
          {
            id: 'b',
            text: 'تغير حجم الصورة',
            isCorrect: false,
            explanation: 'تتحكم CSS بحجم الصورة، لا خاصية alt.',
          },
          {
            id: 'c',
            text: 'تضيف رابط الصورة',
            isCorrect: false,
            explanation: 'src تحدد مسار الصورة.',
          },
        ],
      },
      {
        id: 'p6-q2',
        question: 'لماذا نربط label بحقل الإدخال باستخدام for و id؟',
        options: [
          {
            id: 'a',
            text: 'يجعل التسمية مرتبطة بالحقل ويسهل تفعيله وفهمه',
            isCorrect: true,
            explanation: 'عند تطابق for وid، يصبح الضغط على التسمية مرتبطاً بالحقل.',
          },
          {
            id: 'b',
            text: 'يغير لون الحقل',
            isCorrect: false,
            explanation: 'تغيير اللون يتم عبر CSS.',
          },
          {
            id: 'c',
            text: 'يمنع إدخال البيانات',
            isCorrect: false,
            explanation: 'هذه ليست وظيفة ربط label بالحقل.',
          },
        ],
      },
      {
        id: 'p6-q3',
        question: 'أي خاصية CSS تضيف مساحة داخلية بين المحتوى والحدود؟',
        options: [
          {
            id: 'a',
            text: 'padding',
            isCorrect: true,
            explanation: 'padding هي المسافة الداخلية بين المحتوى والحدود.',
          },
          {
            id: 'b',
            text: 'margin',
            isCorrect: false,
            explanation: 'margin تضيف مساحة خارج الحدود.',
          },
          {
            id: 'c',
            text: 'border-radius',
            isCorrect: false,
            explanation: 'border-radius تدوّر الحواف.',
          },
        ],
      },
      {
        id: 'p6-q4',
        question: 'ما القيم التي يتكون منها نموذج الصندوق الأساسي؟',
        options: [
          {
            id: 'a',
            text: 'المحتوى والحشوة الداخلية والحدود والهامش الخارجي',
            isCorrect: true,
            explanation: 'يتكوّن نموذج الصندوق من content وpadding وborder وmargin.',
          },
          {
            id: 'b',
            text: 'العناوين والصور والروابط',
            isCorrect: false,
            explanation: 'هذه عناصر من هيكل الصفحة وليست طبقات نموذج الصندوق.',
          },
          {
            id: 'c',
            text: 'النص واللون والخط',
            isCorrect: false,
            explanation: 'هذه خصائص مظهر، وليست طبقات نموذج الصندوق.',
          },
        ],
      },
      {
        id: 'p6-q5',
        question: 'ما وظيفة addEventListener("click", callback)؟',
        options: [
          {
            id: 'a',
            text: 'يربط دالة تستجيب لحدث النقر على العنصر',
            isCorrect: true,
            explanation: 'تستدعي الدالة المرتبطة عندما يقع حدث click على العنصر.',
          },
          {
            id: 'b',
            text: 'يحذف العنصر من الصفحة',
            isCorrect: false,
            explanation: 'إزالة العنصر تحتاج طريقة مختلفة.',
          },
          {
            id: 'c',
            text: 'يغير نوع الحقل تلقائياً',
            isCorrect: false,
            explanation: 'الحدث لا يغيّر نوع الحقل تلقائياً.',
          },
        ],
      },
    ],
    challenge: {
      id: 'part6-capstone',
      title: 'التحدي النهائي للمسار: بطاقة الطالب بالكائنات',
      prompt:
        'اعمل object اسمه student فيه name وgrade، وضيف method اسمها introduce تستخدم this.name وترجع جملة "أنا سارة". استدعيها واطبع الناتج.',
      hint: 'اكتب introduce() جوه الكائن وخليها ترجع "أنا " + this.name.',
      initialCode: `// اكتب كود التحدي الختامي الشامل للمسار هنا بنفسك...
`,
      solutionCode: `const student = {
  name: "سارة",
  grade: 95,
  introduce() {
    return "أنا " + this.name;
  }
};
console.log(student.introduce());`,
    },
  },
};
