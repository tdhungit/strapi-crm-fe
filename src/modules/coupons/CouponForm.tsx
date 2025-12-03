import { PlusOutlined } from '@ant-design/icons';
import {
  PageContainer,
  ProForm,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { App, Button, Col, Row, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  breadcrumbItemRender,
  strapiClientErrorMessage,
} from '../../helpers/views_helper';
import ApiService from '../../services/ApiService';
import CollectionListModal from '../collections/components/CollectionListModal';

export default function CouponForm() {
  const { id } = useParams();
  const { message, notification } = App.useApp();
  const navigate = useNavigate();
  const [form] = ProForm.useForm();

  const [maxAmountDisable, setMaxAmountDisable] = useState(true);
  const [openProductCategories, setOpenProductCategories] = useState(false);
  const [selectedProductCategories, setSelectedProductCategories] = useState<
    any[]
  >([]);

  const onFormChange = (changeValues: any) => {
    if (changeValues.discount_type) {
      if (changeValues.discount_type === 'amount') {
        setMaxAmountDisable(true);
      } else {
        setMaxAmountDisable(false);
      }
    }
  };

  const handleProductCategoriesChange = (values: any) => {
    if (!Array.isArray(values)) {
      values = [values];
    }

    setSelectedProductCategories((prev: any[]) => {
      const newValues = [...prev];
      values.forEach((value: any) => {
        if (newValues.findIndex((v: any) => v.id === value.id) === -1) {
          newValues.push(value);
        }
      });
      return newValues;
    });
    setOpenProductCategories(false);
  };

  const handleSave = async (values: any) => {
    const product_categories = selectedProductCategories.map(
      (item: any) => item.id
    );
    const payload = {
      ...values,
      product_categories: {
        connect: product_categories,
      },
    };

    let service;
    if (id) {
      service = ApiService.getClient()
        .collection('coupons')
        .update(id, payload);
    } else {
      service = ApiService.getClient().collection('coupons').create(payload);
    }

    message.loading('Saving coupon...');
    try {
      const res: any = await service;
      notification.success({
        message: 'Coupon saved successfully',
      });
      form.resetFields();
      navigate(`/collections/coupons/detail/${res.data.documentId}`);
    } catch (err: any) {
      const errorMessage = strapiClientErrorMessage(err);
      notification.error({
        message: 'Error',
        description: errorMessage,
      });
    } finally {
      message.destroy();
    }
  };

  useEffect(() => {
    if (id) {
      ApiService.getClient()
        .collection('coupons')
        .findOne(id, {
          populate: {
            product_categories: true,
          },
        })
        .then((res: any) => {
          form.setFieldsValue(res.data);
          setSelectedProductCategories(res.data.product_categories);
        })
        .catch((err: any) => {
          console.error(err);
        });
    }
  }, [id]);

  return (
    <>
      <PageContainer
        header={{
          title: 'Coupon Form',
          breadcrumb: {
            itemRender: breadcrumbItemRender,
            routes: [
              {
                path: '/',
                breadcrumbName: 'Home',
              },
              {
                path: '/collections/sale-orders',
                breadcrumbName: 'Sale Orders',
              },
              {
                path: '/collections/coupons',
                breadcrumbName: 'Coupons',
              },
              {
                breadcrumbName: 'Create Coupon',
              },
            ],
          },
        }}
      >
        <div className='w-full bg-white p-4 rounded-md'>
          <ProForm
            form={form}
            onValuesChange={onFormChange}
            onFinish={handleSave}
          >
            <Row gutter={16}>
              <Col span={12}>
                <ProFormText
                  name='name'
                  label='Name'
                  rules={[{ required: true }]}
                />
              </Col>
              <Col span={12}>
                <ProFormText
                  name='code'
                  label='Code'
                  rules={[{ required: true }]}
                />
              </Col>
            </Row>
            <ProFormTextArea name='description' label='Description' />
            <Row gutter={16}>
              <Col span={8}>
                <ProFormSelect
                  name='coupon_status'
                  label='Status'
                  options={[
                    { label: 'Active', value: 'Active' },
                    { label: 'Inactive', value: 'Inactive' },
                  ]}
                  rules={[{ required: true }]}
                />
              </Col>
              <Col span={8}>
                <ProFormSelect
                  name='coupon_type'
                  label='Type'
                  options={[
                    { label: 'Sale Order', value: 'Sale Order' },
                    { label: 'Shipping', value: 'Shipping' },
                  ]}
                  rules={[{ required: true }]}
                />
              </Col>
              <Col span={8}>
                <ProFormDigit
                  name='min_order_amount'
                  label='Min Order Amount'
                />
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={8}>
                <ProFormSelect
                  name='discount_type'
                  label='Discount Type'
                  options={[
                    { label: 'Amount', value: 'amount' },
                    { label: 'Percentage', value: 'percentage' },
                  ]}
                  rules={[{ required: true }]}
                />
              </Col>
              <Col span={8}>
                <ProFormDigit
                  name='discount_value'
                  label='Discount'
                  rules={[{ required: true }]}
                />
              </Col>
              <Col span={8}>
                <ProFormDigit
                  name='max_amount'
                  label='Max Amount'
                  disabled={maxAmountDisable}
                />
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <ProFormText name='start_date' label='Start Date' />
              </Col>
              <Col span={12}>
                <ProFormText name='end_date' label='End Date' />
              </Col>
            </Row>
            <div className='mb-5'>
              <Button
                variant='solid'
                color='cyan'
                onClick={() => setOpenProductCategories(true)}
                icon={<PlusOutlined />}
              >
                Add Product Categories
              </Button>
              <div className='mt-2'>
                {selectedProductCategories &&
                  selectedProductCategories.length > 0 &&
                  selectedProductCategories.map((item: any) => (
                    <Tag
                      key={item.id}
                      closable
                      onClose={() => {
                        setSelectedProductCategories(
                          selectedProductCategories.filter(
                            (i: any) => i.id !== item.id
                          )
                        );
                      }}
                    >
                      {item.name}
                    </Tag>
                  ))}
              </div>
            </div>
          </ProForm>
        </div>
      </PageContainer>

      <CollectionListModal
        open={openProductCategories}
        onOpenChange={setOpenProductCategories}
        module='product-categories'
        single={false}
        onFinish={handleProductCategoriesChange}
      />
    </>
  );
}
