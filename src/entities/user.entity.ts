import { Entity, Column, ManyToMany, JoinTable, Unique } from 'typeorm';
import { ObjectType, Field, InputType, registerEnumType } from 'type-graphql';

import { entities, Role as RoleEnum } from '../config/constants';
import Role from './role.entity';
import { Base } from './base.entity';
import { PagingInput, PagingResult } from './common.entity';

registerEnumType(RoleEnum, {
  name: 'RoleName',
});

@ObjectType()
@Unique(['email'])
@Entity({ name: entities.users })
export default class User extends Base {
  @Field()
  @Column({ length: 64 })
  email: string;

  @Column()
  password: string;

  @Field()
  @Column({ length: 40 })
  name: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  phone: string;

  @Field((type) => [Role])
  @ManyToMany(() => Role)
  @JoinTable({
    name: entities.userRoles,
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
  })
  roles: Role[];
}

@ObjectType()
export class UserPagingResult {
  @Field()
  paging: PagingResult;

  @Field(() => [User])
  data: User[];
}

@InputType()
export class UserCreateInput {
  @Field()
  email: string;

  @Field()
  password: string;

  @Field()
  phone: string;

  @Field()
  name: string;

  @Field((type) => [RoleEnum])
  roles: RoleEnum[];
}

@InputType()
export class UserUpdateInput {
  @Field()
  id: string;

  @Field({ nullable: true })
  phone: string;

  @Field({ nullable: true })
  name: string;
}

@InputType()
export class UserQuery {
  @Field({ nullable: true })
  id: string;

  @Field({ nullable: true })
  search: string;

  @Field((type) => RoleEnum, { nullable: true })
  role: RoleEnum;
}

@InputType()
export class UserQueryInput {
  @Field({ nullable: true })
  paging: PagingInput;

  @Field({ nullable: true })
  query: UserQuery;
}
