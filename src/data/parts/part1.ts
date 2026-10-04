import { Part } from "../../types";

export const part1: Part =   {
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
                'أول ما تشوف كتابة حمرا في الـ Console وفيها كلام إنجليزي كتير، قلبك بيقع؟ دي مش عقاب، دي رسالة خطأ (error message)، والكمبيوتر بيقولك فيها: "إنت وقفت هنا، وده السبب". اقرأ أول سطر منها وبس، وهتلاقيها بتدلّك على الغلطة.',
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
        quiz: [
          {
            id: 'ch1-q1',
            question: 'لو كتبت في الكود الأمر Console.log بحرف C كبير.. إيه اللي هيحصل بالظبط؟',
            codeSnippet: 'Console.log("أهلاً يا مبرمج");',
            options: [
              {
                id: 'a',
                text: 'هيشتغل تمام ويطبع "أهلاً يا مبرمج"',
                isCorrect: false,
                explanation: 'لغة JavaScript بتفرّق بدقة بين الحرف الكبير والصغير (Case Sensitive)، فلازم نكتب console بحرف c صغير.',
              },
              {
                id: 'b',
                text: 'الكمبيوتر هيعترض ويطلع خطأ ReferenceError: Console is not defined',
                isCorrect: true,
                explanation: 'إجابة عبقرية! 👏 الكمبيوتر ميعرفش Console بحرف كبير، فبيطلع خطأ إن الكلمة دي غير معرّفة.',
              },
              {
                id: 'c',
                text: 'هيطبع النص بحروف كبيرة كابيتال',
                isCorrect: false,
                explanation: 'أوامر الطباعة وظيفتها التنفيذ، وليست مسؤولة عن تعديل حالة الحروف.',
              },
            ],
          },
          {
            id: 'ch1-q2',
            question: 'إيه اللي هيطبع في الـ Console لما نشغّل الكود ده؟',
            codeSnippet: 'console.log("السطر الأول");\n// console.log("السطر الثاني");\nconsole.log("السطر الثالث");',
            options: [
              {
                id: 'a',
                text: 'السطر الأول ثم السطر الثالث فقط',
                isCorrect: true,
                explanation: 'عاش يا بطل! 🎯 علامة // حوّلت السطر الثاني لتعليق، فالكمبيوتر تجاهله تماماً ولم يطبعه.',
              },
              {
                id: 'b',
                text: 'الـ 3 أسطر هيتطبعوا كلهم بالترتيب',
                isCorrect: false,
                explanation: 'السطر الثاني قبله // يعني تعليق (Comment)، والكمبيوتر بيتجاهل التعليقات تماماً.',
              },
              {
                id: 'c',
                text: 'هيحصل خطأ في السطر الثاني',
                isCorrect: false,
                explanation: 'التعليقات مش بتعمل أي خطأ لأن المفسر بيتخطاها كأنها مش موجودة.',
              },
            ],
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
        quiz: [
          {
            id: 'ch2-q1',
            question: 'يا ترى الكود ده هيطبع إيه في الشاشة؟',
            codeSnippet: 'console.log("5" + 2);',
            options: [
              {
                id: 'a',
                text: '7',
                isCorrect: false,
                explanation: 'خد بالك! الرقم 5 محطوط بين علامتي تنصيص يعني نص (String)، وعلامة + مع النصوص بتعمل دمج مش جمع!',
              },
              {
                id: 'b',
                text: '52',
                isCorrect: true,
                explanation: 'برافو عليك! 🎯 علامة + لما تلاقي نص بتلزق القيمتين جنب بعض وتطلع النص "52".',
              },
              {
                id: 'c',
                text: 'Error',
                isCorrect: false,
                explanation: 'جافاسكريبت لغة مرنة، مش بتطلع خطأ هنا بل بتحوّل الرقم 2 لنص وتدمجه مع "5".',
              },
              {
                id: 'd',
                text: 'NaN',
                isCorrect: false,
                explanation: 'NaN بيظهر في عمليات حسابية فاشلة (زي طرح نص من رقم)، لكن الجمع + بيعمل دمج نصوص.',
              },
            ],
          },
          {
            id: 'ch2-q2',
            question: 'لو قسمنا 10 على 3، باقي القسمة (10 % 3) هيكون كام؟',
            codeSnippet: 'console.log(10 % 3);',
            options: [
              {
                id: 'a',
                text: '1',
                isCorrect: true,
                explanation: 'عاش يا بطل! 👏 3 * 3 = 9، ويتبقى 1 للوصول لـ 10، فباقي القسمة هو 1.',
              },
              {
                id: 'b',
                text: '3',
                isCorrect: false,
                explanation: '3 هو ناتج القسمة الصحيحة، مش باقي القسمة!',
              },
              {
                id: 'c',
                text: '0',
                isCorrect: false,
                explanation: 'لو كان الباقي 0 ده معناه إن 10 تقبل القسمة على 3 تماماً، وده مش حاصل.',
              },
            ],
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
        quiz: [
          {
            id: 'ch3-q1',
            question: 'إيه الفرق الجوهري في جافاسكريبت بين let و const؟',
            options: [
              {
                id: 'a',
                text: 'const خزنة حديد تمنع تغيير قيمتها، بينما let تسمح بتعديل القيمة لاحقاً',
                isCorrect: true,
                explanation: 'إجابة نموذجية! 🎯 const من constant يعني ثابت، و let تسمح بإعادة التعيين والتعديل.',
              },
              {
                id: 'b',
                text: 'let مخصصة للأرقام فقط و const للنصوص فقط',
                isCorrect: false,
                explanation: 'الاتنين يقدروا يشيلوا أي نوع بيانات سواء أرقام أو نصوص أو غيرها.',
              },
              {
                id: 'c',
                text: 'مفيش أي فرق بينهم، الاتنين زي بعض بالظبط',
                isCorrect: false,
                explanation: 'في فرق مهم جداً: const بتمنع تغيير القيمة وتطلع خطأ لو حاولت تعدلها.',
              },
            ],
          },
          {
            id: 'ch3-q2',
            question: 'توقّع إيه اللي هيحصل لما نشغّل الكود ده:',
            codeSnippet: 'const pi = 3.14;\npi = 3.14159;\nconsole.log(pi);',
            options: [
              {
                id: 'a',
                text: 'هيطبع القيمة الجديدة 3.14159 عادي',
                isCorrect: false,
                explanation: 'المتغير pi متعرف بـ const، و const تمنع إعادة تعيين القيمة!',
              },
              {
                id: 'b',
                text: 'الكمبيوتر هيطلع خطأ TypeError: Assignment to constant variable',
                isCorrect: true,
                explanation: 'ممتاز يا بطل! 👏 لأنك حاولت تعدل متغير ثابت محمي بـ const.',
              },
              {
                id: 'c',
                text: 'هيطبع القيمة القديمة 3.14 ويتجاهل السطر التاني',
                isCorrect: false,
                explanation: 'جافاسكريبت بتوقف البرنامج فوراً وتطلع خطأ ومش بتكمل.',
              },
            ],
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
        quiz: [
          {
            id: 'ch4-q1',
            question: 'يا ترى typeof NaN هيطلع نوعه إيه بالظبط في جافاسكريبت؟',
            codeSnippet: 'console.log(typeof NaN);',
            options: [
              {
                id: 'a',
                text: '"number"',
                isCorrect: true,
                explanation: 'صح جداً! 🎉 مفارقة شهيرة في جافاسكريبت: رغم إن NaN اختصار Not a Number إلا إن تصنيفه البرمجي رقم number فاشل.',
              },
              {
                id: 'b',
                text: '"undefined"',
                isCorrect: false,
                explanation: 'undefined يظهر لما المتغير ميكونش واخد أي قيمة، مش مع NaN.',
              },
              {
                id: 'c',
                text: '"string"',
                isCorrect: false,
                explanation: 'NaN مش نص ولا محطوط بين علامات تنصيص.',
              },
            ],
          },
          {
            id: 'ch4-q2',
            question: 'إيه الفرق بين المقارنة العادية (==) والمقارنة الصارمة (===)؟',
            options: [
              {
                id: 'a',
                text: '=== تقارن القيمة والنوع معاً، بينما == تقارن القيمة وتتجاهل النوع',
                isCorrect: true,
                explanation: 'إجابة عبقرية! 👏 عشان كده 10 == "10" بتدي true، بينما 10 === "10" بتدي false.',
              },
              {
                id: 'b',
                text: '== للأرقام فقط و === للنصوص فقط',
                isCorrect: false,
                explanation: 'الاتنين بيقارنوا أي نوع من البيانات.',
              },
              {
                id: 'c',
                text: '=== بتعدل قيمة المتغير الأول',
                isCorrect: false,
                explanation: 'المقارنات لا تعدل القيم إطلاقاً، هي بس بتفحص وترجع true أو false.',
              },
            ],
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
  };
