const adminController = {};
const { validationResult } = require('express-validator');

 adminController.login = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { username, password } = req.body;
  if (username === 'renan' && password === 'silva') {
    res.send('Admin login successful');
  } else {
   res.status(401).send('Invalid username or password');
  }
};


/* 
adminController.login = (req, res) => {
  const password = req.body;
  const username = req.body;
  if (username === 'a' && password === 'as') {
    res.send('Admin login successful');
  } else {
    res.status(401).send('Invalid username or password --- TESTEE');
  }
};          */

module.exports = adminController;