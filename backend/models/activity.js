const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  // activity name
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  when: {
    type: Date,
    required: true,
    default: Date.now()
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Parent",   
  },
  family: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Member' }]
});

let activitydModel = mongoose.model("Activity", activitySchema);

module.exports = activitydModel;
