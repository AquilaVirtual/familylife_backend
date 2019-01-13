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
  secret = "It is a family business";
  return jwt.sign(payload, secret, options);
}
const bcryptRounds = 10;

const register = (request, response) => {
  const { name, username, password, email } = request.body;
  if (!name || !username || !email || !password) {
    response.status(400).json({
      errorMessage: "Please provide a name, username, email, and password!"
    });
  }
  Parent.findOne({ username })
    .then(user => {
      console.log("getting user here", user);
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
            console.log("User getting saved", savedUser);
            response.status(200).send(savedUser);
          })
          .catch(err => {
            response.status(500).send({
              //placeholder error message
              errorMessage: "Level 1 Error occurred while saving: " + err
            });
          });
      }
    })
    .catch(err => {
      response.status(500).send({
        //placeholder error message
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
          errorMessage: "Login Failed."
        });
      } else {
        if (bcrypt.compareSync(password, userFound.password)) {
          const token = generateToken({ userFound });
          response.status(200).send({ ...userFound, token });
        } else {
          response.status(500).send({
            errorMessage: "Login Failed."
          });
        }
      }
    })
    .catch(err => {
      response.status(500).send({
        errorMessage: "Failed to Login: " + err
      });
    });
};

const getParentById = (request, response) => {
  Parent.findById({ _id: request.params.id })
    .then(function(user) {
      response.status(200).json(user);
    })
    .catch(function(error) {
      response.status(500).json({
        error: "The user could not be retrieved."
      });
    });
};

const deleteParentById = (request, response) => {
  const { _id } = request.body;
  console.log("Take him out!", request.body);
  Parent.findByIdAndRemove({ id: request.params.id })
    .then(function(user) {
      response.status(200).json(user);
    })
    .catch(function(error) {
      response.status(500).json({
        error: "The user could not be removed."
      });
    });
};
const updateParent = (request, response) => {
  const { _id, username, email } = request.body;
  Parent.findById({ _id: request.params.id })
    .then(function(user) {
      if (user) {
        (user.username = username), (user.email = email);
        User.findByIdAndUpdate({ _id: request.params.id }, user)
          .then(user => {
            response.status(200).json(user);
          })
          .catch(err => {
            response
              .status(500)
              .json(`message: Error username or email: ${err}`);
          });
      }
    })
    .catch(function(error) {
      response.status(500).json(`message: Error username or email: ${error}`);
    });
};

module.exports = {
  register,
  login,
  getParentById,
  deleteParentById,
  updateParent
};
