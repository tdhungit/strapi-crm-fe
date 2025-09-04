import { EditOutlined, EyeOutlined } from '@ant-design/icons';
import { ProDescriptions } from '@ant-design/pro-components';
import { Button, Drawer, Space } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  camelToTitle,
  getEditLayoutColumns,
} from '../../../helpers/views_helper';
import ApiService from '../../../services/ApiService';
import MetadataService from '../../../services/MetadataService';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  collectionName: string;
  id: string;
  width?: number;
  editPath?: string;
}

export default function CollectionDetailDrawer(props: Props) {
  const navigate = useNavigate();

  const [title, setTitle] = useState<string>('');
  const [record, setRecord] = useState<any>({});
  const [columns, setColumns] = useState<any>([]);

  useEffect(() => {
    if (props.collectionName && props.id) {
      // get columns config
      MetadataService.getCollectionConfigurations(props.collectionName).then(
        (config: any) => {
          // Edit Layout
          const cols: any = getEditLayoutColumns(config);
          setColumns(cols);
          // get record data
          ApiService.getClient()
            .collection(props.collectionName)
            .findOne(props.id)
            .then((res: any) => {
              setRecord(res.data);
              if (config.settings?.mainField) {
                setTitle(res.data[config.settings.mainField]);
              }
            });
        }
      );
    }
  }, [props.collectionName, props.id]);

  return (
    <Drawer
      title={title || camelToTitle(`${props.collectionName} Detail`)}
      placement='right'
      destroyOnHidden
      open={props.open}
      onClose={() => props.onOpenChange(false)}
      width={props.width || 800}
      extra={
        <Space>
          <Button onClick={() => props.onOpenChange(false)}>Cancel</Button>
          <Button
            type='primary'
            onClick={() => {
              props.onOpenChange(false);
              navigate(
                props.editPath ||
                  `/collections/${props.collectionName}/detail/${props.id}`
              );
            }}
          >
            <EyeOutlined /> Detail
          </Button>
          <Button
            variant='solid'
            color='orange'
            onClick={() => {
              props.onOpenChange(false);
              navigate(
                props.editPath ||
                  `/collections/${props.collectionName}/edit/${props.id}`
              );
            }}
          >
            <EditOutlined /> Edit
          </Button>
        </Space>
      }
    >
      <div>
        {record?.id && (
          <ProDescriptions
            key={`drawer-detail-${props.collectionName}-${props.id}`}
            dataSource={record}
            emptyText='No Data'
            column={2}
            columns={columns}
            bordered
          />
        )}
      </div>
    </Drawer>
  );
}
