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
  resetPassword: {
    type: String,    
  },
  accountType: {
   type: String,
   default: "Primary"
  },
  userImage: {
    type: String,
    default: "https://png.icons8.com/ios/100/000000/gender-neutral-user.png",     
      },
  chores: [],
     family: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Member' }],  
     choresIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chore' }],  
     assignmentsIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Assignment' }],  
     activitiesIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Activity' }],  
});

let parentModel = mongoose.model("Parent", parentSchema);

module.exports = parentModel;
