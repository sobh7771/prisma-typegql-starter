import { Service } from 'typedi';
import { Prisma } from '@prisma/client';
import prisma from '../../prisma/prisma';
import { User, UserCreateInput } from '../../prisma/generated/type-graphql';

@Service()
class UserRepository {
  prismaUser = prisma.user;

  create(userCreateInput: UserCreateInput): Promise<User> {
    return this.prismaUser.create({ data: userCreateInput });
  }

  findOneById(id: string): Prisma.Prisma__UserClient<User | null, null> {
    return this.prismaUser.findUnique({ where: { id } });
  }
}

export default UserRepository;
