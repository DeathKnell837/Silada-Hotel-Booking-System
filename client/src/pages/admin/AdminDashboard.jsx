import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaCalendarCheck, FaDollarSign, FaBed, FaUsers,
  FaChartLine, FaArrowUp, FaArrowDown, FaHotel,
} from 'react-icons/fa';
import { bookingService, roomService, userService } from '../../services/dataService';
import { formatCurrency, formatDate, getStatusColor } from '../../utils/helpers';
import Spinner from '../../components/common/Spinner';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ bookings: 0, revenue: 0, rooms: 0, users: 0 });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingsRes, roomsRes, usersRes] = await Promise.all([
          bookingService.getAll(),
          roomService.getAll(),
          userService.getAll(),
        ]);

        const bookings = bookingsRes.data;
        const revenue = bookings
          .filter((b) => b.status !== 'cancelled')
          .reduce((sum, b) => sum + b.totalPrice, 0);

        setStats({
          bookings: bookings.length,
          revenue,
          rooms: roomsRes.data.length,
          users: usersRes.data.length,
        });
        setRecentBookings(bookings.slice(0, 5));
      } catch {
        // silently fail
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const statCards = [
    {
      icon: FaCalendarCheck, label: 'Total Bookings', value: stats.bookings,
      color: 'from-blue-500/20 to-blue-600/10', iconColor: 'text-blue-400',
    },
    {
      icon: FaDollarSign, label: 'Revenue', value: formatCurrency(stats.revenue),
      color: 'from-green-500/20 to-green-600/10', iconColor: 'text-green-400',
    },
    {
      icon: FaBed, label: 'Total Rooms', value: stats.rooms,
      color: 'from-purple-500/20 to-purple-600/10', iconColor: 'text-purple-400',
    },
    {
      icon: FaUsers, label: 'Registered Users', value: stats.users,
      color: 'from-gold/20 to-gold/10', iconColor: 'text-gold',
    },
  ];

  const adminLinks = [
    { to: '/admin/rooms', icon: FaBed, label: 'Manage Rooms', desc: 'Add, edit, or remove rooms' },
    { to: '/admin/bookings', icon: FaCalendarCheck, label: 'Manage Bookings', desc: 'View and update booking status' },
    { to: '/admin/users', icon: FaUsers, label: 'Manage Users', desc: 'View and manage user accounts' },
  ];

  if (loading) return <div className="pt-32"><Spinner size="lg" /></div>;

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <p className="text-gold tracking-[0.3em] uppercase text-sm mb-2">Administration</p>
          <h1 className="font-serif text-3xl md:text-4xl text-white">Dashboard</h1>
          <div className="h-0.5 w-16 bg-gold/40 mt-4" />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {statCards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`glass-card rounded-2xl p-6 bg-gradient-to-br ${card.color}`}
            >
              <div className="flex items-center justify-between mb-4">
                <card.icon className={`text-2xl ${card.iconColor}`} />
                <FaChartLine className="text-gray-600" />
              </div>
              <p className="text-gray-400 text-sm">{card.label}</p>
              <p className="text-white text-2xl font-bold mt-1">{card.value}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div>
            <h2 className="font-serif text-xl text-white mb-4">Quick Actions</h2>
            <div className="space-y-3">
              {adminLinks.map((link, i) => (
                <Link
                  key={i}
                  to={link.to}
                  className="glass-card rounded-xl p-4 flex items-center gap-4 hover:border-gold/30 transition-all group block"
                >
                  <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center flex-shrink-0">
                    <link.icon className="text-gold" />
                  </div>
                  <div>
                    <p className="text-white font-medium group-hover:text-gold transition-colors">
                      {link.label}
                    </p>
                    <p className="text-gray-500 text-xs">{link.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Bookings */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-xl text-white">Recent Bookings</h2>
              <Link to="/admin/bookings" className="text-gold text-sm hover:text-gold-light transition-colors">
                View All →
              </Link>
            </div>
            <div className="glass-card rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gold/10">
                      <th className="text-left p-4 text-gray-400 font-medium">Guest</th>
                      <th className="text-left p-4 text-gray-400 font-medium">Room</th>
                      <th className="text-left p-4 text-gray-400 font-medium">Date</th>
                      <th className="text-left p-4 text-gray-400 font-medium">Amount</th>
                      <th className="text-left p-4 text-gray-400 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentBookings.map((b) => (
                      <tr key={b._id} className="border-b border-dark-lighter/50 hover:bg-gold/5 transition-colors">
                        <td className="p-4 text-white">{b.user?.name || 'N/A'}</td>
                        <td className="p-4 text-gray-300">{b.room?.name || 'N/A'}</td>
                        <td className="p-4 text-gray-400">{formatDate(b.checkIn)}</td>
                        <td className="p-4 text-gold">{formatCurrency(b.totalPrice)}</td>
                        <td className="p-4">
                          <span className={`text-xs px-2 py-1 rounded-full border capitalize ${getStatusColor(b.status)}`}>
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {recentBookings.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-gray-500">
                          No bookings yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
