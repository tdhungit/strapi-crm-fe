import { EditOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { ProList } from '@ant-design/pro-components';
import { Alert, Button, Tag } from 'antd';
import { useState } from 'react';
import PhotosCarousel from '../../../components/fields/media/PhotosCarousel';
import type { ProductType } from '../ProductService';
import ProductPriceFormModal from './ProductPriceFormModal';

export default function ProductVariantsTable({
  product,
  onChange,
}: {
  product: ProductType;
  onChange?: (values: any) => void;
}) {
  const [open, setOpen] = useState(false);
  const [variant, setVariant] = useState<any>(null);
  const [selectedPrice, setSelectedPrice] = useState<any>(null);

  return (
    <>
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
                    {attribute.product_attribute?.name || 'Unknown'}:{' '}
                    <span className='font-bold'>
                      {attribute.attribute_value}
                    </span>
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
                  {entity.product_prices.length > 0 && (
                    <table className='w-full text-sm text-left rtl:text-right text-gray-500'>
                      <thead className='text-xs text-gray-700 uppercase'>
                        <tr className='bg-gray-50'>
                          <th scope='col' className='px-6 py-2'>
                            Price
                          </th>
                          <th scope='col' className='px-6 py-2'>
                            Price Type
                          </th>
                          <th scope='col' className='px-6 py-2'>
                            Price Status
                          </th>
                          <th scope='col' className='px-6 py-2'>
                            Start Date
                          </th>
                          <th scope='col' className='px-6 py-2'>
                            End Date
                          </th>
                          <th scope='col' className='px-6 py-2'>
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {entity.product_prices.map((price: any) => (
                          <tr
                            key={price.id}
                            className='bg-white border-b border-gray-200'
                          >
                            <td className='px-6 py-1'>
                              ${price.price}
                              <span className='text-gray-500 text-xs italic line-through'>
                                {' '}
                                (${price.before_price})
                              </span>
                            </td>
                            <td className='px-6 py-1'>{price.price_type}</td>
                            <td className='px-6 py-1'>{price.price_status}</td>
                            <td className='px-6 py-1'>{price.start_date}</td>
                            <td className='px-6 py-1'>{price.end_date}</td>
                            <td className='px-6 py-1'>
                              <Button
                                variant='text'
                                color='orange'
                                onClick={() => {
                                  setVariant(entity);
                                  setOpen(true);
                                  setSelectedPrice(price);
                                }}
                              >
                                <EditOutlined />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
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
                  <Button
                    variant='text'
                    color='orange'
                    onClick={() => {
                      setVariant(entity);
                      setOpen(true);
                    }}
                  >
                    <PlusCircleOutlined /> Add Price
                  </Button>
                </div>
              );
            },
          },
        }}
      />

      <ProductPriceFormModal
        open={open}
        onOpenChange={setOpen}
        variant={variant}
        price={selectedPrice}
        onFinish={(values: any) => {
          onChange?.(values);
        }}
      />
    </>
  );
}
