import {
  EditOutlined,
  EyeOutlined,
  FileExcelOutlined,
  PlusCircleFilled,
} from '@ant-design/icons';
import { App, Button } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import CollectionListComponent from '../collections/components/CollectionListComponent';
import SaleOrderDrawer from './components/SaleOrderDrawer';

export default function SaleOrderList() {
  const navigate = useNavigate();
  const { message } = App.useApp();

  return (
    <CollectionListComponent
      module='sale-orders'
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
      updateColumns={(columns) => {
        return columns.map((col) => {
          if (col.key === 'order_status') {
            col.render = (_dom: React.ReactNode, record: any) => {
              return (
                <span
                  className='border px-2 py-1 rounded inline-block text-xs'
                  style={{
                    color:
                      record.order_status === 'Pending'
                        ? 'orange'
                        : record.order_status === 'Completed'
                        ? 'green'
                        : 'red',
                  }}
                >
                  {record.order_status}
                </span>
              );
            };
          }

          if (
            [
              'total_amount',
              'subtotal',
              'discount_amount',
              'tax_amount',
            ].includes(col.key as string)
          ) {
            delete col.render;
            col.valueType = {
              type: 'money',
              locale: 'en-Us',
            };
          }

          return col;
        });
      }}
      drawerComponent={SaleOrderDrawer}
      recordActionRender={(_dom: any, record: any) => (
        <>
          <Link
            to={`/collections/sale-orders/detail/${record.documentId}`}
            className='inline-block'
          >
            <EyeOutlined />
          </Link>
          {['Pending', 'New'].includes(record.order_status) && (
            <Link
              to={`/collections/sale-orders/edit/${record.documentId}`}
              className='inline-block ml-2'
            >
              <EditOutlined />
            </Link>
          )}
        </>
      )}
    />
  );
}
