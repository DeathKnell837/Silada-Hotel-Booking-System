import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaCalendarAlt, FaUsers, FaHotel } from 'react-icons/fa';
import { bookingService } from '../services/dataService';
import { formatCurrency, formatDate } from '../utils/helpers';
import Spinner from '../components/common/Spinner';

const BookingConfirmation = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bookingService.getById(id)
      .then(({ data }) => setBooking(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="pt-32"><Spinner size="lg" /></div>;
  if (!booking) return <div className="pt-32 text-center text-gray-400">Booking not found</div>;

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg"
      >
        <div className="glass-card gold-border-glow rounded-2xl p-8 md:p-10 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          >
            <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-6" />
          </motion.div>

          <h1 className="font-serif text-3xl text-white mb-2">Booking Confirmed!</h1>
          <p className="text-gray-400 mb-8">
            Your reservation has been successfully created.
          </p>

          <div className="glass-card rounded-xl p-6 text-left space-y-4 mb-8">
            <div className="flex items-center gap-3">
              <FaHotel className="text-gold" />
              <div>
                <p className="text-gray-500 text-xs">Room</p>
                <p className="text-white font-medium">{booking.room?.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FaCalendarAlt className="text-gold" />
              <div>
                <p className="text-gray-500 text-xs">Dates</p>
                <p className="text-white font-medium">
                  {formatDate(booking.checkIn)} — {formatDate(booking.checkOut)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FaUsers className="text-gold" />
              <div>
                <p className="text-gray-500 text-xs">Guests</p>
                <p className="text-white font-medium">{booking.guests}</p>
              </div>
            </div>
            <div className="h-px bg-gold/20" />
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Total Price</span>
              <span className="text-gold font-serif text-2xl">{formatCurrency(booking.totalPrice)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Status</span>
              <span className="text-yellow-400 bg-yellow-400/10 px-3 py-1 rounded-full text-sm capitalize">
                {booking.status}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/profile" className="btn-gold flex-1 text-center">
              View My Bookings
            </Link>
            <Link to="/rooms" className="btn-outline-gold flex-1 text-center">
              Browse More Rooms
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default BookingConfirmation;
