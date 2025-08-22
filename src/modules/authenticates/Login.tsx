import { Button, Form, Input, message, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../services/AuthService';

const { Title } = Typography;

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
      message.error(error?.response?.data?.error?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: 400,
        margin: '80px auto',
        padding: 24,
        background: '#fff',
        borderRadius: 8,
        boxShadow: '0 2px 8px #f0f1f2',
      }}
    >
      <Title level={3} style={{ textAlign: 'center' }}>
        Login
      </Title>
      <Form name='login' layout='vertical' onFinish={onFinish} requiredMark={false}>
        <Form.Item
          label='Email or Username'
          name='identifier'
          rules={[{ required: true, message: 'Please input your email or username!' }]}
        >
          <Input placeholder='Email or Username' />
        </Form.Item>
        <Form.Item
          label='Password'
          name='password'
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password placeholder='Password' />
        </Form.Item>
        <Form.Item>
          <Button type='primary' htmlType='submit' block loading={loading}>
            Login
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
