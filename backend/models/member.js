const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  // Display name
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
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
  AccountType: {
    type: String,
    default: "Child"
   },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Parent",
    required: true
  }
});

let memberModel = mongoose.model("Member", memberSchema);

module.exports = memberdModel;
