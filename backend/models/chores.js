const mongoose = require("mongoose");

const choreSchema = new mongoose.Schema({
  name: {
   type: String
  },
  _id: mongoose.Schema.Types.ObjectId,
  // chore name
  chores: [
    {
    title: {
      type: String,  
    }
  },
  {
    status: {
      type: String,
      default: "not started"
    }, 
  }
  ],
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: "Parent"},
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: "Member"},
});

let choredModel = mongoose.model("Chore", choreSchema);

module.exports = choredModel;
