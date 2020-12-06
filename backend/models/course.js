const mongoose = require('mongoose');

const courseSchema = mongoose.Schema({
  catalog_nbr: String,
  subject: String,
  className: String,
  course_info: Array
});

module.exports = mongoose.model('Course', courseSchema);
