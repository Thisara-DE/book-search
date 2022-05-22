const express = require('express');
// import apollo server
const { ApolloServer } = require('apollo-server-express');
const path = require('path');
const db = require('./config/connection');
// const routes = require('./routes');

// import typeDefs and resolvers
const { typeDefs, resolvers } = require('./schemas');
const { authMiddleware } = require('./utils/auth');

const app = express();
const PORT = process.env.PORT || 3001;

// create a new Apollo server and pass in the schema data
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// app.get('*', (req, res) => {
  // res.sendFile(path.join(__dirname, '../client/build/index.html'));
// });

// create a new instance of an Apollo server with GraphQL schema
const startApolloServer = async (typeDefs, resolvers ) => {
  await server.start();
  // integrate Apollo server with the Express application as middleware
  server.applyMiddleware({ app });

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running oon port ${PORT}`);
      // log where to go to test GQL API
      console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`)
    })
  })
};

// call the async function to start the server
startApolloServer(typeDefs, resolvers);


// app.use(routes);