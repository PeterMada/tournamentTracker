const router = require('express').Router();
const pool = require('../db');
const authorization = require('../middleware/authorization');

router.get('/', authorization, async (req, res) => {
  const scoreboardId = req.headers['scoreboarid'];

  try {
    let currentRound = await pool.query(
      'SELECT * FROM rounds WHERE round_current = TRUE'
    );

    if (scoreboardId) {
      currentRound = await pool.query(
        'SELECT * FROM rounds WHERE round_id = $1',
        [scoreboardId]
      );
    }

    const user = await pool.query(
      'SELECT user_first_name, user_last_name, user_active, playerScore.*  FROM users LEFT JOIN playerScore ON users.user_id = playerScore.score_player_id WHERE playerScore.score_round_id = $1 ORDER BY playerScore.score_total_score DESC',
      [currentRound.rows[0].round_id]
    );

    res.json({ users: user.rows, currentRound: currentRound.rows[0] });
  } catch (err) {
    console.log(err.message);
    res.status(500).json('Server Error');
  }
});

module.exports = router;
