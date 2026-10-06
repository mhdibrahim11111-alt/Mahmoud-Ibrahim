import { PartComprehensiveExam } from '../types';

export const partExamsData: Record<number, PartComprehensiveExam> = {
  1: {
    id: 'part-1-exam',
    partId: 1,
    title: 'الاختبار والتحدي الشامل: الجزء الأول',
    subtitle: 'المتغيرات والأنواع والعمليات الحسابية (الفصول 1 إلى 5)',
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
    subtitle: 'القرارات والشروط والمعاملات المنطقية (الفصول 6 إلى 9)',
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
    subtitle: 'التكرار والحلقات البرمجية (الفصول 10 إلى 12)',
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
            explanation: 'صح جداً يا صديقي! 👏 لاحظ علامة <=، يعني العداد هيشمل: 0, 1, 2, 3, 4, 5 (مجموعهم 6 مرات).',
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
            explanation: 'تحذير هام يا صديقي! ⚠️ العداد لو متعدلش هيفضل الشرط صحيح للأبد ومش هيخرج من الحلقة أبداً.',
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
            explanation: 'ممتاز يا صديقي! 🛑 break بتوقف الحلقة فوراً عند تحقق شرط طوارئ معين.',
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
            explanation: 'إجابة مظبوطة يا صديقي! 🎯 while بتفحص الشرط الأول، بينما do..while بتنفذ بعدين تفحص.',
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
    subtitle: 'كائن Math والدوال وreturn والنطاقات وتتبع التنفيذ (الفصول 13 إلى 18)',
    description:
      'اختبار شامل وتحدي برمجي بيراجع أدوات كائن Math الرياضية، وإعلان واستدعاء الدوال، والفرق الجوهري بين الطباعة والإرجاع، ونطاق المتغيرات، وتتبع تدفق التنفيذ، وتصميم لعبة التخمين الذكية.',
    keyPoints: [
      'كائن Math بيحتوي على دوال جاهزة زي round وfloor وceil وmax وmin وrandom.',
      'الدالة بتستقبل مدخلات كمعاملات (parameters)، ونقدر نستدعيها مليون مرة بدون تكرار الكود (مبدأ DRY).',
      'أمر return بيسلّم القيمة باليد للمستدعي، بينما console.log مجرد شاشة عرض للعرض فقط.',
      'المتغير المحلي داخل { } بيعيش ويموت جوه غرفته ومش بنقدر نستخدمه برّه نطاقه إطلاقاً.',
      'لعبة التخمين الذكية بتدمج توليد الأرقام العشوائية مع الشروط if/else وتمرير المعاملات والإرجاع.'
    ],
    quiz: [
      {
        id: 'p4-q1',
        question: 'لو دالة مفيهاش أمر return خالص واستدعيناها عشان نخزن قيمتها في متغير، القيمة هتكون إيه يا صديقي؟',
        options: [
          {
            id: 'a',
            text: 'undefined (لأن الدالة مخرجتش بأي عصير ولا سلمت ناتج)',
            isCorrect: true,
            explanation: 'صح جداً وبرافو عليك يا صديقي! 👏 لو معملتش return صريح، جافاسكريبت بترجع undefined تلقائياً.',
          },
          {
            id: 'b',
            text: '0',
            isCorrect: false,
            explanation: 'الدالة لا تفترض أي رقم تلقائياً.',
          },
          {
            id: 'c',
            text: 'null',
            isCorrect: false,
            explanation: 'null قيمة تخصص يدوياً فقط.',
          },
        ],
      },
      {
        id: 'p4-q2',
        question: 'الدالة Math.random() في JavaScript بترجع رقم في أنهي مدى بالظبط؟',
        options: [
          {
            id: 'a',
            text: 'رقم عشري من 0 (مشمول) إلى أقل من 1 (غير مشمول)',
            isCorrect: true,
            explanation: 'إجابة مظبوطة 100%! 🎲 وبنضربها في المدى ونستخدم Math.floor لتحويلها لأرقام صحيحة.',
          },
          {
            id: 'b',
            text: 'من 1 إلى 100 دائماً',
            isCorrect: false,
            explanation: 'Math.random لا تختار مدى 100 إلا بمعادلة نكتبها نحن.',
          },
          {
            id: 'c',
            text: 'تعيد دائماً الرقم 0',
            isCorrect: false,
            explanation: 'القيمة تتغير عشوائياً في كل استدعاء.',
          },
        ],
      },
      {
        id: 'p4-q3',
        question: 'توقّع ناتج الكود التالي يا صديقي:',
        codeSnippet: 'console.log(Math.floor(8.99));',
        options: [
          {
            id: 'a',
            text: '8 (لأن floor بتنزل للأرض وتقطع الكسور تماماً)',
            isCorrect: true,
            explanation: 'تحليل سليم جداً! 🛗 floor تنزل دائماً للعدد الصحيح الأقل.',
          },
          {
            id: 'b',
            text: '9',
            isCorrect: false,
            explanation: 'هذا ناتج التقريب للأعلى Math.ceil أو التقريب العادل Math.round.',
          },
          {
            id: 'c',
            text: '8.9',
            isCorrect: false,
            explanation: 'floor تعيد عدداً صحيحاً ولا تحتفظ بأي كسور.',
          },
        ],
      },
      {
        id: 'p4-q4',
        question: 'ما نتيجة تنفيذ Math.max(10, 50, 5)؟',
        options: [
          {
            id: 'a',
            text: '50 (أعلى قيمة بين الأرقام الممررة)',
            isCorrect: true,
            explanation: 'ممتاز يا صديقي! 🌟 Math.max تعيد أكبر قيمة فوراً.',
          },
          {
            id: 'b',
            text: '10',
            isCorrect: false,
            explanation: '10 هي القيمة الأولى فقط وليست الأكبر.',
          },
          {
            id: 'c',
            text: '5',
            isCorrect: false,
            explanation: '5 هي أصغر قيمة وتعيدها دالة Math.min.',
          },
        ],
      },
      {
        id: 'p4-q5',
        question: 'لو عرّفنا const secret = 99 داخل دالة startGame، هل نقدر نقرأه خارج جسم الدالة؟',
        options: [
          {
            id: 'a',
            text: 'لا، وهيطلع خطأ ReferenceError لأن المتغير محلي (Block Scope) داخل الدالة فقط',
            isCorrect: true,
            explanation: 'أحسنت يا صديقي! 🚪 المتغير مقفول عليه داخل الأقواس { } ومحدش بره يقدر يوصله.',
          },
          {
            id: 'b',
            text: 'نعم، كل المتغيرات متاحة عالمياً',
            isCorrect: false,
            explanation: 'النطاق يحمي المتغيرات المحلية من التسرب خارج غرفتها.',
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
      title: 'تحدي ختام الجزء 4: دالة فحص التخمين الذكية',
      prompt:
        'اكتب دالة اسمها checkGuess(secret, guess) ترجع بـ return النص "مبروك كسبت 🎉" إذا كان الرقمان متساويين، وترجع "حاول مرة تانية 🔄" إذا كانا مختلفين. ثم استدعِ الدالة بالرقمين 6 و 6 واطبع الناتج في الكونسول.',
      hint: 'استخدم if/else داخل الدالة مع أمر return، ثم نفّذ: console.log(checkGuess(6, 6));',
      initialCode: `// اكتب دالة checkGuess واستدعاءها بالرقمين 6 و 6 هنا بنفسك...
`,
      solutionCode: `function checkGuess(secret, guess) {
  if (secret === guess) {
    return "مبروك كسبت 🎉";
  } else {
    return "حاول مرة تانية 🔄";
  }
}

console.log(checkGuess(6, 6));`,
    },
  },

  5: {
    id: 'part-5-exam',
    partId: 5,
    title: 'الاختبار والتحدي الشامل: الجزء الخامس',
    subtitle: 'المصفوفات والفهرسة من الصفر وعمليات التعديل وتتبع التحولات (الفصول 19 إلى 22)',
    description:
      'اختبار شامل وتحدي برمجي بيراجع مفهوم المصفوفات، الفهرسة من 0، خاصية length، المرور بـ for..of، وعمليات push وpop وincludes وindexOf، ومراجعة تحليلية لتتبع تحولات المصفوفات.',
    keyPoints: [
      'عناصر المصفوفة بتبدأ دائماً من index 0، وآخر فهرس هو (length - 1).',
      'نقدر نغيّر أي عنصر عن طريق رقم رفّه، وlength بتقولنا عدد العناصر الإجمالي.',
      'حلقة for...of بتعدّي على قيم العناصر مباشرة بدون تعقيد العدادات.',
      'دالة push بتضيف عنصر في آخر المصفوفة، وpop بتحذف آخر عنصر.',
      'دالة includes بتشوف إذا كانت القيمة موجودة (true/false)، وindexOf بترجّع رقم الرف أو -1 لو مش موجودة.'
    ],
    quiz: [
      {
        id: 'p5-q1',
        question: 'إزاي نوصل لأول عنصر في المصفوفة التالية يا صديقي؟',
        codeSnippet: 'const foods = ["كشري", "ملوخية"];',
        options: [
          {
            id: 'a',
            text: 'foods[0]',
            isCorrect: true,
            explanation: 'صح جداً! 👏 الفهرسة في JavaScript بتبدأ من صفر، عشان كده foods[0] هو الكشري الأول.',
          },
          {
            id: 'b',
            text: 'foods[1]',
            isCorrect: false,
            explanation: 'ده العنصر الثاني (ملوخية).',
          },
          {
            id: 'c',
            text: 'foods.length',
            isCorrect: false,
            explanation: 'length بتعطي عدد العناصر (2) مش أول عنصر.',
          },
        ],
      },
      {
        id: 'p5-q2',
        question: 'إذا كانت المصفوفة تحتوي على 4 عناصر، فما هو فهرس (index) آخر عنصر فيها؟',
        options: [
          {
            id: 'a',
            text: '3 (لأن الترقيم: 0، 1، 2، 3)',
            isCorrect: true,
            explanation: 'برافو عليك يا صديقي! 🎯 آخر فهرس دائماً بيساوي الطول ناقص واحد (length - 1).',
          },
          {
            id: 'b',
            text: '4',
            isCorrect: false,
            explanation: '4 هو الطول الإجمالي، ومحاولة قراءة [4] هترجع undefined.',
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
        question: 'أنهي حلقة بتمر على قيم المصفوفة مباشرة بدون الحاجة لتعريف عداد ومقارنة أطوال؟',
        options: [
          {
            id: 'a',
            text: 'for...of',
            isCorrect: true,
            explanation: 'ممتاز يا صديقي! 🌟 for...of بتاخد كل عنصر في يدك في كل دورة مباشرة.',
          },
          {
            id: 'b',
            text: 'try...catch',
            isCorrect: false,
            explanation: 'دي بنية لاصطياد الأخطاء وليست حلقة تكرار.',
          },
          {
            id: 'c',
            text: 'addEventListener',
            isCorrect: false,
            explanation: 'دي دالة للاستماع لأحداث النقر على عناصر الصفحة.',
          },
        ],
      },
      {
        id: 'p5-q4',
        question: 'الدالة push() بتعمل إيه لما نستخدمها مع المصفوفة؟',
        options: [
          {
            id: 'a',
            text: 'بتضيف عنصراً جديداً إلى نهاية المصفوفة',
            isCorrect: true,
            explanation: 'إجابة مظبوطة 100%! 🛒 push تضع العنصر في نهاية القائمة.',
          },
          {
            id: 'b',
            text: 'بتحذف أول عنصر',
            isCorrect: false,
            explanation: 'shift هي التي تحذف أول عنصر.',
          },
          {
            id: 'c',
            text: 'بترتب المصفوفة أبجدياً',
            isCorrect: false,
            explanation: 'push لا تقوم بالترتيب.',
          },
        ],
      },
      {
        id: 'p5-q5',
        question: 'ما نتيجة تنفيذ colors.includes("أزرق") إذا كانت colors تساوي ["أحمر", "أزرق"]؟',
        options: [
          {
            id: 'a',
            text: 'true (لأن القيمة موجودة بالفعل داخل المصفوفة)',
            isCorrect: true,
            explanation: 'أحسنت! 🎯 includes بترجع boolean حقيقي (true أو false).',
          },
          {
            id: 'b',
            text: 'false',
            isCorrect: false,
            explanation: 'اللون أزرق موجود في المصفوفة.',
          },
          {
            id: 'c',
            text: '1',
            isCorrect: false,
            explanation: '1 هو فهرس العنصر وتعيده دالة indexOf وليس includes.',
          },
        ],
      },
    ],
    challenge: {
      id: 'part5-capstone',
      title: 'تحدي ختام الجزء 5: تلخيص درجات الطلاب الناجحين',
      prompt:
        'معاك مصفوفة درجات الطلاب: const scores = [45, 80, 92, 35, 70];. استخدم حلقة for...of وعدّ عدد الدرجات الناجحة (50 أو أكتر)، واطبع في الكونسول: "الناجحين: 3".',
      hint: 'ابدأ العداد let passed = 0؛ وجوه حلقة for...of زوّده بـ passed++ لما تكون الدرجة >= 50.',
      initialCode: `// اكتب كود حلقة for...of لعد الطلاب الناجحين هنا بنفسك...
`,
      solutionCode: `const scores = [45, 80, 92, 35, 70];
let passed = 0;
for (const score of scores) {
  if (score >= 50) {
    passed++;
  }
}
console.log("الناجحين: " + passed);`,
    },
  },

  6: {
    id: 'part-6-exam',
    partId: 6,
    title: 'الاختبار والتحدي الشامل: الجزء السادس والنهائي',
    subtitle: 'HTML وCSS والنماذج والمشروع وكائنات الـ Objects والـ DOM والمراجعة التحليلية (الفصول 23 إلى 31)',
    description:
      'الاختبار الختامي الشامل للمسار! يراجع هيكلة HTML، وقواعد وتنسيقات CSS، ونموذج الصندوق Box Model، والألوان والتدرجات، وكائنات الـ Objects وكلمة this، والتحكم الحي بالـ DOM ومراقبة الأحداث وتتبعها.',
    keyPoints: [
      'HTML بيبني الهيكل العظمي للصفحة، والعناوين والقوائم والصور والروابط بتوضح المعنى الدلالي.',
      'خاصية alt بتقدم وصفاً بديلاً للصورة، وربط label مع id الحقل بيسهل استخدام النماذج.',
      'CSS بينسّق الصفحة بمحددات وخصائص وقيم، وبيتحكم في الألوان والخطوط وهوامش الصناديق.',
      'نموذج الصندوق (Box Model) بيتكوّن من: المحتوى والحشوة الداخلية (padding) والحدود (border) والهامش الخارجي (margin).',
      'الكائن (Object) بيجمع الخصائص والطرق، وكلمة this بتشاور على نفس الكائن الحالي المستدعي.',
      'الـ DOM ومستمعات الأحداث addEventListener بيربطوا تفاعل ونقرات المستخدم بعناصر الصفحة في التو واللحظة.'
    ],
    quiz: [
      {
        id: 'p6-q1',
        question: 'ما وظيفة الخاصية alt في وسم الصورة <img> يا صديقي؟',
        options: [
          {
            id: 'a',
            text: 'تقدم وصفاً بديلاً لقارئات الشاشة لمحركات البحث وعند تعذر تحميل الصورة',
            isCorrect: true,
            explanation: 'صح جداً وبرافو عليك! 👏 alt يصف محتوى الصورة ويفيد محركات البحث وذوي الهمم.',
          },
          {
            id: 'b',
            text: 'تغير حجم الصورة بالبكسل',
            isCorrect: false,
            explanation: 'تغيير الحجم يتم عبر CSS بخاصيتي width و height.',
          },
          {
            id: 'c',
            text: 'تحدد مسار ورابط ملف الصورة',
            isCorrect: false,
            explanation: 'تحديد المسار وظيفة خاصية src.',
          },
        ],
      },
      {
        id: 'p6-q2',
        question: 'ليه بنربط label بحقل الإدخال باستخدام for و id؟',
        options: [
          {
            id: 'a',
            text: 'عشان لما المستخدم ينقر على التسمية، يتفعل الحقل تلقائياً وينتقل المؤشر للكتابة جواه',
            isCorrect: true,
            explanation: 'إجابة نموذجية وممتازة! 🎯 تجربة مستخدم احترافية وسريعة وسهلة الوصول.',
          },
          {
            id: 'b',
            text: 'لتغيير لون خلفية الحقل',
            isCorrect: false,
            explanation: 'تغيير الألوان يتم عبر لغة CSS.',
          },
          {
            id: 'c',
            text: 'لمنع المستخدم من إدخال نصوص طويلة',
            isCorrect: false,
            explanation: 'تقييد الطول وظيفة خاصية maxlength.',
          },
        ],
      },
      {
        id: 'p6-q3',
        question: 'أي خاصية CSS تضيف مسافة وحشوة داخلية بين محتوى الصندوق وحدوده؟',
        options: [
          {
            id: 'a',
            text: 'padding (المخدات الداخلية للصندوق)',
            isCorrect: true,
            explanation: 'عاش يا بطل! 🌟 padding هي المسافة الداخلية المريحة داخل حدود الصندوق.',
          },
          {
            id: 'b',
            text: 'margin',
            isCorrect: false,
            explanation: 'margin تضيف مسافة خارجية تبعد الصندوق عن جيرانه.',
          },
          {
            id: 'c',
            text: 'border-radius',
            isCorrect: false,
            explanation: 'border-radius تدوّر الحواف فقط.',
          },
        ],
      },
      {
        id: 'p6-q4',
        question: 'كلمة this داخل دالة (Method) معرفة في كائن تشير إلى ماذا؟',
        options: [
          {
            id: 'a',
            text: 'تشير إلى نفس الكائن الحالي الذي استدعى الدالة',
            isCorrect: true,
            explanation: 'ممتاز جداً! 💡 this تعطي الدالة إمكانية الوصول المباشر لبيانات وخصائص صاحبها.',
          },
          {
            id: 'b',
            text: 'تشير لمتصفح الويب بالكامل',
            isCorrect: false,
            explanation: 'لو استدعيت الدالة كـ method لكائن، this تشير للكائن نفسه.',
          },
          {
            id: 'c',
            text: 'تشير لأول متغير في الصفحة',
            isCorrect: false,
            explanation: 'this سياق تنفيذي محلي مرتبط بالكائن المستدعي.',
          },
        ],
      },
      {
        id: 'p6-q5',
        question: 'ما وظيفة الدالة button.addEventListener("click", callback) في JavaScript؟',
        options: [
          {
            id: 'a',
            text: 'تربط دالة تستجيب فوراً عند وقوع حدث النقر على الزرار',
            isCorrect: true,
            explanation: 'برافو عليك يا صديقي! 🎯 المعيار الذهبي لجعل صفحات الويب تفاعلية وحية.',
          },
          {
            id: 'b',
            text: 'تحذف الزرار من شجرة الـ DOM',
            isCorrect: false,
            explanation: 'حذف العنصر يحتاج دالة remove().',
          },
          {
            id: 'c',
            text: 'تغير نوع الزرار لنص عادي',
            isCorrect: false,
            explanation: 'المستمع يراقب الأحداث فقط ولا يغير نوع العنصر.',
          },
        ],
      },
    ],
    challenge: {
      id: 'part6-capstone',
      title: 'التحدي الختامي الأكبر للمسار 🏆: بطاقة المطور التفاعلية',
      prompt:
        'أنشئ كائناً const developer يحتوي على الخاصيتين name: "سارة" و role: "مطور واجهات"، ودالة introduce() تستخدم this وترجع النص: "أنا سارة، وأعمل مطور واجهات". ثم استدعِ الدالة واطبع ناتجها في الكونسول.',
      hint: 'return "أنا " + this.name + "، وأعمل " + this.role; داخل دالة introduce.',
      initialCode: `// اكتب كائن developer واستدعاء دالة التعارف وطباعتها هنا بنفسك...
`,
      solutionCode: `const developer = {
  name: "سارة",
  role: "مطور واجهات",
  introduce() {
    return "أنا " + this.name + "، وأعمل " + this.role;
  }
};

console.log(developer.introduce());`,
    },
  },
};
