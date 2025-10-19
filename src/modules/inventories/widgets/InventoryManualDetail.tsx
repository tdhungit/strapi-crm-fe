import { DownOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { App, Button, Descriptions, Image, Space, Table, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  breadcrumbItemRender,
  datetimeDisplay,
  formatCurrency,
  getMediaUrl,
} from '../../../helpers/views_helper';
import ApiService from '../../../services/ApiService';

export default function InventoryManualDetail() {
  const { id } = useParams();
  const { message, notification } = App.useApp();

  const [record, setRecord] = useState<any>({});

  useEffect(() => {
    if (!id) {
      return;
    }

    ApiService.getClient()
      .collection('inventory-manuals')
      .findOne(id, {
        populate: ['details.product_variant.product', 'warehouse'],
      })
      .then((res) => {
        setRecord(res.data);
      });
  }, [id]);

  // Function to get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New':
        return 'blue';
      case 'Approved':
        return 'green';
      case 'Rejected':
        return 'red';
      default:
        return 'default';
    }
  };

  const onApprove = () => {
    if (!id) {
      return;
    }

    message.loading('Approving...', 0);
    ApiService.request('PUT', `/inventory-manuals/${id}/change-status`, {
      status: 'Approved',
    })
      .then(() => {
        setRecord((prev: any) => ({
          ...prev,
          inventory_status: 'Approved',
        }));
        notification.success({
          message: 'Success',
          description: 'Inventory approved successfully',
        });
      })
      .catch(() => {
        notification.error({
          message: 'Error',
          description: 'Failed to approve inventory',
        });
      })
      .finally(() => {
        message.destroy();
      });
  };

  // Columns for the details table
  const detailColumns = [
    {
      title: 'Product',
      dataIndex: ['product_variant', 'name'],
      key: 'product',
      render: (text: string, record: any) => (
        <Space size='middle'>
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
            <div>
              {record.product_variant?.name || text} (
              <Link
                to={`/collections/products/detail/${record.product_variant?.product.documentId}`}
                className='text-green-600 italic'
              >
                {record.product_variant?.product.name}
              </Link>
              )
            </div>
            <div className='text-xs text-gray-500'>
              SKU: {record.product_variant?.sku}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center' as const,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      align: 'right' as const,
      render: (price: number) => formatCurrency(price),
    },
    {
      title: 'Total',
      key: 'total',
      align: 'right' as const,
      render: (_: any, record: any) =>
        formatCurrency(record.quantity * record.price),
    },
  ];

  return (
    <PageContainer
      header={{
        title: 'Inventory Information',
        breadcrumb: {
          items: [
            {
              title: 'Home',
              href: '/',
            },
            {
              title: 'Inventories',
              href: '/collections/inventories',
            },
            {
              title: 'Inventory Manuals',
              href: '/collections/inventories/manuals',
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
          {record.inventory_status === 'New' && (
            <Button type='primary' icon={<DownOutlined />} onClick={onApprove}>
              Approve
            </Button>
          )}
          {record.inventory_status === 'Approved' && (
            <Button
              variant='solid'
              color='green'
              icon={<DownOutlined />}
              disabled
            >
              Approved
            </Button>
          )}
          {record.inventory_status === 'Rejected' && (
            <Button
              variant='solid'
              color='red'
              icon={<DownOutlined />}
              disabled
            >
              Rejected
            </Button>
          )}
        </>
      }
    >
      <Descriptions column={2} bordered className='mb-6'>
        <Descriptions.Item label='Inventory Type'>
          {record.inventory_type}
        </Descriptions.Item>
        <Descriptions.Item label='Status'>
          <Tag color={getStatusColor(record.inventory_status)}>
            {record.inventory_status}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label='Created At'>
          {datetimeDisplay(record.createdAt)}
        </Descriptions.Item>
        <Descriptions.Item label='Updated At'>
          {datetimeDisplay(record.updatedAt)}
        </Descriptions.Item>
      </Descriptions>

      <div className='mt-6'>
        <h3 className='text-lg font-semibold mb-4'>Inventory Details</h3>
        <Table
          dataSource={record.details || []}
          columns={detailColumns}
          rowKey='id'
          pagination={false}
        />
      </div>
    </PageContainer>
  );
}
