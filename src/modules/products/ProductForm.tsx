import {
  PageContainer,
  ProForm,
  ProFormList,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { App, Col, Row } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MediaChoose from '../../components/fields/media/MediaChoose';
import RelationInput from '../../components/fields/relation/RelationInput';
import RichtextInput from '../../components/fields/richtext/RichtextInput';
import { toSlug } from '../../helpers/utils';
import { breadcrumbItemRender } from '../../helpers/views_helper';
import ApiService from '../../services/ApiService';
import ProductService from './ProductService';

export default function ProductForm() {
  const { id } = useParams();
  const [form] = ProForm.useForm();
  const { message, notification } = App.useApp();
  const navigate = useNavigate();

  const [attributes, setAttributes] = useState<any>([]);

  const fetchData = (id: string) => {
    ApiService.getClient()
      .collection('products')
      .findOne(id, {
        populate: [
          'product_variants.product_variant_attributes.product_attribute',
          'product_category',
        ],
      })
      .then((response) => {
        const normalizedData = ProductService.denormalizerFormValues(
          response.data
        );

        form.setFieldsValue(normalizedData);
      });
  };

  useEffect(() => {
    if (id) {
      fetchData(id);
    }
  }, [id]);

  const generateDataSave = (values: any) => {
    return ProductService.normalizerFormValues(values);
  };

  const loadCategoryAttributes = (categoryId: string) => {
    ApiService.getClient()
      .collection('product-attributes')
      .find({
        filters: {
          product_category: {
            $eq: categoryId,
          },
        },
      })
      .then((response) => {
        setAttributes(response.data);
      });
  };

  const onValuesChange = (changedValues: any, values: any) => {
    if (changedValues.product_category) {
      loadCategoryAttributes(changedValues.product_category.value);
    }

    if (changedValues.variants) {
      let addVariant = false;
      const newVariants: any[] = [];
      values.variants.forEach((variant: any) => {
        if (!variant.attributes || variant.attributes.length === 0) {
          addVariant = true;
          variant.attributes = attributes.map((attribute: any) => {
            return {
              attribute: {
                ...attribute,
                label: attribute.name,
                value: attribute.id,
                key: attribute.id,
              },
            };
          });
        }
        newVariants.push(variant);
      });

      if (addVariant) {
        form.setFieldsValue({
          variants: newVariants,
        });
      }

      console.log({ changedValues, values });
    }
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
            ...(id
              ? [
                  {
                    title: 'Detail',
                    href: `/collections/products/detail/${id}`,
                  },
                ]
              : []),
            {
              title: id ? 'Edit' : 'Create',
            },
          ],
          itemRender: breadcrumbItemRender,
        },
      }}
    >
      <div className='w-full bg-white p-4 rounded-md custom-antd-pro-form'>
        <ProForm
          form={form}
          onFinish={handleSave}
          onValuesChange={onValuesChange}
        >
          <Row gutter={16}>
            <Col span={12}>
              <ProFormText
                name='name'
                label='Name'
                rules={[{ required: true }]}
                fieldProps={{
                  onChange: (e) => {
                    form.setFieldValue('slug', toSlug(e.target.value));
                  },
                }}
              />
            </Col>
            <Col span={12}>
              <ProFormText
                name='slug'
                label='Slug'
                rules={[{ required: true }]}
              />
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
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
            <Col span={12}>
              <ProFormSelect
                name='unit'
                label='Unit'
                rules={[{ required: true }]}
                initialValue='Unit'
                options={[
                  {
                    label: 'Unit',
                    value: 'Unit',
                  },
                  {
                    label: 'Pcs',
                    value: 'Pcs',
                  },
                  {
                    label: 'Box',
                    value: 'Box',
                  },
                  {
                    label: 'Carton',
                    value: 'Carton',
                  },
                ]}
              />
            </Col>
          </Row>

          <ProForm.Item name='photos' label='Photos'>
            <MediaChoose />
          </ProForm.Item>

          <ProFormTextArea name='summary' label='Summary' />

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
              disabled:
                !form.getFieldValue('product_category') ||
                !form.getFieldValue('unit') ||
                !form.getFieldValue('name'),
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
                        rules={[{ required: true }]}
                        initialValue='Active'
                        options={[
                          {
                            label: 'Active',
                            value: 'Active',
                          },
                          {
                            label: 'Inactive',
                            value: 'Inactive',
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
                    creatorButtonProps={false}
                    actionRender={() => []}
                  >
                    {() => {
                      return (
                        <div className='w-full border border-gray-200 rounded-md px-4 pt-4 mt-2'>
                          <Row gutter={16}>
                            <Col span={12}>
                              <ProFormSelect
                                name='attribute'
                                label='Attribute Name'
                                request={async () => {
                                  return attributes.map((item: any) => ({
                                    label: item.name,
                                    value: item.id,
                                    metadata: item.metadata || {},
                                  }));
                                }}
                                fieldProps={{
                                  labelInValue: true,
                                }}
                                readonly
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
