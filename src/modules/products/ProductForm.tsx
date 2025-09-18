import {
  PageContainer,
  ProForm,
  ProFormList,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { App, Col, Row } from 'antd';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MediaChoose from '../../components/fields/media/MediaChoose';
import RichtextInput from '../../components/fields/richtext/RichtextInput';
import ApiService from '../../services/ApiService';
import ProductService from './ProductService';

export default function ProductForm() {
  const { id } = useParams();
  const [form] = ProForm.useForm();
  const { message, notification } = App.useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      ApiService.getClient()
        .collection('products')
        .findOne(id, {
          populate: [
            'product_variants.product_variant_attributes.product_attribute',
          ],
        })
        .then((response) => {
          const normalizedData = ProductService.denormalizerFormValues(
            response.data
          );

          form.setFieldsValue(normalizedData);
        });
    }
  }, [id]);

  const generateDataSave = (values: any) => {
    return ProductService.normalizerFormValues(values);
  };

  const handleSave = async (values: any) => {
    const dataSave = generateDataSave(values);

    try {
      message.loading('Saving...', 0);
      let product;
      if (id) {
        product = await ApiService.getClient()
          .collection('products')
          .update(id, dataSave as any);
      } else {
        product = await ApiService.getClient()
          .collection('products')
          .create(dataSave as any);
      }

      message.destroy();
      notification.success({
        message: 'Success',
        description: 'Product saved successfully',
      });
      navigate(
        `/collections/products/detail/${
          product.data?.documentId || (product as any).documentId
        }`
      );
    } catch (error: any) {
      console.log(error);
      message.destroy();
      notification.error({
        message: 'Error',
        description: error?.error?.message || 'Failed to save',
      });
    }
  };

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
      <div className='w-full bg-white p-4 rounded-md custom-antd-pro-form'>
        <ProForm form={form} onFinish={handleSave}>
          <Row gutter={16}>
            <Col span={12}>
              <ProFormText name='name' label='Name' />
            </Col>
            <Col span={12}>
              <ProFormText name='unit' label='Unit' />
            </Col>
          </Row>

          <ProForm.Item name='photos' label='Photos'>
            <MediaChoose />
          </ProForm.Item>

          <ProForm.Item name='description' label='Description'>
            <RichtextInput />
          </ProForm.Item>

          <ProFormList
            name='variants'
            label='Product Variants'
            creatorButtonProps={{
              creatorButtonText: 'Add New Variant',
              style: {
                marginBottom: 16,
              },
            }}
            alwaysShowItemLabel
          >
            {() => {
              return (
                <div className='w-full mb-2 border border-gray-200 rounded-md px-4 pt-4'>
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

                  <ProForm.Item name='photos' label='Photos'>
                    <MediaChoose />
                  </ProForm.Item>

                  <ProFormList
                    name='attributes'
                    label='Attributes'
                    creatorButtonProps={{
                      creatorButtonText: '',
                      style: {
                        width: 60,
                      },
                      variant: 'outlined',
                      color: 'geekblue',
                    }}
                    alwaysShowItemLabel
                  >
                    {() => {
                      return (
                        <div className='w-full border border-gray-200 rounded-md mb-2 px-4 pt-4'>
                          <Row gutter={16}>
                            <Col span={12}>
                              <ProFormSelect
                                name='attribute'
                                label='Attribute'
                                request={async (params) => {
                                  const response = await ApiService.getClient()
                                    .collection('product-attributes')
                                    .find({
                                      filters: {
                                        name: {
                                          $contains: params?.keyWords,
                                        },
                                      },
                                    });
                                  const data = response.data || [];
                                  return data.map((item: any) => ({
                                    label: item.name,
                                    value: item.id,
                                    metadata: item.metadata || {},
                                  }));
                                }}
                                fieldProps={{
                                  labelInValue: true,
                                }}
                              />
                            </Col>
                            <Col span={12}>
                              <ProFormSelect
                                name='value'
                                label='Value'
                                dependencies={['attribute']}
                                request={async (params) => {
                                  const options: any[] = [];
                                  if (params?.attribute?.metadata?.options) {
                                    params.attribute.metadata.options.forEach(
                                      (item: any) => {
                                        options.push({
                                          label: item.value,
                                          value: item.value,
                                        });
                                      }
                                    );
                                  }
                                  return options;
                                }}
                              />
                            </Col>
                          </Row>
                        </div>
                      );
                    }}
                  </ProFormList>
                </div>
              );
            }}
          </ProFormList>
        </ProForm>
      </div>
    </PageContainer>
  );
}
