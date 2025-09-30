import LeadDetail from './LeadDetail';
import LeadList from './LeadList';

const routes = [
  {
    path: '/collections/leads',
    element: <LeadList />,
  },
  {
    path: '/collections/leads/detail/:id',
    element: <LeadDetail />,
  },
];

export default routes;
