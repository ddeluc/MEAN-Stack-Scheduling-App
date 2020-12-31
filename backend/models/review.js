const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema({
  author: String,
  title: String,
  content: String,
  flag: Boolean,
  courseId: String
});

module.exports = mongoose.model('Review', reviewSchema);
