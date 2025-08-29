import {
  EditOutlined,
  EyeOutlined,
  FileExcelOutlined,
  PlusCircleFilled,
} from '@ant-design/icons';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, message } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import PageLoading from '../../components/PageLoading';
import {
  capitalizeFirstLetter,
  getListLayoutColumns,
} from '../../helpers/views_helper';
import ApiService from '../../services/ApiService';
import MetadataService from '../../services/MetadataService';

export default function CollectionList() {
  // Get the 'name' parameter from the route
  const { name: module } = useParams();
  const ref = useRef<any>(null);

  const [config, setConfig] = useState<any>({});
  const [columns, setColumns] = useState<any>([]);
  const [params, setParams] = useState<any>({});

  useEffect(() => {
    if (module) {
      MetadataService.getCollectionConfigurations(module).then((res) => {
        setConfig(res);
        ref?.current?.reload();
      });
    }
  }, [module]);

  useEffect(() => {
    if (config?.layouts?.list) {
      const cols: any = getListLayoutColumns(config);
      // add actions column
      cols.push({
        title: 'Actions',
        key: 'actions',
        search: false,
        render: (record: any) => (
          <div>
            <a
              href={`/collections/${module}/detail/${record.documentId}`}
              className='inline-block'
            >
              <EyeOutlined />
            </a>
            <a
              href={`/collections/${module}/edit/${record.documentId}`}
              className='inline-block ml-2'
            >
              <EditOutlined />
            </a>
          </div>
        ),
      });

      setColumns(cols);
    }
  }, [config, module]);

  const handleExport = () => {
    if (!module) {
      return;
    }

    ApiService.request('get', `/exports/csv/${module}`, {
      filters: params.filters || {},
      sort: params.sort || {},
    }).then((res) => {
      // download file with res is csv
      const url = window.URL.createObjectURL(new Blob([res]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${module}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      message.success('Export completed');
    });
  };

  if (!config?.layouts) return <PageLoading />;

  return (
    <PageContainer
      header={{
        title: `${module?.toUpperCase()}`,
        breadcrumb: {
          items: [
            {
              title: 'Home',
              href: '/home',
            },
            {
              title: capitalizeFirstLetter(module || ''),
              href: `/collections/${module}`,
            },
          ],
        },
      }}
    >
      <ProTable
        key={`${module}-list`}
        columns={columns}
        rowKey='documentId'
        actionRef={ref}
        search={{
          searchText: 'Search',
        }}
        request={async (params) => {
          setParams(params);

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
            if (
              key !== 'search' &&
              key !== 'current' &&
              key !== 'pageSize' &&
              params[key]
            ) {
              searchParams.filters[key] = {
                $contains: params[key],
              };
            }
          });

          const collections = await ApiService.getClient()
            .collection(module)
            .find({
              ...searchParams,
            });

          return {
            data: collections.data || [],
            total: collections.meta.pagination?.total || 0,
          };
        }}
        pagination={{
          defaultPageSize: config.settings?.pageSize || 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `Showing ${range[0]}-${range[1]} of ${total} items`,
        }}
        toolBarRender={() => [
          <Button
            key='create'
            variant='solid'
            color='primary'
            href={`/collections/${module}/create`}
          >
            <PlusCircleFilled /> Create
          </Button>,
          <Button
            key='import'
            variant='solid'
            color='orange'
            href={`/imports/${module}?returnUrl=/collections/${module}`}
          >
            <FileExcelOutlined /> Import
          </Button>,
          <Button
            key='export'
            variant='solid'
            color='volcano'
            onClick={handleExport}
          >
            <FileExcelOutlined /> Export
          </Button>,
        ]}
      />
    </PageContainer>
  );
}
