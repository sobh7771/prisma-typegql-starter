import {
  Resolver,
  Query,
  Mutation,
  Arg,
  Subscription,
  PubSubEngine,
  PubSub,
  Root,
} from 'type-graphql';
import { Service } from 'typedi';
import { User, UserCreateInput } from '../../prisma/generated/type-graphql';
import UserService from './user.service';

@Service()
@Resolver(() => User)
class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => User)
  async userCreate(
    @Arg('input') userCreateInput: UserCreateInput,
      @PubSub() pubSub: PubSubEngine,
  ): Promise<User> {
    const user = await this.userService.create(userCreateInput);
    await pubSub.publish('USER_CREATED', user);
    return user;
  }

  @Query(() => User, { nullable: true })
  user(@Arg('id') id: string): Promise<User | null> {
    return this.userService.findOneById(id);
  }

  @Subscription({ topics: 'USER_CREATED' })
  userCreated(@Root() user: User): User {
    console.log(this);
    return user;
  }
}

export default UserResolver;
