export interface RuleDetail {
  codeSnippet: string;
  explanation: string;
  realLifeAnalogy: string;
}

export const partSummaryDetails: Record<number, Record<number, RuleDetail>> = {
  // Part 1: المتغيرات والأنواع
  1: {
    0: {
      codeSnippet: `console.log("صباح الفل يا باشمهندس! 👋");
// console.LOG("غلط"); // ❌ ReferenceError لأن الحروف كابيتال`,
      explanation:
        'أمر console.log هو نظارتك اللي بتشوف بيها إيه اللي بيحصل جوه مخ الكمبيوتر. انتبه لحساسية الحروف لأن جافاسكريبت دقيقة جداً: log كلها حروف صغيرة.',
      realLifeAnalogy:
        'زي الفرق بين اسمك "أحمد" و "إحمد" في أوراق الحكومة.. الكمبيوتر مبيعديش أي حرف كابيتال في غير مكانه!',
    },
    1: {
      codeSnippet: `// دي ملحوظة ليا: السطر اللي جاي بيحسب مرتب الشهر
const salary = 7000;
/* تعليق طويل
   على أكتر من سطر */`,
      explanation:
        'التعليق هو رسالة سرية بينك وبين زملائك المبرمجين عشان تفتكروا الكود ده بيعمل إيه؛ الكمبيوتر أول ما يشوف // بيتجاهل السطر كأنه مش موجود.',
      realLifeAnalogy:
        'زي الـ Sticky Note اللي بتلزقها على الثلاجة أو الكتاب عشان تفكرك بحاجة، محدش بيحاسبك عليها!',
    },
    2: {
      codeSnippet: `const totalApples = 14;
const kids = 4;
console.log(totalApples % kids); // 2 متبقيين في إيدك`,
      explanation:
        'علامة % مش نسبة مئوية أبداً في لغات البرمجة! دي بتسأل: لما نقسم الرقم على العدد ده بالتساوي، هيفضل معانا فكة كام في إيدينا؟',
      realLifeAnalogy:
        'معاك 14 جنيه فكة وقسمتهم على 4 أطفال، كل طفل أخد 3 جنيه (المجموع 12).. الباقي في جيبك هو 2 جنيه فكة!',
    },
    3: {
      codeSnippet: `console.log("10" + 5);      // "105" (دمج نصوص - كأنهم لزقوا في بعض)
console.log(Number("10") + 5); // 15 (جمع حسابي حقيقي)`,
      explanation:
        'علامة + أول ما بتلمح أي طرف فيه نص (بين علامتي تنصيص)، بتتحول فوراً لصمغ بيلزق الكلام في بعضه بدل ما تجمعه حسابياً!',
      realLifeAnalogy:
        'زي لما تطلب في المطعم ساندوتش وكانز.. مش بيتجمعوا حسابياً، بيتحطوا جنب بعض في الكيس!',
    },
    4: {
      codeSnippet: `const nationalId = 29901011234567; // ثابت محمي مبيتغيرش
let userScore = 0;                  // متغير بيزيد مع كل خطوة
userScore = userScore + 10;          // مسموح ✅`,
      explanation:
        'القاعدة الذهبية لأي مبرمج محترف: ابدأ دائماً بـ const عشان تحمي بياناتك من أي تعديل بالغلط، واستخدم let فقط لما تكون عارف إن القيمة دي محتاجة تتغير.',
      realLifeAnalogy:
        'const زي الخزنة المقفولة برقم سري ثابت، و let زي السبورة بالقلم الرصاص تقدر تمسح وتكتب عليها في أي وقت.',
    },
    5: {
      codeSnippet: `const cartInput = "250"; // مدخل جاي من شاشة المتصفح كنص
const shipping = 30;
const total = Number(cartInput) + shipping;
console.log("الإجمالي: " + total); // 280`,
      explanation:
        'كل البيانات اللي المستخدم بيكتبها في شاشات الويب بتوصل لجافاسكريبت كنص (String). دالة Number() أو parseInt() بتفك التغليف وترجع الرقم الحقيقي للحساب.',
      realLifeAnalogy:
        'زي لما يجيلك شيك ورقي.. لازم تحوله في البنك لكاش حقيقي عشان تقدر تشتري وتجمع وتطرح بيه.',
    },
  },

  // Part 2: القرارات والشروط
  2: {
    0: {
      codeSnippet: `const isRaining = true;
if (isRaining) {
  console.log("خد معاك الشمسية ☔");
}`,
      explanation:
        'جملة if هي بوابة اتخاذ القرار: بتفحص الشرط بين القوسين، لو طلع true بتفتح الباب وتنفذ الأوامر، ولو false بتتجاهلها تماماً.',
      realLifeAnalogy:
        'زي بوابة المترو: لو معاك تذكرة صالحة (true) تفتح البوابة، لو مامعاكش (false) تفضل مقفولة.',
    },
    1: {
      codeSnippet: `const score = 85;
if (score >= 90) {
  console.log("امتياز 🌟");
} else if (score >= 75) {
  console.log("جيد جداً 👏");
} else {
  console.log("اجتهد أكتر المرة الجاية 💪");
}`,
      explanation:
        'سلسلة else if بتسمح لك تفحص مسارات بديلة متتالية، و else الأخيرة هي طوق النجاة لو مفيش ولا شرط من اللي فوق تحقق.',
      realLifeAnalogy:
        'زي لما تروح تشتري عصير: لو مفيش مانجو، هات جوافة، لو مفيش خالص هات مية!',
    },
    2: {
      codeSnippet: `// ترتيب الشروط التنازلي:
const grade = 95;
if (grade >= 90) {      // الأضيق والأعلى أولاً
  console.log("ممتاز");
} else if (grade >= 50) { // الأوسع بعده
  console.log("ناجح");
}`,
      explanation:
        'الكمبيوتر بيتوقف فوراً عند أول شرط يتحقق وبيتجاهل باقي الشروط! فلو وضعت الشرط الأوسع في البداية هيبلع الحالات المتميزة كلها.',
      realLifeAnalogy:
        'لو بواب العمارة بيسأل: "مين ساكن في الدور العاشر؟" لازم يسأل في الأول، لو سأل "مين معاه مفتاح العمارة؟" الكل هيرفع إيده ومش هيعرف مين في العاشر!',
    },
    3: {
      codeSnippet: `const hasTicket = true;
const isOnTime = true;
console.log(hasTicket && isOnTime); // true (لازم الاتنين معاً)

const hasCash = false;
const hasVisa = true;
console.log(hasCash || hasVisa);    // true (يكفي وسيلة دفع واحدة)`,
      explanation:
        'علامة && طمّاعة؛ لازم كل الشروط تكون true عشان تعديك. أما علامة || طيبة ومتساهلة؛ يكفيها شرط واحد صحيح لتعطيك true.',
      realLifeAnalogy:
        '&& زي جواز السفر والتأشيرة (لازم الاتنين معاً للسفر)، بينما || زي دفع تذكرة الباص بكاش أو بكارت (أي واحدة تمشي).',
    },
    4: {
      codeSnippet: `const isLoggedIn = false;
if (!isLoggedIn) {
  console.log("سجل دخولك الأول يا بطل 🔐");
}`,
      explanation:
        'علامة التعجب ! (NOT) هي المفتاح العاكس؛ بتقلب الـ true لـ false وتقلب الـ false لـ true، ومثالية لفحص غياب الشيء أو عدم تحققه.',
      realLifeAnalogy:
        'زي كلمة "مش".. لو قلت "أنا مش جعان"، قلبت الحالة للعكس فوراً.',
    },
    5: {
      codeSnippet: `const day = 2;
switch (day) {
  case 1:
    console.log("السبت");
    break;
  case 2:
    console.log("الأحد");
    break;
  default:
    console.log("يوم غير معروف");
}`,
      explanation:
        'جملة switch بديل أنيق لجمل if المكررة لما تكون بتقارن نفس المتغير بقيم ثابتة. ولا تنسَ وضع break؛ لأن غيابها بيخلي الكود يفيض على الحالات اللي بعدها (Fall-through).',
      realLifeAnalogy:
        'زي زرار الأسانسير: بتدوس على رقم الدور بالظبط، و break هو الفرامل اللي بتوقفك في دورك ومن غيره الأسانسير هيكمل طيران!',
    },
  },

  // Part 3: التكرار والحلقات
  3: {
    0: {
      codeSnippet: `for (let i = 0; i < 3; i++) {
  console.log("لفة رقم: " + (i + 1));
}`,
      explanation:
        'حلقة for هي الآلة الأوتوماتيكية للتكرار: بتبدأ بالعداد (i=0)، وتفحص هل لسه أقل من الحد، وفي نهاية كل لفة تزود العداد (i++).',
      realLifeAnalogy:
        'زي عداد الضغط في الجيم: بتبدأ من صفر، وتلعب لحد ما تكمل الـ 10 عدات، وتزود 1 في كل عدة.',
    },
    1: {
      codeSnippet: `let energy = 3;
while (energy > 0) {
  console.log("شغال بطاقة: " + energy);
  energy--; // خطوة التحديث الإجبارية لمنع التجميد!
}`,
      explanation:
        'حلقة while بتلف طالما الشرط true. الخطر الأكبر هو نسيان تعديل المتغير جوه الحلقة، لأن الشرط لو فضل true للأبد المتصفح هيهنج (Infinite Loop).',
      realLifeAnalogy:
        'زي بطارية الموبايل: شغال طول ما فيها شحن، ولازم الشحن يقل مع الاستهلاك، وإلا الموبايل هيفضل شغال لآخر الزمان!',
    },
    2: {
      codeSnippet: `let count = 0;
do {
  console.log("هتتطبع مرة واحدة على الأقل!");
} while (count > 5);`,
      explanation:
        'في do..while، الكود بيتنفذ أولاً قبل أي فحص، وبعد ما يخلص اللفة الأولى بيبدأ يفحص الشرط هل يكرر ولا يقف.',
      realLifeAnalogy:
        'زي تجربة عينة عطر مجانية في المحل: بتجرب رشة الأول حتى لو مش هتشتري، وبعدين تقرر!',
    },
    3: {
      codeSnippet: `for (let i = 1; i <= 10; i++) {
  if (i === 4) break; // وقف فوراً واخرج
  console.log(i); // هيطبع 1, 2, 3 فقط
}`,
      explanation:
        'أمر break هو فرامل الطوارئ اللي بتوقف الحلقة فوراً عند حدوث شرط معين وتخرج براها، حتى لو كان التكرار لسه مخلصش.',
      realLifeAnalogy:
        'زي جرس إنذار الحريق في المصنع: أول ما يرن، الشغل كله بيقف والناس بتخرج فوراً حتى لو الشيفت مخلصش.',
    },
  },

  // Part 4: الدوال والمصفوفات
  4: {
    0: {
      codeSnippet: `function makeJuice(fruit) {
  return "عصير " + fruit + " طازج 🍹";
}
const myDrink = makeJuice("مانجو");
console.log(myDrink);`,
      explanation:
        'الدالة زي الخلاط: بتدخلها فواكه (Parameters)، بتخلطهم وتطلع لك كباية عصير لذيذة في يدك عبر أمر return.',
      realLifeAnalogy:
        'زي ماكينة الـ ATM: بتدخل الكارت والمبلغ (مدخلات)، تخرجلك الفلوس في يدك (return). لو طبعت على الشاشة بس ومن غير فلوس مش هتعرف تشتري حاجة!',
    },
    1: {
      codeSnippet: `// دالة سهم بسطر واحد مع return ضمني:
const double = x => x * 2;
console.log(double(10)); // 20`,
      explanation:
        'دوال السهم (Arrow Functions) هي الاختصار العصري للدوال؛ لما تكتفي بسطر واحد بدون أقواس معقوصة، بتعمل return للناتج تلقائياً وبأناقة.',
      realLifeAnalogy:
        'زي الرموز التعبيرية والـ Emojis: بتوصل نفس المعنى كامل بس برمز صغير وسريع بدل سطر كتابة طويل!',
    },
    2: {
      codeSnippet: `const heroes = ["سبايدرمان", "باتمان"];
console.log(heroes[0]); // "سبايدرمان" (البداية من صفر)
heroes.push("سوبرمان"); // إضافة في الآخر
console.log(heroes.length); // 3`,
      explanation:
        'المصفوفات عبارة عن دولاب أدراج مرقم من الصفر [0]؛ وخاصية length بتقولك فيه كام درج مليان، ودالة push بتزود درج جديد في الآخر.',
      realLifeAnalogy:
        'زي أدوار العمارة في مصر: الدور الأرضي هو الصفر [0]، والأول فوقه، فلو عمارة 3 أدوار آخرها الدور التاني!',
    },
    3: {
      codeSnippet: `const scores = [45, 80, 92, 35, 70];
const passed = scores.filter(s => s >= 50);
console.log(passed); // [80, 92, 70]`,
      explanation:
        'دالة .filter() زي المصفاة: بتعدّي فقط العناصر اللي حققت شرطك في مصفوفة جديدة وبتستبعد الباقي بدون ما تعدل المصفوفة الأصلية.',
      realLifeAnalogy:
        'زي مصفاة الشاي أو أمن النادي: بيسيب الأعضاء اللي معاهم كارنيه يعدوا ويرجع الباقي!',
    },
    4: {
      codeSnippet: `const prices = [10, 20, 30];
const withTax = prices.map(p => p * 1.14);
console.log(withTax); // [11.4, 22.8, 34.2]`,
      explanation:
        'دالة .map() زي خط إنتاج في مصنع: بتاخد كل عنصر في المصفوفة، تعمل عليه عملية معينة، وتطلع مصفوفة جديدة تماماً بنفس الطول.',
      realLifeAnalogy:
        'زي ماكينة طلاء السيارات: بتدخلها 3 عربيات لونهم أبيض، تخرجهم كلهم لونهم أزرق ميتالك!',
    },
  },

  // Part 5: الكائنات والـ DOM
  5: {
    0: {
      codeSnippet: `const player = {
  name: "محمد",
  level: 5,
  isOnline: true
};
console.log(player.name);       // طريقة النقطة
console.log(player["level"]);   // طريقة الأقواس`,
      explanation:
        'الكائن (Object) هو صندوق ذكي بيجمع معلومات كيان واحد في مفاتيح وقيم؛ تقدر توصف بيه شخص، عربية، منتج، أو أي حاجة في عالمنا.',
      realLifeAnalogy:
        'زي بطاقة الرقم القومي أو رخصة القيادة: فيها الاسم، الرقم، الصورة، وتاريخ الميلاد في كارت واحد منظم.',
    },
    1: {
      codeSnippet: `const car = {
  brand: "تويوتا",
  speed: 0,
  accelerate() {
    this.speed = this.speed + 20;
    console.log(this.brand + " سرعتها الآن: " + this.speed);
  }
};
car.accelerate();`,
      explanation:
        'الدوال جوه الكائنات اسمها Methods؛ وكلمة this بتشير لنفس الكائن الحالي عشان تقدر الدالة تقرأ وتعدل خواصه الداخلية بحرية.',
      realLifeAnalogy:
        'زي لما تقول "أنا محتاج أشرب مية".. كلمة "أنا" بتشير لنفسك أنت مش لشخص تاني في الشارع!',
    },
    2: {
      codeSnippet: `// شجرة الـ DOM
const title = document.querySelector("#main-title");
title.textContent = "أهلاً بكم في كود بالمصري 🚀";`,
      explanation:
        'الـ DOM هو الكوبري بين جافاسكريبت وعناصر صفحة الويب؛ بيحول كود الـ HTML لكائنات تفاعلية تقدر تقرأها وتعدل نصوصها وألوانها على الطاير.',
      realLifeAnalogy:
        'زي جهاز الريموت كنترول: واقف بعيد وبضغطة زرار بتغير القناة أو تعلي الصوت في الشاشة بدون ما تلمسها!',
    },
    3: {
      codeSnippet: `const btn = document.querySelector("#save-btn");
btn.addEventListener("click", () => {
  console.log("تم النقر على الزرار بنجاح! 🎯");
});`,
      explanation:
        'الدالة addEventListener بتنصب فخاً أو حارساً على العنصر؛ بيفضل مراقب لحد ما المستخدم ينقر أو يكتب، وأول ما الحدث يحصل بيشغل الكود فوراً.',
      realLifeAnalogy:
        'زي جرس الباب: بيفضل ساكت لحد ما الضيف يدوس على الزرار، فيرن في الحال!',
    },
  },

  // Part 6: الويب والمشاريع المتكاملة
  6: {
    0: {
      codeSnippet: `// تخزين واسترجاع كائن في الـ LocalStorage:
const user = { name: "أحمد", score: 100 };
localStorage.setItem("user_profile", JSON.stringify(user));

const saved = JSON.parse(localStorage.getItem("user_profile") || "{}");
console.log(saved.name); // "أحمد"`,
      explanation:
        'الـ LocalStorage بتخزن البيانات في متصفح المستخدم حتى بعد قفل الجهاز؛ ولأنها مبتقبلش غير نصوص، بنحول الكائن لنص بـ JSON.stringify وبنرجعه بـ JSON.parse.',
      realLifeAnalogy:
        'زي كرتونة الشحن: لازم تفكك العفش وترصه في كرتونة عشان تشحنه (stringify)، ولما يوصل البيت تفكه وتركبه تاني (parse)!',
    },
    1: {
      codeSnippet: `async function loadData() {
  console.log("جاري جلب البيانات...");
  const response = await fetch("https://api.example.com/items");
  const data = await response.json();
  console.log("وصلت البيانات بنجاح: ", data);
}`,
      explanation:
        'العمليات غير المتزامنة (Async / Await) بتسمح للمتصفح يجلب بيانات من السيرفر في الخلفية بدون ما يجمد الصفحة أو يعطل حركة الماوس عند المستخدم.',
      realLifeAnalogy:
        'زي لما تطلب بيتزا دليفري: بتطلب وتكمل حياتك وتتفرج على التلفزيون لحد ما الدليفري يخبط على الباب، مش بتفضل واقف عند الباب متبسم ساعتين!',
    },
    2: {
      codeSnippet: `try {
  // كود ممكن يفشل (زي انقطاع الإنترنت أو مدخل خاطئ)
  const result = JSON.parse("invalid-json");
} catch (error) {
  console.log("اصطدنا الخطأ بسلام ودون انهيار التطبيق: " + error.message);
}`,
      explanation:
        'بنية try...catch هي شبكة الأمان؛ الكود اللي جوه try لو حصل فيه أي عطل أو خطأ غير متوقع، البرنامج مش هيموت بل هيروح لـ catch عشان تعالج المشكلة بلطف.',
      realLifeAnalogy:
        'زي حزام الأمان في العربية: لو حصلت فرملة مفاجئة، بيحميك وميخليش العربية تتقلب!',
    },
    3: {
      codeSnippet: `const form = document.querySelector("#login-form");
form.addEventListener("submit", (e) => {
  e.preventDefault(); // وقف الريلود التلقائي
  console.log("هنعالج البيانات بجافاسكريبت بدون وميض أو ريفريش!");
});`,
      explanation:
        'السلوك الطبيعي لأي فورم في المتصفح هو إعادة تحميل الصفحة (Reload) فور الإرسال؛ وأمر e.preventDefault() بيوقف السلوك ده ويخلي التطبيق SPA سلس.',
      realLifeAnalogy:
        'زي لما تكون في قطار سريع وعايز تنزل محطة، فبتشد فرملة الطوارئ قبل ما يعديها!',
    },
  },
};
