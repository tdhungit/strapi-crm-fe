import { SelectOutlined } from '@ant-design/icons';
import {
  PageContainer,
  ProForm,
  ProFormDigit,
  ProFormList,
  ProFormSelect,
} from '@ant-design/pro-components';
import { App, Button, Col, Row, Space } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import RelationChoose from '../../components/fields/relation/RelationChoose';
import { breadcrumbItemRender } from '../../helpers/views_helper';
import ApiService from '../../services/ApiService';
import CollectionListModal from '../collections/components/CollectionListModal';

export default function InventoryForm() {
  const { id } = useParams();
  const [form] = ProForm.useForm();
  const { message, notification } = App.useApp();
  const navigate = useNavigate();

  const [openProductModal, setOpenProductModal] = useState(false);

  useEffect(() => {
    if (id) {
      // Fetch existing inventory data
      ApiService.getClient()
        .collection('inventory-manuals')
        .findOne(id, {
          populate: ['details.product_variant', 'warehouse'],
        })
        .then((res) => {
          const data = {
            ...res.data,
            inventory_type: res.data.inventory_type || 'Manual',
            inventory_status: res.data.inventory_status || 'New',
            details: res.data.details || [],
          };
          form.setFieldsValue(data);
        })
        .catch(() => {
          notification.error({
            message: 'Error',
            description: 'Failed to fetch inventory data',
          });
        });
    }
  }, [id, form, notification]);

  const normalizeData = (values: any) => {
    const normalized: any = {
      inventory_type: values.inventory_type,
      warehouse: values.warehouse?.id || values.warehouse,
      details: (values.details || []).map((detail: any) => ({
        id: detail.id || undefined,
        product_variant: detail.product_variant?.id || detail.product_variant,
        quantity: detail.quantity,
        price: detail.price,
      })),
    };

    return normalized;
  };

  const onFinish = async (values: any) => {
    try {
      message.loading('Saving inventory...', 0);

      const normalizedData = normalizeData(values);

      if (id) {
        // Update existing inventory
        await ApiService.getClient()
          .collection('inventory-manuals')
          .update(id, normalizedData);
        message.destroy();
        notification.success({
          message: 'Updated successfully',
        });
      } else {
        // Create new inventory
        await ApiService.getClient()
          .collection('inventory-manuals')
          .create(normalizedData);
        message.destroy();
        notification.success({
          message: 'Created successfully',
        });
      }

      // Navigate back to inventory list
      navigate('/collections/inventories');
    } catch (error: any) {
      message.destroy();
      notification.error({
        message: 'Error',
        description: error?.message || 'Failed to save inventory',
      });
    }
  };

  const onSelectProducts = (values: any) => {
    const moreDetails = values.map((detail: any) => ({
      product_variant: detail,
      quantity: 1,
      price: 0,
    }));
    form.setFieldsValue({
      details: [...(form.getFieldValue('details') || []), ...moreDetails],
    });
  };

  return (
    <PageContainer
      header={{
        title: id ? 'Edit Inventory' : 'Create Inventory',
        breadcrumb: {
          items: [
            {
              title: 'Home',
              href: '/home',
            },
            {
              title: 'Inventories',
              href: '/collections/inventories',
            },
            {
              title: 'Manuals',
              href: `/collections/inventories/manuals`,
            },
            ...(id
              ? [
                  {
                    title: 'Detail',
                    href: `/collections/inventories/detail/${id}`,
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
        <ProForm form={form} onFinish={onFinish} layout='vertical'>
          <Row gutter={16}>
            <Col span={12}>
              <ProFormSelect
                name='inventory_type'
                label='Inventory Type'
                initialValue='Manual'
                options={[{ label: 'Manual', value: 'Manual' }]}
                rules={[
                  { required: true, message: 'Please select inventory type' },
                ]}
              />
            </Col>

            <Col span={12}>
              <ProForm.Item
                name='warehouse'
                label='Warehouse'
                rules={[{ required: true, message: 'Please select warehouse' }]}
              >
                <RelationChoose module='warehouses' onlyList />
              </ProForm.Item>
            </Col>
          </Row>

          <ProFormList
            name='details'
            label={
              <div className='w-full'>
                <Space>
                  <h3 className='text-lg font-semibold'>Inventory Details</h3>
                  <Button
                    type='primary'
                    icon={<SelectOutlined />}
                    size='small'
                    onClick={() => setOpenProductModal(true)}
                  />
                </Space>
              </div>
            }
            creatorButtonProps={{
              creatorButtonText: 'Add New Product',
              style: {
                marginBottom: 16,
              },
            }}
          >
            {() => {
              return (
                <div className='w-full'>
                  <Row gutter={16}>
                    <Col span={10}>
                      <ProForm.Item
                        name='product_variant'
                        label='Product Variant'
                        rules={[
                          {
                            required: true,
                            message: 'Please select product variant',
                          },
                        ]}
                      >
                        <RelationChoose module='product-variants' onlyList />
                      </ProForm.Item>
                    </Col>

                    <Col span={7}>
                      <ProFormDigit
                        name='quantity'
                        label='Quantity'
                        rules={[
                          { required: true, message: 'Please enter quantity' },
                        ]}
                        fieldProps={{
                          precision: 0,
                          min: 0,
                        }}
                      />
                    </Col>

                    <Col span={7}>
                      <ProFormDigit
                        name='price'
                        label='Price'
                        fieldProps={{
                          precision: 2,
                          min: 0,
                          formatter: (value) =>
                            `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                          parser: (value) =>
                            Number(value!.replace(/\$\s?|(,*)/g, '')),
                        }}
                      />
                    </Col>
                  </Row>
                </div>
              );
            }}
          </ProFormList>
        </ProForm>
      </div>

      <CollectionListModal
        module='product-variants'
        single={false}
        open={openProductModal}
        onOpenChange={setOpenProductModal}
        onFinish={onSelectProducts}
      />
    </PageContainer>
  );
}
