// התיקון לשגיאת ה-Constructor:
const { GoogleGenAI } = require('@google/genai'); 
const prisma = require('./prisma'); // אם אתה משתמש בפריזמה פה

// אתחול הקליינט עם ה-API KEY מה-env שלך
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const generateAIResponse = async (promptText) => {
    try {
        // דוגמה לקריאה הנכונה ל-Gemini (לפי ה-SDK העדכני):
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: promptText,
        });
        
        return response.text;
    } catch (error) {
        console.error("AI Service Error:", error);
        throw error;
    }
};

module.exports = {
    generateAIResponse
};