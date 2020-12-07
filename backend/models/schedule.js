const mongoose = require('mongoose');

const scheduleSchema = mongoose.Schema({
  name: { type: String },
  courses: { type: Number },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});

module.exports = mongoose.model('Schedule', scheduleSchema);
