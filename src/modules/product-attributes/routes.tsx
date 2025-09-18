import ProductAttributeForm from './ProductAttributeForm';

const routes = [
  {
    path: '/collections/product-attributes/create',
    element: <ProductAttributeForm />,
    name: 'Product Attribute Create',
  },
  {
    path: '/collections/product-attributes/edit/:id',
    element: <ProductAttributeForm />,
    name: 'Product Attribute Edit',
  },
  {
    path: '/collections/product-attributes/detail/:id',
    element: <ProductAttributeForm />,
    name: 'Product Attribute Detail',
  },
];

export default routes;
