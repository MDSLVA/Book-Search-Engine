const express = require('express');
const { typeDefs, resolvers } = require('./schemas');
const { ApolloServer } = require('apollo-server-express');


const path = require('path');
const { expressMiddleware } = require('apollo-server-express');; // Import expressMiddleware

const PORT = process.env.PORT || 3001;
const app = express();

async function startApolloServer() {
  try {
    const server = new ApolloServer({
      typeDefs,
      resolvers,
    });

    await server.start(); // Start the Apollo Server

    // Apply expressMiddleware
    server.applyMiddleware({
      app,
      path: '/graphql', // The endpoint for GraphQL
    });

    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());

    // Your other middleware and routes here

    if (process.env.NODE_ENV === 'production') {
      app.use(express.static(path.join(__dirname, '../client/dist')));
    }

    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('An error occurred while starting the server:', error);
  }
}

startApolloServer(); // Start your Apollo Server
