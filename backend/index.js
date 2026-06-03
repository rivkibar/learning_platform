const express = require('express');
const cors = require('cors');
require('dotenv').config();

// ייבוא הראוטרים
const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const promptRoutes = require('./routes/promptRoutes');
const historyRoutes = require('./routes/historyRoutes');


const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors());
app.use(express.json()); 


app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/prompts', promptRoutes);

app.get('/', (req, res) => {
    res.send('Server is up and running smoothly! 🚀');
});

// הפעלת השרת
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});