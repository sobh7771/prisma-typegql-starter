import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';

import createSchema from './modules';

async function bootstrap() {
  const app = express();

  const {
    PORT = 3000,
    IS_PLAYGROUND_ENABLED = 'true',
    IS_INTROSPECTION_ENABLED = 'true',
  } = process.env;

  const introspection = IS_PLAYGROUND_ENABLED === 'true' || IS_INTROSPECTION_ENABLED === 'true';

  const apolloServer = new ApolloServer({
    schema: await createSchema(),
    introspection,
  });

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  await apolloServer.start();

  app.use(expressMiddleware(apolloServer));

  app.listen(PORT, () => console.log(`server ready on http://localhost:${PORT}/graphql`));
}

bootstrap();
