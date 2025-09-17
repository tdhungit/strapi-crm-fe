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
  camelToTitle,
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
}: {
  module: string;
  id: string;
  [key: string]: any;
}) {
  const [config, setConfig] = useState<CollectionConfigType>();
  const [columns, setColumns] = useState<any>([]);
  const [tabItems, setTabItems] = useState<TabsProps['items']>([]);
  const [mainField, setMainField] = useState<string>('name');
  const [record, setRecord] = useState<any>(); // TODO: typ]

  useEffect(() => {
    if (module && id) {
      // fetch record
      ApiService.getClient()
        .collection(module)
        .findOne(id, { populate: '*' })
        .then((res) => {
          setRecord(res?.data);

          // layout metadata
          MetadataService.getCollectionConfigurations(module).then((cRes) => {
            setConfig(cRes);
            // columns render
            setColumns(getEditLayoutColumns(cRes));
            // main field
            setMainField(cRes.settings?.mainField || 'name');
            // get tab items
            const panels = getEditLayoutPanels(cRes);
            const newTabItems: TabsProps['items'] = [];
            if (cRes.uid && res?.data?.id) {
              newTabItems.push({
                key: 'logs',
                label: 'Logs',
                children: (
                  <CollectionRecordLog
                    collection={cRes.uid}
                    id={res?.data?.id}
                  />
                ),
              });
            }
            // add panels to tab
            panels.forEach((panel) => {
              newTabItems.push({
                key: panel.name,
                label: camelToTitle(panel.label),
                children: <RecordPanel panel={panel} record={res?.data} />,
              });
            });
            setTabItems(newTabItems);
          });
        });
    }
  }, [module, id]);

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
        },
      }}
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
