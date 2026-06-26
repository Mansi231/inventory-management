import { Typography } from 'antd';

const { Title, Text } = Typography;

/**
 * Reusable page header with title, subtitle, and an optional action slot (e.g. a button).
 * Props: title, subtitle, action (ReactNode)
 */
export default function PageHeader({ title, subtitle, action }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 20,
      }}
    >
      <div>
        <Title level={3} style={{ margin: 0, color: '#0f172a' }}>
          {title}
        </Title>
        {subtitle && (
          <Text style={{ color: '#64748b', fontSize: 14 }}>{subtitle}</Text>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
