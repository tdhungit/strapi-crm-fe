import CollectionForm from './CollectionForm';
import CollectionList from './CollectionList';

const routes = [
  {
    path: '/collections/:name',
    element: <CollectionList />,
    name: 'Collection List',
  },
  {
    path: '/collections/:name/create',
    element: <CollectionForm />,
    name: 'Collection Form',
  },
  {
    path: '/collections/:name/:id',
    element: <CollectionForm />,
    name: 'Collection Form',
  },
];

export default routes;
