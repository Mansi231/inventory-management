import { useEffect, useState } from 'react';
import { Button, Card, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useOrderStore } from '../store/orderStore';
import { useAuthStore } from '../store/authStore';
import { getProducts } from '../services/api';
import PageHeader from '../components/common/PageHeader';
import OrderTable from '../components/orders/OrderTable';
import OrderForm from '../components/orders/OrderForm';

export default function Orders() {
  const { orders, loading, fetchOrders, placeOrder, changeStatus } = useOrderStore();
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';

  const [formOpen, setFormOpen] = useState(false);
  const [formProducts, setFormProducts] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const openCreate = () => {
    setFormOpen(true);
    getProducts()
      .then((res) => setFormProducts(res.data.filter((p) => p.isActive)))
      .catch(() => {});
  };

  const handlePlaceOrder = async ({ customerName, items }) => {
    setSubmitting(true);
    try {
      await placeOrder({ customerName, items });
      message.success('Order placed successfully!');
      setFormOpen(false);
    } catch (err) {
      message.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (order, newStatus) => {
    try {
      await changeStatus(order._id, newStatus);
      message.success(`Order marked as ${newStatus}.`);
    } catch (err) {
      message.error(err.message);
    }
  };

  return (
    <div>
      <PageHeader
        title="Order Management"
        subtitle="Track customer orders and manage their status."
        action={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={openCreate}
            style={{ borderRadius: 8, fontWeight: 500 }}
          >
            New Order
          </Button>
        }
      />

      <Card
        bordered={false}
        style={{ borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
        styles={{ body: { padding: 0 } }}
      >
        <OrderTable
          orders={orders}
          loading={loading}
          onStatusChange={handleStatusChange}
          canChangeStatus={isAdmin}
        />
      </Card>

      <OrderForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handlePlaceOrder}
        products={formProducts}
        submitting={submitting}
      />
    </div>
  );
}
