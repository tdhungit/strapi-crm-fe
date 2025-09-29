import {
  EditOutlined,
  EyeOutlined,
  FileExcelOutlined,
  PlusCircleFilled,
} from '@ant-design/icons';
import { App, Button, Space } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import CollectionListComponent from '../collections/components/CollectionListComponent';
import InvoiceDetailDrawer from './components/InvoiceDetailDrawer';

export default function InvoiceList() {
  const navigate = useNavigate();
  const { message } = App.useApp();

  return (
    <CollectionListComponent
      module='invoices'
      toolBarRender={[
        <Button
          key='create'
          variant='solid'
          color='primary'
          onClick={() => navigate(`/collections/sale-orders/create`)}
        >
          <PlusCircleFilled /> Create
        </Button>,
        <Button
          key='export'
          variant='solid'
          color='orange'
          onClick={() => {
            message.info('Export is not implemented yet');
          }}
        >
          <FileExcelOutlined /> Export
        </Button>,
      ]}
      recordActionRender={(_dom, record) => {
        return (
          <Space>
            <Link
              to={`/collections/invoices/detail/${record.documentId}`}
              className='inline-block'
            >
              <EyeOutlined />
            </Link>
            {['Unpaid', 'New'].includes(record.order_status) && (
              <Link
                to={`/collections/invoices/edit/${record.documentId}`}
                className='inline-block ml-2'
              >
                <EditOutlined />
              </Link>
            )}
          </Space>
        );
      }}
      drawerComponent={InvoiceDetailDrawer}
    />
  );
}
