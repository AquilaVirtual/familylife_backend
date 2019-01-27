const Assignment = require("../models/assignment");
const Parent = require("../models/parent");
const Child = require("../models/child");
const  authenticate  = require("../authenticate")


const mongoose = require("mongoose");

const createAssignment = (request, response) => {
  const { creator, user, title, due, description,  username } = request.body;
  // const assignment = new Assignment({
  //   _id: new mongoose.Types.ObjectId(), 
  //   user,
  //   title,
  //   due,
  //   description,
  // });
  // Parent.findOne(username)
  // .then(user => {
  //   const noteInfo = request.body;
  //   console.log("The request body", noteInfo)
  //   console.log("The user returned", user)
  //   // const  email  = request.jwtObj;
  //   const assignment = Assignment({
  //    _id: new mongoose.Types.ObjectId(), 
  //     ...noteInfo, email: user.email,
  //   });
  //   console.log("Assignment package", assignment)
  const assignmentInfo = request.body;
  const  email  = request.jwtObj;
  const    assignment = new Assignment({
    ...assignmentInfo, email,
  });
    assignment
      .save()      
        .then(saveAssignment => {       
            response.status(200).json(saveAssignment);     
      })
      .catch(err => {
        console.log("Error here", err);
      })   
};
const getAssignmentsByParent = (request, response) => { 
  const email  = request.jwtObj;
  console.log("Email", request.jwtObj)
  Assignment.find({ email })
  .then(user => {
    console.log("Found User", user);          
      response.status(200).json(user);      
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
