
const API_URL =process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
async function fetchWithAuth(url, options = {}) {
  const res = await fetch(`${API_URL}${url}`, {
    ...options,
    credentials: 'include',
  });

  const data = await res.json().catch(() => ({ message: 'Something went wrong' }));

  if (!res.ok) {
    throw new Error(data.message || `Error ${res.status}`);
  }

  return data;
}

export const authAPI = {
  register: (data) =>
    fetchWithAuth('/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),

  login: (data) =>
    fetchWithAuth('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),

  logout: () => fetchWithAuth('/auth/logout', { method: 'POST' }),

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
