const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/demopms", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

var passDetailSchema = mongoose.Schema({
  category_name: {
    type: String,
    required: true,
    index: {
      unique: true,
    },
  },
  project_name: {
    type: String,
    required: true,
  },
  password_details: {
    type: String,
    required: true,
  },

  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("pass_detail", passDetailSchema);
