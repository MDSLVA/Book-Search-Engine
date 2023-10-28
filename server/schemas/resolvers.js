const { User } = require('../models');
const { signToken} = require("../utils/auth");
const { AuthenticationError } = require('apollo-server-express');


const resolvers = {
  Query: {
    me: async (_, __, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id });
      }
      throw new AuthenticationError('Not logged in.');
    },
  },

  Mutation: {
    addUser: async (parent, { input }, context) => {
      const user = await User.create(input);
      const token = signToken(user);
      return { token, user };
    },

    login: async (parent, { input }, context) => {
      const { email, password } = input;
      const user = await User.findOne({email});

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
      console.log("Input received for saveBook:", input); 
      console.log("Context user:", context.user); 

      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: input } },
          { new: true, runValidators: true }
        );
        console.log("Updated user after saveBook:", updatedUser);
        return updatedUser;
      }
      throw new AuthenticationError('You need to be logged in.');
    },

    removeBook: async (_, { bookId }, context) => {
      console.log("Book ID received for removeBook:", bookId); 
      console.log("Context user:", context.user); 

      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );
        console.log("Updated user after removeBook:", updatedUser); 
        return updatedUser;
      }
      throw new AuthenticationError('You need to be logged in.');
    },
  },
};

module.exports = resolvers;
