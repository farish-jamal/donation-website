const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    dateAndTime: {
        type: Date,
    },
    location: {
        type: String,
    },
    image: {
        type: String,
    },
});

const Event = mongoose.model("Event", eventSchema);
module.exports = Event;