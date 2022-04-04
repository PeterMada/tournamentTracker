const router = require('express').Router();
const pool = require('../db');
const authorization = require('../middleware/authorization');

router.get('/', authorization, async (req, res) => {
  const currentLogedUser = req.user;

  try {
    const currentRound = await pool.query(
      'SELECT * FROM rounds WHERE round_current = TRUE'
    );

    const activeAllUsers = await pool.query(
      'UPDATE users SET user_active = TRUE WHERE user_active = FALSE'
    );

    // No rounds
    if (currentRound.rows.length === 0) {
      const target = await pool.query(
        'INSERT INTO rounds (round_month, round_year, round_current) VALUES ($1, $2, $3) RETURNING *',
        [4, 2022, true]
      );

      res.json(target.rows);
    } else {
      const roundUpdate = await pool.query(
        'UPDATE rounds SET round_current = FALSE WHERE round_current = TRUE'
      );

      let month = 1;
      let year = currentRound.rows[0].round_year;

      if (currentRound.rows[0].round_month >= 12) {
        year = year + 1;
      } else {
        month = currentRound.rows[0].round_month + 1;
      }

      const target = await pool.query(
        'INSERT INTO rounds (round_month, round_year, round_current) VALUES ($1, $2, $3) RETURNING *',
        [month, year, true]
      );

      res.json(target.rows);
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).json('Server Error');
  }
});

module.exports = router;
