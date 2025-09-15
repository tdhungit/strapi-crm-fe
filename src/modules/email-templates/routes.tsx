import EmailTemplateBuilder from './EmailTemplateBuilder';
import EmailTemplateBuilderByAi from './EmailTemplateBuilderByAi';

const routes = [
  {
    path: '/collections/email-templates/create',
    element: <EmailTemplateBuilder />,
    name: 'Email Template Builder',
  },
  {
    path: '/collections/email-templates/create/ai-code',
    element: <EmailTemplateBuilderByAi />,
    name: 'Email Template Builder By AI',
  },
];

export default routes;
