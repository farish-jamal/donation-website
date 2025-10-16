const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    phoneNumber: {
        type: String,
    },
    message: {
        type: String,
    },
}, { timestamps: true });

const Member = mongoose.model("Member", memberSchema);
module.exports = Member;