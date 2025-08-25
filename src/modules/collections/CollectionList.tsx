import { EditOutlined } from '@ant-design/icons';
import { ProTable } from '@ant-design/pro-components';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PageLoading from '../../components/PageLoading';
import ApiService from '../../services/ApiService';
import MetadataService from '../../services/MetadataService';

export default function CollectionList() {
  // Get the 'name' parameter from the route
  const { name: module } = useParams();

  const [config, setConfig] = useState<any>({});
  const [columns, setColumns] = useState<any>([]);

  useEffect(() => {
    if (module) {
      MetadataService.getCollectionConfigurations(module).then((res) => {
        setConfig(res);
      });
    }
  }, [module]);

  useEffect(() => {
    if (config?.layouts?.list) {
      const cols: any = [];
      config.layouts.list.forEach((field: string) => {
        const metadatas = config.metadatas?.[field]?.list || {};
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
            <a href={`/collections/${module}/${record.documentId}`}>
              <EditOutlined />
            </a>
          </div>
        ),
      });

      setColumns(cols);
    }
  }, [config, module]);

  if (!config?.layouts) return <PageLoading />;

  return (
    <div>
      <h1 className='text-2xl mb-4 uppercase'>{module}</h1>
      <ProTable
        columns={columns}
        request={async (params) => {
          if (!module) {
            return {
              data: [],
              total: 0,
            };
          }

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

          const collections = await ApiService.getClient()
            .collection(module)
            .find({
              ...searchParams,
              pagination: {
                page: params.current || 1,
                pageSize: params.pageSize || 10,
              },
            });

          return {
            data: collections.data || [],
            total: collections.meta.pagination?.total || 0,
          };
        }}
        rowKey={(record: any) => record.id || record.key || JSON.stringify(record)}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `Showing ${range[0]}-${range[1]} of ${total} items`,
        }}
      />
    </div>
  );
}
