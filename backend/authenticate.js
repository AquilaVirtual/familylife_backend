const jwt = require('jsonwebtoken');


const authenticate = (request, response, next) => {
  const token = request.get('Authorization');
  console.log("Got some token", token)
  if (token) {
    jwt.verify(token, secret, (err, jwtObj) => {
      if (err) return response.status(422).json({error: 'Authentication error', err});
      request.jwtObj = jwtObj;
      next();
    });
  } else {
    return response.status(403).json({ error: 'No token provided' });
  }
};
module.exports = {
  authenticate
};