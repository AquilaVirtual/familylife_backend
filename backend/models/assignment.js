const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  //person's name
  name: {
    type: String,
    //required: true
  },
  // assignment title
  title: {
    type: String,
    //required: true
  },
  due: {
    type: Date,
    required: true,
    default: Date.now()
  },
  description: {
    type: String,
    //required: true
  },
  // email: {
  //   type: String,
  //   lowercase: true,
  //   required: true,
  // },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Parent",  
  },
  family: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Member' }]
});

let assignmentModel = mongoose.model("Assignment", assignmentSchema);

module.exports = assignmentModel;
