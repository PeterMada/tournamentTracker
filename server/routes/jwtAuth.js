const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();
const jwtGenerator = require('../utils/jwtGenerator');
const validInfo = require('../middleware/validinfo');
const authorization = require('../middleware/authorization');
require('dotenv').config();

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
    const time = new Date().toISOString();

    const newUser = await pool.query(
      'INSERT INTO users (user_first_name, user_last_name, user_email, user_active, user_password, user_date_created) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [firstName, lastName, email, false, bcryptPassword, time]
    );

    const currentRound = await pool.query(
      'SELECT * FROM rounds WHERE round_current = TRUE'
    );

    let currentRoundId = 0;

    if (currentRound.rows.length === 0) {
      target = await pool.query(
        'INSERT INTO rounds (round_month, round_year, round_current) VALUES ($1, $2, $3) RETURNING *',
        [4, 2022, true]
      );
      currentRoundId = target.rows[0].round_id;
    } else {
      currentRoundId = currentRound.rows[0].round_id;
    }

    const playerScore = await pool.query(
      'INSERT INTO playerScore (score_player_id, score_total_score, score_for_game, score_for_rank, score_round_id, score_group_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [newUser.rows[0].user_id, 0, 0, 0, currentRoundId, 0]
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

router.post('/forgotpassword', validInfo, async (req, res) => {
  let transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const fromMe = `"Peter Mada 👻 - Tournament tracker" <${process.env.EMAIL_USERNAME}>`;

  try {
    const { email } = req.body;
    const user = await pool.query(
      'SELECT * FROM users WHERE user_email = $1',
      [email]
    );

    if (user.rows.length === 1) {
      const token = jwtGenerator(user.rows[0].user_id);

      const resetUrl = `${process.env.EMAIL_SITEURL}setnewpassword/${token}`;

      let info = await transporter.sendMail({
        from: fromMe,
        to: user.rows[0].user_email,
        subject: 'Pasword reset',
        text: `Reset your password: ${resetUrl}`,
        html: `Hi, <br />Reset your password: <a href="${resetUrl}">here</a>.`,
      });

      if (info.accepted.length === 1) {
        res.json({ alright: true });
      } else {
        res.status(500).send('Server Error');
      }
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

router.post('/setnewpassword', validInfo, async (req, res) => {
  try {
    const { password } = req.body;
    const tokenFromEmail = req.headers['token'];

    const payload = jwt.verify(tokenFromEmail, process.env.jwtSecret);

    const userFromPayload = payload.user;
    const user = await pool.query(
      'SELECT user_id, user_first_name, user_last_name, user_email FROM users WHERE user_id = $1',
      [userFromPayload]
    );

    if (user.rows.length !== 1) {
      return res.status(401).json('User does not exist!');
    }

    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const bcryptPassword = await bcrypt.hash(password, salt);
    const time = new Date().toISOString();

    const savedUsserPassword = await pool.query(
      'UPDATE users SET user_password = $1 WHERE user_id = $2',
      [bcryptPassword, userFromPayload]
    );

    const token = jwtGenerator(userFromPayload);
    res.json({ token });
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
