const Activity = require("../models/activity");
const Parent = require("../models/parent");
const Member = require("../models/member");

const mongoose = require("mongoose");

const createActivity = (request, response) => {
  const { name, type, username, parentId } = request.body;
  if (request.jwtObj) {
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
          .then(activity => {
            const id = activity._id;
            Parent.findOneAndUpdate({username: username}, {
              $push: { activitiesIds: id }
            }).then(activity => {
              response.status(200).json(activity);
            });
          })
          .catch(err => {
            console.log("Error here", err);
          });
      })
      .catch(err => {
        console.log("Error here", err);
      });
  } else {
    return response
      .status(422)
      .json({ errorMessage: "Login is required before activity can be created" });
  }
};
const getActivitiesByParent = (request, response) => {
  const { username } = request.params;
  if (request.jwtObj) { //authenticate user
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
  } else {
    return response
      .status(422)
      .json({ errorMessage: "Login is required before activities can be viewed" });
  }
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
  const { username, member } = request.body;
  const { _id } = request.params;
  console.log("Add activity fired!", _id)
  console.log("Primary username fired!", username)
  console.log("Member name fired!", member)
  Parent.findOne({username: username})
  .then(parentFound => {
    // Member.findOne({name: member})
    // .then(memberFound => {
      //console.log("Family member found", memberFound)
      Activity.findOne({_id: request.params._id})
      .then(activity => {
      Member.findOneAndUpdate({name: member},{ $push: {activitiesIds: activity._id}})
      .then(memberFound => {
        console.log("Member added to this activity", memberFound)
      })
      .catch(err => {
        response.status(500).json({
          errorMessage: "Something went wrong while add member to activity",
          err
        });
      })
      })
      .catch( err => {
        response.status(404).json({
          errorMessage: "Activity could not be found",
          err
        });
      })
    // })
    // .catch(err => {
    //   console.log("Bad!", err);
    //   response.status(404).json({
    //     errorMessage: "There's no member by that name",
    //     err
    //   });
    // });
  })
  .catch(err => {
    response.status(404).json({
      errorMessage: "There's no primary account by that username",
      err
    });
  })
}

const deleteActivity = (request, response) => {
  const { _id } = request.body;
 if (request.jwtObj) {  
  Activity.findOne({_id: request.params._id})
  .then(activity => {
    const id = activity.creator;
    //Here we delete referenced id of deleted activity from Parent
    Parent.findOneAndUpdate({_id: id}, { $pull: {activitiesIds:  request.params._id}})
    .then(user => {      
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
      })   
    })
      })
    .catch(err => {
      response.status(500).json({
        errorMessage: "Something went wrong while deleting activity from activities array",
        err
      });
    });

  } else {
    return response
      .status(422)
      .json({ errorMessage: "Login is required before activity can be viewed" });
  }
};
module.exports = {
  createActivity,
  getActivitiesByParent,
  getAllActivities,
  updateActivity,
  deleteActivity,
  addMemberToActivity
};
