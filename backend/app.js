const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const schedulesRoutes = require("./routes/schedules");
const userRoutes = require("./routes/user");
const courseRoutes = require("./routes/course");

const app = express();

// Connnect to database
mongoose.connect("mongodb+srv://ddeluc:m7BVWwh2qOWQ2sJj@cluster0.dqio7.mongodb.net/node-angular")
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
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, PUT, OPTIONS');
  next();
});

// Any request that starts with the following will be directed to the respective route file
app.use("/api/schedules", schedulesRoutes);
app.use("/api/user", userRoutes);
app.use("/api/course", courseRoutes);

module.exports = app;


// m7BVWwh2qOWQ2sJj
// 99.242.40.82
