import { create } from 'zustand';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../services/api';

export const useProductStore = create((set, get) => ({
  products: [],
  loading: false,
  error: null,
  search: '',
  categoryFilter: '',

  setSearch: (search) => set({ search }),
  setCategoryFilter: (categoryFilter) => set({ categoryFilter }),

  fetchProducts: async () => {
    const { search, categoryFilter } = get();
    const params = {};
    if (search) params.search = search;
    if (categoryFilter) params.category = categoryFilter;
    set({ loading: true, error: null });
    try {
      const res = await getProducts(params);
      set({ products: res.data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  addProduct: async (data) => {
    const res = await createProduct(data);
    await get().fetchProducts();
    return res;
  },

  editProduct: async (id, data) => {
    await updateProduct(id, data);
    await get().fetchProducts();
  },

  removeProduct: async (id) => {
    await deleteProduct(id);
    set((state) => ({ products: state.products.filter((p) => p._id !== id) }));
  },
}));
