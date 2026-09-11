import express from 'express';
import { sendMessage, getHistory, clearHistory, getStatus } from '../controllers/chatbotController.js';

const router = express.Router();

router.get('/status', getStatus);
router.post('/message', sendMessage);
router.get('/history/:sessionId', getHistory);
router.delete('/history/:sessionId', clearHistory);

export default router;
