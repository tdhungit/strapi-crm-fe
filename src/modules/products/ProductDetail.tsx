import { PageContainer, ProDescriptions } from '@ant-design/pro-components';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PhotosView from '../../components/fields/media/PhotosView';
import { breadcrumbItemRender } from '../../helpers/views_helper';
import ApiService from '../../services/ApiService';
import { type ProductType } from './ProductService';

export default function ProductDetail() {
  const { id } = useParams();

  const [product, setProduct] = useState<ProductType | null>(null);

  useEffect(() => {
    if (id) {
      ApiService.getClient()
        .collection('products')
        .findOne(id, {
          populate: [
            'product_variants.product_variant_attributes.product_attribute',
          ],
        })
        .then((response) => {
          setProduct(response.data);
        });
    }
  }, [id]);

  return (
    <PageContainer
      header={{
        title: product?.name,
        breadcrumb: {
          items: [
            {
              title: 'Products',
              href: '/collections/products',
            },
            {
              title: 'Edit',
              href: `/collections/products/edit/${product?.documentId}`,
            },
            {
              title: product?.name,
            },
          ],
          itemRender: breadcrumbItemRender,
        },
      }}
    >
      <div className='w-full bg-white p-4 rounded-md'>
        {product && (
          <ProDescriptions
            column={2}
            title={product.name}
            dataSource={product}
            columns={[
              {
                title: 'Name',
                dataIndex: 'name',
              },
              {
                title: 'Unit',
                dataIndex: 'unit',
              },
              {
                title: 'Photos',
                dataIndex: 'photos',
                render: (_text: any, record: ProductType) => (
                  <PhotosView photos={record.photos as any[]} />
                ),
              },
              {
                title: 'Product Status',
                dataIndex: 'product_status',
              },
              {
                title: 'Description',
                dataIndex: 'description',
                render: (dom: any) => (
                  <div dangerouslySetInnerHTML={{ __html: dom }} />
                ),
              },
            ]}
          />
        )}
      </div>
    </PageContainer>
  );
}
