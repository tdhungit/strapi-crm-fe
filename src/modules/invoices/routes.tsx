import InvoiceDetail from './InvoiceDetail';
import InvoiceList from './InvoiceList';

const routes = [
  {
    path: '/collections/invoices',
    element: <InvoiceList />,
  },
  {
    path: '/collections/invoices/detail/:id',
    element: <InvoiceDetail />,
  },
];

export default routes;
