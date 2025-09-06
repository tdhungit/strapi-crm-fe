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
  getCollectionPopulatedList,
  getListLayoutColumns,
} from '../../helpers/views_helper';
import ApiService from '../../services/ApiService';
import CollectionService from '../../services/CollectionService';
import MetadataService from '../../services/MetadataService';
import CollectionDetailDrawer from './components/CollectionDetailDrawer';

export default function CollectionList() {
  // Get the 'name' parameter from the route
  const { name: module } = useParams();
  const ref = useRef<any>(null);

  const [config, setConfig] = useState<any>({});
  const [columns, setColumns] = useState<any>([]);
  const [params, setParams] = useState<any>({});
  const [selectRecordId, setSelectRecordId] = useState<string>('');
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);

  useEffect(() => {
    if (selectRecordId) {
      setIsOpenDrawer(true);
    }
  }, [selectRecordId]);

  useEffect(() => {
    if (module) {
      MetadataService.getCollectionConfigurations(module).then((res) => {
        setConfig(res);
        // get columns
        const cols: any = getListLayoutColumns(res, {
          onClickMainField: (record: any) => {
            setSelectRecordId(record.documentId);
          },
        });
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
        // update columns
        setColumns(cols);
        // reload table
        ref?.current?.reload();
      });
    }
  }, [module]);

  const handleExport = () => {
    if (!module) {
      return;
    }

    // Prepare sort parameters for export
    let sortParams = {};
    if (params.sorter) {
      const sortConfig: any = {};
      Object.keys(params.sorter).forEach((field) => {
        const order = params.sorter[field];
        if (order === 'ascend') {
          sortConfig[field] = 'asc';
        } else if (order === 'descend') {
          sortConfig[field] = 'desc';
        }
      });
      sortParams = sortConfig;
    }

    ApiService.request('get', `/exports/csv/${module}`, {
      filters: params.filters || {},
      sort: sortParams,
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
        request={async (params, sort) => {
          setParams(params);
          return await CollectionService.getTableRequest(module, params, sort, {
            populate: getCollectionPopulatedList(config),
          });
        }}
        pagination={CollectionService.getTablePagination(config)}
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

      {module && selectRecordId && (
        <CollectionDetailDrawer
          open={isOpenDrawer}
          onOpenChange={(open) => {
            setIsOpenDrawer(open);
            if (!open) {
              setSelectRecordId('');
            }
          }}
          id={selectRecordId}
          collectionName={module}
        />
      )}
    </PageContainer>
  );
}
