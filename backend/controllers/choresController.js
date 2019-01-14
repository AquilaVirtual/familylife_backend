const Chores = require("../models/chores");
const Parent = require("../models/parent");
const child = require("../models/child");

const mongoose = require("mongoose");

const createChore = (request, response) => {
  const { name, username } = request.body;
  const chore = new Chores({
    _id: new mongoose.Types.ObjectId(),
    name
  });
  chore
    .save()
    .then(saveChore => {
      const id = saveChore._id;
      console.log("Before id", id);
      Parent.findOneAndUpdate(username, { $push: { chores: id } }).then(
        saveChore1 => {
          console.log("Before save1", saveChore1);
          response.status(200).json(saveChore);
        }
      );
    })
    .catch(err => {
      console.log("Error here", err);
    });
};
const getChores = (request, response) => {
  Chores.find()
    .populate("creator")
    .then(res => {
      response.status(200).json(res);
    })
    .catch(err => {
      console.log("Something bad", err);
    });
};
module.exports = {
  createChore,
  getChores
};
