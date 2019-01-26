const Activity = require("../models/activity");
const Parent = require("../models/parent");
const child = require("../models/child");

const mongoose = require("mongoose");

const createActivity = (request, response) => {
  const { name, type, username } = request.body;
  const activity = new Activity({
    _id: new mongoose.Types.ObjectId(),
    name,
    type
  });
  activity
    .save()
    .then(activity => {
      console.log("Activity here", activity);
      const id = activity._id;
      console.log("Before id", id);
      Parent.findOneAndUpdate(username, { $push: { activities: id } })
      .then(activity => {
          console.log("Before save1", activity);
          response.status(200).json(activity);
        }
      );
    })
    .catch(err => {
      console.log("Error here", err);
    });
};

const getActivitiesByParent = (request, response) => {
  const { username } = request.params;
  Activity.findOne({ username: username })
    .populate("creator")
    .then(res => {
      response.status(200).json(res);
    })
    .catch(err => {
      console.log("Something bad", err);
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
      response
        .status(500)
        .json({
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
      response
        .status(500)
        .json({
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
