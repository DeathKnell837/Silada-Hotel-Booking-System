import express from 'express';
import {
  getPriceQuote,
  getForecast,
  getPricingConfig,
  updatePricingConfig,
} from '../controllers/pricingController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/quote/:roomId', getPriceQuote);
router.get('/forecast', protect, admin, getForecast);
router.get('/config', protect, admin, getPricingConfig);
router.put('/config/:roomType', protect, admin, updatePricingConfig);

export default router;
