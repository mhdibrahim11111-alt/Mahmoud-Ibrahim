import { Part } from '../../types';

export const part6: Part = {
  id: 6,
  title: 'الجزء السادس: من الكود للصفحة (HTML وCSS وDOM)',
  subtitle: 'لوحة التحكم اللي بتشغّل صفحة الويب التفاعلية',
  description:
    'بناء هيكل الصفحة بـ HTML، تزيينها وتنسيقها بـ CSS، كائنات الـ Objects، والتحكم الحي بالصفحة وأحداث النقر عبر الـ DOM، ومراجعة تحليلية لتتبع تفاعل عناصر الويب.',
  iconName: 'Globe',
  bugHunter: {
    id: 'bug-part-6',
    partId: 6,
    title: 'صائد الأخطاء: مكان السكريبت القاتل في الـ Head 🐛',
    context:
      'الكود ده المفروض يغير نص العنوان لما تدوس على الزرار، لكنه مبيشتغلش إطلاقاً وبيطلع خطأ TypeError: Cannot read properties of null في الكونسول!',
    problemCode: `<!DOCTYPE html>
<html>
  <head>
    <title>صفحتي</title>
    <script>
      const heading = document.getElementById("title");
      const button = document.getElementById("changeButton");

      button.addEventListener("click", function () {
        heading.textContent = "تم التغيير بنجاح! ✨";
      });
    </script>
  </head>
  <body>
    <h1 id="title">العنوان الأصلي</h1>
    <button id="changeButton">غيّر العنوان</button>
  </body>
</html>`,
    bugLineNumber: 4,
    bugDescription:
      'تنفيذ كود JavaScript في <head> قبل أن يرسم المتصفح عناصر <body> في شجرة الـ DOM.',
    whyItHappens:
      'المتصفح بيقرأ الصفحة من فوق لتحت سطر بسطر يا صديقي. لما وصل لكود السكريبت في <head>، مكانتش عناصر <body> ظهرت لسه في الذاكرة! عشان كده document.getElementById("changeButton") رجعت null، ولما حاول الكود يركب مستمع للأحداث على null اشتكى المتصفح فوراً ووقف البرنامج! الحل السحري هو نقل السكريبت لقبل إغلاق </body> مباشرة.',
    fixedCode: `<!DOCTYPE html>
<html>
  <head>
    <title>صفحتي</title>
  </head>
  <body>
    <h1 id="title">العنوان الأصلي</h1>
    <button id="changeButton">غيّر العنوان</button>

    <!-- وضع السكريبت في نهاية body بعد رسم العناصر -->
    <script>
      const heading = document.getElementById("title");
      const button = document.getElementById("changeButton");

      button.addEventListener("click", function () {
        heading.textContent = "تم التغيير بنجاح! ✨";
      });
    </script>
  </body>
</html>`,
    expectedCorrectOutput: `عند النقر على الزرار يتغير العنوان فوراً إلى: "تم التغيير بنجاح! ✨"`,
    hints: [
      'متى يتم تحميل عناصر body بالنسبة لعناصر head أثناء قراءة المتصفح؟',
      'ماذا ترجع getElementById إذا كان العنصر لم يُرسم بعد في الصفحة؟',
      'انقل وسم <script> إلى ما قبل إغلاق </body> مباشرة ليجد كل العناصر جاهزة.',
    ],
  },
  chapters: [
    {
      id: 23,
      partId: 6,
      partTitle: 'الجزء السادس: من الكود للصفحة',
      title: 'الفصل 23: أساسيات HTML (1) — الهيكل العظمي',
      subtitle: 'هيكل الصفحة، الوسوم، العناوين، القوائم، والصور',
      summaryPoints: [
        'HTML (HyperText Markup Language) هي لغة هيكلة صفحات الويب، وهي الهيكل العظمي لأي موقع في العالم.',
        'العناصر بتتكتب بالوسوم: وسم الفتح <tag> والمحتوى ووسم الإغلاق </tag>.',
        'الهيكل الثابت لأي صفحة يبدأ بـ <!DOCTYPE html> ويحتوي على <head> للمعلومات والبيانات الخفية، و <body> لكل ما يراه الزائر.',
        'عائلة العناوين من <h1> للأكبر والأهم إلى <h6> للأصغر، والفقرات <p>، والقوائم <ul> و <ol>.',
      ],
      contentSections: [
        {
          heading: 'تشبيه العظم واللحم واللبس: يعني إيه HTML؟ 🦴',
          text: `لو فكرت في أي صفحة ويب في العالم زي جسم الإنسان يا صديقي:
- الـ HTML هو "الهيكل العظمي": بيحدد مكان الجمجمة (العنوان)، ومكان الأذرع (الأزرار)، ومكان القفص الصدري (المحتوى). بدون عظم، الجسم هينهار ككتلة لحم مفرومة!
- الـ CSS هو "الملابس والمكياج والديكور": بيلون ويجمل وينسق المظهر الخارجي.
- الـ JavaScript هو "المخ والأعصاب والحركة": بيخلي الصفحة تتفاعل وتتحرك وترد على نقرات المستخدم.

لغة HTML مش لغة برمجة فيها شروط وحلقات؛ دي لغة "توصيفية (Markup Language)"، بتستخدم "الوسوم (Tags)" المحصورة بين علامتي < > عشان تقول للمتصفح: "السطر ده عنوان رئيسي، السطر ده فقرة، والصورة دي حطها هنا!".`,
          codeSnippet: `<!-- مثال بسيط على وسوم HTML -->
<h1>مرحباً بكم في منصة زكي كود! 👋</h1>
<p>هنا بنتعلم البرمجة بأسلوب سهل وممتع ومبسط.</p>`,
        },
        {
          heading: 'الهيكل المقدس لأي صفحة ويب في العالم 🏛️',
          text: `أي صفحة ويب قياسية بتبدأ بهيكل ثابت من 4 عناصر رئيسية لا غنى عنها:
1. <!DOCTYPE html>: رسالة للمتصفح بتقول له "الصفحة دي مكتوبة بأحدث معايير HTML5".
2. <html> ... </html>: الحاوية الكبرى (Root) اللي بتضم كل محتويات الصفحة.
3. <head> ... </head>: غرفة التحكم السرية؛ فيها عنوان الصفحة اللي بيظهر في التاب فوق <title> والترميز وربط الخطوط، ومبيظهرش منها حاجة داخل الصفحة نفسها!
4. <body> ... </body>: خشبة المسرح! كل حاجة الزائر بيشوفها بعينه (نصوص، صور، فيديوهات، أزرار) لازم تعيش هنا.`,
          codeSnippet: `<!DOCTYPE html>
<html lang="ar" dir="rtl">
  <head>
    <meta charset="UTF-8">
    <title>صفحتي الأولى</title>
  </head>
  <body>
    <h1>أهلاً بالعالم! 👋</h1>
    <p>هذه أول صفحة ويب أقوم ببرمجتها وتصميمها بنفسي.</p>
  </body>
</html>`,
        },
        {
          heading: 'عائلة العناوين والفقرات والقوائم المنظمة',
          text: `تنظيم المحتوى بيعتمد على وسوم دلالية واضحة:
- العناوين (Headings): من <h1> (أهم وأكبر عنوان في الصفحة) لحد <h6> (أصغر عنوان فرعي).
- الفقرات النصية (Paragraphs): وسم <p> لكتابة الأسطر والفقرات العادية.
- القوائم المنظمة:
  * <ul> (Unordered List): قائمة نقطية غير مرتبة (نقط سوداء).
  * <ol> (Ordered List): قائمة رقمية مرتبة (1، 2، 3...).
  * <li> (List Item): كل عنصر فردي داخل القائمة.`,
          codeSnippet: `<h1>المسار التعليمي</h1>
<p>خطواتك لاحتراف تطوير الويب:</p>

<ol>
  <li>أساسيات JavaScript</li>
  <li>هيكلة الصفحات HTML</li>
  <li>تنسيق المظهر CSS</li>
</ol>`,
          type: 'html_preview',
          htmlCode: `<div class="p-4 bg-slate-900 rounded-xl text-slate-100 border border-slate-700 font-sans" dir="rtl">
  <h1 class="text-xl font-bold text-amber-400 mb-2">المسار التعليمي</h1>
  <p class="text-slate-300 text-sm mb-3">خطواتك لاحتراف تطوير الويب:</p>
  <ol class="list-decimal list-inside text-sm text-slate-200 space-y-1">
    <li>أساسيات JavaScript</li>
    <li>هيكلة الصفحات HTML</li>
    <li>تنسيق المظهر CSS</li>
  </ol>
</div>`,
        },
        {
          heading: 'إضافة الصور <img> والروابط <a> والوسوم الذاتية',
          text: `وسم الصورة <img> عنصر فارغ ذاتي الإغلاق (void element)، يعني مش بنكتبله وسم إغلاق </img>.
بيحتاج خاصيتين (Attributes) مهمين:
- src: مسار أو رابط الصورة على الإنترنت.
- alt: نص بديل يصف الصورة لمحركات البحث وقارئات الشاشة للمكفوفين، ويظهر مكان الصورة إذا تعذر تحميلها.

أما الروابط <a> (Anchor) فبتحتاج خاصية href لتحديد الصفحة التي سينتقل إليها المستخدم عند النقر.`,
          codeSnippet: `<!-- رابط ينتقل لموقع خارجي -->
<a href="https://google.com">ابحث في جوجل</a>

<!-- صورة مع نص بديل دقيق -->
<img src="logo.png" alt="شعار منصة زكي كود" loading="lazy">`,
          callout: {
            type: 'tip',
            title: 'قاعدة الـ h1 الذهبية 🔍',
            content:
              'رتّب العناوين بشكل يوضّح أقسام الصفحة يا صديقي: h1 للعنوان الرئيسي الكبير، وبعده h2 و h3 للعناوين الفرعية. التنظيم الهرمي ده بيخلي موقعك يتصدر نتائج محركات البحث بسهولة!',
          },
        },
      ],
      exercises: [
        {
          id: 'ch23-ex1',
          title: 'التمرين 1: قائمة المشتريات النقطية',
          code: `<ul>
  <li>تفاح</li>
  <li>موز</li>
  <li>برتقال</li>
</ul>`,
          expectedOutput: 'معاينة قائمة نقطية تحتوي على تفاح وموز وبرتقال.',
          explanation: 'استخدام ul لإنشاء قائمة غير مرتبة مع li لكل عنصر.',
        },
        {
          id: 'ch23-ex2',
          title: 'التمرين 2: رابط موقع مع صورة',
          code: `<a href="https://example.com">
  <img src="photo.jpg" alt="صورة توضيحية">
</a>`,
          expectedOutput: 'معاينة رابط قابل للنقر يحيط بالصورة.',
          explanation: 'وضع img داخل وسم a يجعل الصورة نفسها قابلة للنقر كرابط.',
        },
      ],
      quiz: [
        {
          id: 'ch23-q1',
          question: 'إيه الفرق الأساسي بين وسوم العناوين <h1> والفقرات <p> في HTML يا صديقي؟',
          options: [
            {
              id: 'a',
              text: '<h1> لعنوان رئيسي عريض وهام دلالياً، بينما <p> للفقرات النصية العادية',
              isCorrect: true,
              explanation: 'صح جداً وبرافو عليك! 📝 h1 اختصار Heading 1 وهو أهم عنوان في الصفحة، و p اختصار Paragraph.',
            },
            {
              id: 'b',
              text: '<p> بتعرض كود برمجي فقط',
              isCorrect: false,
              explanation: 'الكود بيتعرض بوسوم زي <code> أو <pre>.',
            },
            {
              id: 'c',
              text: 'مفيش أي فرق بينهم',
              isCorrect: false,
              explanation: 'المتصفحات ومحركات البحث بتعتمد على العناوين لتنظيم وفهم هيكل الصفحة.',
            },
          ],
        },
        {
          id: 'ch23-q2',
          question: 'لكتابة قائمة نقطية غير مرتبة (Bullet Points) بنستخدم وسم إيه؟',
          options: [
            {
              id: 'a',
              text: '<ul> مع <li>',
              isCorrect: true,
              explanation: 'برافو! 🎯 ul اختصار Unordered List و li اختصار List Item.',
            },
            {
              id: 'b',
              text: '<ol> مع <li>',
              isCorrect: false,
              explanation: '<ol> مخصصة للقوائم الرقمية المرتبة (Ordered 1, 2, 3).',
            },
            {
              id: 'c',
              text: '<list>',
              isCorrect: false,
              explanation: 'مفيش وسم في HTML اسمه <list>.',
            },
          ],
        },
        {
          id: 'ch23-q3',
          question: 'أين يجب وضع العناصر التي نريد للزائر أن يراها ويتفاعل معها على الشاشة؟',
          options: [
            {
              id: 'a',
              text: 'داخل وسم <body> ... </body>',
              isCorrect: true,
              explanation: 'إجابة نموذجية يا صديقي! 🌟 body هي خشبة المسرح المرئية بالكامل للزائر.',
            },
            {
              id: 'b',
              text: 'داخل وسم <head> ... </head>',
              isCorrect: false,
              explanation: 'وسم head مخصص للبيانات الوصفية والعناوين الخفية فقط.',
            },
            {
              id: 'c',
              text: 'خارج وسم <html> في أي مكان',
              isCorrect: false,
              explanation: 'كل شيء يجب أن يكون داخل وسم html.',
            },
          ],
        },
      ],
      challenge: {
        id: 'ch23-chal',
        title: 'وريني شطارتك 🧠: كارت المبرمج في HTML',
        prompt:
          'اكتب كود HTML مباشر لبطاقة فيها عنوان <h1> باسمك، وفقرة <p> بالنص "أنا مبرمج ويب"، وقائمة <ul> فيها مهارتان داخل <li>.',
        hint: 'اكتب وسوم h1 و p و ul/li مباشرة دون console.log.',
        initialCode: `<!-- اكتب وسوم الـ HTML بالترتيب هنا بنفسك... -->
`,
        solutionCode: `<h1>زكي كود</h1>
<p>أنا مبرمج ويب</p>
<ul>
  <li>JavaScript</li>
  <li>HTML</li>
</ul>`,
      },
    },
    {
      id: 24,
      partId: 6,
      partTitle: 'الجزء السادس: من الكود للصفحة',
      title: 'الفصل 24: أساسيات CSS (1) — الألوان والمظهر',
      subtitle: 'تلوين وتنسيق: اللون، الخلفية، والخطوط',
      summaryPoints: [
        'CSS (Cascading Style Sheets) هي لغة الأناقة والجمال المسؤولة عن تزيين وتنسيق صفحات الويب.',
        'قاعدة CSS بتتكون من: المحدد (Selector) والخاصية (Property) والقيمة (Value).',
        'التحكم في الألوان: color للخطوط والنصوص، و background-color لخلفية العنصر أو الصفحة.',
        'تنسيق الخطوط: font-size للحجم، و text-align للمحاذاة، و font-family لنوع وشكل الخط.',
      ],
      contentSections: [
        {
          heading: 'تشبيه مصمم الديكور والملابس الشيك: يعني إيه CSS؟ 🎨',
          text: `لو HTML بنى لك شقة على الطوب الأحمر يا صديقي..
هل هتقعد فيها وتعيش وهي على المحارة كده؟ مستحيل!
إنت محتاج نقاش يدهن الحوائط بألوان مبهجة، ومهندس ديكور يركب الإضاءة والستائر والباركيه!
مهندس الديكور ده هو بالظبط "لغة CSS".
CSS هي المسؤولة عن تحويل صفحة الويب من صفحة رمادية كئيبة شكلها زي ورقة وورد سنة 1995، إلى موقع عصري ساحر جذاب زي فيسبوك أو يوتيوب!`,
          codeSnippet: `/* جعل كل العناوين باللون البرتقالي ومحاذاة في المنتصف */
h1 {
  color: orange;
  font-size: 28px;
  text-align: center;
}`,
        },
        {
          heading: 'قاعدة CSS الذهبية (The CSS Rule): فك الشفرة',
          text: `أي كود CSS في الكون بيتكتب بقاعدة واحدة ثابتة:
1. المحدّد (Selector): بنشاور على العنصر اللي عايزين نلونه (مثلاً: h1 أو p أو button أو .card).
2. الأقواس المعقوصة { }: بنفتح قوسين نحط جواهم كل التعديلات.
3. الخاصية والقيمة (Property: Value;): بنكتب اسم الخاصية (زي color)، ثم نقطتين، ثم القيمة متبوعة بفاصلة منقوطة (;).`,
          codeSnippet: `p {
  color: #38bdf8;          /* لون النص سماوي جميل */
  background-color: #0f172a; /* لون الخلفية كحلي داكن */
  font-size: 18px;          /* حجم الخط */
  line-height: 1.6;         /* تباعد مريح بين الأسطر */
}`,
        },
        {
          heading: 'التحكم في الألوان والخطوط مع معاينة حية 🌈',
          text: `من أشهر خواص CSS اللي هتستخدمها كل يوم:
- color: لون الكلام نفسه.
- background-color: لون الصندوق أو خلفية الصفحة.
- font-size: حجم الخط بالبيكسل (px) أو (rem).
- text-align: محاذاة النص: center (في النص)، right (يمين)، left (شمال).
- font-weight: سُمك الخط: bold (عريض) أو normal (عادي).`,
          codeSnippet: `<!DOCTYPE html>
<html>
<head>
  <style>
    .welcome-card {
      background-color: #1e293b;
      color: #f8fafc;
      padding: 20px;
      text-align: center;
      border-radius: 12px;
    }
    .welcome-card h2 {
      color: #fbbf24;
      font-size: 24px;
    }
  </style>
</head>
<body>
  <div class="welcome-card">
    <h2>تصميم عصري بـ CSS</h2>
    <p>أصبح موقعك الآن جاهزاً لإبهار الزوار بالألوان والترتيب.</p>
  </div>
</body>
</html>`,
          type: 'html_preview',
          htmlCode: `<div class="p-6 bg-slate-800 text-slate-100 rounded-2xl text-center border border-slate-700 shadow-xl max-w-md mx-auto" dir="rtl">
  <h2 class="text-2xl font-bold text-amber-400 mb-2">تصميم عصري بـ CSS</h2>
  <p class="text-slate-300 text-sm leading-relaxed">أصبح موقعك الآن جاهزاً لإبهار الزوار بالألوان والترتيب والأناقة البصرية.</p>
</div>`,
          callout: {
            type: 'warning',
            title: 'إياك ونسيان الفاصلة المنقوطة (;)! ⛔',
            content:
              'الفاصلة المنقوطة بتفصل تعليمات CSS عن بعضها. نسيانها بين خاصيتين ممكن يخلي المتصفح يتلخبط ويتجاهل تنسيق الصفحة بالكامل!',
          },
        },
      ],
      exercises: [
        {
          id: 'ch24-ex1',
          title: 'التمرين 1: تنسيق الفقرة باللون الأحمر',
          code: `p {
  color: red;
  font-size: 20px;
}`,
          expectedOutput: 'معاينة فقرة بخط أحمر حجمه 20px.',
          explanation: 'تطبيق خاصيتي color و font-size على الفقرة.',
        },
        {
          id: 'ch24-ex2',
          title: 'التمرين 2: محاذاة العنوان وتلوين الخلفية',
          code: `h1 {
  background-color: #334155;
  color: white;
  text-align: center;
}`,
          expectedOutput: 'معاينة عنوان بخلفية رمادية داكنة ونصوص بيضاء متوسطة.',
          explanation: 'توسيط العنوان مع خلفية مميزة.',
        },
      ],
      quiz: [
        {
          id: 'ch24-q1',
          question: 'خاصية CSS المسؤولة عن تغيير لون خلفية العنصر هي:',
          options: [
            {
              id: 'a',
              text: 'background-color',
              isCorrect: true,
              explanation: 'صح جداً وبرافو عليك! 👏 color للنص، بينما background-color للخلفية.',
            },
            {
              id: 'b',
              text: 'text-color',
              isCorrect: false,
              explanation: 'مفيش خاصية في CSS اسمها text-color.',
            },
            {
              id: 'c',
              text: 'bg-font',
              isCorrect: false,
              explanation: 'الخاصية القياسية الرسمية هي background-color.',
            },
          ],
        },
        {
          id: 'ch24-q2',
          question: 'لتوسيط النص في منتصف الصفحة أفقياً نستخدم أنهي خاصية يا صديقي؟',
          options: [
            {
              id: 'a',
              text: 'text-align: center;',
              isCorrect: true,
              explanation: 'برافو! 🎯 text-align بتتحكم في محاذاة الكلمات (center / right / left).',
            },
            {
              id: 'b',
              text: 'align: middle;',
              isCorrect: false,
              explanation: 'خاصية align قديمة وغير قياسية في CSS.',
            },
            {
              id: 'c',
              text: 'font-center: true;',
              isCorrect: false,
              explanation: 'لا توجد خاصية بهذا الاسم إطلاقاً.',
            },
          ],
        },
        {
          id: 'ch24-q3',
          question: 'ما هو دور المحدّد (Selector) في قاعدة CSS؟',
          options: [
            {
              id: 'a',
              text: 'يحدد العنصر أو الفئة (Class) المستهدفة للتلوين والتنسيق في صفحة HTML',
              isCorrect: true,
              explanation: 'إجابة ممتازة! 🎯 Selector يشير للعنصر المراد تزيينه بدقة.',
            },
            {
              id: 'b',
              text: 'يحذف العناصر غير المرغوبة من الصفحة',
              isCorrect: false,
              explanation: 'CSS لا يحذف عناصر من شجرة الـ DOM.',
            },
            {
              id: 'c',
              text: 'ينشئ وسوماً جديدة في HTML',
              isCorrect: false,
              explanation: 'إنشاء الوسوم وظيفة كود HTML وليس CSS.',
            },
          ],
        },
      ],
      challenge: {
        id: 'ch24-chal',
        title: 'وريني شطارتك 🧠: كود التنسيق الملكي',
        prompt:
          'اكتب قاعدة CSS للكلاس .highlight تجعل لون النص أصفر باستخدام color: yellow ولون الخلفية أسود باستخدام background-color: black.',
        hint: '.highlight { color: yellow; background-color: black; }',
        initialCode: `/* اكتب قاعدة CSS لكلاس highlight هنا بنفسك... */
`,
        solutionCode: `.highlight {
  color: yellow;
  background-color: black;
}`,
      },
    },
    {
      id: 25,
      partId: 6,
      partTitle: 'الجزء السادس: من الكود للصفحة',
      title: 'الفصل 25: تقسيم الصفحة والمدخلات (HTML 2) — النماذج والحاويات',
      subtitle: 'حاويات div ومدخلات input وأزرار button',
      summaryPoints: [
        'وسم <div> هو الصندوق والحاوية الأكثر استخداماً على الإطلاق لتجميع وتقسيم أجزاء الصفحة لكتل منظمة.',
        'وسم <input> بيسمح باستقبال بيانات من المستخدم (نصوص، أرقام، كلمات سر، تواريخ).',
        'خاصية placeholder بتعرض نصاً إرشادياً رمادياً يختفي فور بدء الكتابة.',
        'وسم <button> يمثل زر الإجراء والنقر، و <label> لتسمية الحقول وربطها برقم id الخاص بكل حقل.',
      ],
      contentSections: [
        {
          heading: 'الصناديق السحرية: وسم <div> وتقسيم الصفحة 📦',
          text: `لو عندك شقة واسعة بدون أي جدران أو غرف.. هتكون فوضى عارمة!
عشان كده بنبني حوائط نقسم بيها الشقة لمطبخ وصالة وأوضة نوم.
في HTML، الحائط والصندوق ده هو وسم <div> (اختصار لـ Division أو قسم).
الـ <div> ملوش شكل مرئي بنفسه، هو "كرتونة فاضية شفافة" بنحط جواها عناصر مترابطة عشان نقدر ننسقهم ككتلة واحدة ونديهم خلفية وهوامش وترتيب مميز!`,
          codeSnippet: `<div class="profile-card">
  <h2>أحمد محمود</h2>
  <p>مطور واجهات ومبرمج جافاسكريبت</p>
</div>`,
        },
        {
          heading: 'حقول الإدخال <input> وأنواعها السحرية ⌨️',
          text: `أي تطبيق في الدنيا (فيسبوك، أمازون، نتفليكس) محتاج المستخدم يدخل بيانات: اسمه، باسورد، إيميل، أو تاريخ ميلاده.
العنصر المسؤول عن ده هو وسم <input> (وهو ذاتي الإغلاق).
السر كله في خاصية type:
- type="text": حقل لكتابة نص عادي.
- type="password": بيخفي الحروف بنقاط سرية لحماية الخصوصية.
- type="number": حقل يقبل الأرقام فقط.
- type="email": بيفحص شكل البريد الإلكتروني ووجود علامة @.`,
          codeSnippet: `<input type="text" placeholder="اكتب اسمك بالكامل">
<input type="password" placeholder="أدخل كلمة المرور">
<input type="number" min="1" max="100" placeholder="العمر">`,
        },
        {
          heading: 'بناء نموذج تسجيل متكامل (Interactive Form)',
          text: `تعال نجمع الـ <div> والـ <label> وحقول الـ <input> مع زرار <button> لبناء نموذج تسجيل أنيق:`,
          codeSnippet: `<form class="login-box">
  <h3>تسجيل الدخول</h3>
  <label for="email">البريد الإلكتروني:</label>
  <input id="email" name="email" type="email" placeholder="name@example.com">
  <label for="password">كلمة المرور:</label>
  <input id="password" name="password" type="password" placeholder="••••••••">
  <button type="submit">دخول 🚀</button>
</form>`,
          type: 'html_preview',
          htmlCode: `<form class="p-6 bg-slate-900 border border-slate-700 rounded-2xl max-w-sm mx-auto shadow-2xl font-sans" dir="rtl">
  <h3 class="text-xl font-bold text-amber-400 mb-4 text-center">تسجيل الدخول</h3>
  <div class="space-y-3">
    <div>
      <label for="email" class="block text-xs font-semibold text-slate-300 mb-1">البريد الإلكتروني:</label>
      <input id="email" name="email" type="email" placeholder="student@codemasr.com" class="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-100 text-sm focus:outline-none focus:border-amber-400" />
    </div>
    <div>
      <label for="password" class="block text-xs font-semibold text-slate-300 mb-1">كلمة المرور:</label>
      <input id="password" name="password" type="password" placeholder="••••••••" class="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-100 text-sm focus:outline-none focus:border-amber-400" />
    </div>
    <button class="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold rounded-lg transition shadow-lg mt-2 text-sm">
      تسجيل الدخول 🚀
    </button>
  </div>
</form>`,
        },
      ],
      exercises: [
        {
          id: 'ch25-ex1',
          title: 'التمرين 1: حقل كلمة المرور المشفر بصرياً',
          code: `<label for="password">كلمة المرور:</label>
<input id="password" name="password" type="password" placeholder="••••••••">`,
          expectedOutput: 'معاينة حقل كلمة مرور يخفي الأحرف المدخلة.',
          explanation: 'type="password" يخفي الحروف بنقاط سرية.',
        },
        {
          id: 'ch25-ex2',
          title: 'التمرين 2: زر الإجراء مع حاوية div',
          code: `<div class="actions">
  <button type="button">إلغاء</button>
  <button type="submit">حفظ التعديلات</button>
</div>`,
          expectedOutput: 'معاينة زرين داخل حاوية واحدة.',
          explanation: 'تجميع الأزرار في div يسهل توزيعها وتنسيقها.',
        },
      ],
      quiz: [
        {
          id: 'ch25-q1',
          question: 'لو عايزين نعمل حقل إدخال يخفي الحروف اللي بتتكتب بنقاط سرية، بنحدد type إيه يا صديقي؟',
          options: [
            {
              id: 'a',
              text: 'type="password"',
              isCorrect: true,
              explanation: 'صح! 🔒 نوع password يخفي الأحرف على الشاشة بنقاط سرية لحماية الخصوصية.',
            },
            {
              id: 'b',
              text: 'type="hidden"',
              isCorrect: false,
              explanation: 'نوع hidden يخفي الحقل بالكامل عن الشاشة للمتغيرات الداخلية.',
            },
            {
              id: 'c',
              text: 'type="secret"',
              isCorrect: false,
              explanation: 'مفيش نوع في HTML اسمه secret.',
            },
          ],
        },
        {
          id: 'ch25-q2',
          question: 'ما فائدة ربط وسم <label for="xyz"> مع حقل <input id="xyz">؟',
          options: [
            {
              id: 'a',
              text: 'عند النقر على النص في label يتم تفعيل الحقل وتوجيه المؤشر داخله فوراً',
              isCorrect: true,
              explanation: 'برافو عليك يا صديقي! 🎯 ميزة رائعة لتحسين تجربة المستخدم وسهولة الوصول.',
            },
            {
              id: 'b',
              text: 'يغير لون الحقل للون الأزرق',
              isCorrect: false,
              explanation: 'الألوان مسؤولة عنها لغة CSS.',
            },
            {
              id: 'c',
              text: 'يحفظ كلمة المرور في قاعدة البيانات',
              isCorrect: false,
              explanation: 'الحفظ مسؤولية السيرفر وقواعد البيانات.',
            },
          ],
        },
        {
          id: 'ch25-q3',
          question: 'ما هو دور خاصية placeholder في حقول الإدخال؟',
          options: [
            {
              id: 'a',
              text: 'عرض نص إرشادي رمادي يختفي فور أن يبدأ المستخدم في الكتابة',
              isCorrect: true,
              explanation: 'ممتاز جداً! 💡 placeholder يعطي تلميحاً سريعاً عما يجب كتابته.',
            },
            {
              id: 'b',
              text: 'قفل الحقل ومنع الكتابة فيه',
              isCorrect: false,
              explanation: 'قفل الحقل وظيفته خاصية disabled.',
            },
            {
              id: 'c',
              text: 'تكبير حجم الخط',
              isCorrect: false,
              explanation: 'تغيير الحجم يتم عبر font-size في CSS.',
            },
          ],
        },
      ],
      challenge: {
        id: 'ch25-chal',
        title: 'وريني شطارتك 🧠: نموذج بريد إلكتروني',
        prompt:
          'اكتب نموذج HTML فيه label مرتبط بحقل بريد باستخدام for و id، وحقل type="email"، وزر إرسال.',
        hint: 'اجعل قيمة label for مساوية لـ id الحقل، واستخدم button type="submit".',
        initialCode: `<!-- اكتب نموذج البريد الإلكتروني هنا بنفسك... -->
`,
        solutionCode: `<form>
  <label for="email">البريد الإلكتروني</label>
  <input id="email" name="email" type="email" placeholder="example@mail.com">
  <button type="submit">إرسال</button>
</form>`,
      },
    },
    {
      id: 26,
      partId: 6,
      partTitle: 'الجزء السادس: من الكود للصفحة',
      title: 'الفصل 26: تزيين الأزرار وتأثيرات الفأرة (CSS 2) — Box Model & Hover',
      subtitle: 'الحواف الدائرية، الظلال، و:hover',
      summaryPoints: [
        'نموذج الصندوق (Box Model) يتكون من: المحتوى، والحشوة الداخلية (padding)، والحدود (border)، والهامش الخارجي (margin).',
        'خاصية border-radius تحول الحواف الحادة لأركان ناعمة دائرية جذابة وعصرية.',
        'تأثير :hover هو ساحر تفاعل الفأرة؛ يغير اللون والشكل فور مرور الماوس فوق الزر.',
        'خاصية cursor: pointer تجعل مؤشر الماوس يتحول لشكل اليد المشيرة للدلالة على قابلية النقر.',
      ],
      contentSections: [
        {
          heading: 'صندوق الملاكمة (The Box Model): تشبيه مخدات الكرتونة 📦',
          text: `كل عنصر في صفحة الويب عبارة عن "صندوق مستطيل"، والصندوق ده جواه 4 طبقات:
1. المحتوى (Content): النص أو الأيقونة نفسها.
2. الحشوة الداخلية (Padding): المخدات الإسفنجية اللي بتبعد النص عن حافة الصندوق عشان ميبقاش لازق ومخنوق.
3. الحدود (Border): السور أو البرواز اللي بيحيط بالصندوق (خط عريض أو رفيع).
4. الهامش الخارجي (Margin): المسافة بين الصندوق ده والصناديق التانية اللي جنبه عشان ميبقوش راكبين فوق بعض!`,
          codeSnippet: `.my-box {
  padding: 15px;         /* مسافة مريحة جوه */
  border: 2px solid gold; /* برواز ذهبي */
  margin: 20px;          /* مسافة بره تبعده عن الجيران */
}`,
        },
        {
          heading: 'تحويل الأزرار من أشكال كلاسيكية لأزرار تطبيقات حديثة',
          text: `الأزرار الافتراضية في المتصفح شكلها رمادي قديم وممل.
بـ 4 أسطر CSS بسيطة نقدر نحول الزرار لزرار فخم زي أزرار آبل وسبوتيفاي:
- border-radius: 8px لتدوير الحواف الحادة.
- border: none لإلغاء البرواز الرمادي القديم.
- cursor: pointer لتغيير الماوس ليد المشيرة.
- box-shadow لإضافة ظل ثلاثي الأبعاد يعطي عمقاً بصرياً.`,
          codeSnippet: `.btn-modern {
  background-color: #f59e0b;
  color: #0f172a;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(245, 158, 11, 0.4);
  transition: all 0.3s ease;
}`,
        },
        {
          heading: 'سحر تفاعل الفأرة: الـ :hover والتحولات الناعمة ✨',
          text: `عشان المستخدم يحس إن الموقع عايش ومتفاعل معاه، بنستخدم الـ Pseudo-class السحرية :hover.
:hover معناها: "لما المستخدم يمرر سهم الفأرة فوق الزرار.. نفذ التنسيقات دي فوراً!".
ومع خاصية transition: 0.3s، التغيير مش هيحصل فجأة وبشكل فج، بل هيحصل بحركة انسيابية ناعمة تبهر العين!`,
          codeSnippet: `/* الحالة الطبيعية */
.btn-hover-demo {
  background-color: #3b82f6;
  color: white;
  transition: transform 0.2s, background-color 0.2s;
}

/* حالة مرور الماوس فوق الزر */
.btn-hover-demo:hover {
  background-color: #2563eb;
  transform: translateY(-2px); /* رفعة خفيفة لأعلى */
}`,
          type: 'html_preview',
          htmlCode: `<div class="p-8 bg-slate-900 rounded-2xl border border-slate-700 text-center max-w-sm mx-auto shadow-2xl" dir="rtl">
  <p class="text-xs text-slate-400 mb-4 font-mono">جرّب مرر الماوس (Hover) فوق الزرار:</p>
  <button class="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold rounded-xl shadow-lg hover:shadow-amber-500/50 hover:-translate-y-1 transition duration-300 cursor-pointer text-sm">
    اشترك في الكورس الآن ✨
  </button>
</div>`,
        },
      ],
      exercises: [
        {
          id: 'ch26-ex1',
          title: 'التمرين 1: تأثير المرور hover مع تدوير الحواف',
          code: `button {
  border-radius: 8px;
  background-color: blue;
  color: white;
  transition: background-color 0.3s;
}
button:hover {
  background-color: darkblue;
}`,
          expectedOutput: 'معاينة زر بحواف دائرية يتغير لونه عند المرور عليه.',
          explanation: 'دمج border-radius مع :hover للحصول على زر تفاعلي عصري.',
        },
        {
          id: 'ch26-ex2',
          title: 'التمرين 2: الفرق بين padding و margin',
          code: `.card {
  padding: 20px; /* مسافة داخلية */
  margin: 15px;  /* مسافة خارجية */
  border: 1px solid #475569;
}`,
          expectedOutput: 'معاينة بطاقة بمساحات داخلية وخارجية مريحة.',
          explanation: 'padding يوسع الصندوق من الداخل و margin يبعده عن العناصر المجاورة.',
        },
      ],
      quiz: [
        {
          id: 'ch26-q1',
          question: 'خاصية border-radius وظيفتها إيه بالظبط في CSS يا صديقي؟',
          options: [
            {
              id: 'a',
              text: 'تدوير حواف وأركان الصندوق لجعلها منحنية وناعمة',
              isCorrect: true,
              explanation: 'صح جداً! 👏 كل ما تزود القيمة (مثلاً 12px أو 50%) كل ما الحواف تكون دائرية أكثر.',
            },
            {
              id: 'b',
              text: 'تغيير لون الحدود',
              isCorrect: false,
              explanation: 'لون الحدود بيتم عبر border-color.',
            },
            {
              id: 'c',
              text: 'مسح محتوى الصندوق',
              isCorrect: false,
              explanation: 'لا تؤثر على المحتوى الداخلي إطلاقاً.',
            },
          ],
        },
        {
          id: 'ch26-q2',
          question: 'إيه الفرق الجوهري بين padding و margin في نموذج الصندوق (Box Model)؟',
          options: [
            {
              id: 'a',
              text: 'padding مسافة داخلية بين المحتوى والحدود، بينما margin مسافة خارجية تبعد الصندوق عن جيرانه',
              isCorrect: true,
              explanation: 'تحليل دقيق وممتاز يا صديقي! 🌟 padding جوه الصندوق و margin بره السور.',
            },
            {
              id: 'b',
              text: 'padding للخلفية و margin للنص',
              isCorrect: false,
              explanation: 'الاثنان مسافات ومساحات فراغ، أحدهما داخلي والآخر خارجي.',
            },
            {
              id: 'c',
              text: 'مفيش فرق في المعنى والاستخدام',
              isCorrect: false,
              explanation: 'الفرق جوهري ويحدد توزيع الصفحة بالكامل.',
            },
          ],
        },
        {
          id: 'ch26-q3',
          question: 'تأثير :hover في CSS بيشتغل إمتى بالظبط؟',
          options: [
            {
              id: 'a',
              text: 'أول ما المستخدم يمرر سهم الفأرة فوق العنصر',
              isCorrect: true,
              explanation: 'برافو عليك! 🎯 :hover هي المسؤولة عن رد الفعل البصري لمرور الماوس.',
            },
            {
              id: 'b',
              text: 'عند إغلاق المتصفح',
              isCorrect: false,
              explanation: 'لا علاقة له بإغلاق الصفحة.',
            },
            {
              id: 'c',
              text: 'فقط على شاشات الهواتف بدون ماوس',
              isCorrect: false,
              explanation: 'يعمل بالأساس مع أجهزة الكمبيوتر التي تستخدم مؤشر فأرة.',
            },
          ],
        },
      ],
      challenge: {
        id: 'ch26-chal',
        title: 'وريني شطارتك 🧠: حواف الزرار المستديرة',
        prompt:
          'اكتب قاعدة CSS مباشرة تجعل أزرار button بحواف دائرية (border-radius: 12px;) ومؤشر ماوس بشكل اليد (cursor: pointer;).',
        hint: 'button { border-radius: 12px; cursor: pointer; }',
        initialCode: `/* اكتب كود تدوير حواف الأزرار هنا بنفسك... */
`,
        solutionCode: `button {
  border-radius: 12px;
  cursor: pointer;
}`,
      },
    },
    {
      id: 27,
      partId: 6,
      partTitle: 'الجزء السادس: من الكود للصفحة',
      title: 'الفصل 27: ألوان الشاشات RGB و Hex والشفافية (CSS 3)',
      subtitle: 'خلط درجات الضوء: أحمر، أخضر، أزرق والتدرجات',
      summaryPoints: [
        'شاشات الموبايل والكمبيوتر بتصنع ملايين الألوان بخلط 3 أنوار ضوئية: Red و Green و Blue.',
        'نظام rgb(r, g, b) يقبل أرقاماً من 0 إلى 255 لكل لون.',
        'نظام rgba(r, g, b, a) يضيف معامل الشفافية Alpha من 0 (شفاف تماماً) إلى 1 (معتم).',
        'شفرات الهكس (Hex Codes) تستخدم علامة # متبوعة بـ 6 خانات هكساديسيمال (#ff6600)، والتدرجات بـ linear-gradient.',
      ],
      contentSections: [
        {
          heading: 'كيف تفهم الشاشات الألوان؟ خلط أضواء RGB 💡',
          text: `في حصة الرسم بالمدرسة، كنت بتخلط الألوان بالفرشاة..
لكن شاشات الإلكترونيات مش بتخلط دهانات، بتخلط "أنوار ضوء"!
كل بكسل على شاشتك بيتكون من 3 لمبات ميكروسكوبية ملونة:
- Red (أحمر)
- Green (أخضر)
- Blue (أزرق)
ومن هنا جه اسم نظام RGB!
كل لمبة نقدر نتحكم في شدة إضاءتها من 0 (اللمبة مطفية تماماً) لحد 255 (اللمبة منورة بأعلى طاقة ممكنة):
- rgb(255, 0, 0): أحمر نقي صافي.
- rgb(0, 255, 0): أخضر نقي.
- rgb(0, 0, 255): أزرق نقي.
- rgb(0, 0, 0): كل اللمبات مطفية (اللون الأسود).
- rgb(255, 255, 255): كل اللمبات شغالة بأقصى قوة (اللون الأبيض).`,
          codeSnippet: `/* ألوان بنظام RGB */
.danger-badge {
  background-color: rgb(239, 68, 68); /* أحمر */
  color: rgb(255, 255, 255);          /* أبيض */
}`,
        },
        {
          heading: 'الشفافية وزجاج الهواتف مع RGBA (Glassmorphism) 🪟',
          text: `لو عايز تعمل خلفية نصف شفافة تبين الصورة اللي تحتها بنعومة (زي تصميمات الآيفون وويندوز الحديثة Glassmorphism):
بنضيف حرف رابع اسمه Alpha: نظام RGBA!
الحرف A بياخد قيمة عشرية بين 0 و 1:
- 1: معتم تماماً (Solid).
- 0.5: نصف شفاف 50%.
- 0: شفاف بالكامل كأنه هواء!`,
          codeSnippet: `.glass-panel {
  background-color: rgba(15, 23, 42, 0.75); /* كحلي بشفافية 75% */
  backdrop-filter: blur(10px);              /* تأثير ضبابي زجاجي */
  border: 1px solid rgba(255, 255, 255, 0.1);
}`,
        },
        {
          heading: 'أكواد الهكس السحرية (Hex Codes) والتدرجات اللونية 🌈',
          text: `شفرات الهكس (Hexadecimal) هي الأكثر شهرة في تصميم الويب:
بتبدأ دائماً بعلامة الشباك # متبوعة بـ 6 رموز (أرقام من 0 لـ 9، وحروف من a لـ f):
- أول خانتين للـ Red.
- الخانتين اللي في النص للـ Green.
- آخر خانتين للـ Blue.
مثلاً: #ff0000 هو الأحمر، و #3b82f6 هو الأزرق العصري.

والمتعة الحقيقية بتكمل مع التدرجات اللونية (Linear Gradients) لخلط لونين في خلفية واحدة انسيابية:`,
          codeSnippet: `.gradient-bg {
  background: linear-gradient(135deg, #f59e0b, #ef4444);
  color: white;
  padding: 20px;
  border-radius: 16px;
}`,
          type: 'html_preview',
          htmlCode: `<div class="p-6 rounded-2xl shadow-xl max-w-sm mx-auto text-white text-center font-sans" style="background: linear-gradient(135deg, #f59e0b, #ef4444);" dir="rtl">
  <h3 class="text-xl font-bold mb-1">تدرج لوني ساحر (Gradient)</h3>
  <p class="text-xs text-amber-100">دمج الألوان بشفرات Hex بانسيابية فائقة تجذب انتباه المستخدم فوراً.</p>
</div>`,
        },
      ],
      exercises: [
        {
          id: 'ch27-ex1',
          title: 'التمرين 1: لون نصف شفاف بـ rgba',
          code: `div {
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
}`,
          expectedOutput: 'معاينة صندوق بخلفية سوداء نصف شفافة.',
          explanation: 'معامل Alpha بقيمة 0.5 يجعل الخلفية شفافة بنسبة 50%.',
        },
        {
          id: 'ch27-ex2',
          title: 'التمرين 2: تدرج لوني جذاب',
          code: `.card {
  background: linear-gradient(to right, #2563eb, #9333ea);
  color: white;
}`,
          expectedOutput: 'معاينة تدرج لوني انسيابي من الأزرق إلى البنفسجي.',
          explanation: 'linear-gradient يدمج لونين بانسيابية فائقة.',
        },
      ],
      quiz: [
        {
          id: 'ch27-q1',
          question: 'الحرف A في نظام الألوان rgba بيرمز لإيه يا صديقي؟',
          options: [
            {
              id: 'a',
              text: 'Alpha: معامل الشفافية بين 0 (شفاف تماماً) و 1 (معتم)',
              isCorrect: true,
              explanation: 'صح جداً! 👏 Alpha هي اللي بتخليك تشوف العناصر والصور اللي وراء الصندوق.',
            },
            {
              id: 'b',
              text: 'Auto: تلوين تلقائي',
              isCorrect: false,
              explanation: 'لا علاقة له بالوضع التلقائي.',
            },
            {
              id: 'c',
              text: 'Aqua: درجة اللون المائي',
              isCorrect: false,
              explanation: 'اسم المعامل الرسمي هو Alpha.',
            },
          ],
        },
        {
          id: 'ch27-q2',
          question: 'في نظام RGB، لما نضبط كل القيم على 255: rgb(255, 255, 255) بنحصل على لون إيه؟',
          options: [
            {
              id: 'a',
              text: 'اللون الأبيض النقي (لأن كل اللمبات الضوئية تعمل بأقصى طاقة)',
              isCorrect: true,
              explanation: 'إجابة نموذجية وبرافو عليك! 💡 في الضوء خلط كل الألوان بأعلى طاقة يعطي اللون الأبيض.',
            },
            {
              id: 'b',
              text: 'اللون الأسود',
              isCorrect: false,
              explanation: 'الأسود هو إطفاء كل اللمبات rgb(0, 0, 0).',
            },
            {
              id: 'c',
              text: 'اللون الرمادي الفاتح',
              isCorrect: false,
              explanation: 'الرمادي ينتج عند تساوي القيم بأرقام متوسطة مثل rgb(128, 128, 128).',
            },
          ],
        },
        {
          id: 'ch27-q3',
          question: 'شفرة الهكس #ff0000 تمثل أي لون؟',
          options: [
            {
              id: 'a',
              text: 'الأحمر الخالص (لأن خانتي Red في الحد الأقصى ff والباقي 00)',
              isCorrect: true,
              explanation: 'تحليل عبقري! 🎯 أول خانتين للـ Red وقيمتهما ff تعني 255 بالهكس.',
            },
            {
              id: 'b',
              text: 'الأخضر',
              isCorrect: false,
              explanation: 'الأخضر هو #00ff00.',
            },
            {
              id: 'c',
              text: 'الأزرق',
              isCorrect: false,
              explanation: 'الأزرق هو #0000ff.',
            },
          ],
        },
      ],
      challenge: {
        id: 'ch27-chal',
        title: 'وريني شطارتك 🧠: شفرة الهكس الخالصة والتدرج',
        prompt:
          'اكتب قاعدة CSS للكلاس .hero-banner تجعل الخلفية تدرجاً لونياً linear-gradient(to right, #0f172a, #1e293b) ولون النص أبيض #ffffff.',
        hint: '.hero-banner { background: linear-gradient(to right, #0f172a, #1e293b); color: #ffffff; }',
        initialCode: `/* اكتب كود التدرج اللوني هنا بنفسك... */
`,
        solutionCode: `.hero-banner {
  background: linear-gradient(to right, #0f172a, #1e293b);
  color: #ffffff;
}`,
      },
    },
    {
      id: 28,
      partId: 6,
      partTitle: 'الجزء السادس: من الكود للصفحة',
      title: 'الفصل 28: بناء بطاقة ملف شخصي (مشروع عملي)',
      subtitle: 'دمج HTML وCSS في بطاقة شخصية متكاملة',
      summaryPoints: [
        'دمج HTML و CSS لبناء كارت بروفايل مبرمج احترافي كامل (Portfolio Card).',
        'توسيط البطاقة وضبط عرضها واستجابتها لتناسب مختلف مقاسات الشاشات.',
        'استخدام الخطوط والصور والظلال والأزرار التفاعلية في مشروع تطبيقي متكامل.',
        'فحص الصفحة والتأكد من توافق الألوان والتنسيقات في بيئة المتصفح الحقيقية.',
      ],
      contentSections: [
        {
          heading: 'تجميع كل المهارات في مشروع حقيقي متكامل 🚀',
          text: `مبروك وصولك لهذه المحطة الذهبية يا صديقي!
في الفصول السابقة اتعلمنا:
- هيكلة الصفحات بالوسوم والعناوين والقوائم (HTML).
- حقول الإدخال والأزرار والصناديق <div>.
- تلوين النصوص والخلفيات وتنسيق الخطوط (CSS).
- الحواف الدائرية وتأثيرات :hover وظلال الصناديق.
- أنظمة الألوان RGB و Hex والتدرجات.

الآن هنبني نموذج بطاقة ملف شخصي لمبرمج. هذا مثال تدريبي لدمج HTML و CSS وتطبيق المهارات في مشروع جذاب وواقعي.`,
          codeSnippet: `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <style>
    body {
      background-color: #0b0f19;
      font-family: sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      margin: 0;
    }
    .profile-card {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 20px;
      padding: 30px;
      text-align: center;
      width: min(320px, calc(100% - 32px));
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
    }
    .avatar {
      width: 90px;
      height: 90px;
      border-radius: 50%;
      border: 3px solid #f59e0b;
    }
    h2 { color: #f8fafc; margin: 15px 0 5px; font-size: 22px; }
    .badge { color: #38bdf8; font-size: 13px; font-weight: bold; }
    p { color: #94a3b8; font-size: 14px; line-height: 1.5; }
    .btn-contact {
      background: linear-gradient(135deg, #f59e0b, #ea580c);
      color: #0b0f19;
      font-weight: bold;
      border: none;
      padding: 10px 20px;
      border-radius: 12px;
      cursor: pointer;
      width: 100%;
      margin-top: 15px;
      transition: 0.3s;
    }
    .btn-contact:hover {
      transform: scale(1.03);
    }
  </style>
</head>
<body>
  <div class="profile-card">
    <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150" class="avatar" alt="صورة المبرمج" loading="lazy" decoding="async">
    <h2>أحمد مصطفى</h2>
    <div class="badge">🚀 مطور فرونت إند جافاسكريبت</div>
    <p>أقوم بتحويل الأفكار والتصميمات إلى مواقع ويب وتطبيقات حية وتفاعلية سريعة.</p>
    <button class="btn-contact">تواصل معي الآن ✨</button>
  </div>
</body>
</html>`,
          type: 'html_preview',
          htmlCode: `<div class="p-6 bg-slate-900/90 border border-slate-700 rounded-3xl text-center max-w-xs mx-auto shadow-2xl font-sans" dir="rtl">
  <div class="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 p-1 mb-3 shadow-lg shadow-orange-500/30">
    <div class="w-full h-full bg-slate-950 rounded-full flex items-center justify-center text-3xl">
      👨‍💻
    </div>
  </div>
  <h2 class="text-xl font-bold text-slate-100 mb-1">أحمد مصطفى</h2>
  <span class="inline-block px-3 py-1 bg-sky-500/20 text-sky-400 border border-sky-500/30 rounded-full text-xs font-semibold mb-3">🚀 مطور فرونت إند جافاسكريبت</span>
  <p class="text-slate-300 text-xs leading-relaxed mb-4">أقوم بتحويل الأفكار والتصميمات إلى مواقع ويب وتطبيقات حية وتفاعلية سريعة.</p>
  <button class="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold rounded-xl shadow-lg transition text-xs cursor-pointer">
    تواصل معي الآن ✨
  </button>
</div>`,
          callout: {
            type: 'celebration',
            title: 'إنجاز تاريخي يا باشمهندس! 🏆',
            content:
              'بهذا الكارت إنت أصبحت رسمياً مطور واجهات ويب! صنعت هيكلاً متيناً، ونسقته بأحدث معايير الأناقة البصرية. والخطوة القادمة هي ربط JavaScript بالصفحة لتنبض بالحياة!',
          },
        },
      ],
      exercises: [
        {
          id: 'ch28-ex1',
          title: 'التمرين 1: هيكل بطاقة البروفايل',
          code: `<div class="card">
  <h2>اسم المبرمج</h2>
  <p>نبذة سريعة عن المهارات</p>
  <button>تواصل</button>
</div>`,
          expectedOutput: 'معاينة بطاقة مجمعة تحتوي على الاسم والنبذة والزر.',
          explanation: 'تجميع عناصر الكارت في حاوية div واحدة لتسهيل التنسيق.',
        },
        {
          id: 'ch28-ex2',
          title: 'التمرين 2: تدوير الصورة الرمزية (Avatar)',
          code: `.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
}`,
          expectedOutput: 'معاينة صورة دائرية بالكامل.',
          explanation: 'border-radius: 50% مع أبعاد متساوية يحول أي صورة إلى دائرة كاملة.',
        },
      ],
      quiz: [
        {
          id: 'ch28-q1',
          question: 'ليه بنجمع عناصر البروفايل (الصورة، الاسم، الزر) جوه div واحدة يا صديقي؟',
          options: [
            {
              id: 'a',
              text: 'عشان ننسق الكارت ككتلة واحدة ونديله خلفية وهوامش وظلال مشتركة',
              isCorrect: true,
              explanation: 'صح جداً! 👏 الـ div بتلم العناصر في عائلة واحدة منظمة يسهل تحريكها وتنسيقها.',
            },
            {
              id: 'b',
              text: 'لأن المتصفح يرفض عرض أكثر من عنصر بدون div',
              isCorrect: false,
              explanation: 'المتصفح يعرض العناصر عادي، لكن التجميع يوفر التحكم الهندسي.',
            },
            {
              id: 'c',
              text: 'لتسريع الإنترنت عند المستخدم',
              isCorrect: false,
              explanation: 'لا علاقة للوسوم بسرعة اتصال الإنترنت.',
            },
          ],
        },
        {
          id: 'ch28-q2',
          question: 'إزاي نحول أي صورة مربعة لشكل دائري كامل في CSS؟',
          options: [
            {
              id: 'a',
              text: 'border-radius: 50%; مع ضبط العرض والارتفاع بقيم متساوية',
              isCorrect: true,
              explanation: 'برافو عليك! 🎯 نسبة 50% تنحني بالأركان لتلتقي في دائرة كاملة.',
            },
            {
              id: 'b',
              text: 'circle: true;',
              isCorrect: false,
              explanation: 'لا توجد خاصية بهذا الاسم في CSS.',
            },
            {
              id: 'c',
              text: 'text-align: circle;',
              isCorrect: false,
              explanation: 'text-align لمحاذاة النصوص فقط.',
            },
          ],
        },
        {
          id: 'ch28-q3',
          question: 'خاصية box-shadow بتضيف إيه للعنصر؟',
          options: [
            {
              id: 'a',
              text: 'ظل واقعي حول الصندوق يعطيه عمقاً وبعداً ثلاثياً ثلاثي الأبعاد',
              isCorrect: true,
              explanation: 'ممتاز! 💡 الظلال هي سر التصميمات العصرية التي تبدو طافية فوق الصفحة.',
            },
            {
              id: 'b',
              text: 'صندوقاً جديداً داخل الصفحة',
              isCorrect: false,
              explanation: 'هي خاصية مظهر وظل فقط.',
            },
            {
              id: 'c',
              text: 'تغيير نوع الخط',
              isCorrect: false,
              explanation: 'نوع الخط مسؤول عنه font-family.',
            },
          ],
        },
      ],
      challenge: {
        id: 'ch28-chal',
        title: 'وريني شطارتك 🧠: كارت المنتج المتكامل',
        prompt:
          'اكتب بطاقة منتج HTML بكلاس product-card، فيها عنوان h2 وفقرة وزر شراء، وأضف قاعدة CSS لتنسيق البطاقة بخلفية رمادية وحواف دائرية.',
        hint: '<style>.product-card { padding: 16px; background: #1e293b; border-radius: 12px; color: white; }</style><article class="product-card"><h2>ساعة ذكية</h2><p>خفيفة وعملية</p><button>شراء</button></article>',
        initialCode: `<!-- اكتب كود كارت المنتج والتنسيق هنا بنفسك... -->
`,
        solutionCode: `<style>
  .product-card {
    padding: 16px;
    background: #1e293b;
    border-radius: 12px;
    color: white;
  }
</style>
<article class="product-card">
  <h2>ساعة ذكية</h2>
  <p>خفيفة وعملية</p>
  <button>شراء</button>
</article>`,
      },
    },
    {
      id: 29,
      partId: 6,
      partTitle: 'الجزء السادس: من الكود للصفحة',
      title: 'الفصل 29: الكائنات (Objects) — كبسولة البيانات والسلوكيات',
      subtitle: 'بطاقة التعريف: مفتاح وقيمة (Key: Value) والـ Methods',
      summaryPoints: [
        'الكائن (Object) هو كبسولة بيانات بتجمع كل المعلومات المتعلقة بكيان واحد (طالب، سيارة، منتج، مستخدم).',
        'يتكون الكائن من أزواج { key: value } محصورة بين قوسين معقوصين ومفصولة بفواصل.',
        'الوصول للخصائص: طريقة النقطة (Dot notation: student.name) أو الأقواس المربعة (student["age"]).',
        'الدوال داخل الكائنات تسمى Methods، وكلمة this تشير لنفس الكائن الحالي المستدعي.',
      ],
      contentSections: [
        {
          heading: 'تشبيه بطاقة الرقم القومي أو بروفايل البطل في اللعبة 🪪',
          text: `في المصفوفات كنا بنحط البيانات في رف مرقم [0, 1, 2]..
لكن لو عندك بيانات شخص: اسمه، وسنه، ومحافظته، ورقمه القومي:
هل يعقل تقول person[0] person[1] person[2]؟ لو نسيت مين فيهم الصفر ومين الواحد هتتلخبط كل حساباتك!
الحل الطبيعي والمنطقي هو "بطاقة الرقم القومي أو بروفايل شخصية اللعبة (RPG Character)":
كل معلومة ليها "اسم وعنوان واضح":
- الاسم: عمر
- السن: 22
- المستوى: 15
- السلاح: سيف ذهبي

في البرمجة، البطاقة دي اسمها "الكائن (Object)".
الكائن بيتكتب بين قوسين معقوصين { }، وجواه أزواج من "المفتاح والقيمة (key: value)".`,
          codeSnippet: `const hero = {
  name: "فارس النور",
  level: 10,
  health: 100,
  weapon: "سيف النار",
  isAlive: true
};

console.log(hero);`,
        },
        {
          heading: 'طرق قراءة وتعديل خصائص الكائن (Dot vs Bracket Notation)',
          text: `عشان نقرأ أو نعدل أي خاصية جوه الكائن، عندنا طريقتين:
1. طريقة النقطة الساحرة (Dot notation): وهي الأسهل والأشهر:
   hero.name أو hero.level
2. طريقة الأقواس المربعة (Bracket notation): بنكتب المفتاح كنص بين قوسين:
   hero["name"] (مفيدة جداً لو اسم المفتاح محفوظ جوه متغير تاني!).

وتقدر تعدل أو تضيف أي خاصية جديدة في أي فيمتو ثانية بمنتهى البساطة:`,
          codeSnippet: `const student = {
  name: "سارة",
  grade: 85
};

// قراءة البيانات
console.log(student.name); // سارة

// تعديل خاصية موجودة
student.grade = 92;

// إضافة خاصية جديدة لم تكن موجودة من قبل!
student.city = "الإسكندرية";

console.log(student);`,
        },
        {
          heading: 'الدوال داخل الكائنات (Methods) وكلمة this السحرية ✨',
          text: `الكائن مش بس بيحفظ بيانات صامتة.. ده كمان يقدر "يعمل أفعال وتصرفات"!
لما نحط دالة جوه كائن، بنسميها "ميثود (Method)".
وداخل الدالة دي، بنستخدم كلمة this للإشارة إلى نفس الكائن الحالي عشان نقرأ بياناته:`,
          codeSnippet: `const user = {
  firstName: "مصطفى",
  lastName: "أحمد",
  // دالة تصرف داخل الكائن
  getFullName() {
    return this.firstName + " " + this.lastName;
  },
  greet() {
    console.log("أهلاً، أنا " + this.firstName);
  }
};

console.log(user.getFullName()); // مصطفى أحمد
user.greet();                    // أهلاً، أنا مصطفى`,
          callout: {
            type: 'insight',
            title: 'كلمة this بتشاور على مين؟ 🔍',
            content:
              'كلمة this جوه الدالة بتشاور على نفس الكائن اللي شايل الدالة (user). كأن الكائن بيقول: "اسمي أنا، وبطاقتي أنا!".',
          },
        },
      ],
      exercises: [
        {
          id: 'ch29-ex1',
          title: 'التمرين 1: قراءة وتعديل خصائص الكائن',
          code: `const car = { brand: "تويوتا", year: 2022 };
car.year = 2024;
console.log(car.brand);
console.log(car["year"]);`,
          expectedOutput: `تويوتا\n2024`,
          explanation: 'تعديل الخاصية ثم قراءتها بالنقطة وبالأقواس المربعة.',
        },
        {
          id: 'ch29-ex2',
          title: 'التمرين 2: دالة Method داخل كائن حساب بنكي',
          code: `const account = {
  owner: "كريم",
  balance: 1000,
  deposit(amount) {
    this.balance += amount;
    return this.balance;
  }
};
console.log(account.deposit(500));`,
          expectedOutput: `1500`,
          explanation: 'الدالة تعدل رصيد الكائن الحالي عبر this.balance.',
        },
      ],
      quiz: [
        {
          id: 'ch29-q1',
          question: 'كلمة this جوه دالة موجودة في كائن بتشير لمين يا صديقي؟',
          codeSnippet: `const user = {
  name: "كريم",
  sayHello() {
    console.log("أهلاً، أنا " + this.name);
  }
};`,
          options: [
            {
              id: 'a',
              text: 'بتشير لنفس الكائن الحالي (user) اللي الدالة شغالة جواه',
              isCorrect: true,
              explanation: 'صح جداً! 👏 this بتسمح للدالة تقرأ وتعدل خواص الكائن نفسه بسهولة.',
            },
            {
              id: 'b',
              text: 'بتشير لمتصفح الويب بالكامل',
              isCorrect: false,
              explanation: 'لو استدعيت الدالة كـ method للكائن، this بتشير للكائن نفسه.',
            },
            {
              id: 'c',
              text: 'بتشير للغة جافاسكريبت',
              isCorrect: false,
              explanation: 'this سياق تنفيذي محلي مرتبط بالكائن المستدعي.',
            },
          ],
        },
        {
          id: 'ch29-q2',
          question: 'إزاي بنستدعي دالة sayHello المعرفة جوه الكائن user؟',
          options: [
            {
              id: 'a',
              text: 'user.sayHello()',
              isCorrect: true,
              explanation: 'برافو! 🎯 اسم الكائن يليه نقطة ثم اسم الدالة وقوسين الاستدعاء ().',
            },
            {
              id: 'b',
              text: 'sayHello()',
              isCorrect: false,
              explanation: 'الدالة مش معرّفة عالمياً، بل مربوطة بداخل الكائن user.',
            },
            {
              id: 'c',
              text: 'call user.sayHello',
              isCorrect: false,
              explanation: 'في جافاسكريبت الاستدعاء يتم بوضع القوسين ().',
            },
          ],
        },
        {
          id: 'ch29-q3',
          question: 'ماذا يرجع الكود عند محاولة قراءة خاصية غير موجودة في الكائن (مثل hero.speed)؟',
          options: [
            {
              id: 'a',
              text: 'undefined (لأن المفتاح غير موجود في بطاقة الكائن)',
              isCorrect: true,
              explanation: 'ممتاز! 💡 تماماً مثل محاولة قراءة عنصر خارج حدود المصفوفة، ترجع جافاسكريبت undefined.',
            },
            {
              id: 'b',
              text: 'null',
              isCorrect: false,
              explanation: 'null تدل على تفريغ مقصود وليست القيمة التلقائية لغياب الخاصية.',
            },
            {
              id: 'c',
              text: '0',
              isCorrect: false,
              explanation: '0 قيمة رقمية حقيقية وليست دلالة على عدم وجود المفتاح.',
            },
          ],
        },
      ],
      challenge: {
        id: 'ch29-chal',
        title: 'وريني شطارتك 🧠: كائن هاتف المحمول',
        prompt:
          'أنشئ كائناً const phone يحمل الخاصيتين brand: "سامسونج" و price: 8000. ثم اطبع في الكونسول: "الموبايل: سامسونج بسعر: 8000".',
        hint: 'phone.brand و phone.price داخل console.log.',
        initialCode: `// اكتب كود تعريف كائن phone وطباعة بياناته هنا بنفسك...
`,
        solutionCode: `const phone = {
  brand: "سامسونج",
  price: 8000
};
console.log("الموبايل: " + phone.brand + " بسعر: " + phone.price);`,
      },
    },
    {
      id: 30,
      partId: 6,
      partTitle: 'الجزء السادس: من الكود للصفحة',
      title: 'الفصل 30: شجرة الـ DOM والأحداث (Events) — الساحر والتفاعل',
      subtitle: 'ربط JavaScript بالصفحة: النقر والتفاعل الحي',
      summaryPoints: [
        'الـ DOM (Document Object Model) هو الشجرة التي يرى بها JavaScript عناصر صفحة HTML ويتحكم فيها.',
        'الدالة document.getElementById() تمسك أي عنصر بالمعرف الفريد (ID) بتاعه.',
        'تعديل النصوص بـ textContent وتعديل التنسيقات بـ style.',
        'مراقبة تصرفات المستخدم عبر addEventListener("click", callback) لتشغيل الكود فور النقر.',
      ],
      contentSections: [
        {
          heading: 'تشبيه المخرج المسرحي: يعني إيه شجرة الـ DOM؟ 🎭',
          text: `تخيل مسرحية فيها ممثلين وديكور وإضاءة، وفي مخرج واقف في الكواليس بيده ميكروفون:
"يا ممثل رقم 1 غير لبسك، يا ممثل رقم 2 اصرخ واجري، يا مسؤول الإضاءة طفي النور!".
المخرج ده في عالم الويب هو "لغة JavaScript".
والمسرح والممثلين هما "شجرة الـ DOM (Document Object Model)".
المتصفح أول ما يقرأ كود HTML، بيحوله في الذاكرة لشجرة كائنات حية.
وجافاسكريبت بتمسك أي عنصر في الشجرة دي وتتحكم في طوله ولونه وكلامه في جزء من الثانية!`,
          codeSnippet: `// مسك عنصر من الصفحة بالـ id بتاعه
const myHeading = document.getElementById("welcome-title");

// تغيير النص المكتوب جواه فوراً
myHeading.textContent = "أهلاً بك يا بطل البرمجة!";

// تغيير لونه لبرتقالي بضغطة زر
myHeading.style.color = "orange";`,
        },
        {
          heading: 'مراقبة نقرات المستخدم: الأحداث (Events & addEventListener) 🖱️',
          text: `صفحة الويب الحية مش صفحة ميتة تقرأها زي الجريدة.. دي صفحة بترد عليك لما تدوس عليها!
النقر على زر، حركة الفأرة، الكتابة في حقل، التمرير لأسفل.. كل دي اسمها "أحداث (Events)".
عشان نخلي زرار ينفذ كود لما المستخدم ينقر عليه، بنركب له "مستمع للأحداث (Event Listener)":
button.addEventListener("click", function() { ... });
الدالة دي بتفضل واقفة في صمت، وأول ما صباع المستخدم يلمس الزرار.. تنطلق فوراً وتنفذ الأوامر!`,
          codeSnippet: `const btn = document.getElementById("myBtn");
const message = document.getElementById("msg");

btn.addEventListener("click", function() {
  message.textContent = "🎉 شكراً لنقرك على الزرار!";
  message.style.color = "#22c55e"; // أخضر جميل
});`,
        },
        {
          heading: 'تطبيق عملي حي: عداد التسبيح والنقرات التفاعلي 📱',
          text: `تعال نبني معاً تطبيقاً تفاعلياً مصغراً: عداد تسبيح / نقرات (Click Counter).
كل ما المستخدم يدوس على الزرار، العداد يزيد بمقدار 1 ويتحدث الرقم على الشاشة فوراً:`,
          codeSnippet: `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <style>
    * { box-sizing: border-box; }
    body { font-family: system-ui, -apple-system, sans-serif; background: #0f172a; color: white; display: flex; justify-content: center; align-items: center; min-height: 240px; margin: 0; text-align: center; }
    .card { background: #1e293b; border: 1px solid #334155; border-radius: 20px; padding: 24px; max-width: 300px; width: 100%; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
    h3 { font-size: 14px; font-weight: 600; color: #94a3b8; margin: 0 0 8px; }
    .counter { font-size: 3.5rem; font-weight: 900; color: #fbbf24; margin: 10px 0; font-family: monospace; }
    button.btn-count { width: 100%; padding: 14px; background: linear-gradient(135deg, #10b981, #14b8a6); color: #020617; border: none; border-radius: 14px; font-weight: 800; font-size: 15px; cursor: pointer; transition: transform 0.1s, filter 0.2s; font-family: inherit; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3); }
    button.btn-count:active { transform: scale(0.97); }
    button.btn-count:hover { filter: brightness(1.1); }
    button.btn-reset { margin-top: 10px; background: transparent; border: 1px solid #475569; color: #94a3b8; font-size: 12px; padding: 6px 12px; border-radius: 8px; cursor: pointer; width: 100%; font-family: inherit; }
    button.btn-reset:hover { background: #334155; color: white; }
  </style>
</head>
<body>
  <div class="card">
    <h3>عداد التسبيح التفاعلي 📿</h3>
    <div id="count" class="counter">0</div>
    <button id="counterBtn" class="btn-count">سبّح (انقر هنا) 📿</button>
    <button id="resetBtn" class="btn-reset">إعادة ضبط العداد</button>
  </div>

  <script>
    let counter = 0;
    const countDisplay = document.getElementById("count");
    const counterButton = document.getElementById("counterBtn");
    const resetButton = document.getElementById("resetBtn");

    counterButton.addEventListener("click", function() {
      counter++;
      countDisplay.textContent = counter;
    });

    resetButton.addEventListener("click", function() {
      counter = 0;
      countDisplay.textContent = counter;
    });
  </script>
</body>
</html>`,
          type: 'html_preview',
          htmlCode: `<div class="p-6 bg-slate-900 border border-slate-700 rounded-2xl max-w-xs mx-auto text-center shadow-2xl font-sans" dir="rtl">
  <h3 class="text-sm font-semibold text-slate-400 mb-2">عداد التسبيح التفاعلي 📿</h3>
  <div id="count" class="text-4xl font-extrabold text-amber-400 mb-4 font-mono">0</div>
  <button id="counterBtn" class="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold rounded-xl shadow-lg transition text-sm cursor-pointer">
    سبّح (انقر هنا) 📿
  </button>
  <p class="text-[11px] text-slate-500 mt-3">JavaScript يراقب الحدث ويحدث الـ DOM في التو واللحظة.</p>
</div>`,
          callout: {
            type: 'celebration',
            title: 'مبروك ختمت مسار الويب! 🎓🎉',
            content:
              'بهذا الفصل، اكتملت الدائرة البرمجية العظمى:\nاتعلمت لغة JavaScript من أول حرف، اتعلمت HTML و CSS، ودلوقتي قدرت تربطهم مع بعض في شجرة الـ DOM وتصنع تطبيقات حية كاملة!',
          },
        },
      ],
      exercises: [
        {
          id: 'ch30-ex1',
          title: 'التمرين 1: تغيير النص في الـ DOM عند النقر',
          code: `<h1 id="title">العنوان القديم</h1>
<button id="change">غيّر النص</button>
<script>
  document.getElementById("change").addEventListener("click", () => {
    document.getElementById("title").textContent = "تم التحديث بنجاح! 🎉";
  });
</script>`,
          expectedOutput: 'معاينة صفحة يتغير عنوانها عند النقر على الزر.',
          explanation: 'اربط حدث النقر ثم حدّث textContent للعنوان.',
        },
        {
          id: 'ch30-ex2',
          title: 'التمرين 2: تبديل الألوان بـ style',
          code: `const box = document.getElementById("box");
box.style.backgroundColor = "green";
box.style.color = "white";`,
          expectedOutput: 'معاينة صندوق تحول لونه للأخضر ونصه للأبيض.',
          explanation: 'خاصية style تسمح بتعديل قواعد CSS مباشرة من كود JavaScript.',
        },
      ],
      quiz: [
        {
          id: 'ch30-q1',
          question: 'الدالة المسؤولة عن مراقبة نقرات الماوس على زر هي أنهي دالة يا صديقي؟',
          options: [
            {
              id: 'a',
              text: 'button.addEventListener("click", callback)',
              isCorrect: true,
              explanation: 'ممتاز! 🎯 addEventListener هي المعيار الذهبي لمراقبة أي تفاعل من المستخدم في الويب.',
            },
            {
              id: 'b',
              text: 'button.listen("click")',
              isCorrect: false,
              explanation: 'اسم الدالة الرسمي هو addEventListener.',
            },
            {
              id: 'c',
              text: 'document.clickButton(button)',
              isCorrect: false,
              explanation: 'المستمع يتم ربطه بالعنصر المراد مراقبته مباشرة.',
            },
          ],
        },
        {
          id: 'ch30-q2',
          question: 'معامل الحدث (event / e) اللي بنستلمه جوه دالة النقر.. جواه إيه؟',
          options: [
            {
              id: 'a',
              text: 'معلومات تفصيلية عن الحدث، زي العنصر المنقور (e.target) ومكان مؤشر الفأرة',
              isCorrect: true,
              explanation: 'عاش يا بطل! 👏 كائن الحدث كنز معلومات بيفيدك تعرف المستخدم عمل إيه وفين بالظبط.',
            },
            {
              id: 'b',
              text: 'سرعة الإنترنت بتاعة المستخدم',
              isCorrect: false,
              explanation: 'الحدث يخص تفاعل المستخدم مع الصفحة.',
            },
            {
              id: 'c',
              text: 'كلمة السر الخاصة بالمتصفح',
              isCorrect: false,
              explanation: 'لا يحتوي على أي بيانات سرية أو حساسة.',
            },
          ],
        },
        {
          id: 'ch30-q3',
          question: 'ما هي الخاصية المستخدمة لتعديل النص الداخلي لعنصر HTML بأمان؟',
          options: [
            {
              id: 'a',
              text: 'element.textContent',
              isCorrect: true,
              explanation: 'صح جداً! 📝 textContent هي الطريقة القياسية والآمنة لتغيير وقراءة النصوص.',
            },
            {
              id: 'b',
              text: 'element.writeText',
              isCorrect: false,
              explanation: 'لا توجد خاصية بهذا الاسم لتعديل العناصر.',
            },
            {
              id: 'c',
              text: 'element.fontText',
              isCorrect: false,
              explanation: 'الخاصية الصحيحة هي textContent.',
            },
          ],
        },
      ],
      challenge: {
        id: 'ch30-chal',
        title: 'وريني شطارتك 🧠: مبدل حالة النور (Light Switch)',
        prompt:
          'اكتب صفحة HTML فيها زر وفقرة. استخدم addEventListener("click") ومتغير boolean لتبديل نص الفقرة بين "النور مضاء" و "النور مطفي" عند كل نقرة.',
        hint: 'عرّف isOn واربِط الزر بـ addEventListener، ثم بدّل القيمة والنص عبر textContent.',
        initialCode: `<!-- اكتب كود دالة تبديل النور وفحص الحالة بنفسك هنا... -->
`,
        solutionCode: `<!doctype html>
<html lang="ar" dir="rtl">
<body>
  <button id="toggle">بدّل النور</button>
  <p id="status">النور مطفي</p>

  <script>
    let isOn = false;
    document.getElementById("toggle").addEventListener("click", () => {
      isOn = !isOn;
      document.getElementById("status").textContent = isOn ? "النور مضاء 💡" : "النور مطفي 🌑";
    });
  </script>
</body>
</html>`,
      },
    },
    {
      id: 31,
      partId: 6,
      partTitle: 'الجزء السادس: من الكود للصفحة',
      title: 'الفصل 31: مراجعة تحليلية وتتبع تفاعل الويب (Web & DOM Tracing)',
      subtitle: 'تتبع دورة حياة الصفحة، تدفق الأحداث، وفخاخ الـ DOM الشائعة',
      summaryPoints: [
        'التتبع الذهني لتسلسل تحميل الصفحة: من تحليل HTML وبناء شجرة الـ DOM حتى تشغيل كود JavaScript.',
        'تتبع تدفق أحداث المستخدم (Event Lifecycle) وتحديث واجهة المستخدم فورياً.',
        'مصفوفة الفخاخ القاتلة في برمجة الويب: مكان وضع السكريبت، أخطاء Cannot read properties of null، والفصل المعماري النظيف بين HTML و CSS و JS.',
      ],
      contentSections: [
        {
          heading: 'تتبع مسار تشغيل صفحة الويب في الذاكرة (Lifecycle Tracing) 🔄',
          text: `تعال نمشي خطوة بخطوة في عقل المتصفح أول ما المستخدم يكتب رابط موقعك ويدوس Enter:
1. المتصفح يحمل ملف HTML ويبدأ يقرأه من أول سطر لآخر سطر (Parsing).
2. يحول الوسوم لكائنات حية في شجرة الـ DOM بالذاكرة.
3. يحمل ملفات CSS ويبني شجرة التنسيقات (CSSOM) ويدمجها مع الـ DOM لرسم الصفحة على الشاشة (Render Tree).
4. ينفذ كود JavaScript اللي بيتحكم في الشجرة ويراقب أحداث المستخدم!`,
          codeSnippet: `// تسلسل العمليات الهندسي:
// 1. هيكل HTML موجود في DOM
const statusDisplay = document.getElementById("status");

// 2. مستمع الحدث جاهز للمراقبة
let clickCount = 0;
document.getElementById("btn").addEventListener("click", () => {
  clickCount++;
  // 3. تحديث فوري لشجرة الـ DOM
  statusDisplay.textContent = "النقرات: " + clickCount;
});`,
        },
        {
          heading: 'مصفوفة الفخاخ القاتلة في تطوير الويب (Web Debug Checklist) 🛠️',
          text: `قبل ما ترفع أي صفحة ويب للإنترنت يا باشمهندس، راجع القائمة دي:
1. هل وضعت <script> قبل إغلاق </body>؟ (لو حطيته في <head> بدون defer العناصر هترجع null!).
2. هل تأكدت من تطابق اسم الـ id بين كود HTML و getElementById؟ (تطابق الحروف الكبيرة والصغيرة Case Sensitivity).
3. هل ربطت label بالـ id المظبوط للحقل؟
4. هل تأكدت من إغلاق كل وسوم HTML وفاصلة CSS المنقوطة (;)؟`,
          codeSnippet: `// تجنب الفخ الشائع:
const myElement = document.getElementById("user-name"); // تأكد من الـ id بالضبط!
if (myElement) {
  myElement.textContent = "مرحباً يا بطل!";
} else {
  console.warn("العنصر غير موجود في شجرة الـ DOM!");
}`,
          callout: {
            type: 'insight',
            title: 'المثلث الذهبي لتطوير الويب 📐',
            content:
              'HTML للهيكل والبناء 🧱\nCSS للأناقة والجمال 🎨\nJavaScript للمخ والتفاعل 🧠\nالتناغم بين الثلاثة هو اللي بيصنع كل المواقع العظمى في العالم!',
          },
        },
        {
          heading: 'تطبيق التتبع الشامل: تطبيق المهام المصغر (Mini To-Do App) 📝',
          text: `تعال ندمج كل مفاهيم الجزء السادس في مشروع حي مصغر:
استقبال نص من input، إضافته كعنصر li جديد للقائمة، ومسح الحقل بعد الإضافة:`,
          codeSnippet: `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <style>
    * { box-sizing: border-box; }
    body { font-family: system-ui, -apple-system, sans-serif; background: #0b1120; color: #f8fafc; padding: 24px; margin: 0; text-align: right; }
    .card { background: #0f172a; border: 1px solid #1e293b; border-radius: 18px; padding: 20px; max-width: 380px; margin: 0 auto; box-shadow: 0 15px 30px rgba(0,0,0,0.6); }
    h3 { color: #f59e0b; margin: 0 0 14px; font-size: 1.15rem; font-weight: 800; display: flex; align-items: center; gap: 6px; }
    .input-row { display: flex; gap: 8px; margin-bottom: 14px; }
    input { flex: 1; padding: 10px 14px; border-radius: 10px; border: 1px solid #334155; background: #1e293b; color: #f8fafc; font-size: 13px; font-family: inherit; }
    input:focus { outline: none; border-color: #f59e0b; box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.2); }
    button.add-btn { padding: 10px 18px; background: #f59e0b; color: #020617; border: none; border-radius: 10px; font-weight: 800; font-size: 13px; cursor: pointer; transition: 0.15s; font-family: inherit; }
    button.add-btn:hover { background: #fbbf24; }
    ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px; }
    li { background: #1e293b; border: 1px solid #334155; padding: 10px 12px; border-radius: 10px; font-size: 13px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; transition: 0.15s; }
    li:hover { border-color: #475569; }
    li.done span { text-decoration: line-through; opacity: 0.45; }
    .del-btn { background: #ef4444; color: white; border: none; border-radius: 6px; padding: 3px 8px; font-size: 11px; cursor: pointer; font-weight: bold; }
    .del-btn:hover { background: #dc2626; }
  </style>
</head>
<body>
  <div class="card">
    <h3>قائمة مهامي التفاعلية 📝</h3>
    <div class="input-row">
      <input id="taskInput" placeholder="اكتب مهمتك..." value="مراجعة مسار جافاسكريبت">
      <button id="addBtn" class="add-btn">إضافة</button>
    </div>
    <ul id="taskList">
      <li><span>فهم متغيرات let و const</span><button class="del-btn">حذف</button></li>
      <li><span>إتقان الحلقات والدوال</span><button class="del-btn">حذف</button></li>
      <li><span>ربط JavaScript بشجرة الـ DOM</span><button class="del-btn">حذف</button></li>
    </ul>
  </div>

  <script>
    const input = document.getElementById("taskInput");
    const addBtn = document.getElementById("addBtn");
    const list = document.getElementById("taskList");

    function addTask() {
      const text = input.value.trim();
      if (text !== "") {
        const li = document.createElement("li");
        const span = document.createElement("span");
        span.textContent = text;

        const delBtn = document.createElement("button");
        delBtn.textContent = "حذف";
        delBtn.className = "del-btn";
        delBtn.onclick = (e) => {
          e.stopPropagation();
          li.remove();
        };

        li.appendChild(span);
        li.appendChild(delBtn);
        li.onclick = () => li.classList.toggle("done");

        list.appendChild(li);
        input.value = "";
        input.focus();
      }
    }

    addBtn.addEventListener("click", addTask);
    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") addTask();
    });

    document.querySelectorAll(".del-btn").forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        btn.parentElement.remove();
      };
    });
    document.querySelectorAll("#taskList li").forEach(li => {
      li.onclick = () => li.classList.toggle("done");
    });
  </script>
</body>
</html>`,
          type: 'html_preview',
          htmlCode: `<div class="p-6 bg-slate-900 border border-slate-700 rounded-2xl max-w-sm mx-auto shadow-2xl font-sans" dir="rtl">
  <h3 class="text-base font-bold text-amber-400 mb-3">قائمة مهامي التفاعلية 📝</h3>
  <div class="flex gap-2 mb-3">
    <input id="taskInput" type="text" placeholder="اكتب مهمتك..." value="مراجعة مسار جافاسكريبت" class="flex-1 px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-100 text-xs focus:outline-none focus:border-amber-400" />
    <button id="addBtn" class="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs transition">إضافة</button>
  </div>
  <ul id="taskList" class="text-xs text-slate-200 space-y-1.5 list-disc list-inside bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
    <li>فهم متغيرات let و const</li>
    <li>إتقان الحلقات والدوال</li>
    <li>ربط JavaScript بشجرة الـ DOM</li>
  </ul>
</div>`,
        },
      ],
      exercises: [
        {
          id: 'ch31-ex1',
          title: 'التمرين 1: تتبع قيمة المدخلات (input.value)',
          code: `const input = document.getElementById("nameInput");
console.log("النص المكتوب: " + input.value);`,
          expectedOutput: 'قراءة القيمة الحالية المكتوبة داخل حقل الإدخال.',
          explanation: 'خاصية value تُستخدم لقراءة محتوى حقول الإدخال input بعكس textContent المستخدم للعناوين والفقرات.',
        },
        {
          id: 'ch31-ex2',
          title: 'التمرين 2: تتبع تسلسل تنفيذ الأحداث',
          code: `console.log("1. قبل تسجيل الحدث");
document.getElementById("btn").addEventListener("click", () => {
  console.log("3. تم النقر على الزر!");
});
console.log("2. بعد تسجيل الحدث");`,
          expectedOutput: `1. قبل تسجيل الحدث\n2. بعد تسجيل الحدث`,
          explanation: 'كود المستمع لا ينفذ فوراً بل ينتظر نقرة المستخدم في المستقبل.',
        },
      ],
      quiz: [
        {
          id: 'ch31-q1',
          question: 'ليه بنستخدم input.value لقراءة حقل الإدخال بدلاً من input.textContent يا صديقي؟',
          options: [
            {
              id: 'a',
              text: 'لأن حقول input عناصر إدخال ذاتية الإغلاق وتحفظ ما يكتبه المستخدم في خاصية value',
              isCorrect: true,
              explanation: 'تحليل هندسي ممتاز! 👏 textContent للعناصر التي لها وسم فتح وإغلاق كـ h1 و p، بينما value للمدخلات.',
            },
            {
              id: 'b',
              text: 'لأن textContent محذوفة من المتصفحات',
              isCorrect: false,
              explanation: 'textContent موجودة وتستخدم مع باقي الوسوم.',
            },
            {
              id: 'c',
              text: 'مفيش فرق والاثنان متطابقان',
              isCorrect: false,
              explanation: 'الفرق جوهري؛ محاولة قراءة textContent من input سترجع نصاً فارغاً.',
            },
          ],
        },
        {
          id: 'ch31-q2',
          question: 'ما هو السبب الأكثر شيوعاً لظهور خطأ "Cannot read properties of null" عند التعامل مع الـ DOM؟',
          options: [
            {
              id: 'a',
              text: 'تشغيل كود السكريبت قبل أن يرسم المتصفح عناصر HTML في الذاكرة، أو كتابة id خاطئ',
              isCorrect: true,
              explanation: 'إجابة نموذجية! 💡 المتصفح يبحث عن الـ ID فلا يجده فيرجع null وتفشل العمليات اللاحقة.',
            },
            {
              id: 'b',
              text: 'ضعف سرعة الإنترنت',
              isCorrect: false,
              explanation: 'الخطأ برمجي تنفيذي ولا علاقة له بالشبكة.',
            },
            {
              id: 'c',
              text: 'استخدام ألوان غير متوافقة في CSS',
              isCorrect: false,
              explanation: 'CSS لا يسبب أخطاء TypeErrors في JavaScript.',
            },
          ],
        },
        {
          id: 'ch31-q3',
          question: 'ما هي الطريقة الصحيحة لمنع إعادة تحميل الصفحة الافتراضي عند إرسال نموذج HTML؟',
          options: [
            {
              id: 'a',
              text: 'استدعاء e.preventDefault() داخل مستمع حدث submit',
              isCorrect: true,
              explanation: 'عاش يا بطل! 🌟 preventDefault توقف السلوك الافتراضي للمتصفح وتسمح لمعالجة البيانات بـ JavaScript بدون ريفريش.',
            },
            {
              id: 'b',
              text: 'مسح وسم form',
              isCorrect: false,
              explanation: 'مسح form يضر ببنية الصفحة الدلالية.',
            },
            {
              id: 'c',
              text: 'كتابة return 0',
              isCorrect: false,
              explanation: 'الطريقة القياسية الحديثة هي preventDefault().',
            },
          ],
        },
      ],
      challenge: {
        id: 'ch31-chal',
        title: 'تحدي ختام مسار الويب: عداد الحروف الفوري 🔤',
        prompt:
          'اكتب كود صفحة HTML فيها حقل إدخال input وفقرة تعرض عدد الحروف. استخدم حدث "input" لتحديث نص الفقرة فوراً ليصبح: "عدد الحروف: X" حيث X هو طول النص المكتوب (input.value.length).',
        hint: 'document.getElementById("myInput").addEventListener("input", (e) => { countDisplay.textContent = "عدد الحروف: " + e.target.value.length; });',
        initialCode: `<!-- اكتب كود عداد الحروف الفوري هنا بنفسك... -->
`,
        solutionCode: `<!doctype html>
<html lang="ar" dir="rtl">
<body>
  <input id="textInput" placeholder="اكتب هنا...">
  <p id="charCount">عدد الحروف: 0</p>

  <script>
    const input = document.getElementById("textInput");
    const countDisplay = document.getElementById("charCount");

    input.addEventListener("input", () => {
      countDisplay.textContent = "عدد الحروف: " + input.value.length;
    });
  </script>
</body>
</html>`,
      },
    },
  ],
};
