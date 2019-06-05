const Activity = require("../models/activity");
const Parent = require("../models/parent");
const Member = require("../models/member");

const mongoose = require("mongoose");

const createActivity = (request, response) => {
  const { name, type, username, parentId } = request.body;
  //if (request.jwtObj) {
    Parent.findOne({ username: username })
      .then(user => {
        const activity = new Activity({
          _id: new mongoose.Types.ObjectId(),
          name,
          type,
          parentId: user._id
        });
        activity
          .save()
          .then(saveActivity => {
            const id = saveActivity._id;
            Parent.findOneAndUpdate(
              { username: username },
              {
                $push: { activitiesIds: id }
              }
            ).then(activity => {
              response.status(200).json(saveActivity);
            });
          })
          .catch(err => {
            console.log("Error here", err);
          });
      })
      .catch(err => {
        console.log("Error here", err);
      });
  // } else {
  //   return response.status(422).json({
  //     errorMessage: "Login is required before activity can be created"
  //   });
  // }
};
const getActivityForPrimaryAccount = (request, response) => {
  const { username } = request.params;
  //if (request.jwtObj) {
    //authenticate user
    Parent.findOne({ username: username })
      .then(user => {
        Activity.find({ parentId: user._id })
          .then(activities => {
            response.status(200).json(activities);
          })
          .catch(err => {
            console.log("Something bad", err);
          });
      })
      .catch(err => {
        console.log("No user found", err);
      });
  // } else {
  //   return response.status(422).json({
  //     errorMessage: "Login is required before activities can be viewed"
  //   });
  // }
};
const getActivityForMember = (request, response) => {
  const { username } = request.params;
  let activityArray = [];
  Member.findOne({ username: username })
    .then(member => {
      //This is not a very efficient way for getting activities for a member account, in terms of time complexity
      //will work to improve on it
      Activity.find({})
        .then(activities => {
          //Here we check if this member's activitiesIds array contains activity ID(s)
          if (member.activitiesIds) {
            member.activitiesIds.forEach(activityId => {
              activities.forEach(activity => {
                if (activityId.toString() === activity._id.toString()) {
                  activityArray.push(activity);
                }
              });
            });
          }
          response.status(200).json(activityArray);
        })
        .catch(err => {
          console.log("No activity found", err);
        });
    })
    .catch(err => {
      console.log("Error finding user", err);
    });
};
const getAllActivities = (request, response) => {
  Activity.find({})
    .then(res => {
      response.status(200).json(res);
    })
    .catch(err => {
      console.log("Something bad", err);
    });
};
const updateActivity = (request, response) => {
  const { _id, name, type } = request.body;
  console.log("Update payload", request.body)
  Activity.findById({ _id: request.params._id })
    .then(activity => {
      if (activity) {
        (activity.name = name), (activity.type = type);
        Activity.findByIdAndUpdate({ _id: request.params._id }, activity, {
          new: true
        })
          .then(activity => {
            response.status(200).json(activity);
          })
          .catch(err => {
            response.status(500).json({ errorMessage: "Editing error", err });
          });
      }
    })
    .catch(err => {
      console.log("Bad!", err);
      response.status(500).json({
        errorMessage: "Something went wrong while editing activity",
        err
      });
    });
};

const addMemberToActivity = (request, response) => {
  const { parentUsername, memberUsername } = request.body;
  console.log("Payload", request.body)
  const { _id } = request.params;
  Parent.findOne({ username: parentUsername })
    .then(parentFound => {
      Member.findOne({ username: memberUsername })
        .then(memberFound => {
          Activity.findOne({ _id: request.params._id })
            .then(activity => {
              //check if member's activitiesIds array is not empty, otherwise, don't iterate through it
              if (memberFound.activitiesIds.length) {
                memberFound.activitiesIds.forEach(id => {
                  //Here we check if this member's activitiesIds array contains this activity's ID, if so, they have been added to this activity already
                  if (id.toString() === activity._id.toString()) {
                   // console.log("Member already exist!");
                    response.status(400).json({
                      errorMessage:
                        "This member already exists in this activity"                      
                    });                
                  } else {
                    Member.findOneAndUpdate(
                      { username: memberUsername },
                      { $push: { activitiesIds: activity._id } }
                    )
                      .then(member => {
                        console.log("Member added to this activity", member);
                      })
                      .catch(err => {
                        response.status(500).json({
                          errorMessage:
                            "Something went wrong while adding member to activity",
                          err
                        });
                      });
                  }
                });
                //If member's activitiesIds array is empty, push this ID onto it
              } else {
                Member.findOneAndUpdate(
                  { username: memberUsername },
                  { $push: { activitiesIds: activity._id } }
                )
                  .then(member => {
                    console.log("Member added to this activity", member);
                  })
                  .catch(err => {
                    console.log("Error here", err)
                    response.status(500).json({
                      errorMessage:
                        "Something went wrong while add member to activity",
                      err
                    });
                  });
              }
            })
            .catch(err => {
              console.log("Error here: Can't find activity", err)
              response.status(404).json({
                errorMessage: "Activity could not be found",
                err
              });
            });
        })
        .catch(err => {
          console.log("Error here: can't find member", err)
          response.status(404).json({
            errorMessage: "There's no member by that username",
            err
          });
        });
    })
    .catch(err => {
      console.log("Error here: can't user", err)
      response.status(404).json({
        errorMessage: "There's no user by that username",
        err
      });
    });
};

const deleteActivity = (request, response) => {
  const { _id } = request.body;
  if (request.jwtObj) {
    Activity.findOne({ _id: request.params._id })
      .then(activity => {
        const id = activity.creator;
        //Here we delete referenced id of deleted activity from Parent
        Parent.findOneAndUpdate(
          { _id: id },
          { $pull: { activitiesIds: request.params._id } }
        ).then(user => {
          Activity.findOneAndRemove({ _id: request.params._id })
            .then(activity => {
              response.status(200).json(activity);
            })
            .catch(err => {
              aresponse.status(500).json({
                errorMessage: "Something went wrong while deleting activity",
                err
              });
            })
            .catch(err => {
              response.status(500).json({
                errorMessage: "Something went wrong while finding activity",
                err
              });
            });
        });
      })
      .catch(err => {
        response.status(500).json({
          errorMessage:
            "Something went wrong while deleting activity from activities array",
          err
        });
      });
  } else {
    return response.status(422).json({
      errorMessage: "Login is required before activity can be viewed"
    });
  }
};
module.exports = {
  createActivity,
  getActivityForPrimaryAccount,
  getAllActivities,
  updateActivity,
  deleteActivity,
  addMemberToActivity,
  getActivityForMember
};
