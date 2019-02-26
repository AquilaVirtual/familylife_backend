const bcrypt = require("bcrypt");
const Parent = require("../models/parent");
const Member = require("../models/member");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../services/generateToken");
const mongoose = require("mongoose");

const bcryptRounds = 10;

const createMember = (request, response) => {
  const {
    name,
    username,
    email,
    password,
    accountType,
    creator,
    username_primary
  } = request.body;
  if (request.jwtObj) {
    if (!name || !username || !email || !password) {
      response.status(400).json({
        errorMessage: "Please provide a name, username, email, and password!"
      });
    }
    Parent.findOne({ username: username_primary })
      .then(primary_user => {
        Member.findOne({ username: username })
          .then(user => {
            if (user) {
              response
                .status(401)
                .json({ errorMessage: "This username already exists" });
            } else {
              const encryptedPassword = bcrypt.hashSync(password, bcryptRounds);
              const token = generateToken({ username });
              const newMember = new Member({
                _id: new mongoose.Types.ObjectId(),
                name,
                username,
                password: encryptedPassword,
                token,
                email,
                accountType,
                creator: primary_user._id
              });
              newMember
                .save()
                .then(savedUser => {
                  const id = savedUser._id;
                  Parent.findOneAndUpdate(
                    { username: username_primary },
                    {
                      $push: { family: id }
                    }
                  ).then(savedUser => {
                    response.status(200).send(savedUser);
                  });
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
      })
      .catch(err => {
        response.status(500).send({
          //placeholder error message
          errorMessage: "Level 2 Error occurred while saving: " + err
        });
      });
  } else {
    response.status(422).json({ message: "User Not Logged In" });
  }
};

logInMember = (request, response) => {
  const { username, password } = request.body;
  Member.findOne({ username: username })
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

const deleteMember = (request, response) => {
  const { _id } = request.body;
  if (request.jwtObj) {
    Member.findOneAndRemove({ _id: request.params.id })
      .then(deletedMember => {
        response.status(201).json(deletedMember);
      })
      .catch(err => {
        response.status(500).json("errorMessage: Error deleting member:", err);
      });
  } else {
    return response.status(422).json({ errorMessage: "User Not Logged In" });
  }
};

const resetPassword = (request, response) => {
  const { _id, newPassword, verifyPassword, password } = request.body;
  Member.findOne({ _id: request.params.id })
    .then(user => {
      if (user) {
        if (bcrypt.compareSync(password, user.password)) {
          if (newPassword === verifyPassword) {
            user.password = bcrypt.hashSync(newPassword, bcryptRounds);
            Member.findOneAndUpdate({ _id: request.params.id }, user)
              .then(user => {
                response.status(200).json(user);
              })
              .catch(err => {
                response
                  .status(500)
                  .json("errorMessage: Error reseting password:", err);
              });
          }
        }
      }
    })
    .catch(function(err) {
      response.status(500).json("errorMessage: something bahd! error:", err);
    });
};

//Here, a newly added family member can login with their temp credentials
// and change them to what they want
const updateMember = (request, response) => {
  const { newUsername, newEmail, username } = request.params;
  Member.findOne({ username: username })
    .then(user => {
      if (user) {
        (user.username = newUsername), (user.email = newEmail);
        User.findOneAndUpdate({ _id: user._id }, user)
          .then(user => {
            response.status(200).json(user);
          })
          .catch(err => {
            response
              .status(500)
              .json(`errorMessage: Error username or email: ${err}`);
          });
      }
    })
    .catch(error => {
      response.status(500).json(`errorMessage: ${error}`);
    });
};

const getAllMembers = (request, response) => {
  const { username } = request.params;
  if (request.jwtObj) {
    Member.findOne({ username: username })
      .then(user => {
        Member.find({ creator: user.creator })
          .then(members => {
            Parent.findOne({ _id: user.creator })
              .then(parent => {
                members.push(parent);
                response.status(200).json(members);
              })
              .catch(err => {
                console.log("Error getting primary account", err);
              });
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
  createMember,
  logInMember,
  updateMember,
  resetPassword,
  getAllMembers,
  deleteMember
};
