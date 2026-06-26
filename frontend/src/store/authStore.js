import { create } from 'zustand';
import { loginUser, registerUser } from '../services/api';

const TOKEN_KEY = 'ims_token';
const USER_KEY = 'ims_user';

const loadFromStorage = () => {
  try {
    return {
      token: localStorage.getItem(TOKEN_KEY) || null,
      user: JSON.parse(localStorage.getItem(USER_KEY)) || null,
    };
  } catch {
    return { token: null, user: null };
  }
};

export const useAuthStore = create((set) => ({
  ...loadFromStorage(),
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await loginUser({ email, password });
      const { token, user } = res.data;
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      set({ token, user, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  register: async (name, email, password, role) => {
    set({ loading: true, error: null });
    try {
      const res = await registerUser({ name, email, password, role });
      const { token, user } = res.data;
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      set({ token, user, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    set({ token: null, user: null, error: null });
  },

  clearError: () => set({ error: null }),
}));
