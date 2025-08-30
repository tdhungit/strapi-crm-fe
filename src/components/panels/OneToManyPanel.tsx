import {
  DeleteFilled,
  EditFilled,
  EyeFilled,
  PlusCircleOutlined,
  SelectOutlined,
} from '@ant-design/icons';
import { ProTable, type ActionType } from '@ant-design/pro-components';
import { useRequest } from 'ahooks';
import { App, Button } from 'antd';
import { useRef, useState } from 'react';
import { getListLayoutColumns } from '../../helpers/views_helper';
import CollectionFormModal from '../../modules/collections/components/CollectionFormModal';
import CollectionListModal from '../../modules/collections/components/CollectionListModal';
import CollectionService from '../../services/CollectionService';
import MetadataService from '../../services/MetadataService';
import PageLoading from '../PageLoading';

export default function OneToManyPanel({
  module,
  relateModule,
  field,
  record,
}: {
  module: string;
  relateModule: string;
  field: any;
  record: any;
}) {
  const { message, notification, modal } = App.useApp();
  const ref = useRef<ActionType>(null);

  const [openSelectModal, setOpenSelectModal] = useState(false);
  const [openFormModal, setOpenFormModal] = useState(false);

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
      <a
        key={`panel-${relateModule}-btn-delete`}
        onClick={() => {
          modal.confirm({
            title: 'Confirm Delete',
            content:
              'Are you sure you want to delete this record? This action cannot be undone.',
            okText: 'Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: async () => {
              message.loading('Saving...', 0);
              try {
                await CollectionService.removeRelationRecord(
                  relateModule,
                  field,
                  record
                );
                message.destroy();
                ref?.current?.reload();
                notification.success({
                  message: 'Deleted successfully',
                });
              } catch (error: any) {
                message.destroy();
                notification.error({
                  message:
                    error?.response?.data?.error?.message || 'Failed to delete',
                });
              }
            },
          });
        }}
      >
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
              actionRef={ref}
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
                <Button
                  key={`panel-${relateModule}-btn-add`}
                  variant='solid'
                  color='green'
                  onClick={() => {
                    setOpenFormModal(true);
                  }}
                >
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

      {record?.id && (
        <>
          <CollectionListModal
            parentCollectionName={module}
            module={relateModule}
            open={openSelectModal}
            parentRecord={record}
            relateField={field}
            onOpenChange={setOpenSelectModal}
            onFinish={async (selectedRecord: any) => {
              message.loading('Saving...', 0);
              try {
                await CollectionService.addRelationRecord(
                  relateModule,
                  field,
                  selectedRecord,
                  record.id
                );
                ref?.current?.reload();
                message.destroy();
                setOpenSelectModal(false);
                notification.success({
                  message: 'Record added successfully',
                });
              } catch (error: any) {
                message.destroy();
                notification.error({
                  message:
                    error?.response?.data?.error?.message || 'Failed to save',
                });
              }
            }}
          />

          <CollectionFormModal
            parentCollectionName={module}
            collectionName={relateModule}
            open={openFormModal}
            parentRecord={record}
            relateField={field}
            onOpenChange={setOpenFormModal}
            onFinish={() => {}}
          />
        </>
      )}
    </>
  );
}
