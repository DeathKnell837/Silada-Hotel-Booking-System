import { Link } from 'react-router-dom';
import { FaHotel, FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-dark-deeper border-t border-gold/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 rounded-full border-2 border-gold flex items-center justify-center">
                <span className="font-serif text-gold text-xl font-bold">S</span>
              </div>
              <div>
                <h3 className="font-serif text-xl text-white">Siladan</h3>
                <p className="text-[10px] text-gold/60 tracking-[0.3em] uppercase -mt-1">
                  Hotel & Resort
                </p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Where elegance meets serenity. Experience unparalleled luxury in the heart of paradise,
              where every moment is crafted to perfection.
            </p>
            <div className="flex space-x-4 mt-6">
              {[FaFacebookF, FaInstagram, FaTwitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center text-gold/60 hover:bg-gold hover:text-dark hover:border-gold transition-all duration-300"
                >
                  <Icon className="text-sm" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-white text-lg mb-6">Quick Links</h4>
            <div className="h-0.5 w-12 bg-gold/40 mb-6" />
            <ul className="space-y-3">
              {[
                { to: '/', label: 'Home' },
                { to: '/rooms', label: 'Our Rooms' },
                { to: '/login', label: 'Sign In' },
                { to: '/register', label: 'Register' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-gray-400 hover:text-gold text-sm transition-colors duration-300 flex items-center gap-2"
                  >
                    <span className="text-gold/40">›</span> {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif text-white text-lg mb-6">Contact Us</h4>
            <div className="h-0.5 w-12 bg-gold/40 mb-6" />
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-gold mt-1 flex-shrink-0" />
                <span className="text-gray-400 text-sm">
                  123 Luxury Avenue, Paradise Island, Maldives
                </span>
              </li>
              <li className="flex items-center gap-3">
                <FaPhone className="text-gold flex-shrink-0" />
                <span className="text-gray-400 text-sm">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                <FaEnvelope className="text-gold flex-shrink-0" />
                <span className="text-gray-400 text-sm">info@siladan-hotel.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-serif text-white text-lg mb-6">Newsletter</h4>
            <div className="h-0.5 w-12 bg-gold/40 mb-6" />
            <p className="text-gray-400 text-sm mb-4">
              Subscribe for exclusive offers and luxury travel inspiration.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 bg-dark-light border border-dark-lighter rounded-l-lg px-4 py-2.5 text-sm text-gray-300 placeholder-gray-500 focus:border-gold focus:outline-none"
              />
              <button className="bg-gold text-dark px-4 py-2.5 rounded-r-lg font-semibold text-sm hover:bg-gold-light transition-colors">
                →
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-gold/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © 2026 Siladan Hotel & Resort. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-gray-500 hover:text-gold text-xs transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-500 hover:text-gold text-xs transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
