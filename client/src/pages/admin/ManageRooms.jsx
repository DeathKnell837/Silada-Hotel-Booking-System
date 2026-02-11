import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaPlus, FaEdit, FaTrash, FaArrowLeft, FaStar,
  FaTimes, FaSave, FaBed, FaSearch,
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import { roomService } from '../../services/dataService';
import { formatCurrency, getRoomTypeColor } from '../../utils/helpers';
import Spinner from '../../components/common/Spinner';

const emptyRoom = {
  name: '', type: 'Standard', description: '', price: 100, capacity: 2,
  size: 300, bedType: 'Queen', images: [''], amenities: ['WiFi', 'Air Conditioning'],
  rating: 4.5, numReviews: 0, isFeatured: false, isAvailable: true,
};

const ManageRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editRoom, setEditRoom] = useState(null);
  const [form, setForm] = useState(emptyRoom);
  const [saving, setSaving] = useState(false);

  const fetchRooms = async () => {
    try {
      const { data } = await roomService.getAll();
      setRooms(data);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchRooms(); }, []);

  const openCreate = () => {
    setEditRoom(null);
    setForm(emptyRoom);
    setShowModal(true);
  };

  const openEdit = (room) => {
    setEditRoom(room);
    setForm({
      ...room,
      images: room.images?.length ? room.images : [''],
      amenities: room.amenities || [],
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        images: form.images.filter(Boolean),
        price: Number(form.price),
        capacity: Number(form.capacity),
        size: Number(form.size),
        rating: Number(form.rating),
      };

      if (editRoom) {
        await roomService.update(editRoom._id, payload);
        toast.success('Room updated');
      } else {
        await roomService.create(payload);
        toast.success('Room created');
      }
      setShowModal(false);
      fetchRooms();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this room?')) return;
    try {
      await roomService.delete(id);
      toast.success('Room deleted');
      setRooms(rooms.filter((r) => r._id !== id));
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const filtered = rooms.filter(
    (r) => r.name.toLowerCase().includes(search.toLowerCase()) || r.type.toLowerCase().includes(search.toLowerCase())
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
            <h1 className="font-serif text-2xl md:text-3xl text-white">Manage Rooms</h1>
          </div>
        </div>
        <div className="h-0.5 w-16 bg-gold/40 mb-8" />

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search rooms..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-dark !pl-10"
            />
          </div>
          <button onClick={openCreate} className="btn-gold text-sm flex items-center gap-2">
            <FaPlus /> Add Room
          </button>
        </div>

        {/* Rooms Table */}
        {loading ? (
          <Spinner />
        ) : (
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gold/10">
                    <th className="text-left p-4 text-gray-400 font-medium">Room</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Type</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Price</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Capacity</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Rating</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Featured</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((room) => (
                    <tr key={room._id} className="border-b border-dark-lighter/50 hover:bg-gold/5 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={room.images?.[0] || 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=100'}
                            alt=""
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <span className="text-white font-medium">{room.name}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`text-xs px-2 py-1 rounded-full border ${getRoomTypeColor(room.type)}`}>
                          {room.type}
                        </span>
                      </td>
                      <td className="p-4 text-gold">{formatCurrency(room.price)}</td>
                      <td className="p-4 text-gray-300">{room.capacity}</td>
                      <td className="p-4">
                        <span className="flex items-center gap-1 text-gold">
                          <FaStar className="text-xs" /> {room.rating}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`text-xs ${room.isFeatured ? 'text-gold' : 'text-gray-600'}`}>
                          {room.isFeatured ? '★ Yes' : 'No'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEdit(room)}
                            className="p-2 rounded-lg hover:bg-gold/10 text-gold transition-colors"
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(room._id)}
                            className="p-2 rounded-lg hover:bg-red-500/10 text-red-400 transition-colors"
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-gray-500">No rooms found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif text-xl text-white">
                  {editRoom ? 'Edit Room' : 'Add New Room'}
                </h2>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gold">
                  <FaTimes size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-400 text-sm mb-1 block">Room Name *</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="input-dark text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm mb-1 block">Type *</label>
                    <select
                      value={form.type}
                      onChange={(e) => setForm({ ...form, type: e.target.value })}
                      className="input-dark text-sm"
                    >
                      <option>Standard</option>
                      <option>Deluxe</option>
                      <option>Suite</option>
                      <option>Presidential</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm mb-1 block">Price / Night *</label>
                    <input
                      type="number"
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value })}
                      className="input-dark text-sm"
                      min="0"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm mb-1 block">Max Guests *</label>
                    <input
                      type="number"
                      value={form.capacity}
                      onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                      className="input-dark text-sm"
                      min="1"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm mb-1 block">Size (ft²)</label>
                    <input
                      type="number"
                      value={form.size}
                      onChange={(e) => setForm({ ...form, size: e.target.value })}
                      className="input-dark text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm mb-1 block">Bed Type</label>
                    <select
                      value={form.bedType}
                      onChange={(e) => setForm({ ...form, bedType: e.target.value })}
                      className="input-dark text-sm"
                    >
                      <option>King</option>
                      <option>Queen</option>
                      <option>Twin</option>
                      <option>Double</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-gray-400 text-sm mb-1 block">Description *</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="input-dark text-sm resize-none"
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <label className="text-gray-400 text-sm mb-1 block">Image URLs (one per line)</label>
                  <textarea
                    value={form.images.join('\n')}
                    onChange={(e) => setForm({ ...form, images: e.target.value.split('\n') })}
                    className="input-dark text-sm resize-none"
                    rows={3}
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>

                <div>
                  <label className="text-gray-400 text-sm mb-1 block">
                    Amenities (comma separated)
                  </label>
                  <input
                    type="text"
                    value={form.amenities.join(', ')}
                    onChange={(e) =>
                      setForm({ ...form, amenities: e.target.value.split(',').map((s) => s.trim()) })
                    }
                    className="input-dark text-sm"
                    placeholder="WiFi, Air Conditioning, Mini Bar"
                  />
                </div>

                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isFeatured}
                      onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                      className="rounded border-gold/30 bg-dark-light text-gold focus:ring-gold"
                    />
                    Featured Room
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isAvailable}
                      onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })}
                      className="rounded border-gold/30 bg-dark-light text-gold focus:ring-gold"
                    />
                    Available
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button type="submit" disabled={saving} className="btn-gold flex-1 flex items-center justify-center gap-2">
                    <FaSave /> {saving ? 'Saving...' : editRoom ? 'Update Room' : 'Create Room'}
                  </button>
                  <button type="button" onClick={() => setShowModal(false)} className="btn-outline-gold flex-1">
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageRooms;
