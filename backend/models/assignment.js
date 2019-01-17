const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  //person's name
  user: {
    type: String,
    required: true
  },
  // assignment title
  title: {
    type: String,
    required: true
  },
  due: {
    type: Date,
    required: true,
    default: Date.now()
  },
  description: {
    type: String,
    required: true
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Parent",  
  },
  children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Child' }]
});

let assignmentModel = mongoose.model("Assignment", assignmentSchema);

module.exports = assignmentModel;
