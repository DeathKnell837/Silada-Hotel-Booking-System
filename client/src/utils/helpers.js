export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateInput = (date) => {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

export const getTodayString = () => {
  return new Date().toISOString().split('T')[0];
};

export const getTomorrowString = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
};

export const calculateNights = (checkIn, checkOut) => {
  return Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
};

export const getStatusColor = (status) => {
  const colors = {
    pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    confirmed: 'bg-green-500/20 text-green-400 border-green-500/30',
    cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
    completed: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  };
  return colors[status] || 'bg-gray-500/20 text-gray-400';
};

export const getRoomTypeColor = (type) => {
  const colors = {
    Standard: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
    Deluxe: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    Suite: 'bg-gold/20 text-gold border-gold/30',
    Presidential: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  };
  return colors[type] || 'bg-gray-500/20 text-gray-300';
};
