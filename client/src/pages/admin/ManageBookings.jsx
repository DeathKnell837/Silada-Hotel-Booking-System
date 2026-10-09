import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaSignInAlt,
  FaSignOutAlt,
  FaSearch,
  FaTimes,
  FaUndo,
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import { bookingService } from '../../services/dataService';
import {
  formatCurrency,
  formatDate,
  getStatusColor,
} from '../../utils/helpers';
import Spinner from '../../components/common/Spinner';

// Helper to normalize any date value to YYYY-MM-DD
const toDateString = (dateVal) => {
  if (!dateVal) return '';
  if (typeof dateVal === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateVal)) {
    return dateVal;
  }
  const d = new Date(dateVal);
  if (isNaN(d.getTime())) return '';
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Check if a date value matches target YYYY-MM-DD string
const isSameDate = (dateVal, targetDateStr) => {
  if (!dateVal || !targetDateStr) return false;
  if (typeof dateVal === 'string' && dateVal.startsWith(targetDateStr)) {
    return true;
  }
  return toDateString(dateVal) === targetDateStr;
};

// Check if a booking is in-house on target date (checkIn <= target < checkOut)
const isStayingOnDate = (checkInVal, checkOutVal, targetDateStr) => {
  if (!checkInVal || !checkOutVal || !targetDateStr) return false;
  const inStr = toDateString(checkInVal);
  const outStr = toDateString(checkOutVal);
  if (!inStr || !outStr) return false;
  return targetDateStr >= inStr && targetDateStr < outStr;
};

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedDate, setSelectedDate] = useState('');
  const [dateFilterType, setDateFilterType] = useState('all'); // 'all' | 'checkIn' | 'checkOut' | 'staying'
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    bookingService
      .getAll()
      .then(({ data }) => setBookings(data))
      .catch(() => toast.error('Failed to load bookings'))
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await bookingService.updateStatus(id, status);
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status } : b))
      );
      toast.success(`Status updated to ${status}`);
    } catch {
      toast.error('Failed to update status');
    }
  };

  // Compact stats calculation for the selected date
  const stats = useMemo(() => {
    if (!selectedDate) {
      return { checkInsCount: 0, checkOutsCount: 0, stayingCount: 0 };
    }
    const checkIns = bookings.filter((b) => isSameDate(b.checkIn, selectedDate));
    const checkOuts = bookings.filter((b) => isSameDate(b.checkOut, selectedDate));
    const staying = bookings.filter((b) => isStayingOnDate(b.checkIn, b.checkOut, selectedDate));

    return {
      checkInsCount: checkIns.length,
      checkOutsCount: checkOuts.length,
      stayingCount: staying.length,
    };
  }, [bookings, selectedDate]);

  // Filtered bookings
  const filtered = useMemo(() => {
    return bookings.filter((b) => {
      // 1. Status Filter
      if (statusFilter !== 'all' && b.status !== statusFilter) {
        return false;
      }

      // 2. Date Filter
      if (selectedDate) {
        const isArrival = isSameDate(b.checkIn, selectedDate);
        const isDeparture = isSameDate(b.checkOut, selectedDate);
        const isStaying = isStayingOnDate(b.checkIn, b.checkOut, selectedDate);

        if (dateFilterType === 'checkIn') {
          if (!isArrival) return false;
        } else if (dateFilterType === 'checkOut') {
          if (!isDeparture) return false;
        } else if (dateFilterType === 'staying') {
          if (!isStaying) return false;
        } else if (dateFilterType === 'all') {
          if (!isArrival && !isDeparture && !isStaying) return false;
        }
      }

      // 3. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const guestName = (b.user?.name || '').toLowerCase();
        const guestEmail = (b.user?.email || '').toLowerCase();
        const roomName = (b.room?.name || '').toLowerCase();
        const roomType = (b.room?.type || '').toLowerCase();
        if (
          !guestName.includes(q) &&
          !guestEmail.includes(q) &&
          !roomName.includes(q) &&
          !roomType.includes(q)
        ) {
          return false;
        }
      }

      return true;
    });
  }, [bookings, statusFilter, selectedDate, dateFilterType, searchQuery]);

  // Dynamic status counts reflecting date and search filters
  const statusCounts = useMemo(() => {
    const baseList = bookings.filter((b) => {
      if (selectedDate) {
        const isArrival = isSameDate(b.checkIn, selectedDate);
        const isDeparture = isSameDate(b.checkOut, selectedDate);
        const isStaying = isStayingOnDate(b.checkIn, b.checkOut, selectedDate);

        if (dateFilterType === 'checkIn') {
          if (!isArrival) return false;
        } else if (dateFilterType === 'checkOut') {
          if (!isDeparture) return false;
        } else if (dateFilterType === 'staying') {
          if (!isStaying) return false;
        } else if (dateFilterType === 'all') {
          if (!isArrival && !isDeparture && !isStaying) return false;
        }
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const guestName = (b.user?.name || '').toLowerCase();
        const guestEmail = (b.user?.email || '').toLowerCase();
        const roomName = (b.room?.name || '').toLowerCase();
        const roomType = (b.room?.type || '').toLowerCase();
        if (
          !guestName.includes(q) &&
          !guestEmail.includes(q) &&
          !roomName.includes(q) &&
          !roomType.includes(q)
        ) {
          return false;
        }
      }
      return true;
    });

    return {
      all: baseList.length,
      pending: baseList.filter((b) => b.status === 'pending').length,
      confirmed: baseList.filter((b) => b.status === 'confirmed').length,
      completed: baseList.filter((b) => b.status === 'completed').length,
      cancelled: baseList.filter((b) => b.status === 'cancelled').length,
    };
  }, [bookings, selectedDate, dateFilterType, searchQuery]);

  const handleResetFilters = () => {
    setSelectedDate('');
    setDateFilterType('all');
    setStatusFilter('all');
    setSearchQuery('');
  };

  const isFilterActive =
    Boolean(selectedDate) ||
    dateFilterType !== 'all' ||
    Boolean(searchQuery.trim()) ||
    statusFilter !== 'all';

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
          <div className="flex items-center gap-4">
            <Link
              to="/admin"
              className="text-gray-400 hover:text-gold transition-colors p-2 rounded-lg hover:bg-gold/10"
              title="Back to Dashboard"
            >
              <FaArrowLeft />
            </Link>
            <div>
              <p className="text-gold tracking-[0.2em] uppercase text-xs">Administration</p>
              <h1 className="font-serif text-2xl md:text-3xl text-white">Manage Bookings</h1>
            </div>
          </div>
        </div>
        <div className="h-0.5 w-16 bg-gold/40 mb-6" />

        {/* ======================================================== */}
        {/* COMPACT OPTIMIZED FILTER & SEARCH TOOLBAR                 */}
        {/* ======================================================== */}
        <div className="glass-card rounded-xl p-3 mb-6 flex flex-wrap items-center justify-between gap-3 border border-gold/15 bg-dark-surface/40">
          {/* Left Controls: Date Picker, Movement Filter, Status Dropdown, and Inline Counters */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* 1. Date Picker */}
            <div className="flex items-center gap-1.5 bg-dark border border-dark-lighter rounded-lg px-2.5 py-1.5 focus-within:border-gold transition-colors">
              <FaCalendarAlt className="text-gold text-xs" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent text-xs text-white focus:outline-none cursor-pointer"
                title="Filter by date"
              />
              {selectedDate && (
                <button
                  type="button"
                  onClick={() => setSelectedDate('')}
                  className="text-gray-400 hover:text-red-400 text-xs ml-1 transition-colors"
                  title="Clear Date"
                >
                  <FaTimes />
                </button>
              )}
            </div>

            {/* 2. Schedule Movement Dropdown */}
            <select
              value={dateFilterType}
              onChange={(e) => setDateFilterType(e.target.value)}
              className="bg-dark border border-dark-lighter rounded-lg px-3 py-2 text-xs text-gray-200 focus:border-gold focus:outline-none cursor-pointer"
            >
              <option value="all">Schedule: All Movements</option>
              <option value="checkIn">Check-Ins (Arrivals / Nag-book)</option>
              <option value="checkOut">Check-Outs (Departures / Mag-hawa)</option>
              <option value="staying">In-House Stays Only</option>
            </select>

            {/* 3. Status Dropdown (Replacing old bulky tabs) */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-dark border border-dark-lighter rounded-lg px-3 py-2 text-xs text-gray-200 focus:border-gold focus:outline-none cursor-pointer"
            >
              <option value="all">Status: All ({statusCounts.all})</option>
              <option value="pending">Pending ({statusCounts.pending})</option>
              <option value="confirmed">Confirmed ({statusCounts.confirmed})</option>
              <option value="completed">Completed ({statusCounts.completed})</option>
              <option value="cancelled">Cancelled ({statusCounts.cancelled})</option>
            </select>

            {/* 4. Compact Live Counts Pill ("Pila mag-hawa ug pila nag-book") */}
            {selectedDate && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-dark/70 border border-gold/25 text-xs">
                <span className="text-emerald-400 font-medium flex items-center gap-1">
                  <FaSignInAlt className="text-[10px]" /> Check-Ins: <strong>{stats.checkInsCount}</strong>
                </span>
                <span className="text-gray-500">•</span>
                <span className="text-amber-400 font-medium flex items-center gap-1">
                  <FaSignOutAlt className="text-[10px]" /> Check-Outs: <strong>{stats.checkOutsCount}</strong>
                </span>
              </div>
            )}

            {/* Reset Button (only shown when any filter is active) */}
            {isFilterActive && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-2.5 py-1.5 text-xs text-gold hover:text-white rounded-lg hover:bg-gold/10 flex items-center gap-1 transition-colors"
                title="Reset all filters"
              >
                <FaUndo className="text-[10px]" /> Reset
              </button>
            )}
          </div>

          {/* Right Side: Search Input with Joined Search Button */}
          <div className="flex items-center">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search guest or room..."
                className="bg-dark border border-dark-lighter rounded-l-lg pl-3 pr-7 py-2 text-xs text-white placeholder-gray-500 focus:border-gold focus:outline-none w-48 sm:w-64 transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-2.5 text-xs text-gray-400 hover:text-white"
                >
                  <FaTimes />
                </button>
              )}
            </div>
            <button
              type="button"
              className="bg-gold text-dark px-3 py-2 rounded-r-lg text-xs font-semibold hover:bg-gold-light transition-colors flex items-center gap-1.5 border border-gold"
            >
              <FaSearch className="text-[11px]" /> Search
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* TABLE OF BOOKINGS                                         */}
        {/* ======================================================== */}
        {loading ? (
          <Spinner />
        ) : (
          <div className="glass-card rounded-2xl overflow-hidden shadow-2xl border border-gold/15">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gold/10 bg-dark-surface/50">
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
                  {filtered.map((b) => {
                    const isArrivalToday = selectedDate && isSameDate(b.checkIn, selectedDate);
                    const isDepartureToday = selectedDate && isSameDate(b.checkOut, selectedDate);

                    return (
                      <tr
                        key={b._id}
                        className="border-b border-dark-lighter/50 hover:bg-gold/5 transition-colors"
                      >
                        {/* Guest */}
                        <td className="p-4 text-white">
                          <div className="font-medium">{b.user?.name || 'N/A'}</div>
                          {b.user?.email && (
                            <div className="text-xs text-gray-400">{b.user.email}</div>
                          )}
                        </td>

                        {/* Room */}
                        <td className="p-4 text-gray-300">
                          <div>{b.room?.name || 'N/A'}</div>
                          {b.room?.type && (
                            <span className="text-[11px] text-gold/80">{b.room.type}</span>
                          )}
                        </td>

                        {/* Check-In */}
                        <td className="p-4 text-gray-300">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span>{formatDate(b.checkIn)}</span>
                            {isArrivalToday && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                <FaSignInAlt className="text-[9px]" /> Check-In
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Check-Out */}
                        <td className="p-4 text-gray-300">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span>{formatDate(b.checkOut)}</span>
                            {isDepartureToday && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                                <FaSignOutAlt className="text-[9px]" /> Check-Out
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Guests */}
                        <td className="p-4 text-gray-300">{b.guests}</td>

                        {/* Amount */}
                        <td className="p-4 text-gold font-medium">
                          {formatCurrency(b.totalPrice)}
                        </td>

                        {/* Status */}
                        <td className="p-4">
                          <span
                            className={`text-xs px-2.5 py-1 rounded-full border capitalize inline-block ${getStatusColor(
                              b.status
                            )}`}
                          >
                            {b.status}
                          </span>
                        </td>

                        {/* Action */}
                        <td className="p-4">
                          <select
                            value={b.status}
                            onChange={(e) => handleStatusChange(b._id, e.target.value)}
                            className="bg-dark-light border border-dark-lighter rounded-lg px-2.5 py-1 text-xs text-gray-200 focus:border-gold focus:outline-none cursor-pointer"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })}

                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={8} className="p-12 text-center text-gray-400">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <p className="text-base text-gray-300 font-medium">
                            No bookings found matching selected filters.
                          </p>
                          {isFilterActive && (
                            <button
                              type="button"
                              onClick={handleResetFilters}
                              className="mt-1 px-3 py-1.5 rounded-lg bg-gold text-dark text-xs font-semibold hover:bg-gold-light transition-all flex items-center gap-1.5"
                            >
                              <FaUndo /> Reset All Filters
                            </button>
                          )}
                        </div>
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
