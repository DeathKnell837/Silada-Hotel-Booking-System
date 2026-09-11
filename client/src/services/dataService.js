import api from './api';

export const roomService = {
  getAll: (params) => api.get('/rooms', { params }),
  getFeatured: () => api.get('/rooms/featured'),
  getById: (id) => api.get(`/rooms/${id}`),
  create: (data) => api.post('/rooms', data),
  update: (id, data) => api.put(`/rooms/${id}`, data),
  delete: (id) => api.delete(`/rooms/${id}`),
};

export const bookingService = {
  create: (data) => api.post('/bookings', data),
  getMyBookings: () => api.get('/bookings/my'),
  getById: (id) => api.get(`/bookings/${id}`),
  cancel: (id) => api.put(`/bookings/${id}/cancel`),
  getAll: () => api.get('/bookings'),
  updateStatus: (id, status) => api.put(`/bookings/${id}/status`, { status }),
};

export const userService = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  delete: (id) => api.delete(`/users/${id}`),
};

// AI Services
export const chatbotService = {
  sendMessage: (sessionId, message) => api.post('/chatbot/message', { sessionId, message }),
  getHistory: (sessionId) => api.get(`/chatbot/history/${sessionId}`),
  clearHistory: (sessionId) => api.delete(`/chatbot/history/${sessionId}`),
  getStatus: () => api.get('/chatbot/status'),
};

export const reviewService = {
  create: (data) => api.post('/reviews', data),
  getByRoom: (roomId) => api.get(`/reviews/room/${roomId}`),
  getMyReviews: () => api.get('/reviews/my'),
  delete: (id) => api.delete(`/reviews/${id}`),
  getInsights: () => api.get('/reviews/insights'),
};

export const recommendationService = {
  getRecommendations: () => api.get('/recommendations'),
};

export const pricingService = {
  getQuote: (roomId, checkIn, checkOut) =>
    api.get(`/pricing/quote/${roomId}`, { params: { checkIn, checkOut } }),
  getForecast: () => api.get('/pricing/forecast'),
  getConfig: () => api.get('/pricing/config'),
  updateConfig: (roomType, data) => api.put(`/pricing/config/${roomType}`, data),
};

export const anomalyService = {
  getAlerts: () => api.get('/anomalies'),
  updateStatus: (id, status) => api.put(`/anomalies/${id}`, { status }),
};
