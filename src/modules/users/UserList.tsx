import { EditOutlined, EyeOutlined } from '@ant-design/icons';
import { ProTable } from '@ant-design/pro-components';
import React, { useEffect, useState } from 'react';
import PageLoading from '../../components/PageLoading';
import ApiService from '../../services/ApiService';
import MetadataService from '../../services/MetadataService';

const UserList: React.FC = () => {
  const [config, setConfig] = useState<any>({});
  const [columns, setColumns] = useState<any>([]);

  useEffect(() => {
    MetadataService.getCollectionConfigurations('users').then((res) => {
      setConfig(res);

      const cols: any = [];
      res.layouts.list.forEach((field: string) => {
        const metadatas = res.metadatas?.[field]?.list || {};
        cols.push({
          title: metadatas.label || field,
          dataIndex: field,
          key: field,
          search: true, // Enable search for all columns
          ellipsis: true, // Handle long text with ellipsis
        });
      });

      // add actions column
      cols.push({
        title: 'Actions',
        key: 'actions',
        search: false,
        render: (record: any) => (
          <div>
            <a href={`/users/edit/${record.id}`} className='inline-block'>
              <EditOutlined />
            </a>
            <a href={`/users/detail/${record.id}`} className='inline-block ml-2'>
              <EyeOutlined />
            </a>
          </div>
        ),
      });

      setColumns(cols);
    });
  }, []);

  if (!config?.layouts) return <PageLoading />;

  return (
    <div>
      <h1 className='text-2xl mb-4'>User List</h1>

      <ProTable
        columns={columns}
        request={async (params) => {
          // Handle search parameters
          const searchParams: any = { filters: {} };
          // Handle individual field filters
          Object.keys(params).forEach((key) => {
            if (key !== 'search' && key !== 'current' && key !== 'pageSize' && params[key]) {
              searchParams.filters[key] = {
                $contains: params[key],
              };
            }
          });

          const users = await ApiService.getClient()
            .collection('users')
            .find({
              ...searchParams,
            });
          return {
            data: users.data || [],
            total: users.meta.pagination?.total || 0,
          };
        }}
        rowKey='id'
        pagination={{
          defaultPageSize: config.settings?.pageSize || 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `Showing ${range[0]}-${range[1]} of ${total} items`,
        }}
      />
    </div>
  );
};

export default UserList;
