import { Navigate } from 'react-router-dom';
import CampaignDetail from './CampaignDetail';
import CampaignList from './CampaignList';
import CampaignProfile from './CampaignProfile';

const routes = [
  {
    path: '/collections/campaign-actions/*',
    element: <Navigate to='/collections/campaigns' replace />,
  },
  {
    path: '/collections/campaigns',
    element: <CampaignList />,
  },
  {
    path: '/collections/campaigns/detail/:id',
    name: 'Campaign Detail',
    element: <CampaignDetail />,
  },
  {
    path: '/collections/campaigns/profile/:id',
    name: 'Campaign Profile',
    element: <CampaignProfile />,
  },
];

export default routes;
