import axios from 'axios';

// Use relative API base so Create React App proxy can forward requests during development.
const API_BASE = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 || err.response?.status === 403) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ── Auth ──────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login:    (data) => api.post('/auth/login', data),
};

// ── Services ──────────────────────────────────────────────────
export const servicesAPI = {
  getAll:    (search = '') => api.get('/services', { params: { search } }),
  getAllAdmin:()            => api.get('/services/admin/all'),
  getById:   (id)          => api.get(`/services/${id}`),
  create:    (data)        => api.post('/services', data),
  update:    (id, data)    => api.put(`/services/${id}`, data),
  delete:    (id)          => api.delete(`/services/${id}`),
};

// ── Appointments ──────────────────────────────────────────────
export const appointmentsAPI = {
  getSlots:      (serviceId, date) => api.get('/appointments/slots', { params: { serviceId, date } }),
  book:          (data)            => api.post('/appointments', data),
  getMy:         ()                => api.get('/appointments/my'),
  cancel:        (id)              => api.patch(`/appointments/${id}/cancel`),
  // admin
  getAll:        (params)          => api.get('/appointments/admin/all', { params }),
  updateStatus:  (id, data)        => api.patch(`/appointments/admin/${id}/status`, data),
  getStats:      ()                => api.get('/appointments/admin/stats'),
};

// ── Users ──────────────────────────────────────────────────────
export const usersAPI = {
  getProfile:    ()         => api.get('/users/profile'),
  updateProfile: (data)     => api.put('/users/profile', data),
  // admin
  getAll:        (search)   => api.get('/users/admin/all', { params: { search } }),
  toggle:        (id)       => api.patch(`/users/admin/${id}/toggle`),
};

export default api;
