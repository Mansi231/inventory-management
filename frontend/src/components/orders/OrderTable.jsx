import { Table, Button, Space, Avatar, Typography } from 'antd';
import StatusTag from '../common/StatusTag';

const { Text } = Typography;

const NEXT_STATUSES = {
  Pending: ['Confirmed', 'Cancelled'],
  Confirmed: ['Cancelled'],
  Cancelled: [],
};

function avatarColor(name = '') {
  const palette = ['#1677ff', '#7c3aed', '#059669', '#d97706', '#0891b2', '#db2777'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return palette[Math.abs(hash) % palette.length];
}

/**
 * Orders data table.
 * Props: orders, loading, onStatusChange, canChangeStatus (bool)
 */
export default function OrderTable({ orders, loading, onStatusChange, canChangeStatus }) {
  const columns = [
    {
      title: 'Customer',
      dataIndex: 'customerName',
      key: 'customerName',
      render: (name) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Avatar
            size={32}
            style={{ background: avatarColor(name), fontSize: 13, fontWeight: 600, flexShrink: 0 }}
          >
            {name?.charAt(0)?.toUpperCase()}
          </Avatar>
          <Text strong style={{ fontSize: 13 }}>{name}</Text>
        </div>
      ),
    },
    {
      title: 'Items',
      dataIndex: 'items',
      key: 'items',
      render: (items) => (
        <Space direction="vertical" size={2}>
          {items.map((item, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Text style={{ fontSize: 12, color: '#475569' }}>
                {item.productId?.name || 'Unknown'}
              </Text>
              <span
                style={{
                  fontSize: 10,
                  padding: '0 5px',
                  lineHeight: '18px',
                  background: '#f1f5f9',
                  borderRadius: 4,
                  color: '#475569',
                }}
              >
                ×{item.quantity}
              </span>
            </div>
          ))}
        </Space>
      ),
    },
    {
      title: 'Total',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (v) => (
        <Text strong style={{ color: '#1677ff', fontSize: 14 }}>
          ₹{Number(v).toFixed(2)}
        </Text>
      ),
      sorter: (a, b) => a.totalAmount - b.totalAmount,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <StatusTag status={status} />,
      filters: [
        { text: 'Pending', value: 'Pending' },
        { text: 'Confirmed', value: 'Confirmed' },
        { text: 'Cancelled', value: 'Cancelled' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (v) =>
        new Date(v).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      defaultSortOrder: 'descend',
    },
  ];

  if (canChangeStatus) {
    columns.push({
      title: 'Update Status',
      key: 'actions',
      render: (_, record) => {
        const next = NEXT_STATUSES[record.status] || [];
        if (next.length === 0) return <Text type="secondary" style={{ fontSize: 12 }}>—</Text>;
        return (
          <Space size={4}>
            {next.map((s) => (
              <Button
                key={s}
                size="small"
                type={s === 'Cancelled' ? 'default' : 'primary'}
                danger={s === 'Cancelled'}
                style={{ fontSize: 12, borderRadius: 6 }}
                onClick={() => onStatusChange(record, s)}
              >
                {s}
              </Button>
            ))}
          </Space>
        );
      },
    });
  }

  return (
    <Table
      columns={columns}
      dataSource={orders}
      rowKey="_id"
      loading={loading}
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        showTotal: (total) => `${total} orders`,
        style: { padding: '12px 20px' },
      }}
      scroll={{ x: 900 }}
      style={{ borderRadius: 12, overflow: 'hidden' }}
    />
  );
}
