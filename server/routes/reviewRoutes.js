import express from 'express';
import {
  createReview,
  getRoomReviews,
  getUserReviews,
  deleteReview,
  getSentimentInsights,
} from '../controllers/reviewController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createReview);

router.route('/my')
  .get(protect, getUserReviews);

router.route('/insights')
  .get(protect, admin, getSentimentInsights);

router.route('/room/:roomId')
  .get(getRoomReviews);

router.route('/:id')
  .delete(protect, deleteReview);

export default router;
