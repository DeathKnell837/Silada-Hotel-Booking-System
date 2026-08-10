import Room from '../models/Room.js';
import Booking from '../models/Booking.js';

export const getRecommendations = async (userId = null) => {
  const allRooms = await Room.find({ isAvailable: true }).lean();

  if (!allRooms || allRooms.length === 0) {
    return [];
  }

  if (!userId) {
    return getPopularRecommendations(allRooms);
  }

  const userBookings = await Booking.find({ user: userId, status: { $ne: 'cancelled' } }).populate('room');

  if (!userBookings || userBookings.length === 0) {
    return getPopularRecommendations(allRooms);
  }

  const preferredTypesCount = {};
  let totalGuests = 0;
  let totalPrice = 0;

  userBookings.forEach((b) => {
    if (b.room) {
      preferredTypesCount[b.room.type] = (preferredTypesCount[b.room.type] || 0) + 1;
      totalPrice += b.room.price;
      totalGuests += b.guests || 1;
    }
  });

  const avgPrice = totalPrice / userBookings.length;
  const avgGuests = Math.round(totalGuests / userBookings.length);
  const mostPreferredType = Object.keys(preferredTypesCount).reduce((a, b) =>
    preferredTypesCount[a] > preferredTypesCount[b] ? a : b
  );

  const scoredRooms = allRooms.map((room) => {
    let score = 0;
    const matchReasons = [];

    if (room.type === mostPreferredType) {
      score += 40;
      matchReasons.push(`Matches your preferred room style (${room.type})`);
    } else if (preferredTypesCount[room.type]) {
      score += 20;
      matchReasons.push(`Similar to past ${room.type} stays`);
    }

    if (Math.abs(room.capacity - avgGuests) <= 1) {
      score += 25;
      matchReasons.push(`Ideal capacity for your party size (${room.capacity} guests)`);
    }

    const priceDiff = Math.abs(room.price - avgPrice);
    if (priceDiff <= avgPrice * 0.3) {
      score += 20;
      matchReasons.push(`Fits your typical price preference`);
    }

    score += (room.rating / 5) * 15;
    if (room.rating >= 4.7) {
      matchReasons.push(`Top guest-rated room (${room.rating} ⭐)`);
    }

    return {
      ...room,
      aiScore: Math.min(99, Math.round(score)),
      recommendationReason: matchReasons.length > 0 ? matchReasons[0] : 'Recommended based on guest trends',
      matchReasons,
    };
  });

  scoredRooms.sort((a, b) => b.aiScore - a.aiScore);

  return scoredRooms.slice(0, 4);
};

const getPopularRecommendations = (allRooms) => {
  const sorted = [...allRooms].sort((a, b) => (b.rating || 0) - (a.rating || 0));
  return sorted.slice(0, 4).map((room, idx) => ({
    ...room,
    aiScore: 90 - idx * 3,
    recommendationReason: room.isFeatured ? '🔥 Popular Luxury Choice' : `⭐ High Guest Rating (${room.rating}/5)`,
    matchReasons: ['Highly rated by guests', 'Top booked luxury room'],
  }));
};
