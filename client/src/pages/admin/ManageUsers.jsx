import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaTrash, FaUser, FaCrown, FaSearch } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { userService } from '../../services/dataService';
import { formatDate } from '../../utils/helpers';
import Spinner from '../../components/common/Spinner';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    userService.getAll()
      .then(({ data }) => setUsers(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete user "${name}"? This cannot be undone.`)) return;
    try {
      await userService.delete(id);
      setUsers(users.filter((u) => u._id !== id));
      toast.success('User deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center gap-4 mb-4">
          <Link to="/admin" className="text-gray-400 hover:text-gold transition-colors">
            <FaArrowLeft />
          </Link>
          <div>
            <p className="text-gold tracking-[0.2em] uppercase text-xs">Administration</p>
            <h1 className="font-serif text-2xl md:text-3xl text-white">Manage Users</h1>
          </div>
        </div>
        <div className="h-0.5 w-16 bg-gold/40 mb-8" />

        {/* Search */}
        <div className="relative max-w-md mb-6">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-dark !pl-10"
          />
        </div>

        {/* Stats */}
        <div className="flex gap-4 mb-6">
          <div className="glass-card rounded-xl px-4 py-3 text-sm">
            <span className="text-gray-400">Total: </span>
            <span className="text-white font-medium">{users.length}</span>
          </div>
          <div className="glass-card rounded-xl px-4 py-3 text-sm">
            <span className="text-gray-400">Admins: </span>
            <span className="text-gold font-medium">{users.filter((u) => u.role === 'admin').length}</span>
          </div>
          <div className="glass-card rounded-xl px-4 py-3 text-sm">
            <span className="text-gray-400">Users: </span>
            <span className="text-blue-400 font-medium">{users.filter((u) => u.role === 'user').length}</span>
          </div>
        </div>

        {loading ? (
          <Spinner />
        ) : (
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gold/10">
                    <th className="text-left p-4 text-gray-400 font-medium">User</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Email</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Phone</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Role</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Joined</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((user) => (
                    <tr key={user._id} className="border-b border-dark-lighter/50 hover:bg-gold/5 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center">
                            {user.role === 'admin' ? (
                              <FaCrown className="text-gold text-sm" />
                            ) : (
                              <FaUser className="text-gray-400 text-sm" />
                            )}
                          </div>
                          <span className="text-white font-medium">{user.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-gray-300">{user.email}</td>
                      <td className="p-4 text-gray-400">{user.phone || '—'}</td>
                      <td className="p-4">
                        <span
                          className={`text-xs px-2 py-1 rounded-full border capitalize ${
                            user.role === 'admin'
                              ? 'bg-gold/20 text-gold border-gold/30'
                              : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="p-4 text-gray-400">{formatDate(user.createdAt)}</td>
                      <td className="p-4">
                        {user.role !== 'admin' ? (
                          <button
                            onClick={() => handleDelete(user._id, user.name)}
                            className="p-2 rounded-lg hover:bg-red-500/10 text-red-400 transition-colors"
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        ) : (
                          <span className="text-gray-600 text-xs">Protected</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-gray-500">
                        No users found
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

export default ManageUsers;
