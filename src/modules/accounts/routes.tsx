import AccountDetail from './AccountDetail';
import AccountList from './AccountList';

const routes = [
  {
    path: '/collections/accounts',
    element: <AccountList />,
    name: 'Account List',
  },
  {
    path: '/collections/accounts/detail/:id',
    element: <AccountDetail />,
    name: 'Account Detail',
  },
];

export default routes;
