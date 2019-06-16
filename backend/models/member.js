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
  //for resetting password
  tempPassword: {
    type: String,    
  },
  accountType: {
    type: String,
    default: "Child"
   },
   userImage: {
    type: String,
    default: "https://png.icons8.com/ios/100/000000/gender-neutral-user.png",     
      },
   chores: [],
   choresIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chore' }],  
   assignmentsIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Assignment' }],  
   activitiesIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Activity' }],   
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Parent",
    required: true
  }
});

let memberModel = mongoose.model("Member", memberSchema);

module.exports = memberModel;
