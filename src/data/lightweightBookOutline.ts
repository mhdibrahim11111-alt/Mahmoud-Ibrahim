// Lightweight course outline for instant navigation, sidebar, and progress tracking.
// Detailed lesson chapters are loaded dynamically per part on demand.
import { Part } from "../types";

export const lightweightBookParts: Part[] = [
  {
    "id": 1,
    "title": "الجزء الأول: المتغيرات والأنواع",
    "subtitle": "الصناديق اللي بنخزّن فيها المعلومة",
    "description": "مدخل لعالم البرمجة، التعامل مع الـ Console، العمليات الحسابية، الصناديق والخزائن (let وconst)، والأنواع الأساسية.",
    "iconName": "Box",
    "bugHunter": {
      "id": "bug-part-1",
      "partId": 1,
      "title": "كويز: صندوق أم خزنة؟",
      "context": "الكود ده لازم يطبع بيانات طالب ودرجته النهائية بعد إضافة 5 درجات بونص، لكن لما نشغله هيضرب إيرور!",
      "problemCode": "let studentName = \"Mostafa\";\nconst finalScore = 85;\nfinalScore = finalScore + 5;\nconsole.log(studentName + \" scored \" + finalScore);\nconsole.log(typeof finalScore);",
      "bugLineNumber": 3,
      "bugDescription": "محاولة تغيّر قيمة الاسم finalScore بعد ما اتعرّف بـ const.",
      "whyItHappens": "الاسم finalScore مربوط بمرجع ثابت بسبب const، فمينفعش نسندله قيمة جديدة. وبما إن قيمته هنا رقم، محاولة تغييرها في السطر الثالث هتعمل TypeError. بس const مش معناها إن محتوى الـ object أو الـ array ممنوع يتغير.",
      "fixedCode": "let studentName = \"Mostafa\";\nlet finalScore = 85; // استخدمنا let عشان الدرجة بتتغير\nfinalScore = finalScore + 5;\nconsole.log(studentName + \" scored \" + finalScore);\nconsole.log(typeof finalScore);",
      "expectedCorrectOutput": "Mostafa scored 90\nnumber",
      "hints": [
        "بص على السطر التاني: ينفع نغيّر قيمة finalScore بعد ما اتعرّف بـ const؟",
        "هل القيمة دي ثابتة ولا هتتغير في السطر التالت؟",
        "غيّر const إلى let علشان تسمح بتعديل القيمة."
      ]
    },
    "chapters": [
      {
        "id": 1,
        "partId": 1,
        "partTitle": "الجزء الأول: المتغيرات والأنواع",
        "title": "الفصل 1: مقدمة",
        "subtitle": "يعني إيه برمجة؟ وأدواتنا الـ Console والمحرر",
        "summaryPoints": [
          "البرنامج شوية تعليمات الكمبيوتر بينفّذها؛ غالباً بيمشي بترتيب كتابتها، لكن الشروط بتخلّيه يختار مسار، والحلقات بتكرّر أوامر.",
          "بنكتب الكود في محرر الكود (code editor)، وبنشوف النتيجة في الـ Console.",
          "الأمر console.log(\"...\") بيكتب نص في الـ Console.",
          "التعليق (// أو /* */) للبني آدمين بس، والكمبيوتر بيتجاهله تماماً."
        ],
        "contentSections": [],
        "exercises": [],
        "challenge": {
          "id": "ch1-chal",
          "title": "تحدي الفصل 1: بطاقة التعارف",
          "prompt": "اكتب كود يطبع اسمك في سطر، وبلدك في سطر تاني، وهوايتك في سطر تالت، مع وضع تعليق باسمك في أول الكود.",
          "hint": "استخدم console.log ثلاث مرات مع // في أول سطر للتعليق.",
          "initialCode": "// اكتب تعليقاً وأوامر الطباعة console.log هنا بنفسك...\n",
          "solutionCode": "// كود تعريفي\nconsole.log(\"اسمي: أحمد\");\nconsole.log(\"بلدي: مصر\");\nconsole.log(\"هوايتي: البرمجة\");"
        },
        "quiz": [
          {
            "id": "ch1-q1",
            "question": "لو كتبت في الكود الأمر Console.log بحرف C كبير.. إيه اللي هيحصل بالظبط؟",
            "codeSnippet": "Console.log(\"أهلاً يا مبرمج\");",
            "options": [
              {
                "id": "a",
                "text": "هيشتغل تمام ويطبع \"أهلاً يا مبرمج\"",
                "isCorrect": false,
                "explanation": "لغة JavaScript بتفرّق بدقة بين الحرف الكبير والصغير (Case Sensitive)، فلازم نكتب console بحرف c صغير."
              },
              {
                "id": "b",
                "text": "الكمبيوتر هيعترض ويطلع خطأ ReferenceError: Console is not defined",
                "isCorrect": true,
                "explanation": "إجابة عبقرية! 👏 الكمبيوتر ميعرفش Console بحرف كبير، فبيطلع خطأ إن الكلمة دي غير معرّفة."
              },
              {
                "id": "c",
                "text": "هيطبع النص بحروف كبيرة كابيتال",
                "isCorrect": false,
                "explanation": "أوامر الطباعة وظيفتها التنفيذ، وليست مسؤولة عن تعديل حالة الحروف."
              }
            ]
          },
          {
            "id": "ch1-q2",
            "question": "إيه اللي هيطبع في الـ Console لما نشغّل الكود ده؟",
            "codeSnippet": "console.log(\"السطر الأول\");\n// console.log(\"السطر الثاني\");\nconsole.log(\"السطر الثالث\");",
            "options": [
              {
                "id": "a",
                "text": "السطر الأول ثم السطر الثالث فقط",
                "isCorrect": true,
                "explanation": "عاش يا بطل! 🎯 علامة // حوّلت السطر الثاني لتعليق، فالكمبيوتر تجاهله تماماً ولم يطبعه."
              },
              {
                "id": "b",
                "text": "الـ 3 أسطر هيتطبعوا كلهم بالترتيب",
                "isCorrect": false,
                "explanation": "السطر الثاني قبله // يعني تعليق (Comment)، والكمبيوتر بيتجاهل التعليقات تماماً."
              },
              {
                "id": "c",
                "text": "هيحصل خطأ في السطر الثاني",
                "isCorrect": false,
                "explanation": "التعليقات مش بتعمل أي خطأ لأن المفسر بيتخطاها كأنها مش موجودة."
              }
            ]
          }
        ]
      },
      {
        "id": 2,
        "partId": 1,
        "partTitle": "الجزء الأول: المتغيرات والأنواع",
        "title": "الفصل 2: الحسابات والنصوص",
        "subtitle": "العمليات الرياضية، باقي القسمة (%)، ودمج النصوص",
        "summaryPoints": [
          "console.log بتكتب النصوص والأرقام، وبتقبل أكتر من قيمة مفصولة بفاصلة.",
          "العوامل + - * / شغّالة بأولوية الرياضة، والأقواس بتغيّر الترتيب.",
          "العامل % بيدّي باقي القسمة، والباقي صفر معناه قسمة تامة ورقم زوجي.",
          "+ بين نصين بيلزّقهم (دمج نصوص)، وبين رقمين بيجمعهم."
        ],
        "contentSections": [],
        "exercises": [],
        "challenge": {
          "id": "ch2-chal",
          "title": "وريني شطارتك 🧠: عملية ذكية",
          "prompt": "اكتب أمر console.log واحد يطبع بالظبط: \"6 * 7 = 42\" بس من غير ما تكتب 42 بإيدك! خلّي الكمبيوتر هو اللي يحسبها.",
          "hint": "افصل بين النص \"6 * 7 =\" وحاصل الضرب (6 * 7) بفاصلة أو بعلامة +.",
          "initialCode": "// اكتب أمر console.log المطلوب هنا بنفسك...\n",
          "solutionCode": "console.log(\"6 * 7 =\", 6 * 7);"
        },
        "quiz": [
          {
            "id": "ch2-q1",
            "question": "يا ترى الكود ده هيطبع إيه في الشاشة؟",
            "codeSnippet": "console.log(\"5\" + 2);",
            "options": [
              {
                "id": "a",
                "text": "7",
                "isCorrect": false,
                "explanation": "خد بالك! الرقم 5 محطوط بين علامتي تنصيص يعني نص (String)، وعلامة + مع النصوص بتعمل دمج مش جمع!"
              },
              {
                "id": "b",
                "text": "52",
                "isCorrect": true,
                "explanation": "برافو عليك! 🎯 علامة + لما تلاقي نص بتلزق القيمتين جنب بعض وتطلع النص \"52\"."
              },
              {
                "id": "c",
                "text": "Error",
                "isCorrect": false,
                "explanation": "جافاسكريبت لغة مرنة، مش بتطلع خطأ هنا بل بتحوّل الرقم 2 لنص وتدمجه مع \"5\"."
              },
              {
                "id": "d",
                "text": "NaN",
                "isCorrect": false,
                "explanation": "NaN بيظهر في عمليات حسابية فاشلة (زي طرح نص من رقم)، لكن الجمع + بيعمل دمج نصوص."
              }
            ]
          },
          {
            "id": "ch2-q2",
            "question": "لو قسمنا 10 على 3، باقي القسمة (10 % 3) هيكون كام؟",
            "codeSnippet": "console.log(10 % 3);",
            "options": [
              {
                "id": "a",
                "text": "1",
                "isCorrect": true,
                "explanation": "عاش يا بطل! 👏 3 * 3 = 9، ويتبقى 1 للوصول لـ 10، فباقي القسمة هو 1."
              },
              {
                "id": "b",
                "text": "3",
                "isCorrect": false,
                "explanation": "3 هو ناتج القسمة الصحيحة، مش باقي القسمة!"
              },
              {
                "id": "c",
                "text": "0",
                "isCorrect": false,
                "explanation": "لو كان الباقي 0 ده معناه إن 10 تقبل القسمة على 3 تماماً، وده مش حاصل."
              }
            ]
          }
        ]
      },
      {
        "id": 3,
        "partId": 1,
        "partTitle": "الجزء الأول: المتغيرات والأنواع",
        "title": "الفصل 3: المتغيرات",
        "subtitle": "الصندوق الكرتون (let) والخزنة الحديد (const)",
        "summaryPoints": [
          "المتغيّر صندوق عليه اسم وجواه قيمة محفوظة في الذاكرة.",
          "let بيسمح إننا نسند قيمة جديدة للاسم لما نحتاج.",
          "const بتثبّت ربط الاسم بالقيمة؛ بس ده مش معناه إن محتوى الـ object أو الـ array نفسه مبقاش قابل للتغيير. هنشوف الفرق ده لما ندرس المصفوفات والكائنات.",
          "العلامة = معناها \"حط\" (إسناد Assign) وليست التساوي الرياضي.",
          "بنسمي المتغيرات بأسلوب camelCase ومبنستخدمش الكلمة القديمة var."
        ],
        "contentSections": [],
        "exercises": [],
        "challenge": {
          "id": "ch3-chal",
          "title": "وريني شطارتك 🧠: حساب مساحة المستطيل",
          "prompt": "اكتب برنامج لمستطيل عرضه 8 وارتفاعه 5، بمتغيّر للعرض وآخر للارتفاع، واطبع مساحته بالشكل: \"المساحة: 40\". بعدين غيّر العرض لـ 10 واطبع المساحة تاني.",
          "hint": "فكر: مين فيهم هيتغير ويحتاج let ومين ممكن يكون const؟",
          "initialCode": "// اكتب كود حساب مساحة المستطيل وتغيير العرض هنا بنفسك...\n",
          "solutionCode": "let width = 8;\nconst height = 5;\nconsole.log(\"المساحة: \" + (width * height));\nwidth = 10;\nconsole.log(\"المساحة: \" + (width * height));"
        },
        "quiz": [
          {
            "id": "ch3-q1",
            "question": "إيه الفرق الجوهري في جافاسكريبت بين let و const؟",
            "options": [
              {
                "id": "a",
                "text": "const بتمنع إننا نسند قيمة جديدة للاسم، وlet بتسمح بده",
                "isCorrect": true,
                "explanation": "إجابة صح! 🎯 const بيثبّت ربط الاسم بالقيمة، وlet بتسمح إننا نسندله قيمة تانية."
              },
              {
                "id": "b",
                "text": "let مخصصة للأرقام فقط و const للنصوص فقط",
                "isCorrect": false,
                "explanation": "الاتنين يقدروا يشيلوا أي نوع بيانات سواء أرقام أو نصوص أو غيرها."
              },
              {
                "id": "c",
                "text": "مفيش أي فرق بينهم، الاتنين زي بعض بالظبط",
                "isCorrect": false,
                "explanation": "الفرق الأساسي إن let بتسمح بإسناد قيمة جديدة، وconst لأ؛ إنما نوع البيانات مش هو الفرق."
              }
            ]
          },
          {
            "id": "ch3-q2",
            "question": "توقّع إيه اللي هيحصل لما نشغّل الكود ده:",
            "codeSnippet": "const pi = 3.14;\npi = 3.14159;\nconsole.log(pi);",
            "options": [
              {
                "id": "a",
                "text": "هيطبع القيمة الجديدة 3.14159 عادي",
                "isCorrect": false,
                "explanation": "المتغير pi متعرف بـ const، و const تمنع إعادة تعيين القيمة!"
              },
              {
                "id": "b",
                "text": "الكمبيوتر هيطلع خطأ TypeError: Assignment to constant variable",
                "isCorrect": true,
                "explanation": "ممتاز! 👏 حاولت تسند قيمة جديدة لاسم اتعرّف بـ const."
              },
              {
                "id": "c",
                "text": "هيطبع القيمة القديمة 3.14 ويتجاهل السطر التاني",
                "isCorrect": false,
                "explanation": "جافاسكريبت بتوقف البرنامج فوراً وتطلع خطأ ومش بتكمل."
              }
            ]
          }
        ]
      },
      {
        "id": 4,
        "partId": 1,
        "partTitle": "الجزء الأول: المتغيرات والأنواع",
        "title": "الفصل 4: الأنواع (Data Types)",
        "subtitle": "النصوص، الأرقام، الصح والغلط (Boolean)، والتحويلات",
        "summaryPoints": [
          "الأنواع الأساسية: string (نص)، number (أرقام)، boolean (صح أو غلط).",
          "typeof بتعرفنا نوع أي قيمة.",
          "== بتقارن القيمة بس، و=== بتقارن القيمة والنوع معاً (المساواة الصارمة).",
          "نستخدم دايماً === و!== ونبتعد تماماً عن == و!=.",
          "الدوال Number() و String() للتحويل بين الأنواع، وNaN تعني Not a Number."
        ],
        "contentSections": [],
        "exercises": [],
        "challenge": {
          "id": "ch4-chal",
          "title": "وريني شطارتك 🧠: فاتورة التوصيل",
          "prompt": "عندك متغير `const price = \"150\";` وسعر التوصيل 20 كـ `number`. اكتب كود يحوّل `price` لرقم ويجمعه مع التوصيل ويطبع الإجمالي `(170)` وليس `(\"15020\")`.",
          "hint": "استخدم دالة `Number(price)` قبل الجمع.",
          "initialCode": "// اكتب الكود لتحويل price وجمع التوصيل وطباعة الإجمالي هنا بنفسك...\n",
          "solutionCode": "const price = \"150\";\nconst delivery = 20;\nconst total = Number(price) + delivery;\nconsole.log(\"الإجمالي: \" + total);"
        },
        "quiz": [
          {
            "id": "ch4-q1",
            "question": "يا ترى typeof NaN هيطلع نوعه إيه بالظبط في جافاسكريبت؟",
            "codeSnippet": "console.log(typeof NaN);",
            "options": [
              {
                "id": "a",
                "text": "\"number\"",
                "isCorrect": true,
                "explanation": "صح جداً! 🎉 مفارقة شهيرة في جافاسكريبت: رغم إن NaN اختصار Not a Number إلا إن تصنيفه البرمجي رقم number فاشل."
              },
              {
                "id": "b",
                "text": "\"undefined\"",
                "isCorrect": false,
                "explanation": "undefined يظهر لما المتغير ميكونش واخد أي قيمة، مش مع NaN."
              },
              {
                "id": "c",
                "text": "\"string\"",
                "isCorrect": false,
                "explanation": "NaN مش نص ولا محطوط بين علامات تنصيص."
              }
            ]
          },
          {
            "id": "ch4-q2",
            "question": "إيه الفرق بين المقارنة العادية (==) والمقارنة الصارمة (===)؟",
            "options": [
              {
                "id": "a",
                "text": "=== تقارن القيمة والنوع معاً، بينما == تقارن القيمة وتتجاهل النوع",
                "isCorrect": true,
                "explanation": "إجابة عبقرية! 👏 عشان كده 10 == \"10\" بتدي true، بينما 10 === \"10\" بتدي false."
              },
              {
                "id": "b",
                "text": "== للأرقام فقط و === للنصوص فقط",
                "isCorrect": false,
                "explanation": "الاتنين بيقارنوا أي نوع من البيانات."
              },
              {
                "id": "c",
                "text": "=== بتعدل قيمة المتغير الأول",
                "isCorrect": false,
                "explanation": "المقارنات لا تعدل القيم إطلاقاً، هي بس بتفحص وترجع true أو false."
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": 2,
    "title": "الجزء الثاني: القرارات (if وswitch)",
    "subtitle": "المفترق اللي الكمبيوتر بيقرر عنده",
    "description": "كيف يتخذ البرنامج قراراته الذكية بناءً على الشروط، المعاملات المنطقية (&& و|| و!)، وجملة switch المتعددة.",
    "iconName": "GitFork",
    "bugHunter": {
      "id": "bug-part-2",
      "partId": 2,
      "title": "كويز: switch والشرط المنطقي التائه",
      "context": "الكود ده المفروض يحدد نسبة الخصم لمشتريات بقيمة 300 جنيه، لكن لما نشغله هيطبع \"مفيش خصم\" بالرغم إنها أكثر من 200!",
      "problemCode": "const total = 300;\nswitch (total) {\n  case total >= 500:\n    console.log(\"خصم 20%\");\n  case total >= 200:\n    console.log(\"خصم 10%\");\n    break;\n  default:\n    console.log(\"مفيش خصم\");\n}",
      "bugLineNumber": 3,
      "bugDescription": "وضع شروط علائقية boolean داخل case بينما switch تفحص القيمة 300 مباشرة.",
      "whyItHappens": "في switch (total)، المتغير total قيمته رقمية (300). أما الشروط مثل total >= 500 ترجع boolean (false). المقارنة الصارمة بتفحص هل 300 === false؟ لا! هل 300 === true؟ لا! فيذهب للـ default! بالإضافة لنسيان break في الـ case الأول.",
      "fixedCode": "const total = 300;\nif (total >= 500) {\n  console.log(\"خصم 20%\");\n} else if (total >= 200) {\n  console.log(\"خصم 10%\");\n} else {\n  console.log(\"مفيش خصم\");\n}",
      "expectedCorrectOutput": "خصم 10%",
      "hints": [
        "هل جملة switch مصممة للمقارنات الأكبر والأصغر (> و <) أم للقيم الثابتة المحددة؟",
        "ناتج total >= 200 هو true، فهل 300 تساوي true؟",
        "الحل الصحيح والأنظف لمثل هذه المقارنات هو استخدام if و else if."
      ]
    },
    "chapters": [
      {
        "id": 5,
        "partId": 2,
        "partTitle": "الجزء الثاني: القرارات (if وswitch)",
        "title": "الفصل 5: الشروط (if وelse)",
        "subtitle": "لو كذا يحصل كذا، وغير كده يحصل البديل",
        "summaryPoints": [
          "جملة if بتخلي الكمبيوتر يفكّر ويقرر: لو الشرط true ينفذ الكود، لو false يتجاهله.",
          "جملة else بتمثل الخطة البديلة: كود بيتنفذ حصرياً لو شرط if محصلش.",
          "سلسلة else if بتسمح بفحص احتمالات متعددة ورا بعض بالترتيب، وبتقف فور أول شرط صح.",
          "الترتيب من الأضيق للأوسع مهم جداً عشان الشروط متبلعش بعضها."
        ],
        "contentSections": [],
        "exercises": [],
        "challenge": {
          "id": "ch5-chal",
          "title": "وريني شطارتك 🧠: رادار السرعة",
          "prompt": "اكتب كود بمتغير const speed = 95. لو السرعة أكبر من 100 اطبع \"غرامة سرعة\"، لو أكبر من 80 اطبع \"خد بالك\"، غير كده اطبع \"سرعة عادية\".",
          "hint": "رتب الشروط: الأكبر من 100 أولاً ثم الأكبر من 80.",
          "initialCode": "// اكتب كود فحص السرعة باستخدام if و else if هنا بنفسك...\n",
          "solutionCode": "const speed = 95;\nif (speed > 100) {\n  console.log(\"غرامة سرعة\");\n} else if (speed > 80) {\n  console.log(\"خد بالك\");\n} else {\n  console.log(\"سرعة عادية\");\n}"
        },
        "quiz": [
          {
            "id": "ch5-q1",
            "question": "الكود ده هيطبع إيه في الشاشة؟",
            "codeSnippet": "let temp = 25;\nif (temp > 30) {\n  console.log(\"الجو حر\");\n} else {\n  console.log(\"الجو لطيف\");\n}",
            "options": [
              {
                "id": "a",
                "text": "الجو لطيف",
                "isCorrect": true,
                "explanation": "برافو عليك! 🎯 لأن الشرط 25 > 30 نتيجته false، فالكمبيوتر هرب للبديل وطبع اللي جوه else."
              },
              {
                "id": "b",
                "text": "الجو حر",
                "isCorrect": false,
                "explanation": "شرط if لم يتحقق لأن 25 ليست أكبر من 30."
              },
              {
                "id": "c",
                "text": "الجو حر والجو لطيف معاً",
                "isCorrect": false,
                "explanation": "الكمبيوتر بينفذ مسار واحد بس: يا if يا else، مستحيل الاتنين مع بعض."
              }
            ]
          },
          {
            "id": "ch5-q2",
            "question": "لو عندنا كذا else if في الكود، الكمبيوتر بيتعامل معاهم إزاي؟",
            "options": [
              {
                "id": "a",
                "text": "بيفحصهم بالترتيب، وأول شرط يتحقق بينفذه ويتجاهل باقي الشروط تماماً",
                "isCorrect": true,
                "explanation": "صح جداً! 👏 بمجرد ما يلاقي أول شرط صحيح، بينفذ كتلته ويخرج بره بنية if بالكامل."
              },
              {
                "id": "b",
                "text": "بينفذ كل الشروط حتى لو اتحقق أول واحد",
                "isCorrect": false,
                "explanation": "ده بيحصل لو كانوا جمل if منفصلة، لكن سلسلة if..else if بتقف عند أول شرط صحيح."
              },
              {
                "id": "c",
                "text": "بيختار شرط عشوائي وينفذه",
                "isCorrect": false,
                "explanation": "الكمبيوتر ينفذ الأوامر بمنطق وتتابع صارم من الأعلى للأسفل."
              }
            ]
          }
        ]
      },
      {
        "id": 6,
        "partId": 2,
        "partTitle": "الجزء الثاني: القرارات (if وswitch)",
        "title": "الفصل 6: المقارنات والمعاملات المنطقية",
        "subtitle": "بوابة القطار: AND (&&)، OR (||)، و NOT (!)",
        "summaryPoints": [
          "أدوات المقارنة (>, <, >=, <=, ===, !==) بترجع قيمة boolean: true أو false.",
          "المعامل && (AND) طماع وصارم: لازم كل الشروط تكون true عشان يديك true.",
          "المعامل || (OR) طيب وجدع: بيكفيه شرط واحد بس يكون true عشان يديك true.",
          "المعامل ! (NOT) بيقلب الحقيقة: بيخلي الـ true تبقى false والعكس."
        ],
        "contentSections": [],
        "exercises": [],
        "challenge": {
          "id": "ch6-chal",
          "title": "وريني شطارتك 🧠: قطار الملاهي",
          "prompt": "اكتب شرطاً واحداً يطبع \"تقدر تركب اللعبة\" فقط إذا كان الطول height >= 140 والعمر age >= 10.",
          "hint": "استخدم علامة && لربط الشرطين معاً.",
          "initialCode": "// اكتب شرط فحص الطول height والعمر age هنا بنفسك...\n",
          "solutionCode": "const height = 150;\nconst age = 12;\nif (height >= 140 && age >= 10) {\n  console.log(\"تقدر تركب اللعبة\");\n}"
        },
        "quiz": [
          {
            "id": "ch6-q1",
            "question": "المعامل المنطقي && (AND) بيرجع true في أنهي حالة بالظبط؟",
            "options": [
              {
                "id": "a",
                "text": "لما كل الشروط اللي حواليه تكون صحيحة (true) معاً",
                "isCorrect": true,
                "explanation": "صح جداً! 👏 علامة && طمّاعة.. لازم كل الشروط تكون true عشان تفتحلك الباب وتديك true."
              },
              {
                "id": "b",
                "text": "لو شرط واحد بس كان صحيح والتاني غلط",
                "isCorrect": false,
                "explanation": "لو شرط واحد بس صح ده دور المعامل || (OR) مش &&."
              },
              {
                "id": "c",
                "text": "لما كل الشروط تكون false",
                "isCorrect": false,
                "explanation": "لو الشروط كلها غلط النتيجة أكيد هتبقى false."
              }
            ]
          },
          {
            "id": "ch6-q2",
            "question": "توقّع ناتج الكود ده هيطبع إيه:",
            "codeSnippet": "const hasWifi = false;\nconst hasData = true;\nconsole.log(hasWifi || hasData);",
            "options": [
              {
                "id": "a",
                "text": "true",
                "isCorrect": true,
                "explanation": "برافو عليك! 🎯 علامة || (OR) طيبة، بيكفيها إن طرف واحد بس يكون true عشان ترجعلك true."
              },
              {
                "id": "b",
                "text": "false",
                "isCorrect": false,
                "explanation": "كانت هتبقى false لو كان الطرفين الاتنين false."
              },
              {
                "id": "c",
                "text": "Error",
                "isCorrect": false,
                "explanation": "المعاملات المنطقية بترجع boolean عادي جداً ومفيهاش أي خطأ."
              }
            ]
          }
        ]
      },
      {
        "id": 7,
        "partId": 2,
        "partTitle": "الجزء الثاني: القرارات (if وswitch)",
        "title": "الفصل 7: جملة switch",
        "subtitle": "قائمة الاختيارات المنظمة، وحذارِ من الـ fall-through!",
        "summaryPoints": [
          "جملة switch بديل أنيق ومنظم لسلسلة if..else if لما بنقارن متغير واحد بقيم ثابتة ومحددة.",
          "كل حالة بتبدأ بكلمة case بعدها القيمة ونقطتين (:).",
          "كلمة break إجبارية في نهاية كل حالة لتوقيف التنفيذ ومنع التسريب (Fall-through).",
          "كلمة default بتشتغل كخطة بديلة لو مفيش أي حالة من الحالات تطابقت."
        ],
        "contentSections": [],
        "exercises": [],
        "challenge": {
          "id": "ch7-chal",
          "title": "وريني شطارتك 🧠: محول الأشهر",
          "prompt": "اكتب جملة switch لمتغير const month = 3؛ يطبع: 1 = \"يناير\"، 2 = \"فبراير\"، 3 = \"مارس\"، وغير ذلك \"شهر مش معروف\". لا تنسَ break!",
          "hint": "ضع break بعد كل شهر، و default في النهاية.",
          "initialCode": "// اكتب جملة switch لفحص رقم الشهر month هنا بنفسك...\n",
          "solutionCode": "const month = 3;\nswitch (month) {\n  case 1:\n    console.log(\"يناير\");\n    break;\n  case 2:\n    console.log(\"فبراير\");\n    break;\n  case 3:\n    console.log(\"مارس\");\n    break;\n  default:\n    console.log(\"شهر مش معروف\");\n}"
        },
        "quiz": [
          {
            "id": "ch7-q1",
            "question": "لو نسينا نحط كلمة break; جوه واحدة من الـ cases في switch.. إيه اللي هيحصل؟",
            "options": [
              {
                "id": "a",
                "text": "الكمبيوتر هيستمر وينفذ الحالات اللي بعدها رغماً عنها (Fall-through)",
                "isCorrect": true,
                "explanation": "ممتاز! 💡 ده سلوك مشهور اسمه fall-through، عشان كده بنحط break عشان نقفل الباب ونخرج."
              },
              {
                "id": "b",
                "text": "الكمبيوتر هيطلع خطأ SyntaxError ومش هيشتغل",
                "isCorrect": false,
                "explanation": "مش هيطلع خطأ، جافاسكريبت بتسمح بكده برمجياً، بس النتيجة هتكون غير متوقعة."
              },
              {
                "id": "c",
                "text": "هيقفل البرنامج فوراً",
                "isCorrect": false,
                "explanation": "بالعكس، ده هيفضل شغال وينفذ الأسطر اللي وراها."
              }
            ]
          },
          {
            "id": "ch7-q2",
            "question": "إيه فايدة كتلة default جوه جملة switch؟",
            "options": [
              {
                "id": "a",
                "text": "تتنفذ لو مفيش أي case من الحالات السابقة تطابقت مع القيمة",
                "isCorrect": true,
                "explanation": "عاش يا بطل! 👏 default بتلعب نفس دور else الأخيرة في جمل if."
              },
              {
                "id": "b",
                "text": "تتنفذ دائماً في أول البرنامج قبل الحالات",
                "isCorrect": false,
                "explanation": "لا، هي مسار بديل للحالات التي لم تتطابق فقط."
              },
              {
                "id": "c",
                "text": "إجبارية ولا يمكن الاستغناء عنها في switch",
                "isCorrect": false,
                "explanation": "هي اختيارية ولكنها ممارسة برمجية ممتازة للتعامل مع أي مدخل غير متوقع."
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": 3,
    "title": "الجزء الثالث: التكرار (الحلقات)",
    "subtitle": "السير الدوّار اللي بيكرر الشغلانة",
    "description": "توفير المجهود وتكرار العمليات عبر حلقة for وحلقة while وتجنب خطر الحلقات اللانهائية.",
    "iconName": "Repeat",
    "bugHunter": {
      "id": "bug-part-3",
      "partId": 3,
      "title": "كويز: فخ الحلقة اللانهائية",
      "context": "الكود ده المفروض يطبع الأرقام الزوجية من 1 لـ 10، لكن لما بتشغله المتصفح بيهنج ومش بيوقف خالص!",
      "problemCode": "let n = 1;\nwhile (n <= 10) {\n  if (n % 2 === 0) {\n    console.log(n);\n  }\n}",
      "bugLineNumber": 2,
      "bugDescription": "نسيان زيادة عداد الحلقة n++ في كل دورة، مما يجعل n تساوي 1 دائماً.",
      "whyItHappens": "العداد n بدأ بقيمة 1، والشرط n <= 10 يظل صحيحاً دائماً لأن قيمة n لا تزيد أبداً داخل الحلقة! بالتالي تدور الحلقة للأبد (Infinite Loop) وتستهلك المعالج حتى يتجمد المتصفح.",
      "fixedCode": "let n = 1;\nwhile (n <= 10) {\n  if (n % 2 === 0) {\n    console.log(n);\n  }\n  n++; // زيادة العداد في كل دورة\n}",
      "expectedCorrectOutput": "2\n4\n6\n8\n10",
      "hints": [
        "هل قيمة n تتغير في كل لفة داخل حلقة while؟",
        "إذا لم تزد n، هل سيصبح شرط (n <= 10) خطأ في أي لحظة؟",
        "أضف السطر n++; في نهاية الحلقة."
      ]
    },
    "chapters": [
      {
        "id": 8,
        "partId": 3,
        "partTitle": "الجزء الثالث: التكرار (الحلقات)",
        "title": "الفصل 8: حلقة for",
        "subtitle": "العداد المنظم: بداية، شرط، وزيادة في سطر واحد",
        "summaryPoints": [
          "الحلقات (Loops) بتوفر كتابة نفس الكود عشرات المرات وتخليه يدور بعداد آلي.",
          "حلقة for بتتكون من 3 أقسام بين قوسين: البداية (Initialization)، الشرط (Condition)، والخطوة (Update).",
          "المتغير i هو أشهر عداد في تاريخ البرمجة (اختصار لـ index أو iterator).",
          "نقدر نعد تصاعدياً (i++)، تنازلياً (i--)، أو بقفزات مخصصة (i += 2)."
        ],
        "contentSections": [],
        "exercises": [],
        "challenge": {
          "id": "ch8-chal",
          "title": "وريني شطارتك 🧠: جدول الضرب المصغر",
          "prompt": "اكتب حلقة for تبدأ من i = 1 وتتوقف عند 5؛ في كل دورة تطبع حاصل ضرب i في 3 بصيغة: \"3 * i = result\".",
          "hint": "استخدم console.log(\"3 * \" + i + \" = \" + (i * 3)); داخل الحلقة.",
          "initialCode": "// اكتب حلقة for لطباعة مضاعفات الرقم 3 حتى 5 هنا بنفسك...\n",
          "solutionCode": "for (let i = 1; i <= 5; i++) {\n  console.log(\"3 * \" + i + \" = \" + (i * 3));\n}"
        },
        "quiz": [
          {
            "id": "ch8-q1",
            "question": "الحلقة دي هتتنفذ كام مرة بالظبط؟",
            "codeSnippet": "for (let i = 0; i < 4; i++) {\n  console.log(i);\n}",
            "options": [
              {
                "id": "a",
                "text": "4 مرات (عند i = 0 و 1 و 2 و 3)",
                "isCorrect": true,
                "explanation": "صح جداً! 👏 لأننا بدأنا من الصفر، والأرقام الأقل من 4 هي أربعة أرقام بالظبط."
              },
              {
                "id": "b",
                "text": "5 مرات",
                "isCorrect": false,
                "explanation": "كانت هتبقى 5 مرات لو كانت علامة المقارنة <= أصغر من أو يساوي."
              },
              {
                "id": "c",
                "text": "3 مرات",
                "isCorrect": false,
                "explanation": "رقم 0 محسوب معانا كأول لفة."
              }
            ]
          },
          {
            "id": "ch8-q2",
            "question": "إيه وظيفة الجزء التالت في جملة for (زي i++)؟",
            "options": [
              {
                "id": "a",
                "text": "تعديل قيمة العداد في نهاية كل دورة عشان نقرب لشرط النهاية",
                "isCorrect": true,
                "explanation": "ممتاز! 🎯 خطوة التحديث هي اللي بتضمن إن الحلقة تتقدم ومتفضلش واقفة في مكانها."
              },
              {
                "id": "b",
                "text": "تحديد القيمة الابتدائية",
                "isCorrect": false,
                "explanation": "القيمة الابتدائية بتتحدد في الجزء الأول (Initialization)."
              },
              {
                "id": "c",
                "text": "طباعة القيمة في الشاشة",
                "isCorrect": false,
                "explanation": "الطباعة بتتم بأمر console.log وليس عبر العداد."
              }
            ]
          }
        ]
      },
      {
        "id": 9,
        "partId": 3,
        "partTitle": "الجزء الثالث: التكرار (الحلقات)",
        "title": "الفصل 9: حلقة while",
        "subtitle": "كرر الشغلانة \"طول ما\" الشرط متحقق",
        "summaryPoints": [
          "حلقة while بتلف \"طول ما\" الشرط صحيح، ومثالية لما نكون مش عارفين عدد المرات مقدماً.",
          "العداد بيتجهز قبل الحلقة، وتعديل قيمته لازم يتكتب بإيدك جوه جسم الحلقة.",
          "نسيان تحديث المتغير بيسبب أخطر مشكلة: الحلقة اللانهائية وتجميد الصفحة.",
          "حلقة do...while الشقيقة بتضمن تنفيذ الكود مرة واحدة على الأقل قبل فحص الشرط."
        ],
        "contentSections": [],
        "exercises": [],
        "challenge": {
          "id": "ch9-chal",
          "title": "وريني شطارتك 🧠: عداد العملات الزوجية",
          "prompt": "اكتب حلقة while تبدأ من let coins = 5؛ وكل دورة تزود coins بواحد وتطبع بجانبها \"زوجي\" أو \"فردي\" حتى تصل لـ 8.",
          "hint": "افحص (coins % 2 === 0) داخل الحلقة ولا تنسَ coins++.",
          "initialCode": "// اكتب حلقة while من coins = 5 حتى 8 مع فحص الزوجي والفردي هنا بنفسك...\n",
          "solutionCode": "let coins = 5;\nwhile (coins <= 8) {\n  if (coins % 2 === 0) {\n    console.log(coins + \" زوجي\");\n  } else {\n    console.log(coins + \" فردي\");\n  }\n  coins++;\n}"
        },
        "quiz": [
          {
            "id": "ch9-q1",
            "question": "إيه اللي ممكن يسبب حلقة تكرار لانهائية (Infinite Loop) في while؟",
            "options": [
              {
                "id": "a",
                "text": "لو نسينا نعدل المتغير جوه الحلقة والشرط فضل دائماً true",
                "isCorrect": true,
                "explanation": "برافو عليك! ⚠️ لو الشرط مبيوصلش لـ false أبداً، الكمبيوتر هيفضل يلف ويهنج المتصفح."
              },
              {
                "id": "b",
                "text": "لو بدأنا العداد من الصفر",
                "isCorrect": false,
                "explanation": "البدء من الصفر عادي جداً ومش هو سبب التكرار اللانهائي."
              },
              {
                "id": "c",
                "text": "لو استخدمنا console.log جواها",
                "isCorrect": false,
                "explanation": "أوامر الطباعة ملهاش علاقة بشروط استمرار الحلقات."
              }
            ]
          },
          {
            "id": "ch9-q2",
            "question": "إيه الفرق الرئيسي بين while و do..while؟",
            "options": [
              {
                "id": "a",
                "text": "حلقة do..while مضمون تتنفذ مرة واحدة على الأقل حتى لو الشرط غلط من الأول",
                "isCorrect": true,
                "explanation": "ممتاز! 💡 لأن do بتنفذ الكود الأول وبعدين تفحص الشرط في الآخر."
              },
              {
                "id": "b",
                "text": "حلقة while أسرع في التنفيذ دائماً",
                "isCorrect": false,
                "explanation": "السرعة متقاربة والفرق في منطق الفحص (قبل التكرار أو بعده)."
              },
              {
                "id": "c",
                "text": "do..while مخصصة للنصوص فقط",
                "isCorrect": false,
                "explanation": "الحلقات بتتعامل مع أي منطق برمجي."
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": 4,
    "title": "الجزء الرابع: الدوال",
    "subtitle": "الخلّاط اللي بنستخدمه كل مرة",
    "description": "تنظيم الكود وإعادة استخدامه عبر الدوال، المدخلات (Parameters)، القيمة المرتجعة (return)، والنطاق (Scope)، ومشروع لعبة التخمين.",
    "iconName": "Cpu",
    "bugHunter": {
      "id": "bug-part-4",
      "partId": 4,
      "title": "كويز: لغز الخصم التائه (الطباعة أم الإرجاع؟)",
      "context": "الكود ده المفروض يحسب سعر المنتج بعد خصم 50% ويفحص لو كان العرض قوياً، لكنه لا يستخدم ناتج الحساب في الشرط!",
      "problemCode": "function applyDiscount(price, discountPercent) {\n  const discountAmount = price * discountPercent / 100;\n  console.log(price - discountAmount);\n}\n\nconst finalPrice = applyDiscount(200, 50);\n\nif (finalPrice < 150) {\n  console.log(\"عرض قوي\");\n} else {\n  console.log(\"عرض عادي\");\n}",
      "bugLineNumber": 3,
      "bugDescription": "الدالة قامت بطباعة السعر بـ console.log بدلاً من إرجاعه بـ return، فكانت قيمة finalPrice هي undefined.",
      "whyItHappens": "الدالة التي لا تحتوي على كلمة return ترجع تلقائياً undefined. المتغير finalPrice استقبل undefined، ومقارنة undefined < 150 تنتج false، فيذهب الكود لـ else دائماً!",
      "fixedCode": "function applyDiscount(price, discountPercent) {\n  const discountAmount = price * discountPercent / 100;\n  return price - discountAmount; // رجّع القيمة للمستدعي!\n}\n\nconst finalPrice = applyDiscount(200, 50); // نفس المدخلات قبل الإصلاح\n\nif (finalPrice < 150) {\n  console.log(\"عرض قوي\");\n} else {\n  console.log(\"عرض عادي\");\n}",
      "expectedCorrectOutput": "عرض قوي",
      "hints": [
        "ما هي قيمة المتغير finalPrice بعد استدعاء الدالة؟",
        "هل الدالة تستخدم return أم فقط console.log؟",
        "استبدل console.log داخل الدالة بكلمة return."
      ]
    },
    "chapters": [
      {
        "id": 10,
        "partId": 4,
        "partTitle": "الجزء الرابع: الدوال",
        "title": "الفصل 10: الدوال الجاهزة (Math)",
        "subtitle": "التقريب والأرقام العشوائية مع Math",
        "summaryPoints": [
          "كائن Math يحتوي على دوال رياضية جاهزة بنيت داخل جافاسكريبت لتوفر علينا الحسابات المعقدة.",
          "دوال التقريب: Math.round للأقرب، و Math.floor للأرض (الأسفل)، و Math.ceil للسقف (الأعلى).",
          "دالتا Math.max و Math.min للعثور على أكبر وأصغر قيمة فوراً.",
          "الدالة Math.random() بتولد رقم عشوائي بين 0 وأقل من 1، وبمعادلة بسيطة بنحولها لحجر نرد أو أرقام يانصيب."
        ],
        "contentSections": [],
        "exercises": [],
        "challenge": {
          "id": "ch10-chal",
          "title": "وريني شطارتك 🧠: مولد العملة المعدنية (ملك أو كتابة)",
          "prompt": "اكتب كود يولد رقماً عشوائياً بين 1 و 2؛ إذا كان 1 اطبع \"ملك\"، وإذا كان 2 اطبع \"كتابة\".",
          "hint": "استخدم Math.floor(Math.random() * 2) + 1 ثم جملة if/else.",
          "initialCode": "// اكتب كود رمي العملة المعدنية (ملك أو كتابة) هنا بنفسك...\n",
          "solutionCode": "const coin = Math.floor(Math.random() * 2) + 1;\nif (coin === 1) {\n  console.log(\"ملك\");\n} else {\n  console.log(\"كتابة\");\n}"
        },
        "quiz": [
          {
            "id": "ch10-q1",
            "question": "الدالة Math.floor(8.99) هترجع إيه بالظبط؟",
            "options": [
              {
                "id": "a",
                "text": "8",
                "isCorrect": true,
                "explanation": "صح جداً! 👏 Math.floor بتنزل للأرض وتقطع الكسور تماماً بدون ما تبص لقيمتها."
              },
              {
                "id": "b",
                "text": "9",
                "isCorrect": false,
                "explanation": "دي وظيفة Math.round أو Math.ceil، مش floor."
              },
              {
                "id": "c",
                "text": "8.9",
                "isCorrect": false,
                "explanation": "الدالة بترجع أرقام صحيحة فقط بدون كسور."
              }
            ]
          },
          {
            "id": "ch10-q2",
            "question": "عشان نولد رقم عشوائي بين 1 و 6 (زي حجر النرد)، بنكتب إيه؟",
            "options": [
              {
                "id": "a",
                "text": "Math.floor(Math.random() * 6) + 1",
                "isCorrect": true,
                "explanation": "برافو عليك! 🎲 بنضرب في 6 ونقطع الكسر بـ floor ونزود 1 عشان نبدأ من 1 مش من 0."
              },
              {
                "id": "b",
                "text": "Math.random() * 6",
                "isCorrect": false,
                "explanation": "ده هيرجع رقم عشري بكسور مش رقم صحيح."
              },
              {
                "id": "c",
                "text": "Math.round(Math.random())",
                "isCorrect": false,
                "explanation": "ده هيرجع يا 0 يا 1 بس."
              }
            ]
          }
        ]
      },
      {
        "id": 11,
        "partId": 4,
        "partTitle": "الجزء الرابع: الدوال",
        "title": "الفصل 11: كتابة دالة (Functions)",
        "subtitle": "الخلّاط السحري: اسم، مدخلات، وتنفيذ",
        "summaryPoints": [
          "الدالة (Function) هي وصفة برمجية بنكتبها مرة واحدة ونستدعيها كل ما نحتاجها بدون تكرار.",
          "بنعلن عن الدالة بكلمة function متبوعة باسمها وأقواس معقوصة { } تحتوي الأوامر.",
          "كتابة الدالة لا تعني تشغيلها؛ لازم نستدعيها بالاسم والأقواس: myFunction().",
          "المعاملات (Parameters) بتسمح للدالة باستقبال بيانات متغيرة في كل تشغيل."
        ],
        "contentSections": [],
        "exercises": [],
        "challenge": {
          "id": "ch11-chal",
          "title": "وريني شطارتك 🧠: دالة مضاعفة الرقم",
          "prompt": "اكتب دالة اسمها doubleNumber تستقبل معاملاً واحداً num وتطبع في الكونسول ضعف الرقم (num * 2). ثم استدعِ الدالة بالرقم 7.",
          "hint": "function doubleNumber(num) { console.log(num * 2); } ثم استدعِ doubleNumber(7);",
          "initialCode": "// اكتب تعريف الدالة واستدعاءها بالرقم 7 هنا بنفسك...\n",
          "solutionCode": "function doubleNumber(num) {\n  console.log(num * 2);\n}\ndoubleNumber(7);"
        },
        "quiz": [
          {
            "id": "ch11-q1",
            "question": "ليه لما نكتب function doWork() { console.log(\"done\"); } مفيش حاجة بتطبع في الشاشة؟",
            "options": [
              {
                "id": "a",
                "text": "لأننا فقط عرّفنا الدالة ولم نستدعها بعد باستخدام doWork()",
                "isCorrect": true,
                "explanation": "صح جداً! 👏 لازم تنادي الدالة بالاسم والأقواس عشان الكمبيوتر ينفذ اللي جواها."
              },
              {
                "id": "b",
                "text": "لأن الكود فيه خطأ لغوي",
                "isCorrect": false,
                "explanation": "الكود صحيح تماماً لكنه ينتظر الاستدعاء."
              },
              {
                "id": "c",
                "text": "لأن console.log ممنوع جوه الدوال",
                "isCorrect": false,
                "explanation": "الطباعة مسموحة في أي مكان في الكود."
              }
            ]
          },
          {
            "id": "ch11-q2",
            "question": "إيه هو الـ Parameter في الدالة؟",
            "options": [
              {
                "id": "a",
                "text": "المتغير اللي بنستقبل بيه المدخلات بين قوسي الدالة",
                "isCorrect": true,
                "explanation": "ممتاز! 💡 المعامل هو المتغير اللي بيحفظ القيمة الممررة للدالة."
              },
              {
                "id": "b",
                "text": "اسم الدالة نفسه",
                "isCorrect": false,
                "explanation": "اسم الدالة بيجي بعد كلمة function مباشرة."
              },
              {
                "id": "c",
                "text": "الناتج النهائي للدالة",
                "isCorrect": false,
                "explanation": "الناتج بيتم إرجاعه بكلمة return."
              }
            ]
          }
        ]
      },
      {
        "id": 12,
        "partId": 4,
        "partTitle": "الجزء الرابع: الدوال",
        "title": "الفصل 12: إرجاع القيم (return)",
        "subtitle": "الخروج بالنتيجة: العصير في الكوباية!",
        "summaryPoints": [
          "أمر return هو اللي بيخلي الدالة تسلّم النتيجة للمستدعي وتصب العصير في الكوباية.",
          "الفرق بين console.log (عرض للمشاهدة فقط) و return (إعطاء ناتج يمكن تخزينه واستخدامه برمجياً).",
          "الدالة التي لا تحتوي على return ترجع تلقائياً undefined.",
          "أمر return يعتبر بوابة خروج فورية؛ أي كود مكتوب بعده داخل الدالة لا ينفذ أبداً."
        ],
        "contentSections": [],
        "exercises": [],
        "challenge": {
          "id": "ch12-chal",
          "title": "وريني شطارتك 🧠: حاسبة مساحة المستطيل",
          "prompt": "اكتب دالة اسمها getArea تقبل معاملي الطول w والعرض h وترجع (return) مساحة المستطيل (w * h). ثم خزن ناتج getArea(5, 4) في متغير واطبعه.",
          "hint": "return w * h; ثم const area = getArea(5, 4); console.log(area);",
          "initialCode": "// اكتب دالة getArea واستدعاءها وطباعة الناتج هنا بنفسك...\n",
          "solutionCode": "function getArea(w, h) {\n  return w * h;\n}\nconst area = getArea(5, 4);\nconsole.log(area);"
        },
        "quiz": [
          {
            "id": "ch12-q1",
            "question": "إيه الفرق الأساسي بين console.log و return داخل الدالة؟",
            "options": [
              {
                "id": "a",
                "text": "console.log تعرض فقط على الشاشة، بينما return تُرجع قيمة يمكن تخزينها واستخدامها برمجياً",
                "isCorrect": true,
                "explanation": "صح جداً! 👏 return هي اللي بتسلم النتيجة ليدك عشان تكمل بيها حسابات."
              },
              {
                "id": "b",
                "text": "مفيش أي فرق بينهم",
                "isCorrect": false,
                "explanation": "فرق شاسع جداً ومصدر رئيسي لأخطاء المبتدئين."
              },
              {
                "id": "c",
                "text": "return مخصصة للأرقام فقط",
                "isCorrect": false,
                "explanation": "return ترجع أي نوع: نصوص، أرقام، مصفوفات، وغيرها."
              }
            ]
          },
          {
            "id": "ch12-q2",
            "question": "لو دالة مفيهاش أمر return خالص، واستدعيناها.. قيمتها إيه؟",
            "options": [
              {
                "id": "a",
                "text": "undefined",
                "isCorrect": true,
                "explanation": "ممتاز! 💡 أي دالة بدون return بترجع undefined كقيمة افتراضية."
              },
              {
                "id": "b",
                "text": "0",
                "isCorrect": false,
                "explanation": "الصفر قيمة رقمية حقيقية."
              },
              {
                "id": "c",
                "text": "null",
                "isCorrect": false,
                "explanation": "null تدل على تفريغ مقصود، بينما الافتراضي هو undefined."
              }
            ]
          }
        ]
      },
      {
        "id": 13,
        "partId": 4,
        "partTitle": "الجزء الرابع: الدوال",
        "title": "الفصل 13: نطاق المتغيرات (Scope)",
        "subtitle": "مين شايف مين؟ الصالة vs الأوضة المقفولة",
        "summaryPoints": [
          "النطاق (Scope) هو حدود المنطقة اللي بيكون فيها المتغير معروفاً وقابلاً للقراءة.",
          "النطاق العام (Global Scope): المتغيرات المعرفة في الهواء الطلق بتتشاف من أي مكان في الملف.",
          "النطاق المحلي (Block Scope): المتغيرات المعرفة داخل { } بتعيش وتموت جوه القوسين ومحدش بره بيشوفها.",
          "محاولة استخدام متغير محلي من خارج غرفته بتسبب خطأ ReferenceError: is not defined."
        ],
        "contentSections": [],
        "exercises": [],
        "challenge": {
          "id": "ch13-chal",
          "title": "وريني شطارتك 🧠: حماية سر اللعبة",
          "prompt": "اكتب دالة اسمها startGame تعرف داخلها متغيراً محلياً const secretCode = 999؛ وتطبع \"اللعبة بدأت\". تأكد من أن secretCode لا يتسرب خارج الدالة.",
          "hint": "ضع تعريف المتغير داخل جسم الدالة واستدعِ startGame();",
          "initialCode": "// اكتب دالة startGame مع المتغير المحلي السري هنا بنفسك...\n",
          "solutionCode": "function startGame() {\n  const secretCode = 999;\n  console.log(\"اللعبة بدأت\");\n}\nstartGame();"
        },
        "quiz": [
          {
            "id": "ch13-q1",
            "question": "لو عرّفنا let x = 10 جوه دالة، وحاولنا نطبع console.log(x) بره الدالة.. إيه اللي هيحصل؟",
            "options": [
              {
                "id": "a",
                "text": "هيطلع خطأ ReferenceError: x is not defined لأن x محلي داخل الدالة فقط",
                "isCorrect": true,
                "explanation": "صح جداً! 👏 المتغير المحلي مقفول عليه جوه الأقواس ومحدش بره يقدر يوصله."
              },
              {
                "id": "b",
                "text": "هيطبع 10 عادي",
                "isCorrect": false,
                "explanation": "لا يمكن الوصول للمتغيرات المحلية من الخارج."
              },
              {
                "id": "c",
                "text": "هيطبع undefined",
                "isCorrect": false,
                "explanation": "المتغير غير موجود أساساً في هذا النطاق فينتج ReferenceError."
              }
            ]
          }
        ]
      },
      {
        "id": 14,
        "partId": 4,
        "partTitle": "الجزء الرابع: الدوال",
        "title": "الفصل 14: مشروع صغير — لعبة تخمين رقم",
        "subtitle": "دمج الشروط والحلقات والدوال في محاكاة لمنطق اللعبة",
        "summaryPoints": [
          "المشاريع بتبدأ بالتخطيط المنطقي (Algorithm) قبل كتابة أول سطر كود.",
          "دمج Math.random لتوليد رقم سري مع الشروط والدوال.",
          "الدالة بتفحص التخمين وترجع تلميح: أكبر، أصغر، أو مبروك.",
          "محاكاة كذا محاولة مكتوبة مسبقاً ومراجعة النتيجة."
        ],
        "contentSections": [],
        "exercises": [],
        "challenge": {
          "id": "ch14-chal",
          "title": "وريني شطارتك 🧠: فاحص التخمين الصارم",
          "prompt": "اكتب كوداً يحدد const secret = 6 و const guess = 6؛ فإذا كان guess مساوياً لـ secret يطبع \"مبروك كسبت\"، وغير ذلك يطبع \"حاول تاني\".",
          "hint": "if (guess === secret) { console.log(\"مبروك كسبت\"); } else { console.log(\"حاول تاني\"); }",
          "initialCode": "// اكتب كود فحص التخمين السري هنا بنفسك...\n",
          "solutionCode": "const secret = 6;\nconst guess = 6;\nif (guess === secret) {\n  console.log(\"مبروك كسبت\");\n} else {\n  console.log(\"حاول تاني\");\n}"
        },
        "quiz": [
          {
            "id": "ch14-q1",
            "question": "عشان نعمل لعبة التخمين صح، إيه أفضل ترتيب لمنطق فحص التخمين؟",
            "options": [
              {
                "id": "a",
                "text": "فحص التساوي أولاً (الفوز)، ثم فحص هل الرقم أصغر، ثم البديل أنه أكبر",
                "isCorrect": true,
                "explanation": "صح جداً! 👏 بنبدأ بشرط الفوز والانتهاء، ثم نعطي التلميحات المساعدة."
              },
              {
                "id": "b",
                "text": "فحص أكبر دائماً فقط",
                "isCorrect": false,
                "explanation": "لو فحصنا اتجاه واحد مش هنعرف لو اللاعب كسب."
              },
              {
                "id": "c",
                "text": "تخمين عشوائي بدون شروط",
                "isCorrect": false,
                "explanation": "البرمجة مبنية على منطق محدد وشروط واضحة."
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": 5,
    "title": "الجزء الخامس: المصفوفات",
    "subtitle": "الرف اللي بنرتب عليه البيانات",
    "description": "المصفوفات (Arrays)، الفهرس المبدئي من الصفر، خاصية length، التكرار بـ for..of، وعمليات push وpop وincludes.",
    "iconName": "Layers",
    "bugHunter": {
      "id": "bug-part-5",
      "partId": 5,
      "title": "كويز: فخ الـ Index و undefined في المصفوفة",
      "context": "الكود ده المفروض يطبع 4 أسماء في المصفوفة، لكنه في النهاية بيطبع undefined إضافية!",
      "problemCode": "const names = [\"ندى\", \"كريم\", \"ياسمين\", \"طارق\"];\n\nfor (let i = 0; i <= names.length; i++) {\n  console.log(names[i]);\n}",
      "bugLineNumber": 3,
      "bugDescription": "استخدام i <= names.length بدلاً من i < names.length.",
      "whyItHappens": "طول المصفوفة names هو 4، لكن الـ index يبدأ من 0 وينتهي عند 3. عند استخدام <= ستصل قيمة i إلى 4، والعنصر names[4] غير موجود، فيرجع الكمبيوتر undefined!",
      "fixedCode": "const names = [\"ندى\", \"كريم\", \"ياسمين\", \"طارق\"];\n\nfor (let i = 0; i < names.length; i++) {\n  console.log(names[i]);\n}",
      "expectedCorrectOutput": "ندى\nكريم\nياسمين\nطارق",
      "hints": [
        "المصفوفة فيها 4 عناصر، ما هو آخر index متاح؟",
        "ماذا يحدث عندما يحاول الكود قراءة names[4]؟",
        "استبدل <= بـ <."
      ]
    },
    "chapters": [
      {
        "id": 15,
        "partId": 5,
        "partTitle": "الجزء الخامس: المصفوفات",
        "title": "الفصل 15: المصفوفات (1) — الرف المرقّم",
        "subtitle": "تخزين عدة قيم في متغير واحد، والفهرسة من الصفر",
        "summaryPoints": [
          "المصفوفة (Array) هي رف منظم بيحفظ قائمة كاملة من البيانات داخل متغير واحد.",
          "بنكتب المصفوفة بين قوسين مربعين [ ] ونفصل بين العناصر بفواصل.",
          "ترقيم العناصر (Index) بيبدأ دائماً من 0 وليس من 1.",
          "خاصية array.length بتعطينا عدد العناصر، وآخر عنصر مكانه array[array.length - 1]."
        ],
        "contentSections": [],
        "exercises": [],
        "challenge": {
          "id": "ch15-chal",
          "title": "وريني شطارتك 🧠: حسابات درجات الطلاب",
          "prompt": "عندك مصفوفة const grades = [88, 65, 92, 40, 77];. اطبع أول عنصر، وآخر عنصر بـ length، ومجموعهما معاً.",
          "hint": "grades[0] و grades[grades.length - 1].",
          "initialCode": "// اكتب كود قراءة أول وآخر عنصر وجمع درجاتهما هنا بنفسك...\n",
          "solutionCode": "const grades = [88, 65, 92, 40, 77];\nconst first = grades[0];\nconst last = grades[grades.length - 1];\nconsole.log(\"الأول: \" + first);\nconsole.log(\"الأخير: \" + last);\nconsole.log(\"مجموعهما: \" + (first + last));"
        },
        "quiz": [
          {
            "id": "ch15-q1",
            "question": "لو عندنا مصفوفة فيها 5 عناصر، الفهرس (index) بتاع أول عنصر وآخر عنصر كام بالترتيب؟",
            "options": [
              {
                "id": "a",
                "text": "أول عنصر 0، وآخر عنصر 4",
                "isCorrect": true,
                "explanation": "صح جداً! 👏 الترقيم يبدأ من 0 وينتهي عند (الطول - 1) وهو 4."
              },
              {
                "id": "b",
                "text": "أول عنصر 1، وآخر عنصر 5",
                "isCorrect": false,
                "explanation": "الكمبيوتر يبدأ دائماً من 0 وليس 1."
              },
              {
                "id": "c",
                "text": "أول عنصر 0، وآخر عنصر 5",
                "isCorrect": false,
                "explanation": "لو طلبت الرف رقم 5 هيرجع لك undefined لأنهم 5 عناصر فقط (0 إلى 4)."
              }
            ]
          },
          {
            "id": "ch15-q2",
            "question": "إزاي نوصل لآخر عنصر في أي مصفوفة اسمها arr مهما كان طولها؟",
            "options": [
              {
                "id": "a",
                "text": "arr[arr.length - 1]",
                "isCorrect": true,
                "explanation": "برافو عليك! 🎯 دي الطريقة القياسية عالمياً للوصول لآخر عنصر."
              },
              {
                "id": "b",
                "text": "arr[last]",
                "isCorrect": false,
                "explanation": "مفيش كلمة محجوزة اسمها last في المصفوفات."
              },
              {
                "id": "c",
                "text": "arr[arr.length]",
                "isCorrect": false,
                "explanation": "arr[arr.length] هيرجع undefined لأن الترقيم يبدأ من 0."
              }
            ]
          }
        ]
      },
      {
        "id": 16,
        "partId": 5,
        "partTitle": "الجزء الخامس: المصفوفات",
        "title": "الفصل 16: المصفوفات (2) — المرور على العناصر",
        "subtitle": "حلقة for العادية وحلقة for..of السحرية",
        "summaryPoints": [
          "المرور على المصفوفة يعني فحص أو طباعة كل عنصر فيها واحد ورا التاني.",
          "حلقة for التقليدية بتستخدم العداد i من 0 حتى أقل من array.length.",
          "حلقة for..of السحرية هي الطريقة الأسهل والأحدث لما نكون مهتمين بالقيمة فقط.",
          "دمج الشروط if داخل الحلقات يسمح بتصفية البيانات وحساب المجموع والإحصائيات."
        ],
        "contentSections": [],
        "exercises": [],
        "challenge": {
          "id": "ch16-chal",
          "title": "وريني شطارتك 🧠: مضاعفة جميع أرقام القائمة",
          "prompt": "عندك مصفوفة const numbers = [2, 5, 8];. استخدم حلقة for..of واطبع في الكونسول ضعف كل رقم (num * 2) في سطر منفصل.",
          "hint": "for (const n of numbers) { console.log(n * 2); }",
          "initialCode": "// اكتب حلقة for..of لطباعة ضعف كل رقم هنا بنفسك...\n",
          "solutionCode": "const numbers = [2, 5, 8];\nfor (const n of numbers) {\n  console.log(n * 2);\n}"
        },
        "quiz": [
          {
            "id": "ch16-q1",
            "question": "في حلقة for التقليدية للمصفوفة arr، ليه بنكتب الشرط i < arr.length مش i <= arr.length؟",
            "options": [
              {
                "id": "a",
                "text": "عشان آخر عنصر بيكون عند arr.length - 1، ولو وصلنا لـ length هنطبع undefined",
                "isCorrect": true,
                "explanation": "صح جداً! 👏 الـ index بينتهي قبل رقم الطول بواحد."
              },
              {
                "id": "b",
                "text": "لأن جافاسكريبت بترفض علامة <= مع المصفوفات",
                "isCorrect": false,
                "explanation": "العلامة مسموحة نحوياً لكنها ستسبب خطأ منطقياً (undefined)."
              },
              {
                "id": "c",
                "text": "عشان نتجاهل أول عنصر",
                "isCorrect": false,
                "explanation": "أول عنصر بيتم قراءته عند i = 0 بشكل طبيعي."
              }
            ]
          },
          {
            "id": "ch16-q2",
            "question": "إيه الميزة الأكبر لحلقة for..of؟",
            "options": [
              {
                "id": "a",
                "text": "تتيح الوصول للقيم مباشرة بدون الحاجة لتعريف عداد ومقارنة أطوال",
                "isCorrect": true,
                "explanation": "ممتاز! 🎯 كود نظيف، مقروء، وسهل بدون تعقيدات العدادات."
              },
              {
                "id": "b",
                "text": "أنها تعكس ترتيب المصفوفة",
                "isCorrect": false,
                "explanation": "هي تقرأ بالترتيب الطبيعي من الأول للآخر."
              },
              {
                "id": "c",
                "text": "أنها تحذف العناصر بعد قراءتها",
                "isCorrect": false,
                "explanation": "المصفوفة تظل كما هي دون أي حذف."
              }
            ]
          }
        ]
      },
      {
        "id": 17,
        "partId": 5,
        "partTitle": "الجزء الخامس: المصفوفات",
        "title": "الفصل 17: عمليات المصفوفات (Methods)",
        "subtitle": "الإضافة والحذف بـ push و pop، والبحث بـ includes و indexOf",
        "summaryPoints": [
          "الدوال المدمجة بالمصفوفات (Methods) بتسمح بالتعديل الديناميكي على القائمة.",
          "الدالة push() بتضيف عنصراً في نهاية المصفوفة، و pop() بتحذف آخر عنصر.",
          "الدالة unshift() بتضيف في البداية، و shift() بتحذف أول عنصر.",
          "الدالة includes() بتفحص هل القيمة موجودة (true أو false)، و indexOf() بترجع رقم الرف.",
          "المصفوفة المعرفة بـ const يمكن تعديل محتواها لأن الصندوق نفسه ثابت لكن ما بداخله مرن."
        ],
        "contentSections": [],
        "exercises": [],
        "challenge": {
          "id": "ch17-chal",
          "title": "وريني شطارتك 🧠: جمع الأرقام الزوجية في مصفوفة",
          "prompt": "ابدأ بمصفوفة فارغة evenNumbers. استخدم حلقة من 1 لـ 10، ولو الرقم زوجي ضيفه بـ push، وفي النهاية اطبع المصفوفة.",
          "hint": "const evenNumbers = []; if (i % 2 === 0) evenNumbers.push(i);",
          "initialCode": "// اكتب كود ملء مصفوفة بالأرقام الزوجية هنا بنفسك...\n",
          "solutionCode": "const evenNumbers = [];\nfor (let i = 1; i <= 10; i++) {\n  if (i % 2 === 0) {\n    evenNumbers.push(i);\n  }\n}\nconsole.log(evenNumbers);"
        },
        "quiz": [
          {
            "id": "ch17-q1",
            "question": "الدالة push() بتضيف العنصر فين بالظبط في المصفوفة؟",
            "options": [
              {
                "id": "a",
                "text": "في نهاية المصفوفة بعد آخر عنصر",
                "isCorrect": true,
                "explanation": "صح جداً! 👏 push بتضيف في الآخر، بينما unshift بتضيف في الأول."
              },
              {
                "id": "b",
                "text": "في أول المصفوفة عند الفهرس 0",
                "isCorrect": false,
                "explanation": "الإضافة في البداية هي وظيفة unshift."
              },
              {
                "id": "c",
                "text": "في منتصف المصفوفة عشوائياً",
                "isCorrect": false,
                "explanation": "المصفوفات منظمة وتتبع ترتيباً دقيقاً."
              }
            ]
          },
          {
            "id": "ch17-q2",
            "question": "الدالة arr.indexOf(x) هترجع إيه لو العنصر x مش موجود في المصفوفة؟",
            "options": [
              {
                "id": "a",
                "text": "-1",
                "isCorrect": true,
                "explanation": "ممتاز! 🎯 القيمة -1 هي الإشارة الرسمية لعدم وجود العنصر."
              },
              {
                "id": "b",
                "text": "0",
                "isCorrect": false,
                "explanation": "الصفر يعني أن العنصر موجود في أول رف."
              },
              {
                "id": "c",
                "text": "false",
                "isCorrect": false,
                "explanation": "الدالة بترجع أرقام index مش boolean (دي وظيفة includes)."
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": 6,
    "title": "الجزء السادس: من الكود للصفحة (HTML وCSS وDOM)",
    "subtitle": "لوحة التحكم اللي بتشغّل صفحة الويب التفاعلية",
    "description": "بناء هيكل الصفحة بـ HTML، تزيينها وتنسيقها بـ CSS، كائنات الـ Objects، والتحكم الحي بالصفحة وأحداث النقر عبر الـ DOM.",
    "iconName": "Globe",
    "bugHunter": {
      "id": "bug-part-6",
      "partId": 6,
      "title": "كويز: مكان السكريبت القاتل في الـ Head",
      "context": "الكود ده المفروض يغير نص العنوان لما تدوس على الزرار، لكنه مبيشتغلش إطلاقاً وبيطلع Cannot read properties of null في الكونسول!",
      "problemCode": "<!DOCTYPE html>\n<html>\n  <head>\n    <title>صفحتي</title>\n    <script>\n      const heading = document.getElementById(\"title\");\n      const button = document.getElementById(\"changeButton\");\n\n      button.addEventListener(\"click\", function () {\n        heading.textContent = \"تم التغيير!\";\n      });\n    </script>\n  </head>\n  <body>\n    <h1 id=\"title\">العنوان الأصلي</h1>\n    <button id=\"changeButton\">غيّر</button>\n  </body>\n</html>",
      "bugLineNumber": 4,
      "bugDescription": "تنفيذ كود JavaScript في <head> قبل أن يتم إنشاء عناصر <body> في الـ DOM.",
      "whyItHappens": "المتصفح يقرأ الصفحة من الأعلى للأسفل. عندما وصل لكود السكريبت في <head>، لم تكن عناصر <body> قد ظهرت بعد في الذاكرة، لذلك document.getElementById(\"changeButton\") رجعت null، وعند محاولة إضافة مستمع للأحداث اعترض المتصفح بأن button غير موجود!",
      "fixedCode": "<!DOCTYPE html>\n<html>\n  <head>\n    <title>صفحتي</title>\n  </head>\n  <body>\n    <h1 id=\"title\">العنوان الأصلي</h1>\n    <button id=\"changeButton\">غيّر</button>\n\n    <!-- وضع السكريبت قبل إغلاق body مباشرة -->\n    <script>\n      const heading = document.getElementById(\"title\");\n      const button = document.getElementById(\"changeButton\");\n\n      button.addEventListener(\"click\", function () {\n        heading.textContent = \"تم التغيير!\";\n      });\n    </script>\n  </body>\n</html>",
      "expectedCorrectOutput": "عند النقر على الزرار يتغير العنوان فوراً إلى: \"تم التغيير!\"",
      "hints": [
        "متى يتم تحميل عناصر body بالنسبة لعناصر head؟",
        "ماذا ترجع getElementById إذا كان العنصر لم يُرسم بعد في الصفحة؟",
        "انقل وسم <script> إلى ما قبل إغلاق </body> مباشرة."
      ]
    },
    "chapters": [
      {
        "id": 18,
        "partId": 6,
        "partTitle": "الجزء السادس: من الكود للصفحة",
        "title": "الفصل 18: أساسيات HTML (1)",
        "subtitle": "هيكل الصفحة، الوسوم، العناوين، القوائم، والصور",
        "summaryPoints": [
          "HTML (HyperText Markup Language) هي لغة هيكلة صفحات الويب، وهي العظم الأساسي لكل المواقع.",
          "العناصر بتتكتب بالوسوم: وسم الفتح <tag> والمحتوى ووسم الإغلاق </tag>.",
          "الهيكل الثابت لأي صفحة يبدأ بـ <!DOCTYPE html> ويحتوي على <head> للمعلومات و <body> لما يراه الزائر.",
          "عائلة العناوين من <h1> للأكبر إلى <h6> للأصغر، والفقرات <p>، والقوائم <ul> و <ol>."
        ],
        "contentSections": [],
        "exercises": [],
        "challenge": {
          "id": "ch18-chal",
          "title": "وريني شطارتك 🧠: كارت المبرمج في HTML",
          "prompt": "اكتب HTML مباشرة لبطاقة فيها عنوان <h1> باسمك، وفقرة <p> بالنص \"أنا مبرمج ويب\"، وقائمة <ul> فيها مهارتان داخل <li>.",
          "hint": "اكتب وسوم h1 و p و ul/li مباشرة، دون console.log.",
          "initialCode": "// اكتب كود طباعة وسوم الـ HTML بالترتيب هنا بنفسك...\n",
          "solutionCode": "<h1>كود بالمصري</h1>\n<p>أنا مبرمج ويب</p>\n<ul><li>JavaScript</li><li>HTML</li></ul>"
        },
        "quiz": [
          {
            "id": "ch18-q1",
            "question": "إيه الفرق الأساسي بين وسوم العناوين <h1> والفقرات <p> في HTML؟",
            "options": [
              {
                "id": "a",
                "text": "<h1> لعنوان رئيسي عريض وهام، بينما <p> للفقرات النصية العادية",
                "isCorrect": true,
                "explanation": "صح جداً! 📝 h1 اختصار Heading 1 وهو أهم عنوان في الصفحة، و p اختصار Paragraph."
              },
              {
                "id": "b",
                "text": "<p> بتعرض كود برمجي فقط",
                "isCorrect": false,
                "explanation": "الكود بيتعرض بوسوم زي <code> أو <pre>."
              },
              {
                "id": "c",
                "text": "مفيش فرق في المعنى الدلالي",
                "isCorrect": false,
                "explanation": "المتصفحات ومحركات البحث بتعتمد على العناوين لتنظيم وفهم هيكل الصفحة."
              }
            ]
          },
          {
            "id": "ch18-q2",
            "question": "لكتابة قائمة نقطية غير مرتبة بنستخدم وسم:",
            "options": [
              {
                "id": "a",
                "text": "<ul> مع <li>",
                "isCorrect": true,
                "explanation": "برافو! 🎯 ul اختصار Unordered List و li اختصار List Item."
              },
              {
                "id": "b",
                "text": "<ol> مع <li>",
                "isCorrect": false,
                "explanation": "<ol> مخصصة للقوائم الرقمية المرتبة (Ordered)."
              },
              {
                "id": "c",
                "text": "<list>",
                "isCorrect": false,
                "explanation": "مفيش وسم في HTML اسمه <list>."
              }
            ]
          }
        ]
      },
      {
        "id": 19,
        "partId": 6,
        "partTitle": "الجزء السادس: من الكود للصفحة",
        "title": "الفصل 19: أساسيات CSS (1)",
        "subtitle": "تلوين وتنسيق: اللون، الخلفية، والخطوط",
        "summaryPoints": [
          "CSS (Cascading Style Sheets) هي لغة الأناقة والجمال المسؤولة عن تنسيق صفحات الويب.",
          "قاعدة CSS بتتكون من: المحدد (Selector) والخاصية (Property) والقيمة (Value).",
          "التحكم في الألوان: color للخطوط، و background-color لخلفية العنصر.",
          "تنسيق الخطوط: font-size للحجم، و text-align للمحاذاة، و font-family لنوع الخط."
        ],
        "contentSections": [],
        "exercises": [],
        "challenge": {
          "id": "ch19-chal",
          "title": "وريني شطارتك 🧠: كود التنسيق الملكي",
          "prompt": "اكتب قاعدة CSS للمحدد .highlight تجعل لون النص أصفر باستخدام color: yellow.",
          "hint": ".highlight { color: yellow; }",
          "initialCode": "// اكتب كود طباعة قاعدة CSS لـ h1 هنا بنفسك...\n",
          "solutionCode": ".highlight { color: yellow; }"
        },
        "quiz": [
          {
            "id": "ch19-q1",
            "question": "خاصية CSS المسؤولة عن تغيير لون خلفية العنصر هي:",
            "options": [
              {
                "id": "a",
                "text": "background-color",
                "isCorrect": true,
                "explanation": "صح جداً! 👏 color للنص، بينما background-color للخلفية."
              },
              {
                "id": "b",
                "text": "text-color",
                "isCorrect": false,
                "explanation": "مفيش خاصية في CSS اسمها text-color."
              },
              {
                "id": "c",
                "text": "bg",
                "isCorrect": false,
                "explanation": "bg مجرد اختصار في بعض المكتبات لكن في CSS الصافي هي background-color."
              }
            ]
          },
          {
            "id": "ch19-q2",
            "question": "لتوسيط النص في منتصف الصفحة أفقياً نستخدم:",
            "options": [
              {
                "id": "a",
                "text": "text-align: center;",
                "isCorrect": true,
                "explanation": "برافو! 🎯 text-align بتتحكم في محاذاة الكلمات (center / right / left)."
              },
              {
                "id": "b",
                "text": "align: middle;",
                "isCorrect": false,
                "explanation": "خاصية align قديمة وغير قياسية."
              },
              {
                "id": "c",
                "text": "font-center: true;",
                "isCorrect": false,
                "explanation": "لا توجد خاصية بهذا الاسم."
              }
            ]
          }
        ]
      },
      {
        "id": 20,
        "partId": 6,
        "partTitle": "الجزء السادس: من الكود للصفحة",
        "title": "الفصل 20: تقسيم الصفحة والمدخلات (HTML 2)",
        "subtitle": "حاويات div ومدخلات input وأزرار button",
        "summaryPoints": [
          "وسم <div> هو الصندوق والحاوية الأكثر استخداماً على الإطلاق لتجميع وتقسيم أجزاء الصفحة.",
          "وسم <input> بيسمح باستقبال بيانات من المستخدم (نصوص، أرقام، كلمات سر، تواريخ).",
          "خاصية placeholder بتعرض نصاً إرشادياً رمادياً يختفي فور بدء الكتابة.",
          "وسم <button> يمثل زر الإجراء والنقر، و <label> لتسمية الحقول بوضوح."
        ],
        "contentSections": [],
        "exercises": [],
        "challenge": {
          "id": "ch20-chal",
          "title": "وريني شطارتك 🧠: نموذج بريد إلكتروني",
          "prompt": "اكتب نموذج HTML فيه label مرتبط بحقل بريد باستخدام for و id، وحقل type=\"email\"، وزر إرسال.",
          "hint": "اجعل قيمة label for مساوية لـ id الحقل، واستخدم button type=\"submit\".",
          "initialCode": "// اكتب كود طباعة وسم الزرار هنا بنفسك...\n",
          "solutionCode": "<form><label for=\"email\">البريد الإلكتروني</label><input id=\"email\" name=\"email\" type=\"email\"><button type=\"submit\">إرسال</button></form>"
        },
        "quiz": [
          {
            "id": "ch20-q1",
            "question": "لو عايزين نعمل حقل إدخال يخفي الحروف اللي بتتكتب بنقاط سرية، بنحدد type إيه؟",
            "options": [
              {
                "id": "a",
                "text": "type=\"password\"",
                "isCorrect": true,
                "explanation": "صح! 🔒 نوع password يخفي الأحرف على الشاشة، لكنه لا يشفّر قيمة الحقل."
              },
              {
                "id": "b",
                "text": "type=\"hidden\"",
                "isCorrect": false,
                "explanation": "نوع hidden يخفي الحقل بالكامل عن الشاشة للمتغيرات الداخلية."
              },
              {
                "id": "c",
                "text": "type=\"secret\"",
                "isCorrect": false,
                "explanation": "مفيش نوع في HTML اسمه secret."
              }
            ]
          }
        ]
      },
      {
        "id": 21,
        "partId": 6,
        "partTitle": "الجزء السادس: من الكود للصفحة",
        "title": "الفصل 21: تزيين الأزرار وتأثيرات الفأرة (CSS 2)",
        "subtitle": "الحواف الدائرية، الظلال، و:hover",
        "summaryPoints": [
          "نموذج الصندوق (Box Model) يتكون من: المحتوى، والحشوة الداخلية (padding)، والحدود (border)، والهامش الخارجي (margin).",
          "خاصية border-radius تحول الحواف الحادة لأركان ناعمة دائرية جذابة.",
          "تأثير :hover هو ساحر تفاعل الفأرة؛ يغير اللون والشكل فور مرور الماوس فوق الزر.",
          "خاصية cursor: pointer تجعل مؤشر الماوس يتحول لشكل اليد المشيرة للدلالة على قابلية النقر."
        ],
        "contentSections": [],
        "exercises": [],
        "challenge": {
          "id": "ch21-chal",
          "title": "وريني شطارتك 🧠: حواف الزرار المستديرة",
          "prompt": "اكتب قاعدة CSS مباشرة تجعل أزرار button بحواف دائرية (border-radius: 12px;).",
          "hint": "button { border-radius: 12px; }",
          "initialCode": "// اكتب كود تدوير حواف الأزرار هنا بنفسك...\n",
          "solutionCode": "button { border-radius: 12px; }"
        },
        "quiz": [
          {
            "id": "ch21-q1",
            "question": "خاصية border-radius وظيفتها إيه في CSS؟",
            "options": [
              {
                "id": "a",
                "text": "تدوير حواف وأركان الصندوق لجعلها منحنية وناعمة",
                "isCorrect": true,
                "explanation": "صح جداً! 👏 كل ما تزود القيمة (مثلاً 20px أو 50%) كل ما الحواف تكون دائرية أكتر."
              },
              {
                "id": "b",
                "text": "تغيير لون الحدود",
                "isCorrect": false,
                "explanation": "لون الحدود بيتم بـ border-color."
              },
              {
                "id": "c",
                "text": "مسح محتوى الصندوق",
                "isCorrect": false,
                "explanation": "لا تؤثر على المحتوى."
              }
            ]
          }
        ]
      },
      {
        "id": 22,
        "partId": 6,
        "partTitle": "الجزء السادس: من الكود للصفحة",
        "title": "الفصل 22: ألوان الشاشات RGB و Hex والشفافية (CSS 3)",
        "subtitle": "خلط درجات الضوء: أحمر، أخضر، أزرق",
        "summaryPoints": [
          "شاشات الموبايل والكمبيوتر بتصنع ملايين الألوان بخلط 3 أنوار ضوئية: Red و Green و Blue.",
          "نظام rgb(r, g, b) يقبل أرقاماً من 0 إلى 255 لكل لون.",
          "نظام rgba(r, g, b, a) يضيف معامل الشفافية Alpha من 0 (شفاف تماماً) إلى 1 (معتم).",
          "شفرات الهكس (Hex Codes) تستخدم علامة # متبوعة بـ 6 خانات هكساديسيمال (#ff6600)."
        ],
        "contentSections": [],
        "exercises": [],
        "challenge": {
          "id": "ch22-chal",
          "title": "وريني شطارتك 🧠: شفرة الهكس الخالصة",
          "prompt": "اكتب قاعدة CSS مباشرة تجعل لون خلفية الصفحة body أبيض باستخدام شفرة Hex وهي #ffffff.",
          "hint": "body { background-color: #ffffff; }",
          "initialCode": "// اكتب كود تلوين خلفية body بالهكس الأبيض هنا بنفسك...\n",
          "solutionCode": "body { background-color: #ffffff; }"
        },
        "quiz": [
          {
            "id": "ch22-q1",
            "question": "الحرف A في نظام الألوان rgba بيرمز لإيه؟",
            "options": [
              {
                "id": "a",
                "text": "Alpha: معامل الشفافية بين 0 و 1",
                "isCorrect": true,
                "explanation": "صح جداً! 👏 Alpha هي اللي بتخليك تشوف ما وراء العنصر."
              },
              {
                "id": "b",
                "text": "Auto: تلوين تلقائي",
                "isCorrect": false,
                "explanation": "لا علاقة له بالوضع التلقائي."
              },
              {
                "id": "c",
                "text": "Aqua: درجة اللون المائي",
                "isCorrect": false,
                "explanation": "اسم المعامل هو Alpha."
              }
            ]
          }
        ]
      },
      {
        "id": 23,
        "partId": 6,
        "partTitle": "الجزء السادس: من الكود للصفحة",
        "title": "الفصل 23: بناء بطاقة ملف شخصي (مشروع عملي)",
        "subtitle": "دمج HTML وCSS في بطاقة شخصية",
        "summaryPoints": [
          "دمج HTML و CSS لبناء كارت بروفايل مبرمج احترافي كامل (Portfolio Card).",
          "توسيط البطاقة وضبط عرضها لتناسب الشاشات الصغيرة.",
          "استخدام الخطوط والصور والظلال والأزرار التفاعلية في مشروع واحد.",
          "فحص الصفحة والتأكد من توافق الألوان والتنسيقات في بيئة المتصفح الحقيقية."
        ],
        "contentSections": [],
        "exercises": [],
        "challenge": {
          "id": "ch23-chal",
          "title": "وريني شطارتك 🧠: كارت المنتج المتكامل",
          "prompt": "اكتب بطاقة منتج HTML بكلاس product-card، فيها عنوان h2 وفقرة وزر شراء، وأضف قاعدة CSS واحدة لتنسيق البطاقة.",
          "hint": "<style>.product-card { padding: 16px; }</style><article class=\"product-card\"><h2>ساعة ذكية</h2><p>خفيفة وعملية</p><button>شراء</button></article>",
          "initialCode": "// اكتب كود طباعة كارت المنتج هنا بنفسك...\n",
          "solutionCode": "<style>.product-card { padding: 16px; background: #eee; }</style><article class=\"product-card\"><h2>ساعة ذكية</h2><p>خفيفة وعملية</p><button>شراء</button></article>"
        },
        "quiz": [
          {
            "id": "ch23-q1",
            "question": "ليه بنجمع عناصر البروفايل (الصورة، الاسم، الزر) جوه div واحدة؟",
            "options": [
              {
                "id": "a",
                "text": "عشان ننسق الكارت ككتلة واحدة ونديله خلفية وهوامش وظلال مشتركة",
                "isCorrect": true,
                "explanation": "صح جداً! 👏 الـ div بتلم العناصر في عائلة واحدة منظمة."
              },
              {
                "id": "b",
                "text": "لأن المتصفح يرفض عرض أكثر من عنصر بدون div",
                "isCorrect": false,
                "explanation": "المتصفح يعرض العناصر عادي، لكن التجميع يوفر التحكم والتنسيق."
              },
              {
                "id": "c",
                "text": "لتسريع الإنترنت عند المستخدم",
                "isCorrect": false,
                "explanation": "لا علاقة للوسوم بسرعة الاتصال."
              }
            ]
          }
        ]
      },
      {
        "id": 24,
        "partId": 6,
        "partTitle": "الجزء السادس: من الكود للصفحة",
        "title": "الفصل 24: الكائنات (Objects)",
        "subtitle": "بطاقة التعريف: مفتاح وقيمة (Key: Value)",
        "summaryPoints": [
          "الكائن (Object) هو كبسولة بيانات بتجمع كل المعلومات المتعلقة بكيان واحد (طالب، سيارة، منتج).",
          "يتكون الكائن من أزواج { key: value } محصورة بين قوسين معقوصين ومفصولة بفواصل.",
          "الوصول للخصائص: طريقة النقطة (Dot notation: student.name) أو الأقواس (student[\"age\"]).",
          "الدوال داخل الكائنات تسمى Methods، وكلمة this تشير لنفس الكائن الحالي."
        ],
        "contentSections": [],
        "exercises": [],
        "challenge": {
          "id": "ch24-chal",
          "title": "وريني شطارتك 🧠: كائن هاتف المحمول",
          "prompt": "أنشئ كائناً const phone يحمل الخاصيتين brand: \"سامسونج\" و price: 8000. ثم اطبع في الكونسول: \"الموبايل: سامسونج بسعر: 8000\".",
          "hint": "phone.brand و phone.price داخل console.log.",
          "initialCode": "// اكتب كود تعريف كائن phone وطباعة بياناته هنا بنفسك...\n",
          "solutionCode": "const phone = {\n  brand: \"سامسونج\",\n  price: 8000\n};\nconsole.log(\"الموبايل: \" + phone.brand + \" بسعر: \" + phone.price);"
        },
        "quiz": [
          {
            "id": "ch24-q1",
            "question": "كلمة this جوه دالة موجودة في كائن بتشير لمين؟",
            "codeSnippet": "const user = {\n  name: \"كريم\",\n  sayHello() {\n    console.log(\"أهلاً، أنا \" + this.name);\n  }\n};",
            "options": [
              {
                "id": "a",
                "text": "بتشير لنفس الكائن الحالي (user) اللي الدالة شغالة جواه",
                "isCorrect": true,
                "explanation": "صح جداً! 👏 this بتسمح للدالة تقرأ وتعدل خواص الكائن نفسه بسهولة."
              },
              {
                "id": "b",
                "text": "بتشير لمتصفح الويب بالكامل",
                "isCorrect": false,
                "explanation": "لو استدعيت الدالة كـ method للكائن، this بتشير للكائن نفسه."
              },
              {
                "id": "c",
                "text": "بتشير للغة جافاسكريبت",
                "isCorrect": false,
                "explanation": "this سياق تنفيذي محلي مرتبط بالكائن المستدعي."
              }
            ]
          },
          {
            "id": "ch24-q2",
            "question": "إزاي نستدعي دالة sayHello المعرفة جوه الكائن user؟",
            "options": [
              {
                "id": "a",
                "text": "user.sayHello()",
                "isCorrect": true,
                "explanation": "برافو! 🎯 اسم الكائن يليه نقطة ثم اسم الدالة وقوسين الاستدعاء ()."
              },
              {
                "id": "b",
                "text": "sayHello()",
                "isCorrect": false,
                "explanation": "الدالة مش معرّفة عالمياً، بل مربوطة بداخل الكائن user."
              },
              {
                "id": "c",
                "text": "call user.sayHello",
                "isCorrect": false,
                "explanation": "في جافاسكريبت الاستدعاء يتم بوضع القوسين ()."
              }
            ]
          }
        ]
      },
      {
        "id": 25,
        "partId": 6,
        "partTitle": "الجزء السادس: من الكود للصفحة",
        "title": "الفصل 25: شجرة الـ DOM والأحداث (Events)",
        "subtitle": "ربط JavaScript بالصفحة: النقر والتفاعل",
        "summaryPoints": [
          "الـ DOM (Document Object Model) هو الشجرة التي يرى بها JavaScript عناصر صفحة HTML ويتحكم فيها.",
          "الدالة document.getElementById() تمسك أي عنصر بالمعرف الفريد بتاعه.",
          "تعديل النصوص بـ textContent وتعديل التنسيقات بـ style.",
          "مراقبة تصرفات المستخدم عبر addEventListener(\"click\", callback) لتشغيل الكود فور النقر."
        ],
        "contentSections": [],
        "exercises": [],
        "challenge": {
          "id": "ch25-chal",
          "title": "وريني شطارتك 🧠: مبدل حالة النور (Light Switch)",
          "prompt": "اكتب صفحة HTML فيها زر وفقرة. استخدم addEventListener(\"click\") ومتغير boolean لتبديل نص الفقرة بين \"النور مضاء\" و \"النور مطفي\" عند كل نقرة.",
          "hint": "عرّف isOn واربِط الزر بـ addEventListener، ثم بدّل القيمة والنص عبر textContent.",
          "initialCode": "// اكتب كود دالة تبديل النور وفحص الحالة بنفسك هنا...\n",
          "solutionCode": "<!doctype html><html lang=\"ar\" dir=\"rtl\"><body><button id=\"toggle\">بدّل النور</button><p id=\"status\">النور مطفي</p><script>let isOn = false;\ndocument.getElementById(\"toggle\").addEventListener(\"click\", () => {\n  isOn = !isOn;\n  document.getElementById(\"status\").textContent = isOn ? \"النور مضاء\" : \"النور مطفي\";\n});</script></body></html>"
        },
        "quiz": [
          {
            "id": "ch25-q1",
            "question": "الدالة المسؤولة عن مراقبة نقرات الماوس على زر هي:",
            "options": [
              {
                "id": "a",
                "text": "button.addEventListener(\"click\", callback)",
                "isCorrect": true,
                "explanation": "ممتاز! 🎯 addEventListener هي المعيار الذهبي لمراقبة أي تفاعل من المستخدم في الويب."
              },
              {
                "id": "b",
                "text": "button.listen(\"click\")",
                "isCorrect": false,
                "explanation": "اسم الدالة الرسمي هو addEventListener."
              },
              {
                "id": "c",
                "text": "document.clickButton(button)",
                "isCorrect": false,
                "explanation": "المستمع يتم ربطه بالعنصر المراد مراقبته مباشرة."
              }
            ]
          },
          {
            "id": "ch25-q2",
            "question": "معامل الحدث (event / e) اللي بنستلمه جوه دالة النقر.. جواه إيه؟",
            "options": [
              {
                "id": "a",
                "text": "معلومات تفصيلية عن الحدث، زي العنصر المنقور (e.target) ومكان الماوس",
                "isCorrect": true,
                "explanation": "عاش يا بطل! 👏 كائن الحدث كنز معلومات بيفيدك تعرف المستخدم عمل إيه وفين بالظبط."
              },
              {
                "id": "b",
                "text": "سرعة الإنترنت بتاعة المستخدم",
                "isCorrect": false,
                "explanation": "الحدث يخص تفاعل المستخدم مع الصفحة."
              },
              {
                "id": "c",
                "text": "كلمة السر الخاصة بالمتصفح",
                "isCorrect": false,
                "explanation": "لا يحتوي على أي بيانات حساسة."
              }
            ]
          }
        ]
      }
    ]
  }
];
