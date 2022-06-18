import get from 'lodash/get';
import { injectable, inject } from 'inversify';

import { TYPES } from '../types';
import config from '../config/constants';
import container from '../inversify.config';
import User from '../entities/user.entity';
import * as userLoader from '../loaders/dataloader/user.dataloader';

import { IGraphql, IGraphqlContext } from '../interfaces/graphql.interface';
import { ITokenService, ILogger } from '../interfaces/common.interface';
import { IUserRepository } from '../interfaces/user.interface';

@injectable()
export default class GraphqlService implements IGraphql {
  private name = 'GraphqlService';
  private tokenService: ITokenService;
  private logger: ILogger;

  constructor(
    @inject(TYPES.TokenService) _tokenService: ITokenService,
    @inject(TYPES.LoggerFactory) loggerFactory: (name: string) => ILogger
  ) {
    this.tokenService = _tokenService;
    this.logger = loggerFactory(this.name);
  }

  formatError(err: any) {
    const message = err.message;
    const code = get(err, 'extensions.exception.code');
    const data = get(err, 'extensions.exception.data');
    const details = get(err, 'extensions.exception.details');
    const path = get(err, 'path');

    return {
      message,
      code,
      data,
      path,
      details,
    };
  }

  setContext = async (args: any): Promise<IGraphqlContext> => {
    const userRepository = container.get<IUserRepository>(TYPES.UserRepository); // could not inject as connection is needed
    const operation = 'setContext';
    const { req, res } = args;
    let user: User | undefined;

    try {
      let token = await this.tokenService.extractToken(req.headers);
      if (token) {
        let decoded = await this.tokenService.verifyToken({
          token,
          secretKey: config.accessTokenSecret,
        });

        user = await userRepository.getById({
          id: decoded.id,
          relations: ['roles'],
        });
      }
    } catch (err: any) {
      this.logger.info({
        message: err.message,
        operation,
        data: err,
      });
    }

    return {
      req,
      res,
      user,
      loaders: {
        rolesByUserIdLoader: userLoader.rolesByUserIdLoader(),
        usersByIdLoader: userLoader.usersByIdLoader(),
      },
    };
  };
}
