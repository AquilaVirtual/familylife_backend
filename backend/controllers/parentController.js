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
      if (user) {
        response
          .status(401)
          .json({ errorMessage: "This username is taken." });
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
              errorMessage: "Something went wrong while saving information."
            });
          });
      }
    })
    .catch(err => {
      response.status(500).send({        
        errorMessage: "Something went wrong while creating an account. "
      });
    });
};
const login = (request, response) => {
  const { username, password } = request.body;
  Parent.findOne({ username: username })
    .then(userFound => {
      //console.log("We found Primary user", userFound)
      if (!userFound) {
        response.status(500).send({
          errorMessage: "Invalid Email or Password."
        });
      } else {
        if (bcrypt.compareSync(password, userFound.password)) {     
          const token = generateToken({ userFound });
          response
            .status(200)
            .send({ userFound, token, userId: userFound._id });
        } else {
          response.status(500).send({
            errorMessage: "Invalid Email or Password."
          });
        }
      }
    })
    .catch(err => {
      response.status(500).send({
        errorMessage: "Invalid Email or Password." 
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
  console.log("Getting this username", username)
  if (request.jwtObj) {
    Parent.findOne({ username: username })
      .then(user => {
        Member.find({ parentId: user._id })
          .then(members => {
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
