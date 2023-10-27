const { User } = require('../models');
const { signToken, AuthenticationError } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (_, __, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id });
      }
      throw new Error('Not logged in.');
    },
  },
  Mutation: {
    addUser: async (_, { input }) => {
      const user = await User.create(input);
      const token = signToken(user);
      return { token, user };
    },
    login: async (parent, args, context) => {
      const { email, password } = args;
      const user = await User.findOne({email})
      if (!user) {
          throw new AuthenticationError("No user found with that email address.");
      }
      const correctPassword = await user.isCorrectPassword(password);
      if (!correctPassword) {
          throw new AuthenticationError("Incorrect password.");
      }
      const token = signToken(user);
      return { token, user };
  },
    saveBook: async (_, { input }, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: input } },
          { new: true, runValidators: true }
        );
        return updatedUser;
      }
      throw new Error('You need to be logged in.');
    },
    removeBook: async (_, { bookId }, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );
        return updatedUser;
      }
      throw new Error('You need to be logged in.');
    },
  },
};

module.exports = resolvers;
