import { create } from 'zustand';
import { getOrders, createOrder, updateOrderStatus } from '../services/api';

export const useOrderStore = create((set, get) => ({
  orders: [],
  loading: false,
  error: null,

  fetchOrders: async () => {
    set({ loading: true, error: null });
    try {
      const res = await getOrders();
      set({ orders: res.data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  placeOrder: async (data) => {
    const res = await createOrder(data);
    await get().fetchOrders();
    return res;
  },

  changeStatus: async (id, status) => {
    await updateOrderStatus(id, status);
    await get().fetchOrders();
  },
}));
