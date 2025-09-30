import { CheckOutlined } from '@ant-design/icons';
import { ProTable, type ActionType } from '@ant-design/pro-components';
import { Button, Input, Modal, Space } from 'antd';
import { useEffect, useRef, useState } from 'react';
import ApiService from '../../../services/ApiService';

function useDebounce<T>(value: T, delay: number) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debounced;
}

export default function CustomerListModal({
  open,
  onOpenChange,
  width,
  onSelect,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  width?: number;
  onSelect?: (record: any) => void;
}) {
  const leadActionRef = useRef<ActionType>(null);
  const contactActionRef = useRef<ActionType>(null);

  const [search, setSearch] = useState('');

  const debouncedSearch = useDebounce(search, 400);

  const getFilters = (keyword: string) => {
    return {
      $or: [
        {
          firstName: {
            $containsi: keyword,
          },
        },
        {
          lastName: {
            $containsi: keyword,
          },
        },
        {
          email: {
            $containsi: keyword,
          },
        },
        {
          phone: {
            $containsi: keyword,
          },
        },
      ],
    };
  };

  useEffect(() => {
    if (debouncedSearch) {
      leadActionRef.current?.reload();
      contactActionRef.current?.reload();
    }
  }, [debouncedSearch]);

  const actionColumn = (type: string) => {
    return {
      title: 'Action',
      dataIndex: 'action',
      render: (_dom: any, record: any) => (
        <Space>
          <Button
            size='small'
            variant='solid'
            color='green'
            onClick={() => {
              onSelect?.({
                ...record,
                type,
              });
              onOpenChange(false);
            }}
            icon={<CheckOutlined />}
          />
        </Space>
      ),
    };
  };

  return (
    <Modal
      open={open}
      title='Customer List (Contacts & Leads)'
      onOk={() => onOpenChange(false)}
      onCancel={() => onOpenChange(false)}
      footer={null}
      width={width || 1000}
    >
      <div className='w-full mb-4 mt-4'>
        <Space.Compact className='w-full'>
          <Input
            placeholder='Search'
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
        </Space.Compact>
      </div>

      <div className='w-full p-2 mb-4 border rounded-md border-gray-200 h-[360px] overflow-y-auto'>
        <ProTable
          headerTitle='Contacts'
          size='small'
          columns={[
            {
              title: 'First Name',
              dataIndex: 'firstName',
            },
            {
              title: 'Last Name',
              dataIndex: 'lastName',
            },
            {
              title: 'Email',
              dataIndex: 'email',
              valueType: 'email',
            },
            {
              title: 'Phone',
              dataIndex: 'phone',
              valueType: 'phone',
            },
            {
              title: 'Status',
              dataIndex: 'contactStatus',
              render: () => <span>Active</span>,
            },
            actionColumn('contact'),
          ]}
          request={async (params) => {
            const res = await ApiService.getClient()
              .collection('contacts')
              .find({
                filters: {
                  ...(params?.filters || {}),
                  // Apply search filters if debounced search exists
                  ...(debouncedSearch ? getFilters(debouncedSearch) : {}),
                },
                populate: ['address', 'lead'],
                pagination: {
                  page: params.current,
                  pageSize: params.pageSize,
                },
              });
            return {
              data: res.data,
              success: true,
              total: res.meta?.pagination?.total || 0,
            };
          }}
          pagination={{
            pageSize: 5,
          }}
          search={false}
          options={false}
          tableLayout='auto'
          scroll={{ x: 'max-content' }}
          actionRef={contactActionRef}
        />
      </div>

      <div className='w-full p-2 border rounded-md border-gray-200 h-[360px] overflow-y-auto'>
        <ProTable
          headerTitle='Leads'
          size='small'
          columns={[
            {
              title: 'First Name',
              dataIndex: 'firstName',
            },
            {
              title: 'Last Name',
              dataIndex: 'lastName',
            },
            {
              title: 'Email',
              dataIndex: 'email',
              valueType: 'email',
            },
            {
              title: 'Phone',
              dataIndex: 'phone',
              valueType: 'phone',
            },
            {
              title: 'Status',
              dataIndex: 'leadStatus',
            },
            actionColumn('lead'),
          ]}
          request={async (params) => {
            const res = await ApiService.getClient()
              .collection('leads')
              .find({
                filters: {
                  ...(params?.filters || {}),
                  leadStatus: {
                    $ne: 'Converted',
                  },
                  // Apply search filters if debounced search exists
                  ...(debouncedSearch ? getFilters(debouncedSearch) : {}),
                },
                populate: ['address', 'contact'],
                pagination: {
                  page: params.current,
                  pageSize: params.pageSize,
                },
              });
            return {
              data: res.data,
              success: true,
              total: res.meta?.pagination?.total || 0,
            };
          }}
          pagination={{
            pageSize: 5,
          }}
          search={false}
          options={false}
          tableLayout='auto'
          scroll={{ x: 'max-content' }}
          actionRef={leadActionRef}
        />
      </div>
    </Modal>
  );
}
