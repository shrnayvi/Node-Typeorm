// import * as Faker from "faker";
import { define } from 'typeorm-seeding';

import Role from '../../../entities/role.entity';

define(Role, () => {
  const role = new Role();

  return role;
});
