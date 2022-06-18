import express from 'express';

import appRouter from './app';

const routes = () => {
  const app: express.Application = express();

  app.use('/', appRouter());

  return app;
};

export default routes;
