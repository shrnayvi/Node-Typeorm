import { Request, Response } from 'express';
import Dataloader from 'dataloader';

import User from '../entities/user.entity';
import Role from '../entities/role.entity';

export interface IDataloader {
  rolesByUserIdLoader: Dataloader<string, Role[]>;
  usersByIdLoader: Dataloader<string, User>;
}

export interface IGraphqlContext {
  req: Request;
  res: Response;
  user: User | undefined;
  loaders: IDataloader;
}

export interface IGraphql {
  formatError(err: any): any;
  setContext(args: any): Promise<IGraphqlContext>;
}
