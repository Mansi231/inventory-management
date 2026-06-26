import { useState } from 'react';
import { Modal, Form, Input, Select, InputNumber, Button, Space, Card, Row, Col, Divider, Typography, message } from 'antd';
import { PlusOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';

const { Text } = Typography;
const { Option } = Select;

/**
 * Create order modal form.
 * Props: open, onClose, onSubmit, products (array), submitting
 */
export default function OrderForm({ open, onClose, onSubmit, products, submitting }) {
  const [form] = Form.useForm();
  const [items, setItems] = useState([{ productId: undefined, quantity: 1 }]);

  const handleOpen = (visible) => {
    if (visible) {
      form.resetFields();
      setItems([{ productId: undefined, quantity: 1 }]);
    }
  };

  const addItem = () => setItems((prev) => [...prev, { productId: undefined, quantity: 1 }]);

  const removeItem = (idx) => setItems((prev) => prev.filter((_, i) => i !== idx));

  const updateItem = (idx, field, value) =>
    setItems((prev) => prev.map((item, i) => (i === idx ? { ...item, [field]: value } : item)));

  const previewTotal = items.reduce((sum, item) => {
    const product = products.find((p) => p._id === item.productId);
    return sum + (product ? product.price * (item.quantity || 0) : 0);
  }, 0);

  const handleSubmit = async () => {
    try {
      await form.validateFields();
    } catch {
      return;
    }

    if (items.some((i) => !i.productId || !i.quantity)) {
      message.error('Please fill in all order items.');
      return;
    }

    const uniqueProducts = new Set(items.map((i) => i.productId));
    if (uniqueProducts.size !== items.length) {
      message.error('Duplicate products detected. Please merge quantities.');
      return;
    }

    const { customerName } = form.getFieldsValue();
    onSubmit({ customerName, items });
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <PlusOutlined style={{ color: '#1677ff' }} />
          <span>Create New Order</span>
        </div>
      }
      open={open}
      onCancel={onClose}
      onOk={handleSubmit}
      okText="Place Order"
      confirmLoading={submitting}
      width={640}
      destroyOnClose
      afterOpenChange={handleOpen}
      okButtonProps={{ style: { borderRadius: 8 } }}
      cancelButtonProps={{ style: { borderRadius: 8 } }}
    >
      <Form form={form} layout="vertical" style={{ marginTop: 12 }}>
        <Form.Item
          name="customerName"
          label="Customer Name"
          rules={[{ required: true, message: 'Customer name is required' }]}
        >
          <Input
            placeholder="e.g. John Doe"
            prefix={<UserOutlined style={{ color: '#94a3b8' }} />}
          />
        </Form.Item>
      </Form>

      <Divider orientation="left" style={{ fontSize: 13, color: '#64748b' }}>
        Order Items
      </Divider>

      <Space direction="vertical" style={{ width: '100%' }} size={8}>
        {items.map((item, idx) => {
          const selected = products.find((p) => p._id === item.productId);
          return (
            <Card
              key={idx}
              size="small"
              style={{ borderRadius: 8, border: '1px solid #e2e8f0', background: '#fafafa' }}
              styles={{ body: { padding: '10px 14px' } }}
            >
              <Row gutter={10} align="middle">
                <Col span={12}>
                  <Select
                    placeholder="Select product"
                    style={{ width: '100%' }}
                    value={item.productId}
                    onChange={(v) => updateItem(idx, 'productId', v)}
                    showSearch
                    optionFilterProp="children"
                  >
                    {products.map((p) => (
                      <Option key={p._id} value={p._id} disabled={p.stock === 0}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>{p.name}</span>
                          <Text
                            type={p.stock === 0 ? 'danger' : 'secondary'}
                            style={{ fontSize: 11 }}
                          >
                            {p.stock === 0 ? 'Out of stock' : `Stock: ${p.stock}`}
                          </Text>
                        </div>
                      </Option>
                    ))}
                  </Select>
                </Col>
                <Col span={6}>
                  <InputNumber
                    min={1}
                    max={selected?.stock}
                    value={item.quantity}
                    onChange={(v) => updateItem(idx, 'quantity', v)}
                    style={{ width: '100%' }}
                    placeholder="Qty"
                  />
                </Col>
                <Col span={4} style={{ textAlign: 'right' }}>
                  {selected && (
                    <Text strong style={{ fontSize: 12, color: '#1677ff' }}>
                      ₹{(selected.price * item.quantity).toFixed(2)}
                    </Text>
                  )}
                </Col>
                <Col span={2} style={{ textAlign: 'center' }}>
                  {items.length > 1 && (
                    <Button
                      icon={<DeleteOutlined />}
                      size="small"
                      danger
                      type="text"
                      onClick={() => removeItem(idx)}
                    />
                  )}
                </Col>
              </Row>
            </Card>
          );
        })}
      </Space>

      <Button
        type="dashed"
        block
        onClick={addItem}
        style={{ marginTop: 10, borderRadius: 8 }}
        icon={<PlusOutlined />}
      >
        Add Another Item
      </Button>

      <div
        style={{
          marginTop: 16,
          padding: '12px 16px',
          background: '#f0f7ff',
          borderRadius: 8,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Text style={{ color: '#64748b', fontSize: 12 }}>Final total confirmed by server</Text>
        <Text strong style={{ fontSize: 16, color: '#0f172a' }}>
          Estimated: ₹{previewTotal.toFixed(2)}
        </Text>
      </div>
    </Modal>
  );
}
