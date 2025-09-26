import { ProDescriptions } from '@ant-design/pro-components';
import { Drawer, Space, Tag, Timeline, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { datetimeDisplay } from '../../../helpers/views_helper';
import ApiService from '../../../services/ApiService';
import type { CollectionDrawerProps } from '../../collections/components/CollectionDetailDrawer';

export default function InventoryDrawer({
  open,
  onOpenChange,
  id,
  width,
}: CollectionDrawerProps) {
  const [record, setRecord] = useState<any>({});
  const [timeline, setTimeline] = useState<any[]>([]);

  const columns: any[] = [
    {
      title: 'Product Variant',
      dataIndex: 'product_variant',
      render: (_dom: any, record: any) => {
        return (
          <Link
            to={`/collections/products/detail/${record.product_variant.product.documentId}`}
          >
            {record.product_variant.name}
          </Link>
        );
      },
    },
    {
      title: 'Warehouse',
      dataIndex: 'warehouse',
      render: (_dom: any, record: any) => {
        return (
          <Link
            to={`/collections/warehouses/detail/${record.warehouse.documentId}`}
          >
            {record.warehouse.name}
          </Link>
        );
      },
    },
    {
      title: 'Product',
      dataIndex: 'product_variant.product',
      render: (_dom: any, record: any) => {
        return (
          <Link
            to={`/collections/products/detail/${record.product_variant.product.documentId}`}
          >
            {record.product_variant.product.name}
          </Link>
        );
      },
    },
    {
      title: 'Quantity',
      dataIndex: 'stock_quantity',
    },
  ];

  useEffect(() => {
    if (id) {
      ApiService.getClient()
        .collection('inventories')
        .findOne(id, { populate: ['product_variant.product', 'warehouse'] })
        .then((res: any) => {
          setRecord(res.data);

          ApiService.getClient()
            .collection('timelines')
            .find({
              filters: {
                model: 'inventories',
                record_id: res.data?.id,
              },
              populate: ['user'],
              sort: 'createdAt:desc',
            })
            .then((resTl: any) => {
              const items: any[] = [];
              resTl.data.forEach((tl: any) => {
                items.push({
                  children: (
                    <div>
                      <Typography.Title level={5}>{tl.title}</Typography.Title>
                      <div>
                        <Typography.Text className='text-xs italic !text-gray-500'>
                          {datetimeDisplay(tl.createdAt)}
                        </Typography.Text>
                      </div>
                      <div>
                        <Typography.Text>{tl.description}</Typography.Text>
                      </div>
                      <div>
                        <Typography.Text className='text-xs italic !text-gray-500'>
                          By: {tl.user?.username || 'System'}
                        </Typography.Text>
                      </div>
                    </div>
                  ),
                });
              });
              setTimeline(items);
            });
        });
    }
  }, [id]);

  return (
    <Drawer
      open={open}
      onClose={() => onOpenChange(false)}
      width={width || 700}
      title={
        record?.id ? record?.product_variant?.product?.name : 'Inventory Detail'
      }
      extra={
        <Space>
          <Tag color='blue'>{record?.product_variant?.sku}</Tag>
        </Space>
      }
    >
      {record?.id && (
        <>
          <ProDescriptions
            key={`drawer-detail-inventories-${id}`}
            dataSource={record}
            emptyText='No Data'
            column={2}
            columns={columns}
            bordered
          />

          <div className='w-full mt-8'>
            <Timeline items={timeline} />
          </div>
        </>
      )}
    </Drawer>
  );
}
