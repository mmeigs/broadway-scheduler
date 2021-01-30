const express = require('express');
const app = express();
const path = require('path');

// Require in routers //
const eventRouter = require('./routes/event.js');
const personRouter = require('./routes/person.js');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// serve static files //
app.use('/build', express.static(path.resolve(__dirname, '../build')));

app.use('/add', personRouter);

app.use('/populate', eventRouter);

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../index.html'));
})


// Catch All Error Handler //
app.use((req, res, next) => {
  console.log('Catch-all!!!!!')
  res.status(404).send('Not found!');
})

// Global Middleware Error Handler //
app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 400,
    message: { err: 'Here you go, error this error that' },
  }
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
})

// connects //
// app.listen(3000);

module.exports = app;