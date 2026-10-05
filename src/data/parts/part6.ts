import { Part } from '../../types';

export const part6: Part = {
  id: 6,
  title: 'الجزء السادس: من الكود للصفحة (HTML وCSS وDOM)',
  subtitle: 'لوحة التحكم اللي بتشغّل صفحة الويب التفاعلية',
  description:
    'بناء هيكل الصفحة بـ HTML، تزيينها وتنسيقها بـ CSS، كائنات الـ Objects، والتحكم الحي بالصفحة وأحداث النقر عبر الـ DOM.',
  iconName: 'Globe',
  bugHunter: {
    id: 'bug-part-6',
    partId: 6,
    title: 'كويز: مكان السكريبت القاتل في الـ Head',
    context:
      'الكود ده المفروض يغير نص العنوان لما تدوس على الزرار، لكنه مبيشتغلش إطلاقاً وبيطلع Cannot read properties of null في الكونسول!',
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
    bugDescription:
      'تنفيذ كود JavaScript في <head> قبل أن يتم إنشاء عناصر <body> في الـ DOM.',
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
        'HTML (HyperText Markup Language) هي لغة هيكلة صفحات الويب، وهي العظم الأساسي لكل المواقع.',
        'العناصر بتتكتب بالوسوم: وسم الفتح <tag> والمحتوى ووسم الإغلاق </tag>.',
        'الهيكل الثابت لأي صفحة يبدأ بـ <!DOCTYPE html> ويحتوي على <head> للمعلومات و <body> لما يراه الزائر.',
        'عائلة العناوين من <h1> للأكبر إلى <h6> للأصغر، والفقرات <p>، والقوائم <ul> و <ol>.',
      ],
      contentSections: [
        {
          heading: 'تشبيه العظم واللحم واللبس: يعني إيه HTML؟',
          text: `لو فكرت في أي صفحة ويب في العالم زي جسم الإنسان:
- الـ HTML هو "الهيكل العظمي": بيحدد مكان الرأس (العنوان)، ومكان الأذرع (الأزرار)، ومكان القفص الصدري (المحتوى). بدون عظم، الجسم هينهار!
- الـ CSS هو "الملابس والمكياج والديكور": بيلون ويجمل وينسق المظهر الخارجي.
- الـ JavaScript هو "المخ والأعصاب والحركة": بيخلي الصفحة تتفاعل وتتحرك وترد على نقرات المستخدم.

لغة HTML مش لغة برمجة فيها شروط وحلقات؛ دي لغة "توصيفية (Markup Language)"، بتستخدم "الوسوم (Tags)" عشان تقول للمتصفح: "السطر ده عنوان رئيسي، السطر ده فقرة، والصورة دي حطها هنا!".`,
          codeSnippet: `<!-- مثال بسيط على وسوم HTML -->
<h1>مرحباً بكم في كود بالمصري!</h1>
<p>هنا بنتعلم البرمجة بأسلوب سهل وممتع.</p>`,
        },
        {
          heading: 'الهيكل المقدس لأي صفحة ويب في العالم 🏛️',
          text: `أي صفحة ويب بتبدأ بهيكل ثابت من 4 عناصر رئيسية لا غنى عنها:
1. <!DOCTYPE html>: رسالة للمتصفح بتقول له "الصفحة دي مكتوبة بأحدث إصدار HTML5".
2. <html> ... </html>: الحاوية الكبرى (Root) اللي بتضم كل محتويات الصفحة.
3. <head> ... </head>: غرفة التحكم السرية؛ فيها عنوان الصفحة اللي بيظهر في التاب فوق <title> والترميز وربط الخطوط، ومبيظهرش منها حاجة في الصفحة نفسها!
4. <body> ... </body>: خشبة المسرح! كل حاجة الزائر بيشوفها بعينه (نصوص، صور، فيديوهات، أزرار) لازم تعيش هنا.`,
          codeSnippet: `<!DOCTYPE html>
<html lang="ar" dir="rtl">
  <head>
    <meta charset="UTF-8">
    <title>صفحتي الأولى</title>
  </head>
  <body>
    <h1>أهلاً بالعالم! 👋</h1>
    <p>هذه أول صفحة ويب أقوم ببرمجتها بنفسي.</p>
  </body>
</html>`,
        },
        {
          heading: 'عائلة العناوين والفقرات والقوائم المنظمة',
          text: `تنظيم المحتوى بيعتمد على وسوم محددة:
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
          text: `وسم الصورة <img> عنصر فارغ (void element)، يعني مش بنكتبله وسم إغلاق </img>.
بيحتاج خاصيتين (Attributes) مهمين:
- src: مسار أو رابط الصورة على الإنترنت.
- alt: نص بديل وصف بديل يفيد قارئات الشاشة، ويظهر مكان الصورة إذا تعذر تحميلها.

أما الروابط <a> (Anchor) فبتحتاج خاصية href لتحديد الصفحة التي سينتقل إليها المستخدم عند النقر.`,
          codeSnippet: `<!-- رابط ينتقل لموقع خارجي -->
<a href="https://google.com">ابحث في جوجل</a>

<!-- img عنصر فارغ ولا يحتاج وسم إغلاق -->
<img src="logo.png" alt="شعار كود بالمصري">`,
          callout: {
            type: 'tip',
            title: 'قاعدة الـ h1 الذهبية 🔍',
            content:
              'رتّب العناوين بشكل يوضّح أقسام الصفحة: h1 للعنوان الرئيسي، وبعده h2 وh3 للعناوين الفرعية. المهم العنوان يبقى معبّر وترتيبه منطقي؛ مفيش عدد ثابت لازم من وسوم h1.',
          },
        },
      ],
      exercises: [
        {
          id: 'ch18-ex1',
          title: 'التمرين 1: قائمة التسوق',
          code: `<ul>\n  <li>تفاح</li>\n  <li>موز</li>\n</ul>`,
          expectedOutput: 'معاينة قائمة غير مرتبة فيها التفاح والموز.',
          explanation: 'كود HTML منظم لقائمة غير مرتبة.',
        },
      ],
      quiz: [
        {
          id: 'ch18-q1',
          question:
            'إيه الفرق الأساسي بين وسوم العناوين <h1> والفقرات <p> في HTML؟',
          options: [
            {
              id: 'a',
              text: '<h1> لعنوان رئيسي عريض وهام، بينما <p> للفقرات النصية العادية',
              isCorrect: true,
              explanation:
                'صح جداً! 📝 h1 اختصار Heading 1 وهو أهم عنوان في الصفحة، و p اختصار Paragraph.',
            },
            {
              id: 'b',
              text: '<p> بتعرض كود برمجي فقط',
              isCorrect: false,
              explanation: 'الكود بيتعرض بوسوم زي <code> أو <pre>.',
            },
            {
              id: 'c',
              text: 'مفيش فرق في المعنى الدلالي',
              isCorrect: false,
              explanation:
                'المتصفحات ومحركات البحث بتعتمد على العناوين لتنظيم وفهم هيكل الصفحة.',
            },
          ],
        },
        {
          id: 'ch18-q2',
          question: 'لكتابة قائمة نقطية غير مرتبة بنستخدم وسم:',
          options: [
            {
              id: 'a',
              text: '<ul> مع <li>',
              isCorrect: true,
              explanation:
                'برافو! 🎯 ul اختصار Unordered List و li اختصار List Item.',
            },
            {
              id: 'b',
              text: '<ol> مع <li>',
              isCorrect: false,
              explanation: '<ol> مخصصة للقوائم الرقمية المرتبة (Ordered).',
            },
            {
              id: 'c',
              text: '<list>',
              isCorrect: false,
              explanation: 'مفيش وسم في HTML اسمه <list>.',
            },
          ],
        },
      ],
      challenge: {
        id: 'ch18-chal',
        title: 'وريني شطارتك 🧠: كارت المبرمج في HTML',
        prompt:
          'اكتب HTML مباشرة لبطاقة فيها عنوان <h1> باسمك، وفقرة <p> بالنص "أنا مبرمج ويب"، وقائمة <ul> فيها مهارتان داخل <li>.',
        hint: 'اكتب وسوم h1 و p و ul/li مباشرة، دون console.log.',
        initialCode: `// اكتب كود طباعة وسوم الـ HTML بالترتيب هنا بنفسك...
`,
        solutionCode: `<h1>كود بالمصري</h1>\n<p>أنا مبرمج ويب</p>\n<ul><li>JavaScript</li><li>HTML</li></ul>`,
      },
    },
    {
      id: 19,
      partId: 6,
      partTitle: 'الجزء السادس: من الكود للصفحة',
      title: 'الفصل 19: أساسيات CSS (1)',
      subtitle: 'تلوين وتنسيق: اللون، الخلفية، والخطوط',
      summaryPoints: [
        'CSS (Cascading Style Sheets) هي لغة الأناقة والجمال المسؤولة عن تنسيق صفحات الويب.',
        'قاعدة CSS بتتكون من: المحدد (Selector) والخاصية (Property) والقيمة (Value).',
        'التحكم في الألوان: color للخطوط، و background-color لخلفية العنصر.',
        'تنسيق الخطوط: font-size للحجم، و text-align للمحاذاة، و font-family لنوع الخط.',
      ],
      contentSections: [
        {
          heading: 'تشبيه مصمم الديكور والملابس الشيك: يعني إيه CSS؟',
          text: `لو HTML بنى لك شقة على الطوب الأحمر..
هل هتقعد فيها وتعيش وهي على المحارة كده؟ مستحيل!
إنت محتاج نقاش يدهن الحوائط بألوان مبهجة، ومهندس ديكور يركب الإضاءة والستائر والباركيه!
مهندس الديكور ده هو بالظبط "لغة CSS".
CSS هي المسؤولة عن تحويل صفحة الويب من صفحة رمادية كئيبة شكلها زي ورقة وورد سنة 1995، إلى موقع عصري ساحر جذاب زي فيسبوك أو يوتيوب!`,
          codeSnippet: `/* جعل كل العناوين باللون البرتقالي وحجم كبير */
h1 {
  color: orange;
  font-size: 28px;
  text-align: center;
}`,
        },
        {
          heading: 'قاعدة CSS الذهبية (The CSS Rule): فك الشفرة',
          text: `أي كود CSS في الكون بيتكتب بقاعدة واحدة ثابتة:
1. المحدّد (Selector): بنشاور على العنصر اللي عايزين نلونه (مثلاً: h1 أو p أو button).
2. الأقواس المعقوصة { }: بنفتح قوسين نحط جواهم كل التعديلات.
3. الخاصية والقيمة (Property: Value;): بنكتب اسم الخاصية (زي color)، ثم نقطتين، ثم القيمة. الفاصلة المنقوطة تفصل بين التصريحات، ويُستحسن وضعها في النهاية رغم أنها اختيارية بعد آخر تصريح.`,
          codeSnippet: `p {
  color: #38bdf8;          /* لون النص سماوي جميل */
  background-color: #0f172a; /* لون الخلفية كحلي داكن */
  font-size: 18px;          /* حجم الخط */
  line-height: 1.6;         /* تباعد مريح بين الأسطر */
}`,
        },
        {
          heading: 'التحكم في الألوان والخطوط مع معاينة حية 🎨',
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
              'الفاصلة المنقوطة بتفصل تعليمات CSS عن بعض. الأفضل تحطها بعد كل تعليمة، حتى الأخيرة، عشان تسهّل الإضافة بعدين؛ ولو اتشالت من آخر تعليمة بس، القاعدة لسه شغالة.',
          },
        },
      ],
      exercises: [
        {
          id: 'ch19-ex1',
          title: 'التمرين 1: تنسيق الفقرة في CSS',
          code: `p { color: red; font-size: 20px; }`,
          expectedOutput: 'معاينة فقرة بخط أحمر حجمه 20px.',
          explanation: 'قاعدة CSS واضحة تحدد اللون والحجم للفقرة.',
        },
      ],
      quiz: [
        {
          id: 'ch19-q1',
          question: 'خاصية CSS المسؤولة عن تغيير لون خلفية العنصر هي:',
          options: [
            {
              id: 'a',
              text: 'background-color',
              isCorrect: true,
              explanation:
                'صح جداً! 👏 color للنص، بينما background-color للخلفية.',
            },
            {
              id: 'b',
              text: 'text-color',
              isCorrect: false,
              explanation: 'مفيش خاصية في CSS اسمها text-color.',
            },
            {
              id: 'c',
              text: 'bg',
              isCorrect: false,
              explanation: 'bg مجرد اختصار في بعض المكتبات لكن في CSS الصافي هي background-color.',
            },
          ],
        },
        {
          id: 'ch19-q2',
          question: 'لتوسيط النص في منتصف الصفحة أفقياً نستخدم:',
          options: [
            {
              id: 'a',
              text: 'text-align: center;',
              isCorrect: true,
              explanation:
                'برافو! 🎯 text-align بتتحكم في محاذاة الكلمات (center / right / left).',
            },
            {
              id: 'b',
              text: 'align: middle;',
              isCorrect: false,
              explanation: 'خاصية align قديمة وغير قياسية.',
            },
            {
              id: 'c',
              text: 'font-center: true;',
              isCorrect: false,
              explanation: 'لا توجد خاصية بهذا الاسم.',
            },
          ],
        },
      ],
      challenge: {
        id: 'ch19-chal',
        title: 'وريني شطارتك 🧠: كود التنسيق الملكي',
        prompt:
          'اكتب قاعدة CSS للمحدد .highlight تجعل لون النص أصفر باستخدام color: yellow.',
        hint: '.highlight { color: yellow; }',
        initialCode: `// اكتب كود طباعة قاعدة CSS لـ h1 هنا بنفسك...
`,
        solutionCode: `.highlight { color: yellow; }`,
      },
    },
    {
      id: 20,
      partId: 6,
      partTitle: 'الجزء السادس: من الكود للصفحة',
      title: 'الفصل 20: تقسيم الصفحة والمدخلات (HTML 2)',
      subtitle: 'حاويات div ومدخلات input وأزرار button',
      summaryPoints: [
        'وسم <div> هو الصندوق والحاوية الأكثر استخداماً على الإطلاق لتجميع وتقسيم أجزاء الصفحة.',
        'وسم <input> بيسمح باستقبال بيانات من المستخدم (نصوص، أرقام، كلمات سر، تواريخ).',
        'خاصية placeholder بتعرض نصاً إرشادياً رمادياً يختفي فور بدء الكتابة.',
        'وسم <button> يمثل زر الإجراء والنقر، و <label> لتسمية الحقول بوضوح.',
      ],
      contentSections: [
        {
          heading: 'الصناديق السحرية: وسم <div> وتقسيم الصفحة',
          text: `لو عندك شقة واسعة بدون أي جدران أو غرف.. هتكون فوضى!
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
- type="password": بيخفي الحروف وهي بتتكتب، لكنه مش بيشفّرها ولا بيحميها لوحده.
- type="number": حقل للأرقام؛ ممكن يقبل كسور أو إشارات حسب إعداداته والمتصفح.
- type="email": بيفحص شكل البريد بشكل مبدئي، بس مش بيتأكد إن العنوان حقيقي أو بتاع المستخدم.`,
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
          id: 'ch20-ex1',
          title: 'التمرين 1: حقل كلمة المرور',
          code: `<label for="password">كلمة المرور</label>\n<input id="password" name="password" type="password" placeholder="كلمة المرور">`,
          expectedOutput: 'معاينة حقل كلمة مرور مع تسمية مرتبطة به.',
          explanation: 'الإخفاء بصري فقط؛ اربط label بالحقل باستخدام for و id.',
        },
      ],
      quiz: [
        {
          id: 'ch20-q1',
          question: 'لو عايزين نعمل حقل إدخال يخفي الحروف اللي بتتكتب بنقاط سرية، بنحدد type إيه؟',
          options: [
            {
              id: 'a',
              text: 'type="password"',
              isCorrect: true,
              explanation:
                'صح! 🔒 نوع password يخفي الأحرف على الشاشة، لكنه لا يشفّر قيمة الحقل.',
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
      ],
      challenge: {
        id: 'ch20-chal',
        title: 'وريني شطارتك 🧠: نموذج بريد إلكتروني',
        prompt:
          'اكتب نموذج HTML فيه label مرتبط بحقل بريد باستخدام for و id، وحقل type="email"، وزر إرسال.',
        hint: 'اجعل قيمة label for مساوية لـ id الحقل، واستخدم button type="submit".',
        initialCode: `// اكتب كود طباعة وسم الزرار هنا بنفسك...
`,
        solutionCode: `<form><label for="email">البريد الإلكتروني</label><input id="email" name="email" type="email"><button type="submit">إرسال</button></form>`,
      },
    },
    {
      id: 21,
      partId: 6,
      partTitle: 'الجزء السادس: من الكود للصفحة',
      title: 'الفصل 21: تزيين الأزرار وتأثيرات الفأرة (CSS 2)',
      subtitle: 'الحواف الدائرية، الظلال، و:hover',
      summaryPoints: [
        'نموذج الصندوق (Box Model) يتكون من: المحتوى، والحشوة الداخلية (padding)، والحدود (border)، والهامش الخارجي (margin).',
        'خاصية border-radius تحول الحواف الحادة لأركان ناعمة دائرية جذابة.',
        'تأثير :hover هو ساحر تفاعل الفأرة؛ يغير اللون والشكل فور مرور الماوس فوق الزر.',
        'خاصية cursor: pointer تجعل مؤشر الماوس يتحول لشكل اليد المشيرة للدلالة على قابلية النقر.',
      ],
      contentSections: [
        {
          heading: 'صندوق الملاكمة (The Box Model): تشبيه مخدات الكرتونة',
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
          heading: 'سحر تفاعل الفأرة: الـ :hover والتحولات الناعمة',
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
          id: 'ch21-ex1',
          title: 'التمرين 1: تأثير المرور hover',
          code: `button:hover { background-color: darkblue; }`,
          expectedOutput: 'معاينة قاعدة CSS التي تغيّر خلفية الزر عند المرور عليه.',
          explanation: 'تغيير لون الزر عند مرور مؤشر الفأرة.',
        },
      ],
      quiz: [
        {
          id: 'ch21-q1',
          question: 'خاصية border-radius وظيفتها إيه في CSS؟',
          options: [
            {
              id: 'a',
              text: 'تدوير حواف وأركان الصندوق لجعلها منحنية وناعمة',
              isCorrect: true,
              explanation:
                'صح جداً! 👏 كل ما تزود القيمة (مثلاً 20px أو 50%) كل ما الحواف تكون دائرية أكتر.',
            },
            {
              id: 'b',
              text: 'تغيير لون الحدود',
              isCorrect: false,
              explanation: 'لون الحدود بيتم بـ border-color.',
            },
            {
              id: 'c',
              text: 'مسح محتوى الصندوق',
              isCorrect: false,
              explanation: 'لا تؤثر على المحتوى.',
            },
          ],
        },
      ],
      challenge: {
        id: 'ch21-chal',
        title: 'وريني شطارتك 🧠: حواف الزرار المستديرة',
        prompt:
          'اكتب قاعدة CSS مباشرة تجعل أزرار button بحواف دائرية (border-radius: 12px;).',
        hint: 'button { border-radius: 12px; }',
        initialCode: `// اكتب كود تدوير حواف الأزرار هنا بنفسك...
`,
        solutionCode: `button { border-radius: 12px; }`,
      },
    },
    {
      id: 22,
      partId: 6,
      partTitle: 'الجزء السادس: من الكود للصفحة',
      title: 'الفصل 22: ألوان الشاشات RGB و Hex والشفافية (CSS 3)',
      subtitle: 'خلط درجات الضوء: أحمر، أخضر، أزرق',
      summaryPoints: [
        'شاشات الموبايل والكمبيوتر بتصنع ملايين الألوان بخلط 3 أنوار ضوئية: Red و Green و Blue.',
        'نظام rgb(r, g, b) يقبل أرقاماً من 0 إلى 255 لكل لون.',
        'نظام rgba(r, g, b, a) يضيف معامل الشفافية Alpha من 0 (شفاف تماماً) إلى 1 (معتم).',
        'شفرات الهكس (Hex Codes) تستخدم علامة # متبوعة بـ 6 خانات هكساديسيمال (#ff6600).',
      ],
      contentSections: [
        {
          heading: 'كيف تفهم الشاشات الألوان؟ خلط أضواء RGB',
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
          heading: 'الشفافية وزجاج الهواتف مع RGBA (Glassmorphism)',
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
  <p class="text-xs text-amber-100">دمج الألوان شفرات Hex بانسيابية فائقة تجذب انتباه المستخدم فوراً.</p>
</div>`,
        },
      ],
      exercises: [
        {
          id: 'ch22-ex1',
          title: 'التمرين 1: لون نصف شفاف بـ rgba',
          code: `div { background-color: rgba(0, 0, 0, 0.5); }`,
          expectedOutput: 'معاينة قاعدة CSS بخلفية سوداء شفافة.',
          explanation: 'خلفية سوداء بنصف شفافية.',
        },
      ],
      quiz: [
        {
          id: 'ch22-q1',
          question: 'الحرف A في نظام الألوان rgba بيرمز لإيه؟',
          options: [
            {
              id: 'a',
              text: 'Alpha: معامل الشفافية بين 0 و 1',
              isCorrect: true,
              explanation:
                'صح جداً! 👏 Alpha هي اللي بتخليك تشوف ما وراء العنصر.',
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
              explanation: 'اسم المعامل هو Alpha.',
            },
          ],
        },
      ],
      challenge: {
        id: 'ch22-chal',
        title: 'وريني شطارتك 🧠: شفرة الهكس الخالصة',
        prompt:
          'اكتب قاعدة CSS مباشرة تجعل لون خلفية الصفحة body أبيض باستخدام شفرة Hex وهي #ffffff.',
        hint: 'body { background-color: #ffffff; }',
        initialCode: `// اكتب كود تلوين خلفية body بالهكس الأبيض هنا بنفسك...
`,
        solutionCode: `body { background-color: #ffffff; }`,
      },
    },
    {
      id: 23,
      partId: 6,
      partTitle: 'الجزء السادس: من الكود للصفحة',
        title: 'الفصل 23: بناء بطاقة ملف شخصي (مشروع عملي)',
        subtitle: 'دمج HTML وCSS في بطاقة شخصية',
      summaryPoints: [
        'دمج HTML و CSS لبناء كارت بروفايل مبرمج احترافي كامل (Portfolio Card).',
        'توسيط البطاقة وضبط عرضها لتناسب الشاشات الصغيرة.',
        'استخدام الخطوط والصور والظلال والأزرار التفاعلية في مشروع واحد.',
        'فحص الصفحة والتأكد من توافق الألوان والتنسيقات في بيئة المتصفح الحقيقية.',
      ],
      contentSections: [
        {
          heading: 'تجميع كل المهارات في مشروع حقيقي متكامل 🚀',
          text: `مبروك وصولك لهذه المحطة الذهبية!
في الفصول السابقة اتعلمنا:
- هيكلة الصفحات بالوسوم والعناوين والقوائم (HTML).
- حقول الإدخال والأزرار والصناديق <div>.
- تلوين النصوص والخلفيات وتنسيق الخطوط (CSS).
- الحواف الدائرية وتأثيرات :hover وظلال الصناديق.
- أنظمة الألوان RGB و Hex والتدرجات.

الآن هنبني نموذج بطاقة ملف شخصي. هذا مثال تدريبي لدمج HTML وCSS، ويمكنك تطويره لاحقاً وإضافة رابط تواصل حقيقي قبل نشره.

في CSS هنا استخدمنا Flexbox عشان نوسّط المحتوى:
- display: flex بيشغّل ترتيب العناصر المرن جوه الحاوية.
- justify-content بيوسّط العناصر أفقياً.
- align-items بيوسّطها رأسياً.
- min-height: 100vh بيخلي الحاوية بطول الشاشة.
- width: min(...) بيحط حد أقصى للعرض وبيسيب مساحة على الموبايل.`,
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
    <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150" class="avatar" alt="صورة المبرمج">
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
            title: 'إنجاز تاريخي! 🏆',
            content:
              'بهذا الكارت إنت أصبحت رسمياً مطور ويب! صنعت هيكلاً ونظمت محتواه، ونسقته بأحدث معايير الأناقة البصرية. والخطوة القادمة هي ربط JavaScript بالصفحة لتنبض بالحياة!',
          },
        },
      ],
      exercises: [
        {
          id: 'ch23-ex1',
          title: 'التمرين 1: هيكل بطاقة البروفايل',
          code: `<div class="card"><h2>اسم المبرمج</h2><p>نبذة</p></div>`,
          expectedOutput: 'معاينة بطاقة فيها اسم المبرمج ونبذة.',
          explanation: 'تجميع الكارت في حاوية div واحدة.',
        },
      ],
      quiz: [
        {
          id: 'ch23-q1',
          question: 'ليه بنجمع عناصر البروفايل (الصورة، الاسم، الزر) جوه div واحدة؟',
          options: [
            {
              id: 'a',
              text: 'عشان ننسق الكارت ككتلة واحدة ونديله خلفية وهوامش وظلال مشتركة',
              isCorrect: true,
              explanation:
                'صح جداً! 👏 الـ div بتلم العناصر في عائلة واحدة منظمة.',
            },
            {
              id: 'b',
              text: 'لأن المتصفح يرفض عرض أكثر من عنصر بدون div',
              isCorrect: false,
              explanation: 'المتصفح يعرض العناصر عادي، لكن التجميع يوفر التحكم والتنسيق.',
            },
            {
              id: 'c',
              text: 'لتسريع الإنترنت عند المستخدم',
              isCorrect: false,
              explanation: 'لا علاقة للوسوم بسرعة الاتصال.',
            },
          ],
        },
      ],
      challenge: {
        id: 'ch23-chal',
        title: 'وريني شطارتك 🧠: كارت المنتج المتكامل',
        prompt:
          'اكتب بطاقة منتج HTML بكلاس product-card، فيها عنوان h2 وفقرة وزر شراء، وأضف قاعدة CSS واحدة لتنسيق البطاقة.',
        hint: '<style>.product-card { padding: 16px; }</style><article class="product-card"><h2>ساعة ذكية</h2><p>خفيفة وعملية</p><button>شراء</button></article>',
        initialCode: `// اكتب كود طباعة كارت المنتج هنا بنفسك...
`,
        solutionCode: `<style>.product-card { padding: 16px; background: #eee; }</style><article class="product-card"><h2>ساعة ذكية</h2><p>خفيفة وعملية</p><button>شراء</button></article>`,
      },
    },
    {
      id: 24,
      partId: 6,
      partTitle: 'الجزء السادس: من الكود للصفحة',
      title: 'الفصل 24: الكائنات (Objects)',
      subtitle: 'بطاقة التعريف: مفتاح وقيمة (Key: Value)',
      summaryPoints: [
        'الكائن (Object) هو كبسولة بيانات بتجمع كل المعلومات المتعلقة بكيان واحد (طالب، سيارة، منتج).',
        'يتكون الكائن من أزواج { key: value } محصورة بين قوسين معقوصين ومفصولة بفواصل.',
        'الوصول للخصائص: طريقة النقطة (Dot notation: student.name) أو الأقواس (student["age"]).',
        'الدوال داخل الكائنات تسمى Methods، وكلمة this تشير لنفس الكائن الحالي.',
      ],
      contentSections: [
        {
          heading: 'تشبيه بطاقة الرقم القومي أو بروفايل البطل في اللعبة',
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
          heading: 'الدوال داخل الكائنات (Methods) وكلمة this السحرية',
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
          id: 'ch24-ex1',
          title: 'التمرين 1: قراءة خصائص الكائن',
          code: `const car = { brand: "تويوتا", year: 2022 };
console.log(car.brand);
console.log(car["year"]);`,
          expectedOutput: `تويوتا\n2022`,
          explanation: 'القراءة بالنقطة وبالأقواس المربعة.',
        },
      ],
      quiz: [
        {
          id: 'ch24-q1',
          question: 'كلمة this جوه دالة موجودة في كائن بتشير لمين؟',
          codeSnippet:
            'const user = {\n  name: "كريم",\n  sayHello() {\n    console.log("أهلاً، أنا " + this.name);\n  }\n};',
          options: [
            {
              id: 'a',
              text: 'بتشير لنفس الكائن الحالي (user) اللي الدالة شغالة جواه',
              isCorrect: true,
              explanation:
                'صح جداً! 👏 this بتسمح للدالة تقرأ وتعدل خواص الكائن نفسه بسهولة.',
            },
            {
              id: 'b',
              text: 'بتشير لمتصفح الويب بالكامل',
              isCorrect: false,
              explanation:
                'لو استدعيت الدالة كـ method للكائن، this بتشير للكائن نفسه.',
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
          id: 'ch24-q2',
          question: 'إزاي نستدعي دالة sayHello المعرفة جوه الكائن user؟',
          options: [
            {
              id: 'a',
              text: 'user.sayHello()',
              isCorrect: true,
              explanation:
                'برافو! 🎯 اسم الكائن يليه نقطة ثم اسم الدالة وقوسين الاستدعاء ().',
            },
            {
              id: 'b',
              text: 'sayHello()',
              isCorrect: false,
              explanation:
                'الدالة مش معرّفة عالمياً، بل مربوطة بداخل الكائن user.',
            },
            {
              id: 'c',
              text: 'call user.sayHello',
              isCorrect: false,
              explanation: 'في جافاسكريبت الاستدعاء يتم بوضع القوسين ().',
            },
          ],
        },
      ],
      challenge: {
        id: 'ch24-chal',
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
      id: 25,
      partId: 6,
      partTitle: 'الجزء السادس: من الكود للصفحة',
      title: 'الفصل 25: شجرة الـ DOM والأحداث (Events)',
      subtitle: 'ربط JavaScript بالصفحة: النقر والتفاعل',
      summaryPoints: [
        'الـ DOM (Document Object Model) هو الشجرة التي يرى بها JavaScript عناصر صفحة HTML ويتحكم فيها.',
        'الدالة document.getElementById() تمسك أي عنصر بالمعرف الفريد بتاعه.',
        'تعديل النصوص بـ textContent وتعديل التنسيقات بـ style.',
        'مراقبة تصرفات المستخدم عبر addEventListener("click", callback) لتشغيل الكود فور النقر.',
      ],
      contentSections: [
        {
          heading: 'تشبيه المخرج المسرحي: يعني إيه شجرة الـ DOM؟',
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
          heading: 'مراقبة نقرات المستخدم: الأحداث (Events & addEventListener)',
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
<html>
<body>
  <div style="text-align: center;">
    <h2>عدد التسبيحات: <span id="count">0</span></h2>
    <button id="counterBtn">سبّح 📿</button>
  </div>

  <script>
    let counter = 0;
    const countDisplay = document.getElementById("count");
    const counterButton = document.getElementById("counterBtn");

    counterButton.addEventListener("click", function() {
      counter++;
      countDisplay.textContent = counter;
    });
  </script>
</body>
</html>`,
          type: 'html_preview',
          htmlCode: `<div class="p-6 bg-slate-900 border border-slate-700 rounded-2xl max-w-xs mx-auto text-center shadow-2xl font-sans" dir="rtl">
  <h3 class="text-sm font-semibold text-slate-400 mb-2">عداد التسبيح التفاعلي</h3>
  <div class="text-4xl font-extrabold text-amber-400 mb-4 font-mono">33</div>
  <button class="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold rounded-xl shadow-lg transition text-sm cursor-pointer">
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
          id: 'ch25-ex1',
          title: 'التمرين 1: تغيير النص في الـ DOM',
          code: `<h1 id="title">العنوان القديم</h1>\n<button id="change">غيّر النص</button>\n<script>\n  document.getElementById("change").addEventListener("click", () => {\n    document.getElementById("title").textContent = "جديد";\n  });\n</script>`,
          expectedOutput: 'معاينة صفحة يتغير عنوانها عند النقر على الزر.',
          explanation: 'اربط حدث النقر ثم حدّث textContent للعنوان.',
        },
      ],
      quiz: [
        {
          id: 'ch25-q1',
          question: 'الدالة المسؤولة عن مراقبة نقرات الماوس على زر هي:',
          options: [
            {
              id: 'a',
              text: 'button.addEventListener("click", callback)',
              isCorrect: true,
              explanation:
                'ممتاز! 🎯 addEventListener هي المعيار الذهبي لمراقبة أي تفاعل من المستخدم في الويب.',
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
          id: 'ch25-q2',
          question: 'معامل الحدث (event / e) اللي بنستلمه جوه دالة النقر.. جواه إيه؟',
          options: [
            {
              id: 'a',
              text: 'معلومات تفصيلية عن الحدث، زي العنصر المنقور (e.target) ومكان الماوس',
              isCorrect: true,
              explanation:
                'عاش يا بطل! 👏 كائن الحدث كنز معلومات بيفيدك تعرف المستخدم عمل إيه وفين بالظبط.',
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
              explanation: 'لا يحتوي على أي بيانات حساسة.',
            },
          ],
        },
      ],
      challenge: {
        id: 'ch25-chal',
        title: 'وريني شطارتك 🧠: مبدل حالة النور (Light Switch)',
        prompt:
          'اكتب صفحة HTML فيها زر وفقرة. استخدم addEventListener("click") ومتغير boolean لتبديل نص الفقرة بين "النور مضاء" و "النور مطفي" عند كل نقرة.',
        hint: 'عرّف isOn واربِط الزر بـ addEventListener، ثم بدّل القيمة والنص عبر textContent.',
        initialCode: `// اكتب كود دالة تبديل النور وفحص الحالة بنفسك هنا...
`,
        solutionCode: `<!doctype html><html lang="ar" dir="rtl"><body><button id="toggle">بدّل النور</button><p id="status">النور مطفي</p><script>let isOn = false;
document.getElementById("toggle").addEventListener("click", () => {
  isOn = !isOn;
  document.getElementById("status").textContent = isOn ? "النور مضاء" : "النور مطفي";
});</script></body></html>`,
      },
    },
  ],
};
