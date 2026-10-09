import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaArrowLeft,
  FaFilter,
  FaCalendarAlt,
  FaCalendarDay,
  FaCalendarCheck,
  FaSignInAlt,
  FaSignOutAlt,
  FaUsers,
  FaBed,
  FaSearch,
  FaTimes,
  FaUndo,
  FaDoorOpen,
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import { bookingService } from '../../services/dataService';
import {
  formatCurrency,
  formatDate,
  getStatusColor,
  getTodayString,
  getTomorrowString,
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
  const [dateFilterType, setDateFilterType] = useState('all'); // 'all' | 'checkIn' | 'checkOut' | 'staying' | 'bookedOn'
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

  // Date used for statistics calculation (defaults to selectedDate or today)
  const statsDate = selectedDate || getTodayString();

  // Statistics for the chosen date (Nag-book / Check-In, Mag-hawa / Check-Out, In-house)
  const stats = useMemo(() => {
    // Check-Ins on statsDate ("Pila nag-book / Check-In sa petsa")
    const checkIns = bookings.filter((b) => isSameDate(b.checkIn, statsDate));
    const activeCheckIns = checkIns.filter((b) => b.status !== 'cancelled');
    const checkInGuests = activeCheckIns.reduce(
      (sum, b) => sum + (Number(b.guests) || 1),
      0
    );

    // Check-Outs on statsDate ("Pila mag-hawa / Check-Out sa petsa")
    const checkOuts = bookings.filter((b) => isSameDate(b.checkOut, statsDate));
    const activeCheckOuts = checkOuts.filter((b) => b.status !== 'cancelled');
    const checkOutGuests = activeCheckOuts.reduce(
      (sum, b) => sum + (Number(b.guests) || 1),
      0
    );

    // In-House / Staying on statsDate
    const staying = bookings.filter((b) =>
      isStayingOnDate(b.checkIn, b.checkOut, statsDate)
    );
    const activeStaying = staying.filter((b) => b.status !== 'cancelled');
    const stayingGuests = activeStaying.reduce(
      (sum, b) => sum + (Number(b.guests) || 1),
      0
    );

    // Created on this date
    const bookedOn = bookings.filter((b) => isSameDate(b.createdAt, statsDate));

    // Unique bookings with any activity on this date
    const totalOnDate = new Set([
      ...checkIns.map((b) => b._id),
      ...checkOuts.map((b) => b._id),
      ...staying.map((b) => b._id),
    ]).size;

    return {
      checkInsCount: checkIns.length,
      activeCheckInsCount: activeCheckIns.length,
      checkInGuests,
      checkOutsCount: checkOuts.length,
      activeCheckOutsCount: activeCheckOuts.length,
      checkOutGuests,
      stayingCount: staying.length,
      activeStayingCount: activeStaying.length,
      stayingGuests,
      bookedOnCount: bookedOn.length,
      totalOnDate,
    };
  }, [bookings, statsDate]);

  // Filtered bookings list based on Date, Movement type, Search Query, and Status
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
        const isBookedOn = isSameDate(b.createdAt, selectedDate);

        if (dateFilterType === 'checkIn') {
          if (!isArrival) return false;
        } else if (dateFilterType === 'checkOut') {
          if (!isDeparture) return false;
        } else if (dateFilterType === 'staying') {
          if (!isStaying) return false;
        } else if (dateFilterType === 'bookedOn') {
          if (!isBookedOn) return false;
        } else if (dateFilterType === 'all') {
          // Show any booking related to this date (arrival, departure, staying)
          if (!isArrival && !isDeparture && !isStaying) return false;
        }
      }

      // 3. Search Query (Guest name, email, room name, room type)
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

  // Status counts reflecting the currently active date and search criteria
  const statusCounts = useMemo(() => {
    const baseList = bookings.filter((b) => {
      if (selectedDate) {
        const isArrival = isSameDate(b.checkIn, selectedDate);
        const isDeparture = isSameDate(b.checkOut, selectedDate);
        const isStaying = isStayingOnDate(b.checkIn, b.checkOut, selectedDate);
        const isBookedOn = isSameDate(b.createdAt, selectedDate);

        if (dateFilterType === 'checkIn') {
          if (!isArrival) return false;
        } else if (dateFilterType === 'checkOut') {
          if (!isDeparture) return false;
        } else if (dateFilterType === 'staying') {
          if (!isStaying) return false;
        } else if (dateFilterType === 'bookedOn') {
          if (!isBookedOn) return false;
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

  // Reset all filters to default
  const handleResetFilters = () => {
    setSelectedDate('');
    setDateFilterType('all');
    setStatusFilter('all');
    setSearchQuery('');
  };

  // Helper to quickly apply a date
  const handleSetQuickDate = (dateStr) => {
    setSelectedDate(dateStr);
    if (dateFilterType === 'all') {
      // keep 'all' or default
    }
  };

  // Handle clicking KPI card to filter
  const handleCardClick = (type) => {
    if (!selectedDate) {
      setSelectedDate(statsDate);
    }
    setDateFilterType((prev) => (prev === type ? 'all' : type));
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

          {isFilterActive && (
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-gold border border-gold/40 hover:bg-gold/10 transition-colors"
            >
              <FaUndo className="text-[10px]" /> Reset All Filters
            </button>
          )}
        </div>
        <div className="h-0.5 w-16 bg-gold/40 mb-8" />

        {/* ======================================================== */}
        {/* SCHEDULE & DATE FILTER CONTROL PANEL                      */}
        {/* ======================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-5 md:p-6 mb-8 border border-gold/20 shadow-xl bg-gradient-to-br from-dark-light/50 via-dark-surface/40 to-dark/80"
        >
          {/* Panel Header */}
          <div className="flex items-center justify-between flex-wrap gap-3 pb-4 mb-5 border-b border-gold/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gold/15 border border-gold/30 flex items-center justify-center text-gold shadow-inner">
                <FaFilter className="text-base" />
              </div>
              <div>
                <h2 className="text-white font-serif text-lg font-semibold flex items-center gap-2">
                  Date & Schedule Filter
                  <span className="text-[11px] font-sans font-normal text-gold bg-gold/10 border border-gold/20 px-2 py-0.5 rounded-full">
                    Arrivals & Departures
                  </span>
                </h2>
                <p className="text-xs text-gray-400">
                  Filter bookings by check-in (arrivals), check-out (departures), or guest stays
                </p>
              </div>
            </div>

            {/* Quick Date Presets */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-gray-400 font-medium mr-1">Quick Date:</span>
              <button
                type="button"
                onClick={() => handleSetQuickDate(getTodayString())}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                  selectedDate === getTodayString()
                    ? 'bg-gold text-dark font-semibold shadow-md'
                    : 'bg-dark border border-dark-lighter text-gray-300 hover:border-gold hover:text-gold'
                }`}
              >
                <FaCalendarDay className="text-[11px]" /> Today
              </button>
              <button
                type="button"
                onClick={() => handleSetQuickDate(getTomorrowString())}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                  selectedDate === getTomorrowString()
                    ? 'bg-gold text-dark font-semibold shadow-md'
                    : 'bg-dark border border-dark-lighter text-gray-300 hover:border-gold hover:text-gold'
                }`}
              >
                <FaCalendarAlt className="text-[11px]" /> Tomorrow
              </button>
              {selectedDate && (
                <button
                  type="button"
                  onClick={() => setSelectedDate('')}
                  className="px-2.5 py-1.5 rounded-lg text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/20 transition-all flex items-center gap-1"
                  title="Clear Selected Date"
                >
                  <FaTimes /> Clear Date
                </button>
              )}
            </div>
          </div>

          {/* Controls: Date Picker, Movement Filter, and Search Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {/* 1. Date Input */}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5 flex items-center gap-1.5">
                <FaCalendarAlt className="text-gold" /> Filter by Specific Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full bg-dark/90 border border-gold/30 rounded-xl px-4 py-2.5 text-sm text-white focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold transition-all"
                />
              </div>
            </div>

            {/* 2. Movement / Schedule Type */}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5 flex items-center gap-1.5">
                <FaDoorOpen className="text-gold" /> Schedule Movement Filter
              </label>
              <select
                value={dateFilterType}
                onChange={(e) => setDateFilterType(e.target.value)}
                className="w-full bg-dark/90 border border-gold/30 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold transition-all"
              >
                <option value="all">All Related (Check-Ins & Check-Outs)</option>
                <option value="checkIn">Check-Ins / Arrivals Only (Nag-book sa Petsa)</option>
                <option value="checkOut">Check-Outs / Departures Only (Mag-hawa sa Petsa)</option>
                <option value="staying">In-House Stays Only (Currently Staying)</option>
                <option value="bookedOn">Booked On Date (Reservation Created Date)</option>
              </select>
            </div>

            {/* 3. Search Bar */}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5 flex items-center gap-1.5">
                <FaSearch className="text-gold" /> Search Guest / Room
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search name, email, room..."
                  className="w-full bg-dark/90 border border-dark-lighter rounded-xl pl-9 pr-8 py-2.5 text-sm text-white placeholder-gray-500 focus:border-gold focus:outline-none transition-all"
                />
                <FaSearch className="absolute left-3 top-3.5 text-xs text-gray-500" />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-3 text-xs text-gray-400 hover:text-white"
                  >
                    <FaTimes />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* STATS SUMMARY KPI CARDS ("Pila mag hawa ug pila nag book") */}
          {/* ======================================================== */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-2">
                <span>Daily Movements for</span>
                <span className="text-gold font-bold">
                  {selectedDate ? formatDate(selectedDate + 'T00:00:00') : `Today (${formatDate(statsDate + 'T00:00:00')})`}
                </span>
                {!selectedDate && (
                  <span className="text-[10px] text-gray-500 font-normal italic">
                    (Pick a date above to inspect other dates)
                  </span>
                )}
              </p>
              {dateFilterType !== 'all' && (
                <span className="text-[11px] text-gold/80 bg-gold/10 px-2 py-0.5 rounded border border-gold/20">
                  Filtered by: {dateFilterType}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Check-Ins / Arrivals ("Pila nag book") */}
              <div
                onClick={() => handleCardClick('checkIn')}
                role="button"
                tabIndex={0}
                className={`rounded-xl p-4 border transition-all cursor-pointer relative overflow-hidden group ${
                  dateFilterType === 'checkIn' && selectedDate
                    ? 'bg-emerald-500/20 border-emerald-400 ring-2 ring-emerald-500/40 shadow-lg shadow-emerald-950/40'
                    : 'bg-dark/60 border-emerald-500/30 hover:border-emerald-500/60 hover:bg-emerald-500/10'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <FaSignInAlt className="text-sm" />
                    </div>
                    <div>
                      <h3 className="text-white text-xs font-semibold">Check-Ins / Arrivals</h3>
                      <p className="text-[10px] text-emerald-400/90 font-medium">Nag-book for this date</p>
                    </div>
                  </div>
                  {dateFilterType === 'checkIn' && selectedDate && (
                    <span className="text-[10px] bg-emerald-500 text-dark font-bold px-1.5 py-0.5 rounded">
                      ACTIVE
                    </span>
                  )}
                </div>
                <div className="mt-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold font-serif text-white">
                      {stats.checkInsCount}
                    </span>
                    <span className="text-xs text-gray-400">Bookings</span>
                  </div>
                  <p className="text-xs text-emerald-300/80 mt-1 flex items-center gap-1">
                    <FaUsers className="text-[10px]" /> {stats.checkInGuests} Guest(s) arriving
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-emerald-500/20 flex items-center justify-between text-[11px] text-emerald-400 group-hover:underline">
                  <span>Click to view arrivals</span>
                  <span>→</span>
                </div>
              </div>

              {/* Card 2: Check-Outs / Departures ("Pila mag hawa") */}
              <div
                onClick={() => handleCardClick('checkOut')}
                role="button"
                tabIndex={0}
                className={`rounded-xl p-4 border transition-all cursor-pointer relative overflow-hidden group ${
                  dateFilterType === 'checkOut' && selectedDate
                    ? 'bg-amber-500/20 border-amber-400 ring-2 ring-amber-500/40 shadow-lg shadow-amber-950/40'
                    : 'bg-dark/60 border-amber-500/30 hover:border-amber-500/60 hover:bg-amber-500/10'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                      <FaSignOutAlt className="text-sm" />
                    </div>
                    <div>
                      <h3 className="text-white text-xs font-semibold">Check-Outs / Departures</h3>
                      <p className="text-[10px] text-amber-400/90 font-medium">Mag-hawa on this date</p>
                    </div>
                  </div>
                  {dateFilterType === 'checkOut' && selectedDate && (
                    <span className="text-[10px] bg-amber-500 text-dark font-bold px-1.5 py-0.5 rounded">
                      ACTIVE
                    </span>
                  )}
                </div>
                <div className="mt-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold font-serif text-white">
                      {stats.checkOutsCount}
                    </span>
                    <span className="text-xs text-gray-400">Bookings</span>
                  </div>
                  <p className="text-xs text-amber-300/80 mt-1 flex items-center gap-1">
                    <FaUsers className="text-[10px]" /> {stats.checkOutGuests} Guest(s) departing
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-amber-500/20 flex items-center justify-between text-[11px] text-amber-400 group-hover:underline">
                  <span>Click to view departures</span>
                  <span>→</span>
                </div>
              </div>

              {/* Card 3: In-House / Staying */}
              <div
                onClick={() => handleCardClick('staying')}
                role="button"
                tabIndex={0}
                className={`rounded-xl p-4 border transition-all cursor-pointer relative overflow-hidden group ${
                  dateFilterType === 'staying' && selectedDate
                    ? 'bg-blue-500/20 border-blue-400 ring-2 ring-blue-500/40 shadow-lg shadow-blue-950/40'
                    : 'bg-dark/60 border-blue-500/30 hover:border-blue-500/60 hover:bg-blue-500/10'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                      <FaBed className="text-sm" />
                    </div>
                    <div>
                      <h3 className="text-white text-xs font-semibold">In-House Stays</h3>
                      <p className="text-[10px] text-blue-400/90 font-medium">Currently staying</p>
                    </div>
                  </div>
                  {dateFilterType === 'staying' && selectedDate && (
                    <span className="text-[10px] bg-blue-500 text-dark font-bold px-1.5 py-0.5 rounded">
                      ACTIVE
                    </span>
                  )}
                </div>
                <div className="mt-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold font-serif text-white">
                      {stats.stayingCount}
                    </span>
                    <span className="text-xs text-gray-400">Bookings</span>
                  </div>
                  <p className="text-xs text-blue-300/80 mt-1 flex items-center gap-1">
                    <FaUsers className="text-[10px]" /> {stats.stayingGuests} Guest(s) in-house
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-blue-500/20 flex items-center justify-between text-[11px] text-blue-400 group-hover:underline">
                  <span>Click to view staying guests</span>
                  <span>→</span>
                </div>
              </div>

              {/* Card 4: Total Related on Date */}
              <div
                onClick={() => handleCardClick('all')}
                role="button"
                tabIndex={0}
                className={`rounded-xl p-4 border transition-all cursor-pointer relative overflow-hidden group ${
                  dateFilterType === 'all' && selectedDate
                    ? 'bg-gold/20 border-gold ring-2 ring-gold/40 shadow-lg shadow-gold/10'
                    : 'bg-dark/60 border-gold/30 hover:border-gold/60 hover:bg-gold/10'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gold/20 text-gold flex items-center justify-center">
                      <FaCalendarCheck className="text-sm" />
                    </div>
                    <div>
                      <h3 className="text-white text-xs font-semibold">Total Movements</h3>
                      <p className="text-[10px] text-gold/90 font-medium">All date activities</p>
                    </div>
                  </div>
                  {dateFilterType === 'all' && selectedDate && (
                    <span className="text-[10px] bg-gold text-dark font-bold px-1.5 py-0.5 rounded">
                      ACTIVE
                    </span>
                  )}
                </div>
                <div className="mt-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold font-serif text-gold">
                      {stats.totalOnDate}
                    </span>
                    <span className="text-xs text-gray-400">Bookings</span>
                  </div>
                  <p className="text-xs text-gray-300 mt-1">
                    Arrivals + Departures + Stays
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-gold/20 flex items-center justify-between text-[11px] text-gold group-hover:underline">
                  <span>Click to show all on date</span>
                  <span>→</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ======================================================== */}
        {/* STATUS FILTER TABS                                        */}
        {/* ======================================================== */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-4 py-2 rounded-lg text-sm capitalize transition-all ${
                  statusFilter === s
                    ? 'bg-gold text-dark font-semibold shadow-lg'
                    : 'glass-card text-gray-400 hover:text-gold'
                }`}
              >
                {s} ({statusCounts[s]})
              </button>
            ))}
          </div>

          {/* Active Filter Pill Badge */}
          {isFilterActive && (
            <div className="text-xs text-gray-300 bg-dark-light/60 border border-gold/20 px-3 py-1.5 rounded-lg flex items-center gap-2">
              <span className="text-gold font-medium">Filtered Results:</span>
              <span>{filtered.length} Bookings</span>
              {selectedDate && (
                <span className="text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                  {formatDate(selectedDate + 'T00:00:00')} ({dateFilterType})
                </span>
              )}
            </div>
          )}
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
                    <th
                      className={`text-left p-4 font-medium transition-colors ${
                        dateFilterType === 'checkIn' && selectedDate
                          ? 'text-emerald-400 bg-emerald-500/10'
                          : 'text-gray-400'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <FaSignInAlt className="text-xs" /> Check-In
                      </div>
                    </th>
                    <th
                      className={`text-left p-4 font-medium transition-colors ${
                        dateFilterType === 'checkOut' && selectedDate
                          ? 'text-amber-400 bg-amber-500/10'
                          : 'text-gray-400'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <FaSignOutAlt className="text-xs" /> Check-Out
                      </div>
                    </th>
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
                    const isStayingToday =
                      selectedDate && isStayingOnDate(b.checkIn, b.checkOut, selectedDate);

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
                          <div className="flex items-center gap-2 flex-wrap">
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
                          <div className="flex items-center gap-2 flex-wrap">
                            <span>{formatDate(b.checkOut)}</span>
                            {isDepartureToday && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                                <FaSignOutAlt className="text-[9px]" /> Check-Out
                              </span>
                            )}
                            {isStayingToday && !isArrivalToday && !isDepartureToday && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                                <FaBed className="text-[9px]" /> In-House
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
                        <div className="flex flex-col items-center justify-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-gold">
                            <FaFilter className="text-xl" />
                          </div>
                          <p className="text-base text-gray-300 font-medium">
                            No bookings found matching the selected filter criteria.
                          </p>
                          <p className="text-xs text-gray-500 max-w-md">
                            Try selecting a different date, switching between Check-Ins and
                            Check-Outs, or resetting your search and status filters.
                          </p>
                          {isFilterActive && (
                            <button
                              type="button"
                              onClick={handleResetFilters}
                              className="mt-2 px-4 py-2 rounded-lg bg-gold text-dark text-xs font-semibold hover:bg-gold-light transition-all flex items-center gap-1.5"
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
