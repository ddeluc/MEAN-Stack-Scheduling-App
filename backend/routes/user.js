const express = require('express');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const User = require("../models/user");

const router = express.Router();

// Create a new user (not protected)
router.post("/signup", (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email:req.body.email,
        password: hash
      })
      user.save()
        .then(result => {
          res.status(201).json({
            message: "User created!",
            result: result
          });
        })
        .catch(err => {
          res.status(500).json({
            error: err
          });
        });
    });
});

// Login user (not protected)
router.post('/login', (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email }).then(user => {
      if (!user) {
        return res.status(401).json({
          message: "Auth failed."
        });
      }
      // Compare the user password to the one in the database that matches the email
      // Returns a Promise, result will be true or false
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      // Password does not match
      if (!result) {
        // Return is used to end execution
        return res.status(401).json({
          message: "Auth failed."
        });
      }
      // Creates new web token (payload, secret, options)
      // Will expire after 1 hour
      const token = jwt.sign({email: fetchedUser.email, userId: fetchedUser._id},
        'example_secret_for_development_purpose',
        {expiresIn: '1h'}
      );
      // Return token
      res.status(200).json({
        token: token,
        expiresIn: 3600
      });
    })
    // Errpr
    .catch(err => {
      return res.status(401).json({
        message: "Auth failed."
      })
    })
});

module.exports = router;
