import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 בודק ומעדכן קטגוריות ותת-קטגוריות...');

  const dataToSeed = [
    {
      category: 'פיתוח תוכנה וקוד',
      subCategories: [
        'JavaScript הבסיס', 
        'React ופיתוח פרונטאנד', 
        'Node.js ושרתים', 
        'Python למתחילים', 
        'TypeScript למתקדמים',
        'פיתוח אפליקציות עם React Native',
        'Docker וארכיטקטורת Microservices',
        'גיט וניהול גרסאות (Git & GitHub)',
        'מבני נתונים ואלגוריתמים'
      ]
    },
    {
      category: 'אנגלית ומקצועות שפה',
      subCategories: [
        'דקדוק וזמנים (Grammar)', 
        'אוצר מילים יומיומי', 
        'אנגלית עסקית',
        'כתיבה אקדמית וחיבורים',
        'הכנה למבחני אמיר"ם ו-TOEFL',
        'דיבור חופשי וביטחון עצמי'
      ]
    },
    {
      category: 'מתמטיקה ומדעים מדויקים',
      subCategories: [
        'אלגברה ליניארית', 
        'חשבון דיפרנציאלי ואינטגרלי (חדו"א)', 
        'הסתברות וסטטיסטיקה למדעים',
        'פיזיקה - מכניקה',
        'פיזיקה - חשמל ומגנטיות',
        'כימיה כללית ואורגנית'
      ]
    },
    {
      category: 'בינה מלאכותית ומדע הנתונים',
      subCategories: [
        'הנדסת פרומפטים (Prompt Engineering)',
        'מבוא ללמידת מכונה (Machine Learning)',
        'למידה עמוקה (Deep Learning & Neural Networks)',
        'ניתוח נתונים עם Pandas ו-NumPy',
        'עבודה עם ספריות בינה מלאכותית (OpenAI, HuggingFace)'
      ]
    },
    {
      category: 'עיצוב, מוצר ואיפיון',
      subCategories: [
        'יסודות עיצוב ממשק וחווית משתמש (UI/UX)',
        'עבודה מקצועית עם Figma',
        'אפיון מוצר וניהול מוצר (Product Management)',
        'עיצוב גרפי ומיתוג דיגיטלי',
        'עריכת וידאו ואפקטים (Premiere & After Effects)'
      ]
    },
    {
      // התאמה מדויקת לשם שקיים אצלך בדאטהבייס כדי למנוע כפילויות!
      category: 'שיווק ודיגיטל',
      subCategories: [
        'קמפיינים ממומנים בפייסבוק ואינסטגרם (Meta Ads)',
        'פרסום בגוגל ורשת החיפוש (Google Ads)',
        'קידום אתרים אורגני (SEO)',
        'שיווק באמצעות תוכן וקופירייטינג',
        'ניהול רשתות חברתיות וטיקטוק (SMM)',
        'יזמות עסקית והקמת סטארטאפ',
        'ניהול פיננסי אישי והשקעות',
        'ניהול פרויקטים ומתודולוגיית Agile/Scrum'
      ]
    },
    {
      category: 'סייבר ואבטחת מידע',
      subCategories: [
        'מבוא לרשתות תקשורת (Networking)',
        'אבטחת אפליקציות אינטרנט (Web Hacking & OWASP)',
        'מערכות הפעלה וניהול Linux',
        'קריפטוגרפיה והצפנת נתונים',
        'בדיקות חדירות (Penetration Testing)'
      ]
    }
  ];

  for (const item of dataToSeed) {
    // חיפוש הקטגוריה הקיימת
    let category = await prisma.category.findFirst({
      where: { name: item.category }
    });

    if (!category) {
      category = await prisma.category.create({
        data: { name: item.category }
      });
      console.log(`📦 קטגוריה חדשה נוצרה: ${category.name}`);
    } else {
      console.log(`ℹ️ הקטגוריה "${category.name}" נמצאה, מעדכן תת-קטגוריות...`);
    }

    for (const subName of item.subCategories) {
      const existingSub = await prisma.subCategory.findFirst({
        where: {
          name: subName,
          categoryId: category.id
        }
      });

      if (!existingSub) {
        await prisma.subCategory.create({
          data: {
            name: subName,
            categoryId: category.id
          }
        });
        console.log(`  🔹 תת-נושא חדש נוצר: ${subName}`);
      }
    }
  }

  console.log('✅ תהליך העדכון הסתיים בהצלחה ללא פגיעה בקיים!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });