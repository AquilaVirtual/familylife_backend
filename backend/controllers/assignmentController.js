

const Assignment = require("../models/assignment");
const Parent = require("../models/parent");
const Child = require("../models/child");

const mongoose = require("mongoose");

const createAssignment = (request, response) => {
  const { user, title, due, description, username, creator } = request.body;
  if (request.jwtObj) {
    Parent.findOne(username)
      .then(user => {
        const assignment = new Assignment({
          _id: new mongoose.Types.ObjectId(),
          user,
          title,
          due,
          description,
          creator: user._id
        });
        assignment
          .save()
          .then(saveAssignment => {
            response.status(200).json(saveAssignment);
          })
          .catch(err => {
            console.log("Error here", err);
            response
              .status(500)
              .json({ message: "Error creating assignment", err });
          });
      })
      .catch(err => {
        console.log("Error here", err);
        response
          .status(500)
          .json({ message: "Error creating assignment", err });
      });
  } else {
    response.status(422).json({ message: "User Not Logged In" });
  }
};

const getAssignmentsByParent = (request, response) => {
  const { username } = request.body;
  if (request.decoded) {
    Parent.findOne(username )
      .then(user => {
        id = user._id;
        console.log("User Id", id)
        Assignment.find({ author: id })
          .then(assignments => {
            response.json(assignments);
          })
          .catch(err => {
            response.status(500).json(err);
          });
      })
      .catch(err => {
        response.status(500).json(err);
      });
  } else {
    return response
      .status(422)
      .json({ error: "Login is required before assignments can be viewed" });
  }
};
const getAllAssignments = (request, response) => {
  Assignment.find({})
    .then(res => {
      response.status(200).json(res);
    })
    .catch(err => {
      console.log("Something bad", err);
    });
};
const deleteAssignment = (request, response) => {
  const { _id } = request.body;
  Assignment.findOneAndRemove({ _id: request.params._id })
    .then(assignment => {
      response.status(200).json(assignment);
    })
    .catch(err => {
      console.log("Bad!", err);
      response.status(500).json({
        errorMessage: "Something went wrong while deleting assignment",
        err
      });
    });
};
const updateAssignment = (request, response) => {
  const { _id, user, title, due, description } = request.body;
  console.log("Update id here!", request.params._id);
  Assignment.findById({ _id: request.params._id })
    .then(assignment => {
      console.log("Hitting here", assignment);
      if (assignment) {
        (assignment.user = user),
          (assignment.title = title),
          (assignment.due = due),
          (assignment.description = description);
        Assignment.findByIdAndUpdate({ _id: request.params._id }, assignment, {
          new: true
        })
          .then(assignment => {
            response.status(200).json(assignment);
          })
          .catch(err => {
            response.status(500).json({ errorMessage: "Editing error", err });
          });
      }
    })
    .catch(err => {
      console.log("Bad!", err);
      response.status(500).json({
        errorMessage: "Something went wrong while editing assignment",
        err
      });
    });
};
module.exports = {
  createAssignment,
  getAssignmentsByParent,
  getAllAssignments,
  deleteAssignment,
  updateAssignment
};
