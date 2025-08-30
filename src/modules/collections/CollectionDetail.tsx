import { PageContainer, ProDescriptions } from '@ant-design/pro-components';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PageError from '../../components/PageError';
import PageLoading from '../../components/PageLoading';
import RecordPanels from '../../components/panels/RecordPanels';
import {
  capitalizeFirstLetter,
  getEditLayoutColumns,
  getEditLayoutPanels,
} from '../../helpers/views_helper';
import ApiService from '../../services/ApiService';
import MetadataService from '../../services/MetadataService';

export default function CollectionDetail() {
  const { name: module, id } = useParams();

  const [title, setTitle] = useState<string>('');
  const [record, setRecord] = useState<any>({});
  const [config, setConfig] = useState<any>({});
  const [columns, setColumns] = useState<any>([]);
  const [panels, setPanels] = useState<any>([]);

  useEffect(() => {
    if (module) {
      MetadataService.getCollectionConfigurations(module).then((res: any) => {
        setConfig(res);
        // Get Panels
        const pns: any = getEditLayoutPanels(res);
        setPanels(pns);
        // Edit Layout
        const cols: any = getEditLayoutColumns(res);
        setColumns(cols);
      });
    }
  }, [module]);

  if (!config?.layouts) return <PageLoading />;

  if (!id) return <PageError message='Invalid ID' />;

  return (
    <PageContainer
      header={{
        title: title || `${module?.toUpperCase()}`,
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
            {
              title: 'Edit',
              href: `/collections/${module}/edit/${id}`,
            },
            {
              title: 'Detail',
            },
          ],
        },
      }}
    >
      <div className='w-full bg-white p-4 rounded-lg'>
        {columns.length > 0 && (
          <ProDescriptions
            key={`${module}-${id || 0}`}
            title={null}
            column={2}
            bordered
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
              setRecord(res?.data || {});

              if (res?.data[config.settings?.mainField]) {
                setTitle(res?.data[config.settings?.mainField]);
              }

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

      {panels.length > 0 && (
        <div className='mt-4'>
          <RecordPanels panels={panels} record={record} />
        </div>
      )}
    </PageContainer>
  );
}
