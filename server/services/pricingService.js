import Room from '../models/Room.js';
import Booking from '../models/Booking.js';
import PricingConfig from '../models/PricingConfig.js';

export const calculateDynamicPrice = async (roomId, checkIn, checkOut) => {
  const room = await Room.findById(roomId);
  if (!room) {
    throw new Error('Room not found');
  }

  const basePrice = room.price;
  const config = (await PricingConfig.findOne({ roomType: room.type })) || {
    baseMultiplier: 1.0,
    weekendMultiplier: 1.15,
    peakSeasonMultiplier: 1.25,
    highDemandOccupancyThreshold: 75,
    highDemandMultiplier: 1.3,
    minPriceFactor: 0.8,
    maxPriceFactor: 2.0,
    isAutoPricingEnabled: true,
  };

  if (!config.isAutoPricingEnabled) {
    return {
      basePrice,
      calculatedPrice: basePrice,
      multiplier: 1.0,
      factors: ['Auto-pricing disabled (Base rate applied)'],
      occupancyRate: 50,
    };
  }

  const checkInDate = checkIn ? new Date(checkIn) : new Date();
  const checkOutDate = checkOut ? new Date(checkOut) : new Date(checkInDate.getTime() + 86400000);

  let cumulativeMultiplier = config.baseMultiplier || 1.0;
  const factors = [];

  const dayOfWeek = checkInDate.getDay();
  if (dayOfWeek === 5 || dayOfWeek === 6) {
    cumulativeMultiplier *= config.weekendMultiplier;
    factors.push(`Weekend Surge (+${Math.round((config.weekendMultiplier - 1) * 100)}%)`);
  }

  const month = checkInDate.getMonth();
  if ([0, 3, 4, 11].includes(month)) {
    cumulativeMultiplier *= config.peakSeasonMultiplier;
    factors.push(`Peak Season Rate (+${Math.round((config.peakSeasonMultiplier - 1) * 100)}%)`);
  }

  const totalRoomsOfSameType = await Room.countDocuments({ type: room.type });
  const overlappingBookingsCount = await Booking.countDocuments({
    status: { $nin: ['cancelled'] },
    checkIn: { $lt: checkOutDate },
    checkOut: { $gt: checkInDate },
  });

  const estimatedOccupancy = totalRoomsOfSameType > 0 
    ? Math.min(100, Math.round((overlappingBookingsCount / Math.max(1, totalRoomsOfSameType * 2)) * 100))
    : 50;

  if (estimatedOccupancy >= config.highDemandOccupancyThreshold) {
    cumulativeMultiplier *= config.highDemandMultiplier;
    factors.push(`High Demand Surge (${estimatedOccupancy}% occupancy, +${Math.round((config.highDemandMultiplier - 1) * 100)}%)`);
  } else if (estimatedOccupancy < 30) {
    cumulativeMultiplier *= 0.9;
    factors.push(`Off-Peak Special Discount (${estimatedOccupancy}% occupancy, -10%)`);
  }

  cumulativeMultiplier = Math.max(
    config.minPriceFactor,
    Math.min(config.maxPriceFactor, cumulativeMultiplier)
  );

  const calculatedPrice = Math.round(basePrice * cumulativeMultiplier);

  return {
    basePrice,
    calculatedPrice,
    multiplier: Number(cumulativeMultiplier.toFixed(2)),
    factors: factors.length > 0 ? factors : ['Standard Base Rate'],
    occupancyRate: estimatedOccupancy,
  };
};

export const getDemandForecast = async () => {
  const roomTypes = ['Standard', 'Deluxe', 'Suite', 'Presidential'];
  const forecast = [];

  for (const type of roomTypes) {
    const rooms = await Room.find({ type });
    const config = (await PricingConfig.findOne({ roomType: type })) || {
      baseMultiplier: 1.0,
      highDemandOccupancyThreshold: 75,
      isAutoPricingEnabled: true,
    };

    const count = rooms.length;
    const avgBasePrice = rooms.reduce((acc, r) => acc + r.price, 0) / (count || 1);

    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 86400000);
    const samplePriceObj = rooms[0]
      ? await calculateDynamicPrice(rooms[0]._id, now, nextWeek)
      : { calculatedPrice: avgBasePrice, multiplier: 1.0, factors: ['Base'], occupancyRate: 40 };

    forecast.push({
      roomType: type,
      totalRooms: count,
      avgBasePrice: Math.round(avgBasePrice),
      currentDynamicPrice: samplePriceObj.calculatedPrice,
      currentMultiplier: samplePriceObj.multiplier,
      projectedOccupancy: samplePriceObj.occupancyRate,
      demandLevel: samplePriceObj.occupancyRate > 75 ? 'High' : samplePriceObj.occupancyRate > 40 ? 'Moderate' : 'Low',
      pricingFactors: samplePriceObj.factors,
      isAutoPricingEnabled: config.isAutoPricingEnabled,
    });
  }

  return forecast;
};
