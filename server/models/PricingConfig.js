import mongoose from 'mongoose';

const pricingConfigSchema = new mongoose.Schema(
  {
    roomType: {
      type: String,
      required: true,
      enum: ['Standard', 'Deluxe', 'Suite', 'Presidential'],
      unique: true,
    },
    baseMultiplier: {
      type: Number,
      default: 1.0,
    },
    weekendMultiplier: {
      type: Number,
      default: 1.15,
    },
    peakSeasonMultiplier: {
      type: Number,
      default: 1.25,
    },
    highDemandOccupancyThreshold: {
      type: Number,
      default: 75,
    },
    highDemandMultiplier: {
      type: Number,
      default: 1.3,
    },
    minPriceFactor: {
      type: Number,
      default: 0.8,
    },
    maxPriceFactor: {
      type: Number,
      default: 2.0,
    },
    isAutoPricingEnabled: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const PricingConfig = mongoose.model('PricingConfig', pricingConfigSchema);
export default PricingConfig;
