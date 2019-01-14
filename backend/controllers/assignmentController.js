const Assignment = require("../models/assignment");
const Parent = require("../models/parent");
const Child = require("../models/child");

const mongoose = require("mongoose");

const createAssignment = (request, response) => {
  const { name, due, description, username } = request.body;
  const assignment = new Assignment({
    _id: new mongoose.Types.ObjectId(),
    name,
    due, 
    description
  });
  assignment
    .save()
    .then(saveassignment => {
      const id = saveassignment._id;
      console.log("Before id", id);
      Parent.findOneAndUpdate(username, { $push: { assignments: id } })
      .then(saveAssignment => {
          console.log("Before save1", saveAssignment);
          response.status(200).json(saveAssignment);
        }
      );
    })
    .catch(err => {
      console.log("Error here", err);
    });
};
const getAssignments = (request, response) => {
  Assignment.find()
    .populate("creator")
    .then(res => {
      response.status(200).json(res);
    })
    .catch(err => {
      console.log("Something bad", err);
    });
};
module.exports = {
  createAssignment,
  getAssignments
};
