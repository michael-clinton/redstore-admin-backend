const express = require('express');
const router = express.Router();
const { getAnalytics } = require('../controller/analyticsController'); // adjust path

router.get('/', getAnalytics);

module.exports = router;
