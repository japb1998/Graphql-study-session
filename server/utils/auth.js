const jwt = require('jsonwebtoken');

// set token secret and expiration date
const secret = 'mysecretsshhhhh';
const expiration = '2h';

module.exports = {
  // function for our authenticated routes
  authMiddleware: function ({req}) {
    // 1.change req,res,next for {req} => because the contect object has the res and req inside

    // allows token to be sent via  req.query or headers
    let token = req.query.token || req.headers.authorization;

    // ["Bearer", "<tokenvalue>"]
    if (req.headers.authorization) {
      token = token.split(' ').pop().trim();
    }

    // 2.
    // we do not return the response because this is not a middleware this is a context share
    // between all resolvers
    ///////////////////////////////////////////////////////////////////////
    // if (!token) {
    // return res.status(400).json({ message: 'You have no token!' });
    // }
    ///////////////////////////////////////////////////////////////////////


    // verify token and get user data out of it
    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
    } catch(error){
      console.log('Invalid token');
      console.error(error)
    }

    // send to next endpoint
    // next();
    // next is a way to let express know that it can go to the next middleware or step,
    // in APOLLO the context just receives {req,res}

    // 3.
    // we need to return the req so it continues in the chain and then it is reusable in the resolvers
    return req
  },
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
