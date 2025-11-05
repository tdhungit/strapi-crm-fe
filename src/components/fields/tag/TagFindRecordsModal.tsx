import { Card, Modal, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { camelToTitle } from '../../../helpers/views_helper';
import CollectionListDataComponent from '../../../modules/collections/components/CollectionListDataComponent';
import ApiService from '../../../services/ApiService';

export default function TagFindRecordsModal({
  open,
  onOpenChange,
  tagId,
  tagName,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tagId?: number;
  tagName?: string;
}) {
  const [records, setRecords] = useState<any[]>([]);

  useEffect(() => {
    if (!tagId && !tagName) {
      return;
    }

    ApiService.request('GET', '/tags/find', {
      tagId,
      tagName,
    })
      .then((response) => {
        const data: any = {};
        response.data.forEach((item: any) => {
          if (!data[item.module]) {
            data[item.module] = [];
          }
          data[item.module].push(item);
        });
        console.log(data);
        setRecords(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [tagId, tagName]);

  const renderRecords = () => {
    const components: any[] = [];
    for (const module in records) {
      const dataSource: any[] = records[module];
      components.push(
        <Card
          key={module}
          title={camelToTitle(module)}
          size='small'
          style={{ marginTop: 16 }}
        >
          <CollectionListDataComponent
            dataSource={dataSource}
            collectionName={module}
          />
        </Card>
      );
    }
    return components;
  };

  return (
    <Modal
      open={open}
      onCancel={() => onOpenChange(false)}
      onOk={() => onOpenChange(false)}
      width={1000}
    >
      <div>
        <Typography.Title level={4}>Records for tag</Typography.Title>
      </div>
      {renderRecords()}
    </Modal>
  );
}
