const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  amount: {
    type: Number,
  },
  message: {
    type: String,
  },
  UTRNumber: {
    type: String,
  },
}, { timestamps: true });

const Donation = mongoose.model("Donation", donationSchema);
module.exports = Donation;
