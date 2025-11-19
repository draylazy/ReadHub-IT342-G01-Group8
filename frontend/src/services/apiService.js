const BASE = 'http://localhost:8080/api';

function getToken() {
  return localStorage.getItem('readhub_token');
}

function buildHeaders(auth = true) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function request(path, options = {}, auth = true) {
  const res = await fetch(`${BASE}${path}`, { ...options, headers: buildHeaders(auth) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'API Error');
  return data;
}

export const api = {
  register: (payload) => request('/auth/register', { method: 'POST', body: JSON.stringify(payload) }, false),
  login: (email, password) => request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }, false),
  getProfile: () => request('/users/profile', { method: 'GET' }),
  updateProfile: (payload) => request('/users/profile', { method: 'PUT', body: JSON.stringify(payload) }),
  deleteProfile: () => request('/users/profile', { method: 'DELETE' }),
};
