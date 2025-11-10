import { EditOutlined } from '@ant-design/icons';
import { PageContainer, ProDescriptions } from '@ant-design/pro-components';
import { Button } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PhotosView from '../../components/fields/media/PhotosView';
import TagInput from '../../components/fields/tag/TagInput';
import { breadcrumbItemRender } from '../../helpers/views_helper';
import ApiService from '../../services/ApiService';
import { type ProductType } from './ProductService';
import ProductVariantsTable from './components/ProductVariantsTable';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState<ProductType | null>(null);

  const fetchData = (id: string) => {
    ApiService.getClient()
      .collection('products')
      .findOne(id, {
        populate: [
          'product_variants.product_variant_attributes.product_attribute',
          'product_variants.product_prices',
          'product_category',
          'brand',
        ],
      })
      .then((response) => {
        setProduct(response.data);
      });
  };

  useEffect(() => {
    if (id) {
      fetchData(id);
    }
  }, [id]);

  return (
    <PageContainer
      header={{
        title: product?.name,
        breadcrumb: {
          items: [
            {
              title: 'Home',
              href: '/home',
            },
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
                  title: 'Product Status',
                  dataIndex: 'product_status',
                },
                {
                  title: 'Category/Brand',
                  dataIndex: 'product_category',
                  render: (_text: any, record: ProductType) => (
                    <span>
                      {record.product_category?.name}/{record.brand?.name}
                    </span>
                  ),
                },
                {
                  title: 'Photos',
                  dataIndex: 'photos',
                  render: (_text: any, record: ProductType) => (
                    <PhotosView photos={record.photos as any[]} />
                  ),
                  span: 2,
                },
                {
                  title: 'Summary',
                  dataIndex: 'summary',
                  span: 2,
                },
                {
                  title: 'Description',
                  dataIndex: 'description',
                  render: (dom: any) => (
                    <div dangerouslySetInnerHTML={{ __html: dom }} />
                  ),
                  span: 2,
                },
                {
                  dataIndex: 'tags',
                  title: 'Tags',
                  render: (_text: any, record: any) => {
                    return <TagInput module='products' recordId={record.id} />;
                  },
                  span: 2,
                },
              ]}
            />
          </>
        )}
      </div>

      {product && (
        <div className='w-full bg-white py-2 rounded-md mt-4'>
          <ProductVariantsTable
            product={product}
            onChange={() => fetchData(product.documentId as string)}
          />
        </div>
      )}
    </PageContainer>
  );
}
