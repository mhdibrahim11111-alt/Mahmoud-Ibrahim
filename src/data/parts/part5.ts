import { Part } from '../../types';

export const part5: Part = {
  id: 5,
  title: 'الجزء الخامس: المصفوفات',
  subtitle: 'الرف المنظم اللي بنرتب عليه كل بياناتنا',
  description:
    'المصفوفات (Arrays)، الفهرس المبدئي من الصفر (Zero-based Indexing)، خاصية length، المرور بـ for و for..of، عمليات push و pop و includes و indexOf، ومراجعة تحليلية لتتبع تحولات المصفوفات.',
  iconName: 'Layers',
  bugHunter: {
    id: 'bug-part-5',
    partId: 5,
    title: 'صائد الأخطاء: فخ الـ Index و undefined في المصفوفة 🐛',
    context:
      'الكود ده المفروض يطبع 4 أسماء في المصفوفة، لكنه في النهاية بيطبع undefined إضافية ويزعج المستخدم!',
    problemCode: `const names = ["ندى", "كريم", "ياسمين", "طارق"];

for (let i = 0; i <= names.length; i++) {
  console.log(names[i]);
}`,
    bugLineNumber: 3,
    bugDescription:
      'استخدام i <= names.length بدلاً من i < names.length.',
    whyItHappens:
      'طول مصفوفة names هو 4، لكن الترقيم يبدأ من 0 وينتهي عند 3. عند استخدام <= ستصل قيمة i إلى 4، والعنصر names[4] غير موجود فيرجع الكمبيوتر undefined! الحل هو استخدام < بدلاً من <=.',
    fixedCode: `const names = ["ندى", "كريم", "ياسمين", "طارق"];

for (let i = 0; i < names.length; i++) {
  console.log(names[i]);
}`,
    expectedCorrectOutput: `ندى\nكريم\nياسمين\nطارق`,
    hints: [
      'المصفوفة فيها 4 عناصر، ما هو آخر index متاح؟',
      'ماذا يحدث عندما يحاول الكود قراءة names[4]؟',
      'استبدل <= بـ < لتتوقف الحلقة عند index 3.',
    ],
  },
  chapters: [
    {
      id: 19,
      partId: 5,
      partTitle: 'الجزء الخامس: المصفوفات',
      title: 'الفصل 19: المصفوفات (1) — الرف المرقّم',
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
          text: `لو عندك سوبر ماركت فيه 100 صنف، أو مدرسة فيها 50 طالب في الفصل يا صديقي..
هل هتروح تعرف 50 متغيراً منفصلاً:
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
          text: `أهم قاعدة في تاريخ علوم الحاسب لازم تحفظها زي اسمك يا صديقي:
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
              'افتكر دايماً يا صديقي: لو المصفوفة طولها 10 عناصر، آخر عنصر فيها عنوانه [9] مش [10]. دايماً آخر إندكس = الطول ناقص واحد!',
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

// الوصول لآخر عنصر بذكاء واحترافية
const lastSong = playlist[playlist.length - 1];
console.log("آخر أغنية: " + lastSong); // أغنية 4`,
        },
      ],
      exercises: [
        {
          id: 'ch19-ex1',
          title: 'التمرين 1: فحص الـ Index والطول',
          code: `const fruits = ["موز", "تفاح", "مانجو", "عنب"];
console.log(fruits[2]);
console.log(fruits.length);`,
          expectedOutput: `مانجو\n4`,
          explanation:
            'العنصر رقم 2 هو مانجو (موز 0، تفاح 1، مانجو 2)، والطول الإجمالي للمصفوفة 4.',
        },
        {
          id: 'ch19-ex2',
          title: 'التمرين 2: الوصول لآخر عنصر في المصفوفة',
          code: `const numbers = [10, 20, 30];
console.log(numbers[numbers.length - 1]);`,
          expectedOutput: `30`,
          explanation: 'numbers[3 - 1] = numbers[2] وهو العنصر الأخير 30.',
        },
      ],
      quiz: [
        {
          id: 'ch19-q1',
          question:
            'لو عندنا مصفوفة فيها 5 عناصر، الفهرس (index) بتاع أول عنصر وآخر عنصر كام بالترتيب يا صديقي؟',
          options: [
            {
              id: 'a',
              text: 'أول عنصر 0، وآخر عنصر 4',
              isCorrect: true,
              explanation:
                'صح جداً وبرافو عليك يا صديقي! 👏 الترقيم يبدأ من 0 وينتهي عند (الطول - 1) وهو 4.',
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
          id: 'ch19-q2',
          question: 'إزاي نوصل لآخر عنصر في أي مصفوفة اسمها arr مهما كان طولها؟',
          options: [
            {
              id: 'a',
              text: 'arr[arr.length - 1]',
              isCorrect: true,
              explanation:
                'برافو عليك يا صديقي! 🎯 دي الطريقة القياسية عالمياً للوصول لآخر عنصر.',
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
        {
          id: 'ch19-q3',
          question: 'ماذا يرجع الكود عند محاولة قراءة عنصر في index غير موجود بالمصفوفة؟',
          options: [
            {
              id: 'a',
              text: 'undefined (لأن الرف المطلوب فارغ وغير موجود)',
              isCorrect: true,
              explanation:
                'ممتاز جداً! 💡 جافاسكريبت ترجع undefined عند قراءة فهرس خارج حدود المصفوفة.',
            },
            {
              id: 'b',
              text: 'null',
              isCorrect: false,
              explanation: 'null تدل على تفريغ يدوي مقصود وليست القيمة الافتراضية.',
            },
            {
              id: 'c',
              text: '0',
              isCorrect: false,
              explanation: '0 هي قيمة رقمية حقيقية وليست دلالة على عدم الوجود.',
            },
          ],
        },
      ],
      challenge: {
        id: 'ch19-chal',
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
      id: 20,
      partId: 5,
      partTitle: 'الجزء الخامس: المصفوفات',
      title: 'الفصل 20: المصفوفات (2) — المرور على العناصر',
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
          text: `تخيل كمساري في قطار بيمر على عربيات الركاب واحدة ورا التانية عشان يفحص التذاكر يا صديقي..
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
              'لو محتاج تعدل في المصفوفة الأصلية أو محتاج تعرف رقم الترتيب i، استخدم for العادية.\nلو محتاج تقرأ العناصر فقط وتعرضها، for..of أنضف وأسرع في الكتابة 100 مرة يا صديقي!',
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
          id: 'ch20-ex1',
          title: 'التمرين 1: طباعة أسماء بـ for',
          code: `const colors = ["أحمر", "أخضر", "أزرق"];
for (let i = 0; i < colors.length; i++) {
  console.log(colors[i]);
}`,
          expectedOutput: `أحمر\nأخضر\nأزرق`,
          explanation: 'المرور باستخدام العداد i من 0 إلى ما قبل الطول.',
        },
        {
          id: 'ch20-ex2',
          title: 'التمرين 2: المرور بـ for..of',
          code: `const animals = ["قطة", "كلب", "عصفور"];
for (const a of animals) {
  console.log(a);
}`,
          expectedOutput: `قطة\nكلب\nعصفور`,
          explanation: 'حلقة for..of تأخذ القيمة مباشرة في كل دورة بدون عدادات.',
        },
      ],
      quiz: [
        {
          id: 'ch20-q1',
          question:
            'في حلقة for التقليدية للمصفوفة arr، ليه بنكتب الشرط i < arr.length مش i <= arr.length يا صديقي؟',
          options: [
            {
              id: 'a',
              text: 'عشان آخر عنصر بيكون عند arr.length - 1، ولو وصلنا لـ length هنطبع undefined',
              isCorrect: true,
              explanation:
                'صح جداً وبرافو عليك! 👏 الـ index بينتهي قبل رقم الطول بواحد.',
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
          id: 'ch20-q2',
          question: 'إيه الميزة الأكبر لحلقة for..of مقارنة بحلقة for العادية؟',
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
        {
          id: 'ch20-q3',
          question: 'كيف نحسب مجموع كل الأرقام داخل مصفوفة أثناء المرور عليها؟',
          options: [
            {
              id: 'a',
              text: 'تعريف متغير حصالة let sum = 0 قبل الحلقة وإضافة كل عنصر إليه في كل دورة',
              isCorrect: true,
              explanation:
                'أحسنت يا صديقي! 🌟 هذا هو نمط الحصالة (Accumulator Pattern) الكلاسيكي.',
            },
            {
              id: 'b',
              text: 'كتابة sum = array.length فقط',
              isCorrect: false,
              explanation: 'length تعطي عدد العناصر فقط وليس مجموع قيمها.',
            },
            {
              id: 'c',
              text: 'ضرب كل العناصر في الصفر',
              isCorrect: false,
              explanation: 'الضرب في صفر يمسح الناتج.',
            },
          ],
        },
      ],
      challenge: {
        id: 'ch20-chal',
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
      id: 21,
      partId: 5,
      partTitle: 'الجزء الخامس: المصفوفات',
      title: 'الفصل 21: عمليات المصفوفات (Methods)',
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
          text: `المصفوفة في البرمجة مش رف ثابت ممنوع تلمسه يا صديقي.. دي كائن حي ديناميكي بيزيد وينقص في أي لحظة!
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
              'لأن الفهرس في المصفوفات بيبدأ من 0 يا صديقي، فكان مستحيل يرجعوا 0 ليدل على عدم الوجود، لأن 0 معناه أول عنصر! عشان كده اختاروا -1 كرقم مستحيل يكون عنوان لأي رف.',
          },
        },
        {
          heading: 'لغز المبرمجين: ليه const بتسمح بتعديل المصفوفة بـ push؟ 🔒',
          text: `سؤال ذكي بيحير كل المبتدئين يا صديقي:
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
          id: 'ch21-ex1',
          title: 'التمرين 1: إضافة إلى السلة',
          code: `const cart = ["كتاب"];
cart.push("قلم");
cart.push("دفتر");
console.log(cart);`,
          expectedOutput: `[\n  "كتاب",\n  "قلم",\n  "دفتر"\n]`,
          explanation: 'تمت إضافة عنصرين بالترتيب إلى نهاية المصفوفة.',
        },
        {
          id: 'ch21-ex2',
          title: 'التمرين 2: البحث بـ includes و indexOf',
          code: `const names = ["مصطفى", "هبة", "زياد"];
console.log(names.includes("هبة"));
console.log(names.indexOf("زياد"));`,
          expectedOutput: `true\n2`,
          explanation: 'هبة موجودة في المصفوفة، وزياد موجود في المكان رقم 2.',
        },
      ],
      quiz: [
        {
          id: 'ch21-q1',
          question: 'الدالة push() بتضيف العنصر فين بالظبط في المصفوفة يا صديقي؟',
          options: [
            {
              id: 'a',
              text: 'في نهاية المصفوفة بعد آخر عنصر',
              isCorrect: true,
              explanation:
                'صح جداً وبرافو عليك! 👏 push بتضيف في الآخر، بينما unshift بتضيف في الأول.',
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
          id: 'ch21-q2',
          question: 'الدالة arr.indexOf(x) هترجع إيه لو العنصر x مش موجود في المصفوفة؟',
          options: [
            {
              id: 'a',
              text: '-1 (كإشارة إلى أن العنصر غير موجود)',
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
        {
          id: 'ch21-q3',
          question: 'الدالة pop() بتعمل إيه في المصفوفة؟',
          options: [
            {
              id: 'a',
              text: 'بتحذف العنصر الأخير من المصفوفة وترجعه',
              isCorrect: true,
              explanation:
                'برافو عليك يا صديقي! 🎯 pop تشيل آخر عنصر، بينما shift تشيل أول عنصر.',
            },
            {
              id: 'b',
              text: 'بتحذف المصفوفة بالكامل',
              isCorrect: false,
              explanation: 'هي تحذف عنصراً واحداً فقط من النهاية.',
            },
            {
              id: 'c',
              text: 'بتضيف عنصراً جديداً',
              isCorrect: false,
              explanation: 'الإضافة هي وظيفة push أو unshift.',
            },
          ],
        },
      ],
      challenge: {
        id: 'ch21-chal',
        title: 'وريني شطارتك 🧠: جمع الأرقام الزوجية في مصفوفة',
        prompt:
          'ابدأ بمصفوفة فارغة const evenNumbers = [];. استخدم حلقة من 1 لـ 10، ولو الرقم زوجي ضيفه بـ push، وفي النهاية اطبع المصفوفة.',
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
    {
      id: 22,
      partId: 5,
      partTitle: 'الجزء الخامس: المصفوفات',
      title: 'الفصل 22: مراجعة تحليلية وتتبع تحولات المصفوفات (Array Tracing)',
      subtitle: 'تتبع تغيرات الرف، مؤشرات الفهرسة، والتحكم بالبيانات',
      summaryPoints: [
        'التتبع الذهني الدقيق لتسلسل عمليات الإضافة والحذف والتعديل على المصفوفة.',
        'تتبع حركة مؤشرات الـ Index والطول length بعد كل عملية push أو pop.',
        'دمج المصفوفات مع الحلقات والدوال لبناء خوارزميات البحث والفلترة وحساب الإحصائيات.',
      ],
      contentSections: [
        {
          heading: 'تتبع تحولات المصفوفة خطوة بخطوة في عقلك (State Tracing)',
          text: `تعال نمشي مع كود بيعدل في مصفوفة ونشوف شكل الرف بيتغير إزاي في كل سطر يا صديقي:`,
          codeSnippet: `const list = ["A", "B"];

list.push("C");     // الرف أصبح: ["A", "B", "C"] (الطول = 3)
list.unshift("Z");  // الرف أصبح: ["Z", "A", "B", "C"] (الطول = 4)
const last = list.pop(); // خرجت "C" وبقي: ["Z", "A", "B"]

console.log("العنصر المحذوف: " + last); // C
console.log("المصفوفة الحالية: ", list); // ['Z', 'A', 'B']
console.log("العنصر في الرف [1]: " + list[1]); // A (تغير مكانه بعد unshift!)`,
          callout: {
            type: 'warning',
            title: 'انتبه لتغير أماكن الفهارس! ⚠️',
            content:
              'لاحظ يا صديقي إن عملية `unshift` بتزحزح كل العناصر خطوة لليمين، فالعنصر اللي كان رقمه `[0]` أصبح رقمه `[1]`!',
          },
        },
        {
          heading: 'خوارزمية البحث والفلترة اليدوية (Custom Filter Pattern)',
          text: `إزاي نبني دالة ذكية تاخد مصفوفة وترجع مصفوفة جديدة مصفاة بناءً على شرط؟
تعال نبرمج دالة getAdults اللي بتاخد أعمار وترجع فقط أعمار البالغين (18 سنة أو أكبر):`,
          codeSnippet: `function getAdults(ages) {
  const result = [];
  for (const age of ages) {
    if (age >= 18) {
      result.push(age); // بنجمع فقط اللي محقق الشرط
    }
  }
  return result; // بنرجع المصفوفة الجديدة النظيفة
}

const allAges = [12, 25, 17, 30, 15, 19];
const adultsOnly = getAdults(allAges);
console.log("أعمار البالغين فقط: ", adultsOnly); // [25, 30, 19]`,
        },
        {
          heading: 'مصفوفة الفحص الشامل للمصفوفات (Array Master Checklist)',
          text: `قبل ما تكتب أي كود مصفوفات:
1. هل بدأت العد من 0؟ (أول عنصر arr[0]).
2. هل شرط التكرار i < arr.length؟ (مش <= عشان متطبعش undefined).
3. هل استخدمت push للإضافة في النهاية و pop للحذف من النهاية؟
4. هل استخدمت includes للفحص المباشر و indexOf لمعرفة رقم المكان؟`,
          codeSnippet: `const scores = [80, 90, 100];
let max = scores[0];

for (const s of scores) {
  if (s > max) {
    max = s;
  }
}
console.log("أعلى درجة بالبحث اليدوي: " + max); // 100`,
        },
      ],
      exercises: [
        {
          id: 'ch22-ex1',
          title: 'التمرين 1: تتبع تغير الطول والمحتوى',
          code: `const items = [1, 2];
items.push(3);
items.pop();
items.push(4);
console.log(items);`,
          expectedOutput: `[\n  1,\n  2,\n  4\n]`,
          explanation: 'تمت إضافة 3 ثم حذفها ثم إضافة 4.',
        },
        {
          id: 'ch22-ex2',
          title: 'التمرين 2: فلترة الأرقام الأكبر من 10',
          code: `const nums = [5, 12, 8, 20];
const big = [];
for (const n of nums) {
  if (n > 10) big.push(n);
}
console.log(big);`,
          expectedOutput: `[\n  12,\n  20\n]`,
          explanation: 'الأرقام الأكبر من 10 فقط تمت إضافتها.',
        },
      ],
      quiz: [
        {
          id: 'ch22-q1',
          question: 'لو عندنا مصفوفة const a = ["X", "Y"] ونفذنا a.unshift("W")، ما هو العنصر الموجود عند a[0] الآن؟',
          options: [
            {
              id: 'a',
              text: '"W" (لأن unshift أضافته في أول مكان وزحزحت الباقي)',
              isCorrect: true,
              explanation: 'صح جداً وبرافو عليك! 👏 unshift تضع العنصر في الفهرس [0] فوراً.',
            },
            {
              id: 'b',
              text: '"X"',
              isCorrect: false,
              explanation: '"X" انتقلت للمكان [1].',
            },
            {
              id: 'c',
              text: '"Y"',
              isCorrect: false,
              explanation: '"Y" انتقلت للمكان [2].',
            },
          ],
        },
        {
          id: 'ch22-q2',
          question: 'ما هي نتيجة الكود التالي؟\nconst arr = [10, 20, 30];\nconst item = arr.pop();\nconsole.log(arr.length + item);',
          options: [
            {
              id: 'a',
              text: '32 (لأن pop حذفت ورجعت 30، وأصبح طول المصفوفة 2، فمجموع 2 + 30 = 32)',
              isCorrect: true,
              explanation: 'تحليل رياضي وبرمجي عبقري يا صديقي! 🌟 الطول المتبقي 2 مع العنصر 30 ينتج 32.',
            },
            {
              id: 'b',
              text: '33',
              isCorrect: false,
              explanation: 'الطول أصبح 2 وليس 3 لأن pop حذفت عنصراً.',
            },
            {
              id: 'c',
              text: '30',
              isCorrect: false,
              explanation: 'نسيت إضافة طول المصفوفة المتبقي.',
            },
          ],
        },
        {
          id: 'ch22-q3',
          question: 'كيف نتأكد أن عنصراً معيناً موجود داخل المصفوفة قبل حذفه أو تعديله؟',
          options: [
            {
              id: 'a',
              text: 'باستخدام array.includes(item) أو التأكد أن array.indexOf(item) !== -1',
              isCorrect: true,
              explanation: 'إجابة نموذجية يا صديقي! 🎯 هاتان هما الطريقتان القياسيتان للتأكد من وجود العنصر.',
            },
            {
              id: 'b',
              text: 'بمسح المصفوفة بالكامل',
              isCorrect: false,
              explanation: 'المسح يضيع البيانات.',
            },
            {
              id: 'c',
              text: 'بكتابة array.length == 0',
              isCorrect: false,
              explanation: 'length == 0 تعني أن المصفوفة فارغة تماماً.',
            },
          ],
        },
      ],
      challenge: {
        id: 'ch22-chal',
        title: 'تحدي ختام المصفوفات: مصفّي الأسعار والعروض 🏷️',
        prompt:
          'اكتب دالة filterDiscounts(prices) تستقبل مصفوفة أسعار، وترجع مصفوفة جديدة تحتوي فقط على الأسعار الأقل من 100 جنيه. ثم جربها على المصفوفة [150, 80, 200, 45, 99] واطبع النتيجة.',
        hint: 'عرّف const cheap = []; واستخدم for..of مع شرط if (p < 100) cheap.push(p); ثم return cheap;.',
        initialCode: `// اكتب دالة filterDiscounts واستدعاءها وطباعة ناتجها هنا بنفسك...
`,
        solutionCode: `function filterDiscounts(prices) {
  const cheap = [];
  for (const p of prices) {
    if (p < 100) {
      cheap.push(p);
    }
  }
  return cheap;
}

const originalPrices = [150, 80, 200, 45, 99];
console.log(filterDiscounts(originalPrices));`,
      },
    },
  ],
};
