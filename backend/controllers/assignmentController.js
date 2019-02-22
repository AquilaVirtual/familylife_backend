const Assignment = require("../models/assignment");
const Parent = require("../models/parent");
const Member = require("../models/member");

const mongoose = require("mongoose");

const createAssignment = (request, response) => {
  const { name, title, due, description, username, creator } = request.body;
  console.log("Giving jwt", request.jwtObj);
  if (request.jwtObj) {
    Parent.findOne({ username: username })
      .then(user => {
        Member.findOne({ name: name })
          .then(member => {
            //Only create an assignment if a member exists with the provided name
            if (member) {
              const assignment = new Assignment({
                _id: new mongoose.Types.ObjectId(),
                name,
                title,
                due,
                description,
                creator: user._id,
                createdFor: member._id
              });
              assignment
                .save()
                .then(saveAssignment => {
                  const id = saveAssignment._id;
                  Parent.findOneAndUpdate(
                    { username: username },
                    { $push: { assignments: id } }
                  )
                    .then(saveAssignment => {
                      response.status(200).json(saveAssignment);
                    })
                    .catch(err => {
                      response
                        .status(500)
                        .json({
                          errorMessage: "Error pushing assignments onto Parent",
                          err
                        });
                    });
                })
                .catch(err => {
                  response
                    .status(500)
                    .json({ errorMessage: "Error saving assignment", err });
                });
            } else {
              response
                .status(404)
                .json({ errorMessage: "Could not find a member by that name" });
            }
          })
          .catch(err => {
            console.log("Error here", err);
            response
              .status(404)
              .json({
                errorMessage: "Could not find a member by that name",
                err
              });
          });
      })
      .catch(err => {
        console.log("Error here", err);
        response
          .status(500)
          .json({ errorMessage: "Error creating assignment", err });
      });
  } else {
    response.status(422).json({ errorMessage: "User Not Logged In" });
  }
};
const getAssignments = (request, response) => {
  const { username } = request.params;
  //authenticate user
  if (request.jwtObj) {
    Parent.findOne({ username: username })
      .then(user => {
        if (user) {
          const parentId = user._id;
          Assignment.find({ creator: parentId })
            .then(assignments => {
              response.json(assignments);
            })
            .catch(err => {
              response.status(500).json(err);
            });
        } else {
          Member.findOne({ username: username })
            .then(member => {
              if (member) {
                const memberId = member._id;
                Assignment.find({ createdFor: memberId })
                  .then(assignments => {
                    response.json(assignments);
                  })
                  .catch(err => {
                    response.status(500).json(err);
                  });
              }
            })
            .catch(err => {
              response.status(500).json(err);
            });
        }
      })
      .catch(err => {
        response.status(500).json(err);
      });
  } else {
    return response.status(422).json({
      errorMessage: "Login is required before assignments can be viewed"
    });
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
  if (request.jwtObj) {
    Assignment.findOne({ _id: request.params._id })
      .then(assignment => {
        const id = assignment.creator;
        //Here we delete referenced id of deleted assignment from Parent
        Parent.findOneAndUpdate(
          { _id: id },
          { $pull: { assignments: request.params._id } }
        ).then(user => {
          Assignment.findOneAndRemove({ _id: request.params._id })
            .then(assignment => {
              response.status(200).json(assignment);
            })
            .catch(err => {
              aresponse.status(500).json({
                errorMessage: "Something went wrong while deleting assignment",
                err
              });
            })
            .catch(err => {
              response.status(500).json({
                errorMessage: "Something went wrong while finding assignment",
                err
              });
            });
        });
      })
      .catch(err => {
        response.status(500).json({
          errorMessage:
            "Something went wrong while deleting assignment from assignments array",
          err
        });
      });
  } else {
    return response.status(422).json({
      errorMessage: "Login is required before activity can be viewed"
    });
  }
};
const updateAssignment = (request, response) => {
  const { _id, user, title, due, description } = request.body;
  Assignment.findById({ _id: request.params._id })
    .then(assignment => {
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
  getAssignments,
  getAllAssignments,
  deleteAssignment,
  updateAssignment
};
