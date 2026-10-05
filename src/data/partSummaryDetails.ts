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

  // Part 4: Math والدوال والنطاق ولعبة التخمين
  4: {
    0: {
      codeSnippet: "const dice = Math.floor(Math.random() * 6) + 1;",
      explanation: "Math.floor بتقرب لتحت، وMath.random بترجع كسر من صفر لأقل من واحد؛ ولما نركبهم مع بعض نقدر نطلع رقم صحيح من 1 لـ6.",
      realLifeAnalogy: "زي اختيار رقم عشوائي من حجر النرد.",
    },
    1: {
      codeSnippet: "function doubleNumber(number) { return number * 2; } console.log(doubleNumber(7));",
      explanation: "المعامل بياخد قيمة وقت ما نستدعي الدالة، والدالة بترجع الناتج باستخدام return.",
      realLifeAnalogy: "زي آلة بندخلها رقم وتطلع لنا نتيجة.",
    },
    2: {
      codeSnippet: "function makeMessage(name) { return \"أهلاً \" + name; } console.log(makeMessage(\"سارة\"));",
      explanation: "return بيرجّع قيمة نقدر نخزنها ونستخدمها بعدين؛ console.log بيعرضها بس.",
      realLifeAnalogy: "زي إنك تسلّم الإجابة للي طلبها بدل ما تعرضها على الشاشة بس.",
    },
    3: {
      codeSnippet: "function startGame() { const secretCode = 999; console.log(\"اللعبة بدأت\"); } startGame();",
      explanation: "المتغير المحلي اللي بنعرّفه جوه الدالة بيبقى متاح جواها بس.",
      realLifeAnalogy: "زي مفتاح أوضة مينفعش نستخدمه برّه الأوضة.",
    },
    4: {
      codeSnippet: "const secret = 6, guess = 6; if (guess === secret) { console.log(\"مبروك كسبت\"); }",
      explanation: "اللعبة بتقارن التخمين بالرقم السري وبتعرض النتيجة المناسبة.",
      realLifeAnalogy: "لعبة تخمين رقم.",
    },
  },

  // Part 5: المصفوفات والحلقات وطرقها
  5: {
    0: {
      codeSnippet: "const scores = [88, 77, 95]; console.log(scores[0], scores[scores.length - 1]);",
      explanation: "الفهارس بتبدأ من صفر، وآخر فهرس بيساوي length - 1.",
      realLifeAnalogy: "زي رفوف مرقمة بتبدأ من صفر.",
    },
    1: {
      codeSnippet: "const foods = [\"كشري\", \"ملوخية\"]; for (const food of foods) { console.log(food); }",
      explanation: "for...of بتعدّي على قيم المصفوفة واحدة واحدة.",
      realLifeAnalogy: "قراءة قائمة صنفاً بعد صنف.",
    },
    2: {
      codeSnippet: "const fruits = [\"تفاح\"]; fruits.push(\"موز\"); fruits.pop();",
      explanation: "push بتضيف عنصر في الآخر، وpop بتحذف آخر عنصر.",
      realLifeAnalogy: "إضافة كتاب أعلى كومة ثم إزالة العلوي.",
    },
    3: {
      codeSnippet: "const colors = [\"أحمر\", \"أزرق\"]; console.log(colors.includes(\"أزرق\"), colors.indexOf(\"أحمر\"));",
      explanation: "includes بتشوف إذا القيمة موجودة، وindexOf بيرجّع مكانها أو -1.",
      realLifeAnalogy: "البحث في قائمة وتحديد رقم العنصر.",
    },
    4: {
      codeSnippet: "const values = [2, 5, 8]; for (let i = 0; i < values.length; i++) console.log(values[i]);",
      explanation: "خلّي شرط الحلقة مرتبط بطول المصفوفة عشان متعدّيش آخر فهرس.",
      realLifeAnalogy: "عدّ الخانات المتاحة فقط.",
    },
  },

  // Part 6: HTML وCSS والنماذج والكائنات وDOM
  6: {
    0: {
      codeSnippet: "<h1>العنوان</h1><p>فقرة</p><ul><li>عنصر</li></ul><img src=\"photo.jpg\" alt=\"وصف الصورة\">",
      explanation: "وسوم HTML بتوضح شكل ومعنى المحتوى، وalt وصف بديل للصورة.",
      realLifeAnalogy: "مخطط المبنى ولافتات الغرف.",
    },
    1: {
      codeSnippet: "button { color: white; background-color: #2563eb; padding: 12px; border-radius: 8px; }",
      explanation: "قاعدة CSS بتحدد العنصر وخصائصه؛ padding للمساحة الداخلية وborder-radius لتدوير الحواف.",
      realLifeAnalogy: "الدهان والأثاث والمسافات.",
    },
    2: {
      codeSnippet: "<form><label for=\"email\">البريد</label><input id=\"email\" name=\"email\" type=\"email\"></form>",
      explanation: "اربط label بالحقل عن طريق for وid، واستخدم name عشان تميّز قيمة الحقل.",
      realLifeAnalogy: "عنوان واضح لكل خانة في الاستمارة.",
    },
    3: {
      codeSnippet: "const car = { brand: \"تويوتا\", speed: 0, accelerate() { this.speed += 20; } }; car.accelerate();",
      explanation: "الكائن بيجمع بياناته والطرق بتاعته، وthis بتشاور على الكائن اللي استدعينا طريقته.",
      realLifeAnalogy: "بطاقة مواصفات وعمليات السيارة.",
    },
    4: {
      codeSnippet: "const button = document.querySelector(\"#save\"); button.addEventListener(\"click\", () => { document.querySelector(\"#status\").textContent = \"تم الحفظ\"; });",
      explanation: "DOM بيسمح لنا نختار عناصر الصفحة، وaddEventListener بيربط تفاعل المستخدم بتغيير ظاهر.",
      realLifeAnalogy: "جرس يشغّل فعلاً عند النقر.",
    },
    5: {
      codeSnippet: "<style>.card { max-width: 320px; margin: auto; }</style><article class=\"card\"><h2>ملفي</h2></article>",
      explanation: "المشروع بيجمع HTML للمحتوى وCSS للشكل.",
      realLifeAnalogy: "تركيب الهيكل والديكور في مشروع واحد.",
    },
  },

};
