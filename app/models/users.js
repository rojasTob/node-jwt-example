var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userModel = new Schema({
  name: String,
  password: String,
  admin: Boolean
});

module.exports = mongoose.model("User", userModel);
