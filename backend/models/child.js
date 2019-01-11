const mongoose = require("mongoose");

const childSchema = new mongoose.Schema({
  // Display name
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  // login name
  username: {
    type: String,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Parent",
    required: true
  }
});

let childModel = mongoose.model("Child", childSchema);

module.exports = childModel;
