import { ContainerModule, interfaces } from 'inversify';

import { TYPES } from '../../types';

import { IAuthService } from '../../interfaces/auth.interface';
import { AuthResolver } from '../../graphql/resolvers/auth.resolver';
import AuthService from '../../services/auth.service';

const auth = new ContainerModule((bind: interfaces.Bind) => {
  bind<IAuthService>(TYPES.AuthService).to(AuthService);
  bind<AuthResolver>(AuthResolver).to(AuthResolver).inSingletonScope();
});

export default auth;
