import {
  PageContainer,
  ProForm,
  ProFormDatePicker,
  ProFormDigit,
  ProFormList,
} from '@ant-design/pro-components';
import { Col, Row } from 'antd';
import { useParams } from 'react-router-dom';
import RelationChoose from '../../components/fields/relation/RelationChoose';
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
              name='products'
              label='Products'
              creatorButtonProps={{
                creatorButtonText: 'Add New Product',
                style: {
                  marginBottom: 16,
                },
              }}
            >
              {() => (
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
                      <ProFormDigit name='quantity' label='Quantity' />
                    </Col>
                    <Col span={3}>
                      <ProFormDigit
                        name='unit_price'
                        label='Price'
                        disabled
                        placeholder=''
                      />
                    </Col>
                    <Col span={3}>
                      <ProFormDigit name='discount' label='Discount' />
                    </Col>
                    <Col span={3}>
                      <ProFormDigit name='tax' label='Tax' />
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
