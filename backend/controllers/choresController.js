const Chores = require("../models/chores");
const Parent = require("../models/parent");
const child = require("../models/member");

const mongoose = require("mongoose");

const createChore = (request, response) => {
  const { title, status, username } = request.body;
  if (request.jwtObj) {
  const chore = new Chores({
    _id: new mongoose.Types.ObjectId(),
    title,
    status
  });
  chore
    .save()
    .then(saveChore => {
      const id = saveChore._id;      
      Parent.findOneAndUpdate({username: username}, { $push: { chores: id } }).then(
        saveChore1 => {         
          response.status(200).json(saveChore);
        });
    })
    .catch(err => {
      console.log("Error here", err);
    });
  } else {
    return response
      .status(422)
      .json({ errorMessage: "Login is required before chores can be created" });
  }
};

const getChoresByParent = (request, response) => {
  const { username } = request.params;
  Chores.findOne({ username: username })
    .populate("creator")
    .then(res => {
      response.status(200).json(res);
    })
    .catch(err => {
      console.log("Something bad", err);
    });
};
const getAllChores = (request, response) => {
  Chores.find({})
    .then(res => {
      response.status(200).json(res);
    })
    .catch(err => {
      console.log("Something bad", err);
    });
};
module.exports = {
  createChore,
  getChoresByParent,
  getAllChores
};
