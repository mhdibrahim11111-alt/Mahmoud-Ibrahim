export interface ChallengeValidationResult {
  passed: boolean;
  message: string;
}

/**
 * Validates a student's challenge solution for both ChapterView and ChallengesList.
 */
export function validateChallenge(
  chapterId: number | string,
  code: string,
  logs: string[],
  errors: string[]
): ChallengeValidationResult {
  // 1. Check for runtime syntax / execution errors
  if (errors.length > 0) {
    return {
      passed: false,
      message: `هناك خطأ برمجي في تشغيل الكود: ${errors[0]}`,
    };
  }

  const cleanCode = code.trim();
  const nonCommentCode = cleanCode
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/.*$/gm, '')
    .trim();

  // 2. Check if student left only comments / placeholder without code
  if (!nonCommentCode) {
    return {
      passed: false,
      message: 'لم تكتب أي كود تنفيذي بعد! أضف أوامر console.log المطلوبة أسفل التعليق.',
    };
  }

  // 3. Meaningful logs
  const meaningfulLogs = logs
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && l !== 'undefined' && l !== 'null');

  if (meaningfulLogs.length === 0) {
    return {
      passed: false,
      message: 'أمر console.log لم يطبع أي مخرجات! اكتب بداخله القيمة المطلوب طباعتها.',
    };
  }

  // 4. Chapter-specific validation rules
  switch (chapterId) {
    case 1: {
      const hasComment = /\/\/|\/\*/.test(code);
      if (!hasComment) {
        return {
          passed: false,
          message: 'طبعت البيانات بنجاح، لكن نسيت وضع تعليق باسمك في أول الكود! استخدم // لكتابة التعليق في أول سطر.',
        };
      }
      if (meaningfulLogs.length < 3) {
        return {
          passed: false,
          message: `طبعت ${meaningfulLogs.length} ${
            meaningfulLogs.length === 1 ? 'سطر فقط' : 'سطرين فقط'
          }! المطلوب 3 أسطر على الأقل (الاسم في سطر، البلد في سطر، والهواية في سطر).`,
        };
      }
      return {
        passed: true,
        message: 'رائع وممتاز جداً! 🎉 طبعت بطاقة التعارف بـ 3 أسطر كاملة ووضعت تعليقاً في أول الكود بنجاح.',
      };
    }

    case 2: {
      const has42 = meaningfulLogs.some((l) => l.includes('42'));
      const hasMultiply = /6\s*\*\s*7|7\s*\*\s*6/.test(code);
      if (!has42) {
        return {
          passed: false,
          message: 'الناتج ليس 42! تأكد من طباعة جملة "6 * 7 =" وجعل الكمبيوتر يحسب 6 * 7.',
        };
      }
      if (!hasMultiply) {
        return {
          passed: false,
          message: 'المطلوب أن يحسب الكمبيوتر العملية 6 * 7 بنفسه داخل console.log، وليس كتابة 42 يدوياً كقيمة ثابتة.',
        };
      }
      return {
        passed: true,
        message: 'ممتاز يا بطل! 🎯 جعلت الكمبيوتر يحسب 6 * 7 ويطبع 42 بنجاح.',
      };
    }

    case 3: {
      const has40 = meaningfulLogs.some((l) => l.includes('40'));
      const has50 = meaningfulLogs.some((l) => l.includes('50'));
      if (!has40 || !has50) {
        return {
          passed: false,
          message: 'تأكد من طباعة المساحة الأولى (40) ثم تعديل العرض لـ 10 وطباعة المساحة الثانية (50)!',
        };
      }
      return {
        passed: true,
        message: 'عاش يا بطل! 👏 حسبت المساحة 40 وعدّلت المتغير وطبعت 50 بنجاح.',
      };
    }

    case 4: {
      const has170 = meaningfulLogs.some((l) => l.includes('170'));
      const hasWrongConcat = meaningfulLogs.some((l) => l.includes('15020'));
      if (hasWrongConcat) {
        return {
          passed: false,
          message: 'ظهر 15020 بسبب دمج النصوص! حوّل price لرقم باستخدام Number(price) أو parseInt(price) قبل جمعه مع التوصيل.',
        };
      }
      if (!has170) {
        return {
          passed: false,
          message: 'الناتج يجب أن يكون 170 (150 + 20) كإجمالي الفاتورة.',
        };
      }
      return {
        passed: true,
        message: 'برافو عليك! 🎉 حولت النص لرقم وحسبت الإجمالي 170 بدون أخطاء دمج النصوص.',
      };
    }

    case 5: {
      const hasWarning = meaningfulLogs.some((l) => l.includes('خد بالك'));
      if (!hasWarning) {
        return {
          passed: false,
          message: 'السرعة 95 أكبر من 80 وأقل من 100، فالنتيجة المتوقعة لشرط if/else هي طباعة "خد بالك"!',
        };
      }
      return {
        passed: true,
        message: 'اختبار دقيق وشروط مضبوطة! 🚗 طبعت "خد بالك" لأن السرعة 95 بين 80 و 100.',
      };
    }

    case 6: {
      const hasRoller = meaningfulLogs.some((l) => l.includes('تقدر تركب اللعبة'));
      if (!hasRoller) {
        return {
          passed: false,
          message: 'تأكد من فحص الشرطين معاً باستخدام && (الطول >= 140 والعمر >= 10) وطباعة "تقدر تركب اللعبة".',
        };
      }
      return {
        passed: true,
        message: 'مبروك! 🎢 دمجت الشرطين بالمعامل المنطقي && بنجاح.',
      };
    }

    case 7: {
      const hasCase = /switch\s*\(/.test(code);
      if (!hasCase) {
        return {
          passed: false,
          message: 'المطلوب استخدام جملة switch لفحص اليوم وطباعة الرسالة المقابلة له.',
        };
      }
      return {
        passed: true,
        message: 'عاش! 📅 كتبت جملة switch ونفّذت الحالات بدقة.',
      };
    }

    case 8: {
      const hasFor = /for\s*\(/.test(code);
      if (!hasFor) {
        return {
          passed: false,
          message: 'المطلوب استخدام حلقة تكرار for لطباعة الأرقام أو التكرار المطلوب.',
        };
      }
      return {
        passed: true,
        message: 'ممتاز! 🔄 وظفت حلقة for البرمجية بنجاح.',
      };
    }

    // Part Capstone 1: Shopping Cart Total (185)
    case 'part1-capstone': {
      const has185 = meaningfulLogs.some((l) => l.includes('185'));
      const hasWrongConcat = meaningfulLogs.some((l) => l.includes('12030'));
      if (hasWrongConcat) {
        return {
          passed: false,
          message: 'حدث دمج نصوص خاطئ! تأكد من تحويل mealPrice لرقم بواسطة Number(mealPrice) قبل جمعه.',
        };
      }
      if (!has185) {
        return {
          passed: false,
          message: 'الناتج مش 185! اجمع 120 + 30 + 20 + 15 واطبع الإجمالي النهائي 185.',
        };
      }
      return {
        passed: true,
        message: 'إنجاز أسطوري! 🏆 حسبت فاتورة مشروع الجزء الأول بالكامل (185) بدون أي أخطاء دمج نصوص!',
      };
    }

    // Part Capstone 2: Theme Park Tickets Engine
    case 'part2-capstone': {
      const has100 = meaningfulLogs.some((l) => l.includes('100'));
      if (!has100) {
        return {
          passed: false,
          message: 'العمر 14 وهو يوم إجازة isWeekend = true، فالنتيجة المتوقعة هي طباعة "تذكرة ويك إند كبار: 100"!',
        };
      }
      return {
        passed: true,
        message: 'برافو يا مهندس! 🎢 بنيت محرك قرارات الجزء الثاني بنجاح ودمجت شروط العمر والويك إند بدقة.',
      };
    }

    // Part Capstone 3: Multiplication Table & Sum (45)
    case 'part3-capstone': {
      const has45 = meaningfulLogs.some((l) => l.includes('45'));
      const hasFor = /for\s*\(/.test(code);
      if (!hasFor) {
        return {
          passed: false,
          message: 'المطلوب استخدام حلقة for للتكرار من 1 إلى 5 وحساب نواتج الضرب.',
        };
      }
      if (!has45) {
        return {
          passed: false,
          message: 'المجموع الكلي لنواتج ضرب 3 من 1 لـ 5 يجب أن يكون 45 (3+6+9+12+15 = 45)!',
        };
      }
      return {
        passed: true,
        message: 'عاش يا بطل! 🔄 أنشأت جدول الضرب وحسبت المجموع التراكمي 45 بنجاح بحلقة التكرار.',
      };
    }

    // Part Capstone 4: Students Grades Analyzer (3 passed)
    case 'part4-capstone': {
      const has3 = meaningfulLogs.some((l) => l.includes('3'));
      const hasFilter = /\.filter\s*\(/.test(code);
      if (!hasFilter) {
        return {
          passed: false,
          message: 'المطلوب استخدام دالة .filter() لتصفية الدرجات الناجحة التي أكبر من أو تساوي 50.',
        };
      }
      if (!has3) {
        return {
          passed: false,
          message: 'الدرجات الناجحة من المصفوفة هي 3 طلاب (80 و 92 و 70)، تأكد من طباعة "الناجحين: 3".',
        };
      }
      return {
        passed: true,
        message: 'إتقان تام للدوال والمصفوفات! 🎓 حللت نتائج الطلاب بدالتي filter و map بنجاح.',
      };
    }

    // Part Capstone 5: Bank Account Object (700 balance)
    case 'part5-capstone': {
      const has700 = meaningfulLogs.some((l) => l.includes('700'));
      const hasThis = /this\.balance/.test(code);
      if (!hasThis) {
        return {
          passed: false,
          message: 'تأكد من استخدام this.balance لتعديل وقراءة رصيد الكائن نفسه داخل الدوال.',
        };
      }
      if (!has700) {
        return {
          passed: false,
          message: 'الرصيد المبدئي 500 وأضفنا 200 فالرصيد الحالي يجب أن يكون 700!',
        };
      }
      return {
        passed: true,
        message: 'رائع ومحترف! 🏦 بنيت كائن الحساب البنكي واستخدمت this والـ methods بنجاح.',
      };
    }

    // Part Capstone 6: Task Management & Error Handling
    case 'part6-capstone': {
      const hasSuccess = meaningfulLogs.some((l) => l.includes('تم حفظ المهمة بنجاح'));
      const hasCatch = /try\s*\{[\s\S]*?\}\s*catch/.test(code);
      if (!hasCatch) {
        return {
          passed: false,
          message: 'المطلوب استخدام بنية try...catch لاصطياد الخطأ عند إرسال اسم مهمة فارغ.',
        };
      }
      if (!hasSuccess) {
        return {
          passed: false,
          message: 'تأكد من استدعاء saveTask باسم مهمة صحيح أولاً لتطبع "تم حفظ المهمة بنجاح 🎯".',
        };
      }
      return {
        passed: true,
        message: 'مبروك إتمام المسار بالكامل! 🌟 بنيت كوداً صامداً واصطدت الأخطاء بـ try..catch ببراعة.',
      };
    }

    default: {
      if (meaningfulLogs.length > 0) {
        return {
          passed: true,
          message: 'رائع! تم تشغيل الكود بنجاح وطباعة المخرجات المطلوبة 🚀',
        };
      }
      return {
        passed: false,
        message: 'تأكد من كتابة كود سليم واستخدام console.log لطباعة النتيجة المطلوبة في الشاشة.',
      };
    }
  }
}
