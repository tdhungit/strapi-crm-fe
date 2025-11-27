import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Space } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import CollectionListComponent from '../collections/components/CollectionListComponent';

export default function WorkflowList() {
  const navigate = useNavigate();

  return (
    <>
      <CollectionListComponent
        module='crm-workflows'
        header={{
          title: 'Workflows',
          breadcrumb: {
            items: [
              {
                title: 'Home',
                href: '/',
              },
              {
                title: 'Workflows',
              },
            ],
          },
        }}
        toolBarRender={[
          <Button
            key='add'
            type='primary'
            icon={<PlusOutlined />}
            onClick={() => navigate('/collections/workflows/create')}
          >
            Create New Workflow
          </Button>,
        ]}
        recordActionRender={(_dom, record) => (
          <Space>
            <Link
              to={`/collections/workflows/edit/${record.documentId}`}
              className='!text-blue-500'
            >
              <EditOutlined />
            </Link>
          </Space>
        )}
        disableDrawer={true}
      />
    </>
  );
}
