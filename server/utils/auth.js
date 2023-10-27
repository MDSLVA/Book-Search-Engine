const jwt = require('jsonwebtoken');
const { AuthenticationError } = require ('@apollo/server');

// Your token secret and expiration configuration
const secret = 'mysecretsshhhhh';
const expiration = '2h';

module.exports = {
  // Middleware for authenticated routes
  authMiddleware: function (context) {
    // Extract the token from the GraphQL context
    const token = context.req.headers.authorization || '';

    if (!token) {
      throw new AuthenticationError('You must be logged in.');
    }

    try {
      // Verify the token and get user data out of it
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      context.user = data;
    } catch (error) {
      console.log('Invalid token');
      throw new AuthenticationError('Invalid token.');
    }
  },
  // Function to sign a new token
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
