import {
  ModalForm,
  ProForm,
  ProFormDatePicker,
  ProFormDigit,
  ProFormSelect,
} from '@ant-design/pro-components';
import { App, Col, Row } from 'antd';
import { useEffect } from 'react';
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

  useEffect(() => {
    if (price) {
      form.setFieldsValue(price);
    }
  }, [price]);

  const handleSave = async (values: any) => {
    message.loading('Saving...');

    let result;
    if (price?.documentId) {
      result = ApiService.getClient()
        .collection('product-prices')
        .update(price.documentId, {
          ...values,
          product_variant: variant.id,
          start_date: values.start_date ? values.start_date : null,
          end_date: values.end_date ? values.end_date : null,
        });
    } else {
      result = ApiService.getClient()
        .collection('product-prices')
        .create({
          ...values,
          product_variant: variant.id,
        });
    }

    result
      .then((response) => {
        notification.success({
          message: 'Success',
          description: 'Price saved successfully',
        });
        onFinish?.(response.data || response);
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
      title={price?.id ? 'Edit Price' : 'Add Price'}
      open={open}
      onOpenChange={onOpenChange}
      form={form}
      onFinish={handleSave}
    >
      <Row gutter={[16, 0]}>
        <Col span={8}>
          <ProFormDigit name='before_price' label='Before Price' />
        </Col>
        <Col span={8}>
          <ProFormDigit
            name='price'
            label='Price'
            rules={[{ required: true }]}
          />
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
          <ProFormSelect
            name='price_type'
            label='Price Type'
            options={[
              { label: 'Sale Price', value: 'Sale' },
              { label: 'Cost Price', value: 'Cost' },
            ]}
            initialValue='Sale'
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
