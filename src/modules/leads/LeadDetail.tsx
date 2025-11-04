import { EditFilled, MergeOutlined } from '@ant-design/icons';
import { Button, Space } from 'antd';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import PhoneView from '../../components/fields/phone/PhoneView';
import TagInput from '../../components/fields/tag/TagInput';
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
              {!lead?.contact?.id && (
                <Button
                  variant='solid'
                  color='cyan'
                  onClick={() => setConvertModalOpen(true)}
                >
                  <MergeOutlined /> Convert to Contact
                </Button>
              )}
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
          onLoadedColumns={(cols) => {
            const updateCols = cols.map((col: any) => {
              if (col.dataIndex === 'phone' || col.dataIndex === 'mobile') {
                col.render = (text: string) => {
                  return <PhoneView value={text} />;
                };
              }
              return col;
            });

            updateCols.push({
              dataIndex: 'tags',
              title: 'Tags',
              render: (_text: any, record: any) => {
                return <TagInput module='leads' recordId={record.id} />;
              },
            });

            return updateCols;
          }}
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
