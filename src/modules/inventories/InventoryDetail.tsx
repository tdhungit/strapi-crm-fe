import {
  LightFilter,
  PageContainer,
  ProDescriptions,
  ProFormDateRangePicker,
  ProTable,
  type ActionType,
} from '@ant-design/pro-components';
import { Tag } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { breadcrumbItemRender } from '../../helpers/views_helper';
import ApiService from '../../services/ApiService';

export default function InventoryDetail() {
  const { id } = useParams();
  const soActionRef = useRef<ActionType>(null);
  const poActionRef = useRef<ActionType>(null);

  const [inventory, setInventory] = useState<any>(null);
  const [soParams, setSoParams] = useState<any>({});
  const [poParams, setPoParams] = useState<any>({});

  useEffect(() => {
    if (!id) return;

    ApiService.getClient()
      .collection('inventories')
      .findOne(id, {
        populate: ['product_variant.product', 'warehouse'],
      })
      .then((res) => {
        setInventory(res.data);
      });
  }, [id]);

  return (
    <>
      <PageContainer
        header={{
          title: inventory?.product_variant?.name || 'Inventory Detail',
          breadcrumb: {
            items: [
              {
                title: 'Home',
                href: '/',
              },
              {
                title: 'Inventory',
                href: '/collections/inventories',
              },
              {
                title: 'Detail',
              },
            ],
            itemRender: breadcrumbItemRender,
          },
        }}
      >
        <ProDescriptions
          bordered
          column={2}
          dataSource={inventory}
          columns={[
            {
              title: 'Product Variant',
              dataIndex: 'product_variant',
              render: (_dom: any, record: any) => (
                <>
                  {record.product_variant?.name} (
                  <Link
                    to={`/collections/products/detail/${record.product_variant?.product?.documentId}`}
                  >
                    {record.product_variant?.product?.name}
                  </Link>
                  )
                </>
              ),
            },
            {
              title: 'Warehouse',
              dataIndex: 'warehouse',
              render: (_dom: any, record: any) => record.warehouse?.name,
            },
            {
              title: 'Stock Quantity',
              dataIndex: 'stock_quantity',
            },
            {
              title: 'Last Updated',
              dataIndex: 'last_updated',
              valueType: 'dateTime',
            },
          ]}
        />

        {inventory?.product_variant && (
          <div className='mt-4'>
            <ProTable
              actionRef={soActionRef}
              headerTitle='Sale Orders'
              search={false}
              rowKey='documentId'
              toolbar={{
                filter: (
                  <LightFilter
                    onValuesChange={(values: any) => {
                      setSoParams({
                        sale_date: {
                          $gte: values.date_range[0],
                          $lte: values.date_range[1],
                        },
                      });
                    }}
                  >
                    <ProFormDateRangePicker
                      name='date_range'
                      label='Date Range'
                    />
                  </LightFilter>
                ),
              }}
              columns={[
                {
                  title: 'Name',
                  dataIndex: 'name',
                  render: (_dom: any, record: any) => (
                    <Link
                      to={`/collections/sale-orders/detail/${record.documentId}`}
                    >
                      {record.name}
                    </Link>
                  ),
                },
                {
                  title: 'Account',
                  dataIndex: 'account',
                  render: (_dom: any, record: any) => record.account?.name,
                },
                {
                  title: 'Contact',
                  dataIndex: 'contact',
                  render: (_dom: any, record: any) => record.contact?.name,
                },
                {
                  title: 'Total',
                  dataIndex: 'total_amount',
                  valueType: 'money',
                },
                {
                  title: 'Status',
                  dataIndex: 'order_status',
                  render: (_dom: any, record: any) => (
                    <Tag
                      color={
                        record.order_status === 'Completed' ? 'green' : 'red'
                      }
                    >
                      {record.order_status}
                    </Tag>
                  ),
                },
                {
                  title: 'Assigned User',
                  dataIndex: 'assigned_user',
                  render: (_dom: any, record: any) =>
                    record.assigned_user?.username,
                },
              ]}
              request={async (params) => {
                const filters: any = {
                  order_status: 'Completed',
                  sale_order_details: {
                    product_variant: {
                      id: inventory.product_variant.id,
                    },
                  },
                };

                if (params.sale_date) {
                  filters.sale_date = params.sale_date;
                }

                const res = await ApiService.getClient()
                  .collection('sale-orders')
                  .find({
                    filters,
                    populate: ['account', 'contact', 'assigned_user'],
                    sort: ['sale_date:desc'],
                  });

                return {
                  data: res.data,
                  success: true,
                  total: res.data.length,
                };
              }}
              params={soParams}
            />
          </div>
        )}

        {inventory?.product_variant && (
          <div className='mt-4'>
            <ProTable
              actionRef={poActionRef}
              headerTitle='Purchase Orders'
              search={false}
              toolbar={{
                filter: (
                  <LightFilter
                    onValuesChange={(values: any) => {
                      setPoParams({
                        purchase_date: {
                          $gte: values.date_range[0],
                          $lte: values.date_range[1],
                        },
                      });
                    }}
                  >
                    <ProFormDateRangePicker
                      name='date_range'
                      label='Date Range'
                    />
                  </LightFilter>
                ),
              }}
              columns={[
                {
                  title: 'Name',
                  dataIndex: 'name',
                  render: (_dom: any, record: any) => (
                    <Link
                      to={`/collections/purchase-orders/detail/${record.documentId}`}
                    >
                      {record.name}
                    </Link>
                  ),
                },
                {
                  title: 'Supplier',
                  dataIndex: 'supplier',
                  render: (_dom: any, record: any) => record.supplier?.name,
                },
                {
                  title: 'Total',
                  dataIndex: 'total_amount',
                  valueType: 'money',
                },
                {
                  title: 'Status',
                  dataIndex: 'order_status',
                  render: (_dom: any, record: any) => (
                    <Tag
                      color={
                        record.order_status === 'Completed' ? 'green' : 'red'
                      }
                    >
                      {record.order_status}
                    </Tag>
                  ),
                },
                {
                  title: 'Assigned User',
                  dataIndex: 'assigned_user',
                  render: (_dom: any, record: any) =>
                    record.assigned_user?.username,
                },
              ]}
              request={async (params) => {
                console.log(params);
                const filters: any = {
                  order_status: 'Completed',
                  purchase_order_details: {
                    product_variant: {
                      id: inventory.product_variant.id,
                    },
                  },
                };

                if (params.purchase_date) {
                  filters.purchase_date = params.purchase_date;
                }

                const res = await ApiService.getClient()
                  .collection('purchase-orders')
                  .find({
                    filters,
                    populate: ['supplier', 'assigned_user'],
                    sort: ['purchase_date:desc'],
                  });

                return {
                  data: res.data,
                  success: true,
                  total: res.data.length,
                };
              }}
              params={poParams}
            />
          </div>
        )}
      </PageContainer>
    </>
  );
}
