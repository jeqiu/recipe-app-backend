const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const { pool } = require('../config');

// POST  users | createUser()
// PUT  /users/:id | updateUser()
// DELETE  /users/:id | deleteUser()

usersRouter.post('/', async (req, res) => {
  const { username, password } = req.body;

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const results = await pool.query('INSERT INTO users (username, password_hash) VALUES ($1, $2)', [username, passwordHash]);
  console.log(results);

  res.status(210).json({ status: 'success', message: 'User added.' });
});

usersRouter.get('/:username', async (req, res) => {
  const { username } = req.params;
  console.log(`username is: ${username}`);

  const results = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
  console.log(results.rows);

  if (results.rows[0]) {
    res.status(200).json(results.rows[0]);
  } else {
    res.status(404).json('no such username');
  }
});

// returns an array of user objects
usersRouter.get('/', async (req, res) => {
  const results = await pool.query('SELECT * FROM users ORDER BY user_id ASC');
  console.log(results.rows);

  res.status(200).json(results.rows);
});

module.exports = usersRouter;
