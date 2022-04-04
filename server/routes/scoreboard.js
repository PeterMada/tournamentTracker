const router = require('express').Router();
const pool = require('../db');
const authorization = require('../middleware/authorization');

router.get('/', authorization, async (req, res) => {
  try {
    const user = await pool.query(
      'SELECT user_first_name, user_last_name, user_active, playerScore.*  FROM users LEFT JOIN playerScore ON users.user_id = playerScore.score_player_id ORDER BY playerScore.score_total_score'
    );

    res.json(user.rows);
  } catch (err) {
    console.log(err.message);
    res.status(500).json('Server Error');
  }
});

module.exports = router;
