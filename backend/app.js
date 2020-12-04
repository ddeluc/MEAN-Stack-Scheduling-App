const express = require('express');

const app = express();

// Allow CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Header', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, PUT, OPTIONS');
  next();
});

app.use('/api/schedules',(req, res, next) => {
  const schedules = [
    {name: "Sch1", courses: 3},
    {name: "Sch2", courses: 6},
    {name: "Sch3", courses: 4},
  ]
  res.status(200).json({
    message: 'Success!',
    schedules: schedules
  });
});

module.exports = app;
