import { EditOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Descriptions,
  Drawer,
  Space,
  Tag,
  Typography,
} from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../../services/ApiService';
import type { CollectionDrawerProps } from '../../collections/components/CollectionDetailDrawer';

const { Text } = Typography;

export default function ProductAttributeDrawer({
  open,
  onOpenChange,
  id,
  width,
}: CollectionDrawerProps) {
  const [attribute, setAttribute] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (id && open) {
      setLoading(true);
      ApiService.getClient()
        .collection('product-attributes')
        .findOne(id, {
          populate: ['product_category'],
        })
        .then((res) => {
          setAttribute(res.data);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id, open]);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const getWeightColor = (weight: number) => {
    if (weight <= 3) return 'green';
    if (weight <= 7) return 'orange';
    return 'red';
  };

  if (loading) {
    return (
      <Drawer
        open={open}
        onClose={() => onOpenChange(false)}
        width={width || 600}
        title='Loading...'
      >
        <div>Loading attribute details...</div>
      </Drawer>
    );
  }

  if (!attribute) {
    return (
      <Drawer
        open={open}
        onClose={() => onOpenChange(false)}
        width={width || 600}
        title='Product Attribute Details'
      >
        <div>No attribute data available</div>
      </Drawer>
    );
  }

  return (
    <Drawer
      open={open}
      onClose={() => onOpenChange(false)}
      width={width || 600}
      title={attribute.name}
      extra={
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              navigate(`/collections/product-attributes/edit/${id}`);
              onOpenChange(false);
            }}
          >
            Edit
          </Button>
        </Space>
      }
    >
      <div className='space-y-4'>
        {/* Basic Information */}
        <Card title='Basic Information' size='small'>
          <Descriptions column={1} size='small'>
            <Descriptions.Item label='Attribute Name'>
              <Text strong>{attribute.name}</Text>
            </Descriptions.Item>
            <Descriptions.Item label='Description'>
              {attribute.description || 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label='Weight'>
              <Tag color={getWeightColor(attribute.weight)}>
                {attribute.weight}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label='Created'>
              {formatDate(attribute.createdAt)}
            </Descriptions.Item>
            <Descriptions.Item label='Last Updated'>
              {formatDate(attribute.updatedAt)}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Category Information */}
        {attribute.product_category && (
          <Card
            title='Category Information'
            size='small'
            style={{ marginTop: 16 }}
          >
            <Descriptions column={1} size='small'>
              <Descriptions.Item label='Category Name'>
                <Text strong>{attribute.product_category.name}</Text>
              </Descriptions.Item>
              <Descriptions.Item label='Category Slug'>
                <Tag color='blue'>{attribute.product_category.slug}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label='Category Description'>
                {attribute.product_category.description || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label='Category Weight'>
                <Tag color={getWeightColor(attribute.product_category.weight)}>
                  {attribute.product_category.weight}
                </Tag>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        )}

        {/* Attribute Options */}
        {attribute.metadata?.options &&
          attribute.metadata.options.length > 0 && (
            <Card
              title='Available Options'
              size='small'
              style={{ marginTop: 16 }}
            >
              <div className='space-y-3'>
                <Text type='secondary'>
                  This attribute has {attribute.metadata.options.length}{' '}
                  available options:
                </Text>
                <div className='flex flex-wrap gap-2 mt-2'>
                  {attribute.metadata.options.map(
                    (option: any, index: number) => (
                      <Tag
                        key={index}
                        color='processing'
                        className='text-sm px-3 py-1'
                      >
                        {option.value}
                      </Tag>
                    )
                  )}
                </div>
              </div>
            </Card>
          )}
      </div>
    </Drawer>
  );
}
