
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function fetchWithAuth(url, options = {}) {
  const headers = {
    ...options.headers,
  };

  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const res = await fetch(`${API_URL}${url}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  const data = await res.json().catch(() => ({ message: 'Something went wrong' }));

  if (!res.ok) {
    if (res.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
    throw new Error(data.message || `Error ${res.status}`);
  }

  return data;
}

export const authAPI = {
  register: async (data) => {
    const res = await fetchWithAuth('/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res?.token && typeof window !== 'undefined') {
      localStorage.setItem('token', res.token);
    }
    return res;
  },

  login: async (data) => {
    const res = await fetchWithAuth('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res?.token && typeof window !== 'undefined') {
      localStorage.setItem('token', res.token);
    }
    return res;
  },

  logout: async () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
    return fetchWithAuth('/auth/logout', { method: 'POST' });
  },

  getProfile: () => fetchWithAuth('/profile'),
};

export const bookAPI = {
  getBooks: (params = {}) => {
    const query = new URLSearchParams();
    if (params.status) query.append('status', params.status);
    if (params.tag) query.append('tag', params.tag);
    if (params.search) query.append('search', params.search);
    return fetchWithAuth(`/books?${query.toString()}`);
  },

  getBook: (id) => fetchWithAuth(`/books/${id}`),

  createBook: (data) =>
    fetchWithAuth('/books', { method: 'POST', body: data }),

  updateBook: (id, data) =>
    fetchWithAuth(`/books/${id}`, { method: 'PUT', body: data }),

  deleteBook: (id) =>
    fetchWithAuth(`/books/${id}`, { method: 'DELETE' }),

  getDashboard: () => fetchWithAuth('/books/dashboard'),
};
