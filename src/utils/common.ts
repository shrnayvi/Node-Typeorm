import Role from '../entities/role.entity';
import { Role as RoleEnum } from '../config/constants';

export interface ICheckRoleArgs {
  expectedRoles: string[];
  userRoles: Role[];
}

export interface ICheckAdmin {
  roles: Role[];
}

/**
 * Checks the expected roles with the user roles
 */
export const checkRoles = (args: ICheckRoleArgs) => {
  const expectedRoles = args.expectedRoles;
  const userRoles: string[] = args.userRoles.map((role) => role.name);

  return expectedRoles.some((role) => userRoles.includes(role));
};

export const isAdmin = (args: ICheckAdmin) => {
  const admin = args.roles.find((role) => role.name === RoleEnum.Admin);
  return !!admin;
};
