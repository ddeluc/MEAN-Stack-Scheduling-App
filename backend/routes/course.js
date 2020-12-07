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

router.get('/:subject/:catalog_nbr', (req, res, next) => {
  Course.findOne({subject: req.params.subject, catalog_nbr: req.params.catalog_nbr}).then(course => {
    console.log(course);
    res.status(200).json({
      message: "Success!",
      course: course
    })
  })
})

module.exports = router;
