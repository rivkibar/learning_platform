const express = require('express');
const cors = require('cors');
require('dotenv').config();

// ייבוא הראוטים
const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const promptRoutes = require('./routes/promptRoutes'); // הראוטר החדש!

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// חיבור הראוטים למערכת
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/prompts', promptRoutes); // החיבור החדש!

// Test Route
app.get('/api/health', (req, res) => {
  res.json({ status: "success", message: "Server is running smoothly" });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});