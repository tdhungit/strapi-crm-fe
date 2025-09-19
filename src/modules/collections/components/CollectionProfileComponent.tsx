import {
  PageContainer,
  ProCard,
  ProDescriptions,
} from '@ant-design/pro-components';
import { Avatar, Flex, Tabs, type TabsProps } from 'antd';
import { useEffect, useState } from 'react';
import PageError from '../../../components/PageError';
import PageLoading from '../../../components/PageLoading';
import RecordPanel from '../../../components/panels/RecordPanel';
import {
  breadcrumbItemRender,
  camelToTitle,
  getCollectionPopulatedDetail,
  getEditLayoutColumns,
  getEditLayoutPanels,
} from '../../../helpers/views_helper';
import ApiService from '../../../services/ApiService';
import MetadataService from '../../../services/MetadataService';
import type { CollectionConfigType } from '../../../types/layouts';
import CollectionRecordLog from '../components/CollectionRecordLog';

export default function CollectionProfileComponent({
  module,
  id,
  extra,
  excludePanels,
  beforeTabs,
  afterTabs,
  onChange,
  populate,
}: {
  module: string;
  id: string;
  extra?: React.ReactNode;
  excludePanels?: string[];
  beforeTabs?: (record: any) => TabsProps['items'] | undefined;
  afterTabs?: (record: any) => TabsProps['items'] | undefined;
  populate?: string[];
  onChange?: (record: any) => void;
  [key: string]: any;
}) {
  const [config, setConfig] = useState<CollectionConfigType>();
  const [columns, setColumns] = useState<any>([]);
  const [tabItems, setTabItems] = useState<TabsProps['items']>([]);
  const [mainField, setMainField] = useState<string>('name');
  const [record, setRecord] = useState<any>();
  const [populateFields, setPopulateFields] = useState<string[]>([]);

  const fetchRecord = ({ queryPopulate }: { queryPopulate?: string[] }) => {
    ApiService.getClient()
      .collection(module)
      .findOne(id, { populate: queryPopulate || populateFields })
      .then((r) => {
        setRecord(r?.data);
        onChange?.(r?.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    if (module && id) {
      // layout metadata
      MetadataService.getCollectionConfigurations(module).then((cRes) => {
        setConfig(cRes);
        // columns render
        setColumns(getEditLayoutColumns(cRes));
        // main field
        setMainField(cRes.settings?.mainField || 'name');
      });
    }
  }, [module, id]);

  useEffect(() => {
    if (config?.layouts?.edit) {
      let queryPopulate = getCollectionPopulatedDetail(config);
      if (populate) {
        queryPopulate = [...queryPopulate, ...populate];
      }
      // fetch record
      fetchRecord({ queryPopulate });
      setPopulateFields(queryPopulate);
    }
  }, [config]);

  useEffect(() => {
    if (record?.id && config?.layouts?.edit) {
      // get tab items
      const excludeList = excludePanels || [];
      const pns = getEditLayoutPanels(config);
      const panels = pns.filter((p) => !excludeList.includes(p.module));

      const newTabItems: TabsProps['items'] = [];
      if (config.uid && record?.id) {
        newTabItems.push({
          key: 'logs',
          label: 'Logs',
          children: (
            <CollectionRecordLog collection={config.uid} id={record?.id} />
          ),
        });
      }
      // add panels to tab
      panels.forEach((panel) => {
        newTabItems.push({
          key: panel.name,
          label: camelToTitle(panel.label),
          children: <RecordPanel panel={panel} record={record} />,
        });
      });

      if (beforeTabs) {
        const beforeItems = beforeTabs(record) || [];
        newTabItems.unshift(...beforeItems);
      }

      if (afterTabs) {
        const afterItems = afterTabs(record) || [];
        newTabItems.push(...afterItems);
      }

      setTabItems(newTabItems);
    }
  }, [record, config]);

  const apiModule = module.replace(/_/g, '-');

  if (!id) return <PageError message='Invalid ID' />;

  if (!config?.layouts) return <PageLoading />;

  return (
    <PageContainer
      header={{
        breadcrumb: {
          items: [
            {
              title: 'Home',
              href: '/home',
            },
            {
              title: camelToTitle(module || ''),
              href: `/collections/${apiModule}`,
            },
            {
              title: camelToTitle('Detail'),
              href: `/collections/${apiModule}/detail/${id}`,
            },
          ],
          itemRender: breadcrumbItemRender,
        },
      }}
      extra={extra}
    >
      <ProCard split='vertical'>
        <ProCard
          title={
            <Flex gap={16} align='center'>
              <Avatar>
                {record?.[mainField]
                  ? record[mainField].charAt(0)
                  : module?.charAt(0)}
              </Avatar>
              <strong>{record?.[mainField] || module || ''}</strong>
            </Flex>
          }
          colSpan='260px'
          headerBordered
        >
          {record?.id && columns.length > 0 && (
            <ProDescriptions
              key={`profile-${module}-${id || 0}`}
              title={null}
              column={1}
              columns={columns}
              dataSource={record}
            />
          )}
        </ProCard>
        <ProCard bodyStyle={{ padding: '0 16px' }}>
          <Tabs
            defaultActiveKey='1'
            items={tabItems}
            onChange={(activeKey) => {
              console.log(activeKey);
            }}
          />
        </ProCard>
      </ProCard>
    </PageContainer>
  );
}
