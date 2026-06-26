import { useState } from 'react';
import { Layout, Menu, Typography, theme, Avatar, Tag, Dropdown, Button } from 'antd';
import {
  DashboardOutlined,
  ShoppingOutlined,
  OrderedListOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  InboxOutlined,
  LogoutOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const { Header, Sider, Content } = Layout;
const { Text, Title } = Typography;

const NAV_ITEMS = [
  { key: '/', icon: <DashboardOutlined />, label: 'Dashboard' },
  { key: '/products', icon: <ShoppingOutlined />, label: 'Products' },
  { key: '/orders', icon: <OrderedListOutlined />, label: 'Orders' },
];

const PAGE_TITLES = {
  '/': 'Dashboard',
  '/products': 'Product Inventory',
  '/orders': 'Order Management',
};

function avatarColor(name = '') {
  const palette = ['#1677ff', '#7c3aed', '#059669', '#d97706'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return palette[Math.abs(hash) % palette.length];
}

export default function AppLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = theme.useToken();
  const { user, logout } = useAuthStore();

  const pageTitle = PAGE_TITLES[location.pathname] || 'Inventory Management';

  const userMenuItems = [
    {
      key: 'info',
      label: (
        <div style={{ padding: '4px 0' }}>
          <div style={{ fontWeight: 600, color: '#0f172a' }}>{user?.name}</div>
          <div style={{ fontSize: 12, color: '#64748b' }}>{user?.email}</div>
        </div>
      ),
      disabled: true,
    },
    { type: 'divider' },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Sign Out',
      danger: true,
      onClick: () => {
        logout();
        navigate('/login');
      },
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={220}
        style={{
          background: '#0f172a',
          boxShadow: '2px 0 12px rgba(0,0,0,0.2)',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 100,
        }}
      >
        {/* Brand logo */}
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            padding: collapsed ? 0 : '0 20px',
            borderBottom: '1px solid rgba(255,255,255,0.07)',
            gap: 10,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: 'linear-gradient(135deg, #1677ff, #0ea5e9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <InboxOutlined style={{ color: '#fff', fontSize: 16 }} />
          </div>
          {!collapsed && (
            <div>
              <Title level={5} style={{ margin: 0, color: '#f1f5f9', fontSize: 14, lineHeight: 1.2 }}>
                IMS Pro
              </Title>
              <Text style={{ color: '#64748b', fontSize: 10 }}>Inventory System</Text>
            </div>
          )}
        </div>

        {!collapsed && (
          <div style={{ padding: '12px 16px 4px' }}>
            <Text
              style={{
                color: '#475569',
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              Navigation
            </Text>
          </div>
        )}

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={NAV_ITEMS}
          onClick={({ key }) => navigate(key)}
          style={{ background: 'transparent', borderRight: 0, marginTop: 4 }}
        />

        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '12px 16px',
            borderTop: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          {!collapsed && (
            <Text style={{ color: '#475569', fontSize: 11, display: 'block', textAlign: 'center' }}>
              © 2024 IMS Pro v1.0
            </Text>
          )}
        </div>
      </Sider>

      <Layout style={{ marginLeft: collapsed ? 80 : 220, transition: 'margin-left 0.2s' }}>
        <Header
          style={{
            padding: '0 24px',
            background: token.colorBgContainer,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: `1px solid ${token.colorBorderSecondary}`,
            boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
            position: 'sticky',
            top: 0,
            zIndex: 99,
          }}
        >
          {/* Left: collapse toggle + page title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span
              style={{ fontSize: 18, cursor: 'pointer', color: token.colorTextSecondary, lineHeight: 1 }}
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </span>
            <Title level={5} style={{ margin: 0, color: '#0f172a' }}>{pageTitle}</Title>
          </div>

          {/* Right: role badge + user avatar dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {user?.role && (
              <Tag color={user.role === 'admin' ? 'blue' : 'green'} style={{ margin: 0, fontWeight: 600 }}>
                {user.role.toUpperCase()}
              </Tag>
            )}
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" trigger={['click']}>
              <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Avatar
                  size={34}
                  style={{
                    background: avatarColor(user?.name || ''),
                    fontWeight: 600,
                    fontSize: 14,
                  }}
                  icon={!user?.name ? <UserOutlined /> : undefined}
                >
                  {user?.name?.charAt(0)?.toUpperCase()}
                </Avatar>
                {!collapsed && (
                  <Text style={{ fontSize: 13, fontWeight: 500, color: '#0f172a', maxWidth: 120 }} ellipsis>
                    {user?.name}
                  </Text>
                )}
              </div>
            </Dropdown>
          </div>
        </Header>

        <Content style={{ margin: 24, minHeight: 'calc(100vh - 112px)' }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
