const mongoose = require("mongoose");

const parentSchema = new mongoose.Schema({
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
     children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Child' }],  
     chores: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chore' }],  
     assignments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Assignment' }],  
     activities: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Activity' }],  
});

let parentModel = mongoose.model("Parent", parentSchema);

module.exports = parentModel;
