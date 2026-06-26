import { useEffect, useState } from 'react';
import { Card, message } from 'antd';
import { useProductStore } from '../store/productStore';
import { useAuthStore } from '../store/authStore';
import PageHeader from '../components/common/PageHeader';
import ProductFilters from '../components/products/ProductFilters';
import ProductTable from '../components/products/ProductTable';
import ProductForm from '../components/products/ProductForm';

export default function Products() {
  const {
    products, loading, error,
    search, categoryFilter,
    setSearch, setCategoryFilter,
    fetchProducts, addProduct, editProduct, removeProduct,
  } = useProductStore();

  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';

  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [search, categoryFilter]);

  const openAdd = () => {
    setEditingProduct(null);
    setFormOpen(true);
  };

  const openEdit = (product) => {
    setEditingProduct(product);
    setFormOpen(true);
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      if (editingProduct) {
        await editProduct(editingProduct._id, values);
        message.success('Product updated successfully.');
      } else {
        await addProduct(values);
        message.success('Product created successfully.');
      }
      setFormOpen(false);
    } catch (err) {
      message.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await removeProduct(id);
      message.success('Product deleted.');
    } catch (err) {
      message.error(err.message);
    }
  };

  return (
    <div>
      <PageHeader
        title="Product Inventory"
        subtitle="Manage your products, stock levels, and pricing."
      />

      <Card
        bordered={false}
        style={{ marginBottom: 16, borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
        styles={{ body: { padding: '16px 20px' } }}
      >
        <ProductFilters
          search={search}
          onSearchChange={setSearch}
          category={categoryFilter}
          onCategoryChange={setCategoryFilter}
          onAdd={openAdd}
          canAdd={isAdmin}
        />
      </Card>

      <Card
        bordered={false}
        style={{ borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
        styles={{ body: { padding: 0 } }}
      >
        <ProductTable
          products={products}
          loading={loading}
          onEdit={openEdit}
          onDelete={handleDelete}
          canEdit={isAdmin}
          canDelete={isAdmin}
        />
      </Card>

      <ProductForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        editingProduct={editingProduct}
        submitting={submitting}
      />
    </div>
  );
}
