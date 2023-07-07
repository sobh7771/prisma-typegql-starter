/* eslint-disable import/no-extraneous-dependencies */
import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';

import { createServer } from 'http';
import createSchema from './modules';

async function bootstrap() {
  const app = express();
  const httpServer = createServer(app);

  // Creating the WebSocket server
  const wsServer = new WebSocketServer({
    // This is the `httpServer` we created in a previous step.
    server: httpServer,
    // Pass a different path here if app.use
    // serves expressMiddleware at a different path
    path: '/graphql',
  });

  const schema = await createSchema();
  // Save the returned server's info so we can shutdown this server later
  const serverCleanup = useServer({ schema }, wsServer);

  const { PORT = 3000 } = process.env;

  const apolloServer = new ApolloServer({
    schema,
    plugins: [
      // Proper shutdown for the HTTP server.
      ApolloServerPluginDrainHttpServer({ httpServer }),

      // Proper shutdown for the WebSocket server.
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  await apolloServer.start();

  app.use(expressMiddleware(apolloServer));

  httpServer.listen(PORT, () => console.log(`server ready on http://localhost:${PORT}/graphql`));
}

bootstrap();
