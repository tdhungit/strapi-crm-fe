import { useParams } from 'react-router-dom';
import { breadcrumbItemRender } from '../../helpers/views_helper';
import CollectionDetailComponent from '../collections/components/CollectionDetailComponent';

export default function ProductCategoryDetail() {
  const { id } = useParams();

  return (
    <>
      {id && (
        <CollectionDetailComponent
          module='product-categories'
          id={id}
          breadcrumb={{
            items: [
              {
                title: 'Home',
                href: '/home',
              },
              {
                title: 'Product Categories',
                href: `/collections/product-categories`,
              },
              {
                title: 'Tree View',
                href: `/collections/product-categories/tree`,
              },
              {
                title: 'Edit',
                href: `/collections/product-categories/edit/${id}`,
              },
              {
                title: 'Detail',
              },
            ],
            itemRender: breadcrumbItemRender,
          }}
        />
      )}
    </>
  );
}
