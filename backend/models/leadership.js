const mongoose = require("mongoose");

const leadershipSchema = new mongoose.Schema({
  image: {
    type: String,
  },
});

const Leadership = mongoose.model("Leadership", leadershipSchema);
module.exports = Leadership;
