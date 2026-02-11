import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Room name is required'],
      trim: true,
    },
    type: {
      type: String,
      required: [true, 'Room type is required'],
      enum: ['Standard', 'Deluxe', 'Suite', 'Presidential'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0,
    },
    capacity: {
      type: Number,
      required: [true, 'Capacity is required'],
      min: 1,
    },
    size: {
      type: Number,
      default: 0,
    },
    bedType: {
      type: String,
      default: 'Queen',
    },
    images: [
      {
        type: String,
      },
    ],
    amenities: [
      {
        type: String,
      },
    ],
    rating: {
      type: Number,
      default: 4.5,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

roomSchema.index({ type: 1, price: 1 });
roomSchema.index({ isFeatured: 1 });

const Room = mongoose.model('Room', roomSchema);
export default Room;
