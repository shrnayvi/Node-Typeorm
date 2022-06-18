import { define } from 'typeorm-seeding';

import User from '../../../entities/user.entity';

define(User, () => {
  const user = new User();
  user.password = '$2b$10$AnL7k/hZPi9bWxwNFfhymezyF2ZGhszYBVd66vfJs4gPmsY37U.Ha'; // password is password
  user.phone = '1234567891';

  return user;
});
