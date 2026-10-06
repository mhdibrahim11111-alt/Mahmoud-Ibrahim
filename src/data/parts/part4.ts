import { Part } from '../../types';

export const part4: Part = {
  id: 4,
  title: 'الجزء الرابع: الدوال',
  subtitle: 'الخلّاط السحري اللي بيوفر وقتك ومجهودك',
  description:
    'تنظيم الكود وإعادة استخدامه عبر الدوال، المدخلات (Parameters)، القيمة المرتجعة (return)، ونطاق المتغيرات (Scope)، وبناء لعبة التخمين الذكية.',
  iconName: 'Cpu',
  bugHunter: {
    id: 'bug-part-4',
    partId: 4,
    title: 'كويز: لغز الخصم التائه (الطباعة أم الإرجاع؟)',
    context:
      'الكود ده المفروض يحسب سعر المنتج بعد خصم 50% ويفحص لو كان العرض قوياً، لكنه لا يستخدم ناتج الحساب في الشرط بسبب غياب return!',
    problemCode: `function applyDiscount(price, discountPercent) {
  const discountAmount = (price * discountPercent) / 100;
  console.log(price - discountAmount);
}

const finalPrice = applyDiscount(200, 50);

if (finalPrice < 150) {
  console.log("عرض قوي جداً! 🛒🔥");
} else {
  console.log("عرض عادي أو غير صالح");
}`,
    bugLineNumber: 3,
    bugDescription:
      'الدالة قامت بطباعة السعر بـ console.log بدلاً من إرجاعه بـ return، فكانت قيمة finalPrice هي undefined.',
    whyItHappens:
      'الدالة التي لا تحتوي على أمر return صريح ترجع تلقائياً undefined. المتغير finalPrice استلم undefined، ومقارنة undefined < 150 تنتج false دائماً، فيتجه الكود لـ else!',
    fixedCode: `function applyDiscount(price, discountPercent) {
  const discountAmount = (price * discountPercent) / 100;
  return price - discountAmount; // رجّع القيمة للمستدعي في إيده!
}

const finalPrice = applyDiscount(200, 50);

if (finalPrice < 150) {
  console.log("عرض قوي جداً! 🛒🔥");
} else {
  console.log("عرض عادي أو غير صالح");
}`,
    expectedCorrectOutput: `عرض قوي جداً! 🛒🔥`,
    hints: [
      'ما هي القيمة الفعلية للمتغير finalPrice بعد استدعاء الدالة؟',
      'هل الدالة تسلّم ناتجاً بـ return أم تكتفي بالطباعة على الشاشة فقط؟',
      'استبدل console.log داخل الدالة بأمر return لتسليم الناتج.',
    ],
  },
  chapters: [
    {
      id: 13,
      partId: 4,
      partTitle: 'الجزء الرابع: الدوال',
      title: 'الفصل 13: الدوال الجاهزة (Math)',
      subtitle: 'صندوق العدة الرياضي والأرقام العشوائية',
      summaryPoints: [
        'كائن Math هو صندوق أدوات جاهز مدمج في JavaScript بدون الحاجة لتثبيت أي مكتبات خارجية.',
        'عائلة التقريب الثلاثية: Math.round (التقريب العادل)، Math.floor (النزول للأرض وقطع الكسر)، Math.ceil (الطلوع للسقف دائماً).',
        'دالتا Math.max و Math.min لمعرفة أكبر وأصغر قيمة بلمح البصر.',
        'الدالة السحرية Math.random() لتوليد أرقام عشوائية ومعادلة المدى الذهبية لحجر النرد والألعاب.',
      ],
      contentSections: [
        {
          heading: 'يعني إيه دالة جاهزة في JavaScript؟ (كائن Math)',
          text: `تخيل لو كل مرة محتاج تحسب جذر تربيعي أو تطلع رقم عشوائي في لعبتك، كنت مضطر تكتب 50 سطر كود ومعادلات معقدة من الصفر!
لحسن الحظ يا صديقي، مطورو لغة JavaScript بنوا لنا "صندوق عدة سحري جاهز" اسمه كائن الرياضيات (Math Object).
صندوق Math موجود دايماً في الذاكرة بدون أي تثبيت؛ كل اللي بتعمله إنك بتنادي اسم الصندوق متبوعاً بنقطة واسم الأداة المطلوبة: Math.something().`,
          codeSnippet: `// أدوات Math السريعة والمباشرة
console.log(Math.PI);          // 3.141592653589793 (النسبة التقريبية ط)
console.log(Math.sqrt(25));    // 5 (الجذر التربيعي لـ 25)
console.log(Math.pow(2, 4));   // 16 (2 أس 4)`,
        },
        {
          heading: 'عائلة التقريب الثلاثية: round و floor و ceil',
          text: `الكسور العشرية في الفلوس والحسابات بتعمل دوشة يا صديقي، وعشان كده بنحتاج نقربها لأرقام صحيحة واضحة.
عندنا 3 أدوات تقريب أساسية لازم تفرق بينهم زي اسمك:
1. Math.round (التقريب العادل): بيبص على الكسر؛ لو 0.5 أو أكتر يقرب للأعلى، لو أقل من 0.5 يقرب للأسفل.
2. Math.floor (النزول للأرض دايماً): كلمة Floor يعني أرضية؛ بيقطع الكسر وينزل لأقرب عدد صحيح أصغر مهما كان الكسر كبيراً! (حتى لو 9.99 هتبقى 9).
3. Math.ceil (الطلوع للسقف دايماً): كلمة Ceil يعني سقف؛ بيقرب للعدد الصحيح الأكبر فوراً لو في أي كسر مهما كان صغيراً (حتى لو 4.01 هتبقى 5).`,
          codeSnippet: `console.log(Math.round(4.4)); // 4 (أقل من النصف ينزل)
console.log(Math.round(4.5)); // 5 (النصف تماماً يقرب لفوق)

console.log(Math.floor(7.99)); // 7 (نزل للأرض وقطع الكسر تماماً)
console.log(Math.ceil(2.01));  // 3 (طلع للسقف بمجرد وجود كسر بسيط)`,
          callout: {
            type: 'tip',
            title: 'تشبيه الأسانسير 🛗',
            content:
              'افتكر دايماً يا صديقي: floor بتدوس على زرار الدور الأرضي فتنزل تحت، و ceil بتدوس على زرار السطح فتطلع فوق، و round هو الساكن العادل اللي بيشوف إنت أقرب لأنهي دور!',
          },
        },
        {
          heading: 'إيجاد الفائز: Math.max و Math.min',
          text: `لو عندك درجات 5 طلاب أو أسعار 4 عروض وعايز تعرف أعلى وأقل قيمة بضغطة زرار واحدة:
Math.max(a, b, c, ...) بترجع لك أكبر رقم فوراً.
Math.min(a, b, c, ...) بترجع لك أصغر رقم فوراً.`,
          codeSnippet: `const price1 = 120;
const price2 = 450;
const price3 = 85;

const bestPrice = Math.min(price1, price2, price3);
const highestPrice = Math.max(price1, price2, price3);

console.log("أرخص سعر: " + bestPrice + " جنيه");  // 85 جنيه
console.log("أغلى سعر: " + highestPrice + " جنيه"); // 450 جنيه`,
        },
        {
          heading: 'الساحر الأكبر: Math.random() وصناعة حجر النرد 🎲',
          text: `الدالة Math.random() بتولد رقم عشوائي كسر عشري غريب بين 0 (مشمول) و 1 (غير مشمول)، زي مثلاً: 0.738291.
طب إزاي نحول الكسر العشري ده لرقم حقيقي في لعبة، زي حجر النرد (من 1 إلى 6)؟
المعادلة السحرية المكونة من 3 خطوات:
1. اضرب الناتج في 6: الرقم الكسر هيتحول لرقم بين 0 و 5.999.
2. اقطع الكسور بـ Math.floor: الناتج هيبقى (0 أو 1 أو 2 أو 3 أو 4 أو 5).
3. زوّد 1 في الآخر: الناتج النهائي هيبقى رقم صحيح عشوائي بين 1 و 6 بالتمام والكمال!`,
          codeSnippet: `// 1. رمي حجر النرد في لعبة السلم والتعبان (من 1 إلى 6)
const diceRoll = Math.floor(Math.random() * 6) + 1;
console.log("🎲 نتيجة رمي النرد: " + diceRoll);

// 2. توليد رقم عشوائي بين 1 و 100 لقرعة الجوائز
const luckyNumber = Math.floor(Math.random() * 100) + 1;
console.log("🎉 رقم الحظ الفائز: " + luckyNumber);`,
          callout: {
            type: 'celebration',
            title: 'معادلة الألعاب الذهبية 🌟',
            content:
              'قاعدة عامة احفظها يا صديقي: عشان تولد أي رقم عشوائي بين min و max:\nMath.floor(Math.random() * (max - min + 1)) + min;\nالسطر ده هو سر برمجة كل ألعاب الحظ وتوزيع المكافآت!',
          },
        },
      ],
      exercises: [
        {
          id: 'ch13-ex1',
          title: 'التمرين 1: مقارنة دوال التقريب الثلاثية',
          code: `console.log(Math.round(3.5));
console.log(Math.floor(3.99));
console.log(Math.ceil(3.01));`,
          expectedOutput: `4\n3\n4`,
          explanation:
            'round تقرب 3.5 إلى 4، و floor تنزل بـ 3.99 إلى 3، و ceil ترفع 3.01 إلى 4.',
        },
        {
          id: 'ch13-ex2',
          title: 'التمرين 2: استخراج أعلى وأدنى درجة في الاختبار',
          code: `const maxGrade = Math.max(88, 95, 72, 100);
const minGrade = Math.min(88, 95, 72, 100);
console.log("أعلى درجة: " + maxGrade);
console.log("أقل درجة: " + minGrade);`,
          expectedOutput: `أعلى درجة: 100\nأقل درجة: 72`,
          explanation: 'دالة Math.max تعيد 100 ودالة Math.min تعيد 72 مباشرة.',
        },
      ],
      quiz: [
        {
          id: 'ch13-q1',
          question: 'الدالة Math.floor(8.99) هترجع إيه بالظبط يا صديقي؟',
          options: [
            {
              id: 'a',
              text: '8',
              isCorrect: true,
              explanation:
                'صح جداً وبرافو عليك يا صديقي! 👏 Math.floor بتنزل للأرض وتقطع الكسور تماماً بدون ما تبص لقيمتها.',
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
          id: 'ch13-q2',
          question:
            'عشان نولد رقم عشوائي صحيح بين 1 و 6 (زي حجر النرد)، بنكتب إيه؟',
          options: [
            {
              id: 'a',
              text: 'Math.floor(Math.random() * 6) + 1',
              isCorrect: true,
              explanation:
                'إجابة عبقرية يا صديقي! 🎲 بنضرب في 6 ونقطع الكسر بـ floor ونزود 1 عشان نبدأ من 1 مش من 0.',
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
        {
          id: 'ch13-q3',
          question: 'لو كتبنا Math.ceil(5.001)، النتيجة هتكون إيه؟',
          options: [
            {
              id: 'a',
              text: '6 (لأن ceil بتطلع للسقف بمجرد وجود أي كسر مهما كان صغيراً)',
              isCorrect: true,
              explanation:
                'ممتاز جداً يا صديقي! 🌟 كلمة ceil يعني سقف، فأي زيادة عشرية ترفع الرقم للعدد الصحيح التالي فوراً.',
            },
            {
              id: 'b',
              text: '5',
              isCorrect: false,
              explanation: 'كانت هتبقى 5 لو استخدمنا Math.floor أو Math.round.',
            },
            {
              id: 'c',
              text: '5.1',
              isCorrect: false,
              explanation: 'Math.ceil ترجع أعداداً صحيحة دائماً.',
            },
          ],
        },
      ],
      challenge: {
        id: 'ch13-chal',
        title: 'وريني شطارتك 🧠: قرعة رمي العملة (ملك أو كتابة)',
        prompt:
          'اكتب كوداً يولد رقماً عشوائياً صحيحاً بين 1 و 2؛ إذا كان الرقم 1 اطبع "ملك 👑"، وإذا كان 2 اطبع "كتابة 🦅".',
        hint: 'استخدم Math.floor(Math.random() * 2) + 1 ثم افحص القيمة بجملة if/else.',
        initialCode: `// اكتب كود رمي العملة المعدنية العشوائية هنا بنفسك...
`,
        solutionCode: `const coin = Math.floor(Math.random() * 2) + 1;
if (coin === 1) {
  console.log("ملك 👑");
} else {
  console.log("كتابة 🦅");
}`,
      },
    },
    {
      id: 14,
      partId: 4,
      partTitle: 'الجزء الرابع: الدوال',
      title: 'الفصل 14: كتابة دالة (Functions)',
      subtitle: 'الخلّاط السحري: اسم، مدخلات، وتنفيذ',
      summaryPoints: [
        'الدالة (Function) هي وصفة برمجية بنكتبها مرة واحدة ونستدعيها كل ما نحتاجها بدون تكرار.',
        'بنعلن عن الدالة بكلمة function متبوعة باسمها وأقواس معقوصة { } تحتوي الأوامر.',
        'كتابة الدالة لا تعني تشغيلها؛ لازم نستدعيها بالاسم والأقواس: myFunction().',
        'المعاملات (Parameters) بتسمح للدالة باستقبال بيانات متغيرة في كل استدعاء.',
      ],
      contentSections: [
        {
          heading: 'تشبيه الخلاط الكهربائي ومصنع الكيك: يعني إيه دالة؟',
          text: `لو عندك وصفة عمل كيكة شيكولاتة لذيذة يا صديقي..
هل كل يوم خميس هتقعد تخترع خطوات الوصفة من الصفر؟ ولا بتفتح الكراس اللي فيه الوصفة الثابتة، وبتتبع الخطوات بنفس الترتيب؟
الخلاط الكهربائي في المطبخ نفس الفكرة: هو متصنع وجاهز؛ إنت بتفتحه، تحط الموز واللبن، تدوس على الزرار، يشتغل ويطلع العصير!

في البرمجة، "الدالة (Function)" هي بالظبط الخلاط ده:
مجموعة أسطر كود بتعمل مهمة معينة، بنديها اسم مميز، وبنحفظها عشان نقدر نشغلها في أي سطر في البرنامج بكلمة واحدة بدل ما نكرر كتابة نفس الـ 20 سطر كل شوية!`,
          codeSnippet: `// 1. صناعة الدالة (الوصفة)
function sayHello() {
  console.log("👋 مرحباً بك في أكاديمية زكي كود!");
  console.log("نتمنى لك رحلة برمجية ممتعة.");
}

// 2. تشغيل الدالة واستدعاؤها
sayHello();
sayHello(); // تقدر تناديها مليون مرة بدون تكرار الكود!`,
        },
        {
          heading: 'الفرق الخطير بين الإعلان (Declaration) والاستدعاء (Call)',
          text: `أكبر سوء فهم بيحصل في أول أسبوع برمجة يا صديقي هو:
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

// استدعاء الدالة بمقادير مختلفة في كل مرة
greetUser("عمر");
greetUser("مريم");
greetUser("مصطفى");`,
        },
        {
          heading: 'دوال بمدخلات متعددة وقيم افتراضية ومبدأ DRY',
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
              'في البرمجة عندنا قاعدة عالمية اسمها DRY: اختصار لـ Don\'t Repeat Yourself (متكررش نفسك يا صديقي). كل ما تلاقي نفسك نسخت كود أكتر من مرتين، حطه جوه دالة فوراً!',
          },
        },
      ],
      exercises: [
        {
          id: 'ch14-ex1',
          title: 'التمرين 1: دالة الترحيب البسيطة',
          code: `function welcome() {
  console.log("أهلاً بكم في عالم الجافاسكريبت!");
}
welcome();`,
          expectedOutput: `أهلاً بكم في عالم الجافاسكريبت!`,
          explanation: 'تعريف الدالة ثم استدعاؤها بالقوسين ().',
        },
        {
          id: 'ch14-ex2',
          title: 'التمرين 2: دالة الترحيب بالاسم المخصص',
          code: `function greet(name) {
  console.log("مرحباً يا " + name);
}
greet("أحمد");
greet("سارة");`,
          expectedOutput: `مرحباً يا أحمد\nمرحباً يا سارة`,
          explanation:
            'الدالة تقبل المعامل name وتستخدمه داخل جملة الطباعة في كل استدعاء.',
        },
      ],
      quiz: [
        {
          id: 'ch14-q1',
          question:
            'ليه لما نكتب function doWork() { console.log("done"); } مفيش حاجة بتطبع في الشاشة؟',
          options: [
            {
              id: 'a',
              text: 'لأننا فقط عرّفنا الدالة ولم نستدعها بعد باستخدام doWork()',
              isCorrect: true,
              explanation:
                'صح جداً وبرافو عليك يا صديقي! 👏 لازم تنادي الدالة بالاسم والأقواس عشان الكمبيوتر ينفذ اللي جواها.',
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
          id: 'ch14-q2',
          question: 'إيه هو الـ Parameter في الدالة يا صديقي؟',
          options: [
            {
              id: 'a',
              text: 'المتغير اللي بنستقبل بيه المدخلات بين قوسي الدالة أثناء بنائها',
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
              explanation: 'الناتج بيتم إرجاعه بأمر return.',
            },
          ],
        },
        {
          id: 'ch14-q3',
          question: 'ما هو الهدف الأساسي من مبدأ DRY (Don\'t Repeat Yourself)؟',
          options: [
            {
              id: 'a',
              text: 'تجنب تكرار الكود وتجميعه في دوال قابلة لإعادة الاستخدام بسهولة',
              isCorrect: true,
              explanation:
                'أحسنت يا صديقي! 🎯 تقليل التكرار بيخلي الكود أنظف وأسهل في التعديل والصيانة.',
            },
            {
              id: 'b',
              text: 'منع استخدام الحلقات التكرارية',
              isCorrect: false,
              explanation: 'الحلقات والدوال كلاهما أدوات أساسية لا غنى عنها.',
            },
            {
              id: 'c',
              text: 'تسريع تحميل المتصفح فقط',
              isCorrect: false,
              explanation: 'هو مبدأ تنظيمي وهندسي لبناء كود احترافي.',
            },
          ],
        },
      ],
      challenge: {
        id: 'ch14-chal',
        title: 'وريني شطارتك 🧠: دالة مضاعفة الرقم',
        prompt:
          'اكتب دالة اسمها doubleNumber تستقبل معاملاً واحداً num وتطبع في الكونسول ضعف الرقم (num * 2). ثم استدعِ الدالة بالرقم 7.',
        hint: 'function doubleNumber(num) { console.log(num * 2); } ثم استدعِ doubleNumber(7);',
        initialCode: `// اكتب تعريف دالة doubleNumber واستدعاءها بالرقم 7 هنا بنفسك...
`,
        solutionCode: `function doubleNumber(num) {
  console.log(num * 2);
}
doubleNumber(7);`,
      },
    },
    {
      id: 15,
      partId: 4,
      partTitle: 'الجزء الرابع: الدوال',
      title: 'الفصل 15: إرجاع القيم (return)',
      subtitle: 'الخروج بالنتيجة: العصير في الكوباية!',
      summaryPoints: [
        'أمر return هو اللي بيخلي الدالة تسلّم النتيجة للمستدعي وتصب العصير في الكوباية.',
        'الفرق بين console.log (عرض للمشاهدة فقط) و return (إعطاء ناتج يمكن تخزينه واستخدامه برمجياً).',
        'الدالة التي لا تحتوي على return ترجع تلقائياً undefined.',
        'أمر return يعتبر بوابة خروج فورية؛ أي كود مكتوب بعده داخل الدالة لا ينفذ أبداً (Unreachable Code).',
      ],
      contentSections: [
        {
          heading: 'تشبيه الدليفري والكوباية: الفرق بين العرض والتسليم',
          text: `تخيل لو طلبت من عامل الدليفري في المطعم يروح يحسب لك إجمالي فاتورة العزومة يا صديقي..
لو العامل راح حسبها ووقف قدام المحل صرخ: "الفاتورة 400 جنيه!" (ده console.log).. وبعدين رجع لك البيت إيده فاضية ومعاهوش الفاتورة ولا الفلوس!
هل هتعرف تكمل حساباتك أو تدفع؟ لأ طبعاً!
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
              'لو كتبت دالة ونسيت تحط كلمة return يا صديقي، وجيت تخزن ناتجها في متغير.. المتغير ده هيبقى جواه undefined فوراً! اتأكد إنك بترجع القيمة بـ return لو محتاج تستخدمها بره.',
          },
        },
        {
          heading: 'بوابة الخروج الفورية: أي كود بعد return ميت! 🚪',
          text: `كلمة return في لغة JavaScript بتعمل حاجتين في نفس الفيمتو ثانية:
1. بتسلّم القيمة المطلوبة للي نادى الدالة.
2. بتقفل باب الدالة بالمفتاح وتخرج منها فوراً وتوقف تنفيذ أي سطر بعدها!

أي سطر كود تكتبه تحت كلمة return داخل نفس البلوك بيتسمى في عالم البرمجة "Unreachable Code" (كود ميت مستحيل الوصول إليه).`,
          codeSnippet: `function checkAccess(age) {
  if (age < 18) {
    return "ممنوع الدخول: العمر أقل من السن القانوني";
    console.log("السطر ده مستحيل يتنفذ في الدنيا!"); // كود ميت Unreachable
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
          id: 'ch15-ex1',
          title: 'التمرين 1: دالة الجمع والإرجاع باليد',
          code: `function sum(a, b) {
  return a + b;
}
const result = sum(3, 4);
console.log(result);`,
          expectedOutput: `7`,
          explanation: 'الدالة تحسب المجموع وترجعه بـ return ليُخزن في المتغير result.',
        },
        {
          id: 'ch15-ex2',
          title: 'التمرين 2: فحص الكود الميت بعد return',
          code: `function test() {
  return "أنا النتيجة الحقيقية";
  console.log("لن أظهر أبداً");
}
console.log(test());`,
          expectedOutput: `أنا النتيجة الحقيقية`,
          explanation: 'تنفيذ الدالة يتوقف ويخرج فوراً بمجرد الوصول لأمر return.',
        },
      ],
      quiz: [
        {
          id: 'ch15-q1',
          question:
            'إيه الفرق الأساسي بين console.log و return داخل الدالة يا صديقي؟',
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
          id: 'ch15-q2',
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
        {
          id: 'ch15-q3',
          question: 'ماذا يحدث لأي سطر كود مكتوب بعد أمر return داخل نفس الدالة؟',
          options: [
            {
              id: 'a',
              text: 'لن يتم تنفيذه أبداً لأنه كود غير قابل للوصول (Unreachable)',
              isCorrect: true,
              explanation:
                'برافو عليك يا صديقي! 🚪 return بتوقف تنفيذ الدالة وتخرج منها في نفس اللحظة.',
            },
            {
              id: 'b',
              text: 'سيتم تنفيذه في الخلفية',
              isCorrect: false,
              explanation: 'التنفيذ يتوقف كلياً داخل جسم الدالة.',
            },
            {
              id: 'c',
              text: 'سيعيد تشغيل الدالة من البداية',
              isCorrect: false,
              explanation: 'لا علاقة له بإعادة التشغيل.',
            },
          ],
        },
      ],
      challenge: {
        id: 'ch15-chal',
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
      id: 16,
      partId: 4,
      partTitle: 'الجزء الرابع: الدوال',
      title: 'الفصل 16: نطاق المتغيرات (Scope)',
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
          text: `تخيل شقة فيها صالة كبيرة واسعة، وفيها أوضة نوم مقفولة بالمفتاح يا صديقي:
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
          text: `القاعدة الذهبية للنطاقات في JavaScript يا صديقي:
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
          text: `لو عندك متغير عام في الصالة اسمه hero، وجيت جوه دالة وعرفت متغير تاني بـ let اسمه برضه hero:
المتغير المحلي جوه الدالة هيحجب (Shadow) المتغير العام وهيشتغل هو، بينما المتغير العام هيفضل سليم بره ومش هيتأثر.`,
          codeSnippet: `let hero = "سوبرمان"; // في الصالة العامة

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
          id: 'ch16-ex1',
          title: 'التمرين 1: قراءة المتغير العام من داخل الدالة',
          code: `const app = "ZakiCode";
function showApp() {
  console.log(app);
}
showApp();`,
          expectedOutput: `ZakiCode`,
          explanation: 'الدالة تصل للمتغير العام الموجود في النطاق الخارجي بكل سهولة.',
        },
        {
          id: 'ch16-ex2',
          title: 'التمرين 2: استقلال المتغيرات المحلية في دوال مختلفة',
          code: `function funcA() {
  const score = 10;
  return score;
}
function funcB() {
  const score = 20;
  return score;
}
console.log(funcA() + funcB());`,
          expectedOutput: `30`,
          explanation: 'كل دالة تملك نسختها الخاصة من المتغير المحلي score.',
        },
      ],
      quiz: [
        {
          id: 'ch16-q1',
          question:
            'لو عرّفنا let x = 10 جوه دالة، وحاولنا نطبع console.log(x) بره الدالة.. إيه اللي هيحصل يا صديقي؟',
          options: [
            {
              id: 'a',
              text: 'هيطلع خطأ ReferenceError: x is not defined لأن x محلي داخل الدالة فقط',
              isCorrect: true,
              explanation:
                'صح جداً وبرافو عليك! 👏 المتغير المحلي مقفول عليه جوه الأقواس ومحدش بره يقدر يوصله.',
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
        {
          id: 'ch16-q2',
          question: 'هل يمكن للدالة قراءة واستخدام متغير عام (Global) تم تعريفه خارجها؟',
          options: [
            {
              id: 'a',
              text: 'نعم، المتغير العام متاح ومرئي لجميع الدوال والأكواد داخل الملف',
              isCorrect: true,
              explanation:
                'إجابة نموذجية يا صديقي! 🌟 المتغير العام في الصالة متاح لأي أوضة تبص عليه.',
            },
            {
              id: 'b',
              text: 'لا، الدوال معزولة تماماً عن العالم الخارجي',
              isCorrect: false,
              explanation: 'الدوال تقرأ من الخارج للداخل وليس العكس.',
            },
            {
              id: 'c',
              text: 'فقط إذا تم تمريره كمعامل parameter',
              isCorrect: false,
              explanation: 'يمكن قراءته مباشرة حتى بدون تمريره، مع أن التمرير أصح معمارياً.',
            },
          ],
        },
        {
          id: 'ch16-q3',
          question: 'ما هو مصطلح Shadowing (حجب المتغيرات) في البرمجة؟',
          options: [
            {
              id: 'a',
              text: 'عندما يُعرّف متغير محلي بنفس اسم متغير عام فيحجبه داخل نطاقه فقط',
              isCorrect: true,
              explanation:
                'تحليل عبقري وممتاز يا صديقي! 🎯 المتغير المحلي يأخذ الأولوية داخل غرفته ويحجب العام.',
            },
            {
              id: 'b',
              text: 'مسح المتغيرات من الذاكرة',
              isCorrect: false,
              explanation: 'مسح الذاكرة وظيفته Garbage Collector.',
            },
            {
              id: 'c',
              text: 'إخفاء الكود عن المستخدم',
              isCorrect: false,
              explanation: 'Shadowing مصطلح متعلق بتداخل أسماء النطاقات البرمجية.',
            },
          ],
        },
      ],
      challenge: {
        id: 'ch16-chal',
        title: 'وريني شطارتك 🧠: حماية سر اللعبة',
        prompt:
          'اكتب دالة اسمها startGame تعرف داخلها متغيراً محلياً const secretCode = 999؛ وتطبع "اللعبة بدأت 🎮". تأكد من أن secretCode لا يتسرب خارج نطاق الدالة.',
        hint: 'ضع تعريف المتغير داخل جسم الدالة واستدعِ startGame();',
        initialCode: `// اكتب دالة startGame مع المتغير المحلي السري هنا بنفسك...
`,
        solutionCode: `function startGame() {
  const secretCode = 999;
  console.log("اللعبة بدأت 🎮");
}
startGame();`,
      },
    },
    {
      id: 17,
      partId: 4,
      partTitle: 'الجزء الرابع: الدوال',
      title: 'الفصل 17: مشروع صغير ومراجعة الدوال (Guess Game Master)',
      subtitle: 'دمج الشروط والحلقات والدوال في محاكاة ذكية',
      summaryPoints: [
        'المشاريع البرمجية الحقيقية بتبدأ بالتخطيط المنطقي (Algorithm) قبل كتابة أول سطر كود.',
        'دمج Math.random لتوليد رقم سري مع الشروط والدوال لإدارة قواعد اللعبة.',
        'تصميم دالة فحص التخمين لترجع رسائل وتلميحات واضحة للمستخدم: أكبر، أصغر، أو مبروك الفوز.',
        'تتبع تدفق البيانات واستدعاء الدوال المترابطة خطوة بخطوة.',
      ],
      contentSections: [
        {
          heading: 'فكرة اللعبة وبناء دالة الفحص (Algorithm)',
          text: `حان وقت التتويج يا بطل ويا صديقي! 🏆
في الفصول السابقة اتعلمنا:
- المتغيرات وأنواع البيانات والعمليات الحسابية (Part 1).
- الشروط وقرارات if و else والمعاملات المنطقية (Part 2).
- الحلقات التكرارية for و while وتتبع العدادات (Part 3).
- الدوال وتوليد الأرقام العشوائية مع Math و return و Scope (Part 4).

الآن هنجمع كل القطع دي في محاكاة لمنطق "لعبة تخمين الرقم السري (Guess The Number)".
فكرة المنطق البرمجي:
1. الكمبيوتر هيختار رقم سري عشوائي في سره بين 1 و 10 باستخدام Math.random و Math.floor.
2. عندنا دالة اسمها checkGuess بتاخد تخمين اللاعب كمعامل (parameter).
3. الدالة بتفحص التخمين وترجع تلميحاً مناسباً:
   - لو التخمين مساوي للرقم السري: ترجع "🎉 كسبت! ده الرقم المظبوط".
   - لو التخمين أصغر من الرقم السري: ترجع "⬆️ الرقم السري أكبر من كده، حاول مرة تانية.".
   - لو التخمين أكبر من الرقم السري: ترجع "⬇️ الرقم السري أصغر من كده، حاول مرة تانية.".`,
          codeSnippet: `// 1. توليد الرقم السري العشوائي بين 1 و 10
const secretNumber = Math.floor(Math.random() * 10) + 1;

// 2. دالة فحص التخمين الذكية
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
          text: `تعال نجرب نشغل اللعبة ونستدعي دالة checkGuess بتخمينات متتالية ونشوف إزاي بتستجيب بدقة:`,
          codeSnippet: `// محاكاة لاعب بيخمن تخمينات متتالية مستخدماً الدالة والرقم السري:
console.log("تخمين 3: " + checkGuess(3));
console.log("تخمين 7: " + checkGuess(7));
console.log("الرقم السري الحقيقي كان: " + secretNumber);`,
          callout: {
            type: 'celebration',
            title: 'إنجاز عظيم يا مهندسنا المستقبلي! 🌟',
            content:
              'لاحظ إزاي المحاكاة جمعت كل المفاهيم اللي اتعلمتها: متغيرات، دوال، شروط مقارنة، ونواتج مرجعة بـ return. دي اللبنة الأساسية لبناء ألعاب وبرامج معقدة!',
          },
        },
      ],
      exercises: [
        {
          id: 'ch17-ex1',
          title: 'التمرين 1: تجربة منطق مقارنة الأرقام والتلميح',
          code: `const target = 7;
const guess = 5;
if (guess === target) {
  console.log("فوز!");
} else if (guess < target) {
  console.log("الرقم أكبر");
} else {
  console.log("الرقم أصغر");
}`,
          expectedOutput: `الرقم أكبر`,
          explanation:
            'التخمين 5 أصغر من الهدف 7، فيعطي البرنامج تلميحاً بأن الرقم المطلوب أكبر.',
        },
      ],
      quiz: [
        {
          id: 'ch17-q1',
          question:
            'عشان نعمل لعبة التخمين صح، إيه أفضل ترتيب لمنطق فحص التخمين يا صديقي؟',
          options: [
            {
              id: 'a',
              text: 'فحص التساوي أولاً (حالة الفوز)، ثم فحص هل الرقم أصغر، ثم البديل أنه أكبر',
              isCorrect: true,
              explanation:
                'صح جداً وبرافو عليك! 👏 بنبدأ بشرط الفوز والانتهاء، ثم نعطي التلميحات المساعدة.',
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
        {
          id: 'ch17-q2',
          question: 'ليه بنستخدم return داخل دالة checkGuess بدلاً من console.log المباشر؟',
          options: [
            {
              id: 'a',
              text: 'عشان نقدر نستقبل النتيجة بره الدالة ونعرضها في واجهة المستخدم أو نتحكم في مجريات اللعبة',
              isCorrect: true,
              explanation:
                'ممتاز جداً يا صديقي! 🎯 الإرجاع بـ return بيعطيك مرونة كاملة في استخدام النتيجة في أي مكان بالبرنامج.',
            },
            {
              id: 'b',
              text: 'لأن console.log يوقف تشغيل اللعبة',
              isCorrect: false,
              explanation: 'console.log لا يوقف البرنامج ولكنه لا يسلم النتيجة برمجياً.',
            },
            {
              id: 'c',
              text: 'لأن return يضاعف سرعة المعالج',
              isCorrect: false,
              explanation: 'السبب معماري وتنظيمي لنقل البيانات.',
            },
          ],
        },
        {
          id: 'ch17-q3',
          question: 'لو أردنا توسيع نطاق اللعبة ليصبح بين 1 و 50، كيف نعدل توليد الرقم السري؟',
          options: [
            {
              id: 'a',
              text: 'Math.floor(Math.random() * 50) + 1',
              isCorrect: true,
              explanation:
                'برافو عليك يا صديقي! 🌟 بنضرب في 50 ونزود 1 ليكون المدى من 1 إلى 50.',
            },
            {
              id: 'b',
              text: 'Math.random() * 50',
              isCorrect: false,
              explanation: 'سيعطي أرقاماً عشرية بكسور.',
            },
            {
              id: 'c',
              text: 'Math.floor(Math.random()) + 50',
              isCorrect: false,
              explanation: 'سيعطي 50 دائماً لأن Math.floor(Math.random()) ينتج 0.',
            },
          ],
        },
      ],
      challenge: {
        id: 'ch17-chal',
        title: 'وريني شطارتك 🧠: فاحص التخمين الصارم',
        prompt:
          'اكتب كوداً يحدد const secret = 6 و const guess = 6؛ فإذا كان guess مساوياً لـ secret يطبع "مبروك كسبت 🎉"، وغير ذلك يطبع "حاول تاني 🔄".',
        hint: 'if (guess === secret) { console.log("مبروك كسبت 🎉"); } else { console.log("حاول تاني 🔄"); }',
        initialCode: `// اكتب كود فحص التخمين السري هنا بنفسك...
`,
        solutionCode: `const secret = 6;
const guess = 6;
if (guess === secret) {
  console.log("مبروك كسبت 🎉");
} else {
  console.log("حاول تاني 🔄");
}`,
      },
    },
    {
      id: 18,
      partId: 4,
      partTitle: 'الجزء الرابع: الدوال',
      title: 'الفصل 18: مراجعة تحليلية وتتبع تدفق الدوال (Function Tracing)',
      subtitle: 'تتبع مسار التنفيذ، الدوال المتداخلة، وفخاخ الـ return و Scope',
      summaryPoints: [
        'التتبع الذهني لمسار تنفيذ الدوال (Call Stack Tracing) ومعرفة ترتيب قفزات المعالج.',
        'تمرير نتائج الدوال كمدخلات لدوال أخرى (Function Composition) وسلسلة الحسابات.',
        'تحليل الأخطاء المنطقية الشائعة: نسيان return، الكود الميت بعد الخروج، وتداخل النطاقات.',
      ],
      contentSections: [
        {
          heading: 'تتبع حركة المعالج: إزاي الكمبيوتر بيقفز بين أسطر الكود؟',
          text: `تعال نمشي خطوة بخطوة في عقل JavaScript يا صديقي:
الكمبيوتر بيقرأ الكود من فوق لتحت.. أول ما بيقابل إعلان دالة \`function myFunction() { ... }\` بيحفظ عنوانها في الذاكرة بدون ما ينفذ سطر واحد جواها!
أول ما بيوصل لسطر الاستدعاء \`myFunction()\`:
1. بيحط دبوس على السطر الحالي اللي كان واقف فيه.
2. بيقفز فوراً لداخل جسم الدالة وينفذ أوامرها بالترتيب.
3. أول ما بيقابل \`return\`، بياخد القيمة ويرجع يقفز لنفس المكان اللي سابه عند الدبوس ويكمل باقي البرنامج!`,
          codeSnippet: `function double(n) {
  return n * 2;
}

function addTen(n) {
  return n + 10;
}

// تتبع تدفق الحسابات من الداخل للخارج:
const step1 = double(5);      // step1 = 10
const finalResult = addTen(step1); // finalResult = 20
console.log("النتيجة النهائية: " + finalResult);`,
        },
        {
          heading: 'الدوال المتداخلة وسلسلة تمرير البيانات (Nested Functions)',
          text: `القوة العظمى للدوال إنك تقدر تمرر ناتج دالة كمدخل فوري لدالة تانية في سطر واحد بدون متغيرات وسيطة:
الكمبيوتر بينفذ الدالة الداخلية الأول ويستلم نتيجتها، وبعدين يمرر النتيجة للدالة الخارجية!`,
          codeSnippet: `function getTax(price) {
  return price * 0.1;
}

function formatCurrency(amount) {
  return amount + " ج.م";
}

// تنفيذ متداخل: getTax(500) ينتج 50، ثم formatCurrency(50) ينتج "50 ج.م"
console.log("الضريبة: " + formatCurrency(getTax(500)));`,
          callout: {
            type: 'insight',
            title: 'قاعدة القراءة من الداخل للخارج 🎯',
            content:
              'لما تلاقي استدعاءات دوال متداخلة زي `f(g(x))`، افتكر دايماً إن الكمبيوتر بيحل الأقواس الداخلية أولاً `g(x)` وبعدين يسلّم الناتج للدالة الخارجية `f()`!',
          },
        },
        {
          heading: 'مصفوفة الفخاخ القاتلة في الدوال (Debug Checklist)',
          text: `قبل ما تسلّم أي كود فيه دوال يا باشمهندس، راجع القائمة دي:
1. هل نسيت الأقواس \`()\` عند الاستدعاء؟ (الكود مش هيشتغل).
2. هل نسيت كلمة \`return\`؟ (المتغير اللي بيستقبل الناتج هيبقى جواه \`undefined\`).
3. هل كتبت أي كود بعد \`return\`؟ (هيبقى كود ميت \`Unreachable\` لن يعمل أبداً).
4. هل حاولت تقرأ متغيراً محلياً من خارج غرفته؟ (هيطلع \`ReferenceError\` فوراً).`,
          codeSnippet: `function calculateArea(width, height) {
  const area = width * height;
  return area; // تسليم الناتج باليد
  // console.log("كود ميت مستحيل الوصول إليه");
}

const roomArea = calculateArea(4, 5);
console.log("مساحة الغرفة: " + roomArea + " متر مربع");`,
        },
      ],
      exercises: [
        {
          id: 'ch18-ex1',
          title: 'التمرين 1: تتبع دالة متداخلة',
          code: `function square(x) {
  return x * x;
}
console.log(square(square(2)));`,
          expectedOutput: `16`,
          explanation: 'square(2) تنتج 4، ثم square(4) تنتج 16.',
        },
        {
          id: 'ch18-ex2',
          title: 'التمرين 2: فحص النطاق وتجنب التسريب',
          code: `function getGreeting(name) {
  const msg = "مرحباً يا " + name;
  return msg;
}
console.log(getGreeting("يوسف"));`,
          expectedOutput: `مرحباً يا يوسف`,
          explanation: 'الدالة تركب النص المحلي وترجعه بـ return بنجاح.',
        },
      ],
      quiz: [
        {
          id: 'ch18-q1',
          question: 'لو عندنا الكود التالي، ما هي القيمة التي ستُطبع في النهاية؟',
          codeSnippet: `function f(x) { return x + 2; }
function g(x) { return x * 3; }
console.log(f(g(4)));`,
          options: [
            {
              id: 'a',
              text: '14 (لأن g(4) تنتج 12، ثم f(12) تضيف 2 فتصبح 14)',
              isCorrect: true,
              explanation: 'تحليل عبقري ودقيق جداً يا صديقي! 👏 بدأ بالقوس الداخلي g(4)=12 ثم f(12)=14.',
            },
            {
              id: 'b',
              text: '18',
              isCorrect: false,
              explanation: 'كانت ستكون 18 لو نُفذت f أولاً ثم g: g(f(4)) = g(6) = 18.',
            },
            {
              id: 'c',
              text: '24',
              isCorrect: false,
              explanation: 'حساب غير صحيح لترتيب الدوال.',
            },
          ],
        },
        {
          id: 'ch18-q2',
          question: 'ليه الكود ده بيطبع NaN في الكونسول يا صديقي؟',
          codeSnippet: `function add(a, b) {
  console.log(a + b);
}
const res = add(3, 3) + 4;
console.log(res);`,
          options: [
            {
              id: 'a',
              text: 'لأن add لا تحتوي على return فترجع undefined، وجمع undefined + 4 ينتج NaN',
              isCorrect: true,
              explanation: 'إجابة نموذجية وممتازة! 💡 غياب return جعل ناتج الدالة undefined، وجمع undefined مع رقم ينتج Not-a-Number.',
            },
            {
              id: 'b',
              text: 'لأن الأرقام فردية',
              isCorrect: false,
              explanation: 'العمليات الحسابية تتعامل مع أي أرقام.',
            },
            {
              id: 'c',
              text: 'لأن console.log يغير نوع البيانات',
              isCorrect: false,
              explanation: 'console.log لا يؤثر على قيمة المتغيرات.',
            },
          ],
        },
        {
          id: 'ch18-q3',
          question: 'ما هو الترتيب الصحيح لدورة حياة الدالة عند تشغيل البرنامج؟',
          options: [
            {
              id: 'a',
              text: 'التعريف أولاً في الذاكرة، ثم القفز لجسم الدالة عند الاستدعاء، ثم الخروج بـ return وتسليم الناتج',
              isCorrect: true,
              explanation: 'برافو عليك يا صديقي! 🌟 هذا هو المسار الهندسي الكامل لتنفيذ الدوال في لغة JavaScript.',
            },
            {
              id: 'b',
              text: 'التنفيذ الفوري عند كتابة function بدون استدعاء',
              isCorrect: false,
              explanation: 'الدالة لا تنفذ أبداً إلا عند استدعائها بالأقواس ().',
            },
            {
              id: 'c',
              text: 'الخروج أولاً ثم التنفيذ',
              isCorrect: false,
              explanation: 'الخروج بـ return يكون في نهاية مسار التنفيذ.',
            },
          ],
        },
      ],
      challenge: {
        id: 'ch18-chal',
        title: 'تحدي ختام الدوال: محول العملات وضريبة الخدمة 💱',
        prompt:
          'اكتب دالتين: الأولى convertToEGP(usd) تضرب في 50 وترجع الناتج. والثانية addService(amount) تضيف 10% خدمة وترجع الناتج. ثم احسب ناتج تحويل 100 دولار مع إضافة الخدمة واطبعه في الكونسول بالشكل: "الإجمالي بالجنيه: 5500".',
        hint: 'استدعِ addService(convertToEGP(100)) وخزن الناتج ثم اطبعه.',
        initialCode: `// اكتب الدالتين convertToEGP و addService وتتبعهما هنا بنفسك...
`,
        solutionCode: `function convertToEGP(usd) {
  return usd * 50;
}

function addService(amount) {
  return amount + amount * 0.1;
}

const finalAmount = addService(convertToEGP(100));
console.log("الإجمالي بالجنيه: " + finalAmount);`,
      },
    },
  ],
};
