import {
  Card,
  Col,
  Descriptions,
  Divider,
  Row,
  Space,
  Table,
  Tag,
  Typography,
} from 'antd';
import { useEffect, useState } from 'react';
import ApiService from '../../../services/ApiService';

const { Title, Text } = Typography;

export default function InvoiceDetailComponent({
  id,
  loaded,
}: {
  id: string;
  loaded?: (invoice: any) => void;
}) {
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadInvoice();
  }, [id]);

  const loadInvoice = async () => {
    setLoading(true);
    try {
      const res = await ApiService.getClient()
        .collection('invoices')
        .findOne(id, {
          populate: [
            'sale_order',
            'payment',
            'invoice_details.product_variant',
          ],
        });
      setInvoice(res.data);
      loaded?.(res.data);
    } catch (error) {
      console.error('Failed to load invoice:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      Draft: 'default',
      Sent: 'blue',
      Paid: 'green',
      Overdue: 'red',
      Cancelled: 'red',
    };
    return colors[status] || 'default';
  };

  const getPaymentStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      Pending: 'orange',
      Completed: 'green',
      Failed: 'red',
      Cancelled: 'red',
    };
    return colors[status] || 'default';
  };

  const formatCurrency = (amount: number) => {
    return `$${amount?.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const columns = [
    {
      title: 'Item',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: any) => (
        <div>
          <Space direction='vertical'>
            <Text strong>{name}</Text>
            {record.product_variant && (
              <Text type='secondary'>{record.product_variant.sku}</Text>
            )}
          </Space>
        </div>
      ),
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center' as const,
    },
    {
      title: 'Unit Price',
      dataIndex: 'unit_price',
      key: 'unit_price',
      align: 'right' as const,
      render: (amount: number) => formatCurrency(amount),
    },
    {
      title: 'Discount',
      dataIndex: 'discount_amount',
      key: 'discount_amount',
      align: 'right' as const,
      render: (amount: number) => formatCurrency(amount || 0),
    },
    {
      title: 'Tax',
      dataIndex: 'tax_amount',
      key: 'tax_amount',
      align: 'right' as const,
      render: (amount: number) => formatCurrency(amount || 0),
    },
    {
      title: 'Subtotal',
      dataIndex: 'subtotal',
      key: 'subtotal',
      align: 'right' as const,
      render: (amount: number) => <Text strong>{formatCurrency(amount)}</Text>,
    },
  ];

  if (loading) {
    return (
      <div className='p-4'>
        <Text>Loading invoice details...</Text>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className='p-4'>
        <Text type='secondary'>No invoice data available</Text>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Invoice Header */}
      <Card>
        <div className='flex justify-between items-start mb-6'>
          <div>
            <Title level={2} className='mb-2'>
              INVOICE
            </Title>
            <Text className='text-lg font-semibold'>
              {invoice.invoice_number}
            </Text>
          </div>
          <div className='text-right'>
            <Space direction='vertical'>
              <Tag
                color={getStatusColor(invoice.invoice_status)}
                className='mb-2'
              >
                {invoice.invoice_status}
              </Tag>
              <div>
                <Text strong className='text-2xl text-green-600'>
                  {formatCurrency(invoice.total_amount)}
                </Text>
              </div>
            </Space>
          </div>
        </div>

        <Row gutter={24}>
          <Col span={12}>
            <Descriptions title='Invoice Information' column={1} size='small'>
              <Descriptions.Item label='Invoice Number'>
                <Text strong>{invoice.invoice_number}</Text>
              </Descriptions.Item>
              <Descriptions.Item label='Issue Date'>
                {formatDate(invoice.issue_date)}
              </Descriptions.Item>
              <Descriptions.Item label='Due Date'>
                {formatDate(invoice.due_date)}
              </Descriptions.Item>
              <Descriptions.Item label='Description'>
                {invoice.description || 'N/A'}
              </Descriptions.Item>
            </Descriptions>
          </Col>
          <Col span={12}>
            <Descriptions title='Related Information' column={1} size='small'>
              {invoice.sale_order && (
                <>
                  <Descriptions.Item label='Sale Order'>
                    <Text strong>{invoice.sale_order.name}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label='Order Date'>
                    {formatDate(invoice.sale_order.sale_date)}
                  </Descriptions.Item>
                  <Descriptions.Item label='Order Status'>
                    <Tag color='blue'>{invoice.sale_order.order_status}</Tag>
                  </Descriptions.Item>
                </>
              )}
              <Descriptions.Item label='Created'>
                {formatDate(invoice.createdAt)}
              </Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>
      </Card>

      {/* Invoice Items */}
      <Card title='Invoice Items' size='small' style={{ marginTop: 16 }}>
        <Table
          columns={columns}
          dataSource={invoice.invoice_details}
          rowKey='id'
          pagination={false}
          size='small'
        />
      </Card>

      {/* Payment Information */}
      {invoice.payment && (
        <Card
          title='Payment Information'
          size='small'
          style={{ marginTop: 16 }}
        >
          <Row gutter={24}>
            <Col span={12}>
              <Descriptions column={1} size='small'>
                <Descriptions.Item label='Payment Status'>
                  <Tag
                    color={getPaymentStatusColor(
                      invoice.payment.payment_status
                    )}
                  >
                    {invoice.payment.payment_status}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label='Payment Method'>
                  {invoice.payment.payment_method}
                </Descriptions.Item>
                <Descriptions.Item label='Payment Date'>
                  {formatDate(invoice.payment.payment_date)}
                </Descriptions.Item>
                <Descriptions.Item label='Transaction ID'>
                  {invoice.payment.transaction_id || 'N/A'}
                </Descriptions.Item>
              </Descriptions>
            </Col>
            <Col span={12}>
              <div className='text-right'>
                <Text>Payment Amount:</Text>
                <div>
                  <Text strong className='text-xl text-green-600'>
                    {formatCurrency(invoice.payment.amount)}
                  </Text>
                </div>
              </div>
            </Col>
          </Row>
        </Card>
      )}

      {/* Invoice Summary */}
      <Card size='small' style={{ marginTop: 16 }}>
        <Row gutter={24}>
          <Col span={16}>
            {/* Left side can be used for notes or additional info */}
          </Col>
          <Col span={8}>
            <div className='bg-gray-50 p-4 rounded'>
              <Title level={5}>Invoice Summary</Title>
              <div className='space-y-2'>
                <div className='flex justify-between'>
                  <Text>Subtotal:</Text>
                  <Text>{formatCurrency(invoice.subtotal)}</Text>
                </div>
                <div className='flex justify-between'>
                  <Text>Discount:</Text>
                  <Text>-{formatCurrency(invoice.discount_amount || 0)}</Text>
                </div>
                <div className='flex justify-between'>
                  <Text>Tax:</Text>
                  <Text>+{formatCurrency(invoice.tax_amount || 0)}</Text>
                </div>
                <Divider style={{ margin: '8px 0' }} />
                <div className='flex justify-between'>
                  <Text strong className='text-lg'>
                    Total Amount:
                  </Text>
                  <Text strong className='text-lg text-green-600'>
                    {formatCurrency(invoice.total_amount)}
                  </Text>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
}
