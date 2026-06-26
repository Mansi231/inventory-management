import { Tag } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, StopOutlined } from '@ant-design/icons';

const STATUS_CONFIG = {
  Pending: { color: 'gold', icon: <ClockCircleOutlined /> },
  Confirmed: { color: 'success', icon: <CheckCircleOutlined /> },
  Cancelled: { color: 'error', icon: <StopOutlined /> },
};

/**
 * Colored tag for order status.
 * Props: status — 'Pending' | 'Confirmed' | 'Cancelled'
 */
export default function StatusTag({ status }) {
  const cfg = STATUS_CONFIG[status] || { color: 'default', icon: null };
  return (
    <Tag color={cfg.color} icon={cfg.icon} style={{ fontWeight: 500, padding: '2px 8px' }}>
      {status}
    </Tag>
  );
}
