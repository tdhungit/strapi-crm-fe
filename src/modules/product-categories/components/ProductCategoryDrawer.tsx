import { EditOutlined, EyeOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Descriptions,
  Drawer,
  List,
  Space,
  Tag,
  Typography,
} from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../../services/ApiService';
import type { CollectionDrawerProps } from '../../collections/components/CollectionDetailDrawer';

export default function ProductCategoryDrawer({
  open,
  onOpenChange,
  id,
  width,
}: CollectionDrawerProps) {
  const navigate = useNavigate();

  const [productCategory, setProductCategory] = useState<any>(null);

  useEffect(() => {
    if (id) {
      ApiService.getClient()
        .collection('product-categories')
        .findOne(id, {
          populate: ['product_attributes'],
        })
        .then((res) => {
          setProductCategory(res.data);
        });
    }
  }, [id]);

  return (
    <Drawer
      open={open}
      onClose={() => onOpenChange(false)}
      width={width || 600}
      title='Product Category'
      extra={
        <Space>
          <Button
            variant='solid'
            color='orange'
            key='edit'
            onClick={() =>
              navigate(`/collections/product-categories/edit/${id}`)
            }
          >
            <EditOutlined /> Edit
          </Button>
          <Button
            type='primary'
            key='full-detail'
            onClick={() =>
              navigate(`/collections/product-categories/detail/${id}`)
            }
          >
            <EyeOutlined /> Full Detail
          </Button>
        </Space>
      }
    >
      {productCategory ? (
        <div>
          <Card
            title='Basic Information'
            size='small'
            style={{ marginBottom: 16 }}
          >
            <Descriptions column={1}>
              <Descriptions.Item label='Name'>
                {productCategory.name}
              </Descriptions.Item>
              <Descriptions.Item label='Slug'>
                {productCategory.slug}
              </Descriptions.Item>
              <Descriptions.Item label='Description'>
                {productCategory.description}
              </Descriptions.Item>
              <Descriptions.Item label='Weight'>
                {productCategory.weight}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          <Card
            title='Product Attributes'
            size='small'
            style={{ marginBottom: 16 }}
          >
            <List
              dataSource={productCategory.product_attributes}
              renderItem={(attribute: any) => (
                <List.Item>
                  <Card size='small' style={{ width: '100%' }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 8,
                      }}
                    >
                      <Typography.Text strong>{attribute.name}</Typography.Text>
                      <Tag color='blue'>Weight: {attribute.weight}</Tag>
                    </div>
                    {attribute.description && (
                      <Typography.Text
                        type='secondary'
                        style={{ marginBottom: 8, display: 'block' }}
                      >
                        {attribute.description}
                      </Typography.Text>
                    )}
                    <div>
                      <Typography.Text strong>Options:</Typography.Text>
                      <div style={{ marginTop: 4 }}>
                        {attribute.metadata?.options?.map(
                          (option: any, index: number) => (
                            <Tag key={index} style={{ margin: '2px' }}>
                              {option.value}
                            </Tag>
                          )
                        ) || (
                          <Typography.Text type='secondary'>
                            No options available
                          </Typography.Text>
                        )}
                      </div>
                    </div>
                  </Card>
                </List.Item>
              )}
            />
          </Card>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </Drawer>
  );
}
