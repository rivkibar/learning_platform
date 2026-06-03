import prisma from '../services/prisma.js';
import { generateAIResponse } from '../services/aiService.js';

// 1. שליפת פרומפטים לפי תת-קטגוריה
export const getPromptsBySubCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const prompts = await prisma.prompt.findMany({
            where: { subCategoryId: parseInt(id) }
        });
        res.json(prompts);
    } catch (error) {
        console.error('Error fetching prompts:', error);
        res.status(500).json({ error: 'Failed to fetch prompts' });
    }
};

// 2. שליחת שאלה ל-AI
export const askAI = async (req, res) => {
    try {
        const { promptText, userId, categoryId, subCategoryId } = req.body;
        const aiResponse = await generateAIResponse(promptText);

        const newPrompt = await prisma.prompt.create({
            data: {
                userId,
                categoryId,
                subCategoryId,
                prompt: promptText,
                response: aiResponse
            }
        });

        res.json(newPrompt);
    } catch (error) {
        console.error('Error in askAI:', error);
        res.status(500).json({ error: 'Failed to process AI request' });
    }
};

// 3. משיכת היסטוריית המשתמש
export const getUserHistory = async (req, res) => {
    try {
        const { userId } = req.params;
        const history = await prisma.prompt.findMany({
            where: { userId: parseInt(userId) },
            orderBy: { createdAt: 'desc' }
        });
        res.json(history);
    } catch (error) {
        console.error('Error fetching history:', error);
        res.status(500).json({ error: 'Failed to fetch history' });
    }
};