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
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true
  },
  accountType: {
    type: String,
    default: "Child"
   },
   chores: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chore' }],  
   assignments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Assignment' }],  
   activities: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Activity' }],   
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Parent",
    required: true
  }
});

let memberModel = mongoose.model("Member", memberSchema);

module.exports = memberModel;
