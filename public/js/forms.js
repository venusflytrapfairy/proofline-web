// The four common forms of technology-facilitated violence against women and girls,
// and how AI makes each one worse. Framework and figures: UN Women (December 2025),
// "How AI is exacerbating technology-facilitated violence against women and girls".
// Figures marked "51 countries" come from the study cited in that paper.

import { L } from "./i18n.js";

export const UN_SOURCE = {
  title: { en: "How AI is exacerbating technology-facilitated violence against women and girls", ar: "كيف يفاقم الذكاء الاصطناعي العنف الميسَّر بالتكنولوجيا ضد النساء والفتيات" },
  date: { en: "December 2025", ar: "ديسمبر 2025" },
  url: "https://www.unwomen.org/en/digital-library/publications/2025/12/how-ai-is-exacerbating-technology-facilitated-violence-against-women-and-girls",
};

export const FORMS = [
  {
    id: "image",
    title: { en: "Deepfakes and image-based abuse", ar: "التزييف العميق والإساءة بالصور" },
    short: { en: "Fake or private images and videos of you", ar: "صور أو فيديوهات مزيفة أو خاصة لكِ" },
    looks: [
      { en: "Nude or sexual images or videos of you made with AI ('deepfakes' or 'nudify' apps)", ar: "صور أو فيديوهات عارية أو جنسية لكِ مصنوعة بالذكاء الاصطناعي (التزييف العميق أو تطبيقات «التعرية»)" },
      { en: "Private images or videos shared to hurt or shame you", ar: "صور أو فيديوهات خاصة تُنشر لإيذائك أو التشهير بكِ" },
      { en: "Fake sexual content used to discredit you at work, in public life or in your family", ar: "محتوى جنسي مزيف يُستخدم لتشويه سمعتك في العمل أو الحياة العامة أو داخل عائلتك" },
    ],
    ai: [
      { en: "Free tools now make a convincing fake in minutes, with no skill needed.", ar: "الأدوات المجانية تصنع اليوم صورة مزيفة مقنعة في دقائق، دون أي مهارة." },
      { en: "98% of deepfake videos online are pornographic, and 99% of that content features women.", ar: "98% من فيديوهات التزييف العميق على الإنترنت إباحية، و99% من هذا المحتوى يستهدف نساءً." },
      { en: "Once shared, copies spread to many places, which is why removal needs fingerprint-matching tools like StopNCII.", ar: "بمجرد نشره تنتشر نسخ منه في أماكن كثيرة، ولهذا تحتاج الإزالة إلى أدوات مطابقة البصمات مثل StopNCII." },
    ],
    stat: { en: "57% of women in a 51-country study had experienced or witnessed image- or video-based abuse.", ar: "57% من النساء في دراسة شملت 51 دولة شهدن أو تعرّضن للإساءة بالصور أو الفيديو." },
    guides: ["Google Search", "Instagram", "Facebook", "TikTok", "X (Twitter)", "Telegram", "YouTube"],
    targets: ["google_fake_explicit", "meta", "tiktok", "x", "telegram", "youtube_ai", "police"],
    showStopNCII: true,
  },
  {
    id: "impersonation",
    title: { en: "Impersonation, scams and sextortion", ar: "انتحال الشخصية والاحتيال والابتزاز الجنسي" },
    short: { en: "Someone pretending to be you, or blackmailing you", ar: "شخص ينتحل شخصيتك أو يبتزك" },
    looks: [
      { en: "A fake account using your name, photos or a cloned voice", ar: "حساب مزيف يستخدم اسمك أو صورك أو صوتًا مستنسخًا منك" },
      { en: "Someone breaking into your accounts or tracking your messages or location", ar: "شخص يخترق حساباتك أو يتتبع رسائلك أو موقعك" },
      { en: "Threats to share sexual images, real or fake, unless you pay or obey", ar: "تهديدات بنشر صور جنسية، حقيقية أو مزيفة، ما لم تدفعي أو تطيعي" },
    ],
    ai: [
      { en: "Cloned faces and voices make fake accounts and calls much more convincing.", ar: "الوجوه والأصوات المستنسخة تجعل الحسابات والمكالمات المزيفة أكثر إقناعًا بكثير." },
      { en: "AI chatbots can run fake profiles on dating and social apps at scale, luring women into sharing private details or meeting.", ar: "يمكن لروبوتات الدردشة بالذكاء الاصطناعي إدارة حسابات مزيفة على تطبيقات المواعدة والتواصل على نطاق واسع، لاستدراج النساء إلى مشاركة معلومات خاصة أو إلى اللقاء." },
      { en: "AI can link scattered scraps of information into a full profile, even if you have tried to stay anonymous.", ar: "يستطيع الذكاء الاصطناعي ربط معلومات متفرقة لبناء ملف كامل عنكِ، حتى لو حاولتِ البقاء مجهولة." },
    ],
    stat: { en: "63% of women in a 51-country study had experienced or witnessed impersonation, hacking or stalking.", ar: "63% من النساء في دراسة شملت 51 دولة شهدن أو تعرّضن لانتحال الشخصية أو الاختراق أو الملاحقة." },
    guides: ["Instagram", "Facebook", "Snapchat", "WhatsApp", "TikTok", "X (Twitter)"],
    targets: ["meta", "tiktok", "x", "police"],
    showSextortion: true,
    showSecurity: true,
  },
  {
    id: "disinfo",
    title: { en: "Lies, harassment and hate", ar: "الأكاذيب والتحرش وخطاب الكراهية" },
    short: { en: "False stories, pile-ons and hateful attacks", ar: "قصص كاذبة وهجمات جماعية وإساءات قائمة على الكراهية" },
    looks: [
      { en: "Rumours or invented stories meant to damage your reputation", ar: "شائعات أو قصص مختلقة تهدف إلى الإضرار بسمعتك" },
      { en: "Repeated messages, comments or images meant to frighten you", ar: "رسائل أو تعليقات أو صور متكررة تهدف إلى إخافتك" },
      { en: "Sexist or hateful attacks meant to humiliate you", ar: "هجمات متحيزة ضد المرأة أو قائمة على الكراهية تهدف إلى إذلالك" },
    ],
    ai: [
      { en: "Bots can post far more, far faster than human trolls, so attacks feel endless.", ar: "تستطيع الروبوتات النشر بكميات وسرعة تفوق المتصيدين من البشر، فتبدو الهجمات بلا نهاية." },
      { en: "AI-made content blurs what is real, making false stories about you easier to believe.", ar: "المحتوى المصنوع بالذكاء الاصطناعي يطمس الحد بين الحقيقي والمزيف، فيسهل تصديق القصص الكاذبة عنكِ." },
      { en: "Recommendation systems push misogynistic content to the people most likely to engage with it.", ar: "أنظمة التوصية تدفع المحتوى المعادي للنساء إلى من يُرجّح تفاعلهم معه." },
    ],
    stat: { en: "Over 65% of women in a 51-country study had experienced or witnessed disinformation, harassment or hate online.", ar: "أكثر من 65% من النساء في دراسة شملت 51 دولة شهدن أو تعرّضن للتضليل أو التحرش أو الكراهية عبر الإنترنت." },
    guides: ["X (Twitter)", "Facebook", "Instagram", "TikTok", "YouTube", "Google Search"],
    targets: ["x", "meta", "tiktok", "youtube_ai", "police"],
  },
  {
    id: "doxing",
    title: { en: "Doxing and threats", ar: "كشف المعلومات الشخصية والتهديد" },
    short: { en: "Your personal details exposed, or threats of violence", ar: "نشر بياناتك الشخصية أو تهديدك بالعنف" },
    looks: [
      { en: "Your home address, workplace, phone number or family details posted online", ar: "نشر عنوان منزلك أو مكان عملك أو رقم هاتفك أو تفاصيل عن عائلتك على الإنترنت" },
      { en: "Threats of physical or sexual violence sent through apps or posted publicly", ar: "تهديدات بالعنف الجسدي أو الجنسي تصلك عبر التطبيقات أو تُنشر علنًا" },
    ],
    ai: [
      { en: "AI can scrape huge amounts of personal data quickly to find where you live or work.", ar: "يستطيع الذكاء الاصطناعي جمع كميات هائلة من البيانات الشخصية بسرعة لمعرفة مكان سكنك أو عملك." },
      { en: "AI tools can pick out posts where you speak up, making you a target.", ar: "تستطيع أدوات الذكاء الاصطناعي تحديد المنشورات التي تتحدثين فيها بصراحة، فتجعلك هدفًا." },
      { en: "Some threats are written by AI using your own words and details, to make them more frightening.", ar: "بعض التهديدات تكتبها أدوات الذكاء الاصطناعي باستخدام كلماتك وتفاصيلك، لتكون أكثر ترويعًا." },
    ],
    stat: { en: "Over half of women in a 51-country study had experienced or witnessed threats or doxing.", ar: "أكثر من نصف النساء في دراسة شملت 51 دولة شهدن أو تعرّضن للتهديد أو كشف المعلومات الشخصية." },
    guides: ["Google Search", "X (Twitter)", "Facebook", "Instagram", "Telegram"],
    targets: ["police", "x", "meta"],
    urgent: true,
    showSecurity: true,
  },
];

export const SECURITY_STEPS = [
  [{ en: "Use a device you trust", ar: "استخدمي جهازًا تثقين به" }, { en: "If someone may have access to your phone or laptop, make changes from a different device.", ar: "إن كان شخص ما قد يصل إلى هاتفك أو حاسوبك، أجري التغييرات من جهاز آخر." }],
  [{ en: "Change your passwords", ar: "غيّري كلمات المرور" }, { en: "Start with your email, then social media. Use a different password for each.", ar: "ابدئي بالبريد الإلكتروني ثم حسابات التواصل، واستخدمي كلمة مرور مختلفة لكل حساب." }],
  [{ en: "Turn on two-step verification", ar: "فعّلي التحقق بخطوتين" }, { en: "In each app's security settings. Prefer an authenticator app to text messages.", ar: "من إعدادات الأمان في كل تطبيق. ويُفضَّل استخدام تطبيق مصادقة بدلًا من الرسائل النصية." }],
  [{ en: "Check where you're signed in", ar: "تحققي من الأجهزة المسجّل دخولها" }, { en: "Look at 'devices' or 'active sessions' in each account and sign out anything you don't recognise.", ar: "راجعي «الأجهزة» أو «الجلسات النشطة» في كل حساب، وسجّلي الخروج من أي جهاز لا تعرفينه." }],
  [{ en: "Check location sharing", ar: "تحققي من مشاركة الموقع" }, { en: "Review live location in WhatsApp, Snap Map, Google Maps and Find My, and anything paired with your phone.", ar: "راجعي الموقع المباشر في WhatsApp وSnap Map وخرائط Google وتطبيق Find My، وأي شيء مقترن بهاتفك." }],
  [{ en: "Check email rules", ar: "تحققي من قواعد البريد" }, { en: "Look for forwarding rules or filters you didn't create. They can quietly copy your messages to someone else.", ar: "ابحثي عن قواعد إعادة توجيه أو فلاتر لم تُنشئيها، فقد تنسخ رسائلك إلى شخص آخر دون علمك." }],
  [{ en: "Warn people close to you", ar: "نبّهي المقرّبين منكِ" }, { en: "Tell family and friends someone may impersonate you, including with a cloned voice. Agree a code word for urgent requests for money or help.", ar: "أخبري عائلتك وأصدقاءك أن شخصًا قد ينتحل شخصيتك، حتى بصوت مستنسخ. واتفقي معهم على كلمة سر لأي طلب عاجل للمال أو المساعدة." }],
];

// Personal account questions. The open question always comes first.
export const ACCOUNT_OPEN = {
  key: "what_happened",
  q: { en: "In your own words, what happened?", ar: "بكلماتك الخاصة، ماذا حدث؟" },
  hint: { en: "Take your time. Start wherever feels right. You don't need to follow any order.", ar: "خذي وقتك، وابدئي من حيث تشائين. لا داعي لاتباع أي ترتيب." },
};

export const ACCOUNT_SPECIFIC = [
  { key: "what_content", q: { en: "What kind of content or behaviour is involved?", ar: "ما نوع المحتوى أو السلوك الذي حدث؟" }, hint: { en: "For example a fake image or video of you, a cloned voice, a fake account, messages, threats.", ar: "مثل صورة أو فيديو مزيف لكِ، أو صوت مستنسخ، أو حساب مزيف، أو رسائل، أو تهديدات." } },
  { key: "ai_signs", q: { en: "If you think AI was used, what makes you think so?", ar: "إن كنتِ تعتقدين أن الذكاء الاصطناعي استُخدم، فما الذي يجعلك تعتقدين ذلك؟" }, hint: { en: "For example a photo of you that you never took, your voice saying things you never said, replies that read like a bot.", ar: "مثل صورة لكِ لم تلتقطيها أبدًا، أو صوتك يقول أشياء لم تقوليها، أو ردود تبدو وكأنها من روبوت." } },
  { key: "when", q: { en: "When did you first see it or find out about it?", ar: "متى رأيتِه أو علمتِ به لأول مرة؟" }, hint: { en: "A date, a rough time, or something like 'the week after Eid' is fine.", ar: "يكفي تاريخ أو وقت تقريبي، أو شيء مثل «الأسبوع الذي تلا العيد»." } },
  { key: "where", q: { en: "Where did it appear or arrive?", ar: "أين ظهر أو وصلك؟" }, hint: { en: "Apps, websites, groups, chats, email.", ar: "التطبيقات أو المواقع أو المجموعات أو المحادثات أو البريد الإلكتروني." } },
  { key: "who", q: { en: "Who do you think is responsible, and what makes you think so?", ar: "من تعتقدين أنه المسؤول، وما الذي يجعلك تعتقدين ذلك؟" }, hint: { en: "Usernames, numbers, emails, how you know them. Only what you actually know or noticed.", ar: "أسماء المستخدمين أو الأرقام أو البريد الإلكتروني، وكيف تعرفينهم. فقط ما تعرفينه أو لاحظتِه فعلًا." } },
  { key: "demands", q: { en: "Has anyone demanded anything from you? What exactly, and when?", ar: "هل طلب منكِ أحد شيئًا؟ ماذا بالضبط، ومتى؟" }, hint: { en: "Money, more images, contact, silence.", ar: "مال، أو مزيد من الصور، أو التواصل، أو الصمت." } },
  { key: "witnesses", q: { en: "Has anyone else seen it, or does anyone else know about it?", ar: "هل رآه أحد غيرك، أو هل يعلم به أحد آخر؟" }, hint: null },
  { key: "other_evidence", q: { en: "What other evidence exists that you haven't added?", ar: "ما الأدلة الأخرى الموجودة التي لم تضيفيها؟" }, hint: { en: "Payment records, emails, call logs, people who received the content.", ar: "سجلات دفع، أو رسائل بريد، أو سجلات مكالمات، أو أشخاص وصلهم المحتوى." } },
  { key: "anything_else", q: { en: "Is there anything else you think is important?", ar: "هل هناك أي شيء آخر تعتقدين أنه مهم؟" }, hint: null },
];

export const ALL_QUESTIONS = [ACCOUNT_OPEN, ...ACCOUNT_SPECIFIC];

export function questionText(key, lang) {
  const q = ALL_QUESTIONS.find((x) => x.key === key);
  return q ? L(q.q, lang) : key;
}

export const GROUND_RULES = [
  { en: "Write only what you remember yourself.", ar: "اكتبي فقط ما تتذكرينه بنفسك." },
  { en: "“I don't know” or “I don't remember” is always an acceptable answer.", ar: "عبارة «لا أعرف» أو «لا أتذكر» إجابة مقبولة دائمًا." },
  { en: "Don't guess. Leave a question empty if you prefer not to answer it.", ar: "لا تخمّني. اتركي السؤال فارغًا إن كنتِ تفضلين عدم الإجابة." },
  { en: "You can add corrections later. Your first account stays unchanged and corrections are logged with the time.", ar: "يمكنك إضافة تصحيحات لاحقًا. تبقى روايتك الأولى كما هي، وتُسجَّل التصحيحات مع وقتها." },
];
