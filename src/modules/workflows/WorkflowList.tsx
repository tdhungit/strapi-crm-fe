import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import CollectionListComponent from '../collections/components/CollectionListComponent';

export default function WorkflowList() {
  const navigate = useNavigate();

  return (
    <>
      <CollectionListComponent
        module='crm-workflows'
        toolBarRender={[
          <Button
            key='add'
            type='primary'
            icon={<PlusOutlined />}
            onClick={() => navigate('/collections/workflows/create')}
          >
            Add
          </Button>,
        ]}
      />
    </>
  );
}
