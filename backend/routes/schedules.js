const Schedule = require('../models/schedule');
const express = require("express");

const router = express.Router();

// Post a schedule
router.post('', (req, res, next) => {
  const schedule = new Schedule({
    name: req.body.name,
    courses: req.body.courses
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

// Update a schedule
router.put('/:id', (req, res, next) => {
  const sch = new Schedule({
    _id: req.body.id,
    name: req.body.name,
    courses: req.body.courses
  })
  Schedule.updateOne({_id: req.params.id}, sch).then(result => {
    res.status(200).json({message: "Updated Schedule."});
  })
});

// Get add schedules
router.get('',(req, res, next) => {
  Schedule.find().then(documents => {
    res.status(200).json({
      message: 'Success!',
      schedules: documents
    });
  });
});

// Get single schedule by id ***NOT WORKING***
router.get('/:id', (req, res, next) => {
  Schedule.findById(req.params.id).then(sch => {
    if (sch) {
      res.status(200).json(scheule);
    } else {
      res.status(404).jason({message: "Schedule not found."});
    };
  });
});

// Delete a schedule by id
router.delete('/:id', (req, res, next) => {
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

