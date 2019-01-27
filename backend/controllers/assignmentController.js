const Assignment = require("../models/assignment");
const Parent = require("../models/parent");
const Child = require("../models/child");
const  authenticate  = require("../authenticate")


const mongoose = require("mongoose");

const createAssignment = (request, response) => {
  const { creator, user, title, due, description, username } = request.body;
  const assignment = new Assignment({
    _id: new mongoose.Types.ObjectId(), 
    user,
    title,
    due,
    description,
  });
    assignment
      .save()      
        .then(saveAssignment => {  
          const id = saveAssignment._id;
          console.log("logging ID", id)
          Parent.findOneAndUpdate(username , { $push: { assignments: id }})
          .then(saveAssignment => {
            console.log("logging saveAssignemtn", saveAssignment)
            response.status(200).json(saveAssignment);     
          })
          .catch(err => {
            console.log("Error here", err);
          })      
      })
      .catch(err => {
        console.log("Error here", err);
      })   
};
const getAssignmentsByParent = (request, response) => { 
    const { username } = request.body;
  console.log("Email", username)
  Parent.findOne({ username: username })
  .then(assignment => {
    console.log("Found User", assignment);          
      response.status(200).json(assignment);      
    })
  .catch(err => {
    console.log("Something bad", err);
  });
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
  Assignment.findOneAndRemove({_id: request.params._id })
  .then(assignment => {
    response.status(200).json(assignment)
  })
  .catch(err => {
    console.log("Bad!", err)
  response.status(500).json({errorMessage: "Something went wrong while deleting assignment", err})
  })
}
const updateAssignment = (request, response) => {
  const { _id, user, title, due, description,} = request.body;
  console.log("Update id here!",request.params._id)
  Assignment.findById({_id: request.params._id })
  .then(assignment => {
    console.log("Hitting here", assignment)
    if(assignment) {
      (assignment.user = user), (assignment.title = title), (assignment.due = due), (assignment.description = description)
      Assignment.findByIdAndUpdate({_id: request.params._id }, assignment, {new:true})
      .then(assignment => {
        response.status(200).json(assignment)
      })
      .catch(err => {
        response.status(500).json({errorMessage: "Editing error", err})
      })
    }
  })
  .catch(err => {
    console.log("Bad!", err)
  response.status(500).json({errorMessage: "Something went wrong while editing assignment", err})
  })
}
module.exports = {
  createAssignment,
  getAssignmentsByParent,
  getAllAssignments,
  deleteAssignment,
  updateAssignment
};
