const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema({
  issueType: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true
  },

  severity: {
    type: String,
    default: "Medium"
  },

  // Human-readable address
  location: {
    type: String,
    required: true
  },

  // NEW: Latitude
  lat: {
    type: Number,
    default: null
  },

  // NEW: Longitude
  lng: {
    type: Number,
    default: null
  },

  // NEW: Complete Address
  address: {
    type: String,
    default: ""
  },

  imageUrl: {
    type: String,
    default: ""
  },

  status: {
    type: String,
    default: "Pending"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Issue", issueSchema);