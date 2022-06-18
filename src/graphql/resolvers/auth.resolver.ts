import { inject, injectable } from 'inversify';
import { Arg, Mutation, Query, Resolver, UseMiddleware, Ctx } from 'type-graphql';

import User from '../../entities/user.entity';
import { LoginInput, LoginResponse, RegisterInput } from '../../entities/auth.entity';

import { TYPES } from '../../types';
import AuthValidation from '../../validation/auth.validation';
import authenticate from '../middlewares/authenticate';

import { IErrorService, IJoiService } from '../../interfaces/common.interface';
import { IAuthService } from '../../interfaces/auth.interface';
import { IGraphqlContext } from '../../interfaces/graphql.interface';
import { IUserService } from '../../interfaces/user.interface';

@injectable()
@Resolver((of) => LoginResponse)
export class AuthResolver {
  private name = 'AuthResolver';
  private authService: IAuthService;
  private joiService: IJoiService;
  private errorService: IErrorService;
  private userService: IUserService;

  constructor(
    @inject(TYPES.AuthService) authService: IAuthService,
    @inject(TYPES.JoiService) _joiService: IJoiService,
    @inject(TYPES.ErrorService) _errorService: IErrorService,
    @inject(TYPES.UserService) userService: IUserService
  ) {
    this.authService = authService;
    this.joiService = _joiService;
    this.errorService = _errorService;
    this.userService = userService;
  }

  @Query((returns) => User)
  @UseMiddleware(authenticate)
  async me(@Ctx() ctx: IGraphqlContext) {
    const operation = 'me';
    try {
      const id: any = ctx.user?.id;

      const loggedInUser = await this.userService.getById({
        id,
      });

      return loggedInUser;
    } catch (err) {
      this.errorService.throwError({
        err,
        name: this.name,
        operation,
        logError: true,
      });
    }
  }

  @Mutation((returns) => LoginResponse)
  async login(@Arg('input') args: LoginInput) {
    const operation = 'login';

    try {
      const email = args.email;
      const password = args.password;

      const schema = AuthValidation.login();
      await this.joiService.validate({
        schema,
        input: {
          email,
          password,
        },
      });

      const loginResponse = await this.authService.login({
        email,
        password,
      });

      return loginResponse;
    } catch (err) {
      this.errorService.throwError({
        err,
        name: this.name,
        operation,
        logError: true,
      });
    }
  }

  @Mutation((returns) => String)
  async register(@Arg('input') args: RegisterInput) {
    const operation = 'register';

    try {
      const email = args.email;
      const password = args.password;
      const name = args.name;
      const phone = args.phone;

      const schema = AuthValidation.register();
      await this.joiService.validate({
        schema,
        input: {
          email,
          password,
          name,
          phone,
        },
      });

      await this.authService.register({
        email,
        password,
        name,
        phone,
      });

      return 'An account has been created. Please check your email';
    } catch (err) {
      this.errorService.throwError({
        err,
        name: this.name,
        operation,
        logError: true,
      });
    }
  }
}
