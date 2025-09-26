import {
  PageContainer,
  ProForm,
  ProFormDatePicker,
  ProFormDigit,
  ProFormList,
} from '@ant-design/pro-components';
import { App, Col, Row } from 'antd';
import { Divider } from 'antd/lib';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AssignUserInput from '../../components/fields/assign-user/AssignUserInput';
import DiscountInput from '../../components/fields/discount/DiscountInput';
import RelationChoose from '../../components/fields/relation/RelationChoose';
import TaxInput from '../../components/fields/tax/TaxInput';
import { breadcrumbItemRender } from '../../helpers/views_helper';
import ApiService from '../../services/ApiService';

export default function PurchaseOrderForm() {
  const { id } = useParams();
  const [form] = ProForm.useForm();
  const { notification, message } = App.useApp();
  const navigate = useNavigate();

  const [canAddItems, setCanAddItems] = useState(false);
  const [canAddNewItem, setCanAddNewItem] = useState(true);

  const [totals, setTotals] = useState({
    subtotal: 0,
    discount: 0,
    tax: 0,
    total_amount: 0,
  });

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
    const orderDiscount = form.getFieldValue('order_discount') || 0;
    const orderTax = form.getFieldValue('order_tax') || 0;

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

  useEffect(() => {
    calculateTotals();
  }, []);

  useEffect(() => {
    const denormalizeData = (po: any) => {
      const data = {
        items: [],
        ...po,
      };

      const items = po.purchase_order_details.map((item: any) => {
        return {
          ...item,
        };
      });

      data.items = items;

      // console.log(data);

      return data;
    };

    if (id) {
      ApiService.getClient()
        .collection('purchase-orders')
        .findOne(id, {
          populate: [
            'purchase_order_details.product_variant',
            'purchase_order_details.warehouse',
            'supplier',
          ],
        })
        .then((res) => {
          if (['Completed', 'Rejected'].includes(res.data.order_status)) {
            message.error('Order is completed or rejected');
            navigate(`/collections/purchase-orders/detail/${id}`);
            return;
          }
          form.setFieldsValue(denormalizeData(res.data));
        });
    }
  }, [id]);

  // Check if required fields are filled
  const checkRequiredFields = () => {
    const supplier = form.getFieldValue('supplier');
    const orderDate = form.getFieldValue('purchase_date');

    const hasRequiredFields = supplier && orderDate;
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
      purchase_date: data.purchase_date,
      assigned_user: data.assigned_user?.value || null,
      supplier: data.supplier?.id || null,
      discount_type: data.order_discount?.type || 'percentage',
      discount_amount: data.order_discount?.amount || 0,
      tax_type: 'percentage',
      tax_amount: data.order_tax?.amount || 0,
      subtotal: data.subtotal,
      total_discount: data.total_discount,
      total_tax: data.total_tax,
      total_amount: data.total_amount,
    };

    const items = data.items.map((item: any) => {
      return {
        product_variant: item.product_variant?.id || null,
        warehouse: item.warehouse?.id || null,
        quantity: item.quantity,
        unit_price: item.unit_price,
        discount_type: item.discount?.type || 'percentage',
        discount_amount: item.discount?.amount || 0,
        tax_type: 'percentage',
        tax_amount: item.tax?.amount || 0,
        subtotal: item.subtotal,
      };
    });

    normalizedData.items = items;
    return normalizedData;
  };

  const handleSave = (values: any) => {
    message.loading('Saving Purchase Order...', 0);
    const normalizedData = normalizeData(values);

    let service;
    if (id) {
      service = ApiService.getClient()
        .collection('purchase-orders')
        .update(id, normalizedData);
    } else {
      service = ApiService.getClient()
        .collection('purchase-orders')
        .create(normalizedData);
    }

    service
      .then(() => {
        notification.success({
          message: 'Success',
          description: 'Purchase Order saved successfully',
        });
        navigate('/collections/purchase-orders');
      })
      .catch((err) => {
        console.log(err);
        notification.error({
          message: 'Error',
          description: 'Failed to save Purchase Order',
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
          title: id ? 'Edit Purchase Order' : 'Create Purchase Order',
          breadcrumb: {
            items: [
              {
                path: '/home',
                title: 'Home',
              },
              {
                path: '/collections/purchase-orders',
                title: 'Purchase Orders',
              },
              ...(id
                ? [
                    {
                      path: `/collections/purchase-orders/detail/${id}`,
                      title: 'Detail',
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
            onValuesChange={handleFormChange}
          >
            <Row gutter={16}>
              <Col span={12}>
                <ProForm.Item
                  name='supplier'
                  label='Supplier'
                  rules={[
                    {
                      required: true,
                      message: 'Please select a supplier',
                    },
                  ]}
                >
                  <RelationChoose module='suppliers' />
                </ProForm.Item>
              </Col>
              <Col span={12}>
                <ProFormDatePicker
                  name='purchase_date'
                  label='Order Date'
                  rules={[
                    {
                      required: true,
                      message: 'Please select a purchase date',
                    },
                  ]}
                />
              </Col>
            </Row>

            <Row gutter={16}>
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
              <Col span={12}></Col>
            </Row>

            <ProFormList
              name='items'
              label='Details'
              creatorButtonProps={{
                creatorButtonText: 'Add New Product',
                style: {
                  marginBottom: 16,
                },
                disabled: !canAddItems || !canAddNewItem,
              }}
              actionGuard={{
                beforeAddRow: () => {
                  if (
                    !form.getFieldValue('purchase_date') ||
                    !form.getFieldValue('supplier')
                  ) {
                    notification.error({
                      message: 'Error',
                      description: 'Please select a purchase date and supplier',
                    });
                    return false;
                  }

                  const items = form.getFieldValue('items');
                  if (items.length > 0) {
                    let error = false;
                    for (let i = 0; i < items.length; i++) {
                      if (
                        !items[i].product_variant ||
                        !items[i].warehouse ||
                        !items[i].quantity ||
                        !items[i].unit_price
                      ) {
                        error = true;
                        break;
                      }
                    }
                    if (error) {
                      notification.error({
                        message: 'Error',
                        description: 'Please fill all required fields',
                      });
                      return false;
                    }
                  }

                  return true;
                },
              }}
            >
              {(_field, index) => (
                <div className='w-full pl-4'>
                  <Row gutter={16}>
                    <Col span={7}>
                      <ProForm.Item name='product_variant' label='Product'>
                        <RelationChoose
                          module='product-variants'
                          onlyList
                          onChange={(value) => {
                            ApiService.request(
                              'get',
                              `/product-variants/${value.id}/price`,
                              {
                                date: form.getFieldValue('purchase_date'),
                              }
                            ).then((res) => {
                              if (res?.price?.price) {
                                const items = form.getFieldValue('items');
                                items[index].unit_price = res.price.price;
                                if (
                                  !items[index].quantity ||
                                  items[index].quantity <= 0
                                ) {
                                  items[index].quantity = 1;
                                }
                                form.setFieldValue('items', items);
                              }
                            });
                          }}
                        />
                      </ProForm.Item>
                    </Col>
                    <Col span={4}>
                      <ProForm.Item name='warehouse' label='Warehouse'>
                        <RelationChoose module='warehouses' onlyList />
                      </ProForm.Item>
                    </Col>
                    <Col span={2}>
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
                        fieldProps={{
                          formatter: (value) =>
                            `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                          parser: (value) =>
                            Number(value!.replace(/\$\s?|(,*)/g, '')),
                        }}
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
                    <Col span={2}>
                      <ProFormDigit
                        name='subtotal'
                        label='Subtotal'
                        placeholder='Subtotal'
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
                </div>
              )}
            </ProFormList>

            <Divider />

            <div className='bg-gray-50 p-4 rounded-md mb-4'>
              <Row gutter={16}>
                <Col span={8}>
                  <Row gutter={8}>
                    <Col span={24}>
                      <ProForm.Item
                        name='order_discount'
                        label='Order Discount'
                      >
                        <DiscountInput amount={totals.subtotal} />
                      </ProForm.Item>
                    </Col>
                    <Col span={24}>
                      <ProForm.Item name='order_tax' label='Order Tax'>
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
