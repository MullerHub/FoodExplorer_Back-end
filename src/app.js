require('express-async-errors')

const express = require('express');
const adminController = require('./controllers/adminController');
const AppError = require('./utils/AppError')

const app = express();


const routes = require('./routes')
const cors = require('cors')

const path = require('path')

app.use(cors());
app.use(express.json());
app.use(routes);

app.use((error, response, request, next) => {
  if(error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: 'error',
      message: error.message
    });
  }

  console.error(error);

  return response.status(500).json({
    status: 'error',
    message: "Internal server error"
  })
})



app.get('/', (req, res) => {
  res.send('Hello, world!');
});


app.get('/admin', (req, res) => {
  res.send('This is the admin page.');
});

app.post('/admin/login', adminController.login);


const PORT = process.env.PORT || 3000
app.listen(PORT, () => {})
