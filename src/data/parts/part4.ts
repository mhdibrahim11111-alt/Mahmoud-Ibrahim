import { Part } from '../../types';

export const part4: Part = {
  id: 4,
  title: 'الجزء الرابع: الدوال',
  subtitle: 'الخلّاط اللي بنستخدمه كل مرة',
  description:
    'تنظيم الكود وإعادة استخدامه عبر الدوال، المدخلات (Parameters)، القيمة المرتجعة (return)، والنطاق (Scope)، ومشروع لعبة التخمين.',
  iconName: 'Cpu',
  bugHunter: {
    id: 'bug-part-4',
    partId: 4,
    title: 'كويز: لغز الخصم التائه (الطباعة أم الإرجاع؟)',
    context:
      'الكود ده المفروض يحسب سعر المنتج بعد خصم 50% ويفحص لو كان العرض قوياً، لكنه لا يستخدم ناتج الحساب في الشرط!',
    problemCode: `function applyDiscount(price, discountPercent) {
  const discountAmount = price * discountPercent / 100;
  console.log(price - discountAmount);
}

const finalPrice = applyDiscount(200, 50);

if (finalPrice < 150) {
  console.log("عرض قوي");
} else {
  console.log("عرض عادي");
}`,
    bugLineNumber: 3,
    bugDescription:
      'الدالة قامت بطباعة السعر بـ console.log بدلاً من إرجاعه بـ return، فكانت قيمة finalPrice هي undefined.',
    whyItHappens:
      'الدالة التي لا تحتوي على كلمة return ترجع تلقائياً undefined. المتغير finalPrice استقبل undefined، ومقارنة undefined < 150 تنتج false، فيذهب الكود لـ else دائماً!',
    fixedCode: `function applyDiscount(price, discountPercent) {
  const discountAmount = price * discountPercent / 100;
  return price - discountAmount; // رجّع القيمة للمستدعي!
}

const finalPrice = applyDiscount(200, 50); // نفس المدخلات قبل الإصلاح

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
        'كائن Math يحتوي على دوال رياضية جاهزة بنيت داخل جافاسكريبت لتوفر علينا الحسابات المعقدة.',
        'دوال التقريب: Math.round للأقرب، و Math.floor للأرض (الأسفل)، و Math.ceil للسقف (الأعلى).',
        'دالتا Math.max و Math.min للعثور على أكبر وأصغر قيمة فوراً.',
        'الدالة Math.random() بتولد رقم عشوائي بين 0 وأقل من 1، وبمعادلة بسيطة بنحولها لحجر نرد أو أرقام يانصيب.',
      ],
      contentSections: [
        {
          heading: 'يعني إيه دالة جاهزة في JavaScript؟ (كائن Math)',
          text: `تخيل لو كل مرة عايز تحسب الجذر التربيعي أو تولد رقم عشوائي، كنت محتاج تكتب كود من 50 سطر يحسب معادلات نيوتن الرياضية!
لحسن الحظ، مطورو لغة JavaScript جهزوا لنا "صندوق عدة سحري" اسمه كائن Math.
Math مش بنعرفه ولا بنثبته، هو موجود وجاهز للاستخدام في أي لحظة. كل اللي بنعمله إننا بننادي اسم الصندوق متبوعاً بنقطة واسم الدالة: Math.something().`,
          codeSnippet: `// أمثلة سريعة على أدوات Math الجاهزة
console.log(Math.PI);          // 3.141592653589793 (النسبة التقريبية ط)
console.log(Math.sqrt(16));     // 4 (الجذر التربيعي)
console.log(Math.pow(2, 3));    // 8 (2 أس 3)`,
        },
        {
          heading: 'عائلة التقريب الثلاثية: round و floor و ceil',
          text: `الكسور العشرية في الفلوس والحسابات بتعمل دوشة، وعشان كده بنحتاج نقربها لأرقام صحيحة.
عندنا 3 دوال تقريب أساسية لازم تفرق بينهم:
1. Math.round (التقريب العادل): بيبص على الكسر؛ لو 0.5 أو أكتر يقرب لفوق، لو أقل من 0.5 يقرب لتحت.
2. Math.floor (النزول للأرض دايماً): كلمة Floor يعني أرضية؛ بيقطع الكسر وينزل لأقرب عدد صحيح أصغر مهما كان الكسر كبيراً! (حتى لو 9.99 هتبقى 9).
3. Math.ceil (الطلوع للسقف دايماً): كلمة Ceil يعني سقف؛ بيقرب للعدد الصحيح الأكبر فوراً لو في أي كسر مهما كان صغيراً (حتى لو 4.01 هتبقى 5).`,
          codeSnippet: `console.log(Math.round(4.4)); // 4 (أقل من النصف)
console.log(Math.round(4.6)); // 5 (أكبر من النصف)

console.log(Math.floor(7.99)); // 7 (نزل للأرض وقطع الكسر)
console.log(Math.ceil(2.05));  // 3 (طلع للسقف مباشرة)`,
          callout: {
            type: 'tip',
            title: 'تشبيه الأسانسير 🛗',
            content:
              'افتكر دايماً: floor بتدوس على زرار الأرضي فتنزل تحت، و ceil بتدوس على زرار السطح فتطلع فوق، و round هو الساكن العادل اللي بيشوف إنت أقرب لأنهي دور!',
          },
        },
        {
          heading: 'إيجاد الفائز: Math.max و Math.min',
          text: `لو عندك درجات 5 طلاب أو أسعار 4 منتجات وعايز تعرف أعلى سعر وأقل سعر بضغطة زرار واحدة:
Math.max(a, b, c, ...) بتعطيك أكبر رقم فوراً.
Math.min(a, b, c, ...) بتعطيك أصغر رقم فوراً.`,
          codeSnippet: `const price1 = 120;
const price2 = 450;
const price3 = 85;

const bestPrice = Math.min(price1, price2, price3);
const highestPrice = Math.max(price1, price2, price3);

console.log("أرخص سعر: " + bestPrice);  // 85
console.log("أغلى سعر: " + highestPrice); // 450`,
        },
        {
          heading: 'الساحر الأكبر: Math.random() وصناعة حجر النرد 🎲',
          text: `الدالة Math.random() بتولد رقم عشوائي كسر عشري غريب بين 0 (مشمول) و 1 (غير مشمول)، زي مثلاً: 0.738291.
طب إزاي نحول الكسر ده لرقم حقيقي في لعبة، زي حجر النرد (من 1 إلى 6)؟
المعادلة السحرية المكونة من خطوتين:
1. اضرب الناتج في 6: الرقم الكسر هيتحول لرقم بين 0 و 5.999.
2. اقطع الكسور بـ Math.floor: الناتج هيبقى (0 أو 1 أو 2 أو 3 أو 4 أو 5).
3. زوّد 1 في الآخر: الناتج النهائي هيبقى رقم صحيح عشوائي بين 1 و 6 بالتمام والكمال!`,
          codeSnippet: `// رمي حجر النرد في لعبة السلم والتعبان
const diceRoll = Math.floor(Math.random() * 6) + 1;
console.log("🎲 نتيجة رمي النرد: " + diceRoll);

// توليد رقم عشوائي بين 1 و 100
const randomNumber = Math.floor(Math.random() * 100) + 1;
console.log("رقم الحظ: " + randomNumber);`,
          callout: {
            type: 'celebration',
            title: 'معادلة الألعاب الذهبية 🌟',
            content:
              'قاعدة عامة: عشان تولد أي رقم عشوائي بين min و max:\nMath.floor(Math.random() * (max - min + 1)) + min;\nاحفظ السطر ده، ده مفتاحك لبرمجة كل الألعاب وسحب الجوائز!',
          },
        },
      ],
      exercises: [
        {
          id: 'ch10-ex1',
          title: 'التمرين 1: مقارنة دوال التقريب',
          code: `console.log(Math.round(2.5));
console.log(Math.floor(2.5));
console.log(Math.ceil(2.1));`,
          expectedOutput: `3\n2\n3`,
          explanation:
            'round تقرب للأعلى عند 0.5، و floor تقطع الكسر للأسفل، و ceil تقرب للأعلى بمجرد وجود كسر.',
        },
        {
          id: 'ch10-ex2',
          title: 'التمرين 2: البحث عن القيم القصوى',
          code: `console.log(Math.max(10, 50, 5));
console.log(Math.min(10, 50, 5));`,
          expectedOutput: `50\n5`,
          explanation: 'Math.max ترجع 50 و Math.min ترجع 5.',
        },
      ],
      quiz: [
        {
          id: 'ch10-q1',
          question: 'الدالة Math.floor(8.99) هترجع إيه بالظبط؟',
          options: [
            {
              id: 'a',
              text: '8',
              isCorrect: true,
              explanation:
                'صح جداً! 👏 Math.floor بتنزل للأرض وتقطع الكسور تماماً بدون ما تبص لقيمتها.',
            },
            {
              id: 'b',
              text: '9',
              isCorrect: false,
              explanation: 'دي وظيفة Math.round أو Math.ceil، مش floor.',
            },
            {
              id: 'c',
              text: '8.9',
              isCorrect: false,
              explanation: 'الدالة بترجع أرقام صحيحة فقط بدون كسور.',
            },
          ],
        },
        {
          id: 'ch10-q2',
          question:
            'عشان نولد رقم عشوائي بين 1 و 6 (زي حجر النرد)، بنكتب إيه؟',
          options: [
            {
              id: 'a',
              text: 'Math.floor(Math.random() * 6) + 1',
              isCorrect: true,
              explanation:
                'برافو عليك! 🎲 بنضرب في 6 ونقطع الكسر بـ floor ونزود 1 عشان نبدأ من 1 مش من 0.',
            },
            {
              id: 'b',
              text: 'Math.random() * 6',
              isCorrect: false,
              explanation: 'ده هيرجع رقم عشري بكسور مش رقم صحيح.',
            },
            {
              id: 'c',
              text: 'Math.round(Math.random())',
              isCorrect: false,
              explanation: 'ده هيرجع يا 0 يا 1 بس.',
            },
          ],
        },
      ],
      challenge: {
        id: 'ch10-chal',
        title: 'وريني شطارتك 🧠: مولد العملة المعدنية (ملك أو كتابة)',
        prompt:
          'اكتب كود يولد رقماً عشوائياً بين 1 و 2؛ إذا كان 1 اطبع "ملك"، وإذا كان 2 اطبع "كتابة".',
        hint: 'استخدم Math.floor(Math.random() * 2) + 1 ثم جملة if/else.',
        initialCode: `// اكتب كود رمي العملة المعدنية (ملك أو كتابة) هنا بنفسك...
`,
        solutionCode: `const coin = Math.floor(Math.random() * 2) + 1;
if (coin === 1) {
  console.log("ملك");
} else {
  console.log("كتابة");
}`,
      },
    },
    {
      id: 11,
      partId: 4,
      partTitle: 'الجزء الرابع: الدوال',
      title: 'الفصل 11: كتابة دالة (Functions)',
      subtitle: 'الخلّاط السحري: اسم، مدخلات، وتنفيذ',
      summaryPoints: [
        'الدالة (Function) هي وصفة برمجية بنكتبها مرة واحدة ونستدعيها كل ما نحتاجها بدون تكرار.',
        'بنعلن عن الدالة بكلمة function متبوعة باسمها وأقواس معقوصة { } تحتوي الأوامر.',
        'كتابة الدالة لا تعني تشغيلها؛ لازم نستدعيها بالاسم والأقواس: myFunction().',
        'المعاملات (Parameters) بتسمح للدالة باستقبال بيانات متغيرة في كل تشغيل.',
      ],
      contentSections: [
        {
          heading: 'تشبيه الخلاط الكهربائي ومصنع الكيك: يعني إيه دالة؟',
          text: `لو عندك وصفة عمل كيكة شيكولاتة لذيذة..
هل كل يوم خميس هتقعد تخترع خطوات الوصفة من الصفر؟ ولا بتفتح الكراس اللي فيه الوصفة الثابتة، وبتتبع الخطوات بنفس الترتيب؟
الخلاط الكهربائي في المطبخ نفس الفكرة: هو متصنع وجاهز؛ إنت بتفتحه، تحط الموز واللبن، تدوس على الزرار، يشتغل ويطلع العصير!

في البرمجة، "الدالة (Function)" هي بالظبط الخلاط ده:
مجموعة أسطر كود بتعمل مهمة معينة، بنديها اسم مميز، وبنحفظها عشان نقدر نشغلها في أي سطر في البرنامج بكلمة واحدة بدل ما نكرر كتابة نفس الـ 20 سطر كل شوية!`,
          codeSnippet: `// 1. صناعة الدالة (الوصفة)
function sayHello() {
  console.log("👋 مرحباً بك في زكي كود!");
  console.log("نتمنى لك رحلة برمجة ممتعة.");
}

// 2. تشغيل الدالة واستدعاؤها
sayHello();
sayHello(); // تقدر تناديها مليون مرة!`,
        },
        {
          heading: 'الفرق الخطير بين الإعلان (Declaration) والاستدعاء (Call)',
          text: `أكبر سوء فهم بيحصل في أول أسبوع برمجة هو:
"أنا كتبت الدالة في الكود يا باشمهندس، بس مفيش أي حاجة ظهرت في الشاشة خالص!".
السر بسيط:
كتابة function myFunction() { ... } دي مجرد "بناء الخلاط ووضعه على الرف".
الخلاط مش هيلف ولا هيعمل صوت إلا لما تمد إيدك وتدوس على زرار التشغيل!
وزرار التشغيل في البرمجة هو كتابة اسم الدالة متبوعاً بقوسين: myFunction();
القوسين دول هما إشارة الانطلاق للكمبيوتر عشان يسيب كل حاجة في إيده ويروح ينفذ الكود اللي جوه الدالة.`,
          codeSnippet: `function ringBell() {
  console.log("🔔 ترررررن! جرس الباب بيرن.");
}

// الكود مش هيطبع حاجة خالص إلا لما نشغله كده:
ringBell();`,
          callout: {
            type: 'warning',
            title: 'إياك ونسيان القوسين () ⛔',
            content:
              'لو كتبت اسم الدالة لوحده ringBell بدون قوسين، الكمبيوتر هيعتبرها مجرد متغير ومش هيشغلها! القوسين () هما مفتاح التشغيل الإجباري.',
          },
        },
        {
          heading: 'تمرير المقادير: المدخلات والمعاملات (Parameters & Arguments)',
          text: `خلاط المطبخ مبيعملش نوع عصير واحد بس.. إنت بتحط فيه مانجا بيطلع عصير مانجا، بتحط فراولة بيطلع عصير فراولة!
الدالة برضه بتكون مرنة جداً لما نسمح لها تستقبل "مدخلات":
- المعامل (Parameter): هو الاسم المستعار اللي بنكتبه بين قوسي الدالة أثناء بنائها (زي name أو age).
- القيمة الفعلية (Argument): هي القيمة الحقيقية اللي بنبعتها للدالة ساعة التشغيل (زي "أحمد" أو 25).`,
          codeSnippet: `// دالة تستقبل مدخل اسمه personName
function greetUser(personName) {
  console.log("أهلاً وسهلاً يا " + personName + "، نوّرت الموقع! ✨");
}

// استدعاء الدالة بمقادير مختلفة
greetUser("عمر");
greetUser("مريم");
greetUser("مصطفى");`,
        },
        {
          heading: 'دوال بمدخلات متعددة وقيم افتراضية',
          text: `تقدر الدالة تستقبل أكتر من مدخل مفصولين بفواصل.
وتقدر كمان تحط "قيمة افتراضية (Default Value)" تحمي الكود لو المستخدم نسي يبعت القيمة:`,
          codeSnippet: `// دالة تستقبل مدخلين مع قيمة افتراضية للعملة
function showReceipt(productName, price, currency = "جنيه") {
  console.log("🧾 اشتريت: " + productName + " بسعر: " + price + " " + currency);
}

showReceipt("كتاب البرمجة", 150);            // العملة هتكون جنيه تلقائياً
showReceipt("كورس إنجليزي", 50, "دولار");    // تم تحديد العملة يدوياً`,
          callout: {
            type: 'tip',
            title: 'مبدأ DRY الذهبي 🏆',
            content:
              'في البرمجة عندنا قاعدة عالمية اسمها DRY: اختصار لـ Don\'t Repeat Yourself (متكررش نفسك). كل ما تلاقي نفسك نسخت كود أكتر من مرتين، حطه جوه دالة فوراً!',
          },
        },
      ],
      exercises: [
        {
          id: 'ch11-ex1',
          title: 'التمرين 1: دالة الترحيب البسيطة',
          code: `function welcome() {
  console.log("أهلاً بكم!");
}
welcome();`,
          expectedOutput: `أهلاً بكم!`,
          explanation: 'تعريف الدالة ثم استدعاؤها بالقوسين ().',
        },
        {
          id: 'ch11-ex2',
          title: 'التمرين 2: دالة الترحيب بالاسم',
          code: `function greet(name) {
  console.log("مرحباً " + name);
}
greet("أحمد");
greet("سارة");`,
          expectedOutput: `مرحباً أحمد\nمرحباً سارة`,
          explanation:
            'الدالة تقبل المعامل name وتستخدمه داخل جملة الطباعة.',
        },
      ],
      quiz: [
        {
          id: 'ch11-q1',
          question:
            'ليه لما نكتب function doWork() { console.log("done"); } مفيش حاجة بتطبع في الشاشة؟',
          options: [
            {
              id: 'a',
              text: 'لأننا فقط عرّفنا الدالة ولم نستدعها بعد باستخدام doWork()',
              isCorrect: true,
              explanation:
                'صح جداً! 👏 لازم تنادي الدالة بالاسم والأقواس عشان الكمبيوتر ينفذ اللي جواها.',
            },
            {
              id: 'b',
              text: 'لأن الكود فيه خطأ لغوي',
              isCorrect: false,
              explanation: 'الكود صحيح تماماً لكنه ينتظر الاستدعاء.',
            },
            {
              id: 'c',
              text: 'لأن console.log ممنوع جوه الدوال',
              isCorrect: false,
              explanation: 'الطباعة مسموحة في أي مكان في الكود.',
            },
          ],
        },
        {
          id: 'ch11-q2',
          question: 'إيه هو الـ Parameter في الدالة؟',
          options: [
            {
              id: 'a',
              text: 'المتغير اللي بنستقبل بيه المدخلات بين قوسي الدالة',
              isCorrect: true,
              explanation:
                'ممتاز! 💡 المعامل هو المتغير اللي بيحفظ القيمة الممررة للدالة.',
            },
            {
              id: 'b',
              text: 'اسم الدالة نفسه',
              isCorrect: false,
              explanation: 'اسم الدالة بيجي بعد كلمة function مباشرة.',
            },
            {
              id: 'c',
              text: 'الناتج النهائي للدالة',
              isCorrect: false,
              explanation: 'الناتج بيتم إرجاعه بكلمة return.',
            },
          ],
        },
      ],
      challenge: {
        id: 'ch11-chal',
        title: 'وريني شطارتك 🧠: دالة مضاعفة الرقم',
        prompt:
          'اكتب دالة اسمها doubleNumber تستقبل معاملاً واحداً num وتطبع في الكونسول ضعف الرقم (num * 2). ثم استدعِ الدالة بالرقم 7.',
        hint: 'function doubleNumber(num) { console.log(num * 2); } ثم استدعِ doubleNumber(7);',
        initialCode: `// اكتب تعريف الدالة واستدعاءها بالرقم 7 هنا بنفسك...
`,
        solutionCode: `function doubleNumber(num) {
  console.log(num * 2);
}
doubleNumber(7);`,
      },
    },
    {
      id: 12,
      partId: 4,
      partTitle: 'الجزء الرابع: الدوال',
      title: 'الفصل 12: إرجاع القيم (return)',
      subtitle: 'الخروج بالنتيجة: العصير في الكوباية!',
      summaryPoints: [
        'أمر return هو اللي بيخلي الدالة تسلّم النتيجة للمستدعي وتصب العصير في الكوباية.',
        'الفرق بين console.log (عرض للمشاهدة فقط) و return (إعطاء ناتج يمكن تخزينه واستخدامه برمجياً).',
        'الدالة التي لا تحتوي على return ترجع تلقائياً undefined.',
        'أمر return يعتبر بوابة خروج فورية؛ أي كود مكتوب بعده داخل الدالة لا ينفذ أبداً.',
      ],
      contentSections: [
        {
          heading: 'تشبيه الدليفري والكوباية: الفرق بين العرض والتسليم',
          text: `تخيل طلبت من عامل الدليفري في المطعم يروح يحسب لك إجمالي فاتورة العزومة..
لو العامل راح حسبها ووقف قدام المحل صرخ: "الفاتورة 400 جنيه!" (ده console.log).. وبعدين رجع لك البيت إيده فاضية ومعاهوش الفاتورة ولا الفلوس!
هل هتعرف تكمل حساباتك؟ لأ طبعاً!
إنت محتاج العامل يرجع لك ويسلمك الورقة في إيدك (ده return) عشان تاخد الرقم وتدفعه أو تخصم منه أو تقسمه على صحابك!

في البرمجة:
- console.log: مجرد شاشة عرض للعين عشان تشوف. البرنامج مبيعرفش يمسك القيمة المطبوعة دي.
- return: هي التسليم الحقيقي في اليد. بتخلي الدالة ترجع ناتج تقدر تخزنه في متغير وتستخدمه في باقي سطور البرنامج!`,
          codeSnippet: `// دالة بتطبع بس (إيدها فاضية)
function addWithLog(a, b) {
  console.log(a + b);
}

// دالة بتسلّم الناتج الحقيقي باليد
function addWithReturn(a, b) {
  return a + b;
}

const res1 = addWithLog(5, 5);    // هيطبع 10 في الكونسول
console.log("قيمة res1: ", res1); // undefined! لأنها مرجعتش حاجة!

const res2 = addWithReturn(5, 5); // استلمنا الـ 10 الحقيقية في الصندوق
console.log(res2 * 2);            // 20 (نقدر نضربها ونكمل حسابات عادي)`,
          callout: {
            type: 'common_mistake',
            title: 'اللغز الأكثر رعباً: undefined! 👻',
            content:
              'لو كتبت دالة ونسيت تحط كلمة return، وجيت تخزن ناتجها في متغير.. المتغير ده هيبقى جواه undefined فوراً! اتأكد إنك بترجع القيمة بـ return لو محتاج تستخدمها بره.',
          },
        },
        {
          heading: 'بوابة الخروج الفورية: أي كود بعد return ميت! 🚪',
          text: `كلمة return في لغة جافاسكريبت بتعمل حاجتين في نفس الفيمتو ثانية:
1. بتسلّم القيمة المطلوبة للي نادى الدالة.
2. بتقفل باب الدالة بالمفتاح وتخرج منها فوراً وتوقف تنفيذ أي سطر بعدها!

أي سطر كود تكتبه تحت كلمة return داخل نفس البلوك بيتسمى في عالم البرمجة "Unreachable Code" (كود ميت مستحيل الوصول إليه).`,
          codeSnippet: `function checkAccess(age) {
  if (age < 18) {
    return "ممنوع الدخول: العمر أقل من السن القانوني";
    console.log("السطر ده مستحيل يتنفذ في الدنيا!"); // كود ميت
  }

  return "أهلاً بك، تفضل بالدخول";
}

console.log(checkAccess(15)); // هيخرج فوراً عند السطر الأول`,
        },
        {
          heading: 'تخزين ناتج الدالة واستخدامه في قرارات وشروط',
          text: `القوة العظمى للدوال المرجعة (Returning Functions) إنك بتعامل استدعاء الدالة كأنه القيمة نفسها بالضبط!
تقدر تحط استدعاء الدالة جوه جملة if، أو تجمعه مع متغير تاني، أو حتى تمرره كمدخل لدالة تانية:`,
          codeSnippet: `function calculateTax(amount) {
  return amount * 0.14; // ضريبة القيمة المضافة 14%
}

function calculateFinalTotal(price) {
  const tax = calculateTax(price); // استدعاء دالة جوه دالة!
  return price + tax;
}

const total = calculateFinalTotal(1000);
console.log("الإجمالي بعد الضريبة: " + total + " جنيه"); // 1140 جنيه`,
        },
      ],
      exercises: [
        {
          id: 'ch12-ex1',
          title: 'التمرين 1: دالة الجمع والإرجاع',
          code: `function sum(a, b) {
  return a + b;
}
const result = sum(3, 4);
console.log(result);`,
          expectedOutput: `7`,
          explanation: 'الدالة تحسب المجموع وترجعه بـ return ليُخزن في المتغير.',
        },
        {
          id: 'ch12-ex2',
          title: 'التمرين 2: فحص الكود الميت بعد return',
          code: `function test() {
  return "أنا النتيجة";
  console.log("لن أظهر أبداً");
}
console.log(test());`,
          expectedOutput: `أنا النتيجة`,
          explanation: 'تنفيذ الدالة يتوقف فوراً عند مصادفة كلمة return.',
        },
      ],
      quiz: [
        {
          id: 'ch12-q1',
          question:
            'إيه الفرق الأساسي بين console.log و return داخل الدالة؟',
          options: [
            {
              id: 'a',
              text: 'console.log تعرض فقط على الشاشة، بينما return تُرجع قيمة يمكن تخزينها واستخدامها برمجياً',
              isCorrect: true,
              explanation:
                'صح جداً! 👏 return هي اللي بتسلم النتيجة ليدك عشان تكمل بيها حسابات.',
            },
            {
              id: 'b',
              text: 'مفيش أي فرق بينهم',
              isCorrect: false,
              explanation: 'فرق شاسع جداً ومصدر رئيسي لأخطاء المبتدئين.',
            },
            {
              id: 'c',
              text: 'return مخصصة للأرقام فقط',
              isCorrect: false,
              explanation: 'return ترجع أي نوع: نصوص، أرقام، مصفوفات، وغيرها.',
            },
          ],
        },
        {
          id: 'ch12-q2',
          question: 'لو دالة مفيهاش أمر return خالص، واستدعيناها.. قيمتها إيه؟',
          options: [
            {
              id: 'a',
              text: 'undefined',
              isCorrect: true,
              explanation:
                'ممتاز! 💡 أي دالة بدون return بترجع undefined كقيمة افتراضية.',
            },
            {
              id: 'b',
              text: '0',
              isCorrect: false,
              explanation: 'الصفر قيمة رقمية حقيقية.',
            },
            {
              id: 'c',
              text: 'null',
              isCorrect: false,
              explanation: 'null تدل على تفريغ مقصود، بينما الافتراضي هو undefined.',
            },
          ],
        },
      ],
      challenge: {
        id: 'ch12-chal',
        title: 'وريني شطارتك 🧠: حاسبة مساحة المستطيل',
        prompt:
          'اكتب دالة اسمها getArea تقبل معاملي الطول w والعرض h وترجع (return) مساحة المستطيل (w * h). ثم خزن ناتج getArea(5, 4) في متغير واطبعه.',
        hint: 'return w * h; ثم const area = getArea(5, 4); console.log(area);',
        initialCode: `// اكتب دالة getArea واستدعاءها وطباعة الناتج هنا بنفسك...
`,
        solutionCode: `function getArea(w, h) {
  return w * h;
}
const area = getArea(5, 4);
console.log(area);`,
      },
    },
    {
      id: 13,
      partId: 4,
      partTitle: 'الجزء الرابع: الدوال',
      title: 'الفصل 13: نطاق المتغيرات (Scope)',
      subtitle: 'مين شايف مين؟ الصالة vs الأوضة المقفولة',
      summaryPoints: [
        'النطاق (Scope) هو حدود المنطقة اللي بيكون فيها المتغير معروفاً وقابلاً للقراءة.',
        'النطاق العام (Global Scope): المتغيرات المعرفة في الهواء الطلق بتتشاف من أي مكان في الملف.',
        'النطاق المحلي (Block Scope): المتغيرات المعرفة داخل { } بتعيش وتموت جوه القوسين ومحدش بره بيشوفها.',
        'محاولة استخدام متغير محلي من خارج غرفته بتسبب خطأ ReferenceError: is not defined.',
      ],
      contentSections: [
        {
          heading: 'تشبيه الصالة الكبيرة والأوضة المقفولة بالمفتاح',
          text: `تخيل شقة فيها صالة كبيرة واسعة، وفيها أوضة نوم مقفولة بالمفتاح:
- لو علقت ساعة حائط في الصالة الكبيرة (Global Scope): أي شخص قاعد في الصالة أو خارج من أي أوضة هيشوف الساعة دي بوضوح ويقدر يعرف الوقت منها.
- لو حطيت ساعتك الخاصة على الكومودينو جوه أوضة النوم وقفلت الباب (Block Scope): هل الضيف اللي قاعد في الصالة بره يقدر يمد إيده وياخد الساعة دي من وراء الباب المقفول؟ مستحيل!

في البرمجة، الأقواس المعقوصة { } لأي دالة أو جملة if أو for هي بالظبط "أوضة النوم المقفولة بالمفتاح".
أي متغير تعرفه بـ let أو const داخل { } هو متغير محلي خاص جداً، بيعيش ويموت جوه الأقواس دي ومحدش بره بيعرف عنه أي حاجة!`,
          codeSnippet: `// متغير عام في الصالة (Global)
const schoolName = "مدرسة النوابغ";

function showInfo() {
  // متغير محلي جوه الأوضة (Local / Block Scope)
  const studentSecret = "123456";
  console.log(schoolName);    // مسموح ✅: شايفين الصالة من جوه الأوضة
  console.log(studentSecret); // مسموح ✅: إحنا جوه نفس الأوضة
}

showInfo();
// console.log(studentSecret); // ❌ خطأ ReferenceError: studentSecret is not defined!`,
        },
        {
          heading: 'قواعد الرؤية: مين يقدر يشوف مين؟',
          text: `القاعدة الذهبية للنطاقات في جافاسكريبت:
"اللي جوه الأقواس يقدر يبص بره ويشوف المتغيرات العامة.. لكن اللي بره الأقواس مستحيل يبص جوه ويشوف المتغيرات المحلية!".

الميزة العبقرية للنطاق إنه بيحمي برامجك:
تقدر تسمي متغير i جوه حلقة، ومتغير i تاني جوه حلقة تانية خالص، والاتنين مش هيضربوا في بعض ولا هيتلخبطوا، لأن كل واحد عايش في غرفته المستقلة!`,
          codeSnippet: `function calculateDiscount() {
  const discount = 20; // خاص بهذه الدالة فقط
  return discount;
}

function calculateBonus() {
  const discount = 50; // مسموح تماماً! اسم مكرر في غرفة مستقلة
  return discount;
}`,
          callout: {
            type: 'insight',
            title: 'ليه المتغيرات بتموت لما الدالة تخلص؟ 🧹',
            content:
              'الكمبيوتر ذكي وموفر في الذاكرة (RAM): أول ما الدالة تخلص شغلها، مكنسة جافاسكريبت (Garbage Collector) بتمسح كل المتغيرات المحلية اللي كانت جوه الأقواس عشان تفضي مساحة للجهاز!',
          },
        },
        {
          heading: 'مطب حجب الأسماء (Variable Shadowing)',
          text: `لو عندك متغير عام في الصالة اسمه name، وجيت جوه دالة وعرفت متغير تاني بـ let اسمه برضه name:
المتغير المحلي جوه الدالة هيحجب (Shadow) المتغير العام وهيشتغل هو، بينما المتغير العام هيفضل سليم بره ومش هيتأثر.`,
          codeSnippet: `let hero = "سوبرمان"; // في الصالة

function enterBatcave() {
  let hero = "باتمان"; // حجب البطل العام داخل هذه الغرفة
  console.log("البطل الحالي: " + hero); // باتمان
}

enterBatcave();
console.log("البطل في العالم الخارجي: " + hero); // سوبرمان (لم يتغير!)`,
        },
      ],
      exercises: [
        {
          id: 'ch13-ex1',
          title: 'التمرين 1: قراءة المتغير العام',
          code: `const app = "CodeMasr";
function showApp() {
  console.log(app);
}
showApp();`,
          expectedOutput: `CodeMasr`,
          explanation: 'الدالة تصل للمتغير العام بكل سهولة.',
        },
      ],
      quiz: [
        {
          id: 'ch13-q1',
          question:
            'لو عرّفنا let x = 10 جوه دالة، وحاولنا نطبع console.log(x) بره الدالة.. إيه اللي هيحصل؟',
          options: [
            {
              id: 'a',
              text: 'هيطلع خطأ ReferenceError: x is not defined لأن x محلي داخل الدالة فقط',
              isCorrect: true,
              explanation:
                'صح جداً! 👏 المتغير المحلي مقفول عليه جوه الأقواس ومحدش بره يقدر يوصله.',
            },
            {
              id: 'b',
              text: 'هيطبع 10 عادي',
              isCorrect: false,
              explanation: 'لا يمكن الوصول للمتغيرات المحلية من الخارج.',
            },
            {
              id: 'c',
              text: 'هيطبع undefined',
              isCorrect: false,
              explanation: 'المتغير غير موجود أساساً في هذا النطاق فينتج ReferenceError.',
            },
          ],
        },
      ],
      challenge: {
        id: 'ch13-chal',
        title: 'وريني شطارتك 🧠: حماية سر اللعبة',
        prompt:
          'اكتب دالة اسمها startGame تعرف داخلها متغيراً محلياً const secretCode = 999؛ وتطبع "اللعبة بدأت". تأكد من أن secretCode لا يتسرب خارج الدالة.',
        hint: 'ضع تعريف المتغير داخل جسم الدالة واستدعِ startGame();',
        initialCode: `// اكتب دالة startGame مع المتغير المحلي السري هنا بنفسك...
`,
        solutionCode: `function startGame() {
  const secretCode = 999;
  console.log("اللعبة بدأت");
}
startGame();`,
      },
    },
    {
      id: 14,
      partId: 4,
      partTitle: 'الجزء الرابع: الدوال',
      title: 'الفصل 14: مشروع صغير — لعبة تخمين رقم',
      subtitle: 'دمج الشروط والحلقات والدوال في محاكاة لمنطق اللعبة',
      summaryPoints: [
        'المشاريع بتبدأ بالتخطيط المنطقي (Algorithm) قبل كتابة أول سطر كود.',
        'دمج Math.random لتوليد رقم سري مع الشروط والدوال.',
        'الدالة بتفحص التخمين وترجع تلميح: أكبر، أصغر، أو مبروك.',
        'محاكاة كذا محاولة مكتوبة مسبقاً ومراجعة النتيجة.',
      ],
      contentSections: [
        {
          heading: 'فكرة اللعبة وبناء دالة الفحص (Algorithm)',
          text: `حان وقت التتويج يا بطل! 🏆
في الفصول السابقة اتعلمنا:
- المتغيرات وأنواع البيانات (Part 1).
- الشروط وقرارات if و else (Part 2).
- الحلقات التكرارية for و while (Part 3).
- الدوال وتوليد الأرقام العشوائية مع Math (Part 4).

الآن هنجمع كل القطع دي في محاكاة لمنطق "لعبة تخمين الرقم السري (Guess The Number)". دي تجربة بتخمينات مكتوبة في الكود، مش إدخال مباشر من اللاعب.
فكرة المحاكاة:
1. الكمبيوتر هيختار رقم سري عشوائي في سره بين 1 و 10 باستخدام Math.random و Math.floor.
2. عندنا دالة اسمها checkGuess بتاخد تخمين اللاعب كمعامل (parameter).
3. الدالة بتفحص التخمين وترجع تلميحاً مناسباً:
   - لو التخمين مساوي للرقم السري: ترجع "🎉 كسبت! ده الرقم المظبوط".
   - لو التخمين أصغر من الرقم السري: ترجع "⬆️ الرقم السري أكبر من كده، حاول مرة تانية.".
   - لو التخمين أكبر من الرقم السري: ترجع "⬇️ الرقم السري أصغر من كده، حاول مرة تانية.".`,
          codeSnippet: `// 1. توليد الرقم السري العشوائي بين 1 و 10
const secretNumber = Math.floor(Math.random() * 10) + 1;

// 2. دالة فحص التخمين
function checkGuess(playerGuess) {
  if (playerGuess === secretNumber) {
    return "🎉 كسبت! التخمين صحيح بالظبط.";
  } else if (playerGuess < secretNumber) {
    return "⬆️ الرقم السري أكبر، حاول مرة تانية.";
  } else {
    return "⬇️ الرقم السري أصغر، حاول مرة تانية.";
  }
}

console.log("تم تجهيز اللعبة بنجاح! جاهز للتخمين 🎯");`,
        },
        {
          heading: 'تشغيل اللعبة ومحاكاة محاولات اللاعب',
          text: `تعال نجرب نشغل اللعبة ونستدعي دالة checkGuess اللي جهزناها في الصندوق السابق بتخمينات مختلفة:`,
          codeSnippet: `// محاكاة لاعب بيخمن تخمينات ورا بعض مستخدماً الدالة والرقم السري من الصندوق السابق:
console.log("تخمين 3: " + checkGuess(3));
console.log("تخمين 7: " + checkGuess(7));
console.log("الرقم السري كان: " + secretNumber);`,
          callout: {
            type: 'celebration',
            title: 'إنجاز عظيم! 🌟',
            content:
              'لاحظ إزاي المحاكاة جمعت المفاهيم اللي اتعلمتها: متغيرات، دوال، شروط مقارنة، وقيم مرجعة. دي محاكاة للمنطق؛ إدخال تخمينات اللاعب مباشرة محتاج واجهة وتفاعل هنتعلمهم بعدين.',
          },
        },
      ],
      exercises: [
        {
          id: 'ch14-ex1',
          title: 'التمرين 1: تجربة منطق مقارنة الأرقام',
          code: `const target = 7;
const guess = 5;
if (guess === target) {
  console.log("صح");
} else if (guess < target) {
  console.log("أكبر");
} else {
  console.log("أصغر");
}`,
          expectedOutput: `أكبر`,
          explanation:
            'التخمين 5 أصغر من الهدف 7، فيعطي تلميحاً بأن الرقم أكبر.',
        },
      ],
      quiz: [
        {
          id: 'ch14-q1',
          question:
            'عشان نعمل لعبة التخمين صح، إيه أفضل ترتيب لمنطق فحص التخمين؟',
          options: [
            {
              id: 'a',
              text: 'فحص التساوي أولاً (الفوز)، ثم فحص هل الرقم أصغر، ثم البديل أنه أكبر',
              isCorrect: true,
              explanation:
                'صح جداً! 👏 بنبدأ بشرط الفوز والانتهاء، ثم نعطي التلميحات المساعدة.',
            },
            {
              id: 'b',
              text: 'فحص أكبر دائماً فقط',
              isCorrect: false,
              explanation: 'لو فحصنا اتجاه واحد مش هنعرف لو اللاعب كسب.',
            },
            {
              id: 'c',
              text: 'تخمين عشوائي بدون شروط',
              isCorrect: false,
              explanation: 'البرمجة مبنية على منطق محدد وشروط واضحة.',
            },
          ],
        },
      ],
      challenge: {
        id: 'ch14-chal',
        title: 'وريني شطارتك 🧠: فاحص التخمين الصارم',
        prompt:
          'اكتب كوداً يحدد const secret = 6 و const guess = 6؛ فإذا كان guess مساوياً لـ secret يطبع "مبروك كسبت"، وغير ذلك يطبع "حاول تاني".',
        hint: 'if (guess === secret) { console.log("مبروك كسبت"); } else { console.log("حاول تاني"); }',
        initialCode: `// اكتب كود فحص التخمين السري هنا بنفسك...
`,
        solutionCode: `const secret = 6;
const guess = 6;
if (guess === secret) {
  console.log("مبروك كسبت");
} else {
  console.log("حاول تاني");
}`,
      },
    },
  ],
};
