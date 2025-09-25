import { CheckOutlined, CloseOutlined, EditOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import {
  App,
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  Image,
  Row,
  Table,
  Tag,
  Typography,
} from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { breadcrumbItemRender, getMediaUrl } from '../../helpers/views_helper';
import ApiService from '../../services/ApiService';

const { Title, Text } = Typography;

export default function SaleOrderDetail() {
  const { id } = useParams();
  const { message, notification } = App.useApp();
  const navigate = useNavigate();

  const [so, setSo] = useState<any>(null);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    if (!id) return;

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
        setSo(res.data);
      });
  }, [id, refresh]);

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      New: 'blue',
      Pending: 'orange',
      Confirmed: 'green',
      Shipped: 'purple',
      Delivered: 'success',
      Cancelled: 'red',
    };
    return colors[status] || 'default';
  };

  const formatCurrency = (amount: number) => {
    return `$${amount?.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  };

  const changeStatus = (status: string) => {
    if (!id) return;

    message.loading('Updating status...', 0);
    let service;
    if (status === 'Completed') {
      service = ApiService.request('PUT', `/sale-orders/${id}/complete`);
    } else {
      service = ApiService.request('PUT', `/sale-orders/${id}/status`, {
        status,
      });
    }

    service
      .then(() => {
        notification.success({
          message: 'Status updated successfully',
          description:
            'The status of the sale order has been updated successfully.',
        });
        setRefresh((prev) => prev + 1);
      })
      .catch((err) => {
        console.log(err);
        notification.error({
          message: 'Failed to update status',
          description: 'The status of the sale order could not be updated.',
        });
      })
      .finally(() => {
        message.destroy();
      });
  };

  const columns = [
    {
      title: 'Product',
      dataIndex: ['product_variant', 'name'],
      key: 'product',
      render: (text: string, record: any) => (
        <div className='flex items-center gap-3'>
          {record.product_variant?.photos?.[0] && (
            <Image
              width={50}
              height={50}
              src={getMediaUrl(record.product_variant.photos[0])}
              alt={text}
              className='rounded'
            />
          )}
          <div>
            <div className='font-medium'>{text}</div>
            <Text type='secondary'>SKU: {record.product_variant?.sku}</Text>
          </div>
        </div>
      ),
    },
    {
      title: 'Warehouse',
      dataIndex: ['warehouse', 'name'],
      key: 'warehouse',
      render: (text: string, record: any) => (
        <div>
          <div>{text}</div>
          <Text type='secondary'>{record.warehouse?.location}</Text>
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
      key: 'discount',
      align: 'right' as const,
      render: (record: any) => (
        <div>
          <div>{formatCurrency(record.discount_amount || 0)}</div>
          <Text type='secondary'>({record.discount_type})</Text>
        </div>
      ),
    },
    {
      title: 'Tax',
      key: 'tax',
      align: 'right' as const,
      render: (record: any) => (
        <div>
          <div>{formatCurrency(record.tax_amount || 0)}</div>
          <Text type='secondary'>({record.tax_type})</Text>
        </div>
      ),
    },
    {
      title: 'Subtotal',
      dataIndex: 'subtotal',
      key: 'subtotal',
      align: 'right' as const,
      render: (amount: number) => <Text strong>{formatCurrency(amount)}</Text>,
    },
  ];

  if (!so) {
    return (
      <PageContainer
        header={{
          title: 'Loading...',
        }}
      >
        <div>Loading sale order details...</div>
      </PageContainer>
    );
  }

  return (
    <>
      <PageContainer
        header={{
          title: so?.name || 'Sale Order Detail',
          breadcrumb: {
            routes: [
              {
                path: '/home',
                title: 'Home',
              },
              {
                path: '/collections/sale-orders',
                title: 'Sale Orders',
              },
              {
                path: `/collections/sale-orders/edit/${id}`,
                title: 'Edit',
              },
              {
                title: 'Detail',
              },
            ],
            itemRender: breadcrumbItemRender,
          },
        }}
        extra={
          <>
            {(so?.order_status === 'New' || so?.order_status === 'Pending') && (
              <>
                <Button
                  variant='solid'
                  color='green'
                  icon={<CheckOutlined />}
                  onClick={() => changeStatus('Approved')}
                >
                  Approved
                </Button>
                <Button
                  variant='solid'
                  color='red'
                  icon={<CloseOutlined />}
                  onClick={() => changeStatus('Rejected')}
                >
                  Reject
                </Button>
                <Button
                  variant='solid'
                  color='orange'
                  icon={<EditOutlined />}
                  onClick={() =>
                    navigate(`/collections/sale-orders/edit/${id}`)
                  }
                >
                  Edit
                </Button>
              </>
            )}
            {so?.order_status === 'Approved' && (
              <Button
                variant='solid'
                color='blue'
                icon={<CheckOutlined />}
                onClick={() => changeStatus('Completed')}
              >
                Completed
              </Button>
            )}
            {so?.order_status === 'Completed' && (
              <span className='block-inline flex items-center gap-2 px-2 py-1 border border-green-500 rounded bg-green-50 text-green-500'>
                <CheckOutlined />
                Completed
              </span>
            )}
            {so?.order_status === 'Rejected' && (
              <span className='block-inline flex items-center gap-2 px-2 py-1 border border-red-500 rounded bg-red-50 text-red-500'>
                <CloseOutlined />
                Rejected
              </span>
            )}
          </>
        }
      >
        <div className='space-y-6'>
          {/* Header Information */}
          <Card>
            <Row gutter={24}>
              <Col span={8}>
                <Descriptions title='Sale Order Information' column={1}>
                  <Descriptions.Item label='SO Number'>
                    <Text strong className='text-lg'>
                      {so.name}
                    </Text>
                  </Descriptions.Item>
                  <Descriptions.Item label='Sale Date'>
                    {new Date(so.sale_date).toLocaleDateString()}
                  </Descriptions.Item>
                  <Descriptions.Item label='Status'>
                    <Tag color={getStatusColor(so.order_status)}>
                      {so.order_status}
                    </Tag>
                  </Descriptions.Item>
                </Descriptions>
              </Col>
              <Col span={8}>
                <Descriptions title='Customer Information' column={1}>
                  {so.account && (
                    <>
                      <Descriptions.Item label='Account'>
                        <Text strong>{so.account.name}</Text>
                      </Descriptions.Item>
                      <Descriptions.Item label='Short Name'>
                        {so.account.shortName}
                      </Descriptions.Item>
                      <Descriptions.Item label='Industry'>
                        {so.account.industry}
                      </Descriptions.Item>
                      <Descriptions.Item label='Website'>
                        {so.account.website && (
                          <a
                            href={`https://${so.account.website}`}
                            target='_blank'
                            rel='noopener noreferrer'
                          >
                            {so.account.website}
                          </a>
                        )}
                      </Descriptions.Item>
                      <Descriptions.Item label='Email'>
                        {so.account.email && (
                          <a href={`mailto:${so.account.email}`}>
                            {so.account.email}
                          </a>
                        )}
                      </Descriptions.Item>
                    </>
                  )}
                  {so.contact && (
                    <>
                      <Descriptions.Item label='Contact'>
                        <Text strong>{so.contact.name}</Text>
                      </Descriptions.Item>
                      <Descriptions.Item label='Email'>
                        {so.contact.email && (
                          <a href={`mailto:${so.contact.email}`}>
                            {so.contact.email}
                          </a>
                        )}
                      </Descriptions.Item>
                      <Descriptions.Item label='Phone'>
                        {so.contact.phone}
                      </Descriptions.Item>
                    </>
                  )}
                </Descriptions>
              </Col>
              <Col span={8}>
                <Descriptions title='Order Details' column={1}>
                  <Descriptions.Item label='Created'>
                    {new Date(so.createdAt).toLocaleDateString()}
                  </Descriptions.Item>
                  <Descriptions.Item label='Last Updated'>
                    {new Date(so.updatedAt).toLocaleDateString()}
                  </Descriptions.Item>
                  <Descriptions.Item label='Discount Type'>
                    <Tag>{so.discount_type}</Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label='Tax Type'>
                    <Tag>{so.tax_type}</Tag>
                  </Descriptions.Item>
                </Descriptions>
              </Col>
            </Row>
          </Card>

          {/* Items Table */}
          <Card title='Sale Order Items'>
            <Table
              columns={columns}
              dataSource={so.sale_order_details}
              rowKey='id'
              pagination={false}
              scroll={{ x: 800 }}
            />
          </Card>

          {/* Totals Summary */}
          <Card>
            <Row gutter={24}>
              <Col span={16}>
                {/* Left side can be used for notes or additional info */}
              </Col>
              <Col span={8}>
                <div className='bg-gray-50 p-4 rounded'>
                  <Title level={5}>Order Summary</Title>
                  <div className='space-y-2'>
                    <div className='flex justify-between'>
                      <Text>Subtotal:</Text>
                      <Text>{formatCurrency(so.subtotal)}</Text>
                    </div>
                    <div className='flex justify-between'>
                      <Text>Discount:</Text>
                      <Text>-{formatCurrency(so.discount_amount || 0)}</Text>
                    </div>
                    <div className='flex justify-between'>
                      <Text>Tax:</Text>
                      <Text>+{formatCurrency(so.tax_amount || 0)}</Text>
                    </div>
                    <Divider style={{ margin: '8px 0' }} />
                    <div className='flex justify-between'>
                      <Text strong className='text-lg'>
                        Total Amount:
                      </Text>
                      <Text strong className='text-lg text-green-600'>
                        {formatCurrency(so.total_amount)}
                      </Text>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Card>
        </div>
      </PageContainer>
    </>
  );
}
