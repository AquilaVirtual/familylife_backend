const Activity = require("../models/activity");
const Parent = require("../models/parent");
const child = require("../models/child");

const mongoose = require("mongoose");

const createActivity = (request, response) => {
  const { name, type, username, creator } = request.body;
  if (request.jwtObj) {
    Parent.findOne(username)
      .then(user => {
        const activity = new Activity({
          _id: new mongoose.Types.ObjectId(),
          name,
          type,
          creator: user._id
        });
        activity
          .save()
          .then(activity => {
            console.log("Activity here", activity);
            const id = activity._id;
            console.log("Before id", id);
            Parent.findOneAndUpdate(username, {
              $push: { activities: id }
            }).then(activity => {
              console.log("Before save1", activity);
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
      .json({ error: "Login is required before activity can be created" });
  }
};

const getActivitiesByParent = (request, response) => {
  const { username } = request.body;
  if (request.jwtObj) {
    Parent.findOne(username)
      .then(user => {
        Activity.find({ creator: user._id })
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
      .json({ error: "Login is required before activity can be viewed" });
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
  console.log("Update id here!", request.params._id);
  Activity.findById({ _id: request.params._id })
    .then(activity => {
      console.log("Hitting here", activity);
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
const deleteActivity = (request, response) => {
  const { _id } = request.body;
  Activity.findOneAndRemove({ _id: request.params._id })
    .then(activity => {
      response.status(200).json(activity);
    })
    .catch(err => {
      response.status(500).json({
        errorMessage: "Something went wrong while deleting activity",
        err
      });
    });
};
module.exports = {
  createActivity,
  getActivitiesByParent,
  getAllActivities,
  updateActivity,
  deleteActivity
};
