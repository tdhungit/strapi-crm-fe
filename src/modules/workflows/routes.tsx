import WorkflowForm from './WorkflowForm';
import WorkflowList from './WorkflowList';

const routes = [
  {
    path: '/collections/workflows',
    element: <WorkflowList />,
  },
  {
    path: '/collections/workflows/edit/:id',
    element: <WorkflowForm />,
  },
  {
    path: '/collections/workflows/create',
    element: <WorkflowForm />,
  },
  {
    path: '/collections/workflows/detail/:id',
    element: <WorkflowForm />,
  },
];

export default routes;
