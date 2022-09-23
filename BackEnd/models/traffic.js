const mongoose = require("mongoose");

const TrafficSchema = new mongoose.Schema(
    {
        data : {
            type: Number,
            default: 0
        }
    }
);

const Traffic = mongoose.model("Traffic", TrafficSchema);

module.exports = Traffic;
