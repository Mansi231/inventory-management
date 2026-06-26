import { Table, Tag, Button, Space, Popconfirm, Typography } from 'antd';
import { EditOutlined, DeleteOutlined, WarningOutlined } from '@ant-design/icons';
import CategoryTag from '../common/CategoryTag';

const { Text } = Typography;

/**
 * Products data table.
 * Props: products, loading, onEdit, onDelete, canEdit (bool), canDelete (bool)
 */
export default function ProductTable({ products, loading, onEdit, onDelete, canEdit, canDelete }) {
  const columns = [
    {
      title: 'Product',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
      render: (name, record) => (
        <div>
          <Text strong style={{ fontSize: 13 }}>{name}</Text>
          <br />
          <Tag style={{ marginTop: 2, fontSize: 10 }}>{record.sku}</Tag>
        </div>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (v) => <CategoryTag category={v} />,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (v) => (
        <Text strong style={{ color: '#1677ff' }}>₹{Number(v).toFixed(2)}</Text>
      ),
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
      render: (v, record) => {
        const isOut = v === 0;
        const isLow = v <= record.reorderLevel;
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Tag
              color={isOut ? 'error' : isLow ? 'warning' : 'success'}
              style={{ minWidth: 38, textAlign: 'center', fontWeight: 700, fontSize: 13 }}
            >
              {v}
            </Tag>
            {isLow && !isOut && <WarningOutlined style={{ color: '#f59e0b', fontSize: 12 }} />}
            {isOut && <Text style={{ color: '#ef4444', fontSize: 11 }}>Out</Text>}
          </div>
        );
      },
      sorter: (a, b) => a.stock - b.stock,
    },
    {
      title: 'Reorder At',
      dataIndex: 'reorderLevel',
      key: 'reorderLevel',
      render: (v) => <Text type="secondary">{v}</Text>,
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (v) => (
        <Tag color={v ? 'blue' : 'default'} style={{ fontWeight: 500 }}>
          {v ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
  ];

  if (canEdit || canDelete) {
    columns.push({
      title: 'Actions',
      key: 'actions',
      width: 90,
      render: (_, record) => (
        <Space size={4}>
          {canEdit && (
            <Button
              icon={<EditOutlined />}
              size="small"
              type="text"
              style={{ color: '#1677ff' }}
              onClick={() => onEdit(record)}
            />
          )}
          {canDelete && (
            <Popconfirm
              title="Delete product?"
              description="This action cannot be undone."
              onConfirm={() => onDelete(record._id)}
              okText="Delete"
              okButtonProps={{ danger: true }}
              cancelText="Cancel"
            >
              <Button icon={<DeleteOutlined />} size="small" type="text" danger />
            </Popconfirm>
          )}
        </Space>
      ),
    });
  }

  return (
    <Table
      columns={columns}
      dataSource={products}
      rowKey="_id"
      loading={loading}
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        showTotal: (total) => `${total} products`,
        style: { padding: '12px 20px' },
      }}
      scroll={{ x: 780 }}
      style={{ borderRadius: 12, overflow: 'hidden' }}
    />
  );
}
