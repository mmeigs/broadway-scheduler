const express = require('express');

const eventController = require('../controllers/eventController.js');

const router = express.Router();

router.get('/', eventController.getEvents, (req, res) => {
  res.status(200).json(res.locals.events);
})

router.post('/', eventController.storeEvents, (req, res) => {
  res.status(200);
})

router.delete('/', eventController.deleteEvent, (req, res) => {
  res.status(200);
})

module.exports = router;