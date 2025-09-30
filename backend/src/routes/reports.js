const express = require('express');
const router = express.Router();
const Report = require('../models/Report');

router.post('/', async (req, res, next) => {
  console.log('Received report:', req.body); // <- Add this
  const report = new Report(req.body);
  await report.save();
  res.status(201).json(report);
});

module.exports = router;
