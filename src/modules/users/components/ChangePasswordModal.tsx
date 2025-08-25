import { ModalForm, ProFormText } from '@ant-design/pro-components';
import { Form, message } from 'antd';
import { useEffect } from 'react';
import ApiService from '../../../services/ApiService';

export default function ChangePasswordModal({
  open,
  onOpenChange,
  userId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: number;
}) {
  const [form] = Form.useForm();

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!open) {
      form.resetFields();
    }
  }, [open, form]);

  return (
    <ModalForm
      open={open}
      title='Change Password'
      onOpenChange={onOpenChange}
      form={form}
      onFinish={async (values) => {
        const hide = message.loading('Saving...', 0);
        try {
          await ApiService.request('post', `/users/change-password/${userId}`, values);
          hide();
          message.success('Password changed successfully');
          onOpenChange(false);
        } catch (error: any) {
          hide();
          const errorMessage = error?.response?.data?.error?.message || 'Failed to change password';
          message.error(errorMessage);
          console.error('Password change error:', error);
        }
      }}
    >
      <ProFormText.Password
        name='newPassword'
        label='New Password'
        rules={[{ required: true, message: 'Please enter a new password' }]}
      />
      <ProFormText.Password
        name='confirmPassword'
        label='Confirm Password'
        rules={[
          { required: true, message: 'Please confirm your password' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('newPassword') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('Passwords do not match'));
            },
          }),
        ]}
      />
    </ModalForm>
  );
}
