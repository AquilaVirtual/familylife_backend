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
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "Parent"},
  children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Child' }]
});

let choredModel = mongoose.model("Chore", choreSchema);

module.exports = choredModel;
