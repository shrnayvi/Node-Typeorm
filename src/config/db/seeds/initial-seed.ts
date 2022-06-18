import { Factory, Seeder } from 'typeorm-seeding';

import constants from '../../constants';

import User from '../../../entities/user.entity';
import Role from '../../../entities/role.entity';
import { Role as RoleEnum } from '../../../config/constants';

const roles = [
  {
    name: RoleEnum.Admin,
    description: 'Admin',
  },
  {
    name: RoleEnum.User,
    description: 'User',
  },
];

let users = [
  {
    email: 'admin@admin.com',
    name: 'Admin',
  },
  {
    email: 'user@user.com',
    name: 'User,',
  },
];

if (constants.env === 'production') {
  users = [
    {
      email: 'admin@admin.com',
      name: 'Admin',
    },
  ];
}

export default class InitialDatabaseSeed implements Seeder {
  public async run(factory: Factory): Promise<void> {
    let createdRoles: any = [];

    for (let role of roles) {
      const createdRole = await factory(Role)().create({
        ...role,
      });

      createdRoles.push(createdRole);
    }

    for (let i = 0; i < users.length; i++) {
      await factory(User)().create({
        roles: [createdRoles[i]],
        email: users[i].email,
        name: users[i].name,
      });
    }
  }
}
