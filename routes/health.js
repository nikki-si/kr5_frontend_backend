const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    status: 'ok',
    server: process.env.SERVER_ID || 'unknown',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
