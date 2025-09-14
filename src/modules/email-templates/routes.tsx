import EmailTemplateBuilder from './EmailTemplateBuilder';

const routes = [
  {
    path: '/collections/email-templates/create',
    element: <EmailTemplateBuilder />,
    name: 'Email Template Builder',
  },
];

export default routes;
