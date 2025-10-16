import { useParams } from 'react-router-dom';
import { breadcrumbItemRender } from '../../helpers/views_helper';
import CollectionFormComponent from '../collections/components/CollectionFormComponent';

export default function ProductCategoryForm() {
  const { id } = useParams();

  return (
    <>
      <CollectionFormComponent
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
            ...(id
              ? [
                  {
                    title: 'Detail',
                    href: `/collections/product-categories/detail/${id}`,
                  },
                ]
              : []),
            {
              title: id ? 'Edit' : 'Add',
            },
          ],
          itemRender: breadcrumbItemRender,
        }}
      />
    </>
  );
}
