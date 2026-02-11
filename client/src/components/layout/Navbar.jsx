import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenuAlt3, HiX } from 'react-icons/hi';
import { FaUser, FaCrown, FaSignOutAlt, FaHotel } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
    setIsDropdownOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/rooms', label: 'Rooms' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled || location.pathname !== '/'
          ? 'bg-dark-deeper/95 backdrop-blur-md shadow-lg shadow-black/20 border-b border-gold/10'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-full border-2 border-gold flex items-center justify-center group-hover:bg-gold/10 transition-all duration-300">
              <span className="font-serif text-gold text-xl font-bold">S</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="font-serif text-xl text-white group-hover:text-gold transition-colors">
                Silada
              </h1>
              <p className="text-[10px] text-gold/60 tracking-[0.3em] uppercase -mt-1">
                Hotel & Resort
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium tracking-wide uppercase transition-colors duration-300 ${
                  location.pathname === link.to
                    ? 'text-gold'
                    : 'text-gray-300 hover:text-gold'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 text-gray-300 hover:text-gold transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center">
                    <FaUser className="text-gold text-xs" />
                  </div>
                  <span className="text-sm font-medium">{user.name?.split(' ')[0]}</span>
                </button>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-3 w-56 glass-card rounded-xl shadow-2xl overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-gold/10">
                        <p className="text-sm font-medium text-white">{user.name}</p>
                        <p className="text-xs text-gray-400">{user.email}</p>
                      </div>
                      <div className="py-2">
                        <Link
                          to="/profile"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-gold hover:bg-gold/5 transition-all"
                        >
                          <FaUser className="text-xs" /> My Profile
                        </Link>
                        {isAdmin && (
                          <Link
                            to="/admin"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-gold hover:bg-gold/5 transition-all"
                          >
                            <FaCrown className="text-xs" /> Admin Dashboard
                          </Link>
                        )}
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-all"
                        >
                          <FaSignOutAlt className="text-xs" /> Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-300 hover:text-gold transition-colors"
                >
                  Sign In
                </Link>
                <Link to="/register" className="btn-gold text-sm !py-2 !px-5">
                  Book Now
                </Link>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="md:hidden text-gold text-2xl"
          >
            {isMobileOpen ? <HiX /> : <HiMenuAlt3 />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-dark-deeper/98 backdrop-blur-lg border-t border-gold/10"
          >
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`block text-sm font-medium tracking-wide uppercase py-2 ${
                    location.pathname === link.to ? 'text-gold' : 'text-gray-300'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-gold/10 pt-4">
                {user ? (
                  <>
                    <Link to="/profile" className="block py-2 text-gray-300 text-sm">
                      <FaUser className="inline mr-2 text-gold" /> My Profile
                    </Link>
                    {isAdmin && (
                      <Link to="/admin" className="block py-2 text-gray-300 text-sm">
                        <FaCrown className="inline mr-2 text-gold" /> Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block py-2 text-red-400 text-sm w-full text-left"
                    >
                      <FaSignOutAlt className="inline mr-2" /> Sign Out
                    </button>
                  </>
                ) : (
                  <div className="space-y-3">
                    <Link to="/login" className="block btn-outline-gold text-center text-sm">
                      Sign In
                    </Link>
                    <Link to="/register" className="block btn-gold text-center text-sm">
                      Book Now
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
