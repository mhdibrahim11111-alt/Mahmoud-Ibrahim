import { Part } from '../types';

export const bookParts: Part[] = [
  {
    id: 1,
    title: 'الجزء الأول: المتغيرات والأنواع',
    subtitle: 'الصناديق اللي بنخزّن فيها المعلومة',
    description: 'مدخل لعالم البرمجة، التعامل مع الـ Console، العمليات الحسابية، الصناديق والخزائن (let وconst)، والأنواع الأساسية.',
    iconName: 'Box',
    bugHunter: {
      id: 'bug-part-1',
      partId: 1,
      title: 'كويز: صندوق أم خزنة؟',
      context: 'الكود ده لازم يطبع بيانات طالب ودرجته النهائية بعد إضافة 5 درجات بونص، لكن لما نشغله هيضرب إيرور!',
      problemCode: `let studentName = "Mostafa";
const finalScore = 85;
finalScore = finalScore + 5;
console.log(studentName + " scored " + finalScore);
console.log(typeof finalScore);`,
      bugLineNumber: 3,
      bugDescription: 'محاولة إعادة تعيين قيمة لمتغير معرّف بـ const (خزنة حديد).',
      whyItHappens:
        'المتغير finalScore تم تعريفه بكلمة const، ومعنى const إنها خزنة حديد بتتقفل على أول قيمة وبتمنع أي تغيير. في السطر الثالث حاولنا نقول finalScore = finalScore + 5، فالكمبيوتر اعترض بـ TypeError: Assignment to constant variable.',
      fixedCode: `let studentName = "Mostafa";
let finalScore = 85; // استخدمنا let عشان الدرجة بتتغير
finalScore = finalScore + 5;
console.log(studentName + " scored " + finalScore);
console.log(typeof finalScore);`,
      expectedCorrectOutput: `Mostafa scored 90
number`,
      hints: [
        'بص على السطر التاني: هل finalScore صندوق كرتون ولا خزنة حديد؟',
        'هل القيمة دي ثابتة ولا هتتغير في السطر التالت؟',
        'غيّر const إلى let علشان تسمح بتعديل القيمة.',
      ],
    },
    chapters: [
      {
        id: 1,
        partId: 1,
        partTitle: 'الجزء الأول: المتغيرات والأنواع',
        title: 'الفصل 1: مقدمة',
        subtitle: 'يعني إيه برمجة؟ وأدواتنا الـ Console والمحرر',
        summaryPoints: [
          'البرنامج وصفة بينفّذها الكمبيوتر بالترتيب، سطر ورا سطر، وبالحرف.',
          'بنكتب الكود في محرر الكود (code editor)، وبنشوف النتيجة في الـ Console.',
          'الأمر console.log("...") بيكتب نص في الـ Console.',
          'التعليق (// أو /* */) للبني آدمين بس، والكمبيوتر بيتجاهله تماماً.',
        ],
        contentSections: [
          {
            heading: 'يعني إيه برمجة؟',
            text: `فكّر في كتالوج تركيب لعبة مكعبات (ليجو). مكتوب فيه خطوات مرتبة: "ركّب القاعدة، وبعدين العجل، وبعدين السقف". لو نفّذت الخطوات بالترتيب بالظبط، شكل العربية بيطلع مظبوط. ولو غيّرت الترتيب أو نسيت خطوة، الشكل النهائي بيبوظ ومبيكملش.
البرمجة بنفس الفكرة. البرنامج (program) هو الكتالوج اللي بنكتبه للكمبيوتر، وهو بينفّذه بالحرف: خطوة ورا خطوة، من فوق لتحت، ومبيخمّنش إنت تقصد إيه. وكتابة الكتالوج ده اسمها برمجة (programming)، والخطوات المكتوبة نفسها اسمها كود (code).
الكمبيوتر مبيفهمش كلامنا العادي، فبنكتبله الكتالوج ده بلغة مخصوصة اسمها لغة برمجة (programming language). في هذا المسار بنتعلم لغة JavaScript، وهي اللغة اللي بتشتغل جوه أي متصفح.`,
          },
          {
            heading: 'أول كود في حياتك',
            text: 'ده أول أمر بيكتبه أي مبرمج في العالم:',
            codeSnippet: `console.log("Hello, world!");`,
            callout: {
              type: 'celebration',
              title: 'بااااام! 💥',
              content:
                'إنت لسه كاتب أول برنامج في حياتك ونفّذته! سطر واحد بس، والكمبيوتر عمل بالظبط اللي قلتله عليه. وكل اللي جاي في البرمجة مبني على نفس الخطوات دي.',
            },
          },
          {
            heading: 'تفصيلة صغيرة.. بس حوار! 🔍',
            text: 'لغة JavaScript بتفرّق بين الحرف الكبير والصغير (Case Sensitive). يعني console غير Console. لو كتبت Console.log بحرف C كبير، الكمبيوتر هيقولك ReferenceError: Console is not defined.',
            callout: {
              type: 'warning',
              title: 'ماتتخضش! 👻',
              content:
                'أول ما تشوف كتابة حمرا في الـ Console وفيها كلام إنجليزي كتير، قلبك بيقع؟ دي مش عقاب. دي رسالة خطأ (error message)، والكمبيوتر بيقولك فيها: "أنا وقفت هنا، وده السبب". اقرا أول سطر منها وبس، وهتلاقيها بتدلّك على الغلطة.',
            },
          },
          {
            heading: 'التعليقات (Comments)',
            text: 'أحياناً بنحب نكتب ملاحظة جوه الكود لنفسنا أو لزمايلنا. الكمبيوتر بيتجاهلها تماماً ولا ينفذها.',
            codeSnippet: `// تعليق في سطر لوحده
console.log("أهلاً"); // تعليق بعد الكود

/*
تعليق على كذا سطر
console.log("السطر ده جوه تعليق ومبيظهرش");
*/
console.log("مع السلامة");`,
          },
        ],
        exercises: [
          {
            id: 'ch1-ex1',
            title: 'التمرين 1: ترتيب التنفيذ',
            code: `console.log("A");
console.log("B");
console.log("C");`,
            expectedOutput: `A\nB\nC`,
            explanation: 'الكمبيوتر ينفذ الأوامر سطراً بسطر من الأعلى للأسفل.',
          },
          {
            id: 'ch1-ex2',
            title: 'التمرين 2: تعليق السطر',
            code: `console.log("one"); // console.log("two");
console.log("three");`,
            expectedOutput: `one\nthree`,
            explanation: 'الأمر المسبوق بعلامة // أصبح تعليقاً وتجاهله المفسر.',
          },
          {
            id: 'ch1-ex3',
            title: 'التمرين 3: تعليق متعدد الأسطر',
            code: `/*
console.log("x");
console.log("y");
*/
console.log("z");`,
            expectedOutput: `z`,
            explanation: 'الأسطر المحصورة بين /* و */ يتم تجاهلها بالكامل.',
          },
        ],
        challenge: {
          id: 'ch1-chal',
          title: 'تحدي الفصل 1: بطاقة التعارف',
          prompt: 'اكتب كود يطبع اسمك في سطر، وبلدك في سطر تاني، وهوايتك في سطر تالت، مع وضع تعليق باسمك في أول الكود.',
          hint: 'استخدم console.log ثلاث مرات مع // في أول سطر للتعليق.',
          initialCode: `// اكتب تعليقاً وأوامر الطباعة console.log هنا بنفسك...
`,
          solutionCode: `// كود تعريفي
console.log("اسمي: أحمد");
console.log("بلدي: مصر");
console.log("هوايتي: البرمجة");`,
        },
      },
      {
        id: 2,
        partId: 1,
        partTitle: 'الجزء الأول: المتغيرات والأنواع',
        title: 'الفصل 2: الحسابات والنصوص',
        subtitle: 'العمليات الرياضية، باقي القسمة (%)، ودمج النصوص',
        summaryPoints: [
          'console.log بتكتب النصوص والأرقام، وبتقبل أكتر من قيمة مفصولة بفاصلة.',
          'العوامل + - * / شغّالة بأولوية الرياضة، والأقواس بتغيّر الترتيب.',
          'العامل % بيدّي باقي القسمة، والباقي صفر معناه قسمة تامة ورقم زوجي.',
          '+ بين نصين بيلزّقهم (دمج نصوص)، وبين رقمين بيجمعهم.',
        ],
        contentSections: [
          {
            heading: 'الفرق بين الأرقام والنصوص في console.log',
            text: 'نقدر نطبع أرقام ونصوص مع بعض:',
            codeSnippet: `console.log(2026);
console.log("2026");
console.log("Result:", 8);`,
          },
          {
            heading: 'العمليات الحسابية الأساسية والأولويات',
            text: 'نستخدم + للجمع، - للطرح، * للضرب، و / للقسمة. الضرب والقسمة يسبقان الجمع والطرح، والأقواس تغير الترتيب.',
            codeSnippet: `console.log(2 + 3 * 4);     // 14
console.log((2 + 3) * 4);   // 20`,
          },
          {
            heading: 'العامل السحري: باقي القسمة % (Modulo)',
            text: 'العامل % مش نسبة مئوية! وظيفته يحسب الرقم المتبقي بعد عملية القسمة الصحيحة. مفيد جداً لمعرفة هل الرقم يقبل القسمة، وهل هو زوجي أم فردي.',
            codeSnippet: `console.log(10 % 3);   // 1
console.log(9 % 3);    // 0 (تقبل القسمة بالكامل)
console.log(7 % 2);    // 1 (فردي)
console.log(8 % 2);    // 0 (زوجي)`,
          },
          {
            heading: 'دمج النصوص (Concatenation)',
            text: 'علامة + مع النصوص لا تجمع بل تلزق الكلمات بجانب بعضها. والكمبيوتر لا يضع مسافات تلقائياً.',
            codeSnippet: `console.log("أهلاً " + "يا أحمد");
console.log(5 + 3);       // 8 (جمع أرقام)
console.log("5" + "3");   // 53 (دمج نصوص!)`,
            callout: {
              type: 'common_mistake',
              title: 'غلطة شائعة ⚠️',
              content:
                'أشهر غلطة ممكن تقع فيها هي إنك تحط الرقم بين علامتين تنصيص "5" وتستغرب ليه الجمع طلع "53" بدل 8! دايماً اسأل نفسك: دي قيمة رقمية ولا نصية؟',
            },
          },
        ],
        exercises: [
          {
            id: 'ch2-ex1',
            title: 'التمرين 1: أولويات العمليات',
            code: `console.log(4 + 6 * 2);
console.log((4 + 6) * 2);`,
            expectedOutput: `16\n20`,
            explanation: 'السطر الأول 6*2=12 ثم +4 = 16. السطر الثاني (4+6)=10 ثم *2 = 20.',
          },
          {
            id: 'ch2-ex2',
            title: 'التمرين 2: باقي القسمة',
            code: `console.log(17 % 5);
console.log(20 % 5);`,
            expectedOutput: `2\n0`,
            explanation: '17 على 5 فيها 3 ويفضل 2. أما 20 تقبل على 5 تماماً فالباقي 0.',
          },
          {
            id: 'ch2-ex3',
            title: 'التمرين 3: دمج النصوص وجمع الأرقام',
            code: `console.log("Java" + "Script");
console.log("5" + "5");
console.log(5 + 5);`,
            expectedOutput: `JavaScript\n55\n10`,
            explanation: 'النصوص تلتصق لتصبح 55 بينما الأرقام تُجمع لتصبح 10.',
          },
        ],
        challenge: {
          id: 'ch2-chal',
          title: 'وريني شطارتك 🧠: عملية ذكية',
          prompt: 'اكتب أمر console.log واحد يطبع بالظبط: "6 * 7 = 42" بس من غير ما تكتب 42 بإيدك! خلّي الكمبيوتر هو اللي يحسبها.',
          hint: 'افصل بين النص "6 * 7 =" وحاصل الضرب (6 * 7) بفاصلة أو بعلامة +.',
          initialCode: `// اكتب أمر console.log المطلوب هنا بنفسك...
`,
          solutionCode: `console.log("6 * 7 =", 6 * 7);`,
        },
      },
      {
        id: 3,
        partId: 1,
        partTitle: 'الجزء الأول: المتغيرات والأنواع',
        title: 'الفصل 3: المتغيرات',
        subtitle: 'الصندوق الكرتون (let) والخزنة الحديد (const)',
        summaryPoints: [
          'المتغيّر صندوق عليه اسم وجواه قيمة محفوظة في الذاكرة.',
          'let صندوق كرتون نقدر نغير اللي جواه في أي وقت.',
          'const خزنة حديد بنحط فيها القيمة مرة واحدة ومبتتغيرش أبداً.',
          'العلامة = معناها "حط" (إسناد Assign) وليست التساوي الرياضي.',
          'بنسمي المتغيرات بأسلوب camelCase ومبنستخدمش الكلمة القديمة var.',
        ],
        contentSections: [
          {
            heading: 'أنواع الحاويات: let وconst',
            text: `الكمبيوتر بيحتاج يفتكر بيانات معينة، زي درجة طالب أو سعر منتج. بنديله "صناديق"، ونلزق عليها اسمها:
* صندوق كرتون (let): نقدر نغير الحاجة اللي جواه في أي وقت براحتنا.
* خزنة حديد (const): بنحط فيها القيمة مرة واحدة بس ونقفل عليها ومبتتغيرش.`,
            codeSnippet: `let age = 15;
console.log(age);     // 15
console.log("age");   // age (الفرق بين اسم المتغير والنص!)`,
          },
          {
            heading: 'تغيير القيمة وعلامة =',
            text: 'العلامة = في البرمجة معناها "احسب الطرف اليمين وحطه في الصندوق الشمال".',
            codeSnippet: `let coins = 10;
coins = coins + 5;
console.log(coins);   // 15`,
            callout: {
              type: 'warning',
              title: 'تفصيلة صغيرة.. بس حوار! 🔍',
              content:
                'العلامة = معناها "إسناد"، يعني coins = coins + 5 مش معادلة مستحيلة، ده معناه: احسب 10 + 5 وحط الـ 15 في نفس الصندوق. وممنوع تكتب let لنفس المتغير مرتين!',
            },
          },
          {
            heading: 'الخزنة الحديد: const',
            text: 'لو حاولت تغير قيمة const، الكمبيوتر بيحميك فوراً ويعترض:',
            codeSnippet: `const pi = 3.14;
console.log(pi);   // 3.14
// pi = 3;  --> سيتسبب في TypeError: Assignment to constant variable`,
          },
          {
            heading: 'ليه منستخدمش var؟',
            text: 'var كانت الكلمة القديمة قبل 2015. مشكلتها إنها بتسمح بأخطاء صامتة ولا تعترض لو كررت تعريف نفس المتغير بالغلط. لذلك let وconst هما المعيار الحديث.',
          },
        ],
        exercises: [
          {
            id: 'ch3-ex1',
            title: 'التمرين 1: جمع المتغيرات',
            code: `let a = 5;
let b = a + 2;
console.log(b);`,
            expectedOutput: `7`,
            explanation: 'قيمة a هي 5، ثم b = 5 + 2 = 7.',
          },
          {
            id: 'ch3-ex2',
            title: 'التمرين 2: إعادة الإسناد',
            code: `let x = 4;
x = 9;
console.log(x);`,
            expectedOutput: `9`,
            explanation: 'الصندوق استبدل القيمة 4 بالقيمة الجديدة 9.',
          },
          {
            id: 'ch3-ex3',
            title: 'التمرين 3: الحساب التراكمي',
            code: `let n = 3;
n = n * 2;
n = n + 1;
console.log(n);`,
            expectedOutput: `7`,
            explanation: 'n*2 = 6، ثم 6+1 = 7.',
          },
        ],
        challenge: {
          id: 'ch3-chal',
          title: 'وريني شطارتك 🧠: حساب مساحة المستطيل',
          prompt: 'اكتب برنامج لمستطيل عرضه 8 وارتفاعه 5، بمتغيّر للعرض وآخر للارتفاع، واطبع مساحته بالشكل: "المساحة: 40". بعدين غيّر العرض لـ 10 واطبع المساحة تاني.',
          hint: 'فكر: مين فيهم هيتغير ويحتاج let ومين ممكن يكون const؟',
          initialCode: `// اكتب كود حساب مساحة المستطيل وتغيير العرض هنا بنفسك...
`,
          solutionCode: `let width = 8;
const height = 5;
console.log("المساحة: " + (width * height));
width = 10;
console.log("المساحة: " + (width * height));`,
        },
      },
      {
        id: 4,
        partId: 1,
        partTitle: 'الجزء الأول: المتغيرات والأنواع',
        title: 'الفصل 4: الأنواع (Data Types)',
        subtitle: 'النصوص، الأرقام، الصح والغلط (Boolean)، والتحويلات',
        summaryPoints: [
          'الأنواع الأساسية: string (نص)، number (أرقام)، boolean (صح أو غلط).',
          'typeof بتعرفنا نوع أي قيمة.',
          '== بتقارن القيمة بس، و=== بتقارن القيمة والنوع معاً (المساواة الصارمة).',
          'نستخدم دايماً === و!== ونبتعد تماماً عن == و!=.',
          'الدوال Number() و String() للتحويل بين الأنواع، وNaN تعني Not a Number.',
        ],
        contentSections: [
          {
            heading: 'الأنواع الأساسية في JavaScript',
            text: `أي قيمة بنخزنها ليها نوع (type):
1. string: نصوص بين علامتي تنصيص "أحمد".
2. number: أرقام صحيحة أو عشرية 25 و 3.5.
3. boolean: قيمتان فقط true أو false.`,
            codeSnippet: `const student = "سارة";
const grade = 95.5;
const isPassed = true;
console.log(typeof student);  // string
console.log(typeof grade);    // number
console.log(typeof isPassed); // boolean`,
          },
          {
            heading: 'المقارنة: الفرق بين == و ===',
            text: '`==` تحاول تحويل الأنواع سراً (Type Coercion)، أما `===` فتقارن بدقة متناهية القيمة والنوع معاً:',
            codeSnippet: `console.log(5 == "5");   // true (تساهل وتحويل تلقائي)
console.log(5 === "5");  // false (رقم لا يساوي نصاً!)`,
            callout: {
              type: 'tip',
              title: 'القاعدة الذهبية 🎯',
              content:
                'في لغة JavaScript الحديثة، استخدم دائماً `===` (المساواة الصارمة) و `!==` وانسَ تماماً `==` و `!=` لتجنب المفاجآت غير المتوقعة.',
            },
          },
          {
            heading: 'التحويل بين الأنواع وقيمة NaN',
            text: 'نستخدم `Number()` لتحويل النص لرقم، و `String()` للعكس:',
            codeSnippet: `const text = "25";
const num = Number(text);
console.log(num + 5); // 30

// لو حاولت تحول نص مش رقم:
console.log(Number("مرحبا")); // NaN (Not a Number)`,
          },
        ],
        exercises: [
          {
            id: 'ch4-ex1',
            title: 'التمرين 1: فحص الأنواع بـ typeof',
            code: `console.log(typeof "10");
console.log(typeof 10);
console.log(typeof (5 === 5));`,
            expectedOutput: `string\nnumber\nboolean`,
            explanation: '"10" نص، 10 رقم، ومقارنة (5===5) تنتج true ونوعها boolean.',
          },
          {
            id: 'ch4-ex2',
            title: 'التمرين 2: مقارنة == و ===',
            code: `console.log(10 == "10");
console.log(10 === "10");
console.log(10 === 10);`,
            expectedOutput: `true\nfalse\ntrue`,
            explanation: 'المساواة العادية تتجاهل النوع، بينما الصارمة === تطلب تطابق النوع.',
          },
        ],
        challenge: {
          id: 'ch4-chal',
          title: 'وريني شطارتك 🧠: فاتورة التوصيل',
          prompt: 'عندك متغير `const price = "150";` وسعر التوصيل 20 كـ `number`. اكتب كود يحوّل `price` لرقم ويجمعه مع التوصيل ويطبع الإجمالي `(170)` وليس `("15020")`.',
          hint: 'استخدم دالة `Number(price)` قبل الجمع.',
          initialCode: `// اكتب الكود لتحويل price وجمع التوصيل وطباعة الإجمالي هنا بنفسك...
`,
          solutionCode: `const price = "150";
const delivery = 20;
const total = Number(price) + delivery;
console.log("الإجمالي: " + total);`,
        },
      },
    ],
  },
  {
    id: 2,
    title: 'الجزء الثاني: القرارات (if وswitch)',
    subtitle: 'المفترق اللي الكمبيوتر بيقرر عنده',
    description: 'كيف يتخذ البرنامج قراراته الذكية بناءً على الشروط، المعاملات المنطقية (&& و|| و!)، وجملة switch المتعددة.',
    iconName: 'GitFork',
    bugHunter: {
      id: 'bug-part-2',
      partId: 2,
      title: 'كويز: switch والشرط المنطقي التائه',
      context: 'الكود ده المفروض يحدد نسبة الخصم لمشتريات بقيمة 300 جنيه، لكن لما نشغله هيطبع "مفيش خصم" بالرغم إنها أكثر من 200!',
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
      bugDescription: 'وضع شروط علائقية boolean داخل case بينما switch تفحص القيمة 300 مباشرة.',
      whyItHappens:
        'في switch (total)، المتغير total قيمته رقمية (300). أما الشروط مثل total >= 500 ترجع boolean (false). المقارنة الصارمة بتفحص هل 300 === false؟ لا! هل 300 === true؟ لا! فيذهب للـ default! بالإضافة لنسيان break في الـ case الأول.',
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
        'هل جملة switch مصممة للمقارنات الأكبر والأصغر (> و <) أم للقيم الثابتة المحددة؟',
        'ناتج total >= 200 هو true، فهل 300 تساوي true؟',
        'الحل الصحيح والأنظف لمثل هذه المقارنات هو استخدام if و else if.',
      ],
    },
    chapters: [
      {
        id: 5,
        partId: 2,
        partTitle: 'الجزء الثاني: القرارات (if وswitch)',
        title: 'الفصل 5: الشروط (if وelse)',
        subtitle: 'لو كذا يحصل كذا، وغير كده يحصل البديل',
        summaryPoints: [
          'if بتنفذ الكود فقط لو الشرط بين القوسين true.',
          'else بتوفر المسار البديل لو كان الشرط false.',
          'else if بتسمح بفحص احتمالات متعددة بالترتيب من الأعلى للأسفل.',
          'الكمبيوتر يتوقف فور تحقق أول شرط صحيح ويتجاهل الباقي.',
        ],
        contentSections: [
          {
            heading: 'بنية جملة if',
            text: 'الشرط يوضع بين قوسين ( )، والكود المنفذ يوضع بين قوسين معقوصين { }:',
            codeSnippet: `const age = 20;
if (age >= 18) {
  console.log("تقدر تعمل رخصة قيادة");
}`,
          },
          {
            heading: 'المسار البديل: else و else if',
            text: 'لو الشرط لم يتحقق، يذهب الكمبيوتر للبدائل بالترتيب:',
            codeSnippet: `const score = 72;
if (score >= 85) {
  console.log("ممتاز");
} else if (score >= 65) {
  console.log("جيد");
} else {
  console.log("محتاج مذاكرة أكتر");
}`,
            callout: {
              type: 'warning',
              title: 'تفصيلة صغيرة.. بس حوار! 🔍',
              content:
                'ترتيب الشروط مهم جداً! لو وضعت شرط score >= 50 قبل score >= 85، الطالب الذي حصل على 95 سيدخل في الشرط الأول ويتوقف ولن يصل لممتاز أبداً. رتب دائماً من الأضيق والأعلى إلى الأوسع.',
            },
          },
        ],
        exercises: [
          {
            id: 'ch5-ex1',
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
            id: 'ch5-ex2',
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
            explanation: 'الدرجة 65 تحقق شرط (grade >= 65) فتطبع "جيد" وتقف.',
          },
        ],
        challenge: {
          id: 'ch5-chal',
          title: 'وريني شطارتك 🧠: رادار السرعة',
          prompt: 'اكتب كود بمتغير const speed = 95. لو السرعة أكبر من 100 اطبع "غرامة سرعة"، لو أكبر من 80 اطبع "خد بالك"، غير كده اطبع "سرعة عادية".',
          hint: 'رتب الشروط: الأكبر من 100 أولاً ثم الأكبر من 80.',
          initialCode: `// اكتب كود فحص السرعة باستخدام if و else if هنا بنفسك...
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
        id: 6,
        partId: 2,
        partTitle: 'الجزء الثاني: القرارات (if وswitch)',
        title: 'الفصل 6: المقارنات والمعاملات المنطقية',
        subtitle: 'بوابة القطار: AND (&&)، OR (||)، و NOT (!)',
        summaryPoints: [
          'علامات المقارنة: > < >= <= === !==',
          '&& (AND) تشترط تحقق جميع الشروط معاً لتعطي true.',
          '|| (OR) يكفيها تحقق شرط واحد فقط على الأقل.',
          '! (NOT) تقلب القيمة (تغير true لـ false والعكس).',
        ],
        contentSections: [
          {
            heading: 'تشبيه بوابة القطار الذكية',
            text: 'البوابة لن تفتح لمجرد امتلاكك التذكرة وحدها، ولن تفتح لمجرد وصولك في الوقت المحدد وحده. يجب أن يتحقق الشرطان معاً في نفس اللحظة (&&).',
            codeSnippet: `const hasTicket = true;
const isOnTime = true;
console.log(hasTicket && isOnTime); // true

const hasCash = false;
const hasCard = true;
console.log(hasCash || hasCard);    // true (يكفي وسيلة دفع واحدة)`,
          },
          {
            heading: 'المعامل المنطقي العاكس: NOT (!)',
            text: 'نستخدم ! للتحقق من عدم حدوث شيء معين أو عكس الحالة المنطقية:',
            codeSnippet: `const isLoggedIn = false;
if (!isLoggedIn) {
  console.log("سجّل دخولك الأول");
}`,
          },
        ],
        exercises: [
          {
            id: 'ch6-ex1',
            title: 'التمرين 1: فحص الاختلاف الصارم !==',
            code: `console.log(7 !== 7);
console.log(7 !== "7");`,
            expectedOutput: `false\ntrue`,
            explanation: '7 و 7 متطابقان تماماً فـ !== ترجع false. أما 7 و "7" يختلفان في النوع فترجع true.',
          },
          {
            id: 'ch6-ex2',
            title: 'التمرين 2: فحص الشروط المشتركة',
            code: `const hasWifi = true;
const hasCoffee = false;
console.log(hasWifi && hasCoffee);
console.log(hasWifi || hasCoffee);`,
            expectedOutput: `false\ntrue`,
            explanation: 'مع && لازم الاتنين صح فينتج false. مع || يكفي الواي فاي فينتج true.',
          },
        ],
        challenge: {
          id: 'ch6-chal',
          title: 'وريني شطارتك 🧠: قطار الملاهي',
          prompt: 'اكتب شرطاً واحداً يطبع "تقدر تركب اللعبة" فقط إذا كان الطول height >= 140 والعمر age >= 10.',
          hint: 'استخدم علامة && لربط الشرطين معاً.',
          initialCode: `// اكتب شرط فحص الطول height والعمر age هنا بنفسك...
`,
          solutionCode: `const height = 150;
const age = 12;
if (height >= 140 && age >= 10) {
  console.log("تقدر تركب اللعبة");
}`,
        },
      },
      {
        id: 7,
        partId: 2,
        partTitle: 'الجزء الثاني: القرارات (if وswitch)',
        title: 'الفصل 7: جملة switch',
        subtitle: 'قائمة الاختيارات المنظمة، وحذارِ من الـ fall-through!',
        summaryPoints: [
          'switch مناسبة جداً لمقارنة متغير واحد بعدة قيم محددة وثابتة.',
          'كل case تحتاج أمر break; وإلا سيستمر التنفيذ لما بعدها (fall-through).',
          'default تمثل المسار الافتراضي إذا لم تتطابق أي حالة.',
        ],
        contentSections: [
          {
            heading: 'متى نستخدم switch؟',
            text: 'لو عندك مقارنة لنفس المتغير بعدة قيم محددة (مثل أيام الأسبوع، اختيار من قائمة)، switch تكون أنظف وأقصر من كتابة if و else if مكررة.',
            codeSnippet: `const day = 3;
switch (day) {
  case 1:
    console.log("السبت");
    break;
  case 2:
    console.log("الأحد");
    break;
  case 3:
    console.log("الاتنين");
    break;
  default:
    console.log("يوم مش معروف");
}`,
            callout: {
              type: 'warning',
              title: 'تفصيلة صغيرة.. بس حوار! 🔍',
              content:
                'لو نسيت وضع كلمة break; فالكمبيوتر لن يتوقف عند الحالة المتطابقة، بل سيكمل تنفيذاً للحالات التالية رغماً عنها! هذا السلوك يسمى fall-through.',
            },
          },
        ],
        exercises: [
          {
            id: 'ch7-ex1',
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
            id: 'ch7-ex2',
            title: 'التمرين 2: تجربة الـ fall-through',
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
            explanation: 'لأن case 2 لا تحتوي على break، أكمل التنفيذ ونفذ case 3 أيضاً!',
          },
        ],
        challenge: {
          id: 'ch7-chal',
          title: 'وريني شطارتك 🧠: محول الأشهر',
          prompt: 'اكتب جملة switch لمتغير const month = 3؛ يطبع: 1 = "يناير"، 2 = "فبراير"، 3 = "مارس"، وغير ذلك "شهر مش معروف". لا تنسَ break!',
          hint: 'ضع break بعد كل شهر، و default في النهاية.',
          initialCode: `// اكتب جملة switch لفحص رقم الشهر month هنا بنفسك...
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
    ],
  },
  {
    id: 3,
    title: 'الجزء الثالث: التكرار (الحلقات)',
    subtitle: 'السير الدوّار اللي بيكرر الشغلانة',
    description: 'توفير المجهود وتكرار العمليات عبر حلقة for وحلقة while وتجنب خطر الحلقات اللانهائية.',
    iconName: 'Repeat',
    bugHunter: {
      id: 'bug-part-3',
      partId: 3,
      title: 'كويز: فخ الحلقة اللانهائية',
      context: 'الكود ده المفروض يطبع الأرقام الزوجية من 1 لـ 10، لكن لما بتشغله المتصفح بيهنج ومش بيوقف خالص!',
      problemCode: `let n = 1;
while (n <= 10) {
  if (n % 2 === 0) {
    console.log(n);
  }
}`,
      bugLineNumber: 2,
      bugDescription: 'نسيان زيادة عداد الحلقة n++ في كل دورة، مما يجعل n تساوي 1 دائماً.',
      whyItHappens:
        'العداد n بدأ بقيمة 1، والشرط n <= 10 يظل صحيحاً دائماً لأن قيمة n لا تزيد أبداً داخل الحلقة! بالتالي تدور الحلقة للأبد (Infinite Loop) وتستهلك المعالج حتى يتجمد المتصفح.',
      fixedCode: `let n = 1;
while (n <= 10) {
  if (n % 2 === 0) {
    console.log(n);
  }
  n++; // زيادة العداد في كل دورة
}`,
      expectedCorrectOutput: `2\n4\n6\n8\n10`,
      hints: [
        'هل قيمة n تتغير في كل لفة داخل حلقة while؟',
        'إذا لم تزد n، هل سيصبح شرط (n <= 10) خطأ في أي لحظة؟',
        'أضف السطر n++; في نهاية الحلقة.',
      ],
    },
    chapters: [
      {
        id: 8,
        partId: 3,
        partTitle: 'الجزء الثالث: التكرار (الحلقات)',
        title: 'الفصل 8: حلقة for',
        subtitle: 'العداد المنظم: بداية، شرط، وزيادة في سطر واحد',
        summaryPoints: [
          'for تكرر الكود لعدد محدد ومعروف مسبقاً من المرات.',
          'تتكون من 3 أجزاء: البداية (let i = 1)، الشرط (i <= 5)، والزيادة (i++).',
          'i++ هي اختصار لكتابة i = i + 1.',
          'الفرق بين < و <= يحدد عدد مرات التكرار بدقة.',
        ],
        contentSections: [
          {
            heading: 'تشبيه سير المصنع',
            text: 'بدل ما تكتب console.log مئة مرة بإيدك، حلقة for تشبه سيراً يكرر المهمة بعداد دقيق:',
            codeSnippet: `for (let i = 1; i <= 5; i++) {
  console.log("مرة " + i);
}`,
            callout: {
              type: 'tip',
              title: 'ماتتخضش! 👻',
              content:
                'الرموز (let i = 0; i < 5; i++) ليست تعويذة سحرية! إنها مجرد: ابدأ من 0، واستمر طول ما إنت أقل من 5، وزوّد خطوة في كل لفة.',
            },
          },
          {
            heading: 'العد التنازلي والحسابات داخل الحلقة',
            text: 'يمكن استخدام i في العمليات الحسابية أو حتى العد للخلف باستخدام i--:',
            codeSnippet: `for (let i = 5; i >= 1; i--) {
  console.log(i + " ثواني متبقية...");
}`,
          },
        ],
        exercises: [
          {
            id: 'ch8-ex1',
            title: 'التمرين 1: خطوات متتالية',
            code: `for (let i = 1; i <= 3; i++) {
  console.log("خطوة " + i);
}`,
            expectedOutput: `خطوة 1\nخطوة 2\nخطوة 3`,
            explanation: 'العداد يدور 3 دورات بقيم 1، 2، 3.',
          },
          {
            id: 'ch8-ex2',
            title: 'التمرين 2: البدء من الصفر',
            code: `for (let i = 0; i < 4; i++) {
  console.log(i);
}`,
            expectedOutput: `0\n1\n2\n3`,
            explanation: 'يبدأ من 0 ويتوقف قبل 4 مباشرة.',
          },
        ],
        challenge: {
          id: 'ch8-chal',
          title: 'وريني شطارتك 🧠: جدول المربعات',
          prompt: 'اكتب حلقة for تطبع الأرقام من 1 لـ 5 مع مربع كل رقم بالشكل: "مربعه: 1"، "مربعه: 4"، إلخ.',
          hint: 'اضرب i في نفسه: (i * i).',
          initialCode: `// اكتب حلقة for لطباعة الأرقام ومربعاتها هنا بنفسك...
`,
          solutionCode: `for (let i = 1; i <= 5; i++) {
  console.log("مربعه: " + (i * i));
} `,
        },
      },
      {
        id: 9,
        partId: 3,
        partTitle: 'الجزء الثالث: التكرار (الحلقات)',
        title: 'الفصل 9: حلقة while',
        subtitle: 'كرر الشغلانة "طول ما" الشرط متحقق',
        summaryPoints: [
          'while مناسبة عندما يكون عدد المرات غير معروف مسبقاً ويتوقف على تحقق شرط معين.',
          'العداد يتم تعريفه قبل الحلقة، والزيادة نكتبها يدوياً داخلها.',
          'نسيان زيادة العداد يسبب تجميد الصفحة في حلقة لانهائية.',
          'استخدام % 2 يكشف الأرقام الزوجية والفردية بسهولة داخل الحلقات.',
        ],
        contentSections: [
          {
            heading: 'متى نفضل while على for؟',
            text: 'لو عارف عدد المرات بالضبط (5 مرات) استخدم for. لو مش عارف عدد المرات وتنتظر حدوث شرط معين (مثل استنزاف رصيد) استخدم while:',
            codeSnippet: `let balance = 1000;
let months = 0;
while (balance > 0) {
  balance = balance - 250;
  months++;
}
console.log("هياخد " + months + " شهور عشان يخلص");`,
          },
          {
            heading: 'دمج while مع فحص الزوجي والفردي',
            text: 'نربط الحلقة بشرط if وباقي القسمة % 2:',
            codeSnippet: `let n = 1;
while (n <= 4) {
  if (n % 2 === 0) {
    console.log(n + " زوجي");
  } else {
    console.log(n + " فردي");
  }
  n++;
}`,
          },
        ],
        exercises: [
          {
            id: 'ch9-ex1',
            title: 'التمرين 1: عد تنازلي بـ while',
            code: `let i = 3;
while (i > 0) {
  console.log(i);
  i--;
}`,
            expectedOutput: `3\n2\n1`,
            explanation: 'يطبع 3 ثم 2 ثم 1 ويتوقف عندما تصبح i مساوية للصفر.',
          },
          {
            id: 'ch9-ex2',
            title: 'التمرين 2: جمع الأرقام المتتالية',
            code: `let total = 0;
let i = 1;
while (i <= 4) {
  total = total + i;
  i++;
}
console.log(total);`,
            expectedOutput: `10`,
            explanation: '1 + 2 + 3 + 4 = 10.',
          },
        ],
        challenge: {
          id: 'ch9-chal',
          title: 'وريني شطارتك 🧠: عداد العملات الزوجية',
          prompt: 'اكتب حلقة while تبدأ من let coins = 5؛ وكل دورة تزود coins بواحد وتطبع بجانبها "زوجي" أو "فردي" حتى تصل لـ 8.',
          hint: 'افحص (coins % 2 === 0) داخل الحلقة ولا تنسَ coins++.',
          initialCode: `// اكتب حلقة while من coins = 5 حتى 8 مع فحص الزوجي والفردي هنا بنفسك...
`,
          solutionCode: `let coins = 5;
while (coins <= 8) {
  if (coins % 2 === 0) {
    console.log(coins + " زوجي");
  } else {
    console.log(coins + " فردي");
  }
  coins++;
}`,
        },
      },
    ],
  },
  {
    id: 4,
    title: 'الجزء الرابع: الدوال',
    subtitle: 'الخلّاط اللي بنستخدمه كل مرة',
    description: 'تنظيم الكود وإعادة استخدامه عبر الدوال، المدخلات (Parameters)، القيمة المرتجعة (return)، والنطاق (Scope)، ومشروع لعبة التخمين.',
    iconName: 'Cpu',
    bugHunter: {
      id: 'bug-part-4',
      partId: 4,
      title: 'كويز: لغز الخصم التائه (الطباعة أم الإرجاع؟)',
      context: 'الكود ده المفروض يحسب سعر المنتج بعد الخصم ويفحص لو كان العرض قوياً، لكنه بيطبع "عرض عادي" دائماً حتى لو كان الخصم كبيراً!',
      problemCode: `function applyDiscount(price, discountPercent) {
  const discountAmount = price * discountPercent / 100;
  console.log(price - discountAmount);
}

const finalPrice = applyDiscount(200, 10);

if (finalPrice < 150) {
  console.log("عرض قوي");
} else {
  console.log("عرض عادي");
}`,
      bugLineNumber: 3,
      bugDescription: 'الدالة قامت بطباعة السعر بـ console.log بدلاً من إرجاعه بـ return، فكانت قيمة finalPrice هي undefined.',
      whyItHappens:
        'الدالة التي لا تحتوي على كلمة return ترجع تلقائياً undefined. المتغير finalPrice استقبل undefined، ومقارنة undefined < 150 تنتج false، فيذهب الكود لـ else دائماً!',
      fixedCode: `function applyDiscount(price, discountPercent) {
  const discountAmount = price * discountPercent / 100;
  return price - discountAmount; // رجّع القيمة للمستدعي!
}

const finalPrice = applyDiscount(200, 50); // خصم 50% = 100

if (finalPrice < 150) {
  console.log("عرض قوي");
} else {
  console.log("عرض عادي");
}`,
      expectedCorrectOutput: `عرض قوي`,
      hints: [
        'ما هي قيمة المتغير finalPrice بعد استدعاء الدالة؟',
        'هل الدالة تستخدم return أم فقط console.log؟',
        'استبدل console.log داخل الدالة بكلمة return.',
      ],
    },
    chapters: [
      {
        id: 10,
        partId: 4,
        partTitle: 'الجزء الرابع: الدوال',
        title: 'الفصل 10: الدوال الجاهزة (Math)',
        subtitle: 'التقريب والأرقام العشوائية مع Math',
        summaryPoints: [
          'الدالة مثل خلاط العصير: مدخلات (فاكهة) -> تشغيل -> ناتج (عصير).',
          'Math.round() تقرب لأقرب عدد صحيح.',
          'Math.floor() تقطع الكسور وتقرب للأسفل دائماً.',
          'Math.random() تعطي رقماً عشوائياً بين 0 و 1.',
        ],
        contentSections: [
          {
            heading: 'دوال التقريب: Math.round و Math.floor',
            text: 'Math.round تنظر للجزء العشري (لو 0.5 فأكثر تقرب للأعلى)، بينما Math.floor تقطع الكسر دائماً للأسفل:',
            codeSnippet: `console.log(Math.round(4.3)); // 4
console.log(Math.round(4.7)); // 5
console.log(Math.floor(7.99)); // 7`,
          },
          {
            heading: 'صناعة حجر نرد برقم عشوائي',
            text: 'دمج Math.random مع Math.floor يتيح توليد أرقام صحيحة في أي نطاق نريده:',
            codeSnippet: `// حجر نرد من 1 إلى 6:
const dice = Math.floor(Math.random() * 6) + 1;
console.log("الرقم العشوائي:", dice);`,
          },
        ],
        exercises: [
          {
            id: 'ch10-ex1',
            title: 'التمرين 1: تجربة التقريب',
            code: `console.log(Math.round(2.4));
console.log(Math.round(2.6));`,
            expectedOutput: `2\n3`,
            explanation: '2.4 أقرب لـ 2، و 2.6 أقرب لـ 3.',
          },
          {
            id: 'ch10-ex2',
            title: 'التمرين 2: أرضية الأرقام بـ floor',
            code: `console.log(Math.floor(9.99));
console.log(Math.floor(9.01));`,
            expectedOutput: `9\n9`,
            explanation: 'floor تقطع الكسر وتعود للعدد 9 في الحالتين.',
          },
        ],
        challenge: {
          id: 'ch10-chal',
          title: 'وريني شطارتك 🧠: مولد بطاقات من 1 إلى 10',
          prompt: 'اكتب كود يولد رقماً عشوائياً صحيحاً بين 1 و 10 ويطبعه في الـ console.',
          hint: 'استخدم Math.floor(Math.random() * 10) + 1.',
          initialCode: `// اكتب كود توليد وطباعة رقم عشوائي صحيح من 1 لـ 10 هنا بنفسك...
`,
          solutionCode: `const random10 = Math.floor(Math.random() * 10) + 1;
console.log(random10);`,
        },
      },
      {
        id: 11,
        partId: 4,
        partTitle: 'الجزء الرابع: الدوال',
        title: 'الفصل 11: كتابة دالة (Functions)',
        subtitle: 'تصميم الخلاط الخاص بك واستدعاؤه',
        summaryPoints: [
          'تعريف الدالة (function) وتصميمها خطوة منفصلة عن استدعائها (call).',
          'الـ parameters صناديق مدخلات فاضية في التعريف.',
          'الـ arguments هي القيم الفعلية التي نمررها عند الاستدعاء.',
          'يمكن استدعاء نفس الدالة عدة مرات بمدخلات مختلفة.',
        ],
        contentSections: [
          {
            heading: 'التعريف والاستدعاء',
            text: 'الدالة لا تنفذ كودها بمجرد كتابتها، بل تنتظر أن تنادي عليها بالقوسين ():',
            codeSnippet: `function greet() {
  console.log("أهلاً بيك في الكورس");
}

greet(); // هنا فقط يتم التنفيذ!`,
          },
          {
            heading: 'تمرير المدخلات (Parameters)',
            text: 'المدخلات تجعل الدالة مرنة وذكية:',
            codeSnippet: `function introduce(name, age) {
  console.log("اسمي " + name + " وعندي " + age + " سنة");
}

introduce("سارة", 16);
introduce("عمر", 18);`,
          },
        ],
        exercises: [
          {
            id: 'ch11-ex1',
            title: 'التمرين 1: استدعاء متكرر',
            code: `function sayBye() {
  console.log("مع السلامة");
}
sayBye();
sayBye();`,
            expectedOutput: `مع السلامة\nمع السلامة`,
            explanation: 'تم استدعاء الدالة مرتين متتاليتين.',
          },
          {
            id: 'ch11-ex2',
            title: 'التمرين 2: دالة المربع',
            code: `function square(n) {
  console.log(n * n);
}
square(3);
square(7);`,
            expectedOutput: `9\n49`,
            explanation: '3*3=9 ثم 7*7=49.',
          },
        ],
        challenge: {
          id: 'ch11-chal',
          title: 'وريني شطارتك 🧠: حاسبة إجمالي الفاتورة',
          prompt: 'اكتب دالة اسمها calculateTotal بمدخلين: price و quantity. تطبع الإجمالي بالشكل: "الإجمالي: 150". نادِ عليها بـ 50 و 3.',
          hint: 'اضرب المدخلين واطبع الناتج المدمج بالنص.',
          initialCode: `// عرّف دالة calculateTotal بمدخلين واستدعها هنا بنفسك...
`,
          solutionCode: `function calculateTotal(price, quantity) {
  console.log("الإجمالي: " + (price * quantity));
}

calculateTotal(50, 3);`,
        },
      },
      {
        id: 12,
        partId: 4,
        partTitle: 'الجزء الرابع: الدوال',
        title: 'الفصل 12: إرجاع القيم (return)',
        subtitle: 'الفرق الحاسم بين أن تطبع في الشاشة وأن تُرجع ناتجاً للمستدعي',
        summaryPoints: [
          'return تعيد ناتج الدالة إلى المكان الذي نادى عليها لاستخدامه في متغيرات أو شروط أخرى.',
          'الدالة بدون return تعيد undefined تلقائياً حتى لو كان بداخلها console.log.',
          'كلمة return توقف تنفيذ الدالة فوراً وأي كود بعدها يتم تجاهله.',
        ],
        contentSections: [
          {
            heading: 'لماذا نحتاج return؟',
            text: 'الطباعة بـ console.log تعرض فقط على الشاشة، أما return فتعطينا القيمة لنستخدمها في حسابات لاحقة:',
            codeSnippet: `function add(a, b) {
  return a + b;
}

const result = add(3, 4);
console.log(result * 10); // 70! نجحنا في استخدام الناتج`,
          },
          {
            heading: 'return توقف الدالة فوراً',
            text: 'أي سطر بعد return لا ينفذ أبداً:',
            codeSnippet: `function checkAge(age) {
  if (age >= 18) {
    return "مسموح";
  }
  return "ممنوع";
}

console.log(checkAge(20)); // مسموح
console.log(checkAge(15)); // ممنوع`,
          },
        ],
        exercises: [
          {
            id: 'ch12-ex1',
            title: 'التمرين 1: الدالة بدون return ترجع undefined',
            code: `function multiply(a, b) {
  console.log(a * b);
}
const result = multiply(4, 5);
console.log(result);`,
            expectedOutput: `20\nundefined`,
            explanation: 'السطر الأول طبع 20 داخل الدالة، ثم طبع undefined لأن result لم تستلم return.',
          },
          {
            id: 'ch12-ex2',
            title: 'التمرين 2: شروط مع return',
            code: `function getGrade(score) {
  if (score >= 50) return "ناجح";
  return "راسب";
}
console.log(getGrade(70));
console.log(getGrade(30));`,
            expectedOutput: `ناجح\nراسب`,
            explanation: 'تم إرجاع النص المناسب لكل درجة.',
          },
        ],
        challenge: {
          id: 'ch12-chal',
          title: 'وريني شطارتك 🧠: فاحص الأرقام الزوجية',
          prompt: 'اكتب دالة اسمها isEven بمدخل number، ترجع true لو زوجي و false لو فردي، واطبع ناتج استدعائها للرقمين 4 و 7.',
          hint: 'return (number % 2 === 0);',
          initialCode: `// اكتب دالة isEven بمدخل number واستدعها بالقيمتين 4 و 7 هنا بنفسك...
`,
          solutionCode: `function isEven(number) {
  return number % 2 === 0;
}

console.log(isEven(4));
console.log(isEven(7));`,
        },
      },
      {
        id: 13,
        partId: 4,
        partTitle: 'الجزء الرابع: الدوال',
        title: 'الفصل 13: نطاق المتغيرات (Scope)',
        subtitle: 'المحلي داخل الخلاط مقابل العالمي المفتوح للجميع',
        summaryPoints: [
          'المتغير المعرف داخل دالة محلي (local) ولا يراه أحد خارجها.',
          'محاولة استدعاء متغير محلي من الخارج تسبب ReferenceError: is not defined.',
          'المتغير المعرف خارج أي دالة عالمي (global) ومتاح لجميع الدوال.',
          'الـ scope يحمي الدوال من التصادم واستخدام نفس الأسماء بأمان.',
        ],
        contentSections: [
          {
            heading: 'المتغير المحلي وحرمة الدالة',
            text: 'ما يحدث داخل الدالة يبقى داخل الدالة:',
            codeSnippet: `function greet() {
  const message = "أهلاً بيك";
  console.log(message);
}

greet();
// console.log(message); --> ReferenceError: message is not defined`,
          },
          {
            heading: 'المتغير العالمي (Global)',
            text: 'المتغير الذي يعرف خارج أي دالة يكون متاحاً للكل:',
            codeSnippet: `const storeName = "سوبر ماركت الأمانة";

function welcome() {
  console.log("أهلاً في " + storeName);
}

welcome();`,
          },
        ],
        exercises: [
          {
            id: 'ch13-ex1',
            title: 'التمرين 1: استقلال الدوال بنفس الاسم',
            code: `function stepOne() {
  const value = 1;
  console.log(value);
}
function stepTwo() {
  const value = 2;
  console.log(value);
}
stepOne();
stepTwo();`,
            expectedOutput: `1\n2`,
            explanation: 'كل دالة لديها نطاقها الخاص ولا يوجد أي تصادم بين المتغيرين.',
          },
        ],
        challenge: {
          id: 'ch13-chal',
          title: 'وريني شطارتك 🧠: مساحة المستطيل المعزولة',
          prompt: 'اكتب دالة calculateArea بمدخلين width و height، وتنشئ متغيراً محلياً area وترجعه، ثم استدعها واطبع الناتج.',
          hint: 'const area = width * height; return area;',
          initialCode: `// اكتب دالة calculateArea بمتغير محلي area واستدعها هنا بنفسك...
`,
          solutionCode: `function calculateArea(width, height) {
  const area = width * height;
  return area;
}

console.log(calculateArea(5, 4));`,
        },
      },
      {
        id: 14,
        partId: 4,
        partTitle: 'الجزء الرابع: الدوال',
        title: 'الفصل 14: مشروع صغير — لعبة تخمين رقم',
        subtitle: 'تجميع المتغيرات، الدوال، الحلقات، والمدخلات في لعبة متكاملة',
        summaryPoints: [
          'prompt() تأخذ إدخال المستخدم كنص، ونحوله بـ Number().',
          'Math.random() و Math.floor() تختار الرقم السري.',
          'حلقة while تكرر السؤال طالما اللاعب لم يخمن الرقم بعد.',
          'دالة checkGuess تفحص وتوجه اللاعب (أكبر، أصغر، صح).',
        ],
        contentSections: [
          {
            heading: 'اللعبة كاملة',
            text: 'هذا المشروع يدمج كل ما تعلمناه في الأجزاء الأربعة الأولى في كود حقيقي تفاعلي:',
            codeSnippet: `function checkGuess(guess, secret) {
  if (guess === secret) {
    return "صح";
  } else if (guess > secret) {
    return "أكبر من اللازم";
  } else {
    return "أصغر من اللازم";
  }
}

// تشغيل جولة تجريبية افتراضية:
const secret = 42;
const testGuesses = [20, 50, 42];

for (const g of testGuesses) {
  const res = checkGuess(g, secret);
  console.log("تخمين: " + g + " -> " + res);
}`,
            callout: {
              type: 'celebration',
              title: 'بااااام! 💥',
              content:
                'اتفرج على اللي عملته: متغيرات تحفظ الحالة، دالة ترجع قرار، حلقة تكرر، وشروط تفحص المنطق! ده أول برنامج كامل حقيقي تبنيه.',
            },
          },
        ],
        exercises: [
          {
            id: 'ch14-ex1',
            title: 'التمرين 1: تجربة دالة الفحص',
            code: `function check(g, s) {
  if (g === s) return "فائز";
  return g > s ? "عالي" : "منخفض";
}
console.log(check(10, 20));
console.log(check(25, 20));
console.log(check(20, 20));`,
            expectedOutput: `منخفض\nعالي\nفائز`,
            explanation: 'الدالة تقارن وتوجه اللاعب خطوة بخطوة.',
          },
        ],
        challenge: {
          id: 'ch14-chal',
          title: 'وريني شطارتك 🧠: فحص القرب الشديد',
          prompt: 'عدل دالة التخمين بحيث ترجع "قريب جداً!" إذا كان الفرق بين التخمين والرقم السري 5 أو أقل، و"صح" لو متطابق.',
          hint: 'استخدم Math.abs(guess - secret) <= 5.',
          initialCode: `// اكتب دالة smartCheck(guess, secret) لفحص القرب الشديد واختبرها هنا بنفسك...
`,
          solutionCode: `function smartCheck(guess, secret) {
  if (guess === secret) return "صح";
  if (Math.abs(guess - secret) <= 5) return "قريب جداً!";
  return guess > secret ? "كبير" : "صغير";
}

console.log(smartCheck(48, 50));
console.log(smartCheck(50, 50));`,
        },
      },
    ],
  },
  {
    id: 5,
    title: 'الجزء الخامس: المصفوفات',
    subtitle: 'الرف اللي بنرتب عليه البيانات',
    description: 'المصفوفات (Arrays)، الفهرس المبدئي من الصفر، خاصية length، التكرار بـ for..of، وعمليات push وpop وincludes.',
    iconName: 'Layers',
    bugHunter: {
      id: 'bug-part-5',
      partId: 5,
      title: 'كويز: فخ الـ Index و undefined في المصفوفة',
      context: 'الكود ده المفروض يطبع 4 أسماء في المصفوفة، لكنه في النهاية بيطبع undefined إضافية!',
      problemCode: `const names = ["ندى", "كريم", "ياسمين", "طارق"];

for (let i = 0; i <= names.length; i++) {
  console.log(names[i]);
}`,
      bugLineNumber: 3,
      bugDescription: 'استخدام i <= names.length بدلاً من i < names.length.',
      whyItHappens:
        'طول المصفوفة names هو 4، لكن الـ index يبدأ من 0 وينتهي عند 3. عند استخدام <= ستصل قيمة i إلى 4، والعنصر names[4] غير موجود، فيرجع الكمبيوتر undefined!',
      fixedCode: `const names = ["ندى", "كريم", "ياسمين", "طارق"];

for (let i = 0; i < names.length; i++) {
  console.log(names[i]);
}`,
      expectedCorrectOutput: `ندى\nكريم\nياسمين\nطارق`,
      hints: [
        'المصفوفة فيها 4 عناصر، ما هو آخر index متاح؟',
        'ماذا يحدث عندما يحاول الكود قراءة names[4]؟',
        'استبدل <= بـ <.',
      ],
    },
    chapters: [
      {
        id: 15,
        partId: 5,
        partTitle: 'الجزء الخامس: المصفوفات',
        title: 'الفصل 15: المصفوفات (1) — الرف المرقّم',
        subtitle: 'تخزين عدة قيم في متغير واحد، والفهرسة من الصفر',
        summaryPoints: [
          'المصفوفة [ ] تحفظ قائمة من القيم بالترتيب.',
          'الـ index يبدأ دائماً من 0 وليس من 1.',
          'خاصية length تعطي عدد العناصر.',
          'آخر عنصر في أي مصفوفة مكانه array[array.length - 1].',
        ],
        contentSections: [
          {
            heading: 'تشبيه الرف المقسم',
            text: 'بدل تعريف 30 متغيراً لـ 30 طالباً، نضعهم في مصفوفة واحدة ذات أماكن مرقمة:',
            codeSnippet: `const students = ["أحمد", "سارة", "عمر"];
console.log(students[0]); // أحمد (أول عنصر يبدأ بصفر)
console.log(students[1]); // سارة
console.log(students.length); // 3 (طول المصفوفة)`,
            callout: {
              type: 'tip',
              title: 'تفصيلة صغيرة.. بس حوار! 🔍',
              content:
                'الـ index في المصفوفات يبدأ من صفر! لو مصفوفة فيها 3 عناصر، عناصرها هي [0] و [1] و [2]. لو طلبت [3] ستأخذ undefined لأن الرف ليس به مكان بهذا الرقم.',
            },
          },
        ],
        exercises: [
          {
            id: 'ch15-ex1',
            title: 'التمرين 1: فحص الـ Index والطول',
            code: `const fruits = ["موز", "تفاح", "مانجو", "عنب"];
console.log(fruits[2]);
console.log(fruits.length);`,
            expectedOutput: `مانجو\n4`,
            explanation: 'العنصر رقم 2 هو مانجو (موز 0، تفاح 1، مانجو 2)، والطول الإجمالي 4.',
          },
          {
            id: 'ch15-ex2',
            title: 'التمرين 2: الوصول لآخر عنصر',
            code: `const numbers = [10, 20, 30];
console.log(numbers[numbers.length - 1]);`,
            expectedOutput: `30`,
            explanation: 'numbers[3 - 1] = numbers[2] وهو 30.',
          },
        ],
        challenge: {
          id: 'ch15-chal',
          title: 'وريني شطارتك 🧠: حسابات درجات الطلاب',
          prompt: 'عندك مصفوفة const grades = [88, 65, 92, 40, 77];. اطبع أول عنصر، وآخر عنصر بـ length، ومجموعهما معاً.',
          hint: 'grades[0] و grades[grades.length - 1].',
          initialCode: `// اكتب كود قراءة أول وآخر عنصر وجمع درجاتهما هنا بنفسك...
`,
          solutionCode: `const grades = [88, 65, 92, 40, 77];
const first = grades[0];
const last = grades[grades.length - 1];
console.log("الأول: " + first);
console.log("الأخير: " + last);
console.log("مجموعهما: " + (first + last));`,
        },
      },
      {
        id: 16,
        partId: 5,
        partTitle: 'الجزء الخامس: المصفوفات',
        title: 'الفصل 16: المصفوفات (2) — المرور على العناصر',
        subtitle: 'حلقة for العادية وحلقة for..of السحرية',
        summaryPoints: [
          'for (let i = 0; i < array.length; i++) للمرور مع معرفة رقم الـ index.',
          'for (const item of array) أسهل وأوضح لو نحتاج القيم فقط دون الاهتمام بالرقم.',
          'يمكن وضع شروط if داخل الحلقة لفحص كل عنصر على حدة.',
        ],
        contentSections: [
          {
            heading: 'طريقتان للمرور على المصفوفة',
            text: 'حلقة for العادية تمنحك الـ index، بينما for..of تمنحك العنصر مباشرة بدون تعقيدات:',
            codeSnippet: `const scores = [45, 82, 90, 38, 65];

// الطريقة السهلة: for of
for (const score of scores) {
  if (score >= 50) {
    console.log(score + ": ناجح");
  } else {
    console.log(score + ": راسب");
  }
}`,
          },
        ],
        exercises: [
          {
            id: 'ch16-ex1',
            title: 'التمرين 1: التكرار بـ for of',
            code: `const colors = ["أحمر", "أخضر", "أزرق"];
for (const color of colors) {
  console.log(color);
}`,
            expectedOutput: `أحمر\nأخضر\nأزرق`,
            explanation: 'طبع كل لون بالترتيب.',
          },
        ],
        challenge: {
          id: 'ch16-chal',
          title: 'وريني شطارتك 🧠: طقس المدن',
          prompt: 'عندك مصفوفة درجات حرارة [30, 22, 41, 18]. اطبع كل درجة وجانبها "حر" لو أكبر من 30، أو "معتدل" غير ذلك.',
          hint: 'استخدم for..of و if (temp > 30).',
          initialCode: `// اكتب حلقة المرور على درجات الحرارة وفحصها هنا بنفسك...
`,
          solutionCode: `const temps = [30, 22, 41, 18];
for (const t of temps) {
  if (t > 30) {
    console.log(t + " حر");
  } else {
    console.log(t + " معتدل");
  }
}`,
        },
      },
      {
        id: 17,
        partId: 5,
        partTitle: 'الجزء الخامس: المصفوفات',
        title: 'الفصل 17: عمليات المصفوفات (Methods)',
        subtitle: 'الإضافة والحذف بـ push و pop، والبحث بـ includes و indexOf',
        summaryPoints: [
          'push() تضيف عنصراً في نهاية المصفوفة.',
          'pop() تحذف آخر عنصر وتعيده.',
          'includes() تفحص هل القيمة موجودة (true أو false).',
          'indexOf() ترجع مكان العنصر، أو -1 لو غير موجود.',
          'المصفوفة المعرفة بـ const يمكن تعديل محتواها لأن الحاوية ثابتة.',
        ],
        contentSections: [
          {
            heading: 'تعديل محتويات الرف',
            text: 'الدوال المدمجة بالمصفوفات تتيح التعامل الديناميكي معها:',
            codeSnippet: `const cart = ["كتاب"];
cart.push("قلم");      // إضافة بالآخر
console.log(cart);    // ['كتاب', 'قلم']
const last = cart.pop(); // حذف آخر عنصر
console.log(last);    // قلم
console.log(cart.includes("كتاب")); // true`,
          },
        ],
        exercises: [
          {
            id: 'ch17-ex1',
            title: 'التمرين 1: إضافة إلى السلة',
            code: `const cart = ["كتاب"];
cart.push("قلم");
cart.push("دفتر");
console.log(cart);`,
            expectedOutput: `[\n  "كتاب",\n  "قلم",\n  "دفتر"\n]`,
            explanation: 'تمت إضافة عنصرين بالترتيب.',
          },
          {
            id: 'ch17-ex2',
            title: 'التمرين 2: البحث بـ includes و indexOf',
            code: `const names = ["مصطفى", "هبة", "زياد"];
console.log(names.includes("هبة"));
console.log(names.indexOf("زياد"));`,
            expectedOutput: `true\n2`,
            explanation: 'هبة موجودة، وزياد في المكان رقم 2.',
          },
        ],
        challenge: {
          id: 'ch17-chal',
          title: 'وريني شطارتك 🧠: جمع الأرقام الزوجية في مصفوفة',
          prompt: 'ابدأ بمصفوفة فارغة evenNumbers. استخدم حلقة من 1 لـ 10، ولو الرقم زوجي ضيفه بـ push، وفي النهاية اطبع المصفوفة.',
          hint: 'const evenNumbers = []; if (i % 2 === 0) evenNumbers.push(i);',
          initialCode: `// اكتب كود ملء مصفوفة بالأرقام الزوجية هنا بنفسك...
`,
          solutionCode: `const evenNumbers = [];
for (let i = 1; i <= 10; i++) {
  if (i % 2 === 0) {
    evenNumbers.push(i);
  }
}
console.log(evenNumbers);`,
        },
      },
    ],
  },
  {
    id: 6,
    title: 'الجزء السادس: من الكود للصفحة (HTML وCSS وDOM)',
    subtitle: 'لوحة التحكم اللي بتشغّل صفحة الويب التفاعلية',
    description: 'بناء هيكل الصفحة بـ HTML، تزيينها وتنسيقها بـ CSS، كائنات الـ Objects، والتحكم الحي بالصفحة وأحداث النقر عبر الـ DOM.',
    iconName: 'Globe',
    bugHunter: {
      id: 'bug-part-6',
      partId: 6,
      title: 'كويز: مكان السكريبت القاتل في الـ Head',
      context: 'الكود ده المفروض يغير نص العنوان لما تدوس على الزرار، لكنه مبيشتغلش إطلاقاً وبيطلع Cannot read properties of null في الكونسول!',
      problemCode: `<!DOCTYPE html>
<html>
  <head>
    <title>صفحتي</title>
    <script>
      const heading = document.getElementById("title");
      const button = document.getElementById("changeButton");

      button.addEventListener("click", function () {
        heading.textContent = "تم التغيير!";
      });
    </script>
  </head>
  <body>
    <h1 id="title">العنوان الأصلي</h1>
    <button id="changeButton">غيّر</button>
  </body>
</html>`,
      bugLineNumber: 4,
      bugDescription: 'تنفيذ كود JavaScript في <head> قبل أن يتم إنشاء عناصر <body> في الـ DOM.',
      whyItHappens:
        'المتصفح يقرأ الصفحة من الأعلى للأسفل. عندما وصل لكود السكريبت في <head>، لم تكن عناصر <body> قد ظهرت بعد في الذاكرة، لذلك document.getElementById("changeButton") رجعت null، وعند محاولة إضافة مستمع للأحداث اعترض المتصفح بأن button غير موجود!',
      fixedCode: `<!DOCTYPE html>
<html>
  <head>
    <title>صفحتي</title>
  </head>
  <body>
    <h1 id="title">العنوان الأصلي</h1>
    <button id="changeButton">غيّر</button>

    <!-- وضع السكريبت قبل إغلاق body مباشرة -->
    <script>
      const heading = document.getElementById("title");
      const button = document.getElementById("changeButton");

      button.addEventListener("click", function () {
        heading.textContent = "تم التغيير!";
      });
    </script>
  </body>
</html>`,
      expectedCorrectOutput: `عند النقر على الزرار يتغير العنوان فوراً إلى: "تم التغيير!"`,
      hints: [
        'متى يتم تحميل عناصر body بالنسبة لعناصر head؟',
        'ماذا ترجع getElementById إذا كان العنصر لم يُرسم بعد في الصفحة؟',
        'انقل وسم <script> إلى ما قبل إغلاق </body> مباشرة.',
      ],
    },
    chapters: [
      {
        id: 18,
        partId: 6,
        partTitle: 'الجزء السادس: من الكود للصفحة',
        title: 'الفصل 18: أساسيات HTML (1)',
        subtitle: 'هيكل الصفحة، الوسوم، العناوين، القوائم، والصور',
        summaryPoints: [
          'HTML هي لغة هيكل الصفحة وتستخدم الوسوم <tag> و </tag>.',
          'الهيكل الثابت يشمل DOCTYPE و html و head و body.',
          'العناوين من <h1> للأكبر إلى <h6> للأصغر، والفقرات <p>.',
          'القوائم ul (نقط) و ol (أرقام) مع عناصر li.',
          'وسم الصورة <img> مغلق في نفسه ويحتاج src و alt.',
        ],
        contentSections: [
          {
            heading: 'أول صفحة HTML حقيقية',
            text: 'هيكل الصفحة البسيط:',
            codeSnippet: `<!DOCTYPE html>
<html>
  <head>
    <title>صفحتي الأولى</title>
  </head>
  <body>
    <h1>مرحباً بكم في موقعي</h1>
    <p>أول فقرة نصية على الويب.</p>
    <ul>
      <li>تعلم البرمجة</li>
      <li>بناء المواقع</li>
    </ul>
  </body>
</html>`,
            type: 'html_preview',
            htmlCode: `<div class="p-4 bg-slate-900 rounded-lg text-slate-100 border border-slate-700">
  <h1 class="text-2xl font-bold text-amber-400 mb-2">مرحباً بكم في موقعي</h1>
  <p class="text-slate-300 mb-3">أول فقرة نصية على الويب.</p>
  <ul class="list-disc list-inside text-slate-300 space-y-1">
    <li>تعلم البرمجة</li>
    <li>بناء المواقع</li>
  </ul>
</div>`,
          },
        ],
        exercises: [
          {
            id: 'ch18-ex1',
            title: 'التمرين 1: قائمة التسوق',
            code: `console.log("<ul>\\n  <li>تفاح</li>\\n  <li>موز</li>\\n</ul>");`,
            expectedOutput: `<ul>\n  <li>تفاح</li>\n  <li>موز</li>\n</ul>`,
            explanation: 'كود HTML منظم لقائمة غير مرتبة.',
          },
        ],
        challenge: {
          id: 'ch18-chal',
          title: 'وريني شطارتك 🧠: بطاقة التعريف بـ HTML',
          prompt: 'اكتب كود HTML فيه عنوان رئيسي <h1> باسمك، وفقرة <p> تعرف فيها نفسك، وقائمة <ul> بثلاث هوايات.',
          hint: 'h1 ثم p ثم ul مع ثلاث وسوم li.',
          initialCode: `<!-- اكتب وسم h1 و p و ul هنا -->`,
          solutionCode: `<h1>أحمد محمد</h1>
<p>أنا مبرمج ويب طموح أتعلم جافاسكريبت.</p>
<ul>
  <li>القراءة</li>
  <li>البرمجة</li>
  <li>كرة القدم</li>
</ul>`,
        },
      },
      {
        id: 19,
        partId: 6,
        partTitle: 'الجزء السادس: من الكود للصفحة',
        title: 'الفصل 19: أساسيات CSS (1)',
        subtitle: 'الملابس والتنسيق: الألوان، الخطوط، والـ Class',
        summaryPoints: [
          'CSS تلبس هيكل الـ HTML بالألوان والخطوط والأحجام.',
          'تتكون القاعدة من المحدّد selector و الخاصية property والقيمة value.',
          'الـ class يحدد عناصر معينة في HTML ويكتب بنقطة في CSS مثل .warning.',
        ],
        contentSections: [
          {
            heading: 'تنسيق النصوص والـ Class',
            text: 'نستخدم .warning لاستهداف العناصر التي تحمل هذا الكلاس فقط:',
            codeSnippet: `p {
  color: blue;
  font-size: 18px;
}

.warning {
  color: red;
  font-weight: bold;
}`,
            type: 'html_preview',
            htmlCode: `<div class="p-4 bg-slate-900 rounded-lg space-y-2 border border-slate-700">
  <p class="text-blue-400 text-lg">ده نص هيبان بلون أزرق.</p>
  <p class="text-red-500 font-bold">خد بالك، ده تنبيه مهم بكلاس warning.</p>
</div>`,
          },
        ],
        exercises: [
          {
            id: 'ch19-ex1',
            title: 'التمرين 1: قاعدة CSS بسيطة',
            code: `console.log("h1 { color: purple; font-size: 40px; }");`,
            expectedOutput: `h1 { color: purple; font-size: 40px; }`,
            explanation: 'قاعدة صحيحة لتلوين وتكبير العناوين.',
          },
        ],
        challenge: {
          id: 'ch19-chal',
          title: 'وريني شطارتك 🧠: كلاس التمييز highlight',
          prompt: 'اكتب كود CSS لكلاس .highlight يلون النص بالأصفر وحجم خط 20px وخط عريض.',
          hint: '.highlight { color: yellow; font-size: 20px; font-weight: bold; }',
          initialCode: `/* اكتب قاعدة .highlight هنا */`,
          solutionCode: `.highlight {
  color: yellow;
  font-size: 20px;
  font-weight: bold;
}`,
        },
      },
      {
        id: 20,
        partId: 6,
        partTitle: 'الجزء السادس: من الكود للصفحة',
        title: 'الفصل 20: تقسيم الصفحة والمدخلات (HTML 2)',
        subtitle: 'الحاويات (div و span) وحقول الإدخال والأزرار',
        summaryPoints: [
          'span لتحديد جزء صغير داخل نفس السطر.',
          'div حاوية تأخذ سطراً كاملاً لتجميع عناصر متعددة.',
          'input حقول لإدخال النصوص والأرقام وكلمات السر.',
          'button زر قابل للضغط للتفاعل.',
        ],
        contentSections: [
          {
            heading: 'الفرق بين div و span',
            text: 'span لا تكسر السطر، بينما div تصنع كتلة منفصلة:',
            codeSnippet: `<p>الحالة: <span class="online">متصل</span> الآن.</p>

<div class="card">
  <h2>تسجيل دخول</h2>
  <input type="text" placeholder="اسم المستخدم">
  <button>دخول</button>
</div>`,
            type: 'html_preview',
            htmlCode: `<div class="p-4 bg-slate-900 rounded-lg space-y-4 border border-slate-700">
  <p class="text-slate-200">الحالة: <span class="text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">متصل</span> الآن.</p>
  <div class="p-3 bg-slate-800 rounded border border-slate-700 flex gap-2 items-center">
    <input type="text" placeholder="اكتب اسمك..." class="bg-slate-950 border border-slate-600 rounded px-3 py-1.5 text-sm text-slate-100 flex-1" />
    <button class="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-1.5 rounded text-sm transition">إرسال</button>
  </div>
</div>`,
          },
        ],
        exercises: [],
      },
      {
        id: 21,
        partId: 6,
        partTitle: 'الجزء السادس: من الكود للصفحة',
        title: 'الفصل 21: تزيين الأزرار وتأثيرات الفأرة (CSS 2)',
        subtitle: 'background-color و :hover و border و border-radius',
        summaryPoints: [
          'background-color لخلفية العنصر، و color للون النص الداخلي.',
          ':hover يغير المظهر تلقائياً عندما تحوم الفأرة فوق الزر.',
          'border يحدد الإطار، و border-radius يمنح الحواف الدائرية الأنيقة.',
        ],
        contentSections: [
          {
            heading: 'زرار احترافي يتفاعل مع الفأرة',
            text: 'تنسيق تفاعلي بـ CSS الحديث:',
            codeSnippet: `button {
  background-color: teal;
  color: white;
  border: 2px solid teal;
  border-radius: 8px;
  padding: 10px 20px;
  cursor: pointer;
  transition: 0.3s;
}

button:hover {
  background-color: darkslategray;
}`,
            type: 'html_preview',
            htmlCode: `<div class="p-4 bg-slate-900 rounded-lg flex gap-4 items-center border border-slate-700">
  <button class="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 px-6 rounded-lg border-2 border-teal-500 transition duration-200 shadow hover:shadow-lg">
    اضغط هنا (:hover فعال)
  </button>
</div>`,
          },
        ],
        exercises: [],
      },
      {
        id: 22,
        partId: 6,
        partTitle: 'الجزء السادس: من الكود للصفحة',
        title: 'الفصل 22: ألوان الشاشات RGB و Hex والشفافية (CSS 3)',
        subtitle: 'تركيب الألوان بالأرقام والشفافية بـ opacity و rgba',
        summaryPoints: [
          'كل ألوان الشاشات عبارة عن خلط للأحمر والأخضر والأزرق (RGB من 0 لـ 255).',
          'كود Hex يبدأ بـ # ويتبعه 6 خانات (#00FF00 للأخضر).',
          'opacity تحدد شفافية العنصر بالكامل من 0 (مختفي) لـ 1 (ظاهر).',
          'rgba(0,0,0,0.5) تمنح اللون نفسه شفافية دون التأثير على وضوح النص.',
        ],
        contentSections: [
          {
            heading: 'أنظمة الألوان الحديثة',
            text: 'استخدام كود Hex والشفافية:',
            codeSnippet: `.card {
  color: #FFFFFF;
  background-color: rgba(15, 23, 42, 0.8);
  border: 1px solid #38BDF8;
}`,
          },
        ],
        exercises: [],
      },
      {
        id: 23,
        partId: 6,
        partTitle: 'الجزء السادس: من الكود للصفحة',
        title: 'الفصل 23: بناء موقع متكامل (مشروع عملي)',
        subtitle: 'تجميع الهيكل والتنسيق: header و main و footer',
        summaryPoints: [
          'تقسيم الصفحة إلى رأس (header) ومحتوى (main) وتذييل (footer).',
          'استخدام padding للمسافات الداخلية و margin للمسافات الخارجية.',
          'تنسيق كروت المنتجات والأزرار المخصصة.',
        ],
        contentSections: [
          {
            heading: 'معاينة حية للمتجر البسيط',
            text: 'صفحة متجر كتب كاملة مصممة بـ HTML و CSS:',
            codeSnippet: `<header>
  <h1>متجر الكتب</h1>
  <nav>الرئيسية | المنتجات | تواصل معنا</nav>
</header>
<main>
  <div class="product">
    <h2>كتاب البرمجة للمبتدئين</h2>
    <p>تعلم البرمجة من الصفر بالعامية المصرية.</p>
    <button>أضف للسلة</button>
  </div>
</main>`,
            type: 'html_preview',
            htmlCode: `<div class="rounded-xl overflow-hidden border border-slate-700 bg-slate-900 text-slate-100">
  <div class="bg-teal-700 p-4 flex justify-between items-center text-white">
    <h3 class="text-xl font-bold">متجر الكتب الذكي</h3>
    <nav class="flex gap-3 text-sm text-teal-100">
      <span>الرئيسية</span>
      <span>المنتجات</span>
      <span>اتصل بنا</span>
    </nav>
  </div>
  <div class="p-4 grid gap-3">
    <div class="p-3.5 bg-slate-800/90 rounded-lg border border-slate-700 flex justify-between items-center">
      <div>
        <h4 class="font-bold text-amber-400">كتاب البرمجة للمبتدئين</h4>
        <p class="text-xs text-slate-400">شرح مبسط بالعامية المصرية ممتع ومباشر.</p>
      </div>
      <button class="bg-teal-600 hover:bg-teal-500 text-white text-xs px-3 py-1.5 rounded font-semibold transition">أضف للسلة</button>
    </div>
  </div>
  <div class="bg-slate-950 p-2.5 text-center text-xs text-slate-400 border-t border-slate-800">
    جميع الحقوق محفوظة © متجر الكتب 2026
  </div>
</div>`,
          },
        ],
        exercises: [],
      },
      {
        id: 24,
        partId: 6,
        partTitle: 'الجزء السادس: من الكود للصفحة',
        title: 'الفصل 24: الكائنات (Objects)',
        subtitle: 'بطاقة التعريف: مفتاح وقيمة (Key: Value)',
        summaryPoints: [
          'الـ Object يحفظ بيانات مرتبطة بكيان واحد (مثل طالب أو منتج).',
          'يتكون من أزواج { key: value } مفصولة بفواصل.',
          'الوصول للقيم باستخدام نقطة: student.name أو student.grade.',
          'يمكن تمرير الـ Object للدوال واستخدامه في الشروط بسهولة.',
        ],
        contentSections: [
          {
            heading: 'بطاقة تعريف الطالب',
            text: 'تنظيم البيانات بدون الاعتماد على أرقام المصفوفات:',
            codeSnippet: `const student = {
  name: "سارة",
  age: 16,
  grade: 88
};

console.log(student.name);  // سارة
student.grade = 92;         // تعديل قيمة
student.city = "القاهرة";   // إضافة خاصية جديدة
console.log(student);`,
          },
        ],
        exercises: [
          {
            id: 'ch24-ex1',
            title: 'التمرين 1: كتاب بمعلومات كاملة',
            code: `const book = { title: "أساسيات الويب", pages: 250 };
console.log(book.title);
console.log(book.pages);`,
            expectedOutput: `أساسيات الويب\n250`,
            explanation: 'الوصول للخصائص بأسلوب dot notation.',
          },
        ],
        challenge: {
          id: 'ch24-chal',
          title: 'وريني شطارتك 🧠: بطاقة فيلم',
          prompt: 'اعمل object اسمه movie بخصائص title و year و rating، واطبع جملة تجمعهم بالشكل: "الفيلم: [العنوان] ([السنة]) - التقييم: [الرقم]".',
          hint: 'movie.title + " (" + movie.year + ") - التقييم: " + movie.rating',
          initialCode: `// أنشئ كائن movie بخصائص title و year و rating واطبع بياناته بنفسك هنا...
`,
          solutionCode: `const movie = {
  title: "رحلة المبرمج",
  year: 2026,
  rating: 9.5
};
console.log("الفيلم: " + movie.title + " (" + movie.year + ") - التقييم: " + movie.rating);`,
        },
      },
      {
        id: 25,
        partId: 6,
        partTitle: 'الجزء السادس: من الكود للصفحة',
        title: 'الفصل 25: شجرة الـ DOM والأحداث (Events)',
        subtitle: 'المتصفح يسمع للزائر: getElementById و addEventListener',
        summaryPoints: [
          'الـ DOM هي شجرة الصفحة التي تتيح لجافاسكريبت التحكم في أي عنصر وتعديله.',
          'document.getElementById() للوصول للعنصر عبر الـ id الفريد.',
          '.textContent لتعديل النص الداخلي، و .style لتعديل التنسيقات.',
          'addEventListener("click", ...) لجعل الكود ينتظر نقرة الزائر قبل التنفيذ.',
          'يجب وضع وسم <script> قبل إغلاق </body> مباشرة.',
        ],
        contentSections: [
          {
            heading: 'ربط النقر بتغيير الصفحة لحظياً',
            text: 'عندما ينقر الزائر على الزرار، تستجيب الدالة فوراً وتغير النص واللون:',
            codeSnippet: `// مثال العداد التفاعلي:
let count = 0;
const countDisplay = document.getElementById("count");
const btn = document.getElementById("btn");

btn.addEventListener("click", function() {
  count++;
  countDisplay.textContent = count;
});`,
            type: 'html_preview',
            htmlCode: `<div class="p-6 bg-slate-900 rounded-xl border border-slate-700 text-center space-y-4">
  <p class="text-slate-300 text-base">العداد التفاعلي الحي:</p>
  <div id="interactive-preview-count" class="text-4xl font-extrabold text-amber-400">0</div>
  <div class="flex gap-2 justify-center">
    <button onclick="
      const el = document.getElementById('interactive-preview-count');
      el.textContent = Number(el.textContent) + 1;
    " class="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-2 rounded-lg transition active:scale-95 shadow">
      + زيادة العداد (جرب النقر!)
    </button>
    <button onclick="
      document.getElementById('interactive-preview-count').textContent = '0';
    " class="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold px-4 py-2 rounded-lg border border-slate-600 text-sm">
      تصفير
    </button>
  </div>
</div>`,
            callout: {
              type: 'celebration',
              title: 'بااااام! 💥',
              content:
                'كده بقى عندك موقع ديناميكي كامل بيتفاعل مع حركة الزائر وينفذ أوامرك! دي الخطوة الحقيقية اللي بتنقل المبرمج من مجرد كاتب نصوص إلى صانع تطبيقات ويب تفاعلية.',
            },
          },
        ],
        exercises: [],
        challenge: {
          id: 'ch25-chal',
          title: 'وريني شطارتك 🧠: مفتاح النور التفاعلي (Toggle)',
          prompt: 'اكتب كود يغير نص الفقرة بين "النور مضاء" و "النور مطفي" في كل مرة يتم فيها النقر على الزرار باستخدام متغير boolean.',
          hint: 'let isOn = false; btn.addEventListener("click", () => { isOn = !isOn; status.textContent = isOn ? "النور مضاء" : "النور مطفي"; });',
          initialCode: `// اكتب كود دالة تبديل النور وفحص الحالة بنفسك هنا...
`,
          solutionCode: `let isOn = false;
function toggleLight() {
  isOn = !isOn;
  return isOn ? "النور مضاء" : "النور مطفي";
}
console.log(toggleLight()); // النور مضاء
console.log(toggleLight()); // النور مطفي`,
        },
      },
    ],
  },
];
