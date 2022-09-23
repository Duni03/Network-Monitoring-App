const mongoose = require("mongoose");

const DomainSchema = new mongoose.Schema(
  {
    Domain: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Domain = mongoose.model("Domain", DomainSchema);

module.exports = Domain;
