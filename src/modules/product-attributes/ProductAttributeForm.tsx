import {
  PageContainer,
  ProForm,
  ProFormDigit,
  ProFormList,
  ProFormText,
} from '@ant-design/pro-components';
import { App, Col, Row } from 'antd';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import RelationInput from '../../components/fields/relation/RelationInput';
import { breadcrumbItemRender } from '../../helpers/views_helper';
import ApiService from '../../services/ApiService';

export default function ProductAttributeForm() {
  const { id } = useParams();
  const [form] = ProForm.useForm();
  const { message, notification } = App.useApp();

  useEffect(() => {
    if (id) {
      ApiService.getClient()
        .collection('product-attributes')
        .findOne(id, {
          populate: ['product_category'],
        })
        .then((res) => {
          form.setFieldsValue(res?.data);
        });
    }
  }, [id]);

  const onFinish = async (values: any) => {
    if (values.product_category) {
      values.product_category =
        values.product_category.value || values.product_category.id;
    }
    try {
      message.loading('Saving...', 0);
      if (id) {
        await ApiService.getClient()
          .collection('product-attributes')
          .update(id, values);
      } else {
        await ApiService.getClient()
          .collection('product-attributes')
          .create(values);
      }
      message.destroy();
      notification.success({
        message: 'Saved successfully',
      });
    } catch (error: any) {
      console.error(error);
      message.destroy();
      notification.error({
        message: error?.error?.message || 'Failed to save',
      });
    }
  };

  return (
    <PageContainer
      header={{
        title: id ? 'Edit Product Attribute' : 'Create Product Attribute',
        breadcrumb: {
          items: [
            {
              title: 'Home',
              href: '/home',
            },
            {
              title: 'Product Attributes',
              href: '/collections/product-attributes',
            },
            {
              title: id ? 'Edit' : 'Create',
            },
          ],
          itemRender: breadcrumbItemRender,
        },
      }}
    >
      <div className='w-full bg-white p-4 rounded-md'>
        <ProForm form={form} onFinish={onFinish}>
          <Row gutter={[16, 16]}>
            <Col span={10}>
              <ProFormText name='name' label='Name' />
            </Col>
            <Col span={10}>
              <ProForm.Item
                name='product_category'
                label='Product Category'
                rules={[{ required: true }]}
              >
                <RelationInput
                  item={{
                    options: {
                      target: 'api::product-category.product-category',
                      mainField: 'name',
                    },
                  }}
                />
              </ProForm.Item>
            </Col>
            <Col span={4}>
              <ProFormDigit name='weight' label='Weight' />
            </Col>
          </Row>
          <ProFormList
            name={['metadata', 'options']}
            label='Options'
            creatorButtonProps={{
              creatorButtonText: 'Add Option',
            }}
          >
            <ProFormText name='value' label='Value' />
          </ProFormList>
        </ProForm>
      </div>
    </PageContainer>
  );
}
