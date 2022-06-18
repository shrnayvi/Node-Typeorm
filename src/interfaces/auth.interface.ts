import Role from '../entities/role.entity';
import User from '../entities/user.entity';

export interface ILoginInput {
  email: string;
  password: string;
}

export interface IRegisterInput {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

export interface ILoginResponse {
  id: string;
  token: string;
  roles: Role[];
}

export interface IAuthService {
  login(args: ILoginInput): Promise<ILoginResponse>;
  register(args: IRegisterInput): Promise<User>;
}

export interface IUserAuth {
  id: string;
  roles: Role[];
}
