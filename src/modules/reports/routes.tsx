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
];

export default routes;
