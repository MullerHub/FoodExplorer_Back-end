const adminController = {};

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
