const mongoose = require("mongoose");

const choreSchema = new mongoose.Schema({
  
  _id: mongoose.Schema.Types.ObjectId,     
    title: {
    type: String,  
    default: "Sweep house"    
  },
    status: {
    type: String,
    default: "not started"
    },     
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: "Parent"},
  createdFor: { type: mongoose.Schema.Types.ObjectId, ref: "Member"},
});

let choredModel = mongoose.model("Chore", choreSchema);

module.exports = choredModel;
