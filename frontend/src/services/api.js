const API_BASE_URL = 'https://api.rupalbothra.in/api';

export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem('quickrail_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.message || 'Something went wrong');
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

// API Service methods
export const authService = {
  login: (credentials) => apiFetch('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  signup: (userData) => apiFetch('/auth/signup', { method: 'POST', body: JSON.stringify(userData) }),
  getMe: () => apiFetch('/auth/me'),
};

export const trainService = {
  searchTrains: (params) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/trains/search?${query}`);
  },
  getStations: () => apiFetch('/trains/stations'),
  getTrainById: (id) => apiFetch(`/trains/${id}`),
};

export const bookingService = {
  createBooking: (bookingData) => apiFetch('/bookings', { method: 'POST', body: JSON.stringify(bookingData) }),
  getUserBookings: () => apiFetch('/bookings/my-bookings'),
  getBookingByPNR: (pnr) => apiFetch(`/bookings/pnr/${pnr}`),
  cancelBooking: (id) => apiFetch(`/bookings/cancel/${id}`, { method: 'POST' }),
};

export const paymentService = {
  processPayment: (paymentData) => apiFetch('/payments/process', { method: 'POST', body: JSON.stringify(paymentData) }),
};

export const adminService = {
  getStats: () => apiFetch('/admin/stats'),
  getAllTrains: () => apiFetch('/admin/trains'),
  createTrain: (data) => apiFetch('/admin/trains', { method: 'POST', body: JSON.stringify(data) }),
  updateTrain: (id, data) => apiFetch(`/admin/trains/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteTrain: (id) => apiFetch(`/admin/trains/${id}`, { method: 'DELETE' }),
  getAllBookings: () => apiFetch('/admin/bookings'),
};
