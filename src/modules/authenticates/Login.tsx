import { LockOutlined, LoginOutlined, UserOutlined } from '@ant-design/icons';
import {
  App,
  Button,
  Card,
  Divider,
  Form,
  Input,
  Space,
  Typography,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../services/AuthService';

const { Title, Text } = Typography;

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { message } = App.useApp();

  useEffect(() => {
    // Check if user is already authenticated
    if (AuthService.isAuthenticated()) {
      navigate('/');
    }
  }, [navigate]);

  const onFinish = async (values: { identifier: string; password: string }) => {
    setLoading(true);
    try {
      await AuthService.login(values);
      message.success('Login successful!');
      navigate('/');
    } catch (error: any) {
      message.error(
        error?.response?.data?.error?.message ||
          'Login failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #004d00 0%, #006600 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <Card
        style={{
          width: '100%',
          maxWidth: 420,
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
          borderRadius: '8px',
          border: 'none',
        }}
        styles={{
          body: {
            padding: '40px 32px',
          },
        }}
      >
        <Space direction='vertical' size='large' style={{ width: '100%' }}>
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #004d00 0%, #006600 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
              }}
            >
              <LoginOutlined style={{ fontSize: 28, color: '#fff' }} />
            </div>
            <Title level={2} style={{ margin: 0, color: '#1f2937' }}>
              Welcome Back
            </Title>
            <Text type='secondary' style={{ fontSize: '16px' }}>
              Sign in to your account to continue
            </Text>
          </div>

          <Divider style={{ margin: '0' }} />

          <Form
            name='login'
            layout='vertical'
            onFinish={onFinish}
            requiredMark={false}
            size='large'
          >
            <Form.Item
              label='Email or Username'
              name='identifier'
              rules={[
                {
                  required: true,
                  message: 'Please input your email or username!',
                },
              ]}
            >
              <Input
                prefix={<UserOutlined style={{ color: '#9ca3af' }} />}
                placeholder='Enter your email or username'
                style={{ borderRadius: '8px' }}
              />
            </Form.Item>

            <Form.Item
              label='Password'
              name='password'
              rules={[
                { required: true, message: 'Please input your password!' },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: '#9ca3af' }} />}
                placeholder='Enter your password'
                style={{ borderRadius: '8px' }}
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0 }}>
              <Button
                type='primary'
                htmlType='submit'
                block
                loading={loading}
                style={{
                  height: '48px',
                  borderRadius: '8px',
                  background:
                    'linear-gradient(135deg, #004d00 0%, #006600 100%)',
                  border: 'none',
                  fontSize: '16px',
                  fontWeight: 500,
                }}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </Form.Item>
          </Form>
        </Space>
      </Card>
    </div>
  );
};

export default Login;
