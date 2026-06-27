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

  location: {
    type: String,
    required: true
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