const bcrypt = require("bcrypt");
const Parent = require("../models/parent");
const Member = require("../models/member");
const Chores = require("../models/chores");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../services/generateToken");

const mongoose = require("mongoose");

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
          _id: new mongoose.Types.ObjectId(),
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
      console.log("User on backend", userFound);
      if (!userFound) {
        response.status(500).send({
          errorMessage: "Login Failed."
        });
      } else {
        if (bcrypt.compareSync(password, userFound.password)) {
          request.session.userFound = userFound;
          // console.log("We found a user", userFound);
          // console.log("Session business", request.session.userFound);
          const token = generateToken({ userFound });
          response
            .status(200)
            .send({ userFound, token, userId: userFound._id });
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
    .then(user => {
      response.status(200).json(user);
    })
    .catch(error => {
      response.status(500).json({
        error: "The user could not be retrieved."
      });
    });
};

const deleteParentById = (request, response) => {
  const { _id } = request.body;
  console.log("Take him out!", request.body);
  Parent.findByIdAndRemove({ id: request.params.id })
    .then(user => {
      response.status(200).json(user);
    })
    .catch(error => {
      response.status(500).json({
        error: "The user could not be removed."
      });
    });
};
const updateParent = (request, response) => {
  const { _id, username, email } = request.body;
  Parent.findById({ _id: request.params.id })
    .then(user => {
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
    .catch(error => {
      response.status(500).json(`message: Error username or email: ${error}`);
    });
};

const getAllParents = (request, response) => {
  Parent.find({})
    .then(users => {
      response.status(200).json(users);
    })
    .catch(error => {
      response.status(500).json({
        error: "The information could not be retrieved."
      });
    });
};
const getAllFamilyMembers = (request, response) => {
  const { username } = request.params;
  if (request.jwtObj) {
    Parent.findOne({ username: username })
      .then(user => {
        Member.find({ parentId: user._id })
          .then(members => {
            console.log("All family members in Parents", members);
            response.status(200).json(members);
          })
          .catch(err => {
            console.log("Error getting family members", err);
          });
      })
      .catch(err => {});
  } else {
    return response.status(422).json({ errorMessage: "User Not Logged In" });
  }
};
module.exports = {
  register,
  login,
  getParentById,
  deleteParentById,
  updateParent,
  getAllParents,
  getAllFamilyMembers
};
