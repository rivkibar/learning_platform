const express = require('express');
const cors = require('cors');
require('dotenv').config();

// ייבוא הראוטרים
const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const promptRoutes = require('./routes/promptRoutes.js').default;

const app = express();
const PORT = process.env.PORT || 5000;

// 1. הגדרות יסוד (חייבות להופיע לפני הראוטרים!)
app.use(cors());
app.use(express.json()); // קריטי עבור קריאת נתונים שנשלחים מה-Frontend

// 2. חיבור הראוטרים של ה-API
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api', promptRoutes);

// נתיב בדיקה כללי
app.get('/', (req, res) => {
    res.send('Server is up and running smoothly! 🚀');
});

// הפעלת השרת
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});