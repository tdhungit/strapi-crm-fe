import {
  EditOutlined,
  EyeOutlined,
  FileExcelOutlined,
  FundViewOutlined,
  PieChartFilled,
  PlusCircleFilled,
  ProfileFilled,
} from '@ant-design/icons';
import {
  PageContainer,
  ProTable,
  type PageHeaderProps,
} from '@ant-design/pro-components';
import { App, Button } from 'antd';
import { Flex } from 'antd/lib';
import { useEffect, useRef, useState } from 'react';
import PageLoading from '../../../components/PageLoading';
import {
  capitalizeFirstLetter,
  getCollectionPopulatedList,
  getListLayoutColumns,
  strapiClientErrorMessage,
} from '../../../helpers/views_helper';
import ApiService from '../../../services/ApiService';
import CollectionService from '../../../services/CollectionService';
import MetadataService from '../../../services/MetadataService';
import CollectionDetailDrawer from './CollectionDetailDrawer';
import CollectionWidgets from './CollectionWidgets';

export default function CollectionListComponent({
  module,
  header,
  extra,
}: {
  module: string;
  header?:
    | Partial<PageHeaderProps> & {
        children?: React.ReactNode;
      };
  [key: string]: any;
  extra?: React.ReactNode[];
}) {
  const { message } = App.useApp();
  const ref = useRef<any>(null);

  const defaultHeader: Partial<PageHeaderProps> & {
    children?: React.ReactNode;
  } = {
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
  };

  const [config, setConfig] = useState<any>({});
  const [columns, setColumns] = useState<any>([]);
  const [params, setParams] = useState<any>({});
  const [selectRecordId, setSelectRecordId] = useState<string>('');
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    // Load collapsed state from localStorage, default to false (expanded)
    const saved = localStorage.getItem(`collection-${module}-panel-collapsed`);
    return saved ? JSON.parse(saved) : false;
  });

  // Save collapsed state to localStorage whenever it changes
  const handleCollapse = (collapsed: boolean) => {
    setIsCollapsed(collapsed);
    localStorage.setItem(
      `collection-${module}-panel-collapsed`,
      JSON.stringify(collapsed)
    );
  };

  // Toggle the widget panel
  const toggleWidgetPanel = () => {
    const newCollapsed = !isCollapsed;
    handleCollapse(newCollapsed);
  };

  // Update localStorage key when module changes
  useEffect(() => {
    const saved = localStorage.getItem(`collection-${module}-panel-collapsed`);
    setIsCollapsed(saved ? JSON.parse(saved) : false);
  }, [module]);

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
        const cols = getListLayoutColumns(res, {
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
                href={`/collections/${module}/profile/${record.documentId}`}
                className='inline-block ml-2'
              >
                <FundViewOutlined />
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
      header={header || defaultHeader}
      extra={[
        ...(extra || []),
        <Button
          key='toggle-widgets'
          type='default'
          onClick={toggleWidgetPanel}
          title={isCollapsed ? 'Show Widgets' : 'Hide Widgets'}
        >
          {isCollapsed ? <ProfileFilled /> : <PieChartFilled />}
        </Button>,
      ]}
    >
      <Flex gap={0}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <ProTable
            key={`${module}-list`}
            columns={columns}
            rowKey='documentId'
            actionRef={ref}
            search={{
              searchText: 'Search',
              labelWidth: 'auto',
              span: 12,
            }}
            request={async (params, sort) => {
              setParams(params);
              try {
                const res = await CollectionService.getTableRequest(
                  module,
                  params,
                  sort,
                  {
                    populate: getCollectionPopulatedList(config),
                  },
                  config
                );
                return {
                  data: res.data,
                  success: true,
                  total: res.meta.pagination.total,
                };
              } catch (err: any) {
                const messageError = strapiClientErrorMessage(err);
                message.error(messageError);
                return {
                  data: [],
                  success: false,
                  total: 0,
                };
              }
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
        </div>

        {!isCollapsed && (
          <div
            className='w-[300px]'
            style={{
              transition: 'all 0.3s ease',
            }}
          >
            {module && <CollectionWidgets module={module} />}
          </div>
        )}
      </Flex>

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
