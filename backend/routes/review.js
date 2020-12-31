const Review = require('../models/review');
const express = require("express");

const router = express.Router();
const checkAuth = require("../middleware/check-auth");

// Create review
router.post('', checkAuth, (req, res, next) => {
  const review = new Review({
    author: req.body.author,
    title: req.body.title,
    content: req.body.content,
    flag: false
  });
  review.save().then(result => {
    res.status(201).json({
      message: 'Review created successfully.',
      revId: result._id
    })
    .catch(error => {
      res.status(500).json({
        message: "Creating a review failed."
      })
    });
  });
});

module.exports = router;
