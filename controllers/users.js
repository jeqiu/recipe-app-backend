const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const { pool } = require('../config');

// updateUser(): PUT  /users/:username

// adds a new user to the database
usersRouter.post('/', async (req, res) => {
  const { username, password } = req.body;

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const results = await pool.query('INSERT INTO users (username, password_hash) VALUES ($1, $2)', [username, passwordHash]);
  console.log(results);

  res.status(201).json({ status: 'success', message: `User ${username} added.` });
});

usersRouter.delete('/:username', async (req, res) => {
  const { username } = req.params;
  console.log(`deleting username: ${username}`);

  const results = await pool.query('DELETE FROM users WHERE username = $1', [username]);
  console.log(results);

  res.status(200).json({ status: 'success', message: `Deleted user: ${username}.` });
});

// return a user object by username
usersRouter.get('/:username', async (req, res) => {
  const { username } = req.params;
  console.log(`username is: ${username}`);

  const results = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
  console.log(results.rows);

  if (results.rows[0]) {
    res.status(200).json(results.rows[0]);
  } else {
    res.status(404).json({ message: 'no such username' });
  }
});

// GET all users; returns an array of user objects
usersRouter.get('/', async (req, res) => {
  const results = await pool.query('SELECT * FROM users ORDER BY user_id ASC');
  console.log(results.rows);

  res.status(200).json(results.rows);
});

module.exports = usersRouter;
