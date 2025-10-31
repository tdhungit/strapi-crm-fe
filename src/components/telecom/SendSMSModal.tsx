import { ModalForm, ProFormTextArea } from '@ant-design/pro-components';
import { App } from 'antd';
import ApiService from '../../services/ApiService';

export default function SendSMSModal({
  open,
  onOpenChange,
  to,
  module,
  recordId,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  to: string;
  module: string;
  recordId: string;
  onSuccess: () => void;
}) {
  const { message, notification } = App.useApp();

  const handleSendSMS = async (values: any) => {
    if (!values.message) {
      notification.error({
        message: 'Error',
        description: 'Please enter a message',
      });
      return;
    }

    message.loading('Sending SMS...');
    try {
      await ApiService.request('post', '/telecoms/sms/send', {
        to,
        body: values.message,
        module,
        recordId,
      });
      notification.success({
        message: 'Success',
        description: 'SMS sent successfully',
      });
      onSuccess();
    } catch (error: any) {
      console.log(error);
      notification.error({
        message: 'Error',
        description: 'Failed to send SMS',
      });
    } finally {
      message.destroy();
    }
  };

  return (
    <ModalForm open={open} onOpenChange={onOpenChange} onFinish={handleSendSMS}>
      <ProFormTextArea
        name='message'
        label='Message'
        rules={[{ required: true, message: 'Please enter a message' }]}
      />
    </ModalForm>
  );
}
