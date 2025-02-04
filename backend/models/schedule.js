const mongoose = require('mongoose');

const scheduleSchema = mongoose.Schema({
  author: { type: String, required: true },
  description: { type: String, required: false},
  name: { type: String, required: true },
  courses: { type: Array, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: { date: Date, seconds: Number } },
  visible: { type: Boolean }
});

module.exports = mongoose.model('Schedule', scheduleSchema);
