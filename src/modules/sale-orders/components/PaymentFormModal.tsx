import {
  ModalForm,
  ProFormDatePicker,
  ProFormSelect,
} from '@ant-design/pro-components';
import { App } from 'antd';
import { useSelector } from 'react-redux';
import ApiService from '../../../services/ApiService';
import type { RootState } from '../../../stores';

export default function PaymentFormModal({
  open,
  openChange,
  order,
  onFinish,
}: {
  open: boolean;
  openChange: (open: boolean) => void;
  order: any;
  onFinish?: () => void;
}) {
  const user = useSelector((state: RootState) => state?.auth?.user);
  const { message, notification } = App.useApp();

  const handleFinish = async (values: any) => {
    message.loading('Processing...', 0);
    ApiService.getClient()
      .collection('payments')
      .create({
        sale_order: order.id,
        ...values,
        amount: order.total_amount,
        created_user: user?.id,
      })
      .then(() => {
        notification.success({
          message: 'Payment created successfully',
        });
        openChange(false);
        onFinish?.();
      })
      .catch((err) => {
        notification.error({
          message: err.message,
        });
      })
      .finally(() => {
        message.destroy();
      });
  };

  return (
    <ModalForm open={open} onOpenChange={openChange} onFinish={handleFinish}>
      <ProFormSelect
        name='payment_method'
        label='Payment Method'
        initialValue={'COD'}
        rules={[
          {
            required: true,
          },
        ]}
        options={[
          {
            label: 'COD',
            value: 'COD',
          },
        ]}
      />

      <ProFormSelect
        name='payment_status'
        label='Payment Status'
        initialValue={'Completed'}
        rules={[
          {
            required: true,
          },
        ]}
        options={[
          {
            label: 'Completed',
            value: 'Completed',
          },
          {
            label: 'Pending',
            value: 'Pending',
          },
        ]}
      />

      <ProFormDatePicker
        name='payment_date'
        label='Payment Date'
        initialValue={new Date()}
        rules={[
          {
            required: true,
          },
        ]}
      />
    </ModalForm>
  );
}
