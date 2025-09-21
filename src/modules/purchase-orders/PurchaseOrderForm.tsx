import {
  PageContainer,
  ProForm,
  ProFormText,
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
                <ProFormText name='description' label='Description' />
              </Col>
            </Row>
          </ProForm>
        </div>
      </PageContainer>
    </>
  );
}
