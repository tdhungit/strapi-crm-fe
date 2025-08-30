import { PageContainer, ProDescriptions } from '@ant-design/pro-components';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PageError from '../../components/PageError';
import PageLoading from '../../components/PageLoading';
import { getEditLayoutColumns } from '../../helpers/views_helper';
import ApiService from '../../services/ApiService';
import MetadataService from '../../services/MetadataService';

export default function UserDetail() {
  const { id } = useParams<{ id?: string }>();

  const [config, setConfig] = useState<any>({});
  const [columns, setColumns] = useState<any>([]);
  const [record, setRecord] = useState<any>({});

  useEffect(() => {
    MetadataService.getCollectionConfigurations('users').then((res) => {
      setConfig(res);
      const cols: any = getEditLayoutColumns(res);
      setColumns(cols);
    });
  }, []);

  if (!id) return <PageError message='Invalid ID' />;

  if (!config?.layouts) return <PageLoading />;

  return (
    <PageContainer
      header={{
        title: record?.username || 'User Detail',
        breadcrumb: {
          routes: [
            {
              href: '/users',
              breadcrumbName: 'Users',
            },
            {
              href: `/users/edit/${id}`,
              breadcrumbName: 'User Edit',
            },
            {
              breadcrumbName: 'User Detail',
            },
          ],
        },
      }}
    >
      <div className='w-full bg-white p-4 rounded-lg'>
        {columns.length > 0 && (
          <ProDescriptions
            key={`user-${id || 0}`}
            title={null}
            column={2}
            bordered
            request={async () => {
              if (!id) {
                return {
                  success: false,
                  data: {},
                };
              }

              const res: any = await ApiService.getClient()
                .collection('users')
                .findOne(id, { populate: '*' });

              if (res?.username) {
                setRecord(res);
              }

              return Promise.resolve({
                success: true,
                data: res || {},
              });
            }}
            emptyText='No Data'
            columns={columns}
          />
        )}
      </div>
    </PageContainer>
  );
}
