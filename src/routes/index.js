const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const ensureAuthenticated = require('../middleware/ensureAuthenticated');

router.post('/login', ensureAuthenticated, adminController.login);

module.exports = router;
