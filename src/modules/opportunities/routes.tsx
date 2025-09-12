import KanbanView from './KanbanView';
import OpportunityList from './OpportunityList';

const routes = [
  {
    path: '/collections/opportunities',
    element: <OpportunityList />,
    name: 'Opportunities',
  },
  {
    path: '/opportunities/kanban',
    element: <KanbanView />,
    name: 'Opportunities Kanban',
  },
];

export default routes;
