#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const services = [
  // === SAUDI-SPECIFIC ===
  { slug: "tamara", name: "Tamara", nameAr: "تمارا", icon: "tamara.co", difficulty: "medium", difficultyAr: "متوسط", difficultyClass: "medium", price: "مجاني", priceUnit: "", category: "اشتر الآن وادفع لاحقاً",
    steps: ["افتح تطبيق تمارا", "سجّل دخول بحسابك", "اذهب لـ الملف الشخصي ← الإعدادات", "اضغط على حذف الحساب", "أكّد عبر رسالة التحقق", "انتظر تأكيد الحذف بالإيميل"],
    warning: "تأكد من سداد جميع الأقساط المتبقية قبل إلغاء الحساب، وإلا ستتراكم عليك رسوم تأخير.", cancelUrl: "https://app.tamara.co", darkPattern: "إخفاء خيار حذف الحساب في أعماق الإعدادات" },
  { slug: "tabby", name: "Tabby", nameAr: "تابي", icon: "tabby.ai", difficulty: "medium", difficultyAr: "متوسط", difficultyClass: "medium", price: "مجاني", priceUnit: "", category: "اشتر الآن وادفع لاحقاً",
    steps: ["افتح تطبيق تابي", "سجّل دخول", "اذهب لـ الحساب ← الإعدادات", "اضغط حذف الحساب", "أكّد عبر رمز التحقق"],
    warning: "سدد جميع أقساطك أولاً. حذف الحساب لا يلغي الأقساط المتبقية.", cancelUrl: "https://app.tabby.ai", darkPattern: "" },
  { slug: "stc-pay", name: "STC Pay", nameAr: "STC Pay", icon: "stcpay.com.sa", difficulty: "hard", difficultyAr: "صعب", difficultyClass: "hard", price: "مجاني", priceUnit: "", category: "محفظة رقمية",
    steps: ["افتح تطبيق STC Pay", "اذهب للإعدادات", "اختر إدارة الحساب", "اضغط إغلاق الحساب", "حوّل رصيدك المتبقي لحساب بنكي", "أكّد الإغلاق"],
    warning: "يجب تحويل كل رصيدك قبل إغلاق الحساب. العملية قد تستغرق حتى 30 يوم.", cancelUrl: "", darkPattern: "يتطلب تحويل الرصيد أولاً مما يعقد الإلغاء" },
  { slug: "nana-direct", name: "Nana Direct", nameAr: "نانا دايركت", icon: "nana.sa", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "25", priceUnit: "ر.س/شهر", category: "توصيل بقالة",
    steps: ["افتح تطبيق نانا", "اضغط على حسابك", "اذهب لـ اشتراك نانا بلس", "اضغط إلغاء الاشتراك", "أكّد الإلغاء"],
    warning: "", cancelUrl: "", darkPattern: "" },
  { slug: "lulu-hypermarket", name: "Lulu Hypermarket Delivery", nameAr: "لولو هايبرماركت", icon: "luluhypermarket.com", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "15", priceUnit: "ر.س/شهر", category: "توصيل بقالة",
    steps: ["افتح تطبيق لولو", "اذهب لحسابك", "اضغط إدارة الاشتراك", "اضغط إلغاء", "أكّد"],
    warning: "", cancelUrl: "", darkPattern: "" },
  { slug: "wssel", name: "Wssel", nameAr: "وصّل", icon: "wssel.com", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "19.99", priceUnit: "ر.س/شهر", category: "توصيل",
    steps: ["افتح تطبيق وصّل", "اذهب للملف الشخصي", "اضغط على اشتراكي", "اضغط إلغاء الاشتراك", "أكّد الإلغاء"],
    warning: "", cancelUrl: "", darkPattern: "" },
  { slug: "al-dawaa-delivery", name: "Al Dawaa Delivery", nameAr: "الدواء توصيل", icon: "al-dawaa.com", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "10", priceUnit: "ر.س/شهر", category: "صيدلية",
    steps: ["افتح تطبيق الدواء", "اذهب لحسابك", "اضغط على اشتراك التوصيل", "اضغط إلغاء", "أكّد الإلغاء"],
    warning: "", cancelUrl: "", darkPattern: "" },
  { slug: "sehha-app", name: "Sehha", nameAr: "صحة", icon: "sehha.sa", difficulty: "medium", difficultyAr: "متوسط", difficultyClass: "medium", price: "49", priceUnit: "ر.س/شهر", category: "صحة رقمية",
    steps: ["افتح تطبيق صحة", "سجّل دخول", "اذهب لـ إعدادات الحساب", "اضغط إدارة الاشتراك", "اضغط إلغاء الاشتراك", "أكّد الإلغاء"],
    warning: "تأكد من عدم وجود مواعيد قادمة قبل الإلغاء.", cancelUrl: "", darkPattern: "" },
  { slug: "riyadh-season", name: "Riyadh Season", nameAr: "موسم الرياض", icon: "riyadhseason.sa", difficulty: "medium", difficultyAr: "متوسط", difficultyClass: "medium", price: "متغير", priceUnit: "", category: "ترفيه",
    steps: ["افتح تطبيق موسم الرياض", "سجّل دخول", "اذهب لـ تذاكري ← الاشتراكات", "اختر الاشتراك واضغط إلغاء", "أكّد عبر رمز التحقق"],
    warning: "بعض التذاكر غير قابلة للاسترداد. تحقق من سياسة الإلغاء.", cancelUrl: "https://riyadhseason.sa", darkPattern: "" },
  { slug: "saudi-airlines-alfursan", name: "Saudi Airlines AlFursan", nameAr: "الخطوط السعودية الفرسان", icon: "saudia.com", difficulty: "hard", difficultyAr: "صعب", difficultyClass: "hard", price: "199", priceUnit: "ر.س/سنة", category: "طيران",
    steps: ["افتح saudia.com وسجّل دخول", "اذهب لـ حساب الفرسان", "اضغط إدارة العضوية", "اتصل بخدمة العملاء لإلغاء العضوية المدفوعة", "أكّد الإلغاء بالهاتف"],
    warning: "إلغاء عضوية الفرسان المدفوعة يتطلب الاتصال بخدمة العملاء.", cancelUrl: "https://www.saudia.com", darkPattern: "يجبرك على الاتصال الهاتفي" },
  { slug: "qatat", name: "Qatat", nameAr: "قطات", icon: "qatat.com", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "9.99", priceUnit: "ر.س/شهر", category: "عروض وتخفيضات",
    steps: ["افتح تطبيق قطات", "اذهب لحسابك", "اضغط إدارة الاشتراك", "اضغط إلغاء", "أكّد"],
    warning: "", cancelUrl: "", darkPattern: "" },
  { slug: "extra-rewards", name: "Extra Rewards", nameAr: "اكسترا ريواردز", icon: "extra.com", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "مجاني", priceUnit: "", category: "مكافآت",
    steps: ["افتح extra.com وسجّل دخول", "اذهب لحسابك", "اضغط برنامج المكافآت", "اضغط إلغاء العضوية", "أكّد"],
    warning: "", cancelUrl: "https://www.extra.com", darkPattern: "" },
  { slug: "floward", name: "Floward", nameAr: "فلاورد", icon: "floward.com", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "متغير", priceUnit: "", category: "توصيل هدايا",
    steps: ["افتح تطبيق فلاورد", "اذهب لحسابك", "اضغط اشتراكاتي", "اختر الاشتراك واضغط إلغاء", "أكّد الإلغاء"],
    warning: "", cancelUrl: "https://www.floward.com", darkPattern: "" },
  { slug: "the-entertainer", name: "The Entertainer", nameAr: "ذا إنترتينر", icon: "theentertainerme.com", difficulty: "medium", difficultyAr: "متوسط", difficultyClass: "medium", price: "195", priceUnit: "ر.س/سنة", category: "عروض وتخفيضات",
    steps: ["افتح تطبيق The Entertainer", "سجّل دخول", "اذهب لـ Account ← Subscription", "اضغط Cancel Auto-Renewal", "أكّد الإلغاء"],
    warning: "الاشتراك سنوي ولا يسترد. الإلغاء يوقف التجديد التلقائي فقط.", cancelUrl: "", darkPattern: "لا يوجد استرداد للاشتراك السنوي" },
  { slug: "yajny", name: "Yajny", nameAr: "ياجني", icon: "yajny.com", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "مجاني", priceUnit: "", category: "كاشباك",
    steps: ["افتح yajny.com وسجّل دخول", "اذهب لإعدادات الحساب", "اضغط حذف الحساب", "أكّد عبر الإيميل"],
    warning: "اسحب رصيد الكاشباك قبل حذف الحساب.", cancelUrl: "https://www.yajny.com", darkPattern: "" },
  { slug: "golden-scent", name: "Golden Scent", nameAr: "قولدن سنت", icon: "goldenscent.com", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "79", priceUnit: "ر.س/شهر", category: "عطور",
    steps: ["افتح goldenscent.com وسجّل دخول", "اذهب لحسابك", "اضغط اشتراكاتي", "اضغط إلغاء الاشتراك", "أكّد"],
    warning: "", cancelUrl: "https://www.goldenscent.com", darkPattern: "" },

  // === MIDDLE EAST STREAMING ===
  { slug: "wetv", name: "WeTV", nameAr: "WeTV", icon: "wetv.vip", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "19.99", priceUnit: "ر.س/شهر", category: "بث ترفيهي",
    steps: ["افتح تطبيق WeTV", "اضغط على حسابك", "اذهب لـ VIP Membership", "اضغط Cancel Auto-Renewal", "أكّد الإلغاء"],
    warning: "إذا اشتركت عن طريق App Store أو Google Play، ألغِ من إعدادات جهازك.", cancelUrl: "", darkPattern: "" },
  { slug: "viu", name: "Viu", nameAr: "Viu", icon: "viu.com", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "14.99", priceUnit: "ر.س/شهر", category: "بث ترفيهي",
    steps: ["افتح viu.com وسجّل دخول", "اذهب لـ Account ← Subscription", "اضغط Cancel Subscription", "أكّد الإلغاء"],
    warning: "", cancelUrl: "https://www.viu.com", darkPattern: "" },
  { slug: "mbc-shahid-sports", name: "Shahid VIP Sports", nameAr: "شاهد VIP رياضة", icon: "shahid.mbc.net", difficulty: "medium", difficultyAr: "متوسط", difficultyClass: "medium", price: "29.99", priceUnit: "ر.س/شهر", category: "بث رياضي",
    steps: ["افتح shahid.mbc.net وسجّل دخول", "اذهب لـ حسابي ← الاشتراك", "اضغط إدارة الاشتراك", "اختر إلغاء باقة الرياضة", "أكّد الإلغاء"],
    warning: "إذا اشتركت عن طريق App Store، ألغِ من إعدادات iPhone.", cancelUrl: "https://shahid.mbc.net/account", darkPattern: "" },
  { slug: "wavo", name: "Wavo", nameAr: "وافو", icon: "wavo.com", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "19.99", priceUnit: "ر.س/شهر", category: "بث ترفيهي",
    steps: ["افتح wavo.com وسجّل دخول", "اذهب لحسابك", "اضغط Manage Subscription", "اضغط Cancel", "أكّد الإلغاء"],
    warning: "", cancelUrl: "https://www.wavo.com", darkPattern: "" },
  { slug: "zee5", name: "Zee5", nameAr: "Zee5", icon: "zee5.com", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "14.99", priceUnit: "ر.س/شهر", category: "بث ترفيهي",
    steps: ["افتح zee5.com وسجّل دخول", "اذهب لـ Subscription", "اضغط Cancel Subscription", "أكّد الإلغاء"],
    warning: "", cancelUrl: "https://www.zee5.com", darkPattern: "" },
  { slug: "icflix", name: "ICFLIX", nameAr: "آي سي فلكس", icon: "icflix.com", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "24.99", priceUnit: "ر.س/شهر", category: "بث ترفيهي",
    steps: ["افتح icflix.com وسجّل دخول", "اذهب لـ My Account", "اضغط Subscription Settings", "اضغط Cancel", "أكّد"],
    warning: "", cancelUrl: "https://www.icflix.com", darkPattern: "" },
  { slug: "rotana-plus", name: "Rotana+", nameAr: "روتانا بلس", icon: "rotana.net", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "12.99", priceUnit: "ر.س/شهر", category: "بث ترفيهي",
    steps: ["افتح تطبيق Rotana+", "سجّل دخول", "اذهب للإعدادات ← الاشتراك", "اضغط إلغاء", "أكّد"],
    warning: "", cancelUrl: "", darkPattern: "" },

  // === GLOBAL STREAMING ===
  { slug: "paramount-plus", name: "Paramount+", nameAr: "باراماونت بلس", icon: "paramountplus.com", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "29.99", priceUnit: "ر.س/شهر", category: "بث ترفيهي",
    steps: ["افتح paramountplus.com وسجّل دخول", "اضغط على اسمك ← Account", "اضغط Cancel Subscription", "جاوب على سبب الإلغاء", "أكّد الإلغاء"],
    warning: "", cancelUrl: "https://www.paramountplus.com/account/", darkPattern: "" },
  { slug: "peacock", name: "Peacock", nameAr: "بيكوك", icon: "peacocktv.com", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "22.99", priceUnit: "ر.س/شهر", category: "بث ترفيهي",
    steps: ["افتح peacocktv.com وسجّل دخول", "اذهب لـ Account ← Plan & Payment", "اضغط Cancel Plan", "أكّد الإلغاء"],
    warning: "", cancelUrl: "https://www.peacocktv.com/account/plan", darkPattern: "" },
  { slug: "max-hbo", name: "Max (HBO)", nameAr: "ماكس HBO", icon: "max.com", difficulty: "medium", difficultyAr: "متوسط", difficultyClass: "medium", price: "37", priceUnit: "ر.س/شهر", category: "بث ترفيهي",
    steps: ["افتح max.com وسجّل دخول", "اذهب لـ Settings ← Subscription", "اضغط Manage Subscription", "اضغط Cancel Subscription", "أكّد عبر عدة صفحات"],
    warning: "Max يعرض عليك عروض بديلة قبل الإلغاء.", cancelUrl: "https://www.max.com/settings", darkPattern: "عروض متعددة للاحتفاظ بالاشتراك" },
  { slug: "discovery-plus", name: "Discovery+", nameAr: "ديسكفري بلس", icon: "discoveryplus.com", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "19.99", priceUnit: "ر.س/شهر", category: "بث ترفيهي",
    steps: ["افتح discoveryplus.com وسجّل دخول", "اذهب لـ Account", "اضغط Cancel Subscription", "أكّد الإلغاء"],
    warning: "", cancelUrl: "https://www.discoveryplus.com/account", darkPattern: "" },
  { slug: "mubi", name: "Mubi", nameAr: "موبي", icon: "mubi.com", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "37", priceUnit: "ر.س/شهر", category: "بث سينمائي",
    steps: ["افتح mubi.com/account وسجّل دخول", "اضغط Subscription", "اضغط Cancel Subscription", "أكّد الإلغاء"],
    warning: "", cancelUrl: "https://mubi.com/account", darkPattern: "" },
  { slug: "britbox", name: "BritBox", nameAr: "بريت بوكس", icon: "britbox.com", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "29.99", priceUnit: "ر.س/شهر", category: "بث ترفيهي",
    steps: ["افتح britbox.com وسجّل دخول", "اذهب لـ Account", "اضغط Cancel Subscription", "أكّد الإلغاء"],
    warning: "", cancelUrl: "https://www.britbox.com/account", darkPattern: "" },
  { slug: "apple-tv-plus", name: "Apple TV+", nameAr: "آبل تي في بلس", icon: "tv.apple.com", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "29.99", priceUnit: "ر.س/شهر", category: "بث ترفيهي",
    steps: ["افتح إعدادات iPhone ← اسمك ← الاشتراكات", "ابحث عن Apple TV+", "اضغط إلغاء الاشتراك", "أكّد الإلغاء"],
    warning: "يمكن أيضاً الإلغاء من tv.apple.com/account على الكمبيوتر.", cancelUrl: "https://tv.apple.com/account", darkPattern: "" },
  { slug: "funimation", name: "Funimation", nameAr: "فانيميشن", icon: "funimation.com", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "22.99", priceUnit: "ر.س/شهر", category: "أنمي",
    steps: ["افتح funimation.com/account وسجّل دخول", "اضغط Subscription", "اضغط Cancel Subscription", "أكّد الإلغاء"],
    warning: "فانيميشن اندمجت مع Crunchyroll. تحقق إذا تم نقل اشتراكك.", cancelUrl: "https://www.funimation.com/account", darkPattern: "" },
  { slug: "hayu", name: "Hayu", nameAr: "هايو", icon: "hayu.com", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "14.99", priceUnit: "ر.س/شهر", category: "بث ترفيهي",
    steps: ["افتح hayu.com وسجّل دخول", "اذهب لـ Account", "اضغط Cancel Subscription", "أكّد الإلغاء"],
    warning: "", cancelUrl: "https://www.hayu.com/account", darkPattern: "" },
  { slug: "mgm-plus", name: "MGM+", nameAr: "MGM بلس", icon: "mgmplus.com", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "22.99", priceUnit: "ر.س/شهر", category: "بث ترفيهي",
    steps: ["افتح mgmplus.com وسجّل دخول", "اذهب لـ Account Settings", "اضغط Cancel Subscription", "أكّد الإلغاء"],
    warning: "", cancelUrl: "https://www.mgmplus.com/account", darkPattern: "" },
  { slug: "acorn-tv", name: "Acorn TV", nameAr: "أكورن تي في", icon: "acorn.tv", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "19.99", priceUnit: "ر.س/شهر", category: "بث ترفيهي",
    steps: ["افتح acorn.tv وسجّل دخول", "اذهب لـ Account", "اضغط Cancel Subscription", "أكّد الإلغاء"],
    warning: "", cancelUrl: "https://acorn.tv/account", darkPattern: "" },
  { slug: "amc-plus", name: "AMC+", nameAr: "AMC بلس", icon: "amcplus.com", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "29.99", priceUnit: "ر.س/شهر", category: "بث ترفيهي",
    steps: ["افتح amcplus.com وسجّل دخول", "اذهب لـ Account", "اضغط Manage Subscription", "اضغط Cancel", "أكّد الإلغاء"],
    warning: "", cancelUrl: "https://www.amcplus.com/account", darkPattern: "" },

  // === PRODUCTIVITY / SAAS ===
  { slug: "slack-pro", name: "Slack Pro", nameAr: "سلاك برو", icon: "slack.com", difficulty: "medium", difficultyAr: "متوسط", difficultyClass: "medium", price: "29.99", priceUnit: "ر.س/شهر", category: "إنتاجية",
    steps: ["افتح slack.com وسجّل دخول كمدير", "اذهب لـ Settings & administration", "اضغط Billing", "اضغط Cancel Plan", "أكّد الإلغاء وتحويل للخطة المجانية"],
    warning: "فقط مدير Workspace يقدر يلغي. البيانات تنحفظ لكن مع قيود.", cancelUrl: "https://slack.com/admin/billing", darkPattern: "" },
  { slug: "figma-pro", name: "Figma Professional", nameAr: "فيجما برو", icon: "figma.com", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "45", priceUnit: "ر.س/شهر", category: "تصميم",
    steps: ["افتح figma.com وسجّل دخول", "اذهب لـ Team Settings", "اضغط Billing", "اضغط Downgrade to Starter", "أكّد الإلغاء"],
    warning: "", cancelUrl: "https://www.figma.com/settings", darkPattern: "" },
  { slug: "adobe-photoshop", name: "Adobe Photoshop", nameAr: "أدوبي فوتوشوب", icon: "adobe.com", difficulty: "hard", difficultyAr: "صعب", difficultyClass: "hard", price: "82", priceUnit: "ر.س/شهر", category: "تصميم",
    steps: ["افتح account.adobe.com/plans", "ابحث عن Photoshop", "اضغط Manage Plan", "اضغط Cancel Plan", "جاوب على أسئلة الإلغاء", "أكّد الإلغاء — قد تدفع رسوم إلغاء مبكر"],
    warning: "أدوبي يفرض رسوم إلغاء مبكر تصل 50% من المبلغ المتبقي في العقد السنوي.", cancelUrl: "https://account.adobe.com/plans", darkPattern: "رسوم إلغاء مبكر مخفية + عروض متعددة للبقاء" },
  { slug: "adobe-illustrator", name: "Adobe Illustrator", nameAr: "أدوبي إلستريتر", icon: "adobe.com", difficulty: "hard", difficultyAr: "صعب", difficultyClass: "hard", price: "82", priceUnit: "ر.س/شهر", category: "تصميم",
    steps: ["افتح account.adobe.com/plans", "ابحث عن Illustrator", "اضغط Manage Plan", "اضغط Cancel Plan", "جاوب على أسئلة الإلغاء المتعددة", "أكّد — قد تدفع رسوم إلغاء مبكر"],
    warning: "رسوم إلغاء مبكر تصل 50% من المبلغ المتبقي.", cancelUrl: "https://account.adobe.com/plans", darkPattern: "رسوم إلغاء مبكر + 7 خطوات قبل الإلغاء" },
  { slug: "adobe-lightroom", name: "Adobe Lightroom", nameAr: "أدوبي لايتروم", icon: "adobe.com", difficulty: "hard", difficultyAr: "صعب", difficultyClass: "hard", price: "37", priceUnit: "ر.س/شهر", category: "تصوير",
    steps: ["افتح account.adobe.com/plans", "ابحث عن Lightroom", "اضغط Manage Plan", "اضغط Cancel Plan", "جاوب على أسئلة الإلغاء", "أكّد الإلغاء"],
    warning: "حمّل صورك من السحابة قبل الإلغاء — التخزين السحابي ينتهي مع الاشتراك.", cancelUrl: "https://account.adobe.com/plans", darkPattern: "رسوم إلغاء مبكر مخفية" },
  { slug: "todoist-premium", name: "Todoist Pro", nameAr: "تودويست برو", icon: "todoist.com", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "15", priceUnit: "ر.س/شهر", category: "إنتاجية",
    steps: ["افتح todoist.com/app/settings/subscription", "اضغط Manage subscription", "اضغط Cancel subscription", "أكّد الإلغاء"],
    warning: "", cancelUrl: "https://todoist.com/app/settings/subscription", darkPattern: "" },
  { slug: "evernote-premium", name: "Evernote Premium", nameAr: "إيفرنوت بريميوم", icon: "evernote.com", difficulty: "medium", difficultyAr: "متوسط", difficultyClass: "medium", price: "52", priceUnit: "ر.س/شهر", category: "إنتاجية",
    steps: ["افتح evernote.com/Settings.action", "اضغط Manage Subscription", "اضغط Cancel Subscription", "جاوب على أسئلة الإلغاء", "أكّد الإلغاء"],
    warning: "إيفرنوت يحد الأجهزة في الخطة المجانية لجهازين فقط.", cancelUrl: "https://www.evernote.com/Settings.action", darkPattern: "تحذيرات مبالغة عن فقدان الميزات" },
  { slug: "bear-pro", name: "Bear Pro", nameAr: "بير برو", icon: "bear.app", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "5.99", priceUnit: "ر.س/شهر", category: "إنتاجية",
    steps: ["افتح إعدادات iPhone ← اسمك ← الاشتراكات", "ابحث عن Bear", "اضغط إلغاء الاشتراك", "أكّد الإلغاء"],
    warning: "Bear Pro يُلغى فقط من إعدادات App Store.", cancelUrl: "", darkPattern: "" },
  { slug: "obsidian-sync", name: "Obsidian Sync", nameAr: "أوبسيديان سنك", icon: "obsidian.md", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "30", priceUnit: "ر.س/شهر", category: "إنتاجية",
    steps: ["افتح obsidian.md/account وسجّل دخول", "اذهب لـ Billing", "اضغط Cancel Sync subscription", "أكّد الإلغاء"],
    warning: "حمّل ملاحظاتك محلياً قبل الإلغاء لضمان عدم فقدان البيانات.", cancelUrl: "https://obsidian.md/account", darkPattern: "" },
  { slug: "dashlane", name: "Dashlane", nameAr: "داشلين", icon: "dashlane.com", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "18.99", priceUnit: "ر.س/شهر", category: "أمان",
    steps: ["افتح app.dashlane.com وسجّل دخول", "اذهب لـ My account ← Subscription", "اضغط Cancel subscription", "أكّد الإلغاء"],
    warning: "صدّر كلمات مرورك قبل الإلغاء.", cancelUrl: "https://app.dashlane.com/account/subscription", darkPattern: "" },
  { slug: "bitwarden-premium", name: "Bitwarden Premium", nameAr: "بتواردن بريميوم", icon: "bitwarden.com", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "3.75", priceUnit: "ر.س/شهر", category: "أمان",
    steps: ["افتح vault.bitwarden.com وسجّل دخول", "اذهب لـ Settings ← Subscription", "اضغط Cancel Subscription", "أكّد الإلغاء"],
    warning: "", cancelUrl: "https://vault.bitwarden.com/#/settings/subscription", darkPattern: "" },
  { slug: "lastpass", name: "LastPass", nameAr: "لاست باس", icon: "lastpass.com", difficulty: "medium", difficultyAr: "متوسط", difficultyClass: "medium", price: "11.99", priceUnit: "ر.س/شهر", category: "أمان",
    steps: ["افتح lastpass.com وسجّل دخول", "اذهب لـ Account Settings", "اضغط My Subscription", "اضغط Cancel Subscription", "جاوب على أسئلة الإلغاء", "أكّد"],
    warning: "صدّر كلمات مرورك لمدير كلمات مرور بديل قبل الإلغاء.", cancelUrl: "https://lastpass.com/account.php", darkPattern: "أسئلة إلغاء متعددة" },

  // === CLOUD STORAGE ===
  { slug: "pcloud", name: "pCloud", nameAr: "بي كلاود", icon: "pcloud.com", difficulty: "medium", difficultyAr: "متوسط", difficultyClass: "medium", price: "18.99", priceUnit: "ر.س/شهر", category: "تخزين سحابي",
    steps: ["افتح pcloud.com وسجّل دخول", "اذهب لـ Settings ← Subscription", "اضغط Cancel Subscription", "أكّد الإلغاء"],
    warning: "حمّل ملفاتك قبل الإلغاء. التخزين يتقلص للخطة المجانية.", cancelUrl: "https://www.pcloud.com/settings/subscription", darkPattern: "" },
  { slug: "mega-pro", name: "MEGA Pro", nameAr: "ميجا برو", icon: "mega.io", difficulty: "medium", difficultyAr: "متوسط", difficultyClass: "medium", price: "37", priceUnit: "ر.س/شهر", category: "تخزين سحابي",
    steps: ["افتح mega.io وسجّل دخول", "اذهب لـ Settings ← Plan", "اضغط Cancel subscription", "أكّد الإلغاء"],
    warning: "إذا تجاوزت المساحة المجانية، حمّل ملفاتك أو احذف الزائد.", cancelUrl: "https://mega.io/account/plan", darkPattern: "" },
  { slug: "box-cloud", name: "Box", nameAr: "بوكس", icon: "box.com", difficulty: "medium", difficultyAr: "متوسط", difficultyClass: "medium", price: "41.99", priceUnit: "ر.س/شهر", category: "تخزين سحابي",
    steps: ["افتح app.box.com وسجّل دخول كمدير", "اذهب لـ Admin Console ← Billing", "اضغط Cancel Plan", "أكّد الإلغاء"],
    warning: "فقط مدير الحساب يقدر يلغي.", cancelUrl: "https://app.box.com/admin/billing", darkPattern: "" },
  { slug: "onedrive-standalone", name: "OneDrive Standalone", nameAr: "ون درايف", icon: "onedrive.live.com", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "7.49", priceUnit: "ر.س/شهر", category: "تخزين سحابي",
    steps: ["افتح account.microsoft.com/services", "ابحث عن OneDrive", "اضغط Manage", "اضغط Cancel", "أكّد الإلغاء"],
    warning: "", cancelUrl: "https://account.microsoft.com/services", darkPattern: "" },

  // === VPN / SECURITY ===
  { slug: "surfshark", name: "Surfshark", nameAr: "سيرف شارك", icon: "surfshark.com", difficulty: "medium", difficultyAr: "متوسط", difficultyClass: "medium", price: "44.99", priceUnit: "ر.س/شهر", category: "VPN",
    steps: ["افتح my.surfshark.com وسجّل دخول", "اذهب لـ Subscription", "اضغط Cancel auto-renewal", "جاوب على أسئلة الإلغاء", "أكّد الإلغاء"],
    warning: "", cancelUrl: "https://my.surfshark.com/account/subscription", darkPattern: "عروض خصم متعددة قبل الإلغاء" },
  { slug: "cyberghost", name: "CyberGhost", nameAr: "سايبر غوست", icon: "cyberghostvpn.com", difficulty: "medium", difficultyAr: "متوسط", difficultyClass: "medium", price: "49.99", priceUnit: "ر.س/شهر", category: "VPN",
    steps: ["افتح my.cyberghostvpn.com وسجّل دخول", "اذهب لـ My Subscriptions", "اضغط Cancel Subscription", "جاوب على أسئلة الإلغاء", "أكّد"],
    warning: "يمكنك طلب استرداد خلال 45 يوم من الاشتراك.", cancelUrl: "https://my.cyberghostvpn.com", darkPattern: "أسئلة إلغاء متعددة" },
  { slug: "protonvpn", name: "ProtonVPN", nameAr: "بروتون في بي إن", icon: "protonvpn.com", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "37", priceUnit: "ر.س/شهر", category: "VPN",
    steps: ["افتح account.protonvpn.com", "اذهب لـ Dashboard ← Plans", "اضغط Downgrade to Free", "أكّد الإلغاء"],
    warning: "", cancelUrl: "https://account.protonvpn.com/dashboard", darkPattern: "" },
  { slug: "protonmail", name: "ProtonMail Plus", nameAr: "بروتون ميل بلس", icon: "proton.me", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "15", priceUnit: "ر.س/شهر", category: "بريد مشفر",
    steps: ["افتح account.proton.me/dashboard", "اضغط Manage Plan", "اضغط Downgrade to Free", "أكّد الإلغاء"],
    warning: "الخطة المجانية تحد التخزين لـ 500MB. حمّل إيميلاتك المهمة.", cancelUrl: "https://account.proton.me/dashboard", darkPattern: "" },
  { slug: "mullvad", name: "Mullvad VPN", nameAr: "مولفاد في بي إن", icon: "mullvad.net", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "18.75", priceUnit: "ر.س/شهر", category: "VPN",
    steps: ["مولفاد لا يتطلب إلغاء — لا يوجد تجديد تلقائي", "ببساطة لا تضيف رصيد جديد", "الحساب ينتهي تلقائياً عند انتهاء الرصيد"],
    warning: "مولفاد لا يسجل بيانات ولا يتجدد تلقائياً — ما تحتاج تلغي شيء.", cancelUrl: "https://mullvad.net/account", darkPattern: "" },
  { slug: "private-internet-access", name: "Private Internet Access", nameAr: "PIA في بي إن", icon: "privateinternetaccess.com", difficulty: "medium", difficultyAr: "متوسط", difficultyClass: "medium", price: "41.99", priceUnit: "ر.س/شهر", category: "VPN",
    steps: ["افتح privateinternetaccess.com/account", "سجّل دخول", "اذهب لـ Subscription", "اضغط Cancel Subscription", "أكّد الإلغاء"],
    warning: "", cancelUrl: "https://www.privateinternetaccess.com/account", darkPattern: "" },

  // === DATING ===
  { slug: "tinder-gold", name: "Tinder Gold", nameAr: "تندر قولد", icon: "tinder.com", difficulty: "medium", difficultyAr: "متوسط", difficultyClass: "medium", price: "67.99", priceUnit: "ر.س/شهر", category: "تعارف",
    steps: ["افتح تطبيق تندر", "اضغط على الملف الشخصي", "اضغط Settings ← Manage Payment Account", "اضغط Cancel Subscription", "أو ألغِ من App Store / Google Play مباشرة"],
    warning: "أغلب اشتراكات تندر تتم عبر App Store أو Google Play — ألغِ من هناك.", cancelUrl: "", darkPattern: "إخفاء خيار الإلغاء داخل التطبيق" },
  { slug: "bumble-premium", name: "Bumble Premium", nameAr: "بامبل بريميوم", icon: "bumble.com", difficulty: "medium", difficultyAr: "متوسط", difficultyClass: "medium", price: "82", priceUnit: "ر.س/شهر", category: "تعارف",
    steps: ["افتح إعدادات هاتفك ← الاشتراكات", "ابحث عن Bumble", "اضغط إلغاء الاشتراك", "أكّد الإلغاء"],
    warning: "الإلغاء من داخل التطبيق غير متاح عادةً — ألغِ من المتجر.", cancelUrl: "", darkPattern: "لا يوجد خيار إلغاء داخل التطبيق" },
  { slug: "hinge-plus", name: "Hinge+", nameAr: "هينج بلس", icon: "hinge.co", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "52", priceUnit: "ر.س/شهر", category: "تعارف",
    steps: ["افتح إعدادات هاتفك ← الاشتراكات", "ابحث عن Hinge", "اضغط إلغاء الاشتراك", "أكّد الإلغاء"],
    warning: "", cancelUrl: "", darkPattern: "" },
  { slug: "match-com", name: "Match.com", nameAr: "ماتش دوت كوم", icon: "match.com", difficulty: "hard", difficultyAr: "صعب", difficultyClass: "hard", price: "97", priceUnit: "ر.س/شهر", category: "تعارف",
    steps: ["افتح match.com وسجّل دخول", "اضغط على الإعدادات (الترس)", "اذهب لـ Manage/Cancel Membership", "اضغط Cancel My Subscription", "جاوب على عدة أسئلة إلغاء", "أكّد الإلغاء النهائي"],
    warning: "Match.com يعرض عليك خصومات وعروض كثيرة قبل الإلغاء. لا تستسلم.", cancelUrl: "https://www.match.com/account", darkPattern: "7+ شاشات قبل إتمام الإلغاء" },

  // === NEWS / MEDIA ===
  { slug: "nytimes", name: "New York Times", nameAr: "نيويورك تايمز", icon: "nytimes.com", difficulty: "hard", difficultyAr: "صعب", difficultyClass: "hard", price: "18.75", priceUnit: "ر.س/شهر", category: "أخبار",
    steps: ["افتح myaccount.nytimes.com", "اذهب لـ Subscription", "اضغط Cancel Subscription", "جاوب على أسئلة الإلغاء", "رفض كل العروض البديلة", "أكّد الإلغاء"],
    warning: "NYT تعرض عليك خصومات كبيرة قبل الإلغاء. قد تحتاج ترفض 3-4 عروض.", cancelUrl: "https://myaccount.nytimes.com/seg/subscription", darkPattern: "عروض خصم متعددة + أسئلة كثيرة" },
  { slug: "wsj", name: "Wall Street Journal", nameAr: "وول ستريت جورنال", icon: "wsj.com", difficulty: "hard", difficultyAr: "صعب", difficultyClass: "hard", price: "149", priceUnit: "ر.س/شهر", category: "أخبار مالية",
    steps: ["افتح customercenter.wsj.com", "سجّل دخول", "اذهب لـ Subscription", "اضغط Cancel Subscription", "قد تحتاج الاتصال بخدمة العملاء", "أكّد الإلغاء"],
    warning: "WSJ قد يطلب منك الاتصال هاتفياً لإتمام الإلغاء.", cancelUrl: "https://customercenter.wsj.com", darkPattern: "يجبرك على الاتصال الهاتفي أحياناً" },
  { slug: "bloomberg", name: "Bloomberg", nameAr: "بلومبرغ", icon: "bloomberg.com", difficulty: "hard", difficultyAr: "صعب", difficultyClass: "hard", price: "149", priceUnit: "ر.س/شهر", category: "أخبار مالية",
    steps: ["افتح bloomberg.com/account", "سجّل دخول", "اضغط Manage Subscription", "اضغط Cancel", "تواصل مع الدعم إذا لم ينجح أونلاين"],
    warning: "بلومبرغ قد يتطلب التواصل مع خدمة العملاء.", cancelUrl: "https://www.bloomberg.com/account", darkPattern: "إلغاء أونلاين غير متاح دائماً" },
  { slug: "financial-times", name: "Financial Times", nameAr: "فايننشال تايمز", icon: "ft.com", difficulty: "medium", difficultyAr: "متوسط", difficultyClass: "medium", price: "135", priceUnit: "ر.س/شهر", category: "أخبار مالية",
    steps: ["افتح myaccount.ft.com", "اذهب لـ Subscription", "اضغط Cancel Subscription", "جاوب على أسئلة الإلغاء", "أكّد الإلغاء"],
    warning: "", cancelUrl: "https://myaccount.ft.com/details/subscription", darkPattern: "عروض خصم قبل الإلغاء" },
  { slug: "washington-post", name: "Washington Post", nameAr: "واشنطن بوست", icon: "washingtonpost.com", difficulty: "medium", difficultyAr: "متوسط", difficultyClass: "medium", price: "37", priceUnit: "ر.س/شهر", category: "أخبار",
    steps: ["افتح washingtonpost.com/my-post/subscriptions", "سجّل دخول", "اضغط Cancel Subscription", "جاوب على أسئلة الإلغاء", "أكّد الإلغاء"],
    warning: "", cancelUrl: "https://www.washingtonpost.com/my-post/subscriptions", darkPattern: "عروض خصم للبقاء" },
  { slug: "al-arabiya-premium", name: "Al Arabiya Premium", nameAr: "العربية بريميوم", icon: "alarabiya.net", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "14.99", priceUnit: "ر.س/شهر", category: "أخبار",
    steps: ["افتح alarabiya.net وسجّل دخول", "اذهب لحسابك", "اضغط إدارة الاشتراك", "اضغط إلغاء", "أكّد"],
    warning: "", cancelUrl: "https://www.alarabiya.net", darkPattern: "" },
  { slug: "medium-membership", name: "Medium", nameAr: "ميديوم", icon: "medium.com", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "18.75", priceUnit: "ر.س/شهر", category: "محتوى",
    steps: ["افتح medium.com/me/settings", "اذهب لـ Membership", "اضغط Manage membership", "اضغط Cancel membership", "أكّد الإلغاء"],
    warning: "", cancelUrl: "https://medium.com/me/settings", darkPattern: "" },

  // === FOOD / DELIVERY ===
  { slug: "doordash-dashpass", name: "DoorDash DashPass", nameAr: "دور داش", icon: "doordash.com", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "37", priceUnit: "ر.س/شهر", category: "توصيل طعام",
    steps: ["افتح تطبيق DoorDash أو doordash.com", "اذهب لـ Account ← DashPass", "اضغط Cancel DashPass", "أكّد الإلغاء"],
    warning: "", cancelUrl: "https://www.doordash.com/account", darkPattern: "" },
  { slug: "deliveroo-plus", name: "Deliveroo Plus", nameAr: "ديليفرو بلس", icon: "deliveroo.com", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "14.99", priceUnit: "ر.س/شهر", category: "توصيل طعام",
    steps: ["افتح تطبيق ديليفرو", "اضغط على حسابك", "اذهب لـ Deliveroo Plus", "اضغط Cancel membership", "أكّد الإلغاء"],
    warning: "", cancelUrl: "", darkPattern: "" },
  { slug: "talabat-pro", name: "Talabat Pro", nameAr: "طلبات برو", icon: "talabat.com", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "12.99", priceUnit: "ر.س/شهر", category: "توصيل طعام",
    steps: ["افتح تطبيق طلبات", "اضغط على حسابك", "اذهب لـ طلبات برو", "اضغط إلغاء الاشتراك", "أكّد الإلغاء"],
    warning: "", cancelUrl: "", darkPattern: "" },
  { slug: "instacart-plus", name: "Instacart+", nameAr: "إنستاكارت بلس", icon: "instacart.com", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "37", priceUnit: "ر.س/شهر", category: "توصيل بقالة",
    steps: ["افتح instacart.com/store/account/manage_membership", "اضغط Cancel membership", "جاوب على سبب الإلغاء", "أكّد الإلغاء"],
    warning: "", cancelUrl: "https://www.instacart.com/store/account/manage_membership", darkPattern: "" },
  { slug: "grubhub-plus", name: "Grubhub+", nameAr: "جرب هب بلس", icon: "grubhub.com", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "37", priceUnit: "ر.س/شهر", category: "توصيل طعام",
    steps: ["افتح grubhub.com/account", "اذهب لـ Grubhub+ membership", "اضغط Cancel membership", "أكّد الإلغاء"],
    warning: "", cancelUrl: "https://www.grubhub.com/account", darkPattern: "" },

  // === HEALTH / WELLNESS ===
  { slug: "headspace", name: "Headspace", nameAr: "هيدسبيس", icon: "headspace.com", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "49.99", priceUnit: "ر.س/شهر", category: "صحة نفسية",
    steps: ["افتح headspace.com/subscriptions", "سجّل دخول", "اضغط Cancel Subscription", "جاوب على سبب الإلغاء", "أكّد الإلغاء"],
    warning: "", cancelUrl: "https://www.headspace.com/subscriptions", darkPattern: "" },
  { slug: "noom", name: "Noom", nameAr: "نوم", icon: "noom.com", difficulty: "hard", difficultyAr: "صعب", difficultyClass: "hard", price: "224", priceUnit: "ر.س/شهر", category: "حمية وصحة",
    steps: ["افتح تطبيق Noom", "اذهب لـ Settings ← Subscription", "اضغط Cancel Subscription", "جاوب على أسئلة كثيرة", "ارفض كل العروض البديلة", "أكّد الإلغاء النهائي"],
    warning: "نوم مشهور بصعوبة الإلغاء. قد تحتاج تتواصل مع الدعم مباشرة.", cancelUrl: "https://www.noom.com", darkPattern: "10+ خطوات قبل الإلغاء + عروض متعددة + يطلب سبب مفصل" },
  { slug: "nike-training-club", name: "Nike Training Club", nameAr: "نايك ترينينج كلب", icon: "nike.com", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "52", priceUnit: "ر.س/شهر", category: "لياقة",
    steps: ["افتح إعدادات هاتفك ← الاشتراكات", "ابحث عن Nike Training Club", "اضغط إلغاء الاشتراك", "أكّد الإلغاء"],
    warning: "", cancelUrl: "", darkPattern: "" },
  { slug: "peloton", name: "Peloton", nameAr: "بيلوتون", icon: "onepeloton.com", difficulty: "medium", difficultyAr: "متوسط", difficultyClass: "medium", price: "49.99", priceUnit: "ر.س/شهر", category: "لياقة",
    steps: ["افتح members.onepeloton.com", "اذهب لـ Subscriptions", "اضغط Cancel Subscription", "جاوب على أسئلة الإلغاء", "أكّد"],
    warning: "", cancelUrl: "https://members.onepeloton.com/subscriptions", darkPattern: "عروض خصم للبقاء" },
  { slug: "calm", name: "Calm", nameAr: "كالم", icon: "calm.com", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "52", priceUnit: "ر.س/شهر", category: "صحة نفسية",
    steps: ["افتح calm.com/account وسجّل دخول", "اضغط Manage Subscription", "اضغط Cancel Subscription", "أكّد الإلغاء"],
    warning: "إذا اشتركت عن طريق App Store، ألغِ من إعدادات iPhone.", cancelUrl: "https://www.calm.com/account", darkPattern: "" },
  { slug: "flo-premium", name: "Flo Premium", nameAr: "فلو بريميوم", icon: "flo.health", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "37", priceUnit: "ر.س/شهر", category: "صحة",
    steps: ["افتح إعدادات هاتفك ← الاشتراكات", "ابحث عن Flo", "اضغط إلغاء الاشتراك", "أكّد الإلغاء"],
    warning: "Flo يُلغى من إعدادات App Store أو Google Play.", cancelUrl: "", darkPattern: "" },
  { slug: "whoop", name: "WHOOP", nameAr: "ووب", icon: "whoop.com", difficulty: "hard", difficultyAr: "صعب", difficultyClass: "hard", price: "112", priceUnit: "ر.س/شهر", category: "لياقة",
    steps: ["افتح app.whoop.com وسجّل دخول", "اذهب لـ Membership", "اضغط Cancel Membership", "جاوب على أسئلة الإلغاء", "قد تحتاج إرجاع الجهاز", "أكّد الإلغاء"],
    warning: "إذا اشتريت جهاز WHOOP بسعر مخفض مع اشتراك، قد تدفع رسوم إلغاء مبكر.", cancelUrl: "https://app.whoop.com/membership", darkPattern: "رسوم إلغاء مبكر مرتبطة بالجهاز" },

  // === MUSIC ===
  { slug: "amazon-music", name: "Amazon Music Unlimited", nameAr: "أمازون ميوزك", icon: "music.amazon.com", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "22.99", priceUnit: "ر.س/شهر", category: "موسيقى",
    steps: ["افتح music.amazon.com/settings", "اضغط Cancel subscription", "جاوب على سبب الإلغاء", "أكّد الإلغاء"],
    warning: "", cancelUrl: "https://music.amazon.com/settings", darkPattern: "" },
  { slug: "pandora", name: "Pandora Premium", nameAr: "باندورا", icon: "pandora.com", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "37", priceUnit: "ر.س/شهر", category: "موسيقى",
    steps: ["افتح pandora.com/account/settings", "اضغط Manage Subscription", "اضغط Cancel", "أكّد الإلغاء"],
    warning: "", cancelUrl: "https://www.pandora.com/account/settings", darkPattern: "" },
  { slug: "qobuz", name: "Qobuz", nameAr: "كوبز", icon: "qobuz.com", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "49.99", priceUnit: "ر.س/شهر", category: "موسيقى",
    steps: ["افتح qobuz.com/my-account/subscription", "اضغط Cancel subscription", "أكّد الإلغاء"],
    warning: "", cancelUrl: "https://www.qobuz.com/my-account/subscription", darkPattern: "" },
  { slug: "youtube-music", name: "YouTube Music Premium", nameAr: "يوتيوب ميوزك", icon: "music.youtube.com", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "22.99", priceUnit: "ر.س/شهر", category: "موسيقى",
    steps: ["افتح music.youtube.com", "اضغط على صورتك ← Paid memberships", "اضغط Manage membership", "اضغط Deactivate", "أكّد الإلغاء"],
    warning: "إذا عندك YouTube Premium، الإلغاء يشمل YouTube Music أيضاً.", cancelUrl: "https://www.youtube.com/paid_memberships", darkPattern: "" },
  { slug: "resso", name: "Resso", nameAr: "ريسو", icon: "resso.com", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "14.99", priceUnit: "ر.س/شهر", category: "موسيقى",
    steps: ["افتح تطبيق Resso", "اذهب للإعدادات", "اضغط Manage Subscription", "اضغط Cancel", "أكّد الإلغاء"],
    warning: "", cancelUrl: "", darkPattern: "" },

  // === GAMING ===
  { slug: "ea-play-pro", name: "EA Play Pro", nameAr: "EA Play برو", icon: "ea.com", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "59.99", priceUnit: "ر.س/شهر", category: "ألعاب",
    steps: ["افتح myaccount.ea.com وسجّل دخول", "اذهب لـ EA Play Pro Subscription", "اضغط Cancel Membership", "أكّد الإلغاء"],
    warning: "تفقد الوصول لكل ألعاب EA Play Pro عند الإلغاء.", cancelUrl: "https://myaccount.ea.com/cp-ui/subscriptions", darkPattern: "" },
  { slug: "ubisoft-plus", name: "Ubisoft+", nameAr: "يوبيسوفت بلس", icon: "ubisoft.com", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "67.99", priceUnit: "ر.س/شهر", category: "ألعاب",
    steps: ["افتح store.ubisoft.com/account", "اذهب لـ Subscription", "اضغط Cancel Subscription", "أكّد الإلغاء"],
    warning: "", cancelUrl: "https://store.ubisoft.com/account", darkPattern: "" },
  { slug: "geforce-now", name: "GeForce Now", nameAr: "جي فورس ناو", icon: "nvidia.com", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "37", priceUnit: "ر.س/شهر", category: "ألعاب سحابية",
    steps: ["افتح play.geforcenow.com/account", "اذهب لـ Subscription", "اضغط Cancel Membership", "أكّد الإلغاء"],
    warning: "", cancelUrl: "https://play.geforcenow.com/account", darkPattern: "" },
  { slug: "google-play-pass", name: "Google Play Pass", nameAr: "جوجل بلاي باس", icon: "play.google.com", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "18.99", priceUnit: "ر.س/شهر", category: "ألعاب",
    steps: ["افتح تطبيق Google Play", "اضغط على صورتك ← Payments & subscriptions", "اضغط Subscriptions", "ابحث عن Play Pass واضغط Cancel", "أكّد الإلغاء"],
    warning: "", cancelUrl: "", darkPattern: "" },
  { slug: "apple-arcade", name: "Apple Arcade", nameAr: "آبل أركيد", icon: "apple.com", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "18.99", priceUnit: "ر.س/شهر", category: "ألعاب",
    steps: ["افتح إعدادات iPhone ← اسمك ← الاشتراكات", "ابحث عن Apple Arcade", "اضغط إلغاء الاشتراك", "أكّد الإلغاء"],
    warning: "", cancelUrl: "", darkPattern: "" },
  { slug: "humble-choice", name: "Humble Choice", nameAr: "هامبل تشويس", icon: "humblebundle.com", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "45", priceUnit: "ر.س/شهر", category: "ألعاب",
    steps: ["افتح humblebundle.com/subscription", "سجّل دخول", "اضغط Cancel Subscription", "جاوب على سبب الإلغاء", "أكّد الإلغاء"],
    warning: "", cancelUrl: "https://www.humblebundle.com/subscription", darkPattern: "" },
  { slug: "amazon-luna", name: "Amazon Luna", nameAr: "أمازون لونا", icon: "luna.amazon.com", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "22.99", priceUnit: "ر.س/شهر", category: "ألعاب سحابية",
    steps: ["افتح luna.amazon.com/settings", "اذهب لـ Subscription", "اضغط Cancel", "أكّد الإلغاء"],
    warning: "", cancelUrl: "https://luna.amazon.com/settings", darkPattern: "" },

  // === EDUCATION ===
  { slug: "masterclass", name: "MasterClass", nameAr: "ماستر كلاس", icon: "masterclass.com", difficulty: "medium", difficultyAr: "متوسط", difficultyClass: "medium", price: "67", priceUnit: "ر.س/شهر", category: "تعليم",
    steps: ["افتح masterclass.com/account/edit", "اذهب لـ Subscription", "اضغط Cancel Membership", "جاوب على أسئلة الإلغاء", "أكّد الإلغاء"],
    warning: "ماستركلاس يعرض خصومات كبيرة قبل الإلغاء.", cancelUrl: "https://www.masterclass.com/account/edit", darkPattern: "عروض خصم متعددة" },
  { slug: "linkedin-learning", name: "LinkedIn Learning", nameAr: "لينكدإن ليرننج", icon: "linkedin.com", difficulty: "medium", difficultyAr: "متوسط", difficultyClass: "medium", price: "112", priceUnit: "ر.س/شهر", category: "تعليم",
    steps: ["افتح linkedin.com/learning/me/settings", "اضغط Manage Premium account", "اضغط Cancel subscription", "جاوب على أسئلة الإلغاء", "أكّد"],
    warning: "", cancelUrl: "https://www.linkedin.com/learning/me/settings", darkPattern: "أسئلة إلغاء متعددة" },
  { slug: "udemy-business", name: "Udemy Business", nameAr: "يوديمي بزنس", icon: "udemy.com", difficulty: "medium", difficultyAr: "متوسط", difficultyClass: "medium", price: "134", priceUnit: "ر.س/شهر", category: "تعليم",
    steps: ["افتح udemy.com وسجّل دخول", "اذهب لـ Manage Subscription", "اضغط Cancel Plan", "تواصل مع الدعم إذا كان اشتراك مؤسسي", "أكّد الإلغاء"],
    warning: "الكورسات اللي اشتريتها فردياً تبقى لك حتى بعد الإلغاء.", cancelUrl: "https://www.udemy.com/home/subscription", darkPattern: "" },
  { slug: "brilliant", name: "Brilliant", nameAr: "بريليانت", icon: "brilliant.org", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "45", priceUnit: "ر.س/شهر", category: "تعليم",
    steps: ["افتح brilliant.org/account", "اذهب لـ Subscription", "اضغط Cancel Subscription", "أكّد الإلغاء"],
    warning: "", cancelUrl: "https://brilliant.org/account/", darkPattern: "" },
  { slug: "blinkist", name: "Blinkist", nameAr: "بلنكست", icon: "blinkist.com", difficulty: "medium", difficultyAr: "متوسط", difficultyClass: "medium", price: "37.99", priceUnit: "ر.س/شهر", category: "كتب",
    steps: ["افتح blinkist.com/nc/settings", "اذهب لـ Manage Subscription", "اضغط Cancel Subscription", "جاوب على أسئلة الإلغاء", "أكّد"],
    warning: "بلنكست يعرض عليك خصومات قبل الإلغاء.", cancelUrl: "https://www.blinkist.com/nc/settings", darkPattern: "عروض خصم للبقاء" },
  { slug: "audible", name: "Audible", nameAr: "أوديبل", icon: "audible.com", difficulty: "hard", difficultyAr: "صعب", difficultyClass: "hard", price: "52", priceUnit: "ر.س/شهر", category: "كتب صوتية",
    steps: ["افتح audible.com/account", "اذهب لـ Account Details", "اضغط Cancel membership", "جاوب على أسئلة الإلغاء المتعددة", "ارفض كل العروض", "أكّد الإلغاء النهائي"],
    warning: "أوديبل يعرض عليك إيقاف مؤقت وخصومات كثيرة. ارفض الكل إذا تبغى تلغي.", cancelUrl: "https://www.audible.com/account", darkPattern: "5+ عروض بديلة قبل الإلغاء الفعلي" },
  { slug: "codecademy-pro", name: "Codecademy Pro", nameAr: "كودأكاديمي برو", icon: "codecademy.com", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "75", priceUnit: "ر.س/شهر", category: "تعليم برمجة",
    steps: ["افتح codecademy.com/account/billing", "اضغط Cancel Plan", "جاوب على سبب الإلغاء", "أكّد الإلغاء"],
    warning: "", cancelUrl: "https://www.codecademy.com/account/billing", darkPattern: "" },
  { slug: "datacamp", name: "DataCamp", nameAr: "داتا كامب", icon: "datacamp.com", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "97", priceUnit: "ر.س/شهر", category: "تعليم بيانات",
    steps: ["افتح datacamp.com/profile/billing", "اضغط Cancel Subscription", "جاوب على سبب الإلغاء", "أكّد الإلغاء"],
    warning: "", cancelUrl: "https://www.datacamp.com/profile/billing", darkPattern: "" },

  // === AI TOOLS ===
  { slug: "jasper-ai", name: "Jasper AI", nameAr: "جاسبر AI", icon: "jasper.ai", difficulty: "medium", difficultyAr: "متوسط", difficultyClass: "medium", price: "149", priceUnit: "ر.س/شهر", category: "ذكاء اصطناعي",
    steps: ["افتح app.jasper.ai/settings/billing", "اضغط Manage Subscription", "اضغط Cancel Plan", "جاوب على أسئلة الإلغاء", "أكّد الإلغاء"],
    warning: "", cancelUrl: "https://app.jasper.ai/settings/billing", darkPattern: "عروض خصم قبل الإلغاء" },
  { slug: "copy-ai", name: "Copy.ai", nameAr: "كوبي AI", icon: "copy.ai", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "136", priceUnit: "ر.س/شهر", category: "ذكاء اصطناعي",
    steps: ["افتح app.copy.ai/settings/billing", "اضغط Cancel Subscription", "جاوب على سبب الإلغاء", "أكّد الإلغاء"],
    warning: "", cancelUrl: "https://app.copy.ai/settings/billing", darkPattern: "" },
  { slug: "runway-ml", name: "Runway", nameAr: "رن واي", icon: "runwayml.com", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "45", priceUnit: "ر.س/شهر", category: "ذكاء اصطناعي",
    steps: ["افتح app.runwayml.com وسجّل دخول", "اذهب لـ Settings ← Plan", "اضغط Cancel Plan", "أكّد الإلغاء"],
    warning: "", cancelUrl: "https://app.runwayml.com/settings", darkPattern: "" },
  { slug: "perplexity-pro", name: "Perplexity Pro", nameAr: "بربلكسيتي برو", icon: "perplexity.ai", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "75", priceUnit: "ر.س/شهر", category: "ذكاء اصطناعي",
    steps: ["افتح perplexity.ai/settings/subscription", "اضغط Cancel Subscription", "أكّد الإلغاء"],
    warning: "", cancelUrl: "https://www.perplexity.ai/settings/subscription", darkPattern: "" },
  { slug: "github-copilot", name: "GitHub Copilot", nameAr: "جت هب كوبايلوت", icon: "github.com", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "37", priceUnit: "ر.س/شهر", category: "ذكاء اصطناعي",
    steps: ["افتح github.com/settings/copilot", "اضغط Cancel subscription", "أكّد الإلغاء"],
    warning: "", cancelUrl: "https://github.com/settings/copilot", darkPattern: "" },
  { slug: "replit-pro", name: "Replit Core", nameAr: "ريبلت كور", icon: "replit.com", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "82", priceUnit: "ر.س/شهر", category: "برمجة",
    steps: ["افتح replit.com/account", "اذهب لـ Subscription", "اضغط Cancel Plan", "أكّد الإلغاء"],
    warning: "", cancelUrl: "https://replit.com/account", darkPattern: "" },
  { slug: "writesonic", name: "Writesonic", nameAr: "رايت سونك", icon: "writesonic.com", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "56", priceUnit: "ر.س/شهر", category: "ذكاء اصطناعي",
    steps: ["افتح app.writesonic.com/settings/billing", "اضغط Cancel Subscription", "أكّد الإلغاء"],
    warning: "", cancelUrl: "https://app.writesonic.com/settings/billing", darkPattern: "" },

  // === DESIGN ===
  { slug: "sketch", name: "Sketch", nameAr: "سكتش", icon: "sketch.com", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "37", priceUnit: "ر.س/شهر", category: "تصميم",
    steps: ["افتح sketch.com/settings/billing", "اضغط Cancel Subscription", "أكّد الإلغاء"],
    warning: "تقدر تستمر باستخدام النسخة المحلية بدون اشتراك.", cancelUrl: "https://www.sketch.com/settings/billing", darkPattern: "" },
  { slug: "invision", name: "InVision", nameAr: "إن فيجن", icon: "invisionapp.com", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "56", priceUnit: "ر.س/شهر", category: "تصميم",
    steps: ["افتح invisionapp.com/account/billing", "اضغط Cancel Plan", "جاوب على سبب الإلغاء", "أكّد الإلغاء"],
    warning: "حمّل تصاميمك قبل الإلغاء.", cancelUrl: "https://www.invisionapp.com/account/billing", darkPattern: "" },
  { slug: "framer", name: "Framer", nameAr: "فريمر", icon: "framer.com", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "56", priceUnit: "ر.س/شهر", category: "تصميم ويب",
    steps: ["افتح framer.com/settings", "اذهب لـ Billing", "اضغط Cancel Plan", "أكّد الإلغاء"],
    warning: "موقعك المنشور يتوقف عند الإلغاء.", cancelUrl: "https://framer.com/settings", darkPattern: "" },
  { slug: "webflow", name: "Webflow", nameAr: "ويب فلو", icon: "webflow.com", difficulty: "medium", difficultyAr: "متوسط", difficultyClass: "medium", price: "56", priceUnit: "ر.س/شهر", category: "تصميم ويب",
    steps: ["افتح webflow.com/dashboard/account/billing", "اضغط Cancel Plan", "جاوب على سبب الإلغاء", "أكّد الإلغاء"],
    warning: "مواقعك المنشورة تتوقف بعد الإلغاء. حمّل كودك أولاً.", cancelUrl: "https://webflow.com/dashboard/account/billing", darkPattern: "" },
  { slug: "adobe-express", name: "Adobe Express", nameAr: "أدوبي إكسبرس", icon: "adobe.com", difficulty: "medium", difficultyAr: "متوسط", difficultyClass: "medium", price: "37", priceUnit: "ر.س/شهر", category: "تصميم",
    steps: ["افتح account.adobe.com/plans", "ابحث عن Adobe Express", "اضغط Manage Plan", "اضغط Cancel Plan", "جاوب على أسئلة الإلغاء", "أكّد"],
    warning: "", cancelUrl: "https://account.adobe.com/plans", darkPattern: "أسئلة إلغاء متعددة" },
  { slug: "principle-app", name: "Principle", nameAr: "برنسبل", icon: "principleformac.com", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "22.99", priceUnit: "ر.س/شهر", category: "تصميم تفاعلي",
    steps: ["افتح إعدادات Mac ← Apple ID ← الاشتراكات", "ابحث عن Principle", "اضغط إلغاء الاشتراك", "أكّد الإلغاء"],
    warning: "", cancelUrl: "", darkPattern: "" },

  // === COMMUNICATION ===
  { slug: "discord-nitro", name: "Discord Nitro", nameAr: "ديسكورد نيترو", icon: "discord.com", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "37", priceUnit: "ر.س/شهر", category: "تواصل",
    steps: ["افتح discord.com/settings/subscriptions", "اضغط Cancel", "جاوب على سبب الإلغاء", "أكّد الإلغاء"],
    warning: "تفقد الإيموجي المخصصة والرفع الكبير بعد الإلغاء.", cancelUrl: "https://discord.com/settings/subscriptions", darkPattern: "" },
  { slug: "whatsapp-business", name: "WhatsApp Business Premium", nameAr: "واتساب بزنس بريميوم", icon: "business.whatsapp.com", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "37", priceUnit: "ر.س/شهر", category: "أعمال",
    steps: ["افتح تطبيق واتساب بزنس", "اذهب للإعدادات ← WhatsApp Premium", "اضغط Cancel Subscription", "أكّد الإلغاء"],
    warning: "", cancelUrl: "", darkPattern: "" },
  { slug: "microsoft-teams", name: "Microsoft Teams Premium", nameAr: "مايكروسوفت تيمز", icon: "teams.microsoft.com", difficulty: "medium", difficultyAr: "متوسط", difficultyClass: "medium", price: "26.99", priceUnit: "ر.س/شهر", category: "اجتماعات",
    steps: ["افتح admin.microsoft.com وسجّل دخول كمدير", "اذهب لـ Billing ← Your products", "ابحث عن Teams Premium", "اضغط Cancel subscription", "أكّد الإلغاء"],
    warning: "فقط مدير المؤسسة يقدر يلغي.", cancelUrl: "https://admin.microsoft.com/Adminportal/Home#/subscriptions", darkPattern: "" },
  { slug: "google-workspace", name: "Google Workspace", nameAr: "جوجل وركسبيس", icon: "workspace.google.com", difficulty: "medium", difficultyAr: "متوسط", difficultyClass: "medium", price: "22.99", priceUnit: "ر.س/شهر", category: "إنتاجية",
    steps: ["افتح admin.google.com وسجّل دخول", "اذهب لـ Billing ← Subscriptions", "اضغط Cancel subscription", "اختر سبب الإلغاء", "أكّد الإلغاء"],
    warning: "حمّل بياناتك من Google Takeout قبل الإلغاء. تفقد إيميل النطاق المخصص.", cancelUrl: "https://admin.google.com/ac/billing", darkPattern: "" },
  { slug: "webex", name: "Webex", nameAr: "ويبكس", icon: "webex.com", difficulty: "medium", difficultyAr: "متوسط", difficultyClass: "medium", price: "49.99", priceUnit: "ر.س/شهر", category: "اجتماعات",
    steps: ["افتح settings.webex.com وسجّل دخول", "اذهب لـ Subscription", "اضغط Cancel Plan", "أكّد الإلغاء"],
    warning: "", cancelUrl: "https://settings.webex.com/subscription", darkPattern: "" },

  // === SHOPPING / REWARDS ===
  { slug: "amazon-prime-gaming", name: "Amazon Prime Gaming", nameAr: "أمازون برايم قيمنق", icon: "gaming.amazon.com", difficulty: "medium", difficultyAr: "متوسط", difficultyClass: "medium", price: "16", priceUnit: "ر.س/شهر", category: "ألعاب",
    steps: ["Prime Gaming جزء من Amazon Prime", "لإلغاء Gaming فقط لا يمكن بشكل منفصل", "لإلغاء الكل: افتح amazon.sa/gp/primecentral", "اضغط End Membership", "أكّد الإلغاء"],
    warning: "لا يمكن إلغاء Prime Gaming بشكل منفصل عن Amazon Prime.", cancelUrl: "https://www.amazon.sa/gp/primecentral", darkPattern: "" },
  { slug: "costco", name: "Costco Membership", nameAr: "كوستكو", icon: "costco.com", difficulty: "medium", difficultyAr: "متوسط", difficultyClass: "medium", price: "225", priceUnit: "ر.س/سنة", category: "تسوق",
    steps: ["زُر أقرب فرع كوستكو", "اذهب لمكتب العضوية (Membership Desk)", "اطلب إلغاء العضوية", "استلم استرداد المبلغ"],
    warning: "كوستكو يسترد كامل مبلغ العضوية في أي وقت. من أسهل الاستردادات.", cancelUrl: "", darkPattern: "" },
  { slug: "sams-club", name: "Sam's Club", nameAr: "سامز كلب", icon: "samsclub.com", difficulty: "medium", difficultyAr: "متوسط", difficultyClass: "medium", price: "170", priceUnit: "ر.س/سنة", category: "تسوق",
    steps: ["افتح samsclub.com/account", "اذهب لـ Membership", "اضغط Cancel Membership", "أكّد الإلغاء أو زُر فرع"],
    warning: "", cancelUrl: "https://www.samsclub.com/account", darkPattern: "" },
  { slug: "walmart-plus", name: "Walmart+", nameAr: "وولمارت بلس", icon: "walmart.com", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "49.99", priceUnit: "ر.س/شهر", category: "تسوق",
    steps: ["افتح walmart.com/account", "اذهب لـ Walmart+ membership", "اضغط Cancel membership", "أكّد الإلغاء"],
    warning: "", cancelUrl: "https://www.walmart.com/account/wplus", darkPattern: "" },
  { slug: "amazon-prime-video", name: "Amazon Prime Video", nameAr: "أمازون برايم فيديو", icon: "primevideo.com", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "14.99", priceUnit: "ر.س/شهر", category: "بث ترفيهي",
    steps: ["افتح primevideo.com وسجّل دخول", "اذهب لـ Account & Settings", "اضغط Manage Your Membership", "اضغط Cancel Subscription", "أكّد الإلغاء"],
    warning: "هذا اشتراك Prime Video المستقل. إذا عندك Amazon Prime كامل، ألغِه من amazon.sa.", cancelUrl: "https://www.primevideo.com/settings/account", darkPattern: "" },

  // === RIDE-HAILING / TRANSPORT ===
  { slug: "uber-pass", name: "Uber Pass", nameAr: "أوبر باس", icon: "uber.com", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "24.99", priceUnit: "ر.س/شهر", category: "نقل",
    steps: ["افتح تطبيق أوبر", "اضغط على حسابك", "اذهب لـ Uber Pass", "اضغط Manage ← Cancel", "أكّد الإلغاء"],
    warning: "", cancelUrl: "", darkPattern: "" },
  { slug: "lyft-pink", name: "Lyft Pink", nameAr: "ليفت بنك", icon: "lyft.com", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "37", priceUnit: "ر.س/شهر", category: "نقل",
    steps: ["افتح تطبيق Lyft", "اذهب للقائمة ← Lyft Pink", "اضغط Manage membership", "اضغط Cancel", "أكّد الإلغاء"],
    warning: "", cancelUrl: "", darkPattern: "" },
  { slug: "bolt-plus", name: "Bolt Plus", nameAr: "بولت بلس", icon: "bolt.eu", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "14.99", priceUnit: "ر.س/شهر", category: "نقل",
    steps: ["افتح تطبيق بولت", "اذهب للقائمة ← Subscriptions", "اضغط Cancel", "أكّد الإلغاء"],
    warning: "", cancelUrl: "", darkPattern: "" },

  // === ADDITIONAL SERVICES ===
  { slug: "norton-360", name: "Norton 360", nameAr: "نورتن 360", icon: "norton.com", difficulty: "hard", difficultyAr: "صعب", difficultyClass: "hard", price: "37", priceUnit: "ر.س/شهر", category: "أمان",
    steps: ["افتح my.norton.com وسجّل دخول", "اذهب لـ Subscription", "اضغط Cancel Subscription", "جاوب على عدة أسئلة", "ارفض العروض البديلة", "أكّد الإلغاء"],
    warning: "نورتن مشهور بصعوبة الإلغاء وكثرة عروض البقاء.", cancelUrl: "https://my.norton.com/subscriptions", darkPattern: "عروض متعددة + تحذيرات أمان مبالغة" },
  { slug: "mcafee", name: "McAfee", nameAr: "مكافي", icon: "mcafee.com", difficulty: "hard", difficultyAr: "صعب", difficultyClass: "hard", price: "37", priceUnit: "ر.س/شهر", category: "أمان",
    steps: ["افتح home.mcafee.com وسجّل دخول", "اذهب لـ My Account ← Subscriptions", "اضغط Turn off auto-renewal", "جاوب على أسئلة متعددة", "ارفض كل العروض", "أكّد الإلغاء"],
    warning: "مكافي يعرض عليك خصومات كبيرة ورسائل تخويف عن الأمان.", cancelUrl: "https://home.mcafee.com/root/myaccount", darkPattern: "رسائل تخويف أمنية + عروض متعددة" },
  { slug: "kaspersky", name: "Kaspersky", nameAr: "كاسبرسكي", icon: "kaspersky.com", difficulty: "medium", difficultyAr: "متوسط", difficultyClass: "medium", price: "30", priceUnit: "ر.س/شهر", category: "أمان",
    steps: ["افتح my.kaspersky.com وسجّل دخول", "اذهب لـ Subscriptions", "اضغط Cancel auto-renewal", "أكّد الإلغاء"],
    warning: "", cancelUrl: "https://my.kaspersky.com", darkPattern: "" },
  { slug: "setapp", name: "Setapp", nameAr: "سيتاب", icon: "setapp.com", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "37", priceUnit: "ر.س/شهر", category: "تطبيقات ماك",
    steps: ["افتح my.setapp.com وسجّل دخول", "اذهب لـ Subscription", "اضغط Cancel Subscription", "أكّد الإلغاء"],
    warning: "تفقد الوصول لجميع التطبيقات فوراً.", cancelUrl: "https://my.setapp.com/subscription", darkPattern: "" },
  { slug: "parallels", name: "Parallels Desktop", nameAr: "بارالز", icon: "parallels.com", difficulty: "medium", difficultyAr: "متوسط", difficultyClass: "medium", price: "37", priceUnit: "ر.س/شهر", category: "برمجيات",
    steps: ["افتح my.parallels.com وسجّل دخول", "اذهب لـ Subscriptions", "اضغط Cancel subscription", "أكّد الإلغاء"],
    warning: "الأجهزة الافتراضية ما تشتغل بعد انتهاء الاشتراك.", cancelUrl: "https://my.parallels.com/subscriptions", darkPattern: "" },
  { slug: "ifttt-pro", name: "IFTTT Pro", nameAr: "IFTTT برو", icon: "ifttt.com", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "10", priceUnit: "ر.س/شهر", category: "أتمتة",
    steps: ["افتح ifttt.com/account", "اضغط Manage plan", "اضغط Cancel", "أكّد الإلغاء"],
    warning: "", cancelUrl: "https://ifttt.com/account", darkPattern: "" },
  { slug: "zapier", name: "Zapier", nameAr: "زابير", icon: "zapier.com", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "75", priceUnit: "ر.س/شهر", category: "أتمتة",
    steps: ["افتح zapier.com/app/settings/billing", "اضغط Manage plan", "اضغط Downgrade to Free", "أكّد الإلغاء"],
    warning: "الأتمتة فوق 5 تتوقف عند التحويل للمجاني.", cancelUrl: "https://zapier.com/app/settings/billing", darkPattern: "" },
  { slug: "mailchimp", name: "Mailchimp", nameAr: "ميل تشمب", icon: "mailchimp.com", difficulty: "medium", difficultyAr: "متوسط", difficultyClass: "medium", price: "49.99", priceUnit: "ر.س/شهر", category: "تسويق",
    steps: ["افتح mailchimp.com/account", "اذهب لـ Settings ← Billing", "اضغط Cancel plan أو Downgrade", "جاوب على أسئلة الإلغاء", "أكّد الإلغاء"],
    warning: "حمّل قوائم بريدك قبل الإلغاء.", cancelUrl: "https://us1.admin.mailchimp.com/account/billing/", darkPattern: "" },
  { slug: "hootsuite", name: "Hootsuite", nameAr: "هوتسويت", icon: "hootsuite.com", difficulty: "medium", difficultyAr: "متوسط", difficultyClass: "medium", price: "375", priceUnit: "ر.س/شهر", category: "تسويق",
    steps: ["افتح hootsuite.com/member/billing", "اضغط Cancel Plan", "جاوب على أسئلة الإلغاء", "أكّد الإلغاء"],
    warning: "هوتسويت يعرض خصومات قبل الإلغاء.", cancelUrl: "https://hootsuite.com/member/billing", darkPattern: "عروض خصم للبقاء" },
  { slug: "buffer", name: "Buffer", nameAr: "بفر", icon: "buffer.com", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "22.99", priceUnit: "ر.س/شهر", category: "تسويق",
    steps: ["افتح buffer.com/app/account/receipts", "اضغط Change Plan", "اضغط Downgrade to Free", "أكّد الإلغاء"],
    warning: "", cancelUrl: "https://buffer.com/app/account/receipts", darkPattern: "" },
  { slug: "semrush", name: "SEMrush", nameAr: "سيم رش", icon: "semrush.com", difficulty: "medium", difficultyAr: "متوسط", difficultyClass: "medium", price: "470", priceUnit: "ر.س/شهر", category: "تسويق رقمي",
    steps: ["افتح semrush.com/billing-admin/profile/subscription", "اضغط Cancel subscription", "جاوب على أسئلة الإلغاء", "ارفض العروض البديلة", "أكّد الإلغاء"],
    warning: "سيم رش يعرض خصومات وإيقاف مؤقت قبل الإلغاء.", cancelUrl: "https://www.semrush.com/billing-admin/profile/subscription", darkPattern: "عروض خصم + إيقاف مؤقت" },
  { slug: "ahrefs", name: "Ahrefs", nameAr: "أهرفس", icon: "ahrefs.com", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "375", priceUnit: "ر.س/شهر", category: "تسويق رقمي",
    steps: ["افتح ahrefs.com/user/billing", "اضغط Cancel subscription", "أكّد الإلغاء"],
    warning: "", cancelUrl: "https://ahrefs.com/user/billing", darkPattern: "" },
  { slug: "shopify", name: "Shopify", nameAr: "شوبيفاي", icon: "shopify.com", difficulty: "medium", difficultyAr: "متوسط", difficultyClass: "medium", price: "134", priceUnit: "ر.س/شهر", category: "تجارة إلكترونية",
    steps: ["افتح admin.shopify.com/store/settings/plan", "اضغط Deactivate store", "جاوب على أسئلة الإلغاء", "أدخل كلمة المرور", "اضغط Deactivate now"],
    warning: "حمّل بيانات متجرك ومنتجاتك قبل الإلغاء. المتجر يتوقف فوراً.", cancelUrl: "https://admin.shopify.com/store/settings/plan", darkPattern: "" },
  { slug: "squarespace", name: "Squarespace", nameAr: "سكوير سبيس", icon: "squarespace.com", difficulty: "medium", difficultyAr: "متوسط", difficultyClass: "medium", price: "60", priceUnit: "ر.س/شهر", category: "مواقع",
    steps: ["افتح squarespace.com/config/billing", "اضغط Cancel", "جاوب على أسئلة الإلغاء", "أكّد الإلغاء"],
    warning: "موقعك يتوقف عن العمل بعد الإلغاء. حمّل محتواك أولاً.", cancelUrl: "https://account.squarespace.com/settings/billing", darkPattern: "تحذيرات عن فقدان الموقع" },
];

function generatePage(s) {
  const fav = `https://www.google.com/s2/favicons?domain=${s.icon}&sz=64`;
  const stepsHtml = s.steps.map(step => `              <li>${step}</li>`).join('\n');
  const warningHtml = s.warning ? `\n            <div class="warning-box">\n              <strong>تنبيه:</strong> ${s.warning}\n            </div>` : '';
  const darkPatternHtml = s.darkPattern ? `\n          <div class="dark-pattern-box">\n            <span class="dp-badge">نمط مظلم</span>\n            <p>${s.darkPattern}</p>\n          </div>` : '';
  const cancelLinkHtml = s.cancelUrl ? `<a href="${s.cancelUrl}" target="_blank" rel="noopener" class="btn-cancel-direct">رابط الإلغاء المباشر ←</a>` : '';
  const priceDisplay = s.priceUnit ? `${s.price} ${s.priceUnit}` : s.price;

  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>كيف ألغي ${s.name} في السعودية 2026 — Yalla Cancel</title>
  <meta name="description" content="دليل خطوة بخطوة لإلغاء اشتراك ${s.name} من السعودية. صعوبة الإلغاء: ${s.difficultyAr}.">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="https://yallacancel.sa/cancel-${s.slug}.html">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800;900&family=Noto+Sans+Arabic:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    :root { --primary:#00A651; --dark:#0F172A; --surface:#F8FAFC; --text:#0F172A; --text2:#64748B; --border:#E2E8F0; }
    *{box-sizing:border-box;margin:0;padding:0} html{scroll-behavior:smooth}
    body{font-family:"Noto Sans Arabic",sans-serif;background:#fff;color:var(--text);-webkit-font-smoothing:antialiased;line-height:1.7}
    a{text-decoration:none;color:inherit}
    .nav{background:var(--dark);position:sticky;top:0;z-index:100}
    .nav-inner{max-width:800px;margin:0 auto;padding:0 24px;height:56px;display:flex;align-items:center;justify-content:space-between}
    .nav-logo{font-family:"DM Sans",sans-serif;font-size:1.3rem;font-weight:800;color:#fff;direction:ltr;unicode-bidi:bidi-override;letter-spacing:-0.03em}
    .nav-logo span{color:var(--primary)}
    .nav-back{font-size:0.82rem;color:rgba(255,255,255,0.5);transition:color 0.2s}
    .nav-back:hover{color:#fff}
    .hero{background:linear-gradient(135deg,#0F172A,#0d2618);padding:56px 24px 48px;text-align:center}
    .hero-icon{width:64px;height:64px;border-radius:16px;margin:0 auto 16px;overflow:hidden;box-shadow:0 8px 24px rgba(0,0,0,0.3);background:#fff}
    .hero-icon img{width:100%;height:100%;object-fit:contain}
    .badge{display:inline-flex;border-radius:9999px;padding:5px 14px;font-size:0.75rem;font-weight:700;margin-bottom:16px}
    .badge.easy{background:#DCFCE7;color:#15803D} .badge.medium{background:#FEF3C7;color:#B45309} .badge.hard{background:#FEE2E2;color:#B91C1C}
    .hero h1{font-size:1.6rem;font-weight:900;color:#fff;margin-bottom:8px}
    .hero-meta{font-size:0.85rem;color:rgba(255,255,255,0.5)}
    .hero-meta span{margin:0 6px}
    .content{max-width:680px;margin:0 auto;padding:40px 24px 80px}
    .section-title{font-size:1.15rem;font-weight:800;margin-bottom:16px}
    .steps-list{list-style:none;counter-reset:s;display:flex;flex-direction:column;gap:12px;margin-bottom:32px}
    .steps-list li{counter-increment:s;display:flex;align-items:flex-start;gap:12px;font-size:0.9rem;color:#475569;line-height:1.6;background:var(--surface);padding:14px 16px;border-radius:14px;border:1px solid var(--border)}
    .steps-list li::before{content:counter(s);min-width:28px;height:28px;background:var(--dark);color:#fff;border-radius:50%;font-size:0.7rem;font-weight:900;display:flex;align-items:center;justify-content:center;flex-shrink:0}
    .warning-box{background:#FEF3C7;border:1px solid #FDE68A;border-radius:14px;padding:14px 16px;font-size:0.85rem;color:#92400E;margin-bottom:32px}
    .dark-pattern-box{background:#FEE2E2;border:1px solid #FECACA;border-radius:14px;padding:14px 16px;margin-bottom:32px}
    .dp-badge{display:inline-block;background:#DC2626;color:#fff;font-size:0.65rem;font-weight:700;padding:3px 10px;border-radius:9999px;margin-bottom:8px}
    .dark-pattern-box p{font-size:0.85rem;color:#991B1B}
    .btn-cancel-direct{display:inline-flex;align-items:center;gap:8px;background:var(--primary);color:#fff;padding:14px 28px;border-radius:14px;font-weight:700;font-size:0.95rem;font-family:inherit;transition:all 0.2s;margin-bottom:32px}
    .btn-cancel-direct:hover{background:#00C060;transform:translateY(-2px)}
    .faq{margin-top:32px;border-top:1px solid var(--border);padding-top:32px}
    .faq h2{font-size:1.1rem;font-weight:800;margin-bottom:16px}
    .faq-item{background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:16px;margin-bottom:10px}
    .faq-q{font-weight:700;font-size:0.9rem;margin-bottom:6px}
    .faq-a{font-size:0.85rem;color:var(--text2);line-height:1.7}
    .cta-box{background:var(--surface);border:1px solid var(--border);border-radius:20px;padding:32px;text-align:center;margin-top:40px}
    .cta-box h3{font-size:1.1rem;font-weight:800;margin-bottom:8px}
    .cta-box p{font-size:0.88rem;color:var(--text2);margin-bottom:16px}
    .btn-cta{display:inline-flex;background:var(--dark);color:#fff;padding:14px 32px;border-radius:14px;font-weight:700;font-size:0.9rem;font-family:inherit;transition:all 0.2s}
    .btn-cta:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,0.15)}
    @media(max-width:640px){.hero{padding:44px 16px 36px}.hero h1{font-size:1.3rem}.content{padding:28px 16px 60px}}
  </style>
</head>
<body>
  <nav class="nav">
    <div class="nav-inner">
      <a href="preview-a.html" class="nav-logo">yalla<span>cancel</span></a>
      <a href="preview-a.html" class="nav-back">← الرئيسية</a>
    </div>
  </nav>
  <section class="hero">
    <div class="hero-icon"><img src="${fav}" alt="${s.name}"></div>
    <div class="badge ${s.difficultyClass}">${s.difficultyAr}</div>
    <h1>كيف ألغي ${s.name}؟</h1>
    <div class="hero-meta">${s.category}<span>·</span>${priceDisplay}</div>
  </section>
  <div class="content">
    <h2 class="section-title">خطوات الإلغاء</h2>
    <ol class="steps-list">
${stepsHtml}
    </ol>${warningHtml}${darkPatternHtml}
    ${cancelLinkHtml}
    <div class="faq">
      <h2>أسئلة شائعة</h2>
      <div class="faq-item">
        <div class="faq-q">هل أقدر أرجع أشترك بعد الإلغاء؟</div>
        <div class="faq-a">نعم، تقدر ترجع تشترك في ${s.name} بأي وقت. حسابك وبياناتك غالباً تنحفظ.</div>
      </div>
      <div class="faq-item">
        <div class="faq-q">متى يتوقف الاشتراك بعد الإلغاء؟</div>
        <div class="faq-a">عادةً تقدر تستخدم ${s.name} لنهاية الفترة المدفوعة الحالية.</div>
      </div>
      <div class="faq-item">
        <div class="faq-q">هل يرجعون لي فلوسي؟</div>
        <div class="faq-a">أغلب الخدمات ما ترجع الفلوس للفترة الحالية. لكن ما راح ينخصم منك مبلغ جديد بعد الإلغاء.</div>
      </div>
    </div>
    <div class="cta-box">
      <h3>عندك اشتراكات ثانية ما تعرف عنها؟</h3>
      <p>ارفع كشف حسابك ونطلعلك كل الاشتراكات اللي تنخصم منك.</p>
      <a href="preview-a.html" class="btn-cta">اكتشف اشتراكاتك ←</a>
    </div>
  </div>
</body>
</html>`;
}

// Generate all pages
let count = 0;
for (const s of services) {
  const filename = `cancel-${s.slug}.html`;
  const filepath = path.join(__dirname, filename);
  fs.writeFileSync(filepath, generatePage(s), 'utf8');
  count++;
  console.log(`✓ ${filename}`);
}
console.log(`\nDone! Generated ${count} cancel guide pages (batch 2).`);
