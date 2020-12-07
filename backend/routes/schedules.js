const Schedule = require('../models/schedule');
const express = require("express");

const router = express.Router();
const checkAuth = require("../middleware/check-auth");

// Post a schedule (protected)
router.post('', checkAuth, (req, res, next) => {
  const schedule = new Schedule({
    name: req.body.name,
    courses: req.body.courses,
    creator: req.userData.userId
  });
  schedule.save().then(result => {
    console.log(result._id);
    console.log(result);
    res.status(201).json({
      message: 'Added Successfully',
      schId: result._id
    });
  });
});

// Update a schedule (protected)
router.put('/:id', checkAuth, (req, res, next) => {
  const sch = new Schedule({
    _id: req.body.id,
    name: req.body.name,
    courses: req.body.courses
  })
  Schedule.updateOne({_id: req.params.id}, sch).then(result => {
    res.status(200).json({message: "Updated Schedule."});
  })
});

// Get add schedules (not protected)
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
  Schedule.deleteOne({_id: req.params.id}).then(result => {
    console.log(result)
    res.status(200).json({message: 'Schedule deleted!'})
  })
  .catch(err => {
    console.log("Failed to delete schedule.")
    console.log(err);
  })
});

module.exports = router;

