const Review = require('../models/review');
const express = require("express");

const router = express.Router();
const checkAuth = require("../middleware/check-auth");
const user = require('../models/user');

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

router.get('',(req, res, next) => {
  Review.find().then(documents => {
    res.status(200).json({
      message: 'Success!',
      reviews: documents
    });
  });
});

module.exports = router;
