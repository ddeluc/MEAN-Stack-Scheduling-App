const mongoose = require('mongoose');

const scheduleSchema = mongoose.Schema({
  name: String ,
  courses: Number
});

module.exports = mongoose.model('Schedule', scheduleSchema);
