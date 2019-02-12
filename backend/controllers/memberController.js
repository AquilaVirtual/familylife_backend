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
      console.log("This body", request.body)
    if (!name || !username || !email || !password) {
      response.status(400).json({
        errorMessage: "Please provide a name, username, email, and password!"
      });
    }
    Parent.findOne({ username: username_primary })
      .then(primary_user => {
        Member.findOne({ username: username})
          .then(user => {
            console.log("getting user here", user);
            if (user) {
                response
                .status(401)
                .json({ errorMessage: "This username already exists" });
            } else {
                const encryptedPassword = bcrypt.hashSync(password, bcryptRounds);
                console.log("encrypting some here", encryptedPassword);
              const token = generateToken({ username });
              const mem = new Member({
                _id: new mongoose.Types.ObjectId(),
                name,
                username,
                password: encryptedPassword,
                token,
                email,
                accountType,
                creator: primary_user._id
              });
              console.log("Newly created member", user)
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

module.exports = {
  createMember
};
