import { ProDescriptions } from '@ant-design/pro-components';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PageError from '../../components/PageError';
import PageLoading from '../../components/PageLoading';
import { getEditLayoutColumns } from '../../helpers/views_helper';
import ApiService from '../../services/ApiService';
import MetadataService from '../../services/MetadataService';

export default function UserDetail() {
  const { id } = useParams<{ id?: string }>();

  const [title, setTitle] = useState<string>('');
  const [config, setConfig] = useState<any>({});
  const [columns, setColumns] = useState<any>([]);

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
    <div>
      <h1 className='text-2xl mb-4'>{title ? title : 'User Detail'}</h1>

      <div className='w-full bg-white mt-4 p-4 rounded-lg'>
        {columns.length > 0 && (
          <ProDescriptions
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
                setTitle(res?.username);
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
    </div>
  );
}
