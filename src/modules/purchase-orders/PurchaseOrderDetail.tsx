import { PageContainer } from '@ant-design/pro-components';
import { Image, Typography } from 'antd';
import { Card, Col, Descriptions, Divider, Row, Table, Tag } from 'antd/lib';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { breadcrumbItemRender, getMediaUrl } from '../../helpers/views_helper';
import ApiService from '../../services/ApiService';

const { Title, Text } = Typography;

export default function PurchaseOrderDetail() {
  const { id } = useParams();

  const [po, setPo] = useState<any>(null);

  useEffect(() => {
    if (!id) return;

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
        setPo(res.data);
      });
  }, [id]);

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      New: 'blue',
      Pending: 'orange',
      Approved: 'green',
      Rejected: 'red',
      Completed: 'purple',
    };
    return colors[status] || 'default';
  };

  const formatCurrency = (amount: number) => {
    return `$${amount?.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
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

  if (!po) {
    return (
      <PageContainer
        header={{
          title: 'Loading...',
        }}
      >
        <div>Loading purchase order details...</div>
      </PageContainer>
    );
  }

  return (
    <>
      <PageContainer
        header={{
          title: po?.name || 'Purchase Order Detail',
          breadcrumb: {
            routes: [
              {
                path: '/home',
                title: 'Home',
              },
              {
                path: '/collections/purchase-orders',
                title: 'Purchase Orders',
              },
              {
                path: `/collections/purchase-orders/edit/${id}`,
                title: 'Edit',
              },
              {
                title: 'Detail',
              },
            ],
            itemRender: breadcrumbItemRender,
          },
        }}
      >
        <div className='space-y-6'>
          {/* Header Information */}
          <Card>
            <Row gutter={24}>
              <Col span={12}>
                <Descriptions title='Purchase Order Information' column={1}>
                  <Descriptions.Item label='PO Number'>
                    <Text strong className='text-lg'>
                      {po.name}
                    </Text>
                  </Descriptions.Item>
                  <Descriptions.Item label='Purchase Date'>
                    {new Date(po.purchase_date).toLocaleDateString()}
                  </Descriptions.Item>
                  <Descriptions.Item label='Status'>
                    <Tag color={getStatusColor(po.order_status)}>
                      {po.order_status}
                    </Tag>
                  </Descriptions.Item>
                </Descriptions>
              </Col>
              <Col span={12}>
                <Descriptions title='Supplier Information' column={1}>
                  <Descriptions.Item label='Supplier Name'>
                    <Text strong>{po.supplier?.name}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label='Created'>
                    {new Date(po.createdAt).toLocaleDateString()}
                  </Descriptions.Item>
                  <Descriptions.Item label='Last Updated'>
                    {new Date(po.updatedAt).toLocaleDateString()}
                  </Descriptions.Item>
                </Descriptions>
              </Col>
            </Row>
          </Card>

          {/* Items Table */}
          <Card title='Purchase Order Items'>
            <Table
              columns={columns}
              dataSource={po.purchase_order_details}
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
                      <Text>{formatCurrency(po.subtotal)}</Text>
                    </div>
                    <div className='flex justify-between'>
                      <Text>Total Discount:</Text>
                      <Text>-{formatCurrency(po.total_discount || 0)}</Text>
                    </div>
                    <div className='flex justify-between'>
                      <Text>Total Tax:</Text>
                      <Text>+{formatCurrency(po.total_tax || 0)}</Text>
                    </div>
                    <Divider style={{ margin: '8px 0' }} />
                    <div className='flex justify-between'>
                      <Text strong className='text-lg'>
                        Total Amount:
                      </Text>
                      <Text strong className='text-lg text-green-600'>
                        {formatCurrency(po.total_amount)}
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
