const express = require('express');
const { getUniqueVisitors } = require('../controller/visitorController');

const router = express.Router();

// GET /api/views/unique-visitors?view=weekly or monthly
router.get('/unique-visitors', getUniqueVisitors);

module.exports = router;
