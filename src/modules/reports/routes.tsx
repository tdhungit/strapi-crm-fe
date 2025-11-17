import ReportDetail from './ReportDetail';
import ReportForm from './ReportForm';

const routes = [
  {
    path: '/collections/reports/create',
    element: <ReportForm />,
  },
  {
    path: '/collections/reports/edit/:id',
    element: <ReportForm />,
  },
  {
    path: '/collections/reports/detail/:id',
    element: <ReportDetail />,
  },
];

export default routes;
