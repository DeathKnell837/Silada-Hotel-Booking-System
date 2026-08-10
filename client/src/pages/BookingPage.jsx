import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaUsers, FaPen, FaArrowLeft, FaChartLine, FaRobot } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { roomService, bookingService, pricingService } from '../services/dataService';
import { formatCurrency, getTodayString, getTomorrowString, calculateNights } from '../utils/helpers';
import Spinner from '../components/common/Spinner';

const BookingPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [dynamicPricing, setDynamicPricing] = useState(null);
  const [form, setForm] = useState({
    checkIn: getTodayString(),
    checkOut: getTomorrowString(),
    guests: 1,
    specialRequests: '',
  });

  useEffect(() => {
    roomService.getById(roomId)
      .then(({ data }) => setRoom(data))
      .catch(() => navigate('/rooms'))
      .finally(() => setLoading(false));
  }, [roomId]);

  // Fetch AI Dynamic Pricing Quote when dates change
  useEffect(() => {
    if (roomId && form.checkIn && form.checkOut) {
      pricingService.getQuote(roomId, form.checkIn, form.checkOut)
        .then(({ data }) => setDynamicPricing(data))
        .catch(() => setDynamicPricing(null));
    }
  }, [roomId, form.checkIn, form.checkOut]);

  const nights = calculateNights(form.checkIn, form.checkOut);
  const currentPricePerNight = dynamicPricing ? dynamicPricing.calculatedPrice : room?.price || 0;
  const totalPrice = nights > 0 ? nights * currentPricePerNight : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (nights <= 0) return toast.error('Check-out must be after check-in');
    if (room && form.guests > room.capacity) return toast.error(`Max capacity is ${room.capacity} guests`);

    setSubmitting(true);
    try {
      const { data } = await bookingService.create({
        room: roomId,
        checkIn: form.checkIn,
        checkOut: form.checkOut,
        guests: form.guests,
        specialRequests: form.specialRequests,
      });

      if (data.aiFlagged) {
        toast.error(`Booking under review by AI Security (${data.riskLevel} Risk Flagged)`, { duration: 5000 });
      } else {
        toast.success('Booking confirmed!');
      }

      navigate(`/booking/confirmation/${data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    }
    setSubmitting(false);
  };

  if (loading) return <div className="pt-32"><Spinner size="lg" /></div>;
  if (!room) return null;

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-gold transition-colors mb-8"
        >
          <FaArrowLeft /> Back
        </button>

        <div className="text-center mb-10">
          <p className="text-gold tracking-[0.3em] uppercase text-sm mb-2">Complete Your Reservation</p>
          <h1 className="font-serif text-3xl md:text-4xl text-white">Book Your Stay</h1>
          <div className="h-0.5 w-16 bg-gold/40 mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Booking Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3"
          >
            <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-8 space-y-6">
              <h2 className="font-serif text-xl text-white mb-4">Reservation Details</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">
                    <FaCalendarAlt className="inline mr-2 text-gold" /> Check-In
                  </label>
                  <input
                    type="date"
                    value={form.checkIn}
                    min={getTodayString()}
                    onChange={(e) => setForm({ ...form, checkIn: e.target.value })}
                    className="input-dark"
                    required
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">
                    <FaCalendarAlt className="inline mr-2 text-gold" /> Check-Out
                  </label>
                  <input
                    type="date"
                    value={form.checkOut}
                    min={form.checkIn || getTodayString()}
                    onChange={(e) => setForm({ ...form, checkOut: e.target.value })}
                    className="input-dark"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-400 text-sm mb-2 block">
                  <FaUsers className="inline mr-2 text-gold" /> Number of Guests
                </label>
                <select
                  value={form.guests}
                  onChange={(e) => setForm({ ...form, guests: Number(e.target.value) })}
                  className="input-dark"
                >
                  {[...Array(room.capacity)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1} {i === 0 ? 'Guest' : 'Guests'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-gray-400 text-sm mb-2 block">
                  <FaPen className="inline mr-2 text-gold" /> Special Requests (Optional)
                </label>
                <textarea
                  value={form.specialRequests}
                  onChange={(e) => setForm({ ...form, specialRequests: e.target.value })}
                  placeholder="Any special requirements or preferences..."
                  rows={3}
                  className="input-dark resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting || nights <= 0}
                className="btn-gold w-full !py-4 text-lg disabled:opacity-50"
              >
                {submitting ? 'Processing AI Security Check...' : `Confirm Booking — ${formatCurrency(totalPrice)}`}
              </button>
            </form>
          </motion.div>

          {/* Room & AI Dynamic Pricing Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <div className="glass-card gold-border-glow rounded-2xl overflow-hidden sticky top-28">
              <img
                src={room.images?.[0] || 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800'}
                alt={room.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-6 space-y-4">
                <div>
                  <span className="text-gold text-xs font-semibold tracking-wider uppercase">{room.type}</span>
                  <h3 className="font-serif text-xl text-white mt-1">{room.name}</h3>
                </div>

                {/* AI Dynamic Pricing Badge */}
                {dynamicPricing && (
                  <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl space-y-1">
                    <div className="flex items-center justify-between text-xs font-semibold text-amber-400">
                      <span className="flex items-center gap-1">
                        <FaRobot /> AI Dynamic Rate
                      </span>
                      <span>{dynamicPricing.multiplier}x Multiplier</span>
                    </div>
                    {dynamicPricing.factors?.length > 0 && (
                      <p className="text-[11px] text-neutral-400">
                        Factor: {dynamicPricing.factors.join(', ')}
                      </p>
                    )}
                  </div>
                )}

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-gray-400">
                    <span>Base rate per night</span>
                    <span className="text-gray-400 line-through">{formatCurrency(room.price)}</span>
                  </div>
                  <div className="flex justify-between text-gray-400 font-semibold">
                    <span>AI Calculated Nightly Rate</span>
                    <span className="text-amber-400">{formatCurrency(currentPricePerNight)}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Number of nights</span>
                    <span className="text-white">{nights > 0 ? nights : '-'}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Guests</span>
                    <span className="text-white">{form.guests}</span>
                  </div>
                  <div className="h-px bg-gold/20 my-2" />
                  <div className="flex justify-between font-semibold">
                    <span className="text-white">Total Amount</span>
                    <span className="text-gold font-serif text-2xl">
                      {nights > 0 ? formatCurrency(totalPrice) : '-'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
