import { PlusOutlined } from '@ant-design/icons';
import { ProTable, type ActionType } from '@ant-design/pro-components';
import { App, Button, Modal } from 'antd';
import { useEffect, useRef, useState } from 'react';
import {
  camelToTitle,
  getCollectionPopulatedList,
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
  defaultConfig,
  single,
}: {
  module: string;
  open: boolean;
  parentCollectionName?: string;
  parentRecord?: any;
  relateField?: any;
  defaultConfig?: any;
  single?: boolean;
  onOpenChange: (open: boolean) => void;
  onFinish?: (values: any, options: any) => void;
}) {
  const { message } = App.useApp();
  const actionRef = useRef<ActionType>(null);

  const [config, setConfig] = useState<any>({});
  const [columns, setColumns] = useState<any>([]);
  const [selectedIds, setSelectedIds] = useState<any>([]);

  const onSelectRecord = (record: any) => {
    onFinish?.(record, {
      parentCollectionName: parentCollectionName,
      parentRecord: parentRecord,
      relateField: relateField,
      multiple: false,
    });
    setSelectedIds([]);
    onOpenChange(false);
  };

  const handleSelectRecord = (record: any) => {
    onSelectRecord(record);
  };

  const handleFinish = () => {
    onFinish?.(selectedIds, {
      parentCollectionName: parentCollectionName,
      parentRecord: parentRecord,
      relateField: relateField,
      multiple: true,
    });
    setSelectedIds([]);
    onOpenChange(false);
  };

  const getColumns = async (module: string, newConfig?: any) => {
    let currentConfig: any;
    if (newConfig) {
      currentConfig = newConfig;
    } else {
      const res = await MetadataService.getCollectionConfigurations(module);
      currentConfig = res;
    }

    const cols: any = getListLayoutColumns(currentConfig);
    // action
    cols.push({
      title: 'Actions',
      key: 'actions',
      search: false,
      render: (record: any) => (
        <div>
          <Button
            onClick={() => handleSelectRecord(record)}
            variant='solid'
            color='cyan'
            size='small'
          >
            <PlusOutlined />
          </Button>
        </div>
      ),
    });

    return {
      config: currentConfig,
      columns: cols,
    };
  };

  useEffect(() => {
    if (module) {
      getColumns(module, defaultConfig).then((res) => {
        setConfig(res.config);
        setColumns(res.columns);
      });
    }
  }, [module, defaultConfig]);

  return (
    <Modal
      title={camelToTitle(module)}
      open={open}
      onCancel={() => onOpenChange(false)}
      onOk={() => handleFinish()}
      width={1000}
    >
      <ProTable
        key={`collection-list-modal-${module}`}
        actionRef={actionRef}
        search={{
          searchText: 'Search',
        }}
        columns={columns}
        request={async (params, sort) => {
          try {
            const res = await CollectionService.getTableRequest(
              module,
              params,
              sort,
              {
                populate: getCollectionPopulatedList(config),
              },
              config
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
        rowKey='id'
        pagination={CollectionService.getTablePagination(config)}
        options={false}
        tableLayout='auto'
        scroll={{ x: 'max-content' }}
        rowSelection={
          single
            ? false
            : {
                // selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
                selectedRowKeys: selectedIds,
                preserveSelectedRowKeys: true,
                onChange: (selectedRowKeys: any) => {
                  setSelectedIds(selectedRowKeys);
                },
              }
        }
      />
    </Modal>
  );
}
