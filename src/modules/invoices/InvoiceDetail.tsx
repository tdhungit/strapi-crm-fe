import {
  DownloadOutlined,
  EyeOutlined,
  PrinterOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import {
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  Row,
  Tag,
  Typography,
} from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { breadcrumbItemRender } from '../../helpers/views_helper';
import ApiService from '../../services/ApiService';

const { Title, Text } = Typography;

export default function InvoiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [invoice, setInvoice] = useState<any>(null);

  useEffect(() => {
    if (!id) return;

    ApiService.getClient()
      .collection('invoices')
      .findOne(id, {
        populate: ['sale_order', 'payment.method'],
      })
      .then((res) => {
        setInvoice(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [id]);

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
      Completed: 'green',
      Pending: 'orange',
      Failed: 'red',
      Refunded: 'purple',
      Cancelled: 'red',
    };
    return colors[status] || 'default';
  };

  const formatCurrency = (amount: number) => {
    return amount
      ? `$${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
      : '$0.00';
  };

  if (!invoice) {
    return (
      <PageContainer
        header={{
          title: 'Loading...',
        }}
      >
        <div>Loading invoice details...</div>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      header={{
        title: invoice?.invoice_number || 'Invoice Detail',
        breadcrumb: {
          items: [
            {
              title: 'Home',
              path: '/',
            },
            {
              title: 'Invoices',
              path: '/collections/invoices',
            },
            {
              title: invoice?.invoice_number || 'Loading...',
            },
          ],
          itemRender: breadcrumbItemRender,
        },
      }}
      extra={[
        <Button
          key='view-so'
          icon={<EyeOutlined />}
          onClick={() =>
            navigate(
              `/collections/sale-orders/detail/${invoice.sale_order?.documentId}`
            )
          }
        >
          View Sale Order
        </Button>,
        <Button key='print' icon={<PrinterOutlined />}>
          Print
        </Button>,
        <Button key='download' type='primary' icon={<DownloadOutlined />}>
          Download PDF
        </Button>,
      ]}
    >
      <div className='space-y-8'>
        {/* Invoice Header Information */}
        <Card>
          <Row gutter={24}>
            <Col span={8}>
              <Descriptions title='Invoice Information' column={1}>
                <Descriptions.Item label='Invoice Number'>
                  <Text strong className='text-lg'>
                    {invoice.invoice_number}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label='Issue Date'>
                  {new Date(invoice.issue_date).toLocaleDateString()}
                </Descriptions.Item>
                <Descriptions.Item label='Due Date'>
                  {new Date(invoice.due_date).toLocaleDateString()}
                </Descriptions.Item>
                <Descriptions.Item label='Status'>
                  <Tag color={getStatusColor(invoice.invoice_status)}>
                    {invoice.invoice_status}
                  </Tag>
                </Descriptions.Item>
              </Descriptions>
            </Col>
            <Col span={8}>
              <Descriptions title='Related Sale Order' column={1}>
                {invoice.sale_order && (
                  <>
                    <Descriptions.Item label='SO Number'>
                      <Button
                        type='link'
                        onClick={() =>
                          navigate(
                            `/collections/sale-orders/detail/${invoice.sale_order.documentId}`
                          )
                        }
                        style={{ padding: 0, height: 'auto' }}
                      >
                        {invoice.sale_order.name}
                      </Button>
                    </Descriptions.Item>
                    <Descriptions.Item label='Sale Date'>
                      {new Date(
                        invoice.sale_order.sale_date
                      ).toLocaleDateString()}
                    </Descriptions.Item>
                    <Descriptions.Item label='Order Status'>
                      <Tag
                        color={getStatusColor(invoice.sale_order.order_status)}
                      >
                        {invoice.sale_order.order_status}
                      </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label='Order Total'>
                      {formatCurrency(invoice.sale_order.total_amount)}
                    </Descriptions.Item>
                  </>
                )}
              </Descriptions>
            </Col>
            <Col span={8}>
              <Descriptions title='Timestamps' column={1}>
                <Descriptions.Item label='Created'>
                  {new Date(invoice.createdAt).toLocaleDateString()}
                </Descriptions.Item>
                <Descriptions.Item label='Last Updated'>
                  {new Date(invoice.updatedAt).toLocaleDateString()}
                </Descriptions.Item>
                <Descriptions.Item label='Published'>
                  {new Date(invoice.publishedAt).toLocaleDateString()}
                </Descriptions.Item>
                {invoice.description && (
                  <Descriptions.Item label='Description'>
                    {invoice.description}
                  </Descriptions.Item>
                )}
              </Descriptions>
            </Col>
          </Row>
        </Card>

        {/* Payment Information */}
        {invoice.payment && (
          <Card title='Payment Information' style={{ marginTop: 8 }}>
            <Row gutter={24}>
              <Col span={8}>
                <Descriptions title='Payment Details' column={1}>
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
                    <Text strong>{invoice.payment.payment_method}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label='Payment Date'>
                    {new Date(
                      invoice.payment.payment_date
                    ).toLocaleDateString()}
                  </Descriptions.Item>
                  <Descriptions.Item label='Transaction ID'>
                    {invoice.payment.transaction_id ? (
                      <Text copyable>{invoice.payment.transaction_id}</Text>
                    ) : (
                      'N/A'
                    )}
                  </Descriptions.Item>
                </Descriptions>
              </Col>
              <Col span={8}>
                <Descriptions title='Payment Amount' column={1}>
                  <Descriptions.Item label='Payment Amount'>
                    <Text strong className='text-lg text-green-600'>
                      {formatCurrency(invoice.payment.amount)}
                    </Text>
                  </Descriptions.Item>
                  <Descriptions.Item label='Created At'>
                    {new Date(invoice.payment.createdAt).toLocaleDateString()}
                  </Descriptions.Item>
                  <Descriptions.Item label='Updated At'>
                    {new Date(invoice.payment.updatedAt).toLocaleDateString()}
                  </Descriptions.Item>
                </Descriptions>
              </Col>
              <Col span={8}>
                {invoice.payment.method && (
                  <Descriptions title='Payment Method Details' column={1}>
                    <Descriptions.Item label='Method Name'>
                      <Text strong>{invoice.payment.method.name}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label='Description'>
                      {invoice.payment.method.description}
                    </Descriptions.Item>
                    <Descriptions.Item label='Enabled'>
                      <Tag
                        color={invoice.payment.method.enabled ? 'green' : 'red'}
                      >
                        {invoice.payment.method.enabled ? 'Yes' : 'No'}
                      </Tag>
                    </Descriptions.Item>
                  </Descriptions>
                )}
              </Col>
            </Row>
          </Card>
        )}

        {/* Invoice Summary */}
        <Card style={{ marginTop: 16 }}>
          <Row gutter={24}>
            <Col span={16}>{/* Left side for additional info if needed */}</Col>
            <Col span={8}>
              <div className='bg-gray-50 p-6 rounded-lg'>
                <Title level={4} className='text-center mb-4'>
                  Invoice Summary
                </Title>
                <div className='space-y-3'>
                  <div className='flex justify-between text-base'>
                    <Text>Subtotal:</Text>
                    <Text>{formatCurrency(invoice.subtotal)}</Text>
                  </div>
                  <div className='flex justify-between text-base'>
                    <Text>Discount:</Text>
                    <Text>-{formatCurrency(invoice.discount_amount || 0)}</Text>
                  </div>
                  <div className='flex justify-between text-base'>
                    <Text>Tax:</Text>
                    <Text>+{formatCurrency(invoice.tax_amount || 0)}</Text>
                  </div>
                  {invoice.sale_order?.shipping_amount && (
                    <div className='flex justify-between text-base'>
                      <Text>Shipping:</Text>
                      <Text>
                        +
                        {formatCurrency(
                          invoice.sale_order.shipping_amount -
                            (invoice.sale_order.shipping_discount || 0) || 0
                        )}
                      </Text>
                    </div>
                  )}
                  <Divider style={{ margin: '12px 0' }} />
                  <div className='flex justify-between'>
                    <Title level={4} className='mb-0'>
                      Total Amount:
                    </Title>
                    <Title level={4} className='mb-0 text-green-600'>
                      {formatCurrency(invoice.total_amount)}
                    </Title>
                  </div>
                  {invoice.payment && (
                    <>
                      <div className='flex justify-between text-base border-t pt-3 mt-3'>
                        <Text strong>Payment Status:</Text>
                        <Tag
                          color={getPaymentStatusColor(
                            invoice.payment.payment_status
                          )}
                        >
                          {invoice.payment.payment_status}
                        </Tag>
                      </div>
                      <div className='flex justify-between text-base'>
                        <Text strong>Amount Paid:</Text>
                        <Text strong className='text-green-600'>
                          {formatCurrency(invoice.payment.amount)}
                        </Text>
                      </div>
                      {invoice.payment.amount !== invoice.total_amount && (
                        <div className='flex justify-between text-base'>
                          <Text strong className='text-red-600'>
                            Balance Due:
                          </Text>
                          <Text strong className='text-red-600'>
                            {formatCurrency(
                              invoice.total_amount - invoice.payment.amount
                            )}
                          </Text>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </Col>
          </Row>
        </Card>
      </div>
    </PageContainer>
  );
}
