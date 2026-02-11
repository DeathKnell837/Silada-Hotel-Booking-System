import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaUsers, FaPen, FaArrowLeft } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { roomService, bookingService } from '../services/dataService';
import { formatCurrency, getTodayString, getTomorrowString, calculateNights } from '../utils/helpers';
import Spinner from '../components/common/Spinner';

const BookingPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
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

  const nights = calculateNights(form.checkIn, form.checkOut);
  const totalPrice = nights > 0 && room ? nights * room.price : 0;

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
      toast.success('Booking created successfully!');
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
                {submitting ? 'Processing...' : `Confirm Booking — ${formatCurrency(totalPrice)}`}
              </button>
            </form>
          </motion.div>

          {/* Room Summary */}
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
              <div className="p-6">
                <span className="text-gold text-xs font-semibold tracking-wider uppercase">{room.type}</span>
                <h3 className="font-serif text-xl text-white mt-1 mb-4">{room.name}</h3>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-gray-400">
                    <span>Rate per night</span>
                    <span className="text-white">{formatCurrency(room.price)}</span>
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
                    <span className="text-white">Total</span>
                    <span className="text-gold font-serif text-xl">
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
