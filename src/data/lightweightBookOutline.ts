// Lightweight course outline for instant navigation, sidebar, and progress tracking.
// Detailed lesson chapters are loaded dynamically per part on demand.
import { Part } from "../types";

export const lightweightBookParts: Part[] = [
  {
    "id": 1,
    "title": "الجزء الأول: المتغيرات والأنواع",
    "subtitle": "تخزين البيانات والعمليات الأساسية",
    "description": "مدخل لعالم البرمجة، التعامل مع الـ Console والمحرر، الحسابات وميزانية الطالب، الاختيار الدقيق بين let وconst، والأنواع الأساسية.",
    "iconName": "Box",
    "bugHunter": {
      "id": "bug-part-1",
      "partId": 1,
      "title": "كويز: صندوق أم خزنة؟",
      "context": "الكود ده لازم يحسب الدرجة النهائية لطالب بعد إضافة 5 درجات بونص، لكن عند تشغيله يظهر خطأ برمجي!",
      "problemCode": "const studentName = \"مصطفى\";\nconst finalScore = 85;\nfinalScore = finalScore + 5;\nconsole.log(studentName + \" - الدرجة النهائية: \" + finalScore);",
      "bugLineNumber": 3,
      "bugDescription": "محاولة إعادة إسناد قيمة جديدة لمتغير معرّف بـ const.",
      "whyItHappens": "الكلمة المفتاحية const تمنع إعادة إسناد المتغير (Reassignment) بالرمز =. لتعديل الدرجة بعد ذلك، يجب تعريف finalScore باستخدام let.",
      "fixedCode": "const studentName = \"مصطفى\";\nlet finalScore = 85; // استخدمنا let لأن الدرجة ستتغير\nfinalScore = finalScore + 5;\nconsole.log(studentName + \" - الدرجة النهائية: \" + finalScore);",
      "expectedCorrectOutput": "مصطفى - الدرجة النهائية: 90",
      "hints": [
        "انظر للسطر الثاني: هل يمكن تعديل قيمة المتغير المعرّف بـ const؟",
        "بما أن الدرجة ستزيد بمقدار 5، المتغير يحتاج لإعادة إسناد.",
        "استبدل const بـ let في السطر الثاني للسماح بتعديل القيمة."
      ]
    },
    "chapters": [
      {
        "id": 1,
        "partId": 1,
        "partTitle": "الجزء الأول: المتغيرات والأنواع",
        "title": "الفصل 1: مقدمة في البرمجة وأدواتنا",
        "subtitle": "يعني إيه برمجة؟ وأين نكتب الكود ونرى النتائج؟",
        "summaryPoints": [
          "🎯 أهداف الجزء: طباعة وتتبع النتائج في الـ Console، التمييز بين النصوص والأرقام والمنطق، والاختيار الصحيح بين let وconst.",
          "البرنامج عبارة عن خطوات متسلسلة ينفذها الكمبيوتر من الأعلى إلى الأسفل.",
          "في منصتنا: نكتب الكود في محرر الأكواد، وتظهر النتائج فوراً في شاشة الـ Console.",
          "الأمر console.log(\"...\") يُظهر المخرجات في شاشة الـ Console.",
          "التعليقات (// أو /* */) يقرأها المبرمج فقط ويتجاهلها المفسر تماماً."
        ],
        "contentSections": [],
        "exercises": [],
        "challenge": {
          "id": "ch1-chal",
          "title": "تحدي الفصل 1: بطاقة تعريف الطالب 🪪",
          "prompt": "اكتب برنامجاً يطبع اسمك في سطر، وشعبتك الدراسية في سطر ثانٍ، وهدفك البرمجي في سطر ثالث، مع وضع تعليق توضيحي في بداية الملف.",
          "hint": "استخدم console.log ثلاث مرات متتالية مع // في السطر الأول.",
          "initialCode": "// اكتب تعليقك وأوامر الطباعة هنا...\n",
          "solutionCode": "// بطاقة بيانات الطالب\nconsole.log(\"الاسم: عمر علي\");\nconsole.log(\"الشعبة: علوم رياضية\");\nconsole.log(\"الهدف: تطوير تطبيقات ويب احترافية\");"
        },
        "quiz": [
          {
            "id": "ch1-q1",
            "question": "لو كتبت في الكود الأمر Console.log بحرف C كبير.. إيه اللي هيحصل بالظبط؟",
            "codeSnippet": "Console.log(\"أهلاً يا مبرمج\");",
            "options": [
              {
                "id": "a",
                "text": "الكمبيوتر هيعترض ويطلع خطأ ReferenceError لأن الكلمة غير معرّفة بحرف كبير",
                "isCorrect": true,
                "explanation": "إجابة ممتازة يا صديقي! 👏 لغة JavaScript بتفرّق بدقة بين الحرف الكبير والصغير (Case Sensitive)، فلازم نكتب console بحرف c صغير."
              },
              {
                "id": "b",
                "text": "هيشتغل تمام ويطبع \"أهلاً يا مبرمج\"",
                "isCorrect": false,
                "explanation": "لغة جافاسكريبت حساسة للحروف ولا تتعرف على Console بحرف كبير."
              }
            ]
          },
          {
            "id": "ch1-q2",
            "question": "إيه اللي هيطبع في شاشة الـ Console لما نشغّل الكود ده؟",
            "codeSnippet": "console.log(\"السطر الأول\");\n// console.log(\"السطر الثاني\");\nconsole.log(\"السطر الثالث\");",
            "options": [
              {
                "id": "a",
                "text": "السطر الأول ثم السطر الثالث فقط",
                "isCorrect": true,
                "explanation": "أحسنت يا صديقي! 🎯 علامة // حوّلت السطر الثاني لتعليق، فالكمبيوتر تجاهله تماماً ولم يطبعه."
              },
              {
                "id": "b",
                "text": "الـ 3 أسطر هيتطبعوا كلهم بالترتيب",
                "isCorrect": false,
                "explanation": "السطر الثاني قبله // يعني تعليق (Comment)، والكمبيوتر بيتجاهل التعليقات تماماً."
              }
            ]
          },
          {
            "id": "ch1-q3",
            "question": "إيه وظيفة شاشة الـ Console الأساسية في مرحلة تعلم البرمجة؟",
            "options": [
              {
                "id": "a",
                "text": "معمل تجارب سريع لمتابعة مخرجات الكود وفحص النتائج والأخطاء",
                "isCorrect": true,
                "explanation": "صح جداً يا صديقي! 🌟 الـ Console شاشتك التفاعلية لمتابعة كل صغيرة وكبيرة في تنفيذ الكود."
              },
              {
                "id": "b",
                "text": "لحفظ الأكواد في ملفات مضغوطة على القرص الصلب",
                "isCorrect": false,
                "explanation": "الـ Console مخصص لعرض المخرجات وتتبع النتائج وليس لضغط الملفات."
              }
            ]
          }
        ]
      },
      {
        "id": 2,
        "partId": 1,
        "partTitle": "الجزء الأول: المتغيرات والأنواع",
        "title": "الفصل 2: العمليات الحسابية والنصوص",
        "subtitle": "حساب الدرجات والمصروف ودمج العبارات",
        "summaryPoints": [
          "العمليات الحسابية الأساسية: الجمع (+)، الطرح (-)، الضرب (*)، والقسمة (/).",
          "تتبع العمليات أولويات الرياضيات المعتادة: الأقواس تسبق الضرب والقسمة، والضرب والقسمة يسبقان الجمع والطرح.",
          "العامل % يحسب باقي القسمة الصحيحة (Modulo)، وباقي القسمة على 2 يساوي 0 للأرقام الزوجية.",
          "الرمز + يجمع الأرقام حسابياً، لكنه يدمج النصوص معاً (Concatenation) إذا كان أحد الطرفين نصاً."
        ],
        "contentSections": [],
        "exercises": [],
        "challenge": {
          "id": "ch2-chal",
          "title": "تحدي الفصل 2: حاسبة معدل المادة 🧮",
          "prompt": "اكتب كوداً يحسب متوسط درجتي اختبار (44 و 48) عبر جمعهما وقسمتهما على 2، ثم اطبعه بالشكل: \"المعدل: 46\".",
          "hint": "استخدم الأقواس (44 + 48) / 2 قبل الدمج مع النص.",
          "initialCode": "// اكتب كود حساب المتوسط هنا...\n",
          "solutionCode": "console.log(\"المعدل: \" + ((44 + 48) / 2));"
        },
        "quiz": [
          {
            "id": "ch2-q1",
            "question": "يا ترى الكود ده هيطبع إيه بالظبط في شاشة الـ Console؟",
            "codeSnippet": "console.log(\"5\" + 2);",
            "options": [
              {
                "id": "a",
                "text": "\"52\"",
                "isCorrect": true,
                "explanation": "برافو عليك يا صديقي! 🎯 علامة + مع النصوص بتعمل دمج (Concatenation) فبتلزق الرقمين جنب بعض وتطلع النص \"52\"."
              },
              {
                "id": "b",
                "text": "7",
                "isCorrect": false,
                "explanation": "خد بالك! الرقم 5 محطوط بين علامتي تنصيص يعني نص (String)، وعلامة + هتلزقهم مش هتجمعهم."
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
                "explanation": "أحسنت يا صديقي! 👏 3 * 3 = 9، ويتبقى 1 فكة للوصول لـ 10، فباقي القسمة هو 1."
              },
              {
                "id": "b",
                "text": "3",
                "isCorrect": false,
                "explanation": "3 هو ناتج القسمة الصحيح، مش الباقي!"
              }
            ]
          },
          {
            "id": "ch2-q3",
            "question": "ما هو ناتج تنفيذ الكود التالي مع مراعاة الأقواس؟",
            "codeSnippet": "console.log(\"المجموع: \" + (30 + 20));",
            "options": [
              {
                "id": "a",
                "text": "\"المجموع: 50\"",
                "isCorrect": true,
                "explanation": "ممتاز! 👏 الأقواس حسبت (30 + 20 = 50) أولاً كأرقام، ثم دُمج الناتج مع النص."
              },
              {
                "id": "b",
                "text": "\"المجموع: 3020\"",
                "isCorrect": false,
                "explanation": "الأقواس بتجبر الكمبيوتر يجمع الأرقام الأول قبل ما يلصقهم بالنص."
              }
            ]
          }
        ]
      },
      {
        "id": 3,
        "partId": 1,
        "partTitle": "الجزء الأول: المتغيرات والأنواع",
        "title": "الفصل 3: المتغيرات (let و const)",
        "subtitle": "الصندوق الكرتون (let) والخزنة المحمية (const)",
        "summaryPoints": [
          "المتغير صندوق عليه اسم وبداخله قيمة متخزنة في الذاكرة عشان نرجع نستخدمها ونعدلها.",
          "بنستخدم let لما نكون عارفين إننا هنحتاج نغيّر ونسند قيمة جديدة للمتغير (Reassignment).",
          "بنستخدم const لتثبيت ربط الاسم بالقيمة ومنع إعادة الإسناد بالرمز =.",
          "العلامة = معناها \"احسب الطرف اليمين وحطه في الشمال\" وليست المساواة الرياضية.",
          "بنبعد عن var لأنها بتسمح بتكرار نفس الاسم بدون تنبيه وتملك نطاق دالة (Function Scope)."
        ],
        "contentSections": [],
        "exercises": [],
        "challenge": {
          "id": "ch3-chal",
          "title": "تحدي الفصل 3: بطاقة حساب الطالب 💳",
          "prompt": "عرّف ثابتاً باسم studentName برقم جلوس وثابت آخر باسم maxScore = 100، ومتغيراً باسم score = 82، ثم أضف 8 درجات بونص للنتيجة واطبع الإجمالي.",
          "hint": "استخدم const للبيانات الثابتة و let للدرجة القابلة للزيادة.",
          "initialCode": "// اكتب الكود هنا...\n",
          "solutionCode": "const studentName = \"يوسف\";\nconst maxScore = 100;\nlet score = 82;\nscore = score + 8;\nconsole.log(studentName + \": \" + score + \" من \" + maxScore);"
        },
        "quiz": [
          {
            "id": "ch3-q1",
            "question": "إيه الفرق الجوهري الدقيق بين let و const في جافاسكريبت؟",
            "options": [
              {
                "id": "a",
                "text": "const بتمنع إعادة إسناد المتغير بقيمة جديدة بالرمز =، بينما let بتسمح بإعادة الإسناد",
                "isCorrect": true,
                "explanation": "إجابة مظبوطة 100% يا صديقي! 🎯 const بتثبت ربط الاسم، وlet بتسمح بتعديل القيمة."
              },
              {
                "id": "b",
                "text": "const للأرقام فقط و let للنصوص فقط",
                "isCorrect": false,
                "explanation": "الاثنين يقبلوا تخزين أي نوع من البيانات سواء أرقام أو نصوص."
              }
            ]
          },
          {
            "id": "ch3-q2",
            "question": "توقّع إيه اللي هيحصل لما نشغّل الكود ده بالظبط:",
            "codeSnippet": "const maxScore = 100;\nmaxScore = 120;\nconsole.log(maxScore);",
            "options": [
              {
                "id": "a",
                "text": "الكمبيوتر هيطلع خطأ TypeError: Assignment to constant variable",
                "isCorrect": true,
                "explanation": "أحسنت يا صديقي! 👏 لأنك حاولت تسند قيمة جديدة لمتغير اتعرّف بـ const."
              },
              {
                "id": "b",
                "text": "هيطبع 120 عادي ويتجاهل الـ const",
                "isCorrect": false,
                "explanation": "جافاسكريبت بتمنع تعديل ثوابت const وتوقف البرنامج فوراً."
              }
            ]
          },
          {
            "id": "ch3-q3",
            "question": "ليه المبرمجين بيفضلوا استخدام let و const بدل الكلمة القديمة var؟",
            "options": [
              {
                "id": "a",
                "text": "لأن var بتسمح بتكرار نفس الاسم في نفس المكان ونطاقها غير منضبط (Function Scope)",
                "isCorrect": true,
                "explanation": "تحليل هندسي ممتاز! 🌟 لتجنب الأخطاء الصامتة وحماية نطاق المتغيرات."
              },
              {
                "id": "b",
                "text": "لأن var لا تقبل تخزين الأرقام العشرية",
                "isCorrect": false,
                "explanation": "var كانت تقبل جميع أنواع البيانات، لكن مشكلتها في النطاق وإعادة التعريف."
              }
            ]
          }
        ]
      },
      {
        "id": 4,
        "partId": 1,
        "partTitle": "الجزء الأول: المتغيرات والأنواع",
        "title": "الفصل 4: أنواع البيانات والمقارنة الدقيقة",
        "subtitle": "النصوص، الأرقام، الصح والغلط (Boolean)، والسر في الفرق بين == و ===",
        "summaryPoints": [
          "أنواع البيانات الأساسية: string (نص)، number (أرقام)، boolean (صح وغلط true/false)، و undefined / null.",
          "العامل typeof بيكشف نوع أي قيمة في البرنامج.",
          "المقارنة == بتعمل تحويل تلقائي للأنواع (Type Coercion) قبل المقارنة وممكن تسبب مفاجآت.",
          "المقارنة الصارمة === بتفحص القيمة والنوع معاً بدون أي تحويل، وهي الموصى بيها دائماً.",
          "الدوال Number() و String() و Boolean() للتحويل الصريح والواضح بين الأنواع."
        ],
        "contentSections": [],
        "exercises": [],
        "challenge": {
          "id": "ch4-chal",
          "title": "تحدي الفصل 4: مدقق بيانات بطاقة الطالب 🔍",
          "prompt": "لديك متغيران: studentGrade = \"92\" (كنص) و passingGrade = 60 (كرقم). اكتب كود يحول الدرجة لرقم ويفحص هل الطالب ناجح (درجته >= درجة النجاح) ويطبع النتيجة المنطقية وتصنيف نوعها.",
          "hint": "استخدم Number() ثم قارن بـ >= وافحص النوع بـ typeof.",
          "initialCode": "const studentGrade = \"92\";\nconst passingGrade = 60;\n// اكتب كود الفحص والتحقق هنا...\n",
          "solutionCode": "const studentGrade = \"92\";\nconst passingGrade = 60;\nconst isPassed = Number(studentGrade) >= passingGrade;\nconsole.log(\"حالة النجاح: \" + isPassed);\nconsole.log(\"نوع النتيجة: \" + typeof isPassed);"
        },
        "quiz": [
          {
            "id": "ch4-q1",
            "question": "ليه المقارنة (10 == \"10\") بتدي true بينما (10 === \"10\") بتدي false؟",
            "options": [
              {
                "id": "a",
                "text": "لأن == بتعمل تحويل تلقائي للأنواع قبل المقارنة، بينما === بتفحص النوع والقيمة معاً",
                "isCorrect": true,
                "explanation": "تحليل دقيق وممتاز يا صديقي! 👏 المساواة الصارمة تمنع التحويل التلقائي وتضمن تطابق النوع."
              },
              {
                "id": "b",
                "text": "لأن === مخصصة للأرقام العشرية فقط",
                "isCorrect": false,
                "explanation": "المقارنتان تعملان مع كافة أنواع البيانات."
              }
            ]
          },
          {
            "id": "ch4-q2",
            "question": "يا ترى ناتج typeof (\"2026\") هيطلع إيه في الـ Console؟",
            "codeSnippet": "console.log(typeof (\"2026\"));",
            "options": [
              {
                "id": "a",
                "text": "\"string\"",
                "isCorrect": true,
                "explanation": "صح جداً! 🎉 طالما الرقم محطوط بين علامات تنصيص فنوعه string."
              },
              {
                "id": "b",
                "text": "\"number\"",
                "isCorrect": false,
                "explanation": "لو كان بدون علامات تنصيص 2026 كان هيبقى number."
              }
            ]
          },
          {
            "id": "ch4-q3",
            "question": "لو عندك const input = \"100\"; وعايز تجمعه مع 50 كأرقام، إيه الكود الصح؟",
            "options": [
              {
                "id": "a",
                "text": "Number(input) + 50",
                "isCorrect": true,
                "explanation": "ممتاز! 👏 دالة Number() بتحول النص لرقم حسابي حقيقي فيطلع الناتج 150."
              },
              {
                "id": "b",
                "text": "input + 50",
                "isCorrect": false,
                "explanation": "الكود ده هيلزقهم في بعض ويطلع \"10050\" كنص!"
              }
            ]
          }
        ]
      },
      {
        "id": 5,
        "partId": 1,
        "partTitle": "الجزء الأول: المتغيرات والأنواع",
        "title": "الفصل 5: مراجعة تحليلية وتوقع الناتج",
        "subtitle": "فكّر، توقّع المخرجات، واشرح السبب كمهندس برمجيات شاطر",
        "summaryPoints": [
          "مراجعة شاملة لجميع مفاهيم الجزء الأول قبل ما ندخل في الشروط والقرارات.",
          "تدريب التتبع الذهني للكود خطوة بخطوة وتوقع الناتج قبل الضغط على Run.",
          "فهم آلية عمل الذاكرة والأنواع بيحميك من أي أخطاء في المشاريع الحقيقية."
        ],
        "contentSections": [],
        "exercises": [],
        "challenge": {
          "id": "ch5-chal",
          "title": "تحدي ختام الجزء الأول: بطاقة التقرير المدرسي الشامل 🎓",
          "prompt": "اكتب برنامج متكامل فيه: اسم الطالب (ثابت)، والمرحلة الدراسية (ثابت)، وثلاث درجات للمواد: رياضيات 48، فيزياء 45، كيمياء 47. احسب المجموع من 150 والنسبة المئوية، واطبع تقرير منسق بالكامل.",
          "hint": "استخدم const للبيانات الثابتة، واحسب المجموع والنسبة المئوية باستخدام الأقواس.",
          "initialCode": "// اكتب برنامج التقرير المدرسي الشامل هنا...\n",
          "solutionCode": "const studentName = \"حسام محمود\";\nconst gradeLevel = \"ثانية بكالوريا\";\nconst math = 48;\nconst physics = 45;\nconst chemistry = 47;\n\nconst totalScore = math + physics + chemistry;\nconst percentage = (totalScore / 150) * 100;\n\nconsole.log(\"=== تقرير درجات الطالب ===\");\nconsole.log(\"الاسم: \" + studentName);\nconsole.log(\"المرحلة: \" + gradeLevel);\nconsole.log(\"المجموع الكلي: \" + totalScore + \" من 150\");\nconsole.log(\"النسبة المئوية: \" + percentage + \"%\");"
        },
        "quiz": [
          {
            "id": "ch5-q1",
            "question": "لو عندك الكود ده، يا ترى إيه الناتج والتفسير العلمي الصح؟",
            "codeSnippet": "let a = 5;\nconst b = 10;\na = a + b;\nconsole.log(a);",
            "options": [
              {
                "id": "a",
                "text": "15، لأن المتغير a متعرف بـ let فبيسمح بإعادة الإسناد وتحديث قيمته بحاصل الجمع",
                "isCorrect": true,
                "explanation": "ممتاز يا صديقي! 👏 let بتسمح بإعادة إسناد المتغير a بشكل طبيعي."
              },
              {
                "id": "b",
                "text": "خطأ TypeError لأن b متعرف بـ const",
                "isCorrect": false,
                "explanation": "الـ const تمنع تعديل b نفسها، لكن يجوز نقرأ قيمتها ونجمعها مع a عادي."
              }
            ]
          },
          {
            "id": "ch5-q2",
            "question": "ما هو ناتج تنفيذ: console.log(typeof (\"2026\" === 2026)) ؟",
            "options": [
              {
                "id": "a",
                "text": "\"boolean\" لأن المقارنة الصارمة بتنتج false، ونوع القيمة دي هو boolean",
                "isCorrect": true,
                "explanation": "رائع جداً يا صديقي! 🎯 ناتج المقارنة false ونوعها boolean."
              },
              {
                "id": "b",
                "text": "\"string\"",
                "isCorrect": false,
                "explanation": "المقارنة بتنتج boolean مش نص."
              }
            ]
          },
          {
            "id": "ch5-q3",
            "question": "توقع ناتج الكود: console.log(5 + \"5\" - 2); مع شرح السبب:",
            "codeSnippet": "console.log(5 + \"5\" - 2);",
            "options": [
              {
                "id": "a",
                "text": "53، لأن 5 + \"5\" تدمج لنص \"55\" أولاً، ثم علامة الطرح - تحول \"55\" لرقم وتطرح 2",
                "isCorrect": true,
                "explanation": "تحليل عبقري يا صديقي! 👏 الجمع أولاً أخرج النص \"55\"، ثم الطرح لا يدمج نصوصاً فحوّل \"55\" لرقم 55 وطرح 2 فكان الناتج 53."
              },
              {
                "id": "b",
                "text": "8",
                "isCorrect": false,
                "explanation": "الجمع الأول التقى بنص فعمل دمج نصوص \"55\"."
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
    "description": "إزاي برنامجك بياخد قراراته الذكية بناءً على الشروط، المعاملات المنطقية (&& و || و !)، وجملة switch المتعددة.",
    "iconName": "GitFork",
    "bugHunter": {
      "id": "bug-part-2",
      "partId": 2,
      "title": "صائد الأخطاء: switch والشرط التائه 🐛",
      "context": "الكود ده المفروض يحدد نسبة الخصم لمشتريات بقيمة 300 جنيه، بس لما نشغله هيطبع \"مفيش خصم\" بالرغم إن المبلغ أكتر من 200!",
      "problemCode": "const total = 300;\nswitch (total) {\n  case total >= 500:\n    console.log(\"خصم 20%\");\n  case total >= 200:\n    console.log(\"خصم 10%\");\n    break;\n  default:\n    console.log(\"مفيش خصم\");\n}",
      "bugLineNumber": 3,
      "bugDescription": "وضع شروط مقارنة (Boolean) جوه case بينما switch بتفحص القيمة 300 مباشرة.",
      "whyItHappens": "في switch (total)، المتغير total قيمته رقمية (300). أما الشروط زي total >= 500 بترجع boolean (false). المقارنة الصارمة بتفحص هل 300 === false؟ لا! هل 300 === true؟ لا! فيروح للـ default فوراً. الحل الصحيح لمقارنات الأكبر والأصغر هو استخدام if و else if.",
      "fixedCode": "const total = 300;\nif (total >= 500) {\n  console.log(\"خصم 20%\");\n} else if (total >= 200) {\n  console.log(\"خصم 10%\");\n} else {\n  console.log(\"مفيش خصم\");\n}",
      "expectedCorrectOutput": "خصم 10%",
      "hints": [
        "هل جملة switch مصممة للمقارنات الأكبر والأصغر (> و <) ولا للقيم الثابتة المحددة؟",
        "ناتج total >= 200 هو true، فهل الرقم 300 يساوي true؟",
        "الحل الأنسب للمقارنات الرقمية هو استخدام if و else if."
      ]
    },
    "chapters": [
      {
        "id": 6,
        "partId": 2,
        "partTitle": "الجزء الثاني: القرارات (if وswitch)",
        "title": "الفصل 6: الشروط واتخاذ القرار (if وelse)",
        "subtitle": "لو الشرط صح نفذ كذا، وغير كده نفذ البديل",
        "summaryPoints": [
          "جملة if بتخلي الكمبيوتر يفكّر ويقرر: لو الشرط true ينفذ الكود، لو false يتخطاه.",
          "جملة else بتمثل الخطة البديلة: كود بيتنفذ حصرياً لو شرط if لم يتحقق.",
          "سلسلة else if بتسمح بفحص احتمالات متعددة ورا بعض بالترتيب، وبتقف فور أول شرط صح.",
          "الترتيب من الأضيق للأوسع مهم جداً عشان الشروط متبلعش بعضها."
        ],
        "contentSections": [],
        "exercises": [],
        "challenge": {
          "id": "ch6-chal",
          "title": "تحدي الفصل 6: رادار فحص السرعة 🚗",
          "prompt": "اكتب كود بمتغير const speed = 95. لو السرعة أكبر من 100 اطبع \"غرامة سرعة\"، لو أكبر من 80 اطبع \"خد بالك\"، غير كده اطبع \"سرعة عادية\".",
          "hint": "رتب الشروط: الأكبر من 100 أولاً ثم الأكبر من 80.",
          "initialCode": "const speed = 95;\n// اكتب كود فحص السرعة باستخدام if و else if هنا...\n",
          "solutionCode": "const speed = 95;\nif (speed > 100) {\n  console.log(\"غرامة سرعة\");\n} else if (speed > 80) {\n  console.log(\"خد بالك\");\n} else {\n  console.log(\"سرعة عادية\");\n}"
        },
        "quiz": [
          {
            "id": "ch6-q1",
            "question": "الكود ده هيطبع إيه في شاشة الـ Console؟",
            "codeSnippet": "let temp = 25;\nif (temp > 30) {\n  console.log(\"الجو حر\");\n} else {\n  console.log(\"الجو لطيف\");\n}",
            "options": [
              {
                "id": "a",
                "text": "الجو لطيف",
                "isCorrect": true,
                "explanation": "برافو عليك يا صديقي! 🎯 لأن الشرط 25 > 30 نتيجته false، فالكمبيوتر راح للبديل وطبع اللي جوه else."
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
            "id": "ch6-q2",
            "question": "لو عندنا كذا else if في الكود، الكمبيوتر بيتعامل معاهم إزاي؟",
            "options": [
              {
                "id": "a",
                "text": "بيفحصهم بالترتيب، وأول شرط يتحقق بينفذه ويتجاهل باقي الشروط تماماً",
                "isCorrect": true,
                "explanation": "صح جداً يا صديقي! 👏 بمجرد ما يلاقي أول شرط صحيح، بينفذ كتلته ويخرج بره بنية if بالكامل."
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
          },
          {
            "id": "ch6-q3",
            "question": "ليه مينفعش نكتب أقواس شروط دائرية ( ) بجانب كلمة else مباشرة؟",
            "options": [
              {
                "id": "a",
                "text": "لأن else تمثل الخطة البديلة التلقائية التي تنفذ عند فشل كافة الشروط السابقة دون شرط خاص",
                "isCorrect": true,
                "explanation": "تحليل ممتاز يا صديقي! 🌟 else معناها \"فيما عدا ذلك\"، وبالتالي لا تحتاج لشرط خاص بها."
              },
              {
                "id": "b",
                "text": "لأن else مخصصة للأرقام فقط",
                "isCorrect": false,
                "explanation": "else تعمل مع كافة أنواع البيانات كمسار بديل."
              }
            ]
          }
        ]
      },
      {
        "id": 7,
        "partId": 2,
        "partTitle": "الجزء الثاني: القرارات (if وswitch)",
        "title": "الفصل 7: المقارنات والمعاملات المنطقية",
        "subtitle": "المعاملات المنطقية: AND (&&)، OR (||)، و NOT (!)",
        "summaryPoints": [
          "أدوات المقارنة (>, <, >=, <=, ===, !==) بترجع قيمة boolean: إما true أو false.",
          "المعامل المنطقي && (AND) صارم: لازم كل الشروط تكون true عشان يديك true.",
          "المعامل المنطقي || (OR) مرن: بيكفيه شرط واحد بس يكون true عشان يديك true.",
          "معامل النفي ! (NOT) بيعكس القيمة: بيخلي true تبقى false والعكس."
        ],
        "contentSections": [],
        "exercises": [],
        "challenge": {
          "id": "ch7-chal",
          "title": "تحدي الفصل 7: قطار الملاهي 🎢",
          "prompt": "اكتب شرطاً واحداً يطبع \"تقدر تركب اللعبة\" فقط إذا كان الطول height >= 140 والعمر age >= 10.",
          "hint": "استخدم علامة && لربط الشرطين معاً.",
          "initialCode": "const height = 150;\nconst age = 12;\n// اكتب شرط فحص الطول height والعمر age هنا...\n",
          "solutionCode": "const height = 150;\nconst age = 12;\nif (height >= 140 && age >= 10) {\n  console.log(\"تقدر تركب اللعبة\");\n}"
        },
        "quiz": [
          {
            "id": "ch7-q1",
            "question": "المعامل المنطقي && (AND) بيرجع true في أنهي حالة بالظبط؟",
            "options": [
              {
                "id": "a",
                "text": "لما كل الشروط المرتبطة به تكون صحيحة (true) معاً",
                "isCorrect": true,
                "explanation": "صح جداً يا صديقي! 👏 علامة && صارمة.. لازم كل الشروط تكون true عشان تديك true."
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
            "id": "ch7-q2",
            "question": "توقّع ناتج الكود ده هيطبع إيه في الـ Console:",
            "codeSnippet": "const hasWifi = false;\nconst hasData = true;\nconsole.log(hasWifi || hasData);",
            "options": [
              {
                "id": "a",
                "text": "true",
                "isCorrect": true,
                "explanation": "برافو عليك يا صديقي! 🎯 علامة || (OR) بيكفيها إن طرف واحد بس يكون true عشان ترجعلك true."
              },
              {
                "id": "b",
                "text": "false",
                "isCorrect": false,
                "explanation": "كانت هتبقى false لو كان الطرفان كلاهما false."
              },
              {
                "id": "c",
                "text": "Error",
                "isCorrect": false,
                "explanation": "المعاملات المنطقية ترجع قيم boolean بصورة طبيعية تماماً."
              }
            ]
          },
          {
            "id": "ch7-q3",
            "question": "ما هو ناتج التعبير: !false في لغة JavaScript؟",
            "codeSnippet": "console.log(!false);",
            "options": [
              {
                "id": "a",
                "text": "true",
                "isCorrect": true,
                "explanation": "ممتاز يا صديقي! 🌟 علامة النفي ! تعكس القيمة المنطقية فتحول false إلى true."
              },
              {
                "id": "b",
                "text": "false",
                "isCorrect": false,
                "explanation": "علامة ! تعكس القيمة ولا تبقيها كما هي."
              }
            ]
          }
        ]
      },
      {
        "id": 8,
        "partId": 2,
        "partTitle": "الجزء الثاني: القرارات (if وswitch)",
        "title": "الفصل 8: جملة switch وقائمة الاختيارات",
        "subtitle": "قائمة الاختيارات المنظمة، وحذارِ من الـ Fall-through!",
        "summaryPoints": [
          "جملة switch بديل أنيق ومنظم لسلسلة if..else if لما بنقارن متغير واحد بقيم محددة وثابتة.",
          "كل حالة بتبدأ بكلمة case بعدها القيمة ونقطتان (:).",
          "كلمة break إجبارية في نهاية كل حالة لتوقيف التنفيذ ومنع التسريب والتداخل (Fall-through).",
          "كلمة default بتشتغل كخطة بديلة لو مفيش أي حالة من الحالات تطابقت."
        ],
        "contentSections": [],
        "exercises": [],
        "challenge": {
          "id": "ch8-chal",
          "title": "تحدي الفصل 8: محول أرقام الأشهر 📅",
          "prompt": "اكتب جملة switch لمتغير const month = 3؛ يطبع: 1 = \"يناير\"، 2 = \"فبراير\"، 3 = \"مارس\"، وغير ذلك \"شهر مش معروف\". لا تنسَ break!",
          "hint": "ضع break بعد كل شهر، و default في النهاية.",
          "initialCode": "const month = 3;\n// اكتب جملة switch لفحص رقم الشهر month هنا...\n",
          "solutionCode": "const month = 3;\nswitch (month) {\n  case 1:\n    console.log(\"يناير\");\n    break;\n  case 2:\n    console.log(\"فبراير\");\n    break;\n  case 3:\n    console.log(\"مارس\");\n    break;\n  default:\n    console.log(\"شهر مش معروف\");\n}"
        },
        "quiz": [
          {
            "id": "ch8-q1",
            "question": "لو نسينا نحط كلمة break; جوه واحدة من الـ cases في switch.. إيه اللي هيحصل؟",
            "options": [
              {
                "id": "a",
                "text": "الكمبيوتر هيستمر وينفذ الحالات اللي بعدها رغماً عنها (Fall-through)",
                "isCorrect": true,
                "explanation": "ممتاز يا صديقي! 💡 ده سلوك اسمه Fall-through، عشان كده بنحط break عشان نقفل الحالة ونخرج."
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
                "explanation": "بالعكس، هيفضل شغال وينفذ الأسطر اللي وراها."
              }
            ]
          },
          {
            "id": "ch8-q2",
            "question": "إيه فايدة كتلة default جوه جملة switch؟",
            "options": [
              {
                "id": "a",
                "text": "تتنفذ لو مفيش أي case من الحالات السابقة تطابقت مع القيمة",
                "isCorrect": true,
                "explanation": "أحسنت يا صديقي! 👏 default بتلعب نفس دور else الأخيرة في جمل if."
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
          },
          {
            "id": "ch8-q3",
            "question": "نوع المقارنة التي تُجريها switch داخلياً بين المتغير وقيم case هي:",
            "options": [
              {
                "id": "a",
                "text": "مقارنة صارمة (===) تفحص القيمة والنوع معاً دون أي تحويل ضمني",
                "isCorrect": true,
                "explanation": "إجابة دقيقة وصحيحة 100% يا صديقي! 🎯 لذلك الرقم 1 لا يطابق النص \"1\" داخل case."
              },
              {
                "id": "b",
                "text": "مقارنة عادية (==) تحول النصوص إلى أرقام تلقائياً",
                "isCorrect": false,
                "explanation": "switch تعتمد المقارنة الصارمة === فقط."
              }
            ]
          }
        ]
      },
      {
        "id": 9,
        "partId": 2,
        "partTitle": "الجزء الثاني: القرارات (if وswitch)",
        "title": "الفصل 9: مراجعة تحليلية وتتبع شجرة القرارات",
        "subtitle": "تتبع مسار الشروط المعقدة والمتداخلة كمهندس برمجيات محترف",
        "summaryPoints": [
          "مراجعة شاملة لجميع أنماط اتخاذ القرار في الجزء الثاني قبل الانتقال للحلقات التكرارية.",
          "تدريب التتبع الذهني لشجرة القرارات (Decision Tracing) وفحص مسارات التنفيذ.",
          "فهم أسبقية المعاملات المنطقية: ! أولاً، ثم &&، ثم ||."
        ],
        "contentSections": [],
        "exercises": [],
        "challenge": {
          "id": "ch9-chal",
          "title": "تحدي ختام الجزء الثاني: نظام تصنيف رخص القيادة 🪪",
          "prompt": "لديك متغيران: const age = 20 و const hasPassedMedical = true. اكتب كود يفحص: إذا كان العمر >= 18 واجتاز الفحص الطبي اطبع \"مؤهل لاستخراج الرخصة\"، وإذا كان العمر >= 18 ولم يجتز الفحص اطبع \"محتاج فحص طبي\"، غير ذلك اطبع \"السن غير قانوني\".",
          "hint": "استخدم if مع && ثم else if ثم else.",
          "initialCode": "const age = 20;\nconst hasPassedMedical = true;\n// اكتب نظام تصنيف الرخصة هنا...\n",
          "solutionCode": "const age = 20;\nconst hasPassedMedical = true;\n\nif (age >= 18 && hasPassedMedical) {\n  console.log(\"مؤهل لاستخراج الرخصة\");\n} else if (age >= 18 && !hasPassedMedical) {\n  console.log(\"محتاج فحص طبي\");\n} else {\n  console.log(\"السن غير قانوني\");\n}"
        },
        "quiz": [
          {
            "id": "ch9-q1",
            "question": "ما هو ناتج تنفيذ: console.log(!true || false && true)؟",
            "codeSnippet": "console.log(!true || false && true);",
            "options": [
              {
                "id": "a",
                "text": "false، لأن !true = false، و false && true = false، و false || false = false",
                "isCorrect": true,
                "explanation": "تحليل عبقري وممتاز يا صديقي! 👏 تم مراعاة أسبقية النفي ثم AND ثم OR."
              },
              {
                "id": "b",
                "text": "true",
                "isCorrect": false,
                "explanation": "كافة الأطراف تنتج false في النهاية."
              }
            ]
          },
          {
            "id": "ch9-q2",
            "question": "لو عندك جملة if (x > 10) وجواها if (y > 5)، دي بتكافئ منطقياً إيه؟",
            "options": [
              {
                "id": "a",
                "text": "if (x > 10 && y > 5)",
                "isCorrect": true,
                "explanation": "ممتاز يا صديقي! 🌟 الشروط المتداخلة تتطلب تحقق الشرطين معاً فتطابق المعامل &&."
              },
              {
                "id": "b",
                "text": "if (x > 10 || y > 5)",
                "isCorrect": false,
                "explanation": "المعامل || يكتفي بشرط واحد، بينما الشروط المتداخلة تتطلب الشرطين معاً."
              }
            ]
          },
          {
            "id": "ch9-q3",
            "question": "في سلسلة if..else if، متى نستخدم switch كبديل أفضل؟",
            "options": [
              {
                "id": "a",
                "text": "عند فحص متغير واحد محدد مقابل قائمة من القيم الثابتة المتطابقة بدقة",
                "isCorrect": true,
                "explanation": "إجابة صحيحة 100% يا صديقي! 🎯 لتنظيم الكود ومنع التكرار."
              },
              {
                "id": "b",
                "text": "عند فحص مجالات النطاقات الرقمية مثل x > 100 و x < 200",
                "isCorrect": false,
                "explanation": "المجالات الرقمية تناسبها if و else if وليس switch."
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
    "subtitle": "السير الدوّار اللي بيكرر الشغلانة بالمللي",
    "description": "إزاي تخلي الكمبيوتر يكرر أي عملية آلاف المرات في جزء من الثانية بحلقات for و while وتتبع دوران العدادات.",
    "iconName": "Repeat",
    "bugHunter": {
      "id": "bug-part-3",
      "partId": 3,
      "title": "صائد الأخطاء: فخ الحلقة اللانهائية 🐛",
      "context": "الكود ده المفروض يطبع الأرقام الزوجية من 1 لـ 10، لكن لما بتشغله المتصفح بيهنج ومش بيوقف خالص!",
      "problemCode": "let n = 1;\nwhile (n <= 10) {\n  if (n % 2 === 0) {\n    console.log(n);\n  }\n}",
      "bugLineNumber": 2,
      "bugDescription": "نسيان زيادة عداد الحلقة n++ في كل دورة، مما يجعل n تساوي 1 دائماً.",
      "whyItHappens": "العداد n بدأ بقيمة 1، والشرط (n <= 10) بيفضل true على طول لأن قيمة n مبتزدش أبداً جوه الحلقة! بالتالي الحلقة بتلف للأبد (Infinite Loop) وتستهلك المعالج وتجمّد الصفحة. الحل هو كتابة n++ في نهاية كل لفة.",
      "fixedCode": "let n = 1;\nwhile (n <= 10) {\n  if (n % 2 === 0) {\n    console.log(n);\n  }\n  n++; // زيادة العداد في كل دورة\n}",
      "expectedCorrectOutput": "2\n4\n6\n8\n10",
      "hints": [
        "هل قيمة n بتتغير في كل لفة داخل حلقة while؟",
        "لو قيمة n مابتزدش، هل شرط (n <= 10) هيتحول لـ false في أي وقت؟",
        "أضف سطر الزيادة n++; في نهاية جسم الحلقة."
      ]
    },
    "chapters": [
      {
        "id": 10,
        "partId": 3,
        "partTitle": "الجزء الثالث: التكرار (الحلقات)",
        "title": "الفصل 10: حلقة for (العداد الآلي)",
        "subtitle": "العداد المنظم: بداية، شرط، وزيادة في سطر واحد",
        "summaryPoints": [
          "الحلقات التكرارية (Loops) بتوفر كتابة نفس الكود عشرات المرات وتخليه يدور بعداد آلي.",
          "حلقة for بتتكون من 3 أقسام بين قوسين: البداية (Initialization)، الشرط (Condition)، والخطوة (Update).",
          "المتغير i هو أشهر اسم لعداد في تاريخ البرمجة (اختصار لـ index أو iterator).",
          "نقدر نعد تصاعدياً (i++)، تنازلياً (i--)، أو بقفزات مخصصة (i += 2)."
        ],
        "contentSections": [],
        "exercises": [],
        "challenge": {
          "id": "ch10-chal",
          "title": "تحدي الفصل 10: جدول الضرب المصغر ✖️",
          "prompt": "اكتب حلقة for تبدأ من i = 1 وتتوقف عند 5؛ في كل دورة تطبع حاصل ضرب i في 3 بصيغة: \"3 * i = result\".",
          "hint": "استخدم console.log(\"3 * \" + i + \" = \" + (i * 3)); داخل الحلقة.",
          "initialCode": "// اكتب حلقة for لطباعة مضاعفات الرقم 3 حتى 5 هنا بنفسك...\n",
          "solutionCode": "for (let i = 1; i <= 5; i++) {\n  console.log(\"3 * \" + i + \" = \" + (i * 3));\n}"
        },
        "quiz": [
          {
            "id": "ch10-q1",
            "question": "الحلقة دي هتتنفذ كام مرة بالظبط؟",
            "codeSnippet": "for (let i = 0; i < 4; i++) {\n  console.log(i);\n}",
            "options": [
              {
                "id": "a",
                "text": "4 مرات (عند i = 0 و 1 و 2 و 3)",
                "isCorrect": true,
                "explanation": "صح جداً يا صديقي! 👏 لأننا بدأنا من الصفر، والأرقام الأقل من 4 هي أربعة أرقام بالظبط."
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
            "id": "ch10-q2",
            "question": "إيه وظيفة الجزء التالت في جملة for (زي i++)؟",
            "options": [
              {
                "id": "a",
                "text": "تعديل وتحديث قيمة العداد في نهاية كل دورة عشان نقرب لشرط النهاية",
                "isCorrect": true,
                "explanation": "ممتاز يا صديقي! 🎯 خطوة التحديث هي اللي بتضمن إن الحلقة تتقدم ومتفضلش واقفة في مكانها."
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
          },
          {
            "id": "ch10-q3",
            "question": "لو كتبنا حلقة بالصيغة: for (let i = 5; i > 0; i -= 2) الأرقام المطبوعة هتكون:",
            "codeSnippet": "for (let i = 5; i > 0; i -= 2) {\n  console.log(i);\n}",
            "options": [
              {
                "id": "a",
                "text": "5 ثم 3 ثم 1",
                "isCorrect": true,
                "explanation": "إجابة دقيقة وصحيحة 100% يا صديقي! 🌟 نبدأ بـ 5، نطرح 2 فتصبح 3، نطرح 2 فتصبح 1، ثم تصبح -1 فيتوقف الشرط."
              },
              {
                "id": "b",
                "text": "5 ثم 4 ثم 3 ثم 2 ثم 1",
                "isCorrect": false,
                "explanation": "الخطوة هنا i -= 2 تطرح 2 في كل لفة وليس 1."
              },
              {
                "id": "c",
                "text": "5 فقط",
                "isCorrect": false,
                "explanation": "الحلقة تستمر طالما i أكبر من الصفر."
              }
            ]
          }
        ]
      },
      {
        "id": 11,
        "partId": 3,
        "partTitle": "الجزء الثالث: التكرار (الحلقات)",
        "title": "الفصل 11: حلقة while و do...while",
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
          "id": "ch11-chal",
          "title": "تحدي الفصل 11: عداد العملات الزوجية 🪙",
          "prompt": "اكتب حلقة while تبدأ من let coins = 5؛ وكل دورة تزود coins بواحد وتطبع بجانبها \"زوجي\" أو \"فردي\" حتى تصل لـ 8.",
          "hint": "افحص (coins % 2 === 0) داخل الحلقة ولا تنسَ coins++ في نهاية كل دورة.",
          "initialCode": "let coins = 5;\n// اكتب حلقة while من coins = 5 حتى 8 مع فحص الزوجي والفردي هنا بنفسك...\n",
          "solutionCode": "let coins = 5;\nwhile (coins <= 8) {\n  if (coins % 2 === 0) {\n    console.log(coins + \" زوجي\");\n  } else {\n    console.log(coins + \" فردي\");\n  }\n  coins++;\n}"
        },
        "quiz": [
          {
            "id": "ch11-q1",
            "question": "إيه اللي ممكن يسبب حلقة تكرار لانهائية (Infinite Loop) في while؟",
            "options": [
              {
                "id": "a",
                "text": "لو نسينا نعدل المتغير جوه الحلقة والشرط فضل دائماً true",
                "isCorrect": true,
                "explanation": "برافو عليك يا صديقي! ⚠️ لو الشرط مبيوصلش لـ false أبداً، الكمبيوتر هيفضل يلف ويهنج المتصفح."
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
            "id": "ch11-q2",
            "question": "إيه الفرق الرئيسي بين while و do..while؟",
            "options": [
              {
                "id": "a",
                "text": "حلقة do..while مضمون تتنفذ مرة واحدة على الأقل حتى لو الشرط غلط من الأول",
                "isCorrect": true,
                "explanation": "ممتاز يا صديقي! 💡 لأن do بتنفذ الكود الأول وبعدين تفحص الشرط في الآخر."
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
          },
          {
            "id": "ch11-q3",
            "question": "أمر continue داخل الحلقات وظيفته إيه بالظبط؟",
            "options": [
              {
                "id": "a",
                "text": "تخطي ما تبقى من اللفة الحالية والقفز فوراً للفة التالية",
                "isCorrect": true,
                "explanation": "أحسنت يا صديقي! 🎯 continue بتفوّت اللفة الحالية دون إيقاف الحلقة بالكامل."
              },
              {
                "id": "b",
                "text": "إنهاء الحلقة بالكامل والخروج منها",
                "isCorrect": false,
                "explanation": "إنهاء الحلقة والخروج منها ده دور كلمة break."
              },
              {
                "id": "c",
                "text": "إعادة تشغيل البرنامج من أول سطر",
                "isCorrect": false,
                "explanation": "continue تخص الدورة الحالية للحلقة فقط."
              }
            ]
          }
        ]
      },
      {
        "id": 12,
        "partId": 3,
        "partTitle": "الجزء الثالث: التكرار (الحلقات)",
        "title": "الفصل 12: مراجعة تحليلية وتتبع دوران الحلقات",
        "subtitle": "تتبع قيم العدادات ونمط الحصالة (Accumulator Pattern)",
        "summaryPoints": [
          "المراجعة الشاملة لكافة أنماط التكرار في الجزء الثالث.",
          "فهم نمط الحصالة (Accumulator Pattern) لتجميع القيم وحساب المجموع والضرب.",
          "التتبع الذهني لقيم المتغيرات خطوة بخطوة عند استخدام break و continue."
        ],
        "contentSections": [],
        "exercises": [],
        "challenge": {
          "id": "ch12-chal",
          "title": "تحدي ختام الجزء الثالث: عداد النقاط التراكمي 🎯",
          "prompt": "اكتب حلقة تحسب مجموع الأرقام الزوجية من 1 إلى 10 باستخدام نمط الحصالة، واطبع في النهاية: \"مجموع الأرقام الزوجية: 30\".",
          "hint": "عرّف let evenSum = 0؛ واستخدم for من 1 لـ 10 مع شرط (i % 2 === 0).",
          "initialCode": "// اكتب كود حساب مجموع الأرقام الزوجية بنمط الحصالة هنا...\n",
          "solutionCode": "let evenSum = 0;\nfor (let i = 1; i <= 10; i++) {\n  if (i % 2 === 0) {\n    evenSum += i;\n  }\n}\nconsole.log(\"مجموع الأرقام الزوجية: \" + evenSum);"
        },
        "quiz": [
          {
            "id": "ch12-q1",
            "question": "لو عندك الكود التالي، ما هي القيمة النهائية لـ counter؟",
            "codeSnippet": "let counter = 0;\nfor (let i = 1; i <= 5; i++) {\n  if (i === 3) break;\n  counter += i;\n}\nconsole.log(counter);",
            "options": [
              {
                "id": "a",
                "text": "3 (لأنه جمع 1 + 2 ثم كسر الحلقة فوراً عند 3)",
                "isCorrect": true,
                "explanation": "تحليل عبقري وممتاز يا صديقي! 👏 عند i = 1 أضاف 1، عند i = 2 أضاف 2 (المجموع 3)، وعند i = 3 كسر الحلقة فوراً قبل الجمع."
              },
              {
                "id": "b",
                "text": "6",
                "isCorrect": false,
                "explanation": "كانت هتبقى 6 لو كان الجمع بيتم قبل فحص break."
              },
              {
                "id": "c",
                "text": "15",
                "isCorrect": false,
                "explanation": "أمر break أوقف الحلقة ومنعها من إكمال اللفات لـ 5."
              }
            ]
          },
          {
            "id": "ch12-q2",
            "question": "ليه بنعرف متغير الحصالة (مثل let sum = 0) قبل حلقة for وليس بداخلها؟",
            "options": [
              {
                "id": "a",
                "text": "عشان قيمته متتصفرش مع كل دورة ونقدر نستخدم الناتج النهائي بعد انتهاء الحلقة",
                "isCorrect": true,
                "explanation": "إجابة صحيحة 100% يا صديقي! 🌟 المتغير المعرف بالداخل يموت مع نهاية كل لفة."
              },
              {
                "id": "b",
                "text": "لأن جافاسكريبت تمنع تعريف متغيرات داخل الحلقات",
                "isCorrect": false,
                "explanation": "مسموح تعريف متغيرات بالداخل لكنها تصبح محلية تتجدد في كل لفة."
              }
            ]
          },
          {
            "id": "ch12-q3",
            "question": "كم مرة سيطبع الكود التالي كلمة \"مرحباً\"؟",
            "codeSnippet": "let x = 10;\nwhile (x < 10) {\n  console.log(\"مرحباً\");\n  x++;\n}",
            "options": [
              {
                "id": "a",
                "text": "0 (ولا مرة، لأن الشرط 10 < 10 نتيجته false من البداية)",
                "isCorrect": true,
                "explanation": "برافو عليك يا صديقي! 🎯 حلقة while تفحص الشرط أولاً، ولأن 10 ليست أقل من 10، لم تدخل الحلقة إطلاقاً."
              },
              {
                "id": "b",
                "text": "مرة واحدة",
                "isCorrect": false,
                "explanation": "كانت ستطبع مرة واحدة لو كانت حلقة do..while."
              },
              {
                "id": "c",
                "text": "10 مرات",
                "isCorrect": false,
                "explanation": "الشرط لم يتحقق من اللحظة الأولى."
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
    "subtitle": "الخلّاط السحري اللي بيوفر وقتك ومجهودك",
    "description": "تنظيم الكود وإعادة استخدامه عبر الدوال، المدخلات (Parameters)، القيمة المرتجعة (return)، ونطاق المتغيرات (Scope)، وبناء لعبة التخمين الذكية.",
    "iconName": "Cpu",
    "bugHunter": {
      "id": "bug-part-4",
      "partId": 4,
      "title": "كويز: لغز الخصم التائه (الطباعة أم الإرجاع؟)",
      "context": "الكود ده المفروض يحسب سعر المنتج بعد خصم 50% ويفحص لو كان العرض قوياً، لكنه لا يستخدم ناتج الحساب في الشرط بسبب غياب return!",
      "problemCode": "function applyDiscount(price, discountPercent) {\n  const discountAmount = (price * discountPercent) / 100;\n  console.log(price - discountAmount);\n}\n\nconst finalPrice = applyDiscount(200, 50);\n\nif (finalPrice < 150) {\n  console.log(\"عرض قوي جداً! 🛒🔥\");\n} else {\n  console.log(\"عرض عادي أو غير صالح\");\n}",
      "bugLineNumber": 3,
      "bugDescription": "الدالة قامت بطباعة السعر بـ console.log بدلاً من إرجاعه بـ return، فكانت قيمة finalPrice هي undefined.",
      "whyItHappens": "الدالة التي لا تحتوي على أمر return صريح ترجع تلقائياً undefined. المتغير finalPrice استلم undefined، ومقارنة undefined < 150 تنتج false دائماً، فيتجه الكود لـ else!",
      "fixedCode": "function applyDiscount(price, discountPercent) {\n  const discountAmount = (price * discountPercent) / 100;\n  return price - discountAmount; // رجّع القيمة للمستدعي في إيده!\n}\n\nconst finalPrice = applyDiscount(200, 50);\n\nif (finalPrice < 150) {\n  console.log(\"عرض قوي جداً! 🛒🔥\");\n} else {\n  console.log(\"عرض عادي أو غير صالح\");\n}",
      "expectedCorrectOutput": "عرض قوي جداً! 🛒🔥",
      "hints": [
        "ما هي القيمة الفعلية للمتغير finalPrice بعد استدعاء الدالة؟",
        "هل الدالة تسلّم ناتجاً بـ return أم تكتفي بالطباعة على الشاشة فقط؟",
        "استبدل console.log داخل الدالة بأمر return لتسليم الناتج."
      ]
    },
    "chapters": [
      {
        "id": 13,
        "partId": 4,
        "partTitle": "الجزء الرابع: الدوال",
        "title": "الفصل 13: الدوال الجاهزة (Math)",
        "subtitle": "صندوق العدة الرياضي والأرقام العشوائية",
        "summaryPoints": [
          "كائن Math هو صندوق أدوات جاهز مدمج في JavaScript بدون الحاجة لتثبيت أي مكتبات خارجية.",
          "عائلة التقريب الثلاثية: Math.round (التقريب العادل)، Math.floor (النزول للأرض وقطع الكسر)، Math.ceil (الطلوع للسقف دائماً).",
          "دالتا Math.max و Math.min لمعرفة أكبر وأصغر قيمة بلمح البصر.",
          "الدالة السحرية Math.random() لتوليد أرقام عشوائية ومعادلة المدى الذهبية لحجر النرد والألعاب."
        ],
        "contentSections": [],
        "exercises": [],
        "challenge": {
          "id": "ch13-chal",
          "title": "وريني شطارتك 🧠: قرعة رمي العملة (ملك أو كتابة)",
          "prompt": "اكتب كوداً يولد رقماً عشوائياً صحيحاً بين 1 و 2؛ إذا كان الرقم 1 اطبع \"ملك 👑\"، وإذا كان 2 اطبع \"كتابة 🦅\".",
          "hint": "استخدم Math.floor(Math.random() * 2) + 1 ثم افحص القيمة بجملة if/else.",
          "initialCode": "// اكتب كود رمي العملة المعدنية العشوائية هنا بنفسك...\n",
          "solutionCode": "const coin = Math.floor(Math.random() * 2) + 1;\nif (coin === 1) {\n  console.log(\"ملك 👑\");\n} else {\n  console.log(\"كتابة 🦅\");\n}"
        },
        "quiz": [
          {
            "id": "ch13-q1",
            "question": "الدالة Math.floor(8.99) هترجع إيه بالظبط يا صديقي؟",
            "options": [
              {
                "id": "a",
                "text": "8",
                "isCorrect": true,
                "explanation": "صح جداً وبرافو عليك يا صديقي! 👏 Math.floor بتنزل للأرض وتقطع الكسور تماماً بدون ما تبص لقيمتها."
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
            "id": "ch13-q2",
            "question": "عشان نولد رقم عشوائي صحيح بين 1 و 6 (زي حجر النرد)، بنكتب إيه؟",
            "options": [
              {
                "id": "a",
                "text": "Math.floor(Math.random() * 6) + 1",
                "isCorrect": true,
                "explanation": "إجابة عبقرية يا صديقي! 🎲 بنضرب في 6 ونقطع الكسر بـ floor ونزود 1 عشان نبدأ من 1 مش من 0."
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
          },
          {
            "id": "ch13-q3",
            "question": "لو كتبنا Math.ceil(5.001)، النتيجة هتكون إيه؟",
            "options": [
              {
                "id": "a",
                "text": "6 (لأن ceil بتطلع للسقف بمجرد وجود أي كسر مهما كان صغيراً)",
                "isCorrect": true,
                "explanation": "ممتاز جداً يا صديقي! 🌟 كلمة ceil يعني سقف، فأي زيادة عشرية ترفع الرقم للعدد الصحيح التالي فوراً."
              },
              {
                "id": "b",
                "text": "5",
                "isCorrect": false,
                "explanation": "كانت هتبقى 5 لو استخدمنا Math.floor أو Math.round."
              },
              {
                "id": "c",
                "text": "5.1",
                "isCorrect": false,
                "explanation": "Math.ceil ترجع أعداداً صحيحة دائماً."
              }
            ]
          }
        ]
      },
      {
        "id": 14,
        "partId": 4,
        "partTitle": "الجزء الرابع: الدوال",
        "title": "الفصل 14: كتابة دالة (Functions)",
        "subtitle": "الخلّاط السحري: اسم، مدخلات، وتنفيذ",
        "summaryPoints": [
          "الدالة (Function) هي وصفة برمجية بنكتبها مرة واحدة ونستدعيها كل ما نحتاجها بدون تكرار.",
          "بنعلن عن الدالة بكلمة function متبوعة باسمها وأقواس معقوصة { } تحتوي الأوامر.",
          "كتابة الدالة لا تعني تشغيلها؛ لازم نستدعيها بالاسم والأقواس: myFunction().",
          "المعاملات (Parameters) بتسمح للدالة باستقبال بيانات متغيرة في كل استدعاء."
        ],
        "contentSections": [],
        "exercises": [],
        "challenge": {
          "id": "ch14-chal",
          "title": "وريني شطارتك 🧠: دالة مضاعفة الرقم",
          "prompt": "اكتب دالة اسمها doubleNumber تستقبل معاملاً واحداً num وتطبع في الكونسول ضعف الرقم (num * 2). ثم استدعِ الدالة بالرقم 7.",
          "hint": "function doubleNumber(num) { console.log(num * 2); } ثم استدعِ doubleNumber(7);",
          "initialCode": "// اكتب تعريف دالة doubleNumber واستدعاءها بالرقم 7 هنا بنفسك...\n",
          "solutionCode": "function doubleNumber(num) {\n  console.log(num * 2);\n}\ndoubleNumber(7);"
        },
        "quiz": [
          {
            "id": "ch14-q1",
            "question": "ليه لما نكتب function doWork() { console.log(\"done\"); } مفيش حاجة بتطبع في الشاشة؟",
            "options": [
              {
                "id": "a",
                "text": "لأننا فقط عرّفنا الدالة ولم نستدعها بعد باستخدام doWork()",
                "isCorrect": true,
                "explanation": "صح جداً وبرافو عليك يا صديقي! 👏 لازم تنادي الدالة بالاسم والأقواس عشان الكمبيوتر ينفذ اللي جواها."
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
            "id": "ch14-q2",
            "question": "إيه هو الـ Parameter في الدالة يا صديقي؟",
            "options": [
              {
                "id": "a",
                "text": "المتغير اللي بنستقبل بيه المدخلات بين قوسي الدالة أثناء بنائها",
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
                "explanation": "الناتج بيتم إرجاعه بأمر return."
              }
            ]
          },
          {
            "id": "ch14-q3",
            "question": "ما هو الهدف الأساسي من مبدأ DRY (Don't Repeat Yourself)؟",
            "options": [
              {
                "id": "a",
                "text": "تجنب تكرار الكود وتجميعه في دوال قابلة لإعادة الاستخدام بسهولة",
                "isCorrect": true,
                "explanation": "أحسنت يا صديقي! 🎯 تقليل التكرار بيخلي الكود أنظف وأسهل في التعديل والصيانة."
              },
              {
                "id": "b",
                "text": "منع استخدام الحلقات التكرارية",
                "isCorrect": false,
                "explanation": "الحلقات والدوال كلاهما أدوات أساسية لا غنى عنها."
              },
              {
                "id": "c",
                "text": "تسريع تحميل المتصفح فقط",
                "isCorrect": false,
                "explanation": "هو مبدأ تنظيمي وهندسي لبناء كود احترافي."
              }
            ]
          }
        ]
      },
      {
        "id": 15,
        "partId": 4,
        "partTitle": "الجزء الرابع: الدوال",
        "title": "الفصل 15: إرجاع القيم (return)",
        "subtitle": "الخروج بالنتيجة: العصير في الكوباية!",
        "summaryPoints": [
          "أمر return هو اللي بيخلي الدالة تسلّم النتيجة للمستدعي وتصب العصير في الكوباية.",
          "الفرق بين console.log (عرض للمشاهدة فقط) و return (إعطاء ناتج يمكن تخزينه واستخدامه برمجياً).",
          "الدالة التي لا تحتوي على return ترجع تلقائياً undefined.",
          "أمر return يعتبر بوابة خروج فورية؛ أي كود مكتوب بعده داخل الدالة لا ينفذ أبداً (Unreachable Code)."
        ],
        "contentSections": [],
        "exercises": [],
        "challenge": {
          "id": "ch15-chal",
          "title": "وريني شطارتك 🧠: حاسبة مساحة المستطيل",
          "prompt": "اكتب دالة اسمها getArea تقبل معاملي الطول w والعرض h وترجع (return) مساحة المستطيل (w * h). ثم خزن ناتج getArea(5, 4) في متغير واطبعه.",
          "hint": "return w * h; ثم const area = getArea(5, 4); console.log(area);",
          "initialCode": "// اكتب دالة getArea واستدعاءها وطباعة الناتج هنا بنفسك...\n",
          "solutionCode": "function getArea(w, h) {\n  return w * h;\n}\nconst area = getArea(5, 4);\nconsole.log(area);"
        },
        "quiz": [
          {
            "id": "ch15-q1",
            "question": "إيه الفرق الأساسي بين console.log و return داخل الدالة يا صديقي؟",
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
            "id": "ch15-q2",
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
          },
          {
            "id": "ch15-q3",
            "question": "ماذا يحدث لأي سطر كود مكتوب بعد أمر return داخل نفس الدالة؟",
            "options": [
              {
                "id": "a",
                "text": "لن يتم تنفيذه أبداً لأنه كود غير قابل للوصول (Unreachable)",
                "isCorrect": true,
                "explanation": "برافو عليك يا صديقي! 🚪 return بتوقف تنفيذ الدالة وتخرج منها في نفس اللحظة."
              },
              {
                "id": "b",
                "text": "سيتم تنفيذه في الخلفية",
                "isCorrect": false,
                "explanation": "التنفيذ يتوقف كلياً داخل جسم الدالة."
              },
              {
                "id": "c",
                "text": "سيعيد تشغيل الدالة من البداية",
                "isCorrect": false,
                "explanation": "لا علاقة له بإعادة التشغيل."
              }
            ]
          }
        ]
      },
      {
        "id": 16,
        "partId": 4,
        "partTitle": "الجزء الرابع: الدوال",
        "title": "الفصل 16: نطاق المتغيرات (Scope)",
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
          "id": "ch16-chal",
          "title": "وريني شطارتك 🧠: حماية سر اللعبة",
          "prompt": "اكتب دالة اسمها startGame تعرف داخلها متغيراً محلياً const secretCode = 999؛ وتطبع \"اللعبة بدأت 🎮\". تأكد من أن secretCode لا يتسرب خارج نطاق الدالة.",
          "hint": "ضع تعريف المتغير داخل جسم الدالة واستدعِ startGame();",
          "initialCode": "// اكتب دالة startGame مع المتغير المحلي السري هنا بنفسك...\n",
          "solutionCode": "function startGame() {\n  const secretCode = 999;\n  console.log(\"اللعبة بدأت 🎮\");\n}\nstartGame();"
        },
        "quiz": [
          {
            "id": "ch16-q1",
            "question": "لو عرّفنا let x = 10 جوه دالة، وحاولنا نطبع console.log(x) بره الدالة.. إيه اللي هيحصل يا صديقي؟",
            "options": [
              {
                "id": "a",
                "text": "هيطلع خطأ ReferenceError: x is not defined لأن x محلي داخل الدالة فقط",
                "isCorrect": true,
                "explanation": "صح جداً وبرافو عليك! 👏 المتغير المحلي مقفول عليه جوه الأقواس ومحدش بره يقدر يوصله."
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
          },
          {
            "id": "ch16-q2",
            "question": "هل يمكن للدالة قراءة واستخدام متغير عام (Global) تم تعريفه خارجها؟",
            "options": [
              {
                "id": "a",
                "text": "نعم، المتغير العام متاح ومرئي لجميع الدوال والأكواد داخل الملف",
                "isCorrect": true,
                "explanation": "إجابة نموذجية يا صديقي! 🌟 المتغير العام في الصالة متاح لأي أوضة تبص عليه."
              },
              {
                "id": "b",
                "text": "لا، الدوال معزولة تماماً عن العالم الخارجي",
                "isCorrect": false,
                "explanation": "الدوال تقرأ من الخارج للداخل وليس العكس."
              },
              {
                "id": "c",
                "text": "فقط إذا تم تمريره كمعامل parameter",
                "isCorrect": false,
                "explanation": "يمكن قراءته مباشرة حتى بدون تمريره، مع أن التمرير أصح معمارياً."
              }
            ]
          },
          {
            "id": "ch16-q3",
            "question": "ما هو مصطلح Shadowing (حجب المتغيرات) في البرمجة؟",
            "options": [
              {
                "id": "a",
                "text": "عندما يُعرّف متغير محلي بنفس اسم متغير عام فيحجبه داخل نطاقه فقط",
                "isCorrect": true,
                "explanation": "تحليل عبقري وممتاز يا صديقي! 🎯 المتغير المحلي يأخذ الأولوية داخل غرفته ويحجب العام."
              },
              {
                "id": "b",
                "text": "مسح المتغيرات من الذاكرة",
                "isCorrect": false,
                "explanation": "مسح الذاكرة وظيفته Garbage Collector."
              },
              {
                "id": "c",
                "text": "إخفاء الكود عن المستخدم",
                "isCorrect": false,
                "explanation": "Shadowing مصطلح متعلق بتداخل أسماء النطاقات البرمجية."
              }
            ]
          }
        ]
      },
      {
        "id": 17,
        "partId": 4,
        "partTitle": "الجزء الرابع: الدوال",
        "title": "الفصل 17: مشروع صغير ومراجعة الدوال (Guess Game Master)",
        "subtitle": "دمج الشروط والحلقات والدوال في محاكاة ذكية",
        "summaryPoints": [
          "المشاريع البرمجية الحقيقية بتبدأ بالتخطيط المنطقي (Algorithm) قبل كتابة أول سطر كود.",
          "دمج Math.random لتوليد رقم سري مع الشروط والدوال لإدارة قواعد اللعبة.",
          "تصميم دالة فحص التخمين لترجع رسائل وتلميحات واضحة للمستخدم: أكبر، أصغر، أو مبروك الفوز.",
          "تتبع تدفق البيانات واستدعاء الدوال المترابطة خطوة بخطوة."
        ],
        "contentSections": [],
        "exercises": [],
        "challenge": {
          "id": "ch17-chal",
          "title": "وريني شطارتك 🧠: فاحص التخمين الصارم",
          "prompt": "اكتب كوداً يحدد const secret = 6 و const guess = 6؛ فإذا كان guess مساوياً لـ secret يطبع \"مبروك كسبت 🎉\"، وغير ذلك يطبع \"حاول تاني 🔄\".",
          "hint": "if (guess === secret) { console.log(\"مبروك كسبت 🎉\"); } else { console.log(\"حاول تاني 🔄\"); }",
          "initialCode": "// اكتب كود فحص التخمين السري هنا بنفسك...\n",
          "solutionCode": "const secret = 6;\nconst guess = 6;\nif (guess === secret) {\n  console.log(\"مبروك كسبت 🎉\");\n} else {\n  console.log(\"حاول تاني 🔄\");\n}"
        },
        "quiz": [
          {
            "id": "ch17-q1",
            "question": "عشان نعمل لعبة التخمين صح، إيه أفضل ترتيب لمنطق فحص التخمين يا صديقي؟",
            "options": [
              {
                "id": "a",
                "text": "فحص التساوي أولاً (حالة الفوز)، ثم فحص هل الرقم أصغر، ثم البديل أنه أكبر",
                "isCorrect": true,
                "explanation": "صح جداً وبرافو عليك! 👏 بنبدأ بشرط الفوز والانتهاء، ثم نعطي التلميحات المساعدة."
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
          },
          {
            "id": "ch17-q2",
            "question": "ليه بنستخدم return داخل دالة checkGuess بدلاً من console.log المباشر؟",
            "options": [
              {
                "id": "a",
                "text": "عشان نقدر نستقبل النتيجة بره الدالة ونعرضها في واجهة المستخدم أو نتحكم في مجريات اللعبة",
                "isCorrect": true,
                "explanation": "ممتاز جداً يا صديقي! 🎯 الإرجاع بـ return بيعطيك مرونة كاملة في استخدام النتيجة في أي مكان بالبرنامج."
              },
              {
                "id": "b",
                "text": "لأن console.log يوقف تشغيل اللعبة",
                "isCorrect": false,
                "explanation": "console.log لا يوقف البرنامج ولكنه لا يسلم النتيجة برمجياً."
              },
              {
                "id": "c",
                "text": "لأن return يضاعف سرعة المعالج",
                "isCorrect": false,
                "explanation": "السبب معماري وتنظيمي لنقل البيانات."
              }
            ]
          },
          {
            "id": "ch17-q3",
            "question": "لو أردنا توسيع نطاق اللعبة ليصبح بين 1 و 50، كيف نعدل توليد الرقم السري؟",
            "options": [
              {
                "id": "a",
                "text": "Math.floor(Math.random() * 50) + 1",
                "isCorrect": true,
                "explanation": "برافو عليك يا صديقي! 🌟 بنضرب في 50 ونزود 1 ليكون المدى من 1 إلى 50."
              },
              {
                "id": "b",
                "text": "Math.random() * 50",
                "isCorrect": false,
                "explanation": "سيعطي أرقاماً عشرية بكسور."
              },
              {
                "id": "c",
                "text": "Math.floor(Math.random()) + 50",
                "isCorrect": false,
                "explanation": "سيعطي 50 دائماً لأن Math.floor(Math.random()) ينتج 0."
              }
            ]
          }
        ]
      },
      {
        "id": 18,
        "partId": 4,
        "partTitle": "الجزء الرابع: الدوال",
        "title": "الفصل 18: مراجعة تحليلية وتتبع تدفق الدوال (Function Tracing)",
        "subtitle": "تتبع مسار التنفيذ، الدوال المتداخلة، وفخاخ الـ return و Scope",
        "summaryPoints": [
          "التتبع الذهني لمسار تنفيذ الدوال (Call Stack Tracing) ومعرفة ترتيب قفزات المعالج.",
          "تمرير نتائج الدوال كمدخلات لدوال أخرى (Function Composition) وسلسلة الحسابات.",
          "تحليل الأخطاء المنطقية الشائعة: نسيان return، الكود الميت بعد الخروج، وتداخل النطاقات."
        ],
        "contentSections": [],
        "exercises": [],
        "challenge": {
          "id": "ch18-chal",
          "title": "تحدي ختام الدوال: محول العملات وضريبة الخدمة 💱",
          "prompt": "اكتب دالتين: الأولى convertToEGP(usd) تضرب في 50 وترجع الناتج. والثانية addService(amount) تضيف 10% خدمة وترجع الناتج. ثم احسب ناتج تحويل 100 دولار مع إضافة الخدمة واطبعه في الكونسول بالشكل: \"الإجمالي بالجنيه: 5500\".",
          "hint": "استدعِ addService(convertToEGP(100)) وخزن الناتج ثم اطبعه.",
          "initialCode": "// اكتب الدالتين convertToEGP و addService وتتبعهما هنا بنفسك...\n",
          "solutionCode": "function convertToEGP(usd) {\n  return usd * 50;\n}\n\nfunction addService(amount) {\n  return amount + amount * 0.1;\n}\n\nconst finalAmount = addService(convertToEGP(100));\nconsole.log(\"الإجمالي بالجنيه: \" + finalAmount);"
        },
        "quiz": [
          {
            "id": "ch18-q1",
            "question": "لو عندنا الكود التالي، ما هي القيمة التي ستُطبع في النهاية؟",
            "codeSnippet": "function f(x) { return x + 2; }\nfunction g(x) { return x * 3; }\nconsole.log(f(g(4)));",
            "options": [
              {
                "id": "a",
                "text": "14 (لأن g(4) تنتج 12، ثم f(12) تضيف 2 فتصبح 14)",
                "isCorrect": true,
                "explanation": "تحليل عبقري ودقيق جداً يا صديقي! 👏 بدأ بالقوس الداخلي g(4)=12 ثم f(12)=14."
              },
              {
                "id": "b",
                "text": "18",
                "isCorrect": false,
                "explanation": "كانت ستكون 18 لو نُفذت f أولاً ثم g: g(f(4)) = g(6) = 18."
              },
              {
                "id": "c",
                "text": "24",
                "isCorrect": false,
                "explanation": "حساب غير صحيح لترتيب الدوال."
              }
            ]
          },
          {
            "id": "ch18-q2",
            "question": "ليه الكود ده بيطبع NaN في الكونسول يا صديقي؟",
            "codeSnippet": "function add(a, b) {\n  console.log(a + b);\n}\nconst res = add(3, 3) + 4;\nconsole.log(res);",
            "options": [
              {
                "id": "a",
                "text": "لأن add لا تحتوي على return فترجع undefined، وجمع undefined + 4 ينتج NaN",
                "isCorrect": true,
                "explanation": "إجابة نموذجية وممتازة! 💡 غياب return جعل ناتج الدالة undefined، وجمع undefined مع رقم ينتج Not-a-Number."
              },
              {
                "id": "b",
                "text": "لأن الأرقام فردية",
                "isCorrect": false,
                "explanation": "العمليات الحسابية تتعامل مع أي أرقام."
              },
              {
                "id": "c",
                "text": "لأن console.log يغير نوع البيانات",
                "isCorrect": false,
                "explanation": "console.log لا يؤثر على قيمة المتغيرات."
              }
            ]
          },
          {
            "id": "ch18-q3",
            "question": "ما هو الترتيب الصحيح لدورة حياة الدالة عند تشغيل البرنامج؟",
            "options": [
              {
                "id": "a",
                "text": "التعريف أولاً في الذاكرة، ثم القفز لجسم الدالة عند الاستدعاء، ثم الخروج بـ return وتسليم الناتج",
                "isCorrect": true,
                "explanation": "برافو عليك يا صديقي! 🌟 هذا هو المسار الهندسي الكامل لتنفيذ الدوال في لغة JavaScript."
              },
              {
                "id": "b",
                "text": "التنفيذ الفوري عند كتابة function بدون استدعاء",
                "isCorrect": false,
                "explanation": "الدالة لا تنفذ أبداً إلا عند استدعائها بالأقواس ()."
              },
              {
                "id": "c",
                "text": "الخروج أولاً ثم التنفيذ",
                "isCorrect": false,
                "explanation": "الخروج بـ return يكون في نهاية مسار التنفيذ."
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
    "subtitle": "الرف المنظم اللي بنرتب عليه كل بياناتنا",
    "description": "المصفوفات (Arrays)، الفهرس المبدئي من الصفر (Zero-based Indexing)، خاصية length، المرور بـ for و for..of، عمليات push و pop و includes و indexOf، ومراجعة تحليلية لتتبع تحولات المصفوفات.",
    "iconName": "Layers",
    "bugHunter": {
      "id": "bug-part-5",
      "partId": 5,
      "title": "صائد الأخطاء: فخ الـ Index و undefined في المصفوفة 🐛",
      "context": "الكود ده المفروض يطبع 4 أسماء في المصفوفة، لكنه في النهاية بيطبع undefined إضافية ويزعج المستخدم!",
      "problemCode": "const names = [\"ندى\", \"كريم\", \"ياسمين\", \"طارق\"];\n\nfor (let i = 0; i <= names.length; i++) {\n  console.log(names[i]);\n}",
      "bugLineNumber": 3,
      "bugDescription": "استخدام i <= names.length بدلاً من i < names.length.",
      "whyItHappens": "طول مصفوفة names هو 4، لكن الترقيم يبدأ من 0 وينتهي عند 3. عند استخدام <= ستصل قيمة i إلى 4، والعنصر names[4] غير موجود فيرجع الكمبيوتر undefined! الحل هو استخدام < بدلاً من <=.",
      "fixedCode": "const names = [\"ندى\", \"كريم\", \"ياسمين\", \"طارق\"];\n\nfor (let i = 0; i < names.length; i++) {\n  console.log(names[i]);\n}",
      "expectedCorrectOutput": "ندى\nكريم\nياسمين\nطارق",
      "hints": [
        "المصفوفة فيها 4 عناصر، ما هو آخر index متاح؟",
        "ماذا يحدث عندما يحاول الكود قراءة names[4]؟",
        "استبدل <= بـ < لتتوقف الحلقة عند index 3."
      ]
    },
    "chapters": [
      {
        "id": 19,
        "partId": 5,
        "partTitle": "الجزء الخامس: المصفوفات",
        "title": "الفصل 19: المصفوفات (1) — الرف المرقّم",
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
          "id": "ch19-chal",
          "title": "وريني شطارتك 🧠: حسابات درجات الطلاب",
          "prompt": "عندك مصفوفة const grades = [88, 65, 92, 40, 77];. اطبع أول عنصر، وآخر عنصر بـ length، ومجموعهما معاً.",
          "hint": "grades[0] و grades[grades.length - 1].",
          "initialCode": "// اكتب كود قراءة أول وآخر عنصر وجمع درجاتهما هنا بنفسك...\n",
          "solutionCode": "const grades = [88, 65, 92, 40, 77];\nconst first = grades[0];\nconst last = grades[grades.length - 1];\nconsole.log(\"الأول: \" + first);\nconsole.log(\"الأخير: \" + last);\nconsole.log(\"مجموعهما: \" + (first + last));"
        },
        "quiz": [
          {
            "id": "ch19-q1",
            "question": "لو عندنا مصفوفة فيها 5 عناصر، الفهرس (index) بتاع أول عنصر وآخر عنصر كام بالترتيب يا صديقي؟",
            "options": [
              {
                "id": "a",
                "text": "أول عنصر 0، وآخر عنصر 4",
                "isCorrect": true,
                "explanation": "صح جداً وبرافو عليك يا صديقي! 👏 الترقيم يبدأ من 0 وينتهي عند (الطول - 1) وهو 4."
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
            "id": "ch19-q2",
            "question": "إزاي نوصل لآخر عنصر في أي مصفوفة اسمها arr مهما كان طولها؟",
            "options": [
              {
                "id": "a",
                "text": "arr[arr.length - 1]",
                "isCorrect": true,
                "explanation": "برافو عليك يا صديقي! 🎯 دي الطريقة القياسية عالمياً للوصول لآخر عنصر."
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
          },
          {
            "id": "ch19-q3",
            "question": "ماذا يرجع الكود عند محاولة قراءة عنصر في index غير موجود بالمصفوفة؟",
            "options": [
              {
                "id": "a",
                "text": "undefined (لأن الرف المطلوب فارغ وغير موجود)",
                "isCorrect": true,
                "explanation": "ممتاز جداً! 💡 جافاسكريبت ترجع undefined عند قراءة فهرس خارج حدود المصفوفة."
              },
              {
                "id": "b",
                "text": "null",
                "isCorrect": false,
                "explanation": "null تدل على تفريغ يدوي مقصود وليست القيمة الافتراضية."
              },
              {
                "id": "c",
                "text": "0",
                "isCorrect": false,
                "explanation": "0 هي قيمة رقمية حقيقية وليست دلالة على عدم الوجود."
              }
            ]
          }
        ]
      },
      {
        "id": 20,
        "partId": 5,
        "partTitle": "الجزء الخامس: المصفوفات",
        "title": "الفصل 20: المصفوفات (2) — المرور على العناصر",
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
          "id": "ch20-chal",
          "title": "وريني شطارتك 🧠: مضاعفة جميع أرقام القائمة",
          "prompt": "عندك مصفوفة const numbers = [2, 5, 8];. استخدم حلقة for..of واطبع في الكونسول ضعف كل رقم (num * 2) في سطر منفصل.",
          "hint": "for (const n of numbers) { console.log(n * 2); }",
          "initialCode": "// اكتب حلقة for..of لطباعة ضعف كل رقم هنا بنفسك...\n",
          "solutionCode": "const numbers = [2, 5, 8];\nfor (const n of numbers) {\n  console.log(n * 2);\n}"
        },
        "quiz": [
          {
            "id": "ch20-q1",
            "question": "في حلقة for التقليدية للمصفوفة arr، ليه بنكتب الشرط i < arr.length مش i <= arr.length يا صديقي؟",
            "options": [
              {
                "id": "a",
                "text": "عشان آخر عنصر بيكون عند arr.length - 1، ولو وصلنا لـ length هنطبع undefined",
                "isCorrect": true,
                "explanation": "صح جداً وبرافو عليك! 👏 الـ index بينتهي قبل رقم الطول بواحد."
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
            "id": "ch20-q2",
            "question": "إيه الميزة الأكبر لحلقة for..of مقارنة بحلقة for العادية؟",
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
          },
          {
            "id": "ch20-q3",
            "question": "كيف نحسب مجموع كل الأرقام داخل مصفوفة أثناء المرور عليها؟",
            "options": [
              {
                "id": "a",
                "text": "تعريف متغير حصالة let sum = 0 قبل الحلقة وإضافة كل عنصر إليه في كل دورة",
                "isCorrect": true,
                "explanation": "أحسنت يا صديقي! 🌟 هذا هو نمط الحصالة (Accumulator Pattern) الكلاسيكي."
              },
              {
                "id": "b",
                "text": "كتابة sum = array.length فقط",
                "isCorrect": false,
                "explanation": "length تعطي عدد العناصر فقط وليس مجموع قيمها."
              },
              {
                "id": "c",
                "text": "ضرب كل العناصر في الصفر",
                "isCorrect": false,
                "explanation": "الضرب في صفر يمسح الناتج."
              }
            ]
          }
        ]
      },
      {
        "id": 21,
        "partId": 5,
        "partTitle": "الجزء الخامس: المصفوفات",
        "title": "الفصل 21: عمليات المصفوفات (Methods)",
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
          "id": "ch21-chal",
          "title": "وريني شطارتك 🧠: جمع الأرقام الزوجية في مصفوفة",
          "prompt": "ابدأ بمصفوفة فارغة const evenNumbers = [];. استخدم حلقة من 1 لـ 10، ولو الرقم زوجي ضيفه بـ push، وفي النهاية اطبع المصفوفة.",
          "hint": "const evenNumbers = []; if (i % 2 === 0) evenNumbers.push(i);",
          "initialCode": "// اكتب كود ملء مصفوفة بالأرقام الزوجية هنا بنفسك...\n",
          "solutionCode": "const evenNumbers = [];\nfor (let i = 1; i <= 10; i++) {\n  if (i % 2 === 0) {\n    evenNumbers.push(i);\n  }\n}\nconsole.log(evenNumbers);"
        },
        "quiz": [
          {
            "id": "ch21-q1",
            "question": "الدالة push() بتضيف العنصر فين بالظبط في المصفوفة يا صديقي؟",
            "options": [
              {
                "id": "a",
                "text": "في نهاية المصفوفة بعد آخر عنصر",
                "isCorrect": true,
                "explanation": "صح جداً وبرافو عليك! 👏 push بتضيف في الآخر، بينما unshift بتضيف في الأول."
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
            "id": "ch21-q2",
            "question": "الدالة arr.indexOf(x) هترجع إيه لو العنصر x مش موجود في المصفوفة؟",
            "options": [
              {
                "id": "a",
                "text": "-1 (كإشارة إلى أن العنصر غير موجود)",
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
          },
          {
            "id": "ch21-q3",
            "question": "الدالة pop() بتعمل إيه في المصفوفة؟",
            "options": [
              {
                "id": "a",
                "text": "بتحذف العنصر الأخير من المصفوفة وترجعه",
                "isCorrect": true,
                "explanation": "برافو عليك يا صديقي! 🎯 pop تشيل آخر عنصر، بينما shift تشيل أول عنصر."
              },
              {
                "id": "b",
                "text": "بتحذف المصفوفة بالكامل",
                "isCorrect": false,
                "explanation": "هي تحذف عنصراً واحداً فقط من النهاية."
              },
              {
                "id": "c",
                "text": "بتضيف عنصراً جديداً",
                "isCorrect": false,
                "explanation": "الإضافة هي وظيفة push أو unshift."
              }
            ]
          }
        ]
      },
      {
        "id": 22,
        "partId": 5,
        "partTitle": "الجزء الخامس: المصفوفات",
        "title": "الفصل 22: مراجعة تحليلية وتتبع تحولات المصفوفات (Array Tracing)",
        "subtitle": "تتبع تغيرات الرف، مؤشرات الفهرسة، والتحكم بالبيانات",
        "summaryPoints": [
          "التتبع الذهني الدقيق لتسلسل عمليات الإضافة والحذف والتعديل على المصفوفة.",
          "تتبع حركة مؤشرات الـ Index والطول length بعد كل عملية push أو pop.",
          "دمج المصفوفات مع الحلقات والدوال لبناء خوارزميات البحث والفلترة وحساب الإحصائيات."
        ],
        "contentSections": [],
        "exercises": [],
        "challenge": {
          "id": "ch22-chal",
          "title": "تحدي ختام المصفوفات: مصفّي الأسعار والعروض 🏷️",
          "prompt": "اكتب دالة filterDiscounts(prices) تستقبل مصفوفة أسعار، وترجع مصفوفة جديدة تحتوي فقط على الأسعار الأقل من 100 جنيه. ثم جربها على المصفوفة [150, 80, 200, 45, 99] واطبع النتيجة.",
          "hint": "عرّف const cheap = []; واستخدم for..of مع شرط if (p < 100) cheap.push(p); ثم return cheap;.",
          "initialCode": "// اكتب دالة filterDiscounts واستدعاءها وطباعة ناتجها هنا بنفسك...\n",
          "solutionCode": "function filterDiscounts(prices) {\n  const cheap = [];\n  for (const p of prices) {\n    if (p < 100) {\n      cheap.push(p);\n    }\n  }\n  return cheap;\n}\n\nconst originalPrices = [150, 80, 200, 45, 99];\nconsole.log(filterDiscounts(originalPrices));"
        },
        "quiz": [
          {
            "id": "ch22-q1",
            "question": "لو عندنا مصفوفة const a = [\"X\", \"Y\"] ونفذنا a.unshift(\"W\")، ما هو العنصر الموجود عند a[0] الآن؟",
            "options": [
              {
                "id": "a",
                "text": "\"W\" (لأن unshift أضافته في أول مكان وزحزحت الباقي)",
                "isCorrect": true,
                "explanation": "صح جداً وبرافو عليك! 👏 unshift تضع العنصر في الفهرس [0] فوراً."
              },
              {
                "id": "b",
                "text": "\"X\"",
                "isCorrect": false,
                "explanation": "\"X\" انتقلت للمكان [1]."
              },
              {
                "id": "c",
                "text": "\"Y\"",
                "isCorrect": false,
                "explanation": "\"Y\" انتقلت للمكان [2]."
              }
            ]
          },
          {
            "id": "ch22-q2",
            "question": "ما هي نتيجة الكود التالي؟\nconst arr = [10, 20, 30];\nconst item = arr.pop();\nconsole.log(arr.length + item);",
            "options": [
              {
                "id": "a",
                "text": "32 (لأن pop حذفت ورجعت 30، وأصبح طول المصفوفة 2، فمجموع 2 + 30 = 32)",
                "isCorrect": true,
                "explanation": "تحليل رياضي وبرمجي عبقري يا صديقي! 🌟 الطول المتبقي 2 مع العنصر 30 ينتج 32."
              },
              {
                "id": "b",
                "text": "33",
                "isCorrect": false,
                "explanation": "الطول أصبح 2 وليس 3 لأن pop حذفت عنصراً."
              },
              {
                "id": "c",
                "text": "30",
                "isCorrect": false,
                "explanation": "نسيت إضافة طول المصفوفة المتبقي."
              }
            ]
          },
          {
            "id": "ch22-q3",
            "question": "كيف نتأكد أن عنصراً معيناً موجود داخل المصفوفة قبل حذفه أو تعديله؟",
            "options": [
              {
                "id": "a",
                "text": "باستخدام array.includes(item) أو التأكد أن array.indexOf(item) !== -1",
                "isCorrect": true,
                "explanation": "إجابة نموذجية يا صديقي! 🎯 هاتان هما الطريقتان القياسيتان للتأكد من وجود العنصر."
              },
              {
                "id": "b",
                "text": "بمسح المصفوفة بالكامل",
                "isCorrect": false,
                "explanation": "المسح يضيع البيانات."
              },
              {
                "id": "c",
                "text": "بكتابة array.length == 0",
                "isCorrect": false,
                "explanation": "length == 0 تعني أن المصفوفة فارغة تماماً."
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
        "id": 23,
        "partId": 6,
        "partTitle": "الجزء السادس: من الكود للصفحة",
        "title": "الفصل 23: أساسيات HTML (1)",
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
          "id": "ch23-chal",
          "title": "وريني شطارتك 🧠: كارت المبرمج في HTML",
          "prompt": "اكتب HTML مباشرة لبطاقة فيها عنوان <h1> باسمك، وفقرة <p> بالنص \"أنا مبرمج ويب\"، وقائمة <ul> فيها مهارتان داخل <li>.",
          "hint": "اكتب وسوم h1 و p و ul/li مباشرة، دون console.log.",
          "initialCode": "// اكتب كود طباعة وسوم الـ HTML بالترتيب هنا بنفسك...\n",
          "solutionCode": "<h1>زكي كود</h1>\n<p>أنا مبرمج ويب</p>\n<ul><li>JavaScript</li><li>HTML</li></ul>"
        },
        "quiz": [
          {
            "id": "ch23-q1",
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
            "id": "ch23-q2",
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
        "id": 24,
        "partId": 6,
        "partTitle": "الجزء السادس: من الكود للصفحة",
        "title": "الفصل 24: أساسيات CSS (1)",
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
          "id": "ch24-chal",
          "title": "وريني شطارتك 🧠: كود التنسيق الملكي",
          "prompt": "اكتب قاعدة CSS للمحدد .highlight تجعل لون النص أصفر باستخدام color: yellow.",
          "hint": ".highlight { color: yellow; }",
          "initialCode": "// اكتب كود طباعة قاعدة CSS لـ h1 هنا بنفسك...\n",
          "solutionCode": ".highlight { color: yellow; }"
        },
        "quiz": [
          {
            "id": "ch24-q1",
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
            "id": "ch24-q2",
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
        "id": 25,
        "partId": 6,
        "partTitle": "الجزء السادس: من الكود للصفحة",
        "title": "الفصل 25: تقسيم الصفحة والمدخلات (HTML 2)",
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
          "id": "ch25-chal",
          "title": "وريني شطارتك 🧠: نموذج بريد إلكتروني",
          "prompt": "اكتب نموذج HTML فيه label مرتبط بحقل بريد باستخدام for و id، وحقل type=\"email\"، وزر إرسال.",
          "hint": "اجعل قيمة label for مساوية لـ id الحقل، واستخدم button type=\"submit\".",
          "initialCode": "// اكتب كود طباعة وسم الزرار هنا بنفسك...\n",
          "solutionCode": "<form><label for=\"email\">البريد الإلكتروني</label><input id=\"email\" name=\"email\" type=\"email\"><button type=\"submit\">إرسال</button></form>"
        },
        "quiz": [
          {
            "id": "ch25-q1",
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
        "id": 26,
        "partId": 6,
        "partTitle": "الجزء السادس: من الكود للصفحة",
        "title": "الفصل 26: تزيين الأزرار وتأثيرات الفأرة (CSS 2)",
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
          "id": "ch26-chal",
          "title": "وريني شطارتك 🧠: حواف الزرار المستديرة",
          "prompt": "اكتب قاعدة CSS مباشرة تجعل أزرار button بحواف دائرية (border-radius: 12px;).",
          "hint": "button { border-radius: 12px; }",
          "initialCode": "// اكتب كود تدوير حواف الأزرار هنا بنفسك...\n",
          "solutionCode": "button { border-radius: 12px; }"
        },
        "quiz": [
          {
            "id": "ch26-q1",
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
        "id": 27,
        "partId": 6,
        "partTitle": "الجزء السادس: من الكود للصفحة",
        "title": "الفصل 27: ألوان الشاشات RGB و Hex والشفافية (CSS 3)",
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
          "id": "ch27-chal",
          "title": "وريني شطارتك 🧠: شفرة الهكس الخالصة",
          "prompt": "اكتب قاعدة CSS مباشرة تجعل لون خلفية الصفحة body أبيض باستخدام شفرة Hex وهي #ffffff.",
          "hint": "body { background-color: #ffffff; }",
          "initialCode": "// اكتب كود تلوين خلفية body بالهكس الأبيض هنا بنفسك...\n",
          "solutionCode": "body { background-color: #ffffff; }"
        },
        "quiz": [
          {
            "id": "ch27-q1",
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
        "id": 28,
        "partId": 6,
        "partTitle": "الجزء السادس: من الكود للصفحة",
        "title": "الفصل 28: بناء بطاقة ملف شخصي (مشروع عملي)",
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
          "id": "ch28-chal",
          "title": "وريني شطارتك 🧠: كارت المنتج المتكامل",
          "prompt": "اكتب بطاقة منتج HTML بكلاس product-card، فيها عنوان h2 وفقرة وزر شراء، وأضف قاعدة CSS واحدة لتنسيق البطاقة.",
          "hint": "<style>.product-card { padding: 16px; }</style><article class=\"product-card\"><h2>ساعة ذكية</h2><p>خفيفة وعملية</p><button>شراء</button></article>",
          "initialCode": "// اكتب كود طباعة كارت المنتج هنا بنفسك...\n",
          "solutionCode": "<style>.product-card { padding: 16px; background: #eee; }</style><article class=\"product-card\"><h2>ساعة ذكية</h2><p>خفيفة وعملية</p><button>شراء</button></article>"
        },
        "quiz": [
          {
            "id": "ch28-q1",
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
        "id": 29,
        "partId": 6,
        "partTitle": "الجزء السادس: من الكود للصفحة",
        "title": "الفصل 29: الكائنات (Objects)",
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
          "id": "ch29-chal",
          "title": "وريني شطارتك 🧠: كائن هاتف المحمول",
          "prompt": "أنشئ كائناً const phone يحمل الخاصيتين brand: \"سامسونج\" و price: 8000. ثم اطبع في الكونسول: \"الموبايل: سامسونج بسعر: 8000\".",
          "hint": "phone.brand و phone.price داخل console.log.",
          "initialCode": "// اكتب كود تعريف كائن phone وطباعة بياناته هنا بنفسك...\n",
          "solutionCode": "const phone = {\n  brand: \"سامسونج\",\n  price: 8000\n};\nconsole.log(\"الموبايل: \" + phone.brand + \" بسعر: \" + phone.price);"
        },
        "quiz": [
          {
            "id": "ch29-q1",
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
            "id": "ch29-q2",
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
        "id": 30,
        "partId": 6,
        "partTitle": "الجزء السادس: من الكود للصفحة",
        "title": "الفصل 30: شجرة الـ DOM والأحداث (Events) — الساحر والتفاعل",
        "subtitle": "ربط JavaScript بالصفحة: النقر والتفاعل الحي",
        "summaryPoints": [
          "الـ DOM (Document Object Model) هو الشجرة التي يرى بها JavaScript عناصر صفحة HTML ويتحكم فيها.",
          "الدالة document.getElementById() تمسك أي عنصر بالمعرف الفريد (ID) بتاعه.",
          "تعديل النصوص بـ textContent وتعديل التنسيقات بـ style.",
          "مراقبة تصرفات المستخدم عبر addEventListener(\"click\", callback) لتشغيل الكود فور النقر."
        ],
        "contentSections": [],
        "exercises": [],
        "challenge": {
          "id": "ch30-chal",
          "title": "وريني شطارتك 🧠: مبدل حالة النور (Light Switch)",
          "prompt": "اكتب صفحة HTML فيها زر وفقرة. استخدم addEventListener(\"click\") ومتغير boolean لتبديل نص الفقرة بين \"النور مضاء\" و \"النور مطفي\" عند كل نقرة.",
          "hint": "عرّف isOn واربِط الزر بـ addEventListener، ثم بدّل القيمة والنص عبر textContent.",
          "initialCode": "// اكتب كود دالة تبديل النور وفحص الحالة بنفسك هنا...\n",
          "solutionCode": "<!doctype html><html lang=\"ar\" dir=\"rtl\"><body><button id=\"toggle\">بدّل النور</button><p id=\"status\">النور مطفي</p><script>let isOn = false;\ndocument.getElementById(\"toggle\").addEventListener(\"click\", () => {\n  isOn = !isOn;\n  document.getElementById(\"status\").textContent = isOn ? \"النور مضاء 💡\" : \"النور مطفي 🌑\";\n});</script></body></html>"
        },
        "quiz": [
          {
            "id": "ch30-q1",
            "question": "الدالة المسؤولة عن مراقبة نقرات الماوس على زر هي أنهي دالة يا صديقي؟",
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
            "id": "ch30-q2",
            "question": "معامل الحدث (event / e) اللي بنستلمه جوه دالة النقر.. جواه إيه؟",
            "options": [
              {
                "id": "a",
                "text": "معلومات تفصيلية عن الحدث، زي العنصر المنقور (e.target) ومكان مؤشر الفأرة",
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
                "explanation": "لا يحتوي على أي بيانات سرية أو حساسة."
              }
            ]
          },
          {
            "id": "ch30-q3",
            "question": "ما هي الخاصية المستخدمة لتعديل النص الداخلي لعنصر HTML بأمان؟",
            "options": [
              {
                "id": "a",
                "text": "element.textContent",
                "isCorrect": true,
                "explanation": "صح جداً! 📝 textContent هي الطريقة القياسية والآمنة لتغيير وقراءة النصوص."
              },
              {
                "id": "b",
                "text": "element.writeText",
                "isCorrect": false,
                "explanation": "لا توجد خاصية بهذا الاسم لتعديل العناصر."
              },
              {
                "id": "c",
                "text": "element.fontText",
                "isCorrect": false,
                "explanation": "الخاصية الصحيحة هي textContent."
              }
            ]
          }
        ]
      },
      {
        "id": 31,
        "partId": 6,
        "partTitle": "الجزء السادس: من الكود للصفحة",
        "title": "الفصل 31: مراجعة تحليلية وتتبع تفاعل الويب (Web & DOM Tracing)",
        "subtitle": "تتبع دورة حياة الصفحة، تدفق الأحداث، وفخاخ الـ DOM الشائعة",
        "summaryPoints": [
          "التتبع الذهني لتسلسل تحميل الصفحة: من تحليل HTML وبناء شجرة الـ DOM حتى تشغيل كود JavaScript.",
          "تتبع تدفق أحداث المستخدم (Event Lifecycle) وتحديث واجهة المستخدم فورياً.",
          "مصفوفة الفخاخ القاتلة في برمجة الويب: مكان وضع السكريبت، أخطاء Cannot read properties of null، والفصل المعماري النظيف بين HTML و CSS و JS."
        ],
        "contentSections": [],
        "exercises": [],
        "challenge": {
          "id": "ch31-chal",
          "title": "تحدي ختام مسار الويب: عداد الحروف الفوري 🔤",
          "prompt": "اكتب كود صفحة HTML فيها حقل إدخال input وفقرة تعرض عدد الحروف. استخدم حدث \"input\" لتحديث نص الفقرة فوراً ليصبح: \"عدد الحروف: X\" حيث X هو طول النص المكتوب (input.value.length).",
          "hint": "document.getElementById(\"myInput\").addEventListener(\"input\", (e) => { countDisplay.textContent = \"عدد الحروف: \" + e.target.value.length; });",
          "initialCode": "// اكتب كود عداد الحروف الفوري هنا بنفسك...\n",
          "solutionCode": "<!doctype html>\n<html lang=\"ar\" dir=\"rtl\">\n<body>\n  <input id=\"textInput\" placeholder=\"اكتب هنا...\">\n  <p id=\"charCount\">عدد الحروف: 0</p>\n\n  <script>\n    const input = document.getElementById(\"textInput\");\n    const countDisplay = document.getElementById(\"charCount\");\n\n    input.addEventListener(\"input\", () => {\n      countDisplay.textContent = \"عدد الحروف: \" + input.value.length;\n    });\n  </script>\n</body>\n</html>"
        },
        "quiz": [
          {
            "id": "ch31-q1",
            "question": "ليه بنستخدم input.value لقراءة حقل الإدخال بدلاً من input.textContent يا صديقي؟",
            "options": [
              {
                "id": "a",
                "text": "لأن حقول input عناصر إدخال ذاتية الإغلاق وتحفظ ما يكتبه المستخدم في خاصية value",
                "isCorrect": true,
                "explanation": "تحليل هندسي ممتاز! 👏 textContent للعناصر التي لها وسم فتح وإغلاق كـ h1 و p، بينما value للمدخلات."
              },
              {
                "id": "b",
                "text": "لأن textContent محذوفة من المتصفحات",
                "isCorrect": false,
                "explanation": "textContent موجودة وتستخدم مع باقي الوسوم."
              },
              {
                "id": "c",
                "text": "مفيش فرق والاثنان متطابقان",
                "isCorrect": false,
                "explanation": "الفرق جوهري؛ محاولة قراءة textContent من input سترجع نصاً فارغاً."
              }
            ]
          },
          {
            "id": "ch31-q2",
            "question": "ما هو السبب الأكثر شيوعاً لظهور خطأ \"Cannot read properties of null\" عند التعامل مع الـ DOM؟",
            "options": [
              {
                "id": "a",
                "text": "تشغيل كود السكريبت قبل أن يرسم المتصفح عناصر HTML في الذاكرة، أو كتابة id خاطئ",
                "isCorrect": true,
                "explanation": "إجابة نموذجية! 💡 المتصفح يبحث عن الـ ID فلا يجده فيرجع null وتفشل العمليات اللاحقة."
              },
              {
                "id": "b",
                "text": "ضعف سرعة الإنترنت",
                "isCorrect": false,
                "explanation": "الخطأ برمجي تنفيذي ولا علاقة له بالشبكة."
              },
              {
                "id": "c",
                "text": "استخدام ألوان غير متوافقة في CSS",
                "isCorrect": false,
                "explanation": "CSS لا يسبب أخطاء TypeErrors في JavaScript."
              }
            ]
          },
          {
            "id": "ch31-q3",
            "question": "ما هي الطريقة الصحيحة لمنع إعادة تحميل الصفحة الافتراضي عند إرسال نموذج HTML؟",
            "options": [
              {
                "id": "a",
                "text": "استدعاء e.preventDefault() داخل مستمع حدث submit",
                "isCorrect": true,
                "explanation": "عاش يا بطل! 🌟 preventDefault توقف السلوك الافتراضي للمتصفح وتسمح لمعالجة البيانات بـ JavaScript بدون ريفريش."
              },
              {
                "id": "b",
                "text": "مسح وسم form",
                "isCorrect": false,
                "explanation": "مسح form يضر ببنية الصفحة الدلالية."
              },
              {
                "id": "c",
                "text": "كتابة return 0",
                "isCorrect": false,
                "explanation": "الطريقة القياسية الحديثة هي preventDefault()."
              }
            ]
          }
        ]
      }
    ]
  }
];
