const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');

dotenv.config();

if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured in .env');
}

const client = new GoogleGenerativeAI({ apiKey: process.env.GEMINI_API_KEY });
const model = client.getGenerativeModel({ model: 'gemini-2.5-flash' });

const generateAIResponse = async (promptText) => {
    try {
        const response = await model.generateContent({
            contents: [{ parts: [{ text: promptText }] }]
        });

        if (!response?.response) {
            throw new Error('Unexpected Gemini response format');
        }

        const text = typeof response.response.text === 'function'
            ? response.response.text()
            : response.response.text;

        return text || '';
    } catch (error) {
        console.error('AI Service Error:', error);
        throw error;
    }
};

module.exports = {
    generateAIResponse
};
