import { PageContainer } from '@ant-design/pro-components';
import { Button, Form, Input, message } from 'antd';
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ApiService from '../../services/ApiService';

const UserForm: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();

  useEffect(() => {
    if (id) {
      // Fetch user data for editing
      ApiService.getClient()
        .collection('users')
        .findOne(id)
        .then((res) => {
          form.setFieldsValue(res);
        })
        .catch(() => {
          message.error('Failed to fetch user data');
        });
    }
  }, [id, form]);

  const onFinish = async (values: any) => {
    try {
      if (id) {
        await ApiService.getClient().collection('users').update(id, values);
        message.success('User updated successfully');
      } else {
        await ApiService.getClient().collection('users').create(values);
        message.success('User created successfully');
      }
      navigate('/users');
    } catch (error: any) {
      console.error(error);
      message.error('Failed to submit user data');
    }
  };

  return (
    <PageContainer
      header={{
        title: id ? 'Edit User' : 'Create User',
        breadcrumb: {
          routes: [
            {
              href: '/',
              breadcrumbName: 'Home',
            },
            {
              href: '/users',
              breadcrumbName: 'Users',
            },
            id
              ? {
                  href: `/users/detail/${id}`,
                  breadcrumbName: 'User Detail',
                }
              : {},
            {
              breadcrumbName: id ? 'Edit User' : 'Create User',
            },
          ],
        },
      }}
    >
      <Form
        key={`user-${id || 0}`}
        form={form}
        layout='vertical'
        onFinish={onFinish}
        style={{ maxWidth: 400, margin: '0 auto', marginTop: 32 }}
      >
        <Form.Item
          label='Username'
          name='username'
          rules={[{ required: true, message: 'Please input username!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label='Email'
          name='email'
          rules={[
            { required: true, message: 'Please input email!' },
            { type: 'email', message: 'Please enter a valid email!' },
          ]}
        >
          <Input />
        </Form.Item>
        {!id && (
          <Form.Item
            label='Password'
            name='password'
            rules={[{ required: true, message: 'Please input password!' }]}
          >
            <Input.Password />
          </Form.Item>
        )}
        <Form.Item>
          <Button type='primary' htmlType='submit'>
            {id ? 'Update User' : 'Create User'}
          </Button>
        </Form.Item>
      </Form>
    </PageContainer>
  );
};

export default UserForm;
