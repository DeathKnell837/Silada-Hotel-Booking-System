import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock, FaHotel } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return toast.error('Please fill in all fields');

    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center px-4 py-16">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1920&q=80')`,
        }}
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        <div className="glass-card gold-border-glow rounded-2xl p-8 md:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-gold flex items-center justify-center">
              <span className="font-serif text-gold text-3xl font-bold">S</span>
            </div>
            <h1 className="font-serif text-3xl text-white mb-2">Welcome Back</h1>
            <p className="text-gray-400 text-sm">Sign in to your Silada account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Email Address</label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="input-dark !pl-11"
                />
              </div>
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-2 block">Password</label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-dark !pl-11"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full !py-3.5 text-base disabled:opacity-50"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-gold hover:text-gold-light transition-colors font-medium">
                Create one
              </Link>
            </p>
          </div>

          {/* Demo accounts */}
          <div className="mt-8 pt-6 border-t border-gold/10">
            <p className="text-gray-500 text-xs text-center mb-3">Quick Login (Demo)</p>
            <div className="flex gap-3">
              <button
                onClick={() => { setEmail('admin@silada.com'); setPassword('admin123'); }}
                className="flex-1 text-xs py-2 px-3 rounded-lg border border-gold/20 text-gold/70 hover:bg-gold/10 transition-colors"
              >
                Admin
              </button>
              <button
                onClick={() => { setEmail('john@example.com'); setPassword('user123'); }}
                className="flex-1 text-xs py-2 px-3 rounded-lg border border-gold/20 text-gold/70 hover:bg-gold/10 transition-colors"
              >
                User
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
