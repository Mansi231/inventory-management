import { Card, Typography } from 'antd';

const { Text } = Typography;

/**
 * Reusable stat card for dashboard summary tiles.
 * Props: label, value, icon, iconColor, iconBg, accentColor, description
 */
export default function StatCard({ label, value, icon, iconColor, iconBg, accentColor, description }) {
  return (
    <Card
      bordered={false}
      styles={{ body: { padding: 0 } }}
      style={{
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: 'default',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.12)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.07)';
      }}
    >
      <div style={{ height: 4, background: accentColor }} />
      <div style={{ padding: '20px 24px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <Text
              style={{
                fontSize: 12,
                color: '#64748b',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              {label}
            </Text>
            <div
              style={{ fontSize: 40, fontWeight: 800, color: '#0f172a', lineHeight: 1.1, marginTop: 6 }}
            >
              {value ?? 0}
            </div>
          </div>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: iconBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 22,
              color: iconColor,
              flexShrink: 0,
            }}
          >
            {icon}
          </div>
        </div>
        <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid #f1f5f9' }}>
          <Text style={{ fontSize: 12, color: '#94a3b8' }}>{description}</Text>
        </div>
      </div>
    </Card>
  );
}
