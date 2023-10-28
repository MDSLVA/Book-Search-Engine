const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('apollo-server-express');

const secret = 'mysecretsshhhhh';
const expiration = '2h';

module.exports = {
  authMiddleware: function (context) {
    let token = (context.req && context.req.headers.authorization) || '';

    
    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length).trimLeft();
    }

    if (token) {
      try {
        const { data } = jwt.verify(token, secret); 
        context.user = data;
      } catch (error) {
        console.log('Token verification error:', error.message);
        throw new AuthenticationError('Invalid token.');
      }
    }

    return context;
  },
  
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
