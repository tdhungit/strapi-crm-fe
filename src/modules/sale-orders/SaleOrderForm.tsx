import {
  PageContainer,
  ProForm,
  ProFormDatePicker,
  ProFormDigit,
  ProFormList,
} from '@ant-design/pro-components';
import { App, Col, Divider, Row } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AssignUserInput from '../../components/fields/assign-user/AssignUserInput';
import DiscountInput from '../../components/fields/discount/DiscountInput';
import ProductVariantChoose from '../../components/fields/relation/ProductVariantChoose';
import RelationChoose from '../../components/fields/relation/RelationChoose';
import TaxInput from '../../components/fields/tax/TaxInput';
import { breadcrumbItemRender } from '../../helpers/views_helper';
import ApiService from '../../services/ApiService';

export default function SaleOrderForm() {
  const { id } = useParams();
  const [form] = ProForm.useForm();
  const { message, notification } = App.useApp();
  const navigate = useNavigate();

  const [totals, setTotals] = useState({
    subtotal: 0,
    discount: 0,
    tax: 0,
    total_amount: 0,
  });

  const [canAddItems, setCanAddItems] = useState(false);
  const [canAddNewItem, setCanAddNewItem] = useState(true);

  useEffect(() => {
    if (!id) return;

    const denormalizeData = (so: any) => {
      const data = {
        items: [],
        ...so,
        order_date: so.sale_date,
      };

      const items = so.sale_order_details.map((item: any) => {
        return {
          ...item,
        };
      });

      data.items = items;

      return data;
    };

    ApiService.getClient()
      .collection('sale-orders')
      .findOne(id, {
        populate: [
          'sale_order_details.product_variant',
          'sale_order_details.warehouse',
          'account',
          'contact',
        ],
      })
      .then((res) => {
        form.setFieldsValue(denormalizeData(res.data));
      });
  }, [id]);

  const calculateTotals = () => {
    const items = form.getFieldValue('items') || [];
    let subtotal = 0;
    let itemsDiscount = 0;
    let itemsTax = 0;

    // Calculate subtotal for each item and update the form
    const updatedItems = items.map((item: any) => {
      const quantity = item?.quantity || 0;
      const unitPrice = item?.unit_price || 0;
      const baseAmount = quantity * unitPrice;

      // Calculate item-level discount
      const discount = item?.discount || 0;
      const itemDiscount =
        typeof discount === 'object' ? discount.amount || 0 : discount;

      // Calculate item-level tax
      const tax = item?.tax || 0;
      const itemTax = typeof tax === 'object' ? tax.amount || 0 : tax;

      // Item subtotal = base amount - discount + tax
      const itemSubtotal = baseAmount - itemDiscount + itemTax;

      subtotal += baseAmount; // For order subtotal, use base amount before item discounts/taxes
      itemsDiscount += itemDiscount;
      itemsTax += itemTax;

      return {
        ...item,
        subtotal: itemSubtotal,
      };
    });

    // Update items with calculated subtotals
    form.setFieldValue('items', updatedItems);

    // Get order-level discount and tax
    const orderDiscount = form.getFieldValue('discount') || 0;
    const orderTax = form.getFieldValue('tax') || 0;

    const totalDiscount =
      itemsDiscount +
      (typeof orderDiscount === 'object'
        ? orderDiscount.amount || 0
        : orderDiscount);
    const totalTax =
      itemsTax +
      (typeof orderTax === 'object' ? orderTax.amount || 0 : orderTax);
    const totalAmount = subtotal - totalDiscount + totalTax;

    setTotals({
      subtotal,
      discount: totalDiscount,
      tax: totalTax,
      total_amount: totalAmount,
    });

    // Update form values
    form.setFieldsValue({
      subtotal,
      total_discount: totalDiscount,
      total_tax: totalTax,
      total_amount: totalAmount,
    });
  };

  // Check if required fields are filled
  const checkRequiredFields = () => {
    const account = form.getFieldValue('account');
    const contact = form.getFieldValue('contact');
    const orderDate = form.getFieldValue('order_date');

    // Require either account OR contact, plus order date
    const hasCustomer = account || contact;
    const hasRequiredFields = hasCustomer && orderDate;
    setCanAddItems(hasRequiredFields);
  };

  // Check if current items are complete before allowing new item
  const checkItemsComplete = () => {
    const items = form.getFieldValue('items') || [];

    if (items.length === 0) {
      setCanAddNewItem(true);
      return;
    }

    // Check if the last item has required fields
    const lastItem = items[items.length - 1];
    const hasProduct = lastItem?.product_variant;
    const hasWarehouse = lastItem?.warehouse;
    const hasQuantity = lastItem?.quantity && lastItem.quantity > 0;

    const lastItemComplete = hasProduct && hasWarehouse && hasQuantity;
    setCanAddNewItem(lastItemComplete);
  };

  useEffect(() => {
    calculateTotals();
    checkRequiredFields();
    checkItemsComplete();
  }, []);

  // Watch for form changes and recalculate totals
  const handleFormChange = () => {
    setTimeout(() => {
      calculateTotals();
      checkRequiredFields();
      checkItemsComplete();
    }, 100);
  };

  const normalizeData = (data: any) => {
    const normalizedData: any = {
      sale_date: data.order_date,
      assigned_user: data.assigned_user?.value || null,
      account: data.account?.id || null,
      contact: data.contact?.id || null,
      subtotal: data.subtotal,
      discount_type: data.discount?.type || 'percentage',
      discount_amount: data.discount?.amount || 0,
      tax_type: 'percentage',
      tax_amount: data.tax?.amount || 0,
      total_amount: data.total_amount,
      items: data.items.map((item: any) => ({
        product_variant: item.product_variant?.id || null,
        warehouse: item.warehouse?.id || null,
        quantity: item.quantity,
        unit_price: item.unit_price,
        discount_amount: item.discount?.amount || 0,
        tax_amount: item.tax?.amount || 0,
        discount_type: item.discount?.type || 'percentage',
        tax_type: 'percentage',
        subtotal: item.subtotal,
      })),
    };

    return normalizedData;
  };

  const handleSave = (values: any) => {
    message.loading('Saving Sale Order...', 0);
    const normalizedData = normalizeData(values);

    let service;
    if (id) {
      service = ApiService.getClient()
        .collection('sale-orders')
        .update(id, normalizedData);
    } else {
      service = ApiService.getClient()
        .collection('sale-orders')
        .create(normalizedData);
    }

    service
      .then((res: any) => {
        notification.success({
          message: 'Sale Order saved successfully',
          description: 'Sale Order saved successfully',
        });
        navigate(
          `/collections/sale-orders/detail/${
            res.data?.documentId || res.documentId
          }`
        );
      })
      .catch((err: any) => {
        console.log(err);
        notification.error({
          message: 'Failed to save Sale Order',
          description: 'Failed to save Sale Order',
        });
      })
      .finally(() => {
        message.destroy();
      });
  };

  return (
    <>
      <PageContainer
        header={{
          title: id ? 'Edit Sale Order' : 'Create Sale Order',
          breadcrumb: {
            items: [
              {
                path: '/home',
                title: 'Home',
              },
              {
                path: '/collections/sale-orders',
                title: 'Sale Orders',
              },
              ...(!id
                ? []
                : [
                    {
                      path: `/collections/sale-orders/detail/${id}`,
                      title: 'Detail',
                    },
                  ]),
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
            onValuesChange={handleFormChange}
          >
            {/* Customer Information */}
            <Row gutter={16}>
              <Col span={12}>
                <ProForm.Item
                  name='account'
                  label='Account'
                  tooltip='Select either an Account or Contact (not both required)'
                >
                  <RelationChoose module='accounts' />
                </ProForm.Item>
              </Col>
              <Col span={12}>
                <ProForm.Item
                  name='contact'
                  label='Contact'
                  tooltip='Select either an Account or Contact (not both required)'
                >
                  <RelationChoose module='contacts' />
                </ProForm.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <ProFormDatePicker
                  name='order_date'
                  label='Order Date'
                  rules={[
                    { required: true, message: 'Please select order date' },
                  ]}
                />
              </Col>
              <Col span={12}>
                <ProForm.Item name='assigned_user' label='Assigned User'>
                  <AssignUserInput
                    item={{
                      options: {
                        target: 'plugin::users-permissions.user',
                        mainField: 'username',
                      },
                    }}
                  />
                </ProForm.Item>
              </Col>
            </Row>

            {/* Order Details */}
            <ProFormList
              name='items'
              label='Order Details'
              creatorButtonProps={{
                creatorButtonText: 'Add Product',
                style: {
                  marginBottom: 16,
                },
                disabled: !canAddItems || !canAddNewItem,
              }}
            >
              {(_field, index) => {
                const currentItem = form.getFieldValue('items')?.[index];
                const hasWarehouse = currentItem?.warehouse;

                return (
                  <div className='w-full pl-4'>
                    <Row gutter={16}>
                      <Col span={4}>
                        <ProForm.Item
                          name='warehouse'
                          label='Warehouse'
                          rules={[
                            {
                              required: true,
                              message: 'Warehouse is required',
                            },
                          ]}
                        >
                          <RelationChoose module='warehouses' onlyList />
                        </ProForm.Item>
                      </Col>
                      <Col span={7}>
                        <ProForm.Item
                          name='product_variant'
                          label='Product'
                          rules={[
                            { required: true, message: 'Product is required' },
                          ]}
                          tooltip={
                            !hasWarehouse
                              ? 'Please select a warehouse first'
                              : ''
                          }
                        >
                          <ProductVariantChoose
                            warehouse={currentItem?.warehouse}
                            priceDate={form.getFieldValue('order_date')}
                            priceType='Sale'
                            disabled={!hasWarehouse}
                            placeholder={hasWarehouse ? 'Select product' : ''}
                            onChange={(value) => {
                              ApiService.request(
                                'get',
                                `/product-variants/${value.id}/price`,
                                {
                                  date: form
                                    .getFieldValue('order_date')
                                    .format('YYYY-MM-DD'),
                                }
                              ).then((res) => {
                                if (res?.price?.price) {
                                  const items = form.getFieldValue('items');
                                  items[index].unit_price = res.price.price;
                                  items[index].quantity = 1;
                                  form.setFieldValue('items', items);
                                }
                              });
                            }}
                          />
                        </ProForm.Item>
                      </Col>
                      <Col span={2}>
                        <ProFormDigit
                          name='quantity'
                          label='Quantity'
                          placeholder='Qty'
                          rules={[
                            { required: true, message: 'Quantity is required' },
                            {
                              type: 'number',
                              min: 1,
                              message: 'Quantity must be greater than 0',
                            },
                          ]}
                          onChange={(value: number) => {
                            const variant = currentItem?.product_variant;
                            if (variant?.stock_quantity < value) {
                              message.error('Not enough stock');
                              const items = form.getFieldValue('items');
                              items[index].quantity = variant.stock_quantity;
                              form.setFieldValue('items', items);
                            }
                          }}
                        />
                      </Col>
                      <Col span={3}>
                        <ProFormDigit
                          name='unit_price'
                          label='Unit Price'
                          placeholder='Price'
                          fieldProps={{
                            formatter: (value) =>
                              `$ ${value}`.replace(
                                /\B(?=(\d{3})+(?!\d))/g,
                                ','
                              ),
                            parser: (value) =>
                              Number(value!.replace(/\$\s?|(,*)/g, '')),
                          }}
                        />
                      </Col>
                      <Col span={3}>
                        <ProForm.Item name='discount' label='Discount'>
                          <DiscountInput
                            amount={
                              form.getFieldValue('items')?.[index]
                                ?.unit_price || 0
                            }
                          />
                        </ProForm.Item>
                      </Col>
                      <Col span={3}>
                        <ProForm.Item name='tax' label='Tax'>
                          <TaxInput
                            amount={
                              form.getFieldValue('items')?.[index]
                                ?.unit_price || 0
                            }
                          />
                        </ProForm.Item>
                      </Col>
                      <Col span={2}>
                        <ProFormDigit
                          name='subtotal'
                          label='Subtotal'
                          placeholder='Subtotal'
                          readonly
                          fieldProps={{
                            formatter: (value) =>
                              `$ ${value}`.replace(
                                /\B(?=(\d{3})+(?!\d))/g,
                                ','
                              ),
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

            <Divider />

            {/* Order Summary */}
            <div className='bg-gray-50 p-4 rounded-md mb-4'>
              <Row gutter={16}>
                <Col span={8}>
                  <Row gutter={8}>
                    <Col span={24}>
                      <ProForm.Item name='discount' label='Order Discount'>
                        <DiscountInput amount={totals.subtotal} />
                      </ProForm.Item>
                    </Col>
                    <Col span={24}>
                      <ProForm.Item name='tax' label='Order Tax'>
                        <TaxInput amount={totals.subtotal} />
                      </ProForm.Item>
                    </Col>
                  </Row>
                </Col>
                <Col span={8} />
                <Col span={8}>
                  <Row gutter={16}>
                    <Col span={12}>
                      <ProFormDigit
                        name='subtotal'
                        label='Subtotal'
                        readonly
                        fieldProps={{
                          formatter: (value) =>
                            `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                          parser: (value) =>
                            Number(value!.replace(/\$\s?|(,*)/g, '')),
                        }}
                      />
                    </Col>
                    <Col span={12}>
                      <ProFormDigit
                        name='total_discount'
                        label='Total Discount'
                        readonly
                        fieldProps={{
                          formatter: (value) =>
                            `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                          parser: (value) =>
                            Number(value!.replace(/\$\s?|(,*)/g, '')),
                        }}
                      />
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={12}>
                      <ProFormDigit
                        name='total_tax'
                        label='Total Tax'
                        readonly
                        fieldProps={{
                          formatter: (value) =>
                            `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                          parser: (value) =>
                            Number(value!.replace(/\$\s?|(,*)/g, '')),
                        }}
                      />
                    </Col>
                    <Col span={12}>
                      <ProFormDigit
                        name='total_amount'
                        label='Total Amount'
                        readonly
                        fieldProps={{
                          style: { fontWeight: 'bold', fontSize: '16px' },
                          formatter: (value) =>
                            `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                          parser: (value) =>
                            Number(value!.replace(/\$\s?|(,*)/g, '')),
                        }}
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>
            </div>
          </ProForm>
        </div>
      </PageContainer>
    </>
  );
}
