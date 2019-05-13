require('dotenv').config()

const jwt = require("jsonwebtoken");
secret = process.env.REACT_APP_SECRET;
const authenticate = (request, response, next) => {
  const token = request.get("Authorization");
  console.log("Got some token", token);
  if (token) {
    jwt.verify(token, secret, (err, jwtObj) => {
      if (err)
        return response
          .status(422)
          .json({ errorMessage: "Authentication error", err });
      request.jwtObj = jwtObj;  
     // console.log("Request JWT object", request.jwtObj)   
      next();
    });
  } else {
    return response.status(403).json({ errorMessage: "No token provided" });
  }
};
module.exports = {
  authenticate
};
