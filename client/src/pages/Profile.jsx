import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaPhone, FaCalendarAlt, FaHotel, FaTimes, FaEdit, FaSave } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { bookingService } from '../services/dataService';
import { formatCurrency, formatDate, getStatusColor } from '../utils/helpers';
import Spinner from '../components/common/Spinner';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [saving, setSaving] = useState(false);
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    if (user) {
      setForm({ name: user.name, email: user.email, phone: user.phone || '' });
    }
    bookingService.getMyBookings()
      .then(({ data }) => setBookings(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(form);
      toast.success('Profile updated!');
      setEditing(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
    setSaving(false);
  };

  const handleCancelBooking = async (id) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    setCancellingId(id);
    try {
      await bookingService.cancel(id);
      setBookings(bookings.map((b) => (b._id === id ? { ...b, status: 'cancelled' } : b)));
      toast.success('Booking cancelled');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cancellation failed');
    }
    setCancellingId(null);
  };

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <p className="text-gold tracking-[0.3em] uppercase text-sm mb-2">My Account</p>
          <h1 className="font-serif text-3xl md:text-4xl text-white">Profile</h1>
          <div className="h-0.5 w-16 bg-gold/40 mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card gold-border-glow rounded-2xl p-6"
            >
              <div className="text-center mb-6">
                <div className="w-20 h-20 mx-auto rounded-full bg-gold/20 border-2 border-gold flex items-center justify-center mb-4">
                  <FaUser className="text-gold text-2xl" />
                </div>
                <h2 className="font-serif text-xl text-white">{user?.name}</h2>
                <p className="text-gold text-sm capitalize">{user?.role}</p>
              </div>

              {editing ? (
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div>
                    <label className="text-gray-500 text-xs">Name</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="input-dark text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-gray-500 text-xs">Email</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="input-dark text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-gray-500 text-xs">Phone</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="input-dark text-sm"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button type="submit" disabled={saving} className="btn-gold flex-1 text-sm !py-2">
                      <FaSave className="inline mr-1" /> {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditing(false)}
                      className="btn-outline-gold flex-1 text-sm !py-2"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <FaEnvelope className="text-gold flex-shrink-0" />
                      <span className="text-gray-300 text-sm truncate">{user?.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <FaPhone className="text-gold flex-shrink-0" />
                      <span className="text-gray-300 text-sm">{user?.phone || 'Not set'}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setEditing(true)}
                    className="btn-outline-gold w-full mt-6 text-sm !py-2"
                  >
                    <FaEdit className="inline mr-2" /> Edit Profile
                  </button>
                </>
              )}
            </motion.div>
          </div>

          {/* Bookings */}
          <div className="lg:col-span-2">
            <h2 className="font-serif text-2xl text-white mb-6">My Bookings</h2>

            {loading ? (
              <Spinner />
            ) : bookings.length === 0 ? (
              <div className="glass-card rounded-2xl p-10 text-center">
                <FaHotel className="text-gold/30 text-5xl mx-auto mb-4" />
                <p className="text-gray-400 mb-4">No bookings yet</p>
                <a href="/rooms" className="btn-gold text-sm inline-block">
                  Explore Rooms
                </a>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking, i) => (
                  <motion.div
                    key={booking._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="glass-card rounded-xl overflow-hidden"
                  >
                    <div className="flex flex-col sm:flex-row">
                      <img
                        src={
                          booking.room?.images?.[0] ||
                          'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=400'
                        }
                        alt={booking.room?.name}
                        className="w-full sm:w-40 h-32 object-cover"
                      />
                      <div className="flex-1 p-4">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="text-white font-semibold">{booking.room?.name || 'Room'}</h3>
                            <p className="text-gold text-xs">{booking.room?.type}</p>
                          </div>
                          <span
                            className={`text-xs px-3 py-1 rounded-full border capitalize ${getStatusColor(booking.status)}`}
                          >
                            {booking.status}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-4 mt-3 text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <FaCalendarAlt className="text-gold/60" />
                            {formatDate(booking.checkIn)} — {formatDate(booking.checkOut)}
                          </span>
                          <span>{booking.guests} Guest(s)</span>
                          <span className="text-gold font-semibold">
                            {formatCurrency(booking.totalPrice)}
                          </span>
                        </div>
                        {booking.status === 'pending' && (
                          <button
                            onClick={() => handleCancelBooking(booking._id)}
                            disabled={cancellingId === booking._id}
                            className="mt-3 text-red-400 hover:text-red-300 text-xs flex items-center gap-1 transition-colors disabled:opacity-50"
                          >
                            <FaTimes /> {cancellingId === booking._id ? 'Cancelling...' : 'Cancel Booking'}
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
