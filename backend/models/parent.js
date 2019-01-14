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
     chores: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chore' }],  
});

let parentModel = mongoose.model("Parent", parentSchema);

module.exports = parentModel;
