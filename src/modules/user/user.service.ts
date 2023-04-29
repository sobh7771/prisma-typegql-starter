import { Service } from 'typedi';
import { Prisma } from '@prisma/client';
import { User, UserCreateInput } from '../../prisma/generated/type-graphql';
import UserRepository from './user.repository';

@Service()
class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  create(userCreateInput: UserCreateInput): Promise<User> {
    return this.userRepository.create(userCreateInput);
  }

  findOneById(id: string): Prisma.Prisma__UserClient<User | null, null> {
    return this.userRepository.findOneById(id);
  }
}

export default UserService;
