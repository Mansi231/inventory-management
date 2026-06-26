import { useState } from 'react';
import { Form, Input, Button, Card, Typography, Tabs, Select, Alert, Tag } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, InboxOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const { Title, Text } = Typography;
const { Option } = Select;

export default function Login() {
  const navigate = useNavigate();
  const { login, register, loading } = useAuthStore();
  const [activeTab, setActiveTab] = useState('login');
  const [error, setError] = useState('');
  const [loginForm] = Form.useForm();
  const [registerForm] = Form.useForm();

  const handleLogin = async (values) => {
    setError('');
    try {
      await login(values.email, values.password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRegister = async (values) => {
    setError('');
    try {
      await register(values.name, values.email, values.password, values.role);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div style={{ width: '100%', maxWidth: 440 }}>
        {/* Logo / Brand */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: 'linear-gradient(135deg, #1677ff, #0ea5e9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              boxShadow: '0 8px 24px rgba(22, 119, 255, 0.4)',
            }}
          >
            <InboxOutlined style={{ color: '#fff', fontSize: 28 }} />
          </div>
          <Title level={3} style={{ color: '#f1f5f9', margin: 0 }}>IMS Pro</Title>
          <Text style={{ color: '#64748b', fontSize: 13 }}>Inventory & Order Management System</Text>
        </div>

        <Card
          bordered={false}
          style={{ borderRadius: 16, boxShadow: '0 24px 48px rgba(0,0,0,0.3)' }}
        >
          {error && (
            <Alert
              message={error}
              type="error"
              showIcon
              closable
              onClose={() => setError('')}
              style={{ marginBottom: 20, borderRadius: 8 }}
            />
          )}

          <Tabs
            activeKey={activeTab}
            onChange={(key) => { setActiveTab(key); setError(''); }}
            centered
            items={[
              {
                key: 'login',
                label: 'Sign In',
                children: (
                  <Form
                    form={loginForm}
                    layout="vertical"
                    onFinish={handleLogin}
                    style={{ marginTop: 8 }}
                  >
                    <Form.Item
                      name="email"
                      label="Email"
                      rules={[
                        { required: true, message: 'Email is required' },
                        { type: 'email', message: 'Enter a valid email' },
                      ]}
                    >
                      <Input
                        prefix={<MailOutlined style={{ color: '#94a3b8' }} />}
                        placeholder="you@example.com"
                        size="large"
                      />
                    </Form.Item>

                    <Form.Item
                      name="password"
                      label="Password"
                      rules={[{ required: true, message: 'Password is required' }]}
                    >
                      <Input.Password
                        prefix={<LockOutlined style={{ color: '#94a3b8' }} />}
                        placeholder="Your password"
                        size="large"
                      />
                    </Form.Item>

                    <Form.Item style={{ marginBottom: 0, marginTop: 8 }}>
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        block
                        size="large"
                        style={{ borderRadius: 8, fontWeight: 600 }}
                      >
                        Sign In
                      </Button>
                    </Form.Item>
                  </Form>
                ),
              },
              {
                key: 'register',
                label: 'Register',
                children: (
                  <Form
                    form={registerForm}
                    layout="vertical"
                    onFinish={handleRegister}
                    style={{ marginTop: 8 }}
                    initialValues={{ role: 'staff' }}
                  >
                    <Form.Item
                      name="name"
                      label="Full Name"
                      rules={[{ required: true, message: 'Name is required' }]}
                    >
                      <Input
                        prefix={<UserOutlined style={{ color: '#94a3b8' }} />}
                        placeholder="John Doe"
                        size="large"
                      />
                    </Form.Item>

                    <Form.Item
                      name="email"
                      label="Email"
                      rules={[
                        { required: true, message: 'Email is required' },
                        { type: 'email', message: 'Enter a valid email' },
                      ]}
                    >
                      <Input
                        prefix={<MailOutlined style={{ color: '#94a3b8' }} />}
                        placeholder="you@example.com"
                        size="large"
                      />
                    </Form.Item>

                    <Form.Item
                      name="password"
                      label="Password"
                      rules={[
                        { required: true, message: 'Password is required' },
                        { min: 6, message: 'Minimum 6 characters' },
                      ]}
                    >
                      <Input.Password
                        prefix={<LockOutlined style={{ color: '#94a3b8' }} />}
                        placeholder="Min. 6 characters"
                        size="large"
                      />
                    </Form.Item>

                    <Form.Item name="role" label="Role">
                      <Select size="large">
                        <Option value="admin">
                          <Tag color="blue" style={{ margin: 0 }}>Admin</Tag> — Full access
                        </Option>
                        <Option value="staff">
                          <Tag color="green" style={{ margin: 0 }}>Staff</Tag> — Create orders, view products
                        </Option>
                      </Select>
                    </Form.Item>

                    <Form.Item style={{ marginBottom: 0, marginTop: 8 }}>
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        block
                        size="large"
                        style={{ borderRadius: 8, fontWeight: 600 }}
                      >
                        Create Account
                      </Button>
                    </Form.Item>
                  </Form>
                ),
              },
            ]}
          />
        </Card>

        <Text style={{ display: 'block', textAlign: 'center', color: '#475569', fontSize: 12, marginTop: 20 }}>
          Admin: full access · Staff: view & create orders
        </Text>
      </div>
    </div>
  );
}
