import { create } from 'zustand';
import { getDashboardSummary } from '../services/api';

export const useDashboardStore = create((set) => ({
  summary: null,
  loading: false,
  error: null,

  fetchSummary: async () => {
    set({ loading: true, error: null });
    try {
      const res = await getDashboardSummary();
      set({ summary: res.data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },
}));
