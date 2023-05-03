const adminController = require('./controllers/adminController');
const express = require('express');
const app = express();

const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.get('/admin', (req, res) => {
  res.send('This is the admin page.');
});

// Configuração de rotas
app.get('/admin/login', (req, res) => {
  res.render('adminLogin');
});

app.post('/admin/login', adminController.login);

app.listen(port, () => {
  console.log('Server started on port', port);
});
