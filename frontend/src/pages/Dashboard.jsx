import { useEffect } from 'react';
import { Row, Col } from 'antd';
import {
  AppstoreOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { useDashboardStore } from '../store/dashboardStore';
import StatCard from '../components/common/StatCard';
import PageHeader from '../components/common/PageHeader';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorAlert from '../components/common/ErrorAlert';

const STAT_CARDS = [
  {
    key: 'totalProducts',
    label: 'Total Products',
    icon: <AppstoreOutlined />,
    iconColor: '#1677ff',
    iconBg: '#dbeafe',
    accentColor: 'linear-gradient(90deg, #1677ff, #0ea5e9)',
    description: 'Products in catalog',
  },
  {
    key: 'totalOrders',
    label: 'Total Orders',
    icon: <FileTextOutlined />,
    iconColor: '#059669',
    iconBg: '#d1fae5',
    accentColor: 'linear-gradient(90deg, #059669, #34d399)',
    description: 'All time orders',
  },
  {
    key: 'pendingOrders',
    label: 'Pending Orders',
    icon: <ClockCircleOutlined />,
    iconColor: '#d97706',
    iconBg: '#fef3c7',
    accentColor: 'linear-gradient(90deg, #d97706, #fbbf24)',
    description: 'Awaiting confirmation',
  },
  {
    key: 'lowStockProducts',
    label: 'Low Stock Alerts',
    icon: <WarningOutlined />,
    iconColor: '#dc2626',
    iconBg: '#fee2e2',
    accentColor: 'linear-gradient(90deg, #dc2626, #f87171)',
    description: 'Below reorder level',
  },
];

export default function Dashboard() {
  const { summary, loading, error, fetchSummary } = useDashboardStore();

  useEffect(() => {
    fetchSummary();
  }, []);

  if (loading) return <LoadingSpinner height={300} />;
  if (error) return <ErrorAlert message={error} onRetry={fetchSummary} />;

  return (
    <div>
      <PageHeader
        title="Dashboard Overview"
        subtitle="Real-time snapshot of your inventory and orders."
      />

      <Row gutter={[20, 20]}>
        {STAT_CARDS.map((card) => (
          <Col xs={24} sm={12} xl={6} key={card.key}>
            <StatCard
              label={card.label}
              value={summary?.[card.key]}
              icon={card.icon}
              iconColor={card.iconColor}
              iconBg={card.iconBg}
              accentColor={card.accentColor}
              description={card.description}
            />
          </Col>
        ))}
      </Row>
    </div>
  );
}
