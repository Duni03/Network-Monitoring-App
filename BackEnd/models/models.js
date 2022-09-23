const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  FirstName: {
    type: String,
    required: true,
    trim: true
  },
  SecondName: {
    type: String,
    required: true,
    trim: true
  },
  Email: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;