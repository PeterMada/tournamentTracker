const pool = require('../db');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const jwtGenerator = require('../utils/jwtGenerator');
const validInfo = require('../middleware/validinfo');
const authorization = require('../middleware/authorization');

// register
router.post('/register', validInfo, async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const user = await pool.query(
      'SELECT * FROM users WHERE user_email = $1',
      [email]
    );

    if (user.rows.length !== 0) {
      return res.status(401).json('User already exist!');
    }

    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const bcryptPassword = await bcrypt.hash(password, salt);

    const newUser = await pool.query(
      'INSERT INTO users (user_first_name, user_last_name, user_email, user_active, user_password) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [firstName, lastName, email, false, bcryptPassword]
    );

    const currentRound = await pool.query(
      'SELECT * FROM rounds WHERE round_current = TRUE'
    );

    const playerScore = await pool.query(
      'INSERT INTO playerScore (score_player_id, score_total_score, score_for_game, score_for_rank, score_round_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [newUser.rows[0].user_id, 0, 0, 0, currentRound.rows[0].round_id]
    );

    const token = jwtGenerator(newUser.rows[0].user_id);

    res.json({ token });
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

router.post('/login', validInfo, async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await pool.query(
      'SELECT * FROM users WHERE user_email = $1',
      [email]
    );

    if (user.rows.length === 0) {
      return res.status(401).json('Password or Email is incorrect');
    }

    const validPassword = await bcrypt.compare(
      password,
      user.rows[0].user_password
    );

    if (!validPassword) {
      return res.status(401).json('Password or Email is incorrect');
    }

    const token = jwtGenerator(user.rows[0].user_id);
    res.json({ token });
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

router.get('/verify', authorization, (req, res) => {
  try {
    res.status(200).json(true);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
