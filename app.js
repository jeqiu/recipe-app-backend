require('dotenv').config();
const express = require('express');
const cors = require('cors');
const history = require('connect-history-api-fallback');

const app = express();
require('express-async-errors');

const usersRouter = require('./controllers/users');
const recipesRouter = require('./controllers/recipes');
const loginRouter = require('./controllers/login');
const middleware = require('./utils/middleware');

app.use(cors());
app.use(express.json()); // replace bodyparser; parse incoming requests with JSON payloads

app.use(middleware.requestLogger);

// Incoming GET requests which don't match baseUrl/api/ will get index.html
app.use(history({
  index: '/index.html',
  rewrites: [
    {
      from: /^\/api\/.*$/,
      to: (context) => context.parsedUrl.path,
    },
  ],
}));

app.use(express.static('build')); // root directory from which to serve static assets
app.use('/api/users', usersRouter);
app.use('/api/recipes', recipesRouter);
app.use('/api/login', loginRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
