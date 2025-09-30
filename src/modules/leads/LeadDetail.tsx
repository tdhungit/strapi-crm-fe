import { EditFilled, MergeOutlined } from '@ant-design/icons';
import { Button, Space } from 'antd';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import CollectionDetailComponent from '../collections/components/CollectionDetailComponent';
import ConvertLeadModal from './components/ConvertLeadModal';

export default function LeadDetail() {
  const { id } = useParams();

  const [lead, setLead] = useState<any>();
  const [convertModalOpen, setConvertModalOpen] = useState(false);
  const [refresh, setRefresh] = useState(0);

  return (
    <>
      {id && (
        <CollectionDetailComponent
          module='leads'
          id={id}
          loaded={(lead) => setLead(lead)}
          refresh={refresh}
          extra={
            <Space>
              <Button
                variant='solid'
                color='cyan'
                onClick={() => setConvertModalOpen(true)}
              >
                <MergeOutlined /> Convert to Contact
              </Button>
              <Link
                key={`leads-edit-${id}`}
                to={`/collections/leads/edit/${id}`}
              >
                <Button variant='solid' color='orange'>
                  <EditFilled /> Edit
                </Button>
              </Link>
            </Space>
          }
        />
      )}

      {lead && (
        <ConvertLeadModal
          open={convertModalOpen}
          onOpenChange={setConvertModalOpen}
          lead={lead}
          onFinished={() => setRefresh((prev) => prev + 1)}
        />
      )}
    </>
  );
}
