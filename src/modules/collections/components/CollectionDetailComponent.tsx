import { EditFilled } from '@ant-design/icons';
import { PageContainer, ProDescriptions } from '@ant-design/pro-components';
import { Button } from 'antd';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageError from '../../../components/PageError';
import PageLoading from '../../../components/PageLoading';
import RecordPanels from '../../../components/panels/RecordPanels';
import {
  camelToTitle,
  getEditLayoutColumns,
  getEditLayoutPanels,
} from '../../../helpers/views_helper';
import ApiService from '../../../services/ApiService';
import MetadataService from '../../../services/MetadataService';
import type { CollectionConfigType } from '../../../types/layouts';

export default function CollectionDetailComponent({
  module,
  id,
}: {
  module: string;
  id: string;
  [key: string]: any;
}) {
  const [title, setTitle] = useState<string>('');
  const [record, setRecord] = useState<any>({});
  const [config, setConfig] = useState<CollectionConfigType>();
  const [columns, setColumns] = useState<any>([]);
  const [panels, setPanels] = useState<any>([]);
  const [errorPage, setErrorPage] = useState<any>(false);

  useEffect(() => {
    if (module) {
      MetadataService.getCollectionConfigurations(module).then((res) => {
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

  if (errorPage) return <PageError message={'Permission denied'} />;

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
              title: camelToTitle(module || ''),
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
      extra={[
        <Link
          key={`${module}-edit-${id}`}
          to={`/collections/${module}/edit/${id}`}
        >
          <Button variant='solid' color='orange'>
            <EditFilled /> Edit
          </Button>
        </Link>,
      ]}
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

              try {
                const res = await ApiService.getClient()
                  .collection(module)
                  .findOne(id, { populate: '*' });
                setRecord(res?.data || {});

                if (res?.data[config.settings?.mainField]) {
                  setTitle(camelToTitle(res?.data[config.settings?.mainField]));
                }

                return Promise.resolve({
                  success: true,
                  data: res?.data || {},
                });
              } catch (error: any) {
                setErrorPage(true);
                console.log(error.message);
                return {
                  success: false,
                  data: {},
                };
              }
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
