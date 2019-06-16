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
        response.status(401).json({ errorMessage: "This username is taken." });
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

const getParent = (request, response) => {
  Parent.findOne({ _id: request.params.id })
    .then(user => {
      response.status(200).json(user);
    })
    .catch(error => {
      response.status(500).json({
        errorMessage: "The user could not be retrieved."
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
        errorMessage: "The user could not be removed."
      });
    });
};

const getAllParents = (request, response) => {
  Parent.find({})
    .then(users => {
      response.status(200).json(users);
    })
    .catch(error => {
      response.status(500).json({
        errorMessage: "The information could not be retrieved."
      });
    });
};

const updateEmailandUsername = (request, response) => {
  const { username, email } = request.body;
  Parent.findById({ _id: request.params._id })
    .then(user => {
      if (user) {      
        if (email) {
          user.email = email;
        } else if (username) {
          user.username = username;
        }    
        Parent.findByIdAndUpdate({ _id: request.params._id }, user, {new: true})
          .then(updateUser => {        
            response.status(200).json(updateUser);
          })
          .catch(err => {
            response
              .status(500)
              .json({ errorMessage: "Error updating info." });
          });
      }
    })
    .catch(err => {
      response.status(500).json({ errorMessage: "Error updating info." });
    });
};

const resetPassword = (request, response) => {
  const { email } = request.body;
  let user = {};
  Parent.findOne({email: email})
  .then(primaryUserFound => { 
    if(primaryUserFound) {
      user = primaryUserFound;
    }
    else {
      Member.findOne({email: email})
      .then(memberFound => {
        if(memberFound) {
          user = memberFound
        }
      })
      .catch(err => {
        console.log("Error resetting password", err);
      })
    }    
    if(user.email) {
      let tempPass = "WqJ" + Math.floor(Math.random() * 100000);
      console.log("Found User", tempPass)
    }
    else {
      console.log("User not Found", user)
    }
  })
  .catch(err => {
    console.log("Error resetting password", err);
  })
}


const changePassword = (request, response) => {
  console.log(request.body);
  const { newPassword, verifyPassword, password } = request.body;
  Parent.findById({ _id: request.params._id })
    .then(user => {
      if (user) {
        if (bcrypt.compareSync(password, user.password)) {
          if (newPassword === verifyPassword) {          
            user.password = bcrypt.hashSync(newPassword, 11);           
            Parent.findByIdAndUpdate({ _id: request.params._id }, user, {
              new: true
            })
              .then(user => {               
                response.status(200).json(user);
              })
              .catch(err => {
                response
                  .status(500)
                  .json({ errorMessage: "Error reseting password" });
              });
          } else {
            response
              .status(406)
              .json({ errorMessage: "Passwords don't match" });
          }
        }
        else {
          
          response.status(406).json({ errorMessage: "Password is incorrect" });
        }
      }
    })
    .catch(err => {
      response.status(500).json({ errorMessage: "Error resetting password" });
    });
};

const getAllFamilyMembers = (request, response) => {
  const { username } = request.params;
  //console.log("Getting this username", username)
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
  getParent,
  deleteParentById,
  getAllParents,
  getAllFamilyMembers,
  changePassword,
  updateEmailandUsername,
  resetPassword
};
