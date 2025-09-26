import {
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
import { getMediaUrl } from '../../../helpers/views_helper';

const { Title, Text } = Typography;

export default function SaleOrderInformation({ record }: { record: any }) {
  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      New: 'blue',
      Pending: 'orange',
      Confirmed: 'green',
      Shipped: 'purple',
      Delivered: 'success',
      Completed: 'cyan',
      Cancelled: 'red',
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

  if (!record) {
    return (
      <div className='p-4'>
        <Text type='secondary'>No sale order data available</Text>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header Information */}
      <Card>
        <Row gutter={24}>
          <Col span={8}>
            <Descriptions title='Sale Order Information' column={1}>
              <Descriptions.Item label='SO Number'>
                <Text strong className='text-lg'>
                  {record.name}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label='Sale Date'>
                {new Date(record.sale_date).toLocaleDateString()}
              </Descriptions.Item>
              <Descriptions.Item label='Status'>
                <Tag color={getStatusColor(record.order_status)}>
                  {record.order_status}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label='Warehouse'>
                {record.warehouse?.name}
              </Descriptions.Item>
              <Descriptions.Item label='Assigned User'>
                {record.assigned_user?.username}
              </Descriptions.Item>
            </Descriptions>
          </Col>
          <Col span={8}>
            <Descriptions title='Customer Information' column={1}>
              {record.account && (
                <>
                  <Descriptions.Item label='Account'>
                    <Text strong>{record.account.name}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label='Short Name'>
                    {record.account.shortName}
                  </Descriptions.Item>
                  <Descriptions.Item label='Industry'>
                    {record.account.industry}
                  </Descriptions.Item>
                  <Descriptions.Item label='Website'>
                    {record.account.website && (
                      <a
                        href={`https://${record.account.website}`}
                        target='_blank'
                        rel='noopener noreferrer'
                      >
                        {record.account.website}
                      </a>
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item label='Email'>
                    {record.account.email && (
                      <a href={`mailto:${record.account.email}`}>
                        {record.account.email}
                      </a>
                    )}
                  </Descriptions.Item>
                </>
              )}
              {record.contact && (
                <>
                  <Descriptions.Item label='Contact'>
                    <Text strong>{record.contact.name}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label='Email'>
                    {record.contact.email && (
                      <a href={`mailto:${record.contact.email}`}>
                        {record.contact.email}
                      </a>
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item label='Phone'>
                    {record.contact.phone}
                  </Descriptions.Item>
                </>
              )}
            </Descriptions>
          </Col>
          <Col span={8}>
            <Descriptions title='Order Details' column={1}>
              <Descriptions.Item label='Assigned User'>
                <Text>{record.assigned_user?.username}</Text>
              </Descriptions.Item>
              <Descriptions.Item label='Created'>
                {new Date(record.createdAt).toLocaleDateString()}
              </Descriptions.Item>
              <Descriptions.Item label='Last Updated'>
                {new Date(record.updatedAt).toLocaleDateString()}
              </Descriptions.Item>
              <Descriptions.Item label='Discount Type'>
                <Tag>{record.discount_type}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label='Tax Type'>
                <Tag>{record.tax_type}</Tag>
              </Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>
      </Card>

      {/* Items Table */}
      <Card title='Sale Order Items'>
        <Table
          columns={columns}
          dataSource={record.sale_order_details}
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
                  <Text>{formatCurrency(record.subtotal)}</Text>
                </div>
                <div className='flex justify-between'>
                  <Text>Discount:</Text>
                  <Text>-{formatCurrency(record.discount_amount || 0)}</Text>
                </div>
                <div className='flex justify-between'>
                  <Text>Tax:</Text>
                  <Text>+{formatCurrency(record.tax_amount || 0)}</Text>
                </div>
                <Divider style={{ margin: '8px 0' }} />
                <div className='flex justify-between'>
                  <Text strong className='text-lg'>
                    Total Amount:
                  </Text>
                  <Text strong className='text-lg text-green-600'>
                    {formatCurrency(record.total_amount)}
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
