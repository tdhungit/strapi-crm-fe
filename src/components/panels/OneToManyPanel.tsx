import {
  DeleteFilled,
  EditFilled,
  EyeFilled,
  PlusCircleOutlined,
  SelectOutlined,
} from '@ant-design/icons';
import {
  ProTable,
  type ActionType,
  type ProColumns,
} from '@ant-design/pro-components';
import { useRequest } from 'ahooks';
import { App, Button } from 'antd';
import { useRef, useState } from 'react';
import {
  getCollectionPopulatedList,
  getListLayoutColumns,
} from '../../helpers/views_helper';
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

  let columns: ProColumns<any>[] = [];
  if (config) {
    columns = getListLayoutColumns(config);
    columns.push({
      title: 'Actions',
      dataIndex: 'actions',
      valueType: 'option',
      render: (_text: any, selectedRecord: any) => [
        <a
          key={`panel-${relateModule}-btn-view`}
          href={`/collections/${relateModule}/detail/${selectedRecord.documentId}`}
        >
          <EyeFilled />
        </a>,
        <a
          key={`panel-${relateModule}-btn-edit`}
          href={`/collections/${relateModule}/edit/${selectedRecord.documentId}`}
        >
          <EditFilled />
        </a>,
        <a
          href='javascript:void(0)'
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
                    field.mappedBy,
                    selectedRecord,
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
                      error?.response?.data?.error?.message ||
                      'Failed to delete',
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
  }

  const saveSingleSelect = async (selectedRecord: any) => {
    message.loading('Saving...', 0);
    try {
      await CollectionService.addRelationRecord(
        relateModule,
        field.mappedBy,
        selectedRecord,
        record
      );
      ref?.current?.reload();
      message.destroy();
      setOpenSelectModal(false);
      setOpenFormModal(false);
      notification.success({
        message: 'Record added successfully',
      });
    } catch (error: any) {
      message.destroy();
      notification.error({
        message: error?.response?.data?.error?.message || 'Failed to save',
      });
    }
  };

  const saveMultipleSelect = async (selectedRecordIds: any[]) => {
    message.loading('Saving...', 0);
    try {
      await CollectionService.addRelationRecords(
        relateModule,
        field.mappedBy,
        record.id,
        selectedRecordIds as number[]
      );
      ref?.current?.reload();
      message.destroy();
      setOpenSelectModal(false);
      setOpenFormModal(false);
      notification.success({
        message: 'Record added successfully',
      });
    } catch (error: any) {
      message.destroy();
      notification.error({
        message: error?.response?.data?.error?.message || 'Failed to save',
      });
    }
  };

  const onSelectedRecord = async (selectedRecord: any, options: any) => {
    if (options?.multiple) {
      await saveMultipleSelect(selectedRecord);
    } else {
      await saveSingleSelect(selectedRecord);
    }
  };

  if (!config?.layouts?.list) return <PageLoading />;

  return (
    <>
      <div className='w-full'>
        {columns &&
          config?.layouts?.list &&
          relateModule &&
          field?.mappedBy &&
          record?.id && (
            <ProTable
              key={`${relateModule}-panel-list`}
              actionRef={ref}
              columns={columns}
              search={{
                searchText: 'Search',
                labelWidth: 'auto',
                span: 12,
              }}
              request={async (params, sort) => {
                const apiModule = relateModule.replace(/_/g, '-');
                try {
                  const res = await CollectionService.getTableRequest(
                    apiModule,
                    params,
                    sort,
                    {
                      filters: {
                        [field.mappedBy]: record.id,
                      },
                      populate: getCollectionPopulatedList(config),
                    },
                    config
                  );
                  return {
                    data: res.data,
                    success: true,
                    total: res.meta.pagination.total,
                  };
                } catch (error: any) {
                  notification.error({
                    message:
                      error?.response?.data?.error?.message || 'Failed to load',
                  });
                  return {
                    data: [],
                    success: false,
                    total: 0,
                  };
                }
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
            onFinish={onSelectedRecord}
            defaultConfig={config}
          />

          <CollectionFormModal
            parentCollectionName={module}
            collectionName={relateModule}
            open={openFormModal}
            parentRecord={record}
            relateField={field}
            onOpenChange={setOpenFormModal}
            onFinish={(values: any) =>
              onSelectedRecord(values, { multiple: false })
            }
            defaultConfig={config}
          />
        </>
      )}
    </>
  );
}
