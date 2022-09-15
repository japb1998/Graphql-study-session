const express = require('express');
const path = require('path');
const db = require('./config/connection');
// const routes = require('./routes');

// We add some imports 
const { ApolloServer } =require('apollo-server-express');
const {ApolloServerPluginDrainHttpServer,ApolloServerPluginLandingPageLocalDefault} = require('apollo-server-core')
const http = require('http');
const {typeDefs,resolvers} = require('./schemas');
const {authMiddleware} = require('./utils/auth');

const PORT = process.env.PORT || 3001;


// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}
async function startApolloServer(typeDefs, resolvers) {
  const app = express();
  // Our httpServer handles incoming requests to our Express app.
  // Below, we tell Apollo Server to "drain" this httpServer,
  // enabling our servers to shut down gracefully.
  const httpServer = http.createServer(app);

  // Same ApolloServer initialization as before, plus the drain plugin
  // for our httpServer.
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context:authMiddleware,
    // https://www.apollographql.com/docs/apollo-server/security/cors/#preventing-cross-site-request-forgery-csrf
    csrfPrevention: true,
    cache: 'bounded',
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ],
  });

  // we need to start our server before we apply express as a middleware
  // we can apply any middleware to express before we add it to the apollo server
  await server.start();
  server.applyMiddleware({
    app,
    path:'/graphql' //if you do not include the path key then defaul is "/"
  });

  // Modified server startup
  await new Promise(resolve => httpServer.listen({ port: PORT}, resolve));
  console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
}

db.once('open', async () => {
  await startApolloServer(typeDefs,resolvers)
});

// NOTE: all apollo/graphql is underthehood is a server tha receives json.