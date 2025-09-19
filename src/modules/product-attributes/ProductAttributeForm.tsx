import {
  PageContainer,
  ProForm,
  ProFormList,
  ProFormText,
} from '@ant-design/pro-components';
import { App } from 'antd';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
        .findOne(id)
        .then((res) => {
          form.setFieldsValue(res?.data);
        });
    }
  }, [id]);

  const onFinish = async (values: any) => {
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
          <ProFormText name='name' label='Name' />
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
