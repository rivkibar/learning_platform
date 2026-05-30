const express = require('express');
const router = express.Router();
const { askAI, getUserHistory } = require('../controllers/promptController');


router.post('/ask', askAI);

router.get('/history/:userId', getUserHistory);

module.exports = router;