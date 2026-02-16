import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaStar, FaUsers, FaBed, FaArrowRight, FaSearch, FaFilter } from 'react-icons/fa';
import { roomService } from '../services/dataService';
import { formatCurrency, getRoomTypeColor } from '../utils/helpers';
import Spinner from '../components/common/Spinner';

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    type: 'all',
    minPrice: '',
    maxPrice: '',
    capacity: '',
    search: '',
  });

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.type !== 'all') params.type = filters.type;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.capacity) params.capacity = filters.capacity;
      if (filters.search) params.search = filters.search;

      const { data } = await roomService.getAll(params);
      setRooms(data);
    } catch {
      setRooms([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleFilter = (e) => {
    e.preventDefault();
    fetchRooms();
  };

  const clearFilters = () => {
    setFilters({ type: 'all', minPrice: '', maxPrice: '', capacity: '', search: '' });
    setTimeout(fetchRooms, 0);
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Banner */}
      <div className="relative h-72 flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1920&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-dark/80" />
        <div className="relative text-center">
          <p className="text-gold tracking-[0.3em] uppercase text-sm mb-3">Our Collection</p>
          <h1 className="font-serif text-4xl md:text-5xl text-white">Rooms & Suites</h1>
          <div className="h-0.5 w-20 bg-gold/40 mx-auto mt-4" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filter Bar */}
        <div className="glass-card rounded-2xl p-6 mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold flex items-center gap-2">
              <FaFilter className="text-gold" /> Filter Rooms
            </h2>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden text-gold text-sm"
            >
              {showFilters ? 'Hide' : 'Show'} Filters
            </button>
          </div>

          <form
            onSubmit={handleFilter}
            className={`grid grid-cols-1 md:grid-cols-6 gap-4 ${showFilters ? '' : 'hidden md:grid'}`}
          >
            <div className="relative md:col-span-2">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Search rooms..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="input-dark !pl-10"
              />
            </div>

            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="input-dark"
            >
              <option value="all">All Types</option>
              <option value="Standard">Standard</option>
              <option value="Deluxe">Deluxe</option>
              <option value="Suite">Suite</option>
              <option value="Presidential">Presidential</option>
            </select>

            <input
              type="number"
              placeholder="Min ₱"
              value={filters.minPrice}
              onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
              className="input-dark"
            />

            <input
              type="number"
              placeholder="Max ₱"
              value={filters.maxPrice}
              onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
              className="input-dark"
            />

            <div className="flex gap-2">
              <button type="submit" className="btn-gold flex-1 !py-3">
                Search
              </button>
              <button type="button" onClick={clearFilters} className="btn-outline-gold !px-4 !py-3 text-sm">
                Clear
              </button>
            </div>
          </form>
        </div>

        {/* Results count */}
        <p className="text-gray-400 text-sm mb-6">
          {loading ? 'Loading...' : `${rooms.length} room${rooms.length !== 1 ? 's' : ''} found`}
        </p>

        {/* Room Grid */}
        {loading ? (
          <Spinner size="lg" />
        ) : rooms.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-serif text-2xl text-white mb-3">No Rooms Found</p>
            <p className="text-gray-400 mb-6">Try adjusting your filters to find available rooms.</p>
            <button onClick={clearFilters} className="btn-outline-gold">
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rooms.map((room, i) => (
              <motion.div
                key={room._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link to={`/rooms/${room._id}`} className="block group">
                  <div className="glass-card rounded-2xl overflow-hidden hover:border-gold/30 transition-all duration-500 h-full">
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={room.images?.[0] || 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800'}
                        alt={room.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-dark/80 to-transparent" />
                      <span
                        className={`absolute top-4 left-4 text-xs font-semibold px-3 py-1 rounded-full border ${getRoomTypeColor(room.type)}`}
                      >
                        {room.type}
                      </span>
                      {!room.isAvailable && (
                        <span className="absolute top-4 right-4 bg-red-500/80 text-white text-xs px-3 py-1 rounded-full">
                          Booked
                        </span>
                      )}
                    </div>
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-serif text-lg text-white group-hover:text-gold transition-colors">
                          {room.name}
                        </h3>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <FaStar className="text-gold text-xs" />
                          <span className="text-gold text-sm font-medium">{room.rating}</span>
                        </div>
                      </div>
                      <p className="text-gray-400 text-sm line-clamp-2 mb-4">{room.description}</p>
                      <div className="flex items-center gap-4 text-gray-500 text-xs mb-4">
                        <span className="flex items-center gap-1">
                          <FaUsers className="text-gold/60" /> {room.capacity} Guests
                        </span>
                        <span className="flex items-center gap-1">
                          <FaBed className="text-gold/60" /> {room.bedType}
                        </span>
                        {room.size > 0 && <span>{room.size} ft²</span>}
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-gold/10">
                        <div>
                          <span className="text-gold font-serif text-xl">{formatCurrency(room.price)}</span>
                          <span className="text-gray-500 text-sm"> / night</span>
                        </div>
                        <span className="text-gold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                          Details <FaArrowRight className="text-xs" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Rooms;
