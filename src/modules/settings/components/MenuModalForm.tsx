import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, Input, Modal, Row, Select, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { iconMap } from '../../../config/icons';
import routes from '../../../config/routes';

interface MenuItem {
  key: string;
  label: string;
  icon?: string;
  weight?: number;
  children?: { key: string; label: string }[];
}

interface MenuModalFormProps {
  visible: boolean;
  menuItem?: (MenuItem & { children?: { route: string; label: string }[] }) | null;
  onCancel: () => void;
  onSave: (values: MenuItem) => void;
  loading?: boolean;
}

export default function MenuModalForm({
  visible,
  menuItem,
  onCancel,
  onSave,
  loading = false,
}: MenuModalFormProps) {
  const [form] = Form.useForm();
  const [childrenItems, setChildrenItems] = useState<{ key: string; label: string }[]>([]);

  // Reset form and children state when modal opens/closes or menuItem changes
  useEffect(() => {
    if (visible) {
      if (menuItem) {
        form.setFieldsValue({
          key: menuItem.key,
          label: menuItem.label,
          icon: menuItem.icon || undefined,
        });
        setChildrenItems(menuItem.children || []);
      } else {
        // Reset form and children for new item
        form.resetFields();
        setChildrenItems([]);
      }
    } else {
      // Reset form and children when modal is closed
      form?.resetFields();
      setChildrenItems([]);
    }
  }, [visible, menuItem, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSave({
        ...menuItem,
        ...values,
        children: childrenItems,
      });
    } catch (error) {
      console.error('Form validation failed:', error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setChildrenItems([]);
    onCancel();
  };

  const addChildItem = () => {
    setChildrenItems([...childrenItems, { key: '', label: '' }]);
  };

  const removeChildItem = (index: number) => {
    const newChildren = childrenItems.filter((_, i) => i !== index);
    setChildrenItems(newChildren);
  };

  const updateChildItem = (index: number, field: 'key' | 'label', value: string) => {
    const newChildren = [...childrenItems];
    newChildren[index] = { ...newChildren[index], [field]: value };
    setChildrenItems(newChildren);
  };

  // Create icon options for the select
  const iconOptions = Object.keys(iconMap).map((iconKey) => ({
    label: (
      <Space>
        {React.createElement(iconMap[iconKey])}
        <span>{iconKey}</span>
      </Space>
    ),
    value: iconKey,
  }));

  // Sample route options - you can replace this with actual routes from your app
  const routeOptions = routes.map((route) => ({
    label: route.name,
    value: route.path,
  }));

  return (
    <Modal
      title={
        <Space>
          <EditOutlined />
          {menuItem ? 'Edit Menu Item' : 'Add Menu Item'}
        </Space>
      }
      open={visible}
      onCancel={handleCancel}
      onOk={handleSubmit}
      confirmLoading={loading}
      width={600}
      destroyOnHidden
    >
      <Form
        form={form}
        layout='vertical'
        initialValues={{
          key: '',
          label: '',
          icon: undefined,
        }}
      >
        <Form.Item
          name='key'
          label='Menu Key'
          rules={[
            { required: true, message: 'Please enter the menu key' },
            {
              pattern: /^[a-z0-9-]+$/,
              message: 'Only lowercase letters, numbers, and hyphens are allowed',
            },
          ]}
        >
          <Input
            placeholder='e.g., dashboard, user-management'
            disabled={!!menuItem} // Key cannot be changed for existing items
          />
        </Form.Item>

        <Form.Item
          name='label'
          label='Menu Label'
          rules={[
            { required: true, message: 'Please enter the menu label' },
            { min: 2, message: 'Label must be at least 2 characters' },
          ]}
        >
          <Input placeholder='e.g., Dashboard, User Management' />
        </Form.Item>

        <Form.Item
          name='icon'
          label='Icon'
          rules={[{ required: true, message: 'Please select an icon' }]}
        >
          <Select
            placeholder='Select an icon'
            showSearch
            filterOption={(input, option: any) =>
              (option?.label as string)?.toLowerCase().includes(input.toLowerCase())
            }
            options={iconOptions}
          />
        </Form.Item>

        <Form.Item label='Children'>
          <div className='space-y-3'>
            {childrenItems.map((child, index) => (
              <Card key={index} size='small' className='bg-gray-50'>
                <Row gutter={8} align='middle'>
                  <Col span={10}>
                    <Form.Item label='Route' required style={{ marginBottom: 8 }}>
                      <Select
                        placeholder='Select route'
                        value={child.key}
                        onChange={(value) => updateChildItem(index, 'key', value)}
                        options={routeOptions}
                        showSearch
                        filterOption={(input: string, option: any) =>
                          option?.label?.toLowerCase().includes(input.toLowerCase())
                        }
                      />
                    </Form.Item>
                  </Col>
                  <Col span={10}>
                    <Form.Item label='Label' required style={{ marginBottom: 8 }}>
                      <Input
                        placeholder='Enter label'
                        value={child.label}
                        onChange={(e) => updateChildItem(index, 'label', e.target.value)}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={4} className='flex items-end'>
                    <Button
                      type='text'
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => removeChildItem(index)}
                      className='mt-5'
                    />
                  </Col>
                </Row>
              </Card>
            ))}

            <Button type='dashed' onClick={addChildItem} icon={<PlusOutlined />} className='w-full'>
              Add Child Item
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
}
