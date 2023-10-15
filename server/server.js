const express = require("express");
// Import the ApolloServer class
const path = require("path");
const db = require("./config/connection");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
// Import the two parts of a GraphQL schema
const { typeDefs, resolvers } = require("./schemas");
const { authMiddleware } = require("./utils/auth");
// create a express app
const app = express();
const PORT = process.env.PORT || 3001;
// create the Apollo server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Create a new instance of an Apollo server with the GraphQL schema
const startApolloServer = async () => {
  // start the Apollo server
  await server.start();

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  // launch Apollo server using the expressMiddleware on a specific route, you can call the route anything
  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: authMiddleware,
    })
  );

  // if we're in production, serve client/build as static assets
  if (process.env.NODE_ENV === "production") {
    // Serve static files from the client-side build directory
    app.use(express.static(path.join(__dirname, "../client/dist")));

    // Handle any other routes by serving the main index.html
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "../client/dist/index.html"));
    });
  }

  // launch app server
  db.once("open", () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
    });
  });
};
// Call the async function to start the server
startApolloServer();
