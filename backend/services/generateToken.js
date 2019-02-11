const jwt = require("jsonwebtoken");

const generateToken = user => {
  const options = {
    expiresIn: "1h"
  };
  const payload = { name: user.username };
  secret = process.env.REACT_APP_SECRET;
  if (typeof secret !== "string") {    
  }
  secret = "It is a family business";
  return jwt.sign(payload, secret, options);
};

module.exports = {
  generateToken
};
