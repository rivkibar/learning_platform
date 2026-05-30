const { GoogleGenAI } = require('@google/generative-ai');

const aiKey = process.env.GEMINI_API_KEY;

// אתחול נכון של ה-SDK לפי הגרסה העדכנית
let genAI = null;
if (aiKey && aiKey !== "your_actual_api_key_here") {
    try {
        genAI = new GoogleGenAI({ apiKey: aiKey });
    } catch (e) {
        console.error("Error initializing GoogleGenAI client:", e);
    }
}

const generateAIResponse = async (promptText) => {
    try {
        // מנגנון הגנה למקרה שהמפתח לא נקלט או ריק
        if (!genAI) {
            return `[מצב סימולציה] השרת עובד אך ה-AI אינו מאותחל. ודא שקובץ ה-.env מכיל מפתח תקין בשם GEMINI_API_KEY. הפרומפט שנקלט: "${promptText}"`;
        }

        // שליחת הפרומפט למודל המהיר והמומלץ
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: promptText }] }]
        });
        
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("AI Generation Error:", error);
        throw new Error("Failed to communicate with AI Engine");
    }
};

module.exports = {
    generateAIResponse
};