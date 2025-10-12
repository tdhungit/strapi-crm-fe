import { EditFilled } from '@ant-design/icons';
import { PageContainer, ProDescriptions } from '@ant-design/pro-components';
import { Button } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageError from '../../../components/PageError';
import PageLoading from '../../../components/PageLoading';
import RecordPanels from '../../../components/panels/RecordPanels';
import {
  breadcrumbItemRender,
  camelToTitle,
  getCollectionPopulatedDetail,
  getEditLayoutColumns,
  getEditLayoutPanels,
} from '../../../helpers/views_helper';
import ApiService from '../../../services/ApiService';
import MetadataService from '../../../services/MetadataService';
import type {
  CollectionConfigType,
  PanelConfigType,
  PanelItemType,
} from '../../../types/layouts';

export default function CollectionDetailComponent({
  module,
  id,
  extra,
  excludePanels,
  hook,
  populate,
  refresh,
  loaded,
  panelConfigs,
}: {
  module: string;
  id: string;
  extra?: React.ReactNode;
  excludePanels?: string[];
  hook?: (record: any) => React.ReactNode;
  populate?: string[];
  refresh?: number;
  loaded?: (record: any) => void;
  panelConfigs?: PanelConfigType[];
  [key: string]: any;
}) {
  const [config, setConfig] = useState<CollectionConfigType>();
  const [columns, setColumns] = useState<any>([]);
  const [panels, setPanels] = useState<any>([]);
  const [record, setRecord] = useState<any>();
  const [error, setError] = useState<any>();
  const [populateFields, setPopulateFields] = useState<string[]>([]);

  const fetchRecord = ({ queryPopulate }: { queryPopulate?: string[] }) => {
    let queryParams = {};
    const populate = queryPopulate || populateFields;
    if (populate.length > 0) {
      queryParams = { populate };
    }
    ApiService.getClient()
      .collection(module)
      .findOne(id, queryParams)
      .then((r) => {
        setRecord(r);
        loaded?.(r.data);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
      });
  };

  useEffect(() => {
    if (module) {
      MetadataService.getCollectionConfigurations(module).then((res) => {
        setConfig(res);

        let queryPopulate = getCollectionPopulatedDetail(res);
        if (populate) {
          queryPopulate = [...queryPopulate, ...populate];
        }

        setPopulateFields(queryPopulate);
        fetchRecord({ queryPopulate });

        // Get Panels
        const pns: PanelItemType[] = getEditLayoutPanels(res);
        const excludeList = excludePanels || [];
        const pnsFiltered = pns.filter((p) => !excludeList.includes(p.module));
        setPanels(pnsFiltered);

        // Edit Layout
        const cols: any = getEditLayoutColumns(res);
        setColumns(cols);
      });
    }
  }, [module]);

  useEffect(() => {
    if (refresh && refresh > 0) {
      fetchRecord({});
    }
  }, [refresh]);

  const defaultActions: React.ReactNode = [
    <Link key={`${module}-edit-${id}`} to={`/collections/${module}/edit/${id}`}>
      <Button variant='solid' color='orange'>
        <EditFilled /> Edit
      </Button>
    </Link>,
  ];

  extra = extra || defaultActions;

  if (!config?.layouts || !record) return <PageLoading />;

  if (!id) return <PageError message='Invalid ID' />;

  if (error) return <PageError message={'Permission denied'} />;

  return (
    <PageContainer
      header={{
        title: config?.settings?.mainField
          ? record?.data[config.settings.mainField]
          : `${module?.toUpperCase()}`,
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
          itemRender: breadcrumbItemRender,
        },
      }}
      extra={extra}
    >
      <div className='w-full bg-white p-4 rounded-lg'>
        {record?.data && columns.length > 0 && (
          <ProDescriptions
            key={`${module}-${id || 0}`}
            title={null}
            column={2}
            bordered
            dataSource={record?.data}
            emptyText='No Data'
            columns={columns}
          />
        )}
      </div>

      {record?.data && hook?.(record)}

      {record?.data && panels.length > 0 && (
        <div className='mt-4'>
          <RecordPanels
            panels={panels}
            record={record?.data}
            panelConfigs={panelConfigs}
          />
        </div>
      )}
    </PageContainer>
  );
}
