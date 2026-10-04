import { Part } from '../../types';

export const part5: Part = {
  id: 5,
  title: 'الجزء الخامس: المصفوفات',
  subtitle: 'الرف اللي بنرتب عليه البيانات',
  description:
    'المصفوفات (Arrays)، الفهرس المبدئي من الصفر، خاصية length، التكرار بـ for..of، وعمليات push وpop وincludes.',
  iconName: 'Layers',
  bugHunter: {
    id: 'bug-part-5',
    partId: 5,
    title: 'كويز: فخ الـ Index و undefined في المصفوفة',
    context:
      'الكود ده المفروض يطبع 4 أسماء في المصفوفة، لكنه في النهاية بيطبع undefined إضافية!',
    problemCode: `const names = ["ندى", "كريم", "ياسمين", "طارق"];

for (let i = 0; i <= names.length; i++) {
  console.log(names[i]);
}`,
    bugLineNumber: 3,
    bugDescription:
      'استخدام i <= names.length بدلاً من i < names.length.',
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
        'المصفوفة (Array) هي رف منظم بيحفظ قائمة كاملة من البيانات داخل متغير واحد.',
        'بنكتب المصفوفة بين قوسين مربعين [ ] ونفصل بين العناصر بفواصل.',
        'ترقيم العناصر (Index) بيبدأ دائماً من 0 وليس من 1.',
        'خاصية array.length بتعطينا عدد العناصر، وآخر عنصر مكانه array[array.length - 1].',
      ],
      contentSections: [
        {
          heading: 'تشبيه دولاب الأحذية والرف المقسم: يعني إيه مصفوفة؟',
          text: `لو عندك سوبر ماركت فيه 100 صنف، أو مدرسة فيها 50 طالب في الفصل..
هل هتروح تعرف 50 متغيراً:
let student1 = "أحمد";
let student2 = "سارة";
let student3 = "عمر"; ... لحد student50؟
ده هيبقى عذاب وأسلوب فاشل برمجياً!
الحل العبقري: بنجيب "دولاب مقسم لرفوف مرقمة"، ونسميه باسم واحد بس: students.
في لغات البرمجة، الدولاب ده اسمه "المصفوفة (Array)".
المصفوفة هي قائمة مرتبة من البيانات، محطوطة جوه قوسين مربعين [ ]، ونفصل بين كل عنصر والتاني بفاصلة (,).`,
          codeSnippet: `// مصفوفة أسماء الطلاب
const students = ["أحمد", "سارة", "عمر", "مريم"];

// مصفوفة درجات أرقام
const scores = [95, 88, 72, 100];

console.log(students);
console.log(scores);`,
        },
        {
          heading: 'لغز الترقيم من الصفر: ليه أول عنصر رقمه 0 مش 1؟ 🤯',
          text: `أهم قاعدة في تاريخ علوم الحاسب لازم تحفظها زي اسمك:
"الكمبيوتر بيبدأ عد من الصفر، مش من الواحد!".
مكان العنصر في المصفوفة بيتسمى "الفهرس أو الإندكس (Index)":
- العنصر الأول مكان رقمه: [0]
- العنصر الثاني مكان رقمه: [1]
- العنصر الثالث مكان رقمه: [2]
- العنصر الرابع مكان رقمه: [3]

لو مصفوفة فيها 4 عناصر، فالأماكن المتاحة هي من 0 لحد 3 فقط!
لو طلبت من الكمبيوتر [4]، هيبص على الرف مش هيلاقي رف بالرقم ده، وهيرجع لك القيمة الشهيرة: undefined.`,
          codeSnippet: `const fruits = ["تفاح", "موز", "مانجو"];

console.log(fruits[0]); // تفاح (أول عنصر)
console.log(fruits[1]); // موز (تاني عنصر)
console.log(fruits[2]); // مانجو (تالت عنصر)
console.log(fruits[3]); // undefined! مفيش رف رقم 3!`,
          callout: {
            type: 'warning',
            title: 'مطب الفهرسة الشائع ⚠️',
            content:
              'افتكر دايماً: لو المصفوفة طولها 10 عناصر، آخر عنصر فيها عنوانه [9] مش [10]. دايماً آخر إندكس = الطول ناقص واحد!',
          },
        },
        {
          heading: 'تعديل محتويات الرف وخاصية الطول السحرية (length)',
          text: `المصفوفة مش متحجرة، تقدر تعدل أي قيمة فيها بمجرد ما تنادي على رقم الرف:
fruits[1] = "برتقال";

ولمعرفة عدد العناصر الموجودة جوه أي مصفوفة في أي وقت، بنستخدم الخاصية الجاهزة: array.length.
الميزة الجبارة لخاصية length إنها بتسمح لنا نوصل لآخر عنصر في أي مصفوفة في العالم، حتى لو كان فيها مليون عنصر ومكنتش عارف طولها:
array[array.length - 1]`,
          codeSnippet: `const playlist = ["أغنية 1", "أغنية 2", "أغنية 3", "أغنية 4"];

console.log("عدد الأغاني: " + playlist.length); // 4

// تعديل الأغنية الأولى
playlist[0] = "موسيقى هادئة";

// الوصول لآخر عنصر بذكاء
const lastSong = playlist[playlist.length - 1];
console.log("آخر أغنية: " + lastSong); // أغنية 4`,
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
          explanation:
            'العنصر رقم 2 هو مانجو (موز 0، تفاح 1، مانجو 2)، والطول الإجمالي 4.',
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
      quiz: [
        {
          id: 'ch15-q1',
          question:
            'لو عندنا مصفوفة فيها 5 عناصر، الفهرس (index) بتاع أول عنصر وآخر عنصر كام بالترتيب؟',
          options: [
            {
              id: 'a',
              text: 'أول عنصر 0، وآخر عنصر 4',
              isCorrect: true,
              explanation:
                'صح جداً! 👏 الترقيم يبدأ من 0 وينتهي عند (الطول - 1) وهو 4.',
            },
            {
              id: 'b',
              text: 'أول عنصر 1، وآخر عنصر 5',
              isCorrect: false,
              explanation: 'الكمبيوتر يبدأ دائماً من 0 وليس 1.',
            },
            {
              id: 'c',
              text: 'أول عنصر 0، وآخر عنصر 5',
              isCorrect: false,
              explanation: 'لو طلبت الرف رقم 5 هيرجع لك undefined لأنهم 5 عناصر فقط (0 إلى 4).',
            },
          ],
        },
        {
          id: 'ch15-q2',
          question: 'إزاي نوصل لآخر عنصر في أي مصفوفة اسمها arr مهما كان طولها؟',
          options: [
            {
              id: 'a',
              text: 'arr[arr.length - 1]',
              isCorrect: true,
              explanation:
                'برافو عليك! 🎯 دي الطريقة القياسية عالمياً للوصول لآخر عنصر.',
            },
            {
              id: 'b',
              text: 'arr[last]',
              isCorrect: false,
              explanation: 'مفيش كلمة محجوزة اسمها last في المصفوفات.',
            },
            {
              id: 'c',
              text: 'arr[arr.length]',
              isCorrect: false,
              explanation: 'arr[arr.length] هيرجع undefined لأن الترقيم يبدأ من 0.',
            },
          ],
        },
      ],
      challenge: {
        id: 'ch15-chal',
        title: 'وريني شطارتك 🧠: حسابات درجات الطلاب',
        prompt:
          'عندك مصفوفة const grades = [88, 65, 92, 40, 77];. اطبع أول عنصر، وآخر عنصر بـ length، ومجموعهما معاً.',
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
        'المرور على المصفوفة يعني فحص أو طباعة كل عنصر فيها واحد ورا التاني.',
        'حلقة for التقليدية بتستخدم العداد i من 0 حتى أقل من array.length.',
        'حلقة for..of السحرية هي الطريقة الأسهل والأحدث لما نكون مهتمين بالقيمة فقط.',
        'دمج الشروط if داخل الحلقات يسمح بتصفية البيانات وحساب المجموع والإحصائيات.',
      ],
      contentSections: [
        {
          heading: 'تشبيه كمساري القطار: يعني إيه المرور على المصفوفة؟',
          text: `تخيل كمساري في قطار بيمر على عربيات الركاب واحدة ورا التانية عشان يفحص التذاكر..
في المصفوفات، عندنا 100 اسم أو 50 منتج، ومحتاجين نعمل عليهم عملية:
- نطبع كل اسم في سطر لوحده.
- نحسب إجمالي أسعار كل المنتجات في السلة.
- نبحث عن طالب جايب أكتر من 90 ونبعتله تهنئة.

العملية دي في البرمجة اسمها "المرور والتكرار (Iteration أو Looping over array)".
وعندنا طريقتين أساسيتين للمرور: الطريقة الكلاسيكية بـ for، والطريقة السحرية الحديثة بـ for..of.`,
          codeSnippet: `const friends = ["أحمد", "مروان", "كريم"];

// الطريقة الكلاسيكية بـ for:
for (let i = 0; i < friends.length; i++) {
  console.log("صديقي رقم " + (i + 1) + " هو: " + friends[i]);
}`,
        },
        {
          heading: 'الطريقة السحرية الأنيقة: حلقة for...of',
          text: `لو مش فارق معاك رقم الـ index (0 أو 1 أو 2)، وعايز فقط تمسك العنصر نفسه في إيدك:
JavaScript بتقدملك حلقة عبقرية اسمها for...of.
بتقول ببساطة: "لكل عنصر (item) موجود جوه المصفوفة دي (of array).. نفذ الكود التالي!".
الكود بيبقى أسهل في القراءة، أقصر في الكتابة، ومستحيل يحصل فيه خطأ في العداد أو الطول.`,
          codeSnippet: `const cities = ["القاهرة", "الإسكندرية", "أسوان", "شرم الشيخ"];

// قراءة مباشرة وجميلة بدون أي عدادات
for (const city of cities) {
  console.log("🏙️ مرحباً بكم في مدينة " + city);
}`,
          callout: {
            type: 'tip',
            title: 'متى تختار for العادية ومتى تختار for..of؟ 💡',
            content:
              'لو محتاج تعدل في المصفوفة الأصلية أو محتاج تعرف رقم الترتيب i، استخدم for العادية.\nلو محتاج تقرأ العناصر فقط وتعرضها، for..of أنضف وأسرع في الكتابة 100 مرة!',
          },
        },
        {
          heading: 'تطبيقات حقيقية: حساب المجموع وتصفية الناجحين',
          text: `تعال نعمل سيناريو حقيقي: حساب إجمالي سلة المشتريات، وتصفية درجات الطلاب لمعرفة الناجحين فقط:`,
          codeSnippet: `const cartPrices = [50, 120, 30, 200];
let total = 0;

for (const price of cartPrices) {
  total += price;
}
console.log("💰 إجمالي الفاتورة: " + total + " جنيه");

// فحص درجات الطلاب والناجحين فقط
const grades = [85, 42, 90, 60, 48];
console.log("🏆 الطلاب الناجحون:");
for (const g of grades) {
  if (g >= 50) {
    console.log("- ناجح بدرجة: " + g);
  }
}`,
        },
      ],
      exercises: [
        {
          id: 'ch16-ex1',
          title: 'التمرين 1: طباعة أسماء بـ for',
          code: `const colors = ["أحمر", "أخضر", "أزرق"];
for (let i = 0; i < colors.length; i++) {
  console.log(colors[i]);
}`,
          expectedOutput: `أحمر\nأخضر\nأزرق`,
          explanation: 'المرور باستخدام العداد i من 0 إلى ما قبل الطول.',
        },
        {
          id: 'ch16-ex2',
          title: 'التمرين 2: المرور بـ for..of',
          code: `const animals = ["قطة", "كلب", "عصفور"];
for (const a of animals) {
  console.log(a);
}`,
          expectedOutput: `قطة\nكلب\nعصفور`,
          explanation: 'حلقة for..of تأخذ القيمة مباشرة في كل دورة.',
        },
      ],
      quiz: [
        {
          id: 'ch16-q1',
          question:
            'في حلقة for التقليدية للمصفوفة arr، ليه بنكتب الشرط i < arr.length مش i <= arr.length؟',
          options: [
            {
              id: 'a',
              text: 'عشان آخر عنصر بيكون عند arr.length - 1، ولو وصلنا لـ length هنطبع undefined',
              isCorrect: true,
              explanation:
                'صح جداً! 👏 الـ index بينتهي قبل رقم الطول بواحد.',
            },
            {
              id: 'b',
              text: 'لأن جافاسكريبت بترفض علامة <= مع المصفوفات',
              isCorrect: false,
              explanation: 'العلامة مسموحة نحوياً لكنها ستسبب خطأ منطقياً (undefined).',
            },
            {
              id: 'c',
              text: 'عشان نتجاهل أول عنصر',
              isCorrect: false,
              explanation: 'أول عنصر بيتم قراءته عند i = 0 بشكل طبيعي.',
            },
          ],
        },
        {
          id: 'ch16-q2',
          question: 'إيه الميزة الأكبر لحلقة for..of؟',
          options: [
            {
              id: 'a',
              text: 'تتيح الوصول للقيم مباشرة بدون الحاجة لتعريف عداد ومقارنة أطوال',
              isCorrect: true,
              explanation:
                'ممتاز! 🎯 كود نظيف، مقروء، وسهل بدون تعقيدات العدادات.',
            },
            {
              id: 'b',
              text: 'أنها تعكس ترتيب المصفوفة',
              isCorrect: false,
              explanation: 'هي تقرأ بالترتيب الطبيعي من الأول للآخر.',
            },
            {
              id: 'c',
              text: 'أنها تحذف العناصر بعد قراءتها',
              isCorrect: false,
              explanation: 'المصفوفة تظل كما هي دون أي حذف.',
            },
          ],
        },
      ],
      challenge: {
        id: 'ch16-chal',
        title: 'وريني شطارتك 🧠: مضاعفة جميع أرقام القائمة',
        prompt:
          'عندك مصفوفة const numbers = [2, 5, 8];. استخدم حلقة for..of واطبع في الكونسول ضعف كل رقم (num * 2) في سطر منفصل.',
        hint: 'for (const n of numbers) { console.log(n * 2); }',
        initialCode: `// اكتب حلقة for..of لطباعة ضعف كل رقم هنا بنفسك...
`,
        solutionCode: `const numbers = [2, 5, 8];
for (const n of numbers) {
  console.log(n * 2);
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
        'الدوال المدمجة بالمصفوفات (Methods) بتسمح بالتعديل الديناميكي على القائمة.',
        'الدالة push() بتضيف عنصراً في نهاية المصفوفة، و pop() بتحذف آخر عنصر.',
        'الدالة unshift() بتضيف في البداية، و shift() بتحذف أول عنصر.',
        'الدالة includes() بتفحص هل القيمة موجودة (true أو false)، و indexOf() بترجع رقم الرف.',
        'المصفوفة المعرفة بـ const يمكن تعديل محتواها لأن الصندوق نفسه ثابت لكن ما بداخله مرن.',
      ],
      contentSections: [
        {
          heading: 'تشبيه طابور العيش ومحطة المترو: الإضافة والحذف',
          text: `المصفوفة في البرمجة مش رف ثابت ممنوع تلمسه.. دي كائن حي ديناميكي بيزيد وينقص في أي لحظة!
تخيل طابور ناس واقفين في محطة المترو:
- لو جه راكب جديد ووقف في آخر الطابور: دي عملية push (إضافة في النهاية).
- لو الراكب اللي في الآخر زهق ومشي: دي عملية pop (حذف من النهاية).
- لو راكب مستعجل جه وقف في أول الطابور قدام الناس: دي عملية unshift (إضافة في البداية).
- لو أول راكب في الطابور قطع التذكرة ودخل المحطة: دي عملية shift (حذف من البداية).`,
          codeSnippet: `const queue = ["أحمد", "محمود"];

// إضافة في النهاية
queue.push("مصطفى");
console.log(queue); // ['أحمد', 'محمود', 'مصطفى']

// حذف من النهاية
const removedPerson = queue.pop();
console.log("الشخص اللي خرج: " + removedPerson); // مصطفى
console.log(queue); // ['أحمد', 'محمود']`,
        },
        {
          heading: 'التفتيش الذكي: includes و indexOf',
          text: `لو عندك قائمة بمئات المشتركين وعايز تفحص: "هل عمر موجود في القائمة؟":
مش محتاج تكتب حلقة for وشروط معقدة! JavaScript مجهزة لك دالتين سحريتين:
1. array.includes(item): بترجع boolean فوري: true لو العنصر موجود، و false لو مش موجود!
2. array.indexOf(item): بترجع رقم الرف (index) اللي العنصر قاعد فيه، ولو العنصر مش موجود خالص بترجع -1!`,
          codeSnippet: `const subscribers = ["عمر", "نور", "سارة", "طارق"];

console.log(subscribers.includes("نور"));   // true
console.log(subscribers.includes("حسام"));  // false

console.log(subscribers.indexOf("سارة"));   // 2 (مكانها في الرف رقم 2)
console.log(subscribers.indexOf("حسام"));   // -1 (مش موجود)`,
          callout: {
            type: 'insight',
            title: 'ليه -1 بالذات؟ 🔍',
            content:
              'لأن الفهرس في المصفوفات بيبدأ من 0، فكان مستحيل يرجعوا 0 ليدل على عدم الوجود، لأن 0 معناه أول عنصر! عشان كده اختاروا -1 كرقم مستحيل يكون عنوان لأي رف.',
          },
        },
        {
          heading: 'لغز المبرمجين: ليه const بتسمح بتعديل المصفوفة بـ push؟ 🔒',
          text: `سؤال ذكي بيحير كل المبتدئين:
"مش إحنا اتعلمنا إن const يعني خزنة حديد ممنوع تعديلها؟ إزاي بنكتب const arr = [] وبنعمل arr.push() وبنعدل فيها عادي بدون ما تضرب إيرور؟!".
الإجابة العبقرية:
const بتمنعك إنك "تغيّر الصندوق نفسه" (يعني متقدرش تقول arr = [1, 2, 3] كصندوق جديد).
لكن اللي "جوه" الصندوق (الورق والأقلام والألعاب) تقدر تضيف وتشيل فيه براحتك تماماً!`,
          codeSnippet: `const colors = ["أحمر", "أخضر"];

colors.push("أزرق"); // مسموح تماماً وبكل أريحية ✅
colors[0] = "أصفر";   // مسموح تعديل المحتوى ✅

// colors = ["وردي"]; // ❌ خطأ ممنوع! محاولة استبدال الصندوق نفسه`,
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
      quiz: [
        {
          id: 'ch17-q1',
          question: 'الدالة push() بتضيف العنصر فين بالظبط في المصفوفة؟',
          options: [
            {
              id: 'a',
              text: 'في نهاية المصفوفة بعد آخر عنصر',
              isCorrect: true,
              explanation:
                'صح جداً! 👏 push بتضيف في الآخر، بينما unshift بتضيف في الأول.',
            },
            {
              id: 'b',
              text: 'في أول المصفوفة عند الفهرس 0',
              isCorrect: false,
              explanation: 'الإضافة في البداية هي وظيفة unshift.',
            },
            {
              id: 'c',
              text: 'في منتصف المصفوفة عشوائياً',
              isCorrect: false,
              explanation: 'المصفوفات منظمة وتتبع ترتيباً دقيقاً.',
            },
          ],
        },
        {
          id: 'ch17-q2',
          question: 'الدالة arr.indexOf(x) هترجع إيه لو العنصر x مش موجود في المصفوفة؟',
          options: [
            {
              id: 'a',
              text: '-1',
              isCorrect: true,
              explanation:
                'ممتاز! 🎯 القيمة -1 هي الإشارة الرسمية لعدم وجود العنصر.',
            },
            {
              id: 'b',
              text: '0',
              isCorrect: false,
              explanation: 'الصفر يعني أن العنصر موجود في أول رف.',
            },
            {
              id: 'c',
              text: 'false',
              isCorrect: false,
              explanation: 'الدالة بترجع أرقام index مش boolean (دي وظيفة includes).',
            },
          ],
        },
      ],
      challenge: {
        id: 'ch17-chal',
        title: 'وريني شطارتك 🧠: جمع الأرقام الزوجية في مصفوفة',
        prompt:
          'ابدأ بمصفوفة فارغة evenNumbers. استخدم حلقة من 1 لـ 10، ولو الرقم زوجي ضيفه بـ push، وفي النهاية اطبع المصفوفة.',
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
};
