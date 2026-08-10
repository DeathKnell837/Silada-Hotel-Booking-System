import Review from '../models/Review.js';
import Room from '../models/Room.js';
import { analyzeSentiment } from '../services/sentimentService.js';

export const createReview = async (req, res) => {
  try {
    const { roomId, rating, comment } = req.body;

    if (!roomId || !rating || !comment) {
      return res.status(400).json({ message: 'Please provide roomId, rating, and comment' });
    }

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    const alreadyReviewed = await Review.findOne({
      room: roomId,
      user: req.user._id,
    });

    if (alreadyReviewed) {
      return res.status(400).json({ message: 'You have already reviewed this room' });
    }

    const sentimentResult = await analyzeSentiment(comment, Number(rating));

    const review = await Review.create({
      user: req.user._id,
      room: roomId,
      rating: Number(rating),
      comment,
      sentimentScore: sentimentResult.sentimentScore,
      sentimentCategory: sentimentResult.sentimentCategory,
      topics: sentimentResult.topics,
      suggestions: sentimentResult.suggestions,
    });

    const populatedReview = await Review.findById(review._id).populate('user', 'name avatar');

    res.status(201).json(populatedReview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRoomReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ room: req.params.roomId })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user._id })
      .populate('room', 'name type images price')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized to delete this review' });
    }

    const roomId = review.room;
    await review.deleteOne();

    await Review.getAverageRating(roomId);

    res.json({ message: 'Review removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSentimentInsights = async (req, res) => {
  try {
    const totalReviews = await Review.countDocuments();
    const reviews = await Review.find().populate('room', 'name type');

    if (totalReviews === 0) {
      return res.json({
        totalReviews: 0,
        averageSentimentScore: 0,
        categoryCounts: { Positive: 0, Neutral: 0, Negative: 0 },
        topicBreakdown: {},
        actionableSuggestions: [],
        roomSentiment: [],
      });
    }

    let totalScore = 0;
    const categoryCounts = { Positive: 0, Neutral: 0, Negative: 0 };
    const topicMap = {};
    const suggestionsList = [];
    const roomSentimentMap = {};

    reviews.forEach((rev) => {
      totalScore += rev.sentimentScore || 0;
      categoryCounts[rev.sentimentCategory] = (categoryCounts[rev.sentimentCategory] || 0) + 1;

      (rev.topics || []).forEach((t) => {
        topicMap[t] = (topicMap[t] || 0) + 1;
      });

      if (rev.suggestions && rev.suggestions.length > 0) {
        rev.suggestions.forEach((sugg) => {
          suggestionsList.push({
            suggestion: sugg,
            roomName: rev.room ? rev.room.name : 'General',
            rating: rev.rating,
            createdAt: rev.createdAt,
          });
        });
      }

      if (rev.room) {
        const roomId = rev.room._id.toString();
        if (!roomSentimentMap[roomId]) {
          roomSentimentMap[roomId] = {
            roomId,
            roomName: rev.room.name,
            roomType: rev.room.type,
            scores: [],
            ratings: [],
            count: 0,
          };
        }
        roomSentimentMap[roomId].scores.push(rev.sentimentScore || 0);
        roomSentimentMap[roomId].ratings.push(rev.rating);
        roomSentimentMap[roomId].count += 1;
      }
    });

    const roomSentiment = Object.values(roomSentimentMap).map((item) => ({
      roomId: item.roomId,
      roomName: item.roomName,
      roomType: item.roomType,
      reviewCount: item.count,
      averageRating: Number((item.ratings.reduce((a, b) => a + b, 0) / item.count).toFixed(1)),
      averageSentimentScore: Number((item.scores.reduce((a, b) => a + b, 0) / item.count).toFixed(2)),
    }));

    res.json({
      totalReviews,
      averageSentimentScore: Number((totalScore / totalReviews).toFixed(2)),
      categoryCounts,
      topicBreakdown: topicMap,
      actionableSuggestions: suggestionsList.slice(0, 10),
      roomSentiment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
