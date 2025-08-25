import { ProDescriptions } from '@ant-design/pro-components';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DetailView from '../../components/fields/DetailView';
import PageError from '../../components/PageError';
import PageLoading from '../../components/PageLoading';
import ApiService from '../../services/ApiService';
import MetadataService from '../../services/MetadataService';

export default function CollectionDetail() {
  const { name: module, id } = useParams();

  const [config, setConfig] = useState<any>({});
  const [columns, setColumns] = useState<any>([]);

  useEffect(() => {
    if (module) {
      MetadataService.getCollectionConfigurations(module).then((res: any) => {
        setConfig(res);

        const cols: any = [];
        res.layouts.edit.forEach((line: any[]) => {
          line.forEach((item: any) => {
            const field = item.name;
            const fieldOptions = res.fields?.[field] || {};
            const metadatas = res.metadatas?.[field]?.edit || {};
            metadatas.type = fieldOptions.type || 'string';
            metadatas.name = field;
            cols.push({
              title: metadatas.label || field,
              dataIndex: field,
              valueType: undefined,
              render: (_text: any, record: any) => (
                <DetailView
                  item={{ ...fieldOptions, ...metadatas, options: fieldOptions }}
                  data={record}
                />
              ),
            });
          });
        });

        setColumns(cols);
      });
    }
  }, [module]);

  if (!config?.layouts) return <PageLoading />;

  if (!id) return <PageError message='Invalid ID' />;

  return (
    <div>
      <h1 className='text-2xl mb-4 uppercase'>{`Detail ${module}`}</h1>

      <div>
        {columns.length > 0 && (
          <ProDescriptions
            title={null}
            request={async () => {
              if (!module || !id) {
                return {
                  success: false,
                  data: {},
                };
              }

              const res = await ApiService.getClient()
                .collection(module)
                .findOne(id, { populate: '*' });

              return Promise.resolve({
                success: true,
                data: res?.data || {},
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
