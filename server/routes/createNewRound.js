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
    let target;
    if (currentRound.rows.length === 0) {
      target = await pool.query(
        'INSERT INTO rounds (round_month, round_year, round_current) VALUES ($1, $2, $3) RETURNING *',
        [4, 2022, true]
      );
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

      target = await pool.query(
        'INSERT INTO rounds (round_month, round_year, round_current) VALUES ($1, $2, $3) RETURNING *',
        [month, year, true]
      );
    }

    // generate groups for this round
    const allUsers = await pool.query(
      'SELECT user_id, user_first_name, user_last_name, user_active, playerScore.*  FROM users LEFT JOIN playerScore ON users.user_id = playerScore.score_player_id ORDER BY playerScore.score_total_score'
    );

    let group_level = 0;
    const promises = allUsers.rows.map(async (user, i) => {
      if (i % 4 === 0) {
        group_level++;
      }

      let group = await pool.query(
        'INSERT INTO groups (group_round_id, group_number, group_user_id) VALUES ($1, $2, $3)',
        [target.rows[0].round_id, group_level, user.user_id]
      );
    });

    const result = await Promise.all(promises);

    // Reset all game scores
    let score = await pool.query(
      'UPDATE playerScore SET score_for_game = 0'
    );

    res.json(target.rows);
  } catch (err) {
    console.log(err.message);
    res.status(500).json('Server Error');
  }
});

module.exports = router;
