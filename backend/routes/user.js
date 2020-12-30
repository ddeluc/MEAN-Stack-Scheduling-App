const express = require('express');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const User = require("../models/user");

const router = express.Router();

// Create a new user (not protected)
router.post("/signup", (req, res, next) => {
  console.log("Still trying to create user ...");
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hash,
        activated: true,
        admin: req.body.admin
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
            message: "Invalid authentication credentials!"
          });
        });
    });
});

// Update a schedule
router.put('/:id', (req, res, next) => {
  const user = new User({
    _id: req.params.id,
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    activated: req.body.activated,
    admin: req.body.admin
  })
  User.updateOne({ _id: req.params.id}, user).then(result => {
    res.status(200).json({ message: "Update Successful!"});
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({
      message: "Could not update user."
    })
  })
});

router.get('',(req, res, next) => {
  User.find().then(documents => {
    res.status(200).json({
      message: 'Success!',
      users: documents
    });
  });
});

// Login user (not protected)
router.post('/login', (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email }).then(user => {
      if (!user) {
        return res.status(401).json({
          message: "Authentication failed!"
        });
      }
      // Compare the user password to the one in the database that matches the email
      // Returns a Promise, result will be true or false
      fetchedUser = user;
      console.log(fetchedUser.activated);
      if (!fetchedUser.activated) {
        return res.status(401).json({
          message: "This account has been dactivated. Please contact the administrator."
        });
      }
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      // Password does not match
      if (!result) {
        // Return is used to end execution
        return res.status(401).json({
          message: "Authentication failed!"
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
        expiresIn: 3600,
        name: fetchedUser.name,
        activated: fetchedUser.activated ? 'Activated' : 'Deactivated',
        admin: fetchedUser.admin
      });
    })
    // Error
    .catch(err => {
      return res.status(401).json({
        message: "Invalid authentication credentials!"
      })
    })
});

module.exports = router;
