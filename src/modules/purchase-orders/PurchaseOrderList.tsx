import { FileExcelOutlined, PlusCircleFilled } from '@ant-design/icons';
import { App, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import CollectionListComponent from '../collections/components/CollectionListComponent';

export default function PurchaseOrderList() {
  const navigate = useNavigate();
  const { message } = App.useApp();

  return (
    <CollectionListComponent
      module='purchase-orders'
      toolBarRender={[
        <Button
          key='create'
          variant='solid'
          color='primary'
          onClick={() => navigate(`/collections/purchase-orders/create`)}
        >
          <PlusCircleFilled /> Create
        </Button>,
        <Button
          key='import'
          variant='solid'
          color='orange'
          onClick={() => {
            message.info('Import is not implemented yet');
          }}
        >
          <FileExcelOutlined /> Import
        </Button>,
      ]}
    />
  );
}
