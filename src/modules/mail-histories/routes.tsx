import MailHistoriesList from './MailHistoriesList';

const routes = [
  {
    path: '/collections/mail-histories',
    element: <MailHistoriesList />,
    name: 'Mail Histories',
  },
  {
    path: '/collections/mail-histories/detail/:id',
    element: <MailHistoriesList />,
    name: 'Mail Histories Detail',
  },
  {
    path: '/collections/mail-histories/edit/:id',
    element: <MailHistoriesList />,
    name: 'Mail Histories Edit',
  },
  {
    path: '/collections/mail-histories/create',
    element: <MailHistoriesList />,
    name: 'Mail Histories Create',
  },
  {
    path: '/collections/mail-histories/profile/:id',
    element: <MailHistoriesList />,
    name: 'Mail Histories Profile',
  },
];

export default routes;
