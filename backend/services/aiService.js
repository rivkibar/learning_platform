const { GoogleGenAI } = require('@google/genai');
const dotenv = require('dotenv');

dotenv.config();

// אתחול ה-SDK של גוגל
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const generateAIResponse = async (promptText) => {
    try {
       
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