import express from 'express';
const router = express.Router();

import { askAI, getUserHistory, getPromptsBySubCategory } from '../controllers/promptController.js';

router.get('/subcategories/:id/prompts', getPromptsBySubCategory);
router.post('/ask', askAI);
router.get('/history/:userId', getUserHistory);

export default router;