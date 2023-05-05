require('express-async-errors')

const express = require('express');
const migrationsRun = require('./database/sqlite/migrations');
const AppError = require('./utils/AppError')
const UsersController = require('./controllers/UsersController');
const path = require('path');

const routes = require('./routes');
const cors = require('cors');

migrationsRun();

const app = express();
app.use(express.json());
app.use(cors());
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

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {})
