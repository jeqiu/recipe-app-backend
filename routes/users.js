const usersRouter = require('express').Router();
const { pool } = require('../config');

// GET  /users | getUsers()
// GET  /users/:id | getUserById()
// POST  users | createUser()
// PUT  /users/:id | updateUser()
// DELETE  /users/:id | deleteUser()

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

module.exports = usersRouter;
