import { Navigate } from 'react-router-dom';
import CampaignDetail from './CampaignDetail';

const routes = [
  {
    path: '/collections/campaign-actions/*',
    element: <Navigate to='/collections/campaigns' replace />,
  },
  {
    path: '/collections/campaigns/detail/:id',
    name: 'Campaign Detail',
    element: <CampaignDetail />,
  },
];

export default routes;
