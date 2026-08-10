import Booking from '../models/Booking.js';
import AnomalyAlert from '../models/AnomalyAlert.js';

export const detectAnomaly = async ({ userId, room, totalPrice, nights, guests }) => {
  let riskScore = 10;
  const flags = [];

  if (totalPrice > 100000) {
    riskScore += 45;
    flags.push(`High Transaction Value (₱${totalPrice.toLocaleString()})`);
  } else if (totalPrice > 50000) {
    riskScore += 25;
    flags.push(`Elevated Booking Amount (₱${totalPrice.toLocaleString()})`);
  }

  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
  const recentBookingsCount = await Booking.countDocuments({
    user: userId,
    createdAt: { $gte: tenMinutesAgo },
  });

  if (recentBookingsCount >= 2) {
    riskScore += 40;
    flags.push(`Multiple Rapid Sequential Reservations (${recentBookingsCount + 1} bookings in 10 mins)`);
  }

  if (nights > 21) {
    riskScore += 30;
    flags.push(`Unusual Long-Stay Duration (${nights} nights)`);
  }

  if (room && guests > room.capacity) {
    riskScore += 20;
    flags.push(`Guest count (${guests}) exceeds standard room capacity (${room.capacity})`);
  }

  riskScore = Math.min(100, riskScore);
  let riskLevel = 'Low';
  if (riskScore >= 75) {
    riskLevel = 'Critical';
  } else if (riskScore >= 55) {
    riskLevel = 'High';
  } else if (riskScore >= 35) {
    riskLevel = 'Medium';
  }

  const isAnomaly = riskScore >= 55;

  return {
    isAnomaly,
    riskScore,
    riskLevel,
    flags: flags.length > 0 ? flags : ['Standard Low-Risk Reservation'],
  };
};

export const createAnomalyAlert = async (bookingId, userId, anomalyData) => {
  try {
    const alert = await AnomalyAlert.create({
      booking: bookingId,
      user: userId,
      riskScore: anomalyData.riskScore,
      riskLevel: anomalyData.riskLevel,
      flags: anomalyData.flags,
      status: 'pending',
    });
    return alert;
  } catch (err) {
    console.error('Error creating anomaly alert:', err);
    return null;
  }
};
