const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/demopms", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

var userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    index: {
      unique: true,
    },
  },
  email: {
    type: String,
    required: true,
    index: {
      unique: true,
    },
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("user", userSchema);
