// import user model
const { User } = require("../models");
// import sign token function and AuthenticationError from auth
const { signToken, AuthenticationError } = require("../utils/auth");

// GrapgQl resolvers
const resolvers = {
  Query: {
    // find and return the signed in user
    me: async (parent, args, context) => {
      if (context.user) {
        // If a user is authenticated, look up the user by their ID and exclude the password
        return User.findOne({ _id: context.user._id }).select("-password");
      }
      // if no authenticated user, throw AuthenticationError
      throw AuthenticationError;
    },
  },
  Mutation: {
    // Authenticate a user based on login credentials
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      // If no user is found, throw an AuthenticationError
      if (!user) {
        throw AuthenticationError;
      }
      // Check if the provided password is correct
      const correctPw = await user.isCorrectPassword(password);
      // If the password is incorrect, throw an AuthenticationError
      if (!correctPw) {
        throw AuthenticationError;
      }
      // Generate a token for the authenticated user and return it along with the user
      const token = signToken(user);
      return { token, user };
    },

    // Register a new user with provided login credentials
    addUser: async (parent, { username, email, password }) => {
      // Create a new user in the database
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      if (!user) {
        throw AuthenticationError;
      }
      return { token, user };
    },

    // Add a book to the user's savedBooks
    saveBook: async (parent, args, context) => {
      if (context.user) {
        // If a user is authenticated, add the book to their savedBooks array
        const updatedUser = await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: args } },
          { new: true, runValidators: true }
        );
        return updatedUser;
      }
      throw AuthenticationError;
    },

    // Remove a saved book from the user's savedBooks
    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        // If a user is authenticated, remove the book from their savedBooks
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId: bookId } } },
          { new: true }
        );
        return updatedUser;
      }
      // If there's no authenticated user, throw an AuthenticationError
      throw AuthenticationError;
    },
  },
};

module.exports = resolvers;
