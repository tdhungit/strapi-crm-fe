import { PlusOutlined } from '@ant-design/icons';
import { ProTable } from '@ant-design/pro-components';
import { App, Button, Modal } from 'antd';
import type dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import ApiService from '../../../services/ApiService';

export default function ProductVariantsPricesModal({
  open,
  onOpenChange,
  width,
  onSelect,
  warehouse,
  priceDate,
  priceType,
}: {
  open: boolean;
  width?: number;
  onOpenChange: (open: boolean) => void;
  onSelect?: (variant: any) => void;
  warehouse?: any;
  priceDate?: dayjs.Dayjs;
  priceType?: string;
}) {
  const { message } = App.useApp();

  const [tableParams, setTableParams] = useState<any>({
    current: 1,
    pageSize: 10,
  });

  useEffect(() => {
    if (warehouse) {
      setTableParams((prev: any) => ({
        ...prev,
        warehouseId: warehouse.id,
      }));
    }

    if (priceDate) {
      setTableParams((prev: any) => ({
        ...prev,
        priceDate: priceDate.format('YYYY-MM-DD'),
      }));
    }
  }, [warehouse, priceDate]);

  return (
    <Modal
      open={open}
      width={width || 1000}
      onOk={() => onOpenChange(false)}
      onCancel={() => onOpenChange(false)}
      footer={null}
      title='Products'
    >
      <ProTable
        columns={[
          {
            title: 'Name',
            dataIndex: 'product_variant_name',
            render: (_dom: any, record: any) => {
              return (
                <span>
                  {record.product_variant.name} ({record.product_variant.sku})
                </span>
              );
            },
          },
          {
            title: 'Quantity',
            dataIndex: 'stock_quantity',
          },
          {
            title: 'Warehouse',
            dataIndex: 'warehouse_name',
            render: (_dom: any, record: any) => {
              return <span>{record.warehouse.name}</span>;
            },
          },
          {
            title: 'Price',
            dataIndex: 'price',
            render: (_dom: any, record: any) => {
              return (
                <span>${record.product_variant.product_prices[0].price}</span>
              );
            },
          },
          {
            title: 'Action',
            render: (_dom: any, record: any) => {
              return (
                <Button
                  variant='solid'
                  color='primary'
                  icon={<PlusOutlined />}
                  onClick={() => {
                    onSelect?.({
                      ...record.product_variant,
                      stock_quantity: record.stock_quantity,
                      warehouse: record.warehouse,
                    });
                    onOpenChange(false);
                  }}
                />
              );
            },
          },
        ]}
        request={async (params) => {
          if (!params.warehouseId) {
            message.error('Warehouse is required');
            return {
              data: [],
              success: true,
            };
          }

          const res = await ApiService.request(
            'get',
            `/inventories/warehouse/${params.warehouseId}/available-products`,
            {
              ...params,
              price_type: priceType || '',
              date: params.priceDate,
            }
          );

          return {
            data: res.data,
            success: true,
          };
        }}
        rowKey='id'
        search={false}
        toolbar={{
          search: {
            onSearch: (value: string) => {
              setTableParams({
                ...tableParams,
                search: value,
              });
            },
          },
        }}
        params={tableParams}
      />
    </Modal>
  );
}
