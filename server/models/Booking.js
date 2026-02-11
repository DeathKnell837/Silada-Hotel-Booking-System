import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
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
    checkIn: {
      type: Date,
      required: [true, 'Check-in date is required'],
    },
    checkOut: {
      type: Date,
      required: [true, 'Check-out date is required'],
    },
    guests: {
      type: Number,
      required: true,
      default: 1,
      min: 1,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
    },
    specialRequests: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

// Virtual: number of nights
bookingSchema.virtual('nights').get(function () {
  return Math.ceil((this.checkOut - this.checkIn) / (1000 * 60 * 60 * 24));
});

bookingSchema.set('toJSON', { virtuals: true });
bookingSchema.set('toObject', { virtuals: true });

// Validate checkOut > checkIn
bookingSchema.pre('validate', function (next) {
  if (this.checkOut <= this.checkIn) {
    this.invalidate('checkOut', 'Check-out must be after check-in');
  }
  next();
});

bookingSchema.index({ user: 1 });
bookingSchema.index({ room: 1, checkIn: 1, checkOut: 1 });

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
