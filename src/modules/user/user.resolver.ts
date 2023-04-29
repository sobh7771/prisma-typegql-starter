import {
  Resolver, Query, Mutation, Arg,
} from 'type-graphql';
import { Service } from 'typedi';
import { User, UserCreateInput } from '../../prisma/generated/type-graphql';
import UserService from './user.service';

@Service()
@Resolver(() => User)
class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => User)
  userCreate(@Arg('input') userCreateInput: UserCreateInput): Promise<User> {
    return this.userService.create(userCreateInput);
  }

  @Query(() => User, { nullable: true })
  user(@Arg('id') id: string): Promise<User | null> {
    return this.userService.findOneById(id);
  }
}

export default UserResolver;
