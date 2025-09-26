import { ModalForm, ProForm, ProFormText } from '@ant-design/pro-components';
import { App } from 'antd';
import ApiService from '../../../services/ApiService';

export default function ChangePasswordModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { message, notification } = App.useApp();
  const [form] = ProForm.useForm();

  return (
    <ModalForm
      open={open}
      title='Change Password'
      onOpenChange={onOpenChange}
      form={form}
      onFinish={async (values) => {
        message.open({
          type: 'loading',
          content: 'Saving...',
          duration: 0,
        });
        try {
          await ApiService.request('post', `/auth/change-password`, values);
          notification.success({
            message: 'Password changed successfully',
          });
          onOpenChange(false);
        } catch (error: any) {
          const errorMessage =
            error?.response?.data?.error?.message ||
            'Failed to change password';
          notification.error({
            message: errorMessage,
          });
          console.error('Password change error:', error);
        } finally {
          message.destroy();
          form.resetFields();
        }
      }}
    >
      <ProFormText.Password
        name='currentPassword'
        label='Current Password'
        rules={[
          { required: true, message: 'Please enter your current password' },
        ]}
      />
      <ProFormText.Password
        name='password'
        label='New Password'
        rules={[{ required: true, message: 'Please enter a new password' }]}
      />
      <ProFormText.Password
        name='passwordConfirmation'
        label='Confirm Password'
        rules={[
          { required: true, message: 'Please confirm your password' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
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
