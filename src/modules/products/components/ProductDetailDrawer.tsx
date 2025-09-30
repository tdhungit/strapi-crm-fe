import { EditOutlined, EyeOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Descriptions,
  Drawer,
  Image,
  Row,
  Space,
  Table,
  Tag,
  Typography,
} from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMediaUrl } from '../../../helpers/views_helper';
import ApiService from '../../../services/ApiService';
import type { CollectionDrawerProps } from '../../collections/components/CollectionDetailDrawer';

const { Title, Text } = Typography;

export default function ProductDetailDrawer({
  open,
  onOpenChange,
  id,
  width,
}: CollectionDrawerProps) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (id && open) {
      setLoading(true);
      ApiService.getClient()
        .collection('products')
        .findOne(id, {
          populate: [
            'product_variants.product_variant_attributes',
            'product_variants.product_prices',
          ],
        })
        .then((res) => {
          setProduct(res.data);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id, open]);

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      Active: 'green',
      Inactive: 'red',
      Draft: 'orange',
    };
    return colors[status] || 'default';
  };

  const formatCurrency = (amount: number) => {
    return `$${amount?.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const variantColumns = [
    {
      title: 'Variant Name',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => <Text strong>{name}</Text>,
    },
    {
      title: 'SKU',
      dataIndex: 'sku',
      key: 'sku',
    },
    {
      title: 'Status',
      dataIndex: 'variant_status',
      key: 'variant_status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      ),
    },
    {
      title: 'Attributes',
      dataIndex: 'product_variant_attributes',
      key: 'attributes',
      render: (attributes: any[]) => (
        <Space wrap>
          {attributes?.map((attr, index) => (
            <Tag key={index} color='blue'>
              {attr.attribute_value}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: 'Prices',
      dataIndex: 'product_prices',
      key: 'prices',
      render: (prices: any[]) => (
        <Space direction='vertical' size='small'>
          {prices?.map((price, index) => (
            <div key={index}>
              <Text strong>{price.price_type}: </Text>
              <Text className='text-green-600'>
                {formatCurrency(price.price)}
              </Text>
              {price.before_price && (
                <Text delete type='secondary' className='ml-2'>
                  {formatCurrency(price.before_price)}
                </Text>
              )}
            </div>
          ))}
        </Space>
      ),
    },
  ];

  if (loading) {
    return (
      <Drawer
        open={open}
        onClose={() => onOpenChange(false)}
        width={width || 800}
        title='Loading...'
      >
        <div>Loading product details...</div>
      </Drawer>
    );
  }

  if (!product) {
    return (
      <Drawer
        open={open}
        onClose={() => onOpenChange(false)}
        width={width || 800}
        title='Product Details'
      >
        <div>No product data available</div>
      </Drawer>
    );
  }

  return (
    <Drawer
      open={open}
      onClose={() => onOpenChange(false)}
      width={width || 800}
      title={
        <div className='flex items-center justify-between'>
          <div>
            <Title level={4} className='mb-0'>
              {product.name}
            </Title>
            <Text type='secondary'>Product Details</Text>
          </div>
          <Tag color={getStatusColor(product.product_status)}>
            {product.product_status}
          </Tag>
        </div>
      }
      extra={
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              navigate(`/collections/products/edit/${id}`);
              onOpenChange(false);
            }}
          >
            Edit
          </Button>
          <Button
            type='primary'
            icon={<EyeOutlined />}
            onClick={() => {
              navigate(`/collections/products/detail/${id}`);
              onOpenChange(false);
            }}
          >
            Full Detail
          </Button>
        </Space>
      }
    >
      <div className='space-y-4'>
        {/* Basic Information */}
        <Card title='Basic Information' size='small'>
          <Descriptions column={1} size='small'>
            <Descriptions.Item label='Product Name'>
              <Text strong>{product.name}</Text>
            </Descriptions.Item>
            <Descriptions.Item label='Unit'>{product.unit}</Descriptions.Item>
            <Descriptions.Item label='Status'>
              <Tag color={getStatusColor(product.product_status)}>
                {product.product_status}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label='Summary'>
              {product.summary || 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label='Created'>
              {formatDate(product.createdAt)}
            </Descriptions.Item>
            <Descriptions.Item label='Last Updated'>
              {formatDate(product.updatedAt)}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Product Images */}
        {product.photos && product.photos.length > 0 && (
          <Card
            title='Product Images'
            size='small'
            style={{ marginTop: '16px' }}
          >
            <div className='grid grid-cols-3 gap-4'>
              {product.photos.map((photo: any, index: number) => (
                <Image
                  key={index}
                  width='100%'
                  height={120}
                  src={getMediaUrl(photo)}
                  alt={product.name}
                  className='object-cover rounded'
                />
              ))}
            </div>
          </Card>
        )}

        {/* Product Variants */}
        {product.product_variants && product.product_variants.length > 0 && (
          <Card
            title='Product Variants'
            size='small'
            style={{ marginTop: '16px' }}
          >
            <Table
              columns={variantColumns}
              dataSource={product.product_variants}
              rowKey='id'
              pagination={false}
              size='small'
              scroll={{ x: 600 }}
            />
          </Card>
        )}

        {/* Quick Stats */}
        <Card title='Quick Stats' size='small' style={{ marginTop: '16px' }}>
          <Row gutter={16}>
            <Col span={8}>
              <div className='text-center p-4 bg-blue-50 rounded'>
                <div className='text-2xl font-bold text-blue-600'>
                  {product.product_variants?.length || 0}
                </div>
                <div className='text-sm text-gray-600'>Variants</div>
              </div>
            </Col>
            <Col span={8}>
              <div className='text-center p-4 bg-green-50 rounded'>
                <div className='text-2xl font-bold text-green-600'>
                  {product.product_variants?.filter(
                    (v: any) => v.variant_status === 'Active'
                  ).length || 0}
                </div>
                <div className='text-sm text-gray-600'>Active Variants</div>
              </div>
            </Col>
            <Col span={8}>
              <div className='text-center p-4 bg-orange-50 rounded'>
                <div className='text-2xl font-bold text-orange-600'>
                  {product.photos?.length || 0}
                </div>
                <div className='text-sm text-gray-600'>Images</div>
              </div>
            </Col>
          </Row>
        </Card>

        {/* Description */}
        {product.description && (
          <Card title='Description' size='small' style={{ marginTop: '16px' }}>
            <div
              dangerouslySetInnerHTML={{ __html: product.description }}
              className='prose max-w-none'
            />
          </Card>
        )}
      </div>
    </Drawer>
  );
}
