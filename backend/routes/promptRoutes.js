const express = require('express');
const router = express.Router();
const prisma = require('../services/prisma');
const { generateAIResponse } = require('../services/aiService');
require('dotenv').config();

router.post('/ask', async (req, res) => {
    try {
        const { promptText, userId, categoryId, subCategoryId } = req.body;

        if (!promptText || !promptText.trim()) {
            return res.status(400).json({ error: 'Prompt text is required' });
        }

        const cleanUserId = parseInt(userId);
        const cleanSubCategoryId = parseInt(subCategoryId);
        let cleanCategoryId = parseInt(categoryId);

        if (isNaN(cleanUserId)) {
            return res.status(400).json({ error: 'Valid userId is required' });
        }

        if (isNaN(cleanSubCategoryId)) {
            return res.status(400).json({ error: 'Valid subCategoryId is required' });
        }

        const subCategoryRecord = await prisma.subCategory.findUnique({
            where: { id: cleanSubCategoryId },
            include: { category: true }
        });

        if (!subCategoryRecord) {
            return res.status(404).json({ error: 'SubCategory not found' });
        }

        if (isNaN(cleanCategoryId)) {
            cleanCategoryId = subCategoryRecord.categoryId;
        }

        const contextualPrompt = `
אתה מורה פרטי ועוזר למידה אינטליגנטי בפלטפורמת למידה מקוונת.
המשתמש נמצא כרגע בתוך קורס בנושא הראשי: "${subCategoryRecord.category.name}".
ובאופן ספציפי יותר, השיעור הנוכחי עוסק בתת-הנושא: "${subCategoryRecord.name}".

הנחיות חשובות לתשובה:
1. תענה אך ורק בהקשר הישיר של הנושא "${subCategoryRecord.name}"!
2. נסח את התשובות שלך בצורה ברורה, מעודדת, מותאמת אישית ובעברית רהוטה ותקינה.
3. אם המשתמש מבקש הסבר, משימה או תרגול - ספק לו את זה מיד על בסיס הנושא הנוכחי.

הודעת המשתמש הנוכחית היא:
"${promptText}"
        `.trim();

        let aiResponse;
        try {
            aiResponse = await generateAIResponse(contextualPrompt);
        } catch (error) {
            console.error('AI request failed, falling back to local response:', error);
            aiResponse = 'ה-AI אינו זמין כרגע. השיחה נשמרה בהצלחה וננסה לספק תשובה בהמשך.';
        }

        const newPrompt = await prisma.prompt.create({
            data: {
                userId: cleanUserId,
                categoryId: cleanCategoryId,
                subCategoryId: cleanSubCategoryId,
                prompt: promptText,
                response: aiResponse
            }
        });

        res.json(newPrompt);
    } catch (error) {
        console.error('שגיאת פנייה:', error.response?.data || error.message || error);
        res.status(500).json({ error: 'הפנייה ל-AI נכשלה' });
    }
});

router.get('/sub/:id', async (req, res) => {
    try {
        const subCategoryId = parseInt(req.params.id);
        if (isNaN(subCategoryId)) {
            return res.status(400).json({ error: 'Valid subCategoryId is required' });
        }

        const prompts = await prisma.prompt.findMany({
            where: { subCategoryId },
            orderBy: { createdAt: 'asc' }
        });

        res.json(prompts);
    } catch (error) {
        console.error('Error fetching prompts by subcategory:', error);
        res.status(500).json({ error: 'Failed to fetch subcategory prompts' });
    }
});

module.exports = router;
