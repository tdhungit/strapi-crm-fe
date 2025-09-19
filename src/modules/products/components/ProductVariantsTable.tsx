import { PlusCircleOutlined } from '@ant-design/icons';
import { ProList } from '@ant-design/pro-components';
import { Alert, Button, Tag } from 'antd';
import PhotosCarousel from '../../../components/fields/media/PhotosCarousel';
import type { ProductType } from '../ProductService';

export default function ProductVariantsTable({
  product,
}: {
  product: ProductType;
}) {
  return (
    <ProList
      headerTitle={'Product Variants'}
      itemLayout='vertical'
      rowKey='id'
      dataSource={product.product_variants}
      metas={{
        title: {
          dataIndex: 'name',
          render: (dom: any) => {
            return (
              <div className='flex gap-2'>
                <span className='font-bold'>{dom}</span>
              </div>
            );
          },
        },
        subTitle: {
          dataIndex: 'sku',
        },
        description: {
          render: (_dom: any, entity: any) => (
            <>
              <Tag color='blue' className='capitalize'>
                {entity.variant_status}
              </Tag>
              {entity.product_variant_attributes.map((attribute: any) => (
                <Tag key={attribute.id} color='green'>
                  {attribute.product_attribute.name}:{' '}
                  <span className='font-bold'>{attribute.attribute_value}</span>
                </Tag>
              ))}
            </>
          ),
        },
        content: {
          render: (_dom: any, entity: any) => {
            return (
              <>
                {entity.product_prices.length === 0 && (
                  <Alert message='No prices' type='warning' />
                )}
                {entity.product_prices.length > 0 &&
                  entity.product_prices.map((price: any) => (
                    <Tag key={price.id} color='green'>
                      {price.price}
                    </Tag>
                  ))}
              </>
            );
          },
        },
        extra: {
          render: (_dom: any, entity: any) => {
            return (
              <div style={{ width: 220, flexShrink: 0 }}>
                <PhotosCarousel
                  photos={entity.photos}
                  width={220}
                  height={100}
                />
              </div>
            );
          },
        },
        actions: {
          render: (_dom: any, entity: any) => {
            return (
              <div className='flex gap-2'>
                <Button variant='text' color='orange'>
                  <PlusCircleOutlined /> Add Price
                </Button>
              </div>
            );
          },
        },
      }}
    />
  );
}
