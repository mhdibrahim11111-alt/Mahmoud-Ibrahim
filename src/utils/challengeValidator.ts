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

    case 9: {
      const correctRange = /i\s*=\s*5/.test(code) && /i\s*<=\s*8/.test(code);
      const hasParity = /%\s*2/.test(code) && /زوجي/.test(code) && /فردي/.test(code);
      const printedRange = ['5', '6', '7', '8'].every((n) => meaningfulLogs.some((l) => l.includes(n)));
      if (!correctRange || !hasParity || !printedRange) return { passed: false, message: 'استخدم while عشان تعدّي على الأرقام من 5 لـ8، وافحص الزوجي والفردي بباقي القسمة % 2.' };
      return { passed: true, message: 'عاش! عدّيت على الأرقام المطلوبة وفحصت الزوجي والفردي.' };
    }

    case 10: {
      const hasRandom = /Math\.floor\s*\(\s*Math\.random\s*\(\s*\)\s*\*\s*2\s*\)\s*\+\s*1/.test(code);
      const hasBranch = /if\s*\(/.test(code) && /else/.test(code);
      const hasCoin = meaningfulLogs.some((l) => l.includes('ملك') || l.includes('كتابة'));
      if (!hasRandom || !hasBranch || !hasCoin) return { passed: false, message: 'طلّع 1 أو 2 بـ Math.random، وبعدها استخدم if/else عشان تطبع ملك أو كتابة.' };
      return { passed: true, message: 'حلو! استخدمت Math عشان تطلع نتيجة عشوائية وتطبع الرسالة المناسبة.' };
    }

    case 11: {
      const valid = /function\s+doubleNumber\s*\(\s*\w+\s*\)/.test(code) && /console\.log\s*\([^)]*\*\s*2\s*\)/.test(code) && /doubleNumber\s*\(\s*7\s*\)/.test(code) && meaningfulLogs.some((l) => l.trim() === '14');
      return { passed: valid, message: valid ? 'ممتاز! الدالة استقبلت 7 وطبعت ضعفها.' : 'عرّف doubleNumber بمعامل، واطبع ضعفه جوه الدالة، وبعدها استدعيها بـ7 عشان تطبع 14.' };
    }

    case 12: {
      const valid = /function\s+getArea\s*\(/.test(code) && /return\s+\w+\s*\*\s*\w+/.test(code) && /getArea\s*\(\s*5\s*,\s*4\s*\)/.test(code) && meaningfulLogs.some((l) => l.includes('20'));
      return { passed: valid, message: valid ? 'صحيح! حسبت المساحة وأعدت الناتج من الدالة.' : 'اكتب getArea بمعامل للطول ومعامل للعرض، ورجّع حاصل ضربهم، وبعدها جرّب 5 و4 واطبع 20.' };
    }

    case 13: {
      const localSecret = /function\s+startGame\s*\([^)]*\)\s*\{[\s\S]*?const\s+secretCode\s*=\s*999/.test(code);
      const logged = meaningfulLogs.some((l) => l.includes('اللعبة بدأت'));
      return { passed: localSecret && logged, message: localSecret && logged ? 'جيد! secretCode داخل نطاق startGame.' : 'عرّف secretCode بقيمة 999 جوه startGame واطبع "اللعبة بدأت".' };
    }

    case 14: {
      const valid = /const\s+secret\s*=\s*6/.test(code) && /const\s+guess\s*=\s*6/.test(code) && /if\s*\(/.test(code) && /else/.test(code) && meaningfulLogs.some((l) => l.includes('مبروك كسبت'));
      return { passed: valid, message: valid ? 'مبروك! التخمين طلع زي الرقم السري وظهرت رسالة الفوز.' : 'عرّف secret وguess بقيمة 6، وافحصهم بـif/else واطبع "مبروك كسبت" لو طلعوا زي بعض.' };
    }

    case 15: {
      const hasGrades = /\[\s*88\s*,\s*65\s*,\s*92\s*,\s*40\s*,\s*77\s*\]/.test(code);
      const hasEdges = /grades\s*\[\s*0\s*\]/.test(code) && /grades\s*\[\s*grades\.length\s*-\s*1\s*\]/.test(code);
      const printed = meaningfulLogs.some((l) => l.includes('88')) && meaningfulLogs.some((l) => l.includes('77')) && meaningfulLogs.some((l) => l.includes('165'));
      return { passed: hasGrades && hasEdges && printed, message: hasGrades && hasEdges && printed ? 'تمام! استخدمت الفهرس الأول وآخر فهرس وحسبت مجموعهما.' : 'أنشئ grades بالقيم [88, 65, 92, 40, 77] واطبع أول وآخر عنصر ومجموعهما (165).'};
    }

    case 16: {
      const valid = /for\s*\(\s*(?:const|let)\s+\w+\s+of\s+\w+\s*\)/.test(code) && /\[\s*2\s*,\s*5\s*,\s*8\s*\]/.test(code) &&
        ['4', '10', '16'].every((n) => meaningfulLogs.some((l) => l.includes(n)));
      return { passed: valid, message: valid ? 'عاش! استخدمت for...of وضاعفت كل قيمة.' : 'استخدم for...of مع [2, 5, 8] واطبع ضعف كل رقم: 4 و10 و16.' };
    }

    case 17: {
      const valid = /for\s*\(/.test(code) && /evenNumbers/.test(code) && /\.push\s*\(/.test(code) && /%\s*2/.test(code) &&
        ['2', '4', '6', '8', '10'].every((n) => meaningfulLogs.some((l) => l.includes(n)));
      return { passed: valid, message: valid ? 'حلو! جمّعت الأعداد الزوجية في مصفوفة باستخدام حلقة وpush.' : 'اعمل evenNumbers، ولف من 1 لـ10، وضيف الأعداد الزوجية بـpush، وبعدها اطبع المصفوفة.' };
    }

    case 24: {
      const valid = /const\s+phone\s*=\s*\{/.test(code) && /brand\s*:\s*["']سامسونج["']/.test(code) && /price\s*:\s*8000/.test(code) &&
        /phone\.brand/.test(code) && /phone\.price/.test(code) && meaningfulLogs.some((l) => l.includes('سامسونج') && l.includes('8000'));
      return { passed: valid, message: valid ? 'ممتاز! أنشأت كائن الهاتف وطبعت خصائصه.' : 'اعمل object اسمه phone فيه brand سامسونج وprice قيمته 8000، وبعدها اطبع phone.brand وphone.price.' };
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

    // Part Capstone 4: Guessing game function and return value
    case 'part4-capstone': {
      const hasFunction = /function\s+checkGuess\s*\(\s*\w+\s*,\s*\w+\s*\)/.test(code);
      const hasReturn = /return/.test(code);
      if (!hasFunction || !hasReturn) {
        return {
          passed: false,
          message: 'عرّف checkGuess بمعاملين واستخدم return لإرجاع رسالة النتيجة.',
        };
      }
      if (!meaningfulLogs.some((l) => l.includes('مبروك كسبت'))) {
        return {
          passed: false,
          message: 'استدع checkGuess(6, 6) واطبع رسالة "مبروك كسبت".',
        };
      }
      return {
        passed: true,
        message: 'إتقان للدوال والشروط! 🎮 فحصت التخمين ورجّعت النتيجة.',
      };
    }

    // Part Capstone 5: Count passing grades with for...of
    case 'part5-capstone': {
      const hasLoop = /for\s*\(\s*const\s+\w+\s+of\s+scores\s*\)/.test(code);
      if (!hasLoop) {
        return {
          passed: false,
          message: 'استخدم for...of عشان تعدّي على عناصر scores.',
        };
      }
      if (!/score\s*>=\s*50/.test(code) || !meaningfulLogs.some((l) => l.includes('الناجحين: 3'))) {
        return {
          passed: false,
          message: 'عدّ الدرجات اللي score بتاعها >= 50 واطبع "الناجحين: 3".',
        };
      }
      return {
        passed: true,
        message: 'برافو! عدّيت على المصفوفة وحسبت الدرجات الناجحة.',
      };
    }

    // Part Capstone 6: Student object method and this
    case 'part6-capstone': {
      const hasStudent = /const\s+student\s*=\s*\{/.test(code);
      const hasMethod = /introduce\s*\([^)]*\)\s*\{/.test(code) && /this\.name/.test(code);
      if (!hasStudent || !hasMethod) {
        return {
          passed: false,
          message: 'اعمل object اسمه student جواه introduce()، واستخدم this.name عشان تكوّن التحية.',
        };
      }
      if (!meaningfulLogs.some((l) => l.includes('أنا سارة'))) {
        return {
          passed: false,
          message: 'استدعي student.introduce() واطبع "أنا سارة".',
        };
      }
      return {
        passed: true,
        message: 'مبروك خلّصت المسار! عملت object وmethod بتستخدم this بنجاح.',
      };
    }

    default: {
      return {
        passed: false,
        message: 'هذا التحدي لا يملك فحصاً آلياً لهذا الفصل بعد. راجع المطلوب وتأكد من اكتمال الحل قبل المحاولة مرة أخرى.',
      };
    }
  }
}
