const mongoose = require("mongoose");


const dataschema = mongoose.Schema({
  packetssent: Number,
  packetrecived: Number,
});

const MachineSchema = new mongoose.Schema({
  Machineip: {
    type: String,
    required: true,
    trim: true
  },
  Machinemac: {
    type: String,
    required: true,
    trim: true
  },
  MachineName: {
    type: String,
    required: true,
    trim: true
  },
  MachineEmail: {
    type: String,
    required: true,
    trim: true
  },
  Status: {
    type: String,
    trim: true,
    default: "offline"
  },
  domain: {
    type: Array,
    default: []
  },
  red:{
    type: Boolean,
    default: false
  },
  daily:{
    type: dataschema,
    default: {
      packetssent: 0,
      packetrecived: 0
    }
  },
  weekly:{
    type: dataschema,
    default: {
      packetssent: 0,
      packetrecived: 0
    }
  },
  monthly:{
    type: dataschema,
    default: {
      packetssent: 0,
      packetrecived: 0
    }
  }
});

const Machine = mongoose.model("Machine", MachineSchema);

module.exports = Machine;