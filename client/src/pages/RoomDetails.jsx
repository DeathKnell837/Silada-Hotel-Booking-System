import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Thumbs } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
import {
  FaStar, FaUsers, FaBed, FaRulerCombined, FaWifi, FaSnowflake,
  FaCocktail, FaConciergeBell, FaSwimmingPool, FaSpa, FaTv, FaShieldAlt,
  FaUtensils, FaCar, FaArrowRight, FaArrowLeft, FaCheckCircle,
} from 'react-icons/fa';
import { roomService } from '../services/dataService';
import { formatCurrency, getRoomTypeColor } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/common/Spinner';

const amenityIcons = {
  WiFi: FaWifi, 'Air Conditioning': FaSnowflake, 'Mini Bar': FaCocktail,
  'Room Service': FaConciergeBell, 'Butler Service': FaConciergeBell,
  'Private Pool': FaSwimmingPool, Pool: FaSwimmingPool, 'Infinity Pool': FaSwimmingPool,
  'Spa Bath': FaSpa, 'Soaking Tub': FaSpa, Spa: FaSpa,
  TV: FaTv, 'Entertainment System': FaTv, Safe: FaShieldAlt,
  'Fine Dining': FaUtensils, 'Chef Kitchen': FaUtensils, 'Gourmet Kitchen': FaUtensils,
  'Valet Parking': FaCar, 'Limousine Service': FaCar,
};

const RoomDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [selectedImg, setSelectedImg] = useState(0);

  useEffect(() => {
    roomService.getById(id)
      .then(({ data }) => setRoom(data))
      .catch(() => navigate('/rooms'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="pt-32"><Spinner size="lg" /></div>;
  if (!room) return null;

  return (
    <div className="min-h-screen pt-20">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Link to="/" className="hover:text-gold transition-colors">Home</Link>
          <span>/</span>
          <Link to="/rooms" className="hover:text-gold transition-colors">Rooms</Link>
          <span>/</span>
          <span className="text-gold">{room.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Column - Gallery + Details */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="mb-8">
              <Swiper
                modules={[Navigation, Pagination, Thumbs]}
                thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                navigation
                pagination={{ clickable: true }}
                className="rounded-2xl overflow-hidden h-[400px] md:h-[500px]"
              >
                {(room.images?.length > 0 ? room.images : [
                  'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800',
                ]).map((img, i) => (
                  <SwiperSlide key={i}>
                    <img src={img} alt={`${room.name} ${i + 1}`} className="w-full h-full object-cover" />
                  </SwiperSlide>
                ))}
              </Swiper>

              {room.images?.length > 1 && (
                <Swiper
                  modules={[Thumbs]}
                  onSwiper={setThumbsSwiper}
                  spaceBetween={10}
                  slidesPerView={4}
                  watchSlidesProgress
                  className="mt-4"
                >
                  {room.images.map((img, i) => (
                    <SwiperSlide key={i} className="cursor-pointer rounded-lg overflow-hidden opacity-60 hover:opacity-100 transition-opacity [&.swiper-slide-thumb-active]:opacity-100 [&.swiper-slide-thumb-active]:ring-2 [&.swiper-slide-thumb-active]:ring-gold">
                      <img src={img} alt="" className="w-full h-20 object-cover" />
                    </SwiperSlide>
                  ))}
                </Swiper>
              )}
            </div>

            {/* Room Info */}
            <div className="glass-card rounded-2xl p-8 mb-8">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                <div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${getRoomTypeColor(room.type)}`}>
                    {room.type}
                  </span>
                  <h1 className="font-serif text-3xl md:text-4xl text-white mt-3">{room.name}</h1>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className={`text-sm ${i < Math.floor(room.rating) ? 'text-gold' : 'text-gray-600'}`} />
                      ))}
                    </div>
                    <span className="text-gold font-medium">{room.rating}</span>
                    <span className="text-gray-500 text-sm">({room.numReviews} reviews)</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-gold font-serif text-3xl">{formatCurrency(room.price)}</span>
                  <span className="text-gray-500"> / night</span>
                </div>
              </div>

              <div className="h-px bg-gold/10 my-6" />

              {/* Specs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8">
                <div className="text-center glass-card rounded-xl p-4">
                  <FaUsers className="text-gold text-xl mx-auto mb-2" />
                  <p className="text-white font-medium">{room.capacity}</p>
                  <p className="text-gray-500 text-xs">Max Guests</p>
                </div>
                <div className="text-center glass-card rounded-xl p-4">
                  <FaBed className="text-gold text-xl mx-auto mb-2" />
                  <p className="text-white font-medium">{room.bedType}</p>
                  <p className="text-gray-500 text-xs">Bed Type</p>
                </div>
                <div className="text-center glass-card rounded-xl p-4">
                  <FaRulerCombined className="text-gold text-xl mx-auto mb-2" />
                  <p className="text-white font-medium">{room.size || 'N/A'}</p>
                  <p className="text-gray-500 text-xs">Size (ft²)</p>
                </div>
                <div className="text-center glass-card rounded-xl p-4">
                  <FaStar className="text-gold text-xl mx-auto mb-2" />
                  <p className="text-white font-medium">{room.rating}</p>
                  <p className="text-gray-500 text-xs">Rating</p>
                </div>
              </div>

              {/* Description */}
              <h3 className="font-serif text-xl text-white mb-3">About This Room</h3>
              <p className="text-gray-300 leading-relaxed">{room.description}</p>
            </div>

            {/* Amenities */}
            <div className="glass-card rounded-2xl p-8">
              <h3 className="font-serif text-xl text-white mb-6">Amenities</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {room.amenities?.map((a, i) => {
                  const Icon = amenityIcons[a] || FaCheckCircle;
                  return (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gold/5 transition-colors">
                      <Icon className="text-gold flex-shrink-0" />
                      <span className="text-gray-300 text-sm">{a}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column - Booking Widget */}
          <div className="lg:col-span-1">
            <div className="sticky top-28">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card gold-border-glow rounded-2xl p-6"
              >
                <h3 className="font-serif text-xl text-white mb-2">Reserve This Room</h3>
                <p className="text-gray-400 text-sm mb-6">
                  Starting from{' '}
                  <span className="text-gold font-serif text-lg">{formatCurrency(room.price)}</span>
                  {' '}per night
                </p>
                <div className="h-px bg-gold/10 mb-6" />

                {room.isAvailable ? (
                  <Link
                    to={user ? `/booking/${room._id}` : '/login'}
                    className="btn-gold w-full text-center block py-4 text-lg"
                  >
                    {user ? 'Book Now' : 'Sign In to Book'}
                  </Link>
                ) : (
                  <button disabled className="w-full bg-gray-600/50 text-gray-400 py-4 rounded-lg cursor-not-allowed">
                    Currently Unavailable
                  </button>
                )}

                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <FaCheckCircle className="text-green-500" /> Free cancellation
                  </div>
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <FaCheckCircle className="text-green-500" /> No prepayment needed
                  </div>
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <FaCheckCircle className="text-green-500" /> Best price guaranteed
                  </div>
                </div>
              </motion.div>

              {/* Back to rooms */}
              <Link
                to="/rooms"
                className="mt-6 flex items-center gap-2 text-gray-400 hover:text-gold transition-colors text-sm justify-center"
              >
                <FaArrowLeft className="text-xs" /> Back to all rooms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;
