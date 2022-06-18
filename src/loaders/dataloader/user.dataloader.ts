import Dataloader from 'dataloader';

import { TYPES } from '../../types';
import container from '../../inversify.config';
import User from '../../entities/user.entity';
import Role from '../../entities/role.entity';
import { IUserRepository } from '../../interfaces/user.interface';

const batchRolesByUserIdFn = async (ids: readonly string[]) => {
  const userRepo: IUserRepository = container.get(TYPES.UserRepository);
  const query = { id: ids };
  const users = await userRepo.getAll({ query, relations: ['roles'] });

  const roleObj: { [userId: string]: Role[] } = {};

  users.forEach((user: User) => {
    roleObj[user.id] = user.roles ?? [];
  });

  return ids.map((userId: string) => roleObj[userId] ?? []);
};

const batchUsersByIdFn = async (ids: readonly string[]) => {
  const userRepo: IUserRepository = container.get(TYPES.UserRepository);
  const query = { id: ids };
  const users: User[] = await userRepo.getAll({ query });
  const userObj: any = {};

  users.forEach((user: User) => {
    userObj[user.id] = user;
  });

  return ids.map((id) => userObj[id]);
};

export const rolesByUserIdLoader = () => new Dataloader(batchRolesByUserIdFn);
export const usersByIdLoader = () => new Dataloader(batchUsersByIdFn);
