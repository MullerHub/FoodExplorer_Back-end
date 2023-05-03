const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { validate } = require('../controllers/adminController');

router.post('/login', validate, adminController.login);

module.exports = router;
