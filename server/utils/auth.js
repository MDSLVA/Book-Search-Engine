const jwt = require('jsonwebtoken');

const secret = 'mysecretsshhhhh';
const expiration = '2h';

module.exports = {
  authMiddleware: async (resolve, source, args, context, info) => {
    const { authorization } = context.headers;
    
    if (!authorization) {
      throw new Error('Authorization token is missing.');
    }

    const token = authorization.replace('Bearer ', '');

    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      context.user = data;
    } catch (error) {
      console.log('Invalid token');
      throw new Error('Invalid token.');
    }

    // Call the next resolver function
    const result = await resolve(source, args, context, info);
    return result;
  },
  signToken: ({ username, email, _id }) => {
    const payload = { username, email, _id };
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
