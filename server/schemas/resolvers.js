const { User } = require('../models');
const { signToken } = require('../utils/auth');
const { AuthenticationError } = require('apollo-server-express');

const resolvers = {
  Query: {
    me: async (_, __, context) => {
      if (!context.user) {
        throw new AuthenticationError('Authentication required');
      }
      return await User.findById(context.user._id);
    },
  },
  Mutation: {
    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('User not found');
      }

      const validPassword = await user.validatePassword(password);

      if (!validPassword) {
        throw new AuthenticationError('Incorrect password');
      }

      const token = signToken(user);

      return { token, user };
    },
    addUser: async (_, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);

      return { token, user };
    },
    saveBook: async (_, { authors, description, title, bookId, image, link }, context) => {
      if (!context.user) {
        throw new AuthenticationError('Authentication required');
      }

      // Add book to the user's savedBooks
      const user = await User.findByIdAndUpdate(context.user._id, {
        $addToSet: {
          savedBooks: { authors, description, title, bookId, image, link },
        },
      }, { new: true });

      return user;
    },
    removeBook: async (_, { bookId }, context) => {
      if (!context.user) {
        throw new AuthenticationError('Authentication required');
      }

      // Remove the book from the user's savedBooks
      const user = await User.findByIdAndUpdate(context.user._id, {
        $pull: { savedBooks: { bookId } },
      }, { new: true });

      return user;
    },
  },
};

module.exports = resolvers;
