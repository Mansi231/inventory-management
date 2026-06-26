import { Form, Input, InputNumber, Select, Switch, Button, Row, Col, Modal } from 'antd';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import CategoryTag, { CATEGORY_COLORS } from '../common/CategoryTag';

const { Option } = Select;

const CATEGORIES = ['Electronics', 'Clothing', 'Food & Beverage', 'Furniture', 'Books', 'Sports', 'Other'];

const INITIAL_VALUES = {
  name: '',
  sku: '',
  category: undefined,
  price: undefined,
  stock: undefined,
  reorderLevel: 5,
  isActive: true,
};

/**
 * Product add/edit modal form.
 * Props: open, onClose, onSubmit, editingProduct (null for add mode), submitting
 */
export default function ProductForm({ open, onClose, onSubmit, editingProduct, submitting }) {
  const [form] = Form.useForm();
  const isEditing = !!editingProduct;

  const handleOpen = () => {
    if (editingProduct) {
      form.setFieldsValue({ ...editingProduct });
    } else {
      form.setFieldsValue(INITIAL_VALUES);
    }
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {isEditing
            ? <EditOutlined style={{ color: '#1677ff' }} />
            : <PlusOutlined style={{ color: '#1677ff' }} />}
          <span>{isEditing ? 'Edit Product' : 'Add New Product'}</span>
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnClose
      afterOpenChange={(visible) => visible && handleOpen()}
      width={520}
    >
      <Form form={form} layout="vertical" onFinish={onSubmit} style={{ marginTop: 16 }}>
        <Row gutter={16}>
          <Col span={16}>
            <Form.Item
              name="name"
              label="Product Name"
              rules={[{ required: true, message: 'Name is required' }]}
            >
              <Input placeholder="e.g. Wireless Mouse" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="sku"
              label="SKU"
              rules={[{ required: true, message: 'SKU is required' }]}
            >
              <Input placeholder="WM-001" style={{ textTransform: 'uppercase' }} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="category"
          label="Category"
          rules={[{ required: true, message: 'Category is required' }]}
        >
          <Select placeholder="Select a category">
            {CATEGORIES.map((c) => (
              <Option key={c} value={c}>
                <CategoryTag category={c} />
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="price"
              label="Price (₹)"
              rules={[{ required: true, message: 'Required' }]}
            >
              <InputNumber min={0} precision={2} style={{ width: '100%' }} prefix="₹" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="stock"
              label="Stock"
              rules={[{ required: true, message: 'Required' }]}
            >
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="reorderLevel" label="Reorder Level" rules={[{ required: true }]}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="isActive" label="Status" valuePropName="checked">
          <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
        </Form.Item>

        <Form.Item style={{ marginBottom: 0, marginTop: 8 }}>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={submitting}>
              {isEditing ? 'Save Changes' : 'Create Product'}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
}
