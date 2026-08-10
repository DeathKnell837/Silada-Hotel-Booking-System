import { getRecommendations } from '../services/recommendationService.js';

export const getRoomRecommendations = async (req, res) => {
  try {
    const userId = req.user ? req.user._id : null;
    const recommendations = await getRecommendations(userId);
    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
