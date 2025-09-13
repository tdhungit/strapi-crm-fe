import { CheckOutlined } from '@ant-design/icons';
import { ProTable } from '@ant-design/pro-components';
import { App, Button, Modal } from 'antd';
import { useEffect, useState } from 'react';
import {
  getListLayoutColumns,
  strapiClientErrorMessage,
} from '../../../helpers/views_helper';
import CollectionService from '../../../services/CollectionService';
import MetadataService from '../../../services/MetadataService';

export default function CollectionListModal({
  module,
  open,
  parentCollectionName,
  parentRecord,
  relateField,
  onOpenChange,
  onFinish,
}: {
  module: string;
  open: boolean;
  parentCollectionName?: string;
  parentRecord?: any;
  relateField?: any;
  onOpenChange: (open: boolean) => void;
  onFinish?: (values: any, options: any) => void;
}) {
  const { message } = App.useApp();

  const [config, setConfig] = useState<any>({});
  const [columns, setColumns] = useState<any>([]);

  const onSelectRecord = (record: any) => {
    onFinish?.(record, {
      parentCollectionName: parentCollectionName,
      parentRecord: parentRecord,
      relateField: relateField,
    });
  };

  useEffect(() => {
    if (module) {
      MetadataService.getCollectionConfigurations(module).then((res) => {
        setConfig(res);
        // get columns
        const cols: any = getListLayoutColumns(res);
        // add actions column
        cols.push({
          title: 'Actions',
          key: 'actions',
          search: false,
          render: (record: any) => (
            <div>
              <Button
                onClick={() => onSelectRecord(record)}
                variant='solid'
                color='danger'
                size='small'
              >
                <CheckOutlined />
              </Button>
            </div>
          ),
        });
        // update columns
        setColumns(cols);
      });
    }
  }, [module]);

  return (
    <Modal
      title={module.toUpperCase()}
      open={open}
      onCancel={() => onOpenChange(false)}
      onOk={() => {}}
      width={1000}
    >
      <ProTable
        key={`collection-list-modal-${module}`}
        search={{
          searchText: 'Search',
        }}
        columns={columns}
        request={async (params, sort) => {
          try {
            const res = await CollectionService.getTableRequest(
              module,
              params,
              sort
            );
            return {
              data: res.data,
              success: true,
              total: res.meta.pagination.total,
            };
          } catch (err: any) {
            const errorMessage = strapiClientErrorMessage(err);
            message.error(errorMessage);
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
      />
    </Modal>
  );
}
