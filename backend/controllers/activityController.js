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
      Parent.findOneAndUpdate(username, { $push: { activities: id } }).then(
        activity => {
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
  Parent.findOne({ username: username })
    .populate("activies")
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
module.exports = {
  createActivity,
  getActivitiesByParent,
  getAllActivities
};
