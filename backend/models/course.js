const mongoose = require('mongoose');

const courseSchema = mongoose.Schema({
  catalog_nbr: string,
  subject: string,
  className: string,
  course_info: Array
});

module.exports = mongoose.model('Schedule', courseSchema);
