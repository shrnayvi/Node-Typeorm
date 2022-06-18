import { inject, injectable } from 'inversify';
import { Resolver, Query, Ctx, Arg, Mutation, UseMiddleware, FieldResolver, Root } from 'type-graphql';

import { TYPES } from '../../types';
import strings from '../../config/strings';
import * as apiError from '../../utils/api-error';
import { Role as RoleEnum } from '../../config/constants';
import Paging from '../../utils/paging';
import authenticate from '../middlewares/authenticate';
import authorize from '../middlewares/authorize';
import { isSelf } from '../middlewares/user';
import UserValidation from '../../validation/user.validation';

import User, { UserPagingResult, UserCreateInput, UserUpdateInput, UserQueryInput } from '../../entities/user.entity';

import { IPaginationData } from '../../interfaces/paging.interface';
import { IUserService } from '../../interfaces/user.interface';
import { IGraphqlContext } from '../../interfaces/graphql.interface';
import { IErrorService, IJoiService } from '../../interfaces/common.interface';

@injectable()
@Resolver((of) => User)
export class UserResolver {
  private name = 'UserResolver';
  private userService: IUserService;
  private joiService: IJoiService;
  private errorService: IErrorService;
  private loader: any;

  constructor(
    @inject(TYPES.UserService) _userService: IUserService,
    @inject(TYPES.JoiService) _joiService: IJoiService,
    @inject(TYPES.ErrorService) _errorService: IErrorService
  ) {
    this.userService = _userService;
    this.joiService = _joiService;
    this.errorService = _errorService;
  }

  @Query((returns) => UserPagingResult)
  @UseMiddleware(authenticate)
  async users(@Arg('input', { nullable: true }) args: UserQueryInput): Promise<IPaginationData<User>> {
    const operation = 'User';

    try {
      const pagingArgs = Paging.createPagingPayload(args);
      let result: IPaginationData<User> = await this.userService.getAllAndCount(pagingArgs);
      return result;
    } catch (err) {
      this.errorService.throwError({
        err,
        name: this.name,
        operation,
        logError: true,
      });
    }
  }

  @Query((returns) => User)
  @UseMiddleware(authenticate, isSelf)
  async user(@Arg('id', { nullable: true }) id: string): Promise<User> {
    const operation = 'User';

    try {
      const result = await this.userService.getById({
        id,
      });

      if (!result) {
        throw new apiError.NotFoundError({
          details: [strings.userNotFound],
        });
      }

      return result;
    } catch (err) {
      this.errorService.throwError({
        err,
        name: this.name,
        operation,
        logError: true,
      });
    }
  }

  @Mutation((returns) => User)
  @UseMiddleware(authenticate, authorize(RoleEnum.Admin))
  async userCreate(@Arg('input') args: UserCreateInput): Promise<User> {
    const operation = 'userCreate';

    try {
      const email = args.email;
      const name = args.name;
      const phone = args.phone;
      const roles = args.roles;
      const password = args.password;

      const schema = UserValidation.create();
      await this.joiService.validate({
        schema,
        input: {
          email,
          name,
          phone,
          roles,
          password,
        },
      });

      const user: User = await this.userService.create({
        email,
        password,
        name,
        phone,
        roles,
      });

      return user;
    } catch (err) {
      this.errorService.throwError({
        err,
        name: this.name,
        operation,
        logError: true,
      });
    }
  }

  @Mutation((returns) => User)
  @UseMiddleware(authenticate, isSelf)
  async userUpdate(@Arg('input') args: UserUpdateInput): Promise<User> {
    const operation = 'UserUpdate';

    try {
      const id = args.id;
      const name = args.name;
      const phone = args.phone;

      const schema = UserValidation.update();
      await this.joiService.validate({
        schema,
        input: {
          id,
          name,
          phone,
        },
      });

      let user: User = await this.userService.update({
        id,
        name,
        phone,
      });

      return user;
    } catch (err) {
      this.errorService.throwError({
        err,
        name: this.name,
        operation,
        logError: true,
      });
    }
  }

  @FieldResolver()
  roles(@Root() root: User, @Ctx() ctx: IGraphqlContext) {
    return ctx.loaders.rolesByUserIdLoader.load(root.id);
  }
}
