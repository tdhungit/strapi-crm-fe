import ContactDetail from './ContactDetail';
import ContactList from './ContactList';

const routes = [
  {
    path: '/collections/contacts',
    element: <ContactList />,
  },
  {
    path: '/collections/contacts/detail/:id',
    element: <ContactDetail />,
  },
];

export default routes;
