const adminController = {};
const { validationResult } = require('express-validator');

adminController.login = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { username, password } = req.body;
  if (username === 'admin' && password === '123456') {
    res.send('Admin login successful');
  } else {
    res.status(401).send('Invalid username or password');
  }
};

adminController.validate = [
  body('username', 'Username is required').trim().notEmpty(),
  body('password', 'Password is required').notEmpty(),
];

adminController.login = (req, res) => {
  const password = req.body;
  const username = req.body;
  if (username == 'admin' && password == 'um') {
    res.send('Admin login successful');
  } else {
    res.status(401).send('Invalid username or password');
  }
};

module.exports = adminController;
