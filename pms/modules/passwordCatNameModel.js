const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/demopms", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

var passCatNameSchema = mongoose.Schema({
  category_name: {
    type: String,
    required: true,
    index: {
      unique: true,
    },
  },

  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("pass_category_name", passCatNameSchema);
