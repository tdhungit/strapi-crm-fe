import { CheckOutlined } from '@ant-design/icons';
import { ProTable } from '@ant-design/pro-components';
import { Button, Modal } from 'antd';
import { useEffect, useState } from 'react';
import { getListLayoutColumns } from '../../../helpers/views_helper';
import CollectionService from '../../../services/CollectionService';
import MetadataService from '../../../services/MetadataService';

export default function CollectionListModal({
  module,
  open,
  onOpenChange,
}: {
  module: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [config, setConfig] = useState<any>({});
  const [columns, setColumns] = useState<any>([]);

  const onSelectRecord = (record: any) => {
    console.log(record);
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
          return await CollectionService.getTableRequest(module, params, sort);
        }}
        rowKey='documentId'
        pagination={CollectionService.getTablePagination(config)}
        options={false}
      />
    </Modal>
  );
}
