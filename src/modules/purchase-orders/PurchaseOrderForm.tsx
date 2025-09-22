import {
  PageContainer,
  ProForm,
  ProFormDatePicker,
  ProFormDigit,
  ProFormList,
} from '@ant-design/pro-components';
import { Col, Row } from 'antd';
import { useParams } from 'react-router-dom';
import DiscountInput from '../../components/fields/discount/DiscountInput';
import RelationChoose from '../../components/fields/relation/RelationChoose';
import TaxInput from '../../components/fields/tax/TaxInput';
import { breadcrumbItemRender } from '../../helpers/views_helper';

export default function PurchaseOrderForm() {
  const { id } = useParams();
  const [form] = ProForm.useForm();

  const handleSave = (values: any) => {
    console.log(values);
  };

  return (
    <>
      <PageContainer
        header={{
          title: id ? 'Edit Purchase Order' : 'Create Purchase Order',
          breadcrumb: {
            routes: [
              {
                path: '/home',
                title: 'Home',
              },
              {
                path: '/collections/purchase-orders',
                title: 'Purchase Orders',
              },
              {
                path: '/collections/purchase-orders/create',
                title: 'Create',
              },
            ],
            itemRender: breadcrumbItemRender,
          },
        }}
      >
        <div className='w-full bg-white p-4 rounded-md custom-antd-pro-form'>
          <ProForm form={form} onFinish={handleSave}>
            <Row gutter={16}>
              <Col span={12}>
                <ProForm.Item name='supplier' label='Supplier'>
                  <RelationChoose module='suppliers' />
                </ProForm.Item>
              </Col>
              <Col span={12}>
                <ProFormDatePicker name='purchase_date' label='Order Date' />
              </Col>
            </Row>

            <ProFormList
              name='items'
              label='Details'
              creatorButtonProps={{
                creatorButtonText: 'Add New Product',
                style: {
                  marginBottom: 16,
                },
              }}
            >
              {(_field, index) => (
                <div className='w-full pl-4'>
                  <Row gutter={16}>
                    <Col span={8}>
                      <ProForm.Item name='product' label='Product'>
                        <RelationChoose module='products' onlyList />
                      </ProForm.Item>
                    </Col>
                    <Col span={4}>
                      <ProForm.Item name='warehouse' label='Warehouse'>
                        <RelationChoose module='warehouses' onlyList />
                      </ProForm.Item>
                    </Col>
                    <Col span={3}>
                      <ProFormDigit
                        name='quantity'
                        label='Quantity'
                        placeholder='Quantity'
                      />
                    </Col>
                    <Col span={3}>
                      <ProFormDigit
                        name='unit_price'
                        label='Price'
                        placeholder='Unit Price'
                      />
                    </Col>
                    <Col span={3}>
                      <ProForm.Item name='discount' label='Discount'>
                        <DiscountInput
                          amount={
                            form.getFieldValue('items')?.[index]?.unit_price ||
                            0
                          }
                        />
                      </ProForm.Item>
                    </Col>
                    <Col span={3}>
                      <ProForm.Item name='tax' label='Tax'>
                        <TaxInput
                          amount={
                            form.getFieldValue('items')?.[index]?.unit_price ||
                            0
                          }
                        />
                      </ProForm.Item>
                    </Col>
                  </Row>
                </div>
              )}
            </ProFormList>
          </ProForm>
        </div>
      </PageContainer>
    </>
  );
}
