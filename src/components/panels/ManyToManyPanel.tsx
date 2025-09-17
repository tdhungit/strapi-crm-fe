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
import { App, Button } from 'antd';
import { useEffect, useRef, useState } from 'react';
import {
  getCollectionPopulatedList,
  getListLayoutColumns,
} from '../../helpers/views_helper';
import CollectionFormModal from '../../modules/collections/components/CollectionFormModal';
import CollectionListModal from '../../modules/collections/components/CollectionListModal';
import CollectionService from '../../services/CollectionService';
import MetadataService from '../../services/MetadataService';
import PageLoading from '../PageLoading';

export default function ManyToManyPanel({
  module,
  record,
  relateModule,
  field,
}: {
  module: string;
  record: any;
  relateModule: string;
  field: any;
}) {
  const { message, notification, modal } = App.useApp();
  const ref = useRef<ActionType>(null);

  const [openSelectModal, setOpenSelectModal] = useState(false);
  const [openFormModal, setOpenFormModal] = useState(false);
  const [config, setConfig] = useState<any>([]);
  const [columns, setColumns] = useState<any>([]);

  const relateField = field?.inversedBy || field?.mappedBy;
  const apiRelateModule = relateModule.replace(/_/g, '-');

  useEffect(() => {
    if (relateModule) {
      MetadataService.getCollectionConfigurations(relateModule).then((res) => {
        if (res) {
          const columns: ProColumns<any>[] = getListLayoutColumns(res);
          columns.push({
            title: 'Actions',
            dataIndex: 'actions',
            valueType: 'option',
            render: (_text: any, selectedRecord: any) => [
              <a
                key={`panel-${relateModule}-btn-view`}
                href={`/collections/${apiRelateModule}/detail/${selectedRecord.documentId}`}
              >
                <EyeFilled />
              </a>,
              <a
                key={`panel-${relateModule}-btn-edit`}
                href={`/collections/${apiRelateModule}/edit/${selectedRecord.documentId}`}
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
                          relateField,
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
          setColumns(columns);
          setConfig(res);
        }
      });
    }
  }, [relateModule]);

  const saveSingleSelect = async (selectedRecord: any) => {
    message.loading('Saving...', 0);
    try {
      await CollectionService.addRelationRecord(
        relateModule,
        relateField,
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
        relateField,
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

  if (columns?.length === 0) return <PageLoading />;

  return (
    <>
      <div className='w-full'>
        {columns && relateModule && relateField && record?.id && (
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
              const apiModule = relateModule.replace(/-/g, '_');
              try {
                const res = await CollectionService.getTableRequest(
                  apiModule,
                  params,
                  sort,
                  {
                    filters: {
                      [relateField]: {
                        id: record.id,
                      },
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
            onFinish={(selectedRecord: any) => {
              onSelectedRecord(selectedRecord, {
                multiple: false,
              });
            }}
            defaultConfig={config}
          />
        </>
      )}
    </>
  );
}
