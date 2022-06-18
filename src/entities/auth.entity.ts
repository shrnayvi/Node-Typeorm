import { Field, InputType, ObjectType } from 'type-graphql';

import Role from '../entities/role.entity';

@ObjectType()
export class LoginResponse {
  @Field()
  id: string;

  @Field()
  token: string;

  @Field((type) => [Role])
  roles: Role[];
}

@InputType()
export class LoginInput {
  @Field()
  email: string;

  @Field()
  password: string;
}

@InputType()
export class RegisterInput {
  @Field()
  email: string;

  @Field()
  password: string;

  @Field()
  name: string;

  @Field()
  phone: string;
}
