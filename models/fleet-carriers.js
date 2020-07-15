const mongoose = require("mongoose");

const fleetCarriers = new mongoose.Schema({
  carrierID: {
    type: Number,
    unique: true,
  },
  callSign: String,
  name: String,
  systemName: String,
  body: String,
  nextJump: Date,
});

module.exports = mongoose.model("FleetCarriers", fleetCarriers);
