import { buildSchema } from 'type-graphql';

import container from '../inversify.config';
import { AuthResolver } from './resolvers/auth.resolver';
import { RoleResolver } from './resolvers/role.resolver';
import { UserResolver } from './resolvers/user.resolver';

export default buildSchema({
  container,
  validate: false,
  // prettier-ignore
  resolvers: [
    RoleResolver,
    UserResolver,
    AuthResolver,
  ],
});
