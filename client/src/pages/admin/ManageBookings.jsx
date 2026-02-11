import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaFilter, FaCalendarAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { bookingService } from '../../services/dataService';
import { formatCurrency, formatDate, getStatusColor } from '../../utils/helpers';
import Spinner from '../../components/common/Spinner';

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    bookingService.getAll()
      .then(({ data }) => setBookings(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await bookingService.updateStatus(id, status);
      setBookings(bookings.map((b) => (b._id === id ? { ...b, status } : b)));
      toast.success(`Status updated to ${status}`);
    } catch {
      toast.error('Failed to update status');
    }
  };

  const filtered =
    filter === 'all' ? bookings : bookings.filter((b) => b.status === filter);

  const statusCounts = {
    all: bookings.length,
    pending: bookings.filter((b) => b.status === 'pending').length,
    confirmed: bookings.filter((b) => b.status === 'confirmed').length,
    completed: bookings.filter((b) => b.status === 'completed').length,
    cancelled: bookings.filter((b) => b.status === 'cancelled').length,
  };

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center gap-4 mb-4">
          <Link to="/admin" className="text-gray-400 hover:text-gold transition-colors">
            <FaArrowLeft />
          </Link>
          <div>
            <p className="text-gold tracking-[0.2em] uppercase text-xs">Administration</p>
            <h1 className="font-serif text-2xl md:text-3xl text-white">Manage Bookings</h1>
          </div>
        </div>
        <div className="h-0.5 w-16 bg-gold/40 mb-8" />

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-lg text-sm capitalize transition-all ${
                filter === s
                  ? 'bg-gold text-dark font-semibold'
                  : 'glass-card text-gray-400 hover:text-gold'
              }`}
            >
              {s} ({statusCounts[s]})
            </button>
          ))}
        </div>

        {loading ? (
          <Spinner />
        ) : (
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gold/10">
                    <th className="text-left p-4 text-gray-400 font-medium">Guest</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Room</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Check-In</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Check-Out</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Guests</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Amount</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Status</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((b) => (
                    <tr key={b._id} className="border-b border-dark-lighter/50 hover:bg-gold/5 transition-colors">
                      <td className="p-4 text-white">{b.user?.name || 'N/A'}</td>
                      <td className="p-4 text-gray-300">{b.room?.name || 'N/A'}</td>
                      <td className="p-4 text-gray-400">{formatDate(b.checkIn)}</td>
                      <td className="p-4 text-gray-400">{formatDate(b.checkOut)}</td>
                      <td className="p-4 text-gray-300">{b.guests}</td>
                      <td className="p-4 text-gold">{formatCurrency(b.totalPrice)}</td>
                      <td className="p-4">
                        <span className={`text-xs px-2 py-1 rounded-full border capitalize ${getStatusColor(b.status)}`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <select
                          value={b.status}
                          onChange={(e) => handleStatusChange(b._id, e.target.value)}
                          className="bg-dark-light border border-dark-lighter rounded-lg px-2 py-1 text-xs text-gray-300 focus:border-gold focus:outline-none"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-gray-500">
                        No bookings found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageBookings;
