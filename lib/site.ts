export const site = {
  name: "Mazaly.Digital",
  whatsapp: "972500000000",
  email: "hello@mazaly.digital",
  city: "תל אביב, ישראל"
};

export const whatsappLink = (message?: string) => {
  const base = `https://wa.me/${site.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
};

export const navLinks = [
  { href: "#services", label: "שירותים" },
  { href: "#process", label: "תהליך" },
  { href: "#projects", label: "פרויקטים" },
  { href: "#francais", label: "Français" }
];

export const counters = [
  { value: 14, suffix: "", label: "זמן פיתוח ממוצע", unit: "ימים" },
  { value: 100, suffix: "%", label: "פרויקטים בזמן", unit: "" },
  { value: 3, suffix: "", label: "עברית · צרפתית · אנגלית", unit: "שפות" },
  { value: 5, suffix: "★", label: "דירוג לקוחות", unit: "" }
];

export const services = [
  {
    icon: "🖥️",
    title: "אתר ויטרינה",
    price: "₪3,500–6,000",
    desc: "אתר תדמית מהיר ומרשים, מותאם לנייד, SEO ועיצוב בהתאמה אישית."
  },
  {
    icon: "🛠️",
    title: "אתר + פאנל ניהול",
    price: "₪8,000–15,000",
    desc: "אתר דינמי עם מערכת ניהול תוכן, משתמשים ודאשבורד מותאם."
  },
  {
    icon: "💳",
    title: "פלטפורמה + תשלומים",
    price: "₪15,000–35,000",
    desc: "מערכת מלאה עם סליקה מקומית — Grow / PayPlus / Bit ואוטומציות."
  },
  {
    icon: "🔧",
    title: "תחזוקה חודשית",
    price: "₪500–1,500/חודש",
    desc: "עדכונים, גיבויים, ניטור ואבטחה — שקט נפשי חודש אחר חודש."
  }
];

export const processSteps = [
  {
    step: "01",
    title: "פגישת היכרות",
    desc: "מבינים את הצרכים, היעדים והקהל שלכם — בלי התחייבות."
  },
  {
    step: "02",
    title: "הצעה תוך 24 שעות",
    desc: "מקבלים הצעת מחיר ברורה עם לוחות זמנים ואבני דרך."
  },
  {
    step: "03",
    title: "פיתוח ועדכונים",
    desc: "בונים את המוצר עם עדכונים שוטפים ושקיפות מלאה."
  },
  {
    step: "04",
    title: "השקה ותמיכה",
    desc: "עולים לאוויר ומלווים אתכם גם אחרי ההשקה."
  }
];

export const projects = [
  {
    title: "פלטפורמת השכרה עם ניהול מלאי",
    desc: "מערכת הזמנות וניהול מלאי בזמן אמת עם סליקה ואוטומציות.",
    tags: ["Next.js", "Supabase", "Grow", "Make.com"]
  },
  {
    title: "פלטפורמת ניהול אירועי חיים",
    desc: "ניהול אירועים, אורחים והזמנות עם ממשק דו-לשוני מלא.",
    tags: ["Next.js", "Supabase Auth", "RTL", "Resend"]
  },
  {
    title: "פלטפורמת ניהול ליגות ספורט",
    desc: "ניהול ליגות, משחקים וטבלאות עם אפליקציה מותקנת לנייד.",
    tags: ["React", "Supabase", "PWA", "Vite"]
  }
];

export const notifications = [
  { text: "תשלום התקבל ₪8,500", tone: "money" },
  { text: "לקוח חדש 🤝", tone: "client" },
  { text: "פרויקט הושלם 🎉", tone: "done" },
  { text: "הצעת מחיר נשלחה ✅", tone: "client" },
  { text: "אתר עלה לאוויר 🚀", tone: "done" }
];

export const frenchPoints = [
  "Un interlocuteur francophone du début à la fin",
  "Paiements locaux intégrés : Grow, PayPlus, Bit",
  "Sites bilingues et RTL parfaitement maîtrisés",
  "Des tarifs compétitifs et transparents",
  "Un accompagnement après le lancement"
];
