import { Input, Select, Button, Row, Col } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import CategoryTag, { CATEGORY_COLORS } from '../common/CategoryTag';

const { Option } = Select;

const CATEGORIES = ['Electronics', 'Clothing', 'Food & Beverage', 'Furniture', 'Books', 'Sports', 'Other'];

/**
 * Search input + category filter bar for the Products page.
 * Props: search, onSearchChange, category, onCategoryChange, onAdd, canAdd (bool)
 */
export default function ProductFilters({ search, onSearchChange, category, onCategoryChange, onAdd, canAdd }) {
  return (
    <Row gutter={[12, 12]} align="middle">
      <Col xs={24} sm={10}>
        <Input
          placeholder="Search products by name..."
          prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          allowClear
          style={{ borderRadius: 8 }}
        />
      </Col>
      <Col xs={24} sm={8}>
        <Select
          placeholder="Filter by category"
          allowClear
          style={{ width: '100%' }}
          value={category || undefined}
          onChange={(v) => onCategoryChange(v || '')}
        >
          {CATEGORIES.map((c) => (
            <Option key={c} value={c}>
              <CategoryTag category={c} />
            </Option>
          ))}
        </Select>
      </Col>
      {canAdd && (
        <Col xs={24} sm={6} style={{ textAlign: 'right' }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={onAdd}
            style={{ borderRadius: 8, fontWeight: 500 }}
          >
            Add Product
          </Button>
        </Col>
      )}
    </Row>
  );
}
