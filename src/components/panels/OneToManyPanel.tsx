import {
  DeleteFilled,
  EditFilled,
  EyeFilled,
  PlusCircleOutlined,
  SelectOutlined,
} from '@ant-design/icons';
import { ProTable } from '@ant-design/pro-components';
import { useRequest } from 'ahooks';
import { Button } from 'antd';
import { useState } from 'react';
import { getListLayoutColumns } from '../../helpers/views_helper';
import CollectionListModal from '../../modules/collections/components/CollectionListModal';
import CollectionService from '../../services/CollectionService';
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
  const [openSelectModal, setOpenSelectModal] = useState(false);

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
    <>
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
              request={async (params, sort) => {
                return await CollectionService.getTableRequest(
                  relateModule,
                  params,
                  sort,
                  {
                    filters: {
                      [field.mappedBy]: record.id,
                    },
                  }
                );
              }}
              rowKey='documentId'
              pagination={CollectionService.getTablePagination(config)}
              options={false}
              toolBarRender={() => [
                <Button key={`panel-${relateModule}-btn-add`} type='primary'>
                  <PlusCircleOutlined /> Add
                </Button>,
                <Button
                  key={`panel-${relateModule}-btn-select`}
                  variant='solid'
                  color='orange'
                  onClick={() => setOpenSelectModal(true)}
                >
                  <SelectOutlined /> Select
                </Button>,
              ]}
            />
          )}
      </div>

      <CollectionListModal
        module={relateModule}
        open={openSelectModal}
        onOpenChange={setOpenSelectModal}
      />
    </>
  );
}
