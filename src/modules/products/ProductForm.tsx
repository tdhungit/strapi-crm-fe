import {
  PageContainer,
  ProForm,
  ProFormList,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { Col, Row } from 'antd';
import { useParams } from 'react-router-dom';
import RichtextInput from '../../components/fields/richtext/RichtextInput';

export default function ProductForm() {
  const { id } = useParams();

  return (
    <PageContainer
      header={{
        title: id ? 'Edit Product' : 'Create Product',
        breadcrumb: {
          items: [
            {
              title: 'Home',
              href: '/home',
            },
            {
              title: 'Products',
              href: '/collections/products',
            },
            {
              title: id ? 'Edit' : 'Create',
            },
          ],
        },
      }}
    >
      <div className='w-full bg-white p-4 rounded-md'>
        <ProForm
          onFinish={async (values) => {
            console.log(values);
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <ProFormText name='name' label='Name' />
            </Col>
            <Col span={12}>
              <ProFormText name='unit' label='Unit' />
            </Col>
          </Row>

          <ProForm.Item name='description' label='Description'>
            <RichtextInput />
          </ProForm.Item>

          <ProFormList
            name='variants'
            label='Product Variants'
            creatorButtonProps={{
              creatorButtonText: 'Add New Variant',
            }}
          >
            {() => {
              return (
                <div className='w-full'>
                  <Row gutter={16}>
                    <Col span={8}>
                      <ProFormText name='name' label='Name' />
                    </Col>
                    <Col span={8}>
                      <ProFormText name='sku' label='SKU' />
                    </Col>
                    <Col span={8}>
                      <ProFormSelect
                        name='variant_status'
                        label='Status'
                        options={[
                          {
                            label: 'Active',
                            value: 'active',
                          },
                          {
                            label: 'Inactive',
                            value: 'inactive',
                          },
                        ]}
                      />
                    </Col>
                  </Row>
                </div>
              );
            }}
          </ProFormList>
        </ProForm>
      </div>
    </PageContainer>
  );
}
