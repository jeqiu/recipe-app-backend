const usersRouter = require('express').Router();

// GET  /users | getUsers()
// GET  /users/:id | getUserById()
// POST  users | createUser()
// PUT  /users/:id | updateUser()
// DELETE  /users/:id | deleteUser()

usersRouter.get('/:id', async (req, res) => {
  const { id } = req.params;
  const { rows } = await db.query('SELECT * FROM users WHERE id = $1', [id]);
  res.send(rows[0]);
});

module.exports = usersRouter;
