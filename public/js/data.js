// Researched content in English and Arabic: support directory, platform guides, report forms.
// Every directory entry carries its source. Re-verify before each deployment and update the dates.
// Text values are {en, ar} pairs; numbers and links are plain strings.

export const DIRECTORY_LAST_CHECKED = "2026-10-29";
export const GUIDES_LAST_CHECKED = "2026-10-23";

// ---------------------------------------------------------------------------
// Directory: police and support contacts per country
// ---------------------------------------------------------------------------
export const COUNTRIES = {
  "United Arab Emirates": {
    name: { en: "United Arab Emirates", ar: "الإمارات العربية المتحدة" },
    emergency: { en: "999 (police) · 998 (ambulance)", ar: "999 (الشرطة) · 998 (الإسعاف)" },
    police: [
      {
        name: { en: "Ministry of Interior – eCrimes platform", ar: "وزارة الداخلية – منصة الجرائم الإلكترونية" },
        what: { en: "Federal channel for reporting cybercrime from anywhere in the UAE.", ar: "القناة الاتحادية للإبلاغ عن الجرائم الإلكترونية من أي مكان في الإمارات." },
        contact: [{ en: "'MOI UAE' app → Services → Police services → eCrimes services", ar: "تطبيق وزارة الداخلية (MOI UAE) ← الخدمات ← خدمات الشرطة ← خدمات الجرائم الإلكترونية" }],
        source: "https://u.ae/en/information-and-services/justice-safety-and-the-law/cyber-safety-and-digital-security/report-cybercrimes-online",
      },
      {
        name: { en: "Dubai Police – eCrime platform", ar: "شرطة دبي – منصة الجرائم الإلكترونية" },
        what: { en: "Online reporting of blackmail, hacking and online fraud for incidents in Dubai. Dubai Police say blackmail reports are handled confidentially.", ar: "للإبلاغ إلكترونيًا عن الابتزاز والاختراق والاحتيال الإلكتروني في إمارة دبي. وتؤكد شرطة دبي أنها تتعامل مع بلاغات الابتزاز بسرية." },
        contact: ["https://ecrimehub.gov.ae", { en: "Dubai Police app", ar: "تطبيق شرطة دبي" }],
        note: { en: "Covers incidents within Dubai only.", ar: "يغطي الحوادث التي تقع في دبي فقط." },
        source: "https://gulfnews.com/uae/crime/uae-ministry-of-interior-launches-cybercrime-platform-5-tips-to-avoid-online-fraud-1.500215172",
      },
      {
        name: { en: "Dubai Police – Al Ameen (confidential reporting)", ar: "شرطة دبي – خدمة الأمين (بلاغات سرية)" },
        what: { en: "Confidential line for reporting safety and harassment concerns.", ar: "خط سري للإبلاغ عن مخاوف تتعلق بالسلامة والتحرش." },
        contact: [{ en: "800 4888 (inside UAE)", ar: "800 4888 (داخل الإمارات)" }, { en: "+971 800 4888 (from abroad)", ar: "+971 800 4888 (من خارج الإمارات)" }],
        source: "https://u.ae/en/information-and-services/justice-safety-and-the-law/handling-emergencies/crime",
      },
      {
        name: { en: "Abu Dhabi Police – Aman service", ar: "شرطة أبوظبي – خدمة أمان" },
        what: { en: "24/7 confidential reporting, including extortion.", ar: "بلاغات سرية على مدار الساعة، بما في ذلك الابتزاز." },
        contact: [{ en: "800 2626 (toll-free)", ar: "800 2626 (مجاني)" }, { en: "SMS 2828", ar: "رسالة نصية: 2828" }],
        source: "https://u.ae/en/information-and-services/justice-safety-and-the-law/handling-emergencies/crime",
      },
      {
        name: { en: "Sharjah Police – Najeed service", ar: "شرطة الشارقة – خدمة نجيد" },
        what: { en: "Harassment and safety reports in Sharjah.", ar: "بلاغات التحرش والسلامة في الشارقة." },
        contact: ["800 151", { en: "SMS 7999", ar: "رسالة نصية: 7999" }],
        source: "https://u.ae/en/information-and-services/justice-safety-and-the-law/handling-emergencies/crime",
      },
      {
        name: { en: "'My Safe Society' app (Federal Public Prosecution)", ar: "تطبيق «مجتمعي آمن» (النيابة العامة الاتحادية)" },
        what: { en: "Report crimes directly to the Public Prosecution.", ar: "للإبلاغ عن الجرائم مباشرة إلى النيابة العامة." },
        contact: ["App Store / Google Play"],
        source: "https://u.ae/en/information-and-services/justice-safety-and-the-law/cyber-safety-and-digital-security/report-cybercrimes-online",
      },
    ],
    support: [
      {
        name: { en: "Dubai Foundation for Women and Children (DFWAC)", ar: "مؤسسة دبي لرعاية النساء والأطفال" },
        what: { en: "Shelter, care, legal and psychosocial support for women and children facing violence. All nationalities. 24-hour helpline.", ar: "إيواء ورعاية ودعم قانوني ونفسي واجتماعي للنساء والأطفال المعرّضين للعنف، لجميع الجنسيات. خط مساعدة على مدار 24 ساعة." },
        contact: ["800 111"],
        source: "https://u.ae/en/information-and-services/justice-safety-and-the-law/handling-emergencies/crime",
      },
      {
        name: { en: "EWAA Shelters for Women and Children", ar: "مراكز إيواء للنساء والأطفال (EWAA)" },
        what: { en: "Shelter and support (Abu Dhabi, Sharjah, Ras Al Khaimah).", ar: "إيواء ودعم (أبوظبي والشارقة ورأس الخيمة)." },
        contact: ["800 7283 (800 SAVE)"],
        source: "https://u.ae/en/information-and-services/justice-safety-and-the-law/handling-emergencies/crime",
      },
      {
        name: { en: "Dubai Police – Child and Women Protection Department", ar: "شرطة دبي – إدارة حماية الطفل والمرأة" },
        what: { en: "Police unit for violence against women and children.", ar: "وحدة شرطية مختصة بالعنف ضد النساء والأطفال." },
        contact: ["04 274 4666"],
        source: "https://gulfnews.com/living-in-uae/safety-security/how-to-report-domestic-violence-in-the-uae-and-get-help-1.500207174",
      },
      {
        name: { en: "Hemaya Foundation for Children and Women (Ajman)", ar: "مؤسسة حماية للمرأة والطفل (عجمان)" },
        what: { en: "Protection services in Ajman.", ar: "خدمات الحماية في عجمان." },
        contact: ["800 446292 (800 HIMAYA)"],
        source: "https://u.ae/en/information-and-services/justice-safety-and-the-law/handling-emergencies/crime",
      },
      {
        name: { en: "Ministry of Interior – Child Protection", ar: "وزارة الداخلية – مركز حماية الطفل" },
        what: { en: "If the person affected is under 18.", ar: "إذا كان الشخص المتضرر دون 18 عامًا." },
        contact: ["116111"],
        source: "https://u.ae/en/information-and-services/justice-safety-and-the-law/handling-emergencies/crime",
      },
    ],
    notes: [
      {
        en: "Online blackmail is a crime under Federal Decree-Law No. 34 of 2021 on Countering Rumours and Cybercrimes.",
        ar: "الابتزاز الإلكتروني جريمة بموجب المرسوم بقانون اتحادي رقم 34 لسنة 2021 في شأن مكافحة الشائعات والجرائم الإلكترونية.",
      },
      {
        en: "We could not verify a current national mental-health helpline for the UAE. DFWAC and EWAA provide psychosocial support.",
        ar: "لم نتمكن من التحقق من وجود خط وطني حالي للصحة النفسية في الإمارات. تقدّم مؤسسة دبي لرعاية النساء والأطفال ومراكز إيواء دعمًا نفسيًا واجتماعيًا.",
      },
    ],
    notesSource: "https://u.ae/en/information-and-services/justice-safety-and-the-law/cyber-safety-and-digital-security/law-on-combatting-rumours-and-cybercrimes",
  },

  "Saudi Arabia": {
    name: { en: "Saudi Arabia", ar: "المملكة العربية السعودية" },
    emergency: { en: "999 (police) · 911 (security reports) · 997 (ambulance)", ar: "999 (الشرطة) · 911 (البلاغات الأمنية) · 997 (الإسعاف)" },
    police: [
      {
        name: { en: "Cyber-extortion reporting line", ar: "خط الإبلاغ عن الابتزاز الإلكتروني" },
        what: { en: "Unified number for reporting cyber extortion and blackmail.", ar: "الرقم الموحد للإبلاغ عن الابتزاز الإلكتروني." },
        contact: ["1909"],
        note: { en: "Verified via a Saudi law firm's 2026 guide, not a government page. Confirm before relying on it.", ar: "تم التحقق منه عبر دليل مكتب محاماة سعودي لعام 2026، وليس عبر صفحة حكومية. تأكدي منه قبل الاعتماد عليه." },
        source: "https://etqanlawfirm-sa.com/en/cyber-crime-complaint-online/",
      },
      {
        name: { en: "Kollona Amn app (Public Security)", ar: "تطبيق «كلنا أمن» (الأمن العام)" },
        what: { en: "Official app for reporting cybercrime, including blackmail and privacy violations. Lets you attach photos, video or audio.", ar: "تطبيق رسمي للإبلاغ عن الجرائم المعلوماتية، بما فيها الابتزاز وانتهاك الخصوصية، ويتيح إرفاق صور أو فيديو أو تسجيل صوتي." },
        contact: [{ en: "App Store / Google Play → Submit a report → Cybercrime", ar: "App Store / Google Play ← تقديم بلاغ ← الجرائم المعلوماتية" }],
        source: "https://ksaexpats.com/kollona-amn-report-harassment-cybercrime/",
      },
    ],
    support: [
      {
        name: { en: "Domestic Violence Reporting Center (Ministry of Human Resources and Social Development)", ar: "مركز بلاغات العنف الأسري (وزارة الموارد البشرية والتنمية الاجتماعية)" },
        what: { en: "24/7, every day including holidays. For violence within the family.", ar: "على مدار الساعة طوال أيام الأسبوع بما فيها العطلات، للعنف داخل الأسرة." },
        contact: [{ en: "1919 (toll-free)", ar: "1919 (مجاني)" }],
        source: "https://www.hrsd.gov.sa/en/ministry-services/services/1155125",
      },
      {
        name: { en: "Psychological Consultation Centre (Ministry of Health)", ar: "مركز الاستشارات النفسية (وزارة الصحة)" },
        what: { en: "Telephone psychological consultation with mental-health professionals.", ar: "استشارات نفسية هاتفية مع مختصين في الصحة النفسية." },
        contact: ["920033360"],
        note: { en: "Daytime hours, not 24/7.", ar: "خلال ساعات النهار، وليس على مدار الساعة." },
        source: "https://www.therapyroute.com/article/suicide-hotlines-and-crisis-lines-in-saudi-arabia-by-therapyroute",
      },
      {
        name: { en: "Child Helpline", ar: "خط مساندة الطفل" },
        what: { en: "If the person affected is under 18.", ar: "إذا كان الشخص المتضرر دون 18 عامًا." },
        contact: ["116111"],
        source: "https://www.therapyroute.com/article/suicide-hotlines-and-crisis-lines-in-saudi-arabia-by-therapyroute",
      },
    ],
    notes: [
      {
        en: "Digital extortion and violations of private life fall under Saudi Arabia's Anti-Cybercrime Law.",
        ar: "يندرج الابتزاز الرقمي وانتهاك الحياة الخاصة تحت نظام مكافحة الجرائم المعلوماتية في المملكة.",
      },
    ],
  },

  Egypt: {
    name: { en: "Egypt", ar: "مصر" },
    emergency: { en: "122 (police) · 123 (ambulance)", ar: "122 (الشرطة) · 123 (الإسعاف)" },
    police: [
      {
        name: { en: "Cybercrime hotline – 'Internet Police' (Ministry of Interior)", ar: "الخط الساخن للجرائم الإلكترونية – «مباحث الإنترنت» (وزارة الداخلية)" },
        what: { en: "24-hour hotline for reporting cybercrime, including e-blackmail.", ar: "خط ساخن على مدار 24 ساعة للإبلاغ عن الجرائم الإلكترونية، بما في ذلك الابتزاز الإلكتروني." },
        contact: ["108"],
        source: "https://gate.ahram.org.eg/News/5644818.aspx",
      },
      {
        name: { en: "General Administration for Combating Information Technology Crimes", ar: "الإدارة العامة لمكافحة جرائم تقنية المعلومات" },
        what: { en: "The Ministry of Interior unit that investigates cybercrime.", ar: "إدارة وزارة الداخلية التي تحقق في الجرائم الإلكترونية." },
        contact: ["02 2406 5051", "02 2406 5052"],
        source: "https://gate.ahram.org.eg/News/5346247.aspx",
      },
    ],
    support: [
      {
        name: { en: "National Council for Women – Women's Complaints Office", ar: "المجلس القومي للمرأة – مكتب شكاوى المرأة" },
        what: { en: "Free legal and psychological support, and referral to police and prosecutors. Has volunteer lawyers and offices in every governorate. Complaints are confidential.", ar: "دعم قانوني ونفسي مجاني، وإحالة إلى الشرطة والنيابة. لديه محامون متطوعون ومكاتب في كل المحافظات، والشكاوى سرية." },
        contact: [{ en: "15115 (daily 9am–9pm)", ar: "15115 (يوميًا من 9 صباحًا حتى 9 مساءً)" }, { en: "WhatsApp: 01007525600", ar: "واتساب: 01007525600" }],
        source: "https://gate.ahram.org.eg/News/5287846.aspx",
      },
      {
        name: { en: "Ministry of Health psychological support lines", ar: "خطوط الدعم النفسي – وزارة الصحة" },
        what: { en: "Remote psychological support.", ar: "دعم نفسي عن بُعد." },
        contact: ["080 8880 700", "02 2081 6831"],
        note: { en: "Launched in 2020. Confirm the line is still active.", ar: "أُطلقت عام 2020. تأكدي من أن الخط ما زال يعمل." },
        source: "https://cairoscene.com/Buzz/hotlines-for-pysch-support-duting-quarantine",
      },
    ],
    notes: [
      {
        en: "E-blackmail and related offences fall under Law No. 175 of 2018 on Combating Information Technology Crimes.",
        ar: "يندرج الابتزاز الإلكتروني والجرائم المرتبطة به تحت القانون رقم 175 لسنة 2018 بشأن مكافحة جرائم تقنية المعلومات.",
      },
      {
        en: "Egyptian lawyers advise filing promptly: for some offences a complaint must be filed within three months of the incident.",
        ar: "ينصح المحامون في مصر بتقديم البلاغ سريعًا: ففي بعض الجرائم يجب تقديم الشكوى خلال ثلاثة أشهر من الواقعة.",
      },
    ],
  },

  Jordan: {
    name: { en: "Jordan", ar: "الأردن" },
    emergency: { en: "911", ar: "911" },
    police: [
      {
        name: { en: "Anti-Cybercrime Unit (Public Security Directorate, Criminal Investigation Department)", ar: "وحدة مكافحة الجرائم الإلكترونية (مديرية الأمن العام – إدارة البحث الجنائي)" },
        what: { en: "Investigates online blackmail, threats and defamation. Says cases are handled with complete confidentiality, and offenders abroad are pursued through Arab and international police channels.", ar: "تحقق في الابتزاز الإلكتروني والتهديد والتشهير عبر الإنترنت. وتؤكد أنها تتعامل مع القضايا بسرية تامة، وتلاحق الجناة خارج الأردن عبر قنوات الشرطة العربية والدولية." },
        contact: [{ en: "Call 911", ar: "اتصلي بـ 911" }, { en: "Or go to the Criminal Investigation (CID) office at your nearest police station", ar: "أو توجّهي إلى مكتب البحث الجنائي في أقرب مركز أمني" }],
        source: "https://petra.gov.jo/wk/index.php/en/news/psd-warns-against-new-phone-scam-impersonating-security-officers",
      },
    ],
    support: [
      {
        name: { en: "Family Protection and Juveniles Department (Public Security Directorate)", ar: "إدارة حماية الأسرة والأحداث (مديرية الأمن العام)" },
        what: { en: "Police department for family violence, sexual assault and child protection. Provides psychological and social support services.", ar: "الإدارة الشرطية المختصة بالعنف الأسري والاعتداءات الجنسية وحماية الأطفال، وتقدّم خدمات دعم نفسي واجتماعي." },
        contact: ["196", "911", { en: "WhatsApp: 0797911911", ar: "واتساب: 0797911911" }],
        source: "https://www.therapyroute.com/article/suicide-hotlines-and-crisis-lines-in-jordan-by-therapyroute",
      },
      {
        name: { en: "110 Family and Child Helpline", ar: "خط 110 لمساندة الأسرة والطفل" },
        what: { en: "Free helpline for children and families.", ar: "خط مساعدة مجاني للأطفال والأسر." },
        contact: ["110"],
        source: "https://www.therapyroute.com/article/suicide-hotlines-and-crisis-lines-in-jordan-by-therapyroute",
      },
      {
        name: { en: "Jordanian Women's Union", ar: "اتحاد المرأة الأردني" },
        what: { en: "Hotline, legal, psychosocial and shelter support for women survivors of violence.", ar: "خط ساخن ودعم قانوني ونفسي واجتماعي وإيواء للنساء الناجيات من العنف." },
        contact: [{ en: "+962 6 568 7037 (main line)", ar: "+962 6 568 7037 (الرقم الرئيسي)" }],
        note: { en: "Main office line from an international directory. Ask for the hotline.", ar: "رقم المكتب الرئيسي من دليل دولي. اسألي عن الخط الساخن." },
        source: "https://humantraffickinghotline.org/es/node/12326",
      },
      {
        name: { en: "Legal aid organisations", ar: "منظمات المساعدة القانونية" },
        what: { en: "UN Women lists these civil-society groups as offering legal aid to survivors of violence: Justice Center for Legal Aid (JCLA), Sisterhood is Global Institute (SIGI) Jordan, Mizan, Tamkeen and ARDD.", ar: "تذكر هيئة الأمم المتحدة للمرأة هذه المنظمات بوصفها جهات تقدّم مساعدة قانونية للناجيات من العنف: مركز العدل للمساعدة القانونية، ومعهد تضامن النساء الأردني (SIGI)، وميزان، وتمكين، والنهضة العربية للديمقراطية والتنمية (ARDD)." },
        contact: [{ en: "Search each organisation's official website for current contact details", ar: "ابحثي عن الموقع الرسمي لكل منظمة للحصول على بيانات التواصل الحالية" }],
        source: "https://data.unwomen.org/global-database-on-violence-against-women/country-profile/Jordan/country-snapshot",
      },
    ],
    notes: [
      { en: "Online crimes are covered by Cybercrime Law No. 17 of 2023.", ar: "تخضع الجرائم الإلكترونية لقانون الجرائم الإلكترونية رقم 17 لسنة 2023." },
    ],
  },

  Lebanon: {
    name: { en: "Lebanon", ar: "لبنان" },
    emergency: { en: "112 (Internal Security Forces) · 140 (Red Cross ambulance)", ar: "112 (قوى الأمن الداخلي) · 140 (إسعاف الصليب الأحمر)" },
    police: [
      {
        name: { en: "Internal Security Forces – 'Baligh' (report) service", ar: "قوى الأمن الداخلي – خدمة «بلّغ»" },
        what: { en: "Online reporting to the ISF. The Cybercrime and Intellectual Property Bureau handles online blackmail and fraud.", ar: "للإبلاغ إلكترونيًا لدى قوى الأمن الداخلي. ويتولى مكتب مكافحة الجرائم المعلوماتية وحماية الملكية الفكرية قضايا الابتزاز والاحتيال عبر الإنترنت." },
        contact: [{ en: "https://isf.gov.lb (Baligh)", ar: "https://isf.gov.lb (خدمة بلّغ)" }, { en: "ISF mobile app", ar: "تطبيق قوى الأمن الداخلي" }, { en: "Nearest police station", ar: "أقرب مخفر" }],
        source: "https://isf.gov.lb/news/after-threatening-to-publish-private-videos-the-zahle-judicial-detachment-arrests-an-online-blackmailer-and-the-internal-security-forces-warn-against-the-dangers-of-extortion/",
      },
      {
        name: { en: "ISF domestic violence line", ar: "خط قوى الأمن الداخلي للعنف الأسري" },
        what: { en: "Police reporting line for domestic violence (not a counselling line).", ar: "خط للإبلاغ عن العنف الأسري لدى الشرطة (وليس خطًا للاستشارة)." },
        contact: ["1745"],
        source: "https://kafa.org.lb/en/node/86",
      },
    ],
    support: [
      {
        name: { en: "KAFA (enough) Violence & Exploitation", ar: "منظمة «كفى عنف واستغلال»" },
        what: { en: "Free, confidential support for women survivors of domestic and sexual violence.", ar: "دعم مجاني وسري للنساء الناجيات من العنف الأسري والجنسي." },
        contact: ["+961 3 018 019", { en: "Signal: +961 81 47 84 50", ar: "سيغنال: ‎+961 81 47 84 50" }],
        source: "https://www.therapyroute.com/article/suicide-hotlines-and-crisis-lines-in-lebanon-by-therapyroute",
      },
      {
        name: { en: "ABAAD – Emergency Safe Line (24/7)", ar: "أبعاد – الخط الآمن للطوارئ (24/7)" },
        what: { en: "Support for women and girls facing gender-based violence, including cyber violence and blackmail.", ar: "دعم للنساء والفتيات المعرّضات للعنف القائم على النوع الاجتماعي، بما في ذلك العنف الإلكتروني والابتزاز." },
        contact: ["+961 81 78 81 78", { en: "Al Dar safe shelter (24/7): +961 76 06 06 02", ar: "مركز الدار الآمن (24/7): ‎+961 76 06 06 02" }],
        source: "https://www.abaadmena.org/resources/violence-does-not-stop-in-a-crisis-neither-do-we/",
      },
      {
        name: { en: "Embrace – National Lifeline", ar: "Embrace – الخط الوطني للدعم النفسي" },
        what: { en: "Emotional support and suicide prevention, run with the Ministry of Public Health. Answered day and night.", ar: "دعم نفسي ووقاية من الانتحار، بالشراكة مع وزارة الصحة العامة. متاح ليلًا ونهارًا." },
        contact: ["1564"],
        source: "https://www.therapyroute.com/article/suicide-hotlines-and-crisis-lines-in-lebanon-by-therapyroute",
      },
    ],
    notes: [],
  },
};

// ---------------------------------------------------------------------------
// DeepShield (partner resource)
// ---------------------------------------------------------------------------
export const DEEPSHIELD = {
  name: "DeepShield AI",
  url: "https://deepshield-ai-359228671407.us-central1.run.app/",
  tagline: { en: "Detect deepfakes with confidence.", ar: "اكشفي التزييف العميق بثقة." },
  what: {
    en: "DeepShield AI helps identify whether an image or video is likely real or fake using an AI-based deepfake detection system.",
    ar: "يساعد DeepShield AI على معرفة ما إذا كانت الصورة أو الفيديو حقيقيًا على الأرجح أم مزيفًا، باستخدام نظام لكشف التزييف العميق يعتمد على الذكاء الاصطناعي.",
  },
  by: { en: "Developed by Aqsa Khan, Girl Up Emirates leader.", ar: "طوّرته أقصى خان، القائدة في Girl Up Emirates." },
  caveats: [
    {
      en: "It is built to detect face-swap deepfakes of human faces. Its result is an estimate: a “likely real” result doesn't stop you reporting content you know is fake.",
      ar: "صُمّم لكشف تبديل الوجوه في صور الأشخاص. ونتيجته تقدير فقط: إن أظهر أن المحتوى «حقيقي على الأرجح» فهذا لا يمنعك من الإبلاغ عن محتوى تعرفين أنه مزيف.",
    },
    {
      en: "Files you check are uploaded to DeepShield's own server, so think carefully before uploading intimate images.",
      ar: "تُرفع الملفات التي تفحصينها إلى خادم DeepShield، لذا فكّري جيدًا قبل رفع صور حميمة.",
    },
  ],
};

// ---------------------------------------------------------------------------
// Online services (work from anywhere)
// ---------------------------------------------------------------------------
export const REGIONAL = [
  {
    name: { en: "StopNCII.org (available in Arabic)", ar: "StopNCII.org (متوفر بالعربية)" },
    what: { en: "Creates a digital fingerprint (hash) of an intimate image on your own device. Participating platforms use it to block uploads. The image itself never leaves your device.", ar: "يُنشئ بصمة رقمية للصورة الحميمة على جهازك، وتستخدمها المنصات الشريكة لحظر رفعها. الصورة نفسها لا تغادر جهازك." },
    contact: ["https://stopncii.org/create-your-case"],
    note: { en: "Only for people aged 18+ who still have the image.", ar: "للأشخاص بعمر 18 عامًا فأكثر ممن ما زالت الصورة لديهم فقط." },
    source: "https://stopncii.org",
  },
  {
    name: { en: "Take It Down (NCMEC)", ar: "Take It Down (NCMEC)" },
    what: { en: "Like StopNCII, but for images taken when the person was under 18.", ar: "مثل StopNCII، ولكن للصور التي التُقطت عندما كان عمر الشخص دون 18 عامًا." },
    contact: ["https://takeitdown.ncmec.org"],
    source: "https://takeitdown.ncmec.org",
  },
  {
    name: { en: "SMEX – Digital Safety Helpdesk (MENA)", ar: "SMEX – مكتب مساعدة السلامة الرقمية (المنطقة العربية)" },
    what: { en: "Free rapid-response digital-safety help for human rights defenders, journalists and marginalised groups. Doxxing and threats are given priority.", ar: "مساعدة سريعة ومجانية في السلامة الرقمية للمدافعين عن حقوق الإنسان والصحفيين والفئات المهمّشة، مع أولوية لحالات كشف المعلومات الشخصية والتهديد." },
    contact: [{ en: "Signal or WhatsApp: +961 81 633 133", ar: "واتساب أو سيغنال: ‎+961 81 633 133" }],
    source: "https://smex.org/helpdesk",
  },
  {
    name: { en: "Access Now – Digital Security Helpline", ar: "Access Now – خط مساعدة الأمن الرقمي" },
    what: { en: "Free 24/7 digital security help in Arabic and eight other languages, for civil-society members at risk.", ar: "مساعدة مجانية على مدار الساعة في الأمن الرقمي بالعربية وثماني لغات أخرى، لأفراد المجتمع المدني المعرّضين للخطر." },
    contact: ["https://www.accessnow.org/help/"],
    source: "https://www.accessnow.org/help/",
  },
  // Community tool, listed after the official and established services.
  {
    name: { en: "DeepShield AI – check a suspected deepfake", ar: "DeepShield AI – افحصي محتوى تشكّين أنه مزيف" },
    what: { en: `${DEEPSHIELD.what.en} ${DEEPSHIELD.by.en}`, ar: `${DEEPSHIELD.what.ar} ${DEEPSHIELD.by.ar}` },
    contact: [DEEPSHIELD.url],
    note: DEEPSHIELD.caveats[1],
    source: DEEPSHIELD.url,
  },
];

// ---------------------------------------------------------------------------
// Takedown guides
// ---------------------------------------------------------------------------
export const GENERAL_DEEPFAKE_NOTE = {
  en: "Most platforms have no single 'report deepfake' button. Report the harm the fake enables (impersonation, harassment, non-consensual intimate imagery, fraud), then say clearly in the description that the content is AI-generated or manipulated, that it shows you, that you never consented, and what harm it is causing.",
  ar: "لا يوجد في معظم المنصات زر واحد للإبلاغ عن التزييف العميق. أبلغي عن الضرر الذي يسببه المحتوى المزيف (انتحال شخصية، أو تحرش، أو صور حميمة دون موافقة، أو احتيال)، ثم اذكري بوضوح في الوصف أن المحتوى مُنشأ أو معدّل بالذكاء الاصطناعي، وأنه يُظهركِ، وأنكِ لم توافقي عليه، وما الضرر الذي يسببه.",
};

export const PLATFORM_GUIDES = {
  "Google Search": {
    label: { en: "Google Search", ar: "بحث Google" },
    summary: { en: "Removes results from Google Search so the content is harder to find. It does NOT delete the content from the website hosting it.", ar: "يزيل النتائج من بحث Google فيصعب العثور على المحتوى، لكنه لا يحذف المحتوى من الموقع الذي ينشره." },
    routes: [
      {
        title: { en: "Fake sexual or nude images of you (deepfakes)", ar: "صور جنسية أو عارية مزيفة لكِ (التزييف العميق)" },
        steps: [
          { en: "Open Google's request page for fake sexually explicit imagery shared without consent.", ar: "افتحي صفحة Google لطلب إزالة الصور الجنسية المزيفة المنشورة دون موافقة." },
          { en: "Choose the option for a fake nude or sexually explicit picture or video of yourself.", ar: "اختاري خيار الصورة أو الفيديو المزيف العاري أو الجنسي لكِ («A fake nude or sexually explicit picture or video of myself»)." },
          { en: "Paste each URL on its own line: the web pages showing the content and, if possible, the Google Search results pages where it appears.", ar: "الصقي كل رابط في سطر منفصل: صفحات الويب التي تعرض المحتوى، وإن أمكن صفحات نتائج بحث Google التي يظهر فيها." },
          { en: "Attach the screenshots the form asks for. Google suggests taking them on the device you use to submit the form.", ar: "أرفقي لقطات الشاشة التي يطلبها النموذج. وتنصح Google بالتقاطها على الجهاز نفسه الذي تقدّمين منه الطلب." },
          { en: "Google also tries to remove duplicates of the same image. You can opt out of this on the form.", ar: "تحاول Google أيضًا إزالة النسخ المكررة من الصورة نفسها، ويمكنك إلغاء ذلك من النموذج." },
        ],
        requirements: [
          { en: "You are identifiable in the imagery.", ar: "أنه يمكن التعرّف عليكِ في الصور." },
          { en: "The imagery is fake and falsely shows you nude or in a sexually explicit situation.", ar: "أن الصور مزيفة وتُظهركِ زورًا عارية أو في وضع جنسي صريح." },
          { en: "It was distributed without your consent.", ar: "أنها نُشرت دون موافقتك." },
        ],
        links: [
          [{ en: "Google help: remove fake sexually explicit imagery", ar: "مساعدة Google: إزالة الصور الجنسية المزيفة" }, "https://support.google.com/websearch/answer/9116649"],
          [{ en: "Google guide: report non-consensual intimate imagery (all Google services)", ar: "دليل Google: الإبلاغ عن الصور الحميمة غير التوافقية (جميع خدمات Google)" }, "https://support.google.com/accounts/answer/17045517"],
        ],
      },
      {
        title: { en: "Personal information (phone, address, ID documents, etc.)", ar: "معلومات شخصية (رقم الهاتف، العنوان، وثائق الهوية…)" },
        steps: [
          { en: "Open Google's content removal form and choose the option for personal information.", ar: "افتحي نموذج Google لإزالة المحتوى، واختاري خيار المعلومات الشخصية." },
          { en: "List each URL showing your information and say what information it exposes.", ar: "اذكري كل رابط يعرض معلوماتك، وما المعلومات التي يكشفها." },
        ],
        links: [
          [{ en: "Google content removal form", ar: "نموذج Google لإزالة المحتوى" }, "https://support.google.com/websearch/contact/content_removal_form"],
        ],
      },
      {
        title: { en: "Legal removal ('Right to be Forgotten')", ar: "الإزالة القانونية («الحق في النسيان»)" },
        steps: [
          { en: "Only available if you live in one of the countries in the form's 'Where do you live?' list (mainly European countries). Most MENA residents should use the routes above.", ar: "متاح فقط إذا كنتِ تقيمين في إحدى الدول المدرجة في قائمة «Where do you live?» في النموذج (معظمها دول أوروبية). معظم المقيمات في المنطقة العربية يستخدمن الطرق المذكورة أعلاه." },
          { en: "Enter your full legal name, the type of name tied to the content, each URL, and an explanation of up to 1,000 characters.", ar: "أدخلي اسمك القانوني الكامل، ونوع الاسم المرتبط بالمحتوى، وكل رابط، وشرحًا لا يتجاوز 1000 حرف." },
          { en: "Sign the sworn statement.", ar: "وقّعي الإقرار." },
        ],
        links: [[{ en: "Legal removal request form", ar: "نموذج طلب الإزالة القانونية" }, "https://reportcontent.google.com/forms/rtbf"]],
      },
    ],
  },
  YouTube: {
    label: { en: "YouTube", ar: "YouTube" },
    summary: { en: "YouTube has a privacy complaint process for realistic AI-generated or altered content that looks or sounds like you.", ar: "لدى YouTube إجراء لشكاوى الخصوصية بشأن المحتوى الواقعي المُنشأ أو المعدّل بالذكاء الاصطناعي الذي يشبهكِ في الشكل أو الصوت." },
    routes: [
      {
        title: { en: "AI-generated or altered video/audio of you", ar: "فيديو أو صوت لكِ مُنشأ أو معدّل بالذكاء الاصطناعي" },
        steps: [
          { en: "Open YouTube's Privacy Complaint Process and choose to report altered or synthetic content.", ar: "افتحي إجراء شكاوى الخصوصية في YouTube واختاري الإبلاغ عن محتوى معدّل أو اصطناعي." },
          { en: "Give the video URL(s), or the channel/comment URLs if the content is there.", ar: "أدخلي رابط الفيديو، أو روابط القناة أو التعليقات إن كان المحتوى هناك." },
          { en: "Describe how your appearance or actions were altered or generated by AI.", ar: "صِفي كيف عُدّل مظهرك أو أفعالك أو أُنشئت بالذكاء الاصطناعي." },
          { en: "Describe yourself as you appear in the content so reviewers can identify you. YouTube says it will not act if you can't be clearly identified.", ar: "صِفي نفسك كما تظهرين في المحتوى ليتمكن المراجعون من التعرّف عليكِ. يقول YouTube إنه لن يتخذ إجراءً إن لم يكن من الممكن التعرّف عليكِ بوضوح." },
          { en: "YouTube notifies the uploader and gives them about 48 hours to remove or edit the content. After that, YouTube reviews the complaint. Your name and contact details are not shared with the uploader.", ar: "يُبلغ YouTube صاحب المحتوى ويمنحه نحو 48 ساعة لإزالته أو تعديله، ثم يراجع الشكوى. ولا يُشارك اسمك أو بيانات تواصلك مع صاحب المحتوى." },
        ],
        requirements: [
          { en: "The content is a realistic altered or synthetic version of your likeness.", ar: "أن يكون المحتوى نسخة واقعية معدّلة أو اصطناعية من ملامحك." },
          { en: "You are uniquely identifiable in it.", ar: "أنه يمكن التعرّف عليكِ فيه بشكل خاص." },
          { en: "YouTube also considers whether it is labelled as synthetic, and whether it is parody, satire or in the public interest.", ar: "ويأخذ YouTube في الاعتبار أيضًا ما إذا كان المحتوى مُصنّفًا على أنه اصطناعي، وما إذا كان محاكاة ساخرة أو هجاءً أو ذا قيمة للمصلحة العامة." },
        ],
        links: [
          [{ en: "YouTube privacy guidelines", ar: "إرشادات الخصوصية في YouTube" }, "https://support.google.com/youtube/answer/7671399"],
          [{ en: "Privacy Complaint Process", ar: "إجراء شكاوى الخصوصية" }, "https://support.google.com/youtube/answer/142443"],
        ],
      },
    ],
  },
  Facebook: {
    label: { en: "Facebook", ar: "Facebook" },
    summary: { en: "Report in the app. For intimate images, Meta uses photo-matching to block re-uploads across Facebook, Messenger and Instagram once it confirms the report.", ar: "أبلغي من داخل التطبيق. وبالنسبة للصور الحميمة، تستخدم Meta تقنية مطابقة الصور لمنع إعادة رفعها على Facebook وMessenger وInstagram بعد تأكيد البلاغ." },
    routes: [
      {
        title: { en: "Report a post, photo or video", ar: "الإبلاغ عن منشور أو صورة أو فيديو" },
        steps: [
          { en: "Open the post, photo or video.", ar: "افتحي المنشور أو الصورة أو الفيديو." },
          { en: "Tap ⋯ → Report post / Report video.", ar: "اضغطي على ⋯ ثم «Report post» أو «Report video»." },
          { en: "Choose the category that best fits, e.g. nudity / sharing private images, harassment, or a fake account / impersonation.", ar: "اختاري الفئة الأنسب، مثل العُري / مشاركة صور خاصة، أو التحرش، أو حساب مزيف / انتحال شخصية." },
          { en: "Where you can add details, say the content is AI-generated or manipulated, that it shows you, and why it is deceptive or harmful.", ar: "إن أمكن إضافة تفاصيل، اذكري أن المحتوى مُنشأ أو معدّل بالذكاء الاصطناعي، وأنه يُظهركِ، ولماذا هو مضلل أو مؤذٍ." },
        ],
        links: [[{ en: "Facebook Help Center", ar: "مركز مساعدة Facebook" }, "https://www.facebook.com/help/"]],
      },
      {
        title: { en: "Fake account pretending to be you", ar: "حساب مزيف ينتحل شخصيتك" },
        steps: [
          { en: "Go to the fake profile → ⋯ → Report profile → 'Pretending to be someone' → 'Me'.", ar: "افتحي الحساب المزيف ← ⋯ ← «Report profile» ← «Pretending to be someone» ← «Me»." },
          { en: "If you don't have a Facebook account, search the Help Center for 'impersonation' to find the form for non-users.", ar: "إن لم يكن لديك حساب على Facebook، ابحثي في مركز المساعدة عن «impersonation» للوصول إلى النموذج المخصص لغير المستخدمين." },
        ],
      },
    ],
  },
  Instagram: {
    label: { en: "Instagram", ar: "Instagram" },
    summary: { en: "Report in the app. Meta's photo-matching also covers Instagram.", ar: "أبلغي من داخل التطبيق. تقنية مطابقة الصور من Meta تشمل Instagram أيضًا." },
    routes: [
      {
        title: { en: "Report a post, reel or story", ar: "الإبلاغ عن منشور أو ريلز أو ستوري" },
        steps: [
          { en: "Tap the ⋯ (or two lines) on the post → Report.", ar: "اضغطي على ⋯ (أو الخطين) في المنشور ثم «Report»." },
          { en: "Choose the most fitting reason, e.g. nudity or sexual activity, bullying or harassment, or scam/fraud/impersonation.", ar: "اختاري السبب الأنسب، مثل العُري أو النشاط الجنسي، أو التنمر أو التحرش، أو الاحتيال / انتحال الشخصية." },
          { en: "Explain that the content is AI-generated, shows you, and was posted without your consent.", ar: "اذكري أن المحتوى مُنشأ بالذكاء الاصطناعي، وأنه يُظهركِ، ونُشر دون موافقتك." },
        ],
        links: [[{ en: "Instagram Help Center", ar: "مركز مساعدة Instagram" }, "https://help.instagram.com/"]],
      },
      {
        title: { en: "Account pretending to be you", ar: "حساب ينتحل شخصيتك" },
        steps: [
          { en: "Go to the profile → ⋯ → Report → 'Report account' → 'Pretending to be someone' → 'Me'.", ar: "افتحي الحساب ← ⋯ ← «Report» ← «Report account» ← «Pretending to be someone» ← «Me»." },
          { en: "If you can't report in the app, Instagram has an impersonation form for people without an account.", ar: "إن لم تتمكني من الإبلاغ داخل التطبيق، يوفّر Instagram نموذجًا لانتحال الشخصية لمن ليس لديهم حساب." },
        ],
        links: [[{ en: "Instagram impersonation form", ar: "نموذج انتحال الشخصية في Instagram" }, "https://help.instagram.com/contact/636276399721841"]],
      },
    ],
  },
  TikTok: {
    label: { en: "TikTok", ar: "TikTok" },
    summary: { en: "TikTok's rules do not allow synthetic media showing the likeness of a real private person. Cite this in your report.", ar: "لا تسمح قواعد TikTok بالوسائط الاصطناعية التي تُظهر ملامح شخص حقيقي غير معروف للعامة. استشهدي بذلك في بلاغك." },
    routes: [
      {
        title: { en: "AI-generated or manipulated video", ar: "فيديو مُنشأ أو معدّل بالذكاء الاصطناعي" },
        steps: [
          { en: "On the video: Share → Report.", ar: "في الفيديو: «Share» ← «Report»." },
          { en: "Choose Misinformation → Deepfakes, synthetic media, and manipulated media → Submit.", ar: "اختاري «Misinformation» ← «Deepfakes, synthetic media, and manipulated media» ← «Submit»." },
          { en: "If the video is sexual, harassing or impersonating you, you can also report it under that category.", ar: "إن كان الفيديو جنسيًا أو يتضمن تحرشًا أو انتحالًا لشخصيتك، يمكنك أيضًا الإبلاغ عنه ضمن تلك الفئة." },
        ],
        links: [[{ en: "TikTok Community Guidelines", ar: "إرشادات مجتمع TikTok" }, "https://www.tiktok.com/community-guidelines"]],
      },
    ],
  },
  "X (Twitter)": {
    label: { en: "X (Twitter)", ar: "X (Twitter)" },
    summary: { en: "Report each post individually.", ar: "أبلغي عن كل منشور على حدة." },
    routes: [
      {
        title: { en: "Report a post", ar: "الإبلاغ عن منشور" },
        steps: [
          { en: "Tap the ⋯ on the post → Report post.", ar: "اضغطي على ⋯ في المنشور ← «Report post»." },
          { en: "Follow the reporting flow and choose the closest category (e.g. sensitive or private media, abuse/harassment, impersonation).", ar: "اتبعي خطوات الإبلاغ واختاري الفئة الأقرب (مثل الوسائط الحساسة أو الخاصة، أو الإساءة/التحرش، أو انتحال الشخصية)." },
          { en: "Explain that the content is AI-generated and why that causes harm.", ar: "اذكري أن المحتوى مُنشأ بالذكاء الاصطناعي ولماذا يسبب ضررًا." },
        ],
        links: [
          [{ en: "How to report a post", ar: "طريقة الإبلاغ عن منشور" }, "https://help.x.com/en/safety-and-security/report-a-post"],
          [{ en: "X Help Center forms", ar: "نماذج مركز مساعدة X" }, "https://help.x.com/en/forms"],
        ],
      },
    ],
  },
  Snapchat: {
    label: { en: "Snapchat", ar: "Snapchat" },
    summary: { en: "Report in the app, or use Snap's safety form (works without a Snapchat account). Reports are anonymous: the person reported is not told who reported them.", ar: "أبلغي من داخل التطبيق أو عبر نموذج السلامة من Snap (يعمل دون حساب في Snapchat). البلاغات مجهولة: لا يُخبَر الشخص المُبلَّغ عنه بهوية من أبلغ." },
    routes: [
      {
        title: { en: "Report a Snap, Story or account", ar: "الإبلاغ عن سناب أو ستوري أو حساب" },
        steps: [
          { en: "In the app: press and hold the Snap/Story or open the profile → Report.", ar: "داخل التطبيق: اضغطي مطولًا على السناب أو الستوري، أو افتحي الحساب ← «Report»." },
          { en: "Or use Snap's safety reporting page and choose the type of concern (inappropriate content, privacy, impersonation).", ar: "أو استخدمي صفحة الإبلاغ عن السلامة من Snap واختاري نوع المشكلة (محتوى غير لائق، أو خصوصية، أو انتحال شخصية)." },
        ],
        links: [[{ en: "Snapchat safety reporting", ar: "الإبلاغ عن السلامة في Snapchat" }, "https://values.snap.com/safety/safety-reporting"]],
      },
    ],
  },
  Telegram: {
    label: { en: "Telegram", ar: "Telegram" },
    summary: { en: "Telegram's terms forbid sharing non-consensual intimate images, including pornographic deepfakes. Moderation is slow, so capture evidence first.", ar: "تمنع شروط Telegram مشاركة الصور الحميمة دون موافقة، بما في ذلك الصور الإباحية المزيفة. الإشراف بطيء، لذا وثّقي الأدلة أولًا." },
    routes: [
      {
        title: { en: "Report a message, channel, group or bot", ar: "الإبلاغ عن رسالة أو قناة أو مجموعة أو بوت" },
        steps: [
          { en: "Press and hold the message (or open the channel/group info) → Report → choose the reason, e.g. illegal adult content / nude images shared without consent.", ar: "اضغطي مطولًا على الرسالة (أو افتحي معلومات القناة/المجموعة) ← «Report» ← اختاري السبب، مثل محتوى إباحي غير قانوني / صور عارية تُشارك دون موافقة." },
          { en: "For illegal content you can also email abuse@telegram.org with the public link(s) (t.me/...), what the content is, and that you are the person shown.", ar: "بالنسبة للمحتوى غير القانوني، يمكنك أيضًا مراسلة abuse@telegram.org مع الروابط العامة (t.me/...)، ووصف المحتوى، وأنكِ الشخص الظاهر فيه." },
        ],
        note: { en: "The abuse@telegram.org address comes from third-party guides, not an official Telegram page.", ar: "عنوان abuse@telegram.org مأخوذ من أدلة غير رسمية، وليس من صفحة رسمية لـ Telegram." },
      },
    ],
  },
  WhatsApp: {
    label: { en: "WhatsApp", ar: "WhatsApp" },
    summary: { en: "WhatsApp can't remove content from other people's phones. Reporting can get the sender's account banned.", ar: "لا يستطيع WhatsApp حذف المحتوى من هواتف الآخرين، لكن الإبلاغ قد يؤدي إلى حظر حساب المُرسِل." },
    routes: [
      {
        title: { en: "Report and block a contact or group", ar: "الإبلاغ عن جهة اتصال أو مجموعة وحظرها" },
        steps: [
          { en: "Before reporting, take screenshots of the chat, profile and phone number.", ar: "قبل الإبلاغ، التقطي لقطات شاشة للمحادثة والحساب ورقم الهاتف." },
          { en: "Open the chat → tap the contact/group name → Report.", ar: "افتحي المحادثة ← اضغطي على اسم جهة الاتصال أو المجموعة ← «Report»." },
          { en: "When you report, WhatsApp receives the most recent messages from that chat. Then block the contact.", ar: "عند الإبلاغ، يتلقى WhatsApp أحدث الرسائل من تلك المحادثة. بعد ذلك احظري جهة الاتصال." },
        ],
      },
    ],
  },
};

export const STOPNCII = {
  what: {
    en: "StopNCII.org creates a digital fingerprint (hash) of an intimate image or video on your own device and shares only that fingerprint with participating platforms, which use it to detect and block the image. The image itself is never uploaded. Available in Arabic.",
    ar: "يُنشئ موقع StopNCII.org بصمة رقمية (hash) للصورة أو الفيديو الحميم على جهازك نفسه، ولا يشارك إلا هذه البصمة مع المنصات الشريكة التي تستخدمها لاكتشاف الصورة وحظرها. لا تُرفع الصورة نفسها أبدًا. الموقع متوفر بالعربية.",
  },
  partners: {
    en: "StopNCII's partners include the biggest social platforms: Facebook, Instagram, Threads, TikTok, Snapchat, X, Reddit, Microsoft (including Bing search) and Patreon, plus many adult sites such as Pornhub and OnlyFans. One case covers all of them.",
    ar: "من شركاء StopNCII أكبر منصات التواصل: Facebook وInstagram وThreads وTikTok وSnapchat وX وReddit وMicrosoft (بما في ذلك بحث Bing) وPatreon، إضافةً إلى كثير من مواقع البالغين مثل Pornhub وOnlyFans. بلاغ واحد يشملها جميعًا.",
  },
  not_partners: {
    en: "Google Search, YouTube, Telegram and WhatsApp are not on StopNCII's partner list. Use their own reporting routes in the platform guides.",
    ar: "بحث Google وYouTube وTelegram وWhatsApp ليست ضمن قائمة شركاء StopNCII. استخدمي طرق الإبلاغ الخاصة بها في أدلة المنصات.",
  },
  partners_source: "https://stopncii.org/partners/industry-partners",
  criteria: [
    { en: "You are the person in the image or video.", ar: "أنكِ الشخص الظاهر في الصورة أو الفيديو." },
    { en: "You were 18 or older when it was taken, and you are 18 or older now.", ar: "أنكِ كنتِ في الثامنة عشرة أو أكثر عند التقاطها، وأنكِ الآن في الثامنة عشرة أو أكثر." },
    { en: "You still have the image or video.", ar: "أن الصورة أو الفيديو ما زال لديك." },
    { en: "It shows you nude, semi-nude or in a sexual act.", ar: "أنه يُظهركِ عارية أو شبه عارية أو في فعل جنسي." },
  ],
  deepfake_note: {
    en: "If you have a copy of a fake image of you, check StopNCII's FAQ to see whether synthetic images qualify. If the person was under 18, use Take It Down (takeitdown.ncmec.org) instead.",
    ar: "إن كانت لديك نسخة من صورة مزيفة لكِ، راجعي الأسئلة الشائعة في StopNCII لمعرفة ما إذا كانت الصور الاصطناعية مشمولة. وإن كان عمر الشخص دون 18 عامًا، استخدمي Take It Down (takeitdown.ncmec.org) بدلًا منه.",
  },
  link: "https://stopncii.org/create-your-case",
};

export const SEXTORTION_CARDS = [
  [{ en: "Don't pay", ar: "لا تدفعي" }, { en: "Paying rarely stops it. Blackmailers usually come back for more.", ar: "الدفع نادرًا ما يوقف الابتزاز. عادةً ما يعود المبتزون لطلب المزيد." }],
  [{ en: "Don't delete anything yet", ar: "لا تحذفي شيئًا الآن" }, { en: "Messages, profiles and payment requests are your evidence. Capture them first.", ar: "الرسائل والحسابات وطلبات الدفع هي أدلتك. وثّقيها أولًا." }],
  [{ en: "Capture everything", ar: "وثّقي كل شيء" }, { en: "Screenshots with dates, usernames, profile links and phone numbers. Save the links too. Then build your evidence pack in Proofline.", ar: "لقطات شاشة تُظهر التواريخ وأسماء المستخدمين وروابط الحسابات وأرقام الهواتف. احفظي الروابط أيضًا، ثم أنشئي ملف أدلتك في Proofline." }],
  [{ en: "Stop replying, then block", ar: "توقفي عن الرد ثم احظري" }, { en: "Don't negotiate or argue. After capturing evidence, report and block the account.", ar: "لا تفاوضي ولا تجادلي. بعد توثيق الأدلة، أبلغي عن الحساب واحظريه." }],
  [{ en: "Secure your accounts", ar: "أمّني حساباتك" }, { en: "Change passwords, turn on two-step verification, and check which devices are signed in to your accounts.", ar: "غيّري كلمات المرور، وفعّلي التحقق بخطوتين، وتحققي من الأجهزة المسجّل دخولها إلى حساباتك." }],
  [{ en: "Tell someone you trust", ar: "أخبري شخصًا تثقين به" }, { en: "You don't have to handle this alone. The support services under Get help can help.", ar: "لستِ مضطرة لمواجهة هذا وحدك. يمكن لخدمات الدعم في صفحة «طلب المساعدة» أن تساعدك." }],
  [{ en: "Report it", ar: "أبلغي" }, { en: "Report to the platform and, if you feel safe doing so, to the cybercrime police in your country.", ar: "أبلغي المنصة، وإن شعرتِ بالأمان، أبلغي شرطة الجرائم الإلكترونية في بلدك." }],
];

// ---------------------------------------------------------------------------
// Report-builder targets. Field kinds: "text", "textarea", "urls"
// ---------------------------------------------------------------------------
const F = {
  content_urls: (en, ar) => ({ key: "content_urls", kind: "urls", label: { en, ar }, help: { en: "One per line.", ar: "رابط في كل سطر." } }),
  what_it_shows: (en, ar) => ({ key: "what_it_shows", kind: "textarea", label: { en, ar }, help: { en: "Describe it without repeating anything sexually explicit.", ar: "صِفيه دون تكرار أي تفاصيل جنسية صريحة." } }),
  why_fake: { key: "why_fake", kind: "textarea", label: { en: "Why it is fake or manipulated", ar: "لماذا هو مزيف أو معدّل" }, help: { en: "Stick to facts you know.", ar: "التزمي بالحقائق التي تعرفينها." } },
  harm: { key: "harm", kind: "textarea", label: { en: "Harm it is causing", ar: "الضرر الذي يسببه" }, help: { en: "e.g. threats, messages from people who saw it, risk to your safety.", ar: "مثل التهديدات، أو رسائل من أشخاص شاهدوه، أو خطر على سلامتك." } },
};

export const REPORT_TARGETS = {
  google_fake_explicit: {
    name: { en: "Google Search – fake sexual imagery (deepfake)", ar: "بحث Google – صور جنسية مزيفة (تزييف عميق)" },
    url: "https://support.google.com/websearch/answer/9116649",
    category: { en: "Option: a fake nude or sexually explicit picture or video of yourself.", ar: "الخيار: صورة أو فيديو مزيف عارٍ أو جنسي صريح لكِ (A fake nude or sexually explicit picture or video of myself)." },
    policy: { en: "Google removes fake sexually explicit imagery from Search when the person is identifiable, the imagery is fake and sexually explicit, and it was distributed without consent.", ar: "تزيل Google من نتائج البحث الصور الجنسية المزيفة غير التوافقية عندما يمكن التعرّف على الشخص، وتكون الصور مزيفة وجنسية صريحة، ونُشرت دون موافقته." },
    fields: [
      F.content_urls("URLs of the web pages showing the content", "روابط صفحات الويب التي تعرض المحتوى"),
      { key: "search_urls", kind: "urls", label: { en: "URLs of the Google Search results pages where it appears (optional)", ar: "روابط صفحات نتائج بحث Google التي يظهر فيها (اختياري)" }, help: { en: "Search your name, copy the results page URL.", ar: "ابحثي عن اسمك وانسخي رابط صفحة النتائج." } },
      { key: "search_terms", kind: "text", label: { en: "Search terms that bring up the content (optional)", ar: "كلمات البحث التي تُظهر المحتوى (اختياري)" }, help: { en: "e.g. your name + a word used with the content.", ar: "مثل اسمك مع كلمة مرتبطة بالمحتوى." } },
      { key: "identify", kind: "textarea", label: { en: "How you are identifiable in the content", ar: "كيف يمكن التعرّف عليكِ في المحتوى" }, head: { en: "How I am identifiable in the content", ar: "كيف يمكن التعرّف عليّ في المحتوى" }, help: { en: "e.g. your face, your name in the caption, your tagged account.", ar: "مثل وجهك، أو اسمك في التعليق، أو حسابك المُشار إليه." } },
      { key: "why_fake", kind: "textarea", label: { en: "Why you know it is fake", ar: "كيف تعرفين أنه مزيف" }, head: { en: "How I know it is fake", ar: "كيف أعرف أنه مزيف" }, help: { en: "Stick to facts you know, e.g. 'I never took or sent such an image'.", ar: "التزمي بالحقائق التي تعرفينها، مثل: «لم ألتقط أو أرسل صورة كهذه أبدًا»." } },
      { key: "consent", kind: "textarea", label: { en: "Statement on consent", ar: "إقرار بشأن الموافقة" }, help: { en: "e.g. 'I did not consent to the creation or distribution of this content.'", ar: "مثل: «لم أوافق على إنشاء هذا المحتوى أو نشره.»" } },
    ],
    limit: null,
  },
  google_rtbf: {
    name: { en: "Google – legal removal ('Right to be Forgotten')", ar: "Google – الإزالة القانونية («الحق في النسيان»)" },
    url: "https://reportcontent.google.com/forms/rtbf",
    category: { en: "Only if your country is listed in the form's 'Where do you live?' dropdown.", ar: "فقط إذا كانت دولتك مدرجة في قائمة «Where do you live?» في النموذج." },
    policy: { en: "Removal of Search results linked to your name under applicable privacy law.", ar: "إزالة نتائج البحث المرتبطة باسمك وفق قوانين الخصوصية المعمول بها." },
    fields: [
      { key: "name_type", kind: "text", label: { en: "Type of name associated with the content", ar: "نوع الاسم المرتبط بالمحتوى" }, help: { en: "e.g. full legal name.", ar: "مثل الاسم القانوني الكامل." } },
      F.content_urls("URLs of the content to remove", "روابط المحتوى المطلوب إزالته"),
      { key: "explanation", kind: "textarea", label: { en: "Why the content should be removed (key facts)", ar: "لماذا يجب إزالة المحتوى (الحقائق الأساسية)" }, help: { en: "Google's field allows up to 1,000 characters.", ar: "يسمح حقل Google بحد أقصى 1000 حرف." } },
    ],
    limit: 1000,
  },
  youtube_ai: {
    name: { en: "YouTube – privacy complaint for AI-generated/altered content", ar: "YouTube – شكوى خصوصية بشأن محتوى مُنشأ أو معدّل بالذكاء الاصطناعي" },
    url: "https://support.google.com/youtube/answer/142443",
    category: { en: "Report altered or synthetic content.", ar: "الإبلاغ عن محتوى معدّل أو اصطناعي (Report altered or synthetic content)." },
    policy: { en: "YouTube may remove content that shows a realistic altered or synthetic version of a person's likeness when that person is uniquely identifiable.", ar: "قد يزيل YouTube المحتوى الذي يُظهر نسخة واقعية معدّلة أو اصطناعية من ملامح شخص عندما يمكن التعرّف عليه بشكل خاص." },
    fields: [
      F.content_urls("Video, channel or comment URLs", "روابط الفيديو أو القناة أو التعليق"),
      { key: "how_altered", kind: "textarea", label: { en: "How your appearance or actions were altered or generated by AI", ar: "كيف عُدّل مظهرك أو أفعالك أو أُنشئت بالذكاء الاصطناعي" }, head: { en: "How my appearance or actions were altered or generated by AI", ar: "كيف عُدّل مظهري أو أفعالي أو أُنشئت بالذكاء الاصطناعي" }, help: { en: "e.g. 'My face was placed on another person's body'.", ar: "مثل: «وُضع وجهي على جسد شخص آخر»." } },
      { key: "describe_self", kind: "textarea", label: { en: "How to recognise you in the content", ar: "كيف يمكن التعرّف عليكِ في المحتوى" }, head: { en: "How to recognise me in the content", ar: "كيف يمكن التعرّف عليّ في المحتوى" }, help: { en: "Describe how you appear, e.g. clothing, timestamp in the video (e.g. 0:45–1:10). Required by YouTube.", ar: "صِفي كيف تظهرين، مثل الملابس أو التوقيت في الفيديو (مثل 0:45–1:10). يطلبه YouTube." } },
      { key: "timestamps", kind: "text", label: { en: "Timestamps where you appear (optional)", ar: "أوقات ظهورك في الفيديو (اختياري)" }, head: { en: "Timestamps where I appear", ar: "أوقات ظهوري في الفيديو" }, help: { en: "e.g. 0:12–0:40", ar: "مثل 0:12–0:40" } },
    ],
    limit: null,
  },
  meta: {
    name: { en: "Facebook / Instagram – in-app report details", ar: "Facebook / Instagram – تفاصيل البلاغ داخل التطبيق" },
    url: "https://www.facebook.com/help/",
    category: { en: "Nudity / private images, harassment, or impersonation – whichever fits best.", ar: "العُري / الصور الخاصة، أو التحرش، أو انتحال الشخصية – أيّها أنسب." },
    policy: { en: "Meta prohibits sharing intimate images without consent and accounts that impersonate others.", ar: "تحظر Meta مشاركة الصور الحميمة دون موافقة، والحسابات التي تنتحل شخصيات الآخرين." },
    fields: [F.content_urls("Links to the posts, reels or profiles", "روابط المنشورات أو الريلز أو الحسابات"), F.what_it_shows("What the content shows or claims", "ما يُظهره المحتوى أو يدّعيه"), F.why_fake, F.harm],
    limit: null,
  },
  tiktok: {
    name: { en: "TikTok – report details", ar: "TikTok – تفاصيل البلاغ" },
    url: "https://www.tiktok.com/community-guidelines",
    category: { en: "Misinformation → Deepfakes, synthetic media, and manipulated media (or a sexual/harassment category if more fitting).", ar: "«Misinformation» ← «Deepfakes, synthetic media, and manipulated media» (أو فئة المحتوى الجنسي/التحرش إن كانت أنسب)." },
    policy: { en: "TikTok does not allow synthetic media that contains the likeness of a real private person.", ar: "لا يسمح TikTok بالوسائط الاصطناعية التي تتضمن ملامح شخص حقيقي غير معروف للعامة." },
    fields: [F.content_urls("Video or account links", "روابط الفيديو أو الحساب"), F.what_it_shows("What the video shows or claims", "ما يُظهره الفيديو أو يدّعيه"), F.why_fake, F.harm],
    limit: null,
  },
  x: {
    name: { en: "X (Twitter) – report details", ar: "X (Twitter) – تفاصيل البلاغ" },
    url: "https://help.x.com/en/safety-and-security/report-a-post",
    category: { en: "Sensitive or private media, abuse/harassment, or impersonation.", ar: "وسائط حساسة أو خاصة، أو إساءة/تحرش، أو انتحال شخصية." },
    policy: { en: "X prohibits posting intimate media of someone without consent, and impersonation.", ar: "يحظر X نشر وسائط حميمة لشخص دون موافقته، وانتحال الشخصية." },
    fields: [F.content_urls("Post or account links", "روابط المنشور أو الحساب"), F.what_it_shows("What the post shows or claims", "ما يُظهره المنشور أو يدّعيه"), F.why_fake, F.harm],
    limit: null,
  },
  telegram: {
    name: { en: "Telegram – email to abuse team", ar: "Telegram – رسالة إلى فريق مكافحة الإساءة" },
    url: "mailto:abuse@telegram.org",
    category: { en: "Illegal adult content: intimate images (including deepfakes) shared without consent.", ar: "محتوى إباحي غير قانوني: صور حميمة (بما فيها المزيفة) تُشارك دون موافقة." },
    policy: { en: "Telegram's terms forbid sharing non-consensual intimate images, including pornographic deepfakes.", ar: "تمنع شروط Telegram مشاركة الصور الحميمة دون موافقة، بما في ذلك الصور الإباحية المزيفة." },
    fields: [
      F.content_urls("Public links (t.me/...) to the channel, group or messages", "الروابط العامة (t.me/...) للقناة أو المجموعة أو الرسائل"),
      F.what_it_shows("What is being shared", "ما الذي تتم مشاركته"),
      { key: "why_fake", kind: "textarea", label: { en: "Why it is fake or non-consensual", ar: "لماذا هو مزيف أو دون موافقة" }, help: { en: "Stick to facts you know.", ar: "التزمي بالحقائق التي تعرفينها." } },
      F.harm,
    ],
    limit: null,
  },
  police: {
    name: { en: "Police cybercrime report – written statement", ar: "بلاغ للشرطة (الجرائم الإلكترونية) – إفادة مكتوبة" },
    url: null,
    category: { en: "Use the police reporting channel for your country (see Get help).", ar: "استخدمي قناة الإبلاغ لدى الشرطة في بلدك (انظري «طلب المساعدة»)." },
    policy: { en: "A clear, factual, chronological statement to accompany your evidence pack.", ar: "إفادة واضحة ومتسلسلة زمنيًا تستند إلى الحقائق، ترافق ملف أدلتك." },
    fields: [
      { key: "what_happened", kind: "textarea", label: { en: "What happened, in order", ar: "ما الذي حدث، بالترتيب" }, help: { en: "Start from the first contact or first time you saw the content.", ar: "ابدئي من أول تواصل أو أول مرة رأيتِ فيها المحتوى." } },
      { key: "suspect", kind: "textarea", label: { en: "Who you believe is responsible and why (optional)", ar: "من تعتقدين أنه المسؤول ولماذا (اختياري)" }, head: { en: "Who I believe is responsible and why", ar: "من أعتقد أنه المسؤول ولماذا" }, help: { en: "Usernames, phone numbers, emails, how you know them.", ar: "أسماء المستخدمين، أرقام الهواتف، البريد الإلكتروني، وكيف تعرفينهم." } },
      { key: "demands", kind: "textarea", label: { en: "Threats or demands made (optional)", ar: "التهديدات أو المطالب (اختياري)" }, help: { en: "Exactly what was demanded, when, and how.", ar: "ما الذي طُلب بالضبط، ومتى، وكيف." } },
      F.content_urls("Links where the content appears", "الروابط التي يظهر فيها المحتوى"),
      { key: "evidence", kind: "textarea", label: { en: "Evidence you are attaching", ar: "الأدلة المرفقة" }, head: { en: "Evidence I am attaching", ar: "الأدلة التي أرفقها" }, help: { en: "e.g. 'Proofline evidence pack with 6 files and SHA-256 fingerprints'.", ar: "مثل: «ملف أدلة Proofline يضم 6 ملفات مع بصمات SHA-256»." } },
      { key: "wanted", kind: "textarea", label: { en: "What you are asking for", ar: "ما الذي تطلبينه" }, head: { en: "What I am asking for", ar: "ما أطلبه" }, help: { en: "e.g. investigation, identification of the account holder, removal of the content.", ar: "مثل التحقيق، أو تحديد هوية صاحب الحساب، أو إزالة المحتوى." } },
    ],
    limit: null,
  },
};
