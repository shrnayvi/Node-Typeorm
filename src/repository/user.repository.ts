import merge from 'lodash/merge';
import isNil from 'lodash/isNil';
import isString from 'lodash/isString';
import isArray from 'lodash/isArray';
import { injectable, inject } from 'inversify';
import { getRepository, In, ILike, SelectQueryBuilder } from 'typeorm';

import { TYPES } from '../types';
import strings from '../config/strings';
import config from '../config/constants';
import User from '../entities/user.entity';
import Role from '../entities/role.entity';
import BaseRepository from './base.repository';
import * as apiError from '../utils/api-error';

import { IHashService } from '../interfaces/common.interface';
import { IUserCreate, IUserUpdate, IUserRepository } from '../interfaces/user.interface';
import { IRoleRepository } from '../interfaces/role.interface';
import { IGetAllAndCountResult, IGetOptions } from '../interfaces/paging.interface';

@injectable()
export default class UserRepository extends BaseRepository<User> implements IUserRepository {
  private hashService: IHashService;
  private roleRepository: IRoleRepository;

  constructor(
    @inject(TYPES.HashService) _hashService: IHashService,
    @inject(TYPES.RoleRepository) _roleRepository: IRoleRepository
  ) {
    super(getRepository(User));
    this.hashService = _hashService;
    this.roleRepository = _roleRepository;
  }

  getAllAndCount = async (args: IGetOptions): Promise<IGetAllAndCountResult<User>> => {
    try {
      let { query = {}, select = [], relations = [], ...rest } = args;
      let { role: roleName, search, ...where } = query;
      const _select = select as (keyof User)[];

      for (let key in query) {
        if (isArray(query[key])) {
          query[key] = In(query[key]);
        }
      }

      let _searchWhere: any = [];

      if (search) {
        _searchWhere = [
          {
            firstName: ILike(`%${search}`),
            ...where,
          },
          {
            email: ILike(`%${search}`),
            ...where,
          },
        ];
      }

      let role: Role | undefined;
      if (roleName) {
        relations.push('roles');
        role = await this.roleRepository.getSingleEntity({ query: { name: roleName } });
      }

      // Using function based where query since it needs inner join where clause
      const _where = (qb: SelectQueryBuilder<User>) => {
        const a = qb.where(_searchWhere.length ? _searchWhere : where);

        if (roleName) {
          a.andWhere('role_id = :roleId', { roleId: role?.id ?? '' });
        }
      };

      let [rows, count] = await this.repo.findAndCount({
        relations,
        where: _where,
        ...(_select?.length && { select: _select }),
        ...rest,
      });

      return {
        count,
        rows,
      };
    } catch (err) {
      throw err;
    }
  };

  create = async (args: IUserCreate): Promise<User> => {
    try {
      const email = args.email?.toLowerCase()?.trim();
      const password = args.password;
      const phone = args.phone;
      const name = args.name;
      const roles = args.roles;

      const errors: string[] = [];

      if (isNil(email) || !isString(email)) {
        errors.push(strings.emailRequired);
      }
      if (isNil(password) || !isString(password)) {
        errors.push(strings.passwordRequired);
      }
      if (isNil(name) || !isString(name)) {
        errors.push(strings.nameRequired);
      }
      if (isNil(roles) || !isArray(roles) || !roles.length) {
        errors.push(strings.rolesRequired);
      }

      if (errors.length) {
        throw new apiError.ValidationError({
          details: errors,
        });
      }

      const found = await this.repo.findOne({ where: { email } });

      if (found) {
        throw new apiError.ConflictError({
          details: [strings.userAlreadyExists],
        });
      }

      const existingRoles = await this.roleRepository.getAll({
        query: {
          name: roles,
        },
      });

      if (!existingRoles?.length) {
        throw new apiError.ValidationError({
          details: [strings.roleNotExist],
        });
      }

      const hashedPassword = await this.hashService.hash(password, config.saltRounds);
      const user = await this.repo.save({
        email,
        password: hashedPassword,
        name,
        phone,
        roles: existingRoles,
      });

      return user;
    } catch (err) {
      throw err;
    }
  };

  update = async (args: IUserUpdate): Promise<User> => {
    try {
      const id = args.id;
      const name = args.name;
      const password = args.password;
      const phone = args.phone;

      const found = await this.repo.findOne({
        where: {
          id,
        },
      });

      if (!found) {
        throw new apiError.NotFoundError({
          details: [strings.userNotFound],
        });
      }

      let hashedPassword;
      if (password) {
        hashedPassword = await this.hashService.hash(password, config.saltRounds);
      }

      const update = merge(found, {
        id,
        name,
        phone,
        password: hashedPassword,
      });

      const user = await this.repo.save(update);

      return user;
    } catch (err) {
      throw err;
    }
  };
}
