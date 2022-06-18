import { IPagingArgs, IGetAllAndCountResult, IPaginationData } from './paging.interface';
import { IEntityRemove, IEntityID, ISingleEntityQuery } from './common.interface';
import User from '../entities/user.entity';
import Role from '../entities/role.entity';

export interface IUser {
  id: string;
  email: string;
  password: string;
  name: string;
  middleName?: string;
  phone: string;
  roles: Role[];
  createdAt: string;
  updatedAt: string;
}

export interface IEmailQuery {
  email: string;
  relations?: string[];
}

export interface IUserCreate {
  email: IUser['email'];
  name: IUser['name'];
  phone?: IUser['phone'];
  password: string;
  roles: string[];
}

export interface IUserUpdate {
  id: string;
  name?: IUser['name'];
  phone?: IUser['phone'];
  password?: string;
}

export interface IUserRepository {
  getAllAndCount(args: IPagingArgs): Promise<IGetAllAndCountResult<User>>;
  getAll(args: any): Promise<User[]>;
  getById(args: IEntityID): Promise<User | undefined>;
  getSingleEntity(args: ISingleEntityQuery): Promise<User | undefined>;
  create(args: IUserCreate): Promise<User>;
  update(args: IUserUpdate): Promise<User>;
  remove(args: IEntityRemove): Promise<User>;
}

export interface IUserService {
  getAllAndCount(args: IPagingArgs): Promise<IPaginationData<User>>;
  create(args: IUserCreate): Promise<User>;
  update(args: IUserUpdate): Promise<User>;
  remove(args: IEntityRemove): Promise<User>;
  getById(args: IEntityID): Promise<User | undefined>;
}
