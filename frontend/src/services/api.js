import axios from 'axios';

// הגדרת כתובת הבסיס לשרת ה-Backend שלנו
const API = axios.create({
    baseURL: 'http://localhost:5000/api'
});

// פונקציות השירות שישמשו את המסכים השונים באפליקציה
export const userAPI = {
    loginOrRegister: (data) => API.post('/users', data),
};

export const categoryAPI = {
    getCategories: () => API.get('/categories'),
};

export const promptAPI = {
    askAI: (data) => API.post('/prompts/ask', data),
    getHistory: (userId) => API.get(`/history/${userId}`),
};

export default API;