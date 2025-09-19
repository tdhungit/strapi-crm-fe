import { EditOutlined } from '@ant-design/icons';
import { PageContainer, ProDescriptions } from '@ant-design/pro-components';
import { Button } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PhotosView from '../../components/fields/media/PhotosView';
import { breadcrumbItemRender } from '../../helpers/views_helper';
import ApiService from '../../services/ApiService';
import { type ProductType } from './ProductService';
import ProductVariantsTable from './components/ProductVariantsTable';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState<ProductType | null>(null);

  useEffect(() => {
    if (id) {
      ApiService.getClient()
        .collection('products')
        .findOne(id, {
          populate: [
            'product_variants.product_variant_attributes.product_attribute',
            'product_variants.product_prices',
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
      extra={
        <Button
          variant='solid'
          color='orange'
          onClick={() =>
            navigate(`/collections/products/edit/${product?.documentId}`)
          }
        >
          <EditOutlined /> Edit
        </Button>
      }
    >
      <div className='w-full bg-white p-4 rounded-md'>
        {product && (
          <>
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
          </>
        )}
      </div>

      {product && (
        <div className='w-full bg-white py-2 rounded-md mt-4'>
          <ProductVariantsTable product={product} />
        </div>
      )}
    </PageContainer>
  );
}
