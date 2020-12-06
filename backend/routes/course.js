const Course = require('../models/course');
const express = require("express");

const router = express.Router();

router.get('', (req, res, next) => {
  Course.find().then(courses => {
    res.status(200).json({
      message: "Success!",
      courses: courses
    })
  });
})

module.exports = router;
