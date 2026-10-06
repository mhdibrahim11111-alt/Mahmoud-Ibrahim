import { Part } from '../../types';

export const part2: Part = {
  id: 2,
  title: 'الجزء الثاني: القرارات (if وswitch)',
  subtitle: 'المفترق اللي الكمبيوتر بيقرر عنده',
  description:
    'إزاي برنامجك بياخد قراراته الذكية بناءً على الشروط، المعاملات المنطقية (&& و || و !)، جملة switch، ومراجعة شجرة القرارات.',
  iconName: 'GitFork',
  bugHunter: {
    id: 'bug-part-2',
    partId: 2,
    title: 'صائد الأخطاء: switch والشرط التائه 🐛',
    context:
      'الكود ده المفروض يحدد نسبة الخصم لمشتريات بقيمة 300 جنيه، بس لما نشغله هيطبع "مفيش خصم" بالرغم إن المبلغ أكتر من 200!',
    problemCode: `const total = 300;
switch (total) {
  case total >= 500:
    console.log("خصم 20%");
  case total >= 200:
    console.log("خصم 10%");
    break;
  default:
    console.log("مفيش خصم");
}`,
    bugLineNumber: 3,
    bugDescription:
      'وضع شروط مقارنة (Boolean) جوه case بينما switch بتفحص القيمة 300 مباشرة.',
    whyItHappens:
      'في switch (total)، المتغير total قيمته رقمية (300). أما الشروط زي total >= 500 بترجع boolean (false). المقارنة الصارمة بتفحص هل 300 === false؟ لا! هل 300 === true؟ لا! فيروح للـ default فوراً. الحل الصحيح لمقارنات الأكبر والأصغر هو استخدام if و else if.',
    fixedCode: `const total = 300;
if (total >= 500) {
  console.log("خصم 20%");
} else if (total >= 200) {
  console.log("خصم 10%");
} else {
  console.log("مفيش خصم");
}`,
    expectedCorrectOutput: `خصم 10%`,
    hints: [
      'هل جملة switch مصممة للمقارنات الأكبر والأصغر (> و <) ولا للقيم الثابتة المحددة؟',
      'ناتج total >= 200 هو true، فهل الرقم 300 يساوي true؟',
      'الحل الأنسب للمقارنات الرقمية هو استخدام if و else if.',
    ],
  },
  chapters: [
    {
      id: 6,
      partId: 2,
      partTitle: 'الجزء الثاني: القرارات (if وswitch)',
      title: 'الفصل 6: الشروط واتخاذ القرار (if وelse)',
      subtitle: 'لو الشرط صح نفذ كذا، وغير كده نفذ البديل',
      summaryPoints: [
        'جملة if بتخلي الكمبيوتر يفكّر ويقرر: لو الشرط true ينفذ الكود، لو false يتخطاه.',
        'جملة else بتمثل الخطة البديلة: كود بيتنفذ حصرياً لو شرط if لم يتحقق.',
        'سلسلة else if بتسمح بفحص احتمالات متعددة ورا بعض بالترتيب، وبتقف فور أول شرط صح.',
        'الترتيب من الأضيق للأوسع مهم جداً عشان الشروط متبلعش بعضها.',
      ],
      contentSections: [
        {
          heading: 'يعني إيه شرط في البرمجة؟ (مفترق الطرق)',
          text: `لحد دلوقتي، كانت برامجنا بتمشي زي القطر على القضبان: سطر ورا سطر من فوق لتحت بالترتيب، بدون أي تفكير أو تردد.
لكن في الحياة الحقيقية، قراراتنا معتمدة على شروط:
- "لو الدنيا بتمطر، هاخد شمسية.. غير كده هنزل عادي".
- "لو رصيدك في المحفظة أكبر من 50 جنيه، اشتري الكتاب.. غير كده وفر فلوسك".
- "لو مجموعك في الامتحان 50 أو أكتر، مبروك أنت ناجح".

في البرمجة بنسمي القرار ده الجمل الشرطية (Conditional Statements). والكمبيوتر بياخد القرار ده بناءً على قيمة واحدة بس: هل الشرط ده صح (true) ولا غلط (false)؟`,
          codeSnippet: `const isRaining = true;

if (isRaining) {
  console.log("🌧️ الجو بيمطر، خد شمسية معاك وأنت نازل!");
}`,
          callout: {
            type: 'insight',
            title: 'مخ الكمبيوتر بيفكر إزاي؟ 🤔',
            content:
              'الكمبيوتر بيبص بين القوسين بتوع if: لو لقى الناتج true هيدخل ينفذ الكود اللي جوه الأقواس المعقوفة { }. لو لقى الناتج false هيتخطاه وكأنه مش موجود أصلاً!',
          },
        },
        {
          heading: 'بنية جملة if البسيطة وتشريحها',
          text: `جملة if بتتكون من جزئين أساسيين:
1. القوسان الدائريان \`( )\`: بنحط جواهم التعبير أو المقارنة اللي عايزين نختبرها.
2. القوسان المعقوفان \`{ }\`: بنسميهم كتلة الكود (Code Block)، وده البيت المقفول اللي جواه الأوامر اللي مش هتتنفذ إلا لو الشرط نجح.`,
          codeSnippet: `const studentScore = 85;

// فحص شرط النجاح
if (studentScore >= 50) {
  console.log("🎉 ألف مبروك، أنت ناجح!");
  console.log("استعد للسنة الدراسية الجديدة.");
}

console.log("السطر ده هيتنفذ في كل الأحوال لأنه بره الـ if.");`,
        },
        {
          heading: 'المسار البديل: جملة else (لو محصلش كده.. نفذ البديل)',
          text: `طب لو الشرط محصلش والنتيجة طلعت false، وعايزين نعمل تصرف بديل؟
هنا بييجي دور كلمة else السحرية!
else ملهاش أقواس شروط دائرية، لأنها ببساطة بتقول للكمبيوتر: "لو شرط if اللي فوق منفعش، نفذ الكود ده فوراً بدون شروط":`,
          codeSnippet: `const batteryLevel = 15;

if (batteryLevel > 20) {
  console.log("🔋 البطارية كويسة، كمل استخدام عادي.");
} else {
  console.log("⚠️ البطارية ضعيفة! حط الموبايل في الشاحن فوراً.");
}`,
          callout: {
            type: 'warning',
            title: 'قاعدة لا تقبل الشك! ⛔',
            content:
              'مستحيل في أي برنامج إن if و else يتنفذوا سوا في نفس الوقت! الكمبيوتر بينفذ مسار واحد بس منهم: يا الأول يا التاني.',
          },
        },
        {
          heading: 'سلسلة الاحتمالات المتعددة: else if',
          text: `في أوقات كتير بيبقى عندنا احتمالات كتير متدرجة ورا بعض:
مثلاً: تقييم درجات الطلاب (ممتاز، جيد جداً، جيد، مقبول، راسب).
هنا بنستخدم سلسلة الشروط المتعددة (else if)، والكمبيوتر بيفحصهم واحدة ورا التانية بالترتيب من فوق لتحت:
أول شرط يلاقيه true بينفذه فوراً، ويهرب بره باقي السلسلة كلها حتى لو كان في شروط تانية صح تحته!`,
          codeSnippet: `const grade = 78;

if (grade >= 85) {
  console.log("🏆 تقديرك: ممتاز!");
} else if (grade >= 75) {
  console.log("🌟 تقديرك: جيد جداً!");
} else if (grade >= 65) {
  console.log("👍 تقديرك: جيد!");
} else if (grade >= 50) {
  console.log("👌 تقديرك: مقبول!");
} else {
  console.log("📚 محتاج تشد حيلك أكتر (راسب).");
}`,
          callout: {
            type: 'common_mistake',
            title: 'رتب شروطك صح يا صديقي! ⚠️',
            content:
              'لو بدأت بـ grade >= 50 في أول سطر، أي طالب جايب 95 هيتحسب مقبول ويتوقف الكود! رتب شروطك دائماً من الدرجة الأعلى والأضيق إلى الأوسع.',
          },
        },
      ],
      exercises: [
        {
          id: 'ch6-ex1',
          title: 'التمرين 1: فحص الرصيد',
          code: `const balance = 500;
if (balance > 1000) {
  console.log("رصيدك كويس");
} else {
  console.log("رصيدك محتاج شحن");
}`,
          expectedOutput: `رصيدك محتاج شحن`,
          explanation: 'الرصيد 500 ليس أكبر من 1000، فيتم تنفيذ كتلة else.',
        },
        {
          id: 'ch6-ex2',
          title: 'التمرين 2: تقديرات الدرجات',
          code: `const grade = 65;
if (grade >= 85) {
  console.log("ممتاز");
} else if (grade >= 65) {
  console.log("جيد");
} else if (grade >= 50) {
  console.log("مقبول");
} else {
  console.log("راسب");
}`,
          expectedOutput: `جيد`,
          explanation: 'الدرجة 65 تحقق شرط (grade >= 65) فتطبع "جيد" وتخرج من السلسلة.',
        },
      ],
      quiz: [
        {
          id: 'ch6-q1',
          question: 'الكود ده هيطبع إيه في شاشة الـ Console؟',
          codeSnippet:
            'let temp = 25;\nif (temp > 30) {\n  console.log("الجو حر");\n} else {\n  console.log("الجو لطيف");\n}',
          options: [
            {
              id: 'a',
              text: 'الجو لطيف',
              isCorrect: true,
              explanation:
                'برافو عليك يا صديقي! 🎯 لأن الشرط 25 > 30 نتيجته false، فالكمبيوتر راح للبديل وطبع اللي جوه else.',
            },
            {
              id: 'b',
              text: 'الجو حر',
              isCorrect: false,
              explanation: 'شرط if لم يتحقق لأن 25 ليست أكبر من 30.',
            },
            {
              id: 'c',
              text: 'الجو حر والجو لطيف معاً',
              isCorrect: false,
              explanation:
                'الكمبيوتر بينفذ مسار واحد بس: يا if يا else، مستحيل الاتنين مع بعض.',
            },
          ],
        },
        {
          id: 'ch6-q2',
          question: 'لو عندنا كذا else if في الكود، الكمبيوتر بيتعامل معاهم إزاي؟',
          options: [
            {
              id: 'a',
              text: 'بيفحصهم بالترتيب، وأول شرط يتحقق بينفذه ويتجاهل باقي الشروط تماماً',
              isCorrect: true,
              explanation:
                'صح جداً يا صديقي! 👏 بمجرد ما يلاقي أول شرط صحيح، بينفذ كتلته ويخرج بره بنية if بالكامل.',
            },
            {
              id: 'b',
              text: 'بينفذ كل الشروط حتى لو اتحقق أول واحد',
              isCorrect: false,
              explanation:
                'ده بيحصل لو كانوا جمل if منفصلة، لكن سلسلة if..else if بتقف عند أول شرط صحيح.',
            },
            {
              id: 'c',
              text: 'بيختار شرط عشوائي وينفذه',
              isCorrect: false,
              explanation:
                'الكمبيوتر ينفذ الأوامر بمنطق وتتابع صارم من الأعلى للأسفل.',
            },
          ],
        },
        {
          id: 'ch6-q3',
          question: 'ليه مينفعش نكتب أقواس شروط دائرية ( ) بجانب كلمة else مباشرة؟',
          options: [
            {
              id: 'a',
              text: 'لأن else تمثل الخطة البديلة التلقائية التي تنفذ عند فشل كافة الشروط السابقة دون شرط خاص',
              isCorrect: true,
              explanation:
                'تحليل ممتاز يا صديقي! 🌟 else معناها "فيما عدا ذلك"، وبالتالي لا تحتاج لشرط خاص بها.',
            },
            {
              id: 'b',
              text: 'لأن else مخصصة للأرقام فقط',
              isCorrect: false,
              explanation: 'else تعمل مع كافة أنواع البيانات كمسار بديل.',
            },
          ],
        },
      ],
      challenge: {
        id: 'ch6-chal',
        title: 'تحدي الفصل 6: رادار فحص السرعة 🚗',
        prompt:
          'اكتب كود بمتغير const speed = 95. لو السرعة أكبر من 100 اطبع "غرامة سرعة"، لو أكبر من 80 اطبع "خد بالك"، غير كده اطبع "سرعة عادية".',
        hint: 'رتب الشروط: الأكبر من 100 أولاً ثم الأكبر من 80.',
        initialCode: `const speed = 95;
// اكتب كود فحص السرعة باستخدام if و else if هنا...
`,
        solutionCode: `const speed = 95;
if (speed > 100) {
  console.log("غرامة سرعة");
} else if (speed > 80) {
  console.log("خد بالك");
} else {
  console.log("سرعة عادية");
}`,
      },
    },
    {
      id: 7,
      partId: 2,
      partTitle: 'الجزء الثاني: القرارات (if وswitch)',
      title: 'الفصل 7: المقارنات والمعاملات المنطقية',
      subtitle: 'المعاملات المنطقية: AND (&&)، OR (||)، و NOT (!)',
      summaryPoints: [
        'أدوات المقارنة (>, <, >=, <=, ===, !==) بترجع قيمة boolean: إما true أو false.',
        'المعامل المنطقي && (AND) صارم: لازم كل الشروط تكون true عشان يديك true.',
        'المعامل المنطقي || (OR) مرن: بيكفيه شرط واحد بس يكون true عشان يديك true.',
        'معامل النفي ! (NOT) بيعكس القيمة: بيخلي true تبقى false والعكس.',
      ],
      contentSections: [
        {
          heading: 'علامات المقارنة والمساواة الصارمة (Strict Equality)',
          text: `عشان نعمل شروط قوية، لازم نعرف إزاي نقارن بين القيم.
في JavaScript عندنا 6 علامات مقارنة أساسية:
• علامة \`>\` (أكبر من)، وعلامة \`<\` (أصغر من).
• علامة \`>=\` (أكبر من أو يساوي)، وعلامة \`<=\` (أصغر من أو يساوي).
• علامة \`===\` للمساواة الصارمة (Strict Equality): بتقارن القيمة والنوع معاً!
• علامة \`!==\` للاختلاف الصارم (Strict Inequality): هل القيمتان مختلفتان في القيمة أو النوع؟

خد بالك من الفرق بين علامة المساواة الواحدة \`=\` والتلاتة \`===\`:
• علامة \`=\` الواحدة معناها "إسناد وتخزين" قيمة في متغير (Assignment).
• علامة \`===\` التلاتة معناها "مقارنة" هل الطرفان متطابقان تماماً؟ (Comparison).`,
          codeSnippet: `console.log(10 > 5);      // true
console.log(10 <= 10);    // true
console.log(5 === 5);     // true
console.log(5 === "5");   // false (لأن الأول رقم والتاني نص!)
console.log(5 !== "5");   // true (فعلاً مختلفين في النوع)`,
        },
        {
          heading: 'المعامل المنطقي الصارم: AND (&&)',
          text: `المعامل المنطقي (AND &&) عامل زي بوابة محطة القطار الذكية:
عشان البوابة تفتحلك وتعدي، لازم الشرطين يتحققوا معاً في نفس اللحظة:
1. معاك تذكرة سارية (true).
2. AND (&&) واصل في الميعاد المظبوط (true).

لو شرط واحد بس منهم سقط وبقى false، البوابة مش هتفتح والناتج النهائي هيكون false!`,
          codeSnippet: `const hasTicket = true;
const isOnTime = true;

// فحص الشرطين معاً
if (hasTicket && isOnTime) {
  console.log("🚂 اتفضل اركب القطار، رحلة سعيدة!");
} else {
  console.log("❌ البوابة مقفولة: لازم تذكرة وتكون في ميعادك!");
}`,
        },
        {
          heading: 'المعامل المنطقي المرن: OR (||)',
          text: `على عكس && الصارمة، المعامل المنطقي (OR ||) مرن جداً وبيكتفي بشرط واحد:
بيقولك: "لو أي شرط من الشروط اللي حواليا تحقق، أنا موافق وهرجعلك true فوراً!".
الحالة الوحيدة اللي بيرجع فيها false هي لو كل الشروط المحيطة بيه كانت غلط بالكامل.`,
          codeSnippet: `const hasCash = false;
const hasCreditCard = true;

// يكفي وجود وسيلة دفع واحدة لسداد الحساب
if (hasCash || hasCreditCard) {
  console.log("💳 تم دفع الفاتورة بنجاح!");
} else {
  console.log("⚠️ للأسف معكش كاش ولا فيزا.");
}`,
          callout: {
            type: 'tip',
            title: 'تشبيه بسيط يوضح الفرق 💡',
            content:
              'لو قلت لصاحبك: "هاتلي معاك شاي أو قهوة" (||).. لو جاب أي واحد فيهم هتكون مبسوط! لكن لو قلت له: "لازم تجيب كراسة وقلم" (&&).. وجاب كراسة بس من غير قلم، مش هتعرف تكتب!',
          },
        },
        {
          heading: 'معامل النفي والعكس: NOT (!)',
          text: `معامل النفي (Logical NOT !) بيعكس القيمة المنطقية تماماً:
- لو القيمة true بيخليها false.
- لو القيمة false بيخليها true.
بنستخدمه كتير لما نحب نتأكد إن حدثاً ما لم يقع، مثلاً: لو المستخدم "غير مسجل دخول"، أو لو الموبايل "غير متصل بالإنترنت".`,
          codeSnippet: `const isConnectedToInternet = false;

// استخدام ! لفحص عدم الاتصال
if (!isConnectedToInternet) {
  console.log("📡 لا يوجد اتصال بالإنترنت.. جاري إعادة المحاولة.");
}`,
        },
      ],
      exercises: [
        {
          id: 'ch7-ex1',
          title: 'التمرين 1: فحص الاختلاف الصارم !==',
          code: `console.log(7 !== 7);
console.log(7 !== "7");`,
          expectedOutput: `false\ntrue`,
          explanation:
            '7 و 7 متطابقان تماماً فـ !== ترجع false. أما 7 و "7" يختلفان في النوع فترجع true.',
        },
        {
          id: 'ch7-ex2',
          title: 'التمرين 2: فحص الشروط المشتركة',
          code: `const hasWifi = true;
const hasCoffee = false;
console.log(hasWifi && hasCoffee);
console.log(hasWifi || hasCoffee);`,
          expectedOutput: `false\ntrue`,
          explanation:
            'مع && لازم الاتنين صح فينتج false. مع || يكفي الواي فاي فينتج true.',
        },
      ],
      quiz: [
        {
          id: 'ch7-q1',
          question: 'المعامل المنطقي && (AND) بيرجع true في أنهي حالة بالظبط؟',
          options: [
            {
              id: 'a',
              text: 'لما كل الشروط المرتبطة به تكون صحيحة (true) معاً',
              isCorrect: true,
              explanation:
                'صح جداً يا صديقي! 👏 علامة && صارمة.. لازم كل الشروط تكون true عشان تديك true.',
            },
            {
              id: 'b',
              text: 'لو شرط واحد بس كان صحيح والتاني غلط',
              isCorrect: false,
              explanation: 'لو شرط واحد بس صح ده دور المعامل || (OR) مش &&.',
            },
            {
              id: 'c',
              text: 'لما كل الشروط تكون false',
              isCorrect: false,
              explanation: 'لو الشروط كلها غلط النتيجة أكيد هتبقى false.',
            },
          ],
        },
        {
          id: 'ch7-q2',
          question: 'توقّع ناتج الكود ده هيطبع إيه في الـ Console:',
          codeSnippet:
            'const hasWifi = false;\nconst hasData = true;\nconsole.log(hasWifi || hasData);',
          options: [
            {
              id: 'a',
              text: 'true',
              isCorrect: true,
              explanation:
                'برافو عليك يا صديقي! 🎯 علامة || (OR) بيكفيها إن طرف واحد بس يكون true عشان ترجعلك true.',
            },
            {
              id: 'b',
              text: 'false',
              isCorrect: false,
              explanation: 'كانت هتبقى false لو كان الطرفان كلاهما false.',
            },
            {
              id: 'c',
              text: 'Error',
              isCorrect: false,
              explanation:
                'المعاملات المنطقية ترجع قيم boolean بصورة طبيعية تماماً.',
            },
          ],
        },
        {
          id: 'ch7-q3',
          question: 'ما هو ناتج التعبير: !false في لغة JavaScript؟',
          codeSnippet: 'console.log(!false);',
          options: [
            {
              id: 'a',
              text: 'true',
              isCorrect: true,
              explanation:
                'ممتاز يا صديقي! 🌟 علامة النفي ! تعكس القيمة المنطقية فتحول false إلى true.',
            },
            {
              id: 'b',
              text: 'false',
              isCorrect: false,
              explanation: 'علامة ! تعكس القيمة ولا تبقيها كما هي.',
            },
          ],
        },
      ],
      challenge: {
        id: 'ch7-chal',
        title: 'تحدي الفصل 7: قطار الملاهي 🎢',
        prompt:
          'اكتب شرطاً واحداً يطبع "تقدر تركب اللعبة" فقط إذا كان الطول height >= 140 والعمر age >= 10.',
        hint: 'استخدم علامة && لربط الشرطين معاً.',
        initialCode: `const height = 150;
const age = 12;
// اكتب شرط فحص الطول height والعمر age هنا...
`,
        solutionCode: `const height = 150;
const age = 12;
if (height >= 140 && age >= 10) {
  console.log("تقدر تركب اللعبة");
}`,
      },
    },
    {
      id: 8,
      partId: 2,
      partTitle: 'الجزء الثاني: القرارات (if وswitch)',
      title: 'الفصل 8: جملة switch وقائمة الاختيارات',
      subtitle: 'قائمة الاختيارات المنظمة، وحذارِ من الـ Fall-through!',
      summaryPoints: [
        'جملة switch بديل أنيق ومنظم لسلسلة if..else if لما بنقارن متغير واحد بقيم محددة وثابتة.',
        'كل حالة بتبدأ بكلمة case بعدها القيمة ونقطتان (:).',
        'كلمة break إجبارية في نهاية كل حالة لتوقيف التنفيذ ومنع التسريب والتداخل (Fall-through).',
        'كلمة default بتشتغل كخطة بديلة لو مفيش أي حالة من الحالات تطابقت.',
      ],
      contentSections: [
        {
          heading: 'ليه بنحتاج switch طالما عندنا if؟ (زرار الأسانسير)',
          text: `لو عندك متغير واحد وعايز تقارنه بقيم ثابتة ومحددة، مثلاً:
- أدوار الأسانسير (الدور 1، 2، 3...).
- أيام الأسبوع (السبت، الأحد، الإثنين...).
- اختيار مشروب من قائمة (1: شاي، 2: قهوة، 3: عصير).

لو كتبتها بـ if و else if، هتلاقي نفسك بتكرر اسم المتغير وعلامة === كذا مرة ورا بعض.
هنا جملة الاختيارات المتعددة (switch) بتيجي زي زرار الأسانسير: بتديها رقم الدور، وبتاخدك فوراً على المطلوب بدون تكرار!`,
          codeSnippet: `const dayNumber = 3;

switch (dayNumber) {
  case 1:
    console.log("السبت: بداية الأسبوع");
    break;
  case 2:
    console.log("الأحد: يوم العمل والدراسة");
    break;
  case 3:
    console.log("الإثنين: منتصف الأسبوع");
    break;
  default:
    console.log("يوم آخر في الأسبوع");
}`,
        },
        {
          heading: 'تشريح بنية switch: الأقواس، case، والنقطتان',
          text: `بنية switch بتعتمد على نظام محدد:
1. بنكتب switch (المتغير المراد فحصه).
2. بنفتح قوسين معقوفين \`{ }\` بيضموا كل الحالات.
3. بنكتب case متبوعة بالقيمة، وبعدها نقطتان (\`:\`).
4. بنكتب الكود اللي عايزين ننفذه، وبنختمه بأمر \`break;\`.

المقارنة اللي بتعملها switch من الداخل هي مساواة صارمة (===). يعني لو المتغير رقم 3 وكتبت case "3" كنص، مش هيتطابقوا!`,
          codeSnippet: `const role = "admin";

switch (role) {
  case "admin":
    console.log("👑 مرحباً بك يا مدير النظام، لديك كافة الصلاحيات.");
    break;
  case "editor":
    console.log("✍️ مرحباً بك يا محرر، يمكنك تعديل المقالات.");
    break;
  case "viewer":
    console.log("👀 مرحباً بك يا زائر، لديك صلاحية القراءة فقط.");
    break;
}`,
        },
        {
          heading: 'كارثة التسريب الساقط (Fall-through).. إياك ونسيان break! 🛑',
          text: `أخطر فخ بيقع فيه المبتدئ في switch هو نسيان كلمة \`break;\`.
كلمة break معناها: "فرامل! وقف تنفيذ واخرج بره الـ switch فوراً".
لو نسيت تكتب break في نهاية أي case، الكمبيوتر مش هيقف عند الحالة دي، بل هيكمل ويزحلق وينفذ كل الحالات اللي تحتها، حتى لو شروطها غير متطابقة! الظاهرة دي بنسميها الانزلاق التلقائي (Fall-through).`,
          codeSnippet: `const level = 1;

// مثال بدون break يوضح السقوط والانزلاق:
switch (level) {
  case 1:
    console.log("المستوى الأول");
    // نسينا break هنا!
  case 2:
    console.log("المستوى الثاني");
    break;
}
// النتيجة في الكونسول هتطبع:
// المستوى الأول
// المستوى الثاني (بالرغم إن level = 1!)`,
          callout: {
            type: 'warning',
            title: 'حط الفرامل دايماً يا صديقي! 🚗',
            content:
              'كل ما تكتب كلمة case.. افتكر على طول تختمها بأمر break; عشان تحمي برنامجك من تنفيذ أكواد مش في مكانها.',
          },
        },
        {
          heading: 'الخطة البديلة: كلمة default وتجميع الحالات',
          text: `ماذا لو المتغير قيمته مش موجودة في أي case؟
هنا بييجي دور كلمة default، وهي بتلعب نفس دور else الأخيرة في جمل if: لو مفيش ولا حالة نجحت، نفذ الكود اللي في default.

ميزة جميلة تانية في switch: نقدر نجمع أكتر من case ورا بعض بدون break لو ليهم نفس النتيجة:`,
          codeSnippet: `const day = "الجمعة";

switch (day) {
  case "الجمعة":
  case "السبت":
    console.log("🎉 إجازة نهاية الأسبوع، استمتع بوقتك!");
    break;
  case "الأحد":
  case "الإثنين":
  case "الثلاثاء":
  case "الأربعاء":
  case "الخميس":
    console.log("💼 يوم عمل ودراسة، بالتوفيق!");
    break;
  default:
    console.log("❓ يوم غير معروف، تأكد من كتابة الاسم صح.");
}`,
          callout: {
            type: 'celebration',
            title: 'تجميع الحالات بذكاء 👏',
            content:
              'لاحظ إزاي جمعنا "الجمعة" و "السبت" فوق بعض بكود واحد مشترك. دي طريقة ممتازة في switch بتوفر تكرار الأكواد!',
          },
        },
      ],
      exercises: [
        {
          id: 'ch8-ex1',
          title: 'التمرين 1: قائمة الفواكه',
          code: `const fruit = "mango";
switch (fruit) {
  case "apple":
    console.log("تفاح");
    break;
  case "mango":
    console.log("مانجو");
    break;
  default:
    console.log("فاكهة مش موجودة");
}`,
          expectedOutput: `مانجو`,
          explanation: 'تطابقت الحالة الثانية فطُبع "مانجو" وتوقف عند break.',
        },
        {
          id: 'ch8-ex2',
          title: 'التمرين 2: تجربة الـ Fall-through',
          code: `const num = 2;
switch (num) {
  case 1:
    console.log("واحد");
  case 2:
    console.log("اتنين");
  case 3:
    console.log("تلاتة");
    break;
  default:
    console.log("رقم تاني");
}`,
          expectedOutput: `اتنين\nتلاتة`,
          explanation:
            'لأن case 2 لا تحتوي على break، أكمل التنفيذ ونفذ case 3 أيضاً!',
        },
      ],
      quiz: [
        {
          id: 'ch8-q1',
          question:
            'لو نسينا نحط كلمة break; جوه واحدة من الـ cases في switch.. إيه اللي هيحصل؟',
          options: [
            {
              id: 'a',
              text: 'الكمبيوتر هيستمر وينفذ الحالات اللي بعدها رغماً عنها (Fall-through)',
              isCorrect: true,
              explanation:
                'ممتاز يا صديقي! 💡 ده سلوك اسمه Fall-through، عشان كده بنحط break عشان نقفل الحالة ونخرج.',
            },
            {
              id: 'b',
              text: 'الكمبيوتر هيطلع خطأ SyntaxError ومش هيشتغل',
              isCorrect: false,
              explanation:
                'مش هيطلع خطأ، جافاسكريبت بتسمح بكده برمجياً، بس النتيجة هتكون غير متوقعة.',
            },
            {
              id: 'c',
              text: 'هيقفل البرنامج فوراً',
              isCorrect: false,
              explanation: 'بالعكس، هيفضل شغال وينفذ الأسطر اللي وراها.',
            },
          ],
        },
        {
          id: 'ch8-q2',
          question: 'إيه فايدة كتلة default جوه جملة switch؟',
          options: [
            {
              id: 'a',
              text: 'تتنفذ لو مفيش أي case من الحالات السابقة تطابقت مع القيمة',
              isCorrect: true,
              explanation:
                'أحسنت يا صديقي! 👏 default بتلعب نفس دور else الأخيرة في جمل if.',
            },
            {
              id: 'b',
              text: 'تتنفذ دائماً في أول البرنامج قبل الحالات',
              isCorrect: false,
              explanation: 'لا، هي مسار بديل للحالات التي لم تتطابق فقط.',
            },
            {
              id: 'c',
              text: 'إجبارية ولا يمكن الاستغناء عنها في switch',
              isCorrect: false,
              explanation:
                'هي اختيارية ولكنها ممارسة برمجية ممتازة للتعامل مع أي مدخل غير متوقع.',
            },
          ],
        },
        {
          id: 'ch8-q3',
          question: 'نوع المقارنة التي تُجريها switch داخلياً بين المتغير وقيم case هي:',
          options: [
            {
              id: 'a',
              text: 'مقارنة صارمة (===) تفحص القيمة والنوع معاً دون أي تحويل ضمني',
              isCorrect: true,
              explanation:
                'إجابة دقيقة وصحيحة 100% يا صديقي! 🎯 لذلك الرقم 1 لا يطابق النص "1" داخل case.',
            },
            {
              id: 'b',
              text: 'مقارنة عادية (==) تحول النصوص إلى أرقام تلقائياً',
              isCorrect: false,
              explanation: 'switch تعتمد المقارنة الصارمة === فقط.',
            },
          ],
        },
      ],
      challenge: {
        id: 'ch8-chal',
        title: 'تحدي الفصل 8: محول أرقام الأشهر 📅',
        prompt:
          'اكتب جملة switch لمتغير const month = 3؛ يطبع: 1 = "يناير"، 2 = "فبراير"، 3 = "مارس"، وغير ذلك "شهر مش معروف". لا تنسَ break!',
        hint: 'ضع break بعد كل شهر، و default في النهاية.',
        initialCode: `const month = 3;
// اكتب جملة switch لفحص رقم الشهر month هنا...
`,
        solutionCode: `const month = 3;
switch (month) {
  case 1:
    console.log("يناير");
    break;
  case 2:
    console.log("فبراير");
    break;
  case 3:
    console.log("مارس");
    break;
  default:
    console.log("شهر مش معروف");
}`,
      },
    },
    {
      id: 9,
      partId: 2,
      partTitle: 'الجزء الثاني: القرارات (if وswitch)',
      title: 'الفصل 9: مراجعة تحليلية وتتبع شجرة القرارات',
      subtitle: 'تتبع مسار الشروط المعقدة والمتداخلة كمهندس برمجيات محترف',
      summaryPoints: [
        'مراجعة شاملة لجميع أنماط اتخاذ القرار في الجزء الثاني قبل الانتقال للحلقات التكرارية.',
        'تدريب التتبع الذهني لشجرة القرارات (Decision Tracing) وفحص مسارات التنفيذ.',
        'فهم أسبقية المعاملات المنطقية: ! أولاً، ثم &&، ثم ||.',
      ],
      contentSections: [
        {
          heading: '🧠 تتبع شجرة القرارات في عقلك (Decision Tracing)',
          text: `المبرمج المحترف بيعرف يتتبع الشروط المتداخلة والمعقدة في دماغه خطوة بخطوة.
تخيل البرنامج كشجرة ليها فروع: كل شرط هو مفترق طرق بياخدك في مسار محدد.
تعال يا صديقي نتتبع الحالتين دول:`,
        },
        {
          heading: 'الحالة التحليلية الأولى: شروط منحة التفوق المركبة 🎓',
          text: 'بص على الكود ده وتتبع هل الطالب هيتقبل في المنحة ولا لأ:',
          codeSnippet: `const gpa = 3.8;
const hasVolunteerWork = true;
const hasDisciplinaryWarning = false;

// فحص شروط القبول: معدل عالي وتطوع وبدون إنذارات
const isEligible = (gpa >= 3.5 && hasVolunteerWork) && !hasDisciplinaryWarning;

if (isEligible) {
  console.log("✅ مبروك، تم قبولك في منحة التفوق!");
} else {
  console.log("❌ الشروط لم تكتمل بالكامل.");
}`,
          callout: {
            type: 'tip',
            title: 'تتبع الشرط خطوة بخطوة 🔍',
            content:
              '1. الشرط الأول: (3.8 >= 3.5 && true) يعطي true.\n2. الشرط الثاني: !false يعطي true.\n3. النتيجة الإجمالية: true && true يعطي true، فيتم طباعة رسالة القبول.',
          },
        },
        {
          heading: 'الحالة التحليلية الثانية: أسبقية المعاملات المنطقية ⚖️',
          text: 'تتبع التعبير المنطقي ده: مين بيتنفذ الأول؟',
          codeSnippet: `// المعامل && بيتنفذ قبل ||
const result = false && false || true;
console.log(result); // true (لأن false && false = false، ثم false || true = true)

const result2 = false && (false || true);
console.log(result2); // false (الأقواس أجبرت حساب || أولاً = true، ثم false && true = false)`,
        },
      ],
      exercises: [
        {
          id: 'ch9-ex1',
          title: 'تمرين تحليلي 1: فحص الخصم الذكي',
          code: `const isMember = true;
const cartTotal = 150;
if (isMember && cartTotal > 100) {
  console.log("خصم 20%");
} else if (isMember || cartTotal > 200) {
  console.log("خصم 10%");
} else {
  console.log("بدون خصم");
}`,
          expectedOutput: `خصم 20%`,
          explanation: 'الشرط الأول (isMember && cartTotal > 100) كلاهما true فيتحقق فوراً ويتوقف.',
        },
        {
          id: 'ch9-ex2',
          title: 'تمرين تحليلي 2: تتبع مسار switch مع الأرقام والنصوص',
          code: `const val = "2";
switch (val) {
  case 2:
    console.log("رقم اتنين");
    break;
  case "2":
    console.log("نص اتنين");
    break;
  default:
    console.log("قيمة أخرى");
}`,
          expectedOutput: `نص اتنين`,
          explanation: 'المقارنة الصارمة ميزت بين الرقم 2 والنص "2" فطابقت الحالة الثانية بدقة.',
        },
      ],
      quiz: [
        {
          id: 'ch9-q1',
          question: 'ما هو ناتج تنفيذ: console.log(!true || false && true)؟',
          codeSnippet: 'console.log(!true || false && true);',
          options: [
            {
              id: 'a',
              text: 'false، لأن !true = false، و false && true = false، و false || false = false',
              isCorrect: true,
              explanation: 'تحليل عبقري وممتاز يا صديقي! 👏 تم مراعاة أسبقية النفي ثم AND ثم OR.',
            },
            {
              id: 'b',
              text: 'true',
              isCorrect: false,
              explanation: 'كافة الأطراف تنتج false في النهاية.',
            },
          ],
        },
        {
          id: 'ch9-q2',
          question: 'لو عندك جملة if (x > 10) وجواها if (y > 5)، دي بتكافئ منطقياً إيه؟',
          options: [
            {
              id: 'a',
              text: 'if (x > 10 && y > 5)',
              isCorrect: true,
              explanation: 'ممتاز يا صديقي! 🌟 الشروط المتداخلة تتطلب تحقق الشرطين معاً فتطابق المعامل &&.',
            },
            {
              id: 'b',
              text: 'if (x > 10 || y > 5)',
              isCorrect: false,
              explanation: 'المعامل || يكتفي بشرط واحد، بينما الشروط المتداخلة تتطلب الشرطين معاً.',
            },
          ],
        },
        {
          id: 'ch9-q3',
          question: 'في سلسلة if..else if، متى نستخدم switch كبديل أفضل؟',
          options: [
            {
              id: 'a',
              text: 'عند فحص متغير واحد محدد مقابل قائمة من القيم الثابتة المتطابقة بدقة',
              isCorrect: true,
              explanation: 'إجابة صحيحة 100% يا صديقي! 🎯 لتنظيم الكود ومنع التكرار.',
            },
            {
              id: 'b',
              text: 'عند فحص مجالات النطاقات الرقمية مثل x > 100 و x < 200',
              isCorrect: false,
              explanation: 'المجالات الرقمية تناسبها if و else if وليس switch.',
            },
          ],
        },
      ],
      challenge: {
        id: 'ch9-chal',
        title: 'تحدي ختام الجزء الثاني: نظام تصنيف رخص القيادة 🪪',
        prompt:
          'لديك متغيران: const age = 20 و const hasPassedMedical = true. اكتب كود يفحص: إذا كان العمر >= 18 واجتاز الفحص الطبي اطبع "مؤهل لاستخراج الرخصة"، وإذا كان العمر >= 18 ولم يجتز الفحص اطبع "محتاج فحص طبي"، غير ذلك اطبع "السن غير قانوني".',
        hint: 'استخدم if مع && ثم else if ثم else.',
        initialCode: `const age = 20;
const hasPassedMedical = true;
// اكتب نظام تصنيف الرخصة هنا...
`,
        solutionCode: `const age = 20;
const hasPassedMedical = true;

if (age >= 18 && hasPassedMedical) {
  console.log("مؤهل لاستخراج الرخصة");
} else if (age >= 18 && !hasPassedMedical) {
  console.log("محتاج فحص طبي");
} else {
  console.log("السن غير قانوني");
}`,
      },
    },
  ],
};
