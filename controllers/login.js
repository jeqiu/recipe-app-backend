const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const loginRouter = require('express').Router();
const { pool } = require('../config');

loginRouter.post('/', async (req, res) => {
  const { username, password } = req.body;

  const results = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
  const user = results.rows[0];

  const passwordCorrect = user === undefined
    ? false
    : await bcrypt.compare(password, user.password_hash);

  if (!(user && passwordCorrect)) {
    return res.status(401).json({ error: 'invalid username or password' });
  }

  const userForToken = {
    username: user.username,
    id: user.user_id,
  };

  const token = jwt.sign(userForToken, process.env.JWT_SECRET);

  res.status(200).send({ token, username: user.username, id: user.user_id });
});

module.exports = loginRouter;
