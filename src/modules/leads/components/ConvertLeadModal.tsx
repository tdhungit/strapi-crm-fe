import { ModalForm, ProForm } from '@ant-design/pro-components';
import { App, Modal } from 'antd';
import RelationChoose from '../../../components/fields/relation/RelationChoose';
import ApiService from '../../../services/ApiService';

export default function ConvertLeadModal({
  open,
  onOpenChange,
  lead,
  onFinished,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: any;
  onFinished?: () => void;
}) {
  const { confirm } = Modal;
  const { message, notification } = App.useApp();

  const onConvert = async (values: any) => {
    confirm({
      title: 'Convert Lead to Contact',
      content: 'Are you sure you want to convert this lead to contact?',
      onOk: () => {
        handleConvert(lead, values);
      },
    });
  };

  const handleConvert = async (lead: any, values: any) => {
    message.loading('Converting lead...', 0);
    try {
      await ApiService.request('post', `/leads/${lead.id}/convert-to-contact`, {
        accountId: values.account?.id || null,
      });
      notification.success({
        message: 'Success',
        description: 'Lead converted to contact successfully',
      });
    } catch (error: any) {
      console.error(error);
      notification.error({
        message: 'Error',
        description: error.response?.data?.error?.message || error.message,
      });
    } finally {
      message.destroy();
    }
    onFinished?.();
    onOpenChange(false);
  };

  return (
    <ModalForm
      open={open}
      onFinish={onConvert}
      onOpenChange={onOpenChange}
      title='Convert Lead to Contact'
      width={600}
    >
      <ProForm.Item name='account' label='Account'>
        <RelationChoose module='accounts' />
      </ProForm.Item>
    </ModalForm>
  );
}
