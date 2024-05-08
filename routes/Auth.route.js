const express = require('express');
const router = express.Router();

router.post('/register');

router.post('/login');

router.post('/refresh-token');

router.delete('/logout');

module.exports = router;