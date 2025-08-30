import {
  DeleteFilled,
  EditFilled,
  EyeFilled,
  PlusCircleOutlined,
} from '@ant-design/icons';
import { ProTable } from '@ant-design/pro-components';
import { useRequest } from 'ahooks';
import { Button } from 'antd';
import { getListLayoutColumns } from '../../helpers/views_helper';
import ApiService from '../../services/ApiService';
import MetadataService from '../../services/MetadataService';
import PageLoading from '../PageLoading';

export default function OneToManyPanel({
  relateModule,
  field,
  record,
}: {
  relateModule: string;
  field: any;
  record: any;
}) {
  const { data: config } = useRequest(() => {
    return MetadataService.getCollectionConfigurations(relateModule);
  });

  const columns = getListLayoutColumns(config);
  columns.push({
    title: 'Actions',
    dataIndex: 'actions',
    valueType: 'option',
    render: (_text: any, record: any) => [
      <a
        key={`panel-${relateModule}-btn-view`}
        href={`/collections/${relateModule}/detail/${record.id}`}
      >
        <EyeFilled />
      </a>,
      <a
        key={`panel-${relateModule}-btn-edit`}
        href={`/collections/${relateModule}/edit/${record.id}`}
      >
        <EditFilled />
      </a>,
      <a key={`panel-${relateModule}-btn-delete`} onClick={() => {}}>
        <DeleteFilled />
      </a>,
    ],
  });

  if (!config?.layouts?.list) return <PageLoading />;

  return (
    <div className='w-full'>
      {config?.layouts?.list &&
        relateModule &&
        field?.mappedBy &&
        record?.id && (
          <ProTable
            key={`${relateModule}-panel-list`}
            columns={columns}
            search={{
              searchText: 'Search',
            }}
            request={async (params) => {
              // Handle search parameters
              const searchParams: any = {
                filters: {
                  [field.mappedBy]: { id: record.id },
                },
              };
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
                .collection(relateModule)
                .find({
                  ...searchParams,
                  pagination: { pageSize: config?.settings?.pageSize || 10 },
                });

              return {
                data: collections.data || [],
                total: collections.meta.pagination?.total || 0,
              };
            }}
            rowKey='documentId'
            pagination={{
              defaultPageSize: config.settings?.pageSize || 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `Showing ${range[0]}-${range[1]} of ${total} items`,
            }}
            options={false}
            toolBarRender={() => [
              <Button key={`panel-${relateModule}-btn-add`} type='primary'>
                <PlusCircleOutlined /> Add
              </Button>,
            ]}
          />
        )}
    </div>
  );
}
