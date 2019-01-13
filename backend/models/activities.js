const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  // activity name
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Parent",
    required: true
  },
  children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Child' }]
});

let activitydModel = mongoose.model("Activity", activitydSchema);

module.exports = activitydModel;
