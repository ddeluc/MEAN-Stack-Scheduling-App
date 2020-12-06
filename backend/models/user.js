const mongoose = require("mongoose")
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  name: {type: String, required: true},
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  activated: {type: boolean, required: true }
});

// Validate emails so that they are unique
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
