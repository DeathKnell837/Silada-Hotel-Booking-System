import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { reviewService } from '../services/dataService';
import toast from 'react-hot-toast';

const ReviewForm = ({ roomId, onReviewAdded }) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      return toast.error('Please write a review comment');
    }

    setLoading(true);
    try {
      const newReview = await reviewService.create({
        roomId,
        rating,
        comment,
      });

      toast.success('Review submitted! AI Sentiment analysis complete.');
      setComment('');
      setRating(5);
      if (onReviewAdded) onReviewAdded(newReview.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 mb-8 backdrop-blur-sm">
      <h3 className="text-xl font-serif text-amber-100 font-semibold mb-4">Write a Guest Review</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-neutral-400 mb-2">Overall Rating</label>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="text-2xl transition-transform hover:scale-110 focus:outline-none"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
              >
                <FaStar
                  className={
                    star <= (hoverRating || rating)
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-neutral-700'
                  }
                />
              </button>
            ))}
            <span className="ml-3 text-sm text-amber-300 font-medium">
              {rating === 5 ? 'Exceptional' : rating === 4 ? 'Very Good' : rating === 3 ? 'Average' : rating === 2 ? 'Poor' : 'Terrible'}
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm text-neutral-400 mb-2">Your Feedback</label>
          <textarea
            rows="3"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Describe your stay, room cleanliness, service quality, or amenities..."
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-neutral-200 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 outline-none text-sm placeholder:text-neutral-600"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-neutral-950 font-semibold text-sm transition shadow-lg shadow-amber-500/20 disabled:opacity-50"
        >
          {loading ? 'Analyzing Review with AI...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
