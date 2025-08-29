import { ProTable } from '@ant-design/pro-components';
import { useRequest } from 'ahooks';
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

  if (!config?.layouts?.list) return <PageLoading />;

  return (
    <div className='w-full bg-white rounded-lg'>
      <h2 className='font-bold mb-4 uppercase'>{relateModule}</h2>

      <div className='w-full mt-2'>
        {config?.layouts?.list &&
          relateModule &&
          field?.mappedBy &&
          record?.id && (
            <ProTable
              key={`${relateModule}-panel-list`}
              columns={getListLayoutColumns(config)}
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
            />
          )}
      </div>
    </div>
  );
}
