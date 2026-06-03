# AI Learning Platform (Mini MVP)

פלטפורמת למידה חכמה המאפשרת למשתמשים ליצור תוכניות לימוד מותאמות אישית, לשלוח פרומפטים ל-AI ולקבל שיעורים מובנים לפי קטגוריות.

## 🚀 אודות הפרויקט
מערכת זו פותחה כ-MVP (Minimum Viable Product) ומטרתה להנגיש ידע באמצעות בינה מלאכותית. 
- **יכולות המערכת:** הרשמת משתמשים, ניהול קטגוריות ותתי-קטגוריות, יצירת שיעורים מותאמים אישית בעזרת מודל Gemini, וצפייה בהיסטוריית למידה.
- **לוח מנהל:** מערכת ניהול המאפשרת צפייה בכל המשתמשים והפרומפטים שהופקו.

## 🛠 טכנולוגיות
- **Frontend:** React, React Router, Axios.
- **Backend:** Node.js, Express.
- **Database:** PostgreSQL (עם ORM).
- **AI:** Google Generative AI (Gemini API).

## ⚙️ הוראות הרצה (Local Development)

### דרישות קדם
- Node.js מותקן על המחשב.
- מסד נתונים PostgreSQL פעיל.

### הגדרות סביבה (.env)
בתיקיית ה-`backend`, צור קובץ בשם `.env` והכנס את הערכים הבאים:
```text
PORT=5000
DATABASE_URL=postgresql://your_user:your_password@localhost:5432/learning_platform
GEMINI_API_KEY=your_gemini_api_key

הרצה
התקנת תלויות:
פתח טרמינל בתיקיית ה-backend והרץ: npm install.
פתח טרמינל בתיקיית ה-frontend והרץ: npm install.

הרצת ה-Backend:
בטרמינל של ה-backend:

Bash
node index.js
הרצת ה-Frontend:
בטרמינל של ה-frontend:

Bash
npm start
האתר יהיה זמין בכתובת: http://localhost:3000.

⚠️ הערה טכנית: סביבת פיתוח וסינון רשת
הפרויקט עושה שימוש ב-API של Google Gemini. פיתוח הפרויקט בוצע תחת סינון אינטרנט (NetFree), אשר חוסם גישה לכתובות מסוימות של שרתי גוגל.

הקוד הנוכחי ערוך לתקשורת ישירה מול ה-API של גוגל (generative-language.googleapis.com).

במידה והפרויקט לא מחזיר תשובה בסביבה מוגנת, יש לוודא שהגישה לכתובת זו פתוחה בהגדרות הספק, או להריץ את ה-Backend בשרת מרוחק (כגון Render/Heroku) שאינו כפוף לסינון מקומי.

📝 אודות המפתח
פרויקט זה הוגש כחלק ממטלת פיתוח Full-stack. הדגש בפרויקט הושם על ארכיטקטורת קוד מודולרית, הפרדת שכבות (Routes/Controllers/Models) וטיפול תקין בשגיאות API.