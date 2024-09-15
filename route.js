const express = require('express');
const path = require('path');
const router = express.Router();

// Serve the index.html file for the root route
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './index2.html'));
});
router.get('/add', (req, res) => {
    res.sendFile(path.join(__dirname, './index.html'));
});

module.exports = router;