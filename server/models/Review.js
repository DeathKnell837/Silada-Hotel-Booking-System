import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: true,
    },
    rating: {
      type: Number,
      required: [true, 'Please add a rating between 1 and 5'],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: [true, 'Please add a review comment'],
      trim: true,
    },
    sentimentScore: {
      type: Number,
      default: 0,
    },
    sentimentCategory: {
      type: String,
      enum: ['Positive', 'Neutral', 'Negative'],
      default: 'Neutral',
    },
    topics: [
      {
        type: String,
        trim: true,
      },
    ],
    suggestions: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

reviewSchema.index({ room: 1, user: 1 }, { unique: true });

reviewSchema.statics.getAverageRating = async function (roomId) {
  const obj = await this.aggregate([
    {
      $match: { room: roomId },
    },
    {
      $group: {
        _id: '$room',
        averageRating: { $avg: '$rating' },
        numReviews: { $sum: 1 },
      },
    },
  ]);

  try {
    if (obj.length > 0) {
      await mongoose.model('Room').findByIdAndUpdate(roomId, {
        rating: Math.round(obj[0].averageRating * 10) / 10,
        numReviews: obj[0].numReviews,
      });
    } else {
      await mongoose.model('Room').findByIdAndUpdate(roomId, {
        rating: 4.5,
        numReviews: 0,
      });
    }
  } catch (err) {
    console.error('Error updating room rating:', err);
  }
};

reviewSchema.post('save', async function () {
  await this.constructor.getAverageRating(this.room);
});

const Review = mongoose.model('Review', reviewSchema);
export default Review;
