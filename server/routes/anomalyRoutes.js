import express from 'express';
import { getAnomalyAlerts, updateAnomalyStatus } from '../controllers/anomalyController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, admin, getAnomalyAlerts);
router.put('/:id', protect, admin, updateAnomalyStatus);

export default router;
