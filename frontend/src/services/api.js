const BASE_URL = 'http://127.0.0.1:8000/api';

const getHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
  };
  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Token ${token}`;
  }
  return headers;
};

export const api = {
  // Auth
  async login(username, password) {
    const res = await fetch(`${BASE_URL}/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || data.detail || 'Login failed');
    }
    return data;
  },

  async register(username, email, password) {
    const res = await fetch(`${BASE_URL}/auth/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      const errorMsg = typeof data === 'object'
        ? Object.entries(data).map(([k, v]) => `${k}: ${v}`).join(', ')
        : 'Registration failed';
      throw new Error(errorMsg);
    }
    return data;
  },

  async getCurrentUser() {
    const res = await fetch(`${BASE_URL}/auth/me/`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch user');
    return res.json();
  },

  // Media CRUD
  async getMediaList() {
    const res = await fetch(`${BASE_URL}/media/`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch media list');
    return res.json();
  },

  async createMedia(mediaData) {
    const res = await fetch(`${BASE_URL}/media/`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(mediaData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || 'Failed to add media');
    return data;
  },

  async updateMedia(id, mediaData) {
    const res = await fetch(`${BASE_URL}/media/${id}/`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(mediaData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || 'Failed to update media');
    return data;
  },

  async patchMedia(id, patchData) {
    const res = await fetch(`${BASE_URL}/media/${id}/`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(patchData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || 'Failed to patch media');
    return data;
  },

  async deleteMedia(id) {
    const res = await fetch(`${BASE_URL}/media/${id}/`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!res.ok && res.status !== 204) throw new Error('Failed to delete media');
    return true;
  },
};
