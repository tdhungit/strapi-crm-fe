import {
  CheckOutlined,
  ClearOutlined,
  DeleteOutlined,
  HomeOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { PageContainer, ProForm } from '@ant-design/pro-components';
import {
  App,
  Button,
  Card,
  Col,
  Divider,
  Image,
  Input,
  InputNumber,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Typography,
} from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DiscountInput from '../../components/fields/discount/DiscountInput';
import RelationChoose from '../../components/fields/relation/RelationChoose';
import TaxInput from '../../components/fields/tax/TaxInput';
import { getMediaUrl } from '../../helpers/views_helper';
import ApiService from '../../services/ApiService';

const { Title, Text } = Typography;
const { Search } = Input;

interface CartItem {
  id: string;
  product_variant: any;
  warehouse: any;
  quantity: number;
  unit_price: number;
  discount: any;
  tax: any;
  subtotal: number;
}

export default function POS() {
  const [form] = ProForm.useForm();
  const { message, notification } = App.useApp();
  const navigate = useNavigate();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [customer, setCustomer] = useState<any>(null);
  const [totals, setTotals] = useState({
    subtotal: 0,
    discount: 0,
    tax: 0,
    total_amount: 0,
  });

  // Load initial data
  useEffect(() => {
    loadWarehouses();
    loadProducts();
  }, []);

  // Calculate totals when cart changes
  useEffect(() => {
    calculateTotals();
  }, [cart]);

  const loadWarehouses = async () => {
    try {
      const res = await ApiService.getClient().collection('warehouses').find();
      setWarehouses(res.data);
      if (res.data.length > 0) {
        setSelectedWarehouse(res.data[0]);
      }
    } catch (error) {
      console.error('Failed to load warehouses:', error);
    }
  };

  const loadProducts = async () => {
    try {
      const res = await ApiService.getClient()
        .collection('product-variants')
        .find({
          filters: {
            variant_status: 'Active',
          },
        });
      setProducts(res.data);
    } catch (error) {
      console.error('Failed to load products:', error);
    }
  };

  const calculateTotals = () => {
    let subtotal = 0;
    let totalDiscount = 0;
    let totalTax = 0;

    cart.forEach((item) => {
      const baseAmount = item.quantity * item.unit_price;
      subtotal += baseAmount;

      const itemDiscount =
        typeof item.discount === 'object'
          ? item.discount?.amount || 0
          : item.discount || 0;
      const itemTax =
        typeof item.tax === 'object' ? item.tax?.amount || 0 : item.tax || 0;

      totalDiscount += itemDiscount;
      totalTax += itemTax;
    });

    // Get order-level discount and tax
    const orderDiscount = form.getFieldValue('order_discount') || 0;
    const orderTax = form.getFieldValue('order_tax') || 0;

    const finalDiscount =
      totalDiscount +
      (typeof orderDiscount === 'object'
        ? orderDiscount?.amount || 0
        : orderDiscount || 0);
    const finalTax =
      totalTax +
      (typeof orderTax === 'object' ? orderTax?.amount || 0 : orderTax || 0);
    const totalAmount = subtotal - finalDiscount + finalTax;

    setTotals({
      subtotal,
      discount: finalDiscount,
      tax: finalTax,
      total_amount: totalAmount,
    });
  };

  const addToCart = async (product: any) => {
    if (!selectedWarehouse) {
      message.error('Please select a warehouse first');
      return;
    }

    // Check if product already in cart
    const existingIndex = cart.findIndex(
      (item) => item.product_variant.id === product.id
    );

    if (existingIndex >= 0) {
      // Update quantity
      const newCart = [...cart];
      newCart[existingIndex].quantity += 1;
      newCart[existingIndex].subtotal =
        newCart[existingIndex].quantity * newCart[existingIndex].unit_price;
      setCart(newCart);
    } else {
      // Get product price
      try {
        const priceRes = await ApiService.request(
          'get',
          `/product-variants/${product.id}/price`,
          {
            date: new Date().toISOString().split('T')[0],
          }
        );

        const price = priceRes?.price?.price || 0;

        const newItem: CartItem = {
          id: `${product.id}-${Date.now()}`,
          product_variant: product,
          warehouse: selectedWarehouse,
          quantity: 1,
          unit_price: price,
          discount: 0,
          tax: 0,
          subtotal: price,
        };

        setCart([...cart, newItem]);
      } catch (error) {
        console.error('Failed to get product price:', error);
        message.error('Failed to get product price');
      }
    }
  };

  const updateCartItem = (index: number, field: string, value: any) => {
    const newCart = [...cart];
    newCart[index] = { ...newCart[index], [field]: value };

    // Recalculate item subtotal
    const baseAmount = newCart[index].quantity * newCart[index].unit_price;
    const itemDiscount =
      typeof newCart[index].discount === 'object'
        ? newCart[index].discount?.amount || 0
        : newCart[index].discount || 0;
    const itemTax =
      typeof newCart[index].tax === 'object'
        ? newCart[index].tax?.amount || 0
        : newCart[index].tax || 0;
    newCart[index].subtotal = baseAmount - itemDiscount + itemTax;

    setCart(newCart);
  };

  const removeFromCart = (index: number) => {
    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);
  };

  const clearCart = () => {
    setCart([]);
    setCustomer(null);
    form.resetFields();
  };

  const processOrder = async () => {
    if (!customer) {
      message.error('Please select a customer');
      return;
    }

    if (cart.length === 0) {
      message.error('Cart is empty');
      return;
    }

    const orderData = {
      sale_date: new Date().toISOString().split('T')[0],
      account: customer.type === 'account' ? customer.id : null,
      contact: customer.type === 'contact' ? customer.id : null,
      warehouse: selectedWarehouse?.id,
      subtotal: totals.subtotal,
      discount_type: 'percentage',
      discount_amount: totals.discount,
      tax_type: 'percentage',
      tax_amount: totals.tax,
      total_amount: totals.total_amount,
      items: cart.map((item) => ({
        product_variant: item.product_variant.id,
        warehouse: item.warehouse.id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        discount_amount:
          typeof item.discount === 'object'
            ? item.discount?.amount || 0
            : item.discount || 0,
        tax_amount:
          typeof item.tax === 'object' ? item.tax?.amount || 0 : item.tax || 0,
        discount_type: 'percentage',
        tax_type: 'percentage',
        subtotal: item.subtotal,
      })),
    };

    try {
      message.loading('Processing order...', 0);
      const res = await ApiService.getClient()
        .collection('sale-orders')
        .create(orderData);

      notification.success({
        message: 'Order Created Successfully',
        description: `Order ${res.data.name} has been created`,
      });

      clearCart();
      navigate(`/collections/sale-orders/detail/${res.data.documentId}`);
    } catch (error) {
      console.error('Failed to create order:', error);
      notification.error({
        message: 'Failed to Create Order',
        description: 'Please try again',
      });
    } finally {
      message.destroy();
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const cartColumns = [
    {
      title: 'Product',
      dataIndex: 'product_variant',
      key: 'product',
      render: (product: any) => (
        <div className='flex items-center gap-2'>
          {product.photos?.[0] && (
            <Image
              width={40}
              height={40}
              src={getMediaUrl(product.photos[0])}
              alt={product.name}
              className='rounded'
            />
          )}
          <div>
            <div className='font-medium text-sm'>{product.name}</div>
            <Text type='secondary' className='text-xs'>
              SKU: {product.sku}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: 'Qty',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 80,
      render: (quantity: number, record: CartItem, index: number) => (
        <InputNumber
          min={1}
          value={quantity}
          size='small'
          onChange={(value) => updateCartItem(index, 'quantity', value || 1)}
        />
      ),
    },
    {
      title: 'Price',
      dataIndex: 'unit_price',
      key: 'unit_price',
      width: 100,
      render: (price: number) => `$${price.toFixed(2)}`,
    },
    {
      title: 'Subtotal',
      dataIndex: 'subtotal',
      key: 'subtotal',
      width: 100,
      render: (subtotal: number) => <Text strong>${subtotal.toFixed(2)}</Text>,
    },
    {
      title: 'Action',
      key: 'action',
      width: 60,
      render: (_: any, record: CartItem, index: number) => (
        <Button
          type='text'
          danger
          size='small'
          icon={<DeleteOutlined />}
          onClick={() => removeFromCart(index)}
        />
      ),
    },
  ];

  return (
    <PageContainer
      header={{
        title: 'Point of Sale',
      }}
      extra={
        <Space>
          <Button
            type='primary'
            icon={<HomeOutlined />}
            onClick={() => navigate('/home')}
          />
        </Space>
      }
    >
      <Row gutter={16} className='h-full'>
        {/* Left Panel - Products */}
        <Col span={16}>
          <Card title='Products' className='h-full' size='small'>
            <Space direction='vertical' className='w-full' size='middle'>
              {/* Warehouse Selection */}
              <Row gutter={16}>
                <Col span={12}>
                  <Select
                    placeholder='Select Warehouse'
                    value={selectedWarehouse?.id}
                    onChange={(value) => {
                      const warehouse = warehouses.find((w) => w.id === value);
                      setSelectedWarehouse(warehouse);
                    }}
                    className='w-full'
                  >
                    {warehouses.map((warehouse) => (
                      <Select.Option key={warehouse.id} value={warehouse.id}>
                        {warehouse.name} - {warehouse.location}
                      </Select.Option>
                    ))}
                  </Select>
                </Col>
                <Col span={12}>
                  <Search
                    placeholder='Search products...'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    allowClear
                  />
                </Col>
              </Row>

              {/* Products Grid */}
              <div className='grid grid-cols-4 gap-4 max-h-96 overflow-y-auto'>
                {filteredProducts.map((product) => (
                  <Card
                    key={product.id}
                    size='small'
                    hoverable
                    className='cursor-pointer'
                    onClick={() => addToCart(product)}
                    cover={
                      product.photos?.[0] && (
                        <Image
                          alt={product.name}
                          src={getMediaUrl(product.photos[0])}
                          height={120}
                          className='object-cover'
                        />
                      )
                    }
                  >
                    <Card.Meta
                      title={<Text className='text-sm'>{product.name}</Text>}
                      description={
                        <div>
                          <Text type='secondary' className='text-xs'>
                            SKU: {product.sku}
                          </Text>
                          <br />
                          <Tag color='green' className='text-xs'>
                            {product.variant_status}
                          </Tag>
                        </div>
                      }
                    />
                  </Card>
                ))}
              </div>
            </Space>
          </Card>
        </Col>

        {/* Right Panel - Cart & Checkout */}
        <Col span={8} className='mt-[-8px]'>
          <Space direction='vertical' className='w-full' size='small'>
            {/* Customer Selection */}
            <Card title='Customer' size='small'>
              <RelationChoose
                module='accounts'
                placeholder='Select Customer Account'
                onChange={(value) => setCustomer({ ...value, type: 'account' })}
              />
              <Divider className='my-2'>OR</Divider>
              <RelationChoose
                module='contacts'
                placeholder='Select Customer Contact'
                onChange={(value) => setCustomer({ ...value, type: 'contact' })}
              />
              {customer && (
                <div className='mt-2 p-2 bg-blue-50 rounded'>
                  <Text strong>
                    <UserOutlined />{' '}
                    {customer.name ||
                      `${customer.firstName} ${customer.lastName}`}
                  </Text>
                </div>
              )}
            </Card>

            {/* Cart */}
            <Card
              title={
                <div className='flex justify-between items-center'>
                  <span>
                    <ShoppingCartOutlined /> Cart ({cart.length})
                  </span>
                  <Button
                    size='small'
                    icon={<ClearOutlined />}
                    onClick={clearCart}
                    disabled={cart.length === 0}
                  >
                    Clear
                  </Button>
                </div>
              }
              size='small'
            >
              <Table
                columns={cartColumns}
                dataSource={cart}
                rowKey='id'
                pagination={false}
                size='small'
                scroll={{ y: 300 }}
              />
            </Card>

            {/* Order Adjustments */}
            <Card title='Order Adjustments' size='small'>
              <ProForm form={form} submitter={false}>
                <Row gutter={8}>
                  <Col span={12}>
                    <ProForm.Item name='order_discount' label='Discount'>
                      <DiscountInput amount={totals.subtotal} />
                    </ProForm.Item>
                  </Col>
                  <Col span={12}>
                    <ProForm.Item name='order_tax' label='Tax'>
                      <TaxInput amount={totals.subtotal} />
                    </ProForm.Item>
                  </Col>
                </Row>
              </ProForm>
            </Card>

            {/* Totals */}
            <Card title='Order Summary' size='small'>
              <div className='space-y-2'>
                <div className='flex justify-between'>
                  <Text>Subtotal:</Text>
                  <Text>${totals.subtotal.toFixed(2)}</Text>
                </div>
                <div className='flex justify-between'>
                  <Text>Discount:</Text>
                  <Text>-${totals.discount.toFixed(2)}</Text>
                </div>
                <div className='flex justify-between'>
                  <Text>Tax:</Text>
                  <Text>+${totals.tax.toFixed(2)}</Text>
                </div>
                <Divider className='my-2' />
                <div className='flex justify-between'>
                  <Title level={4}>Total:</Title>
                  <Title level={4} className='text-green-600'>
                    ${totals.total_amount.toFixed(2)}
                  </Title>
                </div>
              </div>
            </Card>

            {/* Checkout Button */}
            <Button
              type='primary'
              size='large'
              icon={<CheckOutlined />}
              onClick={processOrder}
              disabled={cart.length === 0 || !customer}
              className='w-full'
            >
              Process Order
            </Button>
          </Space>
        </Col>
      </Row>
    </PageContainer>
  );
}
