const mongoose = require("mongoose");

const choreSchema = new mongoose.Schema({
  // chore name
  name: {
    type: String,
    required: true
  },

  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Parent",
    required: true
  }
});

let choredModel = mongoose.model("Chore", choredSchema);

module.exports = choredModel;
