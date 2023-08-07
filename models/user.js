const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },

  address: {
    type: String,
    default: "",
  },
  zip: {
    type: String,
    default: "",
  },
  isAdmin: {
    type: Boolean,
    required: true,
  },
  created_at: { type: Date, required: true, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
