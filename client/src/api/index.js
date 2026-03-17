import axios from 'axios';

const API = axios.create({ baseURL: '/api', withCredentials: true });

API.interceptors.request.use(cfg => {
  const t = localStorage.getItem('token');
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});

API.interceptors.response.use(
  r => r,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// Auth
export const register = d => API.post('/auth/register', d);
export const login    = d => API.post('/auth/login', d);
export const getMe    = () => API.get('/auth/me');
export const changePw = d => API.put('/auth/change-password', d);

// Events
export const getEvents        = p  => API.get('/events', { params: p });
export const getMyEvents      = () => API.get('/events/my');
export const getEvent         = id => API.get(`/events/${id}`);
export const createEvent      = d  => API.post('/events', d);
export const updateEvent      = (id, d) => API.put(`/events/${id}`, d);
export const deleteEvent      = id => API.delete(`/events/${id}`);
export const registerForEvent = id => API.post(`/events/${id}/register`);
export const getRegistrations = id => API.get(`/events/${id}/registrations`);

// Attendance
export const scanQR      = d  => API.post('/attendance/scan', d);
export const issueCerts  = id => API.post(`/attendance/certificates/${id}`);
export const getEntryLogs = id => API.get(`/attendance/logs/${id}`);

// Certificates
export const getMyCerts       = ()  => API.get('/certificates/my');
export const checkCertificate = id  => API.get(`/certificates/check/${id}`);  // ← NEW
export const verifyCert       = cid => API.get(`/certificates/verify/${cid}`);

// Feedback
export const submitFeedback  = (id, d) => API.post(`/feedback/${id}`, d);
export const checkFeedback   = id => API.get(`/feedback/check/${id}`);
export const getEventFeedback = id => API.get(`/feedback/${id}`);

// Analytics
export const getDashboard   = ()  => API.get('/analytics/dashboard');
export const getEventStats  = id  => API.get(`/analytics/event/${id}`);

// Users
export const getProfile    = () => API.get('/users/profile');
export const updateProfile = d  => API.put('/users/profile', d);

export default API;
