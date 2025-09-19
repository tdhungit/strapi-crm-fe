import {
  ModalForm,
  ProForm,
  ProFormDatePicker,
  ProFormDigit,
  ProFormSelect,
} from '@ant-design/pro-components';
import { App, Col, Row } from 'antd';
import ApiService from '../../../services/ApiService';

export default function ProductPriceFormModal({
  open,
  variant,
  price,
  onOpenChange,
  onFinish,
}: {
  open: boolean;
  variant: any;
  price?: any;
  onOpenChange: (open: boolean) => void;
  onFinish?: (record: any) => void;
}) {
  const [form] = ProForm.useForm();
  const { message, notification } = App.useApp();

  const handleSave = async (values: any) => {
    message.loading('Saving...');
    ApiService.getClient()
      .collection('product-prices')
      .create({
        ...values,
        product_variant: variant.id,
      })
      .then((response) => {
        notification.success({
          message: 'Success',
          description: 'Price saved successfully',
        });
        onFinish?.(response.data);
        onOpenChange(false);
      })
      .catch((error) => {
        console.log(error);
        notification.error({
          message: 'Error',
          description: 'Failed to save price',
        });
      })
      .finally(() => {
        form.resetFields();
        message.destroy();
      });
  };

  return (
    <ModalForm
      title={price ? 'Edit Price' : 'Add Price'}
      open={open}
      onOpenChange={onOpenChange}
      form={form}
      onFinish={handleSave}
    >
      <Row gutter={[16, 0]}>
        <Col span={8}>
          <ProFormSelect
            name='price_type'
            label='Price Type'
            options={[
              { label: 'Cost Price', value: 'Cost' },
              { label: 'Sale Price', value: 'Sale' },
            ]}
            initialValue='Cost'
          />
        </Col>
        <Col span={8}>
          <ProFormDigit name='price' label='Price' />
        </Col>
        <Col span={8}>
          <ProFormSelect
            name='price_status'
            label='Price Status'
            options={[
              { label: 'Active', value: 'Active' },
              { label: 'Inactive', value: 'Inactive' },
            ]}
            initialValue='Active'
          />
        </Col>
        <Col span={8}>
          <ProFormDatePicker name='start_date' label='Start Date' />
        </Col>
        <Col span={8}>
          <ProFormDatePicker name='end_date' label='End Date' />
        </Col>
      </Row>
    </ModalForm>
  );
}
