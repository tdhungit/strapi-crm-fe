import { EditOutlined } from '@ant-design/icons';
import { Form, Input, Modal, Select, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { iconMap } from '../../../config/icons';

interface MenuItem {
  key: string;
  label: string;
  icon?: string;
  weight?: number;
  children?: { key: string; label: string }[];
}

interface MenuModalFormProps {
  visible: boolean;
  menuItem?:
    | (MenuItem & { children?: { route: string; label: string }[] })
    | null;
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
  const [childrenItems, setChildrenItems] = useState<
    { key: string; label: string }[]
  >([]);

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
        <Form.Item name='key' label='Menu Key'>
          <Input placeholder='e.g., dashboard, user-management' />
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
              (option?.label as string)
                ?.toLowerCase()
                .includes(input.toLowerCase())
            }
            options={iconOptions}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
