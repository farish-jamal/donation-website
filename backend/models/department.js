const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    description: {
        type: String,
    },
});

const Department = mongoose.model("Department", departmentSchema);
module.exports = Department;