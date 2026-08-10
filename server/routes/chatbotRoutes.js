import express from 'express';
import { sendMessage, getHistory, clearHistory } from '../controllers/chatbotController.js';

const router = express.Router();

router.post('/message', sendMessage);
router.get('/history/:sessionId', getHistory);
router.delete('/history/:sessionId', clearHistory);

export default router;
