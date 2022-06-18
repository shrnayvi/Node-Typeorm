import { inject, injectable } from 'inversify';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';

import { TYPES } from '../../types';
import Paging from '../../utils/paging';
import authenticate from '../middlewares/authenticate';
import authorize from '../middlewares/authorize';
import { Role as RoleEnum } from '../../config/constants';
import RoleValidation from '../../validation/role.validation';
import { DeleteInput } from '../../entities/common.entity';
import Role, { RoleCreateInput, RolePagingResult, RoleQueryInput, RoleUpdateInput } from '../../entities/role.entity';

import { IPaginationData } from '../../interfaces/paging.interface';
import { IErrorService, IJoiService } from '../../interfaces/common.interface';
import { IRole, IRoleService } from '../../interfaces/role.interface';

@injectable()
@Resolver()
export class RoleResolver {
  private name = 'RoleResolver';
  private roleService: IRoleService;
  private joiService: IJoiService;
  private errorService: IErrorService;

  constructor(
    @inject(TYPES.RoleService) roleService: IRoleService,
    @inject(TYPES.JoiService) joiService: IJoiService,
    @inject(TYPES.ErrorService) errorService: IErrorService
  ) {
    this.roleService = roleService;
    this.joiService = joiService;
    this.errorService = errorService;
  }

  @Query((returns) => RolePagingResult)
  @UseMiddleware(authenticate)
  async roles(@Arg('input', { nullable: true }) args: RoleQueryInput): Promise<IPaginationData<Role>> {
    const operation = 'roles';

    try {
      const pagingArgs = Paging.createPagingPayload(args);
      let result: IPaginationData<Role> = await this.roleService.getAllAndCount(pagingArgs);
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

  @Mutation((returns) => Role)
  @UseMiddleware(authenticate, authorize(RoleEnum.Admin))
  async roleCreate(@Arg('input') args: RoleCreateInput): Promise<Role> {
    const operation = 'roleCreate';
    try {
      const name = args.name;
      const description = args.description;

      const schema = RoleValidation.create();
      await this.joiService.validate({
        schema,
        input: {
          name,
          description,
        },
      });
      let role: Role = await this.roleService.create({
        name,
        description,
      });
      return role;
    } catch (err) {
      this.errorService.throwError({
        err,
        name: this.name,
        operation,
        logError: false,
      });
    }
  }

  @Mutation((returns) => Role)
  @UseMiddleware(authenticate, authorize(RoleEnum.Admin))
  async roleUpdate(@Arg('input') args: RoleUpdateInput): Promise<IRole> {
    const operation = 'roleUpdate';

    try {
      const id = args.id;
      const name = args.name;
      const description = args.description;

      const schema = RoleValidation.update();
      await this.joiService.validate({
        schema,
        input: {
          id,
          name,
          description,
        },
      });

      let role: Role = await this.roleService.update({
        id,
        name,
        description,
      });

      return role;
    } catch (err) {
      this.errorService.throwError({
        err,
        name: this.name,
        operation,
        logError: false,
      });
    }
  }

  @Mutation((returns) => Role)
  @UseMiddleware(authenticate, authorize(RoleEnum.Admin))
  async roleDelete(@Arg('input') args: DeleteInput): Promise<Role> {
    const operation = 'roleDelete';

    try {
      const id = args.id;
      let role: Role = await this.roleService.remove({ id });

      return role;
    } catch (err) {
      this.errorService.throwError({
        err,
        name: this.name,
        operation,
        logError: false,
      });
    }
  }
}
