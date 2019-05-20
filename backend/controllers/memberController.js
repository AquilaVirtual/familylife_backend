const bcrypt = require("bcrypt");
const Parent = require("../models/parent");
const Chores = require("../models/chores");
const Member = require("../models/member");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

require("dotenv").config();

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
    parentId,
    username_primary
  } = request.body;
  //Here we authenticate user to make sure user is logged-in and has a valid token
  if (request.jwtObj) {
    if (!name || !username || !email || !password) {
      response.status(400).json({
        errorMessage: "Please provide a name, username, email, and password!"
      });
    }
    //Only a parent can add a family member, so here we query Parent to check if logged-in user
    // is a primary account holder
    Parent.findOne({ username: username_primary })
      .then(primary_user => {
        //Befor we add a new member, check if a member by that username already exists
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
                parentId: primary_user._id
              });
              newMember
                .save()
                .then(savedMember => {
                  const id = savedMember._id;
                  Parent.findOneAndUpdate(
                    { username: username_primary },
                    {
                      $push: { family: id }
                    }
                  ).then(pushedId => {
                    response.status(200).send(savedMember);
                  });

                  const output = `               
                 <p>Hi ${name.split(" ")[0]},</p>
                 <br>
                 <p>Welcome to Family Life! You were added to Family Life by ${
                   primary_user.name
                 }. </p> 
                 <br>                 
                 <p>To login, please visit <a>www.familylife.netlify.com/login</a></p>
                 <br>
                 <p>Here is your login credentials:</p>
                 <ul>
                 <li>Username: ${username}</li>
                 <li>Password: ${password}</li>
                 <li>Account Type: other</li>
                 </ul>
                 <br>
                  Thanks!
                 <br>
                 Famliy Life
                 `;
                  let transporter = nodemailer.createTransport({
                    service: "gmail",
                    port: 465,
                    secure: true,
                    auth: {
                      user: process.env.NODEMAILER_USER,
                      pass: process.env.NODEMAILER_PASS
                    },
                    tls: {
                      rejectUnauthorized: false
                    }
                  });
                  let mailOptions = {
                    from: "Family Life <familylifeorganizer@gmail.com>",
                    to: `${email}`,
                    subject: "Family Life Membership",
                    html: output
                  };

                  transporter.sendMail(mailOptions, function(error, info) {
                    if (error) {
                      console.log(error);
                    } else {
                      console.log("Email sent: " + info.response);
                    }
                  });
                })
                .catch(err => {
                  response.status(500).send({
                    //placeholder error message
                    errorMessage:
                      "Error adding Id of newly added member to families array : " +
                      err
                  });
                });
            }
          })
          .catch(err => {
            response.status(500).send({
              //placeholder error message
              errorMessage: "Error saving newly added family member: " + err
            });
          });
      })
      .catch(err => {
        response.status(500).send({
          //placeholder error message
          errorMessage: "Couldn't find a user by that username: " + err
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
        errorMessage: "Invalid Email or Password"
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
        response.status(500).json({ errorMessage: "Error deleting member" });
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
              .json({ errorMessage: "Error updating member." });
          });
      }
    })
    .catch(error => {
      response.status(500).json({ errorMessage: "Member could not be found." });
    });
};

const getAllMembers = (request, response) => {
  const { username } = request.params;
  if (request.jwtObj) {
    Member.findOne({ username: username })
      .then(userFound => {
        Member.find({ parentId: userFound.parentId })
          .then(members => {
            Parent.findOne({ _id: userFound.parentId })
              .then(parent => {
                members.push(parent);
                //Here we filter out the logged in member so they don't appear twice on dashboard
                const filterOutLoggedInmember = members.filter(member => {
                  return member._id.toString() !== userFound._id.toString();
                });
                response.status(200).json(filterOutLoggedInmember);
              })
              .catch(err => {
                response
                  .status(500)
                  .json("errorMessage: Error getting family members:", err);
              });
          })
          .catch(err => {
            response
              .status(404)
              .json("errorMessage: Couldn't find a parent by that ID:", err);
          });
      })
      .catch(err => {
        response
          .status(404)
          .json({ errorMessage: "Couldn't find a member by that username" });
      });
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
