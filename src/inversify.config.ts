import 'reflect-metadata';
import { Container } from 'inversify';

import { app, logger, graphql, hash, error, joi, token, email, handlebars } from './config/inversify/common';
import role from './config/inversify/role';
import user from './config/inversify/user';
import auth from './config/inversify/auth';

const container = new Container({ skipBaseClassChecks: true });

// prettier-ignore
container.load(
  app,
  logger,
  graphql,
  hash,
  token,
  email,
  error,
  joi,
  role,
  handlebars,
  user,
  auth,
);

export default container;
