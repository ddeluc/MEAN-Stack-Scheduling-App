const Course = require('../models/course');
const express = require("express");

const router = express.Router();

router.get('', (req, res, next) => {
  Course.find().then(courses => {
    console.log(courses);
  });
})

module.exports = router;
