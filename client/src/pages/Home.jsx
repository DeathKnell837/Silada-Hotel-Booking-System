import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaWifi, FaSpa, FaSwimmingPool, FaUtensils, FaConciergeBell, FaCar, FaStar, FaQuoteLeft, FaArrowRight } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { roomService } from '../services/dataService';
import { formatCurrency } from '../utils/helpers';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.15 } },
};

const Home = () => {
  const [featuredRooms, setFeaturedRooms] = useState([]);

  useEffect(() => {
    roomService.getFeatured().then(({ data }) => setFeaturedRooms(data)).catch(() => {});
  }, []);

  const amenities = [
    { icon: FaWifi, title: 'High-Speed WiFi', desc: 'Stay connected with complimentary fiber-optic internet throughout the resort' },
    { icon: FaSpa, title: 'Luxury Spa', desc: 'Rejuvenate your mind and body with world-class spa treatments' },
    { icon: FaSwimmingPool, title: 'Infinity Pool', desc: 'Take a dip in our stunning infinity pool overlooking the ocean' },
    { icon: FaUtensils, title: 'Fine Dining', desc: 'Savor exquisite cuisines prepared by our Michelin-starred chefs' },
    { icon: FaConciergeBell, title: '24/7 Concierge', desc: 'Our dedicated team is at your service around the clock' },
    { icon: FaCar, title: 'Valet Parking', desc: 'Complimentary valet parking for all our distinguished guests' },
  ];

  const testimonials = [
    { name: 'Victoria R.', role: 'Travel Blogger', text: 'An absolutely breathtaking experience. The Presidential Suite was beyond anything I\'ve ever experienced. Pure luxury in every detail.', rating: 5 },
    { name: 'James M.', role: 'Business Executive', text: 'Silada exceeds every expectation. The staff anticipates your every need. This has become our family\'s annual retreat destination.', rating: 5 },
    { name: 'Sophie L.', role: 'Honeymooner', text: 'We chose Silada for our honeymoon and it was magical. The private terrace suite with ocean views made it unforgettable.', rating: 5 },
  ];

  return (
    <div className="overflow-hidden">
      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-screen flex items-center justify-center">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1920&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-dark-deeper/70 via-dark/60 to-dark" />

        {/* Content */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="relative z-10 text-center px-4 max-w-4xl mx-auto"
        >
          <motion.p
            variants={fadeInUp}
            className="text-gold tracking-[0.4em] uppercase text-sm mb-6"
          >
            Welcome to Silada
          </motion.p>
          <motion.h1
            variants={fadeInUp}
            className="font-serif text-5xl md:text-7xl lg:text-8xl text-white mb-6 leading-tight"
          >
            Where Elegance
            <br />
            <span className="text-gold italic">Meets Serenity</span>
          </motion.h1>
          <motion.p
            variants={fadeInUp}
            className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Discover a world of unparalleled luxury, where every moment is curated to create
            memories that last a lifetime.
          </motion.p>
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/rooms" className="btn-gold text-base px-8 py-4 flex items-center gap-2">
              Explore Our Rooms <FaArrowRight className="text-sm" />
            </Link>
            <a href="#amenities" className="btn-outline-gold text-base px-8 py-4">
              Discover More
            </a>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-6 h-10 rounded-full border-2 border-gold/40 flex items-start justify-center p-1"
          >
            <div className="w-1.5 h-3 bg-gold rounded-full" />
          </motion.div>
        </div>
      </section>

      {/* ===== FEATURED ROOMS ===== */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.p variants={fadeInUp} className="text-gold tracking-[0.3em] uppercase text-sm mb-3">
              Accommodations
            </motion.p>
            <motion.h2 variants={fadeInUp} className="font-serif text-4xl md:text-5xl text-white mb-4">
              Featured Rooms & Suites
            </motion.h2>
            <motion.div variants={fadeInUp} className="h-0.5 w-20 bg-gold/40 mx-auto" />
          </motion.div>

          {featuredRooms.length > 0 && (
            <Swiper
              modules={[Autoplay, Pagination]}
              spaceBetween={30}
              slidesPerView={1}
              pagination={{ clickable: true }}
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              className="pb-14"
            >
              {featuredRooms.map((room) => (
                <SwiperSlide key={room._id}>
                  <Link to={`/rooms/${room._id}`} className="block group">
                    <div className="glass-card rounded-2xl overflow-hidden hover:border-gold/30 transition-all duration-500">
                      <div className="relative h-64 overflow-hidden">
                        <img
                          src={room.images?.[0] || 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800'}
                          alt={room.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-dark/80 to-transparent" />
                        <span className="absolute top-4 left-4 bg-gold/20 backdrop-blur-sm text-gold text-xs font-semibold px-3 py-1 rounded-full border border-gold/30">
                          {room.type}
                        </span>
                        <div className="absolute bottom-4 left-4 right-4">
                          <h3 className="font-serif text-xl text-white mb-1">{room.name}</h3>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <FaStar
                                key={i}
                                className={`text-xs ${i < Math.floor(room.rating) ? 'text-gold' : 'text-gray-600'}`}
                              />
                            ))}
                            <span className="text-gray-400 text-xs ml-1">({room.numReviews})</span>
                          </div>
                        </div>
                      </div>
                      <div className="p-5">
                        <p className="text-gray-400 text-sm line-clamp-2 mb-4">{room.description}</p>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-gold font-serif text-2xl">{formatCurrency(room.price)}</span>
                            <span className="text-gray-500 text-sm"> / night</span>
                          </div>
                          <span className="text-gold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                            View Details <FaArrowRight className="text-xs" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          )}

          <div className="text-center mt-8">
            <Link to="/rooms" className="btn-outline-gold inline-flex items-center gap-2">
              View All Rooms <FaArrowRight className="text-sm" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== AMENITIES ===== */}
      <section id="amenities" className="py-24 px-4 bg-dark-deeper/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.p variants={fadeInUp} className="text-gold tracking-[0.3em] uppercase text-sm mb-3">
              What We Offer
            </motion.p>
            <motion.h2 variants={fadeInUp} className="font-serif text-4xl md:text-5xl text-white mb-4">
              World-Class Amenities
            </motion.h2>
            <motion.div variants={fadeInUp} className="h-0.5 w-20 bg-gold/40 mx-auto" />
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {amenities.map((item, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="glass-card rounded-2xl p-8 text-center group hover:border-gold/30 transition-all duration-500"
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center group-hover:bg-gold/20 transition-all">
                  <item.icon className="text-gold text-2xl" />
                </div>
                <h3 className="font-serif text-xl text-white mb-3">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.p variants={fadeInUp} className="text-gold tracking-[0.3em] uppercase text-sm mb-3">
              Guest Reviews
            </motion.p>
            <motion.h2 variants={fadeInUp} className="font-serif text-4xl md:text-5xl text-white mb-4">
              What Our Guests Say
            </motion.h2>
            <motion.div variants={fadeInUp} className="h-0.5 w-20 bg-gold/40 mx-auto" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="glass-card rounded-2xl p-8 relative"
              >
                <FaQuoteLeft className="text-gold/20 text-4xl absolute top-6 right-6" />
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, j) => (
                    <FaStar key={j} className="text-gold text-sm" />
                  ))}
                </div>
                <p className="text-gray-300 italic leading-relaxed mb-6">"{t.text}"</p>
                <div>
                  <p className="text-white font-semibold">{t.name}</p>
                  <p className="text-gold text-sm">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section className="py-24 px-4 relative">
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1920&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-dark/85" />
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="relative z-10 max-w-3xl mx-auto text-center"
        >
          <motion.p variants={fadeInUp} className="text-gold tracking-[0.3em] uppercase text-sm mb-3">
            Limited Offer
          </motion.p>
          <motion.h2 variants={fadeInUp} className="font-serif text-4xl md:text-5xl text-white mb-6">
            Begin Your Luxury Experience Today
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-gray-300 text-lg mb-10 leading-relaxed">
            Book directly and enjoy exclusive benefits including complimentary spa credits,
            late checkout, and a welcome champagne experience.
          </motion.p>
          <motion.div variants={fadeInUp}>
            <Link to="/rooms" className="btn-gold text-lg px-10 py-4 inline-flex items-center gap-3">
              Reserve Your Stay <FaArrowRight />
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
