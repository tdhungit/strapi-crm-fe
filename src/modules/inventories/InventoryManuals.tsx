import { EditOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Space } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { breadcrumbItemRender } from '../../helpers/views_helper';
import CollectionListComponent from '../collections/components/CollectionListComponent';

export default function InventoryManuals() {
  const navigate = useNavigate();

  return (
    <CollectionListComponent
      module='inventory-manuals'
      header={{
        title: 'Inventory Manuals',
        breadcrumb: {
          items: [
            {
              title: 'Home',
              href: '/',
            },
            {
              title: 'Inventory',
              href: '/collections/inventories',
            },
            {
              title: 'Inventory Manuals',
            },
          ],
          itemRender: breadcrumbItemRender,
        },
      }}
      toolBarRender={[
        <Button
          key='add'
          type='primary'
          icon={<PlusOutlined />}
          onClick={() => navigate('/collections/inventories/create')}
        >
          Create
        </Button>,
      ]}
      recordActionRender={(_dom, record) => (
        <Space>
          <Link
            key='view'
            to={`/collections/inventories/detail/${record.documentId}`}
            className='!text-cyan-600'
          >
            <EyeOutlined />
          </Link>
          <Link
            key='edit'
            to={`/collections/inventories/edit/${record.documentId}`}
            className='!text-orange-600'
          >
            <EditOutlined />
          </Link>
        </Space>
      )}
    />
  );
}
