import express from 'express';
import {
  getRooms,
  getFeaturedRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
} from '../controllers/roomController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getRooms).post(protect, admin, createRoom);
router.get('/featured', getFeaturedRooms);
router
  .route('/:id')
  .get(getRoomById)
  .put(protect, admin, updateRoom)
  .delete(protect, admin, deleteRoom);

export default router;
