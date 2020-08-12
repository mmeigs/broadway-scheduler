const express = require('express');

const eventController = require('../controllers/eventController.js');

const router = express.Router();

router.get('/', eventController.getEvents, (req, res) => {
  res.status(200).json(res.locals.events);
})

module.exports = router;