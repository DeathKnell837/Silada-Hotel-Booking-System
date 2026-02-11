import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHome } from 'react-icons/fa';

const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center px-4 pt-20">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center"
    >
      <h1 className="font-serif text-8xl text-gold mb-4">404</h1>
      <h2 className="font-serif text-3xl text-white mb-4">Page Not Found</h2>
      <p className="text-gray-400 mb-8 max-w-md mx-auto">
        The page you're looking for doesn't exist or has been moved. Let us guide you back to luxury.
      </p>
      <Link to="/" className="btn-gold inline-flex items-center gap-2">
        <FaHome /> Return Home
      </Link>
    </motion.div>
  </div>
);

export default NotFound;
