const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
  // assignment name
  name: {
    type: String,
    required: true
  },
  due: {
    type: Date,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Parent",
    required: true
  },
  children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Child' }]
});

let assignmentdModel = mongoose.model("Assignment", assignmentdSchema);

module.exports = assignmentdModel;
