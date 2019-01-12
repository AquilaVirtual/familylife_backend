const bcrypt = require("bcrypt");
const Parent = require("../models/parent");
const jwt = require("jsonwebtoken");

function generateToken(user) {
  const options = {
    expiresIn: "1h"
  };
  const payload = { name: user.username };
  secret = process.env.REACT_APP_SECRET;
  if (typeof secret !== "string") {
    secret = process.env.secret;  
  }
  return jwt.sign(payload, secret, options);
}
const bcryptRounds = 10;

const register = (request, response) => {
  const { name, username, password, email,  } = request.body;
  if (!name ||!username || !email || !password) {
    response
      .status(400)
      .json({
        errorMessage: "Please provide a name, username, email, and password!"
      });
  }
  Parent.findOne({username})
    .then(user => {
        console.log("getting user here", user)
      if (user) {
        response
          .status(401)
          .json({ errorMessage: "This username already exists" });
      } else {
        const encryptedPassword = bcrypt.hashSync(password, bcryptRounds);
        const token = generateToken({ username });
        const user = new Parent({       
          name,
          username,
          password: encryptedPassword,
          token,
          email
        });
        user
          .save()
          .then(savedUser => {
              console.log("User getting saved", savedUser)
            response.status(200).send(savedUser);
          })
          .catch(err => {
            response.status(500).send({
              errorMessage: "Level 1 Error occurred while saving: " + err
            });
          });
      }
    })
    .catch(err => {
      response.status(500).send({
        errorMessage: "Level 2 Error occurred while saving: " + err
      });
    });
};

const login = (request, response) => {
    const { username, password } = request.body;
    Parent.findOne({ username: username })
      .then(userFound => {
        if (!userFound) {
          response.status(500).send({
            errorMessage: "Login Failed.",
          });
        } else {
          if (bcrypt.compareSync(password, userFound.password)) {
            const token = generateToken({ userFound });
            response.status(200).send({ ...userFound, token });
          } else {
            response.status(500).send({
              errorMessage: "Login Failed.",
            });
          }
        }
      })
      .catch(err => {
        response.status(500).send({
          errorMessage: "Failed to Login: " + err,
        });
      });
  };


module.exports = {
    register,
    login,
  };
  