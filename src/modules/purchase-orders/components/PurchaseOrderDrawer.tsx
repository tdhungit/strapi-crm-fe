import {
  ClockCircleOutlined,
  EditOutlined,
  EyeOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import {
  Button,
  Descriptions,
  Divider,
  Drawer,
  Image,
  Space,
  Table,
  Tabs,
  Tag,
  Typography,
} from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMediaUrl } from '../../../helpers/views_helper';
import ApiService from '../../../services/ApiService';
import type { CollectionDrawerProps } from '../../collections/components/CollectionDetailDrawer';
import PurchaseOrderTimeline from './PurchaseOrderTimeline';

const { Text, Title } = Typography;

export default function PurchaseOrderDrawer({
  open,
  onOpenChange,
  id,
  width,
}: CollectionDrawerProps) {
  const navigate = useNavigate();
  const [record, setRecord] = useState<any>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id && open) {
      setLoading(true);
      ApiService.getClient()
        .collection('purchase-orders')
        .findOne(id, {
          populate: [
            'supplier',
            'assigned_user',
            'purchase_order_details.product_variant',
            'purchase_order_details.warehouse',
          ],
        })
        .then((res: any) => {
          setRecord(res.data);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id, open]);

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
        <div className='flex items-center gap-2'>
          {record.product_variant?.photos?.[0] && (
            <Image
              width={40}
              height={40}
              src={getMediaUrl(record.product_variant.photos[0])}
              alt={text}
              className='rounded'
            />
          )}
          <div>
            <div className='font-medium text-sm'>{text}</div>
            <Text type='secondary' className='text-xs'>
              SKU: {record.product_variant?.sku}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: 'Qty',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center' as const,
      width: 60,
    },
    {
      title: 'Price',
      dataIndex: 'unit_price',
      key: 'unit_price',
      align: 'right' as const,
      width: 80,
      render: (amount: number) => (
        <Text className='text-sm'>{formatCurrency(amount)}</Text>
      ),
    },
    {
      title: 'Subtotal',
      dataIndex: 'subtotal',
      key: 'subtotal',
      align: 'right' as const,
      width: 90,
      render: (amount: number) => (
        <Text strong className='text-sm'>
          {formatCurrency(amount)}
        </Text>
      ),
    },
  ];

  if (!record || loading) {
    return (
      <Drawer
        open={open}
        onClose={() => onOpenChange(false)}
        width={width || 600}
        title='Loading...'
      >
        <div>Loading purchase order details...</div>
      </Drawer>
    );
  }

  return (
    <Drawer
      open={open}
      onClose={() => onOpenChange(false)}
      width={width || 700}
      title={record.name}
      extra={
        <Space>
          <Tag color={getStatusColor(record.order_status)}>
            {record.order_status}
          </Tag>
          {['New', 'Pending'].includes(record.order_status) && (
            <Button
              icon={<EditOutlined />}
              onClick={() => {
                navigate(`/collections/purchase-orders/edit/${id}`);
                onOpenChange(false);
              }}
            >
              Edit
            </Button>
          )}
          <Button
            type='primary'
            icon={<EyeOutlined />}
            onClick={() => {
              navigate(`/collections/purchase-orders/detail/${id}`);
              onOpenChange(false);
            }}
          >
            Full Detail
          </Button>
        </Space>
      }
      styles={{
        body: {
          paddingTop: 0,
        },
      }}
    >
      <Tabs
        defaultActiveKey='information'
        items={[
          {
            key: 'information',
            label: 'Information',
            icon: <InfoCircleOutlined />,
            children: (
              <div className='space-y-4'>
                {/* Basic Information */}
                <div>
                  <Title level={5}>Purchase Order Information</Title>
                  <Descriptions column={1} size='small'>
                    <Descriptions.Item label='PO Number'>
                      <Text strong>{record.name}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label='Purchase Date'>
                      {new Date(record.purchase_date).toLocaleDateString()}
                    </Descriptions.Item>
                    <Descriptions.Item label='Status'>
                      <Tag color={getStatusColor(record.order_status)}>
                        {record.order_status}
                      </Tag>
                    </Descriptions.Item>
                  </Descriptions>
                </div>

                <Divider />

                {/* Supplier Information */}
                <div>
                  <Title level={5}>Supplier Information</Title>
                  <Descriptions column={1} size='small'>
                    <Descriptions.Item label='Supplier'>
                      <Text strong>{record.supplier?.name}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label='Assigned User'>
                      <Text>{record.assigned_user?.username}</Text>
                    </Descriptions.Item>
                  </Descriptions>
                </div>

                <Divider />

                {/* Items */}
                <div>
                  <Title level={5}>Order Items</Title>
                  <Table
                    columns={columns}
                    dataSource={record.purchase_order_details}
                    rowKey='id'
                    pagination={false}
                    size='small'
                    scroll={{ x: 400 }}
                  />
                </div>

                <Divider />

                {/* Financial Summary */}
                <div>
                  <Title level={5}>Financial Summary</Title>
                  <div className='bg-gray-50 p-3 rounded'>
                    <div className='space-y-2'>
                      <div className='flex justify-between'>
                        <Text>Subtotal:</Text>
                        <Text>{formatCurrency(record.subtotal)}</Text>
                      </div>
                      <div className='flex justify-between'>
                        <Text>Discount:</Text>
                        <Text>
                          -{formatCurrency(record.total_discount || 0)}
                        </Text>
                      </div>
                      <div className='flex justify-between'>
                        <Text>Tax:</Text>
                        <Text>+{formatCurrency(record.total_tax || 0)}</Text>
                      </div>
                      <Divider style={{ margin: '8px 0' }} />
                      <div className='flex justify-between'>
                        <Text strong>Total Amount:</Text>
                        <Text strong className='text-green-600 text-lg'>
                          {formatCurrency(record.total_amount)}
                        </Text>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timestamps */}
                <div>
                  <Title level={5}>Record Information</Title>
                  <Descriptions column={1} size='small'>
                    <Descriptions.Item label='Created'>
                      {new Date(record.createdAt).toLocaleString()}
                    </Descriptions.Item>
                    <Descriptions.Item label='Last Updated'>
                      {new Date(record.updatedAt).toLocaleString()}
                    </Descriptions.Item>
                  </Descriptions>
                </div>
              </div>
            ),
          },
          {
            key: 'timeline',
            label: 'Timeline',
            icon: <ClockCircleOutlined />,
            children: (
              <div className='space-y-4'>
                {record && <PurchaseOrderTimeline record={record} />}
              </div>
            ),
          },
        ]}
      />
    </Drawer>
  );
}
