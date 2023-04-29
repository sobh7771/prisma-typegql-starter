import path from 'path';
import Container from 'typedi';
import { GraphQLSchema } from 'graphql';
import { buildSchema } from 'type-graphql';

const createSchema = async (): Promise<GraphQLSchema> => buildSchema({
  resolvers: [path.join(__dirname, './**/*.resolver.{js,ts}')],
  container: Container,
  validate: { forbidUnknownValues: false },
});

export default createSchema;
