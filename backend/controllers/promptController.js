import prisma from '../services/prisma.js';
import { generateAIResponse } from '../services/aiService.js';

// 1. שליפת הודעות קודמות/היסטוריה עבור תת-קטגוריה מסוימת
export const getPromptsBySubCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const prompts = await prisma.prompt.findMany({
            where: { subCategoryId: parseInt(id) },
            orderBy: { id: 'asc' }
        });
        return res.json(prompts);
    } catch (error) {
        console.error('Error fetching prompts:', error);
        return res.status(500).json({ error: 'Failed to fetch prompts' });
    }
};

// 2. קבלת פרומפט, הזרקת הקשר של הקטגוריה ושליחה ל-AI
export const askAI = async (req, res) => {
    try {
        const { promptText, userId, subCategoryId } = req.body;

        if (!promptText || !promptText.trim()) {
            return res.status(400).json({ error: 'Prompt text is required' });
        }

        const cleanUserId = parseInt(userId) || 1;
        const cleanSubCategoryId = parseInt(subCategoryId);

        if (isNaN(cleanSubCategoryId)) {
            return res.status(400).json({ error: 'Valid subCategoryId is required' });
        }

        // ==========================================
        //  שלב קריטי: שליפת שמות הקטגוריות לצורך הזרקת הקשר
        // ==========================================
        const subCategoryRecord = await prisma.subCategory.findUnique({
            where: { id: cleanSubCategoryId },
            include: { category: true } // שולף גם את הקטגוריה הראשית וגם את תת הקטגוריה בבת אחת
        });

        if (!subCategoryRecord) {
            return res.status(404).json({ error: 'SubCategory not found' });
        }

        const categoryName = subCategoryRecord.category.name;
        const subCategoryName = subCategoryRecord.name;
        const cleanCategoryId = subCategoryRecord.categoryId;

        // בניית פרומפט מערכת מורחב שמסביר ל-AI בדיוק איפה המשתמש נמצא ומנחה אותו לענות בעברית תקינה
        const contextualPrompt = `
אתה מורה פרטי ועוזר למידה אינטליגנטי בפלטפורמת למידה מקוונת.
המשתמש נמצא כרגע בתוך קורס בנושא הראשי: "${categoryName}".
ובאופן ספציפי יותר, השיעור הנוכחי עוסק בתת-הנושא: "${subCategoryName}".

הנחיות חשובות לתשובה:
1. תענה אך ורק בהקשר הישיר של הנושא "${subCategoryName}"! אל תשאל את המשתמש באיזה נושא מדובר.
2. נסח את התשובות שלך בצורה ברורה, מעודדת, מותאמת אישית ובעברית רהוטה ותקינה.
3. אם המשתמש מבקש הסבר, משימה או תרגול - ספק לו את זה מיד על בסיס הנושא הנוכחי.

הודעת המשתמש הנוכחית היא:
"${promptText}"
        `.trim();

        console.log(`Sending contextual prompt to Gemini for course: ${subCategoryName}`);
        
        // שליחת הפרומפט המהונדס עם ההקשר ל-Gemini
        const aiResponse = await generateAIResponse(contextualPrompt);

        // שמירת הרשומה המלאה בדאטהבייס (שומרים את ה-promptText המקורי של המשתמש, לא את המעטפת של המערכת)
        const newPrompt = await prisma.prompt.create({
            data: {
                userId: cleanUserId,
                categoryId: cleanCategoryId,
                subCategoryId: cleanSubCategoryId,
                prompt: promptText, 
                response: aiResponse
            }
        });

        return res.json(newPrompt);
    } catch (error) {
        console.error('Error in askAI Controller:', error);
        return res.status(500).json({ error: 'Failed to process AI request' });
    }
};

// 3. שליפת כל ההיסטוריה הכללית של המשתמש
export const getUserHistory = async (req, res) => {
    try {
        const { userId } = req.params;
        const history = await prisma.prompt.findMany({
            where: { userId: parseInt(userId) },
            orderBy: { id: 'desc' }
        });
        return res.json(history);
    } catch (error) {
        console.error('Error fetching history:', error);
        return res.status(500).json({ error: 'Failed to fetch history' });
    }
};