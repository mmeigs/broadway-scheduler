const express = require('express');

const personController = require('../controllers/personController.js');

const router = express.Router();

router.post('/', personController.getNewEvents, (req, res) => {
  res.status(200).json({ newEvents: res.locals.newEvents });
})

router.put('/', personController.addPerson, (req, res) => {
  res.status(200);
})

module.exports = router;