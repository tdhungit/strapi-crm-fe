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
  type ProColumnType,
} from '@ant-design/pro-components';
import { App, Button, Space } from 'antd';
import { Flex } from 'antd/lib';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageLoading from '../../../components/PageLoading';
import {
  breadcrumbItemRender,
  camelToTitle,
  getCollectionPopulatedList,
  getListLayoutColumns,
  strapiClientErrorMessage,
} from '../../../helpers/views_helper';
import ApiService from '../../../services/ApiService';
import CollectionService from '../../../services/CollectionService';
import MetadataService from '../../../services/MetadataService';
import type { ListLayoutOptions } from '../../../types/layouts';
import CollectionDetailDrawer from './CollectionDetailDrawer';
import CollectionWidgets from './CollectionWidgets';

export default function CollectionListComponent({
  module,
  header,
  extra,
  toolBarRender,
  toolBarRenderExtra,
  recordActionRender,
  hasProfile,
  noEdit,
  updateColumns,
  drawerComponent,
  populate,
  mainField,
}: {
  module: string;
  header?:
    | Partial<PageHeaderProps> & {
        children?: React.ReactNode;
      };
  extra?: React.ReactNode[];
  toolBarRender?: boolean | React.ReactNode[];
  toolBarRenderExtra?: React.ReactNode[];
  recordActionRender?: (dom: React.ReactNode, record: any) => React.ReactNode;
  hasProfile?: boolean;
  noEdit?: boolean;
  updateColumns?: (
    columns: ProColumnType<any>[],
    options?: ListLayoutOptions
  ) => ProColumnType<any>[];
  drawerComponent?: React.ComponentType<any>;
  populate?: string[];
  mainField?: string;
  [key: string]: any;
}) {
  const navigate = useNavigate();
  const { message } = App.useApp();
  const ref = useRef<any>(null);

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

  const layoutOptions: ListLayoutOptions = {
    onClickMainField: (record: any) => {
      setSelectRecordId(record.documentId);
    },
    mainField,
  };

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
      const collectionName = module.replace(/-/g, '_');
      MetadataService.getCollectionConfigurations(collectionName).then(
        (res) => {
          setConfig(res);
          // get columns
          let cols = getListLayoutColumns(res, layoutOptions);
          // add actions column
          const actionRender =
            recordActionRender ||
            ((_dom: React.ReactNode, record: any) => (
              <Space>
                <Link
                  to={`/collections/${module}/detail/${record.documentId}`}
                  className='!text-blue-500'
                >
                  <EyeOutlined />
                </Link>
                {hasProfile && (
                  <Link
                    to={`/collections/${module}/profile/${record.documentId}`}
                    className='!text-cyan-500'
                  >
                    <FundViewOutlined />
                  </Link>
                )}
                {!noEdit && (
                  <Link
                    to={`/collections/${module}/edit/${record.documentId}`}
                    className='!text-orange-500'
                  >
                    <EditOutlined />
                  </Link>
                )}
              </Space>
            ));

          cols.push({
            title: 'Actions',
            key: 'actions',
            search: false,
            render: actionRender,
          });

          // update columns
          if (updateColumns) {
            cols = updateColumns(cols, layoutOptions);
          }

          // save columns
          setColumns(cols);

          // reload table
          ref?.current?.reload();
        }
      );
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

  const defaultHeader: Partial<PageHeaderProps> & {
    children?: React.ReactNode;
  } = {
    title: `${camelToTitle(module || '')}`,
    breadcrumb: {
      items: [
        {
          title: 'Home',
          href: '/home',
        },
        {
          title: camelToTitle(module || ''),
        },
      ],
      itemRender: breadcrumbItemRender,
    },
  };

  let toolBars: any = false;
  if (Array.isArray(toolBarRender)) {
    toolBars = toolBarRender;
  } else if (toolBarRender !== false) {
    toolBars = [
      <Button
        key='create'
        variant='solid'
        color='primary'
        onClick={() => navigate(`/collections/${module}/create`)}
      >
        <PlusCircleFilled /> Create
      </Button>,
      <Button
        key='import'
        variant='solid'
        color='orange'
        onClick={() =>
          navigate(`/imports/${module}?returnUrl=/collections/${module}`)
        }
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
    ];
  }

  if (
    toolBars &&
    toolBars.length > 0 &&
    toolBarRenderExtra &&
    toolBarRenderExtra.length > 0
  ) {
    toolBars = [...toolBars, ...toolBarRenderExtra];
  }

  const DrawerComponent = drawerComponent || CollectionDetailDrawer;

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
                const populateFields = getCollectionPopulatedList(config);
                if (populate) {
                  populateFields.push(...populate);
                }
                const res = await CollectionService.getTableRequest(
                  module,
                  params,
                  sort,
                  {
                    populate: populateFields,
                  },
                  config
                );
                return {
                  data: res.data,
                  success: true,
                  total: res.meta.pagination.total,
                };
              } catch (err: any) {
                console.log(err);
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
            toolBarRender={() => toolBars}
            tableLayout='auto'
            scroll={{ x: 'max-content' }}
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
        <DrawerComponent
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
