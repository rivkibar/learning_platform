const prisma = require('../services/prisma');
const { generateAIResponse } = require('../services/aiService');


const askAI = async (req, res) => {
    try {
        const { user_id, category_id, sub_category_id, prompt } = req.body;

        if (!user_id || !category_id || !sub_category_id || !prompt) {
            return res.status(400).json({ error: "All fields are required (user_id, category_id, sub_category_id, prompt)" });
        }

       
        const aiResponseText = await generateAIResponse(prompt);

        const newPromptRecord = await prisma.prompt.create({
            data: {
                user_id: parseInt(user_id),
                category_id: parseInt(category_id),
                sub_category_id: parseInt(sub_category_id),
                prompt: prompt,
                response: aiResponseText
            }
        });

        
        res.status(201).json(newPromptRecord);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while processing your request to the AI" });
    }
};


const getUserHistory = async (req, res) => {
    try {
        const { userId } = req.params;

        const history = await prisma.prompt.findMany({
            where: { user_id: parseInt(userId) },
            orderBy: { created_at: 'desc' },
            include: {
                category: true,     
                sub_category: true   
            }
        });

        res.status(200).json(history);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Could not fetch user history" });
    }
};

module.exports = {
    askAI,
    getUserHistory
};