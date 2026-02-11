import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaLock, FaPhone } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return toast.error('Please fill in required fields');
    if (form.password !== form.confirmPassword) return toast.error('Passwords do not match');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');

    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.phone);
      toast.success('Account created successfully!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
    setLoading(false);
  };

  const fields = [
    { name: 'name', icon: FaUser, type: 'text', label: 'Full Name', placeholder: 'John Doe', required: true },
    { name: 'email', icon: FaEnvelope, type: 'email', label: 'Email Address', placeholder: 'your@email.com', required: true },
    { name: 'phone', icon: FaPhone, type: 'tel', label: 'Phone (Optional)', placeholder: '+1 555-0000' },
    { name: 'password', icon: FaLock, type: 'password', label: 'Password', placeholder: '••••••••', required: true },
    { name: 'confirmPassword', icon: FaLock, type: 'password', label: 'Confirm Password', placeholder: '••••••••', required: true },
  ];

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center px-4 py-16">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1920&q=80')`,
        }}
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        <div className="glass-card gold-border-glow rounded-2xl p-8 md:p-10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-gold flex items-center justify-center">
              <span className="font-serif text-gold text-3xl font-bold">S</span>
            </div>
            <h1 className="font-serif text-3xl text-white mb-2">Create Account</h1>
            <p className="text-gray-400 text-sm">Join Silada for an exclusive experience</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map((f) => (
              <div key={f.name}>
                <label className="text-gray-400 text-sm mb-1.5 block">
                  {f.label} {f.required && <span className="text-gold">*</span>}
                </label>
                <div className="relative">
                  <f.icon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type={f.type}
                    name={f.name}
                    value={form[f.name]}
                    onChange={handleChange}
                    placeholder={f.placeholder}
                    className="input-dark !pl-11"
                  />
                </div>
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full !py-3.5 text-base disabled:opacity-50 mt-2"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-gold hover:text-gold-light transition-colors font-medium">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
