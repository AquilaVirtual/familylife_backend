const mongoose = require("mongoose");

const choreSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  // chore name
  title: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: "not started"
  }, 
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: "Parent"},
  creatorFor: { type: mongoose.Schema.Types.ObjectId, ref: "Member"},
  family: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Member' }]
});

let choredModel = mongoose.model("Chore", choreSchema);

module.exports = choredModel;
