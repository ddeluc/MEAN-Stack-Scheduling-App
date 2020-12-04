const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Schedule = require('./models/schedule');

const app = express();

// Connnect to database
mongoose.connect("mongodb+srv://ddeluc:m7BVWwh2qOWQ2sJj@cluster0.dqio7.mongodb.net/node-angular?retryWrites=true&w=majority")
  .then(() => {
    console.log('Connected to database!');
  })
  .catch(() =>{
    console.log('Connection to server failed.');
  });

app.use(bodyParser.json());

// Allow CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, PUT, OPTIONS');
  next();
});

app.post('/api/schedules', (req, res, next) => {
  const schedule = new Schedule({
    name: req.body.name,
    courses: req.body.courses
  });
  schedule.save();
  res.status(201).json({
    message: 'Added Successfully'
  });
});

app.get('/api/schedules',(req, res, next) => {
  Schedule.find().then(documents => {
    res.status(200).json({
      message: 'Success!',
      schedules: documents
    });
  });

});

app.delete('/api/schedules/:name', (req, res, next) => {
  Schedule.deleteOne({name: req.params.name}).then(result => {
    console.log(result)
    res.status(200).json({message: 'Schedule deleted!'})
  });
});

module.exports = app;


// m7BVWwh2qOWQ2sJj
// 99.242.40.82
