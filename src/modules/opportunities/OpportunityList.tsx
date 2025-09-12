import { ProjectFilled } from '@ant-design/icons';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import CollectionListComponent from '../collections/components/CollectionListComponent';

export default function OpportunityList() {
  const navigate = useNavigate();

  return (
    <CollectionListComponent
      module='opportunities'
      extra={[
        <Button key='kanban' onClick={() => navigate('/opportunities/kanban')}>
          <ProjectFilled />
        </Button>,
      ]}
    />
  );
}
