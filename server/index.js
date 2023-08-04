require('dotenv').config();
require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });
const express = require('express');
var bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 8080;

const DBConnection = require('./db/db.connection');
// const taskRouter = require('./routes/router');

// Cloudinary

DBConnection();
app.use(express.json());

// app.use(taskRouter);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  next();
});

app.use((req, res, next) => {
  const error = new Error('Invalid Request');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

app.listen(PORT, () => {
  PORT, console.log(`Server is running http://localhost:${PORT}`);
});
