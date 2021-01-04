const Schedule = require('../models/schedule');
const express = require("express");

const router = express.Router();
const checkAuth = require("../middleware/check-auth");

// Post a schedule (protected)
router.post('', checkAuth, (req, res, next) => {
  const schedule = new Schedule({
    name: req.body.name,
    author: req.body.author,
    description: req.body.description,
    courses: req.body.courses,
    creator: req.userData.userId,
    date: req.body.date,
    visible: req.body.visible
  });
  schedule.save().then(result => {
    console.log(result._id);
    console.log(result);
    res.status(201).json({
      message: 'Added Successfully',
      schId: result._id
    })
    .catch(error => {
      res.status(500).json({
        message: "Creating a schedule failed."
      })
    })
  });
});

// Update a schedule (protected)
router.put('/:id', checkAuth, (req, res, next) => {
  const sch = new Schedule({
    _id: req.body.id,
    name: req.body.name,
    courses: req.body.courses,
    date: req.body.date,
    visible: req.body.visible
  })
  Schedule.updateOne({ _id: req.params.id, creator: req.userData.userId }, sch).then(result => {
    if (result.nModified > 0) {
      res.status(200).json({ message: "Update Successful!"});
    } else {
      res.status(401).json({message: "Not authorized!"});
    }
  })
  .catch(error => {
    res.status(500).json({
      message: "Could not update schedule."
    })
  })
});

// Get all schedules (not protected)
router.get('',(req, res, next) => {
  Schedule.find().then(documents => {
    res.status(200).json({
      message: 'Success!',
      schedules: documents
    });
  });
});

// Get single schedule by id ***NOT WORKING*** (not protected)
router.get('/:id', (req, res, next) => {
  Schedule.findById(req.params.id).then(sch => {
    if (sch) {
      res.status(200).json(sch);
    } else {
      res.status(404).jason({message: "Schedule not found."});
    };
  });
});

// Delete a schedule by id (protected)
router.delete('/:id', checkAuth, (req, res, next) => {
  console.log(req.params.id);
  Schedule.deleteOne({_id: req.params.id, creator: req.userData.userId}).then(result => {
    console.log(result)
    if (result.n > 0) {
      res.status(200).json({message: 'Schedule deleted!'});
    } else {
      res.status(401).json({message: "Not authorized!"});
    }

  })
  .catch(err => {
    console.log("Failed to delete schedule.")
    console.log(err);
  })
});

module.exports = router;

