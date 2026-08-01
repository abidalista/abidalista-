#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const services = [
  // Streaming
  { slug: "disney-plus", name: "Disney+", nameAr: "ديزني بلس", icon: "disneyplus.com", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "29.99", priceUnit: "ر.س/شهر", category: "بث ترفيهي",
    steps: ["افتح disneyplus.com وسجّل دخول", "اضغط على صورتك ← Account", "اضغط على Subscription", "اضغط Cancel Subscription", "أكّد الإلغاء"],
    warning: "", cancelUrl: "https://www.disneyplus.com/account", darkPattern: "" },
  { slug: "amazon-prime", name: "Amazon Prime", nameAr: "أمازون برايم", icon: "amazon.sa", difficulty: "medium", difficultyAr: "متوسط", difficultyClass: "medium", price: "16", priceUnit: "ر.س/شهر", category: "تسوق وبث",
    steps: ["افتح amazon.sa وسجّل دخول", "اذهب لـ Account ← Prime Membership", "اضغط End Membership", "أكّد عبر عدة صفحات تأكيد", "اضغط Cancel بالنهاية"],
    warning: "أمازون يعرض عليك عروض للبقاء عدة مرات قبل ما يأكد الإلغاء. لا تستسلم.", cancelUrl: "https://www.amazon.sa/gp/primecentral", darkPattern: "عروض متعددة للاحتفاظ بالاشتراك" },
  { slug: "hulu", name: "Hulu", nameAr: "هولو", icon: "hulu.com", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "45", priceUnit: "ر.س/شهر", category: "بث ترفيهي",
    steps: ["افتح hulu.com وسجّل دخول", "اضغط على اسمك ← Account", "اضغط Cancel", "أكّد الإلغاء"],
    warning: "", cancelUrl: "https://secure.hulu.com/account", darkPattern: "" },
  { slug: "osn-plus", name: "OSN+", nameAr: "OSN+", icon: "osnplus.com", difficulty: "medium", difficultyAr: "متوسط", difficultyClass: "medium", price: "34.99", priceUnit: "ر.س/شهر", category: "بث ترفيهي",
    steps: ["افتح osnplus.com وسجّل دخول", "اذهب لـ My Account", "اضغط Manage Subscription", "اختر Cancel Subscription", "أكّد الإلغاء"],
    warning: "إذا اشتركت عن طريق App Store أو Google Play، ألغِ من إعدادات جهازك.", cancelUrl: "https://www.osnplus.com/account", darkPattern: "" },
  { slug: "tod", name: "TOD", nameAr: "TOD", icon: "tod.tv", difficulty: "medium", difficultyAr: "متوسط", difficultyClass: "medium", price: "22.99", priceUnit: "ر.س/شهر", category: "بث رياضي",
    steps: ["افتح tod.tv وسجّل دخول", "اذهب لحسابك", "اضغط على إدارة الاشتراك", "اختر إلغاء الاشتراك", "أكّد الإلغاء"],
    warning: "", cancelUrl: "https://www.tod.tv", darkPattern: "" },
  { slug: "bein-connect", name: "beIN CONNECT", nameAr: "beIN CONNECT", icon: "bein.com", difficulty: "hard", difficultyAr: "صعب", difficultyClass: "hard", price: "45", priceUnit: "ر.س/شهر", category: "بث رياضي",
    steps: ["افتح connect.bein.com وسجّل دخول", "اذهب لـ My Account", "ابحث عن إدارة الاشتراك", "اضغط إلغاء", "أكّد الإلغاء — قد تحتاج تتواصل مع الدعم"],
    warning: "بعض الباقات ما تقدر تلغيها أونلاين — قد تحتاج تتصل بخدمة العملاء.", cancelUrl: "https://connect.bein.com", darkPattern: "إلغاء صعب عبر الإنترنت" },
  { slug: "starz-play", name: "STARZPLAY", nameAr: "ستارز بلاي", icon: "starzplay.com", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "24.99", priceUnit: "ر.س/شهر", category: "بث ترفيهي",
    steps: ["افتح starzplay.com وسجّل دخول", "اذهب لحسابك", "اضغط إدارة الاشتراك", "اضغط إلغاء الاشتراك", "أكّد الإلغاء"],
    warning: "", cancelUrl: "https://www.starzplay.com", darkPattern: "" },

  // Telecom
  { slug: "stc", name: "STC", nameAr: "stc", icon: "stc.com.sa", difficulty: "medium", difficultyAr: "متوسط", difficultyClass: "medium", price: "متغير", priceUnit: "", category: "اتصالات",
    steps: ["افتح تطبيق mystc أو mystc.stc.com.sa", "سجّل دخول بحسابك", "اذهب لـ الخدمات ← الباقات الإضافية", "اختر الباقة اللي تبغى تلغيها", "اضغط إلغاء وأكّد"],
    warning: "بعض الباقات المرتبطة بعقد ما تقدر تلغيها إلا بعد انتهاء العقد.", cancelUrl: "https://mystc.stc.com.sa", darkPattern: "" },
  { slug: "mobily", name: "Mobily", nameAr: "موبايلي", icon: "mobily.com.sa", difficulty: "medium", difficultyAr: "متوسط", difficultyClass: "medium", price: "متغير", priceUnit: "", category: "اتصالات",
    steps: ["افتح تطبيق موبايلي أو mobily.com.sa", "سجّل دخول", "اذهب لـ باقاتي", "اختر الباقة واضغط إلغاء", "أكّد الإلغاء"],
    warning: "", cancelUrl: "https://www.mobily.com.sa", darkPattern: "" },
  { slug: "zain", name: "Zain", nameAr: "زين", icon: "sa.zain.com", difficulty: "medium", difficultyAr: "متوسط", difficultyClass: "medium", price: "متغير", priceUnit: "", category: "اتصالات",
    steps: ["افتح تطبيق زين أو sa.zain.com", "سجّل دخول", "اذهب لإدارة الخطة", "اختر الباقة واضغط إلغاء", "أكّد الإلغاء"],
    warning: "", cancelUrl: "https://sa.zain.com", darkPattern: "" },
  { slug: "jawwy", name: "Jawwy", nameAr: "جوّي", icon: "jawwy.sa", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "متغير", priceUnit: "", category: "اتصالات",
    steps: ["افتح تطبيق جوّي", "سجّل دخول", "اذهب لإدارة الباقة", "اضغط إلغاء الباقة الإضافية", "أكّد الإلغاء"],
    warning: "", cancelUrl: "https://www.jawwy.sa", darkPattern: "" },
  { slug: "virgin-mobile-sa", name: "Virgin Mobile SA", nameAr: "فيرجن موبايل", icon: "virginmobile.sa", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "متغير", priceUnit: "", category: "اتصالات",
    steps: ["افتح تطبيق فيرجن موبايل", "سجّل دخول", "اذهب لإدارة خطتك", "اضغط إلغاء", "أكّد الإلغاء"],
    warning: "", cancelUrl: "https://www.virginmobile.sa", darkPattern: "" },
  { slug: "salam-mobile", name: "Salam Mobile", nameAr: "سلام موبايل", icon: "sfrp.sa", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "متغير", priceUnit: "", category: "اتصالات",
    steps: ["افتح تطبيق سلام", "سجّل دخول", "اذهب لإدارة الباقة", "اضغط إلغاء", "أكّد"],
    warning: "", cancelUrl: "https://www.sfrp.sa", darkPattern: "" },

  // Food Delivery
  { slug: "hungerstation-pro", name: "HungerStation Pro", nameAr: "هنقرستيشن برو", icon: "hungerstation.com", difficulty: "medium", difficultyAr: "متوسط", difficultyClass: "medium", price: "29.99", priceUnit: "ر.س/شهر", category: "توصيل طعام",
    steps: ["افتح تطبيق هنقرستيشن", "اضغط على حسابك", "اذهب لـ اشتراك Pro", "اضغط إدارة الاشتراك", "اضغط إلغاء وأكّد"],
    warning: "", cancelUrl: "", darkPattern: "" },
  { slug: "jahez-plus", name: "Jahez Plus", nameAr: "جاهز بلس", icon: "jahez.net", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "19.99", priceUnit: "ر.س/شهر", category: "توصيل طعام",
    steps: ["افتح تطبيق جاهز", "اضغط على حسابك", "اذهب لـ جاهز بلس", "اضغط إلغاء الاشتراك", "أكّد الإلغاء"],
    warning: "", cancelUrl: "", darkPattern: "" },
  { slug: "careem-plus", name: "Careem Plus", nameAr: "كريم بلس", icon: "careem.com", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "9.99", priceUnit: "ر.س/شهر", category: "نقل وتوصيل",
    steps: ["افتح تطبيق كريم", "اضغط على الملف الشخصي", "اذهب لـ Careem Plus", "اضغط إلغاء الاشتراك", "أكّد الإلغاء"],
    warning: "", cancelUrl: "", darkPattern: "" },
  { slug: "toyou", name: "ToYou", nameAr: "تويو", icon: "toyou.io", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "14.99", priceUnit: "ر.س/شهر", category: "توصيل",
    steps: ["افتح تطبيق تويو", "اذهب لحسابك", "اضغط إدارة الاشتراك", "اضغط إلغاء", "أكّد"],
    warning: "", cancelUrl: "", darkPattern: "" },
  { slug: "mrsool", name: "Mrsool Plus", nameAr: "مرسول بلس", icon: "mrsool.co", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "19.99", priceUnit: "ر.س/شهر", category: "توصيل",
    steps: ["افتح تطبيق مرسول", "اضغط على حسابك", "اذهب لـ مرسول بلس", "اضغط إلغاء الاشتراك", "أكّد"],
    warning: "", cancelUrl: "", darkPattern: "" },

  // Productivity & AI
  { slug: "microsoft-365", name: "Microsoft 365", nameAr: "مايكروسوفت 365", icon: "microsoft.com", difficulty: "medium", difficultyAr: "متوسط", difficultyClass: "medium", price: "29.99", priceUnit: "ر.س/شهر", category: "إنتاجية",
    steps: ["افتح account.microsoft.com وسجّل دخول", "اضغط Services & subscriptions", "ابحث عن Microsoft 365", "اضغط Manage ← Cancel", "أكّد الإلغاء عبر عدة خطوات"],
    warning: "مايكروسوفت يعرض عليك خصومات متعددة قبل الإلغاء.", cancelUrl: "https://account.microsoft.com/services", darkPattern: "عروض متعددة للبقاء" },
  { slug: "google-one", name: "Google One", nameAr: "جوجل ون", icon: "google.com", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "6.99", priceUnit: "ر.س/شهر", category: "تخزين سحابي",
    steps: ["افتح one.google.com", "اضغط Settings", "اضغط Cancel membership", "أكّد الإلغاء"],
    warning: "إذا تجاوزت المساحة المجانية (15GB)، راح تحتاج تحذف ملفات.", cancelUrl: "https://one.google.com/settings", darkPattern: "" },
  { slug: "notion", name: "Notion", nameAr: "نوشن", icon: "notion.so", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "37", priceUnit: "ر.س/شهر", category: "إنتاجية",
    steps: ["افتح notion.so وسجّل دخول", "اذهب لـ Settings & Members", "اضغط Plans", "اضغط Downgrade to Free", "أكّد الإلغاء"],
    warning: "", cancelUrl: "https://www.notion.so/settings", darkPattern: "" },
  { slug: "canva-pro", name: "Canva Pro", nameAr: "كانفا برو", icon: "canva.com", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "44.99", priceUnit: "ر.س/شهر", category: "تصميم",
    steps: ["افتح canva.com وسجّل دخول", "اضغط على Settings", "اذهب لـ Billing & plans", "اضغط Cancel subscription", "أكّد الإلغاء"],
    warning: "", cancelUrl: "https://www.canva.com/settings", darkPattern: "" },
  { slug: "claude-pro", name: "Claude Pro", nameAr: "كلود برو", icon: "claude.ai", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "75", priceUnit: "ر.س/شهر", category: "ذكاء اصطناعي",
    steps: ["افتح claude.ai وسجّل دخول", "اضغط على اسمك ← Settings", "اذهب لـ Subscription", "اضغط Cancel plan", "أكّد الإلغاء"],
    warning: "", cancelUrl: "https://claude.ai/settings", darkPattern: "" },
  { slug: "midjourney", name: "Midjourney", nameAr: "ميدجورني", icon: "midjourney.com", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "37", priceUnit: "ر.س/شهر", category: "ذكاء اصطناعي",
    steps: ["افتح midjourney.com/account وسجّل دخول", "اذهب لـ Manage Subscription", "اضغط Cancel Plan", "أكّد الإلغاء"],
    warning: "", cancelUrl: "https://www.midjourney.com/account", darkPattern: "" },
  { slug: "grammarly", name: "Grammarly", nameAr: "قرامرلي", icon: "grammarly.com", difficulty: "medium", difficultyAr: "متوسط", difficultyClass: "medium", price: "45", priceUnit: "ر.س/شهر", category: "إنتاجية",
    steps: ["افتح account.grammarly.com", "اضغط Subscription", "اضغط Cancel Subscription", "جاوب على أسئلة الإلغاء", "أكّد الإلغاء"],
    warning: "قرامرلي يعرض عليك خصم قبل الإلغاء.", cancelUrl: "https://account.grammarly.com/subscription", darkPattern: "عروض خصم للبقاء" },

  // Gaming
  { slug: "xbox-game-pass", name: "Xbox Game Pass", nameAr: "إكسبوكس قيم باس", icon: "xbox.com", difficulty: "medium", difficultyAr: "متوسط", difficultyClass: "medium", price: "39.99", priceUnit: "ر.س/شهر", category: "ألعاب",
    steps: ["افتح account.microsoft.com/services", "ابحث عن Xbox Game Pass", "اضغط Manage", "اضغط Cancel", "أكّد الإلغاء عبر عدة خطوات"],
    warning: "", cancelUrl: "https://account.microsoft.com/services", darkPattern: "خطوات إلغاء متعددة" },
  { slug: "playstation-plus", name: "PlayStation Plus", nameAr: "بلايستيشن بلس", icon: "playstation.com", difficulty: "medium", difficultyAr: "متوسط", difficultyClass: "medium", price: "24.99", priceUnit: "ر.س/شهر", category: "ألعاب",
    steps: ["افتح store.playstation.com وسجّل دخول", "اضغط على صورتك ← Subscription Management", "اضغط PlayStation Plus", "اضغط Turn Off Auto-Renew", "أكّد الإلغاء"],
    warning: "", cancelUrl: "https://store.playstation.com/subscriptions", darkPattern: "" },
  { slug: "ea-play", name: "EA Play", nameAr: "EA Play", icon: "ea.com", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "19.99", priceUnit: "ر.س/شهر", category: "ألعاب",
    steps: ["افتح myaccount.ea.com وسجّل دخول", "اذهب لـ EA Play Subscription", "اضغط Cancel Membership", "أكّد الإلغاء"],
    warning: "", cancelUrl: "https://myaccount.ea.com", darkPattern: "" },
  { slug: "nintendo-switch-online", name: "Nintendo Switch Online", nameAr: "نينتندو سويتش أونلاين", icon: "nintendo.com", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "14.99", priceUnit: "ر.س/شهر", category: "ألعاب",
    steps: ["افتح accounts.nintendo.com", "اذهب لـ Shop Menu ← Nintendo Switch Online", "اضغط Turn Off Automatic Renewal", "أكّد الإلغاء"],
    warning: "", cancelUrl: "https://accounts.nintendo.com", darkPattern: "" },

  // VPN
  { slug: "nordvpn", name: "NordVPN", nameAr: "نورد في بي إن", icon: "nordvpn.com", difficulty: "medium", difficultyAr: "متوسط", difficultyClass: "medium", price: "44.99", priceUnit: "ر.س/شهر", category: "VPN",
    steps: ["افتح my.nordaccount.com وسجّل دخول", "اذهب لـ Billing", "اضغط Cancel automatic payments", "جاوب على أسئلة الإلغاء", "أكّد الإلغاء"],
    warning: "", cancelUrl: "https://my.nordaccount.com", darkPattern: "أسئلة إلغاء متعددة" },
  { slug: "expressvpn", name: "ExpressVPN", nameAr: "إكسبرس في بي إن", icon: "expressvpn.com", difficulty: "medium", difficultyAr: "متوسط", difficultyClass: "medium", price: "49.99", priceUnit: "ر.س/شهر", category: "VPN",
    steps: ["افتح expressvpn.com/subscriptions", "سجّل دخول", "اضغط Manage Settings", "اضغط Turn off automatic renewal", "أكّد الإلغاء"],
    warning: "", cancelUrl: "https://www.expressvpn.com/subscriptions", darkPattern: "" },

  // Social & Communication
  { slug: "x-premium", name: "X Premium", nameAr: "X بريميوم", icon: "x.com", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "37", priceUnit: "ر.س/شهر", category: "تواصل اجتماعي",
    steps: ["افتح x.com/settings/premium", "اضغط Manage subscription", "اضغط Cancel plan", "أكّد الإلغاء"],
    warning: "إذا اشتركت عن طريق App Store، ألغِ من إعدادات iPhone.", cancelUrl: "https://x.com/settings/premium", darkPattern: "" },
  { slug: "linkedin-premium", name: "LinkedIn Premium", nameAr: "لينكدإن بريميوم", icon: "linkedin.com", difficulty: "medium", difficultyAr: "متوسط", difficultyClass: "medium", price: "112", priceUnit: "ر.س/شهر", category: "مهني",
    steps: ["افتح linkedin.com/psettings/subscription", "اضغط Manage Premium account", "اضغط Cancel subscription", "جاوب على أسئلة الإلغاء", "أكّد الإلغاء"],
    warning: "", cancelUrl: "https://www.linkedin.com/psettings/subscription", darkPattern: "أسئلة إلغاء متعددة" },
  { slug: "snapchat-plus", name: "Snapchat+", nameAr: "سناب شات بلس", icon: "snapchat.com", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "22.99", priceUnit: "ر.س/شهر", category: "تواصل اجتماعي",
    steps: ["افتح تطبيق سناب شات", "اضغط على Bitmoji ← الإعدادات", "اضغط Snapchat+", "اضغط Manage ← Cancel", "أكّد الإلغاء"],
    warning: "إذا اشتركت عن طريق App Store أو Google Play، ألغِ من إعدادات جهازك.", cancelUrl: "", darkPattern: "" },
  { slug: "telegram-premium", name: "Telegram Premium", nameAr: "تيليجرام بريميوم", icon: "telegram.org", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "18.99", priceUnit: "ر.س/شهر", category: "تواصل",
    steps: ["افتح إعدادات iPhone ← حسابك ← الاشتراكات", "ابحث عن Telegram Premium", "اضغط إلغاء الاشتراك", "أكّد الإلغاء"],
    warning: "تيليجرام بريميوم يُلغى فقط من إعدادات App Store أو Google Play.", cancelUrl: "", darkPattern: "" },

  // Education
  { slug: "duolingo-plus", name: "Duolingo Plus", nameAr: "دولينجو بلس", icon: "duolingo.com", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "44.99", priceUnit: "ر.س/شهر", category: "تعليم",
    steps: ["افتح duolingo.com/settings/subscription", "اضغط Cancel subscription", "جاوب على سؤال سبب الإلغاء", "أكّد الإلغاء"],
    warning: "", cancelUrl: "https://www.duolingo.com/settings/subscription", darkPattern: "" },
  { slug: "coursera-plus", name: "Coursera Plus", nameAr: "كورسيرا بلس", icon: "coursera.org", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "224", priceUnit: "ر.س/شهر", category: "تعليم",
    steps: ["افتح coursera.org/account-settings", "اضغط Manage ← Cancel", "جاوب على أسئلة الإلغاء", "أكّد الإلغاء"],
    warning: "", cancelUrl: "https://www.coursera.org/account-settings", darkPattern: "" },
  { slug: "skillshare", name: "Skillshare", nameAr: "سكلشير", icon: "skillshare.com", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "52", priceUnit: "ر.س/شهر", category: "تعليم",
    steps: ["افتح skillshare.com/settings/account", "اذهب لـ Payments", "اضغط Cancel membership", "أكّد الإلغاء"],
    warning: "", cancelUrl: "https://www.skillshare.com/settings/account", darkPattern: "" },

  // Fitness
  { slug: "fitbit-premium", name: "Fitbit Premium", nameAr: "فتبت بريميوم", icon: "fitbit.com", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "37.99", priceUnit: "ر.س/شهر", category: "لياقة",
    steps: ["افتح fitbit.com/settings/subscription", "اضغط Manage membership", "اضغط Cancel membership", "أكّد الإلغاء"],
    warning: "", cancelUrl: "https://www.fitbit.com/settings/subscription", darkPattern: "" },
  { slug: "strava", name: "Strava", nameAr: "سترافا", icon: "strava.com", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "22.99", priceUnit: "ر.س/شهر", category: "لياقة",
    steps: ["افتح strava.com/settings/subscription", "اضغط Cancel Subscription", "جاوب على سبب الإلغاء", "أكّد الإلغاء"],
    warning: "", cancelUrl: "https://www.strava.com/settings/subscription", darkPattern: "" },
  { slug: "myfitnesspal", name: "MyFitnessPal", nameAr: "ماي فتنس بال", icon: "myfitnesspal.com", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "75", priceUnit: "ر.س/شهر", category: "لياقة",
    steps: ["افتح myfitnesspal.com/account", "اضغط My Subscription", "اضغط Cancel", "أكّد الإلغاء"],
    warning: "", cancelUrl: "https://www.myfitnesspal.com/account", darkPattern: "" },

  // Shopping & BNPL
  { slug: "noon-vip", name: "Noon VIP", nameAr: "نون VIP", icon: "noon.com", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "99", priceUnit: "ر.س/سنة", category: "تسوق",
    steps: ["افتح تطبيق نون أو noon.com", "اذهب لحسابك", "اضغط noon VIP", "اضغط إلغاء العضوية", "أكّد الإلغاء"],
    warning: "", cancelUrl: "https://www.noon.com", darkPattern: "" },

  // Cloud & Storage
  { slug: "dropbox", name: "Dropbox Plus", nameAr: "دروب بوكس بلس", icon: "dropbox.com", difficulty: "medium", difficultyAr: "متوسط", difficultyClass: "medium", price: "44.99", priceUnit: "ر.س/شهر", category: "تخزين سحابي",
    steps: ["افتح dropbox.com/account/plan", "اضغط Cancel plan", "جاوب على أسئلة الإلغاء", "اختر Downgrade", "أكّد الإلغاء"],
    warning: "دروب بوكس يعرض عليك عروض متعددة قبل الإلغاء.", cancelUrl: "https://www.dropbox.com/account/plan", darkPattern: "عروض متعددة للبقاء" },

  // Music extra
  { slug: "deezer", name: "Deezer", nameAr: "ديزر", icon: "deezer.com", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "19.99", priceUnit: "ر.س/شهر", category: "موسيقى",
    steps: ["افتح deezer.com/account/subscription", "اضغط Manage my subscription", "اضغط Deactivate", "أكّد الإلغاء"],
    warning: "", cancelUrl: "https://www.deezer.com/account/subscription", darkPattern: "" },
  { slug: "soundcloud-go", name: "SoundCloud Go", nameAr: "ساوند كلاود جو", icon: "soundcloud.com", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "22.99", priceUnit: "ر.س/شهر", category: "موسيقى",
    steps: ["افتح soundcloud.com/settings/account", "اضغط Manage ← Cancel", "أكّد الإلغاء"],
    warning: "", cancelUrl: "https://soundcloud.com/settings/account", darkPattern: "" },

  // Other popular
  { slug: "uber-one", name: "Uber One", nameAr: "أوبر ون", icon: "uber.com", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "29.99", priceUnit: "ر.س/شهر", category: "نقل",
    steps: ["افتح تطبيق أوبر", "اضغط على حسابك", "اذهب لـ Uber One", "اضغط Manage Membership ← Cancel", "أكّد الإلغاء"],
    warning: "", cancelUrl: "", darkPattern: "" },
  { slug: "zoom", name: "Zoom", nameAr: "زوم", icon: "zoom.us", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "52", priceUnit: "ر.س/شهر", category: "اجتماعات",
    steps: ["افتح zoom.us/billing وسجّل دخول", "اضغط Plan Management", "اضغط Cancel Plan", "أكّد الإلغاء"],
    warning: "", cancelUrl: "https://zoom.us/billing", darkPattern: "" },
  { slug: "1password", name: "1Password", nameAr: "ون باسورد", icon: "1password.com", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "11.99", priceUnit: "ر.س/شهر", category: "أمان",
    steps: ["افتح my.1password.com/settings/billing", "اضغط Manage ← Cancel subscription", "أكّد الإلغاء"],
    warning: "", cancelUrl: "https://my.1password.com/settings/billing", darkPattern: "" },
  { slug: "tidal", name: "TIDAL", nameAr: "تايدال", icon: "tidal.com", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "37.99", priceUnit: "ر.س/شهر", category: "موسيقى",
    steps: ["افتح tidal.com/account", "اضغط Manage subscription", "اضغط Cancel", "أكّد الإلغاء"],
    warning: "", cancelUrl: "https://tidal.com/account", darkPattern: "" },
  { slug: "crunchyroll", name: "Crunchyroll", nameAr: "كرانشي رول", icon: "crunchyroll.com", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "29.99", priceUnit: "ر.س/شهر", category: "أنمي",
    steps: ["افتح crunchyroll.com/account/subscription", "اضغط Cancel Membership", "جاوب على سبب الإلغاء", "أكّد الإلغاء"],
    warning: "", cancelUrl: "https://www.crunchyroll.com/account/subscription", darkPattern: "" },
  { slug: "curiosity-stream", name: "CuriosityStream", nameAr: "كيوريوستي ستريم", icon: "curiositystream.com", difficulty: "easy", difficultyAr: "سهل", difficultyClass: "easy", price: "11.99", priceUnit: "ر.س/شهر", category: "وثائقي",
    steps: ["افتح curiositystream.com/settings", "اضغط Subscription", "اضغط Cancel", "أكّد الإلغاء"],
    warning: "", cancelUrl: "https://curiositystream.com/settings", darkPattern: "" },
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
console.log(`\nDone! Generated ${count} cancel guide pages.`);
